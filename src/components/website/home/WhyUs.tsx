"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/utils/gsap";
import { Paragraph } from "@/components/common/Typography";
import CharBlurDissolveHeading from "@/components/animations/CharBlurDissolveHeading";
import type { WhyUsData, WhyUsItem } from "@/types/home";

interface WhyUsProps {
  data: WhyUsData;
}

export default function WhyUs({ data }: WhyUsProps) {
  const { heading, tagline, taglineHighlight, items } = data;

  // Active slide index: strictly default to 1 = Slide 2 ("Master Storytellers")
  const [activeIndex, setActiveIndex] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const subheadingRef = useRef<HTMLDivElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const innerCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const touchStartXRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // Helper to calculate pixel-perfect target X translation for any slide index
  const getTargetX = useCallback((index: number) => {
    const container = sliderContainerRef.current;
    const activeCard = cardElementsRef.current[index];
    if (!container || !activeCard) return 0;

    const containerWidth = container.offsetWidth;
    const cardLeft = activeCard.offsetLeft;
    const cardWidth = activeCard.offsetWidth;

    return containerWidth / 2 - (cardLeft + cardWidth / 2);
  }, []);

  // Navigation handlers
  const goToSlide = useCallback(
    (index: number) => {
      const total = items.length;
      const normalized = ((index % total) + total) % total;
      setActiveIndex(normalized);
    },
    [items.length]
  );

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Automatic Slider Timer: ONLY runs when section is visible in viewport!
  // Prevents slider from cycling in background before user even scrolls to it.
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (isInView && !isPaused) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isInView, isPaused, nextSlide, activeIndex]);

  // =========================================================================
  // THE PRISTINE SCALE UP / DOWN GLIDE ANIMATION (100% UNTOUCHED)
  // =========================================================================
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Initial Mount: position track and cards instantly without transition
    if (isInitialMount.current) {
      isInitialMount.current = false;

      const initialX = getTargetX(activeIndex);
      gsap.set(trackRef.current, { x: initialX });

      items.forEach((_, idx) => {
        const cardWrapper = cardElementsRef.current[idx];
        const innerCard = innerCardRefs.current[idx];
        const isActive = idx === activeIndex;

        if (cardWrapper) cardWrapper.style.zIndex = isActive ? "30" : "10";
        if (innerCard) {
          gsap.set(innerCard, {
            scale: isActive ? 1.10 : 0.85,
            opacity: isActive ? 1.0 : 0.40,
            transformOrigin: "center 30%",
          });
        }
      });
      return;
    }

    // 2. Active Slide Changed: Silky-smooth scale-down (outgoing) & scale-up (incoming) glide transition
    const targetX = getTargetX(activeIndex);
    const duration = 1.05;
    const ease = "power2.inOut";

    // Smoothly slide the track
    gsap.to(trackRef.current, {
      x: targetX,
      duration,
      ease,
      overwrite: "auto",
    });

    // Animate every card: outgoing shrinks, incoming expands
    items.forEach((_, idx) => {
      const cardWrapper = cardElementsRef.current[idx];
      const innerCard = innerCardRefs.current[idx];
      if (!cardWrapper || !innerCard) return;

      const isActive = idx === activeIndex;

      // Z-index: active card rises above immediately
      if (isActive) {
        cardWrapper.style.zIndex = "30";
      } else {
        gsap.delayedCall(0.5, () => {
          if (idx !== activeIndex && cardWrapper) {
            cardWrapper.style.zIndex = "10";
          }
        });
      }

      // Smooth scale and opacity flow
      gsap.to(innerCard, {
        scale: isActive ? 1.10 : 0.85,
        opacity: isActive ? 1.0 : 0.40,
        duration,
        ease,
        overwrite: "auto",
      });
    });
  }, [activeIndex, items, getTargetX]);

  // Viewport tracking & First-visit guarantee for Slide 2
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. As soon as Why Us enters viewport on first visit: ensure Slide 2 is centered
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        once: true,
        onEnter: () => {
          const targetX = getTargetX(1);
          if (targetX !== 0 && trackRef.current) {
            gsap.set(trackRef.current, { x: targetX });
          }
        },
      });

      // 2. Viewport visibility observer: auto-slide only starts once user reaches the section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => setIsInView(true),
        onLeave: () => setIsInView(false),
        onEnterBack: () => setIsInView(true),
        onLeaveBack: () => setIsInView(false),
      });

      // 3. Subheading play-once reveal
      if (subheadingRef.current) {
        gsap.from(subheadingRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
          opacity: 0,
          y: 18,
          filter: "blur(8px)",
          duration: 0.8,
          ease: "power2.out",
        });
      }

      // 4. Slider container play-once reveal
      if (sliderContainerRef.current) {
        gsap.from(sliderContainerRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
          opacity: 0,
          y: 35,
          duration: 0.9,
          ease: "power2.out",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [getTargetX]);

  // Resize handler to re-align track smoothly
  useEffect(() => {
    const handleResize = () => {
      const targetX = getTargetX(activeIndex);
      gsap.set(trackRef.current, { x: targetX });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeIndex, getTargetX]);

  // Touch swipe navigation for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartXRef.current = null;
  };

  return (
    <section
      id="why-us"
      ref={sectionRef}
      className="relative w-full bg-[#F8F6F0] overflow-hidden select-none pt-10 sm:pt-12 lg:pt-14 xl:pt-16 pb-12 sm:pb-14 lg:pb-16 xl:pb-20"
    >
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/images/texture/bg-texture.png"
          alt="Texture"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-85 mix-blend-multiply"
        />
      </div>

      <div className="relative z-10 w-full max-w-[1600px] 2xl:max-w-[1760px] mx-auto container-padding flex flex-col items-center justify-center">
        {/* ============================================================== */}
        {/* HEADER: "Why Us" in Voyage + Subheading (Play Once Reveal)     */}
        {/* ============================================================== */}
        <div className="text-center flex flex-col items-center justify-center mb-6 sm:mb-8 lg:mb-10">
          {/* Main Title with CharBlurDissolve animation */}
          <CharBlurDissolveHeading
            text={heading}
            as="h2"
            className="font-voyage text-[52px] sm:text-[68px] lg:text-[84px] xl:text-[98px] 2xl:text-[112px] text-[#121212] leading-none tracking-normal"
            triggerRef={sectionRef}
            start="top 75%"
          />

          {/* Subtitle with Play-Once ScrollTrigger Reveal */}
          <div
            ref={subheadingRef}
            className="flex items-center justify-center gap-2 sm:gap-2.5 mt-2.5 sm:mt-3 will-change-[transform,opacity,filter]"
          >
            <span className="font-segoe text-[11px] sm:text-[12px] xl:text-[13px] tracking-[0.24em] font-semibold text-[#121212]/80 uppercase">
              {tagline}
            </span>
            <span className="inline-block bg-[#AEE2F2] px-2.5 sm:px-3 py-0.5 rounded-[4px] text-[11px] sm:text-[12px] xl:text-[13px] font-segoe font-semibold tracking-[0.20em] text-[#121212] uppercase shadow-[0_2px_8px_rgba(174,226,242,0.35)]">
              {taglineHighlight}
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SLIDER TRACK: Fluid, Continuous Scale-Down / Scale-Up Flow     */}
        {/* ============================================================== */}
        <div
          ref={sliderContainerRef}
          className="relative w-full overflow-hidden pt-4 pb-12 sm:pt-8 sm:pb-14 lg:pt-10 lg:pb-16 will-change-[transform,opacity]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Slider Row Container */}
          <div
            ref={trackRef}
            className="flex items-start will-change-transform"
          >
            {items.map((item, idx) => {
              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    cardElementsRef.current[idx] = el;
                  }}
                  onClick={() => goToSlide(idx)}
                  className="shrink-0 w-[85vw] max-w-[360px] sm:w-[58vw] sm:max-w-[460px] lg:w-[36vw] lg:max-w-[500px] xl:w-[32vw] xl:max-w-[540px] 2xl:w-[540px] px-3 sm:px-4 lg:px-5 cursor-pointer will-change-transform"
                >
                  {/* Inner Card that smoothly scales down and up in lockstep */}
                  <div
                    ref={(el) => {
                      innerCardRefs.current[idx] = el;
                    }}
                    className="flex flex-col items-center text-center w-full will-change-transform"
                    style={{
                      transformOrigin: "center 30%",
                    }}
                  >
                    {/* 1. Image Container: Subtle rounded corners and shadow */}
                    <div className="relative w-full aspect-[480/300] rounded-[6px] sm:rounded-[8px] overflow-hidden bg-[#EAE7DF] border border-[#E8E4DA] shadow-[0_12px_36px_rgba(0,0,0,0.12)] will-change-transform">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 768px) 85vw, (max-width: 1280px) 40vw, 540px"
                        className="object-cover object-center"
                        loading="lazy"
                      />
                    </div>

                    {/* 2. Text Details Below Image (Center Aligned with breathing space) */}
                    <div className="mt-5 sm:mt-6 w-full flex flex-col items-center text-center">
                      {/* Title in Voyage font */}
                      <h3 className="font-voyage text-[24px] sm:text-[28px] lg:text-[32px] xl:text-[36px] 2xl:text-[40px] text-[#121212] leading-[1.15] tracking-tight text-center">
                        {item.title}
                      </h3>

                      {/* Paragraph with breathing space */}
                      <div className="mt-2.5 sm:mt-3 max-w-[420px] mx-auto text-center">
                        <Paragraph className="font-segoe text-[12px] sm:text-[13px] xl:text-[14px] text-[#121212]/75 font-normal leading-[1.6] text-center">
                          {item.description}
                        </Paragraph>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* BOTTOM PAGINATION: Numbers 1 2 3 4 5                           */}
        {/* Wide spacing between numbers, active rounded pill              */}
        {/* ============================================================== */}
        <div className="flex items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 xl:gap-24 mt-2 sm:mt-3 lg:mt-4">
          {items.map((item, idx) => {
            const isActive = idx === activeIndex;

            return (
              <button
                key={`page-${item.id}`}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${item.number}`}
                className={`transition-colors duration-300 font-segoe text-[13px] sm:text-[14px] ${
                  isActive
                    ? "bg-[#E6DFD3] text-[#121212] font-semibold px-5 sm:px-6 py-1.5 sm:py-2 rounded-[6px] shadow-sm"
                    : "text-[#121212]/40 hover:text-[#121212] px-3 py-1.5 font-medium cursor-pointer"
                }`}
              >
                {item.number}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
