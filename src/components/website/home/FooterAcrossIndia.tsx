"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, ScrollTrigger, splitTextChars } from "@/utils/gsap";
import { Paragraph } from "@/components/common/Typography";
import ContentReveal from "@/components/animations/ContentReveal";
import {
  charBlurInitialVars,
  charBlurAnimateVars,
} from "@/components/animations/CharBlurDissolveHeading";
import type { FooterAcrossIndiaData, OfficeLocation } from "@/types/home";

interface FooterAcrossIndiaProps {
  data?: FooterAcrossIndiaData;
}

const DEFAULT_OFFICES: OfficeLocation[] = [
  {
    id: "hyderabad",
    city: "HYDERABAD",
    phone: "+91 99100 12345",
    address: "WeWork, Vasavi MPM Grand, Ameerpet, 500073",
    dotColor: "#EF4444",
  },
  {
    id: "pune",
    city: "PUNE",
    phone: "+91 99234 12345",
    address: "5th Floor, Sadanand Business Centre (SBC), Baner, 411045",
    dotColor: "#EF4444",
  },
  {
    id: "gurgaon",
    city: "GURGAON",
    phone: "+91 124 456 7890",
    address: "711-713 DLF Galleria Towers, DLF Phase-IV, Gurugram, 122001",
    dotColor: "#F59E0B",
  },
  {
    id: "mumbai",
    city: "MUMBAI",
    phone: "+91 99112 12345",
    address: "1st Floor, AJ House, Marol, Andheri East, 400059",
    highlighted: true,
    dotColor: "#EF4444",
  },
  {
    id: "noida",
    city: "NOIDA",
    phone: "+91 120 478 3000",
    address: "5th Floor, Plot No. DS-01, Sector 2, Noida, 201301",
    dotColor: "#EF4444",
  },
  {
    id: "pune-2",
    city: "PUNE",
    phone: "+91 99234 67890",
    address: "5th Floor, Sadanand Business Centre (SBC), Baner, 411045",
    dotColor: "#EF4444",
  },
];

const DEFAULT_DATA: FooterAcrossIndiaData = {
  heading: "Across India.",
  subheading: "Strategic locations to be closer to our clients and communities.",
  offices: DEFAULT_OFFICES,
  mapImageSrc: "/images/map/footer-map2.webp",
  mapImageAlt: "GTF Technologies Pan-India Reach & Offices",
  phone: "+91 120 478 3000",
  email: "hello@gtftechnologies.com",
  copyright: "© 2026 GTF TECHNOLOGIES. ALL RIGHTS RESERVED.",
};

export default function FooterAcrossIndia({ data }: FooterAcrossIndiaProps) {
  const content = { ...DEFAULT_DATA, ...data };
  const offices = content.offices?.length > 0 ? content.offices : DEFAULT_OFFICES;

  const [activeOfficeId, setActiveOfficeId] = useState<string>("mumbai");

  const sectionRef = useRef<HTMLElement>(null);
  const headingCharsRef = useRef<HTMLHeadingElement>(null);
  const officesRef = useRef<HTMLDivElement>(null);
  const mapImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Heading chars initial state (Char Blur Dissolve)
      const headingChars =
        headingCharsRef.current?.querySelectorAll<HTMLElement>(
          ".footer-char-item"
        );
      if (headingChars && headingChars.length > 0) {
        gsap.set(headingChars, charBlurInitialVars);
      }

      // 2. Office location cards initial state
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
          start: "top 85%",
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
          },
          0.1
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      id="across-india"
      ref={sectionRef}
      className="relative w-full h-screen min-h-[760px] max-h-[1000px] bg-[#F8F6F0] overflow-hidden select-none flex flex-col justify-between"
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

      {/* Top Content Area: Heading, Subtitle & Offices */}
      <div className="relative z-10 w-full max-w-[1320px] xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10">
        {/* 1. Main Heading: Across India. (Voyage font + Char Blur Dissolve) */}
        <h2
          ref={headingCharsRef}
          className="font-voyage text-4xl sm:text-5xl lg:text-[62px] xl:text-[72px] text-[#121212] font-normal leading-[1.05] tracking-tight text-center mb-1 will-change-[transform,opacity,filter] [perspective:1200px]"
        >
          {splitTextChars(content.heading || "Across India.").map(
            (item, idx) => (
              <span
                key={`foot-${idx}`}
                className="footer-char-item inline-block will-change-[transform,filter,opacity]"
              >
                {item.char}
              </span>
            )
          )}
        </h2>

        {/* 2. Subtitle with common ContentReveal */}
        <ContentReveal
          triggerOnScroll
          duration={0.65}
          yOffset={14}
          blurAmount={6}
          className="text-center mb-4 sm:mb-5 lg:mb-6"
        >
          <Paragraph className="text-xs sm:text-sm text-[#555555] font-segoe font-normal max-w-xl mx-auto leading-relaxed">
            {content.subheading}
          </Paragraph>
        </ContentReveal>

        {/* 3. Office Locations 3-Column Grid matching Figma */}
        <div
          ref={officesRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-[1200px] mx-auto"
        >
          {offices.map((office) => {
            const isSelected = activeOfficeId === office.id;
            return (
              <div
                key={office.id}
                onClick={() => setActiveOfficeId(office.id)}
                className={`office-card-item rounded-[16px] px-3.5 py-2.5 sm:px-4 sm:py-3 transition-all duration-300 cursor-pointer flex items-start gap-3.5 min-h-[82px] sm:min-h-[88px] ${
                  isSelected
                    ? "bg-white shadow-[0_8px_20px_-4px_rgba(0,0,0,0.08)] border border-black/[0.04]"
                    : "bg-transparent hover:bg-white/60 border border-transparent"
                }`}
              >
                {/* Left: Dot + City + Phone */}
                <div className="w-[105px] sm:w-[115px] shrink-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: office.dotColor || "#EF4444" }}
                    />
                    <span className="font-segoe font-bold text-xs tracking-wider text-[#1A1A1A] uppercase">
                      {office.city}
                    </span>
                  </div>
                  <p className="font-segoe text-[11px] text-[#737373] pl-3.5">
                    {office.phone}
                  </p>
                </div>

                {/* Right: Address */}
                <div className="flex-1 border-l border-black/[0.06] pl-3">
                  <p className="font-segoe text-[11px] sm:text-xs text-[#525252] leading-relaxed">
                    {office.address}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. 3D INDIA GLOBE IMAGE: Sits Flush at Bottom Behind/Under Offices */}
      {/* ============================================================== */}
      <div
        ref={mapImageRef}
        className="absolute inset-x-0 bottom-0 h-[56%] sm:h-[60%] lg:h-[62%] min-h-[420px] max-h-[660px] w-full max-w-[1920px] mx-auto pointer-events-none z-0 overflow-hidden will-change-[transform,opacity]"
      >
        <Image
          src={content.mapImageSrc || "/images/map/footer-map.webp"}
          alt={content.mapImageAlt || "GTF Technologies Across India"}
          fill
          sizes="100vw"
          className="object-cover object-top"
        />

        {/* Ambient bottom gradient for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
      </div>

      {/* ============================================================== */}
      {/* 5. BOTTOM COPYRIGHT & CONTACT BAR OVERLAYING GLOBE OCEAN       */}
      {/* ============================================================== */}
      <div className="relative z-20 w-full px-6 sm:px-10 lg:px-16 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/70 font-segoe text-[11px] sm:text-xs tracking-wider mt-auto">
        {/* Left: Contact Info */}
        <div className="flex items-center gap-6">
          <a
            href={`tel:${content.phone?.replace(/\s+/g, "")}`}
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
            <span>{content.phone}</span>
          </a>

          <a
            href={`mailto:${content.email}`}
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
            <span>{content.email}</span>
          </a>
        </div>

        {/* Right: Copyright & Policies */}
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="text-white/60">{content.copyright}</span>
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
