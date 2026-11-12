"use client";

import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, splitTextChars } from "@/utils/gsap";
import { Paragraph } from "@/components/common/Typography";
import {
  charBlurInitialVars,
  charBlurAnimateVars,
} from "@/components/animations/CharBlurDissolveHeading";
import Button from "@/components/common/Button";
import type { MapSectionData } from "@/types/home";


// ───────────── Desktop frames ─────────────
const TOTAL_FRAMES = 55;
const FRAME_DIR = "/images/mapframe";
const FRAME_PREFIX = "compressed-frame_";
const FRAME_EXT = "webp";

const pad = (n: number) => String(n).padStart(3, "0");

const frameURLs = Array.from(
  { length: TOTAL_FRAMES },
  (_, i) => `${FRAME_DIR}/${FRAME_PREFIX}${pad(i + 1)}.${FRAME_EXT}`
);

// ───────────── Mobile frames ─────────────
// const MOBILE_TOTAL_FRAMES = 0;
// const MOBILE_FRAME_DIR = "/images/mapframe-mobile";
// const mobileFrameURLs = Array.from(
//   { length: MOBILE_TOTAL_FRAMES },
//   (_, i) => `${MOBILE_FRAME_DIR}/frame_${pad(i + 1)}.webp`
// );
// Later: const urls = isDesktop ? frameURLs : mobileFrameURLs;
// (add useIsDesktop and put isDesktop in the useEffect deps)

interface MapLocation {
  id: string;
  name: string;
  u: number;
  v: number;
  align: "left" | "right";
  offsetY?: number;
}

const MAP_LOCATIONS: MapLocation[] = [
  { id: "noida", name: "Noida", u: 0.667, v: 0.303, align: "right", offsetY: -20 },
  { id: "gurgaon", name: "Gurgaon", u: 0.667, v: 0.332, align: "right" },
  { id: "mumbai", name: "Mumbai", u: 0.630, v: 0.481, align: "left" },
  { id: "pune", name: "Pune", u: 0.634, v: 0.511, align: "right" },
  { id: "hyderabad", name: "Hyderabad", u: 0.700, v: 0.556, align: "right" },
  { id: "bangalore", name: "Bangalore", u: 0.672, v: 0.650, align: "right" },
];

interface MapSectionProps {
  data: MapSectionData;
}

export default function MapSection({ data }: MapSectionProps) {
  const {
    headingLine1,
    headingLine2Part1,
    headingLine2Highlight,
    headingLine3,
    description,
  } = data;

  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const highlightBadgeRef = useRef<HTMLSpanElement>(null);
  const paraRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const locationPinsContainerRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) return;

    const urls = frameURLs;
    const playhead = { frame: 0 };
    let images: HTMLImageElement[] = [];

    // ---------- Canvas helpers ----------
    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    };

    // Calculate and sync exact pixel position of each map pointer based on canvas draw transform
    const updatePinsPosition = (offsetX: number, offsetY: number, drawWidth: number, drawHeight: number) => {
      MAP_LOCATIONS.forEach((loc, idx) => {
        const pinEl = pinRefs.current[idx];
        if (pinEl) {
          const px = offsetX + loc.u * drawWidth;
          const py = offsetY + loc.v * drawHeight;
          pinEl.style.left = `${px}px`;
          pinEl.style.top = `${py}px`;
        }
      });
    };

    const drawFrame = (img?: HTMLImageElement) => {
      if (!img || !img.complete || img.naturalWidth === 0) return;

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = canvas.width / canvas.height;

      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      // focusX: 0.5 = center (desktop), 1 = keep right side (small screens)
      const focusX = window.innerWidth >= 1024 ? 0.5 : 1;

      if (imgRatio > canvasRatio) {
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) * focusX;
      } else {
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      canvasCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      updatePinsPosition(offsetX, offsetY, drawWidth, drawHeight);
    };

    const updateImage = () => drawFrame(images[Math.round(playhead.frame)]);

    setCanvasSize();

    // Preload all frames
    images = urls.map((url, i) => {
      const img = new window.Image();
      img.src = url;
      if (i === 0) {
        img.onload = () => {
          updateImage();
          canvas.style.opacity = "1";
        };
      }
      return img;
    });

    const ctx = gsap.context(() => {
      const headingChars = gsap.utils.toArray<HTMLElement>(".map-char-item");

      // 1. Initial hidden states
      gsap.set(headingChars, charBlurInitialVars);

      if (highlightBadgeRef.current) {
        gsap.set(highlightBadgeRef.current, {
          opacity: 0,
          scale: 0.85,
          filter: "blur(8px)",
        });
      }
      if (paraRef.current) {
        gsap.set(paraRef.current, { opacity: 0, y: 24, filter: "blur(14px)" });
      }
      if (buttonRef.current) {
        gsap.set(buttonRef.current, { opacity: 0, y: 20, filter: "blur(10px)" });
      }

      // 3. Scroll-scrubbed bidirectional sequence:
      // A. Frame scrub (0 to last frame 54)
      // B. Reveal 6 location capsule badges one by one on the map pointers
      // C. Reveal left editorial content (fully scrubbed so it reverses when scrolling back up!)
      // D. Hold pinned before smooth exit
      const FRAMES_DURATION = 1.0;
      const HOLD_DURATION = 0.6;

      const badgeElements = locationPinsContainerRef.current?.querySelectorAll<HTMLElement>(".location-pin-item");

      // Set initial badge state
      if (badgeElements && badgeElements.length > 0) {
        gsap.set(badgeElements, {
          opacity: 0,
          scale: 0.2,
          y: -16,
          transformOrigin: "center center",
        });
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=380%", // Generous scroll travel for frames + badges + content + hold
          pin: true,
          scrub: 0.8,
          anticipatePin: 0.3,
          invalidateOnRefresh: true,
        },
      });

      // Step 1: Scrub frames from 0 to last frame
      tl.to(playhead, {
        frame: images.length - 1,
        duration: FRAMES_DURATION,
        onUpdate: updateImage,
      });

      // Step 2: Location badges drop onto pointers one by one with 2D solid capsule bounce
      if (badgeElements && badgeElements.length > 0) {
        tl.to(
          badgeElements,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.22,
            stagger: 0.08,
            ease: "back.out(2.4)", // 2D solid capsule bounce!
          },
          FRAMES_DURATION // Starts immediately as the last frame locks in!
        );
      }

      // Step 3: Reveal left editorial content (SCRUBBED so it reverses on scroll back!)
      const contentStartTime = FRAMES_DURATION + (badgeElements ? badgeElements.length * 0.08 + 0.15 : 0.6);

      // Heading characters dissolve in
      tl.to(
        headingChars,
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          scale: 1,
          rotateX: 0,
          stagger: 0.012,
          duration: 0.35,
          ease: "power2.out",
        },
        contentStartTime
      );

      // "Growth" cyan highlight badge
      if (highlightBadgeRef.current) {
        tl.to(
          highlightBadgeRef.current,
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.25,
            ease: "power2.out",
          },
          contentStartTime + 0.12
        );
      }

      // Paragraph
      if (paraRef.current) {
        tl.to(
          paraRef.current,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.3,
            ease: "power2.out",
          },
          contentStartTime + 0.2
        );
      }

      // Explore button
      if (buttonRef.current) {
        tl.to(
          buttonRef.current,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.28,
            ease: "power2.out",
          },
          contentStartTime + 0.28
        );
      }

      // Step 4: Hold with map, pins, and left content fully visible before unpinning
      tl.to({}, { duration: HOLD_DURATION });
    }, section);

    const handleResize = () => {
      setCanvasSize();
      ScrollTrigger.refresh();
      updateImage();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, []);
  const renderCharSpan = (text: string, prefix: string) => {
    return splitTextChars(text).map((item, idx) => (
      <span
        key={`${prefix}-${idx}`}
        className="inline-block will-change-[transform,filter,opacity] map-char-item"
      >
        {item.char}
      </span>
    ));
  };

  return (
    <section
      id="map-section"
      ref={sectionRef}
      className="relative w-full h-screen min-h-[640px] bg-transparent overflow-hidden select-none flex items-center justify-start"
    >
      {/* ============================================================== */}
      {/* 1. BACKGROUND: canvas frame sequence (scroll scrubbed)         */}
      {/* ============================================================== */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block w-full h-full opacity-0 transition-opacity duration-500"
          aria-hidden="true"
        />
      </div>

      {/* Minimal moving glow animation for location badge pills */}
      <style>{`
        @keyframes pill-subtle-glow-orbit {
          0% {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), -7px 0 16px 0px rgba(255, 138, 0, 0.48), -3px 0 8px 0px rgba(255, 175, 75, 0.55);
          }
          25% {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 -6px 16px 0px rgba(255, 138, 0, 0.48), 0 -2px 8px 0px rgba(255, 175, 75, 0.55);
          }
          50% {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 7px 0 16px 0px rgba(255, 138, 0, 0.48), 3px 0 8px 0px rgba(255, 175, 75, 0.55);
          }
          75% {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 6px 16px 0px rgba(255, 138, 0, 0.48), 0 2px 8px 0px rgba(255, 175, 75, 0.55);
          }
          100% {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), -7px 0 16px 0px rgba(255, 138, 0, 0.48), -3px 0 8px 0px rgba(255, 175, 75, 0.55);
          }
        }
        .pill-glow-minimal {
          animation: pill-subtle-glow-orbit 3.5s ease-in-out infinite;
        }
      `}</style>

      {/* ============================================================== */}
      {/* 1.5 LOCATION PINS & SOLID CAPSULE BADGES OVERLAY               */}
      {/* ============================================================== */}
      <div
        ref={locationPinsContainerRef}
        className="absolute inset-0 z-10 pointer-events-none select-none overflow-hidden"
      >
        {MAP_LOCATIONS.map((loc, idx) => (
          <div
            key={loc.id}
            ref={(el) => {
              pinRefs.current[idx] = el;
            }}
            className="location-pin-item absolute left-0 top-0 will-change-[transform,opacity] pointer-events-auto opacity-0"
            style={{
              transform: "translate3d(0, 0, 0) scale(0)",
              transformOrigin: "center center",
            }}
          >
            {/* Glowing Pointer Beacon */}
            <div className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
              {/* Outer pulsing beacon ring */}
              <span className="absolute -inset-1.5 sm:-inset-2 rounded-full bg-[#FF8A00]/25 animate-ping pointer-events-none" />

              {/* Glowing orange beacon point with white border */}
              <span className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-white bg-[#FF8A00] shadow-[0_0_10px_#FF8A00,0_0_3px_rgba(0,0,0,0.25)] flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-white" />
              </span>

              {/* Solid 2D Capsule Location Badge with Minimal Moving Glow */}
              <div
                className={`absolute top-1/2 ${
                  loc.align === "left"
                    ? "right-[calc(100%+10px)] sm:right-[calc(100%+12px)]"
                    : "left-[calc(100%+10px)] sm:left-[calc(100%+12px)]"
                }`}
                style={{
                  transform: loc.offsetY
                    ? `translateY(calc(-50% + ${loc.offsetY}px))`
                    : "translateY(-50%)",
                }}
              >
                <div
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1.10,
                      y: -2,
                      duration: 0.25,
                      ease: "power2.out",
                    });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1,
                      y: 0,
                      duration: 0.35,
                      ease: "elastic.out(1.2, 0.4)",
                    });
                  }}
                  style={{
                    animationDelay: `${idx * 0.65}s`,
                  }}
                  className="pill-glow-minimal group/badge relative rounded-full bg-[#FDF2E9] px-3 sm:px-3.5 py-1 sm:py-[3px]! flex items-center justify-center transition-transform duration-300 cursor-pointer will-change-transform"
                >
                  <span className="font-segoe text-[11px] sm:text-[14px] font-normal tracking-wide text-[#121212] whitespace-nowrap">
                    {loc.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================== */}
      {/* 2. FOREGROUND CONTENT (left side)                              */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1760px] mx-auto container-padding">
        <div
          ref={leftContentRef}
          className="w-full lg:w-[54%] xl:w-[50%] 2xl:w-[46%] flex flex-col justify-center items-start text-left z-20"
        >
          <h2 className="font-voyage text-[36px] sm:text-[46px] md:text-[54px] lg:text-[58px] xl:text-[72px] 2xl:text-[88px] text-[#121212] leading-[1.08] tracking-tight will-change-transform [perspective:1200px] [transform-style:preserve-3d]">
            <span className="block">
              {renderCharSpan(headingLine1, "map-l1")}
            </span>

            <span className="block whitespace-nowrap pl-6 sm:pl-10 md:pl-12 lg:pl-12 xl:pl-16 2xl:pl-20 mt-0.5 sm:mt-1">
              <span className="inline-block mr-2 sm:mr-3">
                {renderCharSpan(headingLine2Part1, "map-l2")}
              </span>
              <span
                ref={highlightBadgeRef}
                className="inline-block bg-[#AEE2F2] px-2 sm:px-3 py-0.5 sm:py-1 rounded-[4px] sm:rounded-[6px] text-[#121212] shadow-[0_2px_12px_rgba(174,226,242,0.35)] will-change-[transform,opacity,filter] opacity-0"
              >
                {renderCharSpan(
                  headingLine2Highlight,
                  "map-l2-hl"
                )}
              </span>
            </span>

            <span className="block mt-0.5 sm:mt-1">
              {renderCharSpan(headingLine3, "map-l3")}
            </span>
          </h2>

          <div
            ref={paraRef}
            className="w-full max-w-[340px] sm:max-w-[360px] xl:max-w-[380px] pt-6 sm:pt-8 xl:pt-20"
          >
            <Paragraph className="font-segoe text-[12px] sm:text-[13px] xl:text-[14px] 2xl:text-[15px] leading-[1.6] tracking-[0.06em] font-medium text-[#222222]/85 uppercase">
              {description}
            </Paragraph>
          </div>

          <div ref={buttonRef} className="pt-6 sm:pt-8 xl:pt-10">
            <Button
              href="#work"
              variant="circle-arrow"
              iconPosition="left"
            >
              EXPLORE OUR WORK
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}