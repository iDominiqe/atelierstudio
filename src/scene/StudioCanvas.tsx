import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type {
  BacklightModeId,
  CameraAnglePreset,
  CanvasFinishId,
  FrameStyleId,
  GarmentColorId,
  GarmentCutId,
  GarmentTypeId,
  PrintPlacementId,
  ResolvedCanvasDimensions,
  RoomLightingMode,
  ScaleReferenceMode,
  StudioMode,
} from '../types/studio';
import { ApparelStudioScene } from './ApparelStudioScene';
import { PortraitWallScene } from './PortraitWallScene';

interface StudioCanvasProps {
  mode: StudioMode;
  artworkTexture: THREE.Texture;
  resolvedDims: ResolvedCanvasDimensions;
  frameStyleId: FrameStyleId;
  canvasFinishId: CanvasFinishId;
  backlightModeId: BacklightModeId;
  roomLighting: RoomLightingMode;
  scaleReference: ScaleReferenceMode;
  garmentType: GarmentTypeId;
  garmentCutId: GarmentCutId;
  garmentColorId: GarmentColorId;
  printPlacement: PrintPlacementId;
  printScale: number;
  printOffsetY: number;
  cameraAngle: CameraAnglePreset;
  cameraNonce: number;
  autoRotate: boolean;
  onRegisterSnapshotFn: (fn: () => string) => void;
  onSceneReady: () => void;
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
  resolvedDims: ResolvedCanvasDimensions;
  cameraAngle: CameraAnglePreset;
  cameraNonce: number;
  autoRotate: boolean;
}

const CameraRig: React.FC<CameraRigProps> = ({
  mode,
  resolvedDims,
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
      const cy = Math.max(1.84, 0.74 + resolvedDims.height3D / 2);
      const maxSpan = Math.max(resolvedDims.width3D * 0.92, resolvedDims.height3D);
      const dist = THREE.MathUtils.clamp(2.35 + maxSpan * 1.05, 3.1, 6.2);

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
  }, [mode, resolvedDims.width3D, resolvedDims.height3D, cameraAngle, cameraNonce]);

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
      maxDistance={9.0}
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

const SnapshotAndReadyBridge: React.FC<{
  onRegisterSnapshotFn: (fn: () => string) => void;
  onSceneReady: () => void;
}> = ({ onRegisterSnapshotFn, onSceneReady }) => {
  const { gl, scene, camera } = useThree();
  const frameCount = useRef(0);
  const signaled = useRef(false);

  useEffect(() => {
    try {
      gl.compile(scene, camera);
    } catch {
      // Ignore partial shader compile notices
    }

    onRegisterSnapshotFn(() => {
      gl.render(scene, camera);
      try {
        return gl.domElement.toDataURL('image/png');
      } catch {
        return '';
      }
    });
  }, [gl, scene, camera, onRegisterSnapshotFn]);

  useFrame(() => {
    if (!signaled.current) {
      frameCount.current += 1;
      if (frameCount.current >= 4) {
        signaled.current = true;
        onSceneReady();
      }
    }
  });

  return null;
};

export const StudioCanvas: React.FC<StudioCanvasProps> = ({
  mode,
  artworkTexture,
  resolvedDims,
  frameStyleId,
  canvasFinishId,
  backlightModeId,
  roomLighting,
  scaleReference,
  garmentType,
  garmentCutId,
  garmentColorId,
  printPlacement,
  printScale,
  printOffsetY,
  cameraAngle,
  cameraNonce,
  autoRotate,
  onRegisterSnapshotFn,
  onSceneReady,
}) => {
  const isNight = roomLighting === 'spotlight-night';

  return (
    <CanvasErrorBoundary>
      <div className="w-full h-full absolute inset-0">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 1.75, 4.3], fov: 40, near: 0.1, far: 80 }}
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
            resolvedDims={resolvedDims}
            cameraAngle={cameraAngle}
            cameraNonce={cameraNonce}
            autoRotate={autoRotate}
          />

          <SnapshotAndReadyBridge
            onRegisterSnapshotFn={onRegisterSnapshotFn}
            onSceneReady={onSceneReady}
          />

          {mode === 'canvas' ? (
            <PortraitWallScene
              artworkTexture={artworkTexture}
              resolvedDims={resolvedDims}
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
              garmentCutId={garmentCutId}
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
