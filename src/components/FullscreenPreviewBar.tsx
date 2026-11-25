import React from 'react';
import {
  Camera,
  Minimize2,
  RotateCw,
  ShoppingBag,
} from 'lucide-react';
import type { CameraAnglePreset, StudioMode } from '../types/studio';

interface FullscreenPreviewBarProps {
  mode: StudioMode;
  cameraAngle: CameraAnglePreset;
  onSelectCameraAngle: (angle: CameraAnglePreset) => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  onSaveSnapshot: () => void;
  snapshotToast: string | null;
  onExitPreview: () => void;
  onOpenCheckout: () => void;
  grandTotal: number;
}

export const FullscreenPreviewBar: React.FC<FullscreenPreviewBarProps> = ({
  mode,
  cameraAngle,
  onSelectCameraAngle,
  autoRotate,
  onToggleAutoRotate,
  onSaveSnapshot,
  snapshotToast,
  onExitPreview,
  onOpenCheckout,
  grandTotal,
}) => {
  const angles: { id: CameraAnglePreset; label: string }[] =
    mode === 'canvas'
      ? [
          { id: 'front', label: 'Front Gallery' },
          { id: 'angle45', label: '45° Perspective' },
          { id: 'macro', label: 'Macro Weave' },
        ]
      : [
          { id: 'front', label: 'Front Chest' },
          { id: 'angle45', label: '45° Studio' },
          { id: 'rear', label: 'Rear View' },
          { id: 'sleeve', label: 'Sleeve View' },
          { id: 'macro', label: 'Fabric Macro' },
        ];

  return (
    <>
      {snapshotToast && (
        <div className="pointer-events-none fixed top-20 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full studio-glass-elevated border border-emerald-400/50 text-xs font-semibold text-emerald-300 shadow-2xl">
          {snapshotToast}
        </div>
      )}

      <div className="pointer-events-none fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[94vw] max-w-4xl flex justify-center">
        <div className="pointer-events-auto studio-glass-elevated rounded-2xl p-1.5 flex flex-wrap items-center justify-center gap-1.5">
          {/* Camera Angle Presets */}
          <div className="flex items-center gap-1 pr-1.5 border-r border-white/15">
            {angles.map((a) => {
              const active = cameraAngle === a.id && !autoRotate;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => onSelectCameraAngle(a.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'text-stone-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {a.label}
                </button>
              );
            })}
          </div>

          {/* 360 Auto-Spin */}
          <button
            type="button"
            onClick={onToggleAutoRotate}
            aria-pressed={autoRotate}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              autoRotate
                ? 'bg-sky-500/25 text-sky-200 border border-sky-400/40'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>360° Orbit</span>
          </button>

          {/* Snapshot / Save Preview Card */}
          <button
            type="button"
            onClick={onSaveSnapshot}
            className="px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>Save Preview Card</span>
          </button>

          {/* Exit Preview */}
          <button
            type="button"
            onClick={onExitPreview}
            className="px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-stone-800/80 hover:bg-stone-700 text-stone-200 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Exit Preview</span>
          </button>

          {/* Proceed to Order */}
          <button
            type="button"
            onClick={onOpenCheckout}
            className="px-3.5 py-1.5 rounded-xl text-[11px] font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 flex items-center gap-1.5 shadow-md shadow-amber-500/25 transition-all cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order · €{grandTotal}</span>
          </button>
        </div>
      </div>
    </>
  );
};
