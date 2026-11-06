# SAMANVAY 2027 — CL MEET | Met Gala Couture Digital Invitation

> Award-calibre (Awwwards / FWA level) digital invitation and accreditation portal for the **Contingent Leaders' Meet** of **Samanvay 2027**, hosted by **Thakur Specialized Degree College (TSPDC)**.

---

## 1. Design Concept (5 Lines)
1. **Palette**: Obsidian velvet (`#0B0907`), deep oxblood burgundy (`#5A0F1A`), champagne gold (`#C9A24B`), and warm ivory (`#F4EDE0`).
2. **Type Pairing**: Editorial high-contrast *Bodoni Moda* & *Playfair Display* layered beneath calligraphy script (*Pinyon Script*) and regal *Cinzel* small caps.
3. **Envelope Experience**: A dimensional 3D burgundy-velvet envelope sealed with an embossed gold wax medallion, resting above a colossal ghosted `SAMANVAY` watermark with gyroscope/mouse parallax.
4. **Signature Moment**: The crack of the wax seal triggering a physical 3D flap unfold, ivory letter card elevation, a blinding paparazzi camera-flash burst, and an ambient paparazzi-trail cursor.
5. **RSVP Transformation**: A bottom-border haute couture response card that physically flips in 3D into an embossed VIP Conclave Ticket Pass with instant `.ics` calendar invitation download.

---

## 2. Folder Structure

```
CL MEET/
├── assets/
│   ├── favicon.png               <- Circular Samanvay Logo Favicon
│   ├── logo.png                  <- TSPDC Transparent Crest (no white box)
│   └── seal.jpg                  <- Wax seal circular medallion asset
├── index.html                    <- Semantic HTML5 single-page experience
├── style.css                     <- Bespoke couture CSS with custom variables
├── script.js                     <- GSAP 3 animation, 3D envelope kinematics, form validation & .ics
└── google-apps-script.js         <- Zero-cost Google Sheets backend webhook
```

---

## 3. "Customise Me" Quick Guide

All core values are centralized in `style.css` and `index.html`:

- **Colors (`style.css` `:root`)**:
  - `--color-obsidian`: Change base dark background
  - `--color-oxblood`: Change burgundy velvet tone
  - `--color-gold`: Change metallic champagne gold accent
  - `--color-ivory`: Change editorial text color
- **Date & Logistics (`index.html`)**:
  - Search for `Saturday, 19 Dec 2026` to update the date.
  - Search for `6:00 PM IST` to update the conclave time.
  - Search for `Thakur Educational Campus` to adjust venue details.
- **Google Sheets Endpoint (`script.js`)**:
  - Set `const APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';` around line 380.

---

## 4. Google Sheets Backend Setup (5 Steps)

1. Open [Google Sheets](https://sheets.new) and create a new sheet named `Samanvay 2027 CL Registrations`.
2. In Row 1, add columns:
   `Timestamp | College Name | CL Name | CL Mobile | ACL Name | ACL Mobile | Ref ID`
3. Click **Extensions** > **Apps Script**, delete the placeholder code, and paste the contents of `google-apps-script.js`.
4. Click **Deploy** > **New deployment** > select type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Authorize permissions, copy the Web App URL, and paste it into `script.js` at `APPS_SCRIPT_URL`.

---

## 5. Deployment Guide

### Deploying to Vercel
1. Install Vercel CLI: `npm i -g vercel` (or connect your GitHub repository to vercel.com).
2. Run `vercel` in this directory.
3. Accept the defaults. Vercel will automatically deploy static assets.

### Deploying to Netlify
1. Drag and drop this folder directly into [app.netlify.com/drop](https://app.netlify.com/drop).
2. Or run `npx netlify deploy --prod --dir=.`.
