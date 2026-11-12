"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/utils/gsap";
import Button from "@/components/common/Button";

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
  const activeCircleRef = useRef<HTMLDivElement>(null);
  const stepButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Text container references per step
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const col1Refs = useRef<(HTMLParagraphElement | null)[]>([]);
  const col2Refs = useRef<(HTMLParagraphElement | null)[]>([]);
  const ctaRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState<number>(0);

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

    // Master ScrollTrigger for the pinned services list animation
    const st = ScrollTrigger.create({
      trigger: sectionEl,
      start: "top top",
      end: `+=${totalSteps * 65}%`,
      pin: true,
      pinSpacing: true,
      scrub: 0.5,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;

        // 1. Continuous Horizontal Line Fill: 0% to 100%
        if (lineProgressRef.current) {
          lineProgressRef.current.style.width = `${Math.min(100, Math.max(0, p * 100))}%`;
        }

        // 2. Active Step Index: evenly partitioned across the total steps
        const stepFraction = 1 / totalSteps;
        const currentIdx = Math.min(
          totalSteps - 1,
          Math.max(0, Math.floor(p / stepFraction))
        );

        // 3. Move the outline circle along the progress line smoothly
        if (activeCircleRef.current && stepButtonRefs.current[currentIdx]) {
          const targetBtn = stepButtonRefs.current[currentIdx];
          if (targetBtn) {
            const btnLeft = targetBtn.offsetLeft + targetBtn.offsetWidth / 2;
            gsap.to(activeCircleRef.current, {
              x: btnLeft,
              duration: 0.25,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        }

        // 4. Handle step content transitions when active step changes
        if (currentIdx !== lastIndex) {
          const isBack = currentIdx < lastIndex;
          const prevIdx = lastIndex;
          lastIndex = currentIdx;
          setActiveIndex(currentIdx);

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
              y: isBack ? 14 : -14,
              filter: "blur(6px)",
              duration: 0.22,
              ease: "power2.in",
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
              { opacity: 0, y: isBack ? -16 : 16, filter: "blur(10px)" },
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.65,
                ease: "power3.out",
              }
            );
          }

          if (nextCol1) {
            gsap.killTweensOf(nextCol1);
            gsap.set(nextCol1, { visibility: "visible" });
            gsap.fromTo(
              nextCol1,
              { opacity: 0, y: isBack ? -12 : 12, filter: "blur(6px)" },
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.55,
                delay: 0.08,
                ease: "power3.out",
              }
            );
          }

          if (nextCol2) {
            gsap.killTweensOf(nextCol2);
            gsap.set(nextCol2, { visibility: "visible" });
            gsap.fromTo(
              nextCol2,
              { opacity: 0, y: isBack ? -12 : 12, filter: "blur(6px)" },
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.55,
                delay: 0.12,
                ease: "power3.out",
              }
            );
          }

          if (nextCta) {
            gsap.killTweensOf(nextCta);
            gsap.set(nextCta, { visibility: "visible" });
            gsap.fromTo(
              nextCta,
              { opacity: 0, y: isBack ? -10 : 10, filter: "blur(6px)" },
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.5,
                delay: 0.18,
                ease: "power3.out",
              }
            );
          }
        }
      },
    });

    // Position outline circle on mount at initial active step (0)
    const initBtn = stepButtonRefs.current[0];
    if (initBtn && activeCircleRef.current) {
      const btnLeft = initBtn.offsetLeft + initBtn.offsetWidth / 2;
      gsap.set(activeCircleRef.current, { x: btnLeft });
    }

    ScrollTrigger.refresh();

    return () => {
      st.kill();
    };
  }, [totalSteps]);

  // Handle clicking directly on any step number
  const handleStepClick = (index: number) => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;
    const st = ScrollTrigger.getById(sectionEl.id) || ScrollTrigger.getAll().find((s) => s.trigger === sectionEl);
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
      className="relative w-full h-screen min-h-screen overflow-hidden select-none bg-transparent flex flex-col justify-between py-6 sm:py-8 lg:py-10 container-padding"
      style={{ contain: "paint" }}
    >
      {/* =================================================================== */}
      {/* 1. VISUAL IMAGE FRAME WITH CHESS GRAPHIC & DUAL OVERLAY FEATHERS    */}
      {/* =================================================================== */}
      <div className="relative w-full max-w-[1440px] 2xl:max-w-[1560px] mx-auto h-[46vh] sm:h-[48vh] md:h-[50vh] lg:h-[52vh] rounded-none sm:rounded-2xl overflow-hidden flex items-center justify-center">
        {/* Background Chess Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/service/service_1.webp"
            alt="GTF Technologies Services Chess Strategy Graphic"
            fill
            priority
            className="object-cover object-center scale-[1.01]"
            sizes="100vw"
          />
        </div>

        {/* Top Feather Overlay: Blends seamlessly into #F8F6F0 background */}
        <div className="absolute top-0 left-0 w-full h-24 sm:h-32 md:h-40 lg:h-48 z-10 pointer-events-none select-none">
          <Image
            src="/images/service/overlay.webp"
            alt="Top Feather Gradient Overlay"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
        </div>

        {/* Bottom Feather Overlay: Inverted with scale-y-[-1] for soft lower fade */}
        <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 md:h-40 lg:h-48 z-10 pointer-events-none select-none">
          <Image
            src="/images/service/overlay.webp"
            alt="Bottom Feather Gradient Overlay"
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom scale-y-[-1]"
          />
        </div>

        {/* =================================================================== */}
        {/* 2. HORIZONTAL FILL COLOR LINE & NUMBERED OUTLINE CIRCLE STEPS       */}
        {/* =================================================================== */}
        <div className="relative z-20 w-full max-w-[1100px] 2xl:max-w-[1240px] px-4 sm:px-8 md:px-12 flex flex-col items-center">
          <div className="relative w-full flex items-center justify-between">
            {/* Background Base Track Line */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[1px] sm:h-[1.5px] bg-black/25 pointer-events-none" />

            {/* Active Colored Fill Line (Expands horizontally on scroll) */}
            <div
              ref={lineProgressRef}
              className="absolute top-1/2 left-0 -translate-y-1/2 h-[1.5px] sm:h-[2px] bg-[#121212] transition-none pointer-events-none will-change-[width]"
              style={{ width: "0%" }}
            />

            {/* Moving Circular Outline Ring around Active Step */}
            <div
              ref={activeCircleRef}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border border-[#121212]/75 pointer-events-none will-change-transform z-10 transition-transform duration-300"
              style={{
                boxShadow: "0 0 10px rgba(0,0,0,0.06)",
              }}
            />

            {/* Step Numbers along the horizontal timeline */}
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
                  className={`relative z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center transition-all duration-300 cursor-pointer group focus:outline-none ${
                    isActive ? "scale-125 sm:scale-130 md:scale-135" : "scale-95 opacity-65 hover:opacity-90"
                  }`}
                  aria-label={`Go to step ${item.number}: ${item.title}`}
                >
                  <span
                    className={`font-mono text-xs sm:text-sm md:text-base font-normal tracking-wide transition-colors duration-300 ${
                      isActive ? "text-[#121212] font-semibold" : "text-[#121212]/60 group-hover:text-[#121212]"
                    }`}
                  >
                    {item.number}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. EDITORIAL CONTENT BELOW IMAGE: TITLE + 2-COLUMN TEXT + COMMON CTA */}
      {/* =================================================================== */}
      <div className="relative w-full max-w-[1440px] 2xl:max-w-[1560px] mx-auto min-h-[36vh] sm:min-h-[38vh] flex flex-col justify-start pt-4 sm:pt-6 lg:pt-8">
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
                  className="font-voyage text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[68px] 2xl:text-[76px] text-[#121212] font-normal leading-[1.08] tracking-tight mb-4 sm:mb-6 lg:mb-8 will-change-[transform,opacity,filter]"
                >
                  {item.title}
                </h2>

                {/* Two-Column Editorial Paragraphs (Matching Figma Layout) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-16 gap-y-3 sm:gap-y-4 max-w-[1360px]">
                  {/* Left Column Description */}
                  <p
                    ref={(el) => {
                      col1Refs.current[idx] = el;
                    }}
                    className="font-segoe text-xs sm:text-[13px] md:text-sm lg:text-[14.5px] text-[#484848] font-normal leading-[1.68] drop-shadow-sm will-change-[transform,opacity,filter]"
                  >
                    {item.descriptionCol1}
                  </p>

                  {/* Right Column Description */}
                  <p
                    ref={(el) => {
                      col2Refs.current[idx] = el;
                    }}
                    className="font-segoe text-xs sm:text-[13px] md:text-sm lg:text-[14.5px] text-[#484848] font-normal leading-[1.68] drop-shadow-sm will-change-[transform,opacity,filter]"
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
                className="mt-6 sm:mt-8 will-change-[transform,opacity,filter]"
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
    </section>
  );
}

