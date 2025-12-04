


<p align="center">
  <img src="./docs/cover.png" alt="PowebPoint cover" width="480" />
</p>

<h1 align="center">🎬 PowebPoint</h1>
<h3 align="center">Turn HTML, CSS & JS into a cinematic, PowerPoint-style web presentation.</h3>

<p align="center">
  <a href="https://github.com/<your-username>/powebpoint">
    <img src="https://img.shields.io/badge/status-experimental-ff6b81.svg?style=for-the-badge" alt="status" />
  </a>
  <img src="https://img.shields.io/badge/html-css%20%7C%20js-4c6fff?style=for-the-badge" alt="stack" />
  <img src="https://img.shields.io/badge/mode-web%20presentation-00c896?style=for-the-badge" alt="mode" />
  <img src="https://img.shields.io/badge/made%20by-radikal.eth-7b2cff?style=for-the-badge" alt="author" />
</p>

<p align="center">
  <i>Forget static <code>.pptx</code> files. Present like a movie, straight from your browser.</i>
</p>

---

## ✨ What is PowebPoint?

PowebPoint is a **web-based presentation engine** that:

- shows all slides in a **grid overview**
- jumps into a **fullscreen "cinema" mode**
- supports **keyboard navigation** like a media player
- gives each slide its **own animation** using CSS
- keeps URLs like `#slide-3` in sync so you can deep-link any slide

Perfect for:

- university presentations (like **System Analysis & Design**)
- tech talks
- portfolio-style story telling
- any place where PowerPoint feels too static

---

## 🎞 Live preview (placeholders)

> [!TIP]
> Replace these files with your own GIFs or screenshots for maximum effect.

```md
![PowebPoint – Grid overview](./docs/demo-overview.gif)
![PowebPoint – Presentation mode](./docs/demo-presentation.gif)
````

---

## 🎛 Feature overview

| Area                 | What you get                                         | Status     |
| -------------------- | ---------------------------------------------------- | ---------- |
| Grid overview        | Responsive slide gallery with quick jump             | ✅          |
| Presentation mode    | Fullscreen, focused, hides extra UI                  | ✅          |
| Slide navigation     | Buttons + keyboard (`←`, `→`, `Home`, `End`, `Esc`)  | ✅          |
| URL-aware slides     | Each slide gets a hash like `#slide-2`               | ✅          |
| Topic menu           | Jump between sections by topic name                  | ✅          |
| Per-slide animations | CSS-based transitions selected via `data-transition` | ✅          |
| Print to PDF         | Optional CSS so each slide becomes a page            | ✅          |
| Themes               | Light / dark and more                                | 🕓 planned |
| JSON slides          | Define slides in JSON and auto-generate              | 🕓 planned |

---

## 🧱 Project structure

```text
powebpoint/
├─ index.html          # Main app: grid + presentation area
├─ styles.css          # Layout, animations, themes, print rules
├─ slides.js           # Navigation, fullscreen, URL sync, menus
├─ assets/
│  ├─ fonts/
│  └─ images/
└─ docs/
   ├─ cover.png
   ├─ demo-overview.gif
   └─ demo-presentation.gif
```

> [!NOTE]
> This repo is **100% static**. You can host it on GitHub Pages, Netlify, Vercel, or just open `index.html` in a browser.

---

## 🚀 Getting started

### 1. Clone

```bash
git clone https://github.com/<your-username>/powebpoint.git
cd powebpoint
```

### 2. Run locally

```bash
# Easiest: Python static server
python -m http.server 8000

# or with Node:
npx serve .

# then open:
# http://localhost:8000
```

### 3. Open the show

* Visit the page
* Click on any slide from the **grid overview**
* Hit **“Start presentation”** (the big button)
* Enjoy **fullscreen cinema mode** 🎥

---

## 🧬 Slide anatomy

Each slide is a semantic `<section>` with an ID, topic, and transition:

```html
<main id="powebpoint">

  <!-- Grid overview -->
  <section class="overview" aria-label="Slide grid">
    <!-- clickable thumbnails go here -->
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
  </section>
</main>
```

### Topic menu

PowebPoint can build a topic bar from `data-topic`:

```html
<nav class="topic-menu" aria-label="Topics">
  <!-- Example:
  <button data-target="#slide-1" class="active">Introduction</button>
  <button data-target="#slide-2">Concept Phase</button>
  -->
</nav>
```

---

## 🎹 Keyboard cheat sheet

| Key             | Action                         |
| --------------- | ------------------------------ |
| `→`, `PageDown` | Next slide                     |
| `←`, `PageUp`   | Previous slide                 |
| `Home`          | Jump to first slide            |
| `End`           | Jump to last slide             |
| `Enter` (*)     | Optional: start presentation   |
| `Esc`           | Exit presentation / fullscreen |

> [!TIP]
> You can customize the keys in `slides.js` to match your own style.

---

## 🧠 Core logic (high-level)

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

function nextSlide() { goToSlide(currentIndex + 1); }
function prevSlide() { goToSlide(currentIndex - 1); }

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

document.addEventListener('keydown', event => {
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

## 🌈 Animations & transitions

PowebPoint is built around CSS animations, so you can style each slide’s entrance:

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

/* Transition variants */

.slide[data-transition="fade-in-up"].is-active {
  animation: fade-in-up 0.5s ease-out;
}

.slide[data-transition="scale-in"].is-active {
  animation: scale-in 0.5s ease-out;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}
```

> [!TIP]
> Add more transitions (e.g. `blur-in`, `slide-from-left`) and just set `data-transition="blur-in"` on the slide.

---

## 🧾 Print / PDF mode (optional)

PowebPoint can double as a PDF generator for your teacher:

```css
@media print {
  body {
    background: #fff;
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
    transform: none !important;
    opacity: 1 !important;
  }
}
```

* Hit **Print → Save as PDF**
* Each slide becomes one page
* Hand it in like a traditional slide deck if needed

---

## 🗺 Roadmap

* [x] Basic grid overview
* [x] Fullscreen presentation mode
* [x] Keyboard navigation
* [x] URL hash sync for slides
* [x] Topic menu
* [x] Print/PDF support
* [ ] Theming system (light/dark/academic)
* [ ] JSON-based slide definitions
* [ ] Presenter notes view
* [ ] CLI / script to export from source → static slides

---

## 💡 Origin story

PowebPoint started as a **university project**:

> “What if we could build something *like* PowerPoint,
> but **purely with HTML/CSS/JS**, and actually show that in the browser?”

It’s designed to be:

* hackable
* small
* exam-friendly
* and reusable for future talks & courses

Fork it, break it, restyle it, own it. 🎓

---

## 📜 License

MIT License – see [`LICENSE`](./LICENSE) for details.

```
```
