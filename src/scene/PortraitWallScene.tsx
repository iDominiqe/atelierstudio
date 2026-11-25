import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  BACKLIGHT_OPTIONS,
  CANVAS_FINISHES,
  CANVAS_SIZES,
  FRAME_STYLES,
} from '../data/studioCatalog';
import type {
  BacklightModeId,
  CanvasFinishId,
  CanvasSizeId,
  FrameStyleId,
  RoomLightingMode,
  ScaleReferenceMode,
} from '../types/studio';
import {
  getCanvasWeaveNormalMap,
  getGalleryWallTexture,
  getWoodGrainTexture,
} from './proceduralTextures';

interface PortraitWallSceneProps {
  artworkTexture: THREE.Texture;
  canvasSizeId: CanvasSizeId;
  frameStyleId: FrameStyleId;
  canvasFinishId: CanvasFinishId;
  backlightModeId: BacklightModeId;
  roomLighting: RoomLightingMode;
  scaleReference: ScaleReferenceMode;
}

export const PortraitWallScene: React.FC<PortraitWallSceneProps> = ({
  artworkTexture,
  canvasSizeId,
  frameStyleId,
  canvasFinishId,
  backlightModeId,
  roomLighting,
  scaleReference,
}) => {
  const sizeOpt = CANVAS_SIZES.find((s) => s.id === canvasSizeId) ?? CANVAS_SIZES[1];
  const frameOpt = FRAME_STYLES.find((f) => f.id === frameStyleId) ?? FRAME_STYLES[1];
  const finishOpt =
    CANVAS_FINISHES.find((f) => f.id === canvasFinishId) ?? CANVAS_FINISHES[0];
  const backlightOpt =
    BACKLIGHT_OPTIONS.find((b) => b.id === backlightModeId) ?? BACKLIGHT_OPTIONS[0];

  const isNight = roomLighting === 'spotlight-night';
  const hasBacklight = backlightModeId !== 'off';

  const canvasNormalMap = useMemo(() => getCanvasWeaveNormalMap(), []);
  const wallTex = useMemo(() => getGalleryWallTexture(), []);
  const oakTex = useMemo(() => getWoodGrainTexture('oak'), []);
  const walnutTex = useMemo(() => getWoodGrainTexture('walnut'), []);

  // Soft radial halo texture for realistic wall LED diffusion
  const haloTex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(128, 128, 22, 128, 128, 128);
    g.addColorStop(0, 'rgba(255,255,255,0.95)');
    g.addColorStop(0.42, 'rgba(255,255,255,0.52)');
    g.addColorStop(0.75, 'rgba(255,255,255,0.14)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Smooth animated dimensions
  const animDims = useRef({
    w: sizeOpt.width3D,
    h: sizeOpt.height3D,
    centerY: Math.max(1.88, 0.72 + sizeOpt.height3D / 2),
  });

  const assemblyRef = useRef<THREE.Group>(null);
  const canvasBoxRef = useRef<THREE.Mesh>(null);
  const artPlaneRef = useRef<THREE.Mesh>(null);
  const matPlaneRef = useRef<THREE.Mesh>(null);

  const railTopRef = useRef<THREE.Mesh>(null);
  const railBottomRef = useRef<THREE.Mesh>(null);
  const railLeftRef = useRef<THREE.Mesh>(null);
  const railRightRef = useRef<THREE.Mesh>(null);

  const filletTopRef = useRef<THREE.Mesh>(null);
  const filletBottomRef = useRef<THREE.Mesh>(null);
  const filletLeftRef = useRef<THREE.Mesh>(null);
  const filletRightRef = useRef<THREE.Mesh>(null);

  const haloPlaneRef = useRef<THREE.Mesh>(null);
  const ledStripTopRef = useRef<THREE.Mesh>(null);
  const ledStripBottomRef = useRef<THREE.Mesh>(null);
  const ledStripLeftRef = useRef<THREE.Mesh>(null);
  const ledStripRightRef = useRef<THREE.Mesh>(null);
  const backlightPointARef = useRef<THREE.PointLight>(null);
  const backlightPointBRef = useRef<THREE.PointLight>(null);
  const spotlightRef = useRef<THREE.SpotLight>(null);
  const spotTarget = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }, delta) => {
    const k = Math.min(1, delta * 7.5);
    const targetCenterY = Math.max(1.86, 0.74 + sizeOpt.height3D / 2);

    animDims.current.w = THREE.MathUtils.lerp(animDims.current.w, sizeOpt.width3D, k);
    animDims.current.h = THREE.MathUtils.lerp(animDims.current.h, sizeOpt.height3D, k);
    animDims.current.centerY = THREE.MathUtils.lerp(
      animDims.current.centerY,
      targetCenterY,
      k
    );

    const w = animDims.current.w;
    const h = animDims.current.h;
    const cy = animDims.current.centerY;

    if (assemblyRef.current) {
      assemblyRef.current.position.y = cy;
    }

    const matInset = frameOpt.hasInnerMat ? 0.12 : 0;
    const artW = Math.max(0.3, w - matInset * 2);
    const artH = Math.max(0.4, h - matInset * 2);

    if (canvasBoxRef.current) {
      canvasBoxRef.current.scale.set(w, h, 1);
    }
    if (artPlaneRef.current) {
      artPlaneRef.current.scale.set(artW, artH, 1);
    }
    if (matPlaneRef.current) {
      matPlaneRef.current.scale.set(w, h, 1);
    }

    const bw = frameOpt.borderWidth;
    if (bw > 0) {
      const outerW = w + bw * 2;
      if (railTopRef.current) {
        railTopRef.current.position.set(0, h / 2 + bw / 2, frameOpt.depth / 2);
        railTopRef.current.scale.set(outerW, bw, frameOpt.depth);
      }
      if (railBottomRef.current) {
        railBottomRef.current.position.set(0, -h / 2 - bw / 2, frameOpt.depth / 2);
        railBottomRef.current.scale.set(outerW, bw, frameOpt.depth);
      }
      if (railLeftRef.current) {
        railLeftRef.current.position.set(-w / 2 - bw / 2, 0, frameOpt.depth / 2);
        railLeftRef.current.scale.set(bw, h, frameOpt.depth);
      }
      if (railRightRef.current) {
        railRightRef.current.position.set(w / 2 + bw / 2, 0, frameOpt.depth / 2);
        railRightRef.current.scale.set(bw, h, frameOpt.depth);
      }
    }

    if (frameOpt.hasGoldFillet) {
      const fw = 0.018;
      if (filletTopRef.current) {
        filletTopRef.current.position.set(0, h / 2 - fw / 2, 0.072);
        filletTopRef.current.scale.set(w, fw, 0.025);
      }
      if (filletBottomRef.current) {
        filletBottomRef.current.position.set(0, -h / 2 + fw / 2, 0.072);
        filletBottomRef.current.scale.set(w, fw, 0.025);
      }
      if (filletLeftRef.current) {
        filletLeftRef.current.position.set(-w / 2 + fw / 2, 0, 0.072);
        filletLeftRef.current.scale.set(fw, h, 0.025);
      }
      if (filletRightRef.current) {
        filletRightRef.current.position.set(w / 2 - fw / 2, 0, 0.072);
        filletRightRef.current.scale.set(fw, h, 0.025);
      }
    }

    // Backlight halo & LED perimeter bars
    const outerW = w + bw * 2;
    const outerH = h + bw * 2;
    const pulse =
      backlightModeId === 'rgb-sunset' || backlightModeId === 'rgb-cyber'
        ? 0.92 + Math.sin(clock.getElapsedTime() * 1.8) * 0.1
        : 1.0;

    if (haloPlaneRef.current) {
      haloPlaneRef.current.scale.set((outerW + 0.95) * pulse, (outerH + 0.95) * pulse, 1);
    }
    if (ledStripTopRef.current) {
      ledStripTopRef.current.position.set(0, outerH / 2 - 0.02, 0.015);
      ledStripTopRef.current.scale.set(outerW - 0.04, 0.022, 0.018);
    }
    if (ledStripBottomRef.current) {
      ledStripBottomRef.current.position.set(0, -outerH / 2 + 0.02, 0.015);
      ledStripBottomRef.current.scale.set(outerW - 0.04, 0.022, 0.018);
    }
    if (ledStripLeftRef.current) {
      ledStripLeftRef.current.position.set(-outerW / 2 + 0.02, 0, 0.015);
      ledStripLeftRef.current.scale.set(0.022, outerH - 0.04, 0.018);
    }
    if (ledStripRightRef.current) {
      ledStripRightRef.current.position.set(outerW / 2 - 0.02, 0, 0.015);
      ledStripRightRef.current.scale.set(0.022, outerH - 0.04, 0.018);
    }

    if (backlightPointARef.current) {
      backlightPointARef.current.position.set(-w * 0.35, cy + h * 0.15, 0.18);
    }
    if (backlightPointBRef.current) {
      backlightPointBRef.current.position.set(w * 0.35, cy - h * 0.15, 0.18);
    }

    spotTarget.position.set(0, cy, 0.08);
    spotTarget.updateMatrixWorld();
    if (spotlightRef.current) {
      spotlightRef.current.target = spotTarget;
    }
  });

  const frameMap =
    frameStyleId === 'natural-oak'
      ? oakTex
      : frameStyleId === 'ornate-walnut'
      ? walnutTex
      : null;

  return (
    <group>
      {/* --- ROOM LIGHTING --- */}
      <ambientLight intensity={isNight ? 0.16 : 0.72} color={isNight ? '#94a3b8' : '#fffcf5'} />
      <hemisphereLight
        intensity={isNight ? 0.14 : 0.55}
        color={isNight ? '#334155' : '#ffffff'}
        groundColor={isNight ? '#09090b' : '#44403c'}
      />

      {/* Daylight Architectural Gallery Key Light */}
      <directionalLight
        position={[3.5, 5.2, 4.8]}
        intensity={isNight ? 0.18 : 1.35}
        color={isNight ? '#cbd5e1' : '#fff7ed'}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
        shadow-camera-left={-4.5}
        shadow-camera-right={4.5}
        shadow-camera-top={4.5}
        shadow-camera-bottom={-1}
        shadow-bias={-0.0004}
      />

      {/* Overhead Museum Spotlight (dramatic in Night Mode, subtle fill in Day) */}
      <primitive object={spotTarget} />
      <spotLight
        ref={spotlightRef}
        position={[0, 4.35, 1.95]}
        angle={0.52}
        penumbra={0.68}
        intensity={isNight ? 36 : 9}
        distance={11}
        decay={1.8}
        color="#ffe8c2"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
      />

      {/* --- ARCHITECTURAL GALLERY WALL & FLOOR --- */}
      {/* Main Feature Wall */}
      <mesh position={[0, 3.0, -0.04]} receiveShadow>
        <boxGeometry args={[14, 6.2, 0.08]} />
        <meshStandardMaterial
          map={wallTex}
          color={isNight ? '#565965' : '#ebe7df'}
          roughness={0.92}
          metalness={0.02}
        />
      </mesh>

      {/* Subtle architectural baseboard */}
      <mesh position={[0, 0.075, 0.015]} receiveShadow>
        <boxGeometry args={[14, 0.15, 0.035]} />
        <meshStandardMaterial color={isNight ? '#1b1d24' : '#d6d1c7'} roughness={0.6} />
      </mesh>

      {/* Gallery Floor (Polished Dark Travertine / Slate) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 3.5]} receiveShadow>
        <planeGeometry args={[14, 9]} />
        <meshStandardMaterial
          color={isNight ? '#121318' : '#2d2a26'}
          roughness={0.42}
          metalness={0.12}
        />
      </mesh>

      {/* Ceiling Track Rail & Museum Track Spot Fixtures */}
      <group position={[0, 4.45, 1.95]}>
        <mesh>
          <boxGeometry args={[3.4, 0.05, 0.06]} />
          <meshStandardMaterial color="#18181b" metalness={0.8} roughness={0.3} />
        </mesh>
        {[-0.85, 0, 0.85].map((tx, idx) => (
          <group key={idx} position={[tx, -0.1, 0]} rotation={[0.62, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.045, 0.055, 0.18, 16]} />
              <meshStandardMaterial color="#18181b" metalness={0.85} roughness={0.28} />
            </mesh>
            <mesh position={[0, -0.095, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.042, 16]} />
              <meshBasicMaterial
                color={isNight ? '#ffedd5' : '#fef3c7'}
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Volumetric Spotlight Cone (visible in Night Museum Spotlight Mode) */}
      {isNight && (
        <mesh position={[0, 3.15, 1.02]} rotation={[-0.64, 0, 0]}>
          <coneGeometry args={[1.25, 2.75, 32, 1, true]} />
          <meshBasicMaterial
            color="#fde68a"
            transparent
            opacity={0.045}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* --- DYNAMIC 3D PORTRAIT CANVAS & PBR FRAME ASSEMBLY --- */}
      <group ref={assemblyRef} position={[0, 1.95, 0]}>
        {/* Rear Wall Spacer / Mounting Chassis */}
        <mesh position={[0, 0, 0.018]} castShadow>
          <boxGeometry args={[0.42, 0.42, 0.03]} />
          <meshStandardMaterial color="#111317" roughness={0.7} />
        </mesh>

        {/* Backlit Halo LED Wall Glow */}
        {hasBacklight && (
          <>
            <mesh ref={haloPlaneRef} position={[0, 0, 0.004]}>
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial
                map={haloTex}
                color={backlightOpt.primaryColor}
                transparent
                opacity={isNight ? 0.92 : 0.56}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
            <mesh ref={ledStripTopRef}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color={backlightOpt.primaryColor} toneMapped={false} />
            </mesh>
            <mesh ref={ledStripBottomRef}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color={backlightOpt.secondaryColor} toneMapped={false} />
            </mesh>
            <mesh ref={ledStripLeftRef}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color={backlightOpt.primaryColor} toneMapped={false} />
            </mesh>
            <mesh ref={ledStripRightRef}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color={backlightOpt.secondaryColor} toneMapped={false} />
            </mesh>
          </>
        )}

        {/* Stretched Canvas Core (unit 1x1x0.055 scaled smoothly) */}
        <mesh ref={canvasBoxRef} position={[0, 0, 0.048]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 0.052]} />
          <meshStandardMaterial
            color={frameStyleId === 'frameless' ? '#27262c' : '#18181b'}
            normalMap={canvasNormalMap}
            normalScale={new THREE.Vector2(0.35, 0.35)}
            roughness={0.85}
          />
        </mesh>

        {/* Optional Museum White Passe-Partout Mat (for Natural Oak) */}
        {frameOpt.hasInnerMat && (
          <mesh ref={matPlaneRef} position={[0, 0, 0.075]} receiveShadow>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial color="#f5f3ee" roughness={0.9} metalness={0.0} />
          </mesh>
        )}

        {/* Front Printed Portrait Canvas Surface with Matte vs Satin/Gloss Physics */}
        <mesh ref={artPlaneRef} position={[0, 0, 0.077]} receiveShadow>
          <planeGeometry args={[1, 1]} />
          <meshPhysicalMaterial
            map={artworkTexture}
            normalMap={canvasNormalMap}
            normalScale={
              canvasFinishId === 'matte'
                ? new THREE.Vector2(0.42, 0.42)
                : new THREE.Vector2(0.14, 0.14)
            }
            roughness={finishOpt.roughness}
            metalness={finishOpt.metalness}
            clearcoat={finishOpt.clearcoat}
            clearcoatRoughness={0.14}
            reflectivity={canvasFinishId === 'satin-gloss' ? 0.85 : 0.12}
          />
        </mesh>

        {/* 4-Piece PBR Frame Molding Rails */}
        {frameOpt.borderWidth > 0 && (
          <>
            {[railTopRef, railBottomRef, railLeftRef, railRightRef].map((refObj, idx) => (
              <mesh key={idx} ref={refObj} castShadow receiveShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                  color={frameMap ? '#ffffff' : frameOpt.color}
                  map={frameMap}
                  metalness={frameOpt.metalness}
                  roughness={frameOpt.roughness}
                />
              </mesh>
            ))}
          </>
        )}

        {/* Inner Gilded Fillet Trim (for Classic Ornate Dark Walnut) */}
        {frameOpt.hasGoldFillet && (
          <>
            {[filletTopRef, filletBottomRef, filletLeftRef, filletRightRef].map(
              (refObj, idx) => (
                <mesh key={idx} ref={refObj} castShadow>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.22} />
                </mesh>
              )
            )}
          </>
        )}
      </group>

      {/* Real-time Point Lights for Wall LED Ambient Bounce */}
      {hasBacklight && (
        <>
          <pointLight
            ref={backlightPointARef}
            color={backlightOpt.primaryColor}
            intensity={isNight ? 4.2 : 2.1}
            distance={3.6}
            decay={2}
          />
          <pointLight
            ref={backlightPointBRef}
            color={backlightOpt.secondaryColor}
            intensity={isNight ? 3.8 : 1.8}
            distance={3.6}
            decay={2}
          />
        </>
      )}

      {/* --- SCALE REFERENCE: INTERIOR BENCH & PLANT OR 175cm HUMAN SILHOUETTE --- */}
      {scaleReference === 'interior' && (
        <group>
          {/* Mid-century Gallery Leather Bench (160cm wide) */}
          <group position={[0, 0, 0.65]}>
            {/* Cushioned leather seat */}
            <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.65, 0.1, 0.48]} />
              <meshStandardMaterial color="#3b261c" roughness={0.55} metalness={0.05} />
            </mesh>
            {/* Tufted seat seams */}
            {[-0.4, 0, 0.4].map((sx) => (
              <mesh key={sx} position={[sx, 0.472, 0]}>
                <boxGeometry args={[0.01, 0.008, 0.46]} />
                <meshStandardMaterial color="#1f120d" roughness={0.8} />
              </mesh>
            ))}
            {/* Brushed brass / dark steel legs */}
            {[
              [-0.72, -0.18],
              [0.72, -0.18],
              [-0.72, 0.18],
              [0.72, 0.18],
            ].map(([lx, lz], i) => (
              <mesh key={i} position={[lx, 0.19, lz]} castShadow>
                <cylinderGeometry args={[0.02, 0.015, 0.38, 12]} />
                <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.3} />
              </mesh>
            ))}
          </group>

          {/* Architectural Ceramic Planter + Sculpted Indoor Plant */}
          <group position={[1.85, 0, 0.6]}>
            <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.22, 0.16, 0.48, 24]} />
              <meshStandardMaterial color="#d6d3cd" roughness={0.75} />
            </mesh>
            {/* Soil */}
            <mesh position={[0, 0.46, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.04, 20]} />
              <meshStandardMaterial color="#2c1e16" roughness={0.95} />
            </mesh>
            {/* Sculpted stems & leaves */}
            {[
              { rot: [0.18, 0.2, 0.2], h: 0.72, leafY: 0.85, leafR: 0.22 },
              { rot: [-0.22, 1.4, 0.15], h: 0.88, leafY: 1.02, leafR: 0.26 },
              { rot: [0.12, 2.7, -0.22], h: 0.65, leafY: 0.76, leafR: 0.2 },
              { rot: [-0.15, 4.1, -0.15], h: 0.96, leafY: 1.12, leafR: 0.24 },
              { rot: [0.08, 5.2, 0.12], h: 0.78, leafY: 0.9, leafR: 0.19 },
            ].map((stem, idx) => (
              <group key={idx} position={[0, 0.45, 0]} rotation={stem.rot as [number, number, number]}>
                <mesh position={[0, stem.h / 2, 0]} castShadow>
                  <cylinderGeometry args={[0.012, 0.018, stem.h, 8]} />
                  <meshStandardMaterial color="#3f4d36" roughness={0.8} />
                </mesh>
                <mesh
                  position={[0, stem.leafY - 0.15, 0.05]}
                  rotation={[0.45, 0, 0]}
                  scale={[1, 0.18, 1.55]}
                  castShadow
                >
                  <sphereGeometry args={[stem.leafR, 14, 12]} />
                  <meshStandardMaterial color="#345c3c" roughness={0.62} />
                </mesh>
              </group>
            ))}
          </group>
        </group>
      )}

      {scaleReference === 'human' && (
        <group position={[-(sizeOpt.width3D / 2 + 0.44), 0, 0.55]}>
          {/* 175 cm Architectural Gallery Visitor Silhouette */}
          {/* Base shadow disc */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
            <circleGeometry args={[0.28, 32]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.22} />
          </mesh>
          {/* Legs */}
          <mesh position={[-0.085, 0.44, 0]} castShadow>
            <capsuleGeometry args={[0.055, 0.74, 8, 16]} />
            <meshPhysicalMaterial
              color={isNight ? '#475569' : '#334155'}
              roughness={0.35}
              transparent
              opacity={0.78}
            />
          </mesh>
          <mesh position={[0.085, 0.44, 0]} castShadow>
            <capsuleGeometry args={[0.055, 0.74, 8, 16]} />
            <meshPhysicalMaterial
              color={isNight ? '#475569' : '#334155'}
              roughness={0.35}
              transparent
              opacity={0.78}
            />
          </mesh>
          {/* Torso */}
          <mesh position={[0, 1.15, 0]} castShadow>
            <capsuleGeometry args={[0.16, 0.46, 10, 20]} />
            <meshPhysicalMaterial
              color={isNight ? '#475569' : '#334155'}
              roughness={0.35}
              transparent
              opacity={0.78}
            />
          </mesh>
          {/* Arms */}
          <mesh position={[-0.22, 1.11, 0]} rotation={[0, 0, 0.12]} castShadow>
            <capsuleGeometry args={[0.042, 0.46, 8, 14]} />
            <meshPhysicalMaterial
              color={isNight ? '#475569' : '#334155'}
              roughness={0.35}
              transparent
              opacity={0.78}
            />
          </mesh>
          <mesh position={[0.22, 1.11, 0]} rotation={[0, 0, -0.12]} castShadow>
            <capsuleGeometry args={[0.042, 0.46, 8, 14]} />
            <meshPhysicalMaterial
              color={isNight ? '#475569' : '#334155'}
              roughness={0.35}
              transparent
              opacity={0.78}
            />
          </mesh>
          {/* Head (top reaches 1.75 m!) */}
          <mesh position={[0, 1.62, 0]} castShadow>
            <sphereGeometry args={[0.125, 20, 20]} />
            <meshPhysicalMaterial
              color={isNight ? '#64748b' : '#475569'}
              roughness={0.35}
              transparent
              opacity={0.82}
            />
          </mesh>
          {/* Architectural 175 cm Vertical Scale Rule */}
          <mesh position={[-0.36, 0.875, 0]}>
            <boxGeometry args={[0.008, 1.75, 0.008]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
          <mesh position={[-0.36, 1.75, 0]}>
            <boxGeometry args={[0.14, 0.008, 0.008]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
          <mesh position={[-0.36, 0.01, 0]}>
            <boxGeometry args={[0.14, 0.008, 0.008]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
        </group>
      )}
    </group>
  );
};
