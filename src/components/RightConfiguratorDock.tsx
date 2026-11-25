import React from 'react';
import {
  Check,
  Expand,
  Lightbulb,
  Minus,
  Plus,
  RectangleHorizontal,
  RectangleVertical,
  RotateCcw,
  Ruler,
  Scissors,
  Shirt,
  ShoppingBag,
  Sparkles,
  User,
} from 'lucide-react';
import { TRANSLATIONS } from '../data/i18n';
import {
  BACKLIGHT_OPTIONS,
  CANVAS_FINISHES,
  CANVAS_SIZES,
  FRAME_STYLES,
  GARMENT_COLORS,
  GARMENT_CUTS,
  GARMENT_SIZES,
  GARMENT_TYPES,
  PRINT_PLACEMENTS,
  type GarmentSizeLabel,
} from '../data/studioCatalog';
import type {
  BacklightModeId,
  CanvasFinishId,
  CanvasOrientation,
  CanvasSizeId,
  FrameStyleId,
  GarmentColorId,
  GarmentCutId,
  GarmentTypeId,
  LanguageCode,
  PriceSummary,
  PrintPlacementId,
  ResolvedCanvasDimensions,
  RoomLightingMode,
  ScaleReferenceMode,
  StudioMode,
} from '../types/studio';

interface RightConfiguratorDockProps {
  lang: LanguageCode;
  mode: StudioMode;
  // Mode A
  canvasSizeId: CanvasSizeId;
  onSelectCanvasSize: (id: CanvasSizeId) => void;
  canvasOrientation: CanvasOrientation;
  onSelectOrientation: (ori: CanvasOrientation) => void;
  customWidthCm: number;
  customHeightCm: number;
  onChangeCustomWidth: (cm: number) => void;
  onChangeCustomHeight: (cm: number) => void;
  resolvedDims: ResolvedCanvasDimensions;
  frameStyleId: FrameStyleId;
  onSelectFrameStyle: (id: FrameStyleId) => void;
  canvasFinishId: CanvasFinishId;
  onSelectCanvasFinish: (id: CanvasFinishId) => void;
  backlightModeId: BacklightModeId;
  onSelectBacklight: (id: BacklightModeId) => void;
  roomLighting: RoomLightingMode;
  onSelectRoomLighting: (mode: RoomLightingMode) => void;
  scaleReference: ScaleReferenceMode;
  onSelectScaleReference: (refMode: ScaleReferenceMode) => void;
  // Mode B
  garmentType: GarmentTypeId;
  onSelectGarmentType: (id: GarmentTypeId) => void;
  garmentCutId: GarmentCutId;
  onSelectGarmentCut: (id: GarmentCutId) => void;
  garmentColorId: GarmentColorId;
  onSelectGarmentColor: (id: GarmentColorId) => void;
  garmentSize: GarmentSizeLabel;
  onSelectGarmentSize: (s: GarmentSizeLabel) => void;
  printPlacement: PrintPlacementId;
  onSelectPrintPlacement: (id: PrintPlacementId) => void;
  printScale: number;
  onChangePrintScale: (val: number) => void;
  printOffsetY: number;
  onChangePrintOffsetY: (val: number) => void;
  onResetPrintTransform: () => void;
  // Pricing & Checkout
  quantity: number;
  onChangeQuantity: (q: number) => void;
  priceSummary: PriceSummary;
  onEnterFullscreenPreview: () => void;
  onOpenCheckout: () => void;
}

export const RightConfiguratorDock: React.FC<RightConfiguratorDockProps> = ({
  lang,
  mode,
  canvasSizeId,
  onSelectCanvasSize,
  canvasOrientation,
  onSelectOrientation,
  customWidthCm,
  customHeightCm,
  onChangeCustomWidth,
  onChangeCustomHeight,
  resolvedDims,
  frameStyleId,
  onSelectFrameStyle,
  canvasFinishId,
  onSelectCanvasFinish,
  backlightModeId,
  onSelectBacklight,
  roomLighting,
  onSelectRoomLighting,
  scaleReference,
  onSelectScaleReference,
  garmentType,
  onSelectGarmentType,
  garmentCutId,
  onSelectGarmentCut,
  garmentColorId,
  onSelectGarmentColor,
  garmentSize,
  onSelectGarmentSize,
  printPlacement,
  onSelectPrintPlacement,
  printScale,
  onChangePrintScale,
  printOffsetY,
  onChangePrintOffsetY,
  onResetPrintTransform,
  quantity,
  onChangeQuantity,
  priceSummary,
  onEnterFullscreenPreview,
  onOpenCheckout,
}) => {
  const t = TRANSLATIONS[lang];
  const cutsForType = GARMENT_CUTS.filter((c) => c.garmentType === garmentType);

  return (
    <aside className="pointer-events-auto fixed right-3 top-[68px] bottom-3 w-[310px] xl:w-[342px] z-20 flex flex-col studio-glass rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-3.5 pb-2.5 border-b border-white/10 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
            {mode === 'canvas' ? t.wallSpecsStep : t.garmentSpecsStep}
          </span>
          <h2 className="font-display font-bold text-sm text-white">
            {mode === 'canvas' ? t.wallSpecsTitle : t.garmentSpecsTitle}
          </h2>
        </div>
        <div className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/35 text-[11px] font-mono font-bold text-amber-300">
          €{priceSummary.grandTotal}
        </div>
      </div>

      {/* Scrollable Config Controls */}
      <div className="flex-1 overflow-y-auto studio-scroll p-3.5 space-y-4">
        {mode === 'canvas' ? (
          <>
            {/* Orientation Switcher (Portrait vs Landscape) */}
            <section>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-stone-200">
                  {t.orientationLabel}
                </span>
                <span className="text-[10px] font-mono text-amber-300">
                  {resolvedDims.label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 bg-stone-950/55 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => onSelectOrientation('portrait')}
                  aria-pressed={canvasOrientation === 'portrait'}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    canvasOrientation === 'portrait'
                      ? 'bg-amber-400 text-stone-950 shadow-sm'
                      : 'text-stone-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <RectangleVertical className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.orientationPortrait}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectOrientation('landscape')}
                  aria-pressed={canvasOrientation === 'landscape'}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    canvasOrientation === 'landscape'
                      ? 'bg-amber-400 text-stone-950 shadow-sm'
                      : 'text-stone-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <RectangleHorizontal className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.orientationLandscape}</span>
                </button>
              </div>
            </section>

            {/* Canvas Dimensions (4 Presets + Custom 20-200 cm) */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-stone-200 flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.canvasDimensionsLabel}</span>
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  {t.cmScaleBadge}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {CANVAS_SIZES.map((sz) => {
                  const active = canvasSizeId === sz.id;
                  const dispLabel =
                    canvasOrientation === 'landscape'
                      ? `${sz.heightCm} × ${sz.widthCm} cm`
                      : sz.label;
                  return (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => onSelectCanvasSize(sz.id)}
                      className={`rounded-xl p-2 text-left transition-all cursor-pointer border ${
                        active
                          ? 'bg-amber-500/20 border-amber-400/70 shadow-sm'
                          : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-white whitespace-nowrap">
                          {dispLabel}
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-amber-300 shrink-0">
                          €{sz.basePrice}
                        </span>
                      </div>
                      <div className="text-[9px] text-stone-400 mt-0.5 truncate">
                        {t.roomRec[sz.id]}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Dimensions Card (20–200 cm) */}
              <button
                type="button"
                onClick={() => onSelectCanvasSize('custom')}
                className={`mt-1.5 w-full rounded-xl px-3 py-2 text-left transition-all cursor-pointer border ${
                  canvasSizeId === 'custom'
                    ? 'bg-amber-500/20 border-amber-400/75 shadow-sm'
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {t.customDimensionsTitle}
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-amber-300">
                    {canvasSizeId === 'custom'
                      ? `€${resolvedDims.basePrice}`
                      : '20–200 cm'}
                  </span>
                </div>
                <div className="text-[9px] text-stone-400 mt-0.5">
                  {t.customDimensionsSub}
                </div>
              </button>

              {canvasSizeId === 'custom' && (
                <div className="mt-2 rounded-2xl bg-stone-950/65 border border-amber-400/35 p-3 space-y-2.5">
                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-stone-300 font-semibold">
                        {t.widthCmLabel} (cm)
                      </span>
                      <input
                        type="number"
                        min={20}
                        max={200}
                        value={customWidthCm}
                        onChange={(e) =>
                          onChangeCustomWidth(
                            Math.min(200, Math.max(20, Number(e.target.value) || 20))
                          )
                        }
                        aria-label={t.widthCmLabel}
                        className="w-16 rounded-lg bg-stone-900 border border-white/15 px-2 py-0.5 text-right font-mono text-[11px] text-amber-300 outline-none focus:border-amber-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={200}
                      step={5}
                      value={customWidthCm}
                      onChange={(e) => onChangeCustomWidth(Number(e.target.value))}
                      aria-label={`${t.widthCmLabel} slider`}
                      className="w-full studio-slider"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-stone-300 font-semibold">
                        {t.heightCmLabel} (cm)
                      </span>
                      <input
                        type="number"
                        min={20}
                        max={200}
                        value={customHeightCm}
                        onChange={(e) =>
                          onChangeCustomHeight(
                            Math.min(200, Math.max(20, Number(e.target.value) || 20))
                          )
                        }
                        aria-label={t.heightCmLabel}
                        className="w-16 rounded-lg bg-stone-900 border border-white/15 px-2 py-0.5 text-right font-mono text-[11px] text-amber-300 outline-none focus:border-amber-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={200}
                      step={5}
                      value={customHeightCm}
                      onChange={(e) => onChangeCustomHeight(Number(e.target.value))}
                      aria-label={`${t.heightCmLabel} slider`}
                      className="w-full studio-slider"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 pt-1 border-t border-white/10">
                    <span>
                      {t.areaLabel}:{' '}
                      <strong className="text-stone-200">
                        {resolvedDims.areaCm2.toLocaleString()} cm²
                      </strong>
                    </span>
                    <span>
                      {t.perimeterLabel}:{' '}
                      <strong className="text-stone-200">
                        {resolvedDims.perimeterCm} cm
                      </strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Scale Reference Toggle */}
              <div className="mt-2 flex items-center gap-1 bg-stone-950/50 p-1 rounded-xl border border-white/10">
                {(
                  [
                    { id: 'interior', label: t.scaleSofa },
                    { id: 'human', label: t.scaleHuman },
                    { id: 'none', label: t.scaleWall },
                  ] as const
                ).map((opt) => {
                  const active = scaleReference === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onSelectScaleReference(opt.id)}
                      className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-white/15 text-white'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {opt.id === 'human' && (
                        <User className="w-3 h-3 text-amber-400 shrink-0" />
                      )}
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 3D Frame Style & Material */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-stone-200">
                  {t.frameArchLabel}
                </span>
                <span className="text-[10px] font-mono text-stone-400">PBR</span>
              </div>
              <div className="space-y-1.5">
                {FRAME_STYLES.map((frame) => {
                  const active = frameStyleId === frame.id;
                  const loc = t.frames[frame.id];
                  const dynamicPrice =
                    frame.price === 0
                      ? 0
                      : Math.round(frame.price * resolvedDims.frameScaleMultiplier);
                  return (
                    <button
                      key={frame.id}
                      type="button"
                      onClick={() => onSelectFrameStyle(frame.id)}
                      className={`w-full rounded-xl px-2.5 py-2 flex items-center justify-between text-left transition-all cursor-pointer border ${
                        active
                          ? 'bg-amber-500/20 border-amber-400/70'
                          : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-5 h-5 rounded-md border border-white/25 shrink-0 shadow-inner"
                          style={{ backgroundColor: frame.swatchHex }}
                        />
                        <div className="min-w-0">
                          <div className="text-[11px] font-semibold text-white truncate">
                            {loc.name}
                          </div>
                          <div className="text-[9px] text-stone-400 truncate">
                            {loc.subtitle}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-amber-300 shrink-0 ml-2 whitespace-nowrap">
                        {dynamicPrice === 0 ? t.included : `+€${dynamicPrice}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Canvas Surface Finish Physics */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-stone-200">
                  {t.canvasFinishLabel}
                </span>
                <span className="text-[10px] font-mono text-stone-400">PBR</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {CANVAS_FINISHES.map((fin) => {
                  const active = canvasFinishId === fin.id;
                  const loc = t.finishes[fin.id];
                  return (
                    <button
                      key={fin.id}
                      type="button"
                      onClick={() => onSelectCanvasFinish(fin.id)}
                      className={`rounded-xl p-2 text-left transition-all cursor-pointer border ${
                        active
                          ? 'bg-amber-500/20 border-amber-400/70'
                          : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-bold text-white leading-tight">
                          {fin.id === 'matte'
                            ? t.finishMatteShort
                            : t.finishGlossShort}
                        </span>
                        <span className="text-[10px] font-mono text-amber-300 whitespace-nowrap shrink-0">
                          {fin.price === 0 ? t.included : `+€${fin.price}`}
                        </span>
                      </div>
                      <div className="text-[9px] text-stone-400 mt-1 leading-snug">
                        {loc.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Backlit Halo LED & Room Spotlight */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-stone-200 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.backlightSectionLabel}</span>
                </span>
                <span className="text-[10px] font-mono text-amber-300">BLOOM</span>
              </div>

              <div className="space-y-1.5">
                {BACKLIGHT_OPTIONS.map((led) => {
                  const active = backlightModeId === led.id;
                  const loc = t.backlights[led.id];
                  return (
                    <button
                      key={led.id}
                      type="button"
                      onClick={() => onSelectBacklight(led.id)}
                      className={`w-full rounded-xl px-2.5 py-1.5 flex items-center justify-between text-left transition-all cursor-pointer border ${
                        active
                          ? 'bg-amber-500/20 border-amber-400/70'
                          : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-4 h-4 rounded-full border border-white/30 shrink-0"
                          style={{ background: led.swatchGradient }}
                        />
                        <div className="min-w-0">
                          <div className="text-[11px] font-semibold text-white truncate">
                            {loc.name}
                          </div>
                          <div className="text-[9px] text-stone-400 truncate">
                            {loc.subtitle}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-amber-300 shrink-0 ml-2 whitespace-nowrap">
                        {led.price === 0 ? '€0' : `+€${led.price}`}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => onSelectRoomLighting('daylight')}
                  className={`py-1.5 px-2 rounded-xl text-[10px] font-semibold border transition-all cursor-pointer ${
                    roomLighting === 'daylight'
                      ? 'bg-white/20 border-white/40 text-white'
                      : 'bg-white/[0.03] border-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  {t.daylightGalleryBtn}
                </button>
                <button
                  type="button"
                  onClick={() => onSelectRoomLighting('spotlight-night')}
                  className={`py-1.5 px-2 rounded-xl text-[10px] font-semibold border transition-all cursor-pointer ${
                    roomLighting === 'spotlight-night'
                      ? 'bg-amber-500/25 border-amber-400/60 text-amber-200'
                      : 'bg-white/[0.03] border-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  {t.nightSpotlightBtn}
                </button>
              </div>
            </section>
          </>
        ) : (
          <>
            {/* MODE B: 3D Garment Category */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-stone-200 flex items-center gap-1.5">
                  <Shirt className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.garmentModelLabel}</span>
                </span>
                <span className="text-[10px] font-mono text-stone-400">ATELIER</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {GARMENT_TYPES.map((g) => {
                  const active = garmentType === g.id;
                  const loc = t.garmentTypes[g.id];
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => onSelectGarmentType(g.id)}
                      className={`rounded-xl p-2.5 text-left transition-all cursor-pointer border ${
                        active
                          ? 'bg-amber-500/20 border-amber-400/70 shadow-sm'
                          : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-[11px] font-bold text-white leading-tight">
                          {loc.name}
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-amber-300 shrink-0 whitespace-nowrap">
                          €{g.basePrice}
                        </span>
                      </div>
                      <div className="text-[9px] text-stone-300 mt-1">{loc.subtitle}</div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Garment Fit / Cut Selector */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-stone-200 flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.garmentCutLabel}</span>
                </span>
                <span className="text-[10px] font-mono text-amber-300">3D CUT</span>
              </div>
              <div className="space-y-1.5">
                {cutsForType.map((cut) => {
                  const active = garmentCutId === cut.id;
                  const loc = t.garmentCuts[cut.id];
                  return (
                    <button
                      key={cut.id}
                      type="button"
                      onClick={() => onSelectGarmentCut(cut.id)}
                      className={`w-full rounded-xl px-2.5 py-2 flex items-center justify-between text-left transition-all cursor-pointer border ${
                        active
                          ? 'bg-amber-500/20 border-amber-400/70'
                          : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07]'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-[11px] font-semibold text-white truncate">
                          {loc.name}
                        </div>
                        <div className="text-[9px] text-stone-400 truncate">
                          {loc.subtitle}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-amber-300 shrink-0 whitespace-nowrap">
                        {cut.priceDelta === 0
                          ? t.included
                          : cut.priceDelta > 0
                          ? `+€${cut.priceDelta}`
                          : `-€${Math.abs(cut.priceDelta)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Garment Color Palette + Apparel Size */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-stone-200">
                  {t.fabricColorLabel}
                </span>
                <span className="text-[10px] font-mono text-amber-300">
                  {t.garmentColors[garmentColorId]}
                </span>
              </div>
              <div className="flex items-center justify-between gap-1.5 bg-white/[0.03] border border-white/10 rounded-2xl p-2">
                {GARMENT_COLORS.map((col) => {
                  const active = garmentColorId === col.id;
                  const colName = t.garmentColors[col.id];
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => onSelectGarmentColor(col.id)}
                      title={colName}
                      aria-label={colName}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border-2 ${
                        active
                          ? 'border-amber-400 scale-110 shadow-lg shadow-amber-500/30'
                          : 'border-white/20 hover:scale-105'
                      }`}
                      style={{ backgroundColor: col.hex }}
                    >
                      {active && (
                        <Check
                          className={`w-3.5 h-3.5 stroke-[3] ${
                            col.id === 'optic-white' || col.id === 'sand-beige'
                              ? 'text-stone-900'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 flex items-center gap-1">
                {GARMENT_SIZES.map((sz) => {
                  const active = garmentSize === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => onSelectGarmentSize(sz)}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                        active
                          ? 'bg-amber-400 text-stone-950 border-amber-300'
                          : 'bg-white/[0.03] text-stone-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Interactive Print Placement Presets */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-stone-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.printPlacementLabel}</span>
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  {t.autoCamBadge}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {PRINT_PLACEMENTS.map((place) => {
                  const active = printPlacement === place.id;
                  const loc = t.placements[place.id];
                  return (
                    <button
                      key={place.id}
                      type="button"
                      onClick={() => onSelectPrintPlacement(place.id)}
                      className={`rounded-xl p-2 text-left transition-all cursor-pointer border ${
                        active
                          ? 'bg-amber-500/20 border-amber-400/70'
                          : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-bold text-white leading-tight">
                          {loc.name}
                        </span>
                        <span className="text-[10px] font-mono text-amber-300 whitespace-nowrap shrink-0">
                          +€{place.price}
                        </span>
                      </div>
                      <div className="text-[9px] text-stone-400 mt-0.5 leading-snug">
                        {loc.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Scale & Vertical Offset Sliders */}
            <section className="rounded-2xl bg-white/[0.04] border border-white/10 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-stone-200">
                  {t.fineTunePrintLabel}
                </span>
                <button
                  type="button"
                  onClick={onResetPrintTransform}
                  className="text-[10px] font-mono text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t.resetBtn}</span>
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-stone-300">{t.printScaleLabel}</span>
                  <span className="font-mono text-amber-300">
                    {Math.round(printScale * 100)}%
                    {printScale > 1.2 ? ' (+€6 XL)' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={1.5}
                  step={0.05}
                  value={printScale}
                  onChange={(e) => onChangePrintScale(parseFloat(e.target.value))}
                  aria-label={t.printScaleLabel}
                  className="w-full studio-slider"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-stone-300">{t.verticalOffsetLabel}</span>
                  <span className="font-mono text-amber-300">
                    {printOffsetY > 0 ? `+${printOffsetY}` : printOffsetY} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={-15}
                  max={15}
                  step={1}
                  value={printOffsetY}
                  onChange={(e) => onChangePrintOffsetY(parseInt(e.target.value, 10))}
                  aria-label={t.verticalOffsetLabel}
                  className="w-full studio-slider"
                />
              </div>
            </section>
          </>
        )}

        {/* Live Itemized Price Breakdown */}
        <section className="rounded-2xl bg-stone-950/65 border border-white/10 p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
              {t.livePriceBreakdown}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onChangeQuantity(Math.max(1, quantity - 1))}
                className="w-5 h-5 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-mono font-bold text-white w-4 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => onChangeQuantity(Math.min(10, quantity + 1))}
                className="w-5 h-5 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            {priceSummary.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <span className="text-stone-300 truncate pr-2">{item.label}</span>
                <span className="font-mono text-stone-200 shrink-0">
                  {item.amount === 0
                    ? '€0'
                    : item.amount < 0
                    ? `-€${Math.abs(item.amount)}`
                    : `€${item.amount}`}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-baseline justify-between">
            <span className="text-xs font-semibold text-stone-300">
              {t.totalLabel} ({quantity}{' '}
              {quantity === 1 ? t.pieceSingular : t.piecePlural})
            </span>
            <span className="font-display font-extrabold text-xl text-amber-400">
              €{priceSummary.grandTotal}
            </span>
          </div>
        </section>
      </div>

      {/* Bottom Action Buttons */}
      <div className="p-3 border-t border-white/10 bg-stone-950/60 flex items-center gap-2">
        <button
          type="button"
          onClick={onEnterFullscreenPreview}
          className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
          title={t.preview3D}
        >
          <Expand className="w-3.5 h-3.5 text-sky-400" />
          <span>{t.previewBtn}</span>
        </button>

        <button
          type="button"
          onClick={onOpenCheckout}
          className="flex-1 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>
            {t.sendToOrderBtn} · €{priceSummary.grandTotal}
          </span>
        </button>
      </div>
    </aside>
  );
};
