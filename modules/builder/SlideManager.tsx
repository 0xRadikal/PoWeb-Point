
import React, { useState } from 'react';
import { useApp } from '../../core/store';
import { SLIDE_TYPE_OPTS } from '../../core/constants';
import { Trash2, Plus, Copy, Undo, Redo, RefreshCw, ChevronUp, ChevronDown, HelpCircle, Layers, PanelLeftClose, X, Folder } from 'lucide-react';

export const SlideManager: React.FC<{ onShowGuide: () => void; onClose?: () => void }> = ({ onShowGuide, onClose }) => {
    const { 
        slides, 
        currentSlideIndex, 
        setCurrentSlideIndex, 
        addSlide, 
        duplicateSlide, 
        moveSlide,
        undo, 
        redo, 
        canUndo, 
        canRedo, 
        resetApp,
        t,
        sections,
        addSection,
        deleteSection
    } = useApp();

    const [newSectionName, setNewSectionName] = useState('');
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

    const handleReset = () => {
        if (window.confirm(t.resetConfirm)) {
            resetApp();
        }
    };

    const toggleSection = (id: string) => {
        setCollapsedSections(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleMove = (direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? currentSlideIndex - 1 : currentSlideIndex + 1;
        if (newIndex >= 0 && newIndex < slides.length) {
            moveSlide(currentSlideIndex, newIndex);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-950 border-r rtl:border-r-0 rtl:border-l border-slate-200 dark:border-slate-800">
            {/* Header */}
            <div className="p-4 md:py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center shrink-0 h-14 md:h-auto">
                <div className="flex items-center gap-2">
                     <Layers size={16} className="text-blue-500" />
                     <h2 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">{t.outline}</h2>
                </div>
                <div className="flex gap-1 items-center">
                    <button onClick={undo} disabled={!canUndo} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded disabled:opacity-30 transition-colors text-slate-600 dark:text-slate-300" title={t.undo}>
                        <Undo size={14} />
                    </button>
                    <button onClick={redo} disabled={!canRedo} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded disabled:opacity-30 transition-colors text-slate-600 dark:text-slate-300" title={t.redo}>
                        <Redo size={14} />
                    </button>
                    <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>
                     <button onClick={handleReset} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 rounded transition-colors" title={t.reset}>
                        <RefreshCw size={14} />
                    </button>
                    {onClose && (
                        <>
                             <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>
                             <button onClick={onClose} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-700" title="Close Panel">
                                <span className="md:hidden"><X size={16} /></span>
                                <span className="hidden md:inline"><PanelLeftClose size={14} /></span>
                            </button>
                        </>
                    )}
                </div>
            </div>
            
            {/* Unified Sections & Slides List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar bg-slate-50/50 dark:bg-slate-950">
                {sections.map(section => {
                    const sectionSlides = slides.filter(s => s.sectionId === section.id);
                    const isCollapsed = collapsedSections[section.id];
                    
                    return (
                        <div key={section.id} className="select-none">
                            {/* Section Header */}
                            <div className="flex items-center group mb-2">
                                <button 
                                    onClick={() => toggleSection(section.id)}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    {isCollapsed ? <ChevronUp size={12} className="rotate-90" /> : <ChevronDown size={12} />}
                                </button>
                                
                                <div className="flex-1 flex items-center gap-2 px-1 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => toggleSection(section.id)}>
                                    <Folder size={14} className="text-slate-400 dark:text-slate-500" />
                                    <span className="font-bold text-xs text-slate-700 dark:text-slate-300 truncate">{section.title}</span>
                                    <span className="text-[10px] text-slate-400 bg-slate-200 dark:bg-slate-800 px-1.5 rounded-full">{sectionSlides.length}</span>
                                </div>

                                <div className="opacity-0 group-hover:opacity-100 flex items-center transition-opacity md:opacity-0 opacity-100">
                                     <button 
                                        onClick={() => addSlide(section.id)} 
                                        className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-slate-400 hover:text-blue-500 rounded"
                                        title={t.addSlide}
                                    >
                                        <Plus size={12} />
                                    </button>
                                     <button 
                                        onClick={() => deleteSection(section.id)} 
                                        className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 rounded ml-1"
                                        title={t.delete}
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>

                            {/* Slides in Section */}
                            {!isCollapsed && (
                                <div className="space-y-1 pl-4 border-l border-slate-200 dark:border-slate-800 ml-2.5">
                                    {sectionSlides.length === 0 ? (
                                        <div className="text-[10px] text-slate-400 italic py-2 pl-2">{t.emptySection}</div>
                                    ) : (
                                        sectionSlides.map((slide) => {
                                            const globalIndex = slides.findIndex(s => s.id === slide.id);
                                            const isActive = globalIndex === currentSlideIndex;

                                            return (
                                                <div 
                                                    key={slide.id}
                                                    onClick={() => setCurrentSlideIndex(globalIndex)}
                                                    className={`group flex items-center gap-2 p-2.5 md:p-2 rounded-lg md:rounded-md border cursor-pointer transition-all relative ${
                                                        isActive 
                                                        ? 'bg-white dark:bg-slate-900 border-blue-500 shadow-sm ring-1 ring-blue-500/20' 
                                                        : 'bg-white dark:bg-slate-900 border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-white dark:hover:bg-slate-900 shadow-sm border-slate-100 dark:border-slate-800'
                                                    }`}
                                                >
                                                    <div className={`w-1 h-8 rounded-full shrink-0 ${isActive ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                                    
                                                    <div className="flex-1 min-w-0 py-0.5">
                                                        <div className={`font-medium text-xs truncate dir-auto ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`} dir="auto">
                                                            {slide.title || t.untitled}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <span className="text-[9px] text-slate-400 uppercase tracking-wider">{t[SLIDE_TYPE_OPTS.find(opt => opt.type === slide.type)?.labelKey || 'typeHero']}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {isActive && (
                                                        <div className="flex items-center animate-in fade-in zoom-in duration-200 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded px-1 absolute ltr:right-2 rtl:left-2 shadow-sm border border-slate-100 dark:border-slate-800">
                                                            <button onClick={(e) => { e.stopPropagation(); duplicateSlide(slide.id); }} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-blue-500">
                                                                <Copy size={12} />
                                                            </button>
                                                             <button onClick={(e) => { e.stopPropagation(); handleMove('up'); }} disabled={globalIndex === 0} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-30 text-slate-400">
                                                                <ChevronUp size={12} />
                                                            </button>
                                                            <button onClick={(e) => { e.stopPropagation(); handleMove('down'); }} disabled={globalIndex === slides.length - 1} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-30 text-slate-400">
                                                                <ChevronDown size={12} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Add Section Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                 <div className="flex gap-2">
                     <input 
                        dir="auto"
                        value={newSectionName}
                        onChange={(e) => setNewSectionName(e.target.value)}
                        placeholder={t.addSection}
                        className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500 border border-slate-200 dark:border-slate-800 transition-all placeholder-slate-400"
                        onKeyDown={(e) => { if (e.key === 'Enter' && newSectionName.trim()) { addSection(newSectionName); setNewSectionName(''); } }}
                     />
                     <button 
                        onClick={() => { if (newSectionName.trim()) { addSection(newSectionName); setNewSectionName(''); } }}
                        className="px-3 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-400 rounded-lg transition-colors"
                     >
                         <Plus size={18} />
                     </button>
                 </div>
             </div>
        </div>
    );
};
