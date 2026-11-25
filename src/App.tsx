import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, RotateCw } from 'lucide-react';
import { FullscreenPreviewBar } from './components/FullscreenPreviewBar';
import { LeftArtworkDock } from './components/LeftArtworkDock';
import { OrderCheckoutDrawer } from './components/OrderCheckoutDrawer';
import { RightConfiguratorDock } from './components/RightConfiguratorDock';
import { StudioPreloader } from './components/StudioPreloader';
import { TopStudioHeader } from './components/TopStudioHeader';
import { TRANSLATIONS } from './data/i18n';
import {
  ARTWORK_PRESETS,
  GARMENT_CUTS,
  PRINT_PLACEMENTS,
  calculatePriceSummary,
  resolveCanvasDimensions,
  type GarmentSizeLabel,
} from './data/studioCatalog';
import { StudioCanvas } from './scene/StudioCanvas';
import { renderCompositedArtworkCanvas } from './scene/proceduralTextures';
import type {
  ArtFilterId,
  BacklightModeId,
  CameraAnglePreset,
  CanvasFinishId,
  CanvasOrientation,
  CanvasSizeId,
  FrameStyleId,
  GarmentColorId,
  GarmentCutId,
  GarmentTypeId,
  LanguageCode,
  PrintPlacementId,
  RoomLightingMode,
  ScaleReferenceMode,
  StudioMode,
  TextureFitMode,
} from './types/studio';

export function App() {
  // Language & Preloader
  const [lang, setLang] = useState<LanguageCode>('en');
  const [sceneReady, setSceneReady] = useState(false);

  // Studio Mode
  const [mode, setMode] = useState<StudioMode>('canvas');
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);

  // Artwork & Upload State
  const [selectedPresetId, setSelectedPresetId] = useState<string>(ARTWORK_PRESETS[0].id);
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(null);
  const [textureFitMode, setTextureFitMode] = useState<TextureFitMode>('cover');
  const [artFilterId, setArtFilterId] = useState<ArtFilterId>('original');
  const [customCaption, setCustomCaption] = useState<string>('');
  const [isDragActive, setIsDragActive] = useState(false);

  // Mode A: Canvas & Frame State
  const [canvasSizeId, setCanvasSizeId] = useState<CanvasSizeId>('70x100');
  const [canvasOrientation, setCanvasOrientation] =
    useState<CanvasOrientation>('portrait');
  const [customWidthCm, setCustomWidthCm] = useState<number>(80);
  const [customHeightCm, setCustomHeightCm] = useState<number>(110);
  const [frameStyleId, setFrameStyleId] = useState<FrameStyleId>('brushed-gold');
  const [canvasFinishId, setCanvasFinishId] = useState<CanvasFinishId>('matte');
  const [backlightModeId, setBacklightModeId] = useState<BacklightModeId>('warm-white');
  const [roomLighting, setRoomLighting] = useState<RoomLightingMode>('daylight');
  const [scaleReference, setScaleReference] = useState<ScaleReferenceMode>('interior');

  // Mode B: Apparel State
  const [garmentType, setGarmentType] = useState<GarmentTypeId>('hoodie');
  const [garmentCutId, setGarmentCutId] = useState<GarmentCutId>('classic-hoodie');
  const [garmentColorId, setGarmentColorId] = useState<GarmentColorId>('jet-black');
  const [garmentSize, setGarmentSize] = useState<GarmentSizeLabel>('L');
  const [printPlacement, setPrintPlacement] = useState<PrintPlacementId>('center-chest');
  const [printScale, setPrintScale] = useState<number>(1.0);
  const [printOffsetY, setPrintOffsetY] = useState<number>(0);

  // Camera & Preview
  const [cameraAngle, setCameraAngle] = useState<CameraAnglePreset>('front');
  const [cameraNonce, setCameraNonce] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [snapshotToast, setSnapshotToast] = useState<string | null>(null);

  // Checkout Drawer
  const [quantity, setQuantity] = useState(1);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutSnapshotUrl, setCheckoutSnapshotUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const captureSnapshotFnRef = useRef<(() => string) | null>(null);

  const t = TRANSLATIONS[lang];

  // Resolved real-time 3D + CM dimensions
  const resolvedDims = useMemo(
    () =>
      resolveCanvasDimensions(
        canvasSizeId,
        canvasOrientation,
        customWidthCm,
        customHeightCm
      ),
    [canvasSizeId, canvasOrientation, customWidthCm, customHeightCm]
  );

  // Aspect ratio passed to compositor (Portrait/Landscape/Custom for Canvas; 3:4 for Apparel)
  const targetArtworkAspect = mode === 'canvas' ? resolvedDims.aspectRatio : 0.75;

  // Build & cache live Three.js artwork texture
  const artworkTexture = useMemo(() => {
    const offscreen = renderCompositedArtworkCanvas({
      presetId: selectedPresetId,
      uploadedImage,
      filterId: artFilterId,
      customCaption,
      targetAspect: targetArtworkAspect,
      fitMode: textureFitMode,
    });
    const tex = new THREE.CanvasTexture(offscreen);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.needsUpdate = true;
    return tex;
  }, [
    selectedPresetId,
    uploadedImage,
    artFilterId,
    customCaption,
    targetArtworkAspect,
    textureFitMode,
  ]);

  useEffect(() => {
    return () => {
      artworkTexture.dispose();
    };
  }, [artworkTexture]);

  useEffect(() => {
    return () => {
      if (uploadedPreviewUrl) {
        URL.revokeObjectURL(uploadedPreviewUrl);
      }
    };
  }, [uploadedPreviewUrl]);

  // Price Calculation
  const priceSummary = useMemo(
    () =>
      calculatePriceSummary({
        lang,
        mode,
        canvasSizeId,
        canvasOrientation,
        customWidthCm,
        customHeightCm,
        frameStyleId,
        canvasFinishId,
        artFilterId,
        backlightModeId,
        garmentTypeId: garmentType,
        garmentCutId,
        printPlacementId: printPlacement,
        printScale,
        hasCustomCaption: customCaption.trim().length > 0,
        quantity,
      }),
    [
      lang,
      mode,
      canvasSizeId,
      canvasOrientation,
      customWidthCm,
      customHeightCm,
      frameStyleId,
      canvasFinishId,
      artFilterId,
      backlightModeId,
      garmentType,
      garmentCutId,
      printPlacement,
      printScale,
      customCaption,
      quantity,
    ]
  );

  const activeArtworkTitle = useMemo(() => {
    if (uploadedImageName) return uploadedImageName;
    return t.presets[selectedPresetId]?.title ?? 'Custom Artwork';
  }, [uploadedImageName, selectedPresetId, t]);

  const activeFilterName = t.filters[artFilterId].name;

  const configurationSummary = useMemo(() => {
    if (mode === 'canvas') {
      return [
        `${resolvedDims.label} (${
          resolvedDims.orientation === 'landscape'
            ? t.orientationLandscape
            : t.orientationPortrait
        })`,
        t.frames[frameStyleId].name,
        t.finishes[canvasFinishId].name,
        t.backlights[backlightModeId].name,
        roomLighting === 'spotlight-night'
          ? t.nightSpotlightBtn
          : t.daylightGalleryBtn,
      ];
    } else {
      return [
        `${t.garmentTypes[garmentType].name} (${garmentSize})`,
        t.garmentCuts[garmentCutId].name,
        t.garmentColors[garmentColorId],
        t.placements[printPlacement].name,
        `${Math.round(printScale * 100)}% / ${
          printOffsetY > 0 ? `+${printOffsetY}` : printOffsetY
        } cm`,
      ];
    }
  }, [
    mode,
    resolvedDims,
    frameStyleId,
    canvasFinishId,
    backlightModeId,
    roomLighting,
    garmentType,
    garmentSize,
    garmentCutId,
    garmentColorId,
    printPlacement,
    printScale,
    printOffsetY,
    t,
  ]);

  // Handlers
  const handleFileUpload = useCallback(
    (file: File | undefined) => {
      if (!file || !file.type.startsWith('image/')) return;
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        if (uploadedPreviewUrl) {
          URL.revokeObjectURL(uploadedPreviewUrl);
        }
        setUploadedImage(img);
        setUploadedImageName(file.name);
        setUploadedPreviewUrl(objectUrl);
      };
      img.src = objectUrl;
    },
    [uploadedPreviewUrl]
  );

  const handleClearUpload = () => {
    if (uploadedPreviewUrl) URL.revokeObjectURL(uploadedPreviewUrl);
    setUploadedImage(null);
    setUploadedImageName(null);
    setUploadedPreviewUrl(null);
  };

  const handleSelectPreset = (id: string) => {
    handleClearUpload();
    setSelectedPresetId(id);
  };

  const handleChangeMode = (nextMode: StudioMode) => {
    setMode(nextMode);
    setAutoRotate(false);
    setCameraAngle('front');
    setCameraNonce((n) => n + 1);
  };

  const handleSelectOrientation = (ori: CanvasOrientation) => {
    setCanvasOrientation(ori);
    if (canvasSizeId === 'custom') {
      if (ori === 'landscape' && customWidthCm < customHeightCm) {
        setCustomWidthCm(customHeightCm);
        setCustomHeightCm(customWidthCm);
      } else if (ori === 'portrait' && customWidthCm > customHeightCm) {
        setCustomWidthCm(customHeightCm);
        setCustomHeightCm(customWidthCm);
      }
    }
    setCameraNonce((n) => n + 1);
  };

  const handleSelectGarmentType = (nextType: GarmentTypeId) => {
    setGarmentType(nextType);
    const firstMatchingCut = GARMENT_CUTS.find((c) => c.garmentType === nextType);
    if (firstMatchingCut) {
      setGarmentCutId(firstMatchingCut.id);
    }
  };

  const handleSelectPrintPlacement = (id: PrintPlacementId) => {
    setPrintPlacement(id);
    const opt = PRINT_PLACEMENTS.find((p) => p.id === id);
    if (opt) {
      setPrintScale(opt.defaultScale);
      setPrintOffsetY(0);
      setAutoRotate(false);
      setCameraAngle(opt.cameraPreset);
      setCameraNonce((n) => n + 1);
    }
  };

  const handleSelectCameraAngle = (angle: CameraAnglePreset) => {
    setAutoRotate(false);
    setCameraAngle(angle);
    setCameraNonce((n) => n + 1);
  };

  const handleRegisterSnapshotFn = useCallback((fn: () => string) => {
    captureSnapshotFnRef.current = fn;
  }, []);

  const buildSpecCardDataUrl = useCallback(() => {
    return captureSnapshotFnRef.current ? captureSnapshotFnRef.current() : '';
  }, []);

  const handleDownloadSpecCard = useCallback(() => {
    const rawDataUrl = buildSpecCardDataUrl();
    if (!rawDataUrl) return;

    const img = new Image();
    img.onload = () => {
      const card = document.createElement('canvas');
      card.width = 1280;
      card.height = 820;
      const ctx = card.getContext('2d')!;

      ctx.fillStyle = '#0c0e14';
      ctx.fillRect(0, 0, card.width, card.height);

      const scale = Math.max(1280 / img.width, 680 / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, (1280 - dw) / 2, (680 - dh) / 2, dw, dh);

      ctx.fillStyle = '#11141d';
      ctx.fillRect(0, 680, 1280, 140);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(0, 680, 1280, 3);

      ctx.fillStyle = '#fef3c7';
      ctx.font = '700 28px Georgia, serif';
      ctx.fillText('ATELIER LUMIÈRE · 3D BESPOKE STUDIO PREVIEW', 40, 730);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '500 18px sans-serif';
      ctx.fillText(
        `${activeArtworkTitle} · ${configurationSummary.slice(0, 3).join(' · ')}`,
        40,
        768
      );

      ctx.fillStyle = '#fbbf24';
      ctx.font = '700 38px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`€${priceSummary.grandTotal}`, 1240, 758);

      const link = document.createElement('a');
      link.download = `atelier-lumiere-${mode}-preview.png`;
      link.href = card.toDataURL('image/png');
      link.click();

      setSnapshotToast(t.previewCardSavedToast);
      setTimeout(() => setSnapshotToast(null), 2600);
    };
    img.src = rawDataUrl;
  }, [
    activeArtworkTitle,
    buildSpecCardDataUrl,
    configurationSummary,
    mode,
    priceSummary.grandTotal,
    t.previewCardSavedToast,
  ]);

  const handleOpenCheckout = () => {
    const snap = buildSpecCardDataUrl();
    setCheckoutSnapshotUrl(snap);
    setCheckoutOpen(true);
  };

  const handleResetStudio = () => {
    setQuantity(1);
    setCustomCaption('');
    setArtFilterId('original');
    setAutoRotate(false);
    setCameraAngle('front');
    setCameraNonce((n) => n + 1);
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-stone-950"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragActive(true);
      }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragActive(false);
        const file = e.dataTransfer.files?.[0];
        handleFileUpload(file);
      }}
    >
      {/* Branded 3D Asset Preloader */}
      <StudioPreloader sceneReady={sceneReady} lang={lang} />

      {/* Hidden File Upload Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFileUpload(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      {/* Interactive 3D Viewport */}
      <StudioCanvas
        mode={mode}
        artworkTexture={artworkTexture}
        resolvedDims={resolvedDims}
        frameStyleId={frameStyleId}
        canvasFinishId={canvasFinishId}
        backlightModeId={backlightModeId}
        roomLighting={roomLighting}
        scaleReference={scaleReference}
        garmentType={garmentType}
        garmentCutId={garmentCutId}
        garmentColorId={garmentColorId}
        printPlacement={printPlacement}
        printScale={printScale}
        printOffsetY={printOffsetY}
        cameraAngle={cameraAngle}
        cameraNonce={cameraNonce}
        autoRotate={autoRotate}
        onRegisterSnapshotFn={handleRegisterSnapshotFn}
        onSceneReady={() => setSceneReady(true)}
      />

      {/* Drag & Drop Overlay */}
      {isDragActive && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md border-4 border-dashed border-amber-400 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="font-display font-bold text-2xl text-amber-300">
              {t.dropHintTitle}
            </p>
            <p className="text-sm text-stone-300 mt-1">{t.dropHintSub}</p>
          </div>
        </div>
      )}

      {/* Top Navigation, Mode Switcher & RU/RO/EN Selector */}
      {!isFullscreenPreview && (
        <TopStudioHeader
          mode={mode}
          onChangeMode={handleChangeMode}
          lang={lang}
          onChangeLang={setLang}
          roomLighting={roomLighting}
          onToggleRoomLighting={() =>
            setRoomLighting((prev) =>
              prev === 'daylight' ? 'spotlight-night' : 'daylight'
            )
          }
          onTriggerUpload={() => fileInputRef.current?.click()}
          onEnterFullscreenPreview={() => setIsFullscreenPreview(true)}
          onOpenCheckout={handleOpenCheckout}
          grandTotal={priceSummary.grandTotal}
        />
      )}

      {/* Left Artwork & Style Dock */}
      {!isFullscreenPreview && (
        <LeftArtworkDock
          lang={lang}
          selectedPresetId={selectedPresetId}
          onSelectPreset={handleSelectPreset}
          uploadedImageName={uploadedImageName}
          uploadedPreviewUrl={uploadedPreviewUrl}
          onTriggerUpload={() => fileInputRef.current?.click()}
          onClearUpload={handleClearUpload}
          textureFitMode={textureFitMode}
          onChangeTextureFit={setTextureFitMode}
          artFilterId={artFilterId}
          onSelectFilter={setArtFilterId}
          customCaption={customCaption}
          onChangeCaption={setCustomCaption}
        />
      )}

      {/* Right Configurator & Live Price Calculator */}
      {!isFullscreenPreview && (
        <RightConfiguratorDock
          lang={lang}
          mode={mode}
          canvasSizeId={canvasSizeId}
          onSelectCanvasSize={(id) => {
            setCanvasSizeId(id);
            if (id === 'custom') {
              if (canvasOrientation === 'landscape' && customWidthCm < customHeightCm) {
                setCustomWidthCm(customHeightCm);
                setCustomHeightCm(customWidthCm);
              } else if (canvasOrientation === 'portrait' && customWidthCm > customHeightCm) {
                setCustomWidthCm(customHeightCm);
                setCustomHeightCm(customWidthCm);
              }
            }
            setCameraNonce((n) => n + 1);
          }}
          canvasOrientation={canvasOrientation}
          onSelectOrientation={handleSelectOrientation}
          customWidthCm={customWidthCm}
          customHeightCm={customHeightCm}
          onChangeCustomWidth={(cm) => {
            setCustomWidthCm(cm);
            setCanvasOrientation(cm > customHeightCm ? 'landscape' : 'portrait');
          }}
          onChangeCustomHeight={(cm) => {
            setCustomHeightCm(cm);
            setCanvasOrientation(customWidthCm > cm ? 'landscape' : 'portrait');
          }}
          resolvedDims={resolvedDims}
          frameStyleId={frameStyleId}
          onSelectFrameStyle={setFrameStyleId}
          canvasFinishId={canvasFinishId}
          onSelectCanvasFinish={setCanvasFinishId}
          backlightModeId={backlightModeId}
          onSelectBacklight={setBacklightModeId}
          roomLighting={roomLighting}
          onSelectRoomLighting={setRoomLighting}
          scaleReference={scaleReference}
          onSelectScaleReference={setScaleReference}
          garmentType={garmentType}
          onSelectGarmentType={handleSelectGarmentType}
          garmentCutId={garmentCutId}
          onSelectGarmentCut={setGarmentCutId}
          garmentColorId={garmentColorId}
          onSelectGarmentColor={setGarmentColorId}
          garmentSize={garmentSize}
          onSelectGarmentSize={setGarmentSize}
          printPlacement={printPlacement}
          onSelectPrintPlacement={handleSelectPrintPlacement}
          printScale={printScale}
          onChangePrintScale={setPrintScale}
          printOffsetY={printOffsetY}
          onChangePrintOffsetY={setPrintOffsetY}
          onResetPrintTransform={() => {
            const opt = PRINT_PLACEMENTS.find((p) => p.id === printPlacement);
            setPrintScale(opt ? opt.defaultScale : 1.0);
            setPrintOffsetY(0);
          }}
          quantity={quantity}
          onChangeQuantity={setQuantity}
          priceSummary={priceSummary}
          onEnterFullscreenPreview={() => setIsFullscreenPreview(true)}
          onOpenCheckout={handleOpenCheckout}
        />
      )}

      {/* Center Viewport Quick Camera Pill */}
      {!isFullscreenPreview && (
        <div className="pointer-events-none fixed bottom-3 left-1/2 -translate-x-1/2 z-20 hidden lg:flex items-center">
          <div className="pointer-events-auto studio-glass rounded-full px-2 py-1 flex items-center gap-1 text-[10px]">
            <button
              type="button"
              onClick={() => handleSelectCameraAngle('front')}
              className={`px-2 py-1 rounded-full font-semibold cursor-pointer transition-all whitespace-nowrap ${
                cameraAngle === 'front' && !autoRotate
                  ? 'bg-white/20 text-white'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              {t.camFront}
            </button>
            <button
              type="button"
              onClick={() => handleSelectCameraAngle('angle45')}
              className={`px-2 py-1 rounded-full font-semibold cursor-pointer transition-all whitespace-nowrap ${
                cameraAngle === 'angle45' && !autoRotate
                  ? 'bg-white/20 text-white'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              {t.camAngle45}
            </button>
            {mode === 'apparel' && (
              <button
                type="button"
                onClick={() => handleSelectCameraAngle('rear')}
                className={`px-2 py-1 rounded-full font-semibold cursor-pointer transition-all whitespace-nowrap ${
                  cameraAngle === 'rear' && !autoRotate
                    ? 'bg-white/20 text-white'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                {t.camRear}
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSelectCameraAngle('macro')}
              className={`px-2 py-1 rounded-full font-semibold cursor-pointer transition-all whitespace-nowrap ${
                cameraAngle === 'macro' && !autoRotate
                  ? 'bg-white/20 text-white'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              {t.camMacro}
            </button>
            <span className="h-3 w-px bg-white/15 mx-0.5" />
            <button
              type="button"
              onClick={() => setAutoRotate((v) => !v)}
              className={`px-2 py-1 rounded-full font-semibold flex items-center gap-1 cursor-pointer transition-all whitespace-nowrap ${
                autoRotate
                  ? 'bg-amber-400/25 text-amber-300'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} />
              <span>360°</span>
            </button>
            <span className="h-3 w-px bg-white/15 mx-0.5" />
            <button
              type="button"
              onClick={() => setIsFullscreenPreview(true)}
              className="px-2 py-1 rounded-full font-semibold text-sky-300 hover:text-sky-200 flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <Eye className="w-3 h-3" />
              <span>{t.camFullscreen}</span>
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Preview Floating Controls */}
      {isFullscreenPreview && (
        <FullscreenPreviewBar
          lang={lang}
          mode={mode}
          cameraAngle={cameraAngle}
          onSelectCameraAngle={handleSelectCameraAngle}
          autoRotate={autoRotate}
          onToggleAutoRotate={() => setAutoRotate((v) => !v)}
          onSaveSnapshot={handleDownloadSpecCard}
          snapshotToast={snapshotToast}
          onExitPreview={() => {
            setAutoRotate(false);
            setIsFullscreenPreview(false);
          }}
          onOpenCheckout={handleOpenCheckout}
          grandTotal={priceSummary.grandTotal}
        />
      )}

      {/* Order Checkout Drawer */}
      <OrderCheckoutDrawer
        lang={lang}
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        snapshotDataUrl={checkoutSnapshotUrl}
        mode={mode}
        artworkTitle={activeArtworkTitle}
        artFilterName={activeFilterName}
        customCaption={customCaption}
        configurationSummary={configurationSummary}
        priceSummary={priceSummary}
        onDownloadSpecCard={handleDownloadSpecCard}
        onResetStudio={handleResetStudio}
      />
    </div>
  );
}

export default App;
