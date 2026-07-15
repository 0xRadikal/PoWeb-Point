// Pure presentation-style helpers extracted from SlideTemplates.tsx.
// Keeping these non-component exports in their own module lets the template
// file export only React components, which satisfies react-refresh/HMR and
// keeps styling logic reusable and independently testable.

import type React from 'react';
import type { SlideData, SlideStyle } from '../../core/types';

const getEase = (name?: string) => {
    switch (name) {
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

    switch (type) {
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
};

export const getPatternStyle = (style: SlideStyle, isDark: boolean): React.CSSProperties | undefined => {
    if (!style.pattern || style.pattern === 'none') return undefined;

    const color = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
    const size = '20px 20px';
    const opacity = style.patternOpacity ?? 0.5;

    let background = '';

    switch (style.pattern) {
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
};

export const getStyleClasses = (slide: SlideData) => {
    const font = slide.style?.fontFamily;
    const fontFamily = font === 'serif' ? 'font-serif' : font === 'mono' ? 'font-mono' : 'font-sans';
    const align = slide.style?.textAlignment || 'left';

    const bgStyle: React.CSSProperties = {};
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
};

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
