



import React, { useState, useRef } from 'react';
import { SLIDE_TYPE_OPTS } from '../../core/constants';
import { SlideData, Section, CameraConfig, Language } from '../../core/types';
import { Layout, FileText, Palette, Zap, Box, ChevronUp, ChevronDown, ImageIcon, Upload, Link, Trash2, Sliders, Type, AlignLeft, AlignCenter, AlignRight, PaintBucket, Frame, Droplet, List, Plus, X, Split, Calendar, BarChart, Bold, Italic, Code, Heading1, Heading2, Quote, GripVertical, Images, Users, ArrowRightCircle, MousePointerClick } from 'lucide-react';
import { Button, DebouncedInput, DebouncedTextarea, Slider, ColorPicker, Select, Label } from '../../components/UI/Common';

// --- Shared Components ---

const Panel: React.FC<{ title: string; icon: any; children: React.ReactNode; defaultOpen?: boolean; className?: string }> = ({ title, icon: Icon, children, defaultOpen = false, className = "" }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className={`border-b border-slate-100 dark:border-slate-800 last:border-0 ${className}`}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`w-full flex items-center justify-between p-4 md:py-3 transition-colors ${
                    isOpen 
                    ? 'bg-slate-50 dark:bg-slate-900/50' 
                    : 'bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
            >
                <div className="flex items-center gap-3 font-bold text-xs text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                    <Icon size={16} className={`${isOpen ? 'text-blue-500' : 'text-slate-400'}`} /> {title}
                </div>
                {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </button>
            {isOpen && (
                <div className="p-4 md:p-5 bg-white dark:bg-slate-950 animate-in slide-in-from-top-1 space-y-5">
                    {children}
                </div>
            )}
        </div>
    );
};

const MarkdownToolbar: React.FC<{ onInsert: (prefix: string, suffix?: string) => void, t: any }> = ({ onInsert, t }) => {
    return (
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-t-lg border-b border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar">
            <button onClick={() => onInsert('**', '**')} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-500 hover:text-blue-500 transition-colors" title={t.bold}><Bold size={14} /></button>
            <button onClick={() => onInsert('*', '*')} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-500 hover:text-blue-500 transition-colors" title={t.italic}><Italic size={14} /></button>
            <button onClick={() => onInsert('# ')} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-500 hover:text-blue-500 transition-colors" title={t.heading1}><Heading1 size={14} /></button>
            <button onClick={() => onInsert('## ')} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-500 hover:text-blue-500 transition-colors" title={t.heading2}><Heading2 size={14} /></button>
            <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1" />
            <button onClick={() => onInsert('- ')} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-500 hover:text-blue-500 transition-colors" title={t.listItems}><List size={14} /></button>
            <button onClick={() => onInsert('> ')} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-500 hover:text-blue-500 transition-colors" title={t.quote}><Quote size={14} /></button>
            <button onClick={() => onInsert('`', '`')} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-500 hover:text-blue-500 transition-colors" title={t.code}><Code size={14} /></button>
        </div>
    );
};

// --- Panels ---

export const GeneralPanel: React.FC<{ 
    activeSlide: SlideData, 
    sections: Section[], 
    isRtl: boolean, 
    updateSlide: (id: string, data: Partial<SlideData>, withHistory?: boolean) => void,
    t: any
}> = ({ activeSlide, sections, isRtl, updateSlide, t }) => (
    <Panel title={t.generalInfo} icon={Layout} defaultOpen={false}>
        <Select 
            label={t.section}
            value={activeSlide.sectionId}
            options={sections.map(s => ({ value: s.id, label: s.title }))}
            onChange={(val) => updateSlide(activeSlide.id, { sectionId: val }, true)}
        />
        <div>
            <Label>{t.slideType}</Label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {SLIDE_TYPE_OPTS.map((typeObj) => (
                    <button
                        key={typeObj.type}
                        onClick={() => updateSlide(activeSlide.id, { type: typeObj.type }, true)}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all aspect-[1.1] sm:aspect-square ${
                            activeSlide.type === typeObj.type 
                            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-blue-500/20 scale-105 z-10' 
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 text-slate-400 hover:text-slate-600'
                        }`}
                        title={t[typeObj.labelKey]}
                    >
                        <typeObj.icon size={20} className={`mb-1.5 ${isRtl && typeObj.type === 'list' ? 'scale-x-[-1]' : ''}`} />
                        <span className="text-[9px] font-bold text-center leading-none opacity-90">{t[typeObj.labelKey]}</span>
                    </button>
                ))}
            </div>
        </div>
    </Panel>
);

export const ContentPanel: React.FC<{ 
    activeSlide: SlideData, 
    updateSlide: (id: string, data: Partial<SlideData>, withHistory?: boolean) => void,
    saveSnapshot: () => void,
    t: any
}> = ({ activeSlide, updateSlide, saveSnapshot, t }) => {
    const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
    const [showImageSettings, setShowImageSettings] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const type = activeSlide.type;
    
    // --- Logic for visibility and labels ---
    const showTitle = true; // Title is always relevant
    let titleLabel = t.title;
    if (type === 'quote') titleLabel = t.authorRole;

    // Subtitle is generally used as a subtitle, except for specific types where it acts as data
    const showSubtitle = true; 
    let subtitleLabel = t.subtitle;
    if (type === 'big-number') subtitleLabel = t.bigStatValue;
    if (type === 'quote') subtitleLabel = t.authorName;
    if (type === 'cta') subtitleLabel = t.subtitle;

    // Content is generally used as description, except where it acts as main body
    const showContent = true;
    let contentLabel = t.content;
    if (type === 'quote') contentLabel = t.quoteBody;
    if (type === 'hero') contentLabel = t.headline;
    if (type === 'big-number') contentLabel = t.description;
    if (type === 'gallery') contentLabel = t.description;
    if (type === 'article') contentLabel = t.articleBody;
    if (type === 'team') contentLabel = t.description;
    if (type === 'process') contentLabel = t.description;
    if (type === 'timeline') contentLabel = t.description;

    const showImageToggle = !['gallery', 'comparison', 'grid', 'stats', 'process', 'team', 'cta'].includes(type);
    const imageLabel = type === 'quote' ? t.image : t.enableImage;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert(t.invalidImageType || "Please upload a valid image file.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    updateSlide(activeSlide.id, { imageUrl: reader.result, enableImage: true }, true);
                }
                e.target.value = '';
            };
            reader.onerror = () => {
                alert(t.uploadError || "Failed to read file.");
                console.error("FileReader Error:", reader.error);
                e.target.value = '';
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInsertMarkdown = (prefix: string, suffix: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = activeSlide.content || '';
        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);

        const newText = before + prefix + selection + suffix + after;
        updateSlide(activeSlide.id, { content: newText });
        
        // Restore focus and selection next tick
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 0);
    };

    const style = activeSlide.style || {};

    return (
        <Panel title={t.mainContent} icon={FileText} defaultOpen={true}>
            <div className="space-y-5">
                {showTitle && (
                    <div className="group">
                        <Label className="mb-1.5">{titleLabel}</Label>
                        <DebouncedInput 
                            dir="auto" 
                            value={activeSlide.title}
                            onFocus={saveSnapshot}
                            onChange={(val) => updateSlide(activeSlide.id, { title: val })}
                            className="text-sm font-bold border-b border-slate-200 dark:border-slate-800 focus:border-blue-500 py-2"
                        />
                    </div>
                )}

                {showSubtitle && (
                    <div className="group">
                        <Label className="mb-1.5">{subtitleLabel}</Label>
                        <DebouncedInput 
                            dir="auto" 
                            value={activeSlide.subtitle || ''}
                            onFocus={saveSnapshot}
                            onChange={(val) => updateSlide(activeSlide.id, { subtitle: val })}
                            className="text-sm border-b border-slate-200 dark:border-slate-800 focus:border-blue-500 py-2"
                        />
                    </div>
                )}

                {showContent && (
                    <div className="group">
                        <div className="flex justify-between items-center mb-2">
                            <Label className="mb-0 text-slate-400 group-focus-within:text-blue-500">
                                {contentLabel}
                            </Label>
                            <span className="text-[9px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded flex items-center gap-1 font-mono">
                                <span className="text-blue-500 font-bold">MD</span> Markdown
                            </span>
                        </div>
                        
                        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                            <MarkdownToolbar onInsert={handleInsertMarkdown} t={t} />
                            <DebouncedTextarea 
                                ref={textareaRef}
                                dir="auto" 
                                value={activeSlide.content || ''}
                                onFocus={saveSnapshot}
                                onChange={(val) => updateSlide(activeSlide.id, { content: val })}
                                rows={activeSlide.type === 'article' ? 12 : 5}
                                className="w-full text-xs bg-transparent p-3 outline-none font-mono leading-relaxed resize-y min-h-[100px]"
                                placeholder="Type content here..."
                            />
                        </div>
                    </div>
                )}

                {showImageToggle && (
                    <div className="flex items-center justify-between py-3 border-t border-slate-100 dark:border-slate-800 mt-2">
                        <Label className="mb-0 flex items-center gap-2 text-slate-500">
                            <ImageIcon size={14} /> {imageLabel}
                        </Label>
                        <button 
                            onClick={() => updateSlide(activeSlide.id, { enableImage: !activeSlide.enableImage }, true)}
                            className={`w-10 h-6 rounded-full p-1 transition-colors ${activeSlide.enableImage ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-800'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${activeSlide.enableImage ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                    </div>
                )}

                {showImageToggle && activeSlide.enableImage && (
                    <div className="space-y-4 pt-1 animate-in slide-in-from-top-1">
                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                            <button onClick={() => setImageTab('upload')} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] rounded-md transition-all font-medium ${imageTab === 'upload' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}><Upload size={12} /> {t.upload}</button>
                            <button onClick={() => setImageTab('url')} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] rounded-md transition-all font-medium ${imageTab === 'url' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}><Link size={12} /> {t.url}</button>
                        </div>
                        
                        {imageTab === 'upload' && (
                            <div className="relative overflow-hidden group/upload">
                                <button className="w-full bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-xs py-8 flex flex-col items-center justify-center gap-3">
                                    <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 group-hover/upload:text-blue-500 transition-colors"><Upload size={18} /></div>
                                    <div className="text-center"><span className="font-bold block">{t.clickToUpload}</span></div>
                                </button>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        )}
                        
                        {imageTab === 'url' && (
                            <DebouncedInput 
                                value={activeSlide.imageUrl?.startsWith('data:') ? '' : activeSlide.imageUrl || ''} 
                                onFocus={saveSnapshot} 
                                onChange={(val) => updateSlide(activeSlide.id, { imageUrl: val })} 
                                placeholder="https://example.com/image.jpg" 
                                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                            />
                        )}
                        
                        {activeSlide.imageUrl && (
                            <div className="flex gap-3 items-center p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 group/preview">
                                <div className="w-12 h-12 rounded bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-300 dark:border-slate-700"><img src={activeSlide.imageUrl} className="w-full h-full object-cover" alt="Slide" /></div>
                                <div className="flex-1 min-w-0"><div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 truncate">{t.currentImage}</div><div className="text-[9px] text-slate-400 truncate opacity-70">{t.source}: {imageTab}</div></div>
                                <button onClick={() => updateSlide(activeSlide.id, { imageUrl: undefined }, true)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors"><Trash2 size={16} /></button>
                            </div>
                        )}
                        
                        {activeSlide.imageUrl && (
                            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <button onClick={() => setShowImageSettings(!showImageSettings)} className="w-full flex items-center justify-between p-3 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <div className="flex items-center gap-2"><Sliders size={12} className="text-blue-500" /> {t.advancedSettings}</div>
                                    {showImageSettings ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                </button>
                                {showImageSettings && (
                                    <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 space-y-4">
                                        <Slider label={t.scale} displayValue={`${style.imageScale || 1}x`} min={0.1} max={3} step={0.1} value={style.imageScale || 1} onPointerDown={saveSnapshot} onChange={(val) => updateSlide(activeSlide.id, { style: { ...style, imageScale: val } })} />
                                        <Slider label={t.opacity} displayValue={`${Math.round((style.imageOpacity ?? 1) * 100)}%`} min={0} max={1} step={0.05} value={style.imageOpacity ?? 1} onPointerDown={saveSnapshot} onChange={(val) => updateSlide(activeSlide.id, { style: { ...style, imageOpacity: val } })} />
                                        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                                            <button onClick={() => updateSlide(activeSlide.id, { style: { ...style, imageFit: 'cover' } }, true)} className={`flex-1 py-2 text-[10px] font-medium transition-colors ${!style.imageFit || style.imageFit === 'cover' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-slate-900 text-slate-500'}`}>{t.cover}</button>
                                            <button onClick={() => updateSlide(activeSlide.id, { style: { ...style, imageFit: 'contain' } }, true)} className={`flex-1 py-2 text-[10px] font-medium transition-colors ${style.imageFit === 'contain' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-slate-900 text-slate-500'}`}>{t.contain}</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Panel>
    );
}

// --- ITEM EDITORS ---

const SimpleListEditor: React.FC<{ items: string[]; onChange: (items: string[]) => void; t: any; label: string }> = ({ items, onChange, t, label }) => {
    return (
        <div className="space-y-2">
            {items.map((item, idx) => (
                <div key={idx} className="flex gap-2 group/item">
                    <div className="w-6 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0 select-none">
                        {idx + 1}
                    </div>
                    <DebouncedInput 
                        value={item}
                        onChange={(val) => {
                            const newItems = [...items];
                            newItems[idx] = val;
                            onChange(newItems);
                        }}
                        className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 text-xs focus:border-blue-500"
                        placeholder={`${label}...`}
                    />
                    <button 
                        onClick={() => {
                            const newItems = items.filter((_, i) => i !== idx);
                            onChange(newItems);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}
            <button 
                onClick={() => onChange([...items, ''])}
                className="w-full py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center justify-center gap-1.5 mt-2"
            >
                <Plus size={14} /> {t.addItem}
            </button>
        </div>
    );
};

const KeyValueListEditor: React.FC<{ items: string[]; onChange: (items: string[]) => void; keyPlaceholder: string; valuePlaceholder: string; t: any }> = ({ items, onChange, keyPlaceholder, valuePlaceholder, t }) => {
    return (
        <div className="space-y-3">
            {items.map((item, idx) => {
                // Split only on first colon
                const splitIndex = item.indexOf(':');
                const key = splitIndex !== -1 ? item.substring(0, splitIndex).trim() : item;
                const val = splitIndex !== -1 ? item.substring(splitIndex + 1).trim() : '';

                return (
                    <div key={idx} className="flex flex-col gap-1 p-2 border border-slate-100 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex justify-between items-center mb-1">
                             <div className="text-[9px] font-bold text-slate-400 uppercase">{t.item} {idx + 1}</div>
                             <button 
                                onClick={() => {
                                    const newItems = items.filter((_, i) => i !== idx);
                                    onChange(newItems);
                                }}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </div>
                        <div className="flex gap-2">
                             <div className="w-1/3">
                                <DebouncedInput 
                                    value={key}
                                    onChange={(newKey) => {
                                        const newItems = [...items];
                                        newItems[idx] = `${newKey}: ${val}`;
                                        onChange(newItems);
                                    }}
                                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-xs focus:border-blue-500 font-bold text-slate-700 dark:text-slate-200"
                                    placeholder={keyPlaceholder}
                                />
                             </div>
                             <div className="flex-1">
                                <DebouncedInput 
                                    value={val}
                                    onChange={(newVal) => {
                                        const newItems = [...items];
                                        newItems[idx] = `${key}: ${newVal}`;
                                        onChange(newItems);
                                    }}
                                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-xs focus:border-blue-500"
                                    placeholder={valuePlaceholder}
                                />
                             </div>
                        </div>
                    </div>
                );
            })}
             <button 
                onClick={() => onChange([...items, ':'])}
                className="w-full py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center justify-center gap-1.5"
            >
                <Plus size={14} /> {t.addDataPoint}
            </button>
        </div>
    );
};

const ComparisonEditor: React.FC<{ activeSlide: SlideData; updateSlide: (id: string, data: Partial<SlideData>) => void; t: any }> = ({ activeSlide, updateSlide, t }) => {
    const metadata = activeSlide.metadata || {};
    const leftTitle = metadata.leftTitle || '';
    const rightTitle = metadata.rightTitle || '';
    const leftItems = metadata.leftItems || [];
    const rightItems = metadata.rightItems || [];

    const updateMetadata = (key: string, value: any) => {
        updateSlide(activeSlide.id, { metadata: { ...metadata, [key]: value } });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-red-500 border-b border-red-100 dark:border-red-900/30 pb-1">
                    {t.optionA}
                </div>
                <div>
                     <Label>{t.title}</Label>
                     <DebouncedInput 
                        value={leftTitle}
                        onChange={(val) => updateMetadata('leftTitle', val)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1.5 text-xs focus:border-red-500"
                        placeholder="e.g., Pros"
                     />
                </div>
                <div>
                    <Label>{t.items}</Label>
                    <SimpleListEditor items={leftItems} onChange={(items) => updateMetadata('leftItems', items)} t={t} label={t.item} />
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-blue-500 border-b border-blue-100 dark:border-blue-900/30 pb-1">
                    {t.optionB}
                </div>
                <div>
                     <Label>{t.title}</Label>
                     <DebouncedInput 
                        value={rightTitle}
                        onChange={(val) => updateMetadata('rightTitle', val)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1.5 text-xs focus:border-blue-500"
                        placeholder="e.g., Cons"
                     />
                </div>
                <div>
                    <Label>{t.items}</Label>
                    <SimpleListEditor items={rightItems} onChange={(items) => updateMetadata('rightItems', items)} t={t} label={t.item} />
                </div>
            </div>
        </div>
    );
};

const GalleryEditor: React.FC<{ activeSlide: SlideData; updateSlide: (id: string, data: Partial<SlideData>) => void; t: any }> = ({ activeSlide, updateSlide, t }) => {
    const images = activeSlide.metadata?.galleryImages || [];
    const updateImages = (newImages: string[]) => {
        updateSlide(activeSlide.id, { metadata: { ...activeSlide.metadata, galleryImages: newImages } });
    }

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert(t.invalidImageType || "Please upload a valid image file.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    updateImages([...images, reader.result]);
                }
            };
            reader.onerror = () => {
                alert(t.uploadError || "Failed to read file.");
                console.error("FileReader Error:", reader.error);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-4">
             {images.map((img, i) => (
                 <div key={i} className="flex gap-3 items-center p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 group">
                     <div className="w-12 h-12 rounded bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-300 dark:border-slate-700">
                         <img src={img} className="w-full h-full object-cover" alt="Gallery Item" />
                     </div>
                     <div className="flex-1 min-w-0">
                         <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 truncate">{t.image} {i + 1}</div>
                     </div>
                     <button onClick={() => updateImages(images.filter((_, idx) => idx !== i))} className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors"><Trash2 size={16} /></button>
                 </div>
             ))}
             
             <div className="flex gap-2">
                 <div className="flex-1 relative overflow-hidden group/upload">
                    <button className="w-full py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center justify-center gap-1.5">
                        <Upload size={14} /> {t.uploadImage}
                    </button>
                    <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                 </div>
             </div>
        </div>
    );
};

const TeamEditor: React.FC<{ activeSlide: SlideData; updateSlide: (id: string, data: Partial<SlideData>) => void; t: any }> = ({ activeSlide, updateSlide, t }) => {
    const members = activeSlide.metadata?.team || [];
    const updateMembers = (newMembers: any[]) => {
        updateSlide(activeSlide.id, { metadata: { ...activeSlide.metadata, team: newMembers } });
    };

    const addMember = () => updateMembers([...members, { name: t.name, role: t.role }]);

    const updateMember = (index: number, field: string, value: string) => {
        const newMembers = [...members];
        newMembers[index] = { ...newMembers[index], [field]: value };
        updateMembers(newMembers);
    };

    const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert(t.invalidImageType || "Please upload a valid image file.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    updateMember(index, 'imageUrl', reader.result);
                }
            };
            reader.onerror = () => {
                alert(t.uploadError || "Failed to read file.");
                console.error("FileReader Error:", reader.error);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-4">
            {members.map((m, i) => (
                <div key={i} className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">{t.member} {i + 1}</div>
                        <button onClick={() => updateMembers(members.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 group/avatar cursor-pointer">
                            {m.imageUrl ? <img src={m.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Users size={16} className="text-slate-400" /></div>}
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(i, e)} className="absolute inset-0 opacity-0 cursor-pointer" title="Change Avatar" />
                        </div>
                        <div className="flex-1 space-y-2">
                             <DebouncedInput value={m.name} onChange={(val) => updateMember(i, 'name', val)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs font-bold" placeholder={t.name} />
                             <DebouncedInput value={m.role} onChange={(val) => updateMember(i, 'role', val)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs" placeholder={t.role} />
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={addMember} className="w-full py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center justify-center gap-1.5">
                <Plus size={14} /> {t.addMember}
            </button>
        </div>
    );
};

export const ItemsPanel: React.FC<{ 
    activeSlide: SlideData, 
    updateSlide: (id: string, data: Partial<SlideData>, withHistory?: boolean) => void,
    saveSnapshot: () => void,
    t: any
}> = ({ activeSlide, updateSlide, saveSnapshot, t }) => {
    
    // Determine editor type
    let editor = null;
    let title = t.items;
    let icon = List;

    if (activeSlide.type === 'hero' || activeSlide.type === 'content-image' || activeSlide.type === 'big-number' || activeSlide.type === 'quote') {
        // These types typically don't use list items
        return null;
    }

    if (activeSlide.type === 'gallery') {
         return (
             <Panel title={t.galleryImages} icon={Images} defaultOpen={true}>
                 <GalleryEditor activeSlide={activeSlide} updateSlide={updateSlide} t={t} />
             </Panel>
         );
    }

    if (activeSlide.type === 'team') {
         return (
             <Panel title={t.teamMembers} icon={Users} defaultOpen={true}>
                 <TeamEditor activeSlide={activeSlide} updateSlide={updateSlide} t={t} />
             </Panel>
         );
    }

    if (activeSlide.type === 'comparison') {
        return (
            <Panel title={t.comparisonData} icon={Split} defaultOpen={true}>
                <ComparisonEditor activeSlide={activeSlide} updateSlide={updateSlide} t={t} />
            </Panel>
        );
    }

    if (activeSlide.type === 'timeline') {
        editor = (
            <KeyValueListEditor 
                items={activeSlide.bullets || []} 
                onChange={(items) => updateSlide(activeSlide.id, { bullets: items }, true)} 
                keyPlaceholder={t.yearDate}
                valuePlaceholder={t.eventDesc}
                t={t}
            />
        );
        title = t.timelineEvents;
        icon = Calendar;
    } else if (activeSlide.type === 'stats') {
        editor = (
            <KeyValueListEditor 
                items={activeSlide.bullets || []} 
                onChange={(items) => updateSlide(activeSlide.id, { bullets: items }, true)} 
                keyPlaceholder={t.value}
                valuePlaceholder={t.label}
                t={t}
            />
        );
        title = t.statistics;
        icon = BarChart;
    } else if (activeSlide.type === 'process') {
         editor = (
            <KeyValueListEditor 
                items={activeSlide.bullets || []} 
                onChange={(items) => updateSlide(activeSlide.id, { bullets: items }, true)} 
                keyPlaceholder={t.stepTitle}
                valuePlaceholder={t.description}
                t={t}
            />
        );
        title = t.processSteps;
        icon = ArrowRightCircle;
    } else if (activeSlide.type === 'cta') {
         editor = (
            <KeyValueListEditor 
                items={activeSlide.bullets || []} 
                onChange={(items) => updateSlide(activeSlide.id, { bullets: items }, true)} 
                keyPlaceholder={t.buttonLabel}
                valuePlaceholder={t.url}
                t={t}
            />
        );
        title = t.actionButtons;
        icon = MousePointerClick;
    } else {
        // Standard list (list, grid, article-takeaways)
        editor = (
            <SimpleListEditor 
                items={activeSlide.bullets || []} 
                onChange={(items) => updateSlide(activeSlide.id, { bullets: items }, true)} 
                t={t}
                label={t.item}
            />
        );
        title = activeSlide.type === 'article' ? t.keyTakeaways : t.listItems;
    }

    return (
        <Panel title={title} icon={icon} defaultOpen={true}>
            {editor}
        </Panel>
    );
};

export const DesignPanel: React.FC<{ 
    activeSlide: SlideData, 
    updateSlide: (id: string, data: Partial<SlideData>, withHistory?: boolean) => void,
    saveSnapshot: () => void,
    t: any,
    language: Language
}> = ({ activeSlide, updateSlide, saveSnapshot, t, language }) => {
    
    // Sub-tab toggles
    // Initialize tab state based on active slide styling for consistent UI
    const [bgTab, setBgTab] = useState<'solid' | 'gradient' | 'pattern'>(
        activeSlide.style?.backgroundType === 'gradient' ? 'gradient' : 'solid'
    );
    const style = activeSlide.style || {};

    return (
        <Panel title={t.design} icon={Palette} defaultOpen={false}>
            {/* 1. TYPOGRAPHY & LAYOUT */}
            <div className="space-y-6">
                <div>
                    <Label className="flex items-center gap-2 mb-3"><Type size={12} /> {t.font}</Label>
                    <div className="flex rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden mb-4">
                        {(['sans', 'serif', 'mono'] as const).map(f => (
                            <button key={f} onClick={() => updateSlide(activeSlide.id, { style: { ...style, fontFamily: f } }, true)} className={`flex-1 py-2 px-1 text-[10px] capitalize transition-colors ${style.fontFamily === f ? 'bg-blue-500 text-white' : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{f}</button>
                        ))}
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="text-[10px] text-slate-500 font-bold uppercase">{t.colors}</div>
                        <div className="flex gap-3">
                            <ColorPicker label={t.text} value={style.textColor || (language === 'fa' ? '#f8fafc' : '#0f172a')} onFocus={saveSnapshot} onChange={(val) => updateSlide(activeSlide.id, { style: { ...style, textColor: val } })} />
                            <ColorPicker label={t.accent} value={style.accentColor || '#3b82f6'} onFocus={saveSnapshot} onChange={(val) => updateSlide(activeSlide.id, { style: { ...style, accentColor: val } })} />
                        </div>
                    </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800" />
                
                {/* 2. BACKGROUND & PATTERN */}
                <div>
                    <Label className="flex items-center gap-2 mb-3"><PaintBucket size={12} /> {t.background}</Label>
                    
                    <div className="flex bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-1 mb-4">
                         {(['solid', 'gradient', 'pattern'] as const).map(tab => (
                             <button 
                                key={tab} 
                                onClick={() => {
                                    setBgTab(tab);
                                    if(tab !== 'pattern') {
                                        updateSlide(activeSlide.id, { style: { ...style, backgroundType: tab } }, true);
                                    }
                                }}
                                className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded transition-all ${bgTab === tab ? 'bg-white dark:bg-slate-800 shadow text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600'}`}
                             >
                                 {t[tab]}
                             </button>
                         ))}
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800 p-4 space-y-4">
                        {bgTab === 'solid' && (
                             <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500">{t.baseColor}</span>
                                <ColorPicker value={style.backgroundColor || '#0f172a'} onFocus={saveSnapshot} onChange={(val) => updateSlide(activeSlide.id, { style: { ...style, backgroundColor: val, backgroundType: 'solid' } })} />
                             </div>
                        )}

                        {bgTab === 'gradient' && (
                             <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500">{t.gradientColors}</span>
                                    <div className="flex gap-2">
                                        <ColorPicker value={style.gradientColors?.[0] || '#1e293b'} onFocus={saveSnapshot} onChange={(val) => updateSlide(activeSlide.id, { style: { ...style, gradientColors: [val, style.gradientColors?.[1] || '#0f172a'], backgroundType: 'gradient' } })} />
                                        <ColorPicker value={style.gradientColors?.[1] || '#0f172a'} onFocus={saveSnapshot} onChange={(val) => updateSlide(activeSlide.id, { style: { ...style, gradientColors: [style.gradientColors?.[0] || '#1e293b', val], backgroundType: 'gradient' } })} />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                     <span className="text-xs text-slate-500">{t.bgType}</span>
                                     <div className="flex bg-slate-200 dark:bg-slate-800 rounded p-0.5">
                                         <button onClick={() => updateSlide(activeSlide.id, { style: { ...style, gradientType: 'linear' } })} className={`px-2 py-0.5 text-[9px] rounded ${style.gradientType !== 'radial' ? 'bg-white dark:bg-slate-700 shadow' : 'opacity-50'}`}>Lin</button>
                                         <button onClick={() => updateSlide(activeSlide.id, { style: { ...style, gradientType: 'radial' } })} className={`px-2 py-0.5 text-[9px] rounded ${style.gradientType === 'radial' ? 'bg-white dark:bg-slate-700 shadow' : 'opacity-50'}`}>Rad</button>
                                     </div>
                                </div>
                                {style.gradientType !== 'radial' && (
                                    <Slider label={`${t.angle}: ${style.gradientDegree || 135}°`} min={0} max={360} step={15} value={style.gradientDegree || 135} onPointerDown={saveSnapshot} onChange={(val) => updateSlide(activeSlide.id, { style: { ...style, gradientDegree: val } })} />
                                )}
                             </div>
                        )}

                        {bgTab === 'pattern' && (
                            <div className="space-y-4">
                                <div>
                                    <Label>{t.style}</Label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {(['none', 'dots', 'grid', 'lines', 'checker', 'noise'] as const).map(p => (
                                            <button 
                                                key={p} 
                                                onClick={() => updateSlide(activeSlide.id, { style: { ...style, pattern: p } }, true)}
                                                className={`p-2 text-[9px] rounded border transition-all ${style.pattern === p ? 'bg-blue-100 dark:bg-blue-900 border-blue-400 text-blue-700 dark:text-blue-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <Slider label={t.opacity} displayValue={`${Math.round((style.patternOpacity ?? 0.5) * 100)}%`} min={0} max={1} step={0.05} value={style.patternOpacity ?? 0.5} onPointerDown={saveSnapshot} onChange={(val) => updateSlide(activeSlide.id, { style: { ...style, patternOpacity: val } })} />
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex justify-between items-center p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                         <div className="flex items-center gap-2">
                            <Droplet size={14} className="text-slate-400" />
                            <span className="text-xs text-slate-500 font-medium">{t.overlay}</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <div className="w-24">
                                <Slider min={0} max={0.9} step={0.1} value={style.overlayOpacity || 0} onPointerDown={saveSnapshot} onChange={(val) => updateSlide(activeSlide.id, { style: { ...style, overlayOpacity: val } })} />
                            </div>
                            <ColorPicker value={style.overlayColor || '#000000'} onFocus={saveSnapshot} onChange={(val) => updateSlide(activeSlide.id, { style: { ...style, overlayColor: val } })} />
                         </div>
                    </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                {/* 3. FRAME & LAYOUT */}
                <div>
                     <Label className="flex items-center gap-2 mb-3"><Frame size={12} /> {t.frameLayout}</Label>
                     
                     <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800 p-4 space-y-4 mb-4">
                         <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500">{t.border}</span>
                            <div className="flex items-center gap-3">
                                <div className="w-20"><Slider min={0} max={20} step={1} value={style.borderWidth || 0} onPointerDown={saveSnapshot} onChange={(val) => updateSlide(activeSlide.id, { style: { ...style, borderWidth: val } })} /></div>
                                <ColorPicker value={style.borderColor || '#ffffff'} onFocus={saveSnapshot} onChange={(val) => updateSlide(activeSlide.id, { style: { ...style, borderColor: val } })} />
                            </div>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500">{t.cornerRadius}</span>
                            <div className="w-24"><Slider min={0} max={40} step={4} value={style.borderRadius || 0} onPointerDown={saveSnapshot} onChange={(val) => updateSlide(activeSlide.id, { style: { ...style, borderRadius: val } })} /></div>
                         </div>
                     </div>

                     <div>
                        <div className="flex justify-between text-[10px] mb-2 text-slate-400"><span>{t.contentWidth}</span><span>{style.contentWidth || 100}%</span></div>
                        <Slider min={50} max={100} step={5} value={style.contentWidth || 100} onPointerDown={saveSnapshot} onChange={(val) => updateSlide(activeSlide.id, { style: { ...style, contentWidth: val } })} />
                    </div>

                    <div className="mt-4">
                         <Label className="mb-2">{t.textAlignment}</Label>
                        <div className="flex rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                            {(['left', 'center', 'right'] as const).map(align => (
                                <button key={align} onClick={() => updateSlide(activeSlide.id, { style: { ...style, textAlignment: align } }, true)} className={`flex-1 py-2 flex justify-center transition-colors ${ (style.textAlignment || 'left') === align ? 'bg-blue-500 text-white' : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                        {align === 'left' && <AlignLeft size={16} />}
                                        {align === 'center' && <AlignCenter size={16} />}
                                        {align === 'right' && <AlignRight size={16} />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Panel>
    );
}

export const AnimationPanel: React.FC<{ 
    activeSlide: SlideData, 
    updateSlide: (id: string, data: Partial<SlideData>, withHistory?: boolean) => void,
    saveSnapshot: () => void,
    t: any 
}> = ({ activeSlide, updateSlide, saveSnapshot, t }) => {
    const style = activeSlide.style || {};
    return (
        <Panel title={t.animation} icon={Zap} defaultOpen={false}>
            <div className="space-y-5">
                <div className="grid grid-cols-2 gap-2">
                    {(['fade-up', 'fade-in', 'zoom', 'slide-right', 'slide-left'] as const).map(anim => (
                        <button key={anim} onClick={() => updateSlide(activeSlide.id, { style: { ...style, animation: anim } }, true)} className={`py-2 px-2 text-[10px] rounded-lg border transition-all text-center ${(style.animation || 'fade-up') === anim ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600 dark:text-blue-400 font-bold shadow-sm' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-300'}`}>{anim.replace('-', ' ')}</button>
                    ))}
                </div>
                <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Slider label={t.duration} displayValue={`${style.animationDuration ?? 0.8}s`} min={0.1} max={3.0} step={0.1} value={style.animationDuration ?? 0.8} onPointerDown={saveSnapshot} onChange={(val) => updateSlide(activeSlide.id, { style: { ...style, animationDuration: val } })} />
                    <Slider label={t.delay} displayValue={`${style.animationDelay ?? 0}s`} min={0} max={2.0} step={0.1} value={style.animationDelay ?? 0} onPointerDown={saveSnapshot} onChange={(val) => updateSlide(activeSlide.id, { style: { ...style, animationDelay: val } })} />
                </div>
            </div>
        </Panel>
    );
}

export const CameraPanel: React.FC<{ 
    cameraConfig: CameraConfig, 
    setCameraConfig: (config: Partial<CameraConfig>, withHistory?: boolean) => void,
    saveSnapshot: () => void,
    t: any
}> = ({ cameraConfig, setCameraConfig, saveSnapshot, t }) => {
    const [tab, setTab] = useState<'overview' | 'focus'>('overview');
    
    return (
        <Panel title={t.engineConfig} icon={Box} defaultOpen={true}>
            <div className="space-y-6">
                <div className="space-y-4">
                    <Label className="text-slate-500">{t.carouselGeometry}</Label>
                    <Slider 
                        label={t.orbitRadius} 
                        displayValue={`${cameraConfig.radius}`} 
                        min={4} max={20} step={0.5} 
                        value={cameraConfig.radius} 
                        onPointerDown={saveSnapshot} 
                        onChange={(val) => setCameraConfig({ radius: val })} 
                    />
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 p-1 flex">
                    <button onClick={() => setTab('overview')} className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded transition-all ${tab === 'overview' ? 'bg-white dark:bg-slate-800 shadow text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>{t.overview}</button>
                    <button onClick={() => setTab('focus')} className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded transition-all ${tab === 'focus' ? 'bg-white dark:bg-slate-800 shadow text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>{t.focusState}</button>
                </div>

                {tab === 'overview' && (
                    <div className="space-y-4 animate-in slide-in-from-left-2 fade-in">
                        <Slider label={t.distance} displayValue={`${cameraConfig.overviewDistance}`} min={5} max={40} step={1} value={cameraConfig.overviewDistance} onPointerDown={saveSnapshot} onChange={(val) => setCameraConfig({ overviewDistance: val })} />
                        <Slider label={t.height} displayValue={`${cameraConfig.overviewHeight}`} min={-10} max={20} step={0.5} value={cameraConfig.overviewHeight} onPointerDown={saveSnapshot} onChange={(val) => setCameraConfig({ overviewHeight: val })} />
                        <Slider label={t.tilt} displayValue={`${cameraConfig.overviewLookAtY}`} min={-10} max={10} step={0.5} value={cameraConfig.overviewLookAtY} onPointerDown={saveSnapshot} onChange={(val) => setCameraConfig({ overviewLookAtY: val })} />
                        <Slider label={t.fov} displayValue={`${cameraConfig.overviewFov}°`} min={20} max={90} step={1} value={cameraConfig.overviewFov} onPointerDown={saveSnapshot} onChange={(val) => setCameraConfig({ overviewFov: val })} />
                        <Slider label={t.orbitAngle} displayValue={`${cameraConfig.overviewAngle}°`} min={-180} max={180} step={5} value={cameraConfig.overviewAngle} onPointerDown={saveSnapshot} onChange={(val) => setCameraConfig({ overviewAngle: val })} />
                    </div>
                )}

                {tab === 'focus' && (
                    <div className="space-y-4 animate-in slide-in-from-right-2 fade-in">
                        <Slider label={t.focusDistance} displayValue={`${cameraConfig.focusDistance}`} min={1} max={20} step={0.5} value={cameraConfig.focusDistance} onPointerDown={saveSnapshot} onChange={(val) => setCameraConfig({ focusDistance: val })} />
                        <Slider label={t.focusHeight} displayValue={`${cameraConfig.focusHeight}`} min={-5} max={10} step={0.5} value={cameraConfig.focusHeight} onPointerDown={saveSnapshot} onChange={(val) => setCameraConfig({ focusHeight: val })} />
                        <Slider label={t.focusOffsetY} displayValue={`${cameraConfig.focusLookAtY}`} min={-5} max={5} step={0.1} value={cameraConfig.focusLookAtY} onPointerDown={saveSnapshot} onChange={(val) => setCameraConfig({ focusLookAtY: val })} />
                        <Slider label={t.focusFOV} displayValue={`${cameraConfig.focusFov}°`} min={20} max={90} step={1} value={cameraConfig.focusFov} onPointerDown={saveSnapshot} onChange={(val) => setCameraConfig({ focusFov: val })} />
                         <Slider label={t.focusAngle} displayValue={`${cameraConfig.focusAngle}°`} min={-45} max={45} step={1} value={cameraConfig.focusAngle} onPointerDown={saveSnapshot} onChange={(val) => setCameraConfig({ focusAngle: val })} />
                    </div>
                )}
                
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
                
                <div className="space-y-4">
                    <Label className="text-slate-500">{t.transition}</Label>
                    <Slider label={t.duration} displayValue={`${cameraConfig.transitionDuration}s`} min={0.1} max={5} step={0.1} value={cameraConfig.transitionDuration} onPointerDown={saveSnapshot} onChange={(val) => setCameraConfig({ transitionDuration: val })} />
                </div>
            </div>
        </Panel>
    );
}