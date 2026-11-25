import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GARMENT_COLORS } from '../data/studioCatalog';
import type {
  GarmentColorId,
  GarmentTypeId,
  PrintPlacementId,
  RoomLightingMode,
} from '../types/studio';
import { getCottonFabricNormalMap } from './proceduralTextures';

interface ApparelStudioSceneProps {
  artworkTexture: THREE.Texture;
  garmentType: GarmentTypeId;
  garmentColorId: GarmentColorId;
  printPlacement: PrintPlacementId;
  printScale: number;
  printOffsetY: number;
  roomLighting: RoomLightingMode;
}

/**
 * Generates an anatomical sculpted 3D garment torso geometry with natural fabric drape folds,
 * tapered waist, shoulder slope, and smooth surface normals so prints sit cleanly on chest/back.
 */
function buildTorsoGeometry(isHoodie: boolean): THREE.BufferGeometry {
  const segX = 64;
  const segY = 48;
  const geo = new THREE.CylinderGeometry(1, 1, 1.38, segX, segY, false);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i); // -0.69 to +0.69
    const z = pos.getZ(i);

    const t = (y + 0.69) / 1.38; // 0 (hem) -> 1 (shoulders/collar)
    const angle = Math.atan2(z, x);

    // Anatomical width (X) and depth (Z) profile from hem to chest to shoulders
    let rx = 0.34;
    let rz = 0.21;

    if (t < 0.14) {
      // Ribbed waistband / hem taper
      const k = t / 0.14;
      rx = THREE.MathUtils.lerp(isHoodie ? 0.31 : 0.33, 0.34, k);
      rz = THREE.MathUtils.lerp(isHoodie ? 0.19 : 0.20, 0.21, k);
    } else if (t < 0.65) {
      // Mid-torso to chest swell
      const k = (t - 0.14) / 0.51;
      rx = THREE.MathUtils.lerp(0.34, 0.385, k);
      rz = THREE.MathUtils.lerp(0.21, 0.235, Math.sin(k * Math.PI * 0.65));
    } else {
      // Upper chest to shoulder/neck taper
      const k = (t - 0.65) / 0.35;
      rx = THREE.MathUtils.lerp(0.385, 0.31, Math.pow(k, 1.35));
      rz = THREE.MathUtils.lerp(0.23, 0.175, Math.pow(k, 1.25));
    }

    // Subtle chest contour on front (+Z) and vertical cloth drape folds near lower torso
    const frontFactor = Math.max(0, Math.sin(angle));
    const chestBoost =
      frontFactor * Math.exp(-Math.pow((t - 0.68) / 0.22, 2)) * 0.022;
    const drapeRipple =
      Math.sin(angle * 7 + t * 2.5) * 0.0055 * (1 - Math.abs(t - 0.45));

    // Slight shoulder slope at very top edge
    const shoulderDrop = t > 0.88 ? -Math.pow(Math.abs(Math.cos(angle)), 2) * 0.055 * ((t - 0.88) / 0.12) : 0;

    // Neck scoop on front top
    const neckScoop =
      t > 0.91 && frontFactor > 0.2
        ? -frontFactor * 0.055 * ((t - 0.91) / 0.09)
        : 0;

    const r = Math.hypot(x, z);
    if (r > 0.001) {
      const nx = x / r;
      const nz = z / r;
      pos.setXYZ(
        i,
        nx * (rx + drapeRipple),
        y + shoulderDrop + neckScoop,
        nz * (rz + chestBoost + drapeRipple)
      );
    }
  }

  geo.computeVertexNormals();
  return geo;
}

/**
 * Builds a slightly curved conformal print surface that hugs the front chest, back torso,
 * or left chest without z-fighting.
 */
function buildConformalPrintPatch(
  width: number,
  height: number,
  radiusZ: number,
  curveAmount: number
): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(width, height, 20, 20);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const px = pos.getX(i);
    const py = pos.getY(i);
    // Curve gently back along X and slightly follow chest/torso vertical contour along Y
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
  garmentColorId,
  printPlacement,
  printScale,
  printOffsetY,
  roomLighting,
}) => {
  const isHoodie = garmentType === 'hoodie';
  const isNight = roomLighting === 'spotlight-night';
  const colorOpt =
    GARMENT_COLORS.find((c) => c.id === garmentColorId) ?? GARMENT_COLORS[1];

  const cottonNormal = useMemo(() => getCottonFabricNormalMap(), []);

  const tshirtTorso = useMemo(() => buildTorsoGeometry(false), []);
  const hoodieTorso = useMemo(() => buildTorsoGeometry(true), []);

  // Conformal print geometries for each placement zone
  const centerChestPatch = useMemo(() => buildConformalPrintPatch(0.36, 0.48, 0.012, 0.032), []);
  const leftChestPatch = useMemo(() => buildConformalPrintPatch(0.145, 0.19, 0.012, 0.012), []);
  const fullBackPatch = useMemo(() => buildConformalPrintPatch(0.42, 0.56, 0.012, 0.038), []);
  const sleevePatch = useMemo(() => buildConformalPrintPatch(0.14, 0.18, 0.012, 0.016), []);

  // Sculpted 3D Hood geometry using Lathe/Tube arch
  const hoodArchGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.16, 0.02, 0.06),
      new THREE.Vector3(-0.17, 0.22, -0.06),
      new THREE.Vector3(0, 0.34, -0.14),
      new THREE.Vector3(0.17, 0.22, -0.06),
      new THREE.Vector3(0.16, 0.02, 0.06),
    ]);
    return new THREE.TubeGeometry(curve, 28, 0.095, 16, false);
  }, []);

  const hangerRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (hangerRef.current) {
      // Subtle floating studio breath motion
      hangerRef.current.position.y = 1.62 + Math.sin(clock.getElapsedTime() * 1.2) * 0.012;
    }
  });

  // Determine active print transform on the garment (chest/back on torso; sleeve mounted inside left sleeve)
  const yShift = (printOffsetY / 100) * 0.45; // -15..+15 cm -> meters
  let printPos: [number, number, number] = [0, 0.18 + yShift, 0.238];
  let printRot: [number, number, number] = [-0.04, 0, 0];
  let printGeo = centerChestPatch;

  if (printPlacement === 'left-chest') {
    printPos = [0.145, 0.34 + yShift * 0.65, 0.212];
    printRot = [-0.05, 0.34, 0];
    printGeo = leftChestPatch;
  } else if (printPlacement === 'full-back') {
    printPos = [0, 0.16 + yShift, -0.236];
    printRot = [0.02, Math.PI, 0];
    printGeo = fullBackPatch;
  }

  const fabricMatProps = {
    color: colorOpt.hex,
    normalMap: cottonNormal,
    normalScale: new THREE.Vector2(0.45, 0.45),
    roughness: colorOpt.roughness,
    metalness: 0.02,
    sheen: 0.45,
    sheenRoughness: 0.78,
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
      {/* Key Softbox Light */}
      <directionalLight
        position={[3.2, 4.4, 4.2]}
        intensity={isNight ? 1.55 : 1.35}
        color="#fff9f0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0004}
      />
      {/* Cool Studio Rim Light for crisp fabric fold separation */}
      <directionalLight position={[-3.4, 3.2, -3.5]} intensity={1.1} color="#bae6fd" />
      {/* Warm Accent Back-Rim */}
      <spotLight
        position={[0, 4.5, -2.6]}
        angle={0.6}
        penumbra={0.8}
        intensity={isNight ? 16 : 8}
        color="#fde68a"
      />

      {/* --- CYCLORAMA STUDIO PEDESTAL & BACKDROP --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[9, 64]} />
        <meshStandardMaterial
          color={isNight ? '#0c0e14' : '#25272e'}
          roughness={0.55}
          metalness={0.15}
        />
      </mesh>

      {/* Elevated Atelier Stage Podium */}
      <group position={[0, 0.09, 0]}>
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[1.15, 1.24, 0.18, 48]} />
          <meshStandardMaterial
            color={isNight ? '#151821' : '#32353f'}
            roughness={0.36}
            metalness={0.45}
          />
        </mesh>
        {/* Glowing amber studio ring around podium */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.092, 0]}>
          <ringGeometry args={[1.08, 1.11, 64]} />
          <meshBasicMaterial color="#f59e0b" toneMapped={false} />
        </mesh>
      </group>

      {/* Architectural Mannequin Stand Pole */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.032, 1.1, 16]} />
        <meshStandardMaterial color="#18181b" metalness={0.88} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.21, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.04, 24]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.24} />
      </mesh>

      {/* --- 3D GARMENT ASSEMBLY (T-SHIRT OR PULLOVER HOODIE) --- */}
      <group ref={hangerRef} position={[0, 1.62, 0]}>
        {/* Torso Mesh */}
        <mesh
          geometry={isHoodie ? hoodieTorso : tshirtTorso}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial {...fabricMatProps} />
        </mesh>

        {/* Ribbed Waistband Hem (prominent on Hoodie) */}
        <mesh position={[0, -0.66, 0]} scale={[1.02, 1, 0.62]} castShadow>
          <cylinderGeometry args={[0.315, 0.305, 0.11, 36]} />
          <meshPhysicalMaterial
            {...fabricMatProps}
            roughness={Math.min(0.95, colorOpt.roughness + 0.06)}
          />
        </mesh>

        {/* Ribbed Crewneck Collar */}
        <mesh position={[0, 0.635, 0.01]} rotation={[Math.PI / 2 + 0.14, 0, 0]} scale={[1, 0.85, 1]} castShadow>
          <torusGeometry args={[0.155, 0.032, 16, 36]} />
          <meshPhysicalMaterial {...fabricMatProps} />
        </mesh>

        {/* Inner Neck Dark Lining + Woven Atelier Brand Tag */}
        <mesh position={[0, 0.615, -0.02]} rotation={[Math.PI / 2 + 0.1, 0, 0]}>
          <cylinderGeometry args={[0.142, 0.142, 0.06, 24, 1, true]} />
          <meshStandardMaterial color="#111318" side={THREE.DoubleSide} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.61, -0.115]}>
          <boxGeometry args={[0.08, 0.04, 0.008]} />
          <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* --- SLEEVES --- */}
        {!isHoodie ? (
          <>
            {/* Crewneck T-Shirt Symmetric Short Sleeves (Left +X and Right -X) */}
            {[1, -1].map((side) => (
              <group
                key={side}
                position={[side * 0.31, 0.51, 0.01]}
                rotation={[0.03, 0, side * 0.58]}
              >
                {/* Shoulder cap blend */}
                <mesh position={[0, -0.02, 0]} castShadow receiveShadow>
                  <sphereGeometry args={[0.125, 24, 18]} />
                  <meshPhysicalMaterial {...fabricMatProps} />
                </mesh>
                {/* Main short sleeve */}
                <mesh position={[0, -0.17, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.124, 0.11, 0.32, 32]} />
                  <meshPhysicalMaterial {...fabricMatProps} />
                </mesh>
                {/* Sleeve cuff seam */}
                <mesh position={[0, -0.325, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.109, 0.01, 10, 28]} />
                  <meshPhysicalMaterial {...fabricMatProps} />
                </mesh>
                {/* Conformal Sleeve Print when Left Sleeve (+X) is active */}
                {side === 1 && printPlacement === 'sleeve' && (
                  <mesh
                    geometry={sleevePatch}
                    position={[0.108, -0.18 + yShift * 0.3, 0]}
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
            {/* Pullover Hoodie Symmetric Long Sleeves with Ribbed Cuffs */}
            {[1, -1].map((side) => (
              <group
                key={side}
                position={[side * 0.31, 0.50, 0.01]}
                rotation={[0.04, 0, side * 0.34]}
              >
                {/* Shoulder cap blend */}
                <mesh position={[0, -0.02, 0]} castShadow receiveShadow>
                  <sphereGeometry args={[0.135, 24, 18]} />
                  <meshPhysicalMaterial {...fabricMatProps} />
                </mesh>
                {/* Upper Arm */}
                <mesh position={[0, -0.22, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.134, 0.114, 0.44, 32]} />
                  <meshPhysicalMaterial {...fabricMatProps} />
                </mesh>
                {/* Forearm */}
                <mesh position={[0, -0.58, 0.03]} rotation={[-0.14, 0, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.112, 0.082, 0.36, 32]} />
                  <meshPhysicalMaterial {...fabricMatProps} />
                </mesh>
                {/* Ribbed Wrist Cuff */}
                <mesh position={[0, -0.77, 0.055]} rotation={[-0.14, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.08, 0.074, 0.08, 28]} />
                  <meshPhysicalMaterial {...fabricMatProps} />
                </mesh>
                {/* Conformal Sleeve Print when Left Sleeve (+X) is active */}
                {side === 1 && printPlacement === 'sleeve' && (
                  <mesh
                    geometry={sleevePatch}
                    position={[0.118, -0.24 + yShift * 0.4, 0]}
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

            {/* Sculpted 3D Draped Hoodie Hood (flush at collar) */}
            <group position={[0, 0.57, -0.035]}>
              <mesh geometry={hoodArchGeo} castShadow receiveShadow>
                <meshPhysicalMaterial {...fabricMatProps} />
              </mesh>
              {/* Hood back drape */}
              <mesh position={[0, 0.10, -0.14]} rotation={[-0.35, 0, 0]} scale={[1.15, 1.32, 0.85]} castShadow>
                <sphereGeometry args={[0.165, 24, 20]} />
                <meshPhysicalMaterial {...fabricMatProps} />
              </mesh>
            </group>

            {/* Drawstrings with Metallic Aglets (clearly forward of chest Z) */}
            {[-0.055, 0.055].map((dx, i) => (
              <group key={i} position={[dx, 0.57, 0.228]} rotation={[-0.05, 0, i === 0 ? 0.05 : -0.05]}>
                <mesh position={[0, -0.14, 0]} castShadow>
                  <cylinderGeometry args={[0.008, 0.008, 0.28, 10]} />
                  <meshStandardMaterial
                    color={colorOpt.id === 'jet-black' ? '#e4e4e7' : '#f4f4f5'}
                    roughness={0.65}
                  />
                </mesh>
                <mesh position={[0, -0.29, 0]} castShadow>
                  <cylinderGeometry args={[0.011, 0.009, 0.036, 12]} />
                  <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
                </mesh>
              </group>
            ))}

            {/* Front Kangaroo Pouch Pocket */}
            <mesh position={[0, -0.34, 0.215]} scale={[1.05, 0.72, 0.24]} castShadow receiveShadow>
              <boxGeometry args={[0.42, 0.36, 0.18]} />
              <meshPhysicalMaterial {...fabricMatProps} />
            </mesh>
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
