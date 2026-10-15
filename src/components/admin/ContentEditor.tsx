import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/upload";
import { DEFAULT_LOGO, useSavedContent, useSchool, type SchoolDetails, type SiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_TEXTS, EDITABLE_TEXTS } from "@/lib/i18n";
import { cld } from "@/lib/cloudinary";
import {
  admissionDocuments,
  admissionSteps,
  ageCriteria,
  classOptions,
  events,
  fees,
  sessionCalendar,
  stages,
  staff,
  stats,
  streams,
  testimonials,
  toppers,
  transportRoutes,
  youtubeVideoIds,
  type Sampleable,
} from "@/data/site";

const SAMPLE = "__sample";

type FieldType = "text" | "textarea" | "list" | "image";
type Field = { key: string; label: string; type?: FieldType; placeholder?: string; required?: boolean };
type ListSection = {
  key: Exclude<keyof SiteContent, "stats" | "branding" | "school" | "texts">;
  group: string;
  title: string;
  hint: string;
  item: string;
  fields: Field[];
  defaults: Record<string, unknown>[];
};

// Built-in content used to pre-fill a section that was never saved, so admins can edit or delete what the site shows.
// Placeholder rows keep a marker so the editor can label them as examples.
const builtIn = <T extends Sampleable>(rows: T[]) => rows.map(({ isSample, ...rest }) => (isSample ? { ...rest, [SAMPLE]: "1" } : rest));

const SECTIONS: ListSection[] = [
  {
    key: "toppers",
    group: "Home & About",
    title: "Board toppers",
    hint: "Shown on the home page.",
    item: "topper",
    defaults: builtIn(toppers),
    fields: [
      { key: "name", label: "Student name", required: true },
      { key: "className", label: "Class / stream", placeholder: "Class XII (Science)", required: true },
      { key: "year", label: "Year", placeholder: "2026" },
      { key: "percentage", label: "Percentage", placeholder: "95.4%", required: true },
      { key: "photo", label: "Photo (optional)", type: "image" },
    ],
  },
  {
    key: "events",
    group: "Events & media",
    title: "Upcoming events",
    hint: "Shown on the Notices & Events page.",
    item: "event",
    defaults: builtIn(events),
    fields: [
      { key: "title", label: "Event name", required: true },
      { key: "date", label: "Date", placeholder: "14 November 2026", required: true },
      { key: "category", label: "Type", placeholder: "Sports / Academic / Cultural" },
      { key: "description", label: "Short description", type: "textarea" },
    ],
  },
  {
    key: "fees",
    group: "Admissions & fees",
    title: "Fee structure",
    hint: "Shown on the Fees page. Leave empty to show “contact the office”.",
    item: "class group",
    defaults: builtIn(fees),
    fields: [
      { key: "group", label: "Classes", placeholder: "Class I – V", required: true },
      { key: "admission", label: "Admission fee (one time)", placeholder: "₹5,000" },
      { key: "monthly", label: "Monthly tuition fee", placeholder: "₹1,200" },
      { key: "annual", label: "Annual charges", placeholder: "₹3,000" },
    ],
  },
  {
    key: "transport",
    group: "Admissions & fees",
    title: "Bus routes",
    hint: "Shown on the Fees page.",
    item: "route",
    defaults: builtIn(transportRoutes),
    fields: [
      { key: "route", label: "Route name", placeholder: "Route 1 – Civil Lines", required: true },
      { key: "stops", label: "Stops (separate with commas)", type: "list", placeholder: "Civil Lines, Station Road, Pakka Talab" },
      { key: "monthlyFee", label: "Monthly fee", placeholder: "₹800" },
    ],
  },
  {
    key: "testimonials",
    group: "Home & About",
    title: "Parent & student reviews",
    hint: "Shown on the home page. Only add quotes the person agreed to share.",
    item: "review",
    defaults: builtIn(testimonials),
    fields: [
      { key: "quote", label: "What they said", type: "textarea", required: true },
      { key: "name", label: "Name", required: true },
      { key: "role", label: "Who they are", placeholder: "Parent, Class VI" },
    ],
  },
  {
    key: "staff",
    group: "Home & About",
    title: "Leadership & staff",
    hint: "Shown on the About page.",
    item: "staff member",
    defaults: builtIn(staff),
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "position", label: "Position", placeholder: "PGT – Physics", required: true },
      { key: "qualification", label: "Qualification", placeholder: "M.Sc., B.Ed." },
    ],
  },
  {
    key: "videos",
    group: "Events & media",
    title: "YouTube videos",
    hint: "Shown on the Gallery page. Paste the link from the YouTube app's Share button.",
    item: "video",
    defaults: youtubeVideoIds.map((id) => ({ url: `https://youtu.be/${id}` })),
    fields: [{ key: "url", label: "YouTube link", placeholder: "https://youtu.be/…", required: true }],
  },
  {
    key: "admissionSteps",
    group: "Admissions & fees",
    title: "How to apply (steps)",
    hint: "The numbered steps on the Admissions page.",
    item: "step",
    defaults: admissionSteps,
    fields: [
      { key: "title", label: "Step title", required: true },
      { key: "description", label: "What the parent should do", type: "textarea" },
    ],
  },
  {
    key: "admissionDocuments",
    group: "Admissions & fees",
    title: "Documents required",
    hint: "The checklist on the Admissions page.",
    item: "document",
    defaults: admissionDocuments.map((text) => ({ text })),
    fields: [{ key: "text", label: "Document", placeholder: "Birth certificate", required: true }],
  },
  {
    key: "ageCriteria",
    group: "Admissions & fees",
    title: "Age criteria",
    hint: "The age table on the Admissions page.",
    item: "class",
    defaults: ageCriteria,
    fields: [
      { key: "className", label: "Class", placeholder: "Nursery", required: true },
      { key: "age", label: "Minimum age", placeholder: "3+ years as on 31st March", required: true },
    ],
  },
  {
    key: "classOptions",
    group: "Admissions & fees",
    title: "Classes in enquiry form",
    hint: "The classes parents can choose in the admission enquiry form. Remove classes with no seats.",
    item: "class",
    defaults: classOptions.map((name) => ({ name })),
    fields: [{ key: "name", label: "Class", placeholder: "Class VI", required: true }],
  },
  {
    key: "stages",
    group: "Academics",
    title: "Stages of schooling",
    hint: "The stage cards on the Academics page (also listed in the footer).",
    item: "stage",
    defaults: stages.map((st) => ({ ...st, subjects: st.subjects.filter((x) => x !== "See streams below") })),
    fields: [
      { key: "level", label: "Stage", placeholder: "Primary", required: true },
      { key: "classes", label: "Classes", placeholder: "Class I – V", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "subjects", label: "Subjects (separate with commas)", type: "list" },
    ],
  },
  {
    key: "streams",
    group: "Academics",
    title: "Class XI–XII streams",
    hint: "The stream cards on the Academics page.",
    item: "stream",
    defaults: streams,
    fields: [
      { key: "name", label: "Stream", placeholder: "Science (PCM)", required: true },
      { key: "subjects", label: "Subjects (separate with commas)", type: "list", required: true },
    ],
  },
  {
    key: "sessionCalendar",
    group: "Academics",
    title: "Academic calendar",
    hint: "The “session at a glance” timeline on the Academics page.",
    item: "entry",
    defaults: sessionCalendar,
    fields: [
      { key: "term", label: "What happens", placeholder: "Half-yearly examinations", required: true },
      { key: "period", label: "When", placeholder: "September – October", required: true },
    ],
  },
];

type Row = Record<string, string>;

// Editing works on plain strings; lists (bus stops) are joined/split around that.
const toRows = (section: ListSection, items: Record<string, unknown>[]): Row[] =>
  items.map((item) => ({
    ...Object.fromEntries(
      section.fields.map((f) => {
        const v = item[f.key];
        return [f.key, Array.isArray(v) ? v.join(", ") : typeof v === "string" || typeof v === "number" ? String(v) : ""];
      }),
    ),
    ...(item[SAMPLE] ? { [SAMPLE]: "1" } : {}),
  }));

const fromRows = (section: ListSection, rows: Row[]) =>
  rows
    .filter((row) => section.fields.some((f) => row[f.key]?.trim()))
    .map((row) =>
      Object.fromEntries(
        section.fields.map((f) => {
          const v = row[f.key]?.trim() ?? "";
          return [f.key, f.type === "list" ? v.split(",").map((s) => s.trim()).filter(Boolean) : v];
        }),
      ),
    );

const ListEditor = ({ section, saved, token, onError }: { section: ListSection; saved: unknown; token: string; onError: (m: string) => void }) => {
  const queryClient = useQueryClient();
  const isSaved = Array.isArray(saved);
  const initial = () => toRows(section, isSaved ? (saved as Record<string, unknown>[]) : section.defaults);
  const [rows, setRows] = useState<Row[]>(initial);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  // Reload when switching sections or when fresh data arrives from the server.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setRows(initial()), [section.key, saved]);

  // Editing an example row turns it into real content.
  const set = (i: number, key: string, value: string) => {
    setStatus("");
    setRows((r) => r.map((row, j) => (j === i ? { ...row, [key]: value, [SAMPLE]: "" } : row)));
  };
  const move = (i: number, by: number) =>
    setRows((r) => {
      const next = [...r];
      [next[i], next[i + by]] = [next[i + by], next[i]];
      return next;
    });
  const add = () => setRows((r) => [...r, Object.fromEntries(section.fields.map((f) => [f.key, ""]))]);
  const remove = (i: number) => {
    setStatus("");
    setRows((r) => r.filter((_, j) => j !== i));
  };
  const dirty = JSON.stringify(rows) !== JSON.stringify(initial());

  const upload = async (i: number, key: string, file?: File) => {
    if (!file) return;
    setUploading(`${i}-${key}`);
    try {
      const { url } = await uploadImage(file, token);
      set(i, key, url);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Upload failed.");
    }
    setUploading(null);
  };

  const save = async () => {
    const examples = rows.filter((r) => r[SAMPLE]).length;
    if (examples && !window.confirm(`${examples} example item(s) are still in the list and will appear on the live website. Save anyway? (Delete them first if they are not real.)`)) return;
    const value = fromRows(section, rows);
    const missing = value.findIndex((item) => section.fields.some((f) => f.required && !item[f.key]?.length));
    if (missing >= 0) {
      const field = section.fields.find((f) => f.required && !value[missing][f.key]?.length);
      return onError(`${section.item[0].toUpperCase()}${section.item.slice(1)} ${missing + 1}: “${field?.label}” is required.`);
    }
    setBusy(true);
    const res = await api(`/api/admin/content/${section.key}`, { method: "PUT", body: JSON.stringify({ value }) }, token);
    setBusy(false);
    if (!res.success) return onError(res.message ?? "Could not save.");
    setStatus("Saved. The website now shows this.");
    queryClient.invalidateQueries({ queryKey: ["site-content"] });
  };

  return (
    <div className="space-y-4">
      {!isSaved && (
        <p className="rounded bg-muted p-3 text-sm text-muted-foreground">
          This is what the website shows right now. Change any item, delete the ones you don’t want, then press <strong>Save changes</strong>.
          Items marked <strong>Example</strong> are placeholders: they are hidden on the live site until you edit them.
        </p>
      )}
      {rows.length === 0 && <p className="text-muted-foreground">Nothing here yet. Press “Add {section.item}”.</p>}

      {rows.map((row, i) => (
        <Card key={i}>
          <CardContent className="space-y-3 pt-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-primary capitalize">
                {section.item} {i + 1}
                {row[SAMPLE] && <span className="ml-2 rounded bg-yellow-300 px-1.5 py-0.5 text-[10px] normal-case text-yellow-950">Example</span>}
              </span>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-9 w-9" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-9 w-9" disabled={i === rows.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-9 text-red-600" onClick={() => remove(i)} aria-label={`Delete ${section.item} ${i + 1}`}>
                  <Trash2 className="h-4 w-4 sm:mr-1" aria-hidden="true" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {section.fields.map((f) => {
                const id = `${section.key}-${i}-${f.key}`;
                return (
                  <div key={f.key} className={`space-y-1.5 ${f.type === "textarea" || f.type === "list" ? "sm:col-span-2" : ""}`}>
                    <Label htmlFor={id}>{f.label}{f.required && " *"}</Label>
                    {f.type === "textarea" ? (
                      <Textarea id={id} rows={3} value={row[f.key]} placeholder={f.placeholder} onChange={(e) => set(i, f.key, e.target.value)} />
                    ) : f.type === "image" ? (
                      <div className="flex items-center gap-2">
                        {row[f.key] && <img src={row[f.key]} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />}
                        <Input id={id} value={row[f.key]} placeholder="https://… or upload" onChange={(e) => set(i, f.key, e.target.value)} />
                        <Button size="icon" variant="outline" className="shrink-0" asChild aria-label="Upload photo">
                          <label className="cursor-pointer">
                            <Upload className="h-4 w-4" aria-hidden="true" />
                            <input type="file" accept="image/*" className="sr-only" disabled={uploading !== null} onChange={(e) => upload(i, f.key, e.target.files?.[0])} />
                          </label>
                        </Button>
                      </div>
                    ) : (
                      <Input id={id} value={row[f.key]} placeholder={f.placeholder} onChange={(e) => set(i, f.key, e.target.value)} />
                    )}
                    {uploading === `${i}-${f.key}` && <p className="text-xs text-muted-foreground">Uploading…</p>}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-2 border-t bg-muted/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <Button variant="outline" onClick={add}>
          <Plus className="h-4 w-4 mr-1" aria-hidden="true" /> Add {section.item}
        </Button>
        <Button onClick={save} disabled={busy || (isSaved && !dirty)}>{busy ? "Saving…" : "Save changes"}</Button>
        {dirty && (
          <Button variant="ghost" onClick={() => setRows(initial())}>
            Undo changes
          </Button>
        )}
        {dirty && !status && <span className="text-sm text-amber-700">Unsaved changes</span>}
        {status && <span role="status" className="text-sm font-medium text-green-700">{status}</span>}
      </div>
    </div>
  );
};

const statOf = (labelKey: string) => String(stats.find((s) => s.labelKey === labelKey)?.value ?? "");
const builtInStats = { students: statOf("stats.students"), teachers: statOf("stats.teachers"), result: statOf("stats.result") };

const StatsEditor = ({ saved, token, onError }: { saved?: SiteContent["stats"]; token: string; onError: (m: string) => void }) => {
  const queryClient = useQueryClient();
  const start = () => saved ?? builtInStats;
  const [values, setValues] = useState<NonNullable<SiteContent["stats"]>>(start);
  const [status, setStatus] = useState("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setValues(start()), [saved]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api("/api/admin/content/stats", { method: "PUT", body: JSON.stringify({ value: values }) }, token);
    if (!res.success) return onError(res.message ?? "Could not save.");
    setStatus("Saved.");
    queryClient.invalidateQueries({ queryKey: ["site-content"] });
  };

  const fields = [
    ["students", "Number of students", "1200"],
    ["teachers", "Number of teachers", "55"],
    ["result", "Board exam pass %", "100"],
  ] as const;

  return (
    <form onSubmit={save} className="space-y-4 max-w-md">
      <p className="text-sm text-muted-foreground">
        The counters on the home and About pages. “Years of excellence” is worked out automatically. Leave a box empty to hide that counter.
      </p>
      {fields.map(([key, label, placeholder]) => (
        <div key={key} className="space-y-1.5">
          <Label htmlFor={`stat-${key}`}>{label}</Label>
          <Input
            id={`stat-${key}`}
            inputMode="numeric"
            value={values[key] ?? ""}
            placeholder={placeholder}
            onChange={(e) => {
              setStatus("");
              setValues({ ...values, [key]: e.target.value.replace(/[^\d.]/g, "") });
            }}
          />
        </div>
      ))}
      <div className="flex items-center gap-3">
        <Button type="submit">Save numbers</Button>
        {status && <span role="status" className="text-sm font-medium text-green-700">{status}</span>}
      </div>
    </form>
  );
};

const LogoEditor = ({ saved, token, onError }: { saved?: SiteContent["branding"]; token: string; onError: (m: string) => void }) => {
  const queryClient = useQueryClient();
  const [logo, setLogo] = useState(saved?.logo ?? "");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => setLogo(saved?.logo ?? ""), [saved]);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["site-content"] });

  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setStatus("Uploading…");
    try {
      const { url } = await uploadImage(file, token);
      setLogo(url);
      setStatus("Uploaded. Check the preview, then press Save logo.");
    } catch (err) {
      setStatus("");
      onError(err instanceof Error ? err.message : "Upload failed.");
    }
    setBusy(false);
  };

  const save = async () => {
    const res = await api("/api/admin/content/branding", { method: "PUT", body: JSON.stringify({ value: { logo: logo.trim() } }) }, token);
    if (!res.success) return onError(res.message ?? "Could not save.");
    setStatus("Saved. The new logo now shows on the website.");
    refresh();
  };

  const reset = async () => {
    if (!window.confirm("Go back to the original school logo?")) return;
    const res = await api("/api/admin/content/branding", { method: "DELETE" }, token);
    if (!res.success) return onError(res.message ?? "Could not reset.");
    setLogo("");
    setStatus("The original logo is back on the website.");
    refresh();
  };

  const preview = logo.trim() || DEFAULT_LOGO;
  const changed = logo.trim() !== (saved?.logo ?? "");

  return (
    <div className="space-y-5 max-w-lg">
      <p className="text-sm text-muted-foreground">
        Shown in the website header, the footer and the browser tab. Use a square image (for example 500 × 500 px), ideally a PNG
        with a transparent or white background.
      </p>

      <div className="flex flex-wrap items-center gap-6 rounded-lg border bg-background p-4">
        <div className="text-center">
          <img src={cld(preview, 240)} alt="Logo preview" className="h-24 w-24 rounded object-contain" />
          <p className="mt-1 text-xs text-muted-foreground">{logo.trim() ? (changed ? "New (not saved)" : "Current logo") : "Original logo"}</p>
        </div>
        {/* How it looks in the website header */}
        <div className="flex min-w-0 items-center gap-3 rounded border px-3 py-2">
          <img src={cld(preview, 112)} alt="" className="h-11 w-11 shrink-0 object-contain" />
          <span className="text-sm font-bold leading-tight text-primary">Header preview</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" asChild disabled={busy}>
          <label className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
            Upload new logo
            <input type="file" accept="image/*" className="sr-only" disabled={busy} onChange={(e) => upload(e.target.files?.[0])} />
          </label>
        </Button>
        <Button onClick={save} disabled={busy || !logo.trim() || !changed}>Save logo</Button>
        {saved?.logo && (
          <Button variant="ghost" onClick={reset} disabled={busy}>Use original logo</Button>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="logo-url">…or paste an image link</Label>
        <Input id="logo-url" value={logo} placeholder="https://…" onChange={(e) => { setStatus(""); setLogo(e.target.value); }} />
      </div>

      {status && <p role="status" className="text-sm font-medium text-green-700">{status}</p>}
    </div>
  );
};

type SchoolField = { key: keyof SchoolDetails; label: string; hint?: string; type?: "text" | "lines" | "paragraphs" | "image" | "url" };

const SCHOOL_FIELDS: { group: string; fields: SchoolField[] }[] = [
  {
    group: "Contact",
    fields: [
      { key: "phoneDisplay", label: "Phone number", hint: "As parents should see it, e.g. +91 95653 13000" },
      { key: "whatsapp", label: "WhatsApp number", hint: "With country code, e.g. 919565313000" },
      { key: "email", label: "Email" },
      { key: "addressLines", label: "Full address", type: "lines", hint: "One line per row" },
      { key: "addressShort", label: "Short address", hint: "Shown in the header, e.g. Pakka Talab, Fatehpur, UP" },
      { key: "mapQuery", label: "Google Maps search text", hint: "What to search on the map, e.g. Brilliant Oriental School, Fatehpur" },
      { key: "officeHours", label: "Office hours", type: "lines", hint: "One line per row" },
    ],
  },
  {
    group: "Social media",
    fields: [
      { key: "facebook", label: "Facebook page link", type: "url" },
      { key: "youtube", label: "YouTube channel link", type: "url" },
      { key: "instagram", label: "Instagram link", type: "url" },
    ],
  },
  {
    group: "Chairman",
    fields: [
      { key: "chairmanName", label: "Chairman's name" },
      { key: "chairmanPhoto", label: "Chairman's photo", type: "image" },
    ],
  },
  {
    group: "Pictures & documents",
    fields: [
      { key: "heroImage", label: "Home page main picture", type: "image", hint: "Wide photo of the school, at least 1600 px wide" },
      { key: "visionImage", label: "Picture next to Vision & Mission", type: "image" },
      { key: "prospectusUrl", label: "Prospectus link", type: "url", hint: "Upload the PDF to Google Drive, set sharing to “Anyone with the link”, and paste the link" },
    ],
  },
  {
    group: "About page",
    fields: [
      { key: "aboutHistory", label: "“Our history” text", type: "paragraphs", hint: "Leave an empty line between paragraphs" },
    ],
  },
];

const SchoolEditor = ({ saved, token, onError }: { saved?: SchoolDetails; token: string; onError: (m: string) => void }) => {
  const queryClient = useQueryClient();
  const current = useSchool();
  // Start from what the site shows now, so admins edit rather than retype.
  const fromSite = (): Record<string, string> => ({
    phoneDisplay: current.phoneDisplay,
    whatsapp: current.whatsapp,
    email: current.email,
    addressLines: current.addressLines.join("\n"),
    addressShort: current.addressShort,
    mapQuery: current.mapQuery,
    officeHours: current.officeHours.join("\n"),
    facebook: current.social.facebook,
    youtube: current.social.youtube,
    instagram: current.social.instagram,
    chairmanName: current.chairman.name,
    chairmanPhoto: current.chairman.photo,
    heroImage: current.heroImage.startsWith("http") ? current.heroImage : "",
    visionImage: current.visionImage,
    prospectusUrl: current.prospectusUrl.startsWith("http") ? current.prospectusUrl : "",
    aboutHistory: current.aboutHistory?.join("\n\n") ?? "",
  });
  const [values, setValues] = useState(fromSite);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setValues(fromSite()), [saved]);

  const set = (key: string, value: string) => {
    setStatus("");
    setValues((v) => ({ ...v, [key]: value }));
  };

  const upload = async (key: string, file?: File) => {
    if (!file) return;
    setUploading(key);
    try {
      set(key, (await uploadImage(file, token)).url);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Upload failed.");
    }
    setUploading(null);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const lines = (v: string) => v.split("\n").map((l) => l.trim()).filter(Boolean);
    const value: SchoolDetails = {
      ...(values as Record<string, string>),
      addressLines: lines(values.addressLines),
      officeHours: lines(values.officeHours),
    };
    const res = await api("/api/admin/content/school", { method: "PUT", body: JSON.stringify({ value }) }, token);
    if (!res.success) return onError(res.message ?? "Could not save.");
    setStatus("Saved. The website now shows the new details.");
    queryClient.invalidateQueries({ queryKey: ["site-content"] });
  };

  return (
    <form onSubmit={save} className="space-y-8">
      {SCHOOL_FIELDS.map((g) => (
        <fieldset key={g.group} className="space-y-4">
          <legend className="mb-2 text-base font-semibold text-primary">{g.group}</legend>
          {g.fields.map((f) => {
            const id = `school-${f.key}`;
            const v = values[f.key] ?? "";
            return (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={id}>{f.label}</Label>
                {f.type === "lines" || f.type === "paragraphs" ? (
                  <Textarea id={id} rows={f.type === "paragraphs" ? 8 : 3} value={v} onChange={(e) => set(f.key, e.target.value)} />
                ) : f.type === "image" ? (
                  <div className="flex items-center gap-2">
                    {v && <img src={cld(v, 160)} alt="" className="h-12 w-12 shrink-0 rounded object-cover" />}
                    <Input id={id} value={v} placeholder="https://… or upload" onChange={(e) => set(f.key, e.target.value)} />
                    <Button type="button" size="icon" variant="outline" className="shrink-0" asChild aria-label={`Upload ${f.label}`}>
                      <label className="cursor-pointer">
                        <Upload className="h-4 w-4" aria-hidden="true" />
                        <input type="file" accept="image/*" className="sr-only" disabled={uploading !== null} onChange={(e) => upload(f.key, e.target.files?.[0])} />
                      </label>
                    </Button>
                  </div>
                ) : (
                  <Input id={id} type={f.type === "url" ? "url" : "text"} value={v} onChange={(e) => set(f.key, e.target.value)} />
                )}
                {uploading === f.key && <p className="text-xs text-muted-foreground">Uploading…</p>}
                {f.hint && <p className="text-xs text-muted-foreground">{f.hint}</p>}
              </div>
            );
          })}
        </fieldset>
      ))}
      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t bg-muted/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <Button type="submit" disabled={uploading !== null}>Save school details</Button>
        {status && <span role="status" className="text-sm font-medium text-green-700">{status}</span>}
      </div>
    </form>
  );
};

const TextsEditor = ({ saved, token, onError }: { saved?: SiteContent["texts"]; token: string; onError: (m: string) => void }) => {
  const queryClient = useQueryClient();
  const keys = EDITABLE_TEXTS.flatMap((g) => g.items.map((i) => i.key));
  const fromSite = () => ({
    en: Object.fromEntries(keys.map((k) => [k, saved?.en?.[k] || DEFAULT_TEXTS.en[k]])),
    hi: Object.fromEntries(keys.map((k) => [k, saved?.hi?.[k] || DEFAULT_TEXTS.hi[k]])),
  });
  const [values, setValues] = useState(fromSite);
  const [status, setStatus] = useState("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setValues(fromSite()), [saved]);

  const set = (lang: "en" | "hi", key: string, value: string) => {
    setStatus("");
    setValues((v) => ({ ...v, [lang]: { ...v[lang], [key]: value } }));
  };

  const save = async () => {
    // Only store text that differs from the built-in version, so future built-in fixes still show elsewhere.
    const changed = (lang: "en" | "hi") =>
      Object.fromEntries(keys.filter((k) => values[lang][k].trim() && values[lang][k].trim() !== DEFAULT_TEXTS[lang][k]).map((k) => [k, values[lang][k].trim()]));
    const res = await api("/api/admin/content/texts", { method: "PUT", body: JSON.stringify({ value: { en: changed("en"), hi: changed("hi") } }) }, token);
    if (!res.success) return onError(res.message ?? "Could not save.");
    setStatus("Saved. The website now shows the new text.");
    queryClient.invalidateQueries({ queryKey: ["site-content"] });
  };

  const resetOne = (key: string) => {
    set("en", key, DEFAULT_TEXTS.en[key as keyof typeof DEFAULT_TEXTS.en]);
    set("hi", key, DEFAULT_TEXTS.hi[key as keyof typeof DEFAULT_TEXTS.hi]);
  };

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">
        Each text has an English and a Hindi version. Visitors see the one matching the language button at the top of the site.
      </p>
      {EDITABLE_TEXTS.map((g) => (
        <section key={g.group} className="space-y-4">
          <h3 className="text-base font-semibold text-primary">{g.group}</h3>
          {g.items.map((item) => {
            const Field = item.long ? Textarea : Input;
            const edited = values.en[item.key] !== DEFAULT_TEXTS.en[item.key] || values.hi[item.key] !== DEFAULT_TEXTS.hi[item.key];
            return (
              <div key={item.key} className="rounded-lg border bg-background p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{item.label}</span>
                  {edited && (
                    <button type="button" className="text-xs text-primary underline" onClick={() => resetOne(item.key)}>
                      Use original text
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor={`${item.key}-en`} className="text-xs text-muted-foreground">English</Label>
                    <Field id={`${item.key}-en`} value={values.en[item.key]} onChange={(e) => set("en", item.key, e.target.value)} {...(item.long ? { rows: 3 } : {})} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`${item.key}-hi`} className="text-xs text-muted-foreground">हिंदी</Label>
                    <Field id={`${item.key}-hi`} lang="hi" value={values.hi[item.key]} onChange={(e) => set("hi", item.key, e.target.value)} {...(item.long ? { rows: 3 } : {})} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      ))}
      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t bg-muted/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <Button onClick={save}>Save text</Button>
        {status && <span role="status" className="text-sm font-medium text-green-700">{status}</span>}
      </div>
    </div>
  );
};

// Editors that are not simple lists, shown at the top of the menu.
const SPECIAL = [
  { key: "school", title: "School details", hint: "Phone, WhatsApp, email, address, office hours, social links, chairman, pictures and prospectus." },
  { key: "texts", title: "Page text (English & Hindi)", hint: "Headings and paragraphs on the home page, footer and WhatsApp message." },
  { key: "logo", title: "School logo", hint: "" },
  { key: "stats", title: "Home page numbers", hint: "" },
];

const MENU = [
  { group: "School", items: SPECIAL.map(({ key, title }) => ({ key, title })) },
  ...["Home & About", "Admissions & fees", "Academics", "Events & media"].map((group) => ({
    group,
    items: SECTIONS.filter((s) => s.group === group).map(({ key, title }) => ({ key, title })),
  })),
];

const ContentEditor = ({ token, onError }: { token: string; onError: (message: string) => void }) => {
  const { data: saved = {}, isLoading } = useSavedContent();
  const [active, setActive] = useState<string>("school");
  const section = SECTIONS.find((s) => s.key === active);
  const special = SPECIAL.find((s) => s.key === active);

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-start">
      {/* Phones: one dropdown. Large screens: grouped list. */}
      <div className="lg:hidden">
        <Label htmlFor="section-picker" className="mb-1.5 block">Choose what to edit</Label>
        <select
          id="section-picker"
          value={active}
          onChange={(e) => setActive(e.target.value)}
          className="h-12 w-full rounded-md border bg-background px-3 text-base"
        >
          {MENU.map((g) => (
            <optgroup key={g.group} label={g.group}>
              {g.items.map((i) => <option key={i.key} value={i.key}>{i.title}</option>)}
            </optgroup>
          ))}
        </select>
      </div>
      <nav aria-label="Website sections" className="hidden lg:block space-y-4">
        {MENU.map((g) => (
          <div key={g.group}>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{g.group}</p>
            <div className="flex flex-col gap-1">
              {g.items.map((i) => (
                <Button key={i.key} size="sm" variant={active === i.key ? "default" : "ghost"} className="justify-start" onClick={() => setActive(i.key)}>
                  {i.title}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{section?.title ?? special?.title}</CardTitle>
          {(section?.hint || special?.hint) && <CardDescription>{section?.hint || special?.hint}</CardDescription>}
        </CardHeader>
        <CardContent>
          {section ? (
            <ListEditor key={section.key} section={section} saved={saved[section.key]} token={token} onError={onError} />
          ) : active === "school" ? (
            <SchoolEditor saved={saved.school} token={token} onError={onError} />
          ) : active === "texts" ? (
            <TextsEditor saved={saved.texts} token={token} onError={onError} />
          ) : active === "logo" ? (
            <LogoEditor saved={saved.branding} token={token} onError={onError} />
          ) : (
            <StatsEditor saved={saved.stats} token={token} onError={onError} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentEditor;
