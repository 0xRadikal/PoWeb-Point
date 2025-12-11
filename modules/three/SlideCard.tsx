
import React, { useRef, useState, useMemo, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Float, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { SlideData } from '../../core/types';
import { FONTS } from '../../core/constants';
import { 
    HeroSlide3D, 
    ArticleSlide3D, 
    TimelineSlide3D, 
    GridSlide3D, 
    StatsSlide3D, 
    ComparisonSlide3D, 
    QuoteSlide3D,
    GallerySlide3D,
    TeamSlide3D,
    ProcessSlide3D,
    CTASlide3D,
    BigNumberSlide3D,
    StandardSlide3D,
    ContentImageSlide3D
} from './SlideContent3D';

const CARD_WIDTH = 4.5;
const CARD_HEIGHT = 3.0;
const CARD_THICKNESS = 0.15;
const CARD_RADIUS = 0.15;

const getLuminance = (colorStr: string) => {
    const c = new THREE.Color(colorStr);
    return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
};

// --- Content Factory ---

interface SlideTextProps { 
    slide: SlideData, 
    index: number, 
    sectionTitle?: string,
    isFarsi: boolean, 
    isDark: boolean, 
    isActive: boolean
}

const SlideTextContent: React.FC<SlideTextProps> = memo(({ slide, index, sectionTitle, isFarsi, isDark, isActive }) => {
    let titleFont = isFarsi ? FONTS.FA_BOLD : FONTS.EN_SANS;
    let bodyFont = isFarsi ? FONTS.FA_REGULAR : FONTS.EN_SANS;
    
    if (!isFarsi && slide.style?.fontFamily) {
        if (slide.style.fontFamily === 'serif') { titleFont = FONTS.EN_SERIF; bodyFont = FONTS.EN_SERIF; }
        if (slide.style.fontFamily === 'mono') { titleFont = FONTS.EN_MONO; bodyFont = FONTS.EN_MONO; }
    }

    const defaultText = isDark ? '#ffffff' : '#1e293b';
    const defaultSub = isDark ? '#94a3b8' : '#475569';
    const titleColor = slide.style?.textColor || defaultText;
    const tagColor = slide.style?.accentColor || '#3b82f6';
    
    const contentWidth = CARD_WIDTH - 0.8;
    const slideNum = (index + 1).toString().padStart(2, '0');
    const typeLabel = slide.type.toUpperCase().replace('-', ' ');
    const sectionLabel = (sectionTitle && sectionTitle.length > 20 ? sectionTitle.substring(0, 20) + "..." : sectionTitle) || 'SECTION';

    const renderContent = () => {
        const commonProps = { slide, font: titleFont, bodyFont, color: defaultText, accent: tagColor, isDark };
        switch(slide.type) {
            case 'hero': return <HeroSlide3D slide={slide} font={titleFont} bodyFont={bodyFont} color={titleColor} accent={tagColor} isFarsi={isFarsi} />;
            case 'content-image': return <ContentImageSlide3D {...commonProps} color={titleColor} defaultSub={defaultSub} />;
            case 'article': return <ArticleSlide3D {...commonProps} color={titleColor} defaultSub={defaultSub} />;
            case 'timeline': return <TimelineSlide3D {...commonProps} />;
            case 'grid': return <GridSlide3D {...commonProps} />;
            case 'stats': return <StatsSlide3D {...commonProps} />;
            case 'big-number': return <BigNumberSlide3D {...commonProps} color={titleColor} />;
            case 'comparison': return <ComparisonSlide3D {...commonProps} />;
            case 'quote': return <QuoteSlide3D {...commonProps} color={titleColor} />;
            case 'gallery': return <GallerySlide3D {...commonProps} color={titleColor} />;
            case 'team': return <TeamSlide3D {...commonProps} color={titleColor} />;
            case 'process': return <ProcessSlide3D {...commonProps} color={titleColor} />;
            case 'cta': return <CTASlide3D {...commonProps} color={titleColor} />;
            default: return <StandardSlide3D {...commonProps} titleFont={titleFont} titleColor={titleColor} tagColor={tagColor} defaultSub={defaultSub} contentWidth={contentWidth} />;
        }
    }

    return (
        <group position={[0, 0, CARD_THICKNESS / 2 + 0.02]}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh position={[0, 0, -0.2]} rotation={[0.5, 0.5, 0]}>
                    <icosahedronGeometry args={[0.9, 0]} />
                    <meshStandardMaterial color={tagColor} wireframe transparent opacity={0.12} />
                </mesh>
            </Float>

            <group position={[-CARD_WIDTH/2 + 0.4, CARD_HEIGHT/2 - 0.4, 0.01]}>
                 <Text font={FONTS.EN_SANS} fontSize={0.5} color={tagColor} fillOpacity={0.1} anchorX="left" anchorY="top" position={[-0.1, 0.12, -0.01]} fontWeight="bold">{slideNum}</Text>
                 <group position={[0.05, -0.05, 0]}>
                    <Text font={FONTS.EN_SANS} fontSize={0.07} color={defaultSub} anchorX="left" anchorY="top" letterSpacing={0.1} fontWeight="bold">{sectionLabel.toUpperCase()}</Text>
                    <Text font={FONTS.EN_SANS} fontSize={0.06} color={defaultSub} position={[0, -0.12, 0]} anchorX="left" anchorY="top" fillOpacity={0.6} letterSpacing={0.05}>{typeLabel}</Text>
                 </group>
            </group>

            {renderContent()}

            {isActive && (
                <group position={[0, -CARD_HEIGHT/2 + 0.3, 0]}>
                     <Text font={FONTS.EN_SANS} fontSize={0.08} color={defaultText} fillOpacity={0.4} letterSpacing={0.15}>DOUBLE CLICK</Text>
                </group>
            )}
        </group>
    );
});

// --- Slide Shell ---

export const SlideCard: React.FC<{ 
    slide: SlideData; 
    index: number; 
    sectionTitle?: string; 
    isActive: boolean; 
    cameraMode: 'overview' | 'focus';
    onDoubleClick: () => void;
    onClick: () => void;
    onPointerDown: (e: any) => void;
    isDark: boolean;
    isFarsi: boolean;
}> = memo(({ slide, index, sectionTitle, isActive, onDoubleClick, onClick, onPointerDown, isDark, isFarsi }) => {
  const [hovered, setHovered] = useState(false);
  
  let baseColor = isDark ? '#1e293b' : '#ffffff';
  if (slide.type === 'hero' && !!slide.content) {
      baseColor = '#0f172a';
  }
  if (slide.style?.backgroundType === 'solid' && slide.style?.backgroundColor) {
      baseColor = slide.style.backgroundColor;
  }
  // Basic Gradient approximation for 3D (just using end color or average if possible, but solid is safer)
  if (slide.style?.backgroundType === 'gradient' && slide.style?.gradientColors) {
      baseColor = slide.style.gradientColors[0];
  }

  const luminance = getLuminance(baseColor);
  const isCardDark = luminance < 0.5;
  const rimColor = isActive ? (slide.style?.accentColor || '#3b82f6') : (isDark ? '#334155' : '#cbd5e1');

  // Styling override overrides
  const borderWidth = slide.style?.borderWidth ? slide.style.borderWidth / 100 : 0; // scale down
  const borderColor = slide.style?.borderColor || rimColor;
  const borderRadius = slide.style?.borderRadius !== undefined ? slide.style.borderRadius / 100 : CARD_RADIUS;

  useCursor(hovered);
  const targetScale = isActive ? 1.1 : 1;
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (groupRef.current) {
        const s = groupRef.current.scale.x;
        const target = hovered ? targetScale * 1.05 : targetScale;
        const speed = 8;
        const next = THREE.MathUtils.lerp(s, target, delta * speed);
        groupRef.current.scale.set(next, next, next);
    }
  });

  return (
      <group 
        ref={groupRef}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerDown={onPointerDown}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick(); }}
      >
        {/* Border / Rim */}
        {(isActive || borderWidth > 0) && (
            <RoundedBox args={[CARD_WIDTH + 0.05 + borderWidth, CARD_HEIGHT + 0.05 + borderWidth, CARD_THICKNESS]} radius={borderRadius} smoothness={4}>
                <meshStandardMaterial color={borderWidth > 0 ? borderColor : rimColor} emissive={borderWidth > 0 ? borderColor : rimColor} emissiveIntensity={isActive ? 0.5 : 0.2} />
            </RoundedBox>
        )}

        {/* Card Body */}
        <RoundedBox args={[CARD_WIDTH, CARD_HEIGHT, CARD_THICKNESS + 0.01]} radius={borderRadius} smoothness={4} position={[0, 0, 0.01]}>
             <meshStandardMaterial 
                color={baseColor} 
                roughness={0.4} 
                metalness={0.1}
             />
        </RoundedBox>

        {/* Card Content */}
        <SlideTextContent 
            slide={slide} 
            index={index} 
            sectionTitle={sectionTitle} 
            isFarsi={isFarsi} 
            isDark={isCardDark} 
            isActive={isActive} 
        />
      </group>
  );
});
