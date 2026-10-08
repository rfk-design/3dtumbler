import * as THREE from 'three';

export type StickerCategory =
  | 'calligraphy'
  | 'heroes'
  | 'anime'
  | 'glitter'
  | 'characters'
  | 'nature'
  | 'objects'
  | 'text';

export type CalligraphyStyleId =
  | 'modern-soft-script'
  | 'minimalist-fine-cursive'
  | 'playful-brush'
  | 'minimalist-serif';

export type CalligraphyOrnamentId =
  | 'stars'
  | 'floral-vines'
  | 'mini-hearts'
  | 'butterfly';

export interface StickerOption {
  id: string;
  name: string;
  category: StickerCategory;
  badgeText?: string;
  subText?: string;
  calligraphyStyle?: CalligraphyStyleId;
  ornament?: CalligraphyOrnamentId;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  previewSvg: string;
}

export interface PlacedSticker extends StickerOption {
  uid: string;
  x: number; // Texture X (0..2048)
  y: number; // Texture Y (0..2048)
  scale: number;
  // Cylindrical coordinates on the tumbler body for curved 3D mesh hugging
  theta?: number;
  yLocal?: number;
  radiusTopAtY?: number;
  radiusBotAtY?: number;
  slopeAngle?: number;
}

/**
 * 44 Diverse 2D Vector Die-Cut Stickers on a Huge Pop-Culture & Aesthetic Sticker Sheet
 * Organized across all requested themes:
 * - Marvel & Superhero Theme (`heroes`)
 * - Anime & Gaming Theme (`anime`)
 * - Glitter & Magical Sparkles (`glitter`)
 * - Cute Animals & Characters (`characters`)
 * - Nature & Aesthetic (`nature`)
 * - Pop Culture & Typography (`objects` & `text`)
 */
export const AESTHETIC_STICKERS: StickerOption[] = [
  // =========================================================================
  // 00. CUSTOM NAME & CALLIGRAPHY TYPOGRAPHY SHEET
  // =========================================================================
  {
    id: 'cal-jessica',
    name: 'Jessica (Soft Script)',
    category: 'calligraphy',
    badgeText: 'Jessica',
    calligraphyStyle: 'modern-soft-script',
    ornament: 'stars',
    primaryColor: '#F472B6',
    secondaryColor: '#D97757',
    accentColor: '#9D174D',
    previewSvg: 'calligraphy-decal',
  },
  {
    id: 'cal-aria',
    name: 'Aria (Fine Line Cursive)',
    category: 'calligraphy',
    badgeText: 'Aria',
    calligraphyStyle: 'minimalist-fine-cursive',
    ornament: 'floral-vines',
    primaryColor: '#1E293B',
    secondaryColor: '#94A3B8',
    accentColor: '#0F172A',
    previewSvg: 'calligraphy-decal',
  },
  {
    id: 'cal-sophia',
    name: 'Sophia (Rose Gold Script)',
    category: 'calligraphy',
    badgeText: 'Sophia',
    calligraphyStyle: 'modern-soft-script',
    ornament: 'butterfly',
    primaryColor: '#FB7185',
    secondaryColor: '#E0A96D',
    accentColor: '#BE123C',
    previewSvg: 'calligraphy-decal',
  },
  {
    id: 'cal-oliver',
    name: 'Oliver (Minimalist Serif)',
    category: 'calligraphy',
    badgeText: 'Oliver',
    calligraphyStyle: 'minimalist-serif',
    ornament: 'stars',
    primaryColor: '#334155',
    secondaryColor: '#CBD5E1',
    accentColor: '#0F172A',
    previewSvg: 'calligraphy-decal',
  },
  {
    id: 'cal-chloe',
    name: 'Chloe (Playful Brush)',
    category: 'calligraphy',
    badgeText: 'Chloe',
    calligraphyStyle: 'playful-brush',
    ornament: 'mini-hearts',
    primaryColor: '#C084FC',
    secondaryColor: '#F3E8FF',
    accentColor: '#6B21A8',
    previewSvg: 'calligraphy-decal',
  },
  {
    id: 'cal-liam',
    name: 'Liam (Fine Ink Cursive)',
    category: 'calligraphy',
    badgeText: 'Liam',
    calligraphyStyle: 'minimalist-fine-cursive',
    ornament: 'stars',
    primaryColor: '#1E293B',
    secondaryColor: '#64748B',
    accentColor: '#0F172A',
    previewSvg: 'calligraphy-decal',
  },
  {
    id: 'cal-maya',
    name: 'Maya (Soft Rose Script)',
    category: 'calligraphy',
    badgeText: 'Maya',
    calligraphyStyle: 'modern-soft-script',
    ornament: 'floral-vines',
    primaryColor: '#F472B6',
    secondaryColor: '#E29578',
    accentColor: '#9D174D',
    previewSvg: 'calligraphy-decal',
  },
  {
    id: 'cal-bloom',
    name: 'Bloom Gracefully',
    category: 'calligraphy',
    badgeText: 'Bloom',
    calligraphyStyle: 'modern-soft-script',
    ornament: 'butterfly',
    primaryColor: '#FB7185',
    secondaryColor: '#D97757',
    accentColor: '#9F1239',
    previewSvg: 'calligraphy-decal',
  },
  {
    id: 'cal-serenity',
    name: 'Serenity (Fine Line)',
    category: 'calligraphy',
    badgeText: 'Serenity',
    calligraphyStyle: 'minimalist-fine-cursive',
    ornament: 'floral-vines',
    primaryColor: '#1E293B',
    secondaryColor: '#64748B',
    accentColor: '#0F172A',
    previewSvg: 'calligraphy-decal',
  },
  {
    id: 'cal-golden-hour',
    name: 'Golden Hour (Brush)',
    category: 'calligraphy',
    badgeText: 'Golden',
    calligraphyStyle: 'playful-brush',
    ornament: 'stars',
    primaryColor: '#F59E0B',
    secondaryColor: '#FEF3C7',
    accentColor: '#B45309',
    previewSvg: 'calligraphy-decal',
  },
  {
    id: 'cal-beloved',
    name: 'Beloved (Heart Swash)',
    category: 'calligraphy',
    badgeText: 'Beloved',
    calligraphyStyle: 'modern-soft-script',
    ornament: 'mini-hearts',
    primaryColor: '#EC4899',
    secondaryColor: '#D97757',
    accentColor: '#831843',
    previewSvg: 'calligraphy-decal',
  },
  {
    id: 'cal-radiant',
    name: 'Radiant Soul (Serif)',
    category: 'calligraphy',
    badgeText: 'Radiant',
    calligraphyStyle: 'minimalist-serif',
    ornament: 'butterfly',
    primaryColor: '#475569',
    secondaryColor: '#E2E8F0',
    accentColor: '#1E293B',
    previewSvg: 'calligraphy-decal',
  },

  // =========================================================================
  // 0A. MARVEL & SUPERHERO THEME
  // =========================================================================
  {
    id: 'chibi-ironman',
    name: 'Chibi Iron Man Helmet',
    category: 'heroes',
    primaryColor: '#EF4444',
    secondaryColor: '#FACC15',
    accentColor: '#38BDF8',
    previewSvg: 'chibi-ironman',
  },
  {
    id: 'cap-shield',
    name: 'Captain Shield Star',
    category: 'heroes',
    primaryColor: '#EF4444',
    secondaryColor: '#3B82F6',
    accentColor: '#FFFFFF',
    previewSvg: 'cap-shield',
  },
  {
    id: 'peeking-spidey',
    name: 'Tiny Peeking Spidey',
    category: 'heroes',
    primaryColor: '#E11D48',
    secondaryColor: '#2563EB',
    accentColor: '#FFFFFF',
    previewSvg: 'peeking-spidey',
  },
  {
    id: 'thor-mjolnir',
    name: 'Mjolnir Cute Lightning',
    category: 'heroes',
    primaryColor: '#94A3B8',
    secondaryColor: '#38BDF8',
    accentColor: '#FACC15',
    previewSvg: 'thor-mjolnir',
  },
  {
    id: 'waving-groot',
    name: 'Friendly Waving Groot',
    category: 'heroes',
    primaryColor: '#A16207',
    secondaryColor: '#4ADE80',
    accentColor: '#FEF3C7',
    previewSvg: 'waving-groot',
  },

  // =========================================================================
  // 0B. ANIME & GAMING THEME
  // =========================================================================
  {
    id: 'mini-pokeball',
    name: 'Mini Anime Pokeball',
    category: 'anime',
    primaryColor: '#EF4444',
    secondaryColor: '#FFFFFF',
    accentColor: '#1E293B',
    previewSvg: 'mini-pokeball',
  },
  {
    id: 'pixel-heart',
    name: '8-Bit Pixel Heart',
    category: 'anime',
    primaryColor: '#F43F5E',
    secondaryColor: '#FDA4AF',
    accentColor: '#881337',
    previewSvg: 'pixel-heart',
  },
  {
    id: 'game-controller',
    name: 'Cute Gamepad Controller',
    category: 'anime',
    primaryColor: '#A78BFA',
    secondaryColor: '#F3E8FF',
    accentColor: '#EC4899',
    previewSvg: 'game-controller',
  },
  {
    id: 'floating-ghost',
    name: 'Tiny Floating Ghost',
    category: 'anime',
    primaryColor: '#E0E7FF',
    secondaryColor: '#FFFFFF',
    accentColor: '#6366F1',
    previewSvg: 'floating-ghost',
  },
  {
    id: 'arcade-cabinet',
    name: 'Retro Arcade Machine',
    category: 'anime',
    primaryColor: '#EC4899',
    secondaryColor: '#38BDF8',
    accentColor: '#FACC15',
    previewSvg: 'arcade-cabinet',
  },

  // =========================================================================
  // 0C. GLITTER & MAGICAL SPARKLES
  // =========================================================================
  {
    id: 'sparkling-stars',
    name: '4-Point Shining Stars',
    category: 'glitter',
    primaryColor: '#FDE047',
    secondaryColor: '#FEF9C3',
    accentColor: '#CA8A04',
    previewSvg: 'sparkling-stars',
  },
  {
    id: 'galaxy-cluster',
    name: 'Pastel Galaxy Cluster',
    category: 'glitter',
    primaryColor: '#C084FC',
    secondaryColor: '#38BDF8',
    accentColor: '#FDE047',
    previewSvg: 'galaxy-cluster',
  },
  {
    id: 'sparkling-moon',
    name: 'Sparkling Crescent Moon',
    category: 'glitter',
    primaryColor: '#FDE047',
    secondaryColor: '#F472B6',
    accentColor: '#60A5FA',
    previewSvg: 'sparkling-moon',
  },
  {
    id: 'holo-burst',
    name: 'Holographic 8-Pt Burst',
    category: 'glitter',
    primaryColor: '#67E8F9',
    secondaryColor: '#F9A8D4',
    accentColor: '#FDE047',
    previewSvg: 'holo-burst',
  },

  // =========================================================================
  // 1. CUTE CHARACTERS & ANIMALS
  // =========================================================================
  {
    id: 'chubby-cat',
    name: 'Sleeping Chubby Cat',
    category: 'characters',
    primaryColor: '#FDBA74',
    secondaryColor: '#FFF7ED',
    accentColor: '#9A3412',
    previewSvg: 'chubby-cat',
  },
  {
    id: 'tiny-bunny',
    name: 'Tiny Pastel Bunny',
    category: 'characters',
    primaryColor: '#F9A8D4',
    secondaryColor: '#FDF2F8',
    accentColor: '#9D174D',
    previewSvg: 'tiny-bunny',
  },
  {
    id: 'shiba-inu',
    name: 'Happy Shiba Inu',
    category: 'characters',
    primaryColor: '#F59E0B',
    secondaryColor: '#FEF3C7',
    accentColor: '#78350F',
    previewSvg: 'shiba-inu',
  },
  {
    id: 'cute-panda',
    name: 'Sweet Bamboo Panda',
    category: 'characters',
    primaryColor: '#334155',
    secondaryColor: '#F8FAFC',
    accentColor: '#10B981',
    previewSvg: 'cute-panda',
  },
  {
    id: 'baby-koala',
    name: 'Cozy Baby Koala',
    category: 'characters',
    primaryColor: '#94A3B8',
    secondaryColor: '#F1F5F9',
    accentColor: '#475569',
    previewSvg: 'baby-koala',
  },
  {
    id: 'baby-bear',
    name: 'Honey Baby Bear',
    category: 'characters',
    primaryColor: '#D97706',
    secondaryColor: '#FEF3C7',
    accentColor: '#78350F',
    previewSvg: 'baby-bear',
  },

  // =========================================================================
  // 2. NATURE & BOTANY
  // =========================================================================
  {
    id: 'smiling-daisy',
    name: 'Smiling Daisy Flower',
    category: 'nature',
    primaryColor: '#FACC15',
    secondaryColor: '#FFFFFF',
    accentColor: '#854D0E',
    previewSvg: 'smiling-daisy',
  },
  {
    id: 'monstera-leaf',
    name: 'Sage Monstera Leaf',
    category: 'nature',
    primaryColor: '#6EE7B7',
    secondaryColor: '#ECFDF5',
    accentColor: '#065F46',
    previewSvg: 'monstera-leaf',
  },
  {
    id: 'potted-cactus',
    name: 'Mini Potted Cactus',
    category: 'nature',
    primaryColor: '#34D399',
    secondaryColor: '#FDBA74',
    accentColor: '#065F46',
    previewSvg: 'potted-cactus',
  },
  {
    id: 'pastel-mushroom',
    name: 'Pastel Toadstool',
    category: 'nature',
    primaryColor: '#FB7185',
    secondaryColor: '#FFF1F2',
    accentColor: '#881337',
    previewSvg: 'pastel-mushroom',
  },
  {
    id: 'pastel-rainbow',
    name: 'Soft Pastel Rainbow',
    category: 'nature',
    primaryColor: '#F472B6',
    secondaryColor: '#93C5FD',
    accentColor: '#FDE047',
    previewSvg: 'pastel-rainbow',
  },
  {
    id: 'smiling-cloud',
    name: 'Dreamy Smiling Cloud',
    category: 'nature',
    primaryColor: '#93C5FD',
    secondaryColor: '#EFF6FF',
    accentColor: '#1E40AF',
    previewSvg: 'smiling-cloud',
  },
  {
    id: 'cool-sun',
    name: 'Sunny Sunglasses',
    category: 'nature',
    primaryColor: '#FDE047',
    secondaryColor: '#FEF9C3',
    accentColor: '#B45309',
    previewSvg: 'cool-sun',
  },
  {
    id: 'strawberry-berry',
    name: 'Sweet Strawberry',
    category: 'nature',
    primaryColor: '#FB7185',
    secondaryColor: '#FFE4E6',
    accentColor: '#15803D',
    previewSvg: 'strawberry-berry',
  },
  {
    id: 'watermelon-slice',
    name: 'Summer Watermelon',
    category: 'nature',
    primaryColor: '#F43F5E',
    secondaryColor: '#86EFAC',
    accentColor: '#14532D',
    previewSvg: 'watermelon-slice',
  },

  // =========================================================================
  // 3. POPULAR & EVERYDAY OBJECTS
  // =========================================================================
  {
    id: 'boba-cup',
    name: 'Brown Sugar Boba',
    category: 'objects',
    primaryColor: '#FDBA74',
    secondaryColor: '#FFEDD5',
    accentColor: '#431407',
    previewSvg: 'boba-cup',
  },
  {
    id: 'mini-tumbler',
    name: 'Mini Pastel Tumbler',
    category: 'objects',
    primaryColor: '#F9A8D4',
    secondaryColor: '#FCE7F3',
    accentColor: '#9D174D',
    previewSvg: 'mini-tumbler',
  },
  {
    id: 'retro-camera',
    name: 'Retro Film Camera',
    category: 'objects',
    primaryColor: '#93C5FD',
    secondaryColor: '#F1F5F9',
    accentColor: '#1E3A8A',
    previewSvg: 'retro-camera',
  },
  {
    id: 'pastel-headphones',
    name: 'Lo-Fi Headphones',
    category: 'objects',
    primaryColor: '#C4B5FD',
    secondaryColor: '#F5F3FF',
    accentColor: '#4C1D95',
    previewSvg: 'pastel-headphones',
  },
  {
    id: 'diary-book',
    name: 'Heart Diary Notebook',
    category: 'objects',
    primaryColor: '#FDA4AF',
    secondaryColor: '#FFF1F2',
    accentColor: '#9F1239',
    previewSvg: 'diary-book',
  },
  {
    id: 'vinyl-record',
    name: 'Retro Vinyl Record',
    category: 'objects',
    primaryColor: '#1E293B',
    secondaryColor: '#F472B6',
    accentColor: '#FACC15',
    previewSvg: 'vinyl-record',
  },
  {
    id: 'pizza-slice',
    name: 'Cheesy Pizza Slice',
    category: 'objects',
    primaryColor: '#FBBF24',
    secondaryColor: '#EF4444',
    accentColor: '#92400E',
    previewSvg: 'pizza-slice',
  },

  // =========================================================================
  // 4. INSPIRING & POP-CULTURE BUBBLE-LETTER TYPOGRAPHY
  // =========================================================================
  {
    id: 'txt-stay-hydrated',
    name: 'Stay Hydrated',
    category: 'text',
    badgeText: 'Stay',
    subText: 'Hydrated 💧',
    primaryColor: '#38BDF8',
    secondaryColor: '#E0F2FE',
    accentColor: '#0369A1',
    previewSvg: 'txt-stay-hydrated',
  },
  {
    id: 'txt-marvelous',
    name: 'Marvelous!',
    category: 'text',
    badgeText: 'MARVELOUS',
    subText: '⚡ POP! ⚡',
    primaryColor: '#EF4444',
    secondaryColor: '#FEF2F2',
    accentColor: '#B91C1C',
    previewSvg: 'txt-marvelous',
  },
  {
    id: 'txt-good-vibes',
    name: 'Good Vibes',
    category: 'text',
    badgeText: 'Good',
    subText: 'Vibes ✿',
    primaryColor: '#F472B6',
    secondaryColor: '#FCE7F3',
    accentColor: '#9D174D',
    previewSvg: 'txt-good-vibes',
  },
  {
    id: 'txt-hero-mode',
    name: 'Hero Mode',
    category: 'text',
    badgeText: 'HERO',
    subText: 'MODE ★',
    primaryColor: '#3B82F6',
    secondaryColor: '#EFF6FF',
    accentColor: '#1D4ED8',
    previewSvg: 'txt-hero-mode',
  },
  {
    id: 'txt-positive-vibes',
    name: 'Positive Vibes',
    category: 'text',
    badgeText: 'positive',
    subText: 'vibes ✨',
    primaryColor: '#F9A8D4',
    secondaryColor: '#FCE7F3',
    accentColor: '#9D174D',
    previewSvg: 'txt-positive-vibes',
  },
  {
    id: 'txt-keep-glowing',
    name: 'Keep Glowing',
    category: 'text',
    badgeText: 'keep',
    subText: 'glowing',
    primaryColor: '#FDE047',
    secondaryColor: '#FEF9C3',
    accentColor: '#A16207',
    previewSvg: 'txt-keep-glowing',
  },
  {
    id: 'txt-self-care',
    name: 'Self Care Club',
    category: 'text',
    badgeText: 'self care',
    subText: 'club ♡',
    primaryColor: '#86EFAC',
    secondaryColor: '#DCFCE7',
    accentColor: '#166534',
    previewSvg: 'txt-self-care',
  },
  {
    id: 'txt-happy-day',
    name: 'Happy Day',
    category: 'text',
    badgeText: 'happy',
    subText: 'day ✿',
    primaryColor: '#FDBA74',
    secondaryColor: '#FFEDD5',
    accentColor: '#9A3412',
    previewSvg: 'txt-happy-day',
  },
  {
    id: 'txt-dream-big',
    name: 'Dream Big',
    category: 'text',
    badgeText: 'dream',
    subText: 'big ★',
    primaryColor: '#C4B5FD',
    secondaryColor: '#EDE9FE',
    accentColor: '#5B21B6',
    previewSvg: 'txt-dream-big',
  },
  {
    id: 'txt-aesthetic',
    name: 'Aesthetic Lettering',
    category: 'text',
    badgeText: 'aesthetic',
    subText: '✦ 1999 ✦',
    primaryColor: '#FDA4AF',
    secondaryColor: '#FFE4E6',
    accentColor: '#9F1239',
    previewSvg: 'txt-aesthetic',
  },
];

/**
 * Helper to draw cute kawaii facial features (eyes, blush cheeks, tiny smile)
 */
function drawKawaiiFace(
  ctx: CanvasRenderingContext2D,
  eyeX = 11,
  eyeY = 2,
  sleeping = false
) {
  // Rosy pastel cheeks
  ctx.fillStyle = '#FDA4AF';
  ctx.beginPath();
  ctx.ellipse(-eyeX - 5, eyeY + 5, 5, 3, 0, 0, Math.PI * 2);
  ctx.ellipse(eyeX + 5, eyeY + 5, 5, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#33272A';
  ctx.fillStyle = '#33272A';
  ctx.lineWidth = 2.6;
  ctx.lineCap = 'round';

  if (sleeping) {
    // Sleeping closed curved eyes
    ctx.beginPath();
    ctx.arc(-eyeX, eyeY, 4.5, 0.15, Math.PI - 0.15);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 4.5, 0.15, Math.PI - 0.15);
    ctx.stroke();
  } else {
    // Shiny kawaii eyes
    ctx.beginPath();
    ctx.arc(-eyeX, eyeY, 3.3, 0, Math.PI * 2);
    ctx.arc(eyeX, eyeY, 3.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-eyeX - 1, eyeY - 1.2, 1.2, 0, Math.PI * 2);
    ctx.arc(eyeX - 1, eyeY - 1.2, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Cute w-mouth or smile
  ctx.beginPath();
  ctx.arc(-2.6, eyeY + 4, 2.6, 0.1, Math.PI - 0.1);
  ctx.arc(2.6, eyeY + 4, 2.6, 0.1, Math.PI - 0.1);
  ctx.stroke();
}

/**
 * Draws the inner 2D hand-drawn artwork for a given sticker.
 * Calling this twice (first with thick white stroke/shadow, then normal) creates
 * an authentic physical sticker-sheet die-cut white border around every contour!
 */
function drawStickerArtworkPass(
  ctx: CanvasRenderingContext2D,
  sticker: StickerOption,
  isWhiteBorderPass: boolean
) {
  const OUTLINE = '#33272A'; // Warm dark brown-charcoal hand-drawn ink line
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (isWhiteBorderPass) {
    // Thick, bold white die-cut sticker backing silhouette around the custom shape
    ctx.fillStyle = '#FFFFFF';
    if (ctx.strokeStyle !== '#cbd5e1') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 20;
    }
  }

  switch (sticker.previewSvg) {
    // =========================================================================
    // 0A. MARVEL & SUPERHERO THEME
    // =========================================================================
    case 'chibi-ironman': {
      ctx.beginPath();
      ctx.roundRect(-24, -27, 48, 52, 18);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      // Red outer helmet
      ctx.fillStyle = '#EF4444';
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.roundRect(-24, -27, 48, 52, 18);
      ctx.fill();
      ctx.stroke();

      // Gold faceplate mask
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.moveTo(-18, -14);
      ctx.lineTo(-8, -14);
      ctx.lineTo(-5, -8);
      ctx.lineTo(5, -8);
      ctx.lineTo(8, -14);
      ctx.lineTo(18, -14);
      ctx.lineTo(20, 12);
      ctx.lineTo(10, 20);
      ctx.lineTo(-10, 20);
      ctx.lineTo(-20, 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glowing cyan chibi eyes
      ctx.fillStyle = '#38BDF8';
      [-10, 10].forEach((ex) => {
        ctx.beginPath();
        ctx.roundRect(ex - 6, -3, 12, 5.5, 2);
        ctx.fill();
        ctx.stroke();
      });

      // Mouth slit line
      ctx.beginPath();
      ctx.moveTo(-8, 12);
      ctx.lineTo(8, 12);
      ctx.stroke();
      break;
    }

    case 'cap-shield': {
      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;

      // Concentric rings: Red, White, Red, Blue
      const rings: [number, string][] = [
        [28, '#EF4444'],
        [21, '#FFFFFF'],
        [15, '#EF4444'],
        [10, '#2563EB'],
      ];
      rings.forEach(([r, col]) => {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // Center 5-point white star
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const rad = i % 2 === 0 ? 8.5 : 3.6;
        const a = (i * Math.PI) / 5 - Math.PI / 2;
        const x = Math.cos(a) * rad;
        const y = Math.sin(a) * rad;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'peeking-spidey': {
      ctx.beginPath();
      ctx.arc(0, -2, 24, 0, Math.PI * 2);
      ctx.roundRect(-24, 14, 48, 10, 5);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;

      // Red Spidey head
      ctx.fillStyle = '#E11D48';
      ctx.beginPath();
      ctx.arc(0, -2, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Subtle web lines on mask
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, -26);
      ctx.lineTo(0, 18);
      ctx.moveTo(-22, -2);
      ctx.lineTo(22, -2);
      ctx.arc(0, -2, 12, 0, Math.PI * 2);
      ctx.stroke();

      // Big expressive white Spidey eyes with thick black rims
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3.5;

      // Left eye
      ctx.beginPath();
      ctx.ellipse(-10, -3, 8, 11, -0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Right eye
      ctx.beginPath();
      ctx.ellipse(10, -3, 8, 11, 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Peeking hands at bottom
      ctx.fillStyle = '#E11D48';
      ctx.lineWidth = 2.8;
      [-14, 14].forEach((hx) => {
        ctx.beginPath();
        ctx.ellipse(hx, 18, 7, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
      break;
    }

    case 'thor-mjolnir': {
      ctx.beginPath();
      ctx.roundRect(-24, -26, 48, 28, 6);
      ctx.roundRect(-5, 0, 10, 28, 3);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;

      // Brown leather handle with gold pommel
      ctx.fillStyle = '#92400E';
      ctx.beginPath();
      ctx.roundRect(-5, 0, 10, 26, 3);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.arc(0, 25, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Metallic hammer head
      ctx.fillStyle = '#CBD5E1';
      ctx.beginPath();
      ctx.roundRect(-24, -25, 48, 26, 6);
      ctx.fill();
      ctx.stroke();

      // Cute kawaii face on hammer + electric lightning bolts
      drawKawaiiFace(ctx, 9, -13, false);

      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(-26, -18, 4, 0, Math.PI * 2);
      ctx.arc(27, -8, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'waving-groot': {
      ctx.beginPath();
      ctx.roundRect(-20, -24, 40, 46, 10);
      ctx.ellipse(24, 4, 7, 4, -0.5, 0, Math.PI * 2);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;

      // Waving branch arm
      ctx.fillStyle = '#A16207';
      ctx.beginPath();
      ctx.ellipse(23, 4, 8, 4, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Wooden head with crown bark spikes
      ctx.fillStyle = '#B45309';
      ctx.beginPath();
      ctx.moveTo(-20, -18);
      ctx.lineTo(-14, -27);
      ctx.lineTo(-6, -21);
      ctx.lineTo(0, -28);
      ctx.lineTo(7, -21);
      ctx.lineTo(15, -27);
      ctx.lineTo(20, -18);
      ctx.lineTo(20, 16);
      ctx.quadraticCurveTo(0, 24, -20, 16);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Sprouting green leaves on top
      ctx.fillStyle = '#4ADE80';
      [-14, 15].forEach((lx) => {
        ctx.beginPath();
        ctx.ellipse(lx, -28, 6, 3.5, lx < 0 ? -0.4 : 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      drawKawaiiFace(ctx, 9, 0, false);
      break;
    }

    // =========================================================================
    // 0B. ANIME & GAMING THEME
    // =========================================================================
    case 'mini-pokeball': {
      ctx.beginPath();
      ctx.arc(0, 0, 27, 0, Math.PI * 2);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3.2;

      // Bottom white half
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 0, 27, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Top red half
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(0, 0, 27, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Center band & button
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(-27, 0);
      ctx.lineTo(27, 0);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'pixel-heart': {
      ctx.beginPath();
      ctx.moveTo(0, 24);
      ctx.bezierCurveTo(-34, 4, -32, -26, -12, -26);
      ctx.bezierCurveTo(-4, -26, 0, -18, 0, -14);
      ctx.bezierCurveTo(0, -18, 4, -26, 12, -26);
      ctx.bezierCurveTo(32, -26, 34, 4, 0, 24);
      ctx.closePath();
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      // Draw crisp 8-bit pixel grid blocks
      const s = 6;
      const rows = [
        [-3, -2, 2, 3],
        [-4, -3, -2, -1, 1, 2, 3, 4],
        [-4, -3, -2, -1, 0, 1, 2, 3, 4],
        [-4, -3, -2, -1, 0, 1, 2, 3, 4],
        [-3, -2, -1, 0, 1, 2, 3],
        [-2, -1, 0, 1, 2],
        [-1, 0, 1],
        [0],
      ];
      rows.forEach((cols, rIdx) => {
        const y = (rIdx - 3.8) * s;
        cols.forEach((cIdx) => {
          const x = (cIdx - 0.5) * s;
          ctx.fillStyle = rIdx === 1 && (cIdx === -3 || cIdx === -2) ? '#FFFFFF' : '#F43F5E';
          ctx.strokeStyle = OUTLINE;
          ctx.lineWidth = 1.8;
          ctx.fillRect(x, y, s, s);
          ctx.strokeRect(x, y, s, s);
        });
      });
      break;
    }

    case 'game-controller': {
      ctx.beginPath();
      ctx.roundRect(-28, -16, 56, 34, 16);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.fillStyle = '#C4B5FD';
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.roundRect(-28, -16, 56, 34, 16);
      ctx.fill();
      ctx.stroke();

      // D-pad on left
      ctx.fillStyle = '#FFFBEB';
      ctx.beginPath();
      ctx.roundRect(-20, -3, 12, 4, 1);
      ctx.roundRect(-16, -7, 4, 12, 1);
      ctx.fill();
      ctx.stroke();

      // Colorful ABXY buttons on right
      const btns: [number, number, string][] = [
        [14, -7, '#F472B6'],
        [19, -2, '#38BDF8'],
        [14, 3, '#FACC15'],
        [9, -2, '#4ADE80'],
      ];
      btns.forEach(([bx, by, col]) => {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(bx, by, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      drawKawaiiFace(ctx, 4, 4, false);
      break;
    }

    case 'floating-ghost': {
      ctx.beginPath();
      ctx.arc(0, -6, 22, Math.PI, 0);
      ctx.lineTo(22, 20);
      ctx.quadraticCurveTo(14, 14, 7, 20);
      ctx.quadraticCurveTo(0, 25, -7, 20);
      ctx.quadraticCurveTo(-14, 14, -22, 20);
      ctx.closePath();
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.fillStyle = '#F8FAFC';
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();

      drawKawaiiFace(ctx, 8, -4, false);

      // Cute tongue out
      ctx.fillStyle = '#FB7185';
      ctx.beginPath();
      ctx.arc(0, 4, 3.5, 0, Math.PI);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'arcade-cabinet': {
      ctx.beginPath();
      ctx.roundRect(-20, -27, 40, 54, 7);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.fillStyle = '#F472B6';
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-20, -27, 40, 54, 7);
      ctx.fill();
      ctx.stroke();

      // Glowing cyan screen
      ctx.fillStyle = '#BAE6FD';
      ctx.beginPath();
      ctx.roundRect(-14, -18, 28, 20, 4);
      ctx.fill();
      ctx.stroke();

      drawKawaiiFace(ctx, 6, -9, false);

      // Joystick & arcade buttons
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.arc(-7, 10, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(6, 11, 3, 0, Math.PI * 2);
      ctx.arc(13, 9, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    // =========================================================================
    // 0C. GLITTER & MAGICAL SPARKLES
    // =========================================================================
    case 'galaxy-cluster': {
      ctx.beginPath();
      ctx.ellipse(0, 0, 28, 16, -0.35, 0, Math.PI * 2);
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;

      // Planet core
      ctx.fillStyle = '#C084FC';
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Holographic ring
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 27, 9, -0.35, -0.3, Math.PI + 0.3);
      ctx.stroke();

      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 27, 9, -0.35, -0.3, Math.PI + 0.3);
      ctx.stroke();

      // Mini sparkle stars
      ctx.fillStyle = '#FDE047';
      [
        [-18, -18],
        [20, -14],
        [16, 18],
      ].forEach(([sx, sy]) => {
        ctx.beginPath();
        ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
      break;
    }

    case 'sparkling-moon': {
      ctx.beginPath();
      ctx.arc(0, 0, 25, 0.4, Math.PI * 1.65);
      ctx.quadraticCurveTo(-8, 0, 10, -22);
      ctx.closePath();
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.fillStyle = '#FDE047';
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 25, 0.4, Math.PI * 1.65);
      ctx.quadraticCurveTo(-8, 0, 10, -22);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Hanging star charm
      ctx.fillStyle = '#F472B6';
      ctx.beginPath();
      ctx.arc(14, 4, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'holo-burst': {
      ctx.beginPath();
      for (let i = 0; i < 16; i++) {
        const r = i % 2 === 0 ? 28 : 11;
        const a = (i * Math.PI) / 8;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      const grad = ctx.createLinearGradient(-24, -24, 24, 24);
      grad.addColorStop(0, '#67E8F9');
      grad.addColorStop(0.5, '#F9A8D4');
      grad.addColorStop(1, '#FDE047');

      ctx.fillStyle = grad;
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 2.8;
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'vinyl-record': {
      ctx.beginPath();
      ctx.arc(0, 0, 27, 0, Math.PI * 2);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 27, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Grooves
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.stroke();

      // Pastel center label
      ctx.fillStyle = '#F472B6';
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    // =========================================================================
    // 1. CUTE CHARACTERS & ANIMALS
    // =========================================================================
    case 'chubby-cat': {
      // Sleeping / peeking chubby calico cat with ears & paws
      ctx.beginPath();
      // Left ear
      ctx.moveTo(-24, -8);
      ctx.lineTo(-28, -30);
      ctx.lineTo(-8, -22);
      // Top head
      ctx.quadraticCurveTo(0, -25, 8, -22);
      // Right ear
      ctx.lineTo(28, -30);
      ctx.lineTo(24, -8);
      // Chubby cheeks
      ctx.bezierCurveTo(36, 4, 34, 26, 0, 26);
      ctx.bezierCurveTo(-34, 26, -36, 4, -24, -8);
      ctx.closePath();

      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.fillStyle = '#FFF7ED';
      ctx.fill();
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Pastel peach tabby patch on head
      ctx.fillStyle = '#FDBA74';
      ctx.beginPath();
      ctx.arc(14, -12, 12, 0, Math.PI * 2);
      ctx.fill();

      // Inner pink ears
      ctx.fillStyle = '#FDA4AF';
      ctx.beginPath();
      ctx.moveTo(-21, -12);
      ctx.lineTo(-24, -24);
      ctx.lineTo(-12, -18);
      ctx.closePath();
      ctx.moveTo(21, -12);
      ctx.lineTo(24, -24);
      ctx.lineTo(12, -18);
      ctx.closePath();
      ctx.fill();

      drawKawaiiFace(ctx, 11, 2, true);

      // Cute peeking paws at bottom
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 2.6;
      [-14, 14].forEach((px) => {
        ctx.beginPath();
        ctx.ellipse(px, 23, 8, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // Tiny sleeping Zzz
      ctx.fillStyle = '#F472B6';
      ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('zZ', 22, -24);
      break;
    }

    case 'tiny-bunny': {
      // Long floppy ears + chubby bunny face + carrot/heart
      ctx.beginPath();
      ctx.ellipse(-11, -24, 7.5, 19, -0.12, 0, Math.PI * 2);
      ctx.ellipse(11, -24, 7.5, 19, 0.12, 0, Math.PI * 2);
      ctx.arc(0, 6, 25, 0, Math.PI * 2);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(-11, -24, 7.5, 19, -0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(11, -24, 7.5, 19, 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner pink ears
      ctx.fillStyle = '#FBCFE8';
      ctx.beginPath();
      ctx.ellipse(-11, -24, 4, 13, -0.12, 0, Math.PI * 2);
      ctx.ellipse(11, -24, 4, 13, 0.12, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(0, 7, 26, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      drawKawaiiFace(ctx, 10, 6, false);
      break;
    }

    case 'shiba-inu': {
      // Friendly Shiba Inu dog with cream eyebrows and cheeks
      ctx.beginPath();
      ctx.moveTo(-24, -6);
      ctx.lineTo(-27, -30);
      ctx.lineTo(-7, -20);
      ctx.quadraticCurveTo(0, -23, 7, -20);
      ctx.lineTo(27, -30);
      ctx.lineTo(24, -6);
      ctx.bezierCurveTo(35, 6, 32, 28, 0, 28);
      ctx.bezierCurveTo(-32, 28, -35, 6, -24, -6);
      ctx.closePath();

      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.fillStyle = '#F59E0B';
      ctx.fill();
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Cream Shiba lower cheeks & snout
      ctx.fillStyle = '#FEF3C7';
      ctx.beginPath();
      ctx.ellipse(-14, 12, 13, 11, -0.2, 0, Math.PI * 2);
      ctx.ellipse(14, 12, 13, 11, 0.2, 0, Math.PI * 2);
      ctx.ellipse(0, 14, 14, 11, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cute cream Shiba eyebrow dots
      ctx.beginPath();
      ctx.ellipse(-9, -7, 4, 2.5, -0.2, 0, Math.PI * 2);
      ctx.ellipse(9, -7, 4, 2.5, 0.2, 0, Math.PI * 2);
      ctx.fill();

      drawKawaiiFace(ctx, 11, 2, false);

      // Dark nose
      ctx.fillStyle = OUTLINE;
      ctx.beginPath();
      ctx.ellipse(0, 4, 4, 2.8, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'cute-panda': {
      ctx.beginPath();
      ctx.arc(-20, -18, 10, 0, Math.PI * 2);
      ctx.arc(20, -18, 10, 0, Math.PI * 2);
      ctx.ellipse(0, 4, 27, 23, 0, 0, Math.PI * 2);

      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;
      // Black ears
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(-20, -18, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(20, -18, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // White panda head
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(0, 4, 27, 23, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Charcoal eye patches
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.ellipse(-11, 2, 7.5, 6, -0.3, 0, Math.PI * 2);
      ctx.ellipse(11, 2, 7.5, 6, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // White eye pupils
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-10, 1, 2.5, 0, Math.PI * 2);
      ctx.arc(10, 1, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Blush & mouth
      ctx.fillStyle = '#FDA4AF';
      ctx.beginPath();
      ctx.ellipse(-17, 9, 4.5, 2.5, 0, 0, Math.PI * 2);
      ctx.ellipse(17, 9, 4.5, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = OUTLINE;
      ctx.beginPath();
      ctx.ellipse(0, 6, 3.8, 2.6, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'baby-koala': {
      ctx.beginPath();
      ctx.arc(-24, -4, 13, 0, Math.PI * 2);
      ctx.arc(24, -4, 13, 0, Math.PI * 2);
      ctx.ellipse(0, 3, 24, 21, 0, 0, Math.PI * 2);

      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;
      // Fluffy koala ears
      ctx.fillStyle = '#94A3B8';
      ctx.beginPath();
      ctx.arc(-24, -4, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(24, -4, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FBCFE8';
      ctx.beginPath();
      ctx.arc(-24, -4, 7, 0, Math.PI * 2);
      ctx.arc(24, -4, 7, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = '#CBD5E1';
      ctx.beginPath();
      ctx.ellipse(0, 3, 24, 21, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      drawKawaiiFace(ctx, 11, 2, false);

      // Iconic oval koala nose
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.ellipse(0, 3, 5, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'baby-bear': {
      ctx.beginPath();
      ctx.arc(-19, -18, 10, 0, Math.PI * 2);
      ctx.arc(19, -18, 10, 0, Math.PI * 2);
      ctx.ellipse(0, 3, 26, 23, 0, 0, Math.PI * 2);

      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(-19, -18, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(19, -18, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FDE68A';
      ctx.beginPath();
      ctx.arc(-19, -18, 5, 0, Math.PI * 2);
      ctx.arc(19, -18, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.ellipse(0, 3, 26, 23, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FEF3C7';
      ctx.beginPath();
      ctx.ellipse(0, 8, 10, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      drawKawaiiFace(ctx, 11, 1, false);
      ctx.fillStyle = OUTLINE;
      ctx.beginPath();
      ctx.ellipse(0, 5, 3.8, 2.6, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    // =========================================================================
    // 2. NATURE & BOTANY
    // =========================================================================
    case 'smiling-daisy': {
      const petals = 8;
      ctx.beginPath();
      for (let i = 0; i < petals; i++) {
        const ang = (i / petals) * Math.PI * 2;
        const px = Math.cos(ang) * 21;
        const py = Math.sin(ang) * 21;
        ctx.moveTo(px + 13, py);
        ctx.arc(px, py, 13, 0, Math.PI * 2);
      }
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      for (let i = 0; i < petals; i++) {
        const ang = (i / petals) * Math.PI * 2;
        const px = Math.cos(ang) * 21;
        const py = Math.sin(ang) * 21;
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = OUTLINE;
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.arc(px, py, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      ctx.fillStyle = '#FDE047';
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      drawKawaiiFace(ctx, 6.5, -1, false);
      break;
    }

    case 'monstera-leaf': {
      ctx.beginPath();
      ctx.ellipse(0, 2, 25, 29, 0.15, 0, Math.PI * 2);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.fillStyle = '#6EE7B7';
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 2, 25, 29, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Monstera leaf cutouts
      ctx.fillStyle = '#FFFFFF';
      [-14, 14].forEach((lx, idx) => {
        ctx.beginPath();
        ctx.ellipse(lx, idx === 0 ? -5 : 2, 8, 3.6, idx === 0 ? 0.3 : -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // Center stem vein
      ctx.beginPath();
      ctx.moveTo(3, -24);
      ctx.quadraticCurveTo(0, 4, -5, 32);
      ctx.stroke();
      break;
    }

    case 'potted-cactus': {
      ctx.beginPath();
      ctx.roundRect(-16, 6, 32, 24, 5);
      ctx.ellipse(0, -10, 15, 20, 0, 0, Math.PI * 2);
      ctx.arc(0, -31, 6, 0, Math.PI * 2);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;

      // Green cactus body
      ctx.fillStyle = '#6EE7B7';
      ctx.beginPath();
      ctx.ellipse(0, -10, 15, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Pink blossom on top
      ctx.fillStyle = '#F472B6';
      ctx.beginPath();
      ctx.arc(0, -31, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Terracotta pot
      ctx.fillStyle = '#FDBA74';
      ctx.beginPath();
      ctx.moveTo(-16, 8);
      ctx.lineTo(16, 8);
      ctx.lineTo(12, 29);
      ctx.lineTo(-12, 29);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FB923C';
      ctx.beginPath();
      ctx.roundRect(-18, 4, 36, 7, 3);
      ctx.fill();
      ctx.stroke();

      drawKawaiiFace(ctx, 6, -9, false);
      break;
    }

    case 'pastel-mushroom': {
      ctx.beginPath();
      ctx.ellipse(0, -8, 28, 19, 0, Math.PI, 0);
      ctx.roundRect(-12, -8, 24, 34, 9);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;

      // Cream stem
      ctx.fillStyle = '#FFFBEB';
      ctx.beginPath();
      ctx.roundRect(-12, -6, 24, 32, 9);
      ctx.fill();
      ctx.stroke();

      // Pastel coral mushroom cap
      ctx.fillStyle = '#FB7185';
      ctx.beginPath();
      ctx.ellipse(0, -6, 29, 20, 0, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // White spots on cap
      ctx.fillStyle = '#FFFFFF';
      [
        [-14, -13, 5],
        [2, -18, 6],
        [15, -12, 4.5],
      ].forEach(([sx, sy, sr]) => {
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      });

      drawKawaiiFace(ctx, 5, 10, false);
      break;
    }

    case 'pastel-rainbow': {
      ctx.beginPath();
      ctx.arc(0, 12, 30, Math.PI, 0);
      ctx.arc(-20, 14, 12, 0, Math.PI * 2);
      ctx.arc(20, 14, 12, 0, Math.PI * 2);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      const bands = [
        { r: 28, color: '#F9A8D4' },
        { r: 21, color: '#FDE047' },
        { r: 14, color: '#93C5FD' },
      ];
      ctx.lineCap = 'round';
      bands.forEach((b) => {
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 6.5;
        ctx.beginPath();
        ctx.arc(0, 12, b.r, Math.PI, 0);
        ctx.stroke();
      });

      // Fluffy mini clouds at ends
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 2.8;
      [-20, 20].forEach((cx) => {
        ctx.beginPath();
        ctx.arc(cx - 6, 15, 8, 0, Math.PI * 2);
        ctx.arc(cx, 12, 10, 0, Math.PI * 2);
        ctx.arc(cx + 7, 15, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
      break;
    }

    case 'smiling-cloud': {
      ctx.beginPath();
      ctx.arc(-16, 6, 14, 0, Math.PI * 2);
      ctx.arc(-3, -6, 17, 0, Math.PI * 2);
      ctx.arc(14, -2, 15, 0, Math.PI * 2);
      ctx.arc(20, 9, 12, 0, Math.PI * 2);
      ctx.roundRect(-20, 4, 42, 16, 8);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.fillStyle = '#EFF6FF';
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();

      drawKawaiiFace(ctx, 8, 4, false);
      break;
    }

    case 'cool-sun': {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const ang = (i / 10) * Math.PI * 2;
        ctx.moveTo(Math.cos(ang) * 28, Math.sin(ang) * 28);
        ctx.arc(Math.cos(ang) * 22, Math.sin(ang) * 22, 8, 0, Math.PI * 2);
      }
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      // Sun rays
      ctx.fillStyle = '#FACC15';
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 2.8;
      for (let i = 0; i < 10; i++) {
        const ang = (i / 10) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(Math.cos(ang) * 23, Math.sin(ang) * 23, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cool retro sunglasses
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.roundRect(-17, -7, 14, 9, 2.5);
      ctx.roundRect(3, -7, 14, 9, 2.5);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-3, -4);
      ctx.lineTo(3, -4);
      ctx.stroke();

      // Happy smile
      ctx.beginPath();
      ctx.arc(0, 5, 6, 0.15, Math.PI - 0.15);
      ctx.stroke();
      break;
    }

    case 'strawberry-berry': {
      ctx.beginPath();
      ctx.moveTo(0, 28);
      ctx.bezierCurveTo(-28, 12, -26, -18, 0, -16);
      ctx.bezierCurveTo(26, -18, 28, 12, 0, 28);
      ctx.ellipse(0, -20, 16, 7, 0, 0, Math.PI * 2);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.fillStyle = '#FB7185';
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 28);
      ctx.bezierCurveTo(-28, 12, -26, -18, 0, -16);
      ctx.bezierCurveTo(26, -18, 28, 12, 0, 28);
      ctx.fill();
      ctx.stroke();

      // Green leafy crown
      ctx.fillStyle = '#4ADE80';
      ctx.beginPath();
      ctx.ellipse(-9, -18, 9, 4.5, -0.3, 0, Math.PI * 2);
      ctx.ellipse(9, -18, 9, 4.5, 0.3, 0, Math.PI * 2);
      ctx.ellipse(0, -19, 6, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cream seeds
      ctx.fillStyle = '#FEF3C7';
      [
        [-10, -4],
        [10, -4],
        [0, 3],
        [-8, 12],
        [8, 12],
        [0, 19],
      ].forEach(([sx, sy]) => {
        ctx.beginPath();
        ctx.ellipse(sx, sy, 1.8, 2.8, 0, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    case 'watermelon-slice': {
      ctx.beginPath();
      ctx.arc(0, -8, 30, 0, Math.PI);
      ctx.closePath();
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;

      // Green rind
      ctx.fillStyle = '#4ADE80';
      ctx.beginPath();
      ctx.arc(0, -8, 30, 0, Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Red melon flesh
      ctx.fillStyle = '#FB7185';
      ctx.beginPath();
      ctx.arc(0, -8, 24, 0, Math.PI);
      ctx.closePath();
      ctx.fill();

      // Black seeds
      ctx.fillStyle = OUTLINE;
      [
        [-11, 2],
        [0, 6],
        [11, 2],
      ].forEach(([sx, sy]) => {
        ctx.beginPath();
        ctx.ellipse(sx, sy, 2, 3.2, 0, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    // =========================================================================
    // 3. POPULAR & EVERYDAY OBJECTS
    // =========================================================================
    case 'boba-cup': {
      ctx.beginPath();
      ctx.roundRect(-18, -10, 36, 38, 6);
      ctx.arc(0, -10, 19, Math.PI, 0);
      ctx.roundRect(-4, -34, 8, 26, 3);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;

      // Straw
      ctx.fillStyle = '#F472B6';
      ctx.beginPath();
      ctx.roundRect(-4, -34, 8, 24, 2);
      ctx.fill();
      ctx.stroke();

      // Dome lid
      ctx.fillStyle = '#FFFBEB';
      ctx.beginPath();
      ctx.arc(0, -10, 18, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Milk tea cup
      ctx.fillStyle = '#FDE68A';
      ctx.beginPath();
      ctx.moveTo(-18, -10);
      ctx.lineTo(18, -10);
      ctx.lineTo(14, 28);
      ctx.lineTo(-14, 28);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Tapioca pearls
      ctx.fillStyle = '#451A03';
      [
        [-8, 22],
        [0, 23],
        [8, 22],
        [-4, 16],
        [5, 16],
      ].forEach(([bx, by]) => {
        ctx.beginPath();
        ctx.arc(bx, by, 3.2, 0, Math.PI * 2);
        ctx.fill();
      });

      drawKawaiiFace(ctx, 6, 3, false);
      break;
    }

    case 'mini-tumbler': {
      ctx.beginPath();
      ctx.roundRect(-16, -14, 32, 42, 6);
      ctx.roundRect(-3, -32, 6, 20, 2);
      ctx.arc(18, 6, 9, -Math.PI / 2, Math.PI / 2);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;

      // Side handle
      ctx.beginPath();
      ctx.arc(15, 6, 9, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();

      // Straw
      ctx.fillStyle = '#93C5FD';
      ctx.beginPath();
      ctx.roundRect(-3, -32, 6, 20, 2);
      ctx.fill();
      ctx.stroke();

      // Pastel pink tumbler body
      ctx.fillStyle = '#F9A8D4';
      ctx.beginPath();
      ctx.moveTo(-16, -12);
      ctx.lineTo(16, -12);
      ctx.lineTo(13, 28);
      ctx.lineTo(-13, 28);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cream lid
      ctx.fillStyle = '#FFFBEB';
      ctx.beginPath();
      ctx.roundRect(-18, -17, 36, 7, 3);
      ctx.fill();
      ctx.stroke();

      drawKawaiiFace(ctx, 6, 6, false);
      break;
    }

    case 'retro-camera': {
      ctx.beginPath();
      ctx.roundRect(-26, -14, 52, 36, 8);
      ctx.roundRect(-18, -21, 14, 8, 3);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;

      // Shutter button
      ctx.fillStyle = '#F472B6';
      ctx.beginPath();
      ctx.roundRect(-18, -20, 12, 7, 2);
      ctx.fill();
      ctx.stroke();

      // Camera body
      ctx.fillStyle = '#93C5FD';
      ctx.beginPath();
      ctx.roundRect(-26, -14, 52, 36, 8);
      ctx.fill();
      ctx.stroke();

      // Cream top stripe
      ctx.fillStyle = '#FFFBEB';
      ctx.beginPath();
      ctx.roundRect(-26, -14, 52, 11, [8, 8, 0, 0]);
      ctx.fill();
      ctx.stroke();

      // Camera lens
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(2, 6, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(2, 6, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 4, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'pastel-headphones': {
      ctx.beginPath();
      ctx.arc(0, 4, 24, Math.PI, 0);
      ctx.ellipse(-22, 10, 8, 13, 0, 0, Math.PI * 2);
      ctx.ellipse(22, 10, 8, 13, 0, 0, Math.PI * 2);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(0, 4, 22, Math.PI, 0);
      ctx.stroke();

      ctx.strokeStyle = '#C4B5FD';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 4, 22, Math.PI, 0);
      ctx.stroke();

      ctx.fillStyle = '#C4B5FD';
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;
      [-22, 22].forEach((hx) => {
        ctx.beginPath();
        ctx.ellipse(hx, 10, 8, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
      break;
    }

    case 'diary-book': {
      ctx.beginPath();
      ctx.roundRect(-21, -25, 42, 50, 6);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.fillStyle = '#FDA4AF';
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-21, -25, 42, 50, 6);
      ctx.fill();
      ctx.stroke();

      // Book spine
      ctx.fillStyle = '#F43F5E';
      ctx.beginPath();
      ctx.roundRect(-21, -25, 9, 50, [6, 0, 0, 6]);
      ctx.fill();
      ctx.stroke();

      // Heart on cover
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(4, 10);
      ctx.bezierCurveTo(-10, 0, -10, -12, 4, -5);
      ctx.bezierCurveTo(18, -12, 18, 0, 4, 10);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'sparkling-stars': {
      const draw4PtStar = (cx: number, cy: number, r: number) => {
        ctx.moveTo(cx, cy - r);
        ctx.quadraticCurveTo(cx, cy, cx + r, cy);
        ctx.quadraticCurveTo(cx, cy, cx, cy + r);
        ctx.quadraticCurveTo(cx, cy, cx - r, cy);
        ctx.quadraticCurveTo(cx, cy, cx, cy - r);
      };
      ctx.beginPath();
      draw4PtStar(-6, -4, 24);
      draw4PtStar(16, -16, 12);
      draw4PtStar(14, 16, 11);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 2.8;

      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      draw4PtStar(-6, -4, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#F9A8D4';
      ctx.beginPath();
      draw4PtStar(16, -16, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#93C5FD';
      ctx.beginPath();
      draw4PtStar(14, 16, 11);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'pizza-slice': {
      ctx.beginPath();
      ctx.moveTo(0, 28);
      ctx.lineTo(-24, -20);
      ctx.quadraticCurveTo(0, -28, 24, -20);
      ctx.closePath();
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;

      // Golden crust
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.moveTo(-24, -20);
      ctx.quadraticCurveTo(0, -28, 24, -20);
      ctx.lineTo(20, -12);
      ctx.quadraticCurveTo(0, -19, -20, -12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Melted cheese triangle
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.moveTo(0, 28);
      ctx.lineTo(-20, -13);
      ctx.quadraticCurveTo(0, -19, 20, -13);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Pepperoni slices
      ctx.fillStyle = '#EF4444';
      [
        [-7, -4, 5],
        [8, -2, 5],
        [0, 11, 4.5],
      ].forEach(([px, py, pr]) => {
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
      break;
    }

    // =========================================================================
    // 3B. CUSTOM NAME & CALLIGRAPHY TYPOGRAPHY SHEET (WITH SWASHES & ORNAMENTS)
    // =========================================================================
    case 'calligraphy-decal': {
      const textLabel = (sticker.badgeText || sticker.name).slice(0, 14);
      const styleId: CalligraphyStyleId = sticker.calligraphyStyle || 'modern-soft-script';
      const ornamentId: CalligraphyOrnamentId = sticker.ornament || 'stars';

      // Organic contour die-cut backing for calligraphy word + flourishes
      ctx.beginPath();
      ctx.roundRect(-42, -23, 84, 46, 22);
      ctx.moveTo(-36, 12);
      ctx.bezierCurveTo(-18, 22, 18, 22, 36, 12);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      // Soft pill backing with thick white sticker border feel
      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle =
        styleId === 'minimalist-fine-cursive'
          ? '#CBD5E1'
          : styleId === 'modern-soft-script'
          ? '#FBCFE8'
          : styleId === 'playful-brush'
          ? sticker.primaryColor
          : '#E2E8F0';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.roundRect(-40, -21, 80, 42, 20);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 1. Delicate Calligraphy Flourish & Swash Underline
      ctx.save();
      if (styleId === 'modern-soft-script') {
        const roseGrad = ctx.createLinearGradient(-34, 0, 34, 0);
        roseGrad.addColorStop(0, '#F472B6');
        roseGrad.addColorStop(0.5, '#E0A96D'); // Metallic Rose Gold
        roseGrad.addColorStop(1, '#FB7185');
        ctx.strokeStyle = roseGrad;
        ctx.lineWidth = 1.8;
      } else if (styleId === 'minimalist-fine-cursive') {
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 1.25;
      } else if (styleId === 'playful-brush') {
        ctx.strokeStyle = sticker.primaryColor;
        ctx.lineWidth = 2.5;
      } else {
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.4;
      }

      // Left entry swash loop & right exit flourish curl
      ctx.beginPath();
      ctx.moveTo(-31, 10);
      ctx.bezierCurveTo(-36, 7, -33, 3, -27, 6);
      ctx.bezierCurveTo(-10, 14, 12, 14, 29, 7);
      ctx.bezierCurveTo(35, 4, 36, 9, 31, 12);
      ctx.stroke();
      ctx.restore();

      // 2. Decorative Surrounding Embellishments (Twinkling Stars, Floral Vines, Mini Hearts, Butterfly)
      ctx.save();
      const ornColor =
        styleId === 'minimalist-fine-cursive'
          ? '#1E293B'
          : styleId === 'modern-soft-script'
          ? '#D97757'
          : sticker.primaryColor;
      ctx.strokeStyle = ornColor;
      ctx.fillStyle = ornColor;
      ctx.lineWidth = 1.3;

      if (ornamentId === 'stars') {
        // Subtle 4-point twinkling stars around the name
        const drawTinyStar = (sx: number, sy: number, r: number) => {
          ctx.beginPath();
          ctx.moveTo(sx, sy - r);
          ctx.quadraticCurveTo(sx, sy, sx + r, sy);
          ctx.quadraticCurveTo(sx, sy, sx, sy + r);
          ctx.quadraticCurveTo(sx, sy, sx - r, sy);
          ctx.quadraticCurveTo(sx, sy, sx, sy - r);
          ctx.fill();
        };
        drawTinyStar(-31, -11, 4.2);
        drawTinyStar(31, -10, 4.5);
        drawTinyStar(24, 12, 3.0);
        ctx.beginPath();
        ctx.arc(-23, 12, 1.2, 0, Math.PI * 2);
        ctx.arc(34, 1, 1.2, 0, Math.PI * 2);
        ctx.fill();
      } else if (ornamentId === 'floral-vines') {
        // Delicate botanical leaf sprigs on top-left and bottom-right
        [
          [-31, -9, -1],
          [31, -9, 1],
        ].forEach(([vx, vy, dir]) => {
          ctx.beginPath();
          ctx.moveTo(vx, vy + 5);
          ctx.quadraticCurveTo(vx + dir * 4, vy, vx + dir * 2, vy - 5);
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(vx + dir * 3.5, vy - 1, 3.2, 1.6, dir * 0.5, 0, Math.PI * 2);
          ctx.ellipse(vx - dir * 1.5, vy + 1, 3.0, 1.5, -dir * 0.4, 0, Math.PI * 2);
          ctx.stroke();
        });
      } else if (ornamentId === 'mini-hearts') {
        // Tiny floating aesthetic hearts
        const drawTinyHeart = (hx: number, hy: number, sc: number) => {
          ctx.save();
          ctx.translate(hx, hy);
          ctx.scale(sc, sc);
          ctx.beginPath();
          ctx.moveTo(0, 3);
          ctx.bezierCurveTo(-5, -1, -5, -6, 0, -3);
          ctx.bezierCurveTo(5, -6, 5, -1, 0, 3);
          ctx.stroke();
          ctx.restore();
        };
        drawTinyHeart(-30, -10, 0.9);
        drawTinyHeart(30, -9, 1.0);
        drawTinyHeart(0, 14, 0.75);
      } else if (ornamentId === 'butterfly') {
        // Cute delicate butterfly outline perched near top-right of the name
        ctx.save();
        ctx.translate(29, -11);
        ctx.rotate(0.22);
        ctx.beginPath();
        // Upper wings
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-7, -7, -9, 1, 0, 2);
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(7, -7, 9, 1, 0, 2);
        // Lower wings
        ctx.moveTo(0, 2);
        ctx.bezierCurveTo(-6, 3, -5, 8, 0, 5);
        ctx.moveTo(0, 2);
        ctx.bezierCurveTo(6, 3, 5, 8, 0, 5);
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();

      // 3. Render Custom Name Typography in Selected Calligraphy Style
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const len = textLabel.length;
      if (styleId === 'modern-soft-script') {
        // Smooth fluid strokes with pastel pink & metallic rose gold gradient outline
        const fontSize = len > 8 ? 20 : len > 6 ? 23 : 26;
        ctx.font = `400 ${fontSize}px "Great Vibes", "Sacramento", cursive`;

        // White inner sticker halo
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4.5;
        ctx.strokeText(textLabel, 0, -2);

        // Metallic rose gold outer contour
        ctx.strokeStyle = '#D97757';
        ctx.lineWidth = 1.6;
        ctx.strokeText(textLabel, 0, -2);

        const scriptGrad = ctx.createLinearGradient(-28, -12, 28, 10);
        scriptGrad.addColorStop(0, sticker.primaryColor);
        scriptGrad.addColorStop(0.55, '#E11D48');
        scriptGrad.addColorStop(1, '#D97757');
        ctx.fillStyle = scriptGrad;
        ctx.fillText(textLabel, 0, -2);
      } else if (styleId === 'minimalist-fine-cursive') {
        // Clean thin black ink aesthetic cursive
        const fontSize = len > 8 ? 21 : len > 6 ? 24 : 27;
        ctx.font = `400 ${fontSize}px "Sacramento", "Great Vibes", cursive`;
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 0.85;
        ctx.fillStyle = '#0F172A';
        ctx.fillText(textLabel, 0, -2);
        ctx.strokeText(textLabel, 0, -2);
      } else if (styleId === 'playful-brush') {
        // Bold cozy pastel brush lettering with white sticker border
        const fontSize = len > 8 ? 16 : len > 6 ? 19 : 21;
        ctx.font = `400 ${fontSize}px "Pacifico", "Plus Jakarta Sans", cursive`;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 5;
        ctx.strokeText(textLabel, 0, -2);
        ctx.strokeStyle = sticker.accentColor;
        ctx.lineWidth = 2.2;
        ctx.strokeText(textLabel, 0, -2);
        ctx.fillStyle = sticker.primaryColor;
        ctx.fillText(textLabel, 0, -2);
      } else {
        // Minimalist Italic Editorial Serif
        const fontSize = len > 8 ? 16 : len > 6 ? 19 : 21;
        ctx.font = `italic 700 ${fontSize}px "Playfair Display", Georgia, serif`;
        ctx.fillStyle = sticker.primaryColor;
        ctx.fillText(textLabel, 0, -2);
      }
      ctx.restore();
      break;
    }

    // =========================================================================
    // 4. INSPIRING & CASUAL HANDWRITTEN TEXT STICKERS
    // =========================================================================
    default: {
      // Cloud-like bubble die-cut pill shape for handwritten text
      ctx.beginPath();
      ctx.roundRect(-36, -22, 72, 44, 20);
      if (isWhiteBorderPass) {
        ctx.stroke();
        ctx.fill();
        return;
      }

      ctx.fillStyle = sticker.secondaryColor;
      ctx.strokeStyle = sticker.primaryColor;
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.roundRect(-35, -21, 70, 42, 19);
      ctx.fill();
      ctx.stroke();

      // Curved / stacked handwritten bubble typography
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const line1 = sticker.badgeText || sticker.name;
      const line2 = sticker.subText || '';

      ctx.font = '800 14px "Plus Jakarta Sans", cursive, sans-serif';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 4;
      ctx.strokeText(line1, 0, line2 ? -6 : 0);
      ctx.fillStyle = sticker.accentColor;
      ctx.fillText(line1, 0, line2 ? -6 : 0);

      if (line2) {
        ctx.font = '800 13px "Plus Jakarta Sans", cursive, sans-serif';
        ctx.strokeText(line2, 0, 9);
        ctx.fillStyle = sticker.primaryColor === '#FDE047' ? '#B45309' : sticker.accentColor;
        ctx.fillText(line2, 0, 9);
      }
      break;
    }
  }
}

/**
 * Draws a 2D Hand-Drawn Digital Die-Cut Sticker with a Distinct Thick White Outline
 * around each sticker contour, typical of physical aesthetic sticker sheets.
 */
export function drawAestheticSticker(
  ctx: CanvasRenderingContext2D,
  sticker: StickerOption,
  size = 220
) {
  const scaleFactor = size / 116;
  ctx.save();
  ctx.scale(scaleFactor, scaleFactor);

  // Pass 1: Outer crisp die-cut kiss-cut line so the thick white border is clearly visible on a solid white sheet
  ctx.save();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 22.5;
  drawStickerArtworkPass(ctx, sticker, true);
  ctx.restore();

  // Pass 2: Thick Bold White Die-Cut Border (Zero shadows)
  ctx.save();
  drawStickerArtworkPass(ctx, sticker, true);
  ctx.restore();

  // Pass 3: Crisp 2D Vector Illustration Inside
  drawStickerArtworkPass(ctx, sticker, false);

  ctx.restore();
}

/**
 * Dynamically creates a custom name & calligraphy sticker option for any user-entered name
 * with chosen calligraphy font style, decorative ornament, and pastel/rose-gold color scheme.
 */
export function createCustomCalligraphySticker(
  customName: string,
  style: CalligraphyStyleId,
  ornament: CalligraphyOrnamentId,
  colorHex = '#F472B6'
): StickerOption {
  const cleanName = customName.trim().slice(0, 14) || 'Jessica';
  const id = `custom-cal-${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${style}-${ornament}-${colorHex.replace('#', '')}`;
  return {
    id,
    name: `${cleanName} (Custom Name)`,
    category: 'calligraphy',
    badgeText: cleanName,
    calligraphyStyle: style,
    ornament,
    primaryColor: colorHex,
    secondaryColor: '#D97757',
    accentColor: '#9D174D',
    previewSvg: 'calligraphy-decal',
  };
}

const previewCache: Record<string, string> = {};
export function getStickerPreviewDataUrl(sticker: StickerOption): string {
  if (previewCache[sticker.id]) return previewCache[sticker.id];
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.translate(128, 128);
    drawAestheticSticker(ctx, sticker, 215);
  }
  const url = canvas.toDataURL('image/png');
  previewCache[sticker.id] = url;
  return url;
}

const stickerTextureCache: Record<string, THREE.CanvasTexture> = {};
function getHighResStickerTexture(sticker: StickerOption): THREE.CanvasTexture {
  if (stickerTextureCache[sticker.id]) return stickerTextureCache[sticker.id];
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.translate(256, 256);
    drawAestheticSticker(ctx, sticker, 460);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 16;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  stickerTextureCache[sticker.id] = tex;
  return tex;
}

/**
 * Creates a CURVED 3D Vinyl Die-Cut Sticker patch that wraps seamlessly around the exact
 * cylindrical taper of the tumbler wall at `(theta, yLocal)` with ZERO flat-polygon clipping.
 */
export function create3DPuffyStickerMesh(sticker: PlacedSticker): THREE.Group {
  const group = new THREE.Group();
  if (
    sticker.theta === undefined ||
    sticker.yLocal === undefined ||
    sticker.radiusTopAtY === undefined ||
    sticker.radiusBotAtY === undefined
  ) {
    return group;
  }

  const tex = getHighResStickerTexture(sticker);
  const patchHeight = 0.44 * sticker.scale;
  const avgR = (sticker.radiusTopAtY + sticker.radiusBotAtY) * 0.5;
  const thetaLength = (0.44 * sticker.scale) / Math.max(0.5, avgR);

  const curvedGeo = new THREE.CylinderGeometry(
    sticker.radiusTopAtY + 0.004,
    sticker.radiusBotAtY + 0.004,
    patchHeight,
    32,
    8,
    true,
    sticker.theta - thetaLength / 2,
    thetaLength
  );

  const mat = new THREE.MeshPhysicalMaterial({
    map: tex,
    transparent: true,
    alphaTest: 0.02,
    roughness: 0.24,
    metalness: 0.02,
    clearcoat: 0.45,
    clearcoatRoughness: 0.18,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });

  const mesh = new THREE.Mesh(curvedGeo, mat);
  mesh.position.y = sticker.yLocal;
  group.add(mesh);

  return group;
}
