  "use client";

  import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
  import Link from "next/link";
  import * as THREE from "three";
  import { Canvas, useFrame, useThree } from "@react-three/fiber";
  import { gsap, ScrollTrigger } from "@/utils/gsap";

  // =============================================================================
  // PORTAL OVERVIEW & SOCIAL PLATFORM LINKS
  // =============================================================================
  export const PORTAL_OVERVIEW_TEXT =
    'GTF Technologies incepts from "Gurukul The Foundation" is a performance-driven digital media planning company located in India\'s heart in New Delhi. With over 17+ years of expertise and more than 100+ satisfied clients across the world, we are experts in digital media marketing and boast of our value-added services that enable a business to interact effectively with the customer, leading to profitable ventures.';

  export const PORTAL_SOCIAL_LINKS = [
    { name: "Instagram", href: "https://www.instagram.com/gtftechnologies/" },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/gtf-technologies/" },
    { name: "Email", href: "mailto:hello@gtftechnologies.com" },
  ];

  // =============================================================================
  // CAMERA FOCAL ANGLE & ASYMMETRIC Z-DEPTH CONFIGURATION
  // =============================================================================
  export interface FocalCameraConfig {
    focusX: number;        // Camera angle X where focus peaks (Left-Center red arrow spot)
    focusZ: number;        // How high the specific camera angle rises in +Z
    focusWidth: number;    // Width spread of the camera focal spotlight
    curveness: number;     // Concave curvature intensity at the focal spot
    curveRadius: number;   // Physical radius of the bow curve
    rightZDrop: number;    // Slope: right side is lower and lower Z index (unfocused into background)
    leftZDrop: number;     // Left exit depth slope
    bottomShiftZ: number;  // Bottom of right-side cards shifts backward (-Z) into depth when scrolling
    topShiftZ: number;     // Top of left-side cards shifts backward (-Z) into depth when scrolling
    torchIntensity: number; // Torch focus spotlight brightness on active camera angle
    torchSheen: number;    // Studio torch sheen / glow beam on active card
    beamX: number;         // Focus beam horizontal position (little left side, e.g. 0.19)
    bottomSheen: number;   // Bottom beam glow ratio (e.g. 0.85)
    dimIntensity: number;   // Base light for carousel cards (full light: 1.0)
    cardWidth: number;     // Widescreen card width (large horizontal)
    cardHeight: number;    // Moderate card height (not big vertical)
    spacing: number;       // Horizontal spacing along X
    damp: number;          // Scroll damping
  }

  export const DEFAULT_FOCAL_CONFIG: FocalCameraConfig = {
    focusX: -1.15,         // Camera angle marked by red arrow in Image 1
    focusZ: 0.55,          // Only that specific camera angle peaks high
    focusWidth: 1.85,      // Focused camera spotlight width
    curveness: 1.25,       // Concave curve at the focal spot
    curveRadius: 3.5,      // Curvature radius
    rightZDrop: 0.16,      // Right side continuously drops to lower Z index
    leftZDrop: 0.22,       // Left exit drop
    bottomShiftZ: 0.65,    // More 3D backward depth (-Z) on right-side carousel cards
    topShiftZ: 0.65,       // Top shifts backward (-Z) on left-side carousel cards
    torchIntensity: 1.0,   // Full 100% natural photo contrast at camera focus
    torchSheen: 0.95,      // Studio top torch sheen / glow beam on active card
    beamX: 0.38,           // Focus beam on little left side as marked
    bottomSheen: 0.85,     // Bottom beam glow as well
    dimIntensity: 1.0,     // ALL cards at full light (clean, crisp, no dimming)
    cardWidth: 2,       // Dialed-in widescreen card width
    cardHeight: 1.25,      // Dialed-in card height
    spacing: 2.10,         // Dialed-in spacing between cards
    damp: 6.0,             // Fast, fluid, and responsive scroll damping
  };

  // =============================================================================
  // CARD DATA (6 Cards cycling the 2 actual service images with rich portal narrative)
  // =============================================================================
  export const CARD_DATA = [
    {
      title: "Brand Strategy Development",
      number: "01",
      tag: "FOUNDATION",
      subtitle: "Strategic Brand Architecture & Market Positioning",
      description:
        "We architect transformative enterprise brand foundations. Defining distinct market positioning, resonant narrative frameworks, and enduring value propositions that drive long-term equity and commercial acceleration.",
      highlights: "COMPETITOR MAPPING · NARRATIVE ARCHITECTURE · GO-TO-MARKET",
      image: "/images/service/brand_strategy.webp",
      bg: ["#1C1B1A", "#2A2724"], // Deep graphite fallback
      textColor: "#FFFFFF",
      subColor: "rgba(255, 255, 255, 0.75)",
      accentColor: "#EAB308",
    },
    {
      title: "Brand Identity & Visual Language",
      number: "02",
      tag: "VISUAL SYSTEM",
      subtitle: "Iconic Aesthetics & Cohesive Design Systems",
      description:
        "Crafting expressive visual identities with distinctive typography, generative color systems, and modern aesthetic direction that command authority across digital and physical touchpoints.",
      highlights: "DYNAMIC LOGOMARKS · DESIGN TOKENS · 3D BRAND ASSETS",
      image: "/images/service/tone_voice.webp",
      bg: ["#23282E", "#161A1D"], // Slate navy fallback
      textColor: "#FFFFFF",
      subColor: "rgba(255, 255, 255, 0.75)",
      accentColor: "#38BDF8",
    },
    {
      title: "Messaging & Tone of Voice",
      number: "03",
      tag: "COMMUNICATION",
      subtitle: "Verbal Identity & Editorial Personality",
      description:
        "Developing distinctive verbal personality frameworks that resonate across customer journeys. From headline messaging matrix to cross-channel brand vernacular, we align every word with strategic intent.",
      highlights: "VERBAL GUIDELINES · COPY MATRIX · GLOBAL ADAPTATION",
      image: "/images/service/brand_strategy.webp",
      bg: ["#2B241E", "#1D1814"], // Warm espresso fallback
      textColor: "#FFFFFF",
      subColor: "rgba(255, 255, 255, 0.75)",
      accentColor: "#FB923C",
    },
    {
      title: "Brand Storytelling Framework",
      number: "04",
      tag: "NARRATIVE",
      subtitle: "Immersive Brand Narratives & Cultural Lore",
      description:
        "Transforming corporate messaging into emotional, cinematic brand narratives. We craft human-centric story arcs that foster deep cultural affinity and community loyalty across global markets.",
      highlights: "CONTENT PILLARS · CINEMATIC DIRECTION · CAMPAIGN NARRATIVES",
      image: "/images/service/tone_voice.webp",
      bg: ["#1E2621", "#141A16"], // Forest emerald fallback
      textColor: "#FFFFFF",
      subColor: "rgba(255, 255, 255, 0.75)",
      accentColor: "#34D399",
    },
    {
      title: "Communication Strategy Across Platforms",
      number: "05",
      tag: "OMNICHANNEL",
      subtitle: "Synchronized Multi-Touchpoint Rollout",
      description:
        "Orchestrating cohesive omnichannel communications. Ensuring brand coherence across digital platforms, high-impact experiential installations, performance campaigns, and PR activations.",
      highlights: "JOURNEY ORCHESTRATION · CAMPAIGN ROLLOUT · PERFORMANCE COHESION",
      image: "/images/service/brand_strategy.webp",
      bg: ["#28212B", "#1C161E"], // Royal plum fallback
      textColor: "#FFFFFF",
      subColor: "rgba(255, 255, 255, 0.75)",
      accentColor: "#C084FC",
    },
    {
      title: "Brand Guidelines Documentation",
      number: "06",
      tag: "STANDARDS",
      subtitle: "Living Design Systems & Governance",
      description:
        "Codifying comprehensive living brand guidelines. Providing global teams, agency partners, and product squads with the rules, assets, and design systems necessary to scale fearlessly.",
      highlights: "LIVING GUIDELINES · ASSET VAULT · BRAND GOVERNANCE",
      image: "/images/service/tone_voice.webp",
      bg: ["#212124", "#151517"], // Deep onyx fallback
      textColor: "#FFFFFF",
      subColor: "rgba(255, 255, 255, 0.75)",
      accentColor: "#F43F5E",
    },
  ];

  // =============================================================================
  // HIGH-RES 2D CANVAS TEXTURE GENERATOR (1400 x 700 Widescreen)
  // Raw clean photographic image (no overlay), Voyage font title, no top-left content
  // =============================================================================
  function createCardTexture(
    card: (typeof CARD_DATA)[0],
    index: number,
    preloadedImg?: HTMLImageElement
  ): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 1400;
    canvas.height = 700;
    const ctx = canvas.getContext("2d");

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.LinearSRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    let cachedImg: HTMLImageElement | undefined = preloadedImg;

    function render(loadedImg?: HTMLImageElement) {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (loadedImg && loadedImg.complete && loadedImg.naturalWidth > 0) {
        cachedImg = loadedImg;

        // 1. Draw raw clean photograph with object-fit: cover (NO dark overlay)
        const imgRatio = loadedImg.naturalWidth / loadedImg.naturalHeight;
        const canvasRatio = canvas.width / canvas.height;
        let renderW = canvas.width;
        let renderH = canvas.height;
        let offsetX = 0;
        let offsetY = 0;

        if (imgRatio > canvasRatio) {
          renderW = canvas.height * imgRatio;
          offsetX = -(renderW - canvas.width) * 0.5;
        } else {
          renderH = canvas.width / imgRatio;
          offsetY = -(renderH - canvas.height) * 0.5;
        }

        ctx.drawImage(loadedImg, offsetX, offsetY, renderW, renderH);
      } else {
        // Fallback gradient background while image is loading
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, card.bg[0]);
        grad.addColorStop(1, card.bg[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 2. Title at bottom-left in VOYAGE font (No top-left content, No image overlay)
      ctx.font = "normal 62px 'Voyage', Georgia, serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 3;

      const words = card.title.split(" ");
      if (words.length > 3) {
        const mid = Math.ceil(words.length / 2);
        const line1 = words.slice(0, mid).join(" ");
        const line2 = words.slice(mid).join(" ");
        ctx.fillText(line1, 64, canvas.height - 116);
        ctx.fillText(line2, 64, canvas.height - 56);
      } else {
        ctx.fillText(card.title, 64, canvas.height - 68);
      }

      // Reset shadow for circular arrow button
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // 3. Signature circle arrow button at bottom-right (Jesper style)
      const bx = canvas.width - 84;
      const by = canvas.height - 78;
      ctx.beginPath();
      ctx.arc(bx, by, 34, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(18, 18, 18, 0.70)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(bx - 10, by + 10);
      ctx.lineTo(bx + 8, by - 8);
      ctx.moveTo(bx - 1, by - 8);
      ctx.lineTo(bx + 8, by - 8);
      ctx.lineTo(bx + 8, by + 1);
      ctx.stroke();

      texture.needsUpdate = true;
    }

    // Initial render with preloaded photograph if available
    render(preloadedImg);

    // Ensure Voyage font is ready and redraw with Voyage font
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.load("62px 'Voyage'").then(() => {
        render(cachedImg);
      });
      document.fonts.ready.then(() => {
        render(cachedImg);
      });
    }

    // Asynchronously load real service photograph if not preloaded
    if (typeof window !== "undefined" && card.image && (!preloadedImg || !preloadedImg.complete)) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = card.image;
      img.onload = () => {
        render(img);
      };
    }

    return texture;
  }

  // =============================================================================
  // VERTEX SHADER: WORLD-SPACE CAMERA CURVATURE + CONTINUOUS LIQUID RING PORTAL
  // Continuous 3D ribbon: cards on left & right are linked to the center liquid ring.
  // The ring stays open permanently while cards scroll continuously through it!
  // =============================================================================
  const vertexShader = `
    uniform float uCardX;
    uniform float uFocusX;
    uniform float uFocusZ;
    uniform float uFocusWidth;
    uniform float uCurveness;
    uniform float uRadius;
    uniform float uRightZDrop;
    uniform float uLeftZDrop;
    uniform float uBottomShiftZ;
    uniform float uTopShiftZ;
    uniform float uOpen;
    uniform float uTime;
    uniform float uHover;
    uniform vec2 uCardMouse;
    uniform float uAspect;

    varying vec2 vUv;
    varying vec3 vWorldPos;
    varying float vFocal;
    varying float vOpen;
    varying float vRingDist;

    void main() {
      vUv = uv;
      vOpen = uOpen;
      vec3 p = position;

      // 1. Exact horizontal world coordinate of this vertex:
      float worldX = uCardX + p.x;
      float worldY = p.y;
      float dist = worldX - uFocusX;

      // 2. Normal Carousel 3D Focal Curve & Z-Displacement:
      float focal = exp(-0.5 * pow(dist / uFocusWidth, 2.0));
      float zPeak = focal * uFocusZ;

      float curveAngle = clamp(dist / uRadius, -1.57, 1.57);
      float curve = -uRadius * (1.0 - cos(curveAngle)) * focal * uCurveness;

      float zSlope = (dist > 0.0) ? (-dist * uRightZDrop) : (dist * uLeftZDrop);

      // 1. On right side of carousel (dist > 0), bottom of card shifts backward (-Z):
      float hBottom = clamp((0.625 - p.y) / 1.25, 0.0, 1.0);
      float rightShiftFactor = smoothstep(0.0, 1.8, max(0.0, dist));
      float bottomShiftZ = -hBottom * uBottomShiftZ * rightShiftFactor * (1.0 - uOpen);

      // 2. On left side of carousel (dist < 0), top of card shifts backward (-Z):
      float hTop = clamp((p.y + 0.625) / 1.25, 0.0, 1.0);
      float leftShiftFactor = smoothstep(0.0, 1.8, max(0.0, -dist));
      float topShiftZ = -hTop * uTopShiftZ * leftShiftFactor * (1.0 - uOpen);

      float normalZ = p.z + zPeak + curve + zSlope + bottomShiftZ + topShiftZ;

      // 3. World-Space Liquid Ring Portal Opening (Centered at X = 0, Y = 0):
      // All cards passing through the center seamlessly link to the liquid ring!
      vec2 worldXY = vec2(worldX, worldY);
      float r = length(worldXY);
      vec2 dir = (r > 0.0001) ? (worldXY / r) : vec2(0.0, 1.0);

      float innerR = 0.80;
      float outerR = 1.02;
      float ringZ = 0.0;

      if (r < outerR) {
        // Map [0, outerR] to [innerR, outerR] in world space:
        float rTarget = innerR + r * ((outerR - innerR) / outerR);

        // Fluid wave ripples along the liquid ring border:
        float theta = atan(worldXY.y, worldXY.x);
        float wave = (sin(theta * 6.0 + uTime * 2.6) * 0.014 + cos(theta * 10.0 - uTime * 3.4) * 0.009);
        float waveFade = 1.0 - smoothstep(innerR, outerR, rTarget);
        rTarget += wave * waveFade * uOpen;

        vec2 displacedWorldXY = dir * rTarget;
        vec2 delta = (displacedWorldXY - worldXY) * uOpen;
        p.x += delta.x;
        p.y += delta.y;

        // 3D Torus surface curvature (rounded liquid bulge towards camera):
        float midR = (innerR + outerR) * 0.5;
        float halfThick = (outerR - innerR) * 0.5;
        float normThick = clamp((rTarget - midR) / halfThick, -1.0, 1.0);
        ringZ = sqrt(max(0.0, 1.0 - normThick * normThick)) * 0.14 * uOpen;
      }

      // 4. Symmetrical Liquid Slopes (Left and Right Bridges):
      // The left and right cards connect to the center ring with a sleek, reduced slope thickness:
      float symDist = abs(worldX) - abs(uFocusX);
      float symFocal = exp(-0.5 * pow(symDist / (uFocusWidth * 0.82), 2.0));
      float symPeak = symFocal * (uFocusZ * 0.62);
      float symCurve = -uRadius * (1.0 - cos(clamp(symDist / uRadius, -1.57, 1.57))) * symFocal * (uCurveness * 0.65);
      float symSlope = -abs(symDist) * uLeftZDrop * 0.4;
      float portalBaseZ = symPeak + symCurve + symSlope;

      // Inside the circular portal ring (r <= outerR), keep the ring frontal:
      float ringInfluence = 1.0 - smoothstep(innerR * 0.8, outerR, r);
      float flatPortalZ = 0.12;
      float bridgeZ = mix(portalBaseZ, flatPortalZ, ringInfluence);

      p.z = mix(normalZ, bridgeZ + ringZ, uOpen);

      // 5. Interactive 3D Liquid Surface Ripple on Card Hover (Subtle & Refined):
      if (uHover > 0.005) {
        vec2 diff = (vUv - uCardMouse) * vec2(uAspect, 1.0);
        float d = length(diff);
        float zRipple = sin(d * 16.0 - uTime * 5.0) * exp(-d * 3.2) * 0.018 * uHover;
        p.z += zRipple;
      }

      vec4 worldPos = modelMatrix * vec4(p, 1.0);
      vWorldPos = worldPos.xyz;
      vFocal = mix(focal, symFocal, uOpen);
      vRingDist = r;

      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;

  // =============================================================================
  // FRAGMENT SHADER: CRISP IMAGE + LIQUID CHROMATIC REFRACTION ON RING + HOLLOW CENTER
  // Continuous 1:1 image on flat cards, liquid glass refraction & specular on the ring,
  // and hollow transparent center where typography floats cleanly over the page.
  // =============================================================================
  const fragmentShader = `
    uniform sampler2D uTex;
    uniform float uTorchIntensity;
    uniform float uTorchSheen;
    uniform float uBeamX;
    uniform float uBottomSheen;
    uniform float uDimIntensity;
    uniform vec2 uMouse;
    uniform float uOpen;
    uniform float uTime;
    uniform float uHover;
    uniform vec2 uCardMouse;
    uniform float uAspect;

    varying vec2 vUv;
    varying vec3 vWorldPos;
    varying float vFocal;
    varying float vOpen;
    varying float vRingDist;

    float roundedBoxSDF(vec2 p, vec2 b, float r) {
      vec2 d = abs(p) - b + vec2(r);
      return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
    }

    void main() {
      // 1. Aspect-ratio normalized rounded corners (for card edges):
      vec2 aspect = vec2(uAspect, 1.0);
      vec2 p = (vUv - 0.5) * aspect;
      vec2 halfSize = vec2(0.5 * uAspect, 0.5);
      float radius = 0.065;
      float dist = roundedBoxSDF(p, halfSize, radius);
      float cardCornerAlpha = 1.0 - smoothstep(-0.005, 0.003, dist);

      // 2. Texture sampling with Liquid Fluid Refraction & Chromatic Dispersion around the ring:
      vec2 sampleUv = vUv;
      float worldR = length(vWorldPos.xy);
      float innerR = 0.83;
      float outerR = 1.07;

      // Check if pixel is within the liquid ring zone:
      float onRing = smoothstep(outerR + 0.03, outerR, worldR) * smoothstep(innerR - 0.03, innerR, worldR) * uOpen;

      if (onRing > 0.01) {
        float theta = atan(vWorldPos.y, vWorldPos.x);
        float fluidWarp = sin(theta * 8.0 + uTime * 3.0) * 0.015 * onRing;
        sampleUv += vec2(fluidWarp, fluidWarp * 0.6);
      }

      // 2b. Interactive Liquid Image Move on Card Hover:
      // When hovering over a card image, fluid ripples and waves move under the cursor:
      if (uHover > 0.005) {
        vec2 diff = (vUv - uCardMouse) * aspect;
        float d = length(diff);

        // Fluid ripple radiating outward from the cursor across the hovered card (subtle & elegant):
        float rippleWave = sin(d * 18.0 - uTime * 5.5) * exp(-d * 3.2);
        vec2 rippleDir = (d > 0.001) ? (diff / d) : vec2(0.0, 1.0);
        vec2 rippleDisplace = rippleDir * rippleWave * 0.015;

        // Ambient swimming fluid waves across the hovered card image:
        float wave1 = sin(vUv.y * 6.0 + uTime * 2.6 + vUv.x * 3.0) * 0.004;
        float wave2 = cos(vUv.x * 6.0 - uTime * 2.2 + vUv.y * 3.0) * 0.004;
        vec2 ambientLiquid = vec2(wave1, wave2);

        // Mask out the hover effect on the hollow liquid ring so ring animation remains 100% pure:
        vec2 hoverDisplacement = (rippleDisplace + ambientLiquid) * uHover * (1.0 - onRing);
        sampleUv += hoverDisplacement;
      }

      // Pure actual card image (100% photographic pixels, no artificial RGB split or tints):
      vec3 texColor = texture2D(uTex, sampleUv).rgb;

      // 3. Studio Light Beams on normal carousel cards (fade out on liquid ring):
      float activeMask = smoothstep(0.04, 0.85, vFocal);
      float beamCenter = uBeamX + uMouse.x * 0.04;
      float narrowSheenX = exp(-pow((vUv.x - beamCenter) / 0.08, 2.0));
      float topSheen = pow(vUv.y, 2.4);
      float bottomSheen = pow(1.0 - vUv.y, 2.4) * uBottomSheen;
      float torchSheen = narrowSheenX * (topSheen + bottomSheen) * (uTorchSheen * 0.50) * activeMask * (1.0 - onRing);

      // 4. Lighting & Contrast:
      // In portal mode, preserve 100% clean photographic image brilliance without any white rounded layer:
      float lightLevel = mix(uDimIntensity, uTorchIntensity, max(activeMask, uOpen));
      vec3 baseColor = texColor * lightLevel;
      vec3 torchSpecular = vec3(0.96, 0.98, 1.0) * torchSheen;
      vec3 finalRgb = baseColor + torchSpecular * (1.0 - baseColor * 0.35);

      // 6. Hollow Center Mask inside innerR:
      // When portal is open, ensure center circle is 100% clean and transparent for the typography:
      float innerHoleAlpha = smoothstep(innerR - 0.02, innerR + 0.02, worldR);
      float finalAlpha = cardCornerAlpha * mix(1.0, innerHoleAlpha, uOpen);

      gl_FragColor = vec4(finalRgb, finalAlpha);
    }
  `;

  // =============================================================================
  // ROLLER CARD COMPONENT (Flows Through World-Space Focus & Center Liquid Ring)
  // Cards move continuously on track: mesh position is always 'x' (no snapping).
  // =============================================================================
  interface RollerCardProps {
    index: number;
    texture: THREE.CanvasTexture;
    scrollRef: React.MutableRefObject<number>;
    config: FocalCameraConfig;
    portalOpenRef: React.MutableRefObject<number>;
    onClick: (index: number) => void;
  }

  function RollerCard({
    index,
    texture,
    scrollRef,
    config,
    portalOpenRef,
    onClick,
  }: RollerCardProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const isHoveredRef = useRef(false);
    const hoverValRef = useRef(0);
    const mouseUvRef = useRef(new THREE.Vector2(0.5, 0.5));
    const targetMouseUvRef = useRef(new THREE.Vector2(0.5, 0.5));
    const prevScrollRef = useRef(scrollRef.current);
    const scrollIntensityRef = useRef(0);

    const uniforms = useMemo(
      () => ({
        uTex: { value: texture },
        uCardX: { value: 0 },
        uOpen: { value: 0 },
        uTime: { value: 0 },
        uHover: { value: 0 },
        uBottomShiftZ: { value: config.bottomShiftZ },
        uTopShiftZ: { value: config.topShiftZ },
        uCardMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uFocusX: { value: config.focusX },
        uFocusZ: { value: config.focusZ },
        uFocusWidth: { value: config.focusWidth },
        uCurveness: { value: config.curveness },
        uRadius: { value: config.curveRadius },
        uRightZDrop: { value: config.rightZDrop },
        uLeftZDrop: { value: config.leftZDrop },
        uTorchIntensity: { value: config.torchIntensity },
        uTorchSheen: { value: config.torchSheen },
        uBeamX: { value: config.beamX },
        uBottomSheen: { value: config.bottomSheen },
        uDimIntensity: { value: config.dimIntensity },
        uAspect: { value: config.cardWidth / config.cardHeight },
      }),
      [texture, config]
    );

    useFrame((state, delta) => {
      if (!meshRef.current || !materialRef.current) return;

      const n = CARD_DATA.length; // 6 cards
      const totalTrackWidth = n * config.spacing;

      // Linear horizontal X coordinate
      const baseX = index * config.spacing;
      const relX = baseX - scrollRef.current * config.spacing;

      // Symmetric modulo wrap: [-totalTrackWidth/2, +totalTrackWidth/2]
      let x = ((relX % totalTrackWidth) + totalTrackWidth) % totalTrackWidth;
      if (x > totalTrackWidth / 2) x -= totalTrackWidth;

      const openVal = portalOpenRef.current;
      const timeVal = state.clock.getElapsedTime();

      // Smoothly damp hover state and pointer UV coordinates on this card:
      const targetHover = isHoveredRef.current ? 1.0 : 0.0;
      hoverValRef.current = THREE.MathUtils.damp(hoverValRef.current, targetHover, 7.5, delta);
      mouseUvRef.current.lerp(targetMouseUvRef.current, 0.14);

      // Track scroll velocity / active scrolling motion:
      const scrollDelta = Math.abs(scrollRef.current - prevScrollRef.current);
      prevScrollRef.current = scrollRef.current;
      const scrollSpeed = scrollDelta / Math.max(delta, 0.001);

      // Fast scroll activation curve:
      // Depth stays flat & subtle on normal slow scroll (scrollSpeed < 0.70),
      // and dynamically ramps up on fast scroll (scrollSpeed > 0.70 to 3.0):
      const fastScrollActive = THREE.MathUtils.smoothstep(scrollSpeed, 0.70, 3.0);
      scrollIntensityRef.current = THREE.MathUtils.damp(
        scrollIntensityRef.current,
        fastScrollActive,
        fastScrollActive > 0.05 ? 7.0 : 4.5,
        delta
      );

      // Bottom backward shift on right cards, Top backward shift on left cards (active during scroll):
      const dynamicBottomShift = config.bottomShiftZ * scrollIntensityRef.current;
      const dynamicTopShift = config.topShiftZ * scrollIntensityRef.current;

      // Camera focus holds firmly on the focused card, and only fades smoothly when the card moves full out:
      const cardDistToFocus = Math.abs(x - config.focusX);
      const holdRadius = config.cardWidth * 0.45;  // ~0.90 units: holds camera focus firmly while card is centered
      const fullOutRadius = config.spacing * 1.05; // ~2.20 units: only reaches zero once the card has gone full out
      const cardFocusRatio = 1.0 - THREE.MathUtils.smoothstep(cardDistToFocus, holdRadius, fullOutRadius);
      const cardTorchSheen = config.torchSheen * cardFocusRatio;

      // Cards continuously flow along their track:
      meshRef.current.position.set(x, 0, 0);
      meshRef.current.rotation.set(0, 0, 0);
      meshRef.current.renderOrder = Math.round(100 - Math.abs(x) * 10);

      // Pass live parameters to vertex & fragment shader:
      const mat = materialRef.current;
      mat.uniforms.uCardX.value = x;
      mat.uniforms.uOpen.value = openVal;
      mat.uniforms.uTime.value = timeVal;
      mat.uniforms.uHover.value = hoverValRef.current;
      mat.uniforms.uBottomShiftZ.value = dynamicBottomShift;
      mat.uniforms.uTopShiftZ.value = dynamicTopShift;
      mat.uniforms.uCardMouse.value.copy(mouseUvRef.current);
      mat.uniforms.uMouse.value.set(state.pointer.x, state.pointer.y);
      mat.uniforms.uFocusX.value = config.focusX;
      mat.uniforms.uFocusZ.value = config.focusZ;
      mat.uniforms.uFocusWidth.value = config.focusWidth;
      mat.uniforms.uCurveness.value = config.curveness;
      mat.uniforms.uRadius.value = config.curveRadius;
      mat.uniforms.uRightZDrop.value = config.rightZDrop;
      mat.uniforms.uLeftZDrop.value = config.leftZDrop;
      mat.uniforms.uTorchIntensity.value = config.torchIntensity;
      mat.uniforms.uTorchSheen.value = cardTorchSheen;
      mat.uniforms.uBeamX.value = config.beamX;
      mat.uniforms.uBottomSheen.value = config.bottomSheen;
      mat.uniforms.uDimIntensity.value = config.dimIntensity;
      mat.uniforms.uAspect.value = config.cardWidth / config.cardHeight;

      // Always rendered & preloaded around the ribbon track (never culled or late-popped)
      meshRef.current.visible = true;
    });

    return (
      <mesh
        ref={meshRef}
        frustumCulled={false}
        onClick={(e) => {
          e.stopPropagation();
          onClick(index);
        }}
        onPointerOver={(e) => {
          document.body.style.cursor = "pointer";
          isHoveredRef.current = true;
          if (e.uv) targetMouseUvRef.current.copy(e.uv);
        }}
        onPointerMove={(e) => {
          isHoveredRef.current = true;
          if (e.uv) targetMouseUvRef.current.copy(e.uv);
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
          isHoveredRef.current = false;
        }}
      >
        <planeGeometry args={[config.cardWidth, config.cardHeight, 48, 48]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          toneMapped={false}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  }
  // =============================================================================
  // SCENE CONTAINER
  // =============================================================================
  interface RollerSceneProps {
    textures: THREE.CanvasTexture[];
    scrollRef: React.MutableRefObject<number>;
    targetScrollRef: React.MutableRefObject<number>;
    config: FocalCameraConfig;
    portalOpenRef: React.MutableRefObject<number>;
    onCardClick: (index: number) => void;
  }

  function RollerScene({
    textures,
    scrollRef,
    targetScrollRef,
    config,
    portalOpenRef,
    onCardClick,
  }: RollerSceneProps) {
    const { gl } = useThree();

    // Pre-warm all textures in WebGL GPU memory immediately on mount so no card loads late
    useEffect(() => {
      textures.forEach((t) => {
        try {
          gl.initTexture(t);
        } catch {
          // ignore
        }
      });
    }, [textures, gl]);

    useFrame((_state, delta) => {
      scrollRef.current = THREE.MathUtils.damp(
        scrollRef.current,
        targetScrollRef.current,
        config.damp,
        delta
      );
    });

    return (
      <group position={[0, 0, 0]}>
        {CARD_DATA.map((card, i) => (
          <RollerCard
            key={card.title}
            index={i}
            texture={textures[i]}
            scrollRef={scrollRef}
            config={config}
            portalOpenRef={portalOpenRef}
            onClick={onCardClick}
          />
        ))}
      </group>
    );
  }

  // =============================================================================
  // MAIN COMPONENT WITH TOP-RIGHT CONTROLLER
  // =============================================================================
  export default function CardCarousel() {
    const sectionRef = useRef<HTMLElement>(null);
    const scroll = useRef(0);
    const targetScroll = useRef(0);

    const [mounted, setMounted] = useState(false);
    const [textures, setTextures] = useState<THREE.CanvasTexture[]>([]);

    // Live Control Tuning State
    const [config, setConfig] = useState<FocalCameraConfig>(DEFAULT_FOCAL_CONFIG);
    const [isControlOpen, setIsControlOpen] = useState(false); // Collapsed by default for a clean look
    const [copied, setCopied] = useState(false);

    // =========================================================================
    // PART 2: LIQUID CIRCLE PORTAL MORPH STATE (Jesper Landberg Animation)
    // =========================================================================
    const [isPortalOpen, setIsPortalOpen] = useState(false);
    const [portalProgress, setPortalProgress] = useState(0);
    const portalOpenRef = useRef(0);
    const [activeCardIndex, setActiveCardIndex] = useState(0);

    // Drag interaction refs
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollAtStart = useRef(0);
    const snapTimer = useRef<NodeJS.Timeout | null>(null);

    // Calculate which card is currently closest to the active spot (focusX or center 0.0)
    const getActiveIndex = useCallback(() => {
      const n = CARD_DATA.length;
      const totalTrackWidth = n * config.spacing;
      const currentScrollX = scroll.current * config.spacing;
      const targetFocus = isPortalOpen ? 0.0 : config.focusX;
      let closestIdx = 0;
      let minDiff = Infinity;
      for (let i = 0; i < n; i++) {
        const baseX = i * config.spacing;
        const relX = baseX - currentScrollX;
        let x = ((relX % totalTrackWidth) + totalTrackWidth) % totalTrackWidth;
        if (x > totalTrackWidth / 2) x -= totalTrackWidth;
        const diff = Math.abs(x - targetFocus);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      }
      return closestIdx;
    }, [config.spacing, config.focusX, isPortalOpen]);

    // Open Part 2 Liquid Portal (Smooth expansion from center outward)
    const openPortal = useCallback(() => {
      const currentActive = getActiveIndex();
      setActiveCardIndex(currentActive);

      // Snap scroll to align the active card with X = 0 (center liquid ring)
      const n = CARD_DATA.length;
      const totalTrackWidth = n * config.spacing;
      const targetBase = currentActive * config.spacing;
      const rel = targetBase - targetScroll.current * config.spacing;
      let diff = ((rel % totalTrackWidth) + totalTrackWidth) % totalTrackWidth;
      if (diff > totalTrackWidth / 2) diff -= totalTrackWidth;
      targetScroll.current = targetScroll.current + diff / config.spacing;

      setIsPortalOpen(true);
      gsap.killTweensOf(portalOpenRef);
      gsap.to(portalOpenRef, {
        current: 1.0,
        duration: 1.15,
        ease: "power3.out",
        onUpdate: () => setPortalProgress(portalOpenRef.current),
      });

      // Stagger entrance of tag & social media links in tandem with paragraph reveal
      gsap.fromTo(
        ".portal-tag",
        { y: -10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.25,
          ease: "power2.out",
        }
      );
      gsap.fromTo(
        ".portal-social-item",
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          delay: 0.65,
          ease: "power3.out",
        }
      );
    }, [getActiveIndex, config.spacing]);

    // Close Part 2 Liquid Portal (Reverse back to normal card)
    const closePortal = useCallback(() => {
      gsap.to(".portal-social-item", {
        y: 12,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      });
      gsap.to(".portal-tag", {
        y: -10,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      });
      gsap.to(portalOpenRef, {
        current: 0.0,
        duration: 0.95,
        ease: "power3.inOut",
        onUpdate: () => setPortalProgress(portalOpenRef.current),
        onComplete: () => setIsPortalOpen(false),
      });
    }, []);

    const togglePortal = useCallback(() => {
      if (isPortalOpen) {
        closePortal();
      } else {
        openPortal();
      }
    }, [isPortalOpen, openPortal, closePortal]);

    // Keyboard Escape listener to close portal
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isPortalOpen) {
          closePortal();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isPortalOpen, closePortal]);

    // Preload all unique images first so all cards enter the viewport fully loaded
    useEffect(() => {
      let isCancelled = false;

      const uniqueUrls = Array.from(
        new Set(CARD_DATA.map((c) => c.image).filter(Boolean) as string[])
      );
      const imageMap: Record<string, HTMLImageElement> = {};
      let loadedCount = 0;
      const totalImages = uniqueUrls.length;

      function finishTextureMount() {
        if (isCancelled) return;
        const texs = CARD_DATA.map((card, i) =>
          createCardTexture(card, i, card.image ? imageMap[card.image] : undefined)
        );
        setTextures(texs);
        setMounted(true);
      }

      if (typeof window !== "undefined" && totalImages > 0) {
        uniqueUrls.forEach((url) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = url;
          const onDone = () => {
            imageMap[url] = img;
            loadedCount++;
            if (loadedCount >= totalImages) {
              finishTextureMount();
            }
          };
          if (img.complete && img.naturalWidth > 0) {
            onDone();
          } else {
            img.onload = onDone;
            img.onerror = onDone;
          }
        });
      } else {
        finishTextureMount();
      }

      return () => {
        isCancelled = true;
      };
    }, []);

    // Pinned Section via ScrollTrigger
    useEffect(() => {
      if (!mounted || typeof window === "undefined") return;
      gsap.registerPlugin(ScrollTrigger);

      const sectionEl = sectionRef.current;
      if (!sectionEl) return;

      const st = ScrollTrigger.create({
        trigger: sectionEl,
        start: "top top",
        end: "+=560%",
        pin: true,
        pinSpacing: true,
        pinType: "fixed",
        scrub: 0.8,
        anticipatePin: 0,
        fastScrollEnd: true,
        preventOverlaps: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (!isDragging.current && !isPortalOpen) {
            targetScroll.current = self.progress * CARD_DATA.length * 2.4;
          }
        },
      });

      ScrollTrigger.refresh();

      return () => {
        st.kill();
      };
    }, [mounted, isPortalOpen]);

    // Wheel listener (smoothly scrolls carousel continuously through the liquid ring)
    const handleWheel = (e: React.WheelEvent) => {
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      targetScroll.current += delta * 0.0028;

      const currentActive = getActiveIndex();
      setActiveCardIndex(currentActive);

      if (snapTimer.current) clearTimeout(snapTimer.current);
      snapTimer.current = setTimeout(() => {
        targetScroll.current = Math.round(targetScroll.current);
        const snappedActive = getActiveIndex();
        setActiveCardIndex(snappedActive);
      }, 70);
    };

    // Drag listeners (smoothly scrolls carousel continuously through the liquid ring)
    const handlePointerDown = (e: React.PointerEvent) => {
      isDragging.current = true;
      startX.current = e.clientX;
      scrollAtStart.current = targetScroll.current;
      if (snapTimer.current) clearTimeout(snapTimer.current);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const deltaX = (e.clientX - startX.current) * 0.0032;
      targetScroll.current = scrollAtStart.current - deltaX;
      const currentActive = getActiveIndex();
      setActiveCardIndex(currentActive);
    };

    const handlePointerUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      targetScroll.current = Math.round(targetScroll.current);
      const snappedActive = getActiveIndex();
      setActiveCardIndex(snappedActive);
    };

    // Click card: if active card, open portal! If inactive card, scroll to focus
    const handleCardClick = (index: number) => {
      if (isPortalOpen) {
        closePortal();
        return;
      }
      const currentActive = getActiveIndex();
      if (index === currentActive) {
        openPortal();
      } else {
        const n = CARD_DATA.length;
        const totalTrackWidth = n * config.spacing;
        const targetBase = index * config.spacing;
        const rel = targetBase - (targetScroll.current * config.spacing + config.focusX);
        let diff = ((rel % totalTrackWidth) + totalTrackWidth) % totalTrackWidth;
        if (diff > totalTrackWidth / 2) diff -= totalTrackWidth;
        targetScroll.current = targetScroll.current + diff / config.spacing;
      }
    };

    const handleCopyValues = () => {
      const codeSnippet = JSON.stringify(config, null, 2);
      navigator.clipboard.writeText(codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const currentActiveCard = CARD_DATA[activeCardIndex] || CARD_DATA[0];

    return (
      <section
        ref={sectionRef}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative w-full h-screen min-h-screen overflow-hidden select-none flex items-center justify-center cursor-grab active:cursor-grabbing bg-transparent will-change-transform"
        style={{
          touchAction: "none",
          contain: "paint",
        }}
      >
        <div className="relative w-full h-full">
          {mounted && textures.length > 0 && (
            <Canvas
              flat
              camera={{ position: [0, 0, 3.5], fov: 44 }}
              gl={{ alpha: true, antialias: true }}
              className="w-full h-full bg-transparent"
            >
              <RollerScene
                textures={textures}
                scrollRef={scroll}
                targetScrollRef={targetScroll}
                config={config}
                portalOpenRef={portalOpenRef}
                onCardClick={handleCardClick}
              />
            </Canvas>
          )}

          {/* =================================================================== */}
          {/* LIQUID CIRCLE PORTAL: GTF OVERVIEW & SOCIAL PLATFORMS CONTENT       */}
          {/* Floats cleanly & legibly inside the hollow liquid ring               */}
          {/* =================================================================== */}
          <div
            className="absolute inset-0 flex items-center justify-center z-30 transition-all duration-500 select-text pointer-events-none"
            style={{
              opacity: portalProgress > 0.12 ? (portalProgress - 0.12) / 0.88 : 0,
            }}
          >
            <div
              className={`portal-content w-full max-w-[270px] sm:max-w-[310px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[380px] 2xl:max-w-[450px] text-center px-3 sm:px-4 py-2 flex flex-col items-center justify-center ${
                isPortalOpen && portalProgress > 0.3 ? "pointer-events-auto" : "pointer-events-none"
              }`}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {/* Subtle Tag */}
              <span className="portal-tag hidden text-[8.5px] sm:text-[9.5px] md:text-[10px] lg:text-[10.5px] font-mono tracking-[0.22em] text-[#171717]/60 uppercase mb-1.5 sm:mb-2">
                GTF TECHNOLOGIES — OVERVIEW
              </span>

              {/* Overview narrative text without line animation */}
              <p className="font-segoe font-normal text-[#171717]/85 text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[12px] 2xl:text-[16px] leading-[1.58] sm:leading-[1.6] md:leading-[1.62] lg:leading-[1.65] text-center max-w-full">
                {PORTAL_OVERVIEW_TEXT}
              </p>

              {/* Social Media Platform Links (Instagram · LinkedIn · Email) */}
              <div className="flex items-center justify-center gap-4 sm:gap-5 md:gap-6 mt-3 sm:mt-3.5 pt-2.5 sm:pt-3 border-t border-black/[0.08] w-full max-w-[210px] sm:max-w-[250px] md:max-w-[280px]">
                {PORTAL_SOCIAL_LINKS.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="portal-social-item text-[9px] sm:text-[10px] md:text-[10.5px] lg:text-[11px] font-mono tracking-[0.16em] uppercase text-[#171717]/70 hover:text-[#171717] transition-all duration-300 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-[#171717] after:transition-all after:duration-300 cursor-pointer"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* TOP-RIGHT PROFILE ACTION: PURE TEXT & ICON FORM (NO BUTTON CONTAINER) */}
        {/* Aligned with Header's right container padding & sits below header     */}
        {/* ===================================================================== */}
        <div
          className="absolute top-20 sm:top-24 lg:top-28 right-6 sm:right-10 lg:right-12 z-30 flex items-center pointer-events-auto"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={togglePortal}
            className="flex items-center gap-2 group cursor-pointer text-[#171717] hover:text-black py-1 px-1 transition-all duration-300"
            aria-label={isPortalOpen ? "Close Profile" : "Open Profile"}
          >
            <span className="font-montserrat font-normal text-[11px] sm:text-xs leading-none tracking-[1.54px] uppercase text-[#000000] pr-5 group-hover:text-[#171717] transition-colors inline-block">
              <span className="relative inline-block after:content-[''] after:absolute after:bottom-[-3px] after:left-0 after:w-0 group-hover:after:w-full after:h-[1px] after:bg-[#171717] after:transition-all after:duration-300">
                {isPortalOpen ? "CLOSE" : "PROFILE"}
              </span>
            </span>

            {/* Icon */}
            <div className="w-3.5 hidden h-3.5 flex items-center justify-center relative">
              <span
                className={`absolute inset-0 flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  isPortalOpen ? "rotate-90 scale-100 opacity-100 text-[#171717]" : "rotate-0 scale-0 opacity-0"
                }`}
              >
                ✕
              </span>
              <span
                className={`absolute hidden inset-0 flex items-center justify-center transition-all duration-300 ${
                  isPortalOpen ? "scale-0 opacity-0" : "scale-100 opacity-100 text-[#171717]/80 group-hover:text-[#171717]"
                }`}
              >
                <svg
                  className="w-3.5 h-3.5 fill-none stroke-current"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
            </div>
          </button>
        </div>

        {/* ===================================================================== */}
        {/* DEVELOPER TUNING CONTROLLER (Positioned at bottom-right, off the header)*/}
        {/* ===================================================================== */}
        <div
          className="fixed hidden bottom-6 right-6 z-40 flex flex-col items-end pointer-events-auto"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {!isControlOpen ? (
            <button
              onClick={() => setIsControlOpen(true)}
              className="px-4 py-2 rounded-full bg-[#121212]/90 text-white text-[11px] font-semibold tracking-wider uppercase shadow-2xl hover:bg-black transition-all flex items-center gap-2 cursor-pointer border border-white/20 backdrop-blur-md"
            >
              <span>⚙️</span> Tune Camera Focus & Z-Depth
            </button>
          ) : (
            <div className="w-[330px] max-h-[80vh] overflow-y-auto bg-black/92 backdrop-blur-md text-white rounded-2xl p-5 shadow-2xl border border-white/15 text-xs select-text">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <span className="font-semibold tracking-wide uppercase text-[11px] text-amber-400">
                  ⚙️ Camera Angle & Z-Depth Tuner
                </span>
                <button
                  onClick={() => setIsControlOpen(false)}
                  className="text-white/60 hover:text-white cursor-pointer px-1 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3.5">
                {/* 1. Camera Angle X (Red Arrow Spot) */}
                <div>
                  <div className="flex justify-between text-[11px] text-white/70 mb-1">
                    <span>Camera Focus Angle X</span>
                    <span className="font-mono text-amber-300">{config.focusX.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-2.5"
                    max="0.5"
                    step="0.05"
                    value={config.focusX}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, focusX: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* 2. Specific Focus Z Height */}
                <div>
                  <div className="flex justify-between text-[11px] text-white/70 mb-1">
                    <span>Specific Spot +Z Height (High)</span>
                    <span className="font-mono text-amber-300">{config.focusZ.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="1.2"
                    step="0.02"
                    value={config.focusZ}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, focusZ: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* 3. Focal Spotlight Width */}
                <div>
                  <div className="flex justify-between text-[11px] text-white/70 mb-1">
                    <span>Camera Focus Spot Width</span>
                    <span className="font-mono text-amber-300">{config.focusWidth.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="3.0"
                    step="0.05"
                    value={config.focusWidth}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, focusWidth: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* 4. Shader Curvature at Focus Spot */}
                <div>
                  <div className="flex justify-between text-[11px] text-white/70 mb-1">
                    <span>Focal Spot Curveness (uBend)</span>
                    <span className="font-mono text-amber-300">{config.curveness.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="2.5"
                    step="0.05"
                    value={config.curveness}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, curveness: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* 5. Curve Radius */}
                <div>
                  <div className="flex justify-between text-[11px] text-white/70 mb-1">
                    <span>Curve Radius (Bow Size)</span>
                    <span className="font-mono text-amber-300">{config.curveRadius.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="2.0"
                    max="8.0"
                    step="0.1"
                    value={config.curveRadius}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, curveRadius: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* 6. Right Side Lower Z-Index Drop */}
                <div>
                  <div className="flex justify-between text-[11px] text-white/70 mb-1">
                    <span>Right Side -Z Drop (Unfocused Lower)</span>
                    <span className="font-mono text-amber-300">{config.rightZDrop.toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="0.35"
                    step="0.01"
                    value={config.rightZDrop}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, rightZDrop: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* 6a. Right Side Bottom Shift Backward (-Z) */}
                <div>
                  <div className="flex justify-between text-[11px] text-white/70 mb-1">
                    <span className="text-amber-200">📐 Right Cards Bottom Shift Backward (-Z)</span>
                    <span className="font-mono text-amber-300">{config.bottomShiftZ.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.00"
                    max="1.50"
                    step="0.02"
                    value={config.bottomShiftZ}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, bottomShiftZ: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-white/40 mt-0.5">
                    <span>0.00 Flat</span>
                    <span>0.65 (Right Bottom -Z)</span>
                    <span>1.50 Deep Shift</span>
                  </div>
                </div>

                {/* 6a-2. Left Side Top Shift Backward (-Z) */}
                <div>
                  <div className="flex justify-between text-[11px] text-white/70 mb-1">
                    <span className="text-amber-200">📐 Left Cards Top Shift Backward (-Z)</span>
                    <span className="font-mono text-amber-300">{config.topShiftZ.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.00"
                    max="1.50"
                    step="0.02"
                    value={config.topShiftZ}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, topShiftZ: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-white/40 mt-0.5">
                    <span>0.00 Flat</span>
                    <span>0.65 (Left Top -Z)</span>
                    <span>1.50 Deep Shift</span>
                  </div>
                </div>

                {/* 6a-3. Snappy Positioning Damping */}
                <div>
                  <div className="flex justify-between text-[11px] text-white/70 mb-1">
                    <span className="text-amber-200">⚡ Position Snapping Speed (Damp)</span>
                    <span className="font-mono text-amber-300">{config.damp.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="4.0"
                    max="22.0"
                    step="0.5"
                    value={config.damp}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, damp: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-white/40 mt-0.5">
                    <span>4.0 Float</span>
                    <span>6.0 (Responsive & Fast)</span>
                    <span>22.0 Ultra-Fast</span>
                  </div>
                </div>

                {/* 6b. Torch Light (Active Camera Angle Focus) */}
                <div>
                  <div className="flex justify-between text-[11px] text-white/70 mb-1">
                    <span className="text-amber-200">🔦 Torch Focus Light (Spotlight)</span>
                    <span className="font-mono text-amber-300">{config.torchIntensity.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.70"
                    max="2.00"
                    step="0.05"
                    value={config.torchIntensity}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, torchIntensity: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* 6c. Torch Top & Bottom Glare (Jesper Studio Light Beam) */}
                <div>
                  <div className="flex justify-between text-[11px] text-white/70 mb-1">
                    <span className="text-amber-300 font-medium">✨ Focus Beam Glow (Intensity)</span>
                    <span className="font-mono text-amber-300">{config.torchSheen.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.00"
                    max="1.80"
                    step="0.05"
                    value={config.torchSheen}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, torchSheen: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* 6c-2. Beam Position X (Little Left Side) */}
                <div>
                  <div className="flex justify-between text-[11px] text-white/70 mb-1">
                    <span className="text-amber-200 font-medium">🎯 Beam Position X (Little Left)</span>
                    <span className="font-mono text-amber-300">{config.beamX.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.45"
                    step="0.01"
                    value={config.beamX}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, beamX: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* 6c-3. Bottom Beam Glow Ratio */}
                <div>
                  <div className="flex justify-between text-[11px] text-white/70 mb-1">
                    <span className="text-amber-200 font-medium">💫 Bottom Beam Glow Ratio</span>
                    <span className="font-mono text-amber-300">{config.bottomSheen.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.00"
                    max="1.50"
                    step="0.05"
                    value={config.bottomSheen}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, bottomSheen: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* 6d. Cards Base Light (Full Light on all cards) */}
                <div>
                  <div className="flex justify-between text-[11px] text-white/70 mb-1">
                    <span className="text-white/80">💡 Cards Base Light (Full Light: 1.0)</span>
                    <span className="font-mono text-amber-300">{config.dimIntensity.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.40"
                    max="1.50"
                    step="0.05"
                    value={config.dimIntensity}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, dimIntensity: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* 7. Card Width (Widescreen) */}
                <div>
                  <div className="flex justify-between text-[11px] text-white/70 mb-1">
                    <span>Card Width (Horizontal)</span>
                    <span className="font-mono text-amber-300">{config.cardWidth.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="2.2"
                    max="3.6"
                    step="0.05"
                    value={config.cardWidth}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, cardWidth: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* 8. Card Height (Not Big) */}
                <div>
                  <div className="flex justify-between text-[11px] text-white/70 mb-1">
                    <span>Card Height (Vertical)</span>
                    <span className="font-mono text-amber-300">{config.cardHeight.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="1.8"
                    step="0.05"
                    value={config.cardHeight}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, cardHeight: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* 9. Card Spacing */}
                <div>
                  <div className="flex justify-between text-[11px] text-white/70 mb-1">
                    <span>Card Spacing (Gap)</span>
                    <span className="font-mono text-amber-300">{config.spacing.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="2.5"
                    max="3.8"
                    step="0.05"
                    value={config.spacing}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, spacing: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => setConfig(DEFAULT_FOCAL_CONFIG)}
                  className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-[10px] uppercase tracking-wider cursor-pointer"
                >
                  Reset
                </button>
                <button
                  onClick={handleCopyValues}
                  className="px-3.5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-semibold text-[10px] uppercase tracking-wider cursor-pointer"
                >
                  {copied ? "Copied! ✓" : "Copy Values"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }