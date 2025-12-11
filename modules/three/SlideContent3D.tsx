
import React, { memo } from 'react';
import { Text, RoundedBox, Image } from '@react-three/drei';
import { SlideData } from '../../core/types';
import { FONTS } from '../../core/constants';

// --- Utils ---

const stripMarkdown = (text?: string) => {
    if (!text) return "";
    return text
        .replace(/#{1,6}\s?/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/>\s?/g, '')
        .trim();
}

const truncate = (text: string | undefined, length: number) => {
    if (!text) return "";
    const clean = stripMarkdown(text);
    if (clean.length <= length) return clean;
    return clean.substring(0, length).trim() + "...";
}

interface Slide3DProps {
    slide: SlideData;
    font: string;
    bodyFont: string;
    color: string;
    accent: string;
    defaultSub?: string;
    isDark?: boolean;
    contentWidth?: number;
}

// --- 3D Implementations ---

export const HeroSlide3D = memo(({ slide, font, bodyFont, color, accent, isFarsi }: Slide3DProps & { isFarsi: boolean }) => {
    const isStatement = !!slide.content && !slide.imageUrl;
    const mainText = isStatement ? slide.content : slide.title;
    // Tighter truncation for 3D visibility
    const cleanMainText = truncate(mainText, 100); 
    const subText = truncate(slide.subtitle, 100);
    const headerText = isStatement ? truncate(slide.title, 30) : "";

    return (
        <group>
            {headerText && (
                 <Text font={bodyFont} fontSize={0.12} color={accent} position={[0, 0.8, 0]} anchorX="center" letterSpacing={0.1} fontWeight="bold" maxWidth={3.8}>
                    {headerText.toUpperCase()}
                </Text>
            )}
            <Text 
                font={font} 
                fontSize={isStatement ? 0.28 : 0.45} 
                maxWidth={3.8} 
                textAlign="center" 
                anchorX="center" 
                anchorY="middle" 
                position={[0, 0.1, 0.05]} 
                color={color} 
                lineHeight={1.2}
            >
                {isStatement ? `"${cleanMainText}"` : cleanMainText}
            </Text>
            <mesh position={[0, -0.6, 0]}>
                <boxGeometry args={[0.5, 0.01, 0.01]} />
                <meshBasicMaterial color={accent} />
            </mesh>
            <Text 
                font={isFarsi ? FONTS.FA_REGULAR : bodyFont} 
                fontSize={0.14} 
                color={color} 
                position={[0, -0.8, 0]} 
                anchorX="center" 
                fillOpacity={0.7}
                maxWidth={3.5}
                textAlign="center"
            >
                {subText}
            </Text>
        </group>
    )
});

export const ContentImageSlide3D = memo(({ slide, font, bodyFont, color, accent, defaultSub }: Slide3DProps) => {
    const hasImage = slide.enableImage && slide.imageUrl;
    const title = stripMarkdown(slide.title);
    const content = stripMarkdown(slide.content);
    const subtitle = stripMarkdown(slide.subtitle);
    
    // Dynamic sizing logic: scales text down as content length increases
    const getContentConfig = (text: string, isSplit: boolean) => {
        const len = text.length;
        if (isSplit) {
            // Smaller area (half width)
            if (len < 100) return { size: 0.14, lineHeight: 1.5, maxLen: 150 };
            if (len < 200) return { size: 0.12, lineHeight: 1.4, maxLen: 250 };
            if (len < 300) return { size: 0.10, lineHeight: 1.3, maxLen: 350 };
            return { size: 0.09, lineHeight: 1.2, maxLen: 450 };
        } else {
            // Full width area
            if (len < 150) return { size: 0.16, lineHeight: 1.6, maxLen: 200 };
            if (len < 300) return { size: 0.14, lineHeight: 1.5, maxLen: 400 };
            if (len < 500) return { size: 0.12, lineHeight: 1.4, maxLen: 600 };
            return { size: 0.10, lineHeight: 1.3, maxLen: 800 };
        }
    }

    const config = getContentConfig(content, !!hasImage);
    const titleSize = title.length > 40 ? 0.25 : 0.35;
    
    if (hasImage) {
        return (
            <group position={[0, 0, 0]}>
                {/* Text Container (Left) */}
                <group position={[-1, 0, 0]}>
                    <Text 
                        font={font} 
                        fontSize={titleSize * 0.8} // Scale down title slightly in split mode
                        maxWidth={2.1} 
                        textAlign="left" 
                        anchorX="left" 
                        anchorY="bottom" 
                        position={[-1.1, 0.4, 0]} 
                        color={color}
                        lineHeight={1.1}
                    >
                        {truncate(title, 60)}
                    </Text>
                    {subtitle && (
                         <Text 
                            font={bodyFont} 
                            fontSize={0.1} 
                            color={accent} 
                            position={[-1.1, 0.35, 0]} 
                            anchorX="left" 
                            anchorY="top"
                            maxWidth={2.1}
                        >
                            {truncate(subtitle, 80)}
                        </Text>
                    )}
                    <Text 
                        font={bodyFont} 
                        fontSize={config.size} 
                        maxWidth={2.1} 
                        textAlign="left" 
                        anchorX="left" 
                        anchorY="top" 
                        position={[-1.1, 0.15, 0]} 
                        color={defaultSub} 
                        lineHeight={config.lineHeight}
                    >
                        {truncate(content, config.maxLen)}
                    </Text>
                </group>

                {/* Image Container (Right) */}
                 <group position={[1.1, 0, 0]}>
                     <mesh position={[0, 0, -0.01]}>
                        <planeGeometry args={[2, 2.2]} />
                        <meshBasicMaterial color="#000" opacity={0.1} transparent />
                     </mesh>
                     <Image 
                        url={slide.imageUrl!} 
                        scale={[2, 2.2]} 
                        radius={0.1} 
                        transparent
                        opacity={slide.style?.imageOpacity ?? 1}
                     />
                </group>
            </group>
        );
    }

    // No Image - Centered Layout with dynamic scaling
    return (
        <group position={[0, 0.1, 0]}>
            <Text 
                font={font} 
                fontSize={titleSize} 
                maxWidth={3.8} 
                textAlign="center" 
                anchorX="center" 
                anchorY="middle" 
                position={[0, 0.8, 0]} 
                color={color}
            >
                {title}
            </Text>
            {subtitle && (
                <Text font={bodyFont} fontSize={0.12} color={accent} position={[0, 0.55, 0]} anchorX="center" maxWidth={3.5}>
                    {truncate(subtitle, 100)}
                </Text>
            )}
            <mesh position={[0, 0.45, 0]}><boxGeometry args={[0.5, 0.01, 0.01]} /><meshBasicMaterial color={accent} opacity={0.6} transparent /></mesh>
            <Text 
                font={bodyFont} 
                fontSize={config.size} 
                maxWidth={3.8} 
                textAlign="center" 
                anchorX="center" 
                anchorY="top" 
                position={[0, 0.3, 0]} 
                color={defaultSub} 
                lineHeight={config.lineHeight}
            >
                 {truncate(content, config.maxLen)}
            </Text>
        </group>
    );
});

export const ArticleSlide3D = memo(({ slide, font, bodyFont, color, accent, defaultSub }: Slide3DProps) => {
    const displayContent = truncate(slide.content, 250);
    // Moved group up slightly to allow more room for bullets at bottom
    return (
        <group position={[-1.7, 0.8, 0]}> 
            <Text font={font} fontSize={0.25} color={color} position={[0, 0, 0]} anchorX="left" anchorY="top" maxWidth={3.5}>
                {truncate(slide.title, 45)}
            </Text>
            {slide.subtitle && (
                 <Text font={bodyFont} fontSize={0.12} color={accent} position={[0, -0.3, 0]} anchorX="left" anchorY="top" maxWidth={3.5}>
                    {truncate(slide.subtitle, 55)}
                </Text>
            )}
            <Text 
                font={bodyFont} 
                fontSize={0.13} 
                color={defaultSub} 
                position={[0, -0.6, 0]} 
                anchorX="left" 
                anchorY="top" 
                maxWidth={3.4} 
                lineHeight={1.5}
            >
                {displayContent}
            </Text>
            {slide.bullets && slide.bullets.length > 0 && (
                <group position={[0, -1.8, 0]}>
                    <Text font={bodyFont} fontSize={0.1} color={accent} anchorX="left" fontWeight="bold">
                        KEY TAKEAWAYS:
                    </Text>
                     {(slide.bullets || []).slice(0, 2).map((b, i) => (
                         <group key={i} position={[0, -0.15 - (i * 0.12), 0]}>
                             <mesh position={[0.05, 0, 0]}><circleGeometry args={[0.02]} /><meshBasicMaterial color={accent} /></mesh>
                             <Text font={bodyFont} fontSize={0.1} color={defaultSub} position={[0.15, 0, 0]} anchorX="left" maxWidth={3.2}>
                                {truncate(b, 55)}
                             </Text>
                         </group>
                     ))}
                </group>
            )}
        </group>
    );
});

export const TimelineSlide3D = memo(({ slide, font, bodyFont, color, accent }: Slide3DProps) => {
    const items = (slide.bullets || []).slice(0, 4);
    const hasIntro = !!slide.content || !!slide.subtitle;
    
    return (
        <group position={[0, 0.2, 0]}>
            <Text font={font} fontSize={0.25} color={color} position={[0, 0.8, 0]} anchorX="center" maxWidth={3.8}>
                {truncate(slide.title, 40)}
            </Text>
            
            {hasIntro && (
                <Text font={bodyFont} fontSize={0.1} color={color} position={[0, 0.5, 0]} anchorX="center" maxWidth={3.5} textAlign="center" fillOpacity={0.7}>
                    {truncate(slide.subtitle, 80)}
                </Text>
            )}

            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[3.8, 0.04, 0.01]} />
                <meshStandardMaterial color={color} opacity={0.6} transparent />
            </mesh>
            {items.map((b, i) => {
                const x = -1.5 + (i * (3 / Math.max(items.length - 1, 1)));
                const [year, ...rest] = b.split(':');
                const label = rest.join(':');
                const isTop = i % 2 === 0;
                return (
                    <group key={i} position={[x, 0, 0]}>
                        <mesh><circleGeometry args={[0.08, 16]} /><meshBasicMaterial color={accent} /></mesh>
                        <Text font={bodyFont} fontSize={0.14} color={accent} position={[0, isTop ? 0.3 : -0.3, 0]} anchorX="center" fontWeight="bold">
                            {year}
                        </Text>
                        <Text font={bodyFont} fontSize={0.08} color={color} position={[0, isTop ? 0.2 : -0.4, 0]} anchorX="center" maxWidth={0.8} textAlign="center">
                            {truncate(label, 30)}
                        </Text>
                        <mesh position={[0, isTop ? 0.15 : -0.15, 0]}><boxGeometry args={[0.01, 0.3, 0.01]} /><meshBasicMaterial color={color} opacity={0.2} transparent /></mesh>
                    </group>
                )
            })}
        </group>
    )
});

export const GridSlide3D = memo(({ slide, font, bodyFont, color, accent }: Slide3DProps) => {
    const items = (slide.bullets || []).slice(0, 6);
    return (
        <group position={[0, 0.1, 0]}>
            <Text font={font} fontSize={0.25} color={color} position={[0, 0.8, 0]} anchorX="center" maxWidth={3.8}>
                {truncate(slide.title, 40)}
            </Text>
             {slide.subtitle && <Text font={bodyFont} fontSize={0.1} color={color} position={[0, 0.6, 0]} anchorX="center" fillOpacity={0.7} maxWidth={3.5}>{truncate(slide.subtitle, 60)}</Text>}
            <group position={[-0.8, 0.2, 0]}>
                {items.map((b, i) => {
                    const col = i % 2;
                    const row = Math.floor(i / 2);
                    const x = col * 1.6;
                    const y = row * -0.4;
                    return (
                        <group key={i} position={[x, y, 0]}>
                            <RoundedBox args={[1.4, 0.3, 0.02]} radius={0.05}><meshStandardMaterial color="#ffffff" opacity={0.1} transparent /></RoundedBox>
                            <mesh position={[-0.6, 0, 0.02]}><boxGeometry args={[0.05, 0.15, 0.01]} /><meshBasicMaterial color={accent} /></mesh>
                            <Text font={bodyFont} fontSize={0.12} color={color} position={[-0.5, 0, 0.03]} anchorX="left" anchorY="middle" maxWidth={1.2}>
                                {truncate(b, 30)}
                            </Text>
                        </group>
                    )
                })}
            </group>
        </group>
    )
});

export const StatsSlide3D = memo(({ slide, font, bodyFont, color, accent }: Slide3DProps) => {
    return (
        <group position={[0, 0.2, 0]}>
             <Text font={font} fontSize={0.25} color={color} position={[0, 0.8, 0]} anchorX="center" maxWidth={3.8}>
                {truncate(slide.title, 40)}
            </Text>
             {slide.subtitle && <Text font={bodyFont} fontSize={0.1} color={color} position={[0, 0.6, 0]} anchorX="center" fillOpacity={0.7} maxWidth={3.5}>{truncate(slide.subtitle, 60)}</Text>}
             <group position={[0, -0.1, 0]}>
                {(slide.bullets || []).slice(0, 3).map((b, i, arr) => {
                    const [val, ...rest] = b.split(':');
                    const label = rest.join(':');
                    const x = (i - (arr.length - 1) / 2) * 1.4;
                    return (
                        <group key={i} position={[x, 0, 0]}>
                            <Text font={font} fontSize={0.4} color={accent} anchorX="center" fontWeight="bold" maxWidth={1.3}>
                                {val}
                            </Text>
                            <Text font={bodyFont} fontSize={0.1} color={color} position={[0, -0.3, 0]} anchorX="center" letterSpacing={0.1} maxWidth={1.3}>
                                {truncate(label, 25)}
                            </Text>
                        </group>
                    )
                })}
             </group>
        </group>
    )
});

export const ComparisonSlide3D = memo(({ slide, font, bodyFont, color, isDark }: Slide3DProps) => {
    const leftTitle = slide.metadata?.leftTitle || 'Option A';
    const rightTitle = slide.metadata?.rightTitle || 'Option B';
    const leftItems = slide.metadata?.leftItems || [];
    const rightItems = slide.metadata?.rightItems || [];
    const displayLeft = leftItems.slice(0, 5);
    const displayRight = rightItems.slice(0, 5);

    return (
        <group position={[0, 0, 0]}>
            <Text font={font} fontSize={0.25} color={color} position={[0, 0.8, 0]} anchorX="center" maxWidth={3.8}>
                {truncate(slide.title, 40)}
            </Text>
            
            <mesh position={[-1, -0.1, -0.01]}><boxGeometry args={[1.9, 1.5, 0.01]} /><meshBasicMaterial color={isDark ? '#ef4444' : '#fee2e2'} opacity={isDark ? 0.1 : 0.5} transparent /></mesh>
             <mesh position={[1, -0.1, -0.01]}><boxGeometry args={[1.9, 1.5, 0.01]} /><meshBasicMaterial color={isDark ? '#3b82f6' : '#dbeafe'} opacity={isDark ? 0.1 : 0.5} transparent /></mesh>
            <group position={[0, 0, 0.05]}>
                <circleGeometry args={[0.15, 32]} /><meshBasicMaterial color={isDark ? '#1e293b' : '#ffffff'} />
                 <Text font={font} fontSize={0.1} color={color} position={[0, 0, 0.01]} anchorX="center" anchorY="middle" fontWeight="bold">VS</Text>
            </group>
            <group position={[-1, 0.4, 0]}>
                 <Text font={font} fontSize={0.15} color={color} position={[0, 0, 0]} anchorX="center" fontWeight="bold" maxWidth={1.8}>
                    {truncate(leftTitle, 20)}
                </Text>
                 {displayLeft.map((item, i) => <Text key={i} font={bodyFont} fontSize={0.1} color={color} position={[0, -0.2 - (i * 0.15), 0]} anchorX="center" maxWidth={1.8}>{truncate(item, 30)}</Text>)}
            </group>
             <group position={[1, 0.4, 0]}>
                 <Text font={font} fontSize={0.15} color={color} position={[0, 0, 0]} anchorX="center" fontWeight="bold" maxWidth={1.8}>
                    {truncate(rightTitle, 20)}
                </Text>
                 {displayRight.map((item, i) => <Text key={i} font={bodyFont} fontSize={0.1} color={color} position={[0, -0.2 - (i * 0.15), 0]} anchorX="center" maxWidth={1.8}>{truncate(item, 30)}</Text>)}
            </group>
        </group>
    )
});

export const QuoteSlide3D = memo(({ slide, font, bodyFont, color, accent }: Slide3DProps) => {
    return (
        <group position={[0, 0, 0]}>
            <Text font={font} fontSize={0.6} color={accent} position={[-1.5, 0.5, 0]} anchorX="center" anchorY="middle" fontStyle="italic">“</Text>
            <Text font={font} fontSize={0.22} color={color} maxWidth={3} textAlign="center" anchorX="center" anchorY="middle" fontStyle="italic" lineHeight={1.4}>
                "{truncate(slide.content, 180)}"
            </Text>
            <group position={[0, -0.6, 0]}>
                <mesh position={[0, 0.1, 0]}><boxGeometry args={[0.5, 0.01, 0.01]} /><meshBasicMaterial color={accent} /></mesh>
                <Text font={bodyFont} fontSize={0.12} color={accent} position={[0, -0.05, 0]} anchorX="center" fontWeight="bold" letterSpacing={0.1} maxWidth={3.5}>
                    {(slide.subtitle || 'UNKNOWN').toUpperCase()}
                </Text>
                {slide.title && <Text font={bodyFont} fontSize={0.08} color={color} position={[0, -0.2, 0]} anchorX="center" fillOpacity={0.7} maxWidth={3}>{truncate(slide.title, 40)}</Text>}
            </group>
        </group>
    );
});

export const GallerySlide3D = memo(({ slide, font, bodyFont, color }: Slide3DProps) => {
    const images = slide.metadata?.galleryImages || (slide.imageUrl ? [slide.imageUrl] : []);
    const displayImages = images.slice(0, 3);
    
    return (
        <group position={[0, 0, 0]}>
             <Text font={font} fontSize={0.2} color={color} position={[0, 0.9, 0]} anchorX="center" maxWidth={3.8}>{truncate(slide.title, 40)}</Text>
             {slide.subtitle && <Text font={bodyFont} fontSize={0.1} color={color} position={[0, 0.7, 0]} anchorX="center" fillOpacity={0.7} maxWidth={3.5}>{truncate(slide.subtitle, 60)}</Text>}
             <group position={[0, -0.1, 0]}>
                 {displayImages.map((img, i) => {
                     const x = (i - (displayImages.length - 1) / 2) * 1.4;
                     return (
                        <group key={i} position={[x, 0, 0]}>
                             <mesh>
                                 <planeGeometry args={[1.2, 0.9]} />
                                 <meshBasicMaterial color="#333" />
                             </mesh>
                             <Image url={img} transparent opacity={0.9} scale={[1.1, 0.8]} position={[0, 0, 0.01]} />
                        </group>
                     )
                 })}
                 {displayImages.length === 0 && <Text font={font} fontSize={0.1} color={color} fillOpacity={0.5}>NO IMAGES</Text>}
             </group>
        </group>
    );
});

export const TeamSlide3D = memo(({ slide, font, bodyFont, color, accent }: Slide3DProps) => {
    const members = (slide.metadata?.team || []).slice(0, 3);
    return (
        <group position={[0, 0.1, 0]}>
             <Text font={font} fontSize={0.25} color={color} position={[0, 0.8, 0]} anchorX="center" maxWidth={3.8}>{truncate(slide.title, 40)}</Text>
             {slide.content && <Text font={bodyFont} fontSize={0.1} color={color} position={[0, 0.6, 0]} anchorX="center" fillOpacity={0.7} maxWidth={3.5}>{truncate(slide.content, 60)}</Text>}
             <group position={[0, -0.2, 0]}>
                {members.map((m, i) => {
                    const x = (i - (members.length - 1) / 2) * 1.3;
                    return (
                        <group key={i} position={[x, 0, 0]}>
                            <mesh position={[0, 0.2, 0]}>
                                <circleGeometry args={[0.3, 32]} />
                                <meshBasicMaterial color={accent} opacity={0.2} transparent />
                            </mesh>
                            {m.imageUrl && <Image url={m.imageUrl} scale={0.5} position={[0, 0.2, 0.01]} transparent opacity={1} radius={0.5} />}
                            {!m.imageUrl && <Text font={font} fontSize={0.15} position={[0, 0.2, 0.02]} color={color}>{m.name.substring(0, 2).toUpperCase()}</Text>}
                            
                            <Text font={font} fontSize={0.12} color={color} position={[0, -0.2, 0]} anchorX="center" fontWeight="bold" maxWidth={1.2}>{truncate(m.name, 15)}</Text>
                            <Text font={bodyFont} fontSize={0.08} color={accent} position={[0, -0.35, 0]} anchorX="center" letterSpacing={0.05} maxWidth={1.2}>{truncate(m.role, 20).toUpperCase()}</Text>
                        </group>
                    )
                })}
             </group>
        </group>
    );
});

export const ProcessSlide3D = memo(({ slide, font, bodyFont, color, accent }: Slide3DProps) => {
    const steps = (slide.bullets || []).slice(0, 4);
    return (
        <group position={[0, 0.1, 0]}>
            <Text font={font} fontSize={0.25} color={color} position={[0, 0.8, 0]} anchorX="center" maxWidth={3.8}>
                {truncate(slide.title, 40)}
            </Text>
            {slide.subtitle && <Text font={bodyFont} fontSize={0.1} color={color} position={[0, 0.6, 0]} anchorX="center" fillOpacity={0.7} maxWidth={3.5}>{truncate(slide.subtitle, 60)}</Text>}
            <mesh position={[0, -0.1, -0.01]}><boxGeometry args={[3.5, 0.02, 0.01]} /><meshBasicMaterial color={color} opacity={0.2} transparent /></mesh>
            <group position={[0, -0.1, 0]}>
                {steps.map((s, i) => {
                    const [title] = s.split(':');
                    const x = -1.5 + (i * (3 / Math.max(steps.length - 1, 1)));
                    return (
                        <group key={i} position={[x, 0, 0]}>
                            <mesh><sphereGeometry args={[0.15, 16, 16]} /><meshStandardMaterial color={accent} roughness={0.3} metalness={0.8} /></mesh>
                            <Text font={font} fontSize={0.12} color="#ffffff" position={[0, 0, 0.16]} anchorX="center" anchorY="middle">{i+1}</Text>
                            <Text font={bodyFont} fontSize={0.1} color={color} position={[0, -0.3, 0]} anchorX="center" maxWidth={0.8} textAlign="center" fontWeight="bold">
                                {truncate(title, 20)}
                            </Text>
                        </group>
                    )
                })}
            </group>
        </group>
    );
});

export const CTASlide3D = memo(({ slide, font, bodyFont, color, accent }: Slide3DProps) => {
    return (
        <group position={[0, 0.1, 0]}>
            <Text font={font} fontSize={0.4} color={color} position={[0, 0.5, 0]} anchorX="center" maxWidth={3.5} textAlign="center" lineHeight={1.2}>
                {truncate(slide.title, 50)}
            </Text>
            {slide.subtitle && <Text font={bodyFont} fontSize={0.15} color={accent} position={[0, 0.1, 0]} anchorX="center" fontWeight="bold" maxWidth={3.5}>{slide.subtitle.toUpperCase()}</Text>}
             {(slide.bullets || []).slice(0, 1).map((b, i) => {
                 const [label] = b.split(':');
                 return (
                    <group key={i} position={[0, -0.5, 0]}>
                        <RoundedBox args={[1.5, 0.4, 0.05]} radius={0.2} smoothness={4}>
                            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.2} />
                        </RoundedBox>
                        <Text font={font} fontSize={0.15} color="#ffffff" position={[0, 0, 0.06]} anchorX="center" anchorY="middle" letterSpacing={0.05} maxWidth={1.4}>
                            {label.toUpperCase()}
                        </Text>
                    </group>
                 )
             })}
        </group>
    );
});

export const BigNumberSlide3D = memo(({ slide, font, bodyFont, color, accent }: Slide3DProps) => {
    return (
        <group position={[0, 0, 0]}>
            <Text 
                font={font} 
                fontSize={1.2} 
                color={accent} 
                position={[0, 0, 0]} 
                anchorX="center" 
                anchorY="middle" 
                fontWeight="bold"
                maxWidth={4}
            >
                {truncate(slide.subtitle, 15)}
            </Text>
            <Text 
                font={font} 
                fontSize={0.25} 
                color={color} 
                position={[0, 1.0, 0]} 
                anchorX="center" 
                fontWeight="bold"
                maxWidth={3.8}
            >
                {truncate(slide.title, 40)}
            </Text>
            <Text 
                font={bodyFont} 
                fontSize={0.12} 
                color={color} 
                position={[0, -0.6, 0]} 
                anchorX="center" 
                maxWidth={3}
                textAlign="center"
                fillOpacity={0.8}
            >
                {truncate(slide.content, 80)}
            </Text>
        </group>
    );
});

export const StandardSlide3D = memo(({ slide, titleFont, bodyFont, titleColor, tagColor, defaultSub, contentWidth, isDark }: Slide3DProps & { titleFont: string, titleColor: string, tagColor: string }) => {
     // Reduced truncation for standard content
     const displayContent = truncate(slide.content, 180);
     return (
        <group position={[0, 0.1, 0]}>
            <Text font={titleFont} fontSize={0.32} maxWidth={contentWidth} lineHeight={1.2} textAlign="center" anchorX="center" anchorY="middle" position={[0, 0.5, 0]} color={titleColor}>
                {truncate(slide.title, 60)}
            </Text>
            {slide.subtitle && (
                <Text font={bodyFont} fontSize={0.12} color={tagColor} position={[0, 0.2, 0]} anchorX="center" maxWidth={3}>
                    {truncate(slide.subtitle, 80)}
                </Text>
            )}
            <mesh position={[0, 0.1, 0]}><boxGeometry args={[0.3, 0.01, 0.01]} /><meshBasicMaterial color={tagColor} opacity={0.6} transparent /></mesh>
            <group position={[0, -0.3, 0]}>
                <Text font={bodyFont} fontSize={0.15} maxWidth={contentWidth} textAlign="center" anchorX="center" anchorY="top" color={defaultSub} lineHeight={1.6}>
                    {displayContent}
                </Text>
                {slide.type === 'list' && slide.bullets && (
                    <group position={[0, -0.8, 0]}>
                        <RoundedBox args={[1.8, 0.25, 0.01]} radius={0.12}><meshBasicMaterial color={isDark ? '#334155' : '#e2e8f0'} /></RoundedBox>
                        <Text font={bodyFont} fontSize={0.1} color={isDark ? '#94a3b8' : '#475569'} position={[0, 0, 0.01]} anchorX="center" anchorY="middle" fontWeight="bold" letterSpacing={0.05}>{slide.bullets.length} LIST ITEMS</Text>
                    </group>
                )}
            </group>
        </group>
     );
});
