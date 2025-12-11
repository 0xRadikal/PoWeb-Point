


import React from 'react';
import { SlideData } from '../../core/types';
import { 
    HeroSlide,
    ContentImageSlide, 
    ListSlide, 
    BigNumberSlide,
    TimelineSlide,
    GridSlide,
    StatsSlide,
    ComparisonSlide,
    ArticleSlide,
    QuoteSlide,
    GallerySlide,
    TeamSlide,
    ProcessSlide,
    CTASlide
} from './SlideTemplates';

interface SlideRendererProps {
    slide: SlideData;
}

/**
 * SlideRenderer Factory
 * Decouples the viewer from specific slide implementations.
 * To add a new slide type:
 * 1. Create the component in SlideTemplates.tsx
 * 2. Add the case here.
 */
export const SlideRenderer: React.FC<SlideRendererProps> = ({ slide }) => {
    switch (slide.type) {
        case 'hero': return <HeroSlide slide={slide} />;
        case 'article': return <ArticleSlide slide={slide} />;
        case 'content-image': return <ContentImageSlide slide={slide} />;
        case 'list': return <ListSlide slide={slide} />;
        case 'big-number': return <BigNumberSlide slide={slide} />;
        case 'timeline': return <TimelineSlide slide={slide} />;
        case 'grid': return <GridSlide slide={slide} />;
        case 'stats': return <StatsSlide slide={slide} />;
        case 'comparison': return <ComparisonSlide slide={slide} />;
        case 'quote': return <QuoteSlide slide={slide} />;
        case 'gallery': return <GallerySlide slide={slide} />;
        case 'team': return <TeamSlide slide={slide} />;
        case 'process': return <ProcessSlide slide={slide} />;
        case 'cta': return <CTASlide slide={slide} />;
        default: return <HeroSlide slide={slide} />;
    }
};
