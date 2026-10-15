# Brilliant Oriental Senior Secondary School — Website

CBSE affiliated (Affiliation No. 2134844), Pakka Talab, Fatehpur, UP.

Built with Vite, React, TypeScript, Tailwind CSS and shadcn/ui. The backend (`server/`) is Express + PostgreSQL.

## Run locally

```sh
npm install

# 1. Backend
cp server/.env.example server/.env   # then fill in DATABASE_URL, ADMIN_PASSWORD, ADMIN_TOKEN_SECRET
npm run server                       # http://localhost:5000  (tables are created automatically)

# 2. Website (in a second terminal)
npm run dev                          # http://localhost:8080  (/api is proxied to the backend)
```

## Checks

```sh
npm run check    # typecheck + lint + server syntax check + production build
```

GitHub Actions runs the same check and a secret scan on every push and pull request.

## Working with AI coding agents

Project rules for Codex, Cursor, Copilot, Claude, ChatGPT and other agents are in **[AGENTS.md](AGENTS.md)**
(`CLAUDE.md`, `.cursor/rules/` and `.github/copilot-instructions.md` point to it). Give that file to any agent you use.

## Editing school content

Most content is edited by school staff in the **admin panel** (`/admin`), with no code changes:

- **Enquiries:** search, filter by status, add office notes, call / WhatsApp, delete, export to Excel
- **Notices:** post, edit, hide, mark important, delete
- **Messages:** read and delete contact form messages
- **Gallery:** upload photos from a phone or computer, edit captions and categories, delete
- **Website content:** school logo, toppers, events, fees, bus routes, testimonials, staff, home page numbers, YouTube videos

`src/data/site.ts` holds fixed school details (name, contact details, address, academics) and the built-in content that is
shown until an admin saves a section. Items marked `isSample: true` are placeholders: they show with a yellow "Sample"
tag in `npm run dev` and are hidden in the production build.

To add Hindi translations for more text, edit `src/lib/i18n.tsx`.

## Deploying

- **Backend (Render etc.):** set the variables listed in `server/.env.example` (`DATABASE_URL`, `DATABASE_SSL=true`,
  `CORS_ORIGIN`, `ADMIN_PASSWORD`, `ADMIN_TOKEN_SECRET`, `CLOUDINARY_*`). Build `npm install`, start `npm run server`.
- **Frontend:** set `VITE_API_BASE_URL` to the backend URL, build with `npm run build`, publish `dist/`, and rewrite all
  routes to `/index.html` (`vercel.json` does this on Vercel).
- Never commit `.env` or `server/.env`. Paste values into the host's dashboard without trailing spaces or newlines.
