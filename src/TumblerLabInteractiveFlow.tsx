/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * TumblerLabInteractiveFlow.tsx
 * ============================================================================
 * Komponen Modular React + Tailwind CSS + GSAP untuk:
 * 1. `TumblrLabNeonLogo`: Logo TUMBLR.LAB bergaya 3D Glassmorphism / Cyberpunk
 *    minimalis dengan ikon tumbler 3D miring berpendar neon (cyan & purple glow),
 *    tipografi tegas bergradien cyan-putih, dan aksen kilauan (sparkles).
 * 2. `TumblerFlowStageOverlay`: Halaman Loading & Login awal dengan background
 *    dark mode bergradien (slate/indigo), ambient glow di sudut layar, foto
 *    tumbler polos di sisi kiri, kartu Frosted Glass di sisi kanan, tombol CTA
 *    "Masuk Studio 3D", dan tombol "Masuk sebagai Tamu (Guest Mode)".
 * 3. `StudioBottomCustomizationDock`: Pill bar minimalis di bagian bawah
 *    viewport 3D (hanya 360° Auto-Rotate & Zoom tanpa slider Laser/Stiker).
 * ============================================================================
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { TumblerColor } from './colorPalette2D';
import { LaserEngravingConfig } from './laserEngraving3D';

export type AppFlowState = 'loading' | 'login' | 'studio';

/**
 * ============================================================================
 * KOMPONEN 1: LOGO TUMBLR.LAB (3D Glassmorphism / Minimalist Cyberpunk)
 * ============================================================================
 */
interface TumblrLabNeonLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const TumblrLabNeonLogo: React.FC<TumblrLabNeonLogoProps> = ({
  size = 'lg',
  showSubtitle = true,
}) => {
  const isSmall = size === 'sm';
  const isMedium = size === 'md';

  return (
    <div className="inline-flex items-center gap-3.5 select-none group">
      {/* Container Ikon Tumbler 3D Miring (3D Glassmorphism + Cyan & Purple Neon Glow) */}
      <div
        className={`relative flex items-center justify-center rounded-2xl bg-slate-900/75 backdrop-blur-xl border border-cyan-400/35 shadow-[0_0_28px_rgba(34,211,238,0.28),0_0_45px_rgba(168,85,247,0.22)] group-hover:shadow-[0_0_36px_rgba(34,211,238,0.48),0_0_60px_rgba(168,85,247,0.38)] transition-all duration-300 ${
          isSmall ? 'w-10 h-10' : isMedium ? 'w-12 h-12' : 'w-14 h-14'
        }`}
      >
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-cyan-400/30 via-transparent to-purple-500/35 blur-md opacity-80 group-hover:opacity-100 transition pointer-events-none" />

        {/* Sparkle Pojok Kanan Atas */}
        <svg
          viewBox="0 0 24 24"
          className="absolute -top-1.5 -right-1.5 w-4 h-4 text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.9)] animate-pulse pointer-events-none"
          fill="currentColor"
        >
          <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
        </svg>

        {/* SVG Ikon Tumbler 3D Miring */}
        <svg
          viewBox="0 0 64 64"
          className={`${
            isSmall ? 'w-6 h-6' : isMedium ? 'w-8 h-8' : 'w-9 h-9'
          } -rotate-12 group-hover:-rotate-6 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.55)]`}
          fill="none"
        >
          <defs>
            <linearGradient id="neonTumblerBody" x1="16" y1="14" x2="48" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.9" />
              <stop offset="48%" stopColor="#38BDF8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#A855F7" stopOpacity="0.92" />
            </linearGradient>
            <linearGradient id="neonTumblerRim" x1="14" y1="14" x2="50" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
          </defs>

          <path d="M32 5V16" stroke="#67E8F9" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="32" cy="7" r="2.8" fill="#F0ABFC" />

          <path
            d="M44 25H49C51.2 25 53 26.8 53 29V39C53 41.2 51.2 43 49 43H42.5"
            stroke="#C084FC"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <rect
            x="17"
            y="14"
            width="30"
            height="6.5"
            rx="3.2"
            fill="#E0F2FE"
            fillOpacity="0.88"
            stroke="#22D3EE"
            strokeWidth="1.5"
          />

          <path
            d="M19 21H45L41.5 53C41.3 55.2 39.5 57 37.3 57H26.7C24.5 57 22.7 55.2 22.5 53L19 21Z"
            fill="url(#neonTumblerBody)"
            stroke="url(#neonTumblerRim)"
            strokeWidth="2"
          />

          <path
            d="M23.5 24.5L25.5 51.5"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeOpacity="0.75"
          />
        </svg>
      </div>

      {/* Tipografi Teks "TUMBLR.LAB" Gradien Cyan-Putih + Sparkles */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_16px_rgba(34,211,238,0.35)] ${
              isSmall ? 'text-lg' : isMedium ? 'text-xl' : 'text-2xl sm:text-3xl'
            }`}
          >
            TUMBLR
          </span>
          <span
            className={`font-black tracking-tight bg-gradient-to-r from-cyan-300 via-sky-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(168,85,247,0.5)] ${
              isSmall ? 'text-lg' : isMedium ? 'text-xl' : 'text-2xl sm:text-3xl'
            }`}
          >
            .LAB
          </span>

          <span className="inline-flex items-center text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current animate-spin" style={{ animationDuration: '9s' }}>
              <path d="M12 1L14.5 9.5L23 12L14.5 14.5L12 23L9.5 14.5L1 12L9.5 9.5L12 1Z" />
            </svg>
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300/80">
              3D Customizer Studio
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * ============================================================================
 * GENERATOR FOTO TUMBLER POLOS (Tanpa Teks Laser / Badge) UNTUK HALAMAN LOGIN
 * ============================================================================
 */
let cachedPlainTumblerUrl = '';

export function getPlainLoginTumblerImageUrl(): string {
  if (cachedPlainTumblerUrl) return cachedPlainTumblerUrl;

  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 1200;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Bayangan Halus di Bawah Tumbler
  const shadowGrad = ctx.createRadialGradient(450, 1025, 10, 450, 1025, 220);
  shadowGrad.addColorStop(0, 'rgba(34, 211, 238, 0.28)');
  shadowGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.12)');
  shadowGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.ellipse(450, 1025, 210, 32, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Sedotan Transparan Polos
  ctx.save();
  const strawGrad = ctx.createLinearGradient(430, 95, 470, 95);
  strawGrad.addColorStop(0, 'rgba(226, 232, 240, 0.85)');
  strawGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.45)');
  strawGrad.addColorStop(1, 'rgba(148, 163, 184, 0.85)');
  ctx.fillStyle = strawGrad;
  ctx.beginPath();
  ctx.roundRect(432, 105, 36, 155, 8);
  ctx.fill();
  ctx.restore();

  // 3. Handle Samping Polos
  ctx.save();
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 30;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(615, 365);
  ctx.lineTo(690, 365);
  ctx.quadraticCurveTo(720, 365, 716, 405);
  ctx.lineTo(704, 645);
  ctx.quadraticCurveTo(700, 680, 670, 680);
  ctx.lineTo(590, 680);
  ctx.stroke();

  ctx.fillStyle = '#CBD5E1';
  ctx.fillRect(606, 348, 28, 24);
  ctx.fillRect(584, 666, 30, 24);
  ctx.restore();

  // 4. Body Tumbler Polos (Tanpa Teks Laser / Tulisan Apapun)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(265, 290);
  ctx.lineTo(635, 290);
  ctx.lineTo(592, 985);
  ctx.quadraticCurveTo(590, 1015, 558, 1015);
  ctx.lineTo(342, 1015);
  ctx.quadraticCurveTo(310, 1015, 308, 985);
  ctx.closePath();
  ctx.clip();

  const bodyBaseGrad = ctx.createLinearGradient(265, 290, 635, 1015);
  bodyBaseGrad.addColorStop(0, '#0EA5E9');
  bodyBaseGrad.addColorStop(0.55, '#2563EB');
  bodyBaseGrad.addColorStop(1, '#7C3AED');
  ctx.fillStyle = bodyBaseGrad;
  ctx.fillRect(250, 280, 400, 750);

  const cylLight = ctx.createLinearGradient(265, 0, 635, 0);
  cylLight.addColorStop(0, 'rgba(34, 211, 238, 0.5)');
  cylLight.addColorStop(0.16, 'rgba(255, 255, 255, 0.32)');
  cylLight.addColorStop(0.38, 'rgba(15, 23, 42, 0.04)');
  cylLight.addColorStop(0.74, 'rgba(15, 23, 42, 0.35)');
  cylLight.addColorStop(0.92, 'rgba(192, 132, 252, 0.45)');
  cylLight.addColorStop(1, 'rgba(15, 23, 42, 0.42)');
  ctx.fillStyle = cylLight;
  ctx.fillRect(250, 280, 400, 750);

  // Cincin Leher Stainless Steel 18/8 Polos
  const neckSteel = ctx.createLinearGradient(265, 290, 635, 290);
  neckSteel.addColorStop(0, '#94A3B8');
  neckSteel.addColorStop(0.25, '#FFFFFF');
  neckSteel.addColorStop(0.55, '#CBD5E1');
  neckSteel.addColorStop(0.85, '#F8FAFC');
  neckSteel.addColorStop(1, '#64748B');
  ctx.fillStyle = neckSteel;
  ctx.fillRect(260, 290, 380, 22);

  ctx.restore();

  // 5. Tutup (Lid) Polos
  ctx.save();
  ctx.fillStyle = '#38BDF8';
  ctx.beginPath();
  ctx.roundRect(256, 232, 388, 60, 18);
  ctx.fill();

  const lidShade = ctx.createLinearGradient(256, 232, 644, 232);
  lidShade.addColorStop(0, 'rgba(34,211,238,0.4)');
  lidShade.addColorStop(0.25, 'rgba(255,255,255,0.38)');
  lidShade.addColorStop(0.85, 'rgba(168,85,247,0.4)');
  ctx.fillStyle = lidShade;
  ctx.beginPath();
  ctx.roundRect(256, 232, 388, 60, 18);
  ctx.fill();
  ctx.restore();

  cachedPlainTumblerUrl = canvas.toDataURL('image/png');
  return cachedPlainTumblerUrl;
}

/**
 * ============================================================================
 * HELPER GEOMETRI 3D: Pedestal (Dinonaktifkan agar tidak mengganggu bagian bawah tumbler)
 * ============================================================================
 */
export function create3DRotatingPedestal(): THREE.Group {
  const pedestalGroup = new THREE.Group();
  pedestalGroup.name = 'tumblr-lab-3d-pedestal';
  pedestalGroup.visible = false;
  return pedestalGroup;
}

/**
 * ============================================================================
 * FUNGSI ANIMASI GSAP: STATE 1 (Loading) -> STATE 2 (Login) -> STATE 3 (Studio)
 * ============================================================================
 */
export function animateLoadingToLoginGSAP(params: {
  camera: THREE.OrthographicCamera | THREE.PerspectiveCamera | null;
  tumblerGroup: THREE.Group | null;
  loadingContainerEl: HTMLDivElement | null;
  loginCardEl: HTMLDivElement | null;
  onFallbackTransform?: (offsetX: number, tiltDeg: number, scale: number) => void;
  onComplete?: () => void;
}): gsap.core.Timeline {
  const { loadingContainerEl, loginCardEl, onComplete } = params;

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete,
  });

  if (loadingContainerEl) {
    tl.to(
      loadingContainerEl,
      {
        opacity: 0,
        y: 24,
        duration: 0.4,
        ease: 'power2.in',
      },
      0
    );
  }

  if (loginCardEl) {
    gsap.killTweensOf(loginCardEl);
    gsap.set(loginCardEl, { opacity: 0, x: 40, scale: 0.97 });
    tl.to(
      loginCardEl,
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.65,
        ease: 'power3.out',
      },
      0.1
    );
  }

  return tl;
}

export function animateLoginToStudioGSAP(params: {
  camera: THREE.OrthographicCamera | THREE.PerspectiveCamera | null;
  tumblerGroup: THREE.Group | null;
  pedestalGroup: THREE.Group | null;
  loginCardEl: HTMLDivElement | null;
  headerEl?: HTMLElement | null;
  leftPanelEl?: HTMLElement | null;
  bottomPanelEl?: HTMLElement | null;
  rightPanelEl?: HTMLElement | null;
  onFallbackTransform?: (offsetX: number, tiltDeg: number, scale: number) => void;
  onZoomChange?: (zoom: number) => void;
  onEnterStudioState?: () => void;
  onComplete?: () => void;
}): gsap.core.Timeline {
  const {
    camera,
    tumblerGroup,
    loginCardEl,
    headerEl,
    leftPanelEl,
    bottomPanelEl,
    rightPanelEl,
    onFallbackTransform,
    onZoomChange,
    onEnterStudioState,
    onComplete,
  } = params;

  const tl = gsap.timeline({
    defaults: { ease: 'power3.inOut' },
    onComplete,
  });

  if (loginCardEl) {
    tl.to(
      loginCardEl,
      {
        opacity: 0,
        x: 60,
        scale: 0.96,
        duration: 0.35,
        ease: 'power2.in',
      },
      0
    );
  }

  if (onEnterStudioState) {
    tl.call(onEnterStudioState, [], 0.25);
  }

  if (camera) {
    gsap.set(camera.position, { x: 0, y: 0.42, z: 10 });
    gsap.set(camera, { zoom: 0.9 });
    camera.updateProjectionMatrix();

    tl.to(
      camera,
      {
        zoom: 1.0,
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: () => {
          camera.updateProjectionMatrix();
          if (onZoomChange) onZoomChange(camera.zoom);
        },
      },
      0.25
    );
  }

  if (tumblerGroup) {
    gsap.set(tumblerGroup.rotation, { x: 0, z: 0 });
    gsap.set(tumblerGroup.position, { x: 0, y: 0, z: 0 });
  }

  if (onFallbackTransform) {
    onFallbackTransform(0, 0, 1);
  }

  // Staggered Entrance UI Studio + Clear inline styles on complete so hiding works cleanly on Logout
  const studioEls = [headerEl, leftPanelEl, bottomPanelEl, rightPanelEl].filter(
    Boolean
  ) as HTMLElement[];

  if (headerEl) {
    gsap.fromTo(
      headerEl,
      { opacity: 0, y: -28 },
      { opacity: 1, y: 0, duration: 0.55, delay: 0.3, ease: 'power3.out', clearProps: 'all' }
    );
  }

  if (leftPanelEl) {
    gsap.fromTo(
      leftPanelEl,
      { opacity: 0, x: -60 },
      { opacity: 1, x: 0, duration: 0.6, delay: 0.38, ease: 'power3.out', clearProps: 'all' }
    );
  }

  if (bottomPanelEl) {
    gsap.fromTo(
      bottomPanelEl,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.45, ease: 'power3.out', clearProps: 'all' }
    );
  }

  if (rightPanelEl) {
    gsap.fromTo(
      rightPanelEl,
      { opacity: 0, x: 60 },
      { opacity: 1, x: 0, duration: 0.6, delay: 0.52, ease: 'power3.out', clearProps: 'all' }
    );
  }

  if (studioEls.length > 0) {
    tl.set(studioEls, { clearProps: 'all' }, 1.2);
  }

  return tl;
}

/**
 * ============================================================================
 * KOMPONEN 2: HALAMAN LOGIN AWAL & LOADING
 * ============================================================================
 */
interface FlowStageOverlayProps {
  flowState: AppFlowState;
  loadingProgress: number;
  loadingContainerRef: React.RefObject<HTMLDivElement | null>;
  loginCardRef: React.RefObject<HTMLDivElement | null>;
  onLoginSubmit: (userName: string, isGuest: boolean) => void;
}

export const TumblerFlowStageOverlay: React.FC<FlowStageOverlayProps> = ({
  flowState,
  loadingProgress,
  loadingContainerRef,
  loginCardRef,
  onLoginSubmit,
}) => {
  const [emailOrUser, setEmailOrUser] = useState<string>('maya.indah@tumblrlab.id');
  const [password, setPassword] = useState<string>('••••••••••••');

  const leftShowcaseRef = useRef<HTMLDivElement | null>(null);
  const tumblerImgSrc = getPlainLoginTumblerImageUrl();

  useEffect(() => {
    if (flowState === 'login' && leftShowcaseRef.current) {
      gsap.fromTo(
        leftShowcaseRef.current,
        { opacity: 0, x: -40, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 0.7, ease: 'power3.out' }
      );
    }
  }, [flowState]);

  if (flowState === 'studio') return null;

  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (loadingProgress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-between bg-gradient-to-br from-slate-950 via-[#0B112B] to-indigo-950 text-white overflow-y-auto relative">
      {/* Ambient Glow di Sudut-Sudut Layar */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-36 -left-36 w-[440px] h-[440px] rounded-full bg-cyan-500/20 blur-[130px]" />
        <div className="absolute -bottom-40 -right-36 w-[500px] h-[500px] rounded-full bg-purple-600/25 blur-[140px]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[560px] h-[320px] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      {/* Top Bar: Logo TUMBLR.LAB */}
      <div className="relative z-10 px-5 sm:px-9 pt-5 sm:pt-7 flex items-center justify-between shrink-0">
        <TumblrLabNeonLogo size="md" showSubtitle={true} />
      </div>

      {/* ====================================================================
          STATE 1: LOADING SCREEN (0% - 100%)
         ==================================================================== */}
      {flowState === 'loading' && (
        <div
          ref={loadingContainerRef}
          className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-8"
        >
          <div className="relative mb-5 flex items-center justify-center">
            <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-cyan-500/30 to-purple-500/30 blur-3xl" />
            <img
              src={tumblerImgSrc}
              alt="Tumbler"
              className="w-44 sm:w-52 h-auto object-contain drop-shadow-[0_12px_35px_rgba(34,211,238,0.3)] animate-bounce"
              style={{ animationDuration: '2.8s' }}
            />
          </div>

          <div className="w-full max-w-md bg-white/[0.06] backdrop-blur-2xl rounded-3xl p-6 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.45)] flex flex-col items-center text-center gap-3.5">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 76 76">
                <circle
                  cx="38"
                  cy="38"
                  r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="6"
                />
                <circle
                  cx="38"
                  cy="38"
                  r={radius}
                  fill="none"
                  stroke="url(#neonLoadGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-100 ease-out"
                />
                <defs>
                  <linearGradient id="neonLoadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22D3EE" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute text-xs font-extrabold text-cyan-300 tabular-nums">
                {loadingProgress}%
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-bold text-white tracking-tight">
                Mempersiapkan Studio 3D TUMBLR.LAB...
              </p>
              <p className="text-[11px] text-slate-400">
                Memuat aset kustomisasi 3D &amp; pencahayaan studio
              </p>
            </div>

            <div className="w-full h-2 bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-purple-500 shadow-[0_0_12px_rgba(34,211,238,0.8)] transition-all duration-100 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          STATE 2: HALAMAN LOGIN AWAL (Foto Tumbler Polos + Form Frosted Glass)
         ==================================================================== */}
      {flowState === 'login' && (
        <div className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-4 pb-8 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14">
          {/* Sisi Kiri: Foto Tumbler Polos */}
          <div
            ref={leftShowcaseRef}
            className="w-full lg:w-1/2 flex flex-col items-center justify-center relative"
          >
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-cyan-500/20 via-indigo-500/15 to-purple-500/25 blur-3xl pointer-events-none" />
            <div className="relative z-10 flex items-center justify-center py-2">
              <img
                src={tumblerImgSrc}
                alt="Tumbler"
                className="w-52 sm:w-68 md:w-76 h-auto object-contain drop-shadow-[0_20px_45px_rgba(34,211,238,0.22)]"
              />
            </div>
          </div>

          {/* Sisi Kanan: Kartu Form Login Frosted Glass */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div
              ref={loginCardRef}
              className="w-full max-w-[430px] rounded-[28px] bg-white/[0.07] backdrop-blur-2xl border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.55),0_0_40px_rgba(34,211,238,0.12)] p-6 sm:p-8 space-y-5 relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-purple-500 opacity-80" />

              {/* Header Logo TUMBLR.LAB & Judul Login */}
              <div className="space-y-3">
                <TumblrLabNeonLogo size="md" showSubtitle={false} />
                <div className="space-y-1">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    Masuk ke Akunmu
                  </h1>
                  <p className="text-xs text-slate-300/80 leading-relaxed">
                    Masuk untuk mulai mengkustomisasi tumbler 3D sesuai gayamu.
                  </p>
                </div>
              </div>

              {/* Form Login */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const displayUser =
                    emailOrUser.split('@')[0].replace('.', ' ') || 'Maya Indah';
                  onLoginSubmit(displayUser, false);
                }}
                className="space-y-3.5"
              >
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-200">
                    Email / Username
                  </label>
                  <div className="relative">
                    <i className="fa-regular fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-300/80 text-xs"></i>
                    <input
                      type="text"
                      required
                      value={emailOrUser}
                      onChange={(e) => setEmailOrUser(e.target.value)}
                      placeholder="nama@email.com atau username"
                      className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-900/65 border border-white/15 focus:border-cyan-400 text-xs font-semibold text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-200">Password</label>
                  <div className="relative">
                    <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-300/80 text-xs"></i>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-900/65 border border-white/15 focus:border-cyan-400 text-xs font-semibold text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition"
                    />
                  </div>
                </div>

                {/* Tombol CTA "Masuk Studio 3D" */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-purple-600 hover:from-cyan-300 hover:via-sky-400 hover:to-purple-500 text-slate-950 font-black text-xs tracking-wide shadow-[0_0_25px_rgba(34,211,238,0.45),0_0_45px_rgba(168,85,247,0.3)] hover:shadow-[0_0_35px_rgba(34,211,238,0.75),0_0_60px_rgba(168,85,247,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  <span>Masuk Studio 3D</span>
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </form>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Atau Akses Cepat
                </span>
                <div className="h-px flex-1 bg-white/10"></div>
              </div>

              {/* Tombol Alternatif: "Masuk sebagai Tamu (Guest Mode)" */}
              <button
                type="button"
                onClick={() => onLoginSubmit('Tamu Studio (Guest)', true)}
                className="w-full py-2.5 px-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-cyan-400/45 text-slate-200 hover:text-cyan-200 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <i className="fa-regular fa-compass text-cyan-400"></i>
                <span>Masuk sebagai Tamu (Guest Mode)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * ============================================================================
 * KOMPONEN PANEL BAWAH (STATE 3): Minimal Floating 360° & Zoom Pill Bar
 * (Slider Laser 26px & Stiker 0.6x telah dihilangkan sesuai permintaan)
 * ============================================================================
 */
interface StudioBottomDockProps {
  panelRef?: React.RefObject<HTMLDivElement | null>;
  colors?: TumblerColor[];
  selectedColor?: TumblerColor;
  onSelectColor?: (c: TumblerColor) => void;
  laserEngraving?: LaserEngravingConfig;
  onChangeLaserSize?: (px: number) => void;
  stickerScale?: number;
  onChangeStickerScale?: (sc: number) => void;
  autoRotate360: boolean;
  onToggleAutoRotate: () => void;
  zoomLevel: number;
  onZoomStep: (delta: number) => void;
}

export const StudioBottomCustomizationDock: React.FC<StudioBottomDockProps> = ({
  panelRef,
  autoRotate360,
  onToggleAutoRotate,
  zoomLevel,
  onZoomStep,
}) => {
  return (
    <div
      ref={panelRef}
      className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/88 backdrop-blur-xl px-3 py-1.5 rounded-full border border-slate-200/80 shadow-sm"
    >
      <button
        type="button"
        onClick={onToggleAutoRotate}
        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
          autoRotate360
            ? 'bg-slate-900 text-white shadow-2xs'
            : 'bg-transparent hover:bg-slate-100 text-slate-700'
        }`}
        title="Putar Otomatis 360°"
      >
        <i
          className={`fa-solid fa-arrows-rotate text-[11px] ${
            autoRotate360 ? 'text-pink-400 animate-spin' : 'text-slate-500'
          }`}
          style={{ animationDuration: '6s' }}
        ></i>
        <span>360° Auto-Rotate</span>
      </button>

      <div className="w-px h-4 bg-slate-200"></div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onZoomStep(-0.12)}
          className="w-7 h-7 rounded-full hover:bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold transition cursor-pointer"
          title="Zoom Out"
        >
          −
        </button>
        <span className="text-[11px] font-semibold text-slate-500 px-1 tabular-nums min-w-[38px] text-center">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          type="button"
          onClick={() => onZoomStep(0.12)}
          className="w-7 h-7 rounded-full hover:bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold transition cursor-pointer"
          title="Zoom In"
        >
          +
        </button>
      </div>
    </div>
  );
};

/**
 * ============================================================================
 * KOMPONEN MODAL CHECKOUT 3D & PICKUP PASS
 * ============================================================================
 */
interface Checkout3DOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewImageUrl: string;
  modelName: string;
  colorName: string;
  colorHex: string;
  finish: 'matte' | 'glossy';
  laserText: string;
  laserStyleName: string;
  activeAccessories: string[];
  stickersCount: number;
  totalPriceIDR: number;
  onDownloadRender: () => void;
}

export const Checkout3DOrderModal: React.FC<Checkout3DOrderModalProps> = ({
  isOpen,
  onClose,
  previewImageUrl,
  modelName,
  colorName,
  colorHex,
  finish,
  laserText,
  laserStyleName,
  activeAccessories,
  stickersCount,
  totalPriceIDR,
  onDownloadRender,
}) => {
  const [pickupDone, setPickupDone] = useState<boolean>(false);
  const [selectedStore, setSelectedStore] = useState<string>(
    'TUMBLR.LAB Main Store - Grand Indonesia (GF, Shop #12)'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white/95 backdrop-blur-2xl rounded-[24px] max-w-2xl w-full max-h-[90dvh] overflow-y-auto border border-white shadow-2xl p-5 sm:p-6 space-y-4 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
        >
          ✕
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold">
            <span>Design Saved &amp; Order Placed! 🎉</span>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-600 text-[11px] font-bold">
            Order ID #TL-89241
          </span>
          <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold">
            {pickupDone ? '✓ Pickup Completed' : 'Ready for Self-Pickup in 2 Hours'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-5 bg-gradient-to-b from-pink-50/60 to-slate-50 rounded-2xl p-3 border border-slate-200/80 flex flex-col items-center gap-2">
            {previewImageUrl ? (
              <img
                src={previewImageUrl}
                alt="3D Custom Tumbler Render"
                className="w-40 h-44 object-contain rounded-xl"
              />
            ) : (
              <div
                className="w-28 h-40 rounded-2xl border border-black/10 shadow-inner"
                style={{ backgroundColor: colorHex }}
              />
            )}
            <button
              type="button"
              onClick={onDownloadRender}
              className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <i className="fa-solid fa-download text-pink-500"></i>
              <span>Download High-Res Render</span>
            </button>
          </div>

          <div className="sm:col-span-7 space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Model &amp; Warna:</span>
                <span className="font-bold text-slate-800">
                  {modelName} · {colorName} ({finish === 'matte' ? 'Matte' : 'Glossy'})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ukiran Laser:</span>
                <span className="font-bold text-slate-800">
                  {laserText ? `"${laserText}" (${laserStyleName})` : 'Tanpa Ukiran'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Stiker &amp; Aksesoris:</span>
                <span className="font-bold text-slate-800 text-right">
                  {stickersCount} Stiker ·{' '}
                  {activeAccessories.length > 0 ? activeAccessories.join(', ') : 'Standar'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200/80 text-sm">
                <span className="font-bold text-slate-700">Total Harga 3D Custom:</span>
                <span className="font-extrabold text-pink-600">
                  Rp {totalPriceIDR.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-pink-50/50 border border-pink-200/70 space-y-2">
              <label className="block text-[11px] font-extrabold text-slate-700">
                Lokasi Pengambilan (Store Pickup):
              </label>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-pink-200 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                <option value="TUMBLR.LAB Main Store - Grand Indonesia (GF, Shop #12)">
                  TUMBLR.LAB Main Store - Grand Indonesia (GF, Shop #12)
                </option>
                <option value="TUMBLR.LAB Studio - Senayan City (Level 1, #08)">
                  TUMBLR.LAB Studio - Senayan City (Level 1, #08)
                </option>
                <option value="TUMBLR.LAB Lounge - Pondok Indah Mall 3 (GF)">
                  TUMBLR.LAB Lounge - Pondok Indah Mall 3 (GF)
                </option>
              </select>
              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-0.5">
                <span>Estimasi Selesai Laser &amp; Coating:</span>
                <span className="font-bold text-slate-800">Hari Ini · ±2 Jam (17:30 WIB)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setPickupDone(true)}
            className={`flex-1 w-full py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
              pickupDone
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-md shadow-pink-500/25'
            }`}
          >
            <i className={`fa-solid ${pickupDone ? 'fa-circle-check' : 'fa-hand-pointer'}`}></i>
            <span>
              {pickupDone
                ? 'Order Completed! Enjoy Your Custom Tumbler! 🎉'
                : 'Klik jika Sudah Ambil Tumbler / Complete Pickup'}
            </span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            Kembali ke Decor Studio
          </button>
        </div>
      </div>
    </div>
  );
};
