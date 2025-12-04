


<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=220&text=PowebPoint%20🎬&fontAlign=50&fontAlignY=40&color=0:7c3aed,50:ec4899,100:f97316&animation=twinkling&fontColor=ffffff&desc=Web-based%20Slide%20Cinema&descAlignY=70&descAlign=50" width="100%" alt="PowebPoint header" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&size=20&duration=2600&pause=1100&color=F97316&center=true&vCenter=true&width=560&lines=HTML+%2B+CSS+%2B+JS+slide+engine;Grid+overview+%2B+Fullscreen+presentation;Keyboard+navigation+like+a+media+player;Per-slide+CSS+animations+%F0%9F%8E%A5" alt="PowebPoint typing intro" />
</p>

<p align="center">
  <a href="https://0xradikal.github.io/powebpoint">
    <img src="https://img.shields.io/badge/Live_Demo-GitHub_Pages-22c55e?style=for-the-badge&logo=github" alt="Live demo" />
  </a>
  <a href="https://github.com/0xradikal/powebpoint">
    <img src="https://img.shields.io/badge/Repo-powebpoint-6366f1?style=for-the-badge&logo=github" alt="Repo" />
  </a>
  <a href="https://github.com/0xradikal">
    <img src="https://img.shields.io/badge/Made_by-Radikal.eth-ec4899?style=for-the-badge&logo=ethereum" alt="Author" />
  </a>
  <img src="https://img.shields.io/badge/Stack-HTML%20%7C%20CSS%20%7C%20JS-0ea5e9?style=for-the-badge" alt="Stack" />
  <img src="https://img.shields.io/badge/Mode-Web_Presentation-14b8a6?style=for-the-badge" alt="Mode" />
</p>

---

> **PowebPoint** is a web-native, PowerPoint-inspired slide cinema:  
> present directly from your browser with **grid overview**, **topic menu**, **fullscreen mode**, **keyboard navigation**, and **per-slide CSS animations** — no `.pptx` export needed.

> _این پروژه برای جایگزینی پاورپوینتِ کلاسیک در ارائه‌های دانشگاهی طراحی شده؛ ولی راحت می‌تونی تو هر جایی ازش استفاده کنی._

---

## 🧠 TL;DR

- 🎬 **Present like a movie**: one click → fullscreen, fade-in slides, arrow keys to navigate  
- 🧱 **Pure front-end**: just HTML + CSS + JS, perfect for classrooms and offline use  
- 🧭 **Grid + topics**: see all slides at once, jump by section name or number  
- 🔗 **URL-aware**: each slide has a hash (`#slide-3`) so refresh & deep-links just work  
- 🖨 **Print to PDF**: `Ctrl+P` → each slide becomes a page (for teachers & submissions)

---

## 🧩 Feature Matrix

| Area                 | What you get                                                        | Status |
|----------------------|---------------------------------------------------------------------|--------|
| Grid overview        | Responsive gallery of slides with hover state & click-to-open      | ✅     |
| Presentation mode    | Fullscreen, dark chrome, focused slide viewport                    | ✅     |
| Keyboard navigation  | `←`, `→`, `Home`, `End`, `Esc` support                             | ✅     |
| Topic menu           | Buttons generated from `data-topic` attributes                     | ✅     |
| URL hash sync        | `#slide-id` in URL for refresh & deep-linking                      | ✅     |
| Per-slide animation  | CSS `data-transition` variants like `fade-in-up`, `scale-in`       | ✅     |
| Print / PDF          | `@media print` CSS: each slide = one page                          | ✅     |
| Themes               | Light/dark/academic presets                                        | 🕓 planned |
| JSON slide source    | Define slides in JSON → auto-generate HTML                         | 🕓 planned |
| Presenter notes      | Second-screen view with next slide & notes                         | 🕓 planned |

---

## 🧱 Project Structure

```text
powebpoint/
├─ index.html          # Main app: overview grid + presentation area
├─ styles.css          # Layout, themes, transitions, print rules
├─ slides.js           # Navigation, fullscreen, URL sync, menus
├─ assets/
│  ├─ fonts/           # Optional local fonts
│  └─ images/          # Backgrounds, logos, slide art
└─ docs/
   ├─ cover.png
   ├─ demo-overview.gif
   └─ demo-presentation.gif
````

> [!NOTE]
> You can use **GitHub Pages**, **Vercel**, **Netlify**, or just open `index.html` directly.
> No build step is required.

---

## 🚀 Getting Started

### 1. Clone

```bash
git clone https://github.com/0xradikal/powebpoint.git
cd powebpoint
```

### 2. Run locally

```bash
# Option A – Python static server
python -m http.server 8000

# Option B – Node static server
npx serve .

# Then open:
# http://localhost:8000
```

### 3. Start the show

1. Open the site
2. Scroll the **grid overview** and pick a slide
3. Hit the **“Start presentation”** button
4. Use your **keyboard** to drive the talk 🎤

---

## 🎬 Slide Anatomy

Each slide is a semantic `<section>` with an ID, topic, and transition:

```html
<main id="powebpoint">

  <!-- Grid overview -->
  <section class="overview" aria-label="Slide grid">
    <!-- Thumbnails link to #slide-1, #slide-2, ... -->
  </section>

  <!-- Presentation area -->
  <section class="presentation" aria-live="polite">

    <section class="slide is-active"
             id="slide-1"
             data-topic="Introduction"
             data-transition="fade-in-up">
      <h1>System Analysis &amp; Design</h1>
      <p>From problem definition to feasibility analysis.</p>
    </section>

    <section class="slide"
             id="slide-2"
             data-topic="Concept Phase"
             data-transition="scale-in">
      <h2>Concept phase</h2>
      <ul>
        <li>Identify the problem precisely</li>
        <li>Explore possible design procedures</li>
      </ul>
    </section>

    <!-- more slides -->
  </section>
</main>
```

### 🧭 Topic Menu

PowebPoint can build a topic bar from `data-topic`:

```html
<nav class="topic-menu" aria-label="Topics">
  <!-- Example rendered structure:
  <button data-target="#slide-1" class="active">Introduction</button>
  <button data-target="#slide-2">Concept Phase</button>
  -->
</nav>
```

---

## 🎹 Keyboard Cheat Sheet

| Key             | Action                         |
| --------------- | ------------------------------ |
| `→`, `PageDown` | Next slide                     |
| `←`, `PageUp`   | Previous slide                 |
| `Home`          | Jump to first slide            |
| `End`           | Jump to last slide             |
| `Enter` (opt.)  | Start presentation mode        |
| `Esc`           | Exit presentation / fullscreen |

> [!TIP]
> Bind `Space` or `N` to `nextSlide()` if you like TED-style controls.

---

## 🧠 Core Logic (High-level)

```js
// slides.js – simplified outline

const slides = Array.from(document.querySelectorAll('.slide'));
let currentIndex = 0;

function goToSlide(index, { updateHash = true } = {}) {
  if (index < 0 || index >= slides.length) return;

  slides[currentIndex].classList.remove('is-active');
  currentIndex = index;
  slides[currentIndex].classList.add('is-active');

  if (updateHash) {
    history.replaceState(null, '', `#${slides[currentIndex].id}`);
  }

  updateStatusBar();
  highlightTopicMenu();
}

function nextSlide()  { goToSlide(currentIndex + 1); }
function prevSlide()  { goToSlide(currentIndex - 1); }

function startPresentation() {
  const root = document.documentElement;

  if (root.requestFullscreen) {
    root.requestFullscreen();
  }
  document.body.classList.add('presentation-mode');
}

function stopPresentation() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
  document.body.classList.remove('presentation-mode');
}

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowRight':
    case 'PageDown':
      nextSlide();
      break;
    case 'ArrowLeft':
    case 'PageUp':
      prevSlide();
      break;
    case 'Home':
      goToSlide(0);
      break;
    case 'End':
      goToSlide(slides.length - 1);
      break;
    case 'Escape':
      stopPresentation();
      break;
  }
});
```

---

## 🌈 Animations & Transitions

PowebPoint is built around **CSS transitions + keyframes**:

```css
.slide {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.4s ease-out,
    transform 0.4s ease-out;
}

.slide.is-active {
  opacity: 1;
  transform: translateY(0);
}

/* Variants based on data-transition */

.slide[data-transition="fade-in-up"].is-active {
  animation: fade-in-up 0.45s ease-out both;
}

.slide[data-transition="scale-in"].is-active {
  animation: scale-in 0.45s ease-out both;
}

.slide[data-transition="slide-from-left"].is-active {
  animation: slide-from-left 0.45s ease-out both;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes slide-from-left {
  from { opacity: 0; transform: translateX(-24px); }
  to   { opacity: 1; transform: translateX(0); }
}
```

> [!TIP]
> Create your own `data-transition` presets (`blur-in`, `slide-from-bottom`, `rotate-fade`) and apply them per slide.

---

## 🖨 Print / PDF Mode

For teachers, submissions, or offline review, PowebPoint doubles as a PDF generator:

```css
@media print {
  body {
    background: #ffffff;
  }

  .overview,
  .controls,
  .topic-menu {
    display: none !important;
  }

  .presentation {
    display: block;
  }

  .slide {
    page-break-after: always;
    min-height: 100vh;
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
  }
}
```

* `Ctrl + P` → **Save as PDF**
* Each slide = **one page**
* Clean, white background for printing

---

## 🗺 Roadmap

```text
[■■■■■■□□□□] 60% – MVP web slide engine
```

* [x] Grid overview
* [x] Fullscreen presentation mode
* [x] Keyboard navigation
* [x] Topic menu
* [x] URL hash sync
* [x] Print / PDF support
* [ ] Theming system (light / dark / academic)
* [ ] JSON slide definitions
* [ ] Presenter notes view
* [ ] Simple CLI to export slides

---

## 💡 Origin Story

PowebPoint started as a **university project**:

> “Can we build something *like* PowerPoint,
> but completely in **HTML + CSS + JS**,
> and actually show it **inside the browser**, not as a `.pptx`?”

Goals:

* be **hackable** (you can read & modify all of it in one night)
* be **offline-friendly** (works in class without internet)
* be **reusable** (future talks, meetups, or courses)

---

## 👤 Author

**Mohammad Shirvani (Radikal)**
Web3 Researcher • Security Engineer • Frontend Developer

<p align="center">
  <a href="https://github.com/0xradikal">
    <img src="https://img.shields.io/badge/GitHub-0xradikal-000000?style=for-the-badge&logo=github" alt="GitHub" />
  </a>
  <a href="https://x.com/0xradikal">
    <img src="https://img.shields.io/badge/X-@0xradikal-111827?style=for-the-badge&logo=x" alt="X" />
  </a>
  <a href="https://radikal.eth.limo">
    <img src="https://img.shields.io/badge/ENS-radikal.eth-6366f1?style=for-the-badge&logo=ethereum" alt="ENS" />
  </a>
</p>

---

## 📜 License

Released under the **MIT License**.
Feel free to fork, remix, and use PowebPoint for your own talks, courses, or cinematic slide decks.

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=140&section=footer&color=0:f97316,50:ec4899,100:6366f1&animation=twinkling" width="100%" alt="footer" />
</p>