// server/index.js
import express from "express";
import cors from "cors";
import crypto from "crypto";
import pool from "./db.js";

const app = express();

// ---------- Config ----------
const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || "";
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // admin login lasts 12 hours

// Cloudinary: lets the admin panel upload gallery photos. Optional; without it admins can paste image links.
const CLOUDINARY = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  apiKey: process.env.CLOUDINARY_API_KEY || "",
  apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  folder: "bos-website",
};
const cloudinaryReady = Boolean(CLOUDINARY.cloudName && CLOUDINARY.apiKey && CLOUDINARY.apiSecret);

// Website sections the admin can edit. Each is stored as one JSON value in site_content.
const CONTENT_KEYS = ["toppers", "events", "fees", "transport", "testimonials", "staff", "stats", "videos"];
const ENQUIRY_STATUSES = ["new", "contacted", "admitted", "closed"];

// Photos the gallery started with, copied into the database the first time it is created.
const DEFAULT_GALLERY = [
  ["https://res.cloudinary.com/djfhmzjuz/image/upload/v1757605559/BOS17_rjngmh.jpg", "School building", "campus"],
  ["https://res.cloudinary.com/djfhmzjuz/image/upload/v1757604935/BOS9_dosdt0.jpg", "Classroom session", "academics"],
  ["https://res.cloudinary.com/djfhmzjuz/image/upload/v1757604936/BOS10_fqknaj.jpg", "Sports day", "events"],
  ["https://res.cloudinary.com/djfhmzjuz/image/upload/v1757604935/BOS5_plhby7.jpg", "Science lab", "facilities"],
  ["https://res.cloudinary.com/djfhmzjuz/image/upload/v1757604937/BOS16_i4dhvh.jpg", "Annual function", "events"],
  ["https://res.cloudinary.com/djfhmzjuz/image/upload/v1757606202/BOS18_eprioe_flgobs.jpg", "Library", "facilities"],
];

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    // If CORS_ORIGIN is not set, allow all (handy for local dev). Set it in production.
    origin: allowedOrigins.length ? allowedOrigins : true,
  }),
);
// Admin content saves (fee tables, staff lists) can be larger than a contact form.
app.use(express.json({ limit: "200kb" }));

// ---------- Helpers ----------
const clean = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isPhone = (value) => /^[0-9+\-\s]{10,15}$/.test(value);

// Simple in-memory rate limiter: max `limit` requests per `windowMs` per IP per bucket.
const hits = new Map();
const rateLimit = (bucket, limit, windowMs) => (req, res, next) => {
  const key = `${bucket}:${req.ip}`;
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    return res.status(429).json({ success: false, message: "Too many requests. Please try again in a few minutes." });
  }
  recent.push(now);
  hits.set(key, recent);
  next();
};

const isImageUrl = (value) => /^https:\/\/\S+$/.test(value);

// Cloudinary signs requests with SHA-1 over the sorted params followed by the API secret.
const cloudinarySign = (params) =>
  crypto
    .createHash("sha1")
    .update(
      Object.keys(params)
        .sort()
        .map((k) => `${k}=${params[k]}`)
        .join("&") + CLOUDINARY.apiSecret,
    )
    .digest("hex");

const deleteFromCloudinary = async (publicId) => {
  if (!cloudinaryReady || !publicId) return;
  const timestamp = Math.floor(Date.now() / 1000);
  const body = new URLSearchParams({
    public_id: publicId,
    timestamp: String(timestamp),
    api_key: CLOUDINARY.apiKey,
    signature: cloudinarySign({ public_id: publicId, timestamp }),
  });
  try {
    await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/image/destroy`, { method: "POST", body });
  } catch (err) {
    console.error("Could not delete image from Cloudinary:", err.message);
  }
};

const sign = (payload) => crypto.createHmac("sha256", ADMIN_TOKEN_SECRET).update(payload).digest("hex");

const makeToken = () => {
  const expires = String(Date.now() + TOKEN_TTL_MS);
  return `${expires}.${sign(expires)}`;
};

const safeEqual = (a, b) => {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
};

const requireAdmin = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const [expires, signature] = token.split(".");
  if (!expires || !signature || !safeEqual(signature, sign(expires)) || Number(expires) < Date.now()) {
    return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
  }
  next();
};

// ---------- Database setup ----------
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS phone TEXT;

    CREATE TABLE IF NOT EXISTS admission_enquiries (
      id SERIAL PRIMARY KEY,
      student_name TEXT NOT NULL,
      class_applying TEXT NOT NULL,
      parent_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      previous_school TEXT,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS notices (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT,
      link TEXT,
      is_important BOOLEAN NOT NULL DEFAULT FALSE,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE admission_enquiries ADD COLUMN IF NOT EXISTS admin_note TEXT;

    CREATE TABLE IF NOT EXISTS gallery_photos (
      id SERIAL PRIMARY KEY,
      url TEXT NOT NULL,
      public_id TEXT,
      caption TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'campus',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Copy the original gallery photos in once, so admins can manage (and delete) them too.
  const seeded = await pool.query(`SELECT 1 FROM site_content WHERE key = 'gallery_seeded'`);
  if (!seeded.rowCount) {
    const { rows } = await pool.query(`SELECT COUNT(*)::int AS n FROM gallery_photos`);
    if (rows[0].n === 0) {
      for (const [url, caption, category] of [...DEFAULT_GALLERY].reverse()) {
        await pool.query(`INSERT INTO gallery_photos (url, caption, category) VALUES ($1, $2, $3)`, [url, caption, category]);
      }
    }
    await pool.query(`INSERT INTO site_content (key, value) VALUES ('gallery_seeded', 'true')`);
  }
}

// ---------- Public routes ----------
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, db: "up" });
  } catch {
    res.status(503).json({ ok: false, db: "down" });
  }
});

app.post("/api/contact", rateLimit("contact", 5, 10 * 60 * 1000), async (req, res) => {
  const name = clean(req.body.name, 120);
  const email = clean(req.body.email, 160);
  const phone = clean(req.body.phone, 20);
  const subject = clean(req.body.subject, 60);
  const message = clean(req.body.message, 3000);

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "Please fill in your name, email, subject and message." });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ success: false, message: "Please enter a valid email address." });
  }
  if (phone && !isPhone(phone)) {
    return res.status(400).json({ success: false, message: "Please enter a valid phone number." });
  }

  try {
    await pool.query(
      `INSERT INTO contact_messages (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5)`,
      [name, email, phone || null, subject, message],
    );
    res.json({ success: true, message: "Message sent. We will get back to you within one working day." });
  } catch (err) {
    console.error("Error saving contact message:", err);
    res.status(500).json({ success: false, message: "Your message could not be saved. Please call or WhatsApp us instead." });
  }
});

app.post("/api/enquiry", rateLimit("enquiry", 5, 10 * 60 * 1000), async (req, res) => {
  const studentName = clean(req.body.studentName, 120);
  const classApplying = clean(req.body.classApplying, 40);
  const parentName = clean(req.body.parentName, 120);
  const phone = clean(req.body.phone, 20);
  const email = clean(req.body.email, 160);
  const previousSchool = clean(req.body.previousSchool, 200);
  const message = clean(req.body.message, 2000);

  if (!studentName || !classApplying || !parentName || !phone) {
    return res.status(400).json({ success: false, message: "Please fill in student name, class, parent name and phone number." });
  }
  if (!isPhone(phone)) {
    return res.status(400).json({ success: false, message: "Please enter a valid 10-digit phone number." });
  }
  if (email && !isEmail(email)) {
    return res.status(400).json({ success: false, message: "Please enter a valid email address." });
  }

  try {
    await pool.query(
      `INSERT INTO admission_enquiries (student_name, class_applying, parent_name, phone, email, previous_school, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [studentName, classApplying, parentName, phone, email || null, previousSchool || null, message || null],
    );
    res.json({ success: true, message: "Enquiry received. Our admissions office will call you soon." });
  } catch (err) {
    console.error("Error saving enquiry:", err);
    res.status(500).json({ success: false, message: "Your enquiry could not be saved. Please call or WhatsApp us instead." });
  }
});

app.get("/api/notices", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, title, body, link, is_important, created_at FROM notices
       WHERE is_active = TRUE ORDER BY is_important DESC, created_at DESC LIMIT 20`,
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Error loading notices:", err);
    res.status(500).json({ success: false, data: [] });
  }
});

app.get("/api/gallery", async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT id, url, caption, category FROM gallery_photos ORDER BY created_at DESC, id DESC`);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Error loading gallery:", err);
    res.status(500).json({ success: false, data: [] });
  }
});

// All admin-edited website sections as { key: value }. Missing keys mean "use the built-in default".
app.get("/api/content", async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT key, value FROM site_content WHERE key = ANY($1)`, [CONTENT_KEYS]);
    res.json({ success: true, data: Object.fromEntries(rows.map((r) => [r.key, r.value])) });
  } catch (err) {
    console.error("Error loading content:", err);
    res.status(500).json({ success: false, data: {} });
  }
});

// ---------- Admin routes ----------
app.post("/api/admin/login", rateLimit("login", 10, 15 * 60 * 1000), (req, res) => {
  if (!ADMIN_PASSWORD || !ADMIN_TOKEN_SECRET) {
    return res.status(503).json({ success: false, message: "Admin login is not configured on the server." });
  }
  const password = typeof req.body.password === "string" ? req.body.password : "";
  if (!safeEqual(sign(password), sign(ADMIN_PASSWORD))) {
    return res.status(401).json({ success: false, message: "Wrong password." });
  }
  res.json({ success: true, token: makeToken() });
});

app.get("/api/admin/messages", requireAdmin, async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 500`);
  res.json({ success: true, data: rows });
});

app.delete("/api/admin/messages/:id", requireAdmin, async (req, res) => {
  await pool.query(`DELETE FROM contact_messages WHERE id = $1`, [Number(req.params.id)]);
  res.json({ success: true });
});

app.get("/api/admin/enquiries", requireAdmin, async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM admission_enquiries ORDER BY created_at DESC LIMIT 500`);
  res.json({ success: true, data: rows });
});

app.patch("/api/admin/enquiries/:id", requireAdmin, async (req, res) => {
  const status = req.body.status === undefined ? null : clean(req.body.status, 20);
  if (status !== null && !ENQUIRY_STATUSES.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status." });
  }
  const note = typeof req.body.note === "string" ? clean(req.body.note, 1000) : null;
  await pool.query(
    `UPDATE admission_enquiries SET status = COALESCE($1, status), admin_note = COALESCE($2, admin_note) WHERE id = $3`,
    [status, note, Number(req.params.id)],
  );
  res.json({ success: true });
});

app.delete("/api/admin/enquiries/:id", requireAdmin, async (req, res) => {
  await pool.query(`DELETE FROM admission_enquiries WHERE id = $1`, [Number(req.params.id)]);
  res.json({ success: true });
});

// ---------- Admin: gallery ----------
// Gives the browser a short-lived signature so it can upload straight to Cloudinary
// without the API secret ever leaving the server.
app.get("/api/admin/upload-signature", requireAdmin, (req, res) => {
  if (!cloudinaryReady) {
    return res.json({ success: true, data: { enabled: false } });
  }
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { folder: CLOUDINARY.folder, timestamp };
  res.json({
    success: true,
    data: {
      enabled: true,
      cloudName: CLOUDINARY.cloudName,
      apiKey: CLOUDINARY.apiKey,
      folder: CLOUDINARY.folder,
      timestamp,
      signature: cloudinarySign(params),
    },
  });
});

app.get("/api/admin/gallery", requireAdmin, async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM gallery_photos ORDER BY created_at DESC, id DESC`);
  res.json({ success: true, data: rows });
});

app.post("/api/admin/gallery", requireAdmin, async (req, res) => {
  const url = clean(req.body.url, 500);
  const publicId = clean(req.body.publicId, 300);
  const caption = clean(req.body.caption, 200);
  const category = clean(req.body.category, 40).toLowerCase() || "campus";
  if (!isImageUrl(url)) return res.status(400).json({ success: false, message: "Photo link must start with https://" });
  const { rows } = await pool.query(
    `INSERT INTO gallery_photos (url, public_id, caption, category) VALUES ($1, $2, $3, $4) RETURNING *`,
    [url, publicId || null, caption, category],
  );
  res.json({ success: true, data: rows[0] });
});

app.patch("/api/admin/gallery/:id", requireAdmin, async (req, res) => {
  const caption = typeof req.body.caption === "string" ? clean(req.body.caption, 200) : null;
  const category = typeof req.body.category === "string" ? clean(req.body.category, 40).toLowerCase() || null : null;
  await pool.query(
    `UPDATE gallery_photos SET caption = COALESCE($1, caption), category = COALESCE($2, category) WHERE id = $3`,
    [caption, category, Number(req.params.id)],
  );
  res.json({ success: true });
});

app.delete("/api/admin/gallery/:id", requireAdmin, async (req, res) => {
  const { rows } = await pool.query(`DELETE FROM gallery_photos WHERE id = $1 RETURNING public_id`, [Number(req.params.id)]);
  // Only photos uploaded through the admin panel have a public_id; those are removed from Cloudinary too.
  if (rows[0]?.public_id) await deleteFromCloudinary(rows[0].public_id);
  res.json({ success: true });
});

// ---------- Admin: website content ----------
app.put("/api/admin/content/:key", requireAdmin, async (req, res) => {
  const { key } = req.params;
  if (!CONTENT_KEYS.includes(key)) return res.status(400).json({ success: false, message: "Unknown section." });
  const { value } = req.body;
  if (value === null || typeof value !== "object") {
    return res.status(400).json({ success: false, message: "Nothing to save." });
  }
  await pool.query(
    `INSERT INTO site_content (key, value, updated_at) VALUES ($1, $2, NOW())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    [key, JSON.stringify(value)],
  );
  res.json({ success: true, message: "Saved. The website now shows the new content." });
});

// Removing a section's saved value makes the website fall back to the built-in content again.
app.delete("/api/admin/content/:key", requireAdmin, async (req, res) => {
  if (!CONTENT_KEYS.includes(req.params.key)) return res.status(400).json({ success: false, message: "Unknown section." });
  await pool.query(`DELETE FROM site_content WHERE key = $1`, [req.params.key]);
  res.json({ success: true });
});

app.get("/api/admin/notices", requireAdmin, async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM notices ORDER BY created_at DESC`);
  res.json({ success: true, data: rows });
});

app.post("/api/admin/notices", requireAdmin, async (req, res) => {
  const title = clean(req.body.title, 200);
  const body = clean(req.body.body, 2000);
  const link = clean(req.body.link, 500);
  if (!title) return res.status(400).json({ success: false, message: "Notice title is required." });
  if (link && !/^(https?:\/\/|\/)/.test(link)) {
    return res.status(400).json({ success: false, message: "Link must start with https:// or /" });
  }
  const { rows } = await pool.query(
    `INSERT INTO notices (title, body, link, is_important) VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, body || null, link || null, Boolean(req.body.isImportant)],
  );
  res.json({ success: true, data: rows[0] });
});

app.patch("/api/admin/notices/:id", requireAdmin, async (req, res) => {
  const { isActive, isImportant } = req.body;
  const text = (key, max) => (typeof req.body[key] === "string" ? clean(req.body[key], max) : null);
  const title = text("title", 200);
  const body = text("body", 2000);
  const link = text("link", 500);
  if (title === "") return res.status(400).json({ success: false, message: "Notice title is required." });
  if (link && !/^(https?:\/\/|\/)/.test(link)) {
    return res.status(400).json({ success: false, message: "Link must start with https:// or /" });
  }
  // Empty strings clear body/link; null (not sent) leaves the column unchanged.
  await pool.query(
    `UPDATE notices SET
       is_active = COALESCE($1, is_active),
       is_important = COALESCE($2, is_important),
       title = COALESCE($3, title),
       body = CASE WHEN $4::text IS NULL THEN body ELSE NULLIF($4, '') END,
       link = CASE WHEN $5::text IS NULL THEN link ELSE NULLIF($5, '') END
     WHERE id = $6`,
    [
      typeof isActive === "boolean" ? isActive : null,
      typeof isImportant === "boolean" ? isImportant : null,
      title,
      body,
      link,
      Number(req.params.id),
    ],
  );
  res.json({ success: true });
});

app.delete("/api/admin/notices/:id", requireAdmin, async (req, res) => {
  await pool.query(`DELETE FROM notices WHERE id = $1`, [Number(req.params.id)]);
  res.json({ success: true });
});

// Catch errors from async admin handlers (Express 5 forwards rejected promises here)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Something went wrong on the server." });
});

// ---------- Start ----------
initDb()
  .then(() => {
    console.log("Database ready (contact_messages, admission_enquiries, notices, gallery_photos, site_content).");
    if (!cloudinaryReady) console.log("Cloudinary keys not set: admins can add gallery photos by link only.");
    app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("CRITICAL: Could not connect to the database or create tables.", err.message);
    process.exit(1);
  });
