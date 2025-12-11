


import React, { memo, useState, useEffect } from 'react';
import { motion as _motion } from 'framer-motion';
import { SlideData, SlideStyle } from '../../core/types';
import ReactMarkdown from 'react-markdown';
import { Quote, ArrowRight, ExternalLink, MousePointerClick, AlertCircle, Image as ImageIcon } from 'lucide-react';

const motion = _motion as any;

// --- UTILS & HELPERS ---

const getEase = (name?: string) => {
    switch(name) {
        case 'linear': return 'linear';
        case 'easeIn': return 'easeIn';
        case 'easeOut': return 'easeOut';
        case 'easeInOut': return 'easeInOut';
        case 'circIn': return 'circIn';
        case 'circOut': return 'circOut';
        case 'backIn': return 'backIn';
        case 'backOut': return 'backOut';
        case 'anticipate': return 'anticipate';
        case 'bounce': return [0.08, 0.82, 0.17, 1];
        default: return [0.22, 1, 0.36, 1];
    }
};

export const getVariants = (type?: string, config: { duration?: number, delay?: number, ease?: string } = {}) => {
    const duration = config.duration ?? 0.8;
    const baseDelay = config.delay ?? 0;
    const ease = getEase(config.ease);

    switch(type) {
        case 'fade-in':
            return {
                hidden: { opacity: 0 },
                visible: (custom: number) => ({ opacity: 1, transition: { delay: baseDelay + (custom * 0.1), duration, ease } })
            };
        case 'zoom':
            return {
                hidden: { opacity: 0, scale: 0.8 },
                visible: (custom: number) => ({ opacity: 1, scale: 1, transition: { delay: baseDelay + (custom * 0.1), duration, ease: config.ease === 'default' ? 'spring' : ease } })
            };
        case 'slide-right':
             return {
                hidden: { opacity: 0, x: -50 },
                visible: (custom: number) => ({ opacity: 1, x: 0, transition: { delay: baseDelay + (custom * 0.1), duration, ease } })
            };
        case 'slide-left':
             return {
                hidden: { opacity: 0, x: 50 },
                visible: (custom: number) => ({ opacity: 1, x: 0, transition: { delay: baseDelay + (custom * 0.1), duration, ease } })
            };
        case 'fade-up':
        default:
            return {
                hidden: { opacity: 0, y: 30 },
                visible: (custom: number) => ({ opacity: 1, y: 0, transition: { delay: baseDelay + (custom * 0.15), duration, ease } })
            };
    }
}

export const getPatternStyle = (style: SlideStyle, isDark: boolean): React.CSSProperties | undefined => {
    if (!style.pattern || style.pattern === 'none') return undefined;
    
    const color = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
    const size = '20px 20px';
    const opacity = style.patternOpacity ?? 0.5;

    let background = '';

    switch(style.pattern) {
        case 'dots':
            background = `radial-gradient(${color} 1.5px, transparent 1.5px)`;
            break;
        case 'grid':
            background = `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`;
            break;
        case 'lines':
            background = `repeating-linear-gradient(45deg, ${color} 0, ${color} 1px, transparent 0, transparent 50%)`;
            break;
        case 'checker':
            background = `conic-gradient(${color} 90deg, transparent 90deg 180deg, ${color} 180deg 270deg, transparent 270deg)`;
            break;
        case 'noise':
             // Simple SVG noise URL for brevity
            background = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='${opacity}'/%3E%3C/svg%3E")`;
            return { backgroundImage: background, opacity: 1, backgroundSize: 'cover' };
    }

    return {
        backgroundImage: background,
        backgroundSize: size,
        opacity
    };
}

export const getStyleClasses = (slide: SlideData) => {
    const font = slide.style?.fontFamily;
    const fontFamily = font === 'serif' ? 'font-serif' : font === 'mono' ? 'font-mono' : 'font-sans';
    const align = slide.style?.textAlignment || 'left';
    
    let bgStyle: React.CSSProperties = {};
    if (slide.style?.backgroundType === 'solid' && slide.style?.backgroundColor) {
        bgStyle.backgroundColor = slide.style.backgroundColor;
    } else if (slide.style?.backgroundType === 'gradient' && slide.style?.gradientColors) {
        const type = slide.style.gradientType === 'radial' ? 'radial-gradient' : 'linear-gradient';
        const param = slide.style.gradientType === 'radial' ? 'circle at center' : `${slide.style.gradientDegree || 135}deg`;
        bgStyle.backgroundImage = `${type}(${param}, ${slide.style.gradientColors[0]}, ${slide.style.gradientColors[1]})`;
    }

    // Frame Style
    const frameStyle: React.CSSProperties = {
        borderWidth: slide.style?.borderWidth ? `${slide.style.borderWidth}px` : undefined,
        borderColor: slide.style?.borderColor,
        borderRadius: slide.style?.borderRadius ? `${slide.style.borderRadius}px` : undefined,
    };

    const animConfig = {
        duration: slide.style?.animationDuration,
        delay: slide.style?.animationDelay,
        ease: slide.style?.animationEasing
    };
    const justify = align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start';

    return { 
        fontFamily, 
        color: slide.style?.textColor, 
        accent: slide.style?.accentColor,
        align: align === 'center' ? 'text-center items-center' : align === 'right' ? 'text-right items-end' : 'text-left items-start',
        textAlign: align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left',
        justify,
        bgStyle,
        frameStyle,
        contentWidth: slide.style?.contentWidth ? `${slide.style.contentWidth}%` : '100%',
        variants: getVariants(slide.style?.animation, animConfig)
    };
}

export const getLayoutClasses = (slide: SlideData) => {
    let score = 0;
    score += (slide.title?.length || 0) * 1.5;
    score += (slide.subtitle?.length || 0) * 1;
    score += (slide.content?.length || 0) * 0.5;
    if (slide.bullets) score += slide.bullets.length * 15;
    if (slide.enableImage && slide.imageUrl) score *= 1.8;

    if (score > 600) return { padding: 'p-4 md:p-6', gap: 'gap-4', spacing: 'space-y-2', titleSize: 'text-lg md:text-2xl', subtitleSize: 'text-sm md:text-base', bodySize: 'text-xs md:text-sm', smallSize: 'text-[10px]', iconSize: 16 };
    if (score > 400) return { padding: 'p-5 md:p-8', gap: 'gap-4 md:gap-6', spacing: 'space-y-3', titleSize: 'text-xl md:text-3xl', subtitleSize: 'text-base md:text-lg', bodySize: 'text-sm md:text-base', smallSize: 'text-xs', iconSize: 20 };
    if (score > 200) return { padding: 'p-6 md:p-10', gap: 'gap-6 md:gap-8', spacing: 'space-y-3 md:space-y-4', titleSize: 'text-2xl md:text-4xl', subtitleSize: 'text-lg md:text-xl', bodySize: 'text-sm md:text-lg', smallSize: 'text-xs md:text-sm', iconSize: 24 };
    if (score > 100) return { padding: 'p-8 md:p-12', gap: 'gap-8 md:gap-10', spacing: 'space-y-4 md:space-y-6', titleSize: 'text-3xl md:text-5xl', subtitleSize: 'text-xl md:text-3xl', bodySize: 'text-base md:text-xl', smallSize: 'text-sm md:text-base', iconSize: 28 };
    return { padding: 'p-8 md:p-16', gap: 'gap-8 md:gap-12', spacing: 'space-y-6 md:space-y-8', titleSize: 'text-4xl md:text-7xl', subtitleSize: 'text-2xl md:text-4xl', bodySize: 'text-lg md:text-2xl', smallSize: 'text-base md:text-lg', iconSize: 32 };
};

const MarkdownRenderer: React.FC<{ content: string; className?: string; color?: string; layout: ReturnType<typeof getLayoutClasses> }> = memo(({ content, className, color, layout }) => {
    return (
        <div className={className}>
            <ReactMarkdown
                components={{
                    h1: ({node, ...props}) => <h1 className={`font-bold mb-3 mt-2 ${layout.subtitleSize}`} style={{ color }} {...props} />,
                    h2: ({node, ...props}) => <h2 className={`font-bold mb-2 mt-3 ${layout.bodySize}`} style={{ color }} {...props} />,
                    h3: ({node, ...props}) => <h3 className={`font-bold mb-1 mt-2 ${layout.bodySize}`} style={{ color }} {...props} />,
                    p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-3 space-y-1 inline-block text-left" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-3 space-y-1 inline-block text-left" {...props} />,
                    li: ({node, ...props}) => <li className="opacity-90 pl-1" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 italic opacity-80 mb-3 text-left" {...props} />,
                    code: ({node, ...props}) => <code className="bg-slate-200/50 dark:bg-slate-800/50 rounded px-1.5 py-0.5 font-mono text-[0.9em]" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold opacity-100" {...props} />,
                    em: ({node, ...props}) => <em className="italic opacity-90" {...props} />,
                    a: ({node, ...props}) => <span className="underline underline-offset-2 opacity-80" {...props} />
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
});

// --- SAFE IMAGE COMPONENT ---

const ImageWithFallback = ({ src, alt, className, style, ...props }: any) => {
    const [status, setStatus] = React.useState<'loading' | 'loaded' | 'error'>('loading');

    // Reset status when src changes
    React.useEffect(() => {
        setStatus('loading');
    }, [src]);

    return (
        <>
            {status === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 z-10">
                    <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
                </div>
            )}
            {status === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 p-2 text-center z-10">
                     <AlertCircle size={24} className="mb-2 opacity-50" />
                     <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Image Error</span>
                </div>
            )}
            <img 
                src={src} 
                alt={alt} 
                className={className}
                style={{ 
                    ...style, 
                    opacity: status === 'loaded' ? (style?.opacity ?? 1) : 0 
                }}
                onLoad={() => setStatus('loaded')}
                onError={() => setStatus('error')}
                {...props}
            />
        </>
    );
};

const SlideImage: React.FC<{ slide: SlideData }> = memo(({ slide }) => {
    if (!slide.imageUrl) return null;
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="w-full h-full flex items-center justify-center relative rounded-2xl overflow-hidden shadow-2xl bg-slate-100 dark:bg-slate-800"
        >
             <ImageWithFallback 
                src={slide.imageUrl} 
                alt={slide.title} 
                className="w-full h-full"
                style={{ 
                    objectFit: slide.style?.imageFit || 'cover',
                    transform: `
                        scale(${slide.style?.imageScale || 1}) 
                        translate(${slide.style?.imageOffsetX || 0}%, ${slide.style?.imageOffsetY || 0}%) 
                        rotate(${slide.style?.imageRotation || 0}deg)
                    `,
                    opacity: slide.style?.imageOpacity ?? 1
                }}
            />
        </motion.div>
    );
});

// --- TEMPLATES ---

export const HeroSlide = memo(({ slide }: { slide: SlideData }) => {
  const style = getStyleClasses(slide);
  const layout = getLayoutClasses(slide);
  const showImage = slide.enableImage && slide.imageUrl;
  const isStatement = !!slide.content && !slide.imageUrl;

  return (
    <div className={`flex ${showImage ? `flex-col md:flex-row ${layout.gap}` : 'flex-col justify-center'} h-full ${layout.padding} max-w-7xl mx-auto z-10 relative items-center`} style={{ width: style.contentWidth }}>
        {!showImage && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 0.1 }} transition={{ duration: 2 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-current to-transparent rounded-full -z-10 blur-3xl pointer-events-none" style={{ color: style.accent || '#3b82f6' }} />
        )}
        <div className={`flex-1 flex flex-col ${style.align} ${showImage ? 'w-full' : 'max-w-5xl mx-auto'} max-h-full overflow-y-auto no-scrollbar`}>
            {slide.title && (
                 <motion.div custom={0} variants={style.variants} initial="hidden" animate="visible" className="flex items-center gap-3 mb-4 md:mb-6">
                    <div className="w-8 h-1 rounded-full" style={{ backgroundColor: style.accent || '#3b82f6' }} />
                    <span className={`${layout.subtitleSize} font-bold uppercase tracking-widest opacity-70`} style={{ color: style.color }}>{slide.title}</span>
                </motion.div>
            )}
            <motion.div custom={1} variants={style.variants} initial="hidden" animate="visible" style={{ color: style.color || undefined }}>
                 {isStatement ? (
                    <MarkdownRenderer content={slide.content || ''} layout={layout} color={style.color} className={`${layout.titleSize} font-bold leading-tight ${style.textAlign}`} />
                 ) : (
                    <h1 className={`${layout.titleSize} font-bold leading-tight mb-4`} style={{ color: style.color }}>{slide.content || slide.title}</h1>
                 )}
            </motion.div>
            {slide.subtitle && (
                <motion.div custom={2} variants={style.variants} initial="hidden" animate="visible" className={`mt-6 md:mt-8 ${layout.subtitleSize} opacity-80 leading-relaxed font-light border-l-4 pl-6`} style={{ color: style.color || undefined, borderColor: style.accent || '#3b82f6' }}>
                    <MarkdownRenderer content={slide.subtitle} layout={layout} color={style.color} />
                </motion.div>
            )}
        </div>
        {showImage && <div className="flex-1 w-full h-full max-h-[35vh] md:max-h-full relative mt-4 md:mt-0"><SlideImage slide={slide} /></div>}
    </div>
  );
});

export const ArticleSlide = memo(({ slide }: { slide: SlideData }) => {
  const style = getStyleClasses(slide);
  const layout = getLayoutClasses(slide);
  const showImage = slide.enableImage && slide.imageUrl;
  return (
    <div className={`flex ${showImage ? `flex-col md:flex-row ${layout.gap}` : 'flex-col'} h-full ${layout.padding} max-w-7xl mx-auto z-10 relative items-start`} style={{ width: style.contentWidth }}>
        <div className={`flex-1 flex flex-col ${style.align} w-full h-full overflow-y-auto no-scrollbar pr-2`}>
            <motion.div custom={0} variants={style.variants} initial="hidden" animate="visible" className="w-full shrink-0">
                <h1 className={`${layout.titleSize} font-bold leading-tight mb-2 border-b pb-4 border-slate-200/20`} style={{ color: style.color }}>{slide.title}</h1>
                {slide.subtitle && <h3 className={`${layout.subtitleSize} font-medium opacity-60 mb-6 md:mb-8`} style={{ color: style.accent }}>{slide.subtitle}</h3>}
            </motion.div>
            <motion.div custom={1} variants={style.variants} initial="hidden" animate="visible" className={`prose dark:prose-invert max-w-none ${layout.bodySize}`} style={{ color: style.color }}><MarkdownRenderer content={slide.content || ''} layout={layout} color={style.color} /></motion.div>
            {slide.bullets && slide.bullets.length > 0 && (
                 <motion.div custom={2} variants={style.variants} initial="hidden" animate="visible" className="mt-6 md:mt-8 bg-slate-100/50 dark:bg-slate-800/50 p-4 md:p-6 rounded-xl border-l-4" style={{ borderColor: style.accent || '#3b82f6' }}>
                     <h4 className="font-bold uppercase text-xs tracking-widest mb-3 md:mb-4 opacity-70" style={{ color: style.color }}>Key Takeaways</h4>
                     <ul className={`space-y-2 ${layout.bodySize}`} style={{ color: style.color }}>{slide.bullets.map((b, i) => <li key={i} className="flex gap-3"><span className="text-lg leading-none" style={{ color: style.accent }}>•</span><span className="opacity-90">{b}</span></li>)}</ul>
                 </motion.div>
            )}
        </div>
        {showImage && <div className="flex-1 w-full h-full max-h-[30vh] md:max-h-full relative sticky top-0 mt-4 md:mt-0"><SlideImage slide={slide} /></div>}
    </div>
  );
});

export const ContentImageSlide = memo(({ slide }: { slide: SlideData }) => {
  const style = getStyleClasses(slide);
  const layout = getLayoutClasses(slide);
  const showImage = slide.enableImage && slide.imageUrl;
  return (
    <div className={`flex ${showImage ? `flex-col md:flex-row ${layout.gap}` : 'flex-col justify-center'} h-full items-center ${layout.padding} max-w-7xl mx-auto z-10 relative`} style={{ width: style.contentWidth }}>
        <div className={`flex-1 ${layout.spacing} flex flex-col ${style.align} w-full max-h-full overflow-y-auto no-scrollbar`}>
            <motion.h2 custom={0} variants={style.variants} initial="hidden" animate="visible" className={`${layout.titleSize} font-bold leading-tight`} style={{ color: style.color || undefined }}>{slide.title}</motion.h2>
             {slide.subtitle && (
                <motion.h3 custom={1} variants={style.variants} initial="hidden" animate="visible" className={`${layout.subtitleSize} font-medium opacity-80`} style={{ color: style.accent }}>{slide.subtitle}</motion.h3>
            )}
            <motion.div custom={2} variants={style.variants} initial="hidden" animate="visible" className={`${layout.bodySize} leading-loose opacity-90`} style={{ color: style.color }}><MarkdownRenderer content={slide.content || ''} layout={layout} color={style.color} /></motion.div>
        </div>
        {showImage && <div className="flex-1 w-full h-full max-h-[40vh] md:max-h-full relative flex items-center justify-center perspective-1000 mt-4 md:mt-0"><SlideImage slide={slide} /></div>}
    </div>
  );
});

export const ListSlide = memo(({ slide }: { slide: SlideData }) => {
    const style = getStyleClasses(slide);
    const layout = getLayoutClasses(slide);
    const showImage = slide.enableImage && slide.imageUrl;
    return (
        <div className={`flex ${showImage ? `flex-col md:flex-row ${layout.gap}` : 'flex-col justify-center'} h-full items-center ${layout.padding} max-w-7xl mx-auto z-10 relative`} style={{ width: style.contentWidth }}>
            <div className={`flex-1 ${layout.spacing} flex flex-col ${style.align} w-full max-h-full overflow-y-auto no-scrollbar`}>
                <motion.h2 custom={0} variants={style.variants} initial="hidden" animate="visible" className={`${layout.titleSize} font-bold pb-2 md:pb-4 inline-block border-b-2`} style={{ color: style.color || undefined, borderColor: style.accent || '#3b82f6' }}>{slide.title}</motion.h2>
                {slide.subtitle && <motion.h3 custom={0.5} variants={style.variants} initial="hidden" animate="visible" className={`${layout.subtitleSize} opacity-70 mb-2`} style={{ color: style.color }}>{slide.subtitle}</motion.h3>}
                <div className={`${layout.bodySize} mb-2 md:mb-4 opacity-80`} style={{ color: style.color }}><MarkdownRenderer content={slide.content || ''} layout={layout} color={style.color} /></div>
                <ul className={`${layout.spacing} w-full`}>{slide.bullets?.map((bullet, idx) => <motion.li key={idx} custom={idx + 1} variants={style.variants} initial="hidden" animate="visible" className={`flex items-start gap-4 ${layout.bodySize} opacity-90 ${style.justify}`} style={{ color: style.color }}><span className="mt-2 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: style.accent || '#3b82f6' }} /><span>{bullet}</span></motion.li>)}</ul>
            </div>
            {showImage && <div className="flex-1 w-full h-full max-h-[35vh] md:max-h-full relative flex items-center justify-center mt-4 md:mt-0"><SlideImage slide={slide} /></div>}
        </div>
    );
});

export const BigNumberSlide = memo(({ slide }: { slide: SlideData }) => {
    const style = getStyleClasses(slide);
    const layout = getLayoutClasses(slide);
    return (
        <div className={`flex flex-col md:flex-row h-full items-center justify-center ${layout.padding} ${layout.gap} max-w-7xl mx-auto z-10 relative`} style={{ width: style.contentWidth }}>
            <motion.div initial={{ scale: 0.5, opacity: 0, rotate: -10 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 100, delay: 0.2, duration: 1 }} className="text-[20vw] md:text-[10rem] font-bold leading-none select-none shrink-0" style={{ color: 'transparent', WebkitBackgroundClip: 'text', backgroundImage: `linear-gradient(to bottom right, ${style.accent || '#3b82f6'}, #10b981)` }}>{slide.subtitle}</motion.div>
            <div className={`max-w-xl ${layout.spacing} flex flex-col ${style.align} max-h-full overflow-y-auto no-scrollbar text-center md:text-left`}>
                <motion.h2 custom={1} variants={style.variants} initial="hidden" animate="visible" className={`${layout.titleSize} font-bold`} style={{ color: style.color || undefined }}>{slide.title}</motion.h2>
                <motion.div custom={2} variants={style.variants} initial="hidden" animate="visible" className={`${layout.bodySize} leading-relaxed opacity-80`} style={{ color: style.color }}><MarkdownRenderer content={slide.content || ''} layout={layout} color={style.color} /></motion.div>
            </div>
        </div>
    );
});

export const TimelineSlide = memo(({ slide }: { slide: SlideData }) => {
    const style = getStyleClasses(slide);
    const layout = getLayoutClasses(slide);
    const showImage = slide.enableImage && slide.imageUrl;

    if (showImage) {
        return (
            <div className={`flex flex-col md:flex-row h-full ${layout.padding} ${layout.gap} max-w-7xl mx-auto z-10 relative`} style={{ width: style.contentWidth }}>
                <div className={`flex-1 flex flex-col ${style.align} w-full h-full overflow-y-auto no-scrollbar`}>
                    <motion.div custom={0} variants={style.variants} initial="hidden" animate="visible" className="mb-6 md:mb-8 shrink-0">
                        <h2 className={`${layout.titleSize} font-bold mb-2`} style={{ color: style.color }}>{slide.title}</h2>
                        {slide.subtitle && <p className={`${layout.subtitleSize} opacity-60 mb-2`} style={{ color: style.color }}>{slide.subtitle}</p>}
                        {slide.content && <div className={`${layout.bodySize} opacity-80`} style={{ color: style.color }}><MarkdownRenderer content={slide.content} layout={layout} color={style.color} /></div>}
                    </motion.div>
                    <div className="relative pl-6 border-l-4 border-slate-200 dark:border-slate-700 space-y-8 md:space-y-10 py-2 ml-3">
                        {(slide.bullets || []).map((b, i) => { const [date, ...rest] = b.split(':'); return <motion.div key={i} custom={i + 1} variants={style.variants} initial="hidden" animate="visible" className="relative pl-6"><div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 bg-white dark:bg-slate-900 transition-transform hover:scale-125" style={{ borderColor: style.accent }} /><div className="font-bold text-lg md:text-xl mb-1" style={{ color: style.accent }}>{date}</div><div className={`${layout.bodySize} opacity-90`} style={{ color: style.color }}><MarkdownRenderer content={rest.join(':')} layout={layout} color={style.color} /></div></motion.div> })}
                    </div>
                </div>
                <div className="flex-1 w-full h-full max-h-[35vh] md:max-h-full relative sticky top-0 mt-4 md:mt-0"><SlideImage slide={slide} /></div>
            </div>
        );
    }
    return (
        <div className={`flex flex-col h-full ${layout.padding} max-w-7xl mx-auto z-10 relative`} style={{ width: style.contentWidth }}>
             <motion.div custom={0} variants={style.variants} initial="hidden" animate="visible" className={`text-center mb-6 md:mb-12 shrink-0`}>
                 <h2 className={`${layout.titleSize} font-bold mb-2`} style={{ color: style.color }}>{slide.title}</h2>
                 {slide.subtitle && <p className={`${layout.subtitleSize} opacity-60 mb-2`} style={{ color: style.color }}>{slide.subtitle}</p>}
                 {slide.content && <div className={`${layout.bodySize} opacity-80 max-w-3xl mx-auto`} style={{ color: style.color }}><MarkdownRenderer content={slide.content} layout={layout} color={style.color} /></div>}
             </motion.div>
             <div className="flex-1 flex flex-col md:justify-center relative w-full min-h-[300px] md:min-h-[400px] overflow-y-auto md:overflow-visible">
                 <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.5 }} className="hidden md:block absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full shadow-sm origin-left" style={{ backgroundColor: style.color || 'currentColor', opacity: 0.5 }} />
                 <div className="md:hidden absolute left-6 top-0 bottom-0 w-1 rounded-full opacity-20" style={{ backgroundColor: style.color || 'currentColor' }} />
                 <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center w-full relative space-y-6 md:space-y-0">
                     {(slide.bullets || []).map((b, i) => {
                         const [date, ...rest] = b.split(':');
                         const isTop = i % 2 === 0;
                         return (
                             <motion.div key={i} custom={i + 1} variants={style.variants} initial="hidden" animate="visible" className="relative flex md:flex-col items-center group md:flex-1 pl-12 md:pl-0">
                                 <div className={`hidden md:block absolute left-1/2 -translate-x-1/2 w-px border-l-2 border-dashed transition-all duration-500 ${isTop ? 'bottom-[12px] h-12 group-hover:h-20' : 'top-[12px] h-12 group-hover:h-20'}`} style={{ borderColor: style.accent, opacity: 0.4 }} />
                                 <div className="md:hidden absolute left-[22px] top-6 w-3 h-3 rounded-full border-2 bg-white dark:bg-slate-900 z-10" style={{ borderColor: style.accent }} />
                                 <div className={`hidden md:block w-5 h-5 rounded-full border-4 bg-white dark:bg-slate-900 z-10 transition-transform duration-300 group-hover:scale-150 shadow-sm`} style={{ borderColor: style.accent }} />
                                 <div className={`w-full md:absolute md:left-1/2 md:-translate-x-1/2 md:w-[180px] lg:w-[240px] md:text-center transition-all duration-300 ${isTop ? 'md:bottom-full md:mb-14 md:group-hover:mb-24' : 'md:top-full md:mt-14 md:group-hover:mt-24'}`}>
                                     <div className="font-bold text-xl md:text-2xl mb-2 tracking-tight text-left md:text-center" style={{ color: style.accent }}>{date}</div>
                                     <div className="text-sm bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-4 rounded-xl border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-shadow text-left md:text-center" style={{ color: style.color }}><MarkdownRenderer content={rest.join(':')} layout={layout} color={style.color} /></div>
                                 </div>
                             </motion.div>
                         )
                     })}
                 </div>
             </div>
        </div>
    )
});

export const GridSlide = memo(({ slide }: { slide: SlideData }) => {
    const style = getStyleClasses(slide);
    const layout = getLayoutClasses(slide);
    return (
        <div className={`flex flex-col h-full ${layout.padding} max-w-7xl mx-auto z-10 relative`} style={{ width: style.contentWidth }}>
             <motion.div custom={0} variants={style.variants} initial="hidden" animate="visible" className={`text-center mb-8 md:mb-12 shrink-0`}>
                 <h2 className={`${layout.titleSize} font-bold mb-2`} style={{ color: style.color }}>{slide.title}</h2>
                 {slide.subtitle && <p className={`${layout.subtitleSize} opacity-60 mb-2`} style={{ color: style.color }}>{slide.subtitle}</p>}
                 <div className={`${layout.bodySize} opacity-80 max-w-3xl mx-auto`} style={{ color: style.color }}><MarkdownRenderer content={slide.content || ''} layout={layout} color={style.color} /></div>
             </motion.div>
             <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-4">
                 {(slide.bullets || []).map((b, i) => <motion.div key={i} custom={i + 1} variants={style.variants} initial="hidden" animate="visible" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700 p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"><div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm md:text-base" style={{ backgroundColor: style.accent }}>{i+1}</div><p className="font-medium text-base md:text-lg" style={{ color: style.color }}>{b}</p></motion.div>)}
             </div>
        </div>
    )
});

export const StatsSlide = memo(({ slide }: { slide: SlideData }) => {
    const style = getStyleClasses(slide);
    const layout = getLayoutClasses(slide);
    return (
        <div className={`flex flex-col h-full justify-center ${layout.padding} max-w-7xl mx-auto z-10 relative`} style={{ width: style.contentWidth }}>
             <motion.div custom={0} variants={style.variants} initial="hidden" animate="visible" className={`text-center mb-8 md:mb-16 shrink-0`}>
                 <h2 className={`${layout.titleSize} font-bold mb-2`} style={{ color: style.color }}>{slide.title}</h2>
                 {slide.subtitle && <p className={`${layout.subtitleSize} opacity-60 mb-2`} style={{ color: style.color }}>{slide.subtitle}</p>}
                 {slide.content && <div className={`${layout.bodySize} opacity-80 max-w-3xl mx-auto`} style={{ color: style.color }}><MarkdownRenderer content={slide.content} layout={layout} color={style.color} /></div>}
             </motion.div>
             <div className={`flex flex-wrap ${style.justify} gap-6 md:gap-16 justify-center`}>
                 {(slide.bullets || []).map((b, i) => { const [val, ...rest] = b.split(':'); return <motion.div key={i} custom={i + 1} variants={style.variants} initial="hidden" animate="visible" className="flex-1 min-w-[150px] md:min-w-[200px] text-center p-4 md:p-6 rounded-2xl bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-sm"><div className="text-4xl md:text-7xl font-black mb-2 md:mb-4 tracking-tight" style={{ color: style.accent }}>{val}</div><div className="text-sm md:text-xl font-medium uppercase tracking-widest opacity-80" style={{ color: style.color }}>{rest.join(':')}</div></motion.div> })}
             </div>
        </div>
    )
});

export const ComparisonSlide = memo(({ slide }: { slide: SlideData }) => {
    const style = getStyleClasses(slide);
    const layout = getLayoutClasses(slide);
    const leftTitle = slide.metadata?.leftTitle || 'Option A';
    const rightTitle = slide.metadata?.rightTitle || 'Option B';
    const leftItems = slide.metadata?.leftItems || [];
    const rightItems = slide.metadata?.rightItems || [];

    return (
        <div className={`flex flex-col h-full ${layout.padding} max-w-7xl mx-auto z-10 relative`} style={{ width: style.contentWidth }}>
             <motion.div custom={0} variants={style.variants} initial="hidden" animate="visible" className="text-center mb-6 md:mb-12 shrink-0">
                <h2 className={`${layout.titleSize} font-bold mb-2`} style={{ color: style.color }}>{slide.title}</h2>
                {slide.subtitle && <p className={`${layout.subtitleSize} opacity-60 mb-2`} style={{ color: style.color }}>{slide.subtitle}</p>}
                {slide.content && <div className={`${layout.bodySize} opacity-80 max-w-3xl mx-auto`} style={{ color: style.color }}><MarkdownRenderer content={slide.content} layout={layout} color={style.color} /></div>}
             </motion.div>
             <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-12 overflow-hidden">
                 <motion.div custom={1} variants={style.variants} initial="hidden" animate="visible" className="flex-1 flex flex-col bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl p-4 md:p-8 overflow-y-auto no-scrollbar"><h3 className={`${layout.subtitleSize} font-bold mb-4 md:mb-6 text-center text-red-600 dark:text-red-400 uppercase tracking-widest`}>{leftTitle}</h3><ul className="space-y-3 md:space-y-4">{leftItems.map((item, i) => <li key={i} className={`flex gap-3 ${layout.bodySize}`} style={{ color: style.color }}><span className="text-red-500 font-bold">✕</span><span className="opacity-90">{item}</span></li>)}</ul></motion.div>
                 <div className="md:absolute left-1/2 top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 md:w-16 md:h-16 rounded-full bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 font-black text-sm md:text-xl text-slate-300 mx-auto my-2 md:my-0">VS</div>
                 <motion.div custom={2} variants={style.variants} initial="hidden" animate="visible" className="flex-1 flex flex-col bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-2xl p-4 md:p-8 overflow-y-auto no-scrollbar"><h3 className={`${layout.subtitleSize} font-bold mb-4 md:mb-6 text-center text-blue-600 dark:text-blue-400 uppercase tracking-widest`}>{rightTitle}</h3><ul className="space-y-3 md:space-y-4">{rightItems.map((item, i) => <li key={i} className={`flex gap-3 ${layout.bodySize}`} style={{ color: style.color }}><span className="text-blue-500 font-bold">✓</span><span className="opacity-90">{item}</span></li>)}</ul></motion.div>
             </div>
        </div>
    )
});

export const QuoteSlide = memo(({ slide }: { slide: SlideData }) => {
    const style = getStyleClasses(slide);
    const layout = getLayoutClasses(slide);
    const showImage = slide.enableImage && slide.imageUrl;
    
    return (
        <div className={`flex flex-col h-full items-center justify-center ${layout.padding} max-w-6xl mx-auto z-10 relative`} style={{ width: style.contentWidth }}>
             <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 0.1 }} className="absolute text-[20rem] font-serif leading-none select-none pointer-events-none" style={{ color: style.accent, top: -40, left: 40 }}>“</motion.div>
             
             <div className="relative z-10 text-center flex flex-col items-center max-w-4xl">
                 <Quote size={48} className="mb-6 opacity-80" style={{ color: style.accent }} />
                 <motion.blockquote custom={0} variants={style.variants} initial="hidden" animate="visible" className={`${layout.titleSize} font-serif leading-tight mb-8 md:mb-12 italic`} style={{ color: style.color }}>
                     "{slide.content}"
                 </motion.blockquote>
                 
                 <motion.div custom={1} variants={style.variants} initial="hidden" animate="visible" className="flex flex-col items-center gap-3">
                     {showImage && (
                         <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 shadow-md mb-2 relative" style={{ borderColor: style.accent }}>
                             <ImageWithFallback src={slide.imageUrl} alt={slide.subtitle} className="w-full h-full object-cover" />
                         </div>
                     )}
                     <div className={`font-bold ${layout.subtitleSize} tracking-wider uppercase`} style={{ color: style.accent }}>— {slide.subtitle || 'Unknown'} —</div>
                     {slide.title && <div className={`${layout.bodySize} opacity-60`} style={{ color: style.color }}>{slide.title}</div>}
                 </motion.div>
             </div>
        </div>
    );
});

export const GallerySlide = memo(({ slide }: { slide: SlideData }) => {
    const style = getStyleClasses(slide);
    const layout = getLayoutClasses(slide);
    const images = slide.metadata?.galleryImages || (slide.imageUrl ? [slide.imageUrl] : []);
    
    return (
        <div className={`flex flex-col h-full ${layout.padding} max-w-7xl mx-auto z-10 relative`} style={{ width: style.contentWidth }}>
            {(slide.title || slide.content) && (
                <motion.div custom={0} variants={style.variants} initial="hidden" animate="visible" className="mb-6 md:mb-8 text-center shrink-0">
                    {slide.title && <h2 className={`${layout.titleSize} font-bold mb-2`} style={{ color: style.color }}>{slide.title}</h2>}
                    {slide.subtitle && <h3 className={`${layout.subtitleSize} opacity-70 mb-2`} style={{ color: style.color }}>{slide.subtitle}</h3>}
                    {slide.content && <p className={`${layout.bodySize} opacity-80 max-w-3xl mx-auto`} style={{ color: style.color }}>{slide.content}</p>}
                </motion.div>
            )}
            
            <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
                <div className={`grid gap-4 ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
                    {images.map((img, i) => (
                        <motion.div 
                            key={i} 
                            custom={i + 1} 
                            variants={style.variants} 
                            initial="hidden" 
                            animate="visible" 
                            className={`rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all relative group bg-slate-200 dark:bg-slate-800 ${images.length === 3 && i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                            style={{ aspectRatio: images.length === 1 ? '16/9' : '4/3' }}
                        >
                            <ImageWithFallback src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        </motion.div>
                    ))}
                    {images.length === 0 && <div className="col-span-full h-64 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-400">Add images via the Gallery editor</div>}
                </div>
            </div>
        </div>
    );
});

export const TeamSlide = memo(({ slide }: { slide: SlideData }) => {
    const style = getStyleClasses(slide);
    const layout = getLayoutClasses(slide);
    const members = slide.metadata?.team || [];
    
    return (
        <div className={`flex flex-col h-full ${layout.padding} max-w-7xl mx-auto z-10 relative`} style={{ width: style.contentWidth }}>
            <motion.div custom={0} variants={style.variants} initial="hidden" animate="visible" className="mb-8 md:mb-12 text-center shrink-0">
                <h2 className={`${layout.titleSize} font-bold mb-2`} style={{ color: style.color }}>{slide.title}</h2>
                {slide.subtitle && <p className={`${layout.subtitleSize} opacity-60 mb-2`} style={{ color: style.color }}>{slide.subtitle}</p>}
                {slide.content && <p className={`${layout.bodySize} opacity-80 max-w-3xl mx-auto`} style={{ color: style.color }}>{slide.content}</p>}
            </motion.div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="flex flex-wrap justify-center gap-6 md:gap-8 pb-4">
                    {members.map((member, i) => (
                        <motion.div 
                            key={i} 
                            custom={i + 1} 
                            variants={style.variants} 
                            initial="hidden" 
                            animate="visible" 
                            className="flex flex-col items-center w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.33%-1.5rem)] lg:w-[calc(25%-1.5rem)] bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-4 border-4 bg-slate-200 dark:bg-slate-800 transition-colors group-hover:border-blue-500/30 relative" style={{ borderColor: style.accent }}>
                                {member.imageUrl ? (
                                    <ImageWithFallback src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-400 dark:text-slate-600 uppercase bg-slate-100 dark:bg-slate-800">
                                        {member.name.substring(0, 2)}
                                    </div>
                                )}
                            </div>
                            <h3 className="font-bold text-lg mb-1" style={{ color: style.color }}>{member.name}</h3>
                            <div className="text-sm font-medium uppercase tracking-wider opacity-70" style={{ color: style.accent }}>{member.role}</div>
                        </motion.div>
                    ))}
                    {members.length === 0 && <div className="w-full text-center text-slate-400 py-10">Add team members via the Team editor</div>}
                </div>
            </div>
        </div>
    );
});

export const ProcessSlide = memo(({ slide }: { slide: SlideData }) => {
    const style = getStyleClasses(slide);
    const layout = getLayoutClasses(slide);
    const steps = slide.bullets || [];

    return (
        <div className={`flex flex-col h-full ${layout.padding} max-w-7xl mx-auto z-10 relative`} style={{ width: style.contentWidth }}>
            <motion.div custom={0} variants={style.variants} initial="hidden" animate="visible" className="mb-8 md:mb-12 text-center shrink-0">
                <h2 className={`${layout.titleSize} font-bold mb-2`} style={{ color: style.color }}>{slide.title}</h2>
                {slide.subtitle && <p className={`${layout.subtitleSize} opacity-60 mb-2`} style={{ color: style.color }}>{slide.subtitle}</p>}
                {slide.content && <p className={`${layout.bodySize} opacity-80 max-w-3xl mx-auto`} style={{ color: style.color }}>{slide.content}</p>}
            </motion.div>
            
            <div className="flex-1 flex items-center justify-center overflow-x-auto no-scrollbar pb-4">
                <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center w-full md:max-w-5xl">
                    {steps.map((step, i) => {
                        const [title, ...descParts] = step.split(':');
                        const desc = descParts.join(':');
                        return (
                            <React.Fragment key={i}>
                                <motion.div custom={i + 1} variants={style.variants} initial="hidden" animate="visible" className="flex-1 min-w-[200px] flex flex-col items-center text-center relative group p-4 bg-white/40 dark:bg-slate-900/40 md:bg-transparent md:dark:bg-transparent rounded-xl md:rounded-none">
                                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-lg md:text-xl text-white shadow-lg mb-4 z-10 relative" style={{ backgroundColor: style.accent || '#3b82f6' }}>
                                        {i + 1}
                                    </div>
                                    <h3 className="font-bold text-base md:text-lg mb-2" style={{ color: style.color }}>{title}</h3>
                                    <p className="text-sm opacity-80 leading-relaxed" style={{ color: style.color }}>{desc}</p>
                                </motion.div>
                                {i < steps.length - 1 && (
                                    <motion.div 
                                        custom={i + 1.5} variants={style.variants} initial="hidden" animate="visible"
                                        className="hidden md:flex flex-1 h-0.5 w-full bg-slate-300 dark:bg-slate-700 relative -top-12 -mx-4 z-0"
                                    >
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700">
                                            <ArrowRight size={16} />
                                        </div>
                                    </motion.div>
                                )}
                                {i < steps.length - 1 && <ArrowRight className="md:hidden text-slate-300 dark:text-slate-600 rotate-90 my-2" />}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});

export const CTASlide = memo(({ slide }: { slide: SlideData }) => {
    const style = getStyleClasses(slide);
    const layout = getLayoutClasses(slide);
    const links = slide.bullets || [];

    return (
        <div className={`flex flex-col h-full items-center justify-center ${layout.padding} max-w-4xl mx-auto z-10 relative text-center`} style={{ width: style.contentWidth }}>
             <motion.h2 custom={0} variants={style.variants} initial="hidden" animate="visible" className={`${layout.titleSize} font-black mb-4 md:mb-6 leading-tight`} style={{ color: style.color }}>{slide.title}</motion.h2>
             
             {slide.subtitle && (
                 <motion.h3 custom={0.5} variants={style.variants} initial="hidden" animate="visible" className={`${layout.subtitleSize} font-bold opacity-80 mb-4`} style={{ color: style.accent }}>
                     {slide.subtitle}
                 </motion.h3>
             )}

             {slide.content && (
                 <motion.div custom={1} variants={style.variants} initial="hidden" animate="visible" className={`${layout.bodySize} opacity-90 mb-8 md:mb-12 max-w-2xl mx-auto`} style={{ color: style.color }}>
                     <MarkdownRenderer content={slide.content} layout={layout} color={style.color} />
                 </motion.div>
             )}
             
             <motion.div custom={2} variants={style.variants} initial="hidden" animate="visible" className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center w-full">
                 {links.map((linkStr, i) => {
                     const [label, url] = linkStr.split(':');
                     const cleanUrl = (url || '').trim();
                     return (
                         <a 
                            key={i} 
                            href={cleanUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm md:text-base transition-all hover:scale-105 active:scale-95 shadow-lg group"
                            style={{ 
                                backgroundColor: i === 0 ? (style.accent || '#3b82f6') : 'transparent',
                                color: i === 0 ? '#ffffff' : (style.color || 'currentColor'),
                                border: i === 0 ? 'none' : `2px solid ${style.color || 'currentColor'}`
                            }}
                         >
                             {i === 0 ? <MousePointerClick size={20} /> : <ExternalLink size={20} />}
                             <span>{label.trim()}</span>
                         </a>
                     )
                 })}
             </motion.div>
        </div>
    );
});