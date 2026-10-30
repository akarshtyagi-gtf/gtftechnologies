"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, splitTextChars } from "@/utils/gsap";
import { Paragraph } from "@/components/common/Typography";
import ContentReveal from "@/components/animations/ContentReveal";
import {
  charBlurInitialVars,
  charBlurAnimateVars,
} from "@/components/animations/CharBlurDissolveHeading";
import type { LetsTalkData } from "@/types/home";

interface LetsTalkProps {
  data?: LetsTalkData;
}

const DEFAULT_DATA: LetsTalkData = {
  tagline: "LET'S TALK",
  headingLine1: "Have a project",
  headingLine2: "in mind?",
  description:
    "Tell us what you're building. We'll help shape the strategy, identity, and digital experience behind it.",
  locationTitle: "NEW DELHI, INDIA",
  email: "hello@gtftechnologies.com",
  taglineInfo: "Real estate. Branding. Digital growth.",
  sideImageSrc: "/images/connect-us/shout-out.webp",
  sideImageAlt: "GTF Technologies Shout Out Creative",
  buttonText: "SEND PROJECT ENQUIRY",
  responseTimeNote: "We'll get back to you within 1-2 business days.",
};

const SERVICE_OPTIONS = [
  "Brand Strategy & Positioning",
  "Social Media Amplification",
  "Website Creative & Development",
  "Digital & Performance Marketing",
  "AI Innovation & Automation",
  "Real Estate Media & 3D Visuals",
  "Comprehensive Growth Mandate",
  "Other / Custom Inquiry",
];

const LOCATION_OPTIONS = [
  "Delhi NCR / Noida / Gurugram",
  "Mumbai / MMR",
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Pan India (Other)",
  "International (Dubai / UK / USA / Other)",
];

export default function LetsTalk({ data }: LetsTalkProps) {
  const content = { ...DEFAULT_DATA, ...data };

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    workEmail: "",
    companyName: "",
    phoneNumber: "",
    serviceRequired: "",
    projectLocation: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Animation Refs
  const sectionRef = useRef<HTMLElement>(null);
  const sideImageRef = useRef<HTMLDivElement>(null);
  const tagLineRef = useRef<HTMLDivElement>(null);
  const headingCharsRef = useRef<HTMLHeadingElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Heading characters: Char Blur Dissolve Animation
      const headingChars =
        headingCharsRef.current?.querySelectorAll<HTMLElement>(
          ".letstalk-char-item"
        );
      if (headingChars && headingChars.length > 0) {
        gsap.set(headingChars, charBlurInitialVars);
      }

      // 2. Left vertical image initial state
      if (sideImageRef.current) {
        gsap.set(sideImageRef.current, {
          opacity: 0,
          scale: 0.97,
          filter: "blur(12px)",
        });
      }

      // 3. Left content elements initial state (Tagline, divider)
      const contentElements = [
        tagLineRef.current,
        dividerRef.current,
      ].filter(Boolean);

      if (contentElements.length > 0) {
        gsap.set(contentElements, {
          opacity: 0,
          y: 22,
          filter: "blur(8px)",
        });
      }

      // 4. Contact Form Card initial state: Fade-in Reveal Animation
      if (formCardRef.current) {
        gsap.set(formCardRef.current, {
          opacity: 0,
          y: 35,
          scale: 0.98,
          filter: "blur(14px)",
        });
      }

      // Master ScrollTrigger timeline
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // A. Reveal side image
      if (sideImageRef.current) {
        masterTl.to(
          sideImageRef.current,
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.0,
            ease: "power2.out",
          },
          0
        );
      }

      // B. Reveal Tagline
      if (tagLineRef.current) {
        masterTl.to(
          tagLineRef.current,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "power2.out",
          },
          0.1
        );
      }

      // C. Reveal Heading Characters with signature Char Blur Dissolve
      if (headingChars && headingChars.length > 0) {
        masterTl.to(
          headingChars,
          {
            ...charBlurAnimateVars,
            duration: 0.95,
            stagger: {
              from: "start",
              amount: 0.35,
              ease: "power2.out",
            },
          },
          0.15
        );
      }

      // D. Reveal Divider
      if (dividerRef.current) {
        masterTl.to(
          dividerRef.current,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.5,
            ease: "power2.out",
          },
          0.38
        );
      }

      // E. Reveal Contact Form with smooth fade-in reveal animation
      if (formCardRef.current) {
        masterTl.to(
          formCardRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.05,
            ease: "power3.out",
          },
          0.25
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 900);
  };

  return (
    <section
      id="lets-talk"
      ref={sectionRef}
      className="relative w-full min-h-[660px] lg:min-h-[720px] xl:min-h-[780px] 2xl:min-h-[820px] bg-[#F8F6F0] overflow-hidden select-none flex flex-col lg:flex-row items-stretch"
    >
      {/* ============================================================== */}
      {/* 1. BACKGROUND TEXTURE: Exactly matching other website sections  */}
      {/* ============================================================== */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/images/texture/bg-texture.png"
          alt="Texture"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-85 mix-blend-multiply"
        />
      </div>

      {/* ============================================================== */}
      {/* 2. LEFT VERTICAL IMAGE: Full-Height, Flush to Left Edge        */}
      {/* Bottom is NEVER cut off (object-bottom ensures full visibility) */}
      {/* ============================================================== */}
      <div
        ref={sideImageRef}
        className="w-full lg:w-[200px] xl:w-[240px] 2xl:w-[270px] shrink-0 h-[320px] sm:h-[400px] lg:h-auto self-stretch relative overflow-hidden bg-[#0A3EE2] flex items-end justify-center will-change-[transform,opacity,filter] z-10"
      >
        <Image
          src={content.sideImageSrc || "/images/connect-us/shout-out.webp"}
          alt={content.sideImageAlt || "Shout Out Creative"}
          fill
          sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 240px, 270px"
          className="object-cover object-bottom"
        />
      </div>

      {/* ============================================================== */}
      {/* 3. MAIN FULL-WIDTH WORKSPACE: Content & Form Card              */}
      {/* ============================================================== */}
      <div className="flex-1 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8 xl:gap-14 2xl:gap-16 px-5 sm:px-8 lg:px-10 xl:px-16 2xl:px-24 py-10 sm:py-14 lg:py-16 xl:py-20 2xl:py-24">
        
        {/* ------------------------------------------------------------ */}
        {/* LEFT CONTENT COLUMN: Tag & Heading at Top,                   */}
        {/* Divider, 3-Line Para & Address below with reduced spacing    */}
        {/* ------------------------------------------------------------ */}
        <div className="w-full lg:max-w-[440px] xl:max-w-[500px] 2xl:max-w-[560px] flex flex-col justify-start">
          {/* Top Block: Tagline & Main Heading */}
          <div>
            {/* 1. Tagline: — LET'S TALK */}
            <div
              ref={tagLineRef}
              className="flex items-center gap-2.5 mb-3 sm:mb-4 will-change-[transform,opacity,filter]"
            >
              <span className="w-6 h-[1px] bg-[#666666]" />
              <span className="font-segoe uppercase text-[11px] sm:text-xs tracking-[0.22em] text-[#555555] font-semibold">
                {content.tagline}
              </span>
            </div>

            {/* 2. Main Heading: Have a project in mind? (Voyage font + Char Blur Animation) */}
            <h2
              ref={headingCharsRef}
              className="font-voyage text-4xl sm:text-5xl lg:text-[52px] xl:text-[64px] 2xl:text-[72px] font-normal text-[#121212] leading-[1.02] tracking-tight will-change-[transform,opacity,filter] [perspective:1200px]"
            >
              <div className="block">
                {splitTextChars(content.headingLine1 || "Have a project").map(
                  (item, idx) => (
                    <span
                      key={`l1-${idx}`}
                      className="letstalk-char-item inline-block will-change-[transform,filter,opacity]"
                    >
                      {item.char}
                    </span>
                  )
                )}
              </div>
              <div className="block mt-1 sm:mt-1.5 min-md:mb-16">
                {splitTextChars(content.headingLine2 || "in mind?").map(
                  (item, idx) => (
                    <span
                      key={`l2-${idx}`}
                      className="letstalk-char-item inline-block will-change-[transform,filter,opacity]"
                    >
                      {item.char}
                    </span>
                  )
                )}
              </div>
            </h2>
          </div>

          {/* Bottom Block: Closer to Title as per Figma */}
          <div className="mt-6 sm:mt-8 lg:mt-9">
            {/* 3. Horizontal Divider */}
            <div
              ref={dividerRef}
              className="w-12 h-[1px] bg-[#222222] mb-5 sm:mb-6 will-change-[transform,opacity,filter]"
            />

            {/* 4. Paragraph (strictly 3 lines with common ContentReveal animation) */}
            <ContentReveal
              triggerOnScroll
              duration={0.7}
              yOffset={18}
              blurAmount={8}
            >
              <Paragraph className="text-[#4E4E4E] text-sm sm:text-[15px] xl:text-base leading-relaxed max-w-[340px] sm:max-w-[365px] font-segoe font-normal">
                Tell us what you&apos;re building. We&apos;ll help
                <span className="block">shape the strategy, identity, and digital</span>
                <span className="block">experience behind it.</span>
              </Paragraph>
            </ContentReveal>

            {/* Medium space between paragraph and address details */}
            {/* 5. Contact Info Block (with common ContentReveal animation) */}
            <ContentReveal
              triggerOnScroll
              duration={0.75}
              yOffset={18}
              blurAmount={8}
              stagger={0.08}
              className="mt-6 sm:mt-7 lg:mt-8"
            >
              <p className="font-segoe text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[#6E6E6E] mb-2.5">
                {content.locationTitle}
              </p>

              <div className="space-y-2.5">
                {/* Email with SVG */}
                <div className="flex items-center gap-3">
                  <svg
                    className="w-4 h-4 text-[#1E1E1E] shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.7}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href={`mailto:${content.email}`}
                    className="font-segoe text-xs sm:text-[13px] text-[#1E1E1E] hover:text-[#0A3EE2] hover:underline underline-offset-4 transition-colors font-normal"
                  >
                    {content.email}
                  </a>
                </div>

                {/* Real Estate / Tagline with SVG */}
                <div className="flex items-center gap-3">
                  <svg
                    className="w-4 h-4 text-[#1E1E1E] shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.7}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span className="font-segoe text-xs sm:text-[13px] text-[#4A4A4A] font-normal">
                    {content.taglineInfo}
                  </span>
                </div>
              </div>
            </ContentReveal>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* RIGHT FORM CARD: Transparent BG + Black Border per Figma    */}
        {/* ------------------------------------------------------------ */}
        <div
          ref={formCardRef}
          className="w-full lg:w-[460px] xl:w-[520px] 2xl:w-[560px] shrink-0 rounded-[24px] sm:rounded-[28px] border border-black/25 sm:border-black/30 bg-transparent p-5 sm:p-7 xl:p-8 2xl:p-9 will-change-[transform,opacity,filter]"
        >
          {isSubmitted ? (
            <div className="py-12 sm:py-16 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-[#121212] text-white flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="font-voyage text-3xl text-[#121212] mb-2">
                Enquiry Received
              </h3>
              <p className="font-segoe text-sm text-[#555] max-w-xs mb-6">
                Thank you, {formData.fullName || "Partner"}! Our leadership
                team will review your requirements and reach out within 1-2
                business days.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    fullName: "",
                    workEmail: "",
                    companyName: "",
                    phoneNumber: "",
                    serviceRequired: "",
                    projectLocation: "",
                    message: "",
                  });
                }}
                className="font-segoe text-xs uppercase tracking-wider text-[#121212] underline underline-offset-4 hover:text-[#0A3EE2]"
              >
                Send another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              {/* Row 1: Full Name & Work Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-[#1A1A1A] font-segoe mb-1">
                    Full Name <span className="text-[#E53E3E]">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="E.g. Rohan Mehta"
                    className="w-full bg-[#FFFFFF] border border-[#E2DDD3] rounded-md px-3.5 py-2.5 text-xs sm:text-sm text-[#121212] placeholder:text-[#9E9E9E] placeholder:font-normal focus:outline-none focus:border-black/50 focus:ring-1 focus:ring-black/20 transition-all font-segoe shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-[#1A1A1A] font-segoe mb-1">
                    Work Email <span className="text-[#E53E3E]">*</span>
                  </label>
                  <input
                    type="email"
                    name="workEmail"
                    required
                    value={formData.workEmail}
                    onChange={handleInputChange}
                    placeholder="E.g. rohan@company.com"
                    className="w-full bg-[#FFFFFF] border border-[#E2DDD3] rounded-md px-3.5 py-2.5 text-xs sm:text-sm text-[#121212] placeholder:text-[#9E9E9E] placeholder:font-normal focus:outline-none focus:border-black/50 focus:ring-1 focus:ring-black/20 transition-all font-segoe shadow-xs"
                  />
                </div>
              </div>

              {/* Row 2: Company Name & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-[#1A1A1A] font-segoe mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="E.g. ABC Realty"
                    className="w-full bg-[#FFFFFF] border border-[#E2DDD3] rounded-md px-3.5 py-2.5 text-xs sm:text-sm text-[#121212] placeholder:text-[#9E9E9E] placeholder:font-normal focus:outline-none focus:border-black/50 focus:ring-1 focus:ring-black/20 transition-all font-segoe shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-[#1A1A1A] font-segoe mb-1">
                    Phone Number <span className="text-[#E53E3E]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="E.g. +91 98765 43210"
                    className="w-full bg-[#FFFFFF] border border-[#E2DDD3] rounded-md px-3.5 py-2.5 text-xs sm:text-sm text-[#121212] placeholder:text-[#9E9E9E] placeholder:font-normal focus:outline-none focus:border-black/50 focus:ring-1 focus:ring-black/20 transition-all font-segoe shadow-xs"
                  />
                </div>
              </div>

              {/* Row 3: Service Required (Select) */}
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-[#1A1A1A] font-segoe mb-1">
                  Service Required <span className="text-[#E53E3E]">*</span>
                </label>
                <div className="relative">
                  <select
                    name="serviceRequired"
                    required
                    value={formData.serviceRequired}
                    onChange={handleInputChange}
                    className="w-full appearance-none bg-[#FFFFFF] border border-[#E2DDD3] rounded-md px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-[#121212] focus:outline-none focus:border-black/50 focus:ring-1 focus:ring-black/20 transition-all font-segoe shadow-xs cursor-pointer"
                  >
                    <option value="" disabled className="text-[#9E9E9E]">
                      Select a service
                    </option>
                    {SERVICE_OPTIONS.map((srv) => (
                      <option key={srv} value={srv}>
                        {srv}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#555555]">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Row 4: Project Location (Select) */}
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-[#1A1A1A] font-segoe mb-1">
                  Project Location <span className="text-[#E53E3E]">*</span>
                </label>
                <div className="relative">
                  <select
                    name="projectLocation"
                    required
                    value={formData.projectLocation}
                    onChange={handleInputChange}
                    className="w-full appearance-none bg-[#FFFFFF] border border-[#E2DDD3] rounded-md px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-[#121212] focus:outline-none focus:border-black/50 focus:ring-1 focus:ring-black/20 transition-all font-segoe shadow-xs cursor-pointer"
                  >
                    <option value="" disabled className="text-[#9E9E9E]">
                      Select a location
                    </option>
                    {LOCATION_OPTIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#555555]">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Row 5: Message */}
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-[#1A1A1A] font-segoe mb-1">
                  Message <span className="text-[#E53E3E]">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your project, goals, or just say hello..."
                  className="w-full bg-[#FFFFFF] border border-[#E2DDD3] rounded-md px-3.5 py-2.5 text-xs sm:text-sm text-[#121212] placeholder:text-[#9E9E9E] placeholder:font-normal focus:outline-none focus:border-black/50 focus:ring-1 focus:ring-black/20 transition-all font-segoe resize-none shadow-xs"
                />
              </div>

              {/* Row 6: Submit Button */}
              <div className="pt-1.5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#121212] hover:bg-black active:scale-[0.99] text-white text-xs sm:text-[13px] font-semibold uppercase tracking-[0.14em] py-3.5 sm:py-4 rounded-md flex items-center justify-center gap-3 transition-all duration-300 shadow-sm group cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <>
                      <span>{content.buttonText}</span>
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5 font-normal text-base leading-none">
                        →
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Row 7: Response Time Note */}
              <div className="text-center pt-1">
                <p className="font-segoe text-[11px] sm:text-xs text-[#737373]">
                  {content.responseTimeNote}
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
