

import React from 'react';
import { useApp } from '../../core/store';
import { Trash2, Settings, X, PanelRightClose } from 'lucide-react';
import { GeneralPanel, ContentPanel, DesignPanel, AnimationPanel, CameraPanel, ItemsPanel } from './EditorPanels';

export const SlideEditor: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
    const { 
        slides, 
        currentSlideIndex, 
        deleteSlide, 
        sections,
        setCameraConfig,
        cameraConfig,
        builderPreviewMode,
        saveSnapshot,
        updateSlide,
        t,
        language
    } = useApp();

    const activeSlide = slides[currentSlideIndex];

    if (!activeSlide) return <div className="p-8 text-center text-slate-500 text-sm flex flex-col items-center justify-center h-full">{t.selectSlidePrompt}</div>;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-950 overflow-y-auto no-scrollbar">
            {/* Header / Toolbar */}
            <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 justify-between shrink-0 bg-white dark:bg-slate-950 sticky top-0 z-10">
                 <div className="flex items-center gap-2 overflow-hidden">
                    <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-1.5 rounded">
                        <Settings size={16} />
                    </div>
                    <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-200 tracking-wide">{t.properties}</span>
                 </div>
                 <div className="flex gap-1 items-center">
                     <button onClick={() => deleteSlide(activeSlide.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-md transition-colors" title={t.delete}>
                        <Trash2 size={16} />
                     </button>
                     {onClose && (
                         <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1"></div>
                     )}
                     {onClose && (
                        <button onClick={onClose} className="text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded transition-colors" title="Close Panel">
                            <span className="md:hidden"><X size={18} /></span>
                            <span className="hidden md:inline"><PanelRightClose size={16} /></span>
                        </button>
                     )}
                 </div>
            </div>

            {/* Modular Panels with keys to force re-mount on slide change for state reset */}
            <GeneralPanel 
                key={`gen-${activeSlide.id}`}
                activeSlide={activeSlide} 
                sections={sections} 
                isRtl={language === 'fa'} 
                updateSlide={updateSlide}
                t={t}
            />
            
            <ContentPanel 
                key={`content-${activeSlide.id}`}
                activeSlide={activeSlide} 
                updateSlide={updateSlide} 
                saveSnapshot={saveSnapshot} 
                t={t} 
            />

            <ItemsPanel 
                key={`items-${activeSlide.id}`}
                activeSlide={activeSlide} 
                updateSlide={updateSlide} 
                saveSnapshot={saveSnapshot} 
                t={t} 
            />

            <DesignPanel 
                key={`design-${activeSlide.id}`}
                activeSlide={activeSlide} 
                updateSlide={updateSlide} 
                saveSnapshot={saveSnapshot} 
                t={t} 
                language={language}
            />

            <AnimationPanel 
                key={`anim-${activeSlide.id}`}
                activeSlide={activeSlide} 
                updateSlide={updateSlide} 
                saveSnapshot={saveSnapshot} 
                t={t} 
            />

            {builderPreviewMode === '3d' && (
                <CameraPanel 
                    cameraConfig={cameraConfig} 
                    setCameraConfig={setCameraConfig} 
                    saveSnapshot={saveSnapshot} 
                    t={t} 
                />
            )}
            
            <div className="h-8 md:h-0"></div> {/* Bottom spacing for mobile */}
        </div>
    );
};