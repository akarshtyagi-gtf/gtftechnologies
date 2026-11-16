"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

export interface ImageParticleCanvasHandle {
  setProgress: (progress: number) => void;
  triggerStepTransition: () => void;
}

interface ImageParticleCanvasProps {
  imageSrc?: string;
  progress?: number; // 0 (particles off-screen on left/right/bottom) to 1 (converged into center photo)
  className?: string;
  targetElementRef?: React.RefObject<HTMLElement | null>;
}

interface Particle {
  outerX: number; // Dispersed X ratio (off-screen left/right/bottom)
  outerY: number; // Dispersed Y ratio (off-screen bottom or full height)
  targetX: number; // Exact photographic pixel target X ratio
  targetY: number; // Exact photographic pixel target Y ratio
  curve: number; // Organic trajectory curve in canvas pixels
  rise: number; // 3D upward surge in canvas pixels
  size: number; // Base pixel size (2.2px)
  depthScale: number; // 3D perspective depth factor
  color: string; // Sampled photographic color or warm bronze/gold/espresso
  alpha: number;
  delay: number; // Light stagger
}

const ImageParticleCanvas = forwardRef<ImageParticleCanvasHandle, ImageParticleCanvasProps>(
  ({ imageSrc = "/images/service/service_1.webp", progress = 0, className = "", targetElementRef }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const progressRef = useRef<number>(progress);
    const particlesRef = useRef<Particle[]>([]);
    const dprRef = useRef<number>(1);
    const imageLoadedRef = useRef<boolean>(false);
    const transitionAnimRef = useRef<number | null>(null);

    // Imperative methods for 120 FPS updates directly from ScrollTrigger (zero React re-renders)
    useImperativeHandle(ref, () => ({
      setProgress: (val: number) => {
        if (!transitionAnimRef.current) {
          progressRef.current = Math.max(0, Math.min(1, val));
          drawFrame();
        }
      },
      // Smooth particle wave transition when stepping to the next service (1 -> 2 -> 3 etc.)
      triggerStepTransition: () => {
        if (transitionAnimRef.current) {
          cancelAnimationFrame(transitionAnimRef.current);
        }
        const startTime = performance.now();
        const duration = 620; // 620ms photographic particle burst & re-crystallization

        const animateTransition = (now: number) => {
          const elapsed = now - startTime;
          const t = Math.min(1, elapsed / duration);

          // Parabolic dip curve: smoothly dips outward to 0.72 and pulls back into photo at 1.0
          const dip = Math.sin(t * Math.PI) * 0.28;
          progressRef.current = 1.0 - dip;
          drawFrame();

          if (t < 1) {
            transitionAnimRef.current = requestAnimationFrame(animateTransition);
          } else {
            progressRef.current = 1.0;
            drawFrame();
            transitionAnimRef.current = null;
          }
        };

        transitionAnimRef.current = requestAnimationFrame(animateTransition);
      },
    }));

    // Calculate center photo bounds inside the section
    const getTargetBounds = (canvas: HTMLCanvasElement) => {
      let imgLeft = 0.05;
      let imgRight = 0.95;
      let imgTop = 0.15;
      let imgBottom = 0.67;

      if (targetElementRef?.current && canvas.parentElement) {
        const pRect = canvas.parentElement.getBoundingClientRect();
        const tRect = targetElementRef.current.getBoundingClientRect();
        if (pRect.width > 0 && pRect.height > 0) {
          imgLeft = Math.max(0.02, (tRect.left - pRect.left) / pRect.width);
          imgRight = Math.min(0.98, (tRect.right - pRect.left) / pRect.width);
          imgTop = Math.max(0.05, (tRect.top - pRect.top) / pRect.height);
          imgBottom = Math.min(0.85, (tRect.bottom - pRect.top) / pRect.height);
        }
      }
      return { imgLeft, imgRight, imgTop, imgBottom };
    };

    // Extract actual photographic pixel data from the chess image
    const sampleActualImagePixels = (img: HTMLImageElement, canvas: HTMLCanvasElement) => {
      try {
        const sampleCanvas = document.createElement("canvas");
        const naturalW = img.naturalWidth || img.width || 1920;
        const naturalH = img.naturalHeight || img.height || 1080;
        const aspect = naturalW / naturalH || 16 / 9;

        // Sample resolution: 240 horizontal x ~135 vertical = ~32,400 pixels
        // High density creates rich, granular image particle noise with 60/120 FPS performance
        const sampleW = 240;
        const sampleH = Math.round(sampleW / aspect);
        sampleCanvas.width = sampleW;
        sampleCanvas.height = sampleH;

        const sCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
        if (!sCtx) return false;

        sCtx.drawImage(img, 0, 0, sampleW, sampleH);
        const imgData = sCtx.getImageData(0, 0, sampleW, sampleH).data;

        const { imgLeft, imgRight, imgTop, imgBottom } = getTargetBounds(canvas);
        const particles: Particle[] = [];
        const totalPixels = sampleW * sampleH;

        for (let idx = 0; idx < totalPixels; idx++) {
          const byteIdx = idx * 4;
          const r = imgData[byteIdx];
          const g = imgData[byteIdx + 1];
          const b = imgData[byteIdx + 2];
          const a = imgData[byteIdx + 3];

          // Skip transparent pixels and outer edge pixel rows so particles don't accumulate into edge lines
          if (a < 20) continue;

          const px = idx % sampleW;
          const py = Math.floor(idx / sampleW);

          if (py < sampleH * 0.02 || py > sampleH * 0.96) continue;

          // EXACT photographic pixel target coordinate inside the center photo
          const targetX = imgLeft + (px / sampleW) * (imgRight - imgLeft);
          const targetY = imgTop + (py / sampleH) * (imgBottom - imgTop);

          // 3-way distribution: particles stream in from right, left, and center/bottom of the screen
          const rand = Math.random();
          let outerX = 0;
          let outerY = 0;
          let rise = 0;
          let depthScale = 0.70 + Math.random() * 0.40;

          if (rand < 0.28) {
            // Left flank: flies in from 3D foreground left
            outerX = -0.05 - Math.random() * 0.35;
            outerY = 0.05 + Math.random() * 0.90;
            rise = 28 + Math.random() * 42;
          } else if (rand < 0.56) {
            // Right flank: flies in from 3D foreground right
            outerX = 1.05 + Math.random() * 0.35;
            outerY = 0.05 + Math.random() * 0.90;
            rise = 28 + Math.random() * 42;
          } else {
            // Center & bottom flank: surges upward from bottom-center in 3D foreground
            outerX = 0.02 + Math.random() * 0.96;
            outerY = 0.68 + Math.random() * 0.32;
            rise = 55 + Math.random() * 75;
            depthScale = 0.90 + Math.random() * 0.50;
          }

          const curve = (Math.random() - 0.5) * 60;
          const size = 1.7 + Math.random() * 0.4;
          // High-contrast metallic tones visible clearly on 2xl screens: charcoal, bronze, amber gold
          const adjR = Math.max(24, r);
          const adjG = Math.max(20, g);
          const adjB = Math.max(16, b);
          const color = `rgba(${adjR}, ${adjG}, ${adjB},`;
          const alpha = Math.min(1, Math.max(0.82, a / 255));
          const delay = Math.random() * 0.16;

          particles.push({
            outerX,
            outerY,
            targetX,
            targetY,
            curve,
            rise,
            size,
            depthScale,
            color,
            alpha,
            delay,
          });
        }

        if (particles.length > 500) {
          particlesRef.current = particles;
          imageLoadedRef.current = true;
          return true;
        }
        return false;
      } catch (err) {
        console.warn("Could not sample actual image pixels, using fallback:", err);
        return false;
      }
    };

    // Fast fallback particles while the image loads
    const initFallbackParticles = (canvas: HTMLCanvasElement) => {
      const { imgLeft, imgRight, imgTop, imgBottom } = getTargetBounds(canvas);
      const particles: Particle[] = [];
      const count = 32000;

      const colors = [
        "rgba(22, 18, 14,",   // Deep charcoal obsidian
        "rgba(40, 32, 24,",   // Dark espresso bronze
        "rgba(68, 54, 40,",   // Warm bronze
        "rgba(102, 82, 62,",  // Golden bronze
        "rgba(142, 116, 88,", // Amber gold highlight
        "rgba(178, 150, 118,",// Metallic pawn reflection
      ];

      for (let i = 0; i < count; i++) {
        const rand = Math.random();
        let outerX = 0;
        let outerY = 0;
        let rise = 0;
        let depthScale = 0.70 + Math.random() * 0.40;

        if (rand < 0.28) {
          // Left flank: flies in from 3D foreground left
          outerX = -0.05 - Math.random() * 0.35;
          outerY = 0.05 + Math.random() * 0.90;
          rise = 28 + Math.random() * 42;
        } else if (rand < 0.56) {
          // Right flank: flies in from 3D foreground right
          outerX = 1.05 + Math.random() * 0.35;
          outerY = 0.05 + Math.random() * 0.90;
          rise = 28 + Math.random() * 42;
        } else {
          // Center & bottom flank: thick carpet rising upward
          outerX = 0.02 + Math.random() * 0.96;
          outerY = 0.68 + Math.random() * 0.32;
          rise = 55 + Math.random() * 75;
          depthScale = 0.90 + Math.random() * 0.50;
        }

        const targetX = imgLeft + Math.random() * (imgRight - imgLeft);
        const targetY = imgTop + Math.random() * (imgBottom - imgTop);

        const curve = (Math.random() - 0.5) * 60;
        const size = 1.7 + Math.random() * 0.4;
        const colorBase = colors[Math.floor(Math.random() * colors.length)];
        const alpha = 0.85 + Math.random() * 0.15;
        const delay = Math.random() * 0.16;

        particles.push({
          outerX,
          outerY,
          targetX,
          targetY,
          curve,
          rise,
          size,
          depthScale,
          color: colorBase,
          alpha,
          delay,
        });
      }

      particlesRef.current = particles;
    };

    const drawFrame = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const p = progressRef.current;

      // Fully dissolved once assembled into the solid photo
      if (p >= 0.99) return;

      const particles = particlesRef.current;
      const len = particles.length;
      const dpr = dprRef.current;

      // Particles stay fully dense and dissolve in the final 15% as the photo crystallizes
      const globalAlphaMultiplier = p > 0.85 ? Math.max(0, (1 - p) / 0.15) : 1;
      if (globalAlphaMultiplier <= 0.01) return;

      // Screen factor ensures particles are crisp and visible on 2xl & high-DPI displays
      const cssWidth = w / dpr;
      const screenFactor = cssWidth >= 1920 ? 1.3 : cssWidth >= 1440 ? 1.2 : 1.0;

      for (let i = 0; i < len; i++) {
        const pt = particles[i];

        // Direct scroll progression with light stagger
        const localP = Math.min(1, Math.max(0, (p - pt.delay) / (1 - pt.delay)));
        // Smooth ease: travels inward from default position into center photo
        const ease = localP < 0.5 ? 2 * localP * localP : -1 + (4 - 2 * localP) * localP;

        // 3D Perspective trajectory:
        // Arcs smoothly from right, left, and center/bottom into the center photo
        const curveOffset = Math.sin(ease * Math.PI) * pt.curve;
        const riseOffset = Math.sin(ease * Math.PI) * pt.rise;

        const curX = (pt.outerX + (pt.targetX - pt.outerX) * ease) * w + curveOffset;
        const curY = (pt.outerY + (pt.targetY - pt.outerY) * ease) * h - riseOffset;

        // Skip if outside viewport
        if (curX < -20 || curX > w + 20 || curY < -20 || curY > h + 20) continue;

        // Smooth entry fade for particles entering from left or right screen edges
        let edgeEntryFade = 1;
        if (curX < w * 0.12) {
          edgeEntryFade = Math.min(edgeEntryFade, Math.max(0, (curX + 20) / (w * 0.10)));
        } else if (curX > w * 0.88) {
          edgeEntryFade = Math.min(edgeEntryFade, Math.max(0, (w - curX + 20) / (w * 0.10)));
        }

        // Soft edge feathering at top ONLY (clean upper edge transition)
        const topFeather = Math.min(1, Math.max(0, (curY + 15) / (50 * dpr)));

        const particleAlpha = pt.alpha * globalAlphaMultiplier * edgeEntryFade * topFeather;
        if (particleAlpha <= 0.02) continue;

        ctx.fillStyle = `${pt.color}${particleAlpha.toFixed(2)})`;

        // 3D Perspective Scale: crisp and clearly visible on 2xl screens (accounting for DPR)
        const perspectiveScale = 1.0 + (1 - ease) * pt.depthScale * 0.35;
        const drawSize = Math.max(Math.round(1.5 * dpr), Math.round(pt.size * dpr * screenFactor * perspectiveScale));

        ctx.fillRect(Math.round(curX), Math.round(curY), drawSize, drawSize);
      }
    };

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const img = new Image();
      img.src = imageSrc;

      const handleResize = () => {
        const parent = canvas.parentElement;
        if (!parent) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        dprRef.current = dpr;

        const w = parent.clientWidth;
        const h = parent.clientHeight;

        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;

        if (img.complete && img.naturalWidth > 0) {
          sampleActualImagePixels(img, canvas);
        } else {
          initFallbackParticles(canvas);
        }
        drawFrame();
      };

      img.onload = () => {
        if (canvasRef.current) {
          sampleActualImagePixels(img, canvasRef.current);
          drawFrame();
        }
      };

      handleResize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (transitionAnimRef.current) {
          cancelAnimationFrame(transitionAnimRef.current);
        }
      };
    }, [imageSrc, targetElementRef]);

    // Redraw if progress prop changes
    useEffect(() => {
      progressRef.current = Math.max(0, Math.min(1, progress));
      drawFrame();
    }, [progress]);

    return (
      <canvas
        ref={canvasRef}
        className={`w-full h-full pointer-events-none select-none ${className}`}
      />
    );
  }
);

ImageParticleCanvas.displayName = "ImageParticleCanvas";

export default ImageParticleCanvas;
