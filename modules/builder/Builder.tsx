
import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useApp } from '../../core/store';
import { CheckSquare, Play, Eye, Box, Monitor, Unlock, Lock, RotateCcw, Layers, Sliders, ChevronLeft, ChevronRight, Settings, BookOpen, LayoutGrid } from 'lucide-react';
import { SlideManager } from './SlideManager';
import { SlideEditor } from './SlideEditor';
import { UserGuide } from '../../components/Builder/UserGuide';
import { SlideViewer } from '../presentation/SlideViewer';
import { SlideCard } from '../three/SlideCard';
import { SlideData, CameraConfig } from '../../core/types';
import { RendererCleanup } from '../three/Scene';

const PreviewCameraRig = ({ mode, config, isFree }: { mode: 'overview' | 'focus'; config: CameraConfig; isFree: boolean }) => {
    useFrame((state, delta) => {
        if (isFree) return; // Allow OrbitControls to take over

        // --- OVERVIEW ---
        const ovAngleRad = (config.overviewAngle * Math.PI) / 180;
        const ovX = Math.sin(ovAngleRad) * config.overviewDistance;
        const ovZ = Math.cos(ovAngleRad) * config.overviewDistance;
        const overviewPos = new THREE.Vector3(ovX, config.overviewHeight, ovZ);
        const overviewLookAt = new THREE.Vector3(0, config.overviewLookAtY, 0);
        
        // --- FOCUS ---
        const foAngleRad = (config.focusAngle * Math.PI) / 180;
        const foDist = config.focusDistance || 5.5;
        // Offset relative to slide position at (0,0, radius)
        const offsetX = Math.sin(foAngleRad) * foDist;
        const offsetZ = Math.cos(foAngleRad) * foDist;
        
        const focusPos = new THREE.Vector3(offsetX, config.focusHeight, config.radius + offsetZ);
        const focusLookAt = new THREE.Vector3(0, config.focusLookAtY, config.radius);

        const targetPos = mode === 'overview' ? overviewPos : focusPos;
        const targetLookAt = mode === 'overview' ? overviewLookAt : focusLookAt;
        const targetFov = mode === 'overview' ? config.overviewFov : config.focusFov;

        // Smoothly interpolate
        state.camera.position.lerp(targetPos, delta * 3.0);
        
        if (state.camera instanceof THREE.PerspectiveCamera) {
            state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, targetFov, delta * 3.0);
            state.camera.updateProjectionMatrix();
        }
        
        const currentLookAt = new THREE.Vector3();
        state.camera.getWorldDirection(currentLookAt).multiplyScalar(5).add(state.camera.position);
        currentLookAt.lerp(targetLookAt, delta * 3.5);
        state.camera.lookAt(currentLookAt);
    });
    return null;
}

interface SlidePreview3DProps {
    slide: SlideData;
    isDark: boolean;
    isFarsi: boolean;
    isFreeCamera: boolean;
    cameraMode: 'overview' | 'focus';
    cameraConfig: CameraConfig;
}

const SlidePreview3D: React.FC<SlidePreview3DProps> = ({ slide, isDark, isFarsi, isFreeCamera, cameraMode, cameraConfig }) => {
    return (
        <Canvas 
            shadows 
            dpr={[1, 2]} 
            camera={{ position: [0, 0, 15], fov: 45 }}
            gl={{ preserveDrawingBuffer: false }}
        >
             <RendererCleanup />
             <color attach="background" args={[isDark ? '#0f172a' : '#f1f5f9']} />
             
             <PreviewCameraRig mode={cameraMode} config={cameraConfig} isFree={isFreeCamera} />
             
             <ambientLight intensity={0.6} />
             <spotLight position={[5, 10, 5]} intensity={1} castShadow />
             <pointLight position={[-10, 5, 10]} intensity={isDark ? 0.8 : 0.4} color="#3b82f6" />
             <Environment preset={isDark ? "city" : "studio"} blur={0.8} />
             
             <group position={[0, 0, cameraConfig.radius]}>
                 <SlideCard 
                    slide={slide} 
                    index={0}
                    sectionTitle="PREVIEW"
                    isActive={true}
                    cameraMode={isFreeCamera ? 'focus' : cameraMode}
                    onDoubleClick={() => {}}
                    onClick={() => {}}
                    onPointerDown={() => {}}
                    isDark={isDark}
                    isFarsi={isFarsi}
                 />
             </group>
             
             <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} />
             
             {isFreeCamera && (
                <OrbitControls 
                    enableZoom={true} 
                    minDistance={3} 
                    maxDistance={30} 
                    target={[0, 0, cameraConfig.radius]} 
                />
             )}
        </Canvas>
    )
}

const ScaledPreview: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const BASE_WIDTH = 1280;
    const BASE_HEIGHT = 720;

    useEffect(() => {
        const updateScale = () => {
             if (containerRef.current) {
                 const { width, height } = containerRef.current.getBoundingClientRect();
                 const scaleX = width / BASE_WIDTH;
                 const scaleY = height / BASE_HEIGHT;
                 setScale(Math.min(scaleX, scaleY) * 0.98);
             }
        };

        const observer = new ResizeObserver(updateScale);
        if (containerRef.current) observer.observe(containerRef.current);
        
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center overflow-hidden bg-white dark:bg-slate-900">
            <div 
                style={{ 
                    width: BASE_WIDTH, 
                    height: BASE_HEIGHT,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center'
                }}
                className="shrink-0 shadow-lg ring-1 ring-slate-900/5 dark:ring-white/5"
            >
                {children}
            </div>
        </div>
    );
};

export const BuilderPanel: React.FC = () => {
    const { setMode, t, slides, currentSlideIndex, theme, language, cameraConfig, builderPreviewMode, setBuilderPreviewMode } = useApp();
    const [showGuide, setShowGuide] = useState(false);
    
    // Desktop: Collapsible Sidebars
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

    // Mobile/Tablet Tab State
    const [activeTab, setActiveTab] = useState<'outline' | 'preview' | 'properties'>('preview');

    // 3D Preview State
    const [isFreeCamera, setIsFreeCamera] = useState(true);
    const [previewCameraMode, setPreviewCameraMode] = useState<'overview' | 'focus'>('focus');
    
    const [animTrigger, setAnimTrigger] = useState(0);

    const activeSlide = slides[currentSlideIndex];
    const isDark = theme === 'dark';
    const isFarsi = language === 'fa';
    
    useEffect(() => {
        setAnimTrigger(0);
    }, [currentSlideIndex]);

    return (
        <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
            <UserGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
            
            {/* --- LEFT SIDEBAR: SLIDE MANAGER --- */}
            <div className={`
                absolute md:static inset-0 md:inset-auto z-40 bg-white dark:bg-slate-950
                ${activeTab === 'outline' ? 'flex' : 'hidden'} md:flex 
                flex-col border-r rtl:border-r-0 rtl:border-l border-slate-200 dark:border-slate-800 shadow-lg shrink-0 h-full
                transition-all duration-300 ease-in-out
                ${leftSidebarOpen ? 'w-full md:w-80' : 'w-0 md:w-0 overflow-hidden'}
            `}>
                <div className="flex-1 min-h-0 min-w-[320px] md:min-w-0">
                    <SlideManager 
                        onShowGuide={() => setShowGuide(true)} 
                        onClose={() => {
                            if (window.innerWidth < 768) {
                                setActiveTab('preview');
                            } else {
                                setLeftSidebarOpen(false);
                            }
                        }} 
                    />
                </div>
            </div>

            {/* --- COLLAPSED SIDEBAR BUTTON (LEFT) --- */}
            {!leftSidebarOpen && (
                 <div className="hidden md:flex flex-col border-r rtl:border-r-0 rtl:border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 z-20 shrink-0 w-12 items-center py-4 gap-4">
                     <button onClick={() => setLeftSidebarOpen(true)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400 hover:text-blue-500 transition-colors" title={t.outline}>
                         <Layers size={20} />
                     </button>
                     <div className="w-8 h-px bg-slate-200 dark:bg-slate-800" />
                     <button onClick={() => setShowGuide(true)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400 hover:text-blue-500 transition-colors" title={t.userGuide}>
                         <Box size={20} />
                     </button>
                 </div>
            )}

            {/* --- CENTER: LIVE PREVIEW STAGE --- */}
            <div className={`
                ${activeTab === 'preview' ? 'flex' : 'hidden md:flex'} flex-1 flex-col relative overflow-hidden bg-slate-200/50 dark:bg-black/50 backdrop-blur-sm h-full
                transition-all duration-300
            `}>
                
                {/* Preview Toolbar */}
                <div className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-slate-200/50 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur z-10 shrink-0">
                     <div className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar">
                        
                        <button 
                           onClick={() => setMode('dashboard')}
                           className="flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-all mr-2"
                           title={t.exit}
                        >
                           <LayoutGrid size={20} />
                        </button>
                        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mr-2 shrink-0" />

                        <div className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
                            <Eye size={14} /> {t.preview}
                        </div>
                        
                        {/* View Mode Toggle */}
                        <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1 gap-1 shrink-0">
                            <button 
                                onClick={() => setBuilderPreviewMode('2d')}
                                className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                                    builderPreviewMode === '2d' 
                                    ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-white' 
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                <Monitor size={12} /> {t.view2d}
                            </button>
                            <button 
                                onClick={() => setBuilderPreviewMode('3d')}
                                className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                                    builderPreviewMode === '3d' 
                                    ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-white' 
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                <Box size={12} /> {t.view3d}
                            </button>
                        </div>
                        
                        {/* 2D Controls */}
                        {builderPreviewMode === '2d' && (
                             <button
                                onClick={() => setAnimTrigger(prev => prev + 1)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md text-[10px] font-bold uppercase hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors shrink-0"
                            >
                                <RotateCcw size={12} /> <span className="hidden sm:inline">{t.replay}</span>
                            </button>
                        )}

                        {/* 3D Controls */}
                        {builderPreviewMode === '3d' && (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 pl-2 border-l border-slate-300 dark:border-slate-700 shrink-0">
                                <button
                                    onClick={() => setIsFreeCamera(!isFreeCamera)}
                                    className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                                        isFreeCamera
                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                                    }`}
                                    title={isFreeCamera ? "Free Camera Mode" : "Locked to Presentation Config"}
                                >
                                    {isFreeCamera ? <Unlock size={12} /> : <Lock size={12} />}
                                    <span className="hidden sm:inline">{isFreeCamera ? t.freeCam : t.realCam}</span>
                                </button>
                                
                                {!isFreeCamera && (
                                    <div className="flex bg-slate-200 dark:bg-slate-800 rounded-md p-0.5">
                                        <button
                                            onClick={() => setPreviewCameraMode('overview')}
                                            className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded transition-colors ${
                                                previewCameraMode === 'overview' 
                                                ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' 
                                                : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                        >
                                            Over
                                        </button>
                                        <button
                                            onClick={() => setPreviewCameraMode('focus')}
                                            className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded transition-colors ${
                                                previewCameraMode === 'focus' 
                                                ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' 
                                                : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                        >
                                            Focus
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                     </div>

                     <button 
                        onClick={() => setMode('presentation')} 
                        className="flex items-center gap-2 px-3 md:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-xs font-bold shadow-lg shadow-green-500/20 transition-all hover:scale-105 shrink-0"
                    >
                        <Play size={12} fill="currentColor" /> <span className="hidden sm:inline">{t.present}</span>
                     </button>
                </div>

                {/* Stage */}
                <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden relative pb-16 md:pb-8">
                    <div className="aspect-video w-full max-w-5xl bg-white dark:bg-slate-900 shadow-2xl rounded-xl overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/10 relative group transition-all duration-300">
                        {activeSlide ? (
                            builderPreviewMode === '2d' ? (
                                <ScaledPreview>
                                    <SlideViewer 
                                        key={`${activeSlide.id}-${activeSlide.style?.animation}-${animTrigger}-${activeSlide.style?.animationDuration}`} 
                                        slide={activeSlide} 
                                        isPreview={true} 
                                    />
                                </ScaledPreview>
                            ) : (
                                <div className="w-full h-full relative">
                                    <SlidePreview3D 
                                        slide={activeSlide} 
                                        isDark={isDark} 
                                        isFarsi={isFarsi} 
                                        isFreeCamera={isFreeCamera}
                                        cameraMode={previewCameraMode}
                                        cameraConfig={cameraConfig}
                                    />
                                    <div className="absolute bottom-4 right-4 text-[10px] text-slate-400 font-mono bg-black/50 px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
                                        {isFreeCamera ? t.dragExplore : `Real Camera: ${previewCameraMode.toUpperCase()}`}
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">{t.selectSlidePrompt}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- RIGHT SIDEBAR & FOOTER --- */}
            {!rightSidebarOpen && (
                 <div className="hidden md:flex flex-col border-l rtl:border-l-0 rtl:border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 z-20 shrink-0 w-12 items-center py-4 gap-4">
                     <button onClick={() => setRightSidebarOpen(true)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400 hover:text-blue-500 transition-colors" title={t.properties}>
                         <Settings size={20} />
                     </button>
                     <div className="w-8 h-px bg-slate-200 dark:bg-slate-800" />
                     <button onClick={() => setMode('dashboard')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400 hover:text-green-500 transition-colors" title={t.done}>
                         <CheckSquare size={20} />
                     </button>
                 </div>
            )}

            <div className={`
                absolute md:static inset-0 md:inset-auto z-40 bg-white dark:bg-slate-950
                ${activeTab === 'properties' ? 'flex' : 'hidden'} md:flex 
                flex-col border-l rtl:border-l-0 rtl:border-r border-slate-200 dark:border-slate-800 shadow-xl shrink-0 h-full
                transition-all duration-300 ease-in-out
                ${rightSidebarOpen ? 'w-full md:w-80' : 'w-0 md:w-0 overflow-hidden'}
            `}>
                <div className="flex-1 min-h-0 flex flex-col min-w-[320px] md:min-w-0">
                    <div className="flex-1 min-h-0 overflow-hidden relative">
                        <SlideEditor onClose={() => { if (window.innerWidth < 768) setActiveTab('preview'); else setRightSidebarOpen(false); }} />
                    </div>
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0 z-30 hidden md:block">
                         <button onClick={() => setMode('dashboard')} className="w-full py-3 bg-slate-800 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 rounded-lg text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                            <CheckSquare size={16} />
                            {t.done}
                         </button>
                    </div>
                </div>
            </div>

            <div className="md:hidden h-14 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around shrink-0 z-50 fixed bottom-0 left-0 right-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <button onClick={() => { setActiveTab('outline'); setLeftSidebarOpen(true); }} className={`flex flex-col items-center gap-1 p-2 flex-1 ${activeTab === 'outline' ? 'text-blue-500' : 'text-slate-400'}`}><Layers size={20} /><span className="text-[10px] font-bold uppercase">{t.outline}</span></button>
                <button onClick={() => setActiveTab('preview')} className={`flex flex-col items-center gap-1 p-2 flex-1 ${activeTab === 'preview' ? 'text-blue-500' : 'text-slate-400'}`}><Eye size={20} /><span className="text-[10px] font-bold uppercase">{t.preview}</span></button>
                <button onClick={() => { setActiveTab('properties'); setRightSidebarOpen(true); }} className={`flex flex-col items-center gap-1 p-2 flex-1 ${activeTab === 'properties' ? 'text-blue-500' : 'text-slate-400'}`}><Sliders size={20} /><span className="text-[10px] font-bold uppercase">{t.properties}</span></button>
                <button onClick={() => setShowGuide(true)} className="flex flex-col items-center gap-1 p-2 flex-1 text-slate-400 hover:text-blue-500"><BookOpen size={20} /><span className="text-[10px] font-bold uppercase">{t.userGuide}</span></button>
            </div>
        </div>
    );
};