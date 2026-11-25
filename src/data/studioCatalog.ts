import type {
  ArtFilterId,
  ArtFilterOption,
  ArtworkPreset,
  BacklightModeId,
  BacklightOption,
  CanvasFinishId,
  CanvasFinishOption,
  CanvasSizeId,
  CanvasSizeOption,
  FrameStyleId,
  FrameStyleOption,
  GarmentColorOption,
  GarmentTypeId,
  GarmentTypeOption,
  PriceLineItem,
  PriceSummary,
  PrintPlacementId,
  PrintPlacementOption,
  StudioMode,
} from '../types/studio';

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
  mode: StudioMode;
  canvasSizeId: CanvasSizeId;
  frameStyleId: FrameStyleId;
  canvasFinishId: CanvasFinishId;
  artFilterId: ArtFilterId;
  backlightModeId: BacklightModeId;
  garmentTypeId: GarmentTypeId;
  printPlacementId: PrintPlacementId;
  printScale: number;
  hasCustomCaption: boolean;
  quantity: number;
}): PriceSummary {
  const items: PriceLineItem[] = [];
  const filter = ART_FILTERS.find((f) => f.id === params.artFilterId) ?? ART_FILTERS[0];

  if (params.mode === 'canvas') {
    const size = CANVAS_SIZES.find((s) => s.id === params.canvasSizeId) ?? CANVAS_SIZES[1];
    const frame = FRAME_STYLES.find((f) => f.id === params.frameStyleId) ?? FRAME_STYLES[1];
    const finish =
      CANVAS_FINISHES.find((c) => c.id === params.canvasFinishId) ?? CANVAS_FINISHES[0];
    const backlight =
      BACKLIGHT_OPTIONS.find((b) => b.id === params.backlightModeId) ?? BACKLIGHT_OPTIONS[0];

    items.push({
      label: `Museum Canvas (${size.label})`,
      detail: '380 GSM archival cotton weave',
      amount: size.basePrice,
    });
    items.push({
      label: frame.name,
      detail: frame.subtitle,
      amount: frame.price,
    });
    items.push({
      label: finish.name,
      detail: finish.id === 'matte' ? 'Included' : 'UV Protective Gloss',
      amount: finish.price,
    });
    if (filter.price > 0) {
      items.push({
        label: `Art Style: ${filter.name}`,
        detail: 'Bespoke artist finish',
        amount: filter.price,
      });
    }
    if (backlight.price > 0) {
      items.push({
        label: `LED Backlight: ${backlight.name}`,
        detail: 'Perimeter aluminum channel + dimmer',
        amount: backlight.price,
      });
    }
  } else {
    const garment =
      GARMENT_TYPES.find((g) => g.id === params.garmentTypeId) ?? GARMENT_TYPES[0];
    const placement =
      PRINT_PLACEMENTS.find((p) => p.id === params.printPlacementId) ?? PRINT_PLACEMENTS[1];
    const oversizedPrintExtra = params.printScale > 1.2 ? 6 : 0;

    items.push({
      label: garment.name,
      detail: garment.gsm,
      amount: garment.basePrice,
    });
    items.push({
      label: placement.name,
      detail: 'Ultra-HD Kornit DTG print',
      amount: placement.price,
    });
    if (oversizedPrintExtra > 0) {
      items.push({
        label: 'Oversized Format Boost',
        detail: `Scale ${Math.round(params.printScale * 100)}% (>120%)`,
        amount: oversizedPrintExtra,
      });
    }
    if (filter.price > 0) {
      items.push({
        label: `Art Style: ${filter.name}`,
        detail: 'Color-graded print prep',
        amount: filter.price,
      });
    }
  }

  if (params.hasCustomCaption) {
    items.push({
      label: 'Custom Atelier Signature',
      detail: 'Typeset typography overlay',
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
