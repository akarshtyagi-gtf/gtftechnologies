"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, splitTextChars } from "@/utils/gsap";
import { SectionHeading, Paragraph } from "@/components/common/Typography";
import ContentReveal from "@/components/animations/ContentReveal";
import {
  charBlurInitialVars,
  charBlurAnimateVars,
} from "@/components/animations/CharBlurDissolveHeading";
import type { OurServicesData, ServiceItem } from "@/types/home";

const DEFAULT_SERVICES_LIST: ServiceItem[] = [
  {
    id: "service-1",
    counter: "01 / 05",
    tagline: "OUR SERVICES",
    titleLight: "BRAND",
    titleHighlight: "STRATEGY",
    buttonText: "EXPLORE SERVICES",
    description:
      "WE CREATE UNIQUE BRAND IDENTITIES AND STRATEGIES THAT HELP BUSINESSES CONNECT AND GROW.",
    badges: [
      "Competitor Analysis",
      "Brand Creation",
      "Brand Audits",
      "Concept Development",
      "Brand Hallmarks",
      "Target Segmentation",
    ],
    card: {
      id: "service-card-1",
      title: "Brand Strategy Chess",
      image: "/images/our-service/cardstack1.webp",
      alt: "Brand Strategy Chess King - Front Card",
    },
  },
  {
    id: "service-2",
    counter: "02 / 05",
    tagline: "OUR SERVICES",
    titleLight: "SOCIAL MEDIA",
    titleHighlight: "AMPLIFICATION",
    buttonText: "EXPLORE SERVICES",
    description:
      "LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE MAGNA ALIQUA.",
    badges: [
      "Content Creation",
      "Community Management",
      "Influencer Outreach",
      "Paid Campaigns",
      "Viral Growth",
      "Analytics & Insights",
    ],
    card: {
      id: "service-card-2",
      title: "Social Media Designs",
      image: "/images/our-service/card-stack3.webp",
      alt: "Grow Your Business with Powerful Social Media Designs",
    },
  },
  {
    id: "service-3",
    counter: "03 / 05",
    tagline: "OUR SERVICES",
    titleLight: "WEBSITE",
    titleHighlight: "CREATIVE",
    buttonText: "EXPLORE SERVICES",
    description:
      "LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI.",
    badges: [
      "UI/UX Design",
      "Next.js Development",
      "Interactive 3D",
      "Performance Tuning",
      "E-Commerce",
      "Headless CMS",
    ],
    card: {
      id: "service-card-3",
      title: "Web Development",
      image: "/images/our-service/card-stack2.webp",
      alt: "Build Your Website Laptop",
    },
  },
  {
    id: "service-4",
    counter: "04 / 05",
    tagline: "OUR SERVICES",
    titleLight: "DIGITAL",
    titleHighlight: "MARKETING",
    buttonText: "EXPLORE SERVICES",
    description:
      "LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. DUIS AUTE IRURE DOLOR IN REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM.",
    badges: [
      "Performance Marketing",
      "Search Engine Optimization",
      "Conversion Rate",
      "Audience Targeting",
      "Funnel Automation",
      "ROI Scaling",
    ],
    card: {
      id: "service-card-4",
      title: "Digital Marketing Acceleration",
      image: "/images/our-service/card-stack4.webp",
      alt: "Digital Marketing Strategy and Growth",
    },
  },
  {
    id: "service-5",
    counter: "05 / 05",
    tagline: "OUR SERVICES",
    titleLight: "AI",
    titleHighlight: "INNOVATION",
    buttonText: "EXPLORE SERVICES",
    description:
      "LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT, SUNT IN CULPA QUI OFFICIA.",
    badges: [
      "Generative AI",
      "Workflow Automation",
      "Custom LLM Integrations",
      "Predictive Analytics",
      "Cognitive Bots",
      "Data Intelligence",
    ],
    card: {
      id: "service-card-5",
      title: "AI Innovation & Intelligence",
      image: "/images/our-service/card-stack5.webp",
      alt: "AI Innovation and Autonomous Systems",
    },
  },
];

interface OurServicesProps {
  data?: OurServicesData;
}

export default function OurServices({ data }: OurServicesProps) {
  const services: ServiceItem[] =
    data?.services && data.services.length > 0
      ? data.services
      : DEFAULT_SERVICES_LIST;

  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const activeServiceIndexRef = useRef(0);

  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);

  // Big split intro heading refs
  const introHeadingRef = useRef<HTMLDivElement>(null);
  const innerHeadingWrapRef = useRef<HTMLDivElement>(null);
  const textOurRef = useRef<HTMLHeadingElement>(null);
  const textServicesRef = useRef<HTMLHeadingElement>(null);

  // Cards array refs (supports all 5 services)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Outline circular loader ref
  const outlineCircleRef = useRef<SVGCircleElement>(null);

  // Left and Right content reveal containers
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const ambientCircleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const ourChars = gsap.utils.toArray<HTMLElement>(".srv-char-our");
      const servicesChars = gsap.utils.toArray<HTMLElement>(".srv-char-services");
      const allIntroChars = [...ourChars, ...servicesChars];

      // 1. Initial State: Signature char blur dissolve (shared with OurWork)
      gsap.set(allIntroChars, charBlurInitialVars);

      // Left & Right side content: pure vertical fade & blur (NO horizontal slide!)
      if (leftContentRef.current) {
        gsap.set(leftContentRef.current, {
          opacity: 0,
          y: 20,
          x: 0,
          filter: "blur(14px)",
        });
      }
      if (rightContentRef.current) {
        gsap.set(rightContentRef.current, {
          opacity: 0,
          y: 20,
          x: 0,
          filter: "blur(14px)",
        });
      }

      // Small cards in center preview initially hidden and positioned in center
      cardRefs.current.forEach((cardEl, idx) => {
        if (!cardEl) return;
        gsap.set(cardEl, {
          opacity: 0,
          scale: 0.18,
          x: 0,
          y: 0,
          zIndex: 50 - idx * 10,
          transformOrigin: "center center",
        });
      });

      // Outline Circle initial offset (88 = empty, 0 = full)
      if (outlineCircleRef.current) {
        gsap.set(outlineCircleRef.current, {
          strokeDashoffset: 88,
        });
      }

      // Heading words initially centered
      if (textOurRef.current) {
        gsap.set(textOurRef.current, {
          x: 0,
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          transformOrigin: "center center",
        });
      }
      if (textServicesRef.current) {
        gsap.set(textServicesRef.current, {
          x: 0,
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          transformOrigin: "center center",
        });
      }

      // 2. Early Heading Intro Animation (Exact OurWork signature blur dissolve)
      const headingTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      });

      headingTl.to(allIntroChars, charBlurAnimateVars, 0);

      // 3. DESKTOP & LAPTOP (>= 1024px): Pinned Timeline
      ScrollTrigger.matchMedia({
        "(min-width: 1024px)": () => {
          const winWidth = window.innerWidth;

          // Responsive sizing & positioning tokens for 5-card row between "OUR" & "SERVICES"
          let settleScale = 0.50;
          let rowCardScale = 0.28;
          let cardSpacing = 112;

          if (winWidth < 1150) {
            settleScale = 0.36;
            rowCardScale = 0.20;
            cardSpacing = 72;
          } else if (winWidth < 1280) {
            settleScale = 0.40;
            rowCardScale = 0.23;
            cardSpacing = 86;
          } else if (winWidth < 1440) {
            settleScale = 0.45;
            rowCardScale = 0.26;
            cardSpacing = 100;
          } else if (winWidth < 1680) {
            settleScale = 0.50;
            rowCardScale = 0.30;
            cardSpacing = 118;
          } else {
            settleScale = 0.54;
            rowCardScale = 0.34;
            cardSpacing = 138;
          }

          // Measure card real width in the DOM
          const cardEl = cardRefs.current[0];
          const cardMeasuredWidth =
            cardEl?.offsetWidth || (winWidth >= 1536 ? 480 : winWidth >= 1280 ? 400 : 350);
          const scaledCardWidth = cardMeasuredWidth * rowCardScale;
          const cardHalfWidth = scaledCardWidth / 2;
          const cardsOuterEdge = 2 * cardSpacing + cardHalfWidth;

          // Inner wrap and heading elements measurements (untransformed layout offsets)
          const wrapEl = innerHeadingWrapRef.current;
          const ourEl = textOurRef.current;
          const servicesEl = textServicesRef.current;

          const ourWidth = ourEl?.offsetWidth || 220;
          const servicesWidth = servicesEl?.offsetWidth || 500;
          const wrapWidth = wrapEl?.offsetWidth || ourWidth + 32 + servicesWidth;
          const wrapLeft = -wrapWidth / 2;

          // Initial untransformed center coordinates relative to viewport center
          const initialOurCenter = wrapLeft + (ourEl?.offsetLeft ?? 0) + ourWidth / 2;
          const initialServicesCenter =
            wrapLeft + (servicesEl?.offsetLeft ?? ourWidth + 32) + servicesWidth / 2;

          const scaledOurWidth = ourWidth * settleScale;
          const scaledServicesWidth = servicesWidth * settleScale;

          // Website container-padding is 48px (3rem) on desktop, exactly where the MENU button ends
          const paddingX = winWidth >= 1024 ? 48 : 40;
          const rightBoundary = winWidth / 2 - paddingX;

          // Strictly EQUAL gap calculation on both sides of the cards row:
          // Distance(OUR, Card 0) === Distance(Card 2, SERVICES) === equalGap
          const maxAvailableGap = rightBoundary - cardsOuterEdge - scaledServicesWidth;
          const equalGap = Math.max(36, Math.min(maxAvailableGap, 76));

          // Target settled centers ensuring 100% symmetrical, equal spacing on left & right
          const targetOurCenter = -cardsOuterEdge - equalGap - scaledOurWidth / 2;
          const targetServicesCenter = cardsOuterEdge + equalGap + scaledServicesWidth / 2;

          const settleXOur = targetOurCenter - initialOurCenter;
          const settleXServices = targetServicesCenter - initialServicesCenter;

          const exitDistance = Math.max(winWidth * 0.85, 1200);

          const scrollTl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=520%",
              pin: pinContainerRef.current,
              pinSpacing: true,
              scrub: 1.2,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // ====================================================
          // STEP 1: Heading words scale down and settle flanking row of cards
          // ====================================================
          if (textOurRef.current) {
            scrollTl.to(
              textOurRef.current,
              {
                x: settleXOur,
                scale: settleScale,
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.38,
                ease: "power2.out",
              },
              0
            );
          }

          if (textServicesRef.current) {
            scrollTl.to(
              textServicesRef.current,
              {
                x: settleXServices,
                scale: settleScale,
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.38,
                ease: "power2.out",
              },
              0
            );
          }

          // Small Cards 0, 1, 2 reveal into row
          // Small Cards 0, 1, 2, 3, 4 reveal into row between "OUR" & "SERVICES"
          const cardPositions = [
            -2 * cardSpacing,
            -cardSpacing,
            0,
            cardSpacing,
            2 * cardSpacing,
          ];

          cardRefs.current.forEach((el, idx) => {
            if (!el || idx >= 5) return;
            scrollTl.to(
              el,
              {
                opacity: 1,
                x: cardPositions[idx],
                scale: rowCardScale,
                duration: 0.32,
                ease: "back.out(1.2)",
              },
              0.04 + idx * 0.04
            );
          });

          // ====================================================
          // STEP 2: "OUR" & "SERVICES" exit off-screen
          // Cards converge into initial 3D stack (Card 0 front, 1-4 behind)
          // Left & Right Content Reveal smoothly (NO horizontal slide!)
          // ====================================================
          if (textOurRef.current) {
            scrollTl.to(
              textOurRef.current,
              {
                x: -exitDistance,
                opacity: 0,
                filter: "blur(14px)",
                duration: 0.32,
                ease: "power2.in",
              },
              0.52
            );
          }

          if (textServicesRef.current) {
            scrollTl.to(
              textServicesRef.current,
              {
                x: exitDistance,
                opacity: 0,
                filter: "blur(14px)",
                duration: 0.32,
                ease: "power2.in",
              },
              0.52
            );
          }

          // Cards converge into center 3D Stack
          cardRefs.current.forEach((el, idx) => {
            if (!el || idx >= 5) return;
            const yOffset = idx === 0 ? 0 : idx === 1 ? -36 : idx === 2 ? -72 : idx === 3 ? -108 : -144;
            const cardScale = idx === 0 ? 1.0 : idx === 1 ? 0.94 : idx === 2 ? 0.88 : idx === 3 ? 0.82 : 0.76;
            scrollTl.to(
              el,
              {
                x: 0,
                y: yOffset,
                scale: cardScale,
                duration: 0.40,
                ease: "power2.inOut",
              },
              0.54
            );
          });

          // Initial Editorial Content Reveal (Pure blur-clearing & gentle vertical settle, NO horizontal sliding!)
          if (leftContentRef.current) {
            scrollTl.to(
              leftContentRef.current,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.36,
                ease: "power2.out",
              },
              0.74
            );
          }

          if (rightContentRef.current) {
            scrollTl.to(
              rightContentRef.current,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.36,
                ease: "power2.out",
              },
              0.74
            );
          }

          // ====================================================
          // STEP 3: Scroll-driven Card Roll-up & Outline Loader Rounds
          // ====================================================

          // --- ROUND 1: Transition to Service 2 (Index 1) ---
          if (outlineCircleRef.current) {
            scrollTl.fromTo(
              outlineCircleRef.current,
              { strokeDashoffset: 88 },
              { strokeDashoffset: 0, duration: 0.55, ease: "none" },
              1.05
            );
          }

          // Card 1 rolls up from bottom and comes forward
          if (cardRefs.current[1]) {
            scrollTl.to(
              cardRefs.current[1],
              {
                y: 120,
                scale: 0.96,
                opacity: 0.9,
                duration: 0.22,
                ease: "power1.in",
              },
              1.05
            );
            scrollTl.set(cardRefs.current[1], { zIndex: 60 }, 1.27);
            scrollTl.to(
              cardRefs.current[1],
              {
                y: 0,
                scale: 1.0,
                opacity: 1,
                duration: 0.33,
                ease: "power2.out",
              },
              1.27
            );
          }

          // Card 0 goes backward in stack
          if (cardRefs.current[0]) {
            scrollTl.to(
              cardRefs.current[0],
              {
                y: -36,
                scale: 0.94,
                zIndex: 50,
                duration: 0.45,
                ease: "power2.out",
              },
              1.15
            );
          }

          // Card 2 adjusts behind
          if (cardRefs.current[2]) {
            scrollTl.to(
              cardRefs.current[2],
              {
                y: -72,
                scale: 0.88,
                duration: 0.45,
                ease: "power2.out",
              },
              1.15
            );
          }

          // --- ROUND 2: Transition to Service 3 (Index 2) ---
          if (outlineCircleRef.current) {
            scrollTl.fromTo(
              outlineCircleRef.current,
              { strokeDashoffset: 88 },
              { strokeDashoffset: 0, duration: 0.55, ease: "none" },
              1.70
            );
          }

          // Card 2 rolls up from bottom and comes forward
          if (cardRefs.current[2]) {
            scrollTl.to(
              cardRefs.current[2],
              {
                y: 120,
                scale: 0.96,
                opacity: 0.9,
                duration: 0.22,
                ease: "power1.in",
              },
              1.70
            );
            scrollTl.set(cardRefs.current[2], { zIndex: 70 }, 1.92);
            scrollTl.to(
              cardRefs.current[2],
              {
                y: 0,
                scale: 1.0,
                opacity: 1,
                duration: 0.33,
                ease: "power2.out",
              },
              1.92
            );
          }

          // Card 1 goes backward in stack
          if (cardRefs.current[1]) {
            scrollTl.to(
              cardRefs.current[1],
              {
                y: -36,
                scale: 0.94,
                zIndex: 60,
                duration: 0.45,
                ease: "power2.out",
              },
              1.80
            );
          }

          // Card 0 shifts to back
          if (cardRefs.current[0]) {
            scrollTl.to(
              cardRefs.current[0],
              {
                y: -72,
                scale: 0.88,
                zIndex: 50,
                duration: 0.45,
                ease: "power2.out",
              },
              1.80
            );
          }

          // --- ROUND 3: Transition to Service 4 (Index 3) ---
          if (outlineCircleRef.current) {
            scrollTl.fromTo(
              outlineCircleRef.current,
              { strokeDashoffset: 88 },
              { strokeDashoffset: 0, duration: 0.55, ease: "none" },
              2.35
            );
          }

          // Card 3 rolls up from bottom and comes forward
          if (cardRefs.current[3]) {
            scrollTl.to(
              cardRefs.current[3],
              {
                opacity: 0.9,
                y: 120,
                scale: 0.96,
                duration: 0.22,
                ease: "power1.in",
              },
              2.35
            );
            scrollTl.set(cardRefs.current[3], { zIndex: 80 }, 2.57);
            scrollTl.to(
              cardRefs.current[3],
              {
                opacity: 1,
                y: 0,
                scale: 1.0,
                duration: 0.33,
                ease: "power2.out",
              },
              2.57
            );
          }

          // Card 2 goes backward in stack
          if (cardRefs.current[2]) {
            scrollTl.to(
              cardRefs.current[2],
              {
                y: -36,
                scale: 0.94,
                zIndex: 70,
                duration: 0.45,
                ease: "power2.out",
              },
              2.45
            );
          }

          // Card 1 shifts to back
          if (cardRefs.current[1]) {
            scrollTl.to(
              cardRefs.current[1],
              {
                y: -72,
                scale: 0.88,
                zIndex: 60,
                duration: 0.45,
                ease: "power2.out",
              },
              2.45
            );
          }

          // --- ROUND 4: Transition to Service 5 (Index 4) ---
          if (outlineCircleRef.current) {
            scrollTl.fromTo(
              outlineCircleRef.current,
              { strokeDashoffset: 88 },
              { strokeDashoffset: 0, duration: 0.55, ease: "none" },
              3.00
            );
          }

          // Card 4 rolls up from bottom and comes forward
          if (cardRefs.current[4]) {
            scrollTl.to(
              cardRefs.current[4],
              {
                opacity: 0.9,
                y: 120,
                scale: 0.96,
                duration: 0.22,
                ease: "power1.in",
              },
              3.00
            );
            scrollTl.set(cardRefs.current[4], { zIndex: 90 }, 3.22);
            scrollTl.to(
              cardRefs.current[4],
              {
                opacity: 1,
                y: 0,
                scale: 1.0,
                duration: 0.33,
                ease: "power2.out",
              },
              3.22
            );
          }

          // Card 3 goes backward in stack
          if (cardRefs.current[3]) {
            scrollTl.to(
              cardRefs.current[3],
              {
                y: -36,
                scale: 0.94,
                zIndex: 80,
                duration: 0.45,
                ease: "power2.out",
              },
              3.10
            );
          }

          // Card 2 shifts to back
          if (cardRefs.current[2]) {
            scrollTl.to(
              cardRefs.current[2],
              {
                y: -72,
                scale: 0.88,
                zIndex: 70,
                duration: 0.45,
                ease: "power2.out",
              },
              3.10
            );
          }

          // Scrub-synchronized active index detection
          scrollTl.eventCallback("onUpdate", () => {
            const p = scrollTl.progress();
            let newIdx = 0;
            if (p >= 0.86) {
              newIdx = 4;
            } else if (p >= 0.68) {
              newIdx = 3;
            } else if (p >= 0.50) {
              newIdx = 2;
            } else if (p >= 0.32) {
              newIdx = 1;
            } else {
              newIdx = 0;
            }

            if (newIdx !== activeServiceIndexRef.current) {
              activeServiceIndexRef.current = newIdx;
              setActiveServiceIndex(newIdx);
            }
          });
        },

        // MOBILE & TABLET (< 1024px): Responsive Staggered Flow
        "(max-width: 1023px)": () => {
          const mobileTl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          });

          mobileTl.to(
            allIntroChars,
            {
              opacity: 1,
              filter: "blur(0px)",
              scale: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.02,
              ease: "power2.out",
            },
            0
          );

          cardRefs.current.forEach((el, idx) => {
            if (!el) return;
            mobileTl.to(
              el,
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.7,
                ease: "power2.out",
              },
              0.3 + idx * 0.1
            );
          });

          if (leftContentRef.current) {
            mobileTl.to(
              leftContentRef.current,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.6,
                ease: "power2.out",
              },
              0.6
            );
          }

          if (rightContentRef.current) {
            mobileTl.to(
              rightContentRef.current,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.6,
                ease: "power2.out",
              },
              0.7
            );
          }
        },
      });

      // Subtle slow rotation on ambient circle
      if (ambientCircleRef.current) {
        gsap.to(ambientCircleRef.current, {
          rotate: 160,
          scale: 1.05,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [services]);

  const renderCharSpan = (text: string, prefix: string) => {
    return splitTextChars(text).map((item, idx) => (
      <span
        key={`${prefix}-${idx}`}
        className={`inline-block will-change-[transform,filter,opacity] ${prefix}`}
      >
        {item.char}
      </span>
    ));
  };

  const currentService = services[activeServiceIndex] || services[0];
  const badges = currentService.badges ?? [];

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative w-full bg-[#F8F6F0] overflow-hidden select-none"
    >
      {/* 3. Pinned Viewport Container (True vertical center on desktop, proper clearance on mobile) */}
      <div
        ref={pinContainerRef}
        className="relative w-full min-h-screen lg:h-screen lg:max-h-screen overflow-hidden flex flex-col justify-center items-center container-padding pt-24 pb-12 sm:pt-28 sm:pb-14 lg:py-0 bg-[#F8F6F0]"
      >
        {/* 1. Static Non-Scrollable Background Texture pinned inside container */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <Image
            src="/images/texture/bg-texture.png"
            alt="Background Texture"
            fill
            sizes="100vw"
            className="object-cover object-center opacity-85 mix-blend-multiply"
            loading="lazy"
          />
        </div>

        {/* 2. Concentric Ambient Circle Background Arc */}
        <div
          ref={ambientCircleRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] xl:w-[940px] xl:h-[940px] 2xl:w-[1100px] 2xl:h-[1100px] pointer-events-none z-0 select-none opacity-20 hidden md:block"
        >
          <Image
            src="/images/texture/circle.png"
            alt="Concentric Ambient Arc"
            width={1100}
            height={1100}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>

        {/* ============================================================== */}
        {/* BIG INTRO HEADING LAYER: "OUR SERVICES" Centered in Viewport   */}
        {/* ============================================================== */}
        <div
          ref={introHeadingRef}
          className="hidden lg:flex absolute inset-0 z-40 items-center justify-center pointer-events-none px-4 select-none [perspective:1200px] [transform-style:preserve-3d]"
        >
          <div
            ref={innerHeadingWrapRef}
            className="relative flex items-center justify-center gap-5 sm:gap-7 lg:gap-8 will-change-transform [perspective:1200px] [transform-style:preserve-3d]"
          >
            {/* Word 1: OUR */}
            <h2
              ref={textOurRef}
              className="font-voyage text-[72px] lg:text-[116px] xl:text-[142px] 2xl:text-[166px] text-[#121212] leading-none tracking-normal will-change-transform shrink-0"
            >
              {renderCharSpan("OUR", "srv-char-our")}
            </h2>

            {/* Word 2: SERVICES */}
            <h2
              ref={textServicesRef}
              className="font-voyage text-[72px] lg:text-[116px] xl:text-[142px] 2xl:text-[166px] text-[#121212] leading-none tracking-normal will-change-transform shrink-0"
            >
              {renderCharSpan("SERVICES", "srv-char-services")}
            </h2>
          </div>
        </div>

        {/* Mobile Heading Banner (< 1024px, safely below navbar) */}
        <div className="lg:hidden w-full text-center mb-6 pt-2 relative z-30">
          <SectionHeading as="h2" className="text-[44px] sm:text-[60px]">
            <span className="block">{renderCharSpan("OUR", "srv-char-our")}</span>
            <span className="block mt-[-0.08em]">{renderCharSpan("SERVICES", "srv-char-services")}</span>
          </SectionHeading>
        </div>

        {/* ============================================================== */}
        {/* MAIN EDITORIAL GRID (3-Zone Placement)                         */}
        {/* Zone 1: Left Content | Zone 2: Center Card Stack | Zone 3: Right */}
        {/* ============================================================== */}
        <div className="relative z-30 w-full max-w-[1400px] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-6 xl:gap-8">
          {/* ========================================== */}
          {/* LEFT COLUMN: Counter, Tag, Title, Button   */}
          {/* ========================================== */}
          <div
            ref={leftContentRef}
            className="w-full lg:w-[260px] xl:w-[300px] 2xl:w-[360px] flex flex-col justify-between items-start text-left shrink-0 z-30 order-2 lg:order-1 h-auto lg:h-[400px] xl:h-[450px] 2xl:h-[530px] pt-14 xl:pt-16 2xl:pt-4 will-change-transform opacity-0"
          >
            {/* Top: Counter with Outline Loader (Counter directly rendered without ContentReveal) */}
            <div className="w-full flex items-center justify-start gap-3.5">
              {/* Circular Outline Loader */}
              <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                  {/* Track circle */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    stroke="#E5E0D8"
                    strokeWidth="2.5"
                    fill="none"
                  />
                  {/* Active progress stroke */}
                  <circle
                    ref={outlineCircleRef}
                    cx="18"
                    cy="18"
                    r="14"
                    stroke="#121212"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={88}
                    strokeDashoffset={88}
                  />
                </svg>
                {/* Center golden accent dot */}
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5B842] absolute" />
              </div>

              {/* Counter displays directly (ContentReveal removed as requested) */}
              <span className="font-voyage text-[22px] sm:text-[26px] lg:text-[28px] 2xl:text-[32px] text-[#121212]/90 tracking-wider">
                {currentService.counter ?? `0${activeServiceIndex + 1} / 05`}
              </span>
            </div>

            {/* Middle: Tag & Title */}
            <div className="my-auto py-4 lg:py-0 w-full">
              {/* Tag: OUR SERVICES */}
              <span className="block font-segoe text-[11px] sm:text-[12px] xl:text-[13px] tracking-[0.24em] font-semibold text-[#121212]/75 uppercase mb-2 sm:mb-2.5">
                {currentService.tagline ?? "OUR SERVICES"}
              </span>

              {/* Title with Yellow Highlight using staggered ContentReveal */}
              <ContentReveal
                triggerKey={`${currentService.titleLight}-${currentService.titleHighlight}`}
                duration={0.45}
                stagger={0.08}
              >
                <h3 className="font-voyage text-[32px] sm:text-[40px] lg:text-[40px] xl:text-[48px] 2xl:text-[58px] text-[#121212] leading-[1.08] tracking-normal flex flex-wrap items-baseline gap-2">
                  <span>{currentService.titleLight}</span>
                  <span className="inline-block bg-[#FFF089] px-2 sm:px-2.5 py-0.5 rounded-[4px] text-[#121212]">
                    {currentService.titleHighlight}
                  </span>
                </h3>
              </ContentReveal>
            </div>

            {/* Bottom: EXPLORE SERVICES Button with Golden Dot */}
            <div className="w-full pt-2">
              <button
                type="button"
                aria-label="Explore Services"
                className="group inline-flex items-center justify-between gap-4 bg-white/95 px-5 sm:px-6 py-2.5 sm:py-3 rounded-[6px] border border-[#E5E0D8] text-[11px] sm:text-[12px] 2xl:text-[13px] font-segoe font-semibold tracking-[0.14em] text-[#121212] uppercase shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:bg-white active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <span>{currentService.buttonText ?? "EXPLORE SERVICES"}</span>
                <span className="w-2 h-2 rounded-full bg-[#E5B842] shrink-0 group-hover:scale-125 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* ========================================== */}
          {/* CENTER COLUMN: 3D Parallax Card Stack      */}
          {/* Cards roll up from bottom on scroll        */}
          {/* ========================================== */}
          <div className="relative w-full max-w-[320px] sm:max-w-[360px] lg:w-[350px] xl:w-[400px] 2xl:w-[480px] aspect-[498/636] shrink-0 flex items-center justify-center order-1 lg:order-2 my-4 lg:my-0 [perspective:1200px]">
            {services.map((item, idx) => {
              const cardData = item.card ?? {
                id: `card-${idx}`,
                title: item.titleHighlight,
                image: "/images/our-service/cardstack1.webp",
                alt: `${item.titleLight} ${item.titleHighlight}`,
              };

              return (
                <div
                  key={item.id ?? `service-card-${idx}`}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  className="absolute inset-x-0 top-0 w-full aspect-[498/636] rounded-[16px] overflow-hidden shadow-[0_20px_48px_-10px_rgba(0,0,0,0.22)] will-change-transform [transform-style:preserve-3d] [backface-visibility:hidden] opacity-0"
                  style={{
                    zIndex: 50 - idx * 10,
                  }}
                >
                  <div className="relative w-full h-full rounded-[16px] overflow-hidden bg-[#EAE7DF]">
                    <Image
                      src={cardData.image}
                      alt={cardData.alt}
                      fill
                      sizes="(max-width: 1024px) 90vw, 480px"
                      quality={90}
                      loading="lazy"
                      className="object-cover object-top rounded-[16px]"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ========================================== */}
          {/* RIGHT COLUMN: Paragraph & Badges Grid      */}
          {/* ========================================== */}
          <div
            ref={rightContentRef}
            className="w-full lg:w-[280px] xl:w-[340px] 2xl:w-[400px] flex flex-col justify-between items-start lg:items-end text-left shrink-0 z-30 order-3 h-auto lg:h-[400px] xl:h-[450px] 2xl:h-[530px] pt-14 xl:pt-16 2xl:pt-4 will-change-transform opacity-0"
          >
            {/* Top Right Paragraph with ContentReveal */}
            <div className="w-full">
              <ContentReveal triggerKey={currentService.description} duration={0.45}>
                <Paragraph className="font-segoe text-[12px] sm:text-[13px] lg:text-[13px] xl:text-[14px] 2xl:text-[15px] leading-[1.4] tracking-[0.04em] font-medium text-[#222222] uppercase text-left lg:text-right">
                  {currentService.description}
                </Paragraph>
              </ContentReveal>
            </div>

            {/* Middle: Badges (Horizontally aligned with Left Heading Section) */}
            <div className="my-auto py-4 lg:py-0 w-full">
              <ContentReveal
                triggerKey={badges.slice(0, 6).join("-")}
                duration={0.45}
                stagger={0.04}
              >
                <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-2.5 sm:gap-y-3.5 w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[360px] xl:max-w-[400px] lg:ml-auto">
                  {badges.slice(0, 6).map((badge, idx) => (
                    <div
                      key={`badge-${activeServiceIndex}-${idx}`}
                      className="flex items-center gap-2.5 text-left"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#121212]/80 shrink-0" />
                      <span className="font-segoe text-[13px] sm:text-[14px] xl:text-[12px] 2xl:text-[12px] text-[#222222]/90 font-medium leading-[1.3] tracking-[0.01em]">
                        {badge}
                      </span>
                    </div>
                  ))}
                </div>
              </ContentReveal>
            </div>

            {/* Bottom spacer to maintain exact vertical balance with left column's button */}
            <div className="w-full pt-2 hidden lg:block opacity-0 pointer-events-none select-none" aria-hidden="true">
              <div className="py-2.5 sm:py-3 text-[11px] sm:text-[12px]">&nbsp;</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
