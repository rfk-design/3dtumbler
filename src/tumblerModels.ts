import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  StrawTopperVariant,
  KeychainVariant,
  StrapVariant,
  BootVariant,
  getWovenFabricTexture,
  getFauxLeatherTexture,
  getWaffleSiliconeTexture,
  getGlitterSiliconeTexture,
} from './accessories3D';

export interface TumblerModelSpec {
  id: 'eco-750' | 'quench-1200' | 'hydro-900' | 'barista-500' | 'boba-700';
  name: string;
  shortName: string;
  capacity: string;
  price: number;
  badge: string;
  description: string;
  icon: string;
}

export const TUMBLER_MODELS: TumblerModelSpec[] = [
  {
    id: 'eco-750',
    name: 'Classic Insulated Straw Tumbler 750ml',
    shortName: 'Classic 750ml',
    capacity: '750ml',
    price: 185000,
    badge: 'Studio Hero',
    description: 'Modern stainless steel insulated tumbler with straw & screw lid',
    icon: 'fa-glass-water-droplet',
  },
  {
    id: 'quench-1200',
    name: 'Quencher H2.0 FlowState 1.2L',
    shortName: 'Quencher 1.2L',
    capacity: '1200ml',
    price: 245000,
    badge: 'Best Seller',
    description: 'Ergonomic comfort-grip side handle & narrow cupholder base',
    icon: 'fa-mug-hot',
  },
  {
    id: 'hydro-900',
    name: 'Aero Insulated Flask 900ml',
    shortName: 'Aero Flask',
    capacity: '900ml',
    price: 210000,
    badge: 'Active Series',
    description: 'Sleek cylindrical vacuum flask with minimalist straw lid',
    icon: 'fa-bottle-water',
  },
  {
    id: 'barista-500',
    name: 'Carter Barista Tumbler 500ml',
    shortName: 'Barista 500ml',
    capacity: '500ml',
    price: 165000,
    badge: 'Coffee Series',
    description: 'Compact architectural tumbler with brushed stainless rim',
    icon: 'fa-mug-saucer',
  },
  {
    id: 'boba-700',
    name: 'Crystal Dome Iced Tumbler 700ml',
    shortName: 'Crystal 700ml',
    capacity: '700ml',
    price: 195000,
    badge: 'Glass Dome',
    description: 'Insulated café tumbler with crystal dome lid & wide straw',
    icon: 'fa-wand-magic-sparkles',
  },
];

export interface BodyWallDimensions {
  centerY: number;
  height: number;
  topRadius: number;
  botRadius: number;
  getRadiusAtY: (y: number) => number;
}

export interface BuiltTumblerMeshes {
  bodyMesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>;
  capMeshes: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>[];
  stickerAttachmentGroup: THREE.Group;
  bodyWallSpec: BodyWallDimensions;
  accessories: {
    keychain: THREE.Object3D;
    strap: THREE.Object3D;
    topper: THREE.Object3D;
    boot: THREE.Object3D;
  };
}

let cachedPowderBumpTexture: THREE.CanvasTexture | null = null;
let cachedAnisotropicBrushTexture: THREE.CanvasTexture | null = null;

/**
 * Generates a tileable micro-fine powder-coat normal/bump texture
 * for authentic Octane Render matte pastel surface tactility.
 */
function getPowderCoatBumpMap(): THREE.CanvasTexture {
  if (cachedPowderBumpTexture) return cachedPowderBumpTexture;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;
    // Deterministic subtle noise for fine ceramic/powder-coat finish
    let seed = 1337;
    for (let i = 0; i < data.length; i += 4) {
      seed = (seed * 16807) % 2147483647;
      const v = 120 + (seed % 16);
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(14, 14);
  cachedPowderBumpTexture = tex;
  return tex;
}

/**
 * Generates horizontal micro-brushed stainless steel texture
 * for realistic machined 18/8 stainless steel rims and bases.
 */
function getBrushedSteelBumpMap(): THREE.CanvasTexture {
  if (cachedAnisotropicBrushTexture) return cachedAnisotropicBrushTexture;

  const w = 256;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y++) {
      const shade = 118 + Math.floor(Math.sin(y * 1.7) * 8 + (y % 3) * 4);
      ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
      ctx.fillRect(0, y, w, 1);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 6);
  cachedAnisotropicBrushTexture = tex;
  return tex;
}

/**
 * Creates an Octane-style Studio Product Photography Environment Map
 * using Three.js `RoomEnvironment` as a physically-based foundation
 */
export function createPMREMStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const roomEnv = new RoomEnvironment();
  const renderTarget = pmremGenerator.fromScene(roomEnv, 0.04);
  roomEnv.dispose();
  pmremGenerator.dispose();
  return renderTarget.texture;
}

/**
 * Precision piecewise-linear + fillet Lathe builder.
 * Unlike SplineCurve (which overshoots and creates "melted" bulges),
 * this connects exact engineering profile coordinates with crisp micro-chamfers,
 * guaranteeing zero distortion and razor-sharp machined geometry.
 */
function createPrecisionLatheBody(
  profilePoints: [number, number][],
  material: THREE.MeshPhysicalMaterial,
  segments = 160
): {
  mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>;
  getRadiusAtY: (y: number) => number;
  minY: number;
  maxY: number;
} {
  // Subdivide each linear segment densely so UV mapping and lighting normals are ultra-smooth
  const densePoints: THREE.Vector2[] = [];
  for (let i = 0; i < profilePoints.length - 1; i++) {
    const [r0, y0] = profilePoints[i];
    const [r1, y1] = profilePoints[i + 1];
    const dist = Math.hypot(r1 - r0, y1 - y0);
    const steps = Math.max(4, Math.ceil(dist * 28));
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      densePoints.push(new THREE.Vector2(r0 + (r1 - r0) * t, y0 + (y1 - y0) * t));
    }
  }
  const lastPt = profilePoints[profilePoints.length - 1];
  densePoints.push(new THREE.Vector2(lastPt[0], lastPt[1]));

  const minY = profilePoints[0][1];
  const maxY = lastPt[1];
  const totalH = Math.max(0.01, maxY - minY);

  const geo = new THREE.LatheGeometry(densePoints, segments);

  // Clean cylindrical UV projection (u: 0..1 around circumference, v: 0..1 bottom-to-top)
  const posAttr = geo.attributes.position;
  const uvAttr = geo.attributes.uv;
  for (let i = 0; i < posAttr.count; i++) {
    const y = posAttr.getY(i);
    const v = Math.max(0, Math.min(1, (y - minY) / totalH));
    const uOrig = uvAttr.getX(i);
    uvAttr.setXY(i, 1 - uOrig, v);
  }
  uvAttr.needsUpdate = true;
  geo.computeVertexNormals();

  const getRadiusAtY = (yQuery: number) => {
    const yClamped = Math.max(minY, Math.min(maxY, yQuery));
    for (let i = 0; i < profilePoints.length - 1; i++) {
      const [r0, y0] = profilePoints[i];
      const [r1, y1] = profilePoints[i + 1];
      if (yClamped >= y0 && yClamped <= y1) {
        const span = y1 - y0;
        if (Math.abs(span) < 1e-5) return r1;
        const t = (yClamped - y0) / span;
        return r0 + (r1 - r0) * t;
      }
    }
    return lastPt[0];
  };

  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.name = 'tumblerBody';

  return { mesh, getRadiusAtY, minY, maxY };
}

/**
 * Helper to create a smooth 3D puffy star geometry for the keychain charm
 */
function createPuffyStarMesh(material: THREE.Material, scale = 0.2): THREE.Mesh {
  const shape = new THREE.Shape();
  const points = 5;
  const outerR = scale;
  const innerR = scale * 0.48;

  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: scale * 0.24,
    bevelEnabled: true,
    bevelSegments: 8,
    steps: 2,
    bevelSize: scale * 0.14,
    bevelThickness: scale * 0.14,
  };

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  return new THREE.Mesh(geo, material);
}

/**
 * Creates a realistic hollow-bore reusable straw (outer cylinder + inner wall + top rounded lip + dark inner bore)
 * Guaranteed single clean straw per tumbler with zero extra straw artifacts.
 */
function createRealisticHollowStraw(
  outerRadius: number,
  length: number,
  material: THREE.MeshPhysicalMaterial,
  darkInteriorMat: THREE.Material
): THREE.Group {
  const strawGroup = new THREE.Group();
  const innerRadius = outerRadius * 0.68;

  // Outer translucent straw shaft
  const outerShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(outerRadius, outerRadius, length, 64, 1, true),
    material
  );
  strawGroup.add(outerShaft);

  // Top rounded drinking lip torus
  const topLip = new THREE.Mesh(
    new THREE.TorusGeometry(
      (outerRadius + innerRadius) / 2,
      (outerRadius - innerRadius) / 2,
      20,
      64
    ),
    material
  );
  topLip.rotation.x = Math.PI / 2;
  topLip.position.y = length / 2;
  strawGroup.add(topLip);

  // Subtle dark hollow bore inside straw top so it looks like a real tube
  const innerBore = new THREE.Mesh(
    new THREE.CylinderGeometry(innerRadius * 0.96, innerRadius * 0.96, length * 0.35, 32),
    darkInteriorMat
  );
  innerBore.position.y = length * 0.3;
  strawGroup.add(innerBore);

  return strawGroup;
}

/**
 * Builds ultra-realistic, Octane-style 3D Stainless Steel Insulated Tumbler Models
 * isolated on a clean neutral studio background with natural soft ground contact shadow.
 */
export function populateTumbler3DModel(
  targetGroup: THREE.Group,
  modelId: TumblerModelSpec['id'],
  bodyTexture: THREE.CanvasTexture,
  colorHex: string,
  capColorHex: string,
  finish: 'matte' | 'glossy',
  topperVariant: StrawTopperVariant = 'strawberry',
  keychainVariant: KeychainVariant = 'holo-star',
  strapVariant: StrapVariant = 'woven-boho',
  bootVariant: BootVariant = 'waffle-pink'
): BuiltTumblerMeshes {
  while (targetGroup.children.length > 0) {
    targetGroup.remove(targetGroup.children[0]);
  }

  const isGlossy = finish === 'glossy';
  const SEGMENTS = 160;

  const powderBump = getPowderCoatBumpMap();
  const steelBump = getBrushedSteelBumpMap();

  // Smooth Matte Pastel Powder-Coat vs Glossy Ceramic Glaze (Octane PBR Shader)
  const bodyMat = new THREE.MeshPhysicalMaterial({
    map: bodyTexture,
    bumpMap: powderBump,
    bumpScale: isGlossy ? 0.0005 : 0.0022,
    roughness: isGlossy ? 0.12 : 0.44,
    metalness: isGlossy ? 0.18 : 0.04,
    clearcoat: isGlossy ? 1.0 : 0.14,
    clearcoatRoughness: isGlossy ? 0.06 : 0.48,
    sheen: isGlossy ? 0.0 : 0.25,
    sheenRoughness: 0.55,
    sheenColor: new THREE.Color(0xffffff),
    reflectivity: 0.75,
    envMapIntensity: isGlossy ? 1.35 : 0.92,
  });

  // Smooth Molded Matte Polymer Cap Material
  const capMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(capColorHex),
    bumpMap: powderBump,
    bumpScale: 0.0012,
    roughness: 0.32,
    metalness: 0.02,
    clearcoat: 0.25,
    clearcoatRoughness: 0.28,
    envMapIntensity: 0.95,
  });

  // Crystal-Clear Optical Tritan Lid Material (High-clarity transparent lid)
  const frostedLidMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(capColorHex).lerp(new THREE.Color(0xffffff), 0.72),
    roughness: 0.06,
    metalness: 0.0,
    transmission: 0.82,
    thickness: 0.28,
    transparent: true,
    opacity: 0.96,
    ior: 1.49,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    envMapIntensity: 1.4,
  });

  // Precision Machined 18/8 Brushed Stainless Steel
  const steelMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    bumpMap: steelBump,
    bumpScale: 0.0015,
    metalness: 0.92,
    roughness: 0.18,
    clearcoat: 0.45,
    clearcoatRoughness: 0.14,
    envMapIntensity: 1.45,
  });

  const goldMat = new THREE.MeshPhysicalMaterial({
    color: 0xfbbf24,
    metalness: 0.92,
    roughness: 0.16,
    clearcoat: 0.6,
  });

  const darkGasketMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.55,
    metalness: 0.08,
  });

  const strawMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(capColorHex).lerp(new THREE.Color(0xffffff), 0.65),
    roughness: 0.06,
    metalness: 0.0,
    transmission: 0.78,
    thickness: 0.14,
    transparent: true,
    opacity: 0.95,
    ior: 1.49,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    side: THREE.DoubleSide,
  });

  const capMeshes: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>[] = [];
  let mainBodyMesh!: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>;

  // Zero ground shadow plane — isolated on a pure solid white background (#FFFFFF)

  let strawTopPos = new THREE.Vector3(0, 2.9, 0);
  let strawShaftAngleZ = 0;
  let strawRadius = 0.082;
  let neckBandY = 1.32;
  let baseBottomY = -1.48;
  let bodyWallSpec!: BodyWallDimensions;

  if (modelId === 'eco-750') {
    // =========================================================================
    // MODEL 1 (HERO): CLASSIC INSULATED STAINLESS TUMBLER WITH STRAW & LID (750ml)
    // Crisp architectural straight taper, machined stainless rim, recessed lid,
    // silicone straw grommet, and single vertical hollow-bore straw.
    // =========================================================================
    const profile: [number, number][] = [
      [0.64, -1.75], // Bottom edge chamfer start
      [0.72, -1.71], // Bottom edge chamfer end
      [0.74, -1.62], // Crisp lower body corner
      [0.86, -0.10], // Precision linear taper mid
      [0.98, 1.44],  // Upper body wall
      [0.975, 1.48], // Micro-step into stainless steel lip
    ];

    const builtBody = createPrecisionLatheBody(profile, bodyMat, SEGMENTS);
    mainBodyMesh = builtBody.mesh;
    targetGroup.add(mainBodyMesh);

    bodyWallSpec = {
      centerY: (builtBody.minY + builtBody.maxY) / 2,
      height: builtBody.maxY - builtBody.minY,
      topRadius: 0.98,
      botRadius: 0.74,
      getRadiusAtY: builtBody.getRadiusAtY,
    };

    // Brushed 18/8 Stainless Steel Bottom Foot Ring
    const bottomSteelBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.72, 0.67, 0.08, SEGMENTS),
      steelMat
    );
    bottomSteelBase.position.y = -1.76;
    bottomSteelBase.castShadow = true;
    targetGroup.add(bottomSteelBase);

    // Dark Non-Slip Pad Under Base
    const basePad = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.65, 0.02, 64),
      darkGasketMat
    );
    basePad.position.y = -1.80;
    targetGroup.add(basePad);

    // Precision Machined Brushed Stainless Steel Upper Lip Band
    const steelRim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.985, 0.98, 0.14, SEGMENTS),
      steelMat
    );
    steelRim.position.y = 1.54;
    targetGroup.add(steelRim);

    // Thin Dark Silicone Seal Line between Steel Rim and Lid
    const sealRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.98, 0.009, 16, SEGMENTS),
      darkGasketMat
    );
    sealRing.rotation.x = Math.PI / 2;
    sealRing.position.y = 1.61;
    targetGroup.add(sealRing);

    // Crisp Press-Fit Clear Tritan Insulated Lid Side Wall
    const lidWall = new THREE.Mesh(
      new THREE.CylinderGeometry(0.975, 0.985, 0.24, SEGMENTS),
      frostedLidMat
    );
    lidWall.position.y = 1.73;
    targetGroup.add(lidWall);
    capMeshes.push(lidWall);

    // Raised Outer Lid Rim Bevel
    const lidTopRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.945, 0.032, 28, SEGMENTS),
      capMat
    );
    lidTopRim.rotation.x = Math.PI / 2;
    lidTopRim.position.y = 1.85;
    targetGroup.add(lidTopRim);
    capMeshes.push(lidTopRim);

    // Molded Straw Hole Grommet Boss in Center of Lid
    const strawGrommet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.135, 0.15, 0.07, 64),
      capMat
    );
    strawGrommet.position.y = 1.86;
    targetGroup.add(strawGrommet);
    capMeshes.push(strawGrommet);

    const grommetLip = new THREE.Mesh(
      new THREE.TorusGeometry(0.115, 0.02, 20, 64),
      capMat
    );
    grommetLip.rotation.x = Math.PI / 2;
    grommetLip.position.y = 1.895;
    targetGroup.add(grommetLip);
    capMeshes.push(grommetLip);

    // Single Ultra-Clean Vertical Reusable Straw with Hollow Bore
    const strawObj = createRealisticHollowStraw(0.082, 1.15, strawMat, darkGasketMat);
    strawObj.position.set(0, 2.38, 0);
    targetGroup.add(strawObj);

    strawTopPos.set(0, 2.95, 0);
    strawShaftAngleZ = 0;
    strawRadius = 0.082;
    neckBandY = 1.24;
    baseBottomY = -1.46;
  } else if (modelId === 'quench-1200') {
    // =========================================================================
    // MODEL 2: QUENCHER H2.0 FLOWSTATE TUMBLER (1.2L)
    // Crisp architectural cupholder base -> clean conical flare -> upper barrel
    // =========================================================================
    const profile: [number, number][] = [
      [0.65, -1.76],
      [0.72, -1.72],
      [0.74, -1.62],
      [0.75, -0.52], // Narrow lower cupholder cylinder
      [0.77, -0.44], // Lower transition fillet
      [1.01, -0.06], // Clean conical transition
      [1.04, 0.04],  // Upper transition fillet
      [1.06, 1.46],  // Upper barrel
      [1.055, 1.49],
    ];

    const builtBody = createPrecisionLatheBody(profile, bodyMat, SEGMENTS);
    mainBodyMesh = builtBody.mesh;
    targetGroup.add(mainBodyMesh);

    bodyWallSpec = {
      centerY: (builtBody.minY + builtBody.maxY) / 2,
      height: builtBody.maxY - builtBody.minY,
      topRadius: 1.06,
      botRadius: 0.74,
      getRadiusAtY: builtBody.getRadiusAtY,
    };

    // Stainless Steel Base Cap
    const baseCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.72, 0.67, 0.08, SEGMENTS),
      steelMat
    );
    baseCap.position.y = -1.76;
    targetGroup.add(baseCap);

    // Brushed Stainless Steel Collar
    const collarMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(1.065, 1.06, 0.14, SEGMENTS),
      steelMat
    );
    collarMesh.position.y = 1.55;
    targetGroup.add(collarMesh);

    // Translucent FlowState Screw Lid
    const lidMain = new THREE.Mesh(
      new THREE.CylinderGeometry(1.04, 1.065, 0.25, SEGMENTS),
      frostedLidMat
    );
    lidMain.position.y = 1.74;
    targetGroup.add(lidMain);
    capMeshes.push(lidMain);

    const lidRimBevel = new THREE.Mesh(
      new THREE.TorusGeometry(1.015, 0.028, 24, SEGMENTS),
      capMat
    );
    lidRimBevel.rotation.x = Math.PI / 2;
    lidRimBevel.position.y = 1.87;
    targetGroup.add(lidRimBevel);
    capMeshes.push(lidRimBevel);

    // FlowState Rotating Cover Bar
    const spinnerBar = new THREE.Mesh(
      new THREE.BoxGeometry(1.45, 0.055, 0.34),
      capMat
    );
    spinnerBar.position.y = 1.89;
    targetGroup.add(spinnerBar);
    capMeshes.push(spinnerBar);

    // Silicone Straw Seal Grommet
    const grommet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.135, 0.145, 0.08, 48),
      capMat
    );
    grommet.position.y = 1.91;
    targetGroup.add(grommet);
    capMeshes.push(grommet);

    // Single Reusable Center Straw
    const strawObj = createRealisticHollowStraw(0.085, 1.15, strawMat, darkGasketMat);
    strawObj.position.set(0, 2.38, 0);
    targetGroup.add(strawObj);

    // Sculpted Ergonomic D-Shape Side Handle
    const handleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.04, 1.16, 0),
      new THREE.Vector3(1.50, 1.14, 0),
      new THREE.Vector3(1.60, 0.94, 0),
      new THREE.Vector3(1.58, 0.35, 0),
      new THREE.Vector3(1.54, -0.18, 0),
      new THREE.Vector3(1.40, -0.32, 0),
      new THREE.Vector3(0.95, -0.34, 0),
    ]);
    const handleGeo = new THREE.TubeGeometry(handleCurve, 64, 0.09, 32, false);
    const handleMesh = new THREE.Mesh(handleGeo, capMat);
    handleMesh.scale.set(1, 1, 0.72);
    handleMesh.castShadow = true;
    targetGroup.add(handleMesh);
    capMeshes.push(handleMesh);

    const topFerrule = new THREE.Mesh(
      new THREE.CylinderGeometry(0.10, 0.10, 0.12, 32),
      steelMat
    );
    topFerrule.rotation.z = Math.PI / 2;
    topFerrule.position.set(1.07, 1.16, 0);
    targetGroup.add(topFerrule);

    const botFerrule = new THREE.Mesh(
      new THREE.CylinderGeometry(0.095, 0.095, 0.14, 32),
      steelMat
    );
    botFerrule.rotation.z = Math.PI / 2;
    botFerrule.position.set(0.97, -0.34, 0);
    targetGroup.add(botFerrule);

    strawTopPos.set(0, 2.95, 0);
    strawShaftAngleZ = 0;
    strawRadius = 0.085;
    neckBandY = 1.28;
    baseBottomY = -1.48;
  } else if (modelId === 'hydro-900') {
    // =========================================================================
    // MODEL 3: AERO INSULATED CYLINDRICAL FLASK (900ml)
    // Clean modern cylindrical flask with soft shoulder curve, lid & straw
    // =========================================================================
    const profile: [number, number][] = [
      [0.80, -1.75],
      [0.90, -1.69],
      [0.92, -1.56],
      [0.92, 1.05],  // Straight precision cylinder wall
      [0.90, 1.20],  // Gentle upper shoulder chamfer
      [0.84, 1.34],  // Neck transition
    ];

    const builtBody = createPrecisionLatheBody(profile, bodyMat, SEGMENTS);
    mainBodyMesh = builtBody.mesh;
    targetGroup.add(mainBodyMesh);

    bodyWallSpec = {
      centerY: (builtBody.minY + builtBody.maxY) / 2,
      height: builtBody.maxY - builtBody.minY,
      topRadius: 0.92,
      botRadius: 0.92,
      getRadiusAtY: builtBody.getRadiusAtY,
    };

    const bottomRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.90, 0.82, 0.07, SEGMENTS),
      steelMat
    );
    bottomRing.position.y = -1.76;
    targetGroup.add(bottomRing);

    const neckRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.845, 0.845, 0.12, SEGMENTS),
      steelMat
    );
    neckRing.position.y = 1.40;
    targetGroup.add(neckRing);

    const capCollar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.84, 0.85, 0.34, SEGMENTS),
      capMat
    );
    capCollar.position.y = 1.63;
    targetGroup.add(capCollar);
    capMeshes.push(capCollar);

    const capBevel = new THREE.Mesh(
      new THREE.TorusGeometry(0.81, 0.03, 24, SEGMENTS),
      capMat
    );
    capBevel.rotation.x = Math.PI / 2;
    capBevel.position.y = 1.80;
    targetGroup.add(capBevel);
    capMeshes.push(capBevel);

    const grommet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.14, 0.07, 48),
      capMat
    );
    grommet.position.y = 1.83;
    targetGroup.add(grommet);
    capMeshes.push(grommet);

    const strawObj = createRealisticHollowStraw(0.08, 1.05, strawMat, darkGasketMat);
    strawObj.position.set(0, 2.32, 0);
    targetGroup.add(strawObj);

    strawTopPos.set(0, 2.84, 0);
    strawShaftAngleZ = 0;
    strawRadius = 0.08;
    neckBandY = 0.98;
    baseBottomY = -1.45;
  } else if (modelId === 'barista-500') {
    // =========================================================================
    // MODEL 4: CARTER BARISTA TUMBLER (500ml)
    // Compact architectural coffee tumbler with brushed steel base & straw lid
    // =========================================================================
    const profile: [number, number][] = [
      [0.78, -1.68],
      [0.92, -1.60],
      [0.96, -1.45],
      [0.98, 0.20],
      [0.95, 1.02],
    ];

    const builtBody = createPrecisionLatheBody(profile, bodyMat, SEGMENTS);
    mainBodyMesh = builtBody.mesh;
    targetGroup.add(mainBodyMesh);

    bodyWallSpec = {
      centerY: (builtBody.minY + builtBody.maxY) / 2,
      height: builtBody.maxY - builtBody.minY,
      topRadius: 0.96,
      botRadius: 0.95,
      getRadiusAtY: builtBody.getRadiusAtY,
    };

    const steelFoot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.92, 0.84, 0.12, SEGMENTS),
      steelMat
    );
    steelFoot.position.y = -1.72;
    targetGroup.add(steelFoot);

    const steelCollar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.955, 0.95, 0.14, SEGMENTS),
      steelMat
    );
    steelCollar.position.y = 1.09;
    targetGroup.add(steelCollar);

    const mugLid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.945, 0.955, 0.32, SEGMENTS),
      capMat
    );
    mugLid.position.y = 1.32;
    targetGroup.add(mugLid);
    capMeshes.push(mugLid);

    const mugLidBevel = new THREE.Mesh(
      new THREE.TorusGeometry(0.915, 0.03, 24, SEGMENTS),
      capMat
    );
    mugLidBevel.rotation.x = Math.PI / 2;
    mugLidBevel.position.y = 1.48;
    targetGroup.add(mugLidBevel);
    capMeshes.push(mugLidBevel);

    const strawObj = createRealisticHollowStraw(0.075, 0.95, strawMat, darkGasketMat);
    strawObj.position.set(0, 1.92, 0);
    targetGroup.add(strawObj);

    strawTopPos.set(0, 2.39, 0);
    strawShaftAngleZ = 0;
    strawRadius = 0.075;
    neckBandY = 0.78;
    baseBottomY = -1.40;
  } else {
    // =========================================================================
    // MODEL 5: CRYSTAL DOME ICED TUMBLER (700ml)
    // Clean tapered stainless body + optical crystal dome lid + wide straw
    // =========================================================================
    const profile: [number, number][] = [
      [0.66, -1.74],
      [0.73, -1.68],
      [0.75, -1.56],
      [0.88, -0.15],
      [1.01, 1.24],
    ];

    const builtBody = createPrecisionLatheBody(profile, bodyMat, SEGMENTS);
    mainBodyMesh = builtBody.mesh;
    targetGroup.add(mainBodyMesh);

    bodyWallSpec = {
      centerY: (builtBody.minY + builtBody.maxY) / 2,
      height: builtBody.maxY - builtBody.minY,
      topRadius: 1.01,
      botRadius: 0.75,
      getRadiusAtY: builtBody.getRadiusAtY,
    };

    const bottomCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.73, 0.68, 0.08, SEGMENTS),
      steelMat
    );
    bottomCap.position.y = -1.75;
    targetGroup.add(bottomCap);

    const lipCollar = new THREE.Mesh(
      new THREE.CylinderGeometry(1.02, 1.01, 0.14, SEGMENTS),
      capMat
    );
    lipCollar.position.y = 1.31;
    targetGroup.add(lipCollar);
    capMeshes.push(lipCollar);

    const domeGeo = new THREE.SphereGeometry(
      1.01,
      64,
      48,
      0,
      Math.PI * 2,
      0.16,
      Math.PI / 2 - 0.16
    );
    const domeMesh = new THREE.Mesh(domeGeo, frostedLidMat);
    domeMesh.position.y = 1.36;
    targetGroup.add(domeMesh);

    const strawObj = createRealisticHollowStraw(0.105, 1.45, strawMat, darkGasketMat);
    strawObj.position.set(0, 2.24, 0);
    targetGroup.add(strawObj);

    strawTopPos.set(0, 2.96, 0);
    strawShaftAngleZ = 0;
    strawRadius = 0.105;
    neckBandY = 1.02;
    baseBottomY = -1.45;
  }

  // Dedicated Group for Curved 3D Puffy Stickers attached onto mainBodyMesh
  const stickerAttachmentGroup = new THREE.Group();
  targetGroup.add(stickerAttachmentGroup);

  // ============================================================================
  // FLUSH-MOUNTED 3D ACCESSORIES (16 Variations · Octane Render Material Fidelity)
  // ============================================================================
  const rAtNeckTop = bodyWallSpec.getRadiusAtY(neckBandY + 0.12);
  const rAtNeckBot = bodyWallSpec.getRadiusAtY(neckBandY - 0.12);
  const rAtLowerStrap = bodyWallSpec.getRadiusAtY(neckBandY - 1.02);

  // 1. CARRYING STRAPS & HANDLES (3 Variations: `woven-boho` | `silicone-grip` | `clear-beaded`)
  const strapGroup = new THREE.Group();
  const leatherTex = getFauxLeatherTexture();
  const wovenTex = getWovenFabricTexture();

  if (strapVariant === 'woven-boho') {
    const fauxLeatherMat = new THREE.MeshPhysicalMaterial({
      map: leatherTex,
      bumpMap: leatherTex,
      bumpScale: 0.003,
      roughness: 0.46,
      metalness: 0.04,
      clearcoat: 0.15,
    });

    const wovenFabricMat = new THREE.MeshPhysicalMaterial({
      map: wovenTex,
      bumpMap: wovenTex,
      bumpScale: 0.005,
      roughness: 0.65,
      metalness: 0.02,
      sheen: 0.35,
      sheenRoughness: 0.7,
      sheenColor: new THREE.Color(0xfff8f0),
    });

    const collarSleeve = new THREE.Mesh(
      new THREE.CylinderGeometry(rAtNeckTop + 0.026, rAtNeckBot + 0.026, 0.22, SEGMENTS),
      fauxLeatherMat
    );
    collarSleeve.position.y = neckBandY;
    strapGroup.add(collarSleeve);

    // Sturdy Polished Metal Carabiner Clips
    const upperCarabiner = new THREE.Mesh(
      new THREE.TorusGeometry(0.072, 0.02, 20, 48),
      steelMat
    );
    upperCarabiner.position.set(-rAtNeckTop - 0.11, neckBandY - 0.02, 0);
    strapGroup.add(upperCarabiner);

    const lowerCarabiner = new THREE.Mesh(
      new THREE.TorusGeometry(0.072, 0.02, 20, 48),
      steelMat
    );
    lowerCarabiner.position.set(-rAtLowerStrap - 0.11, neckBandY - 0.98, 0);
    strapGroup.add(lowerCarabiner);

    const strapCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-rAtNeckTop - 0.12, neckBandY - 0.04, 0),
      new THREE.Vector3(-rAtNeckTop - 0.44, neckBandY - 0.22, 0),
      new THREE.Vector3(-rAtNeckBot - 0.48, neckBandY - 0.54, 0),
      new THREE.Vector3(-rAtLowerStrap - 0.38, neckBandY - 0.85, 0),
      new THREE.Vector3(-rAtLowerStrap - 0.12, neckBandY - 0.96, 0),
    ]);
    const strapTube = new THREE.Mesh(
      new THREE.TubeGeometry(strapCurve, 72, 0.064, 28, false),
      wovenFabricMat
    );
    strapTube.scale.set(1, 1, 0.65);
    strapGroup.add(strapTube);
  } else if (strapVariant === 'silicone-grip') {
    // Ergonomic Pastel Silicone Side-Handle Grip
    const gripMat = new THREE.MeshPhysicalMaterial({
      color: 0xf472b6,
      bumpMap: powderBump,
      bumpScale: 0.0022,
      roughness: 0.52,
      sheen: 0.25,
    });
    const collarRing = new THREE.Mesh(
      new THREE.CylinderGeometry(rAtNeckTop + 0.025, rAtNeckBot + 0.025, 0.18, SEGMENTS),
      gripMat
    );
    collarRing.position.y = neckBandY;
    strapGroup.add(collarRing);

    const gripCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-rAtNeckTop - 0.02, neckBandY, 0),
      new THREE.Vector3(-rAtNeckTop - 0.46, neckBandY - 0.05, 0),
      new THREE.Vector3(-rAtNeckBot - 0.50, neckBandY - 0.50, 0),
      new THREE.Vector3(-rAtLowerStrap - 0.44, neckBandY - 0.96, 0),
      new THREE.Vector3(-rAtLowerStrap - 0.02, neckBandY - 1.0, 0),
    ]);
    const gripMesh = new THREE.Mesh(
      new THREE.TubeGeometry(gripCurve, 64, 0.085, 32, false),
      gripMat
    );
    gripMesh.scale.set(1, 1, 0.72);
    strapGroup.add(gripMesh);
  } else {
    // Clear Beaded Hand Wristlet Strap
    const clearBeadMat = new THREE.MeshPhysicalMaterial({
      color: 0xf0f9ff,
      roughness: 0.05,
      transmission: 0.85,
      thickness: 0.22,
      transparent: true,
      opacity: 0.94,
      ior: 1.5,
      clearcoat: 1.0,
    });
    const silverCollar = new THREE.Mesh(
      new THREE.TorusGeometry(rAtNeckTop + 0.015, 0.015, 24, SEGMENTS),
      steelMat
    );
    silverCollar.rotation.x = Math.PI / 2;
    silverCollar.position.y = neckBandY;
    strapGroup.add(silverCollar);

    const beadCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-rAtNeckTop - 0.04, neckBandY, 0),
      new THREE.Vector3(-rAtNeckTop - 0.45, neckBandY - 0.25, 0),
      new THREE.Vector3(-rAtNeckBot - 0.48, neckBandY - 0.58, 0),
      new THREE.Vector3(-rAtLowerStrap - 0.36, neckBandY - 0.88, 0),
      new THREE.Vector3(-rAtLowerStrap - 0.04, neckBandY - 0.96, 0),
    ]);
    const numBeads = 13;
    for (let i = 0; i <= numBeads; i++) {
      const pt = beadCurve.getPoint(i / numBeads);
      const bead = new THREE.Mesh(new THREE.SphereGeometry(0.068, 24, 24), clearBeadMat);
      bead.position.copy(pt);
      strapGroup.add(bead);
    }
  }

  strapGroup.visible = false;
  targetGroup.add(strapGroup);

  // 2. KEYCHAINS & CHARMS (4 Variations: `holo-star` | `hydrate-beads` | `plush-bear` | `chibi-hero`)
  const charmGroup = new THREE.Group();
  const rAtCharmRing = bodyWallSpec.getRadiusAtY(neckBandY + 0.05);
  const anchorX = rAtCharmRing + 0.015;
  const anchorY = neckBandY + 0.05;

  const claspMetalMat =
    keychainVariant === 'holo-star' || keychainVariant === 'hydrate-beads' ? steelMat : goldMat;

  const anchorRing = new THREE.Mesh(
    new THREE.TorusGeometry(rAtCharmRing + 0.01, 0.014, 24, SEGMENTS),
    claspMetalMat
  );
  anchorRing.rotation.x = Math.PI / 2;
  anchorRing.position.y = anchorY;
  charmGroup.add(anchorRing);

  const splitRing = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.016, 20, 48), claspMetalMat);
  splitRing.position.set(anchorX + 0.045, anchorY, 0);
  charmGroup.add(splitRing);

  const starY = anchorY - 0.48;
  const rAtStar = bodyWallSpec.getRadiusAtY(starY);

  const clearAcrylicMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.05,
    metalness: 0.0,
    transmission: 0.82,
    thickness: 0.18,
    transparent: true,
    opacity: 0.92,
    ior: 1.49,
    clearcoat: 1.0,
  });

  if (keychainVariant === 'holo-star') {
    for (let i = 0; i < 3; i++) {
      const link = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.011, 16, 32), steelMat);
      link.position.set(anchorX + 0.06, anchorY - 0.07 - i * 0.065, 0.02);
      if (i % 2 === 0) link.rotation.y = Math.PI / 2;
      charmGroup.add(link);
    }
    const acrylicBacking = createPuffyStarMesh(clearAcrylicMat, 0.24);
    acrylicBacking.position.set(rAtStar + 0.062, starY, 0.03);
    acrylicBacking.rotation.y = Math.PI / 2;
    charmGroup.add(acrylicBacking);

    const holoCoreMat = new THREE.MeshPhysicalMaterial({
      color: 0x67e8f9,
      roughness: 0.14,
      metalness: 0.35,
      iridescence: 1.0,
      iridescenceIOR: 1.3,
      clearcoat: 1.0,
    });
    const starCoreMesh = createPuffyStarMesh(holoCoreMat, 0.17);
    starCoreMesh.position.set(rAtStar + 0.065, starY, 0.03);
    starCoreMesh.rotation.y = Math.PI / 2;
    charmGroup.add(starCoreMesh);
  } else if (keychainVariant === 'hydrate-beads') {
    // Beaded pastel charm strap with letter beads spelling "HYDRATE"
    const letters = ['H', 'Y', 'D', 'R', 'A', 'T', 'E'];
    const beadCols = [0xf9a8d4, 0x93c5fd, 0xa7f3d0, 0xfde047, 0xc4b5fd, 0xfdba74, 0xf472b6];
    letters.forEach((_, idx) => {
      const by = anchorY - 0.12 - idx * 0.11;
      const rAtBy = bodyWallSpec.getRadiusAtY(by);
      const cubeMat = new THREE.MeshPhysicalMaterial({
        color: idx % 2 === 0 ? 0xffffff : beadCols[idx],
        roughness: 0.25,
        clearcoat: 0.6,
      });
      const beadMesh = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.085, 0.085), cubeMat);
      beadMesh.position.set(rAtBy + 0.065, by, 0.02);
      beadMesh.rotation.y = idx * 0.25;
      charmGroup.add(beadMesh);
    });
  } else if (keychainVariant === 'plush-bear') {
    // Mini Plush Bear Keychain with Metallic Brass Ring
    const plushMat = new THREE.MeshPhysicalMaterial({
      color: 0xd97706,
      bumpMap: powderBump,
      bumpScale: 0.004,
      roughness: 0.82,
      sheen: 0.45,
      sheenRoughness: 0.8,
      sheenColor: new THREE.Color(0xfef3c7),
    });
    const bearX = rAtStar + 0.09;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 28, 28), plushMat);
    head.position.set(bearX, starY + 0.08, 0.03);
    charmGroup.add(head);

    [-0.09, 0.09].forEach((ez) => {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.055, 20, 20), plushMat);
      ear.position.set(bearX, starY + 0.2, 0.03 + ez);
      charmGroup.add(ear);
    });

    const torso = new THREE.Mesh(new THREE.SphereGeometry(0.12, 28, 28), plushMat);
    torso.scale.set(0.9, 1.15, 0.9);
    torso.position.set(bearX, starY - 0.12, 0.03);
    charmGroup.add(torso);
  } else {
    // Chibi Superhero Acrylic Charm
    const slab = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.05, 48), clearAcrylicMat);
    slab.rotation.z = Math.PI / 2;
    slab.position.set(rAtStar + 0.06, starY, 0.03);
    charmGroup.add(slab);

    const heroRedMat = new THREE.MeshPhysicalMaterial({
      color: 0xef4444,
      roughness: 0.2,
      metalness: 0.3,
      clearcoat: 0.9,
    });
    const heroGoldMat = new THREE.MeshPhysicalMaterial({
      color: 0xfacc15,
      roughness: 0.2,
      metalness: 0.6,
      clearcoat: 0.9,
    });
    const heroHelmet = new THREE.Mesh(new THREE.SphereGeometry(0.14, 32, 32), heroRedMat);
    heroHelmet.scale.set(0.45, 1.15, 0.95);
    heroHelmet.position.set(rAtStar + 0.065, starY, 0.03);
    charmGroup.add(heroHelmet);

    const faceplate = new THREE.Mesh(new THREE.SphereGeometry(0.11, 28, 28), heroGoldMat);
    faceplate.scale.set(0.5, 0.9, 0.8);
    faceplate.position.set(rAtStar + 0.075, starY - 0.01, 0.03);
    charmGroup.add(faceplate);
  }

  charmGroup.visible = false;
  targetGroup.add(charmGroup);

  // 3. CUTE STRAW TOPPERS & COVERS (6 Variations: Marvel & Aesthetic Matte Silicone)
  const topperGroup = new THREE.Group();

  const sleeveColor =
    topperVariant === 'cap-shield'
      ? 0x2563eb
      : topperVariant === 'spidey-mask'
      ? 0xe11d48
      : topperVariant === 'strawberry'
      ? 0xfb7185
      : topperVariant === 'cloud'
      ? 0x93c5fd
      : topperVariant === 'cat-paw'
      ? 0xf472b6
      : 0x6ee7b7;

  const topperSiliconeMat = new THREE.MeshPhysicalMaterial({
    color: sleeveColor,
    bumpMap: powderBump,
    bumpScale: 0.002,
    roughness: 0.54,
    metalness: 0.0,
    clearcoat: 0.08,
    sheen: 0.22,
    sheenRoughness: 0.6,
    sheenColor: new THREE.Color(0xffffff),
  });

  const plugSleeve = new THREE.Mesh(
    new THREE.CylinderGeometry(strawRadius + 0.04, strawRadius + 0.036, 0.19, 48),
    topperSiliconeMat
  );
  plugSleeve.position.set(0, -0.06, 0);
  topperGroup.add(plugSleeve);

  const lowerRing = new THREE.Mesh(
    new THREE.CylinderGeometry(strawRadius + 0.026, strawRadius + 0.026, 0.07, 48),
    topperSiliconeMat
  );
  lowerRing.position.set(0, -0.31, 0);
  topperGroup.add(lowerRing);

  const tetherCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(strawRadius + 0.02, -0.31, 0),
    new THREE.Vector3(strawRadius + 0.14, -0.18, 0),
    new THREE.Vector3(strawRadius + 0.03, -0.06, 0),
  ]);
  const tetherMesh = new THREE.Mesh(
    new THREE.TubeGeometry(tetherCurve, 32, 0.018, 16, false),
    topperSiliconeMat
  );
  topperGroup.add(tetherMesh);

  const headSculptGroup = new THREE.Group();
  headSculptGroup.position.set(0, 0.1, 0);

  if (topperVariant === 'cap-shield') {
    // 3D Marvel Captain America Shield Matte Silicone Topper
    const ringSpecs: [number, number, number][] = [
      [0.19, 0.06, 0xef4444],
      [0.145, 0.068, 0xffffff],
      [0.105, 0.076, 0xef4444],
      [0.068, 0.084, 0x1d4ed8],
    ];
    ringSpecs.forEach(([r, depth, col]) => {
      const m = new THREE.MeshPhysicalMaterial({
        color: col,
        bumpMap: powderBump,
        bumpScale: 0.002,
        roughness: 0.48,
      });
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(r, r, depth, 48), m);
      cyl.rotation.x = Math.PI / 2;
      cyl.position.y = 0.04;
      headSculptGroup.add(cyl);
    });
  } else if (topperVariant === 'spidey-mask') {
    // 3D Marvel Spider-Man Mask Matte Silicone Topper
    const spideyMat = new THREE.MeshPhysicalMaterial({
      color: 0xe11d48,
      bumpMap: powderBump,
      bumpScale: 0.0025,
      roughness: 0.5,
    });
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.16, 36, 36), spideyMat);
    headMesh.scale.set(0.95, 1.12, 0.88);
    headMesh.position.y = 0.04;
    headSculptGroup.add(headMesh);

    const eyeWhiteMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.35 });
    [-0.065, 0.065].forEach((ex) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.055, 24, 24), eyeWhiteMat);
      eye.scale.set(0.85, 1.2, 0.5);
      eye.position.set(ex, 0.05, 0.125);
      eye.rotation.z = ex < 0 ? 0.3 : -0.3;
      headSculptGroup.add(eye);
    });
  } else if (topperVariant === 'cat-paw') {
    // 3D Matte Silicone Tiny Cat Paw Topper
    const whitePawMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      bumpMap: powderBump,
      bumpScale: 0.002,
      roughness: 0.5,
    });
    const pinkBeanMat = new THREE.MeshPhysicalMaterial({
      color: 0xf472b6,
      roughness: 0.48,
    });
    const mainPalm = new THREE.Mesh(new THREE.SphereGeometry(0.15, 32, 32), whitePawMat);
    mainPalm.scale.set(1.1, 0.95, 0.72);
    mainPalm.position.y = 0.02;
    headSculptGroup.add(mainPalm);

    const centerBean = new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 24), pinkBeanMat);
    centerBean.scale.set(1.15, 0.85, 0.6);
    centerBean.position.set(0, 0.0, 0.085);
    headSculptGroup.add(centerBean);

    [
      [-0.11, 0.11],
      [-0.04, 0.15],
      [0.04, 0.15],
      [0.11, 0.11],
    ].forEach(([tx, ty]) => {
      const toe = new THREE.Mesh(new THREE.SphereGeometry(0.06, 20, 20), whitePawMat);
      toe.position.set(tx, ty, 0);
      headSculptGroup.add(toe);

      const bean = new THREE.Mesh(new THREE.SphereGeometry(0.032, 16, 16), pinkBeanMat);
      bean.position.set(tx, ty, 0.05);
      headSculptGroup.add(bean);
    });
  } else if (topperVariant === 'strawberry') {
    const berryMat = new THREE.MeshPhysicalMaterial({
      color: 0xf43f5e,
      bumpMap: powderBump,
      bumpScale: 0.0025,
      roughness: 0.52,
      sheen: 0.25,
    });
    const berryBody = new THREE.Mesh(new THREE.SphereGeometry(0.155, 36, 36), berryMat);
    berryBody.scale.set(1, 1.22, 0.95);
    headSculptGroup.add(berryBody);

    const calyxMat = new THREE.MeshPhysicalMaterial({
      color: 0x34d399,
      roughness: 0.5,
    });
    for (let i = 0; i < 5; i++) {
      const ang = (i / 5) * Math.PI * 2;
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), calyxMat);
      leaf.scale.set(1.3, 0.35, 0.8);
      leaf.position.set(Math.cos(ang) * 0.07, 0.17, Math.sin(ang) * 0.07);
      leaf.rotation.y = -ang;
      headSculptGroup.add(leaf);
    }

    const seedMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      const seed = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 8), seedMat);
      seed.position.set(Math.cos(ang) * 0.135, i % 2 === 0 ? 0.02 : -0.05, Math.sin(ang) * 0.13);
      headSculptGroup.add(seed);
    }
  } else if (topperVariant === 'cloud') {
    const cloudSiliconeMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      bumpMap: powderBump,
      bumpScale: 0.002,
      roughness: 0.52,
      sheen: 0.25,
    });
    const puffs: [number, number, number, number][] = [
      [0, 0.04, 0, 0.13],
      [-0.12, 0.0, 0, 0.10],
      [0.12, 0.0, 0, 0.10],
      [-0.06, 0.09, 0, 0.105],
      [0.07, 0.08, 0, 0.10],
    ];
    puffs.forEach(([px, py, pz, pr]) => {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(pr, 28, 28), cloudSiliconeMat);
      puff.scale.set(1, 1, 0.78);
      puff.position.set(px, py, pz);
      headSculptGroup.add(puff);
    });
  } else {
    const flowerPetalMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      bumpMap: powderBump,
      bumpScale: 0.002,
      roughness: 0.5,
      sheen: 0.2,
    });
    const flowerCenterMat = new THREE.MeshPhysicalMaterial({
      color: 0xfacc15,
      roughness: 0.48,
    });
    const centerDome = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), flowerCenterMat);
    centerDome.position.z = 0.04;
    headSculptGroup.add(centerDome);

    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.085, 24, 24), flowerPetalMat);
      petal.scale.set(1, 1.25, 0.65);
      petal.position.set(Math.cos(ang) * 0.13, Math.sin(ang) * 0.13, 0);
      petal.rotation.z = ang - Math.PI / 2;
      headSculptGroup.add(petal);
    }
  }

  topperGroup.add(headSculptGroup);
  topperGroup.position.copy(strawTopPos);
  topperGroup.rotation.z = strawShaftAngleZ;
  topperGroup.visible = false;
  targetGroup.add(topperGroup);

  // 4. PROTECTIVE SILICONE BOOTS / BASES (3 Variations: `waffle-pink` | `clear-rubber` | `glitter-boot`)
  const bootGroup = new THREE.Group();
  let bootMat: THREE.MeshPhysicalMaterial;

  if (bootVariant === 'clear-rubber') {
    bootMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      roughness: 0.15,
      metalness: 0.0,
      transmission: 0.78,
      thickness: 0.24,
      transparent: true,
      opacity: 0.88,
      ior: 1.46,
      clearcoat: 0.9,
    });
  } else if (bootVariant === 'glitter-boot') {
    const glitterTex = getGlitterSiliconeTexture();
    bootMat = new THREE.MeshPhysicalMaterial({
      map: glitterTex,
      bumpMap: powderBump,
      bumpScale: 0.002,
      roughness: 0.32,
      metalness: 0.18,
      clearcoat: 0.75,
      iridescence: 0.65,
    });
  } else {
    // Waffle-patterned silicone bottom boot in pastel pink
    const waffleTex = getWaffleSiliconeTexture();
    bootMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xf472b6),
      bumpMap: waffleTex,
      bumpScale: 0.012,
      roughness: 0.55,
      metalness: 0.0,
      sheen: 0.25,
      sheenRoughness: 0.65,
      sheenColor: new THREE.Color(0xffffff),
    });
  }

  const rBootTop = bodyWallSpec.getRadiusAtY(baseBottomY + 0.28);
  const rBootBot = bodyWallSpec.getRadiusAtY(baseBottomY - 0.28);

  const bootSleeveGeo = new THREE.CylinderGeometry(
    rBootTop + 0.026,
    rBootBot + 0.026,
    0.56,
    SEGMENTS
  );
  const bootSleeve = new THREE.Mesh(bootSleeveGeo, bootMat);
  bootSleeve.position.y = baseBottomY;
  bootGroup.add(bootSleeve);

  const bootLip = new THREE.Mesh(
    new THREE.TorusGeometry(rBootTop + 0.024, 0.02, 24, SEGMENTS),
    bootMat
  );
  bootLip.rotation.x = Math.PI / 2;
  bootLip.position.y = baseBottomY + 0.28;
  bootGroup.add(bootLip);

  const bootBottomFoot = new THREE.Mesh(
    new THREE.TorusGeometry(rBootBot + 0.015, 0.025, 24, SEGMENTS),
    bootMat
  );
  bootBottomFoot.rotation.x = Math.PI / 2;
  bootBottomFoot.position.y = baseBottomY - 0.27;
  bootGroup.add(bootBottomFoot);

  bootGroup.visible = false;
  targetGroup.add(bootGroup);

  return {
    bodyMesh: mainBodyMesh,
    capMeshes,
    stickerAttachmentGroup,
    bodyWallSpec,
    accessories: {
      keychain: charmGroup,
      strap: strapGroup,
      topper: topperGroup,
      boot: bootGroup,
    },
  };
}
