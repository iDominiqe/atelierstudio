import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GARMENT_COLORS, GARMENT_CUTS } from '../data/studioCatalog';
import type {
  GarmentColorId,
  GarmentCutId,
  GarmentCutOption,
  GarmentTypeId,
  PrintPlacementId,
  RoomLightingMode,
} from '../types/studio';
import { getCottonFabricNormalMap } from './proceduralTextures';

interface ApparelStudioSceneProps {
  artworkTexture: THREE.Texture;
  garmentType: GarmentTypeId;
  garmentCutId: GarmentCutId;
  garmentColorId: GarmentColorId;
  printPlacement: PrintPlacementId;
  printScale: number;
  printOffsetY: number;
  roomLighting: RoomLightingMode;
}

/**
 * Generates an anatomically tailored 3D torso geometry driven by the active cut's chest,
 * waist, hem, depth, shoulder drop, and organic fabric tension folds.
 */
function buildTailoredTorsoGeometry(cut: GarmentCutOption): THREE.BufferGeometry {
  const segX = 64;
  const segY = 48;
  const geo = new THREE.CylinderGeometry(1, 1, cut.torsoLength, segX, segY, false);
  const pos = geo.attributes.position;
  const halfLen = cut.torsoLength * 0.5;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const t = (y + halfLen) / cut.torsoLength; // 0 (hem) -> 1 (collar/shoulder)
    const angle = Math.atan2(z, x);

    let rx = cut.waistWidth;
    let rz = cut.depthZ * 0.9;

    if (t < 0.14) {
      // Ribbed hem taper
      const k = t / 0.14;
      rx = THREE.MathUtils.lerp(cut.hemWidth, cut.waistWidth, k);
      rz = THREE.MathUtils.lerp(cut.depthZ * 0.85, cut.depthZ * 0.92, k);
    } else if (t < 0.64) {
      // Mid-torso to pectoral chest contour
      const k = (t - 0.14) / 0.5;
      const smoothK = k * k * (3 - 2 * k);
      rx = THREE.MathUtils.lerp(cut.waistWidth, cut.chestWidth, smoothK);
      rz = THREE.MathUtils.lerp(
        cut.depthZ * 0.92,
        cut.depthZ,
        Math.sin(k * Math.PI * 0.62)
      );
    } else {
      // Upper chest to sculpted shoulder yoke taper
      const k = (t - 0.64) / 0.36;
      rx = THREE.MathUtils.lerp(cut.chestWidth, cut.chestWidth * 0.78, Math.pow(k, 1.4));
      rz = THREE.MathUtils.lerp(cut.depthZ, cut.depthZ * 0.74, Math.pow(k, 1.3));
    }

    // Anatomical pectoral swell on front (+Z) & scapula curve on back (-Z)
    const frontFactor = Math.max(0, Math.sin(angle));
    const backFactor = Math.max(0, -Math.sin(angle));
    const chestBoost =
      frontFactor * Math.exp(-Math.pow((t - 0.7) / 0.2, 2)) * (cut.depthZ * 0.1);
    const upperBackCurve =
      backFactor * Math.exp(-Math.pow((t - 0.74) / 0.22, 2)) * (cut.depthZ * 0.06);

    // Subtle organic vertical drape folds near sides and lower hem
    const sideWeight = Math.pow(Math.abs(Math.cos(angle)), 1.5);
    const drapeRipple =
      (Math.sin(angle * 8 + t * 2.4) * 0.0048 +
        Math.cos(angle * 4 - t * 3.1) * 0.0032 * sideWeight) *
      (1 - t * 0.35);

    // Tailored shoulder slope
    const shoulderDrop =
      t > 0.86
        ? -Math.pow(Math.abs(Math.cos(angle)), 2) * cut.shoulderDrop * ((t - 0.86) / 0.14)
        : 0;

    // Anatomical neck scoop on front
    const neckScoop =
      t > 0.9 && frontFactor > 0.2
        ? -frontFactor * 0.058 * ((t - 0.9) / 0.1)
        : 0;

    const r = Math.hypot(x, z);
    if (r > 0.001) {
      const nx = x / r;
      const nz = z / r;
      pos.setXYZ(
        i,
        nx * (rx + drapeRipple),
        y + shoulderDrop + neckScoop,
        nz * (rz + chestBoost + upperBackCurve + drapeRipple)
      );
    }
  }

  geo.computeVertexNormals();
  return geo;
}

function buildConformalPrintPatch(
  width: number,
  height: number,
  radiusZ: number,
  curveAmount: number
): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(width, height, 22, 22);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const px = pos.getX(i);
    const py = pos.getY(i);
    const curveX = -Math.pow(px / (width * 0.6 + 0.01), 2) * curveAmount;
    const contourY = Math.sin(((py + height * 0.5) / height) * Math.PI) * 0.008;
    pos.setZ(i, radiusZ + curveX + contourY);
  }
  geo.computeVertexNormals();
  return geo;
}

export const ApparelStudioScene: React.FC<ApparelStudioSceneProps> = ({
  artworkTexture,
  garmentType,
  garmentCutId,
  garmentColorId,
  printPlacement,
  printScale,
  printOffsetY,
  roomLighting,
}) => {
  const cutOpt =
    GARMENT_CUTS.find((c) => c.id === garmentCutId) ??
    GARMENT_CUTS.find((c) => c.garmentType === garmentType) ??
    GARMENT_CUTS[0];

  const isLongSleeve = cutOpt.garmentType === 'hoodie';
  const isCrewneckSweatshirt = cutOpt.id === 'crewneck-sweatshirt';
  const isNight = roomLighting === 'spotlight-night';
  const colorOpt =
    GARMENT_COLORS.find((c) => c.id === garmentColorId) ?? GARMENT_COLORS[1];

  const cottonNormal = useMemo(() => getCottonFabricNormalMap(), []);

  // Dynamically generate and dispose torso geometry per cut
  const torsoGeo = useMemo(() => buildTailoredTorsoGeometry(cutOpt), [cutOpt]);
  useEffect(() => {
    return () => {
      torsoGeo.dispose();
    };
  }, [torsoGeo]);

  // Conformal print geometries
  const centerChestPatch = useMemo(
    () => buildConformalPrintPatch(0.35, 0.46, 0.014, 0.03),
    []
  );
  const leftChestPatch = useMemo(
    () => buildConformalPrintPatch(0.14, 0.185, 0.014, 0.012),
    []
  );
  const fullBackPatch = useMemo(
    () => buildConformalPrintPatch(0.41, 0.54, 0.014, 0.036),
    []
  );
  const sleevePatch = useMemo(
    () => buildConformalPrintPatch(0.135, 0.175, 0.014, 0.015),
    []
  );

  const hoodArchGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.165, 0.02, 0.055),
      new THREE.Vector3(-0.175, 0.22, -0.06),
      new THREE.Vector3(0, 0.34, -0.14),
      new THREE.Vector3(0.175, 0.22, -0.06),
      new THREE.Vector3(0.165, 0.02, 0.055),
    ]);
    return new THREE.TubeGeometry(curve, 28, 0.095, 18, false);
  }, []);

  const hangerRef = useRef<THREE.Group>(null);
  const animScaleRef = useRef(0.95);

  useFrame(({ clock }, delta) => {
    if (hangerRef.current) {
      hangerRef.current.position.y =
        1.62 + Math.sin(clock.getElapsedTime() * 1.2) * 0.011;
      // Subtle damped morph pop when switching cuts
      animScaleRef.current = THREE.MathUtils.lerp(
        animScaleRef.current,
        1.0,
        Math.min(1, delta * 9)
      );
      hangerRef.current.scale.setScalar(animScaleRef.current);
    }
  });

  useEffect(() => {
    animScaleRef.current = 0.94;
  }, [garmentCutId]);

  const halfTorso = cutOpt.torsoLength * 0.5;
  const frontChestZ = cutOpt.depthZ + 0.012;
  const backTorsoZ = -(cutOpt.depthZ + 0.008);

  const yShift = (printOffsetY / 100) * 0.44;
  let printPos: [number, number, number] = [0, 0.18 + yShift, frontChestZ];
  let printRot: [number, number, number] = [-0.04, 0, 0];
  let printGeo = centerChestPatch;

  if (printPlacement === 'left-chest') {
    printPos = [cutOpt.chestWidth * 0.38, 0.34 + yShift * 0.65, frontChestZ - 0.026];
    printRot = [-0.05, 0.34, 0];
    printGeo = leftChestPatch;
  } else if (printPlacement === 'full-back') {
    printPos = [0, 0.16 + yShift, backTorsoZ];
    printRot = [0.02, Math.PI, 0];
    printGeo = fullBackPatch;
  }

  const shoulderPivotX =
    cutOpt.id === 'oversized-tshirt' || cutOpt.id === 'oversized-hoodie'
      ? cutOpt.chestWidth * 0.84
      : cutOpt.chestWidth * 0.8;
  const shoulderPivotY = halfTorso - 0.18 - cutOpt.shoulderDrop * 0.45;

  const fabricMatProps = {
    color: colorOpt.hex,
    normalMap: cottonNormal,
    normalScale: new THREE.Vector2(0.48, 0.48),
    roughness: colorOpt.roughness,
    metalness: 0.02,
    sheen: 0.46,
    sheenRoughness: 0.76,
    sheenColor: '#ffffff',
  };

  return (
    <group>
      {/* --- STUDIO LIGHTING --- */}
      <ambientLight intensity={isNight ? 0.25 : 0.62} color="#f8fafc" />
      <hemisphereLight
        intensity={isNight ? 0.22 : 0.55}
        color="#ffffff"
        groundColor="#1e293b"
      />
      <directionalLight
        position={[3.2, 4.4, 4.2]}
        intensity={isNight ? 1.55 : 1.35}
        color="#fff9f0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-3.4, 3.2, -3.5]} intensity={1.1} color="#bae6fd" />
      <spotLight
        position={[0, 4.5, -2.6]}
        angle={0.6}
        penumbra={0.8}
        intensity={isNight ? 16 : 8}
        color="#fde68a"
      />

      {/* --- CYCLORAMA STUDIO PEDESTAL --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[9, 64]} />
        <meshStandardMaterial
          color={isNight ? '#0c0e14' : '#25272e'}
          roughness={0.55}
          metalness={0.15}
        />
      </mesh>

      <group position={[0, 0.09, 0]}>
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[1.15, 1.24, 0.18, 48]} />
          <meshStandardMaterial
            color={isNight ? '#151821' : '#32353f'}
            roughness={0.36}
            metalness={0.45}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.092, 0]}>
          <ringGeometry args={[1.08, 1.11, 64]} />
          <meshBasicMaterial color="#f59e0b" toneMapped={false} />
        </mesh>
      </group>

      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.032, 1.1, 16]} />
        <meshStandardMaterial color="#18181b" metalness={0.88} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.21, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.04, 24]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.24} />
      </mesh>

      {/* --- TAILORED 3D GARMENT ASSEMBLY --- */}
      <group ref={hangerRef} position={[0, 1.62, 0]}>
        {/* Sculpted Torso */}
        <mesh geometry={torsoGeo} castShadow receiveShadow>
          <meshPhysicalMaterial {...fabricMatProps} />
        </mesh>

        {/* Ribbed Waistband Hem */}
        <mesh
          position={[0, -halfTorso + 0.035, 0]}
          scale={[1.01, 1, (cutOpt.depthZ * 0.86) / Math.max(0.1, cutOpt.hemWidth)]}
          castShadow
        >
          <cylinderGeometry
            args={[
              cutOpt.hemWidth * 1.005,
              cutOpt.hemWidth * 0.98,
              isLongSleeve ? 0.11 : 0.045,
              48,
            ]}
          />
          <meshPhysicalMaterial
            {...fabricMatProps}
            roughness={Math.min(0.95, colorOpt.roughness + 0.06)}
          />
        </mesh>

        {/* Ribbed Crewneck Collar */}
        <mesh
          position={[0, halfTorso - 0.045, 0.01]}
          rotation={[Math.PI / 2 + 0.15, 0, 0]}
          scale={[1, 0.84, 1]}
          castShadow
        >
          <torusGeometry args={[0.155, cutOpt.collarThickness, 18, 40]} />
          <meshPhysicalMaterial {...fabricMatProps} />
        </mesh>

        {/* Classic Sweatshirt V-Notch Gusset Stitch Detail */}
        {isCrewneckSweatshirt && (
          <mesh position={[0, halfTorso - 0.115, frontChestZ - 0.056]} rotation={[-0.22, 0, 0]}>
            <coneGeometry args={[0.045, 0.075, 3]} />
            <meshPhysicalMaterial
              {...fabricMatProps}
              roughness={Math.min(0.96, colorOpt.roughness + 0.07)}
            />
          </mesh>
        )}

        {/* Inner Neck Tape & Woven Atelier Brand Label */}
        <mesh position={[0, halfTorso - 0.065, -0.015]} rotation={[Math.PI / 2 + 0.1, 0, 0]}>
          <cylinderGeometry args={[0.142, 0.142, 0.06, 24, 1, true]} />
          <meshStandardMaterial color="#111318" side={THREE.DoubleSide} roughness={0.9} />
        </mesh>
        <mesh position={[0, halfTorso - 0.07, -0.115]}>
          <boxGeometry args={[0.08, 0.038, 0.008]} />
          <meshStandardMaterial color="#d4af37" metalness={0.72} roughness={0.28} />
        </mesh>

        {/* --- SYMMETRIC TAILORED SLEEVES --- */}
        {!isLongSleeve ? (
          <>
            {[1, -1].map((side) => (
              <group
                key={side}
                position={[side * shoulderPivotX, shoulderPivotY, 0.01]}
                rotation={[0.03, 0, side * cutOpt.sleeveAngle]}
              >
                {/* Shoulder Seam Piping */}
                <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[cutOpt.sleeveRadiusTop * 0.98, 0.008, 8, 28]} />
                  <meshPhysicalMaterial {...fabricMatProps} />
                </mesh>
                <mesh position={[0, -0.02, 0]} castShadow receiveShadow>
                  <sphereGeometry args={[cutOpt.sleeveRadiusTop, 24, 18]} />
                  <meshPhysicalMaterial {...fabricMatProps} />
                </mesh>
                <mesh position={[0, -cutOpt.sleeveLength * 0.5, 0]} castShadow receiveShadow>
                  <cylinderGeometry
                    args={[
                      cutOpt.sleeveRadiusTop,
                      cutOpt.sleeveRadiusCuff,
                      cutOpt.sleeveLength,
                      36,
                    ]}
                  />
                  <meshPhysicalMaterial {...fabricMatProps} />
                </mesh>
                <mesh
                  position={[0, -cutOpt.sleeveLength, 0]}
                  rotation={[Math.PI / 2, 0, 0]}
                >
                  <torusGeometry args={[cutOpt.sleeveRadiusCuff, 0.01, 10, 28]} />
                  <meshPhysicalMaterial {...fabricMatProps} />
                </mesh>

                {side === 1 && printPlacement === 'sleeve' && (
                  <mesh
                    geometry={sleevePatch}
                    position={[
                      cutOpt.sleeveRadiusTop * 0.92,
                      -cutOpt.sleeveLength * 0.52 + yShift * 0.25,
                      0,
                    ]}
                    rotation={[0, Math.PI / 2, 0]}
                    scale={[printScale, printScale, 1]}
                  >
                    <meshStandardMaterial
                      map={artworkTexture}
                      roughness={0.62}
                      metalness={0.04}
                      polygonOffset
                      polygonOffsetFactor={-2}
                      polygonOffsetUnits={-2}
                    />
                  </mesh>
                )}
              </group>
            ))}
          </>
        ) : (
          <>
            {[1, -1].map((side) => (
              <group
                key={side}
                position={[side * shoulderPivotX, shoulderPivotY, 0.01]}
                rotation={[0.04, 0, side * cutOpt.sleeveAngle]}
              >
                <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[cutOpt.sleeveRadiusTop * 0.98, 0.009, 8, 28]} />
                  <meshPhysicalMaterial {...fabricMatProps} />
                </mesh>
                <mesh position={[0, -0.02, 0]} castShadow receiveShadow>
                  <sphereGeometry args={[cutOpt.sleeveRadiusTop, 24, 18]} />
                  <meshPhysicalMaterial {...fabricMatProps} />
                </mesh>
                {/* Upper Sleeve */}
                <mesh position={[0, -0.22, 0]} castShadow receiveShadow>
                  <cylinderGeometry
                    args={[
                      cutOpt.sleeveRadiusTop,
                      cutOpt.sleeveRadiusTop * 0.85,
                      0.44,
                      36,
                    ]}
                  />
                  <meshPhysicalMaterial {...fabricMatProps} />
                </mesh>
                {/* Forearm with elbow drape */}
                <mesh
                  position={[0, -0.58, 0.03]}
                  rotation={[-0.14, 0, 0]}
                  castShadow
                  receiveShadow
                >
                  <cylinderGeometry
                    args={[
                      cutOpt.sleeveRadiusTop * 0.84,
                      cutOpt.sleeveRadiusCuff * 1.06,
                      0.36,
                      36,
                    ]}
                  />
                  <meshPhysicalMaterial {...fabricMatProps} />
                </mesh>
                {/* Ribbed Wrist Cuff */}
                <mesh
                  position={[0, -0.77, 0.055]}
                  rotation={[-0.14, 0, 0]}
                  castShadow
                >
                  <cylinderGeometry
                    args={[
                      cutOpt.sleeveRadiusCuff * 1.02,
                      cutOpt.sleeveRadiusCuff * 0.96,
                      0.085,
                      32,
                    ]}
                  />
                  <meshPhysicalMaterial
                    {...fabricMatProps}
                    roughness={Math.min(0.95, colorOpt.roughness + 0.06)}
                  />
                </mesh>

                {side === 1 && printPlacement === 'sleeve' && (
                  <mesh
                    geometry={sleevePatch}
                    position={[cutOpt.sleeveRadiusTop * 0.92, -0.24 + yShift * 0.35, 0]}
                    rotation={[0, Math.PI / 2, 0]}
                    scale={[printScale, printScale, 1]}
                  >
                    <meshStandardMaterial
                      map={artworkTexture}
                      roughness={0.62}
                      metalness={0.04}
                      polygonOffset
                      polygonOffsetFactor={-2}
                      polygonOffsetUnits={-2}
                    />
                  </mesh>
                )}
              </group>
            ))}

            {/* Sculpted Hood & Drawstrings (only when cutOpt.hasHood is true) */}
            {cutOpt.hasHood && (
              <>
                <group position={[0, halfTorso - 0.12, -0.035]}>
                  <mesh geometry={hoodArchGeo} castShadow receiveShadow>
                    <meshPhysicalMaterial {...fabricMatProps} />
                  </mesh>
                  <mesh
                    position={[0, 0.1, -0.14]}
                    rotation={[-0.35, 0, 0]}
                    scale={[1.15, 1.32, 0.85]}
                    castShadow
                  >
                    <sphereGeometry args={[0.165, 24, 20]} />
                    <meshPhysicalMaterial {...fabricMatProps} />
                  </mesh>
                </group>

                {/* Neatly spaced drawstrings that frame rather than cross Center Chest print */}
                {[-0.082, 0.082].map((dx, i) => (
                  <group
                    key={i}
                    position={[dx, halfTorso - 0.12, cutOpt.depthZ - 0.01]}
                    rotation={[-0.06, 0, i === 0 ? 0.06 : -0.06]}
                  >
                    <mesh position={[0, -0.095, 0]} castShadow>
                      <cylinderGeometry args={[0.007, 0.007, 0.19, 10]} />
                      <meshStandardMaterial
                        color={colorOpt.id === 'jet-black' ? '#e4e4e7' : '#f4f4f5'}
                        roughness={0.65}
                      />
                    </mesh>
                    <mesh position={[0, -0.195, 0]} castShadow>
                      <cylinderGeometry args={[0.01, 0.008, 0.032, 12]} />
                      <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
                    </mesh>
                  </group>
                ))}
              </>
            )}

            {/* Front Kangaroo Pouch Pocket */}
            {cutOpt.hasKangarooPocket && (
              <mesh
                position={[0, -0.34, cutOpt.depthZ - 0.02]}
                scale={[1.05, 0.72, 0.24]}
                castShadow
                receiveShadow
              >
                <boxGeometry args={[0.42, 0.36, 0.18]} />
                <meshPhysicalMaterial {...fabricMatProps} />
              </mesh>
            )}
          </>
        )}

        {/* --- CONFORMAL INTERACTIVE PRINT / LOGO DECAL (Chest / Back) --- */}
        {printPlacement !== 'sleeve' && (
          <mesh
            geometry={printGeo}
            position={printPos}
            rotation={printRot}
            scale={[printScale, printScale, 1]}
          >
            <meshStandardMaterial
              map={artworkTexture}
              roughness={0.62}
              metalness={0.04}
              polygonOffset
              polygonOffsetFactor={-2}
              polygonOffsetUnits={-2}
            />
          </mesh>
        )}
      </group>
    </group>
  );
};
