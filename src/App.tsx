/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import confetti from 'canvas-confetti';
import {
  TUMBLER_MODELS,
  TumblerModelSpec,
  BodyWallDimensions,
  createPMREMStudioEnvironment,
  populateTumbler3DModel,
} from './tumblerModels';
import {
  AESTHETIC_STICKERS,
  StickerOption,
  StickerCategory,
  CalligraphyStyleId,
  CalligraphyOrnamentId,
  PlacedSticker,
  drawAestheticSticker,
  createCustomCalligraphySticker,
  getStickerPreviewDataUrl,
  create3DPuffyStickerMesh,
} from './stickers3D';
import {
  StrawTopperVariant,
  KeychainVariant,
  StrapVariant,
  BootVariant,
  STRAW_TOPPER_VARIATIONS,
  KEYCHAIN_VARIATIONS,
  STRAP_VARIATIONS,
  BOOT_VARIATIONS,
  getAccessoryStudioPreviewUrl,
} from './accessories3D';
import {
  TUMBLER_COLOR_SWATCHES,
  TumblerColor,
  ColorCategory,
  AestheticColorWheel,
} from './colorPalette2D';
import {
  LaserEngravingConfig,
  LaserEngravingStyleId,
  LaserEngravingPlacement,
  LaserFontCategoryId,
  LASER_ENGRAVING_STYLES,
  drawLaserEngravingOnCylinderTexture,
  create3DLaserEngravingMesh,
  getLaserEngravingPreviewUrl,
} from './laserEngraving3D';
import { Tumbler3DFallback } from './Tumbler3DFallback';
import { AssetSheetModals, CommunitySubmissionItem } from './ShowcaseModals';
import {
  AppFlowState,
  create3DRotatingPedestal,
  animateLoadingToLoginGSAP,
  animateLoginToStudioGSAP,
  TumblerFlowStageOverlay,
  StudioBottomCustomizationDock,
  Checkout3DOrderModal,
} from './TumblerLabInteractiveFlow';

interface AccessoriesState {
  keychain: boolean;
  strap: boolean;
  topper: boolean;
  boot: boolean;
}

const COLORS: TumblerColor[] = TUMBLER_COLOR_SWATCHES;

const INITIAL_GALLERY_SUBMISSIONS: CommunitySubmissionItem[] = [
  {
    id: 'sub-1',
    title: 'Matcha Zen Botanical',
    creator: 'Sora Takahashi',
    avatar: 'S',
    modelName: 'Classic 750ml',
    colorName: 'Sage Mint',
    colorHex: '#A7D7C5',
    laserText: 'Aurelia',
    stickersCount: 2,
    likes: 428,
    presetTag: 'Studio Showcase',
    createdAt: '2h ago',
  },
  {
    id: 'sub-2',
    title: 'Coquette Bow & Strawberry',
    creator: 'Claire Laurent',
    avatar: 'C',
    modelName: 'Quencher 1200ml',
    colorName: 'Blush Peach',
    colorHex: '#F9C6C9',
    laserText: 'Angelica',
    stickersCount: 2,
    likes: 612,
    presetTag: 'Studio Showcase',
    createdAt: '5h ago',
  },
  {
    id: 'sub-3',
    title: 'Midnight Laser Signature',
    creator: 'Kaito Watanabe',
    avatar: 'K',
    modelName: 'Sport 900ml',
    colorName: 'Obsidian Black',
    colorHex: '#1E293B',
    laserText: 'Serafina',
    stickersCount: 1,
    likes: 539,
    presetTag: 'Studio Showcase',
    createdAt: '1d ago',
  },
  {
    id: 'sub-4',
    title: 'Lilac Cloud Dreamer',
    creator: 'Maya Indah',
    avatar: 'M',
    modelName: 'Classic 750ml',
    colorName: 'Lavender Mist',
    colorHex: '#D8B4F8',
    laserText: 'Clara',
    stickersCount: 3,
    likes: 319,
    presetTag: 'Studio Custom',
    createdAt: '2d ago',
  },
];

export default function App() {
  // 3-State Interactive Flow ('loading' | 'login' | 'studio')
  const [flowState, setFlowState] = useState<AppFlowState>('loading');
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loggedInUser, setLoggedInUser] = useState<{ name: string; isGuest: boolean }>({
    name: 'Maya Indah',
    isGuest: false,
  });
  const [isCheckout3DOpen, setIsCheckout3DOpen] = useState<boolean>(false);
  const [checkoutRenderUrl, setCheckoutRenderUrl] = useState<string>('');
  const [fallbackTransform, setFallbackTransform] = useState<{
    offsetX: number;
    tiltDeg: number;
    scale: number;
  }>({ offsetX: 0, tiltDeg: 0, scale: 1 });

  const [activeTab, setActiveTab] = useState<'colors' | 'engraving' | 'stickers' | 'accessories'>('engraving');
  const [laserFontCategory, setLaserFontCategory] = useState<LaserFontCategoryId>('all');
  const [activeNavView, setActiveNavView] = useState<'studio' | 'inspiration'>('studio');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [submissionTitle, setSubmissionTitle] = useState<string>('Pastel Dream Tumbler');
  const [submissionCreator, setSubmissionCreator] = useState<string>('Maya Indah');
  const [communityGallery, setCommunityGallery] = useState<CommunitySubmissionItem[]>(
    INITIAL_GALLERY_SUBMISSIONS
  );
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [autoRotate360, setAutoRotate360] = useState<boolean>(true);
  const [followCursor, setFollowCursor] = useState<boolean>(false);

  const [colorFilter, setColorFilter] = useState<'all' | ColorCategory>('all');
  const [isColorSheetOpen, setIsColorSheetOpen] = useState<boolean>(false);
  const [stickerFilter, setStickerFilter] = useState<'all' | StickerCategory>('all');
  const [isStickerSheetOpen, setIsStickerSheetOpen] = useState<boolean>(false);
  const [isCalligraphySheetOpen, setIsCalligraphySheetOpen] = useState<boolean>(false);
  const [isLaserSheetOpen, setIsLaserSheetOpen] = useState<boolean>(false);
  const [isAccessoryFlatLayOpen, setIsAccessoryFlatLayOpen] = useState<boolean>(false);

  const [laserEngraving, setLaserEngraving] = useState<LaserEngravingConfig>({
    enabled: true,
    text: 'Angelica',
    styleId: 'style-a-cursive',
    placement: 'vertical-side',
    fontSizePx: 28,
    rotationDeg: 0,
  });
  const [customNameText, setCustomNameText] = useState<string>('Jessica');
  const [customCalligStyle, setCustomCalligStyle] =
    useState<CalligraphyStyleId>('modern-soft-script');
  const [customCalligOrnament] = useState<CalligraphyOrnamentId>('stars');
  const [customCalligColor] = useState<string>('#F472B6');

  const [selectedModel, setSelectedModel] = useState<TumblerModelSpec>(TUMBLER_MODELS[0]);
  const [selectedColor, setSelectedColor] = useState<TumblerColor>(COLORS[0]);
  const [capStyle, setCapStyle] = useState<'matching' | 'cream'>('matching');
  const [finish, setFinish] = useState<'matte' | 'glossy'>('matte');
  const [activeSticker, setActiveSticker] = useState<StickerOption | null>(AESTHETIC_STICKERS[0]);
  const [stickerScale, setStickerScale] = useState<number>(1.0);
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);
  const [accessories, setAccessories] = useState<AccessoriesState>({
    keychain: true,
    strap: false,
    topper: true,
    boot: true,
  });
  const [topperVariant, setTopperVariant] = useState<StrawTopperVariant>('strawberry');
  const [keychainVariant, setKeychainVariant] = useState<KeychainVariant>('holo-star');
  const [strapVariant, setStrapVariant] = useState<StrapVariant>('woven-boho');
  const [bootVariant, setBootVariant] = useState<BootVariant>('waffle-pink');
  const [audioEnabled] = useState<boolean>(true);
  const [webglWorking, setWebglWorking] = useState<boolean>(true);
  const [fallbackRotation, setFallbackRotation] = useState<number>(20);

  // Refs for Three.js objects
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const tumblerGroupRef = useRef<THREE.Group | null>(null);
  const pedestalGroupRef = useRef<THREE.Group | null>(null);

  // Refs for GSAP UI & Stage Transitions
  const loadingContainerRef = useRef<HTMLDivElement | null>(null);
  const loginCardRef = useRef<HTMLDivElement | null>(null);
  const headerStudioRef = useRef<HTMLElement | null>(null);
  const leftPanelStudioRef = useRef<HTMLElement | null>(null);
  const bottomPanelStudioRef = useRef<HTMLDivElement | null>(null);
  const rightPanelStudioRef = useRef<HTMLElement | null>(null);
  const bodyMeshRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial> | null>(
    null
  );
  const capMeshesRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>[]>([]);
  const stickerAttachmentGroupRef = useRef<THREE.Group | null>(null);
  const bodyWallSpecRef = useRef<BodyWallDimensions>({
    centerY: -0.14,
    height: 3.24,
    topRadius: 1.06,
    botRadius: 0.74,
    getRadiusAtY: () => 0.95,
  });
  const textureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const bodyTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const accessoryObjectsRef = useRef<{
    keychain?: THREE.Object3D;
    strap?: THREE.Object3D;
    topper?: THREE.Object3D;
    boot?: THREE.Object3D;
  }>({});

  const cursorTargetRotRef = useRef<{ rotY: number; rotX: number }>({ rotY: 0, rotX: 0 });
  const baseManualRotYRef = useRef<number>(0);
  const baseManualRotXRef = useRef<number>(0);

  const stateRef = useRef({
    flowState,
    activeTab,
    activeSticker,
    stickerScale,
    audioEnabled,
    selectedColor,
    placedStickers,
    laserEngraving,
    followCursor,
    autoRotate360,
  });

  useEffect(() => {
    stateRef.current = {
      flowState,
      activeTab,
      activeSticker,
      stickerScale,
      audioEnabled,
      selectedColor,
      placedStickers,
      laserEngraving,
      followCursor,
      autoRotate360,
    };
  }, [
    flowState,
    activeTab,
    activeSticker,
    stickerScale,
    audioEnabled,
    selectedColor,
    placedStickers,
    laserEngraving,
    followCursor,
    autoRotate360,
  ]);

  const showToast = useCallback((msg: string) => {
    setStatusFeedback(msg);
    setTimeout(() => {
      setStatusFeedback((prev) => (prev === msg ? null : prev));
    }, 3400);
  }, []);

  const playPopSound = useCallback(() => {
    if (!stateRef.current.audioEnabled) return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(840, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.24, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // ignore audio context restrictions
    }
  }, []);

  // STATE 1: 3D Animated Loading Screen (0% -> 100%)
  useEffect(() => {
    if (flowState !== 'loading') return;
    const interval = window.setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(interval);
          return 100;
        }
        return Math.min(100, prev + 4);
      });
    }, 42);
    return () => window.clearInterval(interval);
  }, [flowState]);

  // Auto-Trigger GSAP Transition from STATE 1 (100%) -> STATE 2 (Interactive 3D Login)
  useEffect(() => {
    if (flowState === 'loading' && loadingProgress >= 100) {
      const timer = window.setTimeout(() => {
        setFlowState('login');
      }, 180);
      return () => window.clearTimeout(timer);
    }
  }, [flowState, loadingProgress]);

  // Execute GSAP Camera Pan & 15° Tumbler Tilt when entering STATE 2 ('login')
  useEffect(() => {
    if (flowState === 'login') {
      animateLoadingToLoginGSAP({
        camera: cameraRef.current,
        tumblerGroup: tumblerGroupRef.current,
        loadingContainerEl: loadingContainerRef.current,
        loginCardEl: loginCardRef.current,
        onFallbackTransform: (offsetX, tiltDeg, scale) => {
          setFallbackTransform({ offsetX, tiltDeg, scale });
        },
      });
    }
  }, [flowState]);

  // Handler for STATE 2 -> STATE 3 (Decor Studio) via GSAP Timeline
  const handleLoginToStudio = useCallback(
    (userName: string, isGuest: boolean) => {
      setLoggedInUser({ name: userName, isGuest });
      setSubmissionCreator(userName);
      playPopSound();

      animateLoginToStudioGSAP({
        camera: cameraRef.current,
        tumblerGroup: tumblerGroupRef.current,
        pedestalGroup: pedestalGroupRef.current,
        loginCardEl: loginCardRef.current,
        headerEl: headerStudioRef.current,
        leftPanelEl: leftPanelStudioRef.current,
        bottomPanelEl: bottomPanelStudioRef.current,
        rightPanelEl: rightPanelStudioRef.current,
        onFallbackTransform: (offsetX, tiltDeg, scale) => {
          setFallbackTransform({ offsetX, tiltDeg, scale });
        },
        onZoomChange: (z) => setZoomLevel(Number(z.toFixed(2))),
        onEnterStudioState: () => {
          setFlowState('studio');
        },
        onComplete: () => {
          showToast(
            isGuest
              ? '✨ Selamat datang di Decor Studio (Guest Mode)'
              : `✨ Selamat datang kembali, ${userName}!`
          );
        },
      });
    },
    [playPopSound, showToast]
  );

  // Replay 3D Intro / Login Flow
  const handleReplay3DFlow = useCallback(() => {
    if (pedestalGroupRef.current) {
      pedestalGroupRef.current.visible = false;
      pedestalGroupRef.current.scale.set(0.001, 0.001, 0.001);
    }
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0.42, 10);
      cameraRef.current.zoom = 1.0;
      cameraRef.current.updateProjectionMatrix();
    }
    if (tumblerGroupRef.current) {
      tumblerGroupRef.current.position.set(0, 0, 0);
      tumblerGroupRef.current.rotation.set(0, 0, 0);
    }
    setFallbackTransform({ offsetX: 0, tiltDeg: 0, scale: 1 });
    setZoomLevel(1.0);
    setLoadingProgress(0);
    setFlowState('loading');
    playPopSound();
  }, [playPopSound]);

  const computeCurvedStickerCoords = useCallback((u: number, v: number, scale: number) => {
    const spec = bodyWallSpecRef.current;
    const theta = u * Math.PI * 2;
    const yLocal = spec.centerY + (v - 0.5) * spec.height;
    const patchHeight = 0.44 * scale;

    const radiusTopAtY = spec.getRadiusAtY(yLocal + patchHeight / 2);
    const radiusBotAtY = spec.getRadiusAtY(yLocal - patchHeight / 2);

    return { theta, yLocal, radiusTopAtY, radiusBotAtY };
  }, []);

  const syncSurfaceAndStickers = useCallback(
    (color: TumblerColor, stickers: PlacedSticker[]) => {
      const texCanvas = textureCanvasRef.current;
      if (!texCanvas) return;
      const ctx = texCanvas.getContext('2d');
      if (!ctx) return;

      const W = texCanvas.width;
      const H = texCanvas.height;

      ctx.fillStyle = color.hex;
      ctx.fillRect(0, 0, W, H);

      const vertGrad = ctx.createLinearGradient(0, 0, 0, H);
      vertGrad.addColorStop(0, 'rgba(0, 0, 0, 0.07)');
      vertGrad.addColorStop(0.08, 'rgba(255, 255, 255, 0.06)');
      vertGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.0)');
      vertGrad.addColorStop(0.88, 'rgba(0, 0, 0, 0.05)');
      vertGrad.addColorStop(1, 'rgba(0, 0, 0, 0.16)');
      ctx.fillStyle = vertGrad;
      ctx.fillRect(0, 0, W, H);

      [W * 0.25, W * 0.75].forEach((centerX) => {
        ctx.save();
        ctx.fillStyle =
          color.category === 'dark' ? 'rgba(255, 255, 255, 0.28)' : 'rgba(30, 41, 59, 0.24)';
        ctx.font = '800 36px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('TUMBLR.LAB', centerX, H - 150);
        ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('3D DESIGN STUDIO', centerX, H - 112);
        ctx.restore();
      });

      const currentLaser = stateRef.current.laserEngraving;
      if (currentLaser && currentLaser.enabled && currentLaser.text.trim()) {
        drawLaserEngravingOnCylinderTexture(ctx, W, H, currentLaser);
      }

      stickers.forEach((sticker) => {
        ctx.save();
        ctx.translate(sticker.x, sticker.y);
        ctx.scale(sticker.scale, sticker.scale);
        drawAestheticSticker(ctx, sticker, 240);
        ctx.restore();
      });

      if (bodyTextureRef.current) {
        bodyTextureRef.current.needsUpdate = true;
      }

      const attachGroup = stickerAttachmentGroupRef.current;
      if (attachGroup) {
        while (attachGroup.children.length > 0) {
          attachGroup.remove(attachGroup.children[0]);
        }
        if (currentLaser && currentLaser.enabled && currentLaser.text.trim()) {
          const laserMeshGroup = create3DLaserEngravingMesh(currentLaser, bodyWallSpecRef.current);
          attachGroup.add(laserMeshGroup);
        }
        stickers.forEach((sticker) => {
          const u = sticker.x / W;
          const v = 1 - sticker.y / H;
          const curvedCoords = computeCurvedStickerCoords(u, v, sticker.scale);
          const puffyMesh = create3DPuffyStickerMesh({
            ...sticker,
            ...curvedCoords,
          });
          attachGroup.add(puffyMesh);
        });
      }
    },
    [computeCurvedStickerCoords]
  );

  // Initialize Three.js WebGL Scene
  useEffect(() => {
    const container = containerRef.current;
    const canvasEl = canvasRef.current;
    if (!container || !canvasEl) return;

    const texCanvas = document.createElement('canvas');
    texCanvas.width = 2048;
    texCanvas.height = 2048;
    textureCanvasRef.current = texCanvas;

    let canUseWebGL = false;
    try {
      if (typeof window !== 'undefined' && 'WebGLRenderingContext' in window) {
        const probeCanvas = document.createElement('canvas');
        const probeGl =
          probeCanvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ||
          probeCanvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) ||
          probeCanvas.getContext('experimental-webgl');
        if (probeGl && typeof (probeGl as WebGLRenderingContext).getParameter === 'function') {
          canUseWebGL = true;
        }
      }
    } catch {
      canUseWebGL = false;
    }

    if (!canUseWebGL) {
      setWebglWorking(false);
      return;
    }

    try {
      const width = Math.max(container.clientWidth, 400);
      const height = Math.max(container.clientHeight, 450);

      const targetContext =
        (canvasEl.getContext('webgl2', {
          antialias: true,
          alpha: true,
          powerPreference: 'default',
        }) as WebGL2RenderingContext | null) ||
        (canvasEl.getContext('webgl', {
          antialias: true,
          alpha: true,
          powerPreference: 'default',
        }) as WebGLRenderingContext | null);

      if (!targetContext) {
        setWebglWorking(false);
        return;
      }

      const renderer = new THREE.WebGLRenderer({
        canvas: canvasEl,
        context: targetContext,
        antialias: true,
        alpha: true,
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 2, 3));
      renderer.shadowMap.enabled = false;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.06;
      rendererRef.current = renderer;

      const scene = new THREE.Scene();
      scene.background = null;
      scene.environment = createPMREMStudioEnvironment(renderer);
      sceneRef.current = scene;

      const aspect = width / height;
      const frustumHeight = aspect < 0.85 ? 6.4 : aspect < 1.1 ? 5.8 : 5.3;
      const camera = new THREE.OrthographicCamera(
        (-frustumHeight * aspect) / 2,
        (frustumHeight * aspect) / 2,
        frustumHeight / 2,
        -frustumHeight / 2,
        0.1,
        100
      );
      camera.position.set(0, 0.42, 10);
      camera.lookAt(0, 0.42, 0);
      cameraRef.current = camera;

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.07;
      controls.enableRotate = false;
      controls.enablePan = false;
      controls.enableZoom = true;
      controls.minZoom = 0.72;
      controls.maxZoom = 1.85;
      controls.target.set(0, 0.42, 0);
      controlsRef.current = controls;

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0xf8fafc, 0.92);
      scene.add(hemiLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
      keyLight.position.set(-5.0, 6.5, 7.0);
      keyLight.castShadow = false;
      scene.add(keyLight);

      const fillLightRight = new THREE.DirectionalLight(0xf8fafc, 0.95);
      fillLightRight.position.set(5.5, 4.0, 6.0);
      scene.add(fillLightRight);

      const rimLightBack = new THREE.DirectionalLight(0xffffff, 1.05);
      rimLightBack.position.set(0, 6.0, -7.0);
      scene.add(rimLightBack);

      const bodyTexture = new THREE.CanvasTexture(texCanvas);
      bodyTexture.wrapS = THREE.RepeatWrapping;
      bodyTexture.wrapT = THREE.ClampToEdgeWrapping;
      bodyTexture.colorSpace = THREE.SRGBColorSpace;
      bodyTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      bodyTexture.minFilter = THREE.LinearMipmapLinearFilter;
      bodyTexture.magFilter = THREE.LinearFilter;
      bodyTexture.generateMipmaps = true;
      bodyTextureRef.current = bodyTexture;

      const tumblerGroup = new THREE.Group();
      scene.add(tumblerGroup);
      tumblerGroupRef.current = tumblerGroup;

      // Tambahkan Pedestal / Alas Putar 3D di bawah tumbler (muncul saat masuk STATE 3 Studio)
      const pedestalGroup = create3DRotatingPedestal();
      scene.add(pedestalGroup);
      pedestalGroupRef.current = pedestalGroup;

      const built = populateTumbler3DModel(
        tumblerGroup,
        TUMBLER_MODELS[0].id,
        bodyTexture,
        COLORS[0].hex,
        COLORS[0].hex,
        'matte'
      );
      bodyMeshRef.current = built.bodyMesh;
      capMeshesRef.current = built.capMeshes;
      stickerAttachmentGroupRef.current = built.stickerAttachmentGroup;
      bodyWallSpecRef.current = built.bodyWallSpec;
      accessoryObjectsRef.current = built.accessories;

      syncSurfaceAndStickers(COLORS[0], []);

      renderer.render(scene, camera);
      const gl = renderer.getContext();
      if (!gl || gl.isContextLost()) {
        setWebglWorking(false);
      }

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      let pointerDownPos = { x: 0, y: 0 };
      let lastDragPos = { x: 0, y: 0 };
      let isPointerDown = false;

      const handlePointerDown = (e: PointerEvent) => {
        pointerDownPos = { x: e.clientX, y: e.clientY };
        lastDragPos = { x: e.clientX, y: e.clientY };
        isPointerDown = true;
      };

      const handlePointerUp = () => {
        isPointerDown = false;
      };

      const handlePointerMove = (e: PointerEvent) => {
        const rect = canvasEl.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;

        if (isPointerDown) {
          const dx = e.clientX - lastDragPos.x;
          const dy = e.clientY - lastDragPos.y;
          lastDragPos = { x: e.clientX, y: e.clientY };

          baseManualRotYRef.current += (dx / rect.width) * Math.PI * 2.2;
          baseManualRotXRef.current += (dy / rect.height) * Math.PI * 1.4;
          baseManualRotXRef.current = Math.max(-0.55, Math.min(0.55, baseManualRotXRef.current));
          return;
        }

        if (stateRef.current.followCursor) {
          const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
          cursorTargetRotRef.current.rotY = nx * Math.PI;
          cursorTargetRotRef.current.rotX = ny * Math.PI * 0.45;
        }
      };

      const handlePointerLeave = () => {
        isPointerDown = false;
      };

      const handleCanvasClick = (e: MouseEvent) => {
        const moveDist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
        if (moveDist > 6) return;

        const currentSticker = stateRef.current.activeSticker;
        if (
          stateRef.current.activeTab !== 'stickers' ||
          !currentSticker ||
          !bodyMeshRef.current ||
          !tumblerGroupRef.current ||
          !cameraRef.current ||
          !textureCanvasRef.current
        )
          return;

        const rect = canvasEl.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, cameraRef.current);
        const intersects = raycaster.intersectObject(bodyMeshRef.current);

        if (intersects.length > 0 && intersects[0].uv) {
          const hit = intersects[0];
          const uv = hit.uv!;
          const W = textureCanvasRef.current.width;
          const H = textureCanvasRef.current.height;
          const x = uv.x * W;
          const y = (1 - uv.y) * H;

          const curvedCoords = computeCurvedStickerCoords(
            uv.x,
            uv.y,
            stateRef.current.stickerScale
          );

          const newSticker: PlacedSticker = {
            ...currentSticker,
            uid: `${currentSticker.id}-${Date.now()}-${Math.random()}`,
            x,
            y,
            scale: stateRef.current.stickerScale,
            ...curvedCoords,
          };

          setPlacedStickers((prev) => {
            const updated = [...prev, newSticker];
            syncSurfaceAndStickers(stateRef.current.selectedColor, updated);
            return updated;
          });

          playPopSound();

          try {
            confetti({
              particleCount: 18,
              spread: 38,
              origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
            });
          } catch {
            // ignore
          }
        }
      };

      canvasEl.addEventListener('pointerdown', handlePointerDown);
      canvasEl.addEventListener('pointerup', handlePointerUp);
      canvasEl.addEventListener('pointermove', handlePointerMove);
      canvasEl.addEventListener('pointerleave', handlePointerLeave);
      canvasEl.addEventListener('click', handleCanvasClick);

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width: w, height: h } = entry.contentRect;
          if (w > 0 && h > 0 && rendererRef.current && cameraRef.current) {
            const nextAspect = w / h;
            const nextFrustumHeight = nextAspect < 0.85 ? 6.4 : nextAspect < 1.1 ? 5.8 : 5.3;
            cameraRef.current.left = (-nextFrustumHeight * nextAspect) / 2;
            cameraRef.current.right = (nextFrustumHeight * nextAspect) / 2;
            cameraRef.current.top = nextFrustumHeight / 2;
            cameraRef.current.bottom = -nextFrustumHeight / 2;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(w, h);
          }
        }
      });
      resizeObserver.observe(container);

      let animFrameId: number;
      const animate = () => {
        animFrameId = requestAnimationFrame(animate);
        const currentFlow = stateRef.current.flowState;
        const nowSec = performance.now() * 0.001;

        if (tumblerGroupRef.current) {
          if (currentFlow === 'loading') {
            // STATE 1: Tumbler melayang anggun di tengah layar dengan rotasi halus pada sumbu Y
            baseManualRotYRef.current += 0.012;
            tumblerGroupRef.current.rotation.y = baseManualRotYRef.current;
            tumblerGroupRef.current.position.y = Math.sin(nowSec * 2.2) * 0.14;
          } else if (currentFlow === 'login') {
            // STATE 2: Tumbler berada di sisi kiri layar & miring 15° sambil berputar halus pada sumbu Y
            baseManualRotYRef.current += 0.0085;
            tumblerGroupRef.current.rotation.y = baseManualRotYRef.current;
            tumblerGroupRef.current.position.y = 0.14 + Math.sin(nowSec * 2.0) * 0.07;
          } else {
            // STATE 3: Decor Studio (di atas Pedestal Putar 3D)
            if (stateRef.current.autoRotate360 && !isPointerDown) {
              baseManualRotYRef.current += 0.0065;
            }
            const targetY =
              baseManualRotYRef.current +
              (stateRef.current.followCursor ? cursorTargetRotRef.current.rotY : 0);
            const targetX =
              baseManualRotXRef.current +
              (stateRef.current.followCursor ? cursorTargetRotRef.current.rotX : 0);

            tumblerGroupRef.current.rotation.y +=
              (targetY - tumblerGroupRef.current.rotation.y) * 0.14;
            tumblerGroupRef.current.rotation.x +=
              (targetX - tumblerGroupRef.current.rotation.x) * 0.14;

            if (pedestalGroupRef.current && pedestalGroupRef.current.visible) {
              pedestalGroupRef.current.rotation.y = tumblerGroupRef.current.rotation.y;
            }
          }
        }

        // Sinkronkan target horizontal kamera dengan posisi kamera agar efek pan GSAP tetap sejajar
        controls.target.x = camera.position.x;
        controls.target.y = camera.position.y;
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(animFrameId);
        resizeObserver.disconnect();
        canvasEl.removeEventListener('pointerdown', handlePointerDown);
        canvasEl.removeEventListener('pointerup', handlePointerUp);
        canvasEl.removeEventListener('pointermove', handlePointerMove);
        canvasEl.removeEventListener('pointerleave', handlePointerLeave);
        canvasEl.removeEventListener('click', handleCanvasClick);
        renderer.dispose();
      };
    } catch {
      setWebglWorking(false);
    }
  }, [playPopSound, syncSurfaceAndStickers, computeCurvedStickerCoords]);

  // Rebuild 3D geometry when Tumbler Model or Accessory Variation changes
  useEffect(() => {
    if (!tumblerGroupRef.current || !bodyTextureRef.current) return;
    const capHex = capStyle === 'matching' ? selectedColor.hex : '#F5EFE6';
    const built = populateTumbler3DModel(
      tumblerGroupRef.current,
      selectedModel.id,
      bodyTextureRef.current,
      selectedColor.hex,
      capHex,
      finish,
      topperVariant,
      keychainVariant,
      strapVariant,
      bootVariant
    );
    bodyMeshRef.current = built.bodyMesh;
    capMeshesRef.current = built.capMeshes;
    stickerAttachmentGroupRef.current = built.stickerAttachmentGroup;
    bodyWallSpecRef.current = built.bodyWallSpec;
    accessoryObjectsRef.current = built.accessories;

    if (built.accessories.keychain) built.accessories.keychain.visible = accessories.keychain;
    if (built.accessories.strap) built.accessories.strap.visible = accessories.strap;
    if (built.accessories.topper) built.accessories.topper.visible = accessories.topper;
    if (built.accessories.boot) built.accessories.boot.visible = accessories.boot;

    syncSurfaceAndStickers(selectedColor, placedStickers);
  }, [selectedModel, topperVariant, keychainVariant, strapVariant, bootVariant]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync color, cap style, stickers, and custom laser engraving
  useEffect(() => {
    stateRef.current.laserEngraving = laserEngraving;
    syncSurfaceAndStickers(selectedColor, placedStickers);
    const targetCapHex = capStyle === 'matching' ? selectedColor.hex : '#F5EFE6';
    capMeshesRef.current.forEach((mesh) => {
      mesh.material.color.set(targetCapHex);
    });
  }, [selectedColor, capStyle, placedStickers, laserEngraving, syncSurfaceAndStickers]);

  // Sync matte vs glossy finish
  useEffect(() => {
    if (bodyMeshRef.current) {
      const isGlossy = finish === 'glossy';
      bodyMeshRef.current.material.roughness = isGlossy ? 0.12 : 0.44;
      bodyMeshRef.current.material.metalness = isGlossy ? 0.18 : 0.04;
      bodyMeshRef.current.material.clearcoat = isGlossy ? 1.0 : 0.14;
      bodyMeshRef.current.material.clearcoatRoughness = isGlossy ? 0.06 : 0.48;
      bodyMeshRef.current.material.bumpScale = isGlossy ? 0.0005 : 0.0022;
      bodyMeshRef.current.material.sheen = isGlossy ? 0.0 : 0.25;
      bodyMeshRef.current.material.envMapIntensity = isGlossy ? 1.35 : 0.92;
      bodyMeshRef.current.material.needsUpdate = true;
    }
  }, [finish]);

  // Sync 3D accessories visibility
  useEffect(() => {
    const objs = accessoryObjectsRef.current;
    if (objs.keychain) objs.keychain.visible = accessories.keychain;
    if (objs.strap) objs.strap.visible = accessories.strap;
    if (objs.topper) objs.topper.visible = accessories.topper;
    if (objs.boot) objs.boot.visible = accessories.boot;
  }, [accessories]);

  // UI Handlers
  const handleSelectModel = (model: TumblerModelSpec) => {
    setSelectedModel(model);
    playPopSound();
  };

  const handleSelectColor = (color: TumblerColor) => {
    setSelectedColor(color);
    playPopSound();
  };

  const handleSetCapStyle = (style: 'matching' | 'cream') => {
    setCapStyle(style);
    playPopSound();
  };

  const handleSetFinish = (newFinish: 'matte' | 'glossy') => {
    setFinish(newFinish);
    playPopSound();
  };

  const handleSelectSticker = (sticker: StickerOption) => {
    setActiveSticker(sticker);
    playPopSound();
  };

  const handleUndoSticker = () => {
    setPlacedStickers((prev) => prev.slice(0, -1));
    playPopSound();
  };

  const handleClearAllStickers = () => {
    setPlacedStickers([]);
    playPopSound();
  };

  const handleToggleAccessory = (key: keyof AccessoriesState, checked: boolean) => {
    setAccessories((prev) => ({ ...prev, [key]: checked }));
    playPopSound();
  };

  const handleSetTurnaroundView = (degY: number) => {
    const radY = (degY * Math.PI) / 180;
    baseManualRotYRef.current = radY;
    baseManualRotXRef.current = 0;
    cursorTargetRotRef.current = { rotY: 0, rotX: 0 };
    if (tumblerGroupRef.current) {
      tumblerGroupRef.current.rotation.set(0, radY, 0);
    }
    setFallbackRotation(degY);
    playPopSound();
  };

  const handleZoomStep = (delta: number) => {
    const nextZoom = Math.max(0.75, Math.min(1.65, Number((zoomLevel + delta).toFixed(2))));
    setZoomLevel(nextZoom);
    if (cameraRef.current) {
      cameraRef.current.zoom = nextZoom;
      cameraRef.current.updateProjectionMatrix();
    }
    playPopSound();
  };

  /**
   * Captures a high-resolution PNG render of the customized 3D tumbler
   */
  const captureHighResTumblerRender = useCallback((): string => {
    try {
      if (
        webglWorking &&
        rendererRef.current &&
        sceneRef.current &&
        cameraRef.current &&
        canvasRef.current
      ) {
        const prevBg = sceneRef.current.background;
        sceneRef.current.background = new THREE.Color(0xffffff);
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        sceneRef.current.background = prevBg;
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        if (dataUrl && dataUrl.startsWith('data:image/png') && dataUrl.length > 1000) {
          return dataUrl;
        }
      }
    } catch {
      // Fall through to 2D studio composite card
    }

    const c = document.createElement('canvas');
    c.width = 1200;
    c.height = 1400;
    const ctx = c.getContext('2d');
    if (!ctx) return '';

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, c.width, c.height);

    const halo = ctx.createRadialGradient(600, 660, 40, 600, 660, 520);
    halo.addColorStop(0, '#FDF8F5');
    halo.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, c.width, c.height);

    // Straw
    ctx.fillStyle = '#E2E8F0';
    ctx.beginPath();
    ctx.roundRect(582, 130, 36, 190, 12);
    ctx.fill();

    // Lid
    const lidHex = capStyle === 'matching' ? selectedColor.hex : '#F5EFE6';
    ctx.fillStyle = lidHex;
    ctx.beginPath();
    ctx.roundRect(410, 290, 380, 54, 16);
    ctx.fill();

    // Stainless Steel Lip Collar
    const steel = ctx.createLinearGradient(410, 0, 790, 0);
    steel.addColorStop(0, '#64748B');
    steel.addColorStop(0.3, '#F8FAFC');
    steel.addColorStop(0.55, '#94A3B8');
    steel.addColorStop(0.82, '#FFFFFF');
    steel.addColorStop(1, '#475569');
    ctx.fillStyle = steel;
    ctx.fillRect(414, 342, 372, 20);

    // Tumbler Body
    ctx.fillStyle = selectedColor.hex;
    ctx.beginPath();
    ctx.moveTo(414, 362);
    ctx.lineTo(786, 362);
    ctx.lineTo(742, 1080);
    ctx.quadraticCurveTo(736, 1120, 695, 1120);
    ctx.lineTo(505, 1120);
    ctx.quadraticCurveTo(464, 1120, 458, 1080);
    ctx.closePath();
    ctx.fill();

    if (laserEngraving.enabled && laserEngraving.text.trim()) {
      ctx.save();
      if (laserEngraving.placement === 'vertical-side') {
        ctx.translate(600, 710);
        ctx.rotate(-Math.PI / 2);
      } else {
        ctx.translate(600, 995);
      }
      ctx.font = '600 62px "Great Vibes", "Playfair Display", cursive, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = steel;
      ctx.fillText(laserEngraving.text.trim(), 0, 0);
      ctx.restore();
    }

    ctx.fillStyle = steel;
    ctx.beginPath();
    ctx.roundRect(475, 1114, 250, 24, 8);
    ctx.fill();

    ctx.fillStyle = 'rgba(30,41,59,0.38)';
    ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TUMBLR.LAB · 3D STUDIO', 600, 1068);

    return c.toDataURL('image/png');
  }, [webglWorking, capStyle, selectedColor, laserEngraving]);

  const handleDownloadHDRender = () => {
    const dataUrl = captureHighResTumblerRender();
    if (!dataUrl) return;
    const link = document.createElement('a');
    const cleanColor = selectedColor.name.toLowerCase().replace(/\s+/g, '-');
    link.download = `TUMBLR-LAB-${cleanColor}-hd-render.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    playPopSound();
    showToast('📸 Downloaded HD 3D Render PNG');
  };

  const handleShareDesignLink = async () => {
    const shareParams = new URLSearchParams({
      model: selectedModel.id,
      color: selectedColor.id,
      finish,
      engrave: laserEngraving.enabled ? laserEngraving.text : '',
    });
    const shareUrl = `${window.location.origin}${window.location.pathname}?${shareParams.toString()}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('🔗 Shareable 3D design link copied to clipboard!');
    } catch {
      showToast('🔗 Design link ready to share!');
    }
    playPopSound();
  };

  const handleConfirmSubmitToGallery = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: CommunitySubmissionItem = {
      id: `sub-${Date.now()}`,
      title: submissionTitle.trim() || `${selectedColor.name} Custom`,
      creator: submissionCreator.trim() || 'Maya Indah',
      avatar: (submissionCreator.trim() || 'M').charAt(0).toUpperCase(),
      modelName: `${selectedModel.shortName} ${selectedModel.capacity}`,
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
      laserText: laserEngraving.enabled && laserEngraving.text.trim() ? laserEngraving.text.trim() : 'None',
      stickersCount: placedStickers.length,
      likes: 1,
      presetTag: 'Community Custom',
      createdAt: 'Just now',
    };
    setCommunityGallery((prev) => [newItem, ...prev]);
    setIsSubmitModalOpen(false);
    playPopSound();
    showToast('✨ Submitted your 3D design to Community Gallery!');
    try {
      confetti({ particleCount: 55, spread: 70, origin: { y: 0.55 } });
    } catch {
      // ignore
    }
  };

  // Summary Specs
  const activeAccessoriesSummary: string[] = [];
  if (accessories.topper) {
    const found = STRAW_TOPPER_VARIATIONS.find((v) => v.id === topperVariant);
    activeAccessoriesSummary.push(found ? found.name : 'Straw Topper');
  }
  if (accessories.keychain) {
    const found = KEYCHAIN_VARIATIONS.find((v) => v.id === keychainVariant);
    activeAccessoriesSummary.push(found ? found.name : 'Keychain');
  }
  if (accessories.strap) {
    const found = STRAP_VARIATIONS.find((v) => v.id === strapVariant);
    activeAccessoriesSummary.push(found ? found.name : 'Carry Strap');
  }
  if (accessories.boot) {
    const found = BOOT_VARIATIONS.find((v) => v.id === bootVariant);
    activeAccessoriesSummary.push(found ? found.name : 'Silicone Boot');
  }

  const currentLaserStyle =
    LASER_ENGRAVING_STYLES.find((s) => s.id === laserEngraving.styleId) ||
    LASER_ENGRAVING_STYLES[0];

  // Perhitungan Ringkasan Harga Kustomisasi 3D (IDR) untuk Panel Kanan State 3
  const baseTumblerPriceIDR =
    selectedModel.id === 'quench-1200'
      ? 319000
      : selectedModel.id === 'hydro-900'
        ? 289000
        : 249000;
  const laserEngravingPriceIDR =
    laserEngraving.enabled && laserEngraving.text.trim() ? 45000 : 0;
  const stickersPriceIDR = placedStickers.length * 15000;
  const accessoriesPriceIDR = activeAccessoriesSummary.length * 35000;
  const totalPriceIDR =
    baseTumblerPriceIDR + laserEngravingPriceIDR + stickersPriceIDR + accessoriesPriceIDR;

  const handleOpenCheckout3D = () => {
    const renderDataUrl = captureHighResTumblerRender();
    setCheckoutRenderUrl(renderDataUrl);
    setIsCheckout3DOpen(true);
    playPopSound();
    try {
      confetti({ particleCount: 55, spread: 68, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
  };

  const isStickerMode = activeTab === 'stickers' && activeSticker !== null;

  const filteredColors =
    colorFilter === 'all' ? COLORS : COLORS.filter((c) => c.category === colorFilter);

  const filteredStickers =
    stickerFilter === 'all'
      ? AESTHETIC_STICKERS
      : AESTHETIC_STICKERS.filter((s) => s.category === stickerFilter);

  return (
    <div className="text-slate-800 antialiased h-[100dvh] flex flex-col overflow-hidden relative bg-gradient-to-br from-[#FFF5F8] via-[#F6F8FF] to-[#EFFDF9]">
      {/* ====================================================================
          3D WEBGL / FALLBACK VIEWPORT (Hanya aktif di State 3: Decor Studio)
          Pada halaman Loading & Login/Register, tampilan menggunakan gambar <img> tumbler.
         ==================================================================== */}
      <div
        ref={containerRef}
        id="canvas-container"
        className={`fixed inset-0 z-0 w-full h-full transition-opacity duration-500 ${
          flowState === 'studio' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <canvas
          ref={canvasRef}
          id="tumbler-canvas"
          className={`w-full h-full block touch-none ${!webglWorking ? 'hidden' : ''} ${
            flowState === 'studio' && isStickerMode ? 'sticker-mode' : ''
          }`}
        />

        {!webglWorking && (
          <Tumbler3DFallback
            model={selectedModel}
            colorHex={selectedColor.hex}
            capColorHex={capStyle === 'matching' ? selectedColor.hex : '#F5EFE6'}
            finish={finish}
            stickers={placedStickers}
            laserEngraving={laserEngraving}
            accessories={accessories}
            topperVariant={topperVariant}
            keychainVariant={keychainVariant}
            strapVariant={strapVariant}
            bootVariant={bootVariant}
            rotationY={fallbackRotation}
            autoRotate={autoRotate360}
            followCursor={followCursor}
            isStickerMode={flowState === 'studio' && isStickerMode}
            flowOffsetX={fallbackTransform.offsetX}
            flowTiltDeg={fallbackTransform.tiltDeg}
            flowScale={fallbackTransform.scale}
            showPedestal={flowState === 'studio'}
            onDragRotate={(delta) => setFallbackRotation((prev) => (prev + delta) % 360)}
            onSetRotation={(deg) => setFallbackRotation(deg)}
            onPlaceSticker={(uvX, uvY, clientX, clientY) => {
              if (!activeSticker || flowState !== 'studio') return;
              setPlacedStickers((prev) => [
                ...prev,
                {
                  ...activeSticker,
                  uid: `${activeSticker.id}-${Date.now()}-${Math.random()}`,
                  x: uvX,
                  y: uvY,
                  scale: stickerScale,
                },
              ]);
              playPopSound();
              try {
                confetti({
                  particleCount: 18,
                  spread: 38,
                  origin: {
                    x: clientX / window.innerWidth,
                    y: clientY / window.innerHeight,
                  },
                });
              } catch {
                // ignore
              }
            }}
          />
        )}
      </div>

      {/* ====================================================================
          OVERLAY STATE 1 (3D Animated Loading 0%-100%) & STATE 2 (3D Login)
         ==================================================================== */}
      <TumblerFlowStageOverlay
        flowState={flowState}
        loadingProgress={loadingProgress}
        loadingContainerRef={loadingContainerRef}
        loginCardRef={loginCardRef}
        onLoginSubmit={handleLoginToStudio}
      />

      {/* ====================================================================
          STATE 3: DECOR STUDIO HEADER NAVIGATION
         ==================================================================== */}
      <header
        ref={headerStudioRef}
        className={`h-16 px-4 sm:px-7 bg-white/88 backdrop-blur-xl flex items-center justify-between z-30 shrink-0 border-b border-white/90 shadow-2xs transition-opacity ${
          flowState === 'studio' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Left: Sleek "TUMBLR.LAB" logo with subtle pill badge "3D Studio" */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setActiveNavView('studio')}
            className="flex items-center gap-2.5 cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-[10px] bg-pink-500 flex items-center justify-center text-white shadow-2xs shrink-0">
              <i className="fa-solid fa-cube text-xs"></i>
            </div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
              TUMBLR<span className="text-pink-500">.LAB</span>
            </span>
          </button>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-50 border border-pink-200/70 text-pink-600 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
            <span>Decor Studio 3D</span>
          </span>
        </div>

        {/* Center: Simple navigation links ("Create Studio", "Inspiration Gallery") */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-500">
          {[
            { id: 'studio' as const, label: 'Create Studio' },
            { id: 'inspiration' as const, label: 'Inspiration Gallery' },
          ].map((item) => {
            const isActive = activeNavView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveNavView(item.id)}
                className={`py-1 border-b-2 transition cursor-pointer ${
                  isActive
                    ? 'border-pink-500 text-slate-900 font-bold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Submit to Gallery and User Profile Avatar */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-3.5 py-2 rounded-[12px] bg-slate-900 hover:bg-pink-600 text-white text-xs font-semibold flex items-center gap-2 transition shadow-2xs cursor-pointer"
          >
            <i className="fa-solid fa-sparkles text-[11px] text-pink-300"></i>
            <span className="hidden sm:inline">Submit to Gallery</span>
            <span className="sm:hidden">Submit</span>
          </button>

          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            className="px-2.5 py-1.5 rounded-[12px] bg-pink-50 hover:bg-pink-100/80 border border-pink-200/80 text-pink-600 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
            title={`Profil Akun: ${loggedInUser.name}`}
          >
            <span className="w-6 h-6 rounded-lg bg-pink-500 text-white flex items-center justify-center text-[11px] font-extrabold">
              {loggedInUser.name.charAt(0).toUpperCase()}
            </span>
            <span className="hidden sm:inline text-slate-800 font-bold max-w-[110px] truncate">
              {loggedInUser.name}
            </span>
          </button>
        </div>
      </header>

      {/* Main 3-Column Showcase Layout (State 3: Decor Studio) */}
      <main
        className={`flex-1 flex flex-col md:flex-row overflow-hidden relative min-h-0 z-10 ${
          flowState === 'studio' ? 'pointer-events-none' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* PANEL KIRI: Kategori Dekorasi (Warna Body, Ukiran Laser, Stiker, Aksesoris Tutup/Sedotan) */}
        <aside
          ref={leftPanelStudioRef}
          className={`order-2 md:order-1 w-full md:w-[325px] lg:w-[345px] md:max-w-[350px] bg-white/90 backdrop-blur-xl z-20 flex flex-col h-[48%] md:h-full border-t md:border-t-0 md:border-r border-white/90 shadow-lg shadow-slate-900/5 shrink-0 min-h-0 ${
            flowState === 'studio' ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          {/* Clean Tab Menu at Top: Ukiran Laser | Warna Body | Stiker | Aksesoris */}
          <div className="p-3 border-b border-slate-100 shrink-0">
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100/90 rounded-[12px]">
              {[
                { id: 'engraving', label: 'Ukiran Laser' },
                { id: 'colors', label: 'Warna Body' },
                { id: 'stickers', label: 'Stiker 3D' },
                { id: 'accessories', label: 'Aksesoris' },
              ].map((t) => {
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id as typeof activeTab)}
                    className={`py-1.5 px-1 text-[11px] font-semibold rounded-[9px] transition cursor-pointer truncate ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Streamlined Toolbox Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {/* TAB 1: COLORS */}
            {activeTab === 'colors' && (
              <div className="space-y-4">
                {/* Color Swatches */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">Color Swatches</label>
                    <span className="text-[11px] font-medium text-slate-500">
                      {selectedColor.name}
                    </span>
                  </div>

                  {/* Category Filter */}
                  <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100/80 rounded-[10px]">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'pastel', label: 'Pastel' },
                      { id: 'earth', label: 'Earth' },
                      { id: 'vibrant', label: 'Pop' },
                      { id: 'dark', label: 'Dark' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setColorFilter(cat.id as typeof colorFilter)}
                        className={`py-1 text-[10px] font-medium rounded-lg transition cursor-pointer ${
                          colorFilter === cat.id
                            ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Smooth Swatch Grid */}
                  <div className="grid grid-cols-4 gap-2 max-h-[205px] overflow-y-auto pr-0.5">
                    {filteredColors.map((c) => {
                      const isSelected = selectedColor.hex.toUpperCase() === c.hex.toUpperCase();
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleSelectColor(c)}
                          className={`p-1.5 rounded-[12px] border transition flex flex-col items-center gap-1 cursor-pointer bg-white ${
                            isSelected
                              ? 'border-pink-500 ring-2 ring-pink-100'
                              : 'border-slate-200/80 hover:border-slate-300'
                          }`}
                          title={c.name}
                        >
                          <span
                            className="w-full h-7 rounded-[8px] block border border-black/5"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-[10px] font-medium text-slate-600 truncate w-full text-center">
                            {c.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Surface Finish & Cap Style */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">Surface Finish</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSetFinish('matte')}
                      className={`py-2 px-2.5 rounded-[12px] border text-xs font-semibold transition cursor-pointer ${
                        finish === 'matte'
                          ? 'bg-pink-50/60 border-pink-500 text-pink-700 font-bold'
                          : 'bg-white border-slate-200/90 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      Matte Satin
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetFinish('glossy')}
                      className={`py-2 px-2.5 rounded-[12px] border text-xs font-semibold transition cursor-pointer ${
                        finish === 'glossy'
                          ? 'bg-pink-50/60 border-pink-500 text-pink-700 font-bold'
                          : 'bg-white border-slate-200/90 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      Glossy Ceramic
                    </button>
                  </div>
                </div>

                {/* Tumbler Size & Lid Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    Vessel Silhouette
                  </label>
                  <select
                    value={selectedModel.id}
                    onChange={(e) => {
                      const found = TUMBLER_MODELS.find((m) => m.id === e.target.value);
                      if (found) handleSelectModel(found);
                    }}
                    className="w-full px-3 py-2 rounded-[12px] border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-pink-500 cursor-pointer"
                  >
                    {TUMBLER_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.shortName} ({m.capacity})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Color Wheel */}
                <AestheticColorWheel
                  selectedHex={selectedColor.hex}
                  onSelectCustomHex={(hex, name) => {
                    setSelectedColor({
                      id: `custom-${hex}`,
                      name,
                      hex,
                      capHex: hex,
                      category: 'pastel',
                      code: hex,
                    });
                  }}
                />

                <button
                  type="button"
                  onClick={() => setIsColorSheetOpen(true)}
                  className="w-full py-2 px-3 rounded-[12px] border border-slate-200/90 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center justify-between transition cursor-pointer"
                >
                  <span>Open 24-Color Studio Sheet</span>
                  <i className="fa-solid fa-expand text-[10px] text-slate-400"></i>
                </button>
              </div>
            )}

            {/* TAB 2: LASER ENGRAVING & TYPOGRAPHY STUDIO */}
            {activeTab === 'engraving' && (
              <div className="space-y-4">
                {/* Studio Section Header & Toggle */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Laser Engraving &amp; Typography Studio
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Precision-etched raw 18/8 stainless steel
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={laserEngraving.enabled}
                      onChange={(e) => {
                        setLaserEngraving((prev) => ({ ...prev, enabled: e.target.checked }));
                        playPopSound();
                      }}
                      className="w-4 h-4 accent-pink-500 rounded cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      {laserEngraving.enabled ? 'Active' : 'Off'}
                    </span>
                  </label>
                </div>

                {/* 1. Custom Name Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      Custom Name Input
                    </label>
                    <span className="text-[10px] font-medium text-slate-400 tabular-nums">
                      {laserEngraving.text.length}/16
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={16}
                      value={laserEngraving.text}
                      onChange={(e) =>
                        setLaserEngraving((prev) => ({
                          ...prev,
                          enabled: true,
                          text: e.target.value,
                        }))
                      }
                      placeholder="Enter text to engrave..."
                      className="w-full pl-3.5 pr-8 py-2.5 rounded-2xl border border-slate-200/90 bg-slate-50/70 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition shadow-2xs"
                    />
                    {laserEngraving.text && (
                      <button
                        type="button"
                        onClick={() =>
                          setLaserEngraving((prev) => ({ ...prev, text: '' }))
                        }
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full hover:bg-slate-200/70 text-slate-400 hover:text-slate-600 flex items-center justify-center text-[10px] cursor-pointer"
                        title="Clear text"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Rich Font Style Library (Categorized Grid/List) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      Font Style Library
                    </label>
                    <span className="text-[10px] font-semibold text-pink-600">
                      {currentLaserStyle.name}
                    </span>
                  </div>

                  {/* Categories Tabs: Calligraphy/Script | Modern Sans | Elegant Serif | Handwritten */}
                  <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100/85 rounded-[12px]">
                    {(
                      [
                        { id: 'calligraphy', label: 'Calligraphy/Script' },
                        { id: 'modern-sans', label: 'Modern Sans' },
                        { id: 'elegant-serif', label: 'Elegant Serif' },
                        { id: 'handwritten', label: 'Handwritten' },
                      ] as { id: LaserFontCategoryId; label: string }[]
                    ).map((cat) => {
                      const isActive = laserFontCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() =>
                            setLaserFontCategory((prev) =>
                              prev === cat.id ? 'all' : cat.id
                            )
                          }
                          className={`py-1.5 px-2 text-[10px] font-semibold rounded-[9px] transition cursor-pointer truncate ${
                            isActive
                              ? 'bg-white text-pink-600 shadow-2xs font-bold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>

                  {laserFontCategory !== 'all' && (
                    <div className="flex items-center justify-between px-0.5">
                      <span className="text-[10px] text-slate-400 font-medium">
                        Showing filtered category
                      </span>
                      <button
                        type="button"
                        onClick={() => setLaserFontCategory('all')}
                        className="text-[10px] font-semibold text-pink-600 hover:underline cursor-pointer"
                      >
                        Show All 6+ Fonts
                      </button>
                    </div>
                  )}

                  {/* Font Style Preview Cards Grid (Elegance Script, Brush Flow, Aesthetic Serif, Signature Cursive, Bold Minimal, Retro Calligraphy) */}
                  <div className="grid grid-cols-2 gap-2 max-h-[215px] overflow-y-auto pr-0.5">
                    {LASER_ENGRAVING_STYLES.filter(
                      (st) =>
                        laserFontCategory === 'all' || st.category === laserFontCategory
                    ).map((st) => {
                      const isSelected = laserEngraving.styleId === st.id;
                      const previewSample =
                        laserEngraving.text.trim() || st.sampleName;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            setLaserEngraving((prev) => ({
                              ...prev,
                              enabled: true,
                              styleId: st.id as LaserEngravingStyleId,
                            }));
                            handleSetTurnaroundView(0);
                          }}
                          className={`p-2.5 rounded-[12px] border text-left transition flex flex-col justify-between gap-1.5 cursor-pointer bg-white ${
                            isSelected
                              ? 'border-pink-500 ring-2 ring-pink-100 bg-pink-50/20'
                              : 'border-slate-200/80 hover:border-slate-300'
                          }`}
                        >
                          <div className="w-full py-2 px-2 rounded-lg bg-slate-50/90 border border-slate-100 flex items-center justify-center overflow-hidden min-h-[42px]">
                            <span
                              className="text-slate-800 truncate max-w-full"
                              style={{
                                fontFamily: st.fontFamily,
                                fontWeight: st.fontWeight,
                                fontStyle: st.fontStyle,
                                fontSize:
                                  st.category === 'modern-sans' ||
                                  st.category === 'elegant-serif'
                                    ? '13px'
                                    : '17px',
                                letterSpacing: `${Math.min(3, st.letterSpacingPx * 0.5)}px`,
                              }}
                            >
                              {previewSample}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-1 w-full">
                            <span className="text-[11px] font-bold text-slate-800 truncate">
                              {st.name}
                            </span>
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0"></span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Font Size & Scale Control (12px - 48px Slider + Alignment & Rotation) */}
                <div className="p-3 rounded-[12px] bg-slate-50/70 border border-slate-200/80 space-y-3">
                  {/* Typography Size Slider (12px - 48px) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">
                        Font Size &amp; Scale
                      </label>
                      <span className="text-[11px] font-bold text-pink-600 bg-pink-50 border border-pink-200/60 px-2 py-0.5 rounded-md tabular-nums">
                        {(laserEngraving.fontSizePx ?? 28) <= 18
                          ? 'Small'
                          : (laserEngraving.fontSizePx ?? 28) <= 28
                            ? 'Medium'
                            : (laserEngraving.fontSizePx ?? 28) <= 38
                              ? 'Large'
                              : 'Extra Large'}{' '}
                        · {laserEngraving.fontSizePx ?? 28}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={12}
                      max={48}
                      step={1}
                      value={laserEngraving.fontSizePx ?? 28}
                      onChange={(e) =>
                        setLaserEngraving((prev) => ({
                          ...prev,
                          enabled: true,
                          fontSizePx: parseInt(e.target.value, 10),
                        }))
                      }
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-medium text-slate-400">
                      <span>Small (12px)</span>
                      <span>Medium (28px)</span>
                      <span>Extra Large (48px)</span>
                    </div>
                  </div>

                  {/* Quick Action Buttons for Alignment (Vertical along the side vs. Horizontal across the middle) */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-200/60">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Placement &amp; Alignment
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        {
                          id: 'vertical-side' as LaserEngravingPlacement,
                          label: 'Vertical Side',
                          icon: 'fa-arrows-up-down',
                        },
                        {
                          id: 'horizontal-middle' as LaserEngravingPlacement,
                          label: 'Horizontal Middle',
                          icon: 'fa-arrows-left-right',
                        },
                      ].map((pl) => {
                        const isSelected = laserEngraving.placement === pl.id;
                        return (
                          <button
                            key={pl.id}
                            type="button"
                            onClick={() => {
                              setLaserEngraving((prev) => ({
                                ...prev,
                                enabled: true,
                                placement: pl.id,
                              }));
                              handleSetTurnaroundView(0);
                            }}
                            className={`py-2 px-2.5 rounded-[10px] border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                              isSelected
                                ? 'border-pink-500 bg-white text-pink-700 font-bold shadow-2xs'
                                : 'border-slate-200/90 bg-white/80 hover:bg-white text-slate-600'
                            }`}
                          >
                            <i className={`fa-solid ${pl.icon} text-[10px]`}></i>
                            <span>{pl.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Action Buttons for Text Rotation */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-200/60">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-700">
                        Text Rotation
                      </label>
                      <span className="text-[10px] font-semibold text-slate-500 tabular-nums">
                        {laserEngraving.rotationDeg ?? 0}°
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { label: '-15°', deg: -15 },
                        { label: '0° Reset', deg: 0 },
                        { label: '+15°', deg: 15 },
                        { label: '+90°', deg: 90 },
                      ].map((rot) => {
                        const isCurr = (laserEngraving.rotationDeg ?? 0) === rot.deg;
                        return (
                          <button
                            key={rot.label}
                            type="button"
                            onClick={() => {
                              setLaserEngraving((prev) => ({
                                ...prev,
                                enabled: true,
                                rotationDeg: rot.deg,
                              }));
                              handleSetTurnaroundView(0);
                            }}
                            className={`py-1.5 px-1.5 rounded-lg border text-[10px] font-semibold transition cursor-pointer ${
                              isCurr
                                ? 'border-pink-500 bg-white text-pink-700 font-bold shadow-2xs'
                                : 'border-slate-200/80 bg-white/80 hover:bg-white text-slate-600'
                            }`}
                          >
                            {rot.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Live Surface Preview Box */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      Laser Etch Close-Up
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsLaserSheetOpen(true)}
                      className="text-[11px] font-medium text-pink-600 hover:underline cursor-pointer"
                    >
                      Full Typography Sheet
                    </button>
                  </div>
                  <div className="rounded-[12px] overflow-hidden border border-slate-200/90 bg-slate-50">
                    <img
                      src={getLaserEngravingPreviewUrl(
                        laserEngraving.text,
                        laserEngraving.styleId,
                        selectedColor.hex,
                        laserEngraving.placement,
                        laserEngraving.fontSizePx ?? 28,
                        laserEngraving.rotationDeg ?? 0
                      )}
                      alt="Laser Engraving Preview"
                      className="w-full h-20 object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: STICKERS (Aesthetic Sticker Packs) */}
            {activeTab === 'stickers' && (
              <div className="space-y-3.5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">Sticker Packs</label>
                    {placedStickers.length > 0 && (
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={handleUndoSticker}
                          className="text-[11px] text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                        >
                          Undo
                        </button>
                        <button
                          type="button"
                          onClick={handleClearAllStickers}
                          className="text-[11px] text-rose-500 hover:text-rose-600 font-medium cursor-pointer"
                        >
                          Clear ({placedStickers.length})
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100/80 rounded-[10px]">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'calligraphy', label: 'Names' },
                      { id: 'heroes', label: 'Marvel' },
                      { id: 'anime', label: 'Anime' },
                      { id: 'glitter', label: 'Sparkle' },
                      { id: 'text', label: 'Quotes' },
                      { id: 'characters', label: 'Cute' },
                      { id: 'nature', label: 'Flora' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setStickerFilter(f.id as typeof stickerFilter)}
                        className={`py-1 px-1 text-[10px] font-medium rounded-lg transition cursor-pointer truncate ${
                          stickerFilter === f.id
                            ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3-Column Sticker Grid */}
                <div className="grid grid-cols-3 gap-2 max-h-[235px] overflow-y-auto pr-0.5">
                  {filteredStickers.map((s) => {
                    const previewUrl = getStickerPreviewDataUrl(s);
                    const isSelected = activeSticker?.id === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSelectSticker(s)}
                        className={`p-2 rounded-[12px] border transition flex flex-col items-center justify-center text-center gap-1 cursor-pointer bg-white ${
                          isSelected
                            ? 'border-pink-500 ring-2 ring-pink-100'
                            : 'border-slate-200/80 hover:border-slate-300'
                        }`}
                        title={s.name}
                      >
                        <img
                          src={previewUrl}
                          alt={s.name}
                          className="w-12 h-12 object-contain"
                        />
                        <span className="text-[10px] font-medium text-slate-600 truncate w-full">
                          {s.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Calligraphy Decal Input */}
                <div className="p-2.5 rounded-[12px] border border-slate-200/90 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-700">
                      Name Decal Generator
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCalligraphySheetOpen(true)}
                      className="text-[10px] font-medium text-pink-600 hover:underline cursor-pointer"
                    >
                      Font Sheet
                    </button>
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      maxLength={16}
                      value={customNameText}
                      onChange={(e) => setCustomNameText(e.target.value)}
                      placeholder="Type name..."
                      className="flex-1 min-w-0 px-2.5 py-1.5 rounded-[10px] border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-pink-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const sticker = createCustomCalligraphySticker(
                          customNameText,
                          customCalligStyle,
                          customCalligOrnament,
                          customCalligColor
                        );
                        handleSelectSticker(sticker);
                      }}
                      className="px-3 py-1.5 rounded-[10px] bg-slate-900 hover:bg-pink-600 text-white text-xs font-semibold transition cursor-pointer shrink-0"
                    >
                      Use
                    </button>
                  </div>
                </div>

                {activeSticker && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700">
                      <span>Sticker Scale</span>
                      <span className="text-slate-500 tabular-nums">
                        {stickerScale.toFixed(1)}×
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.6"
                      max="1.8"
                      step="0.1"
                      value={stickerScale}
                      onChange={(e) => setStickerScale(parseFloat(e.target.value))}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setIsStickerSheetOpen(true)}
                  className="w-full py-2 px-3 rounded-[12px] border border-slate-200/90 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center justify-between transition cursor-pointer"
                >
                  <span>Full Sticker Sheet (44)</span>
                  <i className="fa-solid fa-expand text-[10px] text-slate-400"></i>
                </button>
              </div>
            )}

            {/* TAB 4: EXTRAS (3D Accessories & Lid Tint) */}
            {activeTab === 'accessories' && (
              <div className="space-y-3">
                {/* Cap Tint Selector */}
                <div className="p-3 bg-slate-50/70 rounded-[12px] border border-slate-200/80 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">Lid &amp; Cap Tint</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSetCapStyle('matching')}
                      className={`py-1.5 px-2 rounded-[10px] border text-[11px] font-semibold transition cursor-pointer ${
                        capStyle === 'matching'
                          ? 'border-pink-500 bg-white text-pink-700 font-bold shadow-2xs'
                          : 'border-slate-200/80 bg-white/70 text-slate-600'
                      }`}
                    >
                      Matching Tint
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetCapStyle('cream')}
                      className={`py-1.5 px-2 rounded-[10px] border text-[11px] font-semibold transition cursor-pointer ${
                        capStyle === 'cream'
                          ? 'border-pink-500 bg-white text-pink-700 font-bold shadow-2xs'
                          : 'border-slate-200/80 bg-white/70 text-slate-600'
                      }`}
                    >
                      Crystal Cream
                    </button>
                  </div>
                </div>

                {/* 1. Straw Toppers */}
                <div className="p-3 bg-white rounded-[12px] border border-slate-200/80 space-y-2">
                  <label className="flex items-center justify-between cursor-pointer gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={getAccessoryStudioPreviewUrl(`topper-${topperVariant}`)}
                        alt="Straw Topper"
                        className="w-9 h-9 rounded-lg object-cover border border-slate-100 shrink-0"
                      />
                      <span className="text-xs font-bold text-slate-800 truncate">
                        3D Straw Topper
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={accessories.topper}
                      onChange={(e) => handleToggleAccessory('topper', e.target.checked)}
                      className="w-4 h-4 accent-pink-500 rounded cursor-pointer shrink-0"
                    />
                  </label>
                  <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-100">
                    {STRAW_TOPPER_VARIATIONS.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          setTopperVariant(v.id);
                          if (!accessories.topper) handleToggleAccessory('topper', true);
                          else playPopSound();
                        }}
                        className={`py-1 px-1.5 rounded-lg border text-[10px] font-semibold truncate transition cursor-pointer ${
                          topperVariant === v.id
                            ? 'border-pink-500 bg-pink-50/60 text-pink-700'
                            : 'border-slate-200/70 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {v.name.replace(' Topper', '')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Keychains & Charms */}
                <div className="p-3 bg-white rounded-[12px] border border-slate-200/80 space-y-2">
                  <label className="flex items-center justify-between cursor-pointer gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={getAccessoryStudioPreviewUrl(`keychain-${keychainVariant}`)}
                        alt="Keychain Charm"
                        className="w-9 h-9 rounded-lg object-cover border border-slate-100 shrink-0"
                      />
                      <span className="text-xs font-bold text-slate-800 truncate">
                        Keychain Charm
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={accessories.keychain}
                      onChange={(e) => handleToggleAccessory('keychain', e.target.checked)}
                      className="w-4 h-4 accent-pink-500 rounded cursor-pointer shrink-0"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-1 pt-1 border-t border-slate-100">
                    {KEYCHAIN_VARIATIONS.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          setKeychainVariant(v.id);
                          if (!accessories.keychain) handleToggleAccessory('keychain', true);
                          else playPopSound();
                        }}
                        className={`py-1 px-1.5 rounded-lg border text-[10px] font-semibold truncate transition cursor-pointer ${
                          keychainVariant === v.id
                            ? 'border-pink-500 bg-pink-50/60 text-pink-700'
                            : 'border-slate-200/70 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Carrying Straps */}
                <div className="p-3 bg-white rounded-[12px] border border-slate-200/80 space-y-2">
                  <label className="flex items-center justify-between cursor-pointer gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={getAccessoryStudioPreviewUrl(`strap-${strapVariant}`)}
                        alt="Carrying Strap"
                        className="w-9 h-9 rounded-lg object-cover border border-slate-100 shrink-0"
                      />
                      <span className="text-xs font-bold text-slate-800 truncate">
                        Handle Strap
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={accessories.strap}
                      onChange={(e) => handleToggleAccessory('strap', e.target.checked)}
                      className="w-4 h-4 accent-pink-500 rounded cursor-pointer shrink-0"
                    />
                  </label>
                  <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-100">
                    {STRAP_VARIATIONS.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          setStrapVariant(v.id);
                          if (!accessories.strap) handleToggleAccessory('strap', true);
                          else playPopSound();
                        }}
                        className={`py-1 px-1.5 rounded-lg border text-[10px] font-semibold truncate transition cursor-pointer ${
                          strapVariant === v.id
                            ? 'border-pink-500 bg-pink-50/60 text-pink-700'
                            : 'border-slate-200/70 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {v.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Silicone Boot */}
                <div className="p-3 bg-white rounded-[12px] border border-slate-200/80 space-y-2">
                  <label className="flex items-center justify-between cursor-pointer gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={getAccessoryStudioPreviewUrl(`boot-${bootVariant}`)}
                        alt="Silicone Boot"
                        className="w-9 h-9 rounded-lg object-cover border border-slate-100 shrink-0"
                      />
                      <span className="text-xs font-bold text-slate-800 truncate">
                        Silicone Boot
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={accessories.boot}
                      onChange={(e) => handleToggleAccessory('boot', e.target.checked)}
                      className="w-4 h-4 accent-pink-500 rounded cursor-pointer shrink-0"
                    />
                  </label>
                  <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-100">
                    {BOOT_VARIATIONS.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          setBootVariant(v.id);
                          if (!accessories.boot) handleToggleAccessory('boot', true);
                          else playPopSound();
                        }}
                        className={`py-1 px-1.5 rounded-lg border text-[10px] font-semibold truncate transition cursor-pointer ${
                          bootVariant === v.id
                            ? 'border-pink-500 bg-pink-50/60 text-pink-700'
                            : 'border-slate-200/70 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {v.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAccessoryFlatLayOpen(true)}
                  className="w-full py-2 px-3 rounded-[12px] border border-slate-200/90 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center justify-between transition cursor-pointer"
                >
                  <span>3D Accessories Catalog</span>
                  <i className="fa-solid fa-expand text-[10px] text-slate-400"></i>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Center Canvas (Focused 3D Viewport & Panel Bawah Kustomisasi) */}
        <section className="order-1 md:order-2 flex-1 relative flex flex-col items-center justify-center pointer-events-none min-h-[280px] sm:min-h-[360px]">
          {/* Subtle Toast Notification */}
          {statusFeedback && (
            <div className="absolute top-4 z-20 bg-slate-900/95 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-semibold shadow-md flex items-center gap-2 pointer-events-auto">
              <span>{statusFeedback}</span>
            </div>
          )}

          {/* Subtle Sticker Placement Hint */}
          {isStickerMode && !statusFeedback && flowState === 'studio' && (
            <div className="absolute top-4 z-10 bg-white/90 backdrop-blur-md border border-pink-200 text-slate-700 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs flex items-center gap-2 pointer-events-auto">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              <span>Klik pada permukaan tumbler 3D untuk menempel &ldquo;{activeSticker?.name}&rdquo;</span>
            </div>
          )}

          {/* PANEL BAWAH (STATE 3): Palette Warna & Slider Kustomisasi (Staggered GSAP Entrance) */}
          <div className={flowState === 'studio' ? 'pointer-events-auto' : 'pointer-events-none'}>
            <StudioBottomCustomizationDock
              panelRef={bottomPanelStudioRef}
              colors={COLORS}
              selectedColor={selectedColor}
              onSelectColor={handleSelectColor}
              laserEngraving={laserEngraving}
              onChangeLaserSize={(px) =>
                setLaserEngraving((prev) => ({
                  ...prev,
                  enabled: true,
                  fontSizePx: px,
                }))
              }
              stickerScale={stickerScale}
              onChangeStickerScale={(sc) => setStickerScale(sc)}
              autoRotate360={autoRotate360}
              onToggleAutoRotate={() => {
                setAutoRotate360((prev) => !prev);
                setFollowCursor(false);
                playPopSound();
              }}
              zoomLevel={zoomLevel}
              onZoomStep={handleZoomStep}
            />
          </div>
        </section>

        {/* PANEL KANAN (STATE 3): Ringkasan Harga & Tombol Checkout 3D + Studio Export */}
        <aside
          ref={rightPanelStudioRef}
          className={`order-3 w-full md:w-[295px] lg:w-[310px] md:max-w-[315px] bg-white/88 backdrop-blur-xl z-20 flex flex-col border-t md:border-t-0 md:border-l border-white/90 shadow-lg shadow-slate-900/5 shrink-0 ${
            flowState === 'studio' ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          <div className="flex-1 p-4 space-y-3.5 overflow-y-auto text-xs">
            {/* Top Card: Ringkasan Harga & Tombol Checkout 3D */}
            <div className="bg-white rounded-[16px] p-4 space-y-3 border border-pink-100 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <h2 className="text-xs font-extrabold text-slate-900">Ringkasan Harga 3D</h2>
                  <p className="text-[11px] text-slate-400">
                    {selectedModel.shortName} · {selectedModel.capacity}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-pink-600 bg-pink-50 border border-pink-200/60 px-2.5 py-0.5 rounded-full">
                  Ready 2 Jam
                </span>
              </div>

              {/* Rincian Biaya */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Tumbler ({selectedColor.name})</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    Rp {baseTumblerPriceIDR.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Ukiran Laser ({laserEngraving.enabled && laserEngraving.text.trim() ? currentLaserStyle.name : 'Off'})</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    {laserEngravingPriceIDR > 0
                      ? `+ Rp ${laserEngravingPriceIDR.toLocaleString('id-ID')}`
                      : 'Rp 0'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Stiker 3D ({placedStickers.length}x)</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    {stickersPriceIDR > 0
                      ? `+ Rp ${stickersPriceIDR.toLocaleString('id-ID')}`
                      : 'Rp 0'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Aksesoris ({activeAccessoriesSummary.length}x)</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    {accessoriesPriceIDR > 0
                      ? `+ Rp ${accessoriesPriceIDR.toLocaleString('id-ID')}`
                      : 'Rp 0'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-sm">
                  <span className="font-extrabold text-slate-900">Total Harga</span>
                  <span className="font-extrabold text-pink-600 tabular-nums">
                    Rp {totalPriceIDR.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Tombol Utama: Checkout 3D */}
              <button
                type="button"
                onClick={handleOpenCheckout3D}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-pink-500/25 hover:shadow-lg hover:shadow-pink-500/40 transition active:scale-[0.99] cursor-pointer"
              >
                <i className="fa-solid fa-bag-shopping"></i>
                <span>Checkout 3D &amp; Pickup Pass</span>
              </button>
            </div>

            {/* Second Card: "Design Actions" with buttons for "📸 Download HD Render" and "🔗 Share Design Link" */}
            <div className="bg-white rounded-[16px] p-4 space-y-2.5 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900">Design Export &amp; Share</h3>
                <span className="text-[10px] font-semibold text-slate-500">HD Studio</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadHDRender}
                  className="py-2 px-2.5 rounded-xl bg-pink-50 hover:bg-pink-100/80 border border-pink-200/80 text-pink-700 font-bold text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <span>📸</span>
                  <span>HD Render</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareDesignLink}
                  className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <span>🔗</span>
                  <span>Share Link</span>
                </button>
              </div>
            </div>

            {/* Third Card: "Design Specs Summary" */}
            <div className="bg-white rounded-[16px] p-4 space-y-2.5 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Spesifikasi Desain</h3>
                  <p className="text-[10px] text-slate-400">
                    Desainer: {loggedInUser.name}
                  </p>
                </div>
                <span
                  className="w-6 h-6 rounded-[8px] border border-black/10 shrink-0"
                  style={{ backgroundColor: selectedColor.hex }}
                  title={selectedColor.name}
                />
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500">Warna Body</span>
                  <span className="font-semibold text-slate-800 text-right">
                    {selectedColor.name} ({finish === 'matte' ? 'Matte' : 'Glossy'})
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500">Font Ukiran</span>
                  <span className="font-semibold text-slate-800 text-right truncate max-w-[145px]">
                    {laserEngraving.enabled && laserEngraving.text.trim()
                      ? `${currentLaserStyle.name} ("${laserEngraving.text.trim()}")`
                      : 'Tanpa Ukiran'}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 shrink-0">Aksesoris</span>
                  <span className="font-semibold text-slate-800 text-right leading-snug">
                    {activeAccessoriesSummary.length > 0
                      ? activeAccessoriesSummary.join(', ')
                      : 'Minimal Vessel'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Modal Checkout 3D & Pickup Confirmation */}
      <Checkout3DOrderModal
        isOpen={isCheckout3DOpen}
        onClose={() => setIsCheckout3DOpen(false)}
        previewImageUrl={checkoutRenderUrl}
        modelName={`${selectedModel.shortName} ${selectedModel.capacity}`}
        colorName={selectedColor.name}
        colorHex={selectedColor.hex}
        finish={finish}
        laserText={laserEngraving.enabled ? laserEngraving.text.trim() : ''}
        laserStyleName={currentLaserStyle.name}
        activeAccessories={activeAccessoriesSummary}
        stickersCount={placedStickers.length}
        totalPriceIDR={totalPriceIDR}
        onDownloadRender={handleDownloadHDRender}
      />

      {/* Inspiration Gallery Overlay Modal */}
      {activeNavView === 'inspiration' && (
        <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-[20px] max-w-4xl w-full max-h-[88dvh] flex flex-col border border-slate-200 overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Community Inspiration Gallery
                </h3>
                <p className="text-xs text-slate-500">
                  Explore 3D tumbler creations shared by designers and remix any build in the studio.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveNavView('studio')}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-[#F8F9FC]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {communityGallery.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-[16px] p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-pink-50 border border-pink-200 text-pink-600 font-bold text-xs flex items-center justify-center">
                          {item.avatar}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                          <p className="text-[11px] text-slate-400">
                            by {item.creator} · {item.createdAt}
                          </p>
                        </div>
                      </div>
                      <span
                        className="w-6 h-6 rounded-lg border border-black/10 shrink-0"
                        style={{ backgroundColor: item.colorHex }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Color</span>
                        <span className="font-semibold text-slate-700">{item.colorName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Engraving</span>
                        <span className="font-semibold text-slate-700">{item.laserText}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Stickers</span>
                        <span className="font-semibold text-slate-700">
                          {item.stickersCount} Decals
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-semibold text-slate-500">
                        ♥ {item.likes} likes
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const matchedColor =
                            COLORS.find(
                              (c) => c.hex.toUpperCase() === item.colorHex.toUpperCase()
                            ) || COLORS[0];
                          setSelectedColor(matchedColor);
                          if (item.laserText && item.laserText !== 'None') {
                            setLaserEngraving((prev) => ({
                              ...prev,
                              enabled: true,
                              text: item.laserText,
                            }));
                          }
                          setActiveNavView('studio');
                          playPopSound();
                          showToast(`Loaded "${item.title}" into 3D Studio`);
                        }}
                        className="px-3.5 py-1.5 rounded-[10px] bg-slate-900 hover:bg-pink-600 text-white text-xs font-semibold transition cursor-pointer"
                      >
                        Remix in 3D Studio
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit to Community Gallery Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl relative">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-600 text-[11px] font-bold">
                Community Showcase
              </span>
              <h3 className="font-bold text-lg text-slate-900">Submit to Community Gallery</h3>
              <p className="text-xs text-slate-500">
                Publish your custom 3D tumbler configuration to inspire other creators.
              </p>
            </div>

            <div className="p-3.5 rounded-[12px] bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Color &amp; Finish:</span>
                <span className="font-semibold text-slate-800">
                  {selectedColor.name} ({finish === 'matte' ? 'Matte' : 'Glossy'})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Engraving Font:</span>
                <span className="font-semibold text-slate-800">
                  {laserEngraving.enabled && laserEngraving.text.trim()
                    ? `${currentLaserStyle.name} ("${laserEngraving.text.trim()}")`
                    : 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Active Accessories:</span>
                <span className="font-semibold text-slate-800">
                  {activeAccessoriesSummary.length > 0
                    ? activeAccessoriesSummary.join(', ')
                    : 'None'}
                </span>
              </div>
            </div>

            <form onSubmit={handleConfirmSubmitToGallery} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Design Title
                </label>
                <input
                  type="text"
                  required
                  value={submissionTitle}
                  onChange={(e) => setSubmissionTitle(e.target.value)}
                  placeholder="e.g. Matcha Zen Botanical"
                  className="w-full px-3.5 py-2 rounded-[12px] border border-slate-200 text-xs font-semibold focus:border-pink-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Creator Name / Handle
                </label>
                <input
                  type="text"
                  required
                  value={submissionCreator}
                  onChange={(e) => setSubmissionCreator(e.target.value)}
                  placeholder="e.g. @maya.studio"
                  className="w-full px-3.5 py-2 rounded-[12px] border border-slate-200 text-xs font-semibold focus:border-pink-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-[12px] bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-sm transition cursor-pointer"
              >
                Publish Design to Gallery
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Creator Portfolio Profile Modal (dengan Tombol Keluar / Logout) */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[22px] max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 text-white font-extrabold text-lg flex items-center justify-center shadow-sm">
                {loggedInUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-900">
                    {loggedInUser.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-pink-50 border border-pink-200 text-pink-600 text-[10px] font-bold">
                    {loggedInUser.isGuest ? 'Guest Mode' : 'Creator Pro'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  @{loggedInUser.name.toLowerCase().replace(/\s+/g, '.')} · TUMBLR.LAB 3D Studio
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-center">
              <div className="p-3 rounded-[14px] bg-slate-50 border border-slate-100">
                <p className="text-sm font-extrabold text-slate-900 tabular-nums">
                  {communityGallery.length}
                </p>
                <p className="text-[11px] text-slate-500">Showcases</p>
              </div>
              <div className="p-3 rounded-[14px] bg-slate-50 border border-slate-100">
                <p className="text-sm font-extrabold text-slate-900">1.8k</p>
                <p className="text-[11px] text-slate-500">Community Likes</p>
              </div>
            </div>

            {/* Detail Desain Aktif Saat Ini */}
            <div className="p-3.5 rounded-[14px] bg-slate-50/80 border border-slate-200/70 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Desain Aktif:</span>
                <span className="font-bold text-slate-800">
                  {selectedModel.shortName} · {selectedColor.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Ukiran Laser:</span>
                <span className="font-bold text-slate-800">
                  {laserEngraving.enabled && laserEngraving.text.trim()
                    ? `"${laserEngraving.text.trim()}"`
                    : 'Tanpa Ukiran'}
                </span>
              </div>
            </div>

            {/* Tombol Keluar / Logout */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Tutup
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsProfileModalOpen(false);
                  setIsCheckout3DOpen(false);
                  setIsSubmitModalOpen(false);
                  setActiveNavView('studio');
                  setStatusFeedback(null);

                  const studioEls = [
                    headerStudioRef.current,
                    leftPanelStudioRef.current,
                    bottomPanelStudioRef.current,
                    rightPanelStudioRef.current,
                  ].filter(Boolean);
                  studioEls.forEach((el) => {
                    if (el) {
                      el.style.removeProperty('opacity');
                      el.style.removeProperty('transform');
                    }
                  });

                  setFlowState('login');
                  playPopSound();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                <span>Keluar (Logout)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modular Asset Sheet Modals (Colors, Accessories, Laser Engraving, Calligraphy, Stickers) */}
      <AssetSheetModals
        colors={COLORS}
        selectedColor={selectedColor}
        onSelectColor={handleSelectColor}
        onSelectCustomColor={(hex, name) => {
          setSelectedColor({
            id: `custom-${hex}`,
            name,
            hex,
            capHex: hex,
            category: 'pastel',
            code: hex,
          });
        }}
        isColorSheetOpen={isColorSheetOpen}
        setIsColorSheetOpen={setIsColorSheetOpen}
        isAccessoryFlatLayOpen={isAccessoryFlatLayOpen}
        setIsAccessoryFlatLayOpen={setIsAccessoryFlatLayOpen}
        accessories={accessories}
        topperVariant={topperVariant}
        setTopperVariant={setTopperVariant}
        keychainVariant={keychainVariant}
        setKeychainVariant={setKeychainVariant}
        strapVariant={strapVariant}
        setStrapVariant={setStrapVariant}
        bootVariant={bootVariant}
        setBootVariant={setBootVariant}
        onToggleAccessory={handleToggleAccessory}
        isLaserSheetOpen={isLaserSheetOpen}
        setIsLaserSheetOpen={setIsLaserSheetOpen}
        laserEngraving={laserEngraving}
        setLaserEngraving={setLaserEngraving}
        onFocusFrontView={() => handleSetTurnaroundView(0)}
        setActiveTab={setActiveTab}
        isCalligraphySheetOpen={isCalligraphySheetOpen}
        setIsCalligraphySheetOpen={setIsCalligraphySheetOpen}
        customNameText={customNameText}
        setCustomNameText={setCustomNameText}
        customCalligStyle={customCalligStyle}
        setCustomCalligStyle={setCustomCalligStyle}
        customCalligOrnament={customCalligOrnament}
        customCalligColor={customCalligColor}
        aestheticStickers={AESTHETIC_STICKERS}
        activeSticker={activeSticker}
        onSelectSticker={handleSelectSticker}
        isStickerSheetOpen={isStickerSheetOpen}
        setIsStickerSheetOpen={setIsStickerSheetOpen}
      />
    </div>
  );
}
