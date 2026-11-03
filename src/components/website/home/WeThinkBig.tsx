"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, splitTextChars } from "@/utils/gsap";
import { Paragraph } from "@/components/common/Typography";
import {
  charBlurInitialVars,
  charBlurAnimateVars,
} from "@/components/animations/CharBlurDissolveHeading";
import Button from "@/components/common/Button";
import type { WeThinkBigData, ReelItem } from "@/types/home";

interface WeThinkBigProps {
  data: WeThinkBigData;
}

export default function WeThinkBig({ data }: WeThinkBigProps) {
  const {
    reels,
    headingLine1,
    headingLine2Part1,
    headingLine2Highlight,
    description,
    buttonLink,
  } = data;

  // Active slide index: strictly default to 1 = Reel 2 ("02 / BRANDS")
  const [activeIndex, setActiveIndex] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const headingCharsRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const innerCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const touchStartXRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);

  // Helper to calculate pixel-perfect target X translation for any reel
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
      const total = reels.length;
      const normalized = ((index % total) + total) % total;
      setActiveIndex(normalized);
    },
    [reels.length]
  );

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % reels.length);
  }, [reels.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + reels.length) % reels.length);
  }, [reels.length]);

  // Video playback management: play active video from start; advance when completed
  useEffect(() => {
    videoRefs.current.forEach((v, idx) => {
      if (!v) return;
      if (idx === activeIndex) {
        v.currentTime = 0;
        if (!isPaused) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      } else {
        // Keep inactive reels playing silently
        v.play().catch(() => {});
      }
    });
  }, [activeIndex, isPaused]);

  // =========================================================================
  // GSAP REEL SLIDER ANIMATION: Long Active Reel & Shorter Inactive Reels
  // =========================================================================
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initial Mount: position track and cards instantly without transition
    if (isInitialMount.current) {
      isInitialMount.current = false;

      const initialX = getTargetX(activeIndex);
      gsap.set(trackRef.current, { x: initialX });

      reels.forEach((_, idx) => {
        const cardWrapper = cardElementsRef.current[idx];
        const innerCard = innerCardRefs.current[idx];
        const isActive = idx === activeIndex;

        if (cardWrapper) cardWrapper.style.zIndex = isActive ? "30" : "10";
        if (innerCard) {
          gsap.set(innerCard, {
            scale: isActive ? 1.15 : 0.82,
            opacity: isActive ? 1.0 : 0.45,
            transformOrigin: "center center",
          });
        }
      });
      return;
    }

    // Active Slide Changed: Silky-smooth scale-down & scale-up glide transition
    const targetX = getTargetX(activeIndex);
    const duration = 0.95;
    const ease = "power2.inOut";

    // Slide the track
    gsap.to(trackRef.current, {
      x: targetX,
      duration,
      ease,
      overwrite: "auto",
    });

    // Animate every reel card: outgoing shrinks, incoming expands tall & long
    reels.forEach((_, idx) => {
      const cardWrapper = cardElementsRef.current[idx];
      const innerCard = innerCardRefs.current[idx];
      if (!cardWrapper || !innerCard) return;

      const isActive = idx === activeIndex;

      // Z-index management
      if (isActive) {
        cardWrapper.style.zIndex = "30";
      } else {
        gsap.delayedCall(0.4, () => {
          if (idx !== activeIndex && cardWrapper) {
            cardWrapper.style.zIndex = "10";
          }
        });
      }

      // Smooth scale and opacity flow: active is long & tall (1.15), inactive is small (0.82)
      gsap.to(innerCard, {
        scale: isActive ? 1.15 : 0.82,
        opacity: isActive ? 1.0 : 0.45,
        duration,
        ease,
        overwrite: "auto",
      });
    });
  }, [activeIndex, reels, getTargetX]);

  // Entrance Reveal Animation (Play Once) + Guarantee Reel 2 on First Visit
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const headingChars = headingCharsRef.current?.querySelectorAll<HTMLElement>(
        ".thinkbig-char-item"
      );

      // Initial hidden states
      if (headingChars && headingChars.length > 0) {
        gsap.set(headingChars, charBlurInitialVars);
      }
      if (badgeRef.current) {
        gsap.set(badgeRef.current, {
          opacity: 0,
          scale: 0.9,
          filter: "blur(8px)",
        });
      }
      if (leftContentRef.current) {
        const otherContent = leftContentRef.current.querySelectorAll(
          ".thinkbig-reveal-item"
        );
        gsap.set(otherContent, {
          opacity: 0,
          y: 24,
        });
      }
      if (sliderContainerRef.current) {
        gsap.set(sliderContainerRef.current, {
          opacity: 0,
          x: 40,
        });
      }

      // Play-Once ScrollTrigger Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      // 1. Heading chars blur dissolve
      if (headingChars && headingChars.length > 0) {
        tl.to(headingChars, charBlurAnimateVars, 0);
      }

      // 2. Cyan badge reveals
      if (badgeRef.current) {
        tl.to(
          badgeRef.current,
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power2.out",
          },
          0.3
        );
      }

      // 3. Paragraph & CTA button float up
      if (leftContentRef.current) {
        const otherContent = leftContentRef.current.querySelectorAll(
          ".thinkbig-reveal-item"
        );
        tl.to(
          otherContent,
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power2.out",
            stagger: 0.12,
          },
          0.4
        );
      }

      // 4. Right Reel Slider slides into view
      if (sliderContainerRef.current) {
        tl.to(
          sliderContainerRef.current,
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power2.out",
          },
          0.4
        );
      }

      // 5. Guarantee Reel 2 is centered and playing upon first entrance
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        once: true,
        onEnter: () => {
          setActiveIndex(1);
          const targetX = getTargetX(1);
          if (targetX !== 0 && trackRef.current) {
            gsap.set(trackRef.current, { x: targetX });
          }
          const reel2Video = videoRefs.current[1];
          if (reel2Video) {
            reel2Video.currentTime = 0;
            reel2Video.play().catch(() => {});
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [getTargetX]);

  // Window resize handler
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
    if (Math.abs(diff) > 35) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartXRef.current = null;
  };


  return (
    <section
      id="we-think-big"
      ref={sectionRef}
      className="relative w-full bg-[#F8F6F0] overflow-hidden select-none py-16 sm:py-20 lg:py-24 xl:py-28"
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

      <div className="relative z-10 w-full max-w-[1600px] 2xl:max-w-[1760px] mx-auto container-padding flex flex-col lg:flex-row lg:items-center justify-between gap-12 lg:gap-8 xl:gap-12">
        {/* ============================================================== */}
        {/* LEFT COLUMN: Headings ("We Think Big."), Description & CTA     */}
        {/* ============================================================== */}
        <div
          ref={leftContentRef}
          className="w-full lg:w-[46%] xl:w-[44%] 2xl:w-[42%] flex flex-col items-start text-left z-20 shrink-0"
        >
          {/* Main Title: Voyage font with CharBlurDissolve animation */}
          <h2
            ref={headingCharsRef}
            className="font-voyage text-[54px] sm:text-[68px] md:text-[80px] lg:text-[76px] xl:text-[96px] 2xl:text-[112px] text-[#121212] leading-[0.98] sm:leading-[0.96] tracking-tight will-change-transform [perspective:1200px] [transform-style:preserve-3d]"
          >
            {/* Line 1: "We" */}
            <div className="block">
              {splitTextChars(headingLine1).map((item, idx) => (
                <span
                  key={`line1-${idx}`}
                  className="inline-block will-change-[transform,filter,opacity] thinkbig-char-item"
                >
                  {item.char}
                </span>
              ))}
            </div>

            {/* Line 2: "Think Big." with cyan highlight badge behind "Big." */}
            <div className="flex items-center flex-wrap gap-x-2 sm:gap-x-3 mt-1 sm:mt-2">
              <span className="inline-block">
                {splitTextChars(headingLine2Part1).map((item, idx) => (
                  <span
                    key={`line2-part1-${idx}`}
                    className="inline-block will-change-[transform,filter,opacity] thinkbig-char-item"
                  >
                    {item.char}
                  </span>
                ))}
              </span>

              {/* Cyan Highlight Badge behind "Big." */}
              <span
                ref={badgeRef}
                className="inline-block bg-[#C5EAF9] px-2.5 sm:px-3.5 py-0.5 rounded-[4px] shadow-[0_2px_10px_rgba(197,234,249,0.45)] will-change-[transform,opacity,filter]"
              >
                {splitTextChars(headingLine2Highlight).map((item, idx) => (
                  <span
                    key={`line2-highlight-${idx}`}
                    className="inline-block text-[#121212]"
                  >
                    {item.char}
                  </span>
                ))}
              </span>
            </div>
          </h2>

          {/* Description Paragraph */}
          <div className="mt-6 sm:mt-8 max-w-[480px] xl:max-w-[520px] thinkbig-reveal-item will-change-[transform,opacity]">
            <Paragraph className="font-segoe text-[13px] sm:text-[14px] xl:text-[15px] text-[#121212]/75 font-normal leading-[1.65]">
              {description}
            </Paragraph>
          </div>

          {/* CTA Button */}
          <div className="mt-8 sm:mt-10 thinkbig-reveal-item will-change-[transform,opacity]">
            <Button
              href={buttonLink}
              variant="circle-arrow"
              iconPosition="left"
            >
              DISCOVER OUR STORY
            </Button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: Vertical Reel Carousel (No Borders/Outlines)     */}
        {/* ============================================================== */}
        <div
          ref={sliderContainerRef}
          className="w-full lg:w-[54%] xl:w-[56%] 2xl:w-[58%] overflow-hidden py-10 sm:py-14 will-change-[transform,opacity]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Reel Track Row */}
          <div
            ref={trackRef}
            className="flex items-center will-change-transform"
          >
            {reels.map((reel, idx) => {
              const isActive = idx === activeIndex;

              return (
                <div
                  key={reel.id}
                  ref={(el) => {
                    cardElementsRef.current[idx] = el;
                  }}
                  onClick={() => goToSlide(idx)}
                  className="shrink-0 w-[62vw] max-w-[210px] sm:w-[38vw] sm:max-w-[240px] md:max-w-[260px] lg:w-[28vw] lg:max-w-[250px] xl:w-[25vw] xl:max-w-[275px] 2xl:max-w-[290px] px-2 sm:px-2.5 lg:px-3 cursor-pointer will-change-transform"
                >
                  {/* Inner Card that smoothly scales down and up */}
                  {/* No outline, no border, subtle 4px rounded corner, long vertical aspect */}
                  <div
                    ref={(el) => {
                      innerCardRefs.current[idx] = el;
                    }}
                    className="relative w-full aspect-[9/17] rounded-[4px] sm:rounded-[5px] overflow-hidden shadow-[0_18px_48px_rgba(0,0,0,0.22)] will-change-transform"
                  >
                    {/* Portrait Video Reel: automatically advances on completion */}
                    <video
                      ref={(el) => {
                        videoRefs.current[idx] = el;
                      }}
                      src={reel.videoSrc}
                      autoPlay
                      muted
                      playsInline
                      preload="auto"
                      loop={!isActive}
                      onEnded={() => {
                        if (idx === activeIndex && !isPaused) {
                          nextSlide();
                        }
                      }}
                      className="w-full h-full object-cover object-center pointer-events-none"
                    />

                    {/* Top Gradient Overlay */}
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none z-10" />

                    {/* Top Tag Label (e.g. 01 / STRATEGY, 02 / BRANDS) */}
                    <div className="absolute top-3 sm:top-3.5 left-3 sm:left-3.5 z-20 pointer-events-none">
                      <span className="font-mono text-[9px] sm:text-[10px] xl:text-[11px] font-semibold tracking-[0.22em] text-white/95 uppercase drop-shadow-sm">
                        {reel.tag}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
