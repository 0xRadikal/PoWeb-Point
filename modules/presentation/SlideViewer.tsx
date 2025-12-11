

import React from 'react';
import { motion as _motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useApp } from '../../core/store';
import { SlideData } from '../../core/types';
import { SlideRenderer } from './SlideRenderer';
import { getStyleClasses, getPatternStyle } from './SlideTemplates';

const motion = _motion as any;

interface SlideViewerProps {
    slide: SlideData;
    isPreview?: boolean;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({ slide, isPreview = false }) => {
  const { nextSlide, prevSlide, currentSlideIndex, slides, setMode, t, theme } = useApp();
  const isLastSlide = currentSlideIndex === slides.length - 1;
  const style = getStyleClasses(slide);
  const patternStyle = getPatternStyle(slide.style || {}, theme === 'dark');

  // Determine if default background should be shown
  const hasCustomBg = !!(style.bgStyle.backgroundColor || style.bgStyle.backgroundImage);
  const isDark = theme === 'dark';

  return (
    <div 
        className={`w-full h-full relative overflow-hidden transition-colors duration-500 text-slate-900 dark:text-white ${style.fontFamily}`}
    >
        {/* --- Background Layers --- */}
        
        {/* 1. Base Layer (Default or Custom) */}
        {!hasCustomBg ? (
            <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 -z-30" />
        ) : (
            <div className="absolute inset-0 -z-30" style={style.bgStyle} />
        )}

        {/* 2. Default Ambient Animation (only if no custom bg) */}
        {!hasCustomBg && (
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20 dark:opacity-10 -z-20">
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], x: [0, 50, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-blue-500 blur-[150px]" 
                />
                <motion.div 
                    animate={{ scale: [1, 1.3, 1], x: [0, -50, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-emerald-500 blur-[150px]" 
                />
            </div>
        )}

        {/* 3. Pattern Layer */}
        {patternStyle && (
            <div className="absolute inset-0 pointer-events-none -z-10" style={patternStyle} />
        )}

        {/* 4. Overlay Layer */}
        {slide.style?.overlayOpacity && slide.style.overlayOpacity > 0 && (
             <div 
                className="absolute inset-0 pointer-events-none -z-10" 
                style={{ 
                    backgroundColor: slide.style.overlayColor || '#000000', 
                    opacity: slide.style.overlayOpacity 
                }} 
            />
        )}

        {/* --- Content Frame --- */}
        <div 
            className="w-full h-full z-10 relative overflow-hidden"
            style={{
                ...style.frameStyle,
                // Adjust framing if border width is present to prevent scrollbars or cutoff
                boxSizing: 'border-box',
            }}
        >
             <SlideRenderer slide={slide} />
        </div>

        {/* --- Navigation Controls (Hidden in Builder Preview) --- */}
        {!isPreview && (
            <div className="absolute bottom-8 ltr:right-8 rtl:left-8 z-50 flex items-center gap-4">
                <button 
                    onClick={prevSlide}
                    className="p-4 rounded-full bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/40 backdrop-blur-md border border-slate-200/20 dark:border-white/10 text-slate-700 dark:text-white transition-all hover:scale-110 active:scale-95 group"
                >
                    <ArrowLeft size={24} className="ltr:block rtl:hidden" />
                    <ArrowRight size={24} className="ltr:hidden rtl:block" />
                </button>

                {isLastSlide ? (
                    <button 
                        onClick={() => setMode('dashboard')}
                        className="flex items-center gap-2 px-6 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 font-bold tracking-wide"
                    >
                        <span>{t.theEnd}</span>
                        <CheckCircle size={20} />
                    </button>
                ) : (
                    <button 
                        onClick={nextSlide}
                        className="p-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-110 active:scale-95 group"
                    >
                        <ArrowRight size={24} className="ltr:block rtl:hidden" />
                        <ArrowLeft size={24} className="ltr:hidden rtl:block" />
                    </button>
                )}
            </div>
        )}
    </div>
  );
};