# SAMANVAY 2026–2027: CL MEET | THE MET GALA
### Official Sovereign Accreditation & VIP Invitation System
**Host Institution:** Thakur Specialized Degree College (TSPDC), Kandivali (W), Mumbai  
**In Academic Collaboration With:** TCET Deemed to be University  
**Live Production Web:** [https://samanvaythefest.github.io/CL-Meet2k26/](https://samanvaythefest.github.io/CL-Meet2k26/)  
**Primary Repository:** [github.com/samanvaythefest/CL-Meet2k26](https://github.com/samanvaythefest/CL-Meet2k26)

---

## Executive Summary

The **Samanvay 2026–2027 Contingent Leaders' Meet (CL Meet)** web application is an award-calibre, haute couture digital invitation and real-time accreditation portal. Designed around the aesthetic archetype of the **Met Gala**, the platform bridges high-fashion editorial craftsmanship with enterprise-grade frontend engineering, automated serverless data collection, and low-latency client-side pass generation.

Every facet of the system—from the 3D physics-based wax seal unboxing to the multi-stage cryptographic delegation registration and zero-cost Google Apps Script backend—was engineered to deliver a seamless, high-prestige user experience across flagship desktop workstations, tablets, and budget mobile hardware alike.

---

## Architectural Blueprint & Technical Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT PRESENTATION LAYER                       │
│   Semantic HTML5  •  Vite 6  •  TailwindCSS / PostCSS  •  ES Modules   │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│  GSAP 3 KINEMATICS│       │ CANVAS FLASH ENG │       │ CLIENT PASS MINT │
│ 3D Perspective   │       │ Multi-Point Grid │       │ 1200×675 Canvas  │
│ Matrix Transforms│       │ Web Audio Synth  │       │ Dual Vector Sfx  │
└──────────────────┘       └──────────────────┘       └──────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    DUAL-DISPATCH SERVERLESS BACKEND                    │
│      Optimized Base64 Downscaler  •  Direct `no-cors` Transport        │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  GOOGLE APPS SCRIPT WEB APPLICATION                   │
│   LockService Concurrency  •  Regex Sanitization  •  Deduplication     │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                ENTERPRISE SPREADSHEET REPOSITORY                      │
│       Google Sheets API  •  Automated Header Formatting & Audit Log    │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Technologies
* **Build Engine & Bundler:** Vite 6 with TypeScript compilation and tree-shaken production rollups.
* **Motion & Kinematics:** GSAP 3 (GreenSock Animation Platform) orchestrating multi-step timelines, matrix transformations, and 3D card flips.
* **Rendering & Simulation:** Pure HTML5 2D Canvas engine driving high-resolution paparazzi flash bursts, particle blooms, and dynamic gold dust simulation.
* **Acoustic Engineering:** Web Audio API procedural shutter synthesis paired with base64-embedded audio decoders for zero-network-dependency tactile feedback.
* **Serverless Backend:** Google Apps Script Web App acting as a microservice gateway with concurrent write protection (`LockService`).
* **Database & Persistence:** Google Spreadsheet integration (`CL MEET 26-27`) with automatic column initialization and client-side `localStorage` caching.
* **Continuous Integration / Continuous Delivery (CI/CD):** Native GitHub Actions pipeline (`deploy.yml`) compiling and publishing production bundles to GitHub Pages on every `main` push.

---

## Engineering Deep-Dive: How It Works

### 1. Stage 0: The Met Gala Royal Reveal (Preloader)
Prior to revealing the summons, a lightweight radial illumination filament tracks asset readiness. Once resolved, the preloader dissolves within 350ms, triggering the ambient spotlight environment and mounting the interactive 3D envelope.

### 2. Stage 1: 3D Skew-Morphic Envelope & Wax Seal Unboxing
* The digital envelope is constructed entirely using CSS 3D transform matrices with a 1000px perspective horizon.
* Tapping the physical wax medallion (`#wax-seal`) initiates a choreographed GSAP sequence:
  1. The seal fractures and scales down with an exponential alpha fade.
  2. The upper envelope flap unfolds along the X-axis (`rotateX(-180deg)`).
  3. The formal ivory parchment ascends from the envelope pocket.
  4. A coordinated multi-camera paparazzi barrage fires across top, bottom, and lateral quadrants, accompanied by an authentic optical shutter sound.
  5. The envelope gracefully recedes, transitioning pointer events to the main invitation portal.

### 3. Stage 2: Institutional Brand Trio & Hierarchy
The top banner establishes clear academic and cultural authority:
* **Left:** The circular **Samanvay Official Emblem** in black-and-gold bezel.
* **Center:** The **Thakur Specialized Degree College (TSPDC)** crest—the dominant host institution—rendered prominently with ambient golden drop-shadows.
* **Right:** The **TCET Deemed to be University** vector logo, extracted from source SVG with complete statutory statements (*"Mindset of an Entrepreneur"* & UGC declaration), seamlessly blended with transparent alpha backing.

### 4. Stage 3: The Haute Couture Editorial Showcase
Presents the cultural mandate of the conclave:
* **The Sartorial Code:** Detailed requirements mandating Met Gala elegance and haute couture outfits for all attending Contingent Leaders (CLs) and Assistant Contingent Leaders (ACLs).
* **Schedule & Dossier:** An interactive overview of the conclave flow, panel sessions, and hospitality itinerary.

### 5. Stage 4: 4-Step Progressive Accreditation Portal
College leaders complete accreditation through an intuitive multi-stage stepper:
* **Step 1 — Institution Identification:** Predictive college selection with custom institution overrides.
* **Step 2 — Contingent Leader (CL):** Name, validated 10-digit Indian contact number, and optional ID badge photo upload.
* **Step 3 — Assistant Contingent Leader (ACL):** Distinct credential capture with client-side mobile number collision detection.
* **Step 4 — Live Review Place Card:** Real-time generation of an editorial luxury place card displaying credentials before submission.

### 6. Stage 5: Asynchronous Dual-Dispatch Backend
To completely circumvent browser cross-origin redirect limitations (HTTP 302 from `script.google.com` to `script.googleusercontent.com` without CORS headers), the system uses an innovative **dual-dispatch transport strategy**:
1. **Guaranteed Delivery Channel:** Dispatches the JSON payload using `mode: 'no-cors'`. The browser automatically follows Google’s redirect without preflight rejection, ensuring that registration data is written to the sheet under all network conditions.
2. **Fast Opportunistic Channel:** Simultaneously executes a standard request capped by an `AbortController` timeout (3.5s) to read deduplication status when CORS permits.
3. **Local Cache Mirroring:** Writes issued credentials to browser `localStorage`, ensuring offline retrieval and immediate pass re-issuance upon page reload.

### 7. Stage 6: 3D Card Flip & Canvas VIP Pass Minting
* Upon confirmation, the form container executes a 180° Y-axis flip to reveal the **24K Liquid Gold VIP Pass**.
* **High-Res Canvas Generation (1200×675):** The client-side canvas engine renders a print-ready delegation credential pass, drawing the Samanvay emblem, vertical TSPDC shield crest, credential reference code (`METGALA-VIP-CL-XXX`), and delegation details with mathematical gutter symmetry.
* **Single-Click Actions:** Instant PNG download, RFC-5545 compliant `.ics` calendar file generation with alarm triggers, and direct WhatsApp sharing.

---

## Technical Craftsmanship & Engineering Effort

Building this platform required extensive technical refinement, performance profiling, and algorithmic fine-tuning:

### 1. GPU Compositor Acceleration vs. Layout Thrashing
* **The Problem:** The initial botanical rose petal animations relied on animating CSS `top` across viewport heights. This triggered continuous layout recalculations and style recalculations on every frame, causing noticeable frame drops and scroll stutter on lower-tier mobile hardware.
* **The Solution:** Completely re-engineered `@keyframes fallRealisticBlossom` and `fallRealisticPetal` to utilize hardware-accelerated 3D vector translations (`transform: translate3d(x, y, 0)`). This shifted the entire animation pipeline to GPU compositor layers, reducing CPU main-thread utilization to near zero during scroll.

### 2. Low-End Mobile Optimization & Resource Management
To ensure a fluid 60fps experience on devices with 2–4 GB RAM:
* **Selective Frame Decoupling:** Added `content-visibility: auto; contain-intrinsic-size: auto 550px;` to all offscreen sections (Schedule, Dossier, Dress Code, FAQ, and Footer). The browser defers layout and rendering of these blocks until the user scrolls within proximity.
* **Pointer-Decoupled Cursor Loop:** The custom cursor `requestAnimationFrame` loop is strictly guarded behind `window.matchMedia('(pointer: fine)')`. On touchscreens, the loop is completely bypassed, saving 60–120 DOM style updates per second.
* **Dynamic Canvas DPR Capping:** Automatically caps the paparazzi canvas Device Pixel Ratio to `1.25` on mobile (down from 3x on high-density displays), cutting per-frame pixel rasterization load by more than 50%.
* **Self-Terminating Particle Systems:** The full-screen gold dust canvas automatically halts its animation loop and releases its memory allocation as soon as the envelope stage is completed or skipped.
* **Mobile Tap Latency Elimination:** Integrated `touch-action: manipulation;` and disabled 300ms tap-delay heuristics across all buttons, inputs, and interactive controls.

### 3. Precision Typographic Baseline Engineering
* **The Challenge:** Proportional old-style numerals in luxury serif fonts often exhibit varying baselines, causing numbers like `26-27` in fest titles and ref codes to appear misaligned or visually "droop".
* **The Solution:** Implemented OpenType feature switches (`font-feature-settings: "lnum" 1, "tnum" 1`) and mapped numerals to *Cinzel* lining figures. This guarantees uniform x-height, flat baselines, and tabular alignment across all viewports.

### 4. Interactive Submit Loading Architecture
To eliminate user uncertainty during serverless transmission:
* Clicking the confirmation button immediately engages pointer-event locks and activates a dual-tone CSS gold spinner.
* JavaScript timers progressively advance the label from *"Accreditating Delegation..."* to *"Transmitting to CL Protocol..."* to *"Minting Sovereign VIP Pass..."*, providing clear, reassuring feedback that the system is actively working.

---

## Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml              # Automated GitHub Pages CI/CD workflow
├── assets/
│   ├── TCET_Deemed_Natural_Logo.svg# Official natural vector logo of TCET University
│   ├── tspdc-crest-vertical.png    # Vertical 1:1 transparent TSPDC shield crest
│   ├── samanvay-official-logo.jpg  # Official Samanvay circular insignia
│   ├── seal.jpg                    # High-resolution wax seal texture
│   ├── logo.png                    # Institutional horizontal crest
│   ├── met-gala-poster.jpg         # Visual brand reference artwork
│   └── audio/
│       ├── shutterBase64.js        # Base64 fallback acoustic shutter data
│       ├── shutter.mp3             # High-fidelity optical camera click
│       └── shutter.ogg             # Low-latency compressed audio
├── google-apps-script.js           # Serverless backend logic with LockService
├── GOOGLE_SHEETS_SETUP.md          # Comprehensive backend configuration manual
├── index.html                      # Semantic single-page application structure
├── package.json                    # Project dependencies and compilation scripts
├── public/
│   └── .nojekyll                   # GitHub Pages static asset routing override
├── script.js                       # Primary application runtime, kinematics & pass canvas
├── src/
│   └── services/
│       └── googleSheets.js         # Asynchronous dual-dispatch transmission service
├── style.css                       # Haute couture styling system & GPU keyframe animations
├── tsconfig.json                   # TypeScript compiler configuration
└── vite.config.ts                  # Vite build configuration with relative base routing
```

---

## Brand & Administrative Credits

* **Organizing Body:** Samanvay 2026–2027 Student Council & Secretarial Board
* **Host Institution:** Thakur Specialized Degree College (TSPDC), Kandivali (West), Mumbai — 400 067
* **Academic Partner:** Thakur College of Engineering & Technology (TCET Deemed to be University)
* **Student Secretariat Lead:** Harsh Dubey — `+91 93215 21258`
* **Conclave Venue:** Ground Floor Seminar Hall, Thakur Educational Campus

---

## License

This software and its associated design assets are developed exclusively for **Samanvay 2026–2027** at **Thakur Specialized Degree College (TSPDC)**. All rights reserved. Intellectual property of branding and institutional insignias belongs to their respective entities.
