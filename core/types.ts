import { ThreeElements } from '@react-three/fiber';

export type SlideType = 'content-image' | 'list' | 'big-number' | 'timeline' | 'comparison' | 'grid' | 'stats' | 'hero' | 'article' | 'quote' | 'gallery' | 'team' | 'process' | 'cta';
export type Language = 'en' | 'fa';
export type AnimationType = 'fade-up' | 'fade-in' | 'zoom' | 'slide-right' | 'slide-left';

export interface Section {
  id: string;
  title: string;
}

export interface SlideStyle {
  // Typography
  fontFamily?: 'sans' | 'serif' | 'mono';
  textColor?: string;
  accentColor?: string;
  fontSizeScale?: number; // 1 = default
  fontWeight?: 'normal' | 'bold';
  
  // Background
  backgroundType?: 'default' | 'solid' | 'gradient' | 'image';
  backgroundColor?: string;
  gradientColors?: [string, string];
  gradientDegree?: number;
  gradientType?: 'linear' | 'radial';
  
  // Background Patterns & Overlays
  pattern?: 'none' | 'dots' | 'grid' | 'lines' | 'checker' | 'noise';
  patternOpacity?: number;
  overlayColor?: string;
  overlayOpacity?: number;

  // Frame & Borders
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;

  // Layout
  textAlignment?: 'left' | 'center' | 'right';
  contentWidth?: number; // 50 to 100 percentage
  
  // Image Customization
  imageScale?: number;
  imageOffsetX?: number;
  imageOffsetY?: number;
  imageFit?: 'cover' | 'contain';
  imageOpacity?: number;
  imageRotation?: number;

  // Animation
  animation?: AnimationType;
  animationDuration?: number;
  animationDelay?: number;
  animationEasing?: string;
}

export interface SlideData {
  id: string;
  sectionId: string;
  title: string;
  subtitle?: string;
  content?: string;
  bullets?: string[];
  imageUrl?: string;
  enableImage?: boolean;
  type: SlideType;
  style?: SlideStyle;
  metadata?: {
    leftTitle?: string;
    rightTitle?: string;
    leftItems?: string[];
    rightItems?: string[];
    galleryImages?: string[];
    team?: { name: string; role: string; imageUrl?: string }[];
    [key: string]: any;
  };
}

export interface CameraConfig {
  radius: number;
  
  // Overview Mode
  overviewDistance: number;
  overviewHeight: number;
  overviewLookAtY: number;
  overviewFov: number;
  overviewAngle: number;

  // Focus Mode
  focusDistance: number;
  focusHeight: number;
  focusLookAtY: number;
  focusFov: number;
  focusAngle: number;
  
  // Animation
  transitionDuration: number;
  transitionTension: number; // For spring-like feel (0-1)
}

export interface AppState {
  currentSlideIndex: number;
  mode: 'dashboard' | 'presentation' | 'builder';
  theme: 'light' | 'dark';
  language: Language;
  menuOpen: boolean;
  cameraMode: 'overview' | 'focus';
  cameraConfig: CameraConfig;
  builderPreviewMode: '2d' | '3d';
  isTransitioning: boolean;
}

export interface AppContextType extends AppState {
  slides: SlideData[];
  sections: Section[];
  t: any;
  setTheme: (theme: 'light' | 'dark') => void;
  setMode: (mode: 'dashboard' | 'presentation' | 'builder') => void;
  setCurrentSlideIndex: (index: number) => void;
  toggleMenu: () => void;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  setLanguage: (lang: Language) => void;
  setCameraMode: (mode: 'overview' | 'focus') => void;
  setCameraConfig: (config: Partial<CameraConfig>, withHistory?: boolean) => void;
  setBuilderPreviewMode: (mode: '2d' | '3d') => void;
  setIsTransitioning: (isTransitioning: boolean) => void;
  
  // Builder Actions
  addSlide: (sectionId?: string) => void;
  updateSlide: (id: string, data: Partial<SlideData>, withHistory?: boolean) => void;
  deleteSlide: (id: string) => void;
  duplicateSlide: (id: string) => void;
  moveSlide: (dragIndex: number, hoverIndex: number) => void;
  addSection: (title: string) => void;
  deleteSection: (id: string) => void;
  resetApp: () => void;
  startTransitionToPresentation: () => void;
  
  // History
  saveSnapshot: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}