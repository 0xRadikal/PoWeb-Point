
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { AppState, SlideData, Section, Language, AppContextType, CameraConfig } from './types';
import { SLIDES, SECTIONS, DICTIONARY, DEFAULT_CAMERA_CONFIG } from './constants';

interface HistoryState {
  past: { slides: SlideData[]; sections: Section[]; cameraConfig: CameraConfig }[];
  future: { slides: SlideData[]; sections: Section[]; cameraConfig: CameraConfig }[];
}

const MAX_HISTORY_LENGTH = 5000;

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from LocalStorage or Default Constants (Deep Copy to prevent mutation of constants)
  const [slides, setSlides] = useState<SlideData[]>(() => {
    try {
        const saved = localStorage.getItem('radikal_slides');
        return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(SLIDES));
    } catch (e) {
        console.warn('Failed to load slides from localStorage, falling back to default', e);
        return JSON.parse(JSON.stringify(SLIDES));
    }
  });
  
  const [sections, setSections] = useState<Section[]>(() => {
    try {
        const saved = localStorage.getItem('radikal_sections');
        return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(SECTIONS));
    } catch (e) {
        console.warn('Failed to load sections from localStorage, falling back to default', e);
        return JSON.parse(JSON.stringify(SECTIONS));
    }
  });

  const [cameraConfig, setCameraConfigState] = useState<CameraConfig>(() => {
     try {
         const saved = localStorage.getItem('radikal_camera');
         if (saved) {
             const parsed = JSON.parse(saved);
             return { 
                 ...DEFAULT_CAMERA_CONFIG, 
                 ...parsed,
                 overviewDistance: parsed.overviewDistance ?? parsed.distance ?? DEFAULT_CAMERA_CONFIG.overviewDistance,
                 overviewHeight: parsed.overviewHeight ?? parsed.height ?? DEFAULT_CAMERA_CONFIG.overviewHeight,
             };
         }
     } catch (e) {
         console.warn("Failed to load/parse saved camera config, falling back to default", e);
     }
     return { ...DEFAULT_CAMERA_CONFIG };
  });

  const [history, setHistory] = useState<HistoryState>({ past: [], future: [] });

  const [theme, setThemeState] = useState<'light' | 'dark'>('dark');
  const [mode, setMode] = useState<'dashboard' | 'presentation' | 'builder'>('dashboard');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [cameraMode, setCameraMode] = useState<'overview' | 'focus'>('overview');
  const [builderPreviewMode, setBuilderPreviewMode] = useState<'2d' | '3d'>('2d');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    try {
        localStorage.setItem('radikal_slides', JSON.stringify(slides));
    } catch (e) {
        console.error('Failed to save slides to localStorage', e);
    }
  }, [slides]);

  useEffect(() => {
    try {
        localStorage.setItem('radikal_sections', JSON.stringify(sections));
    } catch (e) {
        console.error('Failed to save sections to localStorage', e);
    }
  }, [sections]);

  useEffect(() => {
    try {
        localStorage.setItem('radikal_camera', JSON.stringify(cameraConfig));
    } catch (e) {
        console.error('Failed to save camera config to localStorage', e);
    }
  }, [cameraConfig]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    document.body.dir = language === 'fa' ? 'rtl' : 'ltr';
    if(language === 'fa') {
        document.body.classList.add('font-farsi');
        document.body.classList.remove('font-sans');
    } else {
        document.body.classList.add('font-sans');
        document.body.classList.remove('font-farsi');
    }
  }, [language]);

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  const goToSlide = useCallback((index: number) => {
    if (slides.length === 0) return;
    const len = slides.length;
    const wrappedIndex = ((index % len) + len) % len;
    setCurrentSlideIndex(wrappedIndex);
  }, [slides.length]);

  const nextSlide = useCallback(() => goToSlide(currentSlideIndex + 1), [currentSlideIndex, goToSlide]);
  const prevSlide = useCallback(() => goToSlide(currentSlideIndex - 1), [currentSlideIndex, goToSlide]);
  
  const setTheme = useCallback((t: 'light' | 'dark') => setThemeState(t), []);
  
  const saveSnapshot = useCallback(() => {
    setHistory(curr => {
      const updatedPast = [...curr.past, { slides, sections, cameraConfig }];
      return {
        past: updatedPast.slice(-MAX_HISTORY_LENGTH),
        future: []
      };
    });
  }, [slides, sections, cameraConfig]);

  const setCameraConfig = useCallback((config: Partial<CameraConfig>, withHistory: boolean = false) => {
      if (withHistory) saveSnapshot();
      setCameraConfigState(prev => ({...prev, ...config}));
  }, [saveSnapshot]);

  const undo = useCallback(() => {
    if (history.past.length === 0) return;
    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);
    
    setHistory({
      past: newPast,
      future: [{ slides, sections, cameraConfig }, ...history.future]
    });
    
    setSlides(previous.slides);
    setSections(previous.sections);
    setCameraConfigState(previous.cameraConfig);
    if (currentSlideIndex >= previous.slides.length) {
        setCurrentSlideIndex(previous.slides.length - 1);
    }
  }, [history, currentSlideIndex, slides, sections, cameraConfig]);

  const redo = useCallback(() => {
    if (history.future.length === 0) return;
    const next = history.future[0];
    const newFuture = history.future.slice(1);

    const updatedPast = [...history.past, { slides, sections, cameraConfig }];

    setHistory({
      past: updatedPast.slice(-MAX_HISTORY_LENGTH),
      future: newFuture
    });

    setSlides(next.slides);
    setSections(next.sections);
    setCameraConfigState(next.cameraConfig);
  }, [history, slides, sections, cameraConfig]);

  const resetApp = useCallback(() => {
    saveSnapshot(); 
    setSlides(JSON.parse(JSON.stringify(SLIDES)));
    setSections(JSON.parse(JSON.stringify(SECTIONS)));
    setCameraConfigState({ ...DEFAULT_CAMERA_CONFIG });
    setCurrentSlideIndex(0);
    setCameraMode('overview');
    setMode('dashboard');
    
    try {
        localStorage.removeItem('radikal_slides');
        localStorage.removeItem('radikal_sections');
        localStorage.removeItem('radikal_camera');
    } catch (e) {
        console.error('Failed to reset localStorage', e);
    }
  }, [saveSnapshot]);

  const addSlide = useCallback((sectionId?: string) => {
    saveSnapshot();
    const newSlide: SlideData = {
      id: `s-${Date.now()}`,
      sectionId: sectionId || sections[0]?.id || 'default',
      type: 'hero',
      title: DICTIONARY[language].newSlide,
      subtitle: DICTIONARY[language].newSlideDesc,
      enableImage: false
    };
    setSlides(prev => [...prev, newSlide]);
    setCurrentSlideIndex(slides.length);
  }, [saveSnapshot, sections, language, slides.length]);

  const duplicateSlide = useCallback((id: string) => {
    saveSnapshot();
    const index = slides.findIndex(s => s.id === id);
    if (index === -1) return;
    
    const original = slides[index];
    const newSlide: SlideData = {
        ...original,
        id: `s-${Date.now()}`,
        title: `${original.title} (Copy)`
    };
    
    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, newSlide);
    setSlides(newSlides);
    setCurrentSlideIndex(index + 1);
  }, [saveSnapshot, slides]);

  const updateSlide = useCallback((id: string, data: Partial<SlideData>, withHistory: boolean = false) => {
    if (withHistory) saveSnapshot();
    setSlides(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  }, [saveSnapshot]);

  const deleteSlide = useCallback((id: string) => {
    if (slides.length <= 1) {
        alert("Cannot delete the last slide.");
        return;
    }
    saveSnapshot();
    const idx = slides.findIndex(s => s.id === id);
    setSlides(prev => prev.filter(s => s.id !== id));
    if (idx === currentSlideIndex) {
        goToSlide(idx - 1);
    } else if (idx < currentSlideIndex) {
        setCurrentSlideIndex(currentSlideIndex - 1);
    }
  }, [saveSnapshot, slides, currentSlideIndex, goToSlide]);

  const moveSlide = useCallback((dragIndex: number, hoverIndex: number) => {
    saveSnapshot();
    const dragSlide = slides[dragIndex];
    const newSlides = [...slides];
    newSlides.splice(dragIndex, 1);
    newSlides.splice(hoverIndex, 0, dragSlide);
    setSlides(newSlides);
    setCurrentSlideIndex(hoverIndex); 
  }, [saveSnapshot, slides]);

  const addSection = useCallback((title: string) => {
    saveSnapshot();
    const newSection: Section = {
      id: `sec-${Date.now()}`,
      title
    };
    setSections(prev => [...prev, newSection]);
  }, [saveSnapshot]);

  const deleteSection = useCallback((id: string) => {
    if (sections.length <= 1) {
        alert("Must have at least one section.");
        return;
    }
    saveSnapshot();
    const fallbackId = sections.find(s => s.id !== id)?.id || 'default';
    setSlides(prev => prev.map(s => s.sectionId === id ? { ...s, sectionId: fallbackId } : s));
    setSections(prev => prev.filter(s => s.id !== id));
  }, [sections, saveSnapshot]);

  const startTransitionToPresentation = useCallback(() => {
      setIsTransitioning(true);
      setTimeout(() => {
          setMode('presentation');
          setIsTransitioning(false);
      }, 1200);
  }, []);

  const value = useMemo(() => ({
      theme,
      mode,
      currentSlideIndex,
      menuOpen,
      language,
      slides,
      sections,
      cameraMode,
      cameraConfig,
      builderPreviewMode,
      isTransitioning,
      t: DICTIONARY[language],
      setTheme,
      setMode,
      setCurrentSlideIndex,
      toggleMenu,
      nextSlide,
      prevSlide,
      goToSlide,
      setLanguage,
      setCameraMode,
      setCameraConfig,
      setBuilderPreviewMode,
      setIsTransitioning,
      addSlide,
      updateSlide,
      deleteSlide,
      duplicateSlide,
      moveSlide,
      addSection,
      deleteSection,
      resetApp,
      startTransitionToPresentation,
      saveSnapshot,
      undo,
      redo,
      canUndo: history.past.length > 0,
      canRedo: history.future.length > 0
  }), [
      theme, mode, currentSlideIndex, menuOpen, language, slides, sections, cameraMode, cameraConfig, builderPreviewMode, isTransitioning,
      setTheme, setMode, setCurrentSlideIndex, toggleMenu, nextSlide, prevSlide, goToSlide, setLanguage, setCameraMode, setCameraConfig, setBuilderPreviewMode, setIsTransitioning,
      addSlide, updateSlide, deleteSlide, duplicateSlide, moveSlide, addSection, deleteSection, resetApp, startTransitionToPresentation, saveSnapshot, undo, redo, history.past.length, history.future.length
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
