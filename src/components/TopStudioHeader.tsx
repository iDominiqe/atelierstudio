import React from 'react';
import {
  Expand,
  Frame,
  Moon,
  Shirt,
  ShoppingBag,
  Sun,
  Upload,
} from 'lucide-react';
import type { RoomLightingMode, StudioMode } from '../types/studio';

interface TopStudioHeaderProps {
  mode: StudioMode;
  onChangeMode: (mode: StudioMode) => void;
  roomLighting: RoomLightingMode;
  onToggleRoomLighting: () => void;
  onTriggerUpload: () => void;
  onEnterFullscreenPreview: () => void;
  onOpenCheckout: () => void;
  grandTotal: number;
}

export const TopStudioHeader: React.FC<TopStudioHeaderProps> = ({
  mode,
  onChangeMode,
  roomLighting,
  onToggleRoomLighting,
  onTriggerUpload,
  onEnterFullscreenPreview,
  onOpenCheckout,
  grandTotal,
}) => {
  const isNight = roomLighting === 'spotlight-night';

  return (
    <header className="pointer-events-none fixed top-0 left-0 right-0 z-30 p-3 lg:px-4 lg:py-3 flex flex-wrap lg:flex-nowrap items-center justify-between gap-2">
      {/* Brand Pill */}
      <div className="pointer-events-auto studio-glass rounded-2xl px-3 py-1.5 flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
          <Frame className="w-4 h-4 text-stone-950" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold tracking-wide text-sm md:text-base text-white whitespace-nowrap">
              ATELIER LUMIÈRE
            </span>
            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30 whitespace-nowrap">
              3D STUDIO
            </span>
          </div>
          <p className="text-[10px] text-stone-400 hidden 2xl:block whitespace-nowrap">
            Bespoke Fine-Art Portraits &amp; Custom Apparel
          </p>
        </div>
      </div>

      {/* Dual Studio Mode Switcher */}
      <nav
        aria-label="Studio Mode Switcher"
        className="pointer-events-auto studio-glass rounded-2xl p-1 flex items-center gap-1 shrink-0"
      >
        <button
          type="button"
          onClick={() => onChangeMode('canvas')}
          aria-pressed={mode === 'canvas'}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            mode === 'canvas'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 shadow-md shadow-amber-500/25'
              : 'text-stone-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Frame className="w-3.5 h-3.5" />
          <span>Custom Canvas Portraits</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeMode('apparel')}
          aria-pressed={mode === 'apparel'}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            mode === 'apparel'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 shadow-md shadow-amber-500/25'
              : 'text-stone-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Shirt className="w-3.5 h-3.5" />
          <span>Custom Apparel</span>
        </button>
      </nav>

      {/* Right Studio Actions */}
      <div className="pointer-events-auto studio-glass rounded-2xl p-1 flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onTriggerUpload}
          className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-stone-200 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
          title="Upload Your Photo / Logo"
        >
          <Upload className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden xl:inline">Upload Photo</span>
        </button>

        <button
          type="button"
          onClick={onToggleRoomLighting}
          aria-pressed={isNight}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            isNight
              ? 'bg-amber-500/20 text-amber-200 border border-amber-400/35'
              : 'text-stone-200 hover:text-white hover:bg-white/10'
          }`}
          title="Toggle Daylight Studio vs Night Museum Spotlight"
        >
          {isNight ? (
            <Moon className="w-3.5 h-3.5 text-amber-300" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span className="hidden md:inline">
            {isNight ? 'Night Spotlight' : 'Daylight Studio'}
          </span>
        </button>

        <button
          type="button"
          onClick={onEnterFullscreenPreview}
          className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-stone-200 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
          title="Generate Fullscreen 360° Preview"
        >
          <Expand className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden xl:inline">3D Preview</span>
        </button>

        <button
          type="button"
          onClick={onOpenCheckout}
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 shadow-md shadow-amber-500/25 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Order Now · €{grandTotal}</span>
        </button>
      </div>
    </header>
  );
};
