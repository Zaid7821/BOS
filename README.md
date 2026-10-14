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

## Editing school content

Almost everything (contact details, fees, toppers, testimonials, staff, events, gallery, disclosure) is in
**`src/data/site.ts`**.

Items marked `isSample: true` are placeholders. They show with a yellow "Sample" tag in `npm run dev` and are
hidden automatically in the production build. Replace them with real data and remove `isSample` to publish them.

To add Hindi translations for more text, edit `src/lib/i18n.tsx`.

## Admin dashboard

Open `/admin` and log in with `ADMIN_PASSWORD`. Staff can:

- see admission enquiries and mark them contacted / admitted / closed
- post, hide, highlight or delete notices (shown in the scrolling notice bar and on the Notices page)
- read and delete contact form messages

## Deploying

- **Frontend (Vercel):** set `VITE_API_BASE_URL` to your backend URL, e.g. `https://your-api.onrender.com`.
- **Backend (Render etc.):** set `DATABASE_URL`, `DATABASE_SSL=true` for hosted Postgres, `ADMIN_PASSWORD`,
  `ADMIN_TOKEN_SECRET`, and `CORS_ORIGIN` (your website URL).
- Never commit `server/.env`.
