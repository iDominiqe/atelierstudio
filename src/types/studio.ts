export type StudioMode = 'canvas' | 'apparel';

export type LanguageCode = 'ru' | 'ro' | 'en';

export type CanvasOrientation = 'portrait' | 'landscape';

export type TextureFitMode = 'cover' | 'contain';

export type CanvasSizeId = '30x40' | '50x70' | '70x100' | '100x150' | 'custom';

export type FrameStyleId =
  | 'frameless'
  | 'matte-black'
  | 'brushed-gold'
  | 'natural-oak'
  | 'ornate-walnut';

export type CanvasFinishId = 'matte' | 'satin-gloss';

export type ArtFilterId =
  | 'original'
  | 'oil-impasto'
  | 'pop-neon'
  | 'noir-charcoal'
  | 'renaissance-gold';

export type BacklightModeId =
  | 'off'
  | 'warm-white'
  | 'cool-white'
  | 'rgb-sunset'
  | 'rgb-cyber';

export type RoomLightingMode = 'daylight' | 'spotlight-night';

export type ScaleReferenceMode = 'interior' | 'human' | 'none';

export type GarmentTypeId = 'tshirt' | 'hoodie';

export type TShirtCutId = 'regular-tshirt' | 'oversized-tshirt' | 'slim-tshirt';

export type HoodieCutId =
  | 'classic-hoodie'
  | 'oversized-hoodie'
  | 'crewneck-sweatshirt';

export type GarmentCutId = TShirtCutId | HoodieCutId;

export type GarmentColorId =
  | 'optic-white'
  | 'jet-black'
  | 'heather-grey'
  | 'navy-blue'
  | 'forest-green'
  | 'sand-beige'
  | 'burgundy';

export type PrintPlacementId =
  | 'left-chest'
  | 'center-chest'
  | 'full-back'
  | 'sleeve';

export type CameraAnglePreset = 'front' | 'angle45' | 'macro' | 'rear' | 'sleeve';

export interface CanvasSizeOption {
  id: Exclude<CanvasSizeId, 'custom'>;
  label: string;
  widthCm: number;
  heightCm: number;
  width3D: number;
  height3D: number;
  basePrice: number;
  recommendedRoom: string;
}

export interface ResolvedCanvasDimensions {
  sizeId: CanvasSizeId;
  orientation: CanvasOrientation;
  widthCm: number;
  heightCm: number;
  width3D: number;
  height3D: number;
  areaCm2: number;
  perimeterCm: number;
  aspectRatio: number;
  basePrice: number;
  frameScaleMultiplier: number;
  label: string;
}

export interface FrameStyleOption {
  id: FrameStyleId;
  name: string;
  subtitle: string;
  price: number;
  color: string;
  metalness: number;
  roughness: number;
  borderWidth: number;
  depth: number;
  swatchHex: string;
  hasInnerMat?: boolean;
  hasGoldFillet?: boolean;
}

export interface CanvasFinishOption {
  id: CanvasFinishId;
  name: string;
  subtitle: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
  price: number;
}

export interface ArtFilterOption {
  id: ArtFilterId;
  name: string;
  subtitle: string;
  price: number;
  accentHex: string;
}

export interface BacklightOption {
  id: BacklightModeId;
  name: string;
  subtitle: string;
  price: number;
  primaryColor: string;
  secondaryColor: string;
  swatchGradient: string;
}

export interface GarmentTypeOption {
  id: GarmentTypeId;
  name: string;
  subtitle: string;
  gsm: string;
  basePrice: number;
}

export interface GarmentCutOption {
  id: GarmentCutId;
  garmentType: GarmentTypeId;
  priceDelta: number;
  chestWidth: number;
  waistWidth: number;
  hemWidth: number;
  torsoLength: number;
  depthZ: number;
  shoulderDrop: number;
  sleeveAngle: number;
  sleeveRadiusTop: number;
  sleeveRadiusCuff: number;
  sleeveLength: number;
  hasHood: boolean;
  hasKangarooPocket: boolean;
  collarThickness: number;
}

export interface GarmentColorOption {
  id: GarmentColorId;
  name: string;
  hex: string;
  roughness: number;
}

export interface PrintPlacementOption {
  id: PrintPlacementId;
  name: string;
  subtitle: string;
  price: number;
  defaultScale: number;
  cameraPreset: CameraAnglePreset;
}

export interface ArtworkPreset {
  id: string;
  title: string;
  artistTag: string;
  category: string;
  palette: [string, string, string];
}

export interface PriceLineItem {
  label: string;
  detail: string;
  amount: number;
}

export interface PriceSummary {
  items: PriceLineItem[];
  unitTotal: number;
  quantity: number;
  grandTotal: number;
}

export interface CustomOrderPayload {
  orderId: string;
  createdAt: string;
  snapshotDataUrl: string;
  mode: StudioMode;
  artworkTitle: string;
  artFilterName: string;
  customCaption: string;
  configurationSummary: string[];
  priceSummary: PriceSummary;
  customerName: string;
  contactHandle: string;
  deliveryAddress: string;
  notes: string;
}
