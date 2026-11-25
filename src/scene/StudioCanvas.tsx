import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CANVAS_SIZES } from '../data/studioCatalog';
import type {
  BacklightModeId,
  CameraAnglePreset,
  CanvasFinishId,
  CanvasSizeId,
  FrameStyleId,
  GarmentColorId,
  GarmentTypeId,
  PrintPlacementId,
  RoomLightingMode,
  ScaleReferenceMode,
  StudioMode,
} from '../types/studio';
import { ApparelStudioScene } from './ApparelStudioScene';
import { PortraitWallScene } from './PortraitWallScene';

interface StudioCanvasProps {
  mode: StudioMode;
  artworkTexture: THREE.Texture;
  canvasSizeId: CanvasSizeId;
  frameStyleId: FrameStyleId;
  canvasFinishId: CanvasFinishId;
  backlightModeId: BacklightModeId;
  roomLighting: RoomLightingMode;
  scaleReference: ScaleReferenceMode;
  garmentType: GarmentTypeId;
  garmentColorId: GarmentColorId;
  printPlacement: PrintPlacementId;
  printScale: number;
  printOffsetY: number;
  cameraAngle: CameraAnglePreset;
  cameraNonce: number;
  autoRotate: boolean;
  onRegisterSnapshotFn: (fn: () => string) => void;
}

class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-stone-950 text-stone-300 p-6 text-center">
          <div>
            <p className="font-display font-bold text-lg text-amber-400">
              WebGL Studio Unavailable
            </p>
            <p className="text-sm text-stone-400 mt-1">
              Please ensure hardware acceleration / WebGL2 is enabled in your browser.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

interface CameraRigProps {
  mode: StudioMode;
  canvasSizeId: CanvasSizeId;
  cameraAngle: CameraAnglePreset;
  cameraNonce: number;
  autoRotate: boolean;
}

const CameraRig: React.FC<CameraRigProps> = ({
  mode,
  canvasSizeId,
  cameraAngle,
  cameraNonce,
  autoRotate,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const desiredPos = useRef(new THREE.Vector3(0, 1.9, 4.4));
  const desiredTarget = useRef(new THREE.Vector3(0, 1.82, 0.08));
  const transitionFrames = useRef(0);
  const userDragging = useRef(false);

  useEffect(() => {
    if (mode === 'canvas') {
      const sizeOpt = CANVAS_SIZES.find((s) => s.id === canvasSizeId) ?? CANVAS_SIZES[1];
      const cy = Math.max(1.86, 0.74 + sizeOpt.height3D / 2);
      const dist =
        sizeOpt.id === '100x150'
          ? 5.15
          : sizeOpt.id === '70x100'
          ? 4.45
          : sizeOpt.id === '50x70'
          ? 3.85
          : 3.35;

      if (cameraAngle === 'angle45') {
        desiredPos.current.set(dist * 0.62, cy + 0.15, dist * 0.78);
        desiredTarget.current.set(0, cy - 0.1, 0.08);
      } else if (cameraAngle === 'macro') {
        desiredPos.current.set(0.45, cy - 0.08, 1.55);
        desiredTarget.current.set(0.15, cy - 0.08, 0.08);
      } else {
        desiredPos.current.set(0, cy - 0.12, dist);
        desiredTarget.current.set(0, cy - 0.16, 0.08);
      }
    } else {
      // Mode B: Apparel Studio
      if (cameraAngle === 'rear') {
        desiredPos.current.set(0, 1.85, -3.05);
        desiredTarget.current.set(0, 1.72, 0);
      } else if (cameraAngle === 'sleeve') {
        desiredPos.current.set(2.55, 1.92, 1.05);
        desiredTarget.current.set(0.32, 1.78, 0);
      } else if (cameraAngle === 'angle45') {
        desiredPos.current.set(1.85, 2.0, 2.35);
        desiredTarget.current.set(0, 1.72, 0);
      } else if (cameraAngle === 'macro') {
        desiredPos.current.set(0.28, 1.88, 1.48);
        desiredTarget.current.set(0.08, 1.82, 0.15);
      } else {
        desiredPos.current.set(0.12, 1.88, 2.95);
        desiredTarget.current.set(0, 1.72, 0);
      }
    }

    userDragging.current = false;
    transitionFrames.current = 75;
  }, [mode, canvasSizeId, cameraAngle, cameraNonce]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;
    if (!userDragging.current && transitionFrames.current > 0) {
      const k = Math.min(1, delta * 5.2);
      camera.position.lerp(desiredPos.current, k);
      controlsRef.current.target.lerp(desiredTarget.current, k);
      transitionFrames.current -= 1;
    }
    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.07}
      autoRotate={autoRotate}
      autoRotateSpeed={1.6}
      minDistance={1.05}
      maxDistance={8.5}
      minPolarAngle={0.32}
      maxPolarAngle={mode === 'canvas' ? Math.PI * 0.51 : Math.PI * 0.56}
      minAzimuthAngle={mode === 'canvas' ? -Math.PI * 0.44 : -Infinity}
      maxAzimuthAngle={mode === 'canvas' ? Math.PI * 0.44 : Infinity}
      onStart={() => {
        userDragging.current = true;
        transitionFrames.current = 0;
      }}
    />
  );
};

const SnapshotBridge: React.FC<{
  onRegisterSnapshotFn: (fn: () => string) => void;
}> = ({ onRegisterSnapshotFn }) => {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    onRegisterSnapshotFn(() => {
      gl.render(scene, camera);
      try {
        return gl.domElement.toDataURL('image/png');
      } catch {
        return '';
      }
    });
  }, [gl, scene, camera, onRegisterSnapshotFn]);

  return null;
};

export const StudioCanvas: React.FC<StudioCanvasProps> = ({
  mode,
  artworkTexture,
  canvasSizeId,
  frameStyleId,
  canvasFinishId,
  backlightModeId,
  roomLighting,
  scaleReference,
  garmentType,
  garmentColorId,
  printPlacement,
  printScale,
  printOffsetY,
  cameraAngle,
  cameraNonce,
  autoRotate,
  onRegisterSnapshotFn,
}) => {
  const isNight = roomLighting === 'spotlight-night';

  return (
    <CanvasErrorBoundary>
      <div className="w-full h-full absolute inset-0">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 1.75, 3.85], fov: 40, near: 0.1, far: 80 }}
          gl={{
            antialias: true,
            preserveDrawingBuffer: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: isNight ? 1.05 : 1.08,
            powerPreference: 'high-performance',
          }}
        >
          <color
            attach="background"
            args={[
              mode === 'canvas'
                ? isNight
                  ? '#090a0f'
                  : '#d8d3c9'
                : isNight
                ? '#0a0b10'
                : '#191b22',
            ]}
          />
          <fog
            attach="fog"
            args={[
              mode === 'canvas'
                ? isNight
                  ? '#090a0f'
                  : '#d8d3c9'
                : isNight
                ? '#0a0b10'
                : '#191b22',
              7.5,
              18,
            ]}
          />

          {/* Procedural Studio HDRI Environment for Metallic Frames & Satin Clearcoat */}
          <Environment resolution={256} frames={1}>
            <Lightformer
              form="rect"
              intensity={isNight ? 0.8 : 2.2}
              color="#fffcf5"
              scale={[8, 4, 1]}
              position={[0, 4.5, 4]}
              rotation={[Math.PI / 4, 0, 0]}
            />
            <Lightformer
              form="rect"
              intensity={isNight ? 0.6 : 1.4}
              color="#e0f2fe"
              scale={[5, 5, 1]}
              position={[-5, 2.5, 2]}
              rotation={[0, Math.PI / 2, 0]}
            />
            <Lightformer
              form="rect"
              intensity={isNight ? 0.9 : 1.6}
              color="#fef3c7"
              scale={[5, 5, 1]}
              position={[5, 2.5, 2]}
              rotation={[0, -Math.PI / 2, 0]}
            />
          </Environment>

          <CameraRig
            mode={mode}
            canvasSizeId={canvasSizeId}
            cameraAngle={cameraAngle}
            cameraNonce={cameraNonce}
            autoRotate={autoRotate}
          />

          <SnapshotBridge onRegisterSnapshotFn={onRegisterSnapshotFn} />

          {mode === 'canvas' ? (
            <PortraitWallScene
              artworkTexture={artworkTexture}
              canvasSizeId={canvasSizeId}
              frameStyleId={frameStyleId}
              canvasFinishId={canvasFinishId}
              backlightModeId={backlightModeId}
              roomLighting={roomLighting}
              scaleReference={scaleReference}
            />
          ) : (
            <ApparelStudioScene
              artworkTexture={artworkTexture}
              garmentType={garmentType}
              garmentColorId={garmentColorId}
              printPlacement={printPlacement}
              printScale={printScale}
              printOffsetY={printOffsetY}
              roomLighting={roomLighting}
            />
          )}

          <EffectComposer multisampling={0}>
            <Bloom
              luminanceThreshold={0.86}
              luminanceSmoothing={0.25}
              intensity={isNight ? 0.85 : 0.45}
              mipmapBlur
            />
          </EffectComposer>
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
};
