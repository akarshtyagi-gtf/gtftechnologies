"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, splitTextChars } from "@/utils/gsap";

export interface ResearchStep {
  step: string;
  stepNumber: string;
  titlePart1: string;
  titlePart2: string;
  description: string;
  bgImage: string;
  centerImage: string;
}

export const RESEARCH_STEPS: ResearchStep[] = [
  {
    step: "STEP 1",
    stepNumber: "01",
    titlePart1: "Market",
    titlePart2: "Research",
    description:
      "We dive beneath the surface of trends, audiences, and competitors to uncover opportunities.",
    bgImage: "/images/service/market_research.jpg",
    centerImage: "/images/service/market_research.jpg",
  },
  {
    step: "STEP 2",
    stepNumber: "02",
    titlePart1: "Brand",
    titlePart2: "Positioning",
    description:
      "We carve out a distinctive space for your brand, ensuring it is remembered within the market.",
    bgImage: "/images/service/brand_strategy.webp",
    centerImage: "/images/service/brand_strategy.webp",
  },
  {
    step: "STEP 3",
    stepNumber: "03",
    titlePart1: "Articulate",
    titlePart2: "Framework",
    description:
      "We transform complex ideas into a clear strategic narrative that gives your brand purpose.",
    bgImage: "/images/service/tone_voice.webp",
    centerImage: "/images/service/tone_voice.webp",
  },
  {
    step: "STEP 4",
    stepNumber: "04",
    titlePart1: "Communication",
    titlePart2: "Rollout",
    description:
      "We bring strategy to life through cohesive communication that creates meaningful connections.",
    bgImage: "/images/service/communication3.webp",
    centerImage: "/images/service/communication3.webp",
  },
];

export default function ResearchTimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const circleProgressRef = useRef<SVGCircleElement>(null);

  // Background curtain layers (layers 1, 2, 3 covering previous ones from bottom-to-top)
  const bgCurtainRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Center circular images with circle clip-path
  const centerCircleRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Text container references
  const headingRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const paraRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Concentric circle SVG radius and circumference
  // Radius = 135, Circumference = 2 * PI * 135 ≈ 848.23
  const R = 135;
  const CIRCUMFERENCE = 2 * Math.PI * R;

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    // Initialize initial visual states:
    // Layer 0 is visible. Layers 1, 2, 3 have curtain inset at 100% (hidden from bottom)
    // and center circles have clip-path: circle(0% at 50% 50%)
    for (let i = 0; i < RESEARCH_STEPS.length; i++) {
      const bg = bgCurtainRefs.current[i];
      const center = centerCircleRefs.current[i];
      if (i === 0) {
        if (bg) gsap.set(bg, { clipPath: "none", opacity: 1, visibility: "visible" });
        if (center) gsap.set(center, { clipPath: "none", opacity: 1, visibility: "visible" });
      } else {
        if (bg) gsap.set(bg, { clipPath: "inset(100% 0% 0% 0%)", opacity: 1, visibility: "visible" });
        if (center) gsap.set(center, { clipPath: "circle(0% at 50% 50%)", opacity: 1, visibility: "visible" });
      }
    }

    // Set initial circle progress stroke: starts at 01 (strokeDashoffset = CIRCUMFERENCE)
    if (circleProgressRef.current) {
      gsap.set(circleProgressRef.current, {
        strokeDashoffset: CIRCUMFERENCE,
      });
    }

    // Step 0 text is active initially
    headingRefs.current.forEach((el, idx) => {
      if (!el) return;
      if (idx === 0) {
        gsap.set(el, { opacity: 1, y: 0, filter: "blur(0px)", visibility: "visible", pointerEvents: "auto" });
      } else {
        gsap.set(el, { opacity: 0, y: 20, filter: "blur(12px)", visibility: "hidden", pointerEvents: "none" });
      }
    });

    paraRefs.current.forEach((el, idx) => {
      if (!el) return;
      if (idx === 0) {
        gsap.set(el, { opacity: 1, y: 0, filter: "blur(0px)", visibility: "visible", pointerEvents: "auto" });
      } else {
        gsap.set(el, { opacity: 0, y: 16, filter: "blur(8px)", visibility: "hidden", pointerEvents: "none" });
      }
    });

    let lastKnownStep = 0;

    // Master ScrollTrigger with scrubbed progress across all 4 steps
    const st = ScrollTrigger.create({
      trigger: sectionEl,
      start: "top top",
      end: "+=260%",
      pin: true,
      pinSpacing: true,
      scrub: 0.3,
      anticipatePin: 1,
      fastScrollEnd: true,
      preventOverlaps: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;

        // 1. Continuous Circular Progress: Fills full 100% circle across the 4 steps
        // p = 0.00 => 0% (at 01)
        // p = 0.25 => 25% (reaches 02)
        // p = 0.50 => 50% (reaches 03)
        // p = 0.75 => 75% (reaches 04)
        // p = 1.00 => 100% (full loader circle completely filled!)
        const strokeFraction = Math.min(1, Math.max(0, p));
        if (circleProgressRef.current) {
          const newOffset = CIRCUMFERENCE * (1 - strokeFraction);
          circleProgressRef.current.style.strokeDashoffset = `${newOffset}`;
        }

        // 2. Transition 1 (Step 1 -> 2: perfectly synchronised with circle loader 01 -> 02)
        // Loader stroke moves from 01 (0.00) to 02 (0.25).
        // Clip path reveal starts immediately as the loader leaves 01 and completes at 02!
        const t1 = Math.min(1, Math.max(0, p / 0.24));
        const bg0 = bgCurtainRefs.current[0];
        const center0 = centerCircleRefs.current[0];
        if (bg0) {
          bg0.style.opacity = `${Math.max(0, 1 - t1 * 1.5)}`;
          bg0.style.visibility = t1 >= 1 ? "hidden" : "visible";
        }
        if (center0) {
          center0.style.opacity = `${Math.max(0, 1 - t1 * 1.5)}`;
          center0.style.visibility = t1 >= 1 ? "hidden" : "visible";
        }

        const bg1 = bgCurtainRefs.current[1];
        if (bg1) {
          bg1.style.clipPath =
            t1 >= 1 ? "none" : t1 <= 0 ? "inset(100% 0% 0% 0%)" : `inset(${(1 - t1) * 100}% 0% 0% 0%)`;
        }
        const center1 = centerCircleRefs.current[1];
        if (center1) {
          center1.style.clipPath =
            t1 >= 1 ? "none" : t1 <= 0 ? "circle(0% at 50% 50%)" : `circle(${t1 * 52}% at 50% 50%)`;
        }

        // 3. Transition 2 (Step 2 -> 3: perfectly synchronised with circle loader 02 -> 03)
        // Loader stroke moves from 02 (0.25) to 03 (0.50).
        // Clip path reveal starts immediately as the loader leaves 02 and completes at 03!
        const t2 = Math.min(1, Math.max(0, (p - 0.25) / 0.24));
        if (bg1) {
          bg1.style.opacity = `${Math.max(0, 1 - t2 * 1.5)}`;
          bg1.style.visibility = t2 >= 1 ? "hidden" : t1 <= 0 ? "hidden" : "visible";
        }
        if (center1) {
          center1.style.opacity = `${Math.max(0, 1 - t2 * 1.5)}`;
          center1.style.visibility = t2 >= 1 ? "hidden" : t1 <= 0 ? "hidden" : "visible";
        }

        const bg2 = bgCurtainRefs.current[2];
        if (bg2) {
          bg2.style.clipPath =
            t2 >= 1 ? "none" : t2 <= 0 ? "inset(100% 0% 0% 0%)" : `inset(${(1 - t2) * 100}% 0% 0% 0%)`;
        }
        const center2 = centerCircleRefs.current[2];
        if (center2) {
          center2.style.clipPath =
            t2 >= 1 ? "none" : t2 <= 0 ? "circle(0% at 50% 50%)" : `circle(${t2 * 52}% at 50% 50%)`;
        }

        // 4. Transition 3 (Step 3 -> 4: perfectly synchronised with circle loader 03 -> 04)
        // Loader stroke moves from 03 (0.50) to 04 (0.75).
        // Clip path reveal starts immediately as the loader leaves 03 and completes at 04!
        const t3 = Math.min(1, Math.max(0, (p - 0.50) / 0.24));
        if (bg2) {
          bg2.style.opacity = `${Math.max(0, 1 - t3 * 1.5)}`;
          bg2.style.visibility = t3 >= 1 ? "hidden" : t2 <= 0 ? "hidden" : "visible";
        }
        if (center2) {
          center2.style.opacity = `${Math.max(0, 1 - t3 * 1.5)}`;
          center2.style.visibility = t3 >= 1 ? "hidden" : t2 <= 0 ? "hidden" : "visible";
        }

        const bg3 = bgCurtainRefs.current[3];
        if (bg3) {
          bg3.style.clipPath =
            t3 >= 1 ? "none" : t3 <= 0 ? "inset(100% 0% 0% 0%)" : `inset(${(1 - t3) * 100}% 0% 0% 0%)`;
          bg3.style.opacity = "1";
          bg3.style.visibility = t3 <= 0 ? "hidden" : "visible";
        }
        const center3 = centerCircleRefs.current[3];
        if (center3) {
          center3.style.clipPath =
            t3 >= 1 ? "none" : t3 <= 0 ? "circle(0% at 50% 50%)" : `circle(${t3 * 52}% at 50% 50%)`;
          center3.style.opacity = "1";
          center3.style.visibility = t3 <= 0 ? "hidden" : "visible";
        }

        // 5. Determine active step index with aligned resting plateaus:
        // p < 0.25  => Step 1 (01)
        // p in [0.25, 0.50) => Step 2 (02)
        // p in [0.50, 0.75) => Step 3 (03)
        // p >= 0.75 => Step 4 (04) (100% full reveal, zero overlap)
        let currentStep = 0;
        if (p >= 0.75) {
          currentStep = 3;
        } else if (p >= 0.50) {
          currentStep = 2;
        } else if (p >= 0.25) {
          currentStep = 1;
        } else {
          currentStep = 0;
        }

        if (currentStep !== lastKnownStep) {
          const isScrollingBack = currentStep < lastKnownStep;
          const prev = lastKnownStep;
          lastKnownStep = currentStep;
          setActiveStepIndex(currentStep);

          // 1. Immediately kill all active tweens across all steps to prevent race conditions & overlaps
          headingRefs.current.forEach((h) => {
            if (h) {
              gsap.killTweensOf(h);
              const chars = h.querySelectorAll(".heading-char-item");
              if (chars.length > 0) gsap.killTweensOf(chars);
            }
          });
          paraRefs.current.forEach((p) => {
            if (p) gsap.killTweensOf(p);
          });

          // 2. Hide all non-current steps cleanly; animate prev out, instantly hide any others
          RESEARCH_STEPS.forEach((_, i) => {
            if (i !== currentStep) {
              const h = headingRefs.current[i];
              const p = paraRefs.current[i];
              if (i === prev) {
                if (h) {
                  gsap.to(h, {
                    opacity: 0,
                    y: isScrollingBack ? 14 : -14,
                    filter: "blur(8px)",
                    duration: 0.22,
                    ease: "power2.in",
                    onComplete: () => {
                      if (h) gsap.set(h, { visibility: "hidden" });
                    },
                  });
                }
                if (p) {
                  gsap.to(p, {
                    opacity: 0,
                    y: isScrollingBack ? 10 : -10,
                    filter: "blur(6px)",
                    duration: 0.2,
                    ease: "power2.in",
                    onComplete: () => {
                      if (p) gsap.set(p, { visibility: "hidden" });
                    },
                  });
                }
              } else {
                if (h) {
                  gsap.set(h, { opacity: 0, filter: "blur(10px)", visibility: "hidden" });
                }
                if (p) {
                  gsap.set(p, { opacity: 0, filter: "blur(6px)", visibility: "hidden" });
                }
              }
            }
          });

          // 3. Animate current step in cleanly with character dissolve
          const nextHeading = headingRefs.current[currentStep];
          const nextPara = paraRefs.current[currentStep];
          const nextChars = nextHeading?.querySelectorAll<HTMLElement>(".heading-char-item");

          if (nextHeading) {
            gsap.set(nextHeading, { visibility: "visible" });
            gsap.fromTo(
              nextHeading,
              {
                opacity: 0,
                y: isScrollingBack ? -14 : 14,
                filter: "blur(12px)",
              },
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.55,
                ease: "power3.out",
                pointerEvents: "auto",
              }
            );

            if (nextChars && nextChars.length > 0) {
              gsap.fromTo(
                nextChars,
                {
                  opacity: 0,
                  filter: "blur(16px)",
                  scale: 1.6,
                  y: isScrollingBack ? 12 : -12,
                },
                {
                  opacity: 1,
                  filter: "blur(0px)",
                  scale: 1,
                  y: 0,
                  duration: 0.6,
                  stagger: { from: "start", amount: 0.2 },
                  ease: "power3.out",
                }
              );
            }
          }

          if (nextPara) {
            gsap.set(nextPara, { visibility: "visible" });
            gsap.fromTo(
              nextPara,
              {
                opacity: 0,
                y: isScrollingBack ? -10 : 10,
                filter: "blur(8px)",
              },
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.5,
                delay: 0.08,
                ease: "power3.out",
                pointerEvents: "auto",
              }
            );
          }
        }
      },
    });

    ScrollTrigger.refresh();

    return () => {
      st.kill();
    };
  }, [CIRCUMFERENCE]);

  const activeStep = RESEARCH_STEPS[activeStepIndex];

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen min-h-screen overflow-hidden select-none bg-[#11100F] text-white will-change-transform"
      style={{ contain: "paint" }}
    >
      <div className="relative w-full h-full overflow-hidden">
        {/* =================================================================== */}
        {/* 1. CINEMATIC BACKGROUND CURTAINS (Light Overlay Matching Figma)     */}
        {/* =================================================================== */}
        {RESEARCH_STEPS.map((step, idx) => (
          <div
            key={`bg-layer-${step.stepNumber}`}
            ref={(el) => {
              bgCurtainRefs.current[idx] = el;
            }}
            className={`absolute inset-0 w-full h-full will-change-[clip-path,transform] ${
              idx === 3 ? "bg-[#F8F6F0]" : "bg-[#11100F]"
            }`}
            style={{
              zIndex: idx + 1,
              clipPath: idx === 0 ? "none" : "inset(100% 0% 0% 0%)",
            }}
          >
            {/* Background Image - Clearly visible with soft warm lighting matching Figma */}
            <Image
              src={step.bgImage}
              alt={`${step.titlePart1} ${step.titlePart2} Background`}
              fill
              priority={idx === 0}
              className="object-cover object-center scale-[1.01]"
              sizes="100vw"
            />
            {/* Ambient overlay: tailored per step for perfect contrast and editorial depth */}
            <div
              className={`absolute inset-0 pointer-events-none ${
                idx === 3
                  ? "bg-black/35"
                  : idx === 0
                  ? "bg-black/40"
                  : "bg-black/30"
              }`}
            />
            <div
              className={`absolute inset-0 pointer-events-none ${
                idx === 3
                  ? "bg-gradient-to-t from-black/50 via-black/15 to-black/30"
                  : "bg-gradient-to-t from-black/55 via-transparent to-black/25"
              }`}
            />
          </div>
        ))}

        {/* =================================================================== */}
        {/* 2. TOP-LEFT STEP BADGE (Safely placed AFTER/BELOW the Header bar)    */}
        {/* =================================================================== */}
        <div className="absolute top-24 sm:top-28 lg:top-32 left-6 sm:left-10 lg:left-16 z-30 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full border border-white/25 bg-black/30 backdrop-blur-md shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="font-mono text-[10px] sm:text-[11px] md:text-xs tracking-[0.24em] uppercase text-white/90">
              {activeStep.step}
            </span>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 3. CENTER GRAPHIC: FULL 360 WHITE CIRCLE LOADER & PORTAL IMAGE     */}
        {/* =================================================================== */}
        <div className="absolute left-1/2 top-[53%] sm:top-[52%] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center pointer-events-none">
          {/* Outer Concentric SVG Circle Track (Scaled to match Figma proportions) */}
          <div className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] md:w-[400px] md:h-[400px] lg:w-[440px] lg:h-[440px] flex items-center justify-center">
            {/* SVG Track & Pure White Progress Arc */}
            <svg
              className="absolute inset-0 w-full h-full overflow-visible"
              viewBox="0 0 320 320"
            >
              {/* Subtle Pure White Ambient Track Circle */}
              <circle
                cx="160"
                cy="160"
                r={R}
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="0.8"
              />

              {/* Refined Thin White Progress Arc with Reduced Soft Luxury Opacity */}
              <circle
                ref={circleProgressRef}
                cx="160"
                cy="160"
                r={R}
                fill="none"
                stroke="rgba(255, 255, 255, 0.40)"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE}
                transform="rotate(-90 160 160)"
                className="transition-none drop-shadow-[0_0_2px_rgba(255,255,255,0.15)]"
              />
            </svg>

            {/* 4 Step Number Markers placed UNDER / INSIDE the circle circumference */}
            {/* Point 01: Top (12 o'clock, inside circle under top arc) */}
            <div
              className={`absolute top-[7.8%] left-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-300 ${
                activeStepIndex >= 0 ? "text-white/70" : "text-white/20"
              }`}
            >
              {/* Tick hanging downward from top arc */}
              <div
                className={`w-[1px] h-2 sm:h-2.5 transition-colors ${
                  activeStepIndex >= 0
                    ? "bg-white/55 shadow-[0_0_2px_rgba(255,255,255,0.25)]"
                    : "bg-white/10"
                }`}
              />
              <span className="font-mono text-[9px] sm:text-[10px] md:text-[14px] tracking-widest font-medium mt-1">
                01
              </span>
            </div>

            {/* Point 02: Right (3 o'clock, inside circle to the left of right arc) */}
            <div
              className={`absolute right-[7.8%] top-1/2 -translate-y-1/2 flex items-center transition-all duration-300 ${
                activeStepIndex >= 1 ? "text-white/70" : "text-white/20"
              }`}
            >
              <span className="font-mono text-[9px] sm:text-[10px] md:text-[14px] tracking-widest font-medium mr-1.5">
                02
              </span>
              {/* Tick pointing inward from right arc */}
              <div
                className={`w-2 sm:w-2.5 h-[1px] transition-colors ${
                  activeStepIndex >= 1
                    ? "bg-white/55 shadow-[0_0_2px_rgba(255,255,255,0.25)]"
                    : "bg-white/10"
                }`}
              />
            </div>

            {/* Point 03: Bottom (6 o'clock, inside circle above bottom arc) */}
            <div
              className={`absolute bottom-[7.8%] left-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-300 ${
                activeStepIndex >= 2 ? "text-white/70" : "text-white/20"
              }`}
            >
              <span className="font-mono text-[9px] sm:text-[10px] md:text-[14px] tracking-widest font-medium mb-1">
                03
              </span>
              {/* Tick pointing upward from bottom arc */}
              <div
                className={`w-[1px] h-2 sm:h-2.5 transition-colors ${
                  activeStepIndex >= 2
                    ? "bg-white/55 shadow-[0_0_2px_rgba(255,255,255,0.25)]"
                    : "bg-white/10"
                }`}
              />
            </div>

            {/* Point 04: Left (9 o'clock, inside circle to the right of left arc) */}
            <div
              className={`absolute left-[7.8%] top-1/2 -translate-y-1/2 flex items-center transition-all duration-300 ${
                activeStepIndex >= 3 ? "text-white/70" : "text-white/20"
              }`}
            >
              {/* Tick pointing inward from left arc */}
              <div
                className={`w-2 sm:w-2.5 h-[1px] transition-colors ${
                  activeStepIndex >= 3
                    ? "bg-white/55 shadow-[0_0_2px_rgba(255,255,255,0.25)]"
                    : "bg-white/10"
                }`}
              />
              <span className="font-mono text-[9px] sm:text-[10px] md:text-[14px] tracking-widest font-medium ml-1.5">
                04
              </span>
            </div>

            {/* Inner Circular Portal Image Frame with Circle Clip-Path reveal (Figma Proportion) */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-52 lg:h-52 rounded-full overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-white/25">
              {RESEARCH_STEPS.map((step, idx) => (
                <div
                  key={`center-img-${step.stepNumber}`}
                  ref={(el) => {
                    centerCircleRefs.current[idx] = el;
                  }}
                  className={`absolute inset-0 w-full h-full will-change-[clip-path] ${
                    idx === 3 ? "bg-[#F8F6F0]" : "bg-[#11100F]"
                  }`}
                  style={{
                    zIndex: idx + 1,
                    clipPath: idx === 0 ? "none" : "circle(0% at 50% 50%)",
                  }}
                >
                  <Image
                    src={step.centerImage}
                    alt={`${step.titlePart1} ${step.titlePart2} Portal View`}
                    fill
                    priority={idx === 0}
                    className="object-cover object-center scale-[1.02]"
                    sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 230px"
                  />
                  {/* Little ambient overlay on 1st and 4th step center portal image */}
                  {(idx === 0 || idx === 3) && (
                    <div className="absolute inset-0 bg-black/25 pointer-events-none" />
                  )}
                  {/* Subtle glass reflection sheen on circular portal */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/15 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 4. BOTTOM-LEFT STEP TYPOGRAPHY: COMPACT HEADER & 2-3 LINE PARAGRAPH */}
        {/* =================================================================== */}
        <div className="absolute bottom-8 sm:bottom-10 lg:bottom-12 left-6 sm:left-10 lg:left-16 z-30 w-[300px] sm:w-[380px] md:w-[440px] lg:w-[480px] pointer-events-none">
          {RESEARCH_STEPS.map((step, idx) => (
            <div
              key={`text-step-${step.stepNumber}`}
              className="absolute bottom-0 left-0 w-full flex flex-col items-start"
            >
              {/* Grand Voyage Heading with Character Dissolve: Refined Scale, Strictly in 1 Line */}
              <h2
                ref={(el) => {
                  headingRefs.current[idx] = el;
                }}
                className="font-voyage text-xl sm:text-2xl md:text-[26px] lg:text-[30px] xl:text-[34px] 2xl:text-[38px] font-normal tracking-tight leading-[1.15] drop-shadow-lg will-change-[transform,opacity,filter] [perspective:1200px] flex items-baseline gap-x-2 sm:gap-x-2.5 whitespace-nowrap"
              >
                <span className="text-white whitespace-nowrap inline-block">
                  {splitTextChars(step.titlePart1).map((item, cIdx) => (
                    <span
                      key={`p1-${cIdx}`}
                      className="heading-char-item inline-block will-change-[transform,opacity,filter]"
                    >
                      {item.char}
                    </span>
                  ))}
                </span>
                <span className="text-[#EAB308] italic whitespace-nowrap inline-block">
                  {splitTextChars(step.titlePart2).map((item, cIdx) => (
                    <span
                      key={`p2-${cIdx}`}
                      className="heading-char-item inline-block will-change-[transform,opacity,filter]"
                    >
                      {item.char}
                    </span>
                  ))}
                </span>
              </h2>

              {/* Description Paragraph: Formatted cleanly into 2 or 3 lines */}
              <p
                ref={(el) => {
                  paraRefs.current[idx] = el;
                }}
                className="font-segoe font-normal text-white/80 text-xs sm:text-[13px] md:text-sm lg:text-[14.5px] leading-[1.62] sm:leading-[1.66] mt-2 sm:mt-2.5 w-full drop-shadow will-change-[transform,opacity,filter]"
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
