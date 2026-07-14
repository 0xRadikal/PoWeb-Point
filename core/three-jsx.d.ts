// Global JSX augmentation for React Three Fiber (v8) intrinsic elements.
//
// Rationale: R3F v8 augments the *global* `JSX.IntrinsicElements`
// (see @react-three/fiber .../three-types.d.ts). However, this project
// compiles with `"jsx": "react-jsx"`, under which TypeScript (with the
// React 18 typings) resolves intrinsic elements from `React.JSX`, NOT the
// global `JSX` namespace. As a result the built-in R3F augmentation is
// ignored and every 3D element (<group>, <mesh>, <ambientLight>, ...) fails
// with TS2339. We therefore mirror the augmentation into `React.JSX` so the
// 3D code in modules/three/** is genuinely type-checked.
import type { ThreeElements } from '@react-three/fiber';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

// Keep the global augmentation too, for any tooling that still reads it.
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

export {};
