
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=220&text=Radikal%20Presenter%20&fontAlign=50&fontAlignY=40&color=0:7c3aed,50:ec4899,100:f97316&animation=twinkling&fontColor=ffffff&desc=3D-first%20Web%20Presentation%20Studio&descAlignY=70&descAlign=50" width="100%" alt="Radikal Presenter header" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&size=20&duration=2600&pause=1100&color=F97316&center=true&vCenter=true&width=720&lines=3D+carousel+%2B+focus+presentation+mode;Modular+slide+builder+with+2D+%26+3D+preview;Full+RTL%2FLTR+support+(Farsi+%2B+English);Keyboard%2C+mouse+%26+touch+friendly+interactions" alt="Radikal Presenter typing intro" />
</p>

<p align="center">
  <a href="https://github.com/0xRadikal/PoWeb-Point">
    <img src="https://img.shields.io/badge/Repo-PoWeb--Point-6366f1?style=for-the-badge&logo=github" alt="Repo" />
  </a>
  <a href="https://github.com/0xradikal">
    <img src="https://img.shields.io/badge/Made_by-Radikal.eth-ec4899?style=for-the-badge&logo=ethereum" alt="Author" />
  </a>
  <img src="https://img.shields.io/badge/Stack-React%20%7C%20TS%20%7C%20Three.js-0ea5e9?style=for-the-badge" alt="Stack" />
  <img src="https://img.shields.io/badge/Mode-3D_Web_Presentation-14b8a6?style=for-the-badge" alt="Mode" />
</p>

---

> **Radikal Presenter** is a 3D-first, web-native presentation studio with a built-in slide builder, dual 3D modes, and full Farsi/English support.  
> It’s designed to feel like a **cinematic slide engine**, not just “PowerPoint in the browser”.

> _این پروژه برای ارائه‌های مدرن و حرفه‌ای طراحی شده؛ هم برای کلاس و دانشگاه، هم برای دموهای فنی و پرزنت‌های سطح بالا._

---

## 🧠 TL;DR

- 🎥 **3D presentation engine**: carousel overview + focused/zoomed mode  
- ✏️ **Slide builder**: modular editor with 2D & 3D preview and per-slide settings  
- 🌍 **RTL + LTR**: واقعی، برای فارسی و انگلیسی؛ فقط برعکس کردن جهت نیست  
- 🧩 **Modular slide types**: hero, grid, list, timeline, feature, comparison, gallery, content+image, heavy-content, …  
- ♻️ **History & reset**: full undo/redo + “reset to default deck” in one click  
- 📱 **Fully responsive**: works on desktop, tablet, and mobile (including builder & user guide)

---

## 🧩 Feature Matrix

| Area                      | What you get                                                                 | Status |
|---------------------------|------------------------------------------------------------------------------|--------|
| 3D carousel               | Spatial ring of slides with drag / scroll / keyboard rotation               | ✅     |
| Focus 3D mode             | Camera zooms in on the active slide with refined framing                    | ✅     |
| Presentation mode         | Fullscreen slide view with controls + keyboard navigation                   | ✅     |
| Quick Start               | Start presentation from slide 1, regardless of current focus                | ✅     |
| Slide builder             | Sections + slides + per-slide types and properties                          | ✅     |
| 2D preview                | Exact layout preview for each slide                                         | ✅     |
| 3D preview tab            | Live 3D preview inside the builder (with Free / Real camera toggle)         | ✅     |
| Advanced slide types      | Hero, grid, bullet, list, timeline, feature, comparison, gallery, etc.      | ✅     |
| Heavy content slides      | Types for long text + optional image with dynamic font scaling              | ✅     |
| Markdown content          | `#`, `##`, lists, code blocks, etc. inside slides                           | ✅     |
| RTL/Farsi support         | Full UI + slides localization and proper mirroring                          | ✅     |
| Alignment controls        | Per-slide/item left/center/right, synced with RTL/LTR and images            | ✅     |
| Undo / Redo               | Full-history undo/redo for text, images, layout, and settings               | ✅     |
| Global Reset              | Restore default deck & config (keep only language + theme)                  | ✅     |
| Built-in User Guide       | In-app documentation, accessible on all screen sizes                        | ✅     |
| 3D camera config          | Advanced controls for both 3D modes (distance, tilt, orbit, FOV, easing)    | ✅     |
| Security hardening        | URL validation, file size/type checks, markdown XSS mitigation              | ✅     |
| Testing & CI              | Vitest unit tests + ESLint + typecheck, wired into GitHub Actions CI        | ✅     |
| Export (PDF/PPTX)         | Export flows (PDF / PPTX / JSON)                                            | 🕓 planned |

---

## 🧱 Tech Stack

> Exact versions live in `package.json`.

- **Framework:** React 18 (Vite-powered single-page app — no server framework)
- **Language:** TypeScript
- **Build tool:** Vite
- **3D Engine:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Animations:** Framer Motion
- **Styling:** Tailwind CSS via CDN (utility-first, responsive)
- **State Management:** Custom store (`core/store.tsx`) with undo/redo history
- **Persistence:** `localStorage` (+ debounced saves)
- **Markdown:** React Markdown with safe configuration
- **PWA:** Service worker (`public/sw.js`) + web app manifest
- **Tooling:** ESLint (flat config) + Vitest + GitHub Actions CI

---

## 🗂 Project Structure (High-level)

```text
PoWeb-Point/
├─ index.html             # App entry HTML (loads Tailwind CDN + module script)
├─ index.tsx              # React bootstrap (mounts <App/> inside ErrorBoundary)
├─ App.tsx                # Root component: modes, canvas, keyboard nav
├─ register-sw.ts         # Service worker registration
│
├─ core/
│  ├─ store.tsx           # Global state, history (undo/redo), camera & config
│  ├─ constants.ts        # Default deck, fonts, camera config, i18n dictionary
│  ├─ types.ts            # Shared TypeScript types
│  ├─ id.ts               # Collision-safe id generator (crypto.randomUUID + fallback)
│  ├─ id.test.ts          # Vitest unit tests for id generation
│  └─ three-jsx.d.ts      # R3F JSX type augmentation
│
├─ modules/
│  ├─ builder/
│  │  ├─ Builder.tsx       # Main builder shell
│  │  ├─ EditorPanels.tsx  # General / Content / Design / Animation panels
│  │  ├─ SlideEditor.tsx   # Slide editing surface
│  │  └─ SlideManager.tsx  # Sections + slides outline / management
│  │
│  ├─ presentation/
│  │  ├─ SlideRenderer.tsx   # 2D slide renderer
│  │  ├─ SlideTemplates.tsx  # 2D templates for each slide type
│  │  └─ SlideViewer.tsx     # Presentation-mode slide viewer
│  │
│  └─ three/
│     ├─ Scene.tsx          # Three.js scene + global camera logic
│     ├─ Carousel.tsx       # 3D carousel layout & interactions
│     ├─ SlideCard.tsx      # Slide card mesh (geometry + materials)
│     └─ SlideContent3D.tsx # 3D slide content rendering (text, tags, effects)
│
├─ components/
│  ├─ Builder/
│  │  └─ UserGuide.tsx     # In-app documentation (EN/FA)
│  ├─ Presentation/
│  │  ├─ ProgressBar.tsx   # Presentation progress indicator
│  │  └─ Sidebar.tsx       # Slide list / navigation sidebar
│  └─ UI/
│     ├─ Common.tsx        # Shared UI primitives
│     ├─ ErrorBoundary.tsx # Top-level React error boundary
│     └─ ThemeToggle.tsx   # Light / dark theme switch
│
├─ public/                 # Static assets (icons, sw.js, manifest.webmanifest)
├─ android-twa/            # Trusted Web Activity (Android) wrapper config
├─ eslint.config.js        # ESLint flat config
├─ vite.config.ts          # Vite build config
└─ .github/workflows/ci.yml # CI: typecheck → lint → test → build
```

---

## 🚀 Getting Started

### 1. Clone

```bash
git clone https://github.com/0xRadikal/PoWeb-Point.git
cd PoWeb-Point
```

### 2. Install dependencies

```bash
npm install
```

### 3. Development

```bash
npm run dev
# open http://localhost:3000
```

### 4. Production

```bash
npm run build      # outputs a static bundle to dist/
npm run preview    # serve the built dist/ locally to smoke-test
```

> This is a static single-page app — the production build in `dist/` can be served
> by any static host (Cloudflare Pages, Netlify, GitHub Pages, nginx, …). There is
> no Node server to run.

### 5. Useful scripts

* `npm run dev` – Vite dev server with hot reload (http://localhost:3000)
* `npm run build` – Production build to `dist/`
* `npm run preview` – Serve the built `dist/` bundle locally
* `npm run typecheck` – TypeScript type checking (`tsc --noEmit`)
* `npm run lint` – ESLint over the whole project
* `npm run lint:strict` – ESLint with `--max-warnings=0`
* `npm run lint:fix` – ESLint with autofix
* `npm run test` – Run unit tests once (Vitest)
* `npm run test:watch` – Run unit tests in watch mode
* `npm run check` – typecheck + lint + test (used by CI)

---

## 🎮 Core Concepts & Usage

### 1. Modes

Radikal Presenter has three main “modes”:

1. **Dashboard / 3D Overview**

   * See all slides in a 3D carousel
   * Drag (mouse/touch) or scroll to rotate
   * Double-click the active slide to focus or enter presentation

2. **Builder**

   * Full slide editor with Outline + Properties
   * 2D & 3D preview for each slide
   * Fine-grained control over content, design, animation, and 3D configuration

3. **Presentation**

   * Fullscreen, focused slide view
   * Driven by keyboard, mouse, or touch
   * Clean chrome, ready for live talks

You can move between these modes from the main UI, and on mobile from the hamburger menu.

---

### 2. Slide Builder

Inside the **Builder**:

* **Outline panel**

  * Sections + slides tree
  * Reorder slides (up/down), duplicate, delete
  * Works in EN + FA with proper RTL mirroring

* **Properties panel**

  * Collapsible groups (default closed):

    * General Info
    * Content
    * Design
    * Animation
    * 3D Engine
  * Per-slide type fields:

    * Title, subtitle, content (Markdown)
    * Items (for grid/list/feature/comparison/gallery)
    * Optional image toggle (upload or URL)
    * Typography: sans / serif / mono, with dynamic scaling
    * Alignment: left / center / right, synced with RTL/LTR
    * Colors, gradients, borders, radius, shadows

* **2D preview**

  * Shows the real layout
  * Auto font scaling for long content to avoid scrollbars where possible

* **3D preview**

  * “Free” camera: explore scene freely
  * “Real” camera: preview exactly how 3D mode behaves
  * Two 3D states (carousel & focus) available for inspection

---

### 3. 3D Mode & Interactions

#### Carousel

* Drag with mouse / swipe with touch to rotate the ring of slides
* Scroll wheel (or trackpad) to move forward/backward
* Active slide is always centered & slightly enlarged
* Decorative effects (tech network / dots & lines / low poly) applied consistently

#### Focus

* Click / double-click the centered slide to focus
* Camera moves closer with smooth ease-in/out and refined framing

#### Quick Start & Info

* **Quick Start** always starts presentation from **slide 1**
* **Info button** opens a panel with:

  * Avatar (GitHub profile image)
  * Name: *Mohammad Shirvani (Radikal / محمد شیروانی)*
  * Links: GitHub, X, Telegram

---

### 4. Presentation Mode

* **Keyboard navigation**

| Key           | Action                                          |
| ------------- | ----------------------------------------------- |
| `→`           | Next slide                                      |
| `←`           | Previous slide                                  |
| `Space`       | Next slide (presentation mode)                  |
| `Enter`       | Enter presentation from 3D / focus mode         |
| `Esc`         | Exit presentation and return to the 3D overview |

* **Mouse / touch**

  * Click arrows or on-screen controls
  * Swipe on touch devices

* **Hamburger menu**

  * Back to 3D mode
  * Jump directly to Builder for the current slide (including mobile)

---

## 🌍 Localization & RTL

Radikal Presenter is built as **two real experiences**: English (LTR) and Farsi (RTL).

* Language toggle:

  * Switches **all** labels, buttons, panels, and guide content
  * Adjusts direction, alignment, and layout mirroring
* Slides:

  * Content, lists, and images reflow logically
  * For example, in RTL mode text might be on the right and image on the left, and vice versa for LTR
* Builder:

  * No overlaps between buttons and text in Farsi
  * Outline / Properties / toggles remain fully usable in RTL
  * All slide types (grid, bullet, hero, timeline, list, feature, comparison, gallery, content+image, …) are RTL-aware

> **Goal:** In Persian, it should feel like a first-class Farsi tool, نه فقط ترجمه‌ی نصفه‌نیمه.

---

## ♻️ History, Reset & Safety

* **Undo & Redo**

  * Works for:

    * Text edits inside slides
    * Adding/removing slides
    * Changing slide type
    * Image attach/remove
    * Alignment changes
    * 3D config tweaks
  * Designed as a “professional” full-history stack

* **Reset to Default**

  * Returns the entire presentation to the **original default deck**
  * Restores default slides, content, and configs
  * Keeps only:

    * Current language (EN / FA)
    * Current theme (light / dark)

* **Persistence**

  * Slides and configs stored in localStorage
  * Debounced writes to avoid performance issues
  * Guarded by try/catch to avoid app crashes from corrupted data

---

## 🔐 Security & Stability Notes

* **URL validation**

  * External image/link URLs are validated against a safe protocol list (http/https)

* **File uploads**

  * Max file size limits
  * Basic type checks to avoid obviously invalid uploads

* **Markdown**

  * Rendered with harmful HTML disabled
  * Prevents simple XSS vectors while keeping headings/lists/code

* **3D resource management**

  * WebGL context cleanup, geometry/material disposal
  * Avoids `THREE.WebGLRenderer: Context Lost.` issues as much as possible

---

## 📚 User Guide

The in-app **User Guide** explains:

* Modes (Dashboard / Builder / 3D / Presentation)
* Slide types and when to use each
* How to build a deck from scratch
* How to work in Farsi vs English
* Keyboard shortcuts & mobile-specific hints
* Reset, history, and safety tips

It is:

* Modular (implemented as its own module/file)
* Accessible from **all platforms**, including mobile
* Fully responsive and readable on small screens

---

## 🇮🇷 راهنمای خیلی کوتاه (فارسی)

* با دکمه‌ی **تغییر زبان**، بین فارسی و انگلیسی جابه‌جا شو.
* در حالت فارسی:

  * کل رابط کاربری، منوها، بیلدر و یوزرگاید فارسی و راست‌چین می‌شوند.
  * اسلایدها برای متن فارسی بهینه شده‌اند (بدون اورفلو تا جای ممکن).
* برای ساخت یک پرزنتیشن:

  1. از **Dashboard** وارد **Builder** شو.
  2. سکشن و اسلایدهای جدید اضافه کن، نوع اسلاید رو انتخاب کن.
  3. متن، عکس، رنگ، فونت و انیمیشن رو تنظیم کن.
  4. در تب‌های **2D Preview** و **3D Preview** نتیجه رو ببین.
  5. با **Quick Start** از اسلاید ۱ وارد حالت پرزنتیشن شو.

---

## 👤 Author

**Mohammad Shirvani (Radikal / محمد شیروانی)**
Web3 Researcher • Security Engineer • Frontend / 3D Presentation Developer

<p align="center">
  <a href="https://github.com/0xradikal">
    <img src="https://img.shields.io/badge/GitHub-0xradikal-000000?style=for-the-badge&logo=github" alt="GitHub" />
  </a>
  <a href="https://x.com/0xRadikal">
    <img src="https://img.shields.io/badge/X-@0xRadikal-111827?style=for-the-badge&logo=x" alt="X" />
  </a>
  <a href="https://t.me/OxRadikal">
    <img src="https://img.shields.io/badge/Telegram-@OxRadikal-26A5E4?style=for-the-badge&logo=telegram" alt="Telegram" />
  </a>
  <a href="https://radikal.eth.limo">
    <img src="https://img.shields.io/badge/ENS-radikal.eth-6366f1?style=for-the-badge&logo=ethereum" alt="ENS" />
  </a>
</p>

---

## 📜 License

Released under the **MIT License**.
You are free to fork, modify, and use Radikal Presenter for your own talks, courses, demos, or even to ship your own 3D presentation SaaS.

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=140&section=footer&color=0:f97316,50:ec4899,100:6366f1&animation=twinkling" width="100%" alt="footer" />
</p>
