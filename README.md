# Radikal Presenter

Radikal Presenter is a high-end, 3D-enhanced presentation platform that replaces traditional slide decks with immersive web technologies. It features a spatial 3D carousel for overview and a focused presentation mode, complete with a built-in slide builder.

## Features

- **Immersive 3D Experience**: Navigate slides in a 3D space with smooth camera transitions between Overview and Focus modes.
- **Built-in Builder**: Create and edit slides directly in the app with a real-time preview (2D and 3D).
- **Rich Slide Types**: Hero, Article, Split Content, Timeline, Grid, Statistics, Team, Gallery, and more.
- **Bi-directional Support**: Fully supports LTR (English) and RTL (Farsi/Persian) layouts, including typography changes.
- **Customizable Design**: Themes (Light/Dark), custom backgrounds, gradients, and procedural patterns.
- **Auto-Save**: Work is automatically saved to local storage.

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **3D Engine**: Three.js, @react-three/fiber, @react-three/drei
- **Animations**: Framer Motion, Framer Motion 3D
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Installation & Setup

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## NPM Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Locally preview the production build.
- `npm run lint`: Runs the linter.

## Usage

### Presentation Mode
- **Navigation**: Use Left/Right arrow keys or the on-screen controls.
- **Overview**: Scroll or use the "Overview" button to zoom out to the 3D carousel. Drag to rotate.
- **Focus**: Double-click a slide in overview mode to focus on it.

### Builder Mode
- **Edit**: Click the "Edit" (pencil) icon in the dashboard to enter the Builder.
- **Manage Slides**: Add, remove, duplicate, or reorder slides in the left panel.
- **Edit Content**: Use the properties panel on the right to update text (supports Markdown), images, and specific slide data.
- **Design**: Customize colors, fonts, and backgrounds in the Design tab.
- **Preview**: Toggle between 2D and 3D preview modes to see how your slide looks in the spatial environment.

---
Created by [Mohammad Shirvani](https://github.com/0xradikal)