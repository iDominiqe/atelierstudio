import * as THREE from 'three';
import type { ArtFilterId } from '../types/studio';

const ART_W = 1024;
const ART_H = 1365;

const presetCanvasCache = new Map<string, HTMLCanvasElement>();
const presetThumbCache = new Map<string, string>();

function makeOffscreen(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  return [c, ctx];
}

function drawGoldenSovereign(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Deep chiaroscuro background
  const bg = ctx.createRadialGradient(w * 0.5, h * 0.36, 40, w * 0.5, h * 0.45, w * 0.85);
  bg.addColorStop(0, '#5a3a1a');
  bg.addColorStop(0.42, '#2a1a0e');
  bg.addColorStop(1, '#0d0907');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Painterly oil brushwork backdrop
  for (let i = 0; i < 180; i++) {
    const x = ((i * 197) % w);
    const y = ((i * 313) % h);
    const len = 40 + (i % 7) * 22;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(((i % 15) - 7) * 0.08);
    ctx.fillStyle = i % 3 === 0 ? 'rgba(212,175,55,0.06)' : 'rgba(20,12,8,0.16)';
    ctx.fillRect(-len / 2, -6, len, 12);
    ctx.restore();
  }

  // Gold leaf celestial halo behind subject
  ctx.save();
  ctx.strokeStyle = 'rgba(234, 179, 8, 0.72)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.35, w * 0.27, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.35, w * 0.31, 0, Math.PI * 2);
  ctx.stroke();

  // Radiating gold rays
  for (let a = 0; a < 24; a++) {
    const ang = (a / 24) * Math.PI * 2;
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.16)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.5 + Math.cos(ang) * 180, h * 0.35 + Math.sin(ang) * 180);
    ctx.lineTo(w * 0.5 + Math.cos(ang) * 340, h * 0.35 + Math.sin(ang) * 340);
    ctx.stroke();
  }
  ctx.restore();

  // Sculpted Baroque portrait bust silhouette + chiaroscuro shading
  const skinGrad = ctx.createRadialGradient(w * 0.45, h * 0.31, 18, w * 0.5, h * 0.36, 220);
  skinGrad.addColorStop(0, '#f3d2b3');
  skinGrad.addColorStop(0.55, '#c48b61');
  skinGrad.addColorStop(1, '#3b2114');

  // Draped velvet robe & gold shoulder embroidery
  const robeGrad = ctx.createLinearGradient(w * 0.2, h * 0.52, w * 0.8, h * 0.98);
  robeGrad.addColorStop(0, '#5c1f1a');
  robeGrad.addColorStop(0.5, '#2b0d0c');
  robeGrad.addColorStop(1, '#120707');
  ctx.fillStyle = robeGrad;
  ctx.beginPath();
  ctx.moveTo(w * 0.14, h);
  ctx.quadraticCurveTo(w * 0.22, h * 0.58, w * 0.5, h * 0.54);
  ctx.quadraticCurveTo(w * 0.78, h * 0.58, w * 0.86, h);
  ctx.closePath();
  ctx.fill();

  // Gold collar lapel
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(w * 0.35, h * 0.58);
  ctx.quadraticCurveTo(w * 0.5, h * 0.74, w * 0.65, h * 0.58);
  ctx.stroke();

  // Neck
  ctx.fillStyle = '#9f6b47';
  ctx.beginPath();
  ctx.roundRect(w * 0.44, h * 0.43, w * 0.12, h * 0.15, 24);
  ctx.fill();

  // Head
  ctx.fillStyle = skinGrad;
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.34, w * 0.135, h * 0.128, 0, 0, Math.PI * 2);
  ctx.fill();

  // Crown / laurel gold accent
  ctx.fillStyle = '#f59e0b';
  for (let i = -4; i <= 4; i++) {
    ctx.save();
    ctx.translate(w * 0.5 + i * 26, h * 0.21 + Math.abs(i) * 5);
    ctx.rotate(i * 0.18);
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Expressive painterly face contour & eyes
  ctx.fillStyle = '#1c100a';
  ctx.beginPath();
  ctx.ellipse(w * 0.45, h * 0.33, 12, 6, 0, 0, Math.PI * 2);
  ctx.ellipse(w * 0.55, h * 0.33, 12, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 232, 185, 0.38)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.35, w * 0.135, Math.PI * 0.7, Math.PI * 1.45);
  ctx.stroke();

  // Museum border trim
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, w - 72, h - 72);
}

function drawCyberBotanica(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#050816');
  bg.addColorStop(0.5, '#0f1035');
  bg.addColorStop(1, '#1a092b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Subtle synth grid
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.08)';
  ctx.lineWidth = 1.5;
  for (let x = 0; x < w; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Glowing neon ring
  const glow = ctx.createRadialGradient(w * 0.5, h * 0.44, 60, w * 0.5, h * 0.44, 420);
  glow.addColorStop(0, 'rgba(34, 211, 238, 0.45)');
  glow.addColorStop(0.5, 'rgba(232, 121, 249, 0.25)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.42, 260, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#e879f9';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.42, 290, 0.4, Math.PI * 1.7);
  ctx.stroke();

  // Futuristic cybernetic bust
  const bustGrad = ctx.createLinearGradient(w * 0.3, h * 0.2, w * 0.7, h * 0.9);
  bustGrad.addColorStop(0, '#22d3ee');
  bustGrad.addColorStop(0.48, '#312e81');
  bustGrad.addColorStop(1, '#e879f9');

  ctx.fillStyle = bustGrad;
  ctx.beginPath();
  ctx.moveTo(w * 0.22, h * 0.94);
  ctx.quadraticCurveTo(w * 0.26, h * 0.62, w * 0.5, h * 0.57);
  ctx.quadraticCurveTo(w * 0.74, h * 0.62, w * 0.78, h * 0.94);
  ctx.closePath();
  ctx.fill();

  // Head silhouette with neon visor
  ctx.fillStyle = '#111827';
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.37, 130, 165, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Neon visor slit
  const visorGrad = ctx.createLinearGradient(w * 0.37, 0, w * 0.63, 0);
  visorGrad.addColorStop(0, '#22d3ee');
  visorGrad.addColorStop(0.5, '#f0abfc');
  visorGrad.addColorStop(1, '#22d3ee');
  ctx.fillStyle = visorGrad;
  ctx.beginPath();
  ctx.roundRect(w * 0.37, h * 0.33, w * 0.26, 36, 18);
  ctx.fill();

  // Bioluminescent floral tendrils
  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2;
    const bx = w * 0.5 + Math.cos(ang) * 215;
    const by = h * 0.42 + Math.sin(ang) * 215;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(34, 211, 238, 0.8)' : 'rgba(232, 121, 249, 0.8)';
    ctx.beginPath();
    ctx.ellipse(bx, by, 34, 14, ang, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '700 26px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('NEO-BOTANICA // SERIES 02', w * 0.5, h - 72);
}

function drawAtelierNoir(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#ecebe6';
  ctx.fillRect(0, 0, w, h);

  // Brutalist architectural arch & shadow
  ctx.fillStyle = '#141519';
  ctx.beginPath();
  ctx.roundRect(80, 90, w - 160, h - 220, [420, 420, 0, 0]);
  ctx.fill();

  // High-contrast silver spotlight gradient
  const spot = ctx.createRadialGradient(w * 0.44, h * 0.36, 20, w * 0.5, h * 0.42, 380);
  spot.addColorStop(0, '#f8fafc');
  spot.addColorStop(0.55, '#94a3b8');
  spot.addColorStop(1, '#141519');

  // Sculpted monochrome figure
  ctx.fillStyle = '#090a0d';
  ctx.beginPath();
  ctx.moveTo(w * 0.18, h - 130);
  ctx.quadraticCurveTo(w * 0.25, h * 0.58, w * 0.5, h * 0.55);
  ctx.quadraticCurveTo(w * 0.75, h * 0.58, w * 0.82, h - 130);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = spot;
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.38, 122, 155, 0, 0, Math.PI * 2);
  ctx.fill();

  // Diagonal editorial shadow slash
  ctx.fillStyle = 'rgba(15, 17, 23, 0.72)';
  ctx.beginPath();
  ctx.moveTo(w * 0.5, h * 0.22);
  ctx.lineTo(w * 0.65, h * 0.22);
  ctx.lineTo(w * 0.65, h * 0.56);
  ctx.lineTo(w * 0.46, h * 0.56);
  ctx.closePath();
  ctx.fill();

  // Crisp gallery typography
  ctx.fillStyle = '#141519';
  ctx.font = '600 44px "Cormorant Garamond", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('L’OMBRE ET LA LUMIÈRE', w * 0.5, h - 62);
}

function drawAstralSamurai(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#0d0b10';
  ctx.fillRect(0, 0, w, h);

  // Rising crimson sun
  const sun = ctx.createRadialGradient(w * 0.5, h * 0.42, 40, w * 0.5, h * 0.42, 320);
  sun.addColorStop(0, '#fbbf24');
  sun.addColorStop(0.45, '#dc2626');
  sun.addColorStop(1, '#7f1d1d');
  ctx.fillStyle = sun;
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.42, 275, 0, Math.PI * 2);
  ctx.fill();

  // Geometric crest rings
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.42, 315, 0, Math.PI * 2);
  ctx.stroke();

  // Samurai helmet silhouette (Kabuto)
  ctx.fillStyle = '#0f0e13';
  ctx.beginPath();
  ctx.moveTo(w * 0.22, h * 0.88);
  ctx.lineTo(w * 0.32, h * 0.54);
  ctx.lineTo(w * 0.36, h * 0.34);
  ctx.lineTo(w * 0.5, h * 0.26);
  ctx.lineTo(w * 0.64, h * 0.34);
  ctx.lineTo(w * 0.68, h * 0.54);
  ctx.lineTo(w * 0.78, h * 0.88);
  ctx.closePath();
  ctx.fill();

  // Gold crescent horns (Kuwagata)
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(w * 0.5, h * 0.3);
  ctx.quadraticCurveTo(w * 0.36, h * 0.16, w * 0.24, h * 0.12);
  ctx.quadraticCurveTo(w * 0.38, h * 0.25, w * 0.47, h * 0.33);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(w * 0.5, h * 0.3);
  ctx.quadraticCurveTo(w * 0.64, h * 0.16, w * 0.76, h * 0.12);
  ctx.quadraticCurveTo(w * 0.62, h * 0.25, w * 0.53, h * 0.33);
  ctx.closePath();
  ctx.fill();

  // Glowing crimson mask eyes
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(w * 0.42, h * 0.44, 52, 10);
  ctx.fillRect(w * 0.53, h * 0.44, 52, 10);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '700 30px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ASTRAL CREST · 04', w * 0.5, h - 68);
}

function drawVelvetHorizon(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Warm modernist color-field canvas
  ctx.fillStyle = '#f5efe6';
  ctx.fillRect(0, 0, w, h);

  // Cobalt shape
  ctx.fillStyle = '#1d3557';
  ctx.beginPath();
  ctx.roundRect(95, 110, w - 190, h * 0.46, 36);
  ctx.fill();

  // Terracotta sun disc
  const terra = ctx.createLinearGradient(0, h * 0.2, 0, h * 0.55);
  terra.addColorStop(0, '#f97316');
  terra.addColorStop(1, '#c2410c');
  ctx.fillStyle = terra;
  ctx.beginPath();
  ctx.arc(w * 0.54, h * 0.34, 175, 0, Math.PI * 2);
  ctx.fill();

  // Ochre sweeping abstract wave
  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.moveTo(95, h * 0.62);
  ctx.bezierCurveTo(w * 0.36, h * 0.48, w * 0.64, h * 0.75, w - 95, h * 0.56);
  ctx.lineTo(w - 95, h - 130);
  ctx.lineTo(95, h - 130);
  ctx.closePath();
  ctx.fill();

  // Deep espresso foreground arch
  ctx.fillStyle = '#291f1e';
  ctx.beginPath();
  ctx.arc(w * 0.36, h - 130, 260, Math.PI, 0);
  ctx.fill();

  // Fine impasto horizontal brush lines
  for (let y = 130; y < h - 140; y += 16) {
    ctx.strokeStyle = y % 32 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(110, y);
    ctx.lineTo(w - 110, y + ((y % 7) - 3));
    ctx.stroke();
  }
}

export function getPresetCanvas(presetId: string): HTMLCanvasElement {
  const existing = presetCanvasCache.get(presetId);
  if (existing) return existing;

  const [c, ctx] = makeOffscreen(ART_W, ART_H);
  switch (presetId) {
    case 'golden-sovereign':
      drawGoldenSovereign(ctx, ART_W, ART_H);
      break;
    case 'cyber-botanica':
      drawCyberBotanica(ctx, ART_W, ART_H);
      break;
    case 'atelier-noir':
      drawAtelierNoir(ctx, ART_W, ART_H);
      break;
    case 'astral-samurai':
      drawAstralSamurai(ctx, ART_W, ART_H);
      break;
    case 'velvet-horizon':
    default:
      drawVelvetHorizon(ctx, ART_W, ART_H);
      break;
  }

  presetCanvasCache.set(presetId, c);
  return c;
}

export function getPresetThumbnailUrl(presetId: string): string {
  const cached = presetThumbCache.get(presetId);
  if (cached) return cached;
  const c = getPresetCanvas(presetId);
  const url = c.toDataURL('image/jpeg', 0.82);
  presetThumbCache.set(presetId, url);
  return url;
}

function applyArtFilter(ctx: CanvasRenderingContext2D, filter: ArtFilterId, w: number, h: number) {
  if (filter === 'original') return;

  if (filter === 'noir-charcoal') {
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      const contrast = Math.min(255, Math.max(0, (lum - 128) * 1.24 + 128));
      d[i] = contrast;
      d[i + 1] = contrast;
      d[i + 2] = contrast;
    }
    ctx.putImageData(img, 0, 0);
  } else if (filter === 'oil-impasto') {
    // Warm painterly richness & tactile brushstroke highlights
    ctx.save();
    ctx.globalCompositeOperation = 'soft-light';
    ctx.fillStyle = 'rgba(245, 158, 11, 0.26)';
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'overlay';
    for (let i = 0; i < 240; i++) {
      const x = (i * 173) % w;
      const y = (i * 251) % h;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,248,220,0.09)' : 'rgba(30,15,5,0.12)';
      ctx.beginPath();
      ctx.ellipse(x, y, 26, 6, ((i % 10) - 5) * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  } else if (filter === 'pop-neon') {
    ctx.save();
    ctx.globalCompositeOperation = 'color-dodge';
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(34, 211, 238, 0.42)');
    grad.addColorStop(1, 'rgba(232, 121, 249, 0.42)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  } else if (filter === 'renaissance-gold') {
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    const vig = ctx.createRadialGradient(w * 0.5, h * 0.45, 160, w * 0.5, h * 0.5, w * 0.8);
    vig.addColorStop(0, 'rgba(255, 244, 214, 1)');
    vig.addColorStop(1, 'rgba(92, 54, 20, 0.92)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = 'rgba(217, 119, 6, 0.14)';
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }
}

export function renderCompositedArtworkCanvas(params: {
  presetId: string;
  uploadedImage: HTMLImageElement | null;
  filterId: ArtFilterId;
  customCaption: string;
}): HTMLCanvasElement {
  const [c, ctx] = makeOffscreen(ART_W, ART_H);

  if (params.uploadedImage) {
    // Cover-fit uploaded image neatly into 3:4 portrait canvas
    const img = params.uploadedImage;
    const iw = img.naturalWidth || img.width || ART_W;
    const ih = img.naturalHeight || img.height || ART_H;
    const scale = Math.max(ART_W / iw, ART_H / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (ART_W - dw) / 2;
    const dy = (ART_H - dh) / 2;
    ctx.fillStyle = '#111318';
    ctx.fillRect(0, 0, ART_W, ART_H);
    ctx.drawImage(img, dx, dy, dw, dh);
  } else {
    const base = getPresetCanvas(params.presetId);
    ctx.drawImage(base, 0, 0);
  }

  applyArtFilter(ctx, params.filterId, ART_W, ART_H);

  const caption = params.customCaption.trim();
  if (caption.length > 0) {
    ctx.save();
    const bannerH = 92;
    const barGrad = ctx.createLinearGradient(0, ART_H - bannerH - 20, 0, ART_H);
    barGrad.addColorStop(0, 'rgba(8, 10, 14, 0)');
    barGrad.addColorStop(0.4, 'rgba(8, 10, 14, 0.72)');
    barGrad.addColorStop(1, 'rgba(8, 10, 14, 0.92)');
    ctx.fillStyle = barGrad;
    ctx.fillRect(0, ART_H - bannerH - 20, ART_W, bannerH + 20);

    ctx.fillStyle = '#fef3c7';
    ctx.font = '600 36px "Cormorant Garamond", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(caption.toUpperCase(), ART_W * 0.5, ART_H - 46, ART_W - 110);
    ctx.restore();
  }

  return c;
}

// --- PBR NORMAL & ARCHITECTURAL TEXTURES ---

let cachedCanvasNormal: THREE.CanvasTexture | null = null;
export function getCanvasWeaveNormalMap(): THREE.CanvasTexture {
  if (cachedCanvasNormal) return cachedCanvasNormal;
  const size = 256;
  const [c, ctx] = makeOffscreen(size, size);
  const img = ctx.createImageData(size, size);
  const d = img.data;

  // Cross-hatch woven linen normal map
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const wx = Math.sin((x / size) * Math.PI * 32);
      const wy = Math.sin((y / size) * Math.PI * 32);
      const checker = ((x >> 2) + (y >> 2)) & 1 ? 1 : -1;
      const nx = 128 + Math.round(wx * 26 * checker);
      const ny = 128 + Math.round(wy * 26 * -checker);
      d[idx] = Math.min(255, Math.max(0, nx));
      d[idx + 1] = Math.min(255, Math.max(0, ny));
      d[idx + 2] = 240;
      d[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(10, 13);
  tex.needsUpdate = true;
  cachedCanvasNormal = tex;
  return tex;
}

let cachedCottonNormal: THREE.CanvasTexture | null = null;
export function getCottonFabricNormalMap(): THREE.CanvasTexture {
  if (cachedCottonNormal) return cachedCottonNormal;
  const size = 256;
  const [c, ctx] = makeOffscreen(size, size);
  const img = ctx.createImageData(size, size);
  const d = img.data;

  // Fine jersey knit V-stitch normal map
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const ribX = Math.sin((x / size) * Math.PI * 48);
      const ribY = Math.sin(((y + (x % 8) * 0.5) / size) * Math.PI * 48);
      const grain = ((x * 37 + y * 17) % 13) - 6;
      d[idx] = Math.min(255, Math.max(0, 128 + Math.round(ribX * 22 + grain)));
      d[idx + 1] = Math.min(255, Math.max(0, 128 + Math.round(ribY * 18 + grain)));
      d[idx + 2] = 242;
      d[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(14, 14);
  tex.needsUpdate = true;
  cachedCottonNormal = tex;
  return tex;
}

let cachedWallTex: THREE.CanvasTexture | null = null;
export function getGalleryWallTexture(): THREE.CanvasTexture {
  if (cachedWallTex) return cachedWallTex;
  const size = 512;
  const [c, ctx] = makeOffscreen(size, size);
  ctx.fillStyle = '#e5e2dc';
  ctx.fillRect(0, 0, size, size);

  // Subtle Venetian limewash plaster mottling
  for (let i = 0; i < 650; i++) {
    const x = (i * 199) % size;
    const y = (i * 307) % size;
    const r = 18 + (i % 34);
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(170,165,155,0.06)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  cachedWallTex = tex;
  return tex;
}

const woodCache = new Map<'oak' | 'walnut', THREE.CanvasTexture>();
export function getWoodGrainTexture(tone: 'oak' | 'walnut'): THREE.CanvasTexture {
  const cached = woodCache.get(tone);
  if (cached) return cached;

  const size = 256;
  const [c, ctx] = makeOffscreen(size, size);
  ctx.fillStyle = tone === 'oak' ? '#c89c64' : '#3d2114';
  ctx.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y += 2) {
    const wave = Math.sin(y * 0.14) * 0.5 + 0.5;
    ctx.fillStyle =
      tone === 'oak'
        ? `rgba(120, 74, 30, ${0.06 + wave * 0.12})`
        : `rgba(18, 8, 4, ${0.15 + wave * 0.22})`;
    ctx.fillRect(0, y, size, 1.5);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  woodCache.set(tone, tex);
  return tex;
}
