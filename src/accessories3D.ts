import * as THREE from 'three';

export type StrawTopperVariant =
  | 'cap-shield'
  | 'spidey-mask'
  | 'strawberry'
  | 'daisy'
  | 'cloud'
  | 'cat-paw';

export type KeychainVariant =
  | 'holo-star'
  | 'hydrate-beads'
  | 'plush-bear'
  | 'chibi-hero';

export type StrapVariant =
  | 'woven-boho'
  | 'silicone-grip'
  | 'clear-beaded';

export type BootVariant =
  | 'waffle-pink'
  | 'clear-rubber'
  | 'glitter-boot';

export type AccessoryPreviewKey =
  | `topper-${StrawTopperVariant}`
  | `keychain-${KeychainVariant}`
  | `strap-${StrapVariant}`
  | `boot-${BootVariant}`;

export interface AccessoryVariationOption<T extends string> {
  id: T;
  name: string;
  materialTag: string;
  description: string;
  previewKey: AccessoryPreviewKey;
}

export const STRAW_TOPPER_VARIATIONS: AccessoryVariationOption<StrawTopperVariant>[] = [
  {
    id: 'cap-shield',
    name: 'Captain Shield Topper',
    materialTag: '3D Marvel Matte Silicone',
    description: 'Mini Captain America concentric star shield straw cap in matte silicone',
    previewKey: 'topper-cap-shield',
  },
  {
    id: 'spidey-mask',
    name: 'Spider-Man Mask Topper',
    materialTag: '3D Marvel Matte Silicone',
    description: 'Mini Spider-Man web mask straw topper with raised white eye rims',
    previewKey: 'topper-spidey-mask',
  },
  {
    id: 'strawberry',
    name: '3D Strawberry Topper',
    materialTag: 'Food-Grade Matte Silicone',
    description: 'Sweet pastel strawberry silicone cap with leafy green calyx & seed dimples',
    previewKey: 'topper-strawberry',
  },
  {
    id: 'daisy',
    name: 'Blooming Daisy Topper',
    materialTag: 'Food-Grade Matte Silicone',
    description: 'Plump 6-petal white daisy flower with butter-yellow center dome',
    previewKey: 'topper-daisy',
  },
  {
    id: 'cloud',
    name: 'Smiling Cloud Topper',
    materialTag: 'Food-Grade Matte Silicone',
    description: 'Soft puffy cloud straw cap with rosy pastel blush cheeks',
    previewKey: 'topper-cloud',
  },
  {
    id: 'cat-paw',
    name: 'Tiny Cat Paw Topper',
    materialTag: 'Soft-Touch Matte Silicone',
    description: 'Chubby white cat paw with 4 pink silicone toe beans',
    previewKey: 'topper-cat-paw',
  },
];

export const KEYCHAIN_VARIATIONS: AccessoryVariationOption<KeychainVariant>[] = [
  {
    id: 'holo-star',
    name: 'Holographic Star Charm',
    materialTag: 'Clear Acrylic + Silver Clasp',
    description: 'Holographic clear acrylic star charm with a polished metallic silver clasp',
    previewKey: 'keychain-holo-star',
  },
  {
    id: 'hydrate-beads',
    name: '"HYDRATE" Beaded Charm',
    materialTag: 'Pastel Beads + Letter Cubes',
    description: 'Beaded pastel charm strap with white cube beads spelling "HYDRATE"',
    previewKey: 'keychain-hydrate-beads',
  },
  {
    id: 'plush-bear',
    name: 'Mini Plush Bear Keychain',
    materialTag: 'Flocked Plush + Brass Ring',
    description: 'Cozy miniature teddy bear charm with a shiny metallic brass split ring',
    previewKey: 'keychain-plush-bear',
  },
  {
    id: 'chibi-hero',
    name: 'Chibi Superhero Acrylic',
    materialTag: 'Double-Layer Clear Acrylic',
    description: 'Chibi Iron-Hero helmet emblem encased in crystal-clear glossy acrylic',
    previewKey: 'keychain-chibi-hero',
  },
];

export const STRAP_VARIATIONS: AccessoryVariationOption<StrapVariant>[] = [
  {
    id: 'woven-boho',
    name: 'Woven Boho Shoulder Strap',
    materialTag: 'Woven Macrame + Carabiner Clips',
    description: 'Woven boho fabric strap with sturdy polished metal carabiner clips',
    previewKey: 'strap-woven-boho',
  },
  {
    id: 'silicone-grip',
    name: 'Ergonomic Silicone Side-Grip',
    materialTag: 'Molded Matte Pastel Silicone',
    description: 'Contoured pastel silicone side-handle grip with ribbed finger grooves',
    previewKey: 'strap-silicone-grip',
  },
  {
    id: 'clear-beaded',
    name: 'Clear Beaded Hand Wristlet',
    materialTag: 'Crystal Acrylic Spheres',
    description: 'Iridescent clear acrylic bead wristlet loop with silver swivel clasps',
    previewKey: 'strap-clear-beaded',
  },
];

export const BOOT_VARIATIONS: AccessoryVariationOption<BootVariant>[] = [
  {
    id: 'waffle-pink',
    name: 'Waffle Pastel Pink Boot',
    materialTag: 'Waffle-Textured Matte Silicone',
    description: '3D waffle-grid embossed protective silicone bottom boot in pastel pink',
    previewKey: 'boot-waffle-pink',
  },
  {
    id: 'clear-rubber',
    name: 'Clear Anti-Slip Rubber Sleeve',
    materialTag: 'Optical Transparent Elastomer',
    description: 'Crystal-clear transparent anti-slip silicone bumper sleeve',
    previewKey: 'boot-clear-rubber',
  },
  {
    id: 'glitter-boot',
    name: 'Glitter-Infused Translucent Boot',
    materialTag: 'Sparkle Flake Silicone Base',
    description: 'Translucent pastel silicone boot infused with holographic star glitter',
    previewKey: 'boot-glitter-boot',
  },
];

let cachedWovenStrapTex: THREE.CanvasTexture | null = null;
let cachedFauxLeatherTex: THREE.CanvasTexture | null = null;
let cachedWaffleBumpTex: THREE.CanvasTexture | null = null;
let cachedGlitterTex: THREE.CanvasTexture | null = null;

/**
 * Generates a realistic braided/woven boho fabric texture
 */
export function getWovenFabricTexture(): THREE.CanvasTexture {
  if (cachedWovenStrapTex) return cachedWovenStrapTex;

  const w = 128;
  const h = 128;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#F3ECE3';
    ctx.fillRect(0, 0, w, h);

    const step = 8;
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const isOdd = (x / step + y / step) % 2 === 0;
        ctx.fillStyle = isOdd ? '#E6DDD2' : '#FAF6F0';
        ctx.fillRect(x, y, step - 1, step - 1);
        ctx.fillStyle = 'rgba(120, 95, 75, 0.16)';
        ctx.fillRect(x, y + step - 1, step, 1);
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  cachedWovenStrapTex = tex;
  return tex;
}

/**
 * Generates a subtle pebble-grain faux-leather texture
 */
export function getFauxLeatherTexture(): THREE.CanvasTexture {
  if (cachedFauxLeatherTex) return cachedFauxLeatherTex;

  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#D6A98A';
    ctx.fillRect(0, 0, size, size);
    let seed = 42;
    for (let i = 0; i < 900; i++) {
      seed = (seed * 16807) % 2147483647;
      const x = seed % size;
      const y = (seed >> 7) % size;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(80,45,25,0.12)';
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.colorSpace = THREE.SRGBColorSpace;
  cachedFauxLeatherTex = tex;
  return tex;
}

/**
 * Generates a 3D waffle-grid bump & color map for the Waffle-Patterned Silicone Boot
 */
export function getWaffleSiliconeTexture(): THREE.CanvasTexture {
  if (cachedWaffleBumpTex) return cachedWaffleBumpTex;

  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#d4d4d8';
    ctx.fillRect(0, 0, size, size);
    const cell = 16;
    for (let y = 0; y < size; y += cell) {
      for (let x = 0; x < size; x += cell) {
        ctx.fillStyle = '#71717a';
        ctx.beginPath();
        ctx.roundRect(x + 2, y + 2, cell - 4, cell - 4, 3);
        ctx.fill();
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(12, 3);
  cachedWaffleBumpTex = tex;
  return tex;
}

/**
 * Generates a holographic sparkle-flake texture for the Glitter-Infused Translucent Boot
 */
export function getGlitterSiliconeTexture(): THREE.CanvasTexture {
  if (cachedGlitterTex) return cachedGlitterTex;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#FCE7F3';
    ctx.fillRect(0, 0, size, size);
    const colors = ['#FFFFFF', '#67E8F9', '#FDE047', '#F472B6', '#C084FC'];
    let seed = 9001;
    for (let i = 0; i < 420; i++) {
      seed = (seed * 16807) % 2147483647;
      const x = seed % size;
      const y = (seed >> 8) % size;
      const r = 1 + (seed % 3);
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  cachedGlitterTex = tex;
  return tex;
}

/**
 * Renders ultra-realistic 3D Octane-style product thumbnails for all 16 accessory variations
 * arranged neatly on a solid plain white background (#FFFFFF) with clean studio reflections.
 */
const accessoryPreviewCache: Record<string, string> = {};

export function getAccessoryStudioPreviewUrl(
  type: AccessoryPreviewKey,
  bootColorHex = '#F8C8DC'
): string {
  const cacheKey = `${type}-${bootColorHex}`;
  if (accessoryPreviewCache[cacheKey]) return accessoryPreviewCache[cacheKey];

  const canvas = document.createElement('canvas');
  canvas.width = 280;
  canvas.height = 280;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Solid plain white background (#FFFFFF) with zero dark floor shadows
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 280, 280);

  ctx.save();
  ctx.translate(140, 140);

  // Helper for common silicone plug base on straw toppers
  const drawSiliconeTopperSleeve = (hexTop: string, hexBot: string) => {
    const g = ctx.createLinearGradient(-20, 24, 20, 72);
    g.addColorStop(0, hexTop);
    g.addColorStop(1, hexBot);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(-20, 28, 40, 40, 8);
    ctx.fill();

    ctx.strokeStyle = hexBot;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(22, 48, 15, -Math.PI * 0.45, Math.PI * 0.55);
    ctx.stroke();
  };

  switch (type) {
    // =========================================================================
    // 1. STRAW TOPPERS (6 VARIATIONS)
    // =========================================================================
    case 'topper-cap-shield': {
      drawSiliconeTopperSleeve('#60A5FA', '#2563EB');
      const rings: [number, string][] = [
        [44, '#EF4444'],
        [34, '#F8FAFC'],
        [24, '#EF4444'],
        [15, '#1D4ED8'],
      ];
      rings.forEach(([r, col]) => {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(0, -10, r, 0, Math.PI * 2);
        ctx.fill();
      });
      // 3D Star in center
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const rad = i % 2 === 0 ? 13 : 5.5;
        const a = (i * Math.PI) / 5 - Math.PI / 2;
        if (i === 0) ctx.moveTo(Math.cos(a) * rad, -10 + Math.sin(a) * rad);
        else ctx.lineTo(Math.cos(a) * rad, -10 + Math.sin(a) * rad);
      }
      ctx.closePath();
      ctx.fill();
      // Studio specular highlight
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.beginPath();
      ctx.ellipse(-14, -26, 18, 8, -0.45, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'topper-spidey-mask': {
      drawSiliconeTopperSleeve('#F43F5E', '#BE123C');
      const spideyGrad = ctx.createRadialGradient(-12, -24, 6, 0, -10, 46);
      spideyGrad.addColorStop(0, '#FB7185');
      spideyGrad.addColorStop(0.5, '#E11D48');
      spideyGrad.addColorStop(1, '#881337');
      ctx.fillStyle = spideyGrad;
      ctx.beginPath();
      ctx.ellipse(0, -10, 38, 42, 0, 0, Math.PI * 2);
      ctx.fill();

      // Web lines
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -52);
      ctx.lineTo(0, 32);
      ctx.moveTo(-38, -10);
      ctx.lineTo(38, -10);
      ctx.arc(0, -10, 20, 0, Math.PI * 2);
      ctx.stroke();

      // Big 3D Silicone Spidey Eyes
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.ellipse(-14, -12, 11, 16, -0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(14, -12, 11, 16, 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'topper-strawberry': {
      drawSiliconeTopperSleeve('#FDA4AF', '#E11D48');
      const berryGrad = ctx.createRadialGradient(-16, -26, 6, 0, -8, 56);
      berryGrad.addColorStop(0, '#FECDD3');
      berryGrad.addColorStop(0.4, '#FB7185');
      berryGrad.addColorStop(1, '#BE123C');
      ctx.fillStyle = berryGrad;
      ctx.beginPath();
      ctx.moveTo(0, 34);
      ctx.bezierCurveTo(-50, 14, -48, -38, 0, -36);
      ctx.bezierCurveTo(48, -38, 50, 14, 0, 34);
      ctx.fill();

      ctx.fillStyle = '#FEF08A';
      [
        [-16, -12],
        [16, -12],
        [0, -2],
        [-18, 8],
        [18, 8],
        [0, 18],
      ].forEach(([sx, sy]) => {
        ctx.beginPath();
        ctx.ellipse(sx, sy, 3, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = '#34D399';
      [-18, 0, 18].forEach((lx, i) => {
        ctx.beginPath();
        ctx.ellipse(lx, -38, 16, 8, (i - 1) * 0.35, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    case 'topper-daisy': {
      drawSiliconeTopperSleeve('#6EE7B7', '#10B981');
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2;
        const px = Math.cos(ang) * 30;
        const py = Math.sin(ang) * 30 - 10;
        const pGrad = ctx.createRadialGradient(px - 5, py - 5, 2, px, py, 24);
        pGrad.addColorStop(0, '#FFFFFF');
        pGrad.addColorStop(0.7, '#F1F5F9');
        pGrad.addColorStop(1, '#CBD5E1');
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(px, py, 21, 0, Math.PI * 2);
        ctx.fill();
      }
      const cGrad = ctx.createRadialGradient(-6, -16, 4, 0, -10, 22);
      cGrad.addColorStop(0, '#FEF08A');
      cGrad.addColorStop(1, '#EAB308');
      ctx.fillStyle = cGrad;
      ctx.beginPath();
      ctx.arc(0, -10, 20, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'topper-cloud': {
      drawSiliconeTopperSleeve('#93C5FD', '#3B82F6');
      const cloudGrad = ctx.createRadialGradient(-14, -22, 8, 0, -4, 62);
      cloudGrad.addColorStop(0, '#FFFFFF');
      cloudGrad.addColorStop(0.65, '#EFF6FF');
      cloudGrad.addColorStop(1, '#BFDBFE');
      ctx.fillStyle = cloudGrad;
      ctx.beginPath();
      ctx.arc(-28, 2, 22, 0, Math.PI * 2);
      ctx.arc(-6, -16, 27, 0, Math.PI * 2);
      ctx.arc(20, -8, 23, 0, Math.PI * 2);
      ctx.arc(30, 6, 18, 0, Math.PI * 2);
      ctx.roundRect(-32, -2, 66, 26, 12);
      ctx.fill();

      ctx.fillStyle = '#F472B6';
      ctx.beginPath();
      ctx.ellipse(-15, 6, 6, 3.5, 0, 0, Math.PI * 2);
      ctx.ellipse(15, 6, 6, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'topper-cat-paw': {
      drawSiliconeTopperSleeve('#FBCFE8', '#EC4899');
      // Chubby white silicone cat paw
      const pawGrad = ctx.createRadialGradient(-10, -20, 8, 0, -8, 52);
      pawGrad.addColorStop(0, '#FFFFFF');
      pawGrad.addColorStop(0.7, '#F8FAFC');
      pawGrad.addColorStop(1, '#E2E8F0');
      ctx.fillStyle = pawGrad;
      ctx.beginPath();
      ctx.arc(0, -4, 34, 0, Math.PI * 2);
      ctx.arc(-26, -24, 16, 0, Math.PI * 2);
      ctx.arc(-9, -36, 16, 0, Math.PI * 2);
      ctx.arc(10, -36, 16, 0, Math.PI * 2);
      ctx.arc(26, -24, 16, 0, Math.PI * 2);
      ctx.fill();

      // Pink silicone toe beans & central pad
      ctx.fillStyle = '#F472B6';
      ctx.beginPath();
      ctx.ellipse(0, 2, 16, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      [
        [-23, -21],
        [-8, -32],
        [9, -32],
        [23, -21],
      ].forEach(([bx, by]) => {
        ctx.beginPath();
        ctx.ellipse(bx, by, 6.5, 8.5, 0, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    // =========================================================================
    // 2. KEYCHAINS & CHARMS (4 VARIATIONS)
    // =========================================================================
    case 'keychain-holo-star': {
      // Polished silver clasp
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(0, -76, 18, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, -48, 10, 0, Math.PI * 2);
      ctx.stroke();

      // Clear acrylic outer star slab
      const holoGrad = ctx.createLinearGradient(-46, -20, 46, 70);
      holoGrad.addColorStop(0, '#67E8F9');
      holoGrad.addColorStop(0.5, '#F9A8D4');
      holoGrad.addColorStop(1, '#FDE047');

      ctx.fillStyle = 'rgba(226, 232, 240, 0.55)';
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? 54 : 27;
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, 18 + Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, 18 + Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = holoGrad;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? 42 : 20;
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, 18 + Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, 18 + Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'keychain-hydrate-beads': {
      // Silver clasp at top
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(0, -92, 14, 0, Math.PI * 2);
      ctx.stroke();

      const letters = ['H', 'Y', 'D', 'R', 'A', 'T', 'E'];
      const beadColors = ['#F9A8D4', '#93C5FD', '#A7F3D0', '#FDE047', '#C4B5FD', '#FDBA74', '#F9A8D4'];
      letters.forEach((ch, idx) => {
        const by = -62 + idx * 22;
        // Pastel round beads on sides + white cube letter bead in center
        ctx.fillStyle = beadColors[idx];
        ctx.beginPath();
        ctx.arc(-22, by, 8, 0, Math.PI * 2);
        ctx.arc(22, by, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-11, by - 9, 22, 18, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#EC4899';
        ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ch, 0, by);
      });
      break;
    }

    case 'keychain-plush-bear': {
      // Brass ring at top
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(0, -76, 18, 0, Math.PI * 2);
      ctx.stroke();

      // Teddy bear ears, head, and body
      const bearGrad = ctx.createRadialGradient(-10, -10, 6, 0, 10, 58);
      bearGrad.addColorStop(0, '#FDE68A');
      bearGrad.addColorStop(0.5, '#D97706');
      bearGrad.addColorStop(1, '#92400E');
      ctx.fillStyle = bearGrad;
      ctx.beginPath();
      ctx.arc(-28, -28, 16, 0, Math.PI * 2);
      ctx.arc(28, -28, 16, 0, Math.PI * 2);
      ctx.arc(0, -6, 36, 0, Math.PI * 2);
      ctx.ellipse(0, 42, 30, 28, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cream muzzle & tummy
      ctx.fillStyle = '#FEF3C7';
      ctx.beginPath();
      ctx.ellipse(0, 2, 14, 11, 0, 0, Math.PI * 2);
      ctx.ellipse(0, 42, 18, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eyes & nose
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.arc(-13, -10, 4, 0, Math.PI * 2);
      ctx.arc(13, -10, 4, 0, Math.PI * 2);
      ctx.ellipse(0, -1, 5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'keychain-chibi-hero': {
      // Gold clasp
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(0, -76, 18, 0, Math.PI * 2);
      ctx.stroke();

      // Clear acrylic shield backing
      ctx.fillStyle = 'rgba(226, 232, 240, 0.6)';
      ctx.beginPath();
      ctx.roundRect(-44, -36, 88, 98, 28);
      ctx.fill();

      // Chibi Iron-Hero Helmet inside acrylic
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.roundRect(-32, -24, 64, 74, 22);
      ctx.fill();

      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.roundRect(-24, -8, 48, 46, 12);
      ctx.fill();

      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.roundRect(-18, 4, 14, 7, 2);
      ctx.roundRect(4, 4, 14, 7, 2);
      ctx.fill();
      break;
    }

    // =========================================================================
    // 3. CARRYING STRAPS & HANDLES (3 VARIATIONS)
    // =========================================================================
    case 'strap-woven-boho': {
      for (let i = 0; i < 14; i++) {
        const t = i / 13;
        const angle = Math.PI + t * Math.PI;
        const bx = Math.cos(angle) * 68;
        const by = Math.sin(angle) * 60 + 22;
        ctx.fillStyle = i % 2 === 0 ? '#E6DDD2' : '#FAF6F0';
        ctx.strokeStyle = '#D6C7B8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(bx, by, 15, 11, angle + Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      // Sturdy metal carabiner clips on both ends
      [-68, 68].forEach((lx) => {
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.roundRect(lx - 12, 24, 24, 38, 12);
        ctx.stroke();
      });
      break;
    }

    case 'strap-silicone-grip': {
      // Ergonomic pastel silicone side-handle grip
      const gripGrad = ctx.createLinearGradient(-45, -75, 45, 75);
      gripGrad.addColorStop(0, '#FBCFE8');
      gripGrad.addColorStop(0.5, '#F472B6');
      gripGrad.addColorStop(1, '#DB2777');
      ctx.strokeStyle = gripGrad;
      ctx.lineWidth = 24;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(-36, -68);
      ctx.lineTo(24, -68);
      ctx.quadraticCurveTo(48, -68, 48, -40);
      ctx.lineTo(44, 42);
      ctx.quadraticCurveTo(42, 68, 18, 68);
      ctx.lineTo(-36, 68);
      ctx.stroke();
      break;
    }

    case 'strap-clear-beaded': {
      // Clear beaded hand wristlet strap (14 iridescent spheres in loop)
      const count = 14;
      for (let i = 0; i < count; i++) {
        const ang = (i / count) * Math.PI * 2;
        const bx = Math.cos(ang) * 56;
        const by = Math.sin(ang) * 66;
        const bGrad = ctx.createRadialGradient(bx - 5, by - 5, 2, bx, by, 16);
        bGrad.addColorStop(0, '#FFFFFF');
        bGrad.addColorStop(0.5, '#E0F2FE');
        bGrad.addColorStop(0.85, '#F5D0FE');
        bGrad.addColorStop(1, '#94A3B8');
        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.arc(bx, by, 15, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    // =========================================================================
    // 4. PROTECTIVE SILICONE BOOTS / BASES (3 VARIATIONS)
    // =========================================================================
    case 'boot-waffle-pink': {
      ctx.fillStyle = '#F472B6';
      ctx.beginPath();
      ctx.roundRect(-64, -24, 128, 88, [8, 8, 26, 26]);
      ctx.fill();

      // Waffle grid pattern
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 2;
      for (let x = -52; x <= 52; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, -12);
        ctx.lineTo(x, 58);
        ctx.stroke();
      }
      for (let y = 0; y <= 50; y += 16) {
        ctx.beginPath();
        ctx.moveTo(-58, y);
        ctx.lineTo(58, y);
        ctx.stroke();
      }

      ctx.fillStyle = '#FBCFE8';
      ctx.beginPath();
      ctx.ellipse(0, -24, 64, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'boot-clear-rubber': {
      const clearGrad = ctx.createLinearGradient(-64, 0, 64, 0);
      clearGrad.addColorStop(0, 'rgba(148, 163, 184, 0.45)');
      clearGrad.addColorStop(0.3, 'rgba(241, 245, 249, 0.75)');
      clearGrad.addColorStop(0.7, 'rgba(226, 232, 240, 0.55)');
      clearGrad.addColorStop(1, 'rgba(100, 116, 139, 0.45)');
      ctx.fillStyle = clearGrad;
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(-64, -24, 128, 88, [8, 8, 26, 26]);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, -24, 64, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'boot-glitter-boot':
    default: {
      const glitGrad = ctx.createLinearGradient(-64, -24, 64, 64);
      glitGrad.addColorStop(0, '#F5D0FE');
      glitGrad.addColorStop(0.5, '#FBCFE8');
      glitGrad.addColorStop(1, '#BAE6FD');
      ctx.fillStyle = glitGrad;
      ctx.beginPath();
      ctx.roundRect(-64, -24, 128, 88, [8, 8, 26, 26]);
      ctx.fill();

      // Sparkle flakes
      const flakeCols = ['#FFFFFF', '#FDE047', '#38BDF8', '#EC4899'];
      for (let i = 0; i < 28; i++) {
        const fx = -50 + ((i * 37) % 100);
        const fy = -8 + ((i * 23) % 62);
        ctx.fillStyle = flakeCols[i % flakeCols.length];
        ctx.beginPath();
        ctx.arc(fx, fy, (i % 3) + 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#FAE8FF';
      ctx.beginPath();
      ctx.ellipse(0, -24, 64, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }

  ctx.restore();

  const dataUrl = canvas.toDataURL('image/png');
  accessoryPreviewCache[cacheKey] = dataUrl;
  return dataUrl;
}
