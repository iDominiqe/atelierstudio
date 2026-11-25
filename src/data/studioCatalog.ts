import * as THREE from 'three';
import type {
  ArtFilterId,
  ArtFilterOption,
  ArtworkPreset,
  BacklightModeId,
  BacklightOption,
  CanvasFinishId,
  CanvasFinishOption,
  CanvasOrientation,
  CanvasSizeId,
  CanvasSizeOption,
  FrameStyleId,
  FrameStyleOption,
  GarmentColorOption,
  GarmentCutId,
  GarmentCutOption,
  GarmentTypeId,
  GarmentTypeOption,
  LanguageCode,
  PriceLineItem,
  PriceSummary,
  PrintPlacementId,
  PrintPlacementOption,
  ResolvedCanvasDimensions,
  StudioMode,
} from '../types/studio';
import { TRANSLATIONS } from './i18n';

export const CANVAS_SIZES: CanvasSizeOption[] = [
  {
    id: '30x40',
    label: '30 × 40 cm',
    widthCm: 30,
    heightCm: 40,
    width3D: 0.72,
    height3D: 0.96,
    basePrice: 49,
    recommendedRoom: 'Desk / Intimate Alcove',
  },
  {
    id: '50x70',
    label: '50 × 70 cm',
    widthCm: 50,
    heightCm: 70,
    width3D: 1.05,
    height3D: 1.47,
    basePrice: 79,
    recommendedRoom: 'Bedroom / Studio Wall',
  },
  {
    id: '70x100',
    label: '70 × 100 cm',
    widthCm: 70,
    heightCm: 100,
    width3D: 1.38,
    height3D: 1.97,
    basePrice: 119,
    recommendedRoom: 'Living Room Centerpiece',
  },
  {
    id: '100x150',
    label: '100 × 150 cm',
    widthCm: 100,
    heightCm: 150,
    width3D: 1.82,
    height3D: 2.73,
    basePrice: 179,
    recommendedRoom: 'Grand Gallery Statement',
  },
];

export function resolveCanvasDimensions(
  sizeId: CanvasSizeId,
  orientation: CanvasOrientation,
  customWidthCm: number,
  customHeightCm: number
): ResolvedCanvasDimensions {
  if (sizeId !== 'custom') {
    const preset = CANVAS_SIZES.find((s) => s.id === sizeId) ?? CANVAS_SIZES[2];
    const isLandscape = orientation === 'landscape';
    const widthCm = isLandscape ? preset.heightCm : preset.widthCm;
    const heightCm = isLandscape ? preset.widthCm : preset.heightCm;
    const width3D = isLandscape ? preset.height3D : preset.width3D;
    const height3D = isLandscape ? preset.width3D : preset.height3D;
    return {
      sizeId,
      orientation,
      widthCm,
      heightCm,
      width3D,
      height3D,
      areaCm2: widthCm * heightCm,
      perimeterCm: 2 * (widthCm + heightCm),
      aspectRatio: widthCm / heightCm,
      basePrice: preset.basePrice,
      frameScaleMultiplier: 1.0,
      label: `${widthCm} × ${heightCm} cm`,
    };
  }

  // Custom Dimensions (20 - 200 cm)
  const wClamped = THREE.MathUtils.clamp(Math.round(customWidthCm || 80), 20, 200);
  const hClamped = THREE.MathUtils.clamp(Math.round(customHeightCm || 110), 20, 200);
  const widthCm = wClamped;
  const heightCm = hClamped;
  const aspectRatio = widthCm / heightCm;

  // Map cm -> realistic 3D scene meters (keeping inside gallery wall & ceiling track bounds)
  let width3D = THREE.MathUtils.clamp(0.42 + (widthCm / 100) * 1.4, 0.48, 3.25);
  let height3D = width3D / aspectRatio;
  if (height3D > 2.78) {
    const down = 2.78 / height3D;
    height3D = 2.78;
    width3D *= down;
  }
  if (width3D > 3.25) {
    const down = 3.25 / width3D;
    width3D = 3.25;
    height3D *= down;
  }

  const areaCm2 = widthCm * heightCm;
  const perimeterCm = 2 * (widthCm + heightCm);
  const basePrice = Math.round(24 + areaCm2 * 0.0105);
  const frameScaleMultiplier = Math.max(0.75, perimeterCm / 240);

  return {
    sizeId: 'custom',
    orientation: widthCm > heightCm ? 'landscape' : 'portrait',
    widthCm,
    heightCm,
    width3D,
    height3D,
    areaCm2,
    perimeterCm,
    aspectRatio,
    basePrice,
    frameScaleMultiplier,
    label: `${widthCm} × ${heightCm} cm`,
  };
}

export const FRAME_STYLES: FrameStyleOption[] = [
  {
    id: 'frameless',
    name: 'Frameless Gallery Wrap',
    subtitle: '4.5 cm museum-wrapped edges',
    price: 0,
    color: '#22242a',
    metalness: 0.05,
    roughness: 0.85,
    borderWidth: 0,
    depth: 0.08,
    swatchHex: '#d6d3d1',
  },
  {
    id: 'matte-black',
    name: 'Matte Black Aluminum',
    subtitle: 'Anodized minimalist float profile',
    price: 29,
    color: '#14161a',
    metalness: 0.82,
    roughness: 0.34,
    borderWidth: 0.048,
    depth: 0.11,
    swatchHex: '#18181b',
  },
  {
    id: 'brushed-gold',
    name: 'Brushed Gold / Brass',
    subtitle: 'Satin-burnished architectural brass',
    price: 49,
    color: '#d4af37',
    metalness: 0.92,
    roughness: 0.22,
    borderWidth: 0.055,
    depth: 0.115,
    swatchHex: '#d4af37',
  },
  {
    id: 'natural-oak',
    name: 'Natural Oak Wood',
    subtitle: 'Nordic white-oak + crisp mat',
    price: 39,
    color: '#c79b63',
    metalness: 0.05,
    roughness: 0.68,
    borderWidth: 0.068,
    depth: 0.12,
    swatchHex: '#c79b63',
    hasInnerMat: true,
  },
  {
    id: 'ornate-walnut',
    name: 'Ornate Dark Walnut',
    subtitle: 'Sculpted baroque profile + gold fillet',
    price: 65,
    color: '#3b2114',
    metalness: 0.14,
    roughness: 0.42,
    borderWidth: 0.095,
    depth: 0.14,
    swatchHex: '#4a2918',
    hasGoldFillet: true,
  },
];

export const CANVAS_FINISHES: CanvasFinishOption[] = [
  {
    id: 'matte',
    name: 'Matte Fine-Art Canvas',
    subtitle: '0.85 roughness · Zero glare linen weave',
    roughness: 0.85,
    metalness: 0.02,
    clearcoat: 0.0,
    price: 0,
  },
  {
    id: 'satin-gloss',
    name: 'Satin / Gloss Varnish',
    subtitle: '0.22 roughness · Gallery UV lacquer sheen',
    roughness: 0.22,
    metalness: 0.08,
    clearcoat: 0.68,
    price: 18,
  },
];

export const ART_FILTERS: ArtFilterOption[] = [
  {
    id: 'original',
    name: 'Original Studio HD',
    subtitle: 'True color archival pigment',
    price: 0,
    accentHex: '#e5e7eb',
  },
  {
    id: 'oil-impasto',
    name: 'Oil Impasto Brush',
    subtitle: 'Rich painter strokes & warmth',
    price: 15,
    accentHex: '#f59e0b',
  },
  {
    id: 'pop-neon',
    name: 'Cyber Pop Neon',
    subtitle: 'Electric duotone rim contrast',
    price: 15,
    accentHex: '#22d3ee',
  },
  {
    id: 'noir-charcoal',
    name: 'Charcoal Noir',
    subtitle: 'Editorial silver-gelatin B&W',
    price: 10,
    accentHex: '#94a3b8',
  },
  {
    id: 'renaissance-gold',
    name: 'Renaissance Gold',
    subtitle: 'Chiaroscuro amber & gilt tone',
    price: 15,
    accentHex: '#fbbf24',
  },
];

export const BACKLIGHT_OPTIONS: BacklightOption[] = [
  {
    id: 'off',
    name: 'No Backlight',
    subtitle: 'Natural gallery lighting only',
    price: 0,
    primaryColor: '#000000',
    secondaryColor: '#000000',
    swatchGradient: 'linear-gradient(135deg, #27272a, #18181b)',
  },
  {
    id: 'warm-white',
    name: 'Warm Halo 2700K',
    subtitle: 'Soft golden ambient wall glow',
    price: 35,
    primaryColor: '#ffaa44',
    secondaryColor: '#ff8822',
    swatchGradient: 'linear-gradient(135deg, #fde68a, #f59e0b)',
  },
  {
    id: 'cool-white',
    name: 'Gallery White 5500K',
    subtitle: 'Crisp museum daylight halo',
    price: 35,
    primaryColor: '#e0f2fe',
    secondaryColor: '#bae6fd',
    swatchGradient: 'linear-gradient(135deg, #ffffff, #bae6fd)',
  },
  {
    id: 'rgb-sunset',
    name: 'Sunset Aura RGB',
    subtitle: 'Coral & amber ambient LED strip',
    price: 45,
    primaryColor: '#fb7185',
    secondaryColor: '#f59e0b',
    swatchGradient: 'linear-gradient(135deg, #f43f5e, #f59e0b)',
  },
  {
    id: 'rgb-cyber',
    name: 'Cyber Studio RGB',
    subtitle: 'Cyan & ultraviolet perimeter LED',
    price: 45,
    primaryColor: '#38bdf8',
    secondaryColor: '#a855f7',
    swatchGradient: 'linear-gradient(135deg, #22d3ee, #a855f7)',
  },
];

export const GARMENT_TYPES: GarmentTypeOption[] = [
  {
    id: 'tshirt',
    name: 'Crewneck T-Shirt',
    subtitle: 'Майка · Boxy Atelier Cut',
    gsm: '280 GSM Combed Cotton',
    basePrice: 39,
  },
  {
    id: 'hoodie',
    name: 'Pullover Hoodie',
    subtitle: 'Батник / Толстовка · Heavy Fleece',
    gsm: '480 GSM French Terry',
    basePrice: 69,
  },
];

export const GARMENT_CUTS: GarmentCutOption[] = [
  // T-Shirt Cuts
  {
    id: 'regular-tshirt',
    garmentType: 'tshirt',
    priceDelta: 0,
    chestWidth: 0.37,
    waistWidth: 0.34,
    hemWidth: 0.345,
    torsoLength: 1.36,
    depthZ: 0.225,
    shoulderDrop: 0.045,
    sleeveAngle: 0.54,
    sleeveRadiusTop: 0.118,
    sleeveRadiusCuff: 0.105,
    sleeveLength: 0.32,
    hasHood: false,
    hasKangarooPocket: false,
    collarThickness: 0.028,
  },
  {
    id: 'oversized-tshirt',
    garmentType: 'tshirt',
    priceDelta: 6,
    chestWidth: 0.435,
    waistWidth: 0.425,
    hemWidth: 0.43,
    torsoLength: 1.44,
    depthZ: 0.25,
    shoulderDrop: 0.075,
    sleeveAngle: 0.64,
    sleeveRadiusTop: 0.142,
    sleeveRadiusCuff: 0.132,
    sleeveLength: 0.39,
    hasHood: false,
    hasKangarooPocket: false,
    collarThickness: 0.036,
  },
  {
    id: 'slim-tshirt',
    garmentType: 'tshirt',
    priceDelta: 0,
    chestWidth: 0.345,
    waistWidth: 0.285,
    hemWidth: 0.305,
    torsoLength: 1.34,
    depthZ: 0.21,
    shoulderDrop: 0.035,
    sleeveAngle: 0.44,
    sleeveRadiusTop: 0.105,
    sleeveRadiusCuff: 0.092,
    sleeveLength: 0.26,
    hasHood: false,
    hasKangarooPocket: false,
    collarThickness: 0.024,
  },
  // Hoodie / Sweatshirt Cuts
  {
    id: 'classic-hoodie',
    garmentType: 'hoodie',
    priceDelta: 0,
    chestWidth: 0.385,
    waistWidth: 0.355,
    hemWidth: 0.335,
    torsoLength: 1.38,
    depthZ: 0.24,
    shoulderDrop: 0.055,
    sleeveAngle: 0.35,
    sleeveRadiusTop: 0.132,
    sleeveRadiusCuff: 0.076,
    sleeveLength: 0.78,
    hasHood: true,
    hasKangarooPocket: true,
    collarThickness: 0.032,
  },
  {
    id: 'oversized-hoodie',
    garmentType: 'hoodie',
    priceDelta: 8,
    chestWidth: 0.445,
    waistWidth: 0.43,
    hemWidth: 0.38,
    torsoLength: 1.44,
    depthZ: 0.265,
    shoulderDrop: 0.085,
    sleeveAngle: 0.42,
    sleeveRadiusTop: 0.155,
    sleeveRadiusCuff: 0.086,
    sleeveLength: 0.82,
    hasHood: true,
    hasKangarooPocket: true,
    collarThickness: 0.036,
  },
  {
    id: 'crewneck-sweatshirt',
    garmentType: 'hoodie',
    priceDelta: -5,
    chestWidth: 0.39,
    waistWidth: 0.36,
    hemWidth: 0.335,
    torsoLength: 1.37,
    depthZ: 0.238,
    shoulderDrop: 0.05,
    sleeveAngle: 0.34,
    sleeveRadiusTop: 0.13,
    sleeveRadiusCuff: 0.075,
    sleeveLength: 0.77,
    hasHood: false,
    hasKangarooPocket: false,
    collarThickness: 0.038,
  },
];

export const GARMENT_COLORS: GarmentColorOption[] = [
  { id: 'optic-white', name: 'Optic White', hex: '#f2f1ec', roughness: 0.88 },
  { id: 'jet-black', name: 'Jet Black', hex: '#17191f', roughness: 0.86 },
  { id: 'heather-grey', name: 'Heather Grey', hex: '#8b919c', roughness: 0.9 },
  { id: 'navy-blue', name: 'Navy Blue', hex: '#1d2c4d', roughness: 0.86 },
  { id: 'forest-green', name: 'Forest Green', hex: '#1b3b2d', roughness: 0.87 },
  { id: 'sand-beige', name: 'Sand Beige', hex: '#d4c3aa', roughness: 0.89 },
  { id: 'burgundy', name: 'Burgundy', hex: '#5c1927', roughness: 0.85 },
];

export const PRINT_PLACEMENTS: PrintPlacementOption[] = [
  {
    id: 'left-chest',
    name: 'Left Chest Pocket',
    subtitle: 'Subtle embroidered/DTG badge',
    price: 8,
    defaultScale: 0.55,
    cameraPreset: 'front',
  },
  {
    id: 'center-chest',
    name: 'Center Chest Print',
    subtitle: 'Statement front centerpiece',
    price: 15,
    defaultScale: 1.0,
    cameraPreset: 'front',
  },
  {
    id: 'full-back',
    name: 'Full Back Graphic',
    subtitle: 'Oversized studio back print',
    price: 22,
    defaultScale: 1.08,
    cameraPreset: 'rear',
  },
  {
    id: 'sleeve',
    name: 'Left Sleeve Emblem',
    subtitle: 'Signature cuff-to-shoulder print',
    price: 12,
    defaultScale: 0.85,
    cameraPreset: 'sleeve',
  },
];

export const ARTWORK_PRESETS: ArtworkPreset[] = [
  {
    id: 'golden-sovereign',
    title: 'Golden Sovereign',
    artistTag: 'Baroque Oil Portrait',
    category: 'Fine Art',
    palette: ['#1a130e', '#d4af37', '#b45309'],
  },
  {
    id: 'cyber-botanica',
    title: 'Cyberpunk Botanica',
    artistTag: 'Neon Bioluminescence',
    category: 'Neo Digital',
    palette: ['#090d1f', '#22d3ee', '#e879f9'],
  },
  {
    id: 'atelier-noir',
    title: 'Atelier Noir Study',
    artistTag: 'Architectural Monochrome',
    category: 'Editorial',
    palette: ['#111318', '#e2e8f0', '#64748b'],
  },
  {
    id: 'astral-samurai',
    title: 'Astral Samurai Crest',
    artistTag: 'Crimson Sun Emblem',
    category: 'Street Luxury',
    palette: ['#130b10', '#ef4444', '#fbbf24'],
  },
  {
    id: 'velvet-horizon',
    title: 'Velvet Horizon',
    artistTag: 'Modernist Impasto',
    category: 'Gallery Abstract',
    palette: ['#1b2a4a', '#ea580c', '#eab308'],
  },
];

export const GARMENT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;
export type GarmentSizeLabel = (typeof GARMENT_SIZES)[number];

export function calculatePriceSummary(params: {
  lang?: LanguageCode;
  mode: StudioMode;
  canvasSizeId: CanvasSizeId;
  canvasOrientation: CanvasOrientation;
  customWidthCm: number;
  customHeightCm: number;
  frameStyleId: FrameStyleId;
  canvasFinishId: CanvasFinishId;
  artFilterId: ArtFilterId;
  backlightModeId: BacklightModeId;
  garmentTypeId: GarmentTypeId;
  garmentCutId: GarmentCutId;
  printPlacementId: PrintPlacementId;
  printScale: number;
  hasCustomCaption: boolean;
  quantity: number;
}): PriceSummary {
  const t = TRANSLATIONS[params.lang ?? 'en'];
  const items: PriceLineItem[] = [];
  const filter = ART_FILTERS.find((f) => f.id === params.artFilterId) ?? ART_FILTERS[0];
  const filterLabel = t.filters[filter.id].name;

  if (params.mode === 'canvas') {
    const dims = resolveCanvasDimensions(
      params.canvasSizeId,
      params.canvasOrientation,
      params.customWidthCm,
      params.customHeightCm
    );
    const frame = FRAME_STYLES.find((f) => f.id === params.frameStyleId) ?? FRAME_STYLES[1];
    const finish =
      CANVAS_FINISHES.find((c) => c.id === params.canvasFinishId) ?? CANVAS_FINISHES[0];
    const backlight =
      BACKLIGHT_OPTIONS.find((b) => b.id === params.backlightModeId) ?? BACKLIGHT_OPTIONS[0];

    const scaledFramePrice =
      frame.price === 0
        ? 0
        : Math.round(frame.price * dims.frameScaleMultiplier);

    items.push({
      label:
        dims.sizeId === 'custom'
          ? `${t.priceCustomCanvas} (${dims.label})`
          : `${t.priceMuseumCanvas} (${dims.label})`,
      detail: `${dims.areaCm2.toLocaleString()} cm² · P ${dims.perimeterCm} cm`,
      amount: dims.basePrice,
    });
    items.push({
      label: t.frames[frame.id].name,
      detail: t.frames[frame.id].subtitle,
      amount: scaledFramePrice,
    });
    items.push({
      label: t.finishes[finish.id].name,
      detail: finish.id === 'matte' ? t.included : t.finishes[finish.id].subtitle,
      amount: finish.price,
    });
    if (filter.price > 0) {
      items.push({
        label: `${t.priceArtStylePrefix}: ${filterLabel}`,
        detail: t.filters[filter.id].subtitle,
        amount: filter.price,
      });
    }
    if (backlight.price > 0) {
      items.push({
        label: `${t.priceBacklightPrefix}: ${t.backlights[backlight.id].name}`,
        detail: t.backlights[backlight.id].subtitle,
        amount: backlight.price,
      });
    }
  } else {
    const garment =
      GARMENT_TYPES.find((g) => g.id === params.garmentTypeId) ?? GARMENT_TYPES[0];
    const cut =
      GARMENT_CUTS.find((c) => c.id === params.garmentCutId) ?? GARMENT_CUTS[0];
    const placement =
      PRINT_PLACEMENTS.find((p) => p.id === params.printPlacementId) ?? PRINT_PLACEMENTS[1];
    const oversizedPrintExtra = params.printScale > 1.2 ? 6 : 0;

    items.push({
      label: t.garmentTypes[garment.id].name,
      detail: garment.gsm,
      amount: garment.basePrice,
    });
    if (cut.priceDelta !== 0) {
      items.push({
        label: `${t.priceCutPrefix}: ${t.garmentCuts[cut.id].name}`,
        detail: t.garmentCuts[cut.id].subtitle,
        amount: cut.priceDelta,
      });
    }
    items.push({
      label: t.placements[placement.id].name,
      detail: t.placements[placement.id].subtitle,
      amount: placement.price,
    });
    if (oversizedPrintExtra > 0) {
      items.push({
        label: t.priceOversizedBoost,
        detail: `${Math.round(params.printScale * 100)}%`,
        amount: oversizedPrintExtra,
      });
    }
    if (filter.price > 0) {
      items.push({
        label: `${t.priceArtStylePrefix}: ${filterLabel}`,
        detail: t.filters[filter.id].subtitle,
        amount: filter.price,
      });
    }
  }

  if (params.hasCustomCaption) {
    items.push({
      label: t.priceCustomSignature,
      detail: t.customSignatureHint,
      amount: 5,
    });
  }

  const unitTotal = items.reduce((acc, item) => acc + item.amount, 0);
  const qty = Math.max(1, Math.min(10, params.quantity));
  return {
    items,
    unitTotal,
    quantity: qty,
    grandTotal: unitTotal * qty,
  };
}
