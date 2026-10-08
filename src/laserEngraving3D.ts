import * as THREE from 'three';
import { BodyWallDimensions } from './tumblerModels';

export type LaserFontCategoryId = 'all' | 'calligraphy' | 'modern-sans' | 'elegant-serif' | 'handwritten';

export type LaserEngravingStyleId =
  | 'style-a-cursive'
  | 'style-b-serif'
  | 'style-c-brush'
  | 'style-d-signature'
  | 'style-e-bold-minimal'
  | 'style-f-retro-calligraphy'
  | 'style-g-clean-geometric'
  | 'style-h-editorial-roman';

export type LaserEngravingPlacement = 'vertical-side' | 'horizontal-middle' | 'horizontal-base';

export interface LaserEngravingConfig {
  enabled: boolean;
  text: string;
  styleId: LaserEngravingStyleId;
  placement: LaserEngravingPlacement;
  fontSizePx?: number; // 12 to 48 (default 28)
  rotationDeg?: number; // -90 to 90 (default 0)
}

export interface LaserEngravingStyleSpec {
  id: LaserEngravingStyleId;
  category: Exclude<LaserFontCategoryId, 'all'>;
  code: string;
  name: string;
  sampleName: string;
  subtitle: string;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  letterSpacingPx: number;
  sampleBodyColor: string;
  sampleBodyName: string;
}

export const LASER_FONT_CATEGORIES: { id: LaserFontCategoryId; label: string }[] = [
  { id: 'all', label: 'All Fonts' },
  { id: 'calligraphy', label: 'Calligraphy/Script' },
  { id: 'modern-sans', label: 'Modern Sans' },
  { id: 'elegant-serif', label: 'Elegant Serif' },
  { id: 'handwritten', label: 'Handwritten' },
];

export const LASER_ENGRAVING_STYLES: LaserEngravingStyleSpec[] = [
  {
    id: 'style-a-cursive',
    category: 'calligraphy',
    code: 'Style 01',
    name: 'Elegance Script',
    sampleName: 'Angelica',
    subtitle: 'Fluid copperplate calligraphy with delicate loops',
    fontFamily: '"Great Vibes", cursive',
    fontWeight: '400',
    fontStyle: 'normal',
    letterSpacingPx: 1,
    sampleBodyColor: '#2E3A48',
    sampleBodyName: 'Deep Slate Navy',
  },
  {
    id: 'style-c-brush',
    category: 'handwritten',
    code: 'Style 02',
    name: 'Brush Flow',
    sampleName: 'Clara',
    subtitle: 'Organic hand-lettered brush with tactile stroke depth',
    fontFamily: '"Pacifico", cursive',
    fontWeight: '400',
    fontStyle: 'normal',
    letterSpacingPx: 1.5,
    sampleBodyColor: '#8C4A52',
    sampleBodyName: 'Mulberry Rose',
  },
  {
    id: 'style-b-serif',
    category: 'elegant-serif',
    code: 'Style 03',
    name: 'Aesthetic Serif',
    sampleName: 'Aurelia',
    subtitle: 'High-contrast editorial italic serif with crisp terminals',
    fontFamily: '"Playfair Display", Georgia, serif',
    fontWeight: '600',
    fontStyle: 'italic',
    letterSpacingPx: 3.5,
    sampleBodyColor: '#4A5D4E',
    sampleBodyName: 'Forest Sage',
  },
  {
    id: 'style-d-signature',
    category: 'handwritten',
    code: 'Style 04',
    name: 'Signature Cursive',
    sampleName: 'Serafina',
    subtitle: 'Fine-line bespoke monoline signature with sweeping tail',
    fontFamily: '"Sacramento", cursive',
    fontWeight: '400',
    fontStyle: 'normal',
    letterSpacingPx: 2,
    sampleBodyColor: '#232528',
    sampleBodyName: 'Matte Obsidian',
  },
  {
    id: 'style-e-bold-minimal',
    category: 'modern-sans',
    code: 'Style 05',
    name: 'Bold Minimal',
    sampleName: 'STUDIO.01',
    subtitle: 'Architectural geometric grotesk with clean precision edges',
    fontFamily: '"Plus Jakarta Sans", -apple-system, sans-serif',
    fontWeight: '800',
    fontStyle: 'normal',
    letterSpacingPx: 4.5,
    sampleBodyColor: '#334155',
    sampleBodyName: 'Slate Titanium',
  },
  {
    id: 'style-f-retro-calligraphy',
    category: 'calligraphy',
    code: 'Style 06',
    name: 'Retro Calligraphy',
    sampleName: 'Vivienne',
    subtitle: 'Vintage ribbon script with warm nostalgic curves',
    fontFamily: '"Dancing Script", "Great Vibes", cursive',
    fontWeight: '700',
    fontStyle: 'normal',
    letterSpacingPx: 1.5,
    sampleBodyColor: '#6D4C5C',
    sampleBodyName: 'Vintage Plum',
  },
  {
    id: 'style-g-clean-geometric',
    category: 'modern-sans',
    code: 'Style 07',
    name: 'Nordic Sans',
    sampleName: 'SORA',
    subtitle: 'Ultra-clean minimalist sans with airy studio kerning',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    fontWeight: '600',
    fontStyle: 'normal',
    letterSpacingPx: 6,
    sampleBodyColor: '#3B5249',
    sampleBodyName: 'Nordic Pine',
  },
  {
    id: 'style-h-editorial-roman',
    category: 'elegant-serif',
    code: 'Style 08',
    name: 'Maison Roman',
    sampleName: 'CELESTE',
    subtitle: 'Timeless luxury couture serif with sculpted serifs',
    fontFamily: '"Playfair Display", Georgia, serif',
    fontWeight: '700',
    fontStyle: 'normal',
    letterSpacingPx: 5,
    sampleBodyColor: '#2C3539',
    sampleBodyName: 'Charcoal Silk',
  },
];

export function getLaserStyleSpec(styleId: LaserEngravingStyleId): LaserEngravingStyleSpec {
  return (
    LASER_ENGRAVING_STYLES.find((s) => s.id === styleId) || LASER_ENGRAVING_STYLES[0]
  );
}

/**
 * Renders photorealistic laser-engraved text onto a 2D canvas context.
 * Simulates precision fiber-laser ablation of the matte powder-coated surface:
 * 1. Dark inner top-left debossed cavity shadow (depth of the powder coat layer)
 * 2. Crisp bottom-right bevel highlight edge
 * 3. Raw brushed 18/8 stainless steel metallic silver fill underneath with micro-grain lines
 * 4. Zero sticker outlines or borders
 */
export function drawLaserEngravedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  styleId: LaserEngravingStyleId,
  fontSizePx: number,
  options?: {
    withSwashUnderline?: boolean;
  }
): void {
  const cleanText = (text || 'Angelica').trim() || 'Angelica';
  const styleSpec = getLaserStyleSpec(styleId);

  ctx.save();
  ctx.font = `${styleSpec.fontStyle} ${styleSpec.fontWeight} ${fontSizePx}px ${styleSpec.fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const metrics = ctx.measureText(cleanText);
  const textW = Math.max(metrics.width, fontSizePx * 2.2);
  const halfW = textW * 0.58;
  const halfH = fontSizePx * 0.65;

  // 1. Subtle outer laser heat-affected micro-rim (darkened powder coat edge around cut)
  ctx.save();
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.55)';
  ctx.lineWidth = Math.max(2.2, fontSizePx * 0.045);
  ctx.lineJoin = 'round';
  ctx.strokeText(cleanText, 0, 0);
  ctx.restore();

  // 2. Debossed Top-Left Inner Cavity Wall Shadow
  ctx.save();
  ctx.fillStyle = 'rgba(10, 14, 22, 0.78)';
  const depthOffset = Math.max(1.5, fontSizePx * 0.032);
  ctx.fillText(cleanText, -depthOffset, -depthOffset);
  ctx.restore();

  // 3. Debossed Bottom-Right Bevel Specular Catch-Light
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
  ctx.fillText(cleanText, depthOffset * 0.85, depthOffset * 0.85);
  ctx.restore();

  // 4. Raw Brushed 18/8 Stainless Steel Multi-Stop Metallic Silver Gradient Fill
  const steelGrad = ctx.createLinearGradient(-halfW, -halfH, halfW, halfH);
  steelGrad.addColorStop(0.0, '#94A3B8');
  steelGrad.addColorStop(0.16, '#F1F5F9');
  steelGrad.addColorStop(0.28, '#FFFFFF');
  steelGrad.addColorStop(0.44, '#CBD5E1');
  steelGrad.addColorStop(0.58, '#64748B');
  steelGrad.addColorStop(0.74, '#F8FAFC');
  steelGrad.addColorStop(0.88, '#E2E8F0');
  steelGrad.addColorStop(1.0, '#94A3B8');

  ctx.fillStyle = steelGrad;
  ctx.fillText(cleanText, 0, 0);

  // 5. Fine Specular Inner Etch Sheen Pass
  const sheenGrad = ctx.createLinearGradient(0, -halfH, 0, halfH);
  sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
  sheenGrad.addColorStop(0.48, 'rgba(255, 255, 255, 0.0)');
  sheenGrad.addColorStop(0.52, 'rgba(30, 41, 59, 0.18)');
  sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0.45)');
  ctx.fillStyle = sheenGrad;
  ctx.fillText(cleanText, 0, 0);

  // 6. Optional Minimalist Laser-Etched Flourish / Signature Tail
  if (options?.withSwashUnderline !== false) {
    if (
      styleId === 'style-d-signature' ||
      styleId === 'style-a-cursive' ||
      styleId === 'style-f-retro-calligraphy'
    ) {
      ctx.save();
      ctx.beginPath();
      const swashY = fontSizePx * 0.36;
      ctx.moveTo(-halfW * 0.65, swashY);
      ctx.bezierCurveTo(
        -halfW * 0.15,
        swashY + fontSizePx * 0.14,
        halfW * 0.25,
        swashY - fontSizePx * 0.08,
        halfW * 0.72,
        swashY + fontSizePx * 0.03
      );
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.55)';
      ctx.lineWidth = Math.max(1.8, fontSizePx * 0.032);
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.strokeStyle = steelGrad;
      ctx.lineWidth = Math.max(1.2, fontSizePx * 0.022);
      ctx.stroke();
      ctx.restore();
    } else if (styleId === 'style-b-serif' || styleId === 'style-h-editorial-roman') {
      const starX = halfW * 0.84;
      const starR = Math.max(3, fontSizePx * 0.075);
      [-starX, starX].forEach((sx) => {
        ctx.save();
        ctx.translate(sx, 0);
        ctx.beginPath();
        ctx.moveTo(0, -starR);
        ctx.quadraticCurveTo(0, 0, starR, 0);
        ctx.quadraticCurveTo(0, 0, 0, starR);
        ctx.quadraticCurveTo(0, 0, -starR, 0);
        ctx.quadraticCurveTo(0, 0, 0, -starR);
        ctx.closePath();
        ctx.fillStyle = steelGrad;
        ctx.fill();
        ctx.restore();
      });
    }
  }

  ctx.restore();
}

/**
 * Stamps the laser-engraved custom name directly onto the 2048x2048 tumbler cylinder texture
 */
export function drawLaserEngravingOnCylinderTexture(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  config: LaserEngravingConfig
): void {
  if (!config.enabled || !config.text.trim()) return;

  const frontCenterX = W * 0.25;
  const userFontSize = config.fontSizePx ?? 28;
  const scaleFactor = userFontSize / 28;
  const extraRotRad = ((config.rotationDeg ?? 0) * Math.PI) / 180;

  if (config.placement === 'vertical-side') {
    ctx.save();
    ctx.translate(frontCenterX, H * 0.46);
    ctx.rotate(-Math.PI / 2 + extraRotRad);
    const len = config.text.trim().length;
    const baseSize = len > 11 ? 92 : len > 8 ? 112 : 128;
    drawLaserEngravedText(ctx, config.text, config.styleId, Math.round(baseSize * scaleFactor));
    ctx.restore();
  } else if (config.placement === 'horizontal-middle') {
    ctx.save();
    ctx.translate(frontCenterX, H * 0.48);
    ctx.rotate(extraRotRad);
    const len = config.text.trim().length;
    const baseSize = len > 11 ? 86 : len > 8 ? 104 : 120;
    drawLaserEngravedText(ctx, config.text, config.styleId, Math.round(baseSize * scaleFactor));
    ctx.restore();
  } else {
    ctx.save();
    ctx.translate(frontCenterX, H - 295);
    ctx.rotate(extraRotRad);
    const len = config.text.trim().length;
    const baseSize = len > 11 ? 82 : len > 8 ? 98 : 112;
    drawLaserEngravedText(ctx, config.text, config.styleId, Math.round(baseSize * scaleFactor));
    ctx.restore();
  }
}

/**
 * Creates a real 3D curved metallic stainless-steel mesh with a debossed bump map
 * that hugs the exact lathe contour of the tumbler body.
 */
export function create3DLaserEngravingMesh(
  config: LaserEngravingConfig,
  spec: BodyWallDimensions
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'laser-engraving-3d-group';
  if (!config.enabled || !config.text.trim()) return group;

  const userFontSize = config.fontSizePx ?? 28;
  const scaleFactor = userFontSize / 28;
  const extraRotRad = ((config.rotationDeg ?? 0) * Math.PI) / 180;

  const canvasW = 1024;
  const canvasH = 512;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = canvasW;
  colorCanvas.height = canvasH;
  const ctx = colorCanvas.getContext('2d');

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = canvasW;
  bumpCanvas.height = canvasH;
  const bCtx = bumpCanvas.getContext('2d');

  if (ctx && bCtx) {
    ctx.clearRect(0, 0, canvasW, canvasH);
    const len = config.text.trim().length;
    const baseFontSize = len > 11 ? 102 : len > 8 ? 126 : 146;
    const fontSize = Math.round(baseFontSize * Math.min(1.45, Math.max(0.55, scaleFactor)));

    ctx.save();
    ctx.translate(canvasW / 2, canvasH / 2);
    drawLaserEngravedText(ctx, config.text, config.styleId, fontSize);
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    for (let y = 0; y < canvasH; y += 3) {
      ctx.fillStyle = y % 6 === 0 ? 'rgba(255,255,255,0.16)' : 'rgba(15,23,42,0.08)';
      ctx.fillRect(0, y, canvasW, 1);
    }
    ctx.restore();

    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, canvasW, canvasH);
    const styleSpec = getLaserStyleSpec(config.styleId);
    bCtx.save();
    bCtx.translate(canvasW / 2, canvasH / 2);
    bCtx.font = `${styleSpec.fontStyle} ${styleSpec.fontWeight} ${fontSize}px ${styleSpec.fontFamily}`;
    bCtx.textAlign = 'center';
    bCtx.textBaseline = 'middle';
    bCtx.strokeStyle = '#ffffff';
    bCtx.lineWidth = 8;
    bCtx.strokeText(config.text.trim(), 0, 0);
    bCtx.fillStyle = '#18181b';
    bCtx.fillText(config.text.trim(), 0, 0);
    bCtx.restore();
  }

  const colorTex = new THREE.CanvasTexture(colorCanvas);
  colorTex.colorSpace = THREE.SRGBColorSpace;
  colorTex.anisotropy = 4;

  const bumpTex = new THREE.CanvasTexture(bumpCanvas);

  const isVertical = config.placement === 'vertical-side';
  const isMiddle = config.placement === 'horizontal-middle';
  const yCenter = isVertical
    ? spec.centerY + spec.height * 0.06
    : isMiddle
      ? spec.centerY + spec.height * 0.04
      : spec.centerY - spec.height * 0.33;

  const sizeMult = Math.min(1.4, Math.max(0.6, scaleFactor));
  const patchWorldHeight = (isVertical ? 1.52 : 0.56) * sizeMult;
  const patchArcWidth = (isVertical ? 0.58 : 1.38) * sizeMult;

  const segsX = 36;
  const segsY = 36;
  const geom = new THREE.PlaneGeometry(1, 1, segsX, segsY);
  const pos = geom.attributes.position;

  const surfaceOffset = 0.0028;
  const cosR = Math.cos(extraRotRad);
  const sinR = Math.sin(extraRotRad);

  for (let i = 0; i < pos.count; i++) {
    const px = pos.getX(i);
    const py = pos.getY(i);

    const baseAlongY = isVertical ? px * patchWorldHeight : py * patchWorldHeight;
    const baseAlongArc = isVertical ? -py * patchArcWidth : px * patchArcWidth;

    const localAlongArc = baseAlongArc * cosR - baseAlongY * sinR;
    const localAlongY = baseAlongArc * sinR + baseAlongY * cosR;

    const yWorld = yCenter + localAlongY;
    const rAtY = spec.getRadiusAtY(yWorld) + surfaceOffset;
    const thetaAngle = localAlongArc / Math.max(0.4, rAtY);

    const vx = rAtY * Math.sin(thetaAngle);
    const vz = rAtY * Math.cos(thetaAngle);

    pos.setXYZ(i, vx, yWorld, vz);
  }

  geom.computeVertexNormals();

  const material = new THREE.MeshPhysicalMaterial({
    map: colorTex,
    bumpMap: bumpTex,
    bumpScale: -0.018,
    transparent: true,
    alphaTest: 0.04,
    metalness: 0.94,
    roughness: 0.18,
    clearcoat: 0.35,
    clearcoatRoughness: 0.15,
    reflectivity: 1.0,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geom, material);
  group.add(mesh);
  return group;
}

const previewDataUrlCache: Record<string, string> = {};

/**
 * Generates a high-resolution Octane-style 2D/3D studio preview card image
 */
export function getLaserEngravingPreviewUrl(
  text: string,
  styleId: LaserEngravingStyleId,
  bodyColorHex?: string,
  placement: LaserEngravingPlacement = 'horizontal-base',
  fontSizePx = 28,
  rotationDeg = 0
): string {
  const styleSpec = getLaserStyleSpec(styleId);
  const coatHex = bodyColorHex || styleSpec.sampleBodyColor;
  const cleanText = (text || styleSpec.sampleName).trim() || styleSpec.sampleName;
  const cacheKey = `${cleanText}__${styleId}__${coatHex}__${placement}__${fontSizePx}__${rotationDeg}`;

  if (previewDataUrlCache[cacheKey]) {
    return previewDataUrlCache[cacheKey];
  }

  const W = 520;
  const H = 340;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, W, H);

  const cylX = 36;
  const cylY = 18;
  const cylW = W - 72;
  const cylH = H - 36;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cylX, cylY, cylW, cylH, 28);
  ctx.clip();

  ctx.fillStyle = coatHex;
  ctx.fillRect(cylX, cylY, cylW, cylH);

  const cylLight = ctx.createLinearGradient(cylX, 0, cylX + cylW, 0);
  cylLight.addColorStop(0.0, 'rgba(0, 0, 0, 0.28)');
  cylLight.addColorStop(0.18, 'rgba(255, 255, 255, 0.16)');
  cylLight.addColorStop(0.32, 'rgba(255, 255, 255, 0.26)');
  cylLight.addColorStop(0.55, 'rgba(0, 0, 0, 0.02)');
  cylLight.addColorStop(0.84, 'rgba(0, 0, 0, 0.24)');
  cylLight.addColorStop(0.95, 'rgba(255, 255, 255, 0.12)');
  cylLight.addColorStop(1.0, 'rgba(0, 0, 0, 0.32)');
  ctx.fillStyle = cylLight;
  ctx.fillRect(cylX, cylY, cylW, cylH);

  const rimGrad = ctx.createLinearGradient(cylX, 0, cylX + cylW, 0);
  rimGrad.addColorStop(0.0, '#475569');
  rimGrad.addColorStop(0.22, '#F1F5F9');
  rimGrad.addColorStop(0.35, '#FFFFFF');
  rimGrad.addColorStop(0.6, '#94A3B8');
  rimGrad.addColorStop(0.85, '#E2E8F0');
  rimGrad.addColorStop(1.0, '#475569');

  if (placement === 'horizontal-base') {
    ctx.fillStyle = rimGrad;
    ctx.fillRect(cylX, cylY + cylH - 26, cylW, 26);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.fillRect(cylX, cylY + cylH - 27, cylW, 2);
  } else {
    ctx.fillStyle = rimGrad;
    ctx.fillRect(cylX, cylY, cylW, 22);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.fillRect(cylX, cylY + 22, cylW, 2);
  }

  const scaleFactor = Math.min(1.45, Math.max(0.55, fontSizePx / 28));
  const extraRotRad = (rotationDeg * Math.PI) / 180;

  ctx.save();
  if (placement === 'vertical-side') {
    ctx.translate(W / 2, H / 2 + 6);
    ctx.rotate(-Math.PI / 2 + extraRotRad);
    const len = cleanText.length;
    const baseSize = len > 10 ? 48 : len > 7 ? 58 : 66;
    drawLaserEngravedText(ctx, cleanText, styleId, Math.round(baseSize * scaleFactor));
  } else {
    ctx.translate(W / 2, H / 2 - 4);
    ctx.rotate(extraRotRad);
    const len = cleanText.length;
    const baseSize = len > 10 ? 52 : len > 7 ? 64 : 74;
    drawLaserEngravedText(ctx, cleanText, styleId, Math.round(baseSize * scaleFactor));
  }
  ctx.restore();

  ctx.restore();

  const url = canvas.toDataURL('image/png');
  previewDataUrlCache[cacheKey] = url;
  return url;
}
