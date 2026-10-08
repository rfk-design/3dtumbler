import React, { useRef, useState } from 'react';
import { TumblerModelSpec } from './tumblerModels';
import { PlacedSticker, getStickerPreviewDataUrl } from './stickers3D';
import {
  StrawTopperVariant,
  KeychainVariant,
  StrapVariant,
  BootVariant,
} from './accessories3D';
import {
  LaserEngravingConfig,
  getLaserStyleSpec,
} from './laserEngraving3D';

interface Tumbler3DFallbackProps {
  model: TumblerModelSpec;
  colorHex: string;
  capColorHex: string;
  finish: 'matte' | 'glossy';
  stickers: PlacedSticker[];
  laserEngraving?: LaserEngravingConfig;
  accessories: {
    keychain: boolean;
    strap: boolean;
    topper: boolean;
    boot: boolean;
  };
  topperVariant?: StrawTopperVariant;
  keychainVariant?: KeychainVariant;
  strapVariant?: StrapVariant;
  bootVariant?: BootVariant;
  rotationY: number;
  autoRotate: boolean;
  followCursor?: boolean;
  isStickerMode: boolean;
  onPlaceSticker: (uvX: number, uvY: number, clientX: number, clientY: number) => void;
  onDragRotate: (deltaDeg: number) => void;
  onSetRotation?: (deg: number) => void;
  flowOffsetX?: number;
  flowTiltDeg?: number;
  flowScale?: number;
  showPedestal?: boolean;
}

/**
 * Ultra-clean high-DPI SVG + CSS 3D Octane-style product renderer fallback
 * Ensures crisp vector silhouettes, soft studio key/rim highlights, brushed stainless steel collar,
 * and zero melted or distorted edges even if WebGL is unavailable.
 */
export const Tumbler3DFallback: React.FC<Tumbler3DFallbackProps> = ({
  model,
  colorHex,
  capColorHex,
  finish,
  stickers,
  laserEngraving,
  accessories,
  topperVariant = 'cap-shield',
  keychainVariant = 'holo-star',
  strapVariant = 'woven-boho',
  bootVariant = 'waffle-pink',
  rotationY,
  followCursor = true,
  isStickerMode,
  onPlaceSticker,
  onDragRotate,
  onSetRotation,
  flowOffsetX = 0,
  flowTiltDeg = 0,
  flowScale = 1,
  showPedestal = false,
}) => {
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const [tiltX, setTiltX] = useState(3);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
    dragDistanceRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (isDraggingRef.current) {
      const dx = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
      dragDistanceRef.current += Math.abs(dx);
      onDragRotate(dx * 1.1);
      if (rect.height > 0) {
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        setTiltX(ny * 45);
      }
      return;
    }

    if (followCursor && rect.width > 0 && rect.height > 0) {
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      setTiltX(-ny * 38);
      if (onSetRotation) {
        onSetRotation(((nx * 180) + 360) % 360);
      }
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleBodyClick = (e: React.MouseEvent<SVGPathElement>) => {
    if (dragDistanceRef.current > 6) return;
    if (!isStickerMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    const normalizedRot = (((rotationY % 360) + 360) % 360) / 360;
    const uvX = ((relX * 0.5 + normalizedRot) % 1) * 2048;
    const uvY = Math.max(0.08, Math.min(0.92, relY)) * 2048;
    onPlaceSticker(uvX, uvY, e.clientX, e.clientY);
  };

  const isGlossy = finish === 'glossy';
  const handleSide = Math.cos((rotationY * Math.PI) / 180);

  // Precision SVG body path per tumbler model (Centered at X=200, Y=160..465)
  const getBodyPath = () => {
    switch (model.id) {
      case 'quench-1200':
        return 'M 110 165 L 290 165 L 288 305 C 288 330, 264 345, 264 370 L 260 452 C 260 460, 252 465, 244 465 L 156 465 C 148 465, 140 460, 140 452 L 136 370 C 136 345, 112 330, 112 305 Z';
      case 'hydro-900':
        return 'M 122 178 C 122 166, 132 162, 140 162 L 260 162 C 268 162, 278 166, 278 178 L 278 448 C 278 458, 268 465, 256 465 L 144 465 C 132 465, 122 458, 122 448 Z';
      case 'barista-500':
        return 'M 116 195 L 284 195 L 278 446 C 277 458, 267 465, 255 465 L 145 465 C 133 465, 123 458, 122 446 Z';
      case 'boba-700':
        return 'M 112 175 L 288 175 L 264 450 C 263 460, 254 465, 244 465 L 156 465 C 146 465, 137 460, 136 450 Z';
      case 'eco-750':
      default:
        // Classic crisp tapered stainless tumbler
        return 'M 114 165 L 286 165 L 264 450 C 263 460, 254 465, 244 465 L 156 465 C 146 465, 137 460, 136 450 Z';
    }
  };

  const bodyPathD = getBodyPath();
  const topY = model.id === 'barista-500' ? 195 : model.id === 'boba-700' ? 175 : 165;
  const topWidth = model.id === 'hydro-900' ? 140 : model.id === 'barista-500' ? 168 : 172;
  const leftX = 200 - topWidth / 2;

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={(e) =>
        setTiltX((prev) => Math.max(-8, Math.min(14, prev + (e.deltaY > 0 ? 1.5 : -1.5))))
      }
      className={`w-full h-full flex items-center justify-center select-none overflow-hidden ${
        isStickerMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
      }`}
    >
      <div
        className="relative w-[240px] h-[340px] sm:w-[320px] sm:h-[450px] md:w-[380px] md:h-[540px] flex items-center justify-center transition-transform duration-75"
        style={{
          transform: `translateX(${flowOffsetX}px) rotateZ(${flowTiltDeg}deg) rotateX(${tiltX * 0.25}deg) scale(${flowScale})`,
        }}
      >
        <svg
          viewBox="0 0 400 540"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Octane Soft Matte Pastel Cylindrical Lighting Gradient */}
            <linearGradient id="octaneMatteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity={isGlossy ? 0.24 : 0.17} />
              <stop offset="14%" stopColor="#000000" stopOpacity="0.02" />
              <stop offset="30%" stopColor="#ffffff" stopOpacity={isGlossy ? 0.58 : 0.34} />
              <stop offset="48%" stopColor="#ffffff" stopOpacity="0.06" />
              <stop offset="76%" stopColor="#000000" stopOpacity="0.06" />
              <stop offset="92%" stopColor="#ffffff" stopOpacity={isGlossy ? 0.25 : 0.12} />
              <stop offset="100%" stopColor="#000000" stopOpacity={isGlossy ? 0.28 : 0.22} />
            </linearGradient>

            {/* Vertical Ambient Occlusion Gradient */}
            <linearGradient id="octaneVertAO" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="12%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="86%" stopColor="#000000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.16" />
            </linearGradient>

            {/* Machined 18/8 Brushed Stainless Steel Gradient */}
            <linearGradient id="brushedSteelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="18%" stopColor="#e2e8f0" />
              <stop offset="32%" stopColor="#ffffff" />
              <stop offset="52%" stopColor="#94a3b8" />
              <stop offset="76%" stopColor="#f8fafc" />
              <stop offset="90%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Translucent Reusable Straw Gradient */}
            <linearGradient id="strawGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#ffffff" stopOpacity="0.96" />
              <stop offset="68%" stopColor="#f1f5f9" stopOpacity="0.78" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.88" />
            </linearGradient>

            {/* Soft E-Commerce Floor Contact Shadow */}
            <radialGradient id="floorContactShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e1814" stopOpacity="0.38" />
              <stop offset="48%" stopColor="#1e1814" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#1e1814" stopOpacity="0" />
            </radialGradient>

            <clipPath id="tumblerBodyClip">
              <path d={bodyPathD} />
            </clipPath>
          </defs>

          {/* 1. Soft Studio Contact Shadow */}
          <ellipse cx="200" cy="482" rx="92" ry="12" fill="url(#floorContactShadow)" />

          {/* 2. Quencher Side Comfort-Grip Handle (When on right or left side) */}
          {model.id === 'quench-1200' && (
            <g
              transform={`translate(200, 0) scale(${handleSide >= 0 ? Math.max(0.45, handleSide) : -Math.max(0.45, -handleSide)}, 1) translate(-200, 0)`}
            >
              {/* Stainless mounting brackets */}
              <rect x="282" y="192" width="16" height="12" rx="3" fill="url(#brushedSteelGrad)" />
              <rect x="262" y="330" width="20" height="12" rx="3" fill="url(#brushedSteelGrad)" />
              {/* Sculpted D-Handle */}
              <path
                d="M 294 198 L 328 198 C 340 198, 346 206, 346 218 L 342 320 C 341 331, 333 336, 322 336 L 278 336"
                fill="none"
                stroke={capColorHex}
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 294 198 L 328 198 C 340 198, 346 206, 346 218 L 342 320 C 341 331, 333 336, 322 336 L 278 336"
                fill="none"
                stroke="url(#octaneMatteGrad)"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}

          {/* 3. Single Reusable Vertical Straw with Top Rim */}
          <g>
            <rect
              x="191"
              y={topY - 102}
              width="18"
              height="96"
              rx="4"
              fill={capColorHex}
              fillOpacity="0.35"
            />
            <rect
              x="191"
              y={topY - 102}
              width="18"
              height="96"
              rx="4"
              fill="url(#strawGrad)"
              stroke="#ffffff"
              strokeWidth="1"
              strokeOpacity="0.7"
            />
            {/* Hollow inner straw bore line */}
            <rect
              x="195"
              y={topY - 100}
              width="10"
              height="88"
              rx="2"
              fill="#0f172a"
              fillOpacity="0.12"
            />
            <ellipse
              cx="200"
              cy={topY - 100}
              rx="9"
              ry="2.6"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="1"
            />
          </g>

          {/* 4. Optional Straw Topper Cap Accessory (6 Variations) */}
          {accessories.topper && (
            <g transform={`translate(200, ${topY - 104})`}>
              {/* Base Collar & Tether */}
              <rect x="-11" y="-4" width="22" height="14" rx="4" fill="#f472b6" />
              <path
                d="M 11 2 C 24 6, 24 22, 10 26"
                fill="none"
                stroke="#f472b6"
                strokeWidth="3.5"
              />
              {topperVariant === 'cap-shield' && (
                <g transform="translate(0, -14)">
                  <circle cx="0" cy="0" r="15" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="10.5" fill="#ffffff" />
                  <circle cx="0" cy="0" r="6.5" fill="#dc2626" />
                  <circle cx="0" cy="0" r="4" fill="#1d4ed8" />
                  <polygon
                    points="0,-3.8 1,-1 3.8,-1 1.6,0.8 2.4,3.5 0,1.8 -2.4,3.5 -1.6,0.8 -3.8,-1 -1,-1"
                    fill="#ffffff"
                  />
                </g>
              )}
              {topperVariant === 'spidey-mask' && (
                <g transform="translate(0, -14)">
                  <ellipse cx="0" cy="0" rx="13" ry="15" fill="#ef4444" stroke="#1e293b" strokeWidth="1.5" />
                  <path d="M -9 -2 Q -4 -8 -1 -1 Q -6 4 -9 -2 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                  <path d="M 9 -2 Q 4 -8 1 -1 Q 6 4 9 -2 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                </g>
              )}
              {topperVariant === 'strawberry' && (
                <g transform="translate(0, -14)">
                  <path d="M -12 -6 C -14 6, -5 14, 0 15 C 5 14, 14 6, 12 -6 C 10 -12, -10 -12, -12 -6 Z" fill="#ff5a79" />
                  <path d="M -9 -10 L 0 -6 L 9 -10 L 4 -14 L -4 -14 Z" fill="#4ade80" />
                  <circle cx="-4" cy="-2" r="1.2" fill="#fef08a" />
                  <circle cx="4" cy="-2" r="1.2" fill="#fef08a" />
                  <circle cx="0" cy="4" r="1.2" fill="#fef08a" />
                </g>
              )}
              {topperVariant === 'daisy' && (
                <g transform="translate(0, -14)">
                  <circle cx="0" cy="-9" r="6" fill="#ffffff" />
                  <circle cx="8" cy="-4" r="6" fill="#ffffff" />
                  <circle cx="8" cy="5" r="6" fill="#ffffff" />
                  <circle cx="0" cy="9" r="6" fill="#ffffff" />
                  <circle cx="-8" cy="5" r="6" fill="#ffffff" />
                  <circle cx="-8" cy="-4" r="6" fill="#ffffff" />
                  <circle cx="0" cy="0" r="6.5" fill="#facc15" />
                </g>
              )}
              {topperVariant === 'cloud' && (
                <g transform="translate(0, -13)">
                  <circle cx="-8" cy="2" r="7" fill="#f0f9ff" />
                  <circle cx="8" cy="2" r="7" fill="#f0f9ff" />
                  <circle cx="0" cy="-3" r="9" fill="#ffffff" />
                  <circle cx="-5" cy="1" r="2" fill="#fda4af" />
                  <circle cx="5" cy="1" r="2" fill="#fda4af" />
                </g>
              )}
              {topperVariant === 'cat-paw' && (
                <g transform="translate(0, -14)">
                  <circle cx="0" cy="0" r="13" fill="#fff5f7" stroke="#fbcfe8" strokeWidth="1.5" />
                  <ellipse cx="0" cy="3" rx="5.5" ry="4" fill="#ff8fab" />
                  <circle cx="-6" cy="-4" r="2.3" fill="#ff8fab" />
                  <circle cx="-2" cy="-6.5" r="2.3" fill="#ff8fab" />
                  <circle cx="2" cy="-6.5" r="2.3" fill="#ff8fab" />
                  <circle cx="6" cy="-4" r="2.3" fill="#ff8fab" />
                </g>
              )}
            </g>
          )}

          {/* 5. Precision Screw-On / Press-Fit Lid */}
          {model.id === 'boba-700' ? (
            <g>
              <path
                d={`M ${leftX} ${topY - 8} A 86 64 0 0 1 ${leftX + topWidth} ${topY - 8} Z`}
                fill="#ffffff"
                fillOpacity="0.55"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <rect
                x={leftX - 2}
                y={topY - 14}
                width={topWidth + 4}
                height="12"
                rx="4"
                fill={capColorHex}
              />
              <rect
                x={leftX - 2}
                y={topY - 14}
                width={topWidth + 4}
                height="12"
                rx="4"
                fill="url(#octaneMatteGrad)"
              />
            </g>
          ) : (
            <g>
              {/* Silicone Straw Grommet Boss */}
              <rect
                x="184"
                y={topY - 34}
                width="32"
                height="8"
                rx="4"
                fill={capColorHex}
              />
              {/* Main Sculpted Lid */}
              <rect
                x={leftX + 1}
                y={topY - 28}
                width={topWidth - 2}
                height="22"
                rx="6"
                fill={capColorHex}
              />
              <rect
                x={leftX + 1}
                y={topY - 28}
                width={topWidth - 2}
                height="22"
                rx="6"
                fill="url(#octaneMatteGrad)"
              />
              {/* Crisp Top Lid Highlight Edge */}
              <line
                x1={leftX + 8}
                y1={topY - 27}
                x2={leftX + topWidth - 8}
                y2={topY - 27}
                stroke="#ffffff"
                strokeOpacity="0.65"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* 6. Machined 18/8 Brushed Stainless Steel Lip Collar & Bottom Base */}
          <rect
            x={leftX}
            y={topY - 7}
            width={topWidth}
            height="10"
            rx="1.5"
            fill="url(#brushedSteelGrad)"
          />
          <path
            d="M 148 462 L 252 462 L 247 471 C 246 473, 242 474, 238 474 L 162 474 C 158 474, 154 473, 153 471 Z"
            fill="url(#brushedSteelGrad)"
          />

          {/* 7. Main Matte Pastel Powder-Coated Stainless Tumbler Body */}
          <g clipPath="url(#tumblerBodyClip)">
            <path
              d={bodyPathD}
              fill={colorHex}
              onClick={handleBodyClick}
              className="transition-colors duration-200"
            />
            <path d={bodyPathD} fill="url(#octaneMatteGrad)" className="pointer-events-none" />
            <path d={bodyPathD} fill="url(#octaneVertAO)" className="pointer-events-none" />

            {/* Soft Studio Key Light Specular Reflection Strip */}
            <rect
              x="142"
              y="160"
              width="22"
              height="310"
              fill="#ffffff"
              fillOpacity={isGlossy ? 0.32 : 0.14}
              filter="blur(6px)"
              className="pointer-events-none"
            />

            {/* Subtle Laser-Etched Brand Mark */}
            <text
              x={200 + Math.sin((rotationY * Math.PI) / 180) * 32}
              y="436"
              textAnchor="middle"
              fill={colorHex === '#2A2A2E' ? 'rgba(255,255,255,0.28)' : 'rgba(30,41,59,0.24)'}
              fontSize="10"
              fontWeight="800"
              letterSpacing="2.5"
              className="pointer-events-none"
            >
              TUMBLR.LAB
            </text>

            {/* Custom Laser-Engraved Name (Reveals Raw Brushed Stainless Steel Silver Underneath) */}
            {laserEngraving?.enabled && laserEngraving.text.trim() && (() => {
              const spec = getLaserStyleSpec(laserEngraving.styleId);
              const offsetX = Math.sin((rotationY * Math.PI) / 180) * 32;
              const isVert = laserEngraving.placement === 'vertical-side';
              const isMiddle = laserEngraving.placement === 'horizontal-middle';
              const cx = 200 + offsetX;
              const cy = isVert ? 290 : isMiddle ? 295 : 392;
              const userPx = laserEngraving.fontSizePx ?? 28;
              const fontSize = Math.round((isVert ? 28 : 24) * (userPx / 28));
              const rotAngle = (isVert ? -90 : 0) + (laserEngraving.rotationDeg ?? 0);
              return (
                <g
                  transform={`translate(${cx}, ${cy}) rotate(${rotAngle})`}
                  className="pointer-events-none"
                >
                  {/* Top-left inner debossed cavity shadow */}
                  <text
                    x="-1"
                    y="-1"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="rgba(15, 23, 42, 0.78)"
                    style={{
                      fontFamily: spec.fontFamily,
                      fontWeight: spec.fontWeight,
                      fontStyle: spec.fontStyle,
                      fontSize: `${fontSize}px`,
                      letterSpacing: `${spec.letterSpacingPx * 0.4}px`,
                    }}
                  >
                    {laserEngraving.text.trim()}
                  </text>
                  {/* Bottom-right bevel highlight */}
                  <text
                    x="0.8"
                    y="0.8"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="rgba(255, 255, 255, 0.85)"
                    style={{
                      fontFamily: spec.fontFamily,
                      fontWeight: spec.fontWeight,
                      fontStyle: spec.fontStyle,
                      fontSize: `${fontSize}px`,
                      letterSpacing: `${spec.letterSpacingPx * 0.4}px`,
                    }}
                  >
                    {laserEngraving.text.trim()}
                  </text>
                  {/* Raw Brushed Stainless Steel Silver Fill */}
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="url(#brushedSteelGrad)"
                    style={{
                      fontFamily: spec.fontFamily,
                      fontWeight: spec.fontWeight,
                      fontStyle: spec.fontStyle,
                      fontSize: `${fontSize}px`,
                      letterSpacing: `${spec.letterSpacingPx * 0.4}px`,
                    }}
                  >
                    {laserEngraving.text.trim()}
                  </text>
                </g>
              );
            })()}

            {/* Protective Silicone Boot Accessory (3 Variations) */}
            {accessories.boot && (
              <g className="pointer-events-none">
                {bootVariant === 'waffle-pink' && (
                  <>
                    <rect x="120" y="398" width="160" height="72" fill="#fda4af" />
                    <rect x="120" y="398" width="160" height="72" fill="url(#octaneMatteGrad)" />
                    {[412, 428, 444, 458].map((ry) => (
                      <line
                        key={ry}
                        x1="120"
                        y1={ry}
                        x2="280"
                        y2={ry}
                        stroke="#fb7185"
                        strokeOpacity="0.45"
                        strokeWidth="2"
                      />
                    ))}
                    {[152, 176, 200, 224, 248].map((rx) => (
                      <line
                        key={rx}
                        x1={rx}
                        y1="398"
                        x2={rx}
                        y2="470"
                        stroke="#fb7185"
                        strokeOpacity="0.45"
                        strokeWidth="2"
                      />
                    ))}
                  </>
                )}
                {bootVariant === 'clear-rubber' && (
                  <>
                    <rect
                      x="120"
                      y="398"
                      width="160"
                      height="72"
                      fill="#f8fafc"
                      fillOpacity="0.48"
                    />
                    {[415, 434, 452].map((ry) => (
                      <line
                        key={ry}
                        x1="120"
                        y1={ry}
                        x2="280"
                        y2={ry}
                        stroke="#ffffff"
                        strokeOpacity="0.7"
                        strokeWidth="2.5"
                      />
                    ))}
                  </>
                )}
                {bootVariant === 'glitter-boot' && (
                  <>
                    <rect
                      x="120"
                      y="398"
                      width="160"
                      height="72"
                      fill="#f5d0fe"
                      fillOpacity="0.65"
                    />
                    <circle cx="156" cy="418" r="2.2" fill="#fef08a" />
                    <circle cx="182" cy="442" r="2.5" fill="#67e8f9" />
                    <circle cx="212" cy="415" r="2" fill="#ffffff" />
                    <circle cx="236" cy="448" r="2.4" fill="#f472b6" />
                    <circle cx="168" cy="456" r="1.8" fill="#ffffff" />
                    <circle cx="222" cy="432" r="2.2" fill="#fef08a" />
                  </>
                )}
                <line
                  x1="120"
                  y1="398"
                  x2="280"
                  y2="398"
                  stroke="#ffffff"
                  strokeOpacity="0.65"
                  strokeWidth="2.5"
                />
              </g>
            )}
          </g>

          {/* Crisp Outer Rim Edge Stroke */}
          <path
            d={bodyPathD}
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.28"
            strokeWidth="1.2"
            className="pointer-events-none"
          />

          {/* 8. Optional Carrying Strap / Handle Accessory (3 Variations) */}
          {accessories.strap && (
            <g className="pointer-events-none">
              {strapVariant === 'woven-boho' && (
                <>
                  <path
                    d={`M ${leftX - 2} ${topY + 24} C ${leftX - 38} ${topY + 34}, ${leftX - 40} ${topY + 118}, ${leftX + 6} ${topY + 132}`}
                    fill="none"
                    stroke="#ece3d5"
                    strokeWidth="11"
                    strokeLinecap="round"
                  />
                  <path
                    d={`M ${leftX - 2} ${topY + 24} C ${leftX - 38} ${topY + 34}, ${leftX - 40} ${topY + 118}, ${leftX + 6} ${topY + 132}`}
                    fill="none"
                    stroke="#d97757"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                  />
                  <rect
                    x={leftX - 3}
                    y={topY + 14}
                    width={topWidth + 6}
                    height="14"
                    rx="4"
                    fill="#c89d7c"
                  />
                  <circle cx={leftX - 3} cy={topY + 21} r="5.5" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />
                </>
              )}
              {strapVariant === 'silicone-grip' && (
                <>
                  <path
                    d={`M ${leftX - 2} ${topY + 22} C ${leftX - 34} ${topY + 28}, ${leftX - 34} ${topY + 112}, ${leftX + 6} ${topY + 118}`}
                    fill="none"
                    stroke="#f472b6"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  <rect
                    x={leftX - 3}
                    y={topY + 14}
                    width={topWidth + 6}
                    height="12"
                    rx="4"
                    fill="#f472b6"
                  />
                  <rect
                    x={leftX + 2}
                    y={topY + 112}
                    width={topWidth - 4}
                    height="10"
                    rx="4"
                    fill="#f472b6"
                  />
                </>
              )}
              {strapVariant === 'clear-beaded' && (
                <>
                  <rect
                    x={leftX - 2}
                    y={topY + 15}
                    width={topWidth + 4}
                    height="8"
                    rx="4"
                    fill="#e2e8f0"
                  />
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
                    const ang = (idx / 7) * Math.PI;
                    const bx = leftX - Math.sin(ang) * 30;
                    const by = topY + 24 + (idx / 7) * 96;
                    return (
                      <circle
                        key={idx}
                        cx={bx}
                        cy={by}
                        r="6.5"
                        fill={idx % 2 === 0 ? '#f8fafc' : '#fce7f3'}
                        stroke="#cbd5e1"
                        strokeWidth="1.2"
                      />
                    );
                  })}
                </>
              )}
            </g>
          )}

          {/* 9. Optional 3D Keychain Charm Accessory (4 Variations) */}
          {accessories.keychain && (
            <g className="pointer-events-none">
              <rect
                x={leftX - 2}
                y={topY + 10}
                width={topWidth + 4}
                height="4"
                rx="2"
                fill={keychainVariant === 'plush-bear' ? '#fbbf24' : '#cbd5e1'}
              />
              <circle
                cx={leftX + topWidth + 5}
                cy={topY + 12}
                r="5.5"
                fill="none"
                stroke={keychainVariant === 'plush-bear' ? '#fbbf24' : '#94a3b8'}
                strokeWidth="2.5"
              />
              <line
                x1={leftX + topWidth + 7}
                y1={topY + 17}
                x2={leftX + topWidth + 7}
                y2={topY + 42}
                stroke={keychainVariant === 'plush-bear' ? '#fbbf24' : '#94a3b8'}
                strokeWidth="2.5"
              />
              {keychainVariant === 'holo-star' && (
                <g transform={`translate(${leftX + topWidth + 7}, ${topY + 56})`}>
                  <polygon
                    points="0,-16 4.5,-5 16,-4 7,4 9.5,15 0,9 -9.5,15 -7,4 -16,-4 -4.5,-5"
                    fill="#c4b5fd"
                    fillOpacity="0.85"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </g>
              )}
              {keychainVariant === 'hydrate-beads' && (
                <g transform={`translate(${leftX + topWidth + 7}, ${topY + 34})`}>
                  {['H', 'Y', 'D', 'R', 'A', 'T', 'E'].map((ch, idx) => (
                    <g key={ch + idx} transform={`translate(0, ${idx * 10})`}>
                      <rect x="-5.5" y="-4.5" width="11" height="9" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                      <text x="0" y="2.5" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#db2777">
                        {ch}
                      </text>
                    </g>
                  ))}
                </g>
              )}
              {keychainVariant === 'plush-bear' && (
                <g transform={`translate(${leftX + topWidth + 7}, ${topY + 56})`}>
                  <circle cx="-8" cy="-10" r="4.5" fill="#c69c72" />
                  <circle cx="8" cy="-10" r="4.5" fill="#c69c72" />
                  <circle cx="0" cy="-2" r="11" fill="#d6ad83" />
                  <ellipse cx="0" cy="0" rx="4.5" ry="3.2" fill="#fffbeb" />
                  <circle cx="0" cy="-1" r="1.5" fill="#292524" />
                  <circle cx="-4" cy="-4" r="1.3" fill="#292524" />
                  <circle cx="4" cy="-4" r="1.3" fill="#292524" />
                </g>
              )}
              {keychainVariant === 'chibi-hero' && (
                <g transform={`translate(${leftX + topWidth + 7}, ${topY + 56})`}>
                  <circle cx="0" cy="0" r="15" fill="#e0f2fe" fillOpacity="0.75" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="0" cy="0" r="11" fill="#dc2626" />
                  <rect x="-7" y="-5" width="14" height="10" rx="3" fill="#facc15" />
                  <rect x="-5.5" y="-2" width="4" height="2" fill="#38bdf8" />
                  <rect x="1.5" y="-2" width="4" height="2" fill="#38bdf8" />
                </g>
              )}
            </g>
          )}
        </svg>

        {/* Placed 3D Stickers Overlaid with Cylindrical Foreshortening */}
        <div className="absolute inset-0 pointer-events-none">
          {stickers.map((st) => {
            const stickerAngle = (st.x / 2048) * 360;
            const relAngle = ((((stickerAngle - rotationY) % 360) + 540) % 360) - 180;
            if (Math.abs(relAngle) > 85) return null;

            const rad = (relAngle * Math.PI) / 180;
            const xPx = 190 + Math.sin(rad) * 64;
            const yPx = 175 + (st.y / 2048) * 270;
            const foreshorten = Math.max(0.35, Math.cos(rad));
            const imgUrl = getStickerPreviewDataUrl(st);

            return (
              <div
                key={st.uid}
                style={{
                  left: `${xPx}px`,
                  top: `${yPx}px`,
                  transform: `translate(-50%, -50%) scale(${st.scale}) scaleX(${foreshorten})`,
                }}
                className="absolute transition-transform duration-75"
              >
                <img
                  src={imgUrl}
                  alt={st.name}
                  className="w-16 h-16 object-contain drop-shadow-md"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
