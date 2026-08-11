# hey Cia 💚

**Live:** https://whatsappnum.vercel.app

A tiny, playful one-page webapp — WhatsApp themed — that asks **"hey Cia, do you want to move to whatsapp?"** and collects a WhatsApp number.

Inspired by those cute "date quiz" prompt pages: a WhatsApp logo, a big question, a **No** button that runs away, and a **Yes** button that grows until it's the only choice. Say yes and it asks for a WhatsApp number, then celebrates with confetti and an *Open WhatsApp* button.

## Preview the flow

1. **Ask** — WhatsApp logo + the question, with `Yes 💚` / `No`. The No button dodges the cursor (and touch), the Yes button grows.
2. **Number** — a phone input with a country-code dropdown and light validation.
3. **Done** — an animated checkmark, confetti, and a `wa.me` deep link to jump into WhatsApp.

## Run it

It's a static site — no build step, no dependencies.

```bash
# any static server works, e.g.
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` in a browser.

## Customize

Everything configurable lives in `config.js`:

```js
window.APP_CONFIG = {
  NAME: "Cia",            // the name shown in the question
  WHATSAPP_URL: "...",    // where the "Open WhatsApp" button goes
  SUPABASE_URL: "...",    // project API URL
  SUPABASE_KEY: "...",    // publishable (anon) key — safe in the browser
  SUPABASE_TABLE: "submissions",
};
```

- **Countries** — the `COUNTRIES` list in `script.js` controls the dial-code dropdown; reorder it to change the default (the first entry is selected).
- **Wording** — the headline lives in `index.html`; the flirty "No" lines live in the `teases` array in `script.js`.

## Database

Submitted numbers are saved to Supabase (`public.submissions`) via the REST API — no SDK, no build step.

| column | notes |
|--------|-------|
| `id` | uuid, auto |
| `created_at` | timestamptz, auto |
| `name`, `answer` | who was asked, and their answer |
| `country_code`, `number`, `full_number` | the submitted number |
| `user_agent`, `referrer` | light context |

**Privacy / security.** Row Level Security is enabled with a single `INSERT` policy for `anon`. There is no `SELECT` policy, so the publishable key in `config.js` can *write* a number but can never *read* the collected numbers back — even though the key is public. Reading is only possible from the Supabase dashboard or with the service-role key (which is **not** in this repo). Length `CHECK` constraints on every text column cap what can be written.

View submissions in the Supabase dashboard → Table Editor → `submissions`, or:

```sql
select created_at, full_number from submissions order by created_at desc;
```

The save runs in the background *after* the success screen appears, so a slow or failed network never blocks the celebration.

## Files

| File | What it is |
|------|-----------|
| `index.html` | markup + inline WhatsApp logo SVG |
| `styles.css` | WhatsApp-inspired styling & animations |
| `script.js`  | dodging button, validation, confetti, Supabase save |
| `config.js`  | all settings: name, WhatsApp link, Supabase creds |

## Deploy

Deployed on Vercel as a static site (no framework, no build step) at
**https://whatsappnum.vercel.app**.

The folder works on any static host — GitHub Pages, Netlify, Cloudflare Pages — with no configuration.
