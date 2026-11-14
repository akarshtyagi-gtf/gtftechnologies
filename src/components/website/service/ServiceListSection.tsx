"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/utils/gsap";
import Button from "@/components/common/Button";
import ImageParticleCanvas, { ImageParticleCanvasHandle } from "@/components/animations/ImageParticleCanvas";

export interface ServiceListItem {
  id: number;
  number: string;
  title: string;
  slug: string;
  descriptionCol1: string;
  descriptionCol2: string;
  imageSrc: string;
  imageAlt: string;
}

export const SERVICE_LIST_ITEMS: ServiceListItem[] = [
  {
    id: 1,
    number: "1",
    title: "Brand Strategy Development",
    slug: "brand-strategy",
    descriptionCol1:
      "We help businesses build distinctive brands through strategic brand positioning, visual identity development, brand storytelling and consistent communication. From defining your brand's",
    descriptionCol2:
      "purpose to creating a recognizable visual language, our brand strategy services help businesses establish a strong market presence and connect with their target audience across India.",
    imageSrc: "/images/service/service_1.webp",
    imageAlt: "GTF Technologies Brand Strategy Development Chess Visual",
  },
  {
    id: 2,
    number: "2",
    title: "Brand Identity & Visual Language",
    slug: "brand-identity",
    descriptionCol1:
      "Crafting expressive visual identities with distinctive typography, generative color systems, and modern aesthetic direction that command authority across digital and physical touchpoints.",
    descriptionCol2:
      "From dynamic logomarks to modular design tokens, our visual systems empower brands to adapt dynamically and scale seamlessly across physical spaces and digital interfaces.",
    imageSrc: "/images/service/service_1.webp",
    imageAlt: "GTF Technologies Brand Identity & Visual Language Visual",
  },
  {
    id: 3,
    number: "3",
    title: "Messaging & Tone of Voice",
    slug: "messaging-tone",
    descriptionCol1:
      "Developing distinctive verbal personality frameworks that resonate across customer journeys. From headline messaging matrix to cross-channel brand vernacular, we align every word",
    descriptionCol2:
      "with strategic intent to engage, persuade, and build enduring trust with your audiences at every critical brand touchpoint and marketing communication.",
    imageSrc: "/images/service/service_1.webp",
    imageAlt: "GTF Technologies Messaging & Tone of Voice Visual",
  },
  {
    id: 4,
    number: "4",
    title: "Brand Storytelling Framework",
    slug: "brand-storytelling",
    descriptionCol1:
      "Transforming corporate messaging into emotional, cinematic brand narratives. We craft human-centric story arcs that foster deep cultural affinity and community loyalty",
    descriptionCol2:
      "across diverse markets, helping brands cultivate a genuine emotional bond that transcends traditional transactional marketing to create long-term loyalty.",
    imageSrc: "/images/service/service_1.webp",
    imageAlt: "GTF Technologies Brand Storytelling Framework Visual",
  },
  {
    id: 5,
    number: "5",
    title: "Communication Strategy Across Platforms",
    slug: "communication-strategy",
    descriptionCol1:
      "Orchestrating cohesive omnichannel communications. Ensuring brand coherence across digital platforms, high-impact experiential installations, performance campaigns,",
    descriptionCol2:
      "and PR activations to drive synchronized reach, high recall, and measurable business momentum throughout the entire customer decision lifecycle.",
    imageSrc: "/images/service/service_1.webp",
    imageAlt: "GTF Technologies Communication Strategy Visual",
  },
  {
    id: 6,
    number: "6",
    title: "Brand Experience & Spatial Design",
    slug: "brand-experience",
    descriptionCol1:
      "Creating immersive physical and environmental brand experiences that connect with people in the real world. From flagship retail environments to architectural spatial touchpoints,",
    descriptionCol2:
      "we translate strategic brand narratives into tangible, sensory environments that leave an unforgettable impression on every visitor and stakeholder.",
    imageSrc: "/images/service/service_1.webp",
    imageAlt: "GTF Technologies Brand Experience Visual",
  },
  {
    id: 7,
    number: "7",
    title: "Digital Innovation & Product Experience",
    slug: "digital-innovation",
    descriptionCol1:
      "Engineering cutting-edge digital platforms, interactive web experiences, and bespoke digital products that seamlessly bridge brand aspiration with modern technical precision.",
    descriptionCol2:
      "By blending high-performance engineering with luxury interactive design, we turn passive website visitors into highly engaged brand advocates and lifelong customers.",
    imageSrc: "/images/service/service_1.webp",
    imageAlt: "GTF Technologies Digital Innovation Visual",
  },
];

export default function ServiceListSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineProgressRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<ImageParticleCanvasHandle>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const innerImageRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const stepButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Text container references per step
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const col1Refs = useRef<(HTMLParagraphElement | null)[]>([]);
  const col2Refs = useRef<(HTMLParagraphElement | null)[]>([]);
  const ctaRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const isStepTransitioningRef = useRef<boolean>(false);

  const totalSteps = SERVICE_LIST_ITEMS.length;

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    // Initialize step text states: Step 0 is active initially, others hidden
    SERVICE_LIST_ITEMS.forEach((_, idx) => {
      const isFirst = idx === 0;
      const t = titleRefs.current[idx];
      const c1 = col1Refs.current[idx];
      const c2 = col2Refs.current[idx];
      const btn = ctaRefs.current[idx];

      [t, c1, c2, btn].forEach((el) => {
        if (!el) return;
        if (isFirst) {
          gsap.set(el, { opacity: 1, y: 0, filter: "blur(0px)", visibility: "visible" });
        } else {
          gsap.set(el, { opacity: 0, y: 16, filter: "blur(8px)", visibility: "hidden" });
        }
      });
    });

    let lastIndex = 0;

    // 1. Particle Assembly ScrollTrigger (ACTIVE BEFORE PIN, while scrolling into view):
    // Particles fly from off-screen right, left, and bottom into center photo on basis of scroll
    const particleST = ScrollTrigger.create({
      trigger: sectionEl,
      start: "top 50%", // Starts as section enters viewport from below banner
      end: "top top",   // Finishes right when section reaches the top of screen
      scrub: 0.35,
      onUpdate: (self) => {
        const p = self.progress;

        // Particles move continuously on basis of scroll from outside into center
        particleCanvasRef.current?.setProgress(p);

        // Center photo ONLY reveals at the very end as particles assemble in center (82% to 100%)
        // Strictly hidden (opacity: 0) while particles are streaming (0% to 82%)
        if (imageWrapperRef.current) {
          const imgOpacity = Math.min(1, Math.max(0, (p - 0.82) / 0.18));
          imageWrapperRef.current.style.opacity = `${imgOpacity}`;
        }
      },
    });

    // 2. Master Pinned Section ScrollTrigger (ACTIVE AFTER SECTION PIN):
    // Pinned at top top: reveals timeline + content, fills horizontal line, navigates steps 1-7
    const pinST = ScrollTrigger.create({
      trigger: sectionEl,
      start: "top top",
      end: `+=${totalSteps * 38}%`,
      pin: true,
      pinSpacing: true,
      scrub: 0.35,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;

        // Active Step Index: evenly partitioned across the 7 steps
        const stepFraction = 1 / totalSteps;
        const currentIdx = Math.min(
          totalSteps - 1,
          Math.max(0, Math.floor(p / stepFraction))
        );

        // Progress strictly WITHIN the active step (0.0 to 1.0)
        // Each step restarts the top-to-bottom motion smoothly from start to finish
        const stepP = Math.min(1, Math.max(0, (p - currentIdx * stepFraction) / stepFraction));

        if (innerImageRef.current) {
          const panY = (stepP - 0.5) * 48; // -24px (top) at step start -> +24px (bottom) at step end
          innerImageRef.current.style.transform = `translateY(${panY}px)`;
        }

        // Keep photo solid 100% during pin (unless currently in a step transition)
        if (!isStepTransitioningRef.current && imageWrapperRef.current) {
          imageWrapperRef.current.style.opacity = "1";
        }
        if (!isStepTransitioningRef.current) {
          particleCanvasRef.current?.setProgress(1);
        }

        // Reveal timeline & content smoothly at the start of pin
        const revealProgress = Math.min(1, p / 0.08);
        const revealEase = 1 - Math.pow(1 - revealProgress, 3);

        if (timelineContainerRef.current) {
          timelineContainerRef.current.style.opacity = `${revealEase}`;
          timelineContainerRef.current.style.transform = `translateY(${(1 - revealEase) * 16}px)`;
          timelineContainerRef.current.style.pointerEvents = "auto";
        }

        if (contentContainerRef.current) {
          contentContainerRef.current.style.opacity = `${revealEase}`;
          contentContainerRef.current.style.transform = `translateY(${(1 - revealEase) * 24}px)`;
          contentContainerRef.current.style.pointerEvents = "auto";
        }

        // Horizontal White Line Fill: 0% to 100% across the 7 steps
        if (lineProgressRef.current) {
          lineProgressRef.current.style.width = `${Math.min(100, Math.max(0, p * 100))}%`;
        }

        // 4. Handle step content transitions when active step changes
        if (currentIdx !== lastIndex) {
          const isBack = currentIdx < lastIndex;
          const prevIdx = lastIndex;
          lastIndex = currentIdx;
          setActiveIndex(currentIdx);

          // Trigger the 3D particle burst & re-crystallization wave
          isStepTransitioningRef.current = true;
          particleCanvasRef.current?.triggerStepTransition();

          // Smoothly dissolve photo into particles, then re-crystallize into photo
          if (imageWrapperRef.current) {
            gsap.killTweensOf(imageWrapperRef.current);
            gsap.timeline({
              onComplete: () => {
                isStepTransitioningRef.current = false;
                if (imageWrapperRef.current) {
                  imageWrapperRef.current.style.opacity = "1";
                }
              },
            })
            .to(imageWrapperRef.current, {
              opacity: 0.25,
              duration: 0.22,
              ease: "power2.out",
            })
            .to(imageWrapperRef.current, {
              opacity: 1,
              duration: 0.38,
              ease: "power2.inOut",
            });
          }

          // Animate previous step text out cleanly
          const prevElements = [
            titleRefs.current[prevIdx],
            col1Refs.current[prevIdx],
            col2Refs.current[prevIdx],
            ctaRefs.current[prevIdx],
          ];

          prevElements.forEach((el) => {
            if (!el) return;
            gsap.killTweensOf(el);
            gsap.to(el, {
              opacity: 0,
              y: isBack ? 10 : -10,
              filter: "blur(6px)",
              duration: 0.28,
              ease: "power2.inOut",
              onComplete: () => {
                gsap.set(el, { visibility: "hidden" });
              },
            });
          });

          // Ensure any other inactive step is completely hidden
          SERVICE_LIST_ITEMS.forEach((_, i) => {
            if (i !== currentIdx && i !== prevIdx) {
              [
                titleRefs.current[i],
                col1Refs.current[i],
                col2Refs.current[i],
                ctaRefs.current[i],
              ].forEach((el) => {
                if (el) {
                  gsap.killTweensOf(el);
                  gsap.set(el, { opacity: 0, filter: "blur(8px)", visibility: "hidden" });
                }
              });
            }
          });

          // Animate new active step text in cleanly
          const nextTitle = titleRefs.current[currentIdx];
          const nextCol1 = col1Refs.current[currentIdx];
          const nextCol2 = col2Refs.current[currentIdx];
          const nextCta = ctaRefs.current[currentIdx];

          if (nextTitle) {
            gsap.killTweensOf(nextTitle);
            gsap.set(nextTitle, { visibility: "visible" });
            gsap.fromTo(
              nextTitle,
              { opacity: 0, y: isBack ? -14 : 14, filter: "blur(8px)" },
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.7,
                ease: "power3.out",
              }
            );
          }

          if (nextCol1) {
            gsap.killTweensOf(nextCol1);
            gsap.set(nextCol1, { visibility: "visible" });
            gsap.fromTo(
              nextCol1,
              { opacity: 0, y: isBack ? -10 : 10, filter: "blur(6px)" },
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.65,
                delay: 0.06,
                ease: "power3.out",
              }
            );
          }

          if (nextCol2) {
            gsap.killTweensOf(nextCol2);
            gsap.set(nextCol2, { visibility: "visible" });
            gsap.fromTo(
              nextCol2,
              { opacity: 0, y: isBack ? -10 : 10, filter: "blur(6px)" },
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.65,
                delay: 0.1,
                ease: "power3.out",
              }
            );
          }

          if (nextCta) {
            gsap.killTweensOf(nextCta);
            gsap.set(nextCta, { visibility: "visible" });
            gsap.fromTo(
              nextCta,
              { opacity: 0, y: isBack ? -8 : 8, filter: "blur(4px)" },
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.6,
                delay: 0.15,
                ease: "power3.out",
              }
            );
          }
        }
      },
    });

    return () => {
      particleST.kill();
      pinST.kill();
    };
  }, [totalSteps]);

  // Handle clicking directly on any step number
  const handleStepClick = (index: number) => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;
    const st = ScrollTrigger.getAll().find((s) => s.trigger === sectionEl && s.vars.pin);
    if (st) {
      const stepFraction = 1 / totalSteps;
      const targetScroll = st.start + (index * stepFraction + stepFraction * 0.5) * (st.end - st.start);
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen min-h-screen overflow-hidden select-none bg-transparent flex flex-col justify-between pt-16 sm:pt-18 md:pt-20 lg:pt-22 xl:pt-24 pb-4 sm:pb-6 lg:pb-8"
    >
      {/* Full-Screen WebGL Particle Canvas (Obsidian Assembly style: dense dust specks -> converge to center) */}
      <ImageParticleCanvas
        ref={particleCanvasRef}
        targetElementRef={imageFrameRef}
        imageSrc="/images/service/service_1.webp"
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
      />

      {/* =================================================================== */}
      {/* 1. VISUAL IMAGE FRAME: FULL VW (EDGE-TO-EDGE) & 100% CLEAR CENTER   */}
      {/* Center is completely clear: knight & pawns are sharp and prominent  */}
      {/* Minimal top edge dissolve; minimal bottom edge fade below timeline */}
      {/* =================================================================== */}
      <div
        ref={imageFrameRef}
        className="relative w-full left-0 right-0 h-[46vh] sm:h-[48vh] md:h-[50vh] lg:h-[52vh] xl:h-[54vh] overflow-hidden flex flex-col justify-end shrink-0"
      >
        {/* Base Image Wrapper: exact original placement, handles only opacity & step transition */}
        <div
          ref={imageWrapperRef}
          className="absolute inset-0 w-full h-full z-10 pointer-events-none will-change-opacity"
          style={{ opacity: 0 }}
        >
          {/* Inner container: moves strictly on timeline scrollbar without disturbing base placement */}
          <div
            ref={innerImageRef}
            className="relative w-full h-[114%] -top-[7%] will-change-transform"
            style={{ transform: "translateY(-24px)" }}
          >
            <Image
              src="/images/service/service_1.webp"
              alt="GTF Technologies Brand Strategy Chess Visual"
              fill
              priority
              className="object-cover object-[center_top]"
              sizes="100vw"
            />
          </div>
        </div>

        {/* Minimal Top Edge Dissolve: very subtle, zero hard lines */}
        <div className="absolute top-0 left-0 w-full h-10 sm:h-12 md:h-14 z-10 pointer-events-none bg-gradient-to-b from-[#F8F6F0] via-[#F8F6F0]/60 to-transparent" />

        {/* Bottom Edge Fade: ONLY at the very bottom edge, beneath the timeline! */}
        <div className="absolute bottom-0 left-0 w-full h-10 sm:h-12 md:h-14 z-10 pointer-events-none bg-gradient-to-t from-[#F8F6F0] via-[#F8F6F0]/75 to-transparent" />

        {/* =================================================================== */}
        {/* 2. TIMELINE: SITS ON THE CLEAR PHOTO AT THE BASE OF CHESS PIECES    */}
        {/* Placed ABOVE the bottom fade so it remains 100% sharp & high contrast */}
        {/* Hidden on entry, smoothly revealed as particles convert into image */}
        {/* =================================================================== */}
        <div
          ref={timelineContainerRef}
          className="relative z-30 w-full max-w-[960px] lg:max-w-[1080px] xl:max-w-[1140px] px-6 sm:px-10 md:px-14 mx-auto mb-10 sm:mb-12 md:mb-14 flex flex-col items-center will-change-[transform,opacity] transition-none pointer-events-none"
          style={{ opacity: 0, transform: "translateY(16px)" }}
        >
          <div className="relative w-full flex items-center justify-between">
            {/* Subtle White Track Line across all numbers */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[1px] bg-white/35 pointer-events-none" />

            {/* Active White Fill Loader Line (Expands horizontally on scroll) */}
            <div
              ref={lineProgressRef}
              className="absolute top-1/2 left-0 -translate-y-1/2 h-[1.5px] bg-white transition-none pointer-events-none will-change-[width]"
              style={{ width: "0%" }}
            />

            {/* Step Nodes (1 to 7): Dual Concentric Circles (Outer + Center) as in Figma */}
            {SERVICE_LIST_ITEMS.map((item, idx) => {
              const isActive = activeIndex === idx;

              return (
                <button
                  key={`step-btn-${item.id}`}
                  ref={(el) => {
                    stepButtonRefs.current[idx] = el;
                  }}
                  type="button"
                  onClick={() => handleStepClick(idx)}
                  className="relative z-20 w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center shrink-0 cursor-pointer group focus:outline-none"
                  aria-label={`Go to step ${item.number}: ${item.title}`}
                >
                  {/* Outer Concentric Circle: Fixed dimensions, GPU transform scale & opacity (Zero layout reflow) */}
                  <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[68px] h-[68px] sm:w-[80px] sm:h-[80px] md:w-[92px] md:h-[92px] rounded-full border border-white/45 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[transform,opacity] ${
                      isActive
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-75"
                    }`}
                  />

                  {/* Center Circle: Fixed dimensions, GPU transform scale & glass styles (Zero flex shift) */}
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[transform,background-color,border-color,box-shadow] ${
                      isActive
                        ? "scale-120 sm:scale-125 border border-white/90 bg-black/60 backdrop-blur-[6px] shadow-[0_4px_20px_rgba(0,0,0,0.45)]"
                        : "scale-100 border border-white/20 bg-black/25 backdrop-blur-[2px] group-hover:border-white/50 group-hover:bg-black/35"
                    }`}
                  >
                    <span
                      className={`font-voyage transition-colors duration-400 select-none ${
                        isActive
                          ? "text-base sm:text-lg md:text-xl text-white font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
                          : "text-sm sm:text-base md:text-lg text-white/60 group-hover:text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
                      }`}
                      style={{ fontFamily: "var(--font-voyage), Voyage, serif" }}
                    >
                      {item.number}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. EDITORIAL CONTENT: SITS IN THE CLEAN #F8F6F0 AREA BELOW IMAGE    */}
      {/* Generous breathing room below the timeline; zero vertical collision */}
      {/* Hidden on entry, smoothly revealed as particles convert into image */}
      {/* =================================================================== */}
      <div
        ref={contentContainerRef}
        className="relative z-20 w-full max-w-[1440px] 2xl:max-w-[1560px] mx-auto container-padding flex-1 flex flex-col justify-between pt-3 sm:pt-4 md:pt-5 lg:pt-6 pb-2 min-h-[30vh] will-change-[transform,opacity] transition-none pointer-events-none"
        style={{ opacity: 0, transform: "translateY(24px)" }}
      >
        <div className="relative w-full h-full flex flex-col justify-between">
          {SERVICE_LIST_ITEMS.map((item, idx) => {
            return (
              <div
                key={`content-step-${item.id}`}
                className="absolute inset-0 w-full flex flex-col justify-between"
              >
                {/* Grand Voyage Heading */}
                <div>
                  <h2
                    ref={(el) => {
                      titleRefs.current[idx] = el;
                    }}
                    className="font-voyage text-3xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[62px] 2xl:text-[70px] text-[#121212] font-normal leading-[1.08] tracking-tight mb-2 sm:mb-3 md:mb-4 lg:mb-5 will-change-[transform,opacity,filter]"
                    style={{ fontFamily: "var(--font-voyage), Voyage, serif" }}
                  >
                    {item.title}
                  </h2>

                  {/* Two-Column Editorial Paragraphs (Matching Figma Layout) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-12 lg:gap-x-16 gap-y-2 sm:gap-y-3 max-w-[1360px]">
                    {/* Left Column Description */}
                    <p
                      ref={(el) => {
                        col1Refs.current[idx] = el;
                      }}
                      className="font-segoe text-xs sm:text-[13px] md:text-sm lg:text-[14px] xl:text-[14.5px] text-[#484848] font-normal leading-[1.65] drop-shadow-sm will-change-[transform,opacity,filter]"
                    >
                      {item.descriptionCol1}
                    </p>

                    {/* Right Column Description */}
                    <p
                      ref={(el) => {
                        col2Refs.current[idx] = el;
                      }}
                      className="font-segoe text-xs sm:text-[13px] md:text-sm lg:text-[14px] xl:text-[14.5px] text-[#484848] font-normal leading-[1.65] drop-shadow-sm will-change-[transform,opacity,filter]"
                    >
                      {item.descriptionCol2}
                    </p>
                  </div>
                </div>

                {/* Common Circle-Arrow CTA Button below Left Column */}
                <div
                  ref={(el) => {
                    ctaRefs.current[idx] = el;
                  }}
                  className="mt-3 sm:mt-4 md:mt-5 will-change-[transform,opacity,filter]"
                >
                  <Button
                    href={`/service/${item.slug}`}
                    variant="circle-arrow"
                    iconPosition="left"
                    className="hover:opacity-90 transition-opacity"
                  >
                    REACH OUT TO US
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
