"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";

interface NodeInfo {
  title: string;
  desc: string;
  status: string;
}

interface EcoNode {
  id: string;
  label: string;
  category: string;
  x: number;
  y: number;
  z: number;
  size: number;
  active: boolean;
  layer: number;
  parent?: string;
  info: NodeInfo;
}

const MAIN_NODE_IDS = [
  "barumahid",
  "constech",
  "rto",
  "ekosistemdp",
  "kemitraan",
];

const nodes: EcoNode[] = [
  {
    id: "barumahid",
    label: "barumahID",
    category: "center",
    x: 0, y: 0, z: 0,
    size: 28,
    active: true,
    layer: 0,
    info: {
      title: "barumahID",
      desc: "Platform Pendamping Kepemilikan Rumah — membantu penyewa menjadi pemilik hunian melalui ekosistem terintegrasi.",
      status: "Aktif",
    },
  },
  {
    id: "constech",
    label: "ConsTech LBAG",
    category: "constech",
    x: -180, y: 60, z: 80,
    size: 14,
    active: true,
    layer: 1,
    parent: "barumahid",
    info: {
      title: "ConsTech LBAG",
      desc: "Layanan konstruksi profesional: jasa gambar arsitektur, analisa struktur, dan manajemen renovasi & bangun.",
      status: "Aktif — Revenue Utama",
    },
  },
  {
    id: "rto",
    label: "Rent-to-Own",
    category: "rto",
    x: 180, y: 60, z: 80,
    size: 14,
    active: true,
    layer: 1,
    parent: "barumahid",
    info: {
      title: "Program Rent-to-Own",
      desc: "25% dari sewa bulanan otomatis masuk ke saldo DP rumah. Tersedia 3 jalur: Option Credit, Option Build, Option Buy.",
      status: "Pre-Launch",
    },
  },
  {
    id: "ekosistemdp",
    label: "Ekosistem DP",
    category: "ekosistemdp",
    x: 0, y: -60, z: -180,
    size: 14,
    active: true,
    layer: 1,
    parent: "barumahid",
    info: {
      title: "DP Acceleration Engine",
      desc: "5 channel untuk mempercepat akumulasi DP. Channel 1 (Sewa Core) sudah aktif. Channel 2–5 Post-MVP.",
      status: "MVP Aktif sebagian",
    },
  },
  {
    id: "kemitraan",
    label: "Kemitraan",
    category: "kemitraan",
    x: 0, y: 120, z: -160,
    size: 14,
    active: true,
    layer: 1,
    parent: "barumahid",
    info: {
      title: "mitrabarumahID",
      desc: "3 jalur kemitraan: Construction (subkontraktor & supplier), Projectlink (developer properti), Knowledges (institusi edukasi).",
      status: "Aktif",
    },
  },
  {
    id: "gambar",
    label: "Jasa Gambar",
    category: "constech",
    x: -280, y: 120, z: 20,
    size: 7,
    active: true,
    layer: 2,
    parent: "constech",
    info: {
      title: "Jasa Gambar & Modelling",
      desc: "Basic Rp 15.000/m² · Plus Rp 20.000/m² · Pro Rp 30.000/m². Via @jururancang_mahaksa.",
      status: "Aktif",
    },
  },
  {
    id: "struktur",
    label: "Analisa Struktur",
    category: "constech",
    x: -240, y: 20, z: 160,
    size: 7,
    active: true,
    layer: 2,
    parent: "constech",
    info: {
      title: "Jasa Desain & Analisa Struktur",
      desc: "Basic Rp 18.000/item · Plus Rp 25.000/item · Pro Rp 35.000/item. Berbasis SNI + ETABS/SAP2000.",
      status: "Aktif",
    },
  },
  {
    id: "renovasi",
    label: "Renovasi & Bangun",
    category: "constech",
    x: -160, y: -20, z: 200,
    size: 7,
    active: true,
    layer: 2,
    parent: "constech",
    info: {
      title: "Jasa Renovasi & Konstruksi",
      desc: "Pendampingan & manajemen konstruksi. AHSP-based, RAB transparan, konsultasi pertama GRATIS.",
      status: "Aktif",
    },
  },
  {
    id: "credit",
    label: "Option Credit",
    category: "rto",
    x: 260, y: 140, z: 20,
    size: 7,
    active: true,
    layer: 2,
    parent: "rto",
    info: {
      title: "Option Credit",
      desc: "Sewa → Escrow 25% → KPR via Developer Mitra. Jalur paling umum untuk yang gaji tetap.",
      status: "Pre-Launch",
    },
  },
  {
    id: "build",
    label: "Option Build",
    category: "rto",
    x: 240, y: 20, z: 160,
    size: 7,
    active: true,
    layer: 2,
    parent: "rto",
    info: {
      title: "Option Build",
      desc: "Sewa → Akumulasi Modal → Bangun di tanah sendiri. Cocok untuk yang sudah punya kavling.",
      status: "Pre-Launch",
    },
  },
  {
    id: "buy",
    label: "Option Buy",
    category: "rto",
    x: 160, y: -20, z: 200,
    size: 7,
    active: true,
    layer: 2,
    parent: "rto",
    info: {
      title: "Option Buy",
      desc: "Sewa → Lease-option → Buyback. PENDING legal review KUH Perdata 1548/1457.",
      status: "Pending Legal Review",
    },
  },
  {
    id: "sewacore",
    label: "Sewa Core",
    category: "ekosistemdp",
    x: -80, y: -140, z: -260,
    size: 7,
    active: true,
    layer: 2,
    parent: "ekosistemdp",
    info: {
      title: "Channel 1 — Sewa Core",
      desc: "25% dari sewa langsung masuk Wallet 1 (Escrow). Backbone utama DP. Bank Jago/bluBCA.",
      status: "Aktif (MVP)",
    },
  },
  {
    id: "kosanesia",
    label: "Kosanesia Laundry",
    category: "ekosistemdp",
    x: 80, y: -160, z: -240,
    size: 7,
    active: false,
    layer: 2,
    parent: "ekosistemdp",
    info: {
      title: "Channel 2 — Kosanesia Laundry",
      desc: "Cuci baju di mitra laundry → cashback 10% masuk Wallet 2 (Poin). Markup 20% dari harga pasar.",
      status: "Post-MVP",
    },
  },
  {
    id: "titip",
    label: "Jasa Titip",
    category: "ekosistemdp",
    x: 0, y: -200, z: -200,
    size: 7,
    active: false,
    layer: 2,
    parent: "ekosistemdp",
    info: {
      title: "Channel 3 — Jasa Titip Barang",
      desc: "Titip barang → cashback 10% ke Wallet 2. Markup 20%, barumahID operate langsung.",
      status: "Post-MVP",
    },
  },
  {
    id: "pindahan",
    label: "Jasa Pindahan",
    category: "ekosistemdp",
    x: -120, y: -200, z: -160,
    size: 7,
    active: false,
    layer: 2,
    parent: "ekosistemdp",
    info: {
      title: "Channel 4 — Jasa Pindahan",
      desc: "Pindahan → cashback 10% ke Wallet 2. High-intent moment: customer pindah = target RTO ideal.",
      status: "Post-MVP",
    },
  },
  {
    id: "greenpoint",
    label: "GreenPoint",
    category: "ekosistemdp",
    x: 100, y: -120, z: -280,
    size: 7,
    active: false,
    layer: 2,
    parent: "ekosistemdp",
    info: {
      title: "Channel 5 — GreenPoint",
      desc: "Pilah sampah → 80% nilai masuk Wallet 2. Potensi carbon credit jangka panjang.",
      status: "Post-MVP",
    },
  },
  {
    id: "construction",
    label: "Construction",
    category: "kemitraan",
    x: -100, y: 200, z: -200,
    size: 7,
    active: true,
    layer: 2,
    parent: "kemitraan",
    info: {
      title: "mitrabarumahID Construction",
      desc: "Subkontraktor, supplier material, dan konsultan teknis. Akses ke proyek barumahID dan jaringan kerja profesional.",
      status: "Aktif",
    },
  },
  {
    id: "projectlink",
    label: "Projectlink",
    category: "kemitraan",
    x: 100, y: 220, z: -180,
    size: 7,
    active: true,
    layer: 2,
    parent: "kemitraan",
    info: {
      title: "mitrabarumahID Projectlink",
      desc: "Developer perumahan mitra. Pipeline customer yang sudah nabung DP, tracking progress real-time, price lock mechanism.",
      status: "Aktif",
    },
  },
  {
    id: "knowledges",
    label: "Knowledges",
    category: "kemitraan",
    x: 0, y: 240, z: -220,
    size: 7,
    active: true,
    layer: 2,
    parent: "kemitraan",
    info: {
      title: "mitrabarumahID Knowledges",
      desc: "Ekosistem edukasi dan pengembangan SDM konstruksi. Untuk institusi pendidikan, trainer, dan konsultan.",
      status: "Aktif",
    },
  },
];

const edges: [string, string][] = [
  ["barumahid", "constech"],
  ["barumahid", "rto"],
  ["barumahid", "ekosistemdp"],
  ["barumahid", "kemitraan"],
  ["constech", "gambar"],
  ["constech", "struktur"],
  ["constech", "renovasi"],
  ["rto", "credit"],
  ["rto", "build"],
  ["rto", "buy"],
  ["ekosistemdp", "sewacore"],
  ["ekosistemdp", "kosanesia"],
  ["ekosistemdp", "titip"],
  ["ekosistemdp", "pindahan"],
  ["ekosistemdp", "greenpoint"],
  ["kemitraan", "construction"],
  ["kemitraan", "projectlink"],
  ["kemitraan", "knowledges"],
];

const categoryColors: Record<string, string> = {
  center: "#C53B3B",
  constech: "#1D4ED8",
  rto: "#15803D",
  ekosistemdp: "#B45309",
  kemitraan: "#6D28D9",
};

const categoryPanelLabels: Record<string, string> = {
  center: "PLATFORM",
  constech: "CONSTECH LBAG",
  rto: "RENT-TO-OWN",
  ekosistemdp: "EKOSISTEM DP",
  kemitraan: "KEMITRAAN",
};

const legendItems = [
  { color: "#C53B3B", label: "barumahID (Pusat)" },
  { color: "#1D4ED8", label: "ConsTech LBAG" },
  { color: "#15803D", label: "Rent-to-Own" },
  { color: "#B45309", label: "Ekosistem DP" },
  { color: "#6D28D9", label: "Kemitraan" },
];

const DEFAULT_CAM = new THREE.Vector3(0, 50, 500);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

interface ExpandState {
  nodeId: string;
  progress: number;
  sphereMesh: THREE.Mesh;
  iconSprite: THREE.Sprite | null;
  bgSprite: THREE.Sprite | null;
  targetScale: number;
}

function createIconTexture(
  imageUrl: string,
): Promise<THREE.CanvasTexture> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d")!;
      ctx.beginPath();
      ctx.arc(256, 256, 240, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      const maxSize = 320;
      const imgRatio = img.width / img.height;
      let drawW: number, drawH: number;
      if (imgRatio > 1) {
        drawW = maxSize;
        drawH = maxSize / imgRatio;
      } else {
        drawH = maxSize;
        drawW = maxSize * imgRatio;
      }
      const drawX = (512 - drawW) / 2;
      const drawY = (512 - drawH) / 2;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      resolve(texture);
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}

function createCircleTexture(color: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.beginPath();
  ctx.arc(128, 128, 128, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  return new THREE.CanvasTexture(canvas);
}

export default function EkosistemGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<EcoNode | null>(null);
  const selectedNodeRef = useRef<EcoNode | null>(null);

  const handleSelectNode = useCallback((node: EcoNode | null) => {
    selectedNodeRef.current = node;
    setSelectedNode(node);
  }, []);

  const targetCameraPos = useRef(DEFAULT_CAM.clone());
  const targetLookAt = useRef(DEFAULT_TARGET.clone());
  const isAnimatingCamera = useRef(false);
  const showInfoDelay = useRef<ReturnType<typeof setTimeout> | null>(null);

  const decorativeMeshes = useRef<
    Array<{
      mesh: THREE.Mesh;
      originalPos: THREE.Vector3;
      driftSpeed: number;
      driftOffset: number;
      driftRadius: number;
    }>
  >([]);

  const expandStates = useRef<Map<string, ExpandState>>(new Map());
  const activeExpandId = useRef<string | null>(null);
  const iconTextures = useRef<Map<string, THREE.CanvasTexture>>(new Map());

  const sceneRef = useRef<{
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    labelRenderer: CSS2DRenderer;
    controls: OrbitControls;
    camera: THREE.PerspectiveCamera;
    animId: number;
    nodeMeshes: THREE.Mesh[];
    centerMesh: THREE.Mesh | null;
    hoverRing: THREE.Mesh | null;
    pulseDots: Array<{
      mesh: THREE.Mesh;
      from: THREE.Vector3;
      to: THREE.Vector3;
      speed: number;
      offset: number;
    }>;
  } | null>(null);

  const closePanel = useCallback(() => {
    if (activeExpandId.current && sceneRef.current) {
      const state = expandStates.current.get(activeExpandId.current);
      if (state) {
        state.sphereMesh.scale.setScalar(1);
        const mat = state.sphereMesh.material as THREE.MeshPhongMaterial;
        mat.opacity = 1;
        mat.transparent = false;
        if (state.iconSprite) sceneRef.current.scene.remove(state.iconSprite);
        if (state.bgSprite) sceneRef.current.scene.remove(state.bgSprite);
      }
      expandStates.current.clear();
      activeExpandId.current = null;
    }
    handleSelectNode(null);
    if (sceneRef.current) {
      sceneRef.current.nodeMeshes.forEach((m) => m.scale.setScalar(1));
      setTimeout(() => {
        if (sceneRef.current) sceneRef.current.controls.autoRotate = true;
      }, 500);
    }
  }, [handleSelectNode]);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      const sr = sceneRef.current;
      if (!sr || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, sr.camera);
      const intersects = raycaster.intersectObjects(sr.nodeMeshes);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const nodeId = clickedMesh.userData.id as string;
        const node = nodes.find((n) => n.id === nodeId);
        if (!node) return;

        const isMainNode = MAIN_NODE_IDS.includes(nodeId);

        if (activeExpandId.current && activeExpandId.current !== nodeId) {
          const prevState = expandStates.current.get(activeExpandId.current);
          if (prevState) {
            prevState.sphereMesh.scale.setScalar(1);
            const pm = prevState.sphereMesh
              .material as THREE.MeshPhongMaterial;
            pm.opacity = 1;
            pm.transparent = false;
            if (prevState.iconSprite)
              sr.scene.remove(prevState.iconSprite);
            if (prevState.bgSprite) sr.scene.remove(prevState.bgSprite);
          }
          expandStates.current.delete(activeExpandId.current);
          activeExpandId.current = null;
        }

        sr.nodeMeshes.forEach((m) => m.scale.setScalar(1));

        if (isMainNode && iconTextures.current.has(nodeId)) {
          activeExpandId.current = nodeId;

          const bgTexture = createCircleTexture(
            categoryColors[node.category],
          );
          const bgSprite = new THREE.Sprite(
            new THREE.SpriteMaterial({
              map: bgTexture,
              transparent: true,
              opacity: 0,
              depthWrite: false,
              depthTest: false,
            }),
          );
          bgSprite.renderOrder = 998;
          bgSprite.position.set(node.x, node.y, node.z);
          bgSprite.scale.set(0, 0, 1);
          bgSprite.userData.isDecorative = true;
          sr.scene.add(bgSprite);

          const iconSprite = new THREE.Sprite(
            new THREE.SpriteMaterial({
              map: iconTextures.current.get(nodeId)!,
              transparent: true,
              opacity: 0,
              depthWrite: false,
              depthTest: false,
            }),
          );
          iconSprite.renderOrder = 999;
          iconSprite.position.set(node.x, node.y, node.z);
          iconSprite.scale.set(1, 1, 1);
          iconSprite.userData.isDecorative = true;
          sr.scene.add(iconSprite);

          expandStates.current.set(nodeId, {
            nodeId,
            progress: 0,
            sphereMesh: clickedMesh,
            iconSprite,
            bgSprite,
            targetScale: node.size * 2.2,
          });

          const mat = clickedMesh.material as THREE.MeshPhongMaterial;
          mat.transparent = true;
        } else {
          clickedMesh.scale.setScalar(1.5);
        }

        const nodePos = new THREE.Vector3(node.x, node.y, node.z);
        targetCameraPos.current.copy(nodePos).add(new THREE.Vector3(0, 30, 120));
        targetLookAt.current.copy(nodePos);
        isAnimatingCamera.current = true;
        sr.controls.autoRotate = false;

        if (showInfoDelay.current) clearTimeout(showInfoDelay.current);
        showInfoDelay.current = setTimeout(() => {
          handleSelectNode(node);
        }, 300);
      } else {
        expandStates.current.forEach((state) => {
          state.sphereMesh.scale.setScalar(1);
          const em = state.sphereMesh.material as THREE.MeshPhongMaterial;
          em.opacity = 1;
          em.transparent = false;
          if (state.iconSprite) sr.scene.remove(state.iconSprite);
          if (state.bgSprite) sr.scene.remove(state.bgSprite);
        });
        expandStates.current.clear();
        activeExpandId.current = null;

        targetCameraPos.current.copy(DEFAULT_CAM);
        targetLookAt.current.copy(DEFAULT_TARGET);
        isAnimatingCamera.current = true;
        handleSelectNode(null);
        sr.nodeMeshes.forEach((m) => m.scale.setScalar(1));
        setTimeout(() => {
          if (sceneRef.current) sceneRef.current.controls.autoRotate = true;
          isAnimatingCamera.current = false;
        }, 800);
      }
    },
    [handleSelectNode],
  );

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const sr = sceneRef.current;
    if (!sr || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, sr.camera);
    const intersects = raycaster.intersectObjects(sr.nodeMeshes);

    const canvas = sr.renderer.domElement;
    if (intersects.length > 0) {
      canvas.style.cursor = "pointer";
      const hit = intersects[0].object as THREE.Mesh;
      const node = nodes.find((n) => n.id === hit.userData.id);
      if (node && sr.hoverRing) {
        sr.hoverRing.visible = true;
        sr.hoverRing.position.set(node.x, node.y, node.z);
        const ringScale = node.size * 1.6;
        sr.hoverRing.scale.set(ringScale, ringScale, ringScale);
        sr.hoverRing.lookAt(sr.camera.position);
      }
    } else {
      canvas.style.cursor = "default";
      if (sr.hoverRing) sr.hoverRing.visible = false;
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#F8F5F0");
    scene.fog = new THREE.Fog("#F8F5F0", 600, 1200);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1500);
    camera.position.copy(DEFAULT_CAM);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0";
    labelRenderer.domElement.style.left = "0";
    labelRenderer.domElement.style.pointerEvents = "none";
    container.appendChild(labelRenderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 150;
    controls.maxDistance = 900;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controls.addEventListener("start", () => {
      controls.autoRotate = false;
    });
    controls.addEventListener("end", () => {
      setTimeout(() => {
        if (!isAnimatingCamera.current && !selectedNodeRef.current) {
          controls.autoRotate = true;
        }
      }, 3000);
    });

    scene.add(new THREE.AmbientLight("#ffffff", 1.0));
    const dirLight1 = new THREE.DirectionalLight("#ffffff", 0.9);
    dirLight1.position.set(100, 200, 100);
    scene.add(dirLight1);
    const dirLight2 = new THREE.DirectionalLight("#ffffff", 0.3);
    dirLight2.position.set(-100, -100, -100);
    scene.add(dirLight2);

    // DOT GRID FLOOR
    const dotGridGeo = new THREE.BufferGeometry();
    const dotPositions: number[] = [];
    for (let x = -600; x <= 600; x += 40) {
      for (let z = -600; z <= 600; z += 40) {
        dotPositions.push(x, -250, z);
      }
    }
    dotGridGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(dotPositions, 3),
    );
    const dotGridMat = new THREE.PointsMaterial({
      color: "#CCCCCC",
      size: 1.5,
      transparent: true,
      opacity: 0.25,
    });
    scene.add(new THREE.Points(dotGridGeo, dotGridMat));

    // RADIAL GLOW for center node
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = 256;
    glowCanvas.height = 256;
    const glowCtx = glowCanvas.getContext("2d")!;
    const gradient = glowCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, "rgba(197, 59, 59, 0.6)");
    gradient.addColorStop(0.3, "rgba(197, 59, 59, 0.3)");
    gradient.addColorStop(0.7, "rgba(197, 59, 59, 0.1)");
    gradient.addColorStop(1, "rgba(197, 59, 59, 0)");
    glowCtx.fillStyle = gradient;
    glowCtx.fillRect(0, 0, 256, 256);
    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    const glowSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
      }),
    );
    glowSprite.position.set(0, 0, 0);
    glowSprite.scale.set(120, 120, 1);
    scene.add(glowSprite);

    // HOVER RING
    const hoverRingGeo = new THREE.RingGeometry(0.9, 1.0, 48);
    const hoverRingMat = new THREE.MeshBasicMaterial({
      color: "#C53B3B",
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const hoverRing = new THREE.Mesh(hoverRingGeo, hoverRingMat);
    hoverRing.visible = false;
    scene.add(hoverRing);

    // BUILD NODES
    const nodeMeshes: THREE.Mesh[] = [];
    let centerMesh: THREE.Mesh | null = null;

    nodes.forEach((node) => {
      const color = new THREE.Color(
        categoryColors[node.category] || "#C53B3B",
      );
      const geo = new THREE.SphereGeometry(node.size, 32, 32);

      const mat = node.active
        ? new THREE.MeshPhongMaterial({
            color,
            emissive: color,
            emissiveIntensity: node.layer === 0 ? 0.25 : 0.15,
            shininess: 80,
          })
        : new THREE.MeshPhongMaterial({
            color,
            transparent: true,
            opacity: 0.3,
            shininess: 40,
          });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(node.x, node.y, node.z);
      mesh.userData = { id: node.id };
      scene.add(mesh);
      nodeMeshes.push(mesh);

      if (node.id === "barumahid") centerMesh = mesh;

      if (!node.active) {
        const ringGeo = new THREE.RingGeometry(
          node.size + 3,
          node.size + 5,
          32,
        );
        const ringMat = new THREE.MeshBasicMaterial({
          color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.12,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(node.x, node.y, node.z);
        ring.lookAt(camera.position);
        scene.add(ring);
      }

      // LABELS
      const labelDiv = document.createElement("div");
      labelDiv.textContent = node.active
        ? node.label
        : `${node.label} (Soon)`;
      labelDiv.style.fontFamily = "Montserrat, sans-serif";
      labelDiv.style.fontSize = node.layer <= 1 ? "11px" : "10px";
      labelDiv.style.fontWeight = node.layer <= 1 ? "700" : "600";
      labelDiv.style.color = "#1A1A1A";
      labelDiv.style.background = "rgba(255, 255, 255, 0.85)";
      labelDiv.style.padding = "3px 10px";
      labelDiv.style.borderRadius = "20px";
      labelDiv.style.border = "1px solid rgba(0,0,0,0.08)";
      labelDiv.style.pointerEvents = "none";
      labelDiv.style.whiteSpace = "nowrap";
      labelDiv.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
      if (!node.active) {
        labelDiv.style.opacity = "0.4";
        labelDiv.style.color = "#888888";
      }

      const cssObj = new CSS2DObject(labelDiv);
      cssObj.position.set(node.x, node.y + node.size + 10, node.z);
      scene.add(cssObj);
    });

    // EDGES
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    edges.forEach(([srcId, tgtId]) => {
      const src = nodeMap.get(srcId);
      const tgt = nodeMap.get(tgtId);
      if (!src || !tgt) return;

      const bothActive = src.active && tgt.active;
      const points = [
        new THREE.Vector3(src.x, src.y, src.z),
        new THREE.Vector3(tgt.x, tgt.y, tgt.z),
      ];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: bothActive ? "#AAAAAA" : "#CCCCCC",
        transparent: true,
        opacity: bothActive ? 0.5 : 0.25,
      });
      scene.add(new THREE.Line(geo, mat));
    });

    // PULSE DOTS on center→layer1 edges
    const pulseDots: typeof sceneRef.current extends null
      ? never
      : NonNullable<typeof sceneRef.current>["pulseDots"] = [];
    const centerEdges = edges.filter(([s]) => s === "barumahid");
    centerEdges.forEach(([srcId, tgtId], idx) => {
      const src = nodeMap.get(srcId)!;
      const tgt = nodeMap.get(tgtId)!;
      const dotGeo = new THREE.SphereGeometry(4, 8, 8);
      const dotMat = new THREE.MeshBasicMaterial({
        color: categoryColors[tgt.category] || "#C53B3B",
        transparent: true,
        opacity: 0.7,
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.userData.isDecorative = true;
      dot.renderOrder = 1;
      scene.add(dot);
      pulseDots.push({
        mesh: dot,
        from: new THREE.Vector3(src.x, src.y, src.z),
        to: new THREE.Vector3(tgt.x, tgt.y, tgt.z),
        speed: 0.3 + idx * 0.04,
        offset: idx * 1.5,
      });
    });

    // DECORATIVE NODES
    const decorColors = [
      "#C53B3B",
      "#1D4ED8",
      "#15803D",
      "#B45309",
      "#6D28D9",
    ];
    const decorGeo = new THREE.SphereGeometry(1.5, 8, 8);
    decorativeMeshes.current = [];
    for (let i = 0; i < 120; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: decorColors[i % 5],
        transparent: true,
        opacity: Math.random() * 0.15 + 0.05,
      });
      const m = new THREE.Mesh(decorGeo, mat);
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 1200,
        (Math.random() - 0.5) * 800,
        (Math.random() - 0.5) * 1000,
      );
      m.position.copy(pos);
      m.userData.isDecorative = true;
      m.scale.setScalar(Math.random() * 1.5 + 0.5);
      scene.add(m);
      decorativeMeshes.current.push({
        mesh: m,
        originalPos: pos.clone(),
        driftSpeed: Math.random() * 0.3 + 0.1,
        driftOffset: Math.random() * Math.PI * 2,
        driftRadius: Math.random() * 8 + 3,
      });
    }

    for (let i = 0; i < 80; i++) {
      const pts = [
        new THREE.Vector3(
          (Math.random() - 0.5) * 1200,
          (Math.random() - 0.5) * 800,
          (Math.random() - 0.5) * 1000,
        ),
        new THREE.Vector3(
          (Math.random() - 0.5) * 1200,
          (Math.random() - 0.5) * 800,
          (Math.random() - 0.5) * 1000,
        ),
      ];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: "#CCCCCC",
        transparent: true,
        opacity: 0.08,
      });
      const line = new THREE.Line(geo, mat);
      line.userData.isDecorative = true;
      scene.add(line);
    }

    // PRELOAD ICON TEXTURES
    const iconMapAbsolute: Record<string, string> = {
      barumahid: `${window.location.origin}/images/nodes/node-barumahid.png`,
      constech: `${window.location.origin}/images/nodes/node-constech.png`,
      rto: `${window.location.origin}/images/nodes/node-rto.png`,
      ekosistemdp: `${window.location.origin}/images/nodes/node-ekosistemdp.png`,
      kemitraan: `${window.location.origin}/images/nodes/node-kemitraan.png`,
    };
    (async () => {
      for (const [id, url] of Object.entries(iconMapAbsolute)) {
        try {
          const texture = await createIconTexture(url);
          iconTextures.current.set(id, texture);
        } catch (err) {
          console.error(`Failed texture: ${id}`, err);
        }
      }
    })();

    sceneRef.current = {
      scene,
      renderer,
      labelRenderer,
      controls,
      camera,
      animId: 0,
      nodeMeshes,
      centerMesh,
      hoverRing,
      pulseDots,
    };

    const startTime = performance.now();
    const animate = () => {
      const id = requestAnimationFrame(animate);
      if (sceneRef.current) sceneRef.current.animId = id;

      const elapsed = (performance.now() - startTime) * 0.001;

      // Center node pulse
      if (centerMesh) {
        centerMesh.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.04);
      }

      // Center glow breathing
      const glowMat = glowSprite.material as THREE.SpriteMaterial;
      glowMat.opacity = 0.8 + Math.sin(elapsed * 1.2) * 0.15;
      const glowScale = 110 + Math.sin(elapsed * 1.2) * 15;
      glowSprite.scale.set(glowScale, glowScale, 1);

      // Pulse dots along center→layer1 edges
      pulseDots.forEach(({ mesh, from, to, speed, offset }) => {
        const t = ((elapsed * speed + offset) % 3) / 3;
        mesh.position.lerpVectors(from, to, t);
        (mesh.material as THREE.MeshBasicMaterial).opacity =
          t < 0.1 ? t * 7 : t > 0.9 ? (1 - t) * 7 : 0.7;
      });

      // Decorative drift
      decorativeMeshes.current.forEach(
        ({ mesh, originalPos, driftSpeed, driftOffset, driftRadius }) => {
          mesh.position.x =
            originalPos.x +
            Math.sin(elapsed * driftSpeed + driftOffset) * driftRadius;
          mesh.position.y =
            originalPos.y +
            Math.cos(elapsed * driftSpeed * 0.7 + driftOffset) *
              driftRadius *
              0.6;
          mesh.position.z =
            originalPos.z +
            Math.sin(elapsed * driftSpeed * 0.5 + driftOffset + 1) *
              driftRadius *
              0.8;
        },
      );

      // Expand animation
      expandStates.current.forEach((state) => {
        if (state.progress < 1) {
          state.progress = Math.min(state.progress + 0.018, 1);
          const eased = 1 - Math.pow(1 - state.progress, 3);

          const sphereScale = 1 + eased * 0.8;
          state.sphereMesh.scale.setScalar(sphereScale);
          (state.sphereMesh.material as THREE.MeshPhongMaterial).opacity =
            1 - eased * 0.85;

          if (
            state.progress > 0.4 &&
            state.iconSprite &&
            state.bgSprite
          ) {
            const iconProgress = (state.progress - 0.4) / 0.6;
            const iconEased = 1 - Math.pow(1 - iconProgress, 2);
            const iconSize = state.targetScale * iconEased;

            state.iconSprite.scale.set(iconSize, iconSize, 1);
            (state.iconSprite.material as THREE.SpriteMaterial).opacity =
              iconEased * 0.95;

            state.bgSprite.scale.set(
              iconSize * 1.05,
              iconSize * 1.05,
              1,
            );
            (state.bgSprite.material as THREE.SpriteMaterial).opacity =
              iconEased * 0.12;
          }
        }
      });

      // Camera lerp
      if (isAnimatingCamera.current) {
        camera.position.lerp(targetCameraPos.current, 0.06);
        controls.target.lerp(targetLookAt.current, 0.06);
        if (camera.position.distanceTo(targetCameraPos.current) < 1) {
          isAnimatingCamera.current = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);
    container.addEventListener("click", handleClick);
    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("click", handleClick);
      container.removeEventListener("mousemove", handleMouseMove);
      if (showInfoDelay.current) clearTimeout(showInfoDelay.current);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animId);
      }
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement))
        container.removeChild(renderer.domElement);
      if (container.contains(labelRenderer.domElement))
        container.removeChild(labelRenderer.domElement);
    };
  }, [handleClick, handleMouseMove]);

  const connectedNodes = selectedNode
    ? nodes.filter((n) => {
        return edges.some(
          ([a, b]) =>
            (a === selectedNode.id && b === n.id) ||
            (b === selectedNode.id && a === n.id),
        );
      })
    : [];

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="absolute inset-0" />

      {/* Header */}
      <div className="pointer-events-none absolute left-6 top-20 z-50 md:left-8 md:top-24">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#C53B3B]">
          EKOSISTEM BARUMAHID
        </p>
        <h1 className="text-3xl font-black leading-tight text-[#1A1A1A] md:text-4xl">
          Satu ekosistem,
          <br />
          banyak jalur.
        </h1>
        <p className="mt-2 text-sm text-[#888]">
          Drag untuk memutar · Klik node untuk detail
        </p>
      </div>

      {/* Legend */}
      <div className="pointer-events-none absolute bottom-6 left-6 z-50 flex flex-col gap-2 rounded-xl border border-black/[0.08] bg-white/80 p-4 backdrop-blur-sm md:bottom-8 md:left-8">
        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-[#1A1A1A]">
          Legenda
        </p>
        {legendItems.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: color }}
            />
            <span className="text-xs font-medium text-[#666]">{label}</span>
          </div>
        ))}
        <div className="mt-1 flex items-center gap-2 border-t border-black/[0.06] pt-2">
          <div className="h-2.5 w-2.5 shrink-0 rounded-full border border-[#AAAAAA] opacity-40" />
          <span className="text-xs font-medium text-[#AAA]">
            Post-MVP (Soon)
          </span>
        </div>
      </div>

      {/* Info panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            key={selectedNode.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute right-4 top-20 z-50 w-80 overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-xl shadow-black/[0.08] md:right-8 md:top-24"
          >
            {/* Top color bar */}
            <div
              className="h-1.5"
              style={{
                background: categoryColors[selectedNode.category],
              }}
            />
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest"
                  style={{
                    color: categoryColors[selectedNode.category],
                    background:
                      categoryColors[selectedNode.category] + "18",
                  }}
                >
                  {categoryPanelLabels[selectedNode.category]}
                </span>
                <button
                  onClick={closePanel}
                  className="text-xl leading-none text-black/30 transition-colors hover:text-black/70"
                >
                  ×
                </button>
              </div>

              <div className="mb-3 flex items-center gap-3">
                <div
                  className="h-4 w-4 shrink-0 rounded-full"
                  style={{
                    background: categoryColors[selectedNode.category],
                  }}
                />
                <h3 className="text-lg font-black leading-tight text-[#1A1A1A]">
                  {selectedNode.info.title}
                </h3>
              </div>

              <p className="mb-5 text-sm leading-relaxed text-[#666]">
                {selectedNode.info.desc}
              </p>

              {/* Connected nodes badges */}
              {connectedNodes.length > 0 && (
                <div className="mb-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#AAA]">
                    Terhubung ke
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {connectedNodes.map((cn) => (
                      <span
                        key={cn.id}
                        className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
                        style={{
                          color: categoryColors[cn.category],
                          background:
                            categoryColors[cn.category] + "14",
                        }}
                      >
                        {cn.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 border-t border-black/[0.06] pt-4">
                <div
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    background: selectedNode.active
                      ? "#15803D"
                      : "#B45309",
                  }}
                />
                <span
                  className="text-xs font-semibold"
                  style={{
                    color: selectedNode.active ? "#15803D" : "#B45309",
                  }}
                >
                  {selectedNode.info.status}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
