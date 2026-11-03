"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, ScrollTrigger, splitTextChars } from "@/utils/gsap";
import { Paragraph } from "@/components/common/Typography";
import {
  charBlurInitialVars,
  charBlurAnimateVars,
} from "@/components/animations/CharBlurDissolveHeading";
import type { FooterAcrossIndiaData } from "@/types/home";

interface FooterAcrossIndiaProps {
  data: FooterAcrossIndiaData;
}

interface FooterMapLocation {
  id: string;
  name: string;
  u: number;
  v: number;
  align: "left" | "right";
  offsetY?: number;
}

const FOOTER_MAP_LOCATIONS: FooterMapLocation[] = [
  { id: "noida", name: "Noida", u: 0.465, v: 0.42, align: "right", offsetY: -16 },
  { id: "gurgaon", name: "Gurgaon", u: 0.466, v: 0.45, align: "right", offsetY: 12 },
  { id: "mumbai", name: "Mumbai", u: 0.435, v: 0.59, align: "left" },
  { id: "pune", name: "Pune", u: 0.44, v: 0.62, align: "right" },
  { id: "hyderabad", name: "Hyderabad", u: 0.5035, v: 0.654, align: "right" },
  { id: "bangalore", name: "Bangalore", u: 0.4722, v: 0.7472, align: "right" },
];

const matchOfficeToLocation = (officeId: string, locationId: string) => {
  if (officeId === locationId) return true;
  if (
    (locationId === "bangalore" &&
      (officeId === "pune-2" || officeId === "bangalore" || officeId === "bengaluru")) ||
    (officeId === "bangalore" &&
      (locationId === "pune-2" || locationId === "bangalore" || locationId === "bengaluru"))
  ) {
    return true;
  }
  return false;
};

const getMappedLocationId = (officeId: string) => {
  if (officeId === "pune-2" || officeId === "bengaluru") return "bangalore";
  return officeId;
};

export default function FooterAcrossIndia({ data }: FooterAcrossIndiaProps) {
  const { heading, subheading, offices, mapImageSrc, mapImageAlt, phone, email, copyright } = data;

  const [activeOfficeId, setActiveOfficeId] = useState<string>("noida");

  const sectionRef = useRef<HTMLElement>(null);
  const headingCharsRef = useRef<HTMLHeadingElement>(null);
  const officesRef = useRef<HTMLDivElement>(null);
  const mapImageRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef<(HTMLDivElement | null)[]>([]);
  const virtualCursorRef = useRef<HTMLDivElement>(null);
  const tourTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const pinCoordsRef = useRef<{ id: string; name: string; px: number; py: number }[]>([]);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isUserHoveringRef = useRef<boolean>(false);

  // Dynamic pin positioning calculation matching object-cover object-top
  const updatePinPositions = useCallback(() => {
    const container = mapImageRef.current;
    if (!container) return null;

    const W = container.clientWidth;
    const H = container.clientHeight;
    if (W === 0 || H === 0) return null;

    const naturalWidth = 1923;
    const naturalHeight = 803;
    const scale = Math.max(W / naturalWidth, H / naturalHeight);

    const drawWidth = naturalWidth * scale;
    const drawHeight = naturalHeight * scale;
    const offsetX = (W - drawWidth) * 0.5;
    const offsetY = 0; // object-top

    const coords = FOOTER_MAP_LOCATIONS.map((loc, idx) => {
      const px = offsetX + loc.u * drawWidth;
      const py = offsetY + loc.v * drawHeight;
      const pinEl = pinRefs.current[idx];
      if (pinEl) {
        pinEl.style.left = `${px}px`;
        pinEl.style.top = `${py}px`;
      }
      return { id: loc.id, name: loc.name, px, py };
    });

    pinCoordsRef.current = coords;
    return { drawWidth, drawHeight, offsetX, offsetY, coords };
  }, []);

  // Construct and run the continuous, infinite looping tour sequence
  const createTourTimeline = useCallback(() => {
    if (tourTimelineRef.current) {
      tourTimelineRef.current.kill();
      tourTimelineRef.current = null;
    }

    const container = mapImageRef.current;
    const cursor = virtualCursorRef.current;
    if (!container || !cursor) return;

    const res = updatePinPositions();
    if (!res) return;
    const { coords } = res;

    // Position cursor at Noida initially
    gsap.set(cursor, {
      left: coords[0].px,
      top: coords[0].py,
      opacity: isUserHoveringRef.current ? 0 : 1,
      scale: 0.9,
    });

    const tl = gsap.timeline({
      repeat: -1,
      paused: isUserHoveringRef.current,
    });

    coords.forEach((loc, idx) => {
      const labelName = `loc-${loc.id}`;

      // 1. Move cursor smoothly to next location
      tl.to(cursor, {
        left: loc.px,
        top: loc.py,
        duration: idx === 0 ? 0.35 : 0.65,
        ease: "power2.inOut",
      });

      // 2. Set label so hover can jump directly here
      tl.addLabel(labelName);

      // 3. Highlight location & pulse ripple upon arrival
      tl.call(() => {
        if (!isUserHoveringRef.current) {
          setActiveOfficeId(loc.id);
          const ripple = cursor.querySelector(".virtual-cursor-ripple");
          if (ripple) {
            gsap.fromTo(
              ripple,
              { scale: 0.6, opacity: 0.7 },
              { scale: 2.2, opacity: 0, duration: 0.45, ease: "power2.out" }
            );
          }
        }
      });

      // 4. Subtle cursor click action
      tl.to(cursor, {
        scale: 0.82,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
      });

      // 5. Showcase linger duration
      tl.to({}, { duration: 1.45 });
    });

    tourTimelineRef.current = tl;
  }, [updatePinPositions]);

  // Hover on either Address Card OR Map Pin: stops autoplay immediately and highlights hovered location
  const handleItemHover = useCallback((locationId: string) => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    isUserHoveringRef.current = true;

    const targetId = getMappedLocationId(locationId);
    setActiveOfficeId(targetId);

    const tl = tourTimelineRef.current;
    if (tl) {
      tl.pause();
      tl.seek(`loc-${targetId}`);
    }

    // Hide virtual cursor while human user has control
    const cursor = virtualCursorRef.current;
    if (cursor) {
      const pin = pinCoordsRef.current.find((p) => p.id === targetId);
      if (pin) {
        gsap.set(cursor, { left: pin.px, top: pin.py });
      }
      gsap.to(cursor, { opacity: 0, scale: 0.6, duration: 0.2 });
    }
  }, []);

  // Remove hover from Address Card OR Map Pin: resumes continuous autoplay seamlessly
  const handleItemLeave = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = setTimeout(() => {
      isUserHoveringRef.current = false;

      const cursor = virtualCursorRef.current;
      if (cursor) {
        gsap.to(cursor, {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: "power2.out",
        });
      }

      const tl = tourTimelineRef.current;
      if (tl) {
        tl.play();
      }
    }, 250);
  }, []);

  // Click on address card or pin
  const handleItemClick = useCallback(
    (locationId: string) => {
      handleItemHover(locationId);
    },
    [handleItemHover]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const handleResize = () => {
      updatePinPositions();
      createTourTimeline();
    };

    window.addEventListener("resize", handleResize);

    // Initial tour setup
    let tourTimer: NodeJS.Timeout | null = null;
    let attempts = 0;

    const checkAndInitTour = () => {
      const container = mapImageRef.current;
      if (!container || container.clientWidth === 0) {
        if (attempts++ < 15) {
          tourTimer = setTimeout(checkAndInitTour, 80);
        }
        return;
      }
      updatePinPositions();
      createTourTimeline();
    };

    checkAndInitTour();

    // IntersectionObserver to pause when out of view and resume when in view
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined" && sectionRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (!tourTimelineRef.current) {
                createTourTimeline();
              } else if (!isUserHoveringRef.current && tourTimelineRef.current.paused()) {
                tourTimelineRef.current.play();
              }
            } else {
              if (tourTimelineRef.current && !tourTimelineRef.current.paused()) {
                tourTimelineRef.current.pause();
              }
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(sectionRef.current);
    }

    const ctx = gsap.context(() => {
      // Heading chars initial state
      const headingChars =
        headingCharsRef.current?.querySelectorAll<HTMLElement>(".footer-char-item");
      if (headingChars && headingChars.length > 0) {
        gsap.set(headingChars, charBlurInitialVars);
      }

      // Office location cards initial state
      const officeCards =
        officesRef.current?.querySelectorAll<HTMLElement>(".office-card-item");
      if (officeCards && officeCards.length > 0) {
        gsap.set(officeCards, {
          opacity: 0,
          y: 18,
          filter: "blur(5px)",
        });
      }

      // Master ScrollTrigger timeline
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // A. Reveal heading characters with signature Char Blur Dissolve
      if (headingChars && headingChars.length > 0) {
        masterTl.to(
          headingChars,
          {
            ...charBlurAnimateVars,
            duration: 0.9,
            stagger: {
              from: "start",
              amount: 0.35,
              ease: "power2.out",
            },
          },
          0
        );
      }

      // B. Reveal office location cards with smooth stagger
      if (officeCards && officeCards.length > 0) {
        masterTl.to(
          officeCards,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.75,
            ease: "power2.out",
            stagger: 0.07,
          },
          0.2
        );
      }

      // C. Reveal 3D India globe image
      if (mapImageRef.current) {
        masterTl.fromTo(
          mapImageRef.current,
          {
            opacity: 0.3,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: "power2.out",
            onComplete: () => {
              updatePinPositions();
            },
          },
          0.1
        );
      }
    }, sectionRef);

    updatePinPositions();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (tourTimer) clearTimeout(tourTimer);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      if (observer) observer.disconnect();
      if (tourTimelineRef.current) {
        tourTimelineRef.current.kill();
      }
      ctx.revert();
    };
  }, [createTourTimeline, updatePinPositions]);

  return (
    <footer
      id="across-india"
      ref={sectionRef}
      className="relative w-full h-screen bg-[#F8F6F0] overflow-hidden select-none flex flex-col justify-between"
    >
      {/* Background Texture Overlay: Exact match with other sections */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/images/texture/bg-texture.png"
          alt="Texture"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-85 mix-blend-multiply"
        />
      </div>

      {/* Embedded CSS animations for orbiting glow on badges and cards */}
      <style>{`
        @keyframes pill-subtle-glow-orbit {
          0% {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), -4px 0 10px 0px rgba(255, 138, 0, 0.25);
          }
          25% {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 -4px 10px 0px rgba(255, 138, 0, 0.25);
          }
          50% {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 4px 0 10px 0px rgba(255, 138, 0, 0.25);
          }
          75% {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 4px 10px 0px rgba(255, 138, 0, 0.25);
          }
          100% {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), -4px 0 10px 0px rgba(255, 138, 0, 0.25);
          }
        }
        .pill-glow-minimal {
          animation: pill-subtle-glow-orbit 3.5s ease-in-out infinite;
        }

        @keyframes card-subtle-glow-orbit {
          0% {
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04), -4px 0 12px 0px rgba(255, 138, 0, 0.18);
          }
          25% {
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04), 0 -4px 12px 0px rgba(255, 138, 0, 0.18);
          }
          50% {
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04), 4px 0 12px 0px rgba(255, 138, 0, 0.18);
          }
          75% {
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04), 0 4px 12px 0px rgba(255, 138, 0, 0.18);
          }
          100% {
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04), -4px 0 12px 0px rgba(255, 138, 0, 0.18);
          }
        }
        .card-orbit-glow {
          animation: card-subtle-glow-orbit 3.5s ease-in-out infinite;
        }
      `}</style>

      {/* Top Content Area: Heading, Subtitle & Offices with guaranteed navbar clearance */}
      <div className="relative z-20 w-full max-w-[1320px] xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-22 xl:pt-20">
        {/* 1. Main Heading: Across India. (Voyage font + Char Blur Dissolve) */}
        <h2
          ref={headingCharsRef}
          className="font-voyage text-3xl sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[58px] 2xl:text-[64px] text-[#121212] font-normal leading-[1.08] tracking-tight text-center mb-1.5 will-change-[transform,opacity,filter] [perspective:1200px]"
        >
          {splitTextChars(heading).map((item, idx) => (
            <span
              key={`foot-${idx}`}
              className="footer-char-item inline-block will-change-[transform,filter,opacity]"
            >
              {item.char}
            </span>
          ))}
        </h2>

        {/* 2. Subtitle with medium space to address section */}
        <div className="text-center mb-6 sm:mb-7 lg:mb-8 xl:mb-9">
          <Paragraph className="text-[11px] sm:text-xs text-[#555555] font-segoe font-normal max-w-xl mx-auto leading-relaxed px-2">
            {subheading}
          </Paragraph>
        </div>

        {/* 3. Office Locations Responsive Grid: exact original address card background UI */}
        <div
          ref={officesRef}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 max-w-[1220px] mx-auto"
        >
          {offices.map((office) => {
            const isSelected = matchOfficeToLocation(office.id, activeOfficeId);
            return (
              <div
                key={office.id}
                onMouseEnter={() => handleItemHover(office.id)}
                onMouseLeave={handleItemLeave}
                onClick={() => handleItemClick(office.id)}
                className={`office-card-item relative group rounded-[14px] sm:rounded-[16px] p-2 sm:px-4 sm:py-3 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-start gap-1 sm:gap-3.5 min-h-[64px] sm:min-h-[76px] lg:min-h-[80px] ${
                  isSelected
                    ? "bg-white shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] border border-[#FF8A00]/25"
                    : "bg-transparent hover:bg-white/60 border border-transparent"
                }`}
              >
                {/* Continuous subtle moving orbit glow behind active card */}
                {isSelected && (
                  <div
                    className="absolute -inset-[2px] rounded-[16px] pointer-events-none -z-10 card-orbit-glow"
                    aria-hidden="true"
                  />
                )}

                {/* Left / Top: Dot + City + Phone */}
                <div className="w-full sm:w-[105px] lg:w-[115px] shrink-0 relative z-10">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 transition-transform duration-300"
                      style={{
                        backgroundColor: isSelected
                          ? "#FF8A00"
                          : office.dotColor || "#EF4444",
                        transform: isSelected ? "scale(1.15)" : "scale(1)",
                        boxShadow: isSelected
                          ? "0 0 6px rgba(255,138,0,0.6)"
                          : "none",
                      }}
                    />
                    <span className="font-segoe font-bold text-[10px] sm:text-xs tracking-wider text-[#1A1A1A] uppercase">
                      {office.city}
                    </span>
                  </div>
                  <p className="font-segoe text-[9px] sm:text-[11px] text-[#737373] pl-3 sm:pl-3.5 truncate">
                    {office.phone}
                  </p>
                </div>

                {/* Right / Bottom: Address */}
                <div className="w-full sm:flex-1 sm:border-l sm:border-black/[0.06] sm:pl-3 relative z-10">
                  <p className="font-segoe text-[9px] sm:text-[11px] lg:text-xs text-[#525252] leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {office.address}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. 3D INDIA GLOBE IMAGE WITH MAP PINS, BADGES & TOUR CURSOR    */}
      {/* Minimal clean gap to address section on all screen sizes       */}
      {/* ============================================================== */}
      <div
        ref={mapImageRef}
        className="absolute inset-x-0 bottom-0 h-[65%] sm:h-[68%] lg:h-[60%] xl:h-[65%] min-h-[520px] sm:min-h-[500px] max-h-[820px] w-full max-w-[1920px] mx-auto pointer-events-none z-10 overflow-hidden will-change-[transform,opacity]"
      >
        <Image
          src={mapImageSrc}
          alt={mapImageAlt}
          fill
          sizes="100vw"
          priority
          onLoad={() => {
            updatePinPositions();
          }}
          className="object-cover object-top select-none pointer-events-none"
        />

        {/* Ambient bottom gradient for contact bar readability without blacking out the map */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none z-10" />

        {/* Virtual Overview Tour Cursor */}
        <div
          ref={virtualCursorRef}
          className="absolute pointer-events-none z-50 will-change-[transform,opacity]"
          style={{
            left: 0,
            top: 0,
            opacity: 0,
          }}
          aria-hidden="true"
        >
          <div className="relative -translate-x-[3px] -translate-y-[2px]">
            {/* White Mouse Arrow Pointer */}
            <svg
              className="w-5 h-5 sm:w-5.5 sm:h-5.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 2L3 17L7.5 13.5L11 21L13.5 20L10 12.5L16 12L3 2Z"
                fill="#FFFFFF"
                stroke="#1A1A1A"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
            {/* Subtle ripple wave */}
            <span className="virtual-cursor-ripple absolute top-[2px] left-[3px] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-[#FF8A00] opacity-0 pointer-events-none" />
          </div>
        </div>

        {/* Location Pins & Solid Capsule Badges Overlay */}
        <div className="absolute inset-0 z-30 pointer-events-none select-none">
          {FOOTER_MAP_LOCATIONS.map((loc, idx) => {
            const isActive = activeOfficeId === loc.id;
            const isBadgeVisible = isActive;

            return (
              <div
                key={loc.id}
                ref={(el) => {
                  pinRefs.current[idx] = el;
                }}
                onMouseEnter={() => handleItemHover(loc.id)}
                onMouseLeave={handleItemLeave}
                onClick={() => handleItemClick(loc.id)}
                className="location-pin-item absolute left-0 top-0 will-change-[transform,opacity] pointer-events-auto transition-all duration-300 opacity-100 scale-100 cursor-pointer"
                style={{
                  transform: "translate3d(0, 0, 0)",
                  transformOrigin: "center center",
                }}
              >
                {/* Centered beacon wrapper with effortless hover detection */}
                <div className="relative flex items-center justify-center cursor-pointer group/pin -translate-x-1/2 -translate-y-1/2">
                  {/* Invisible extended hit area for effortless hover/click */}
                  <span className="absolute -inset-3 cursor-pointer" aria-hidden="true" />

                  {/* Outer pulsing beacon ring (subtly balanced ping) */}
                  <span
                    className={`absolute -inset-1 sm:-inset-1.5 rounded-full bg-[#FF8A00]/35 animate-ping pointer-events-none transition-all duration-300 ${
                      isActive
                        ? "opacity-80"
                        : "opacity-50 group-hover/pin:opacity-75"
                    }`}
                  />

                  {/* Soft ambient aura around beacon */}
                  <span
                    className={`absolute -inset-0.5 rounded-full bg-[#FF8A00]/20 blur-[2px] pointer-events-none transition-all duration-300 ${
                      isActive ? "opacity-80" : "opacity-40"
                    }`}
                  />

                  {/* Glowing orange beacon point with white border */}
                  <span
                    className={`relative rounded-full border-2 border-white bg-[#FF8A00] transition-all duration-300 flex items-center justify-center ${
                      isActive
                        ? "w-4 h-4 sm:w-4.5 sm:h-4.5 shadow-[0_0_12px_#FF8A00,0_0_4px_rgba(0,0,0,0.25)] scale-110"
                        : "w-3.5 h-3.5 sm:w-4 sm:h-4 shadow-[0_0_8px_#FF8A00,0_0_3px_rgba(0,0,0,0.2)] group-hover/pin:scale-110"
                    }`}
                  >
                    <span className="w-1 h-1 rounded-full bg-white" />
                  </span>

                  {/* Solid 2D Capsule Location Badge with Minimal Moving Glow */}
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 transition-all duration-300 ${
                      loc.align === "left"
                        ? "right-full mr-1.5"
                        : "left-full ml-1.5"
                    } ${
                      isBadgeVisible
                        ? "opacity-100 scale-100 pointer-events-auto"
                        : "opacity-0 scale-50 pointer-events-none"
                    }`}
                    style={{
                      marginTop: loc.offsetY ? `${loc.offsetY}px` : "0px",
                      transformOrigin:
                        loc.align === "left" ? "right center" : "left center",
                    }}
                  >
                    <div
                      style={{
                        animationDelay: `${idx * 0.65}s`,
                      }}
                      className="pill-glow-minimal group/badge relative rounded-full bg-[#FDF2E9] px-3 sm:px-3.5 py-1 sm:py-[3px] flex items-center justify-center transition-transform duration-300 cursor-pointer will-change-transform shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:scale-105"
                    >
                      <span className="font-segoe text-[11px] sm:text-[14px] font-medium tracking-wide text-[#121212] whitespace-nowrap">
                        {loc.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. BOTTOM COPYRIGHT & CONTACT BAR OVERLAYING GLOBE OCEAN       */}
      {/* ============================================================== */}
      <div className="relative z-20 w-full px-4 sm:px-10 lg:px-16 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-white/70 font-segoe text-[11px] sm:text-xs tracking-wider mt-auto pointer-events-none">
        {/* Left: Contact Info */}
        <div className="flex items-center gap-6 pointer-events-auto">
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <svg
              className="w-3.5 h-3.5 text-white/80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>{phone}</span>
          </a>

          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <svg
              className="w-3.5 h-3.5 text-white/80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>{email}</span>
          </a>
        </div>

        {/* Right: Copyright & Policies */}
        <div className="flex items-center gap-4 sm:gap-6 pointer-events-auto">
          <span className="text-white/60">{copyright}</span>
          <Link
            href="#privacy"
            className="hover:text-white transition-colors uppercase"
          >
            PRIVACY POLICY
          </Link>
        </div>
      </div>
    </footer>
  );
}
