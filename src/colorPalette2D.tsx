import React, { useRef, useEffect, useState, useCallback } from 'react';

export type ColorCategory = 'pastel' | 'earth' | 'vibrant' | 'dark';

export interface TumblerColor {
  id: string;
  name: string;
  hex: string;
  capHex: string;
  category: ColorCategory;
  code: string;
}

/**
 * Curated 24-Color 2D Custom Matte Pastel & Aesthetic Swatch Grid
 * Covering soft pastel tones, earthy muted shades, vibrant & neon accents, and dark charcoal/obsidian shades.
 */
export const TUMBLER_COLOR_SWATCHES: TumblerColor[] = [
  // 1. Soft Pastel Tones
  { id: 'peach', name: 'Soft Peach', hex: '#FFD3C4', capHex: '#FFD3C4', category: 'pastel', code: 'PST-01' },
  { id: 'mint', name: 'Sage Mint', hex: '#C7E8CA', capHex: '#C7E8CA', category: 'pastel', code: 'PST-02' },
  { id: 'lilac', name: 'Lilac Lavender', hex: '#E1D5E7', capHex: '#E1D5E7', category: 'pastel', code: 'PST-03' },
  { id: 'skyblue', name: 'Sky Blue', hex: '#BCE3F5', capHex: '#BCE3F5', category: 'pastel', code: 'PST-04' },
  { id: 'butter', name: 'Butter Yellow', hex: '#FFF2B2', capHex: '#FFF2B2', category: 'pastel', code: 'PST-05' },
  { id: 'pink', name: 'Bubble Pink', hex: '#F8C8DC', capHex: '#F8C8DC', category: 'pastel', code: 'PST-06' },
  { id: 'cream', name: 'Vanilla Cream', hex: '#F5EFE6', capHex: '#F5EFE6', category: 'pastel', code: 'PST-07' },
  { id: 'periwinkle', name: 'Cloud Periwinkle', hex: '#C5D1EB', capHex: '#C5D1EB', category: 'pastel', code: 'PST-08' },

  // 2. Earthy & Muted Shades (Sage, Terracotta, Mocha)
  { id: 'sage', name: 'Botanical Sage', hex: '#9CAF88', capHex: '#9CAF88', category: 'earth', code: 'ERT-01' },
  { id: 'terracotta', name: 'Warm Terracotta', hex: '#E07A5F', capHex: '#E07A5F', category: 'earth', code: 'ERT-02' },
  { id: 'mocha', name: 'Velvet Mocha', hex: '#8D6E63', capHex: '#8D6E63', category: 'earth', code: 'ERT-03' },
  { id: 'sand', name: 'Oatmeal Sand', hex: '#E6CCB2', capHex: '#E6CCB2', category: 'earth', code: 'ERT-04' },
  { id: 'matcha', name: 'Uji Matcha', hex: '#A3B18A', capHex: '#A3B18A', category: 'earth', code: 'ERT-05' },
  { id: 'clay', name: 'Dusty Rose Clay', hex: '#D4A373', capHex: '#D4A373', category: 'earth', code: 'ERT-06' },

  // 3. Vibrant Hues & Neon Accents
  { id: 'neon-coral', name: 'Neon Coral Pop', hex: '#FF5E7E', capHex: '#FF5E7E', category: 'vibrant', code: 'VIB-01' },
  { id: 'electric-lime', name: 'Neon Cyber Lime', hex: '#B5E48C', capHex: '#B5E48C', category: 'vibrant', code: 'VIB-02' },
  { id: 'aqua-pop', name: 'Electric Aqua', hex: '#48CAE4', capHex: '#48CAE4', category: 'vibrant', code: 'VIB-03' },
  { id: 'sunset-tangerine', name: 'Sunset Tangerine', hex: '#FF9F1C', capHex: '#FF9F1C', category: 'vibrant', code: 'VIB-04' },
  { id: 'berry-violet', name: 'Vibrant Berry', hex: '#9D4EDD', capHex: '#9D4EDD', category: 'vibrant', code: 'VIB-05' },
  { id: 'sunflower', name: 'Vivid Marigold', hex: '#FFBE0B', capHex: '#FFBE0B', category: 'vibrant', code: 'VIB-06' },

  // 4. Dark Muted & Charcoal Shades
  { id: 'charcoal', name: 'Nordic Charcoal', hex: '#374151', capHex: '#374151', category: 'dark', code: 'DRK-01' },
  { id: 'obsidian', name: 'Matte Obsidian', hex: '#2A2A2E', capHex: '#2A2A2E', category: 'dark', code: 'DRK-02' },
  { id: 'midnight', name: 'Midnight Navy', hex: '#1E293B', capHex: '#1E293B', category: 'dark', code: 'DRK-03' },
  { id: 'forest', name: 'Deep Pine Forest', hex: '#1B4332', capHex: '#1B4332', category: 'dark', code: 'DRK-04' },
];

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

interface AestheticColorWheelProps {
  selectedHex: string;
  onSelectCustomHex: (hex: string, name: string) => void;
  size?: number;
}

/**
 * 2D Flat-Lay Aesthetic Color Wheel Component (Zero shadows, zero 3D distortion)
 * Renders a smooth high-DPI harmonic color wheel on a pure white background.
 */
export const AestheticColorWheel: React.FC<AestheticColorWheelProps> = ({
  selectedHex,
  onSelectCustomHex,
  size = 188,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [lightness, setLightness] = useState<number>(82); // Default pastel lightness

  // Draw crisp 2D flat-lay color wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = 2;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = (size * dpr) / 2;
    const cy = (size * dpr) / 2;
    const radius = (size * dpr) / 2 - 4;

    const imgData = ctx.createImageData(size * dpr, size * dpr);
    const data = imgData.data;

    for (let y = 0; y < size * dpr; y++) {
      for (let x = 0; x < size * dpr; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.hypot(dx, dy);
        const idx = (y * size * dpr + x) * 4;

        if (dist <= radius) {
          const angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
          const sat = Math.min(100, (dist / radius) * 100);
          // Convert HSL to RGB
          const l = lightness / 100;
          const a = (sat * Math.min(l, 1 - l)) / 100;
          const f = (n: number) => {
            const k = (n + angle / 30) % 12;
            return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)));
          };
          data[idx] = f(0);
          data[idx + 1] = f(8);
          data[idx + 2] = f(4);
          // Crisp anti-aliased edge
          const edgeAlpha = dist > radius - 2 ? Math.max(0, (radius - dist) / 2) : 1;
          data[idx + 3] = Math.round(edgeAlpha * 255);
        } else {
          data[idx + 3] = 0;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [size, lightness]);

  const pickColorAtEvent = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const maxR = rect.width / 2 - 4;

      let dx = clientX - rect.left - cx;
      let dy = clientY - rect.top - cy;
      const dist = Math.hypot(dx, dy);

      if (dist > maxR) {
        dx = (dx / dist) * maxR;
        dy = (dy / dist) * maxR;
      }

      setCursorPos({ x: cx + dx, y: cy + dy });

      const hue = Math.round(((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360);
      const sat = Math.round(Math.min(100, (Math.hypot(dx, dy) / maxR) * 100));
      const hex = hslToHex(hue, sat, lightness);
      const toneLabel =
        lightness >= 78
          ? 'Pastel'
          : lightness >= 52
          ? 'Vibrant'
          : lightness >= 34
          ? 'Muted'
          : 'Deep';
      onSelectCustomHex(hex, `Custom ${toneLabel} (${hex})`);
    },
    [lightness, onSelectCustomHex]
  );

  return (
    <div className="bg-white rounded-2xl p-3.5 border border-slate-200 flex flex-col items-center gap-3">
      <div className="w-full flex items-center justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
            2D Aesthetic Color Wheel
          </p>
          <p className="text-[9px] text-slate-400 font-medium">
            Smooth Matte Spectrum · Zero Shadow Flat-Lay
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
          <span
            className="w-3.5 h-3.5 rounded-full border border-slate-300"
            style={{ backgroundColor: selectedHex }}
          />
          <span className="text-[10px] font-mono font-bold text-slate-700 uppercase">
            {selectedHex}
          </span>
        </div>
      </div>

      {/* Flat 2D Color Wheel Canvas */}
      <div
        className="relative select-none touch-none cursor-crosshair"
        style={{ width: size, height: size }}
        onPointerDown={(e) => {
          isDraggingRef.current = true;
          pickColorAtEvent(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (!isDraggingRef.current) return;
          pickColorAtEvent(e.clientX, e.clientY);
        }}
        onPointerUp={() => {
          isDraggingRef.current = false;
        }}
        onPointerLeave={() => {
          isDraggingRef.current = false;
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: size, height: size }}
          className="block rounded-full border-2 border-slate-200"
        />

        {/* Crisp 2D Reticle Ring */}
        {cursorPos && (
          <div
            className="w-5 h-5 rounded-full border-2 border-white ring-2 ring-slate-900 pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: cursorPos.x,
              top: cursorPos.y,
              backgroundColor: selectedHex,
            }}
          />
        )}
      </div>

      {/* Tone / Value Slider (Pastel -> Vibrant -> Muted -> Dark Charcoal) */}
      <div className="w-full space-y-1.5 pt-1 border-t border-slate-100">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
          <span>Tone Brightness</span>
          <div className="flex items-center gap-1">
            {[
              { label: 'Pastel', val: 84 },
              { label: 'Vibrant', val: 62 },
              { label: 'Muted', val: 46 },
              { label: 'Dark', val: 24 },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setLightness(preset.val);
                }}
                className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold cursor-pointer transition ${
                  Math.abs(lightness - preset.val) <= 8
                    ? 'bg-pink-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
        <input
          type="range"
          min="18"
          max="92"
          value={lightness}
          onChange={(e) => setLightness(Number(e.target.value))}
          className="w-full accent-pink-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
        />
      </div>
    </div>
  );
};
