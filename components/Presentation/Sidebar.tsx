
import React from 'react';
import { motion as _motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Edit3 } from 'lucide-react';
import { useApp } from '../../core/store';

const motion = _motion as any;

export const Sidebar: React.FC = () => {
  const { 
    menuOpen, 
    toggleMenu, 
    sections, 
    slides, 
    currentSlideIndex, 
    goToSlide,
    setMode,
    t,
    language
  } = useApp();

  const currentSlide = slides[currentSlideIndex];
  const activeSectionId = currentSlide?.sectionId;
  const isRtl = language === 'fa';

  return (
    <>
      <button
        onClick={toggleMenu}
        className="fixed top-4 md:top-8 z-[60] p-2 md:p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white transition-transform hover:scale-105 active:scale-95 ltr:right-4 md:ltr:right-8 rtl:left-4 md:rtl:left-8"
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/40 z-[55] backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ x: isRtl ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 h-full w-[85vw] md:w-96 bg-white dark:bg-slate-900 shadow-2xl z-[60] border-slate-200 dark:border-slate-800 flex flex-col ltr:right-0 ltr:border-l rtl:left-0 rtl:border-r"
            >
               <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 mt-12 md:mt-12">
                   <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900 dark:text-white">{t.contents}</h3>
                   <p className="text-sm text-slate-500 mt-2">{t.navigateBy}</p>
               </div>

               <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
                   {sections.map((section) => {
                       const sectionSlides = slides.filter(s => s.sectionId === section.id);
                       const isActive = section.id === activeSectionId;

                       return (
                           <div key={section.id} className="group">
                               <div className={`flex items-center gap-3 mb-2 md:mb-3 ${isActive ? 'text-blue-500' : 'text-slate-400'}`}>
                                   <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                                   <h4 className="font-bold uppercase tracking-wider text-xs md:text-sm">{section.title}</h4>
                               </div>
                               
                               <div className="ltr:ml-5 ltr:border-l rtl:mr-5 rtl:border-r border-slate-200 dark:border-slate-800 ltr:pl-4 rtl:pr-4 space-y-2">
                                   {sectionSlides.map((s, idx) => {
                                       const globalIndex = slides.findIndex(gs => gs.id === s.id);
                                       const isSlideActive = globalIndex === currentSlideIndex;

                                       return (
                                           <button
                                               key={s.id}
                                               onClick={() => {
                                                   goToSlide(globalIndex);
                                                   if (window.innerWidth < 768) toggleMenu();
                                               }}
                                               className={`block w-full text-start text-sm py-1.5 transition-all ${
                                                   isSlideActive 
                                                   ? 'text-slate-900 dark:text-white font-medium ltr:translate-x-1 rtl:-translate-x-1' 
                                                   : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                                               }`}
                                           >
                                               {s.title}
                                           </button>
                                       )
                                   })}
                               </div>
                           </div>
                       )
                   })}
               </div>

               <div className="p-4 md:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-3">
                    <button 
                        onClick={() => {
                            setMode('builder');
                            toggleMenu();
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors font-medium text-sm md:text-base"
                    >
                        <Edit3 size={18} />
                        Edit Slide
                    </button>
                    <button 
                        onClick={() => {
                            setMode('dashboard');
                            toggleMenu();
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-500/20 transition-colors font-medium text-sm md:text-base"
                    >
                        <LogOut size={18} className="rtl:rotate-180" />
                        {t.exit}
                    </button>
                    <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest text-center pt-2">
                        {t.version}
                    </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
