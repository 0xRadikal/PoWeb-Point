
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../core/store';
import { 
    X, Layout, Type, Image as ImageIcon, Box, Sliders, Settings, 
    BookOpen, Layers, Zap, MousePointerClick, Globe, Keyboard, 
    Monitor, Grid, List, Users, Calendar, ArrowRightCircle, 
    Split, Quote, Images, Hash, FileText, Megaphone, BarChart3,
    CheckCircle2, AlertCircle, ChevronRight, Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UserGuide: React.FC<UserGuideProps> = ({ isOpen, onClose }) => {
    const { t, language } = useApp();
    const [activeTab, setActiveTab] = useState('start');
    const isRtl = language === 'fa';
    const navRef = useRef<HTMLDivElement>(null);

    const TAB_DATA = [
        { id: 'start', icon: BookOpen, label: t.guideTabBasics },
        { id: 'types', icon: Layout, label: t.guideTabLibrary },
        { id: 'editor', icon: Sliders, label: t.guideTabBuilder },
        { id: 'design', icon: Type, label: t.guideTabDesign },
        { id: '3d', icon: Box, label: t.guideTab3D },
        { id: 'advanced', icon: Settings, label: t.guideTabAdvanced }
    ];

    // Scroll active tab into view on mobile
    useEffect(() => {
        if (isOpen && navRef.current) {
            const activeEl = navRef.current.querySelector(`[data-tab="${activeTab}"]`);
            if (activeEl) {
                activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [activeTab, isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 lg:p-10">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />
                
                <motion.div 
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '100%', opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="bg-white dark:bg-slate-950 w-full h-[95vh] md:h-full md:max-h-[85vh] md:max-w-6xl rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden relative border border-slate-200 dark:border-slate-800"
                    dir={isRtl ? 'rtl' : 'ltr'}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="bg-blue-600 text-white p-2 md:p-2.5 rounded-xl shadow-lg shadow-blue-500/20 shrink-0">
                                <BookOpen size={20} className="md:w-6 md:h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">{t.userGuide}</h2>
                                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{t.guideIntro}</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Main Body */}
                    <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                        {/* Responsive Sidebar Navigation */}
                        <div 
                            className="w-full md:w-72 bg-white dark:bg-slate-900/50 border-b md:border-b-0 md:border-r rtl:border-l border-slate-200 dark:border-slate-800 flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto shrink-0 no-scrollbar md:p-2"
                            ref={navRef}
                        >
                            {TAB_DATA.map((tab) => (
                                <button
                                    key={tab.id}
                                    data-tab={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex items-center gap-3 p-3 md:p-4 md:rounded-xl transition-all text-start relative shrink-0
                                        border-b-2 md:border-b-0 md:border-l-0 min-w-[140px] md:min-w-0 md:w-full
                                        ${activeTab === tab.id
                                            ? 'border-blue-500 md:bg-white md:dark:bg-slate-800 text-blue-600 dark:text-blue-400 md:shadow-sm md:ring-1 md:ring-slate-200 md:dark:ring-slate-700 bg-slate-50 dark:bg-slate-900'
                                            : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                                        }
                                    `}
                                >
                                    <tab.icon size={18} className={`shrink-0 ${activeTab === tab.id ? 'text-blue-500' : 'text-slate-400'}`} />
                                    <div className="font-bold text-sm leading-tight">{tab.label}</div>
                                    {/* Desktop Active Indicator */}
                                    {activeTab === tab.id && (
                                        <div className="hidden md:block absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-blue-500 rounded-r-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950 p-4 md:p-8 lg:p-12 scroll-smooth">
                            <div className="max-w-4xl mx-auto min-h-full pb-10">
                                {activeTab === 'start' && <GettingStartedGuide t={t} />}
                                {activeTab === 'types' && <SlideTypesGuide t={t} />}
                                {activeTab === 'editor' && <EditorWorkflowGuide t={t} />}
                                {activeTab === 'design' && <DesignSystemGuide t={t} />}
                                {activeTab === '3d' && <Engine3DGuide t={t} />}
                                {activeTab === 'advanced' && <AdvancedGuide t={t} />}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

// --- Sub-Components ---

const SectionTitle: React.FC<{ children: React.ReactNode; icon?: any }> = ({ children, icon: Icon }) => (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        {Icon && <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"><Icon size={24} /></div>}
        <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{children}</h3>
    </div>
);

const FeatureBlock: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
    <div className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}>
        <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-base">
            <CheckCircle2 size={16} className="text-blue-500" />
            {title}
        </h4>
        <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-2 pl-6">
            {children}
        </div>
    </div>
);

// --- 1. Getting Started ---

const GettingStartedGuide: React.FC<{ t: any }> = ({ t }) => (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <SectionTitle icon={BookOpen}>{t.welcomeTitle}</SectionTitle>
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.welcomeText}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <FeatureBlock title={t.dashMode}>
                {t.dashModeText}
            </FeatureBlock>
            <FeatureBlock title={t.presMode}>
                {t.presModeText}
            </FeatureBlock>
        </div>

        <div className="bg-slate-100 dark:bg-slate-900 p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-4">
                <Keyboard className="text-blue-500" size={20} />
                <h4 className="font-bold text-slate-900 dark:text-white">{t.shortcuts}</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { key: 'Right / Space', action: 'Next Slide' },
                    { key: 'Left', action: 'Prev Slide' },
                    { key: 'ESC', action: 'Exit' },
                    { key: 'Enter', action: 'Enter' },
                ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-3 rounded-lg text-center shadow-sm border border-slate-200 dark:border-slate-700">
                        <kbd className="block font-mono text-sm font-bold text-slate-900 dark:text-white mb-1" dir="ltr">{item.key}</kbd>
                        <span className="text-[10px] uppercase tracking-wider text-slate-500">{item.action}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// --- 2. Slide Types ---

const SlideTypesGuide: React.FC<{ t: any }> = ({ t }) => {
    const types = [
        { icon: Megaphone, labelKey: "typeHero" },
        { icon: FileText, labelKey: "typeArticle" },
        { icon: ImageIcon, labelKey: "typeImageText" },
        { icon: List, labelKey: "typeList" },
        { icon: Hash, labelKey: "typeBigStat" },
        { icon: Quote, labelKey: "typeQuote" },
        { icon: Grid, labelKey: "typeGrid" },
        { icon: Images, labelKey: "typeGallery" },
        { icon: Users, labelKey: "typeTeam" },
        { icon: ArrowRightCircle, labelKey: "typeProcess" },
        { icon: Calendar, labelKey: "typeTimeline" },
        { icon: Split, labelKey: "typeComparison" },
        { icon: BarChart3, labelKey: "typeStats" },
        { icon: MousePointerClick, labelKey: "typeCTA" },
    ];

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionTitle icon={Layout}>{t.guideTabLibrary}</SectionTitle>
            <p className="text-slate-600 dark:text-slate-300">
                {t.libraryIntro}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {types.map((type, i) => (
                    <div key={i} className="flex gap-3 p-3 md:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 group-hover:text-blue-500 transition-colors">
                            <type.icon size={20} className="md:w-6 md:h-6" />
                        </div>
                        <div className="flex items-center">
                            <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">{t[type.labelKey]}</h4>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- 3. Editor Workflow ---

const EditorWorkflowGuide: React.FC<{ t: any }> = ({ t }) => (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <SectionTitle icon={Sliders}>{t.guideTabBuilder}</SectionTitle>
        <div className="grid grid-cols-1 gap-6">
            <FeatureBlock title={t.builderIntro1}>
                {t.builderDesc1}
            </FeatureBlock>

            <FeatureBlock title={t.builderIntro2}>
                {t.builderDesc2}
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30 text-sm flex gap-3">
                    <FileText className="shrink-0 text-blue-500" size={18} />
                    <div>
                        <strong className="block mb-1 text-blue-900 dark:text-blue-200">Markdown Supported</strong>
                        <p className="text-blue-800 dark:text-blue-300 text-xs" dir="ltr">
                            <code>**bold**</code>, <code>*italic*</code>, <code>- list</code>, <code># Headings</code>
                        </p>
                    </div>
                </div>
            </FeatureBlock>

            <FeatureBlock title={t.builderIntro3}>
                {t.builderDesc3}
            </FeatureBlock>
        </div>
    </div>
);

// --- 4. Design System ---

const DesignSystemGuide: React.FC<{ t: any }> = ({ t }) => (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <SectionTitle icon={Type}>{t.guideTabDesign}</SectionTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h4 className="font-bold text-lg border-b border-slate-200 dark:border-slate-800 pb-2">{t.designBackgrounds}</h4>
                <FeatureBlock title={t.designBackgrounds}>
                    {t.designBgDesc}
                </FeatureBlock>
            </div>

            <div className="space-y-4">
                <h4 className="font-bold text-lg border-b border-slate-200 dark:border-slate-800 pb-2">{t.designStyling}</h4>
                <FeatureBlock title={t.designStyling}>
                    {t.designStyleDesc}
                </FeatureBlock>
            </div>
        </div>
    </div>
);

// --- 5. 3D Engine ---

const Engine3DGuide: React.FC<{ t: any }> = ({ t }) => (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <SectionTitle icon={Box}>{t.guideTab3D}</SectionTitle>

        <div className="p-6 bg-slate-900 text-white rounded-2xl relative overflow-hidden mb-6 shadow-xl">
            <div className="relative z-10 grid grid-cols-3 gap-2 md:gap-6 text-center">
                <div>
                    <div className="text-xl md:text-3xl font-bold text-blue-400 mb-1">{t.orbitRadius}</div>
                    <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest">Carousel Size</div>
                </div>
                <div>
                    <div className="text-xl md:text-3xl font-bold text-green-400 mb-1">{t.height}</div>
                    <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest">Cam Y-Pos</div>
                </div>
                <div>
                    <div className="text-xl md:text-3xl font-bold text-purple-400 mb-1">{t.fov}</div>
                    <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest">Lens Width</div>
                </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 to-transparent" />
        </div>

        <div className="space-y-4">
            <FeatureBlock title={t.camStates}>
                {t.camStatesDesc}
            </FeatureBlock>
        </div>
    </div>
);

// --- 6. Advanced ---

const AdvancedGuide: React.FC<{ t: any }> = ({ t }) => {
    const { resetApp } = useApp();
    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionTitle icon={Settings}>{t.guideTabAdvanced}</SectionTitle>

            <div className="grid grid-cols-1 gap-6">
                <FeatureBlock title={t.rtlSupport}>
                    {t.rtlDesc}
                </FeatureBlock>

                <FeatureBlock title={t.localSave}>
                    {t.localSaveDesc}
                </FeatureBlock>

                <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30">
                    <h4 className="font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                        <AlertCircle size={18} /> {t.factoryReset}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        {t.factoryResetDesc}
                    </p>
                    <button 
                        onClick={() => { if(confirm(t.resetConfirm)) resetApp(); }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                    >
                        {t.reset}
                    </button>
                </div>
            </div>
        </div>
    );
};
