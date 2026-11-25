import React, { useEffect, useState } from 'react';
import { Frame } from 'lucide-react';
import { TRANSLATIONS } from '../data/i18n';
import type { LanguageCode } from '../types/studio';

interface StudioPreloaderProps {
  sceneReady: boolean;
  lang: LanguageCode;
}

export const StudioPreloader: React.FC<StudioPreloaderProps> = ({
  sceneReady,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [progress, setProgress] = useState(8);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sceneReady) {
      setProgress(100);
      const timer = setTimeout(() => setDismissed(true), 420);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return Math.min(90, prev + Math.ceil((92 - prev) * 0.16));
      });
    }, 65);

    return () => clearInterval(interval);
  }, [sceneReady]);

  if (dismissed) return null;

  const stageIdx =
    progress < 30 ? 0 : progress < 60 ? 1 : progress < 90 ? 2 : 3;

  return (
    <div
      className={`fixed inset-0 z-[60] bg-stone-950/95 backdrop-blur-2xl flex items-center justify-center transition-opacity duration-500 ${
        progress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-[90vw] max-w-md studio-glass-elevated rounded-3xl p-7 text-center space-y-5 border border-amber-400/25">
        {/* Animated Atelier Emblem */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/30 relative">
          <Frame className="w-8 h-8 text-stone-950" />
          <div className="absolute -inset-2 rounded-3xl border border-amber-400/35 animate-pulse" />
        </div>

        <div>
          <h1 className="font-serif font-bold text-2xl tracking-wider text-white">
            ATELIER LUMIÈRE
          </h1>
          <p className="text-xs text-stone-400 mt-1">{t.preloaderSubtitle}</p>
        </div>

        {/* Real-time Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-stone-300 truncate pr-3">
              {t.preloaderStages[stageIdx]}
            </span>
            <span className="text-amber-400 font-bold shrink-0">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
