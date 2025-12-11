
import React, { useState } from 'react';
import { motion as _motion } from 'framer-motion';
import { useApp } from '../../core/store';

const motion = _motion as any;

export const ProgressBar: React.FC = () => {
  const { slides, currentSlideIndex, goToSlide } = useApp();
  const [hovered, setHovered] = useState(false);

  const progress = ((currentSlideIndex + 1) / slides.length) * 100;

  return (
    <div 
        className="fixed bottom-0 left-0 w-full h-8 md:h-12 z-40 flex items-end group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
    >
        <div className="w-full h-1.5 md:h-1 bg-slate-200 dark:bg-slate-800 relative">
            <motion.div 
                className="absolute top-0 left-0 h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
            />
        </div>

        <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: hovered ? 0 : '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute bottom-0 left-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 p-3 md:p-4 shadow-negative-lg"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                    Slide {currentSlideIndex + 1} of {slides.length}
                </div>

                <div className="flex gap-1 h-6 md:h-8 items-center flex-1 justify-center sm:flex-none">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => goToSlide(idx)}
                            className={`h-full w-1.5 md:w-2 rounded-full transition-all duration-300 ${
                                idx <= currentSlideIndex 
                                ? 'bg-blue-500 hover:bg-blue-400' 
                                : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                            } ${
                                idx === currentSlideIndex ? 'w-3 md:w-4' : 'w-1.5 md:w-2'
                            }`}
                            title={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>

                <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
                    {slides.length - (currentSlideIndex + 1)} remaining
                </div>
            </div>
        </motion.div>
    </div>
  );
};
