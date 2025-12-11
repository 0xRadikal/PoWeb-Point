
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, Sparkles, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useApp } from '../../core/store';
import { CarouselRing } from './Carousel';
import { CameraConfig } from '../../core/types';

export const RendererCleanup = () => {
    const { gl, scene } = useThree();
    useEffect(() => {
        return () => {
            // Manual disposal of scene graph
            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                     if (object.geometry) {
                         object.geometry.dispose();
                     }
                     if (object.material) {
                         const cleanMaterial = (material: THREE.Material) => {
                             // Dispose textures
                             for (const key of Object.keys(material)) {
                                 const value = (material as any)[key];
                                 if (value && typeof value === 'object' && 'isTexture' in value && value.isTexture) {
                                     value.dispose();
                                 }
                             }
                             material.dispose();
                         };

                         if (Array.isArray(object.material)) {
                             object.material.forEach(cleanMaterial);
                         } else {
                             cleanMaterial(object.material);
                         }
                     }
                }
            });
            // Dispose renderer and force context loss to prevent "Too many active WebGL contexts"
            gl.dispose();
            gl.forceContextLoss();
        }
    }, [gl, scene]);
    return null;
}

const WarpEffect = ({ isTransitioning }: { isTransitioning: boolean }) => {
    const starsRef = useRef<any>(null);
    
    useFrame((_, delta) => {
        if (starsRef.current) {
            // "Warp speed" effect by stretching stars and moving them faster
            const targetSpeed = isTransitioning ? 20 : 0.5;
            
            // Lerp speed
            starsRef.current.speed = THREE.MathUtils.lerp(starsRef.current.speed || 0.5, targetSpeed, delta * 2);
            
            // Manually scale container for "streak" effect if possible, or just rely on speed
            if (isTransitioning) {
                starsRef.current.rotation.z += delta * 2;
            }
        }
    });

    return (
        <group>
             <Stars 
                ref={starsRef} 
                radius={50} 
                depth={50} 
                count={5000} 
                factor={4} 
                saturation={0} 
                fade 
                speed={1} 
            />
        </group>
    );
}

const TransitionFlash = ({ isTransitioning, isDark }: { isTransitioning: boolean, isDark: boolean }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshBasicMaterial>(null);

    useFrame((state, delta) => {
        if (materialRef.current && meshRef.current) {
            // Keep the flash plane in front of camera
            meshRef.current.position.copy(state.camera.position);
            meshRef.current.quaternion.copy(state.camera.quaternion);
            meshRef.current.translateZ(-1); // Just in front

            // Animate opacity
            const targetOpacity = isTransitioning ? 1 : 0;
            // Ramp up opacity exponentially towards end of transition
            const speed = isTransitioning ? 2.5 : 5;
            materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, delta * speed);
            meshRef.current.visible = materialRef.current.opacity > 0.01;
        }
    });

    return (
        <mesh ref={meshRef} visible={false}>
            <planeGeometry args={[10, 10]} />
            <meshBasicMaterial 
                ref={materialRef} 
                color={isDark ? "#0f172a" : "#ffffff"} 
                transparent 
                opacity={0} 
                depthTest={false}
            />
        </mesh>
    );
}

const CameraRig = ({ mode, config, isTransitioning }: { mode: 'overview' | 'focus'; config: CameraConfig; isTransitioning: boolean }) => {
    const { size } = useThree();
    const isPortrait = size.width < size.height;
    
    const vectors = useMemo(() => ({
        overviewPos: new THREE.Vector3(),
        overviewLookAt: new THREE.Vector3(),
        focusPos: new THREE.Vector3(),
        focusLookAt: new THREE.Vector3(),
        transitionPos: new THREE.Vector3(),
        transitionLookAt: new THREE.Vector3(),
        targetPoint: new THREE.Vector3(),
        currentLookAt: new THREE.Vector3()
    }), []);
    
    useFrame((state, delta) => {
        // --- OVERVIEW MODE ---
        const ovAngleRad = (config.overviewAngle * Math.PI) / 180;
        const ovDist = isPortrait ? config.overviewDistance * 1.5 : config.overviewDistance;
        vectors.overviewPos.set(
            Math.sin(ovAngleRad) * ovDist,
            config.overviewHeight,
            Math.cos(ovAngleRad) * ovDist
        );
        vectors.overviewLookAt.set(0, config.overviewLookAtY, 0);
        
        // --- FOCUS MODE ---
        const foAngleRad = (config.focusAngle * Math.PI) / 180;
        const foDist = config.focusDistance || 5.5;
        const effectiveFocusDist = isPortrait ? foDist + 4 : foDist;
        
        vectors.targetPoint.set(0, 0, config.radius);
        
        const offsetX = Math.sin(foAngleRad) * effectiveFocusDist;
        const offsetZ = Math.cos(foAngleRad) * effectiveFocusDist;
        
        vectors.focusPos.set(offsetX, config.focusHeight, config.radius + offsetZ);
        vectors.focusLookAt.set(0, config.focusLookAtY, config.radius);

        // --- TRANSITION MODE ---
        vectors.transitionPos.set(0, config.focusHeight, config.radius + 2.0);
        vectors.transitionLookAt.set(0, 0, config.radius);

        // --- SELECTION ---
        let targetPos, targetLookAt, targetFov;

        if (isTransitioning) {
            targetPos = vectors.transitionPos;
            targetLookAt = vectors.transitionLookAt;
            targetFov = config.focusFov;
        } else {
            targetPos = mode === 'overview' ? vectors.overviewPos : vectors.focusPos;
            targetLookAt = mode === 'overview' ? vectors.overviewLookAt : vectors.focusLookAt;
            targetFov = mode === 'overview' ? config.overviewFov : config.focusFov;
        }

        // --- LERPING ---
        const duration = config.transitionDuration || 1.5;
        const baseSpeed = 4.0 / duration;
        const speed = isTransitioning ? baseSpeed * 2 : baseSpeed;

        state.camera.position.lerp(targetPos, delta * speed);
        
        if (state.camera instanceof THREE.PerspectiveCamera) {
            state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, targetFov, delta * speed);
            state.camera.updateProjectionMatrix();
        }

        if (!state.camera.userData.currentLookAt) {
            state.camera.userData.currentLookAt = vectors.currentLookAt.set(0,0,0);
        }
        
        state.camera.userData.currentLookAt.lerp(targetLookAt, delta * (speed + 0.5));
        state.camera.lookAt(state.camera.userData.currentLookAt);

        // Handheld shake effect in Focus mode
        if (mode === 'focus' && !isTransitioning) {
             const time = state.clock.getElapsedTime();
             state.camera.position.y += Math.sin(time * 0.5) * 0.002;
             state.camera.position.x += Math.cos(time * 0.3) * 0.002;
        }
    });
    return null;
}

export const DashboardScene: React.FC = () => {
    const { theme, cameraMode, language, cameraConfig, isTransitioning } = useApp();
    const isDark = theme === 'dark';
    const carouselKey = `carousel-${language}`;

    return (
        <>
            <RendererCleanup />
            <fog attach="fog" args={[isDark ? '#0B1120' : '#cbd5e1', 0, isTransitioning ? 20 : 50]} />
            
            <CameraRig mode={cameraMode} config={cameraConfig} isTransitioning={isTransitioning} />
            
            <ambientLight intensity={isDark ? 0.4 : 0.7} />
            <spotLight position={[0, 15, 0]} angle={0.4} penumbra={0.5} intensity={1.5} castShadow shadow-bias={-0.0001} />
            <pointLight position={[-10, 5, 10]} intensity={isDark ? 0.8 : 0.4} color="#3b82f6" />
            <pointLight position={[10, 5, 10]} intensity={isDark ? 0.8 : 0.4} color="#10b981" />
            
            <Environment preset={isDark ? "city" : "studio"} blur={0.6} />
            
            <WarpEffect isTransitioning={isTransitioning} />
            <TransitionFlash isTransitioning={isTransitioning} isDark={isDark} />
            
            <Sparkles 
                count={isTransitioning ? 200 : 60} 
                scale={isTransitioning ? 30 : 20} 
                size={isTransitioning ? 6 : 4} 
                speed={isTransitioning ? 2 : 0.4} 
                opacity={0.4} 
                color={isDark ? "#fff" : "#64748b"} 
            />

            <group position={[0, -0.5, 0]} key={carouselKey}>
                <CarouselRing radius={cameraConfig.radius} />
            </group>
            
            <ContactShadows 
                position={[0, -2.6, 0]} 
                opacity={0.4} 
                scale={40} 
                blur={2} 
                far={4.5} 
                color={isDark ? '#000000' : '#64748b'} 
            />
        </>
    );
};
