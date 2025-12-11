import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useApp } from '../../core/store';
import { SlideCard } from './SlideCard';

export const CarouselRing: React.FC<{ radius: number }> = ({ radius }) => {
    const { 
        slides, 
        sections, 
        currentSlideIndex, 
        setCurrentSlideIndex, 
        cameraMode, 
        setCameraMode, 
        theme, 
        language,
        startTransitionToPresentation,
        isTransitioning
    } = useApp();

    const groupRef = useRef<THREE.Group>(null);
    const { gl } = useThree();
    
    const count = slides.length;
    const anglePerSlide = (Math.PI * 2) / count;
    const isDark = theme === 'dark';
    const isFarsi = language === 'fa';

    const state = useRef({
        rotation: -currentSlideIndex * anglePerSlide,
        targetRotation: -currentSlideIndex * anglePerSlide,
        velocity: 0,
        isDragging: false,
        startX: 0,
        lastX: 0
    });

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
             // Disable zoom/wheel during transition
             if (isTransitioning) return;

             if (Math.abs(e.deltaY) > 10) {
                 if (e.deltaY > 0 && cameraMode === 'overview') {
                     setCameraMode('focus');
                 } else if (e.deltaY < 0 && cameraMode === 'focus') {
                     setCameraMode('overview');
                 }
             }
        };
        window.addEventListener('wheel', handleWheel);
        return () => window.removeEventListener('wheel', handleWheel);
    }, [cameraMode, setCameraMode, isTransitioning]);

    useEffect(() => {
        if (state.current.isDragging || isTransitioning) return;
        const currentRot = state.current.rotation;
        const currentVirtualIndex = -currentRot / anglePerSlide;
        const n = Math.round((currentVirtualIndex - currentSlideIndex) / count);
        const bestK = currentSlideIndex + n * count;
        state.current.targetRotation = -bestK * anglePerSlide;
    }, [currentSlideIndex, count, anglePerSlide, isTransitioning]);

    useFrame((_, delta) => {
        const s = state.current;
        if (!s.isDragging) {
             // If transitioning, we force a tighter snap to ensure the card is perfectly centered for the zoom effect
             const stiffness = isTransitioning ? 10.0 : 6.0;
             const dist = s.targetRotation - s.rotation;
             s.rotation += dist * (delta * stiffness);
        }
        if (groupRef.current) {
            groupRef.current.rotation.y = s.rotation;
        }
    });

    const onPointerDown = useCallback((e: any) => {
        if (isTransitioning) return;
        if (e.button !== 0) return;
        e.stopPropagation();
        const s = state.current;
        s.isDragging = true;
        s.startX = e.clientX;
        s.lastX = e.clientX;
        s.velocity = 0;
        gl.domElement.setPointerCapture(e.pointerId);
        document.body.style.cursor = 'grabbing';
    }, [gl, isTransitioning]);

    const onPointerMove = useCallback((e: PointerEvent) => {
        if (isTransitioning) return;
        const s = state.current;
        if (!s.isDragging) return;
        const deltaX = e.clientX - s.lastX;
        s.lastX = e.clientX;
        const sensitivity = 0.003; 
        const rotDelta = deltaX * sensitivity;
        s.rotation += rotDelta;
        s.velocity = rotDelta; 
    }, [isTransitioning]);

    const onPointerUp = useCallback((e: PointerEvent) => {
        if (isTransitioning) return;
        const s = state.current;
        if (!s.isDragging) return;
        s.isDragging = false;
        gl.domElement.releasePointerCapture(e.pointerId);
        document.body.style.cursor = 'default';
        const inertia = 30; 
        const predictedEndRot = s.rotation + (s.velocity * inertia);
        const virtualIndex = -predictedEndRot / anglePerSlide;
        const roundedIndex = Math.round(virtualIndex);
        s.targetRotation = -roundedIndex * anglePerSlide;
        const normalizedIndex = ((roundedIndex % count) + count) % count;
        setCurrentSlideIndex(normalizedIndex);
    }, [count, anglePerSlide, setCurrentSlideIndex, gl, isTransitioning]);

    useEffect(() => {
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };
    }, [onPointerMove, onPointerUp]);

    const handleCardDoubleClick = (index: number) => {
        if (isTransitioning) return;

        if (index === currentSlideIndex) {
            if (cameraMode === 'overview') {
                setCameraMode('focus');
            } else {
                // Trigger the cinematic transition instead of instant switch
                startTransitionToPresentation();
            }
        } else {
            setCurrentSlideIndex(index);
        }
    };

    return (
        <group 
            ref={groupRef}
            onPointerDown={onPointerDown}
        >
            {slides.map((slide, i) => {
                const angle = i * anglePerSlide;
                const x = Math.sin(angle) * radius;
                const z = Math.cos(angle) * radius;
                const section = sections.find(s => s.id === slide.sectionId);
                
                return (
                    <group 
                        key={slide.id} 
                        position={[x, 0, z]} 
                        rotation={[0, angle, 0]}
                    >
                        <SlideCard 
                            slide={slide} 
                            index={i}
                            sectionTitle={section?.title}
                            isActive={currentSlideIndex === i}
                            cameraMode={cameraMode}
                            onDoubleClick={() => handleCardDoubleClick(i)}
                            onClick={() => setCurrentSlideIndex(i)}
                            onPointerDown={onPointerDown}
                            isDark={isDark}
                            isFarsi={isFarsi}
                        />
                    </group>
                );
            })}
        </group>
    );
};