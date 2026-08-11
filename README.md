# hey Cia 💚

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

Edit the config at the top of `script.js`:

```js
const SEND_TO = "";   // your WhatsApp number, digits only w/ country code, no "+"
                      // e.g. "6281234567890" — the final button opens a chat with you.
                      // leave "" to open WhatsApp with a pre-filled message instead.
const NAME = "Cia";   // the name shown in the question
```

- **`SEND_TO`** — set this to the number you want her to message. When set, the *Open WhatsApp* button starts a chat with you, pre-filled with a little hello.
- **`NAME`** — change the name in the headline and messages.
- **Countries** — the `COUNTRIES` list controls the dial-code dropdown; reorder it to change the default (the first entry is selected by default).
- **Wording** — the headline lives in `index.html`; the flirty "No" lines live in the `teases` array in `script.js`.

## Files

| File | What it is |
|------|-----------|
| `index.html` | markup + inline WhatsApp logo SVG |
| `styles.css` | WhatsApp-inspired styling & animations |
| `script.js`  | dodging button, validation, confetti, config |

## Deploy

Drop the folder on any static host — GitHub Pages, Netlify, Vercel, Cloudflare Pages. No configuration needed.
