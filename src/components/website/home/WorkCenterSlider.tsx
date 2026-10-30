"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { gsap, splitTextChars } from "@/utils/gsap";

export interface CenterSlideItem {
  id: string;
  title: string;
  image: string;
  alt: string;
  accent?: string;
}

const DEFAULT_SLIDES: CenterSlideItem[] = [
  {
    id: "slide-1",
    title: "The Ark Tribeca",
    image: "/images/our-work/work-c1main3.webp",
    alt: "The Ark Tribeca Acropolis",
    accent: "brightness-100",
  },
  {
    id: "slide-2",
    title: "Acropolis Heights",
    image: "/images/our-work/work-c1main3.webp",
    alt: "Acropolis Heights",
    accent: "brightness-105 contrast-105",
  },
  {
    id: "slide-3",
    title: "Voyage To The Stars",
    image: "/images/our-work/work-c1main3.webp",
    alt: "Voyage To The Stars",
    accent: "brightness-95 contrast-110",
  },
  {
    id: "slide-4",
    title: "Imperial Canopy",
    image: "/images/our-work/work-c1main3.webp",
    alt: "Imperial Canopy",
    accent: "brightness-100 contrast-100",
  },
];

interface WorkCenterSliderProps {
  slides?: CenterSlideItem[];
  autoPlayInterval?: number; // duration in seconds (default 4s)
  className?: string;
  isFullscreen?: boolean;
}

export function WorkCenterSlider({
  slides = DEFAULT_SLIDES,
  autoPlayInterval = 2.0,
  className = "",
  isFullscreen = false,
}: WorkCenterSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);

  const currentIndexRef = useRef(0);
  currentIndexRef.current = currentIndex;

  const containerRef = useRef<HTMLDivElement>(null);
  const slideLayersRef = useRef<(HTMLDivElement | null)[]>([]);
  const imgLayersRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressCircleRef = useRef<SVGCircleElement>(null);

  const isTransitioningRef = useRef(false);
  const timerTweenRef = useRef<gsap.core.Tween | null>(null);

  // SVG loading circle dimensions for button progress ring
  const circleRadius = 26;
  const strokeWidth = 2.2;
  const circumference = 2 * Math.PI * circleRadius;

  // Dedicated slide transition with curtain wipe reveal & scale parallax
  const goToSlide = useCallback(
    (targetIndex: number, direction: "next" | "prev" = "next") => {
      const fromIdx = currentIndexRef.current;
      if (isTransitioningRef.current || targetIndex === fromIdx) return;
      isTransitioningRef.current = true;

      // 1. Kill active countdown tween immediately & reset loading ring
      if (timerTweenRef.current) {
        timerTweenRef.current.kill();
        timerTweenRef.current = null;
      }
      if (progressCircleRef.current) {
        progressCircleRef.current.style.strokeDashoffset = `${circumference}`;
      }

      // 2. Set incoming index for text wave transition
      setIncomingIndex(targetIndex);

      const outgoingLayer = slideLayersRef.current[fromIdx];
      const incomingLayer = slideLayersRef.current[targetIndex];
      const outgoingImg = imgLayersRef.current[fromIdx];
      const incomingImg = imgLayersRef.current[targetIndex];

      // Prepare incoming slide underneath outgoing slide (zero blink, zero flash)
      if (incomingLayer) {
        gsap.set(incomingLayer, {
          visibility: "visible",
          zIndex: 1,
          clipPath: "inset(0% 0% 0% 0%)",
        });
      }
      if (outgoingLayer) {
        gsap.set(outgoingLayer, {
          visibility: "visible",
          zIndex: 2,
          clipPath: "inset(0% 0% 0% 0%)",
        });
      }

      // Initial scale parallax on incoming image (glide from right/left to center)
      if (incomingImg) {
        const startX = direction === "next" ? -180 : 180;
        gsap.set(incomingImg, {
          scale: 1.5,
          x: startX,
        });
      }

      // 3. Execute simultaneous curtain wipe reveal + image scale parallax + character wave
      setTimeout(() => {
        const outgoingChars = containerRef.current?.querySelectorAll(".wave-char-outgoing");
        const incomingChars = containerRef.current?.querySelectorAll(".wave-char-incoming");

        const tl = gsap.timeline({
          onComplete: () => {
            // Commit final states cleanly without any flash
            if (outgoingLayer) {
              gsap.set(outgoingLayer, {
                visibility: "hidden",
                zIndex: 1,
                clipPath: "inset(0% 0% 0% 0%)",
                clearProps: "clipPath",
              });
            }
            if (outgoingImg) {
              gsap.set(outgoingImg, { x: 0, scale: 1.0, clearProps: "transform" });
            }
            if (incomingLayer) {
              gsap.set(incomingLayer, {
                visibility: "visible",
                zIndex: 2,
                clipPath: "inset(0% 0% 0% 0%)",
                clearProps: "clipPath",
              });
            }
            if (incomingImg) {
              gsap.set(incomingImg, { x: 0, scale: 1.0, clearProps: "transform" });
            }

            // Update React state
            currentIndexRef.current = targetIndex;
            setCurrentIndex(targetIndex);
            setIncomingIndex(null);
            isTransitioningRef.current = false;

            // Automatically restart countdown for the next slide
            startCountdown();
          },
        });

        // A. Curtain Reveal: Outgoing layer wipes like a curtain from right to left
        if (outgoingLayer) {
          const targetClip =
            direction === "next"
              ? "inset(0% 100% 0% 0%)"
              : "inset(0% 0% 0% 100%)";

          tl.to(
            outgoingLayer,
            {
              clipPath: targetClip,
              duration: 0.95,
              ease: "power2.inOut",
            },
            0
          );
        }

        // B. Outgoing Image Subtle Parallax Drift
        if (outgoingImg) {
          const driftX = direction === "next" ? -35 : 35;
          tl.to(
            outgoingImg,
            {
              x: driftX,
              duration: 0.95,
              ease: "power2.inOut",
            },
            0
          );
        }

        // C. Incoming Image Scale Parallax to Center
        if (incomingImg) {
          tl.to(
            incomingImg,
            {
              scale: 1.0,
              x: 0,
              duration: 0.95,
              ease: "power2.out",
            },
            0
          );
        }

        // D. Text Wave Dissolve Out
        if (outgoingChars && outgoingChars.length > 0) {
          tl.to(
            outgoingChars,
            {
              opacity: 0,
              filter: "blur(10px)",
              y: -6,
              stagger: 0.015,
              duration: 0.35,
              ease: "power2.in",
            },
            0
          );
        }

        // E. Text Wave Resolve In
        if (incomingChars && incomingChars.length > 0) {
          tl.fromTo(
            incomingChars,
            {
              opacity: 0,
              filter: "blur(12px)",
              y: 8,
            },
            {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              stagger: 0.02,
              duration: 0.5,
              ease: "power2.out",
            },
            0.15
          );
        }
      }, 20);
    },
    [circumference]
  );

  // Dedicated Auto Countdown Timer (Direct DOM update, 0 React re-renders during tick)
  const startCountdown = useCallback(() => {
    if (timerTweenRef.current) {
      timerTweenRef.current.kill();
      timerTweenRef.current = null;
    }

    // Reset circle stroke offset
    if (progressCircleRef.current) {
      progressCircleRef.current.style.strokeDashoffset = `${circumference}`;
    }

    const state = { p: 0 };

    timerTweenRef.current = gsap.to(state, {
      p: 1,
      duration: autoPlayInterval,
      ease: "none",
      onUpdate: () => {
        if (progressCircleRef.current) {
          const offset = circumference * (1 - state.p);
          progressCircleRef.current.style.strokeDashoffset = `${offset}`;
        }
      },
      onComplete: () => {
        const next = (currentIndexRef.current + 1) % slides.length;
        goToSlide(next, "next");
      },
    });
  }, [autoPlayInterval, circumference, slides.length, goToSlide]);

  // Initial mount trigger
  useEffect(() => {
    startCountdown();
    return () => {
      timerTweenRef.current?.kill();
    };
  }, [startCountdown]);

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = (currentIndexRef.current + 1) % slides.length;
    goToSlide(next, "next");
  };

  const handlePrevClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const prev = (currentIndexRef.current - 1 + slides.length) % slides.length;
    goToSlide(prev, "prev");
  };

  const currentSlide = slides[currentIndex];
  const targetSlide = incomingIndex !== null ? slides[incomingIndex] : null;

  return (
    <div
      ref={containerRef}
      className={`work-card-wrapper group relative w-full ${isFullscreen ? "h-full rounded-none" : "aspect-[906/373] rounded-[14px] lg:rounded-[18px] 2xl:rounded-[20px]"
        } overflow-hidden shadow-[0_6px_20px_-4px_rgba(0,0,0,0.1)] transition-all duration-400 select-none ${className}`}
    >
      {/* ALL SLIDES PERSISTENTLY RENDERED IN DOM: Eliminates ANY millisecond image blink */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          ref={(el) => {
            slideLayersRef.current[idx] = el;
          }}
          className="absolute inset-0 overflow-hidden"
          style={{
            zIndex: idx === currentIndex ? 2 : 1,
            visibility: idx === currentIndex ? "visible" : "hidden",
            clipPath: "inset(0% 0% 0% 0%)",
          }}
        >
          <div
            ref={(el) => {
              imgLayersRef.current[idx] = el;
            }}
            className={`relative w-full h-full [transform:translateZ(0)] [backface-visibility:hidden] ${slide.accent ?? ""}`}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              sizes="100vw"
              quality={90}
              className="object-cover object-center"
              priority={idx <= 1}
            />
          </div>
        </div>
      ))}

      {/* Atmospheric gradient overlay on image for contrast and editorial elegance */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-black/5 bg-gradient-to-t from-black/10 via-black/5 to-transparent" />

      {/* Bottom editorial content wrapper: Constrained to thumbnail max-width so it NEVER expands when the image scales */}
      <div className="slider-bottom-content absolute inset-x-0 bottom-3 sm:bottom-4 lg:bottom-5 z-30 pointer-events-none flex flex-col items-center will-change-transform">
        <div className="relative w-full max-w-[680px] sm:max-w-[720px] lg:max-w-[760px] 2xl:max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Slide Title with Text Wave Dissolve: Placed on the LEFT side above the line */}
          <div className="slider-title-wrapper pb-1.5 sm:pb-2 text-left will-change-transform pointer-events-none">
            <div className="relative">
              {incomingIndex !== null ? (
                <>
                  {/* Outgoing Title */}
                  <h4
                    className="font-voyage text-white text-[18px] sm:text-[21px] lg:text-[25px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] text-left"
                    style={{
                      fontFamily: "var(--font-voyage), Voyage, serif",
                      fontWeight: 400,
                      lineHeight: 1.1,
                    }}
                  >
                    {slides[currentIndex].title.split("").map((char, i) => (
                      <span
                        key={`out-${i}`}
                        className="wave-char-outgoing inline-block will-change-transform"
                      >
                        {char === " " ? "\u00A0" : char}
                      </span>
                    ))}
                  </h4>

                  {/* Incoming Title (layered directly in place) */}
                  <h4
                    className="absolute left-0 top-0 font-voyage text-white text-[18px] sm:text-[21px] lg:text-[25px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] text-left"
                    style={{
                      fontFamily: "var(--font-voyage), Voyage, serif",
                      fontWeight: 400,
                      lineHeight: 1.1,
                    }}
                  >
                    {slides[incomingIndex].title.split("").map((char, i) => (
                      <span
                        key={`in-${i}`}
                        className="wave-char-incoming inline-block will-change-transform opacity-0"
                      >
                        {char === " " ? "\u00A0" : char}
                      </span>
                    ))}
                  </h4>
                </>
              ) : (
                <h4
                  className="font-voyage text-white text-[18px] sm:text-[21px] lg:text-[25px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] text-left"
                  style={{
                    fontFamily: "var(--font-voyage), Voyage, serif",
                    fontWeight: 400,
                    lineHeight: 1.1,
                  }}
                >
                  {currentSlide.title}
                </h4>
              )}
            </div>
          </div>

          {/* Horizontal editorial line: Keeps exact thumbnail size and placement */}
          <div className="slider-divider-line w-full pb-3 sm:pb-3.5 lg:pb-4 pointer-events-none will-change-opacity">
            <div className="w-full h-px bg-white/25" />
          </div>

          {/* Bottom editorial controls: Centered Arrow buttons with loader, Counter on right */}
          <div className="slider-controls-wrapper relative w-full flex items-center justify-center will-change-transform pointer-events-auto">

            {/* Centered circular arrow buttons (White bg, refined size, half-circle path hover) */}
            <div className="slider-arrow-buttons flex items-center justify-center gap-3.5 sm:gap-4.5 will-change-transform">

              {/* Previous Button (White bg, decreased size, half-circle swoop hover) */}
              <button
                type="button"
                onClick={handlePrevClick}
                aria-label="Previous Slide"
                className="group/btn relative w-[44px] h-[44px] sm:w-[50px] sm:h-[50px] lg:w-[54px] lg:h-[54px] shrink-0 rounded-full bg-white text-[#111111] shadow-[0_4px_16px_rgba(0,0,0,0.25)] flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <div className="relative w-5 h-5 sm:w-6 sm:h-6 overflow-hidden flex items-center justify-center pointer-events-none">
                  {/* Primary Arrow: exits curving up-left along half-circle arc */}
                  <svg
                    className="absolute w-full h-full transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/btn:-translate-x-[160%] group-hover/btn:-translate-y-[80%] group-hover/btn:-rotate-[40deg] group-hover/btn:opacity-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>

                  {/* Follower Arrow: enters curving in from bottom-right along half-circle arc */}
                  <svg
                    className="absolute w-full h-full translate-x-[160%] translate-y-[80%] rotate-[40deg] opacity-0 transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/btn:translate-x-0 group-hover/btn:translate-y-0 group-hover/btn:rotate-0 group-hover/btn:opacity-100"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </div>
              </button>

              {/* Next Button with Concentric Circular Progress Loader Ring */}
              <div className="relative flex items-center justify-center shrink-0">

                {/* Concentric Circular Progress Loader Ring (Color: White) */}
                <svg
                  className="absolute pointer-events-none -rotate-90 w-[54px] h-[54px] sm:w-[60px] sm:h-[60px] lg:w-[66px] lg:h-[66px]"
                  viewBox="0 0 60 60"
                >
                  {/* Background Track Circle */}
                  <circle
                    cx="30"
                    cy="30"
                    r={circleRadius}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth={strokeWidth}
                  />

                  {/* Animated Countdown Progress Ring (White) */}
                  <circle
                    ref={progressCircleRef}
                    cx="30"
                    cy="30"
                    r={circleRadius}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                  />
                </svg>

                {/* Next Button (White bg, decreased size, half-circle swoop hover) */}
                <button
                  type="button"
                  onClick={handleNextClick}
                  aria-label="Next Slide"
                  className="group/btn relative w-[44px] h-[44px] sm:w-[50px] sm:h-[50px] lg:w-[54px] lg:h-[54px] rounded-full bg-white text-[#111111] shadow-[0_4px_16px_rgba(0,0,0,0.25)] flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <div className="relative w-5 h-5 sm:w-6 sm:h-6 overflow-hidden flex items-center justify-center pointer-events-none">
                    {/* Primary Arrow: exits curving up-right along half-circle arc */}
                    <svg
                      className="absolute w-full h-full transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/btn:translate-x-[160%] group-hover/btn:-translate-y-[80%] group-hover/btn:rotate-[40deg] group-hover/btn:opacity-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>

                    {/* Follower Arrow: enters curving in from bottom-left along half-circle arc */}
                    <svg
                      className="absolute w-full h-full -translate-x-[160%] translate-y-[80%] -rotate-[40deg] opacity-0 transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/btn:translate-x-0 group-hover/btn:translate-y-0 group-hover/btn:rotate-0 group-hover/btn:opacity-100"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>

            </div>

            {/* Slide counter inside a circle on the right side of the thumbnail width */}
            <div className="slider-counter absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none will-change-opacity">
              <div className="relative w-[44px] h-[44px] sm:w-[50px] sm:h-[50px] lg:w-[54px] lg:h-[54px] rounded-full border border-white/40 flex items-center justify-center backdrop-blur-[2px]">
                <span className="font-voyage text-[13px] sm:text-[15px] lg:text-[17px] text-white/95 tracking-wider">
                  {targetSlide ? incomingIndex! + 1 : currentIndex + 1}/{slides.length}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
