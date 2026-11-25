import React from 'react';
import {
  Check,
  Expand,
  Lightbulb,
  Minus,
  Plus,
  RotateCcw,
  Ruler,
  Shirt,
  ShoppingBag,
  Sparkles,
  User,
} from 'lucide-react';
import {
  BACKLIGHT_OPTIONS,
  CANVAS_FINISHES,
  CANVAS_SIZES,
  FRAME_STYLES,
  GARMENT_COLORS,
  GARMENT_SIZES,
  GARMENT_TYPES,
  PRINT_PLACEMENTS,
  type GarmentSizeLabel,
} from '../data/studioCatalog';
import type {
  BacklightModeId,
  CanvasFinishId,
  CanvasSizeId,
  FrameStyleId,
  GarmentColorId,
  GarmentTypeId,
  PriceSummary,
  PrintPlacementId,
  RoomLightingMode,
  ScaleReferenceMode,
  StudioMode,
} from '../types/studio';

interface RightConfiguratorDockProps {
  mode: StudioMode;
  // Mode A
  canvasSizeId: CanvasSizeId;
  onSelectCanvasSize: (id: CanvasSizeId) => void;
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
  mode,
  canvasSizeId,
  onSelectCanvasSize,
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
  return (
    <aside className="pointer-events-auto fixed right-3 top-[68px] bottom-3 w-[310px] xl:w-[336px] z-20 flex flex-col studio-glass rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-3.5 pb-2.5 border-b border-white/10 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
            {mode === 'canvas' ? '02 · Wall Art Specs' : '02 · Garment Specs'}
          </span>
          <h2 className="font-display font-bold text-sm text-white">
            {mode === 'canvas'
              ? 'Canvas, Frame & Lighting'
              : 'Apparel, Color & Print'}
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
            {/* Canvas Size Selector */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-stone-200 flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-amber-400" />
                  <span>Canvas Dimensions</span>
                </span>
                <span className="text-[10px] font-mono text-stone-400">CM SCALE</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {CANVAS_SIZES.map((sz) => {
                  const active = canvasSizeId === sz.id;
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
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">
                          {sz.label}
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-amber-300">
                          €{sz.basePrice}
                        </span>
                      </div>
                      <div className="text-[9px] text-stone-400 mt-0.5 truncate">
                        {sz.recommendedRoom}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Scale Reference Toggle */}
              <div className="mt-2 flex items-center gap-1 bg-stone-950/50 p-1 rounded-xl border border-white/10">
                {(
                  [
                    { id: 'interior', label: 'Sofa' },
                    { id: 'human', label: '175cm' },
                    { id: 'none', label: 'Wall Only' },
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
                      {opt.id === 'human' && <User className="w-3 h-3 text-amber-400" />}
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
                  3D Frame Architecture
                </span>
                <span className="text-[10px] font-mono text-stone-400">PBR</span>
              </div>
              <div className="space-y-1.5">
                {FRAME_STYLES.map((frame) => {
                  const active = frameStyleId === frame.id;
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
                            {frame.name}
                          </div>
                          <div className="text-[9px] text-stone-400 truncate">
                            {frame.subtitle}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-amber-300 shrink-0 ml-2">
                        {frame.price === 0 ? 'Incl.' : `+€${frame.price}`}
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
                  Canvas Surface Finish
                </span>
                <span className="text-[10px] font-mono text-stone-400">PHYSICS</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {CANVAS_FINISHES.map((fin) => {
                  const active = canvasFinishId === fin.id;
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
                          {fin.id === 'matte' ? 'Matte Fine-Art' : 'Satin / Gloss'}
                        </span>
                        <span className="text-[10px] font-mono text-amber-300">
                          {fin.price === 0 ? 'Incl.' : `+€${fin.price}`}
                        </span>
                      </div>
                      <div className="text-[9px] text-stone-400 mt-1 leading-snug">
                        {fin.subtitle}
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
                  <span>Backlit Halo LED &amp; Room</span>
                </span>
                <span className="text-[10px] font-mono text-amber-300">BLOOM</span>
              </div>

              <div className="space-y-1.5">
                {BACKLIGHT_OPTIONS.map((led) => {
                  const active = backlightModeId === led.id;
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
                            {led.name}
                          </div>
                          <div className="text-[9px] text-stone-400 truncate">
                            {led.subtitle}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-amber-300 shrink-0 ml-2">
                        {led.price === 0 ? '€0' : `+€${led.price}`}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Daylight vs Museum Night Spotlight toggle */}
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
                  Daylight Gallery
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
                  Night Spotlight
                </button>
              </div>
            </section>
          </>
        ) : (
          <>
            {/* MODE B: 3D Garment Selector (T-Shirt vs Pullover Hoodie / Батник) */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-stone-200 flex items-center gap-1.5">
                  <Shirt className="w-3.5 h-3.5 text-amber-400" />
                  <span>3D Garment Model</span>
                </span>
                <span className="text-[10px] font-mono text-stone-400">ATELIER FIT</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {GARMENT_TYPES.map((g) => {
                  const active = garmentType === g.id;
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
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{g.name}</span>
                        <span className="text-[11px] font-mono font-semibold text-amber-300">
                          €{g.basePrice}
                        </span>
                      </div>
                      <div className="text-[9px] text-stone-300 mt-0.5">{g.subtitle}</div>
                      <div className="text-[9px] font-mono text-stone-400 mt-0.5">
                        {g.gsm}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Garment Color Palette + Apparel Size */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-stone-200">
                  Fabric Colorway
                </span>
                <span className="text-[10px] font-mono text-amber-300">
                  {GARMENT_COLORS.find((c) => c.id === garmentColorId)?.name}
                </span>
              </div>
              <div className="flex items-center justify-between gap-1.5 bg-white/[0.03] border border-white/10 rounded-2xl p-2">
                {GARMENT_COLORS.map((col) => {
                  const active = garmentColorId === col.id;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => onSelectGarmentColor(col.id)}
                      title={col.name}
                      aria-label={col.name}
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

              {/* Clothing Size S-XXL */}
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
                  <span>Print / Logo Placement</span>
                </span>
                <span className="text-[10px] font-mono text-stone-400">AUTO-CAM</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {PRINT_PLACEMENTS.map((place) => {
                  const active = printPlacement === place.id;
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
                          {place.name}
                        </span>
                        <span className="text-[10px] font-mono text-amber-300 whitespace-nowrap shrink-0">
                          +€{place.price}
                        </span>
                      </div>
                      <div className="text-[9px] text-stone-400 mt-0.5 leading-snug">
                        {place.subtitle}
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
                  Fine-Tune Print Geometry
                </span>
                <button
                  type="button"
                  onClick={onResetPrintTransform}
                  className="text-[10px] font-mono text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-stone-300">Print Scale</span>
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
                  aria-label="Print Scale"
                  className="w-full studio-slider"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-stone-300">Vertical Offset</span>
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
                  aria-label="Vertical Offset"
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
              Live Price Breakdown
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
                  {item.amount === 0 ? '€0' : `€${item.amount}`}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-baseline justify-between">
            <span className="text-xs font-semibold text-stone-300">
              Total ({quantity} {quantity === 1 ? 'piece' : 'pieces'})
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
          title="Fullscreen 360° Preview"
        >
          <Expand className="w-3.5 h-3.5 text-sky-400" />
          <span>Preview</span>
        </button>

        <button
          type="button"
          onClick={onOpenCheckout}
          className="flex-1 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Send to Order · €{priceSummary.grandTotal}</span>
        </button>
      </div>
    </aside>
  );
};
