
import React, { useEffect, useMemo } from 'react';
import { AnimatePresence, motion as _motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { AppProvider, useApp } from './core/store';
import { DashboardScene } from './modules/three/Scene';
import { SlideViewer } from './modules/presentation/SlideViewer';
import { ProgressBar } from './components/Presentation/ProgressBar';
import { Sidebar } from './components/Presentation/Sidebar';
import { ThemeToggle } from './components/UI/ThemeToggle';
import { BuilderPanel } from './modules/builder/Builder';
import { Edit3, Info, Github, ExternalLink, Twitter, Send } from 'lucide-react';

const motion = _motion as any;

// --- Dashboard Overlay Components ---
const CreatorInfo: React.FC = () => {
    const { language, t } = useApp();
    const isRtl = language === 'fa';
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div 
            className={`absolute z-50 pointer-events-auto flex flex-col gap-4 ${
                isRtl 
                ? 'bottom-4 left-4 md:bottom-12 md:right-12 md:left-auto items-start md:items-end' 
                : 'bottom-4 right-4 md:bottom-12 md:left-12 md:right-auto items-end md:items-start'
            }`}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`bg-black/60 backdrop-blur-xl border border-white/10 p-4 md:p-5 rounded-2xl shadow-2xl w-64 mb-2 ${isRtl ? 'md:text-right text-left' : 'text-left'}`}
                    >
                        <div className={`flex items-center gap-3 mb-4 border-b border-white/10 pb-3 ${isRtl ? 'md:flex-row-reverse flex-row' : 'flex-row'}`}>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/20 shadow-lg shrink-0 overflow-hidden bg-slate-800">
                                <img 
                                    src="https://avatars.githubusercontent.com/u/64886141?s=400&u=0e20c3ed3263d8b5e6b6e9570f0436e4870c0473&v=4" 
                                    alt="Creator" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm leading-tight">Mohammad Shirvani</h4>
                                <h4 className="text-white font-bold text-sm leading-tight font-farsi mt-0.5">محمد شیروانی</h4>
                                <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold mt-1">{t.creatorRole}</p>
                            </div>
                        </div>
                        <div className="space-y-2" dir="ltr">
                            <a href="https://github.com/0xradikal" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors group">
                                <Github size={16} className="group-hover:text-white transition-colors" />
                                <span className="text-xs font-medium">{t.github}</span>
                                <ExternalLink size={12} className="ml-auto opacity-0 group-hover:opacity-50" />
                            </a>
                            <a href="https://x.com/0xRadikal" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors group">
                                <Twitter size={16} className="group-hover:text-white transition-colors" />
                                <span className="text-xs font-medium">{t.twitter}</span>
                                <ExternalLink size={12} className="ml-auto opacity-0 group-hover:opacity-50" />
                            </a>
                            <a href="https://t.me/OxRadikal" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors group">
                                <Send size={16} className="group-hover:text-white transition-colors" />
                                <span className="text-xs font-medium">{t.telegram}</span>
                                <ExternalLink size={12} className="ml-auto opacity-0 group-hover:opacity-50" />
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg border backdrop-blur-md transition-all duration-300 ${isOpen ? 'bg-white text-black border-white' : 'bg-black/30 text-white border-white/20 hover:bg-black/50'}`}
            >
                <Info size={20} className="md:w-6 md:h-6" strokeWidth={isOpen ? 2.5 : 2} />
            </motion.button>
        </div>
    );
};

const DashboardUI: React.FC = () => {
    const { t, language, cameraMode, isTransitioning } = useApp();
    
    // Hide UI during cinematic transition
    if (isTransitioning) return null;

    return (
        <div className="w-full h-full relative pointer-events-none" dir="ltr">
            <div className={`absolute top-24 md:top-12 left-0 right-0 text-center pointer-events-none z-10 select-none px-6 transition-all duration-700 ease-in-out ${cameraMode === 'focus' ? 'opacity-0 -translate-y-10' : 'opacity-100 translate-y-0'}`}>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 drop-shadow-sm mb-2 md:mb-3 tracking-tight leading-[0.9]">
                    {t.projectTitle}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-sm md:text-lg font-light tracking-widest uppercase opacity-80 mt-2">
                    {t.dragExplore}
                </p>
            </div>
            <div className={`absolute bottom-32 md:bottom-8 left-0 right-0 text-center pointer-events-none z-10 select-none px-4 transition-all duration-500 ${cameraMode === 'focus' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium tracking-wide" dir={language === 'fa' ? 'rtl' : 'ltr'}>
                    {t.scrollToOverview}
                </p>
            </div>
            <CreatorInfo />
        </div>
    );
};

const LanguageToggle = () => {
    const { language, setLanguage, isTransitioning } = useApp();
    if (isTransitioning) return null;
    return (
        <button
            onClick={() => setLanguage(language === 'en' ? 'fa' : 'en')}
            className="fixed top-4 md:top-8 z-50 p-2 md:p-3 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur border border-slate-200/50 dark:border-white/10 text-slate-800 dark:text-white hover:scale-110 transition-all active:scale-95 font-bold text-xs md:text-sm ltr:left-14 md:ltr:left-20 rtl:right-14 md:rtl:right-20 pointer-events-auto shadow-sm"
        >
            {language === 'en' ? 'FA' : 'EN'}
        </button>
    );
};

const EditToggle = () => {
    const { mode, setMode, isTransitioning } = useApp();
    
    // Only show in dashboard mode. Hidden in builder and presentation.
    // In presentation mode, access is provided via the Sidebar menu.
    if (mode !== 'dashboard' || isTransitioning) return null;

    return (
        <button
            onClick={() => setMode('builder')}
            className="fixed top-4 md:top-8 z-50 p-2 md:p-3 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur border border-slate-200/50 dark:border-white/10 text-slate-800 dark:text-white hover:scale-110 transition-all active:scale-95 pointer-events-auto shadow-sm ltr:right-4 md:ltr:right-20 rtl:left-4 md:rtl:left-20"
            title="Edit Presentation"
        >
            <Edit3 size={20} />
        </button>
    );
}

const AppContent: React.FC = () => {
  const { mode, currentSlideIndex, slides, nextSlide, prevSlide, setMode, t, startTransitionToPresentation, setCameraMode, isTransitioning, setCurrentSlideIndex } = useApp();
      const isLowEndDevice = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    const navigatorWithMemory = navigator as Navigator & { deviceMemory?: number };
    const deviceMemory = navigatorWithMemory.deviceMemory ?? 4;
    const hardwareConcurrency = navigator.hardwareConcurrency ?? 4;
    return deviceMemory <= 4 || hardwareConcurrency <= 4;
  }, []);
  const maxDpr = isLowEndDevice ? 1.25 : 2;
  const antialias = !isLowEndDevice;
  const powerPreference = isLowEndDevice ? 'low-power' : 'high-performance';
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode === 'builder' || isTransitioning) return;
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (mode === 'presentation') {
        if (e.key === ' ') nextSlide();
        if (e.key === 'Escape') setMode('dashboard');
      } else {
        if (e.key === 'Enter') startTransitionToPresentation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, nextSlide, prevSlide, setMode, startTransitionToPresentation, isTransitioning]);

  return (
    <div className="w-full h-[100dvh] relative overflow-hidden bg-gradient-to-b from-slate-100 to-slate-300 dark:from-slate-900 dark:to-[#0B1120]">
      <div className="absolute inset-0 z-0" onContextMenu={(e) => { if (mode === 'dashboard') { e.preventDefault(); setCameraMode('overview'); } }}>
        {/* Fix: Conditionally render Canvas to ensure WebGL context is properly disposed when switching modes */}
        {mode === 'dashboard' && (
            <Canvas 
                shadows 
                dpr={[1, maxDpr]} // Optimization: Limit pixel ratio based on device capability
                camera={{ fov: 45 }} 
                gl={{ antialias, powerPreference, preserveDrawingBuffer: false }}
            >
                <DashboardScene />
            </Canvas>
        )}
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="w-full h-full relative">
            {mode !== 'builder' && (<><ThemeToggle /><LanguageToggle /><EditToggle /></>)}
            <AnimatePresence mode="wait">
                {mode === 'builder' ? (
                    <motion.div key="builder" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full h-full z-50 absolute inset-0 bg-slate-50 dark:bg-slate-900 pointer-events-auto">
                        <BuilderPanel />
                    </motion.div>
                ) : mode === 'dashboard' ? (
                <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, duration: 1 }} className="w-full h-full">
                    <DashboardUI />
                    <div className="absolute bottom-8 md:bottom-12 ltr:left-4 md:ltr:right-12 ltr:right-auto md:ltr:left-auto rtl:right-4 md:rtl:left-12 rtl:left-auto md:rtl:right-auto z-20 pointer-events-none">
                        <button onClick={() => { setCurrentSlideIndex(0); startTransitionToPresentation(); }} className="bg-white/80 dark:bg-black/40 hover:bg-white backdrop-blur-xl text-slate-900 dark:text-white px-6 md:px-8 py-3 md:py-3 rounded-2xl border border-white/20 shadow-2xl text-base md:text-lg font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2 md:gap-3 pointer-events-auto">
                        {t.quickStart}
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        </button>
                    </div>
                </motion.div>
                ) : (
                <motion.div 
                    key="presentation" 
                    className="w-full h-full relative bg-slate-50 dark:bg-slate-900 pointer-events-auto" 
                    // Cinematic Fade-in for presentation mode
                    initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }} 
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} 
                    exit={{ opacity: 0 }} 
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div key={currentSlideIndex} className="w-full h-full" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                            <SlideViewer slide={slides[currentSlideIndex]} />
                        </motion.div>
                    </AnimatePresence>
                    <Sidebar />
                    <ProgressBar />
                    <div className="fixed top-4 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity text-xs text-slate-400 px-3 py-1 bg-black/50 rounded-full pointer-events-none z-[100]">{t.pressEsc}</div>
                </motion.div>
                )}
            </AnimatePresence>
          </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
