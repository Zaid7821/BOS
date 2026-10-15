# AGENTS.md

Instructions for AI coding agents (Codex, Cursor, Copilot, Claude, ChatGPT, etc.) and humans working on this repo.
Read this whole file before changing anything. If an instruction here conflicts with a request, ask the user.

## What this project is

The public website and admin panel of **Brilliant Oriental Senior Secondary School**, Fatehpur, UP (CBSE, Affiliation No. 2134844).

- **Users:** parents, mostly on **mobile phones**, often on slow mobile data. Many read Hindi.
- **Admins:** school office staff and teachers, **not programmers**. They manage content at `/admin`, often from a phone.
- **Main goal of the site:** admission enquiries (form, call, WhatsApp).

## Stack and layout

| Part | Tech | Where |
|---|---|---|
| Website | Vite + React 18 + TypeScript + Tailwind + shadcn/ui | `src/` |
| Backend API | Express 5 (plain JS, ES modules) | `server/index.js` |
| Database | PostgreSQL via `pg` | `server/db.js` (tables are created in `initDb()`) |
| Images | Cloudinary (signed uploads from the admin panel) | `src/lib/upload.ts`, `src/lib/cloudinary.ts` |

```
src/
  data/site.ts             Built-in school info + fallback content (fees, toppers, staff, events, gallery…)
  hooks/useSiteContent.ts  Loads admin-edited content from the API, falls back to site.ts
  lib/api.ts               fetch wrapper; every API call goes through api()
  lib/i18n.tsx             English + Hindi strings (t("key"))
  lib/cloudinary.ts        cld() / cldSrcSet() image URL helpers
  lib/upload.ts            Admin photo upload (gets a signature from the server)
  pages/                   One file per route (Home, About, Fees, Gallery, Admin…)
  components/              Shared components; components/admin/ = admin panel pieces
  components/ui/           shadcn/ui generated components (avoid editing)
server/
  index.js                 All API routes
  db.js                    Postgres pool, loads server/.env
```

## Commands

```sh
npm install
npm run server      # backend on http://localhost:5000 (needs server/.env)
npm run dev         # website on http://localhost:8080, /api is proxied to :5000
npm run check       # typecheck + lint + server syntax check + production build
```

**Definition of done:** `npm run check` passes. CI (`.github/workflows/ci.yml`) runs the same check plus a secret scan on every push and PR.

## Guardrails (must follow)

### Secrets
- **Never commit** `.env`, `server/.env`, or any real password, API key, API secret, token or database URL. Only `*.env.example` files with placeholder values belong in git.
- **Never print, log or echo** secret values (in code, terminal output, commit messages, docs or chat). Refer to them by variable name.
- Secrets live in environment variables: `server/.env` locally, the hosting dashboard (Render / Vercel) in production.
- The Cloudinary **API secret stays on the server**. The browser only ever receives a short-lived signature from `GET /api/admin/upload-signature`.
- Frontend env vars must start with `VITE_` and are **public** (baked into the JS bundle). Never put secrets in them.

### Backend / database
- Every `/api/admin/*` route **must** use the `requireAdmin` middleware.
- Always use **parameterised SQL** (`$1, $2…`). Never build SQL by string concatenation with user input.
- Clean and length-limit every input with `clean(value, max)` before saving.
- Public form routes (`/api/contact`, `/api/enquiry`, login) keep their `rateLimit(...)`.
- Schema changes: add them to `initDb()` with `CREATE TABLE IF NOT EXISTS` / `ADD COLUMN IF NOT EXISTS` so they are safe to run on every start. **Never** drop tables or columns, and never delete or rewrite existing rows in migrations: the production database holds real enquiries.
- Editable website sections are stored in the `site_content` table as JSON. Allowed keys are listed in `CONTENT_KEYS` in `server/index.js`; add a new key there, in `SiteContent` in `src/hooks/useSiteContent.ts`, and in `SECTIONS` in `src/components/admin/ContentEditor.tsx`.
- Do not add npm packages for things Node 22 already has (`fetch`, `crypto`, `FormData`).

### Frontend
- **Mobile first.** Every change must work at 360px width: no sideways scrolling, tap targets at least ~44px, text at least 16px in form inputs (prevents iOS zoom). Check `sm:` / `md:` breakpoints.
- The phone layout has a fixed bottom bar (Call / WhatsApp / Apply) in `Layout.tsx`; don't cover it or remove the bottom padding on the page wrapper.
- **Images:** use Cloudinary URLs through `cld(url, width)` and `cldSrcSet(url)`; add `loading="lazy"` below the fold. Don't add large images to `public/`.
- **Content that admins edit** must be read through hooks, never directly from `site.ts`, otherwise admin edits won't show:
  - `useSchool()`: phone, WhatsApp, email, address, office hours, social links, chairman, hero/vision images, prospectus, About history (use it instead of `SCHOOL` for these fields)
  - `useSiteContent()`: logo, toppers, events, fees, bus routes, testimonials, staff, stats, videos, admission steps/documents/age criteria, enquiry-form classes, stages, streams, academic calendar
  - `useGallery()`: gallery photos
  - `t("key")`: keys listed in `EDITABLE_TEXTS` (`src/lib/i18n.tsx`) can be overridden by admins per language
- **Goal: school staff change content in the admin panel, not in code.** When adding new content that staff may want to change, make it admin-editable.
- The footer has a "Staff login" link to `/admin` (blocked for search engines in `public/robots.txt`).
- `site.ts` items with `isSample: true` are placeholders: shown in dev with a yellow "Sample" tag, hidden in production. Don't remove that mechanism or publish fake data as real.
- **Bilingual text:** user-facing strings that already use `t("...")` need both an English (`en`) and Hindi (`hi`) entry in `src/lib/i18n.tsx`.
- All API calls go through `api()` in `src/lib/api.ts`. The base URL comes from `VITE_API_BASE_URL` (empty in dev because of the proxy).
- Use the `@/` import alias. Match the existing style: Tailwind classes, shadcn components, function components, no class components.
- `src/components/ui/` is generated by shadcn. Only edit it to fix a real bug, and keep the change minimal.

### Admin panel UX
- Admins are not technical. Use plain language, clear buttons ("Save changes", "Delete"), and confirm before deleting.
- Every list an admin can add to must also be editable and deletable.
- Show success and error messages; never fail silently.

### Process
- Work on a branch; don't push to or merge into `main` unless the user asks.
- Keep changes focused. Don't reformat unrelated files or upgrade dependencies as a side effect.
- Don't delete user data, `.env` files, or the database. Ask first before anything destructive or hard to undo.
- If you add or change an env var, update `server/.env.example` (or `.env.example`) and the **Environment variables** table below.

## Environment variables

Backend (`server/.env`, or the host's dashboard in production):

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `DATABASE_SSL` | `true` for hosted Postgres (Neon, Render) |
| `PORT` | Set automatically by most hosts; defaults to 5000 |
| `CORS_ORIGIN` | Comma-separated website origins allowed to call the API |
| `ADMIN_PASSWORD` | Password for `/admin` |
| `ADMIN_TOKEN_SECRET` | Long random string used to sign admin login tokens |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Photo uploads from the admin panel (optional; without them admins can only paste image links) |

Frontend (build time):

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend URL in production, e.g. `https://api.bosfatehpur.in`. Leave empty locally. |

When pasting values into a hosting dashboard, make sure there is **no trailing newline or space**.

## API overview

Public: `GET /api/health`, `GET /api/notices`, `GET /api/gallery`, `GET /api/content`, `POST /api/contact`, `POST /api/enquiry`.

Admin (Bearer token from `POST /api/admin/login`):
enquiries (`GET`, `PATCH` status/note, `DELETE`), messages (`GET`, `DELETE`), notices (`GET`, `POST`, `PATCH`, `DELETE`),
gallery (`GET`, `POST`, `PATCH`, `DELETE`, `GET /api/admin/upload-signature`), content (`PUT` / `DELETE /api/admin/content/:key`).

All responses are JSON shaped `{ success: boolean, message?: string, data?: ... }`.
