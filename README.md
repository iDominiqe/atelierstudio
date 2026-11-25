# ATELIER LUMIÈRE — 3D Bespoke Portrait & Apparel Studio

Interactive 3D custom portrait & apparel customization studio built with React 18, TypeScript, Three.js, React Three Fiber, `@react-three/postprocessing` (Bloom), and Tailwind CSS.

## Live Demo
- Subdomain: https://atelierstudio.idominiqe.com

## Key Features
- **Dual Studio Mode Switcher**: Seamlessly switch between **Custom Canvas Portraits (Wall Art Studio)** and **Custom Apparel (3D T-Shirts & Pullover Hoodies / Батники)**.
- **Photo / Logo Upload + 5 High-Res Presets**: Upload any local image via `FileReader` / `ObjectURL` (or drag-and-drop) or test instantly with 5 bespoke high-resolution artwork presets, 5 live artistic style filters, and optional custom signature typography.
- **Mode A — 3D Portrait & Gallery Wall Studio**:
  - Smooth real-time canvas resizing (`30 × 40 cm`, `50 × 70 cm`, `70 × 100 cm`, `100 × 150 cm`) with toggleable **Interior Sofa & Planter** or **175 cm Human Scale Silhouette** references.
  - 5 PBR 3D frame geometries (`Frameless Gallery Wrap`, `Matte Black Aluminum`, `Brushed Gold Brass`, `Natural Oak Wood` with passe-partout, and `Classic Ornate Dark Walnut` with gilded fillet).
  - Physics-accurate **Matte Fine-Art Canvas** (`roughness: 0.85` + woven linen normal map) vs **Satin / Gloss Varnish** (`roughness: 0.22`, clearcoat reflections).
  - **Backlit Halo LED Glow** (`Warm 2700K`, `Gallery White 5500K`, `Sunset Aura RGB`, `Cyber Studio RGB`) with bloom + **Daylight / Night Museum Spotlight** modes.
- **Mode B — 3D Apparel Studio**:
  - Switch between a sculpted 3D **Crewneck T-Shirt (280 GSM)** and **Pullover Hoodie / Батник (480 GSM)** with cotton knit normal maps and organic folds.
  - 7 instant PBR fabric color swatches (`Optic White`, `Jet Black`, `Heather Grey`, `Navy Blue`, `Forest Green`, `Sand Beige`, `Burgundy`).
  - Interactive print placement (`Left Chest Pocket`, `Center Chest`, `Full Back` with automatic `180°` rear camera orbit, and `Left Sleeve`) plus live **Scale** & **Vertical Offset** sliders.
- **Fullscreen 3D Preview, Snapshot & Order Checkout**:
  - Distraction-free 360° preview mode with one-click PNG spec card snapshot download.
  - Checkout drawer with live 3D thumbnail capture, itemized price breakdown, delivery form, and simulated order tracking confirmation.
