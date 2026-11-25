import React, { useMemo } from 'react';
import {
  Check,
  ImagePlus,
  Sparkles,
  Type,
  X,
} from 'lucide-react';
import { TRANSLATIONS } from '../data/i18n';
import { ARTWORK_PRESETS, ART_FILTERS } from '../data/studioCatalog';
import { getPresetThumbnailUrl } from '../scene/proceduralTextures';
import type { ArtFilterId, LanguageCode, TextureFitMode } from '../types/studio';

interface LeftArtworkDockProps {
  lang: LanguageCode;
  selectedPresetId: string;
  onSelectPreset: (id: string) => void;
  uploadedImageName: string | null;
  uploadedPreviewUrl: string | null;
  onTriggerUpload: () => void;
  onClearUpload: () => void;
  textureFitMode: TextureFitMode;
  onChangeTextureFit: (fit: TextureFitMode) => void;
  artFilterId: ArtFilterId;
  onSelectFilter: (id: ArtFilterId) => void;
  customCaption: string;
  onChangeCaption: (val: string) => void;
}

export const LeftArtworkDock: React.FC<LeftArtworkDockProps> = ({
  lang,
  selectedPresetId,
  onSelectPreset,
  uploadedImageName,
  uploadedPreviewUrl,
  onTriggerUpload,
  onClearUpload,
  textureFitMode,
  onChangeTextureFit,
  artFilterId,
  onSelectFilter,
  customCaption,
  onChangeCaption,
}) => {
  const t = TRANSLATIONS[lang];

  const presetThumbs = useMemo(() => {
    const map: Record<string, string> = {};
    for (const p of ARTWORK_PRESETS) {
      map[p.id] = getPresetThumbnailUrl(p.id);
    }
    return map;
  }, []);

  return (
    <aside className="pointer-events-auto fixed left-3 top-[68px] bottom-3 w-[272px] xl:w-[292px] z-20 flex flex-col studio-glass rounded-3xl overflow-hidden">
      <div className="px-4 pt-3.5 pb-2.5 border-b border-white/10 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
            {t.artworkStep}
          </span>
          <h2 className="font-display font-bold text-sm text-white">
            {t.artworkTitle}
          </h2>
        </div>
        <Sparkles className="w-4 h-4 text-amber-400/80" />
      </div>

      <div className="flex-1 overflow-y-auto studio-scroll p-3.5 space-y-4">
        {/* Upload Your Photo / Logo */}
        <div>
          <button
            type="button"
            onClick={onTriggerUpload}
            className="w-full rounded-2xl border border-dashed border-amber-400/45 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-3 flex items-center gap-3 transition-all cursor-pointer text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ImagePlus className="w-4 h-4 text-amber-300" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white">
                {t.uploadTitle}
              </div>
              <div className="text-[10px] text-stone-400 truncate">
                {t.uploadHint}
              </div>
            </div>
          </button>

          {uploadedImageName && uploadedPreviewUrl && (
            <div className="mt-2 p-2 rounded-xl bg-emerald-500/15 border border-emerald-400/35 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={uploadedPreviewUrl}
                  alt={uploadedImageName}
                  className="w-8 h-8 rounded-lg object-cover border border-white/20 shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-emerald-200 truncate">
                    {uploadedImageName}
                  </div>
                  <div className="text-[9px] text-emerald-300/80 font-mono">
                    {t.customTextureActive}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onClearUpload}
                className="p-1 rounded-lg hover:bg-white/15 text-stone-300 hover:text-white cursor-pointer"
                title={t.removeUploadTitle}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Cover vs Contain Texture Fit Toggle */}
          <div className="mt-2 rounded-xl bg-stone-950/50 p-1.5 border border-white/10 space-y-1">
            <div className="text-[9px] font-mono text-stone-400 px-1">
              {t.textureFitLabel}
            </div>
            <div className="grid grid-cols-2 gap-1">
              {(['cover', 'contain'] as const).map((fit) => {
                const active = textureFitMode === fit;
                return (
                  <button
                    key={fit}
                    type="button"
                    onClick={() => onChangeTextureFit(fit)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer truncate ${
                      active
                        ? 'bg-white/20 text-white'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                    }`}
                  >
                    {fit === 'cover' ? t.fitCover : t.fitContain}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5 Preloaded High-Res Presets */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-stone-300">
              {t.curatedPresets}
            </span>
            <span className="text-[10px] font-mono text-stone-400">5 HD</span>
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {ARTWORK_PRESETS.map((preset) => {
              const active = !uploadedImageName && selectedPresetId === preset.id;
              const loc = t.presets[preset.id];
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onSelectPreset(preset.id)}
                  className={`w-full rounded-xl p-1.5 flex items-center gap-2.5 text-left transition-all cursor-pointer border ${
                    active
                      ? 'bg-amber-500/20 border-amber-400/60 shadow-sm'
                      : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.08] hover:border-white/15'
                  }`}
                >
                  <img
                    src={presetThumbs[preset.id]}
                    alt={loc.title}
                    className="w-10 h-12 rounded-lg object-cover shrink-0 border border-white/15"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-white truncate">
                      {loc.title}
                    </div>
                    <div className="text-[10px] text-stone-400 truncate">
                      {loc.artistTag}
                    </div>
                    <span className="inline-block mt-0.5 text-[9px] font-mono uppercase tracking-wider text-amber-300/90">
                      {loc.category}
                    </span>
                  </div>
                  {active && (
                    <div className="w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 mr-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Artistic Style Filter */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-stone-300">
              {t.artStyleLabel}
            </span>
            <span className="text-[10px] font-mono text-amber-300">{t.liveFx}</span>
          </div>
          <div className="space-y-1">
            {ART_FILTERS.map((filter) => {
              const active = artFilterId === filter.id;
              const loc = t.filters[filter.id];
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => onSelectFilter(filter.id)}
                  className={`w-full rounded-xl px-2.5 py-2 flex items-center justify-between text-left transition-all cursor-pointer border ${
                    active
                      ? 'bg-white/15 border-amber-400/60'
                      : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: filter.accentHex }}
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
                  <span className="text-[10px] font-mono font-semibold text-amber-300 shrink-0 ml-1 whitespace-nowrap">
                    {filter.price === 0 ? t.included : `+€${filter.price}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Atelier Typography Signature */}
        <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="custom-caption-input"
              className="text-[11px] font-semibold text-stone-200 flex items-center gap-1.5"
            >
              <Type className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.customSignatureLabel}</span>
            </label>
            <span className="text-[10px] font-mono text-amber-300">+€5</span>
          </div>
          <input
            id="custom-caption-input"
            type="text"
            maxLength={32}
            value={customCaption}
            onChange={(e) => onChangeCaption(e.target.value)}
            placeholder={t.customSignaturePlaceholder}
            className="w-full rounded-xl bg-stone-950/70 border border-white/10 focus:border-amber-400/60 outline-none px-2.5 py-1.5 text-xs text-white placeholder:text-stone-500"
          />
          <p className="text-[9px] text-stone-400 mt-1">
            {t.customSignatureHint}
          </p>
        </div>
      </div>
    </aside>
  );
};
