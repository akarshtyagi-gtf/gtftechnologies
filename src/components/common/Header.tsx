"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import KineticMenuText from "@/components/animations/KineticMenuText";

interface SubMenuItem {
  label: string;
  href: string;
  external?: boolean;
  subItems?: SubMenuItem[];
}

interface SubMenuGroup {
  id: "process" | "services" | "work" | "hr" | "contact";
  title: string;
  side: "left" | "right";
  topClass: string;
  items: SubMenuItem[];
}

const SUBMENU_PANELS: Record<SubMenuGroup["id"], SubMenuGroup> = {
  process: {
    id: "process",
    title: "Process of Working",
    side: "right",
    topClass: "top-[40%]",
    items: [
      { label: "Research", href: "/how-we-work/SEO_keyword_research" },
      { label: "Brand Strategy Launch", href: "/brand-strategy-launch" },
      { label: "Digital Media Planning", href: "/how-we-work/digital_media_planning" },
      { label: "Concept Content & Creative", href: "/how-we-work/contentcreative" },
      { label: "Data Analysis & ROI", href: "/how-we-work/data_analysis_roi" },
    ],
  },
  services: {
    id: "services",
    title: "Services",
    side: "left",
    topClass: "top-[53%]",
    items: [
      { label: "Brand Strategy", href: "/service/brand-strategy" },
      { label: "Social Media Amplification", href: "/services/social-media-amplification" },
      { label: "Website Creative", href: "/services/website-creative" },
      { label: "Digital Marketing", href: "/services/digital-marketing" },
      { label: "AI Innovation", href: "/services/ai-innovation" },
      {
        label: "Celebrity/Influencer Marketing",
        href: "/services/celebrity-influencer-marketing",
      },
    ],
  },
  work: {
    id: "work",
    title: "Work",
    side: "right",
    topClass: "top-[53%]",
    items: [
      {
        label: "Portfolio",
        href: "/work/portfolio/websites_landing_pages",
        subItems: [
          { label: "Websites & Landing Pages", href: "/work/portfolio/websites_landing_pages" },
          { label: "Creatives & AI Videos", href: "/work/portfolio/creatives" },
          { label: "Logos", href: "/work/portfolio/logos" },
        ],
      },
      { label: "Case Studies", href: "/work/case_studies" },
      { label: "Clients", href: "/work/clients" },
    ],
  },
  hr: {
    id: "hr",
    title: "Human Resource",
    side: "left",
    topClass: "top-[71%]",
    items: [
      { label: "Work Culture", href: "/human-resource/work_culture" },
      { label: "Work With Us", href: "/human-resource/work_with_us" },
      { label: "Life At GTF Technologies", href: "/human-resource/life_at_gtf" },
    ],
  },
  contact: {
    id: "contact",
    title: "Contact",
    side: "right",
    topClass: "top-[71%]",
    items: [
      { label: "Request For Quote", href: "/contact/request_quote" },
      { label: "Say Hello!", href: "/contact/say_hello" },
    ],
  },
};

const MENU_SOCIALS = [
  { label: "in", href: "https://in.linkedin.com/company/gtftechnologies", name: "LinkedIn" },
  { label: "tw", href: "https://twitter.com/gtfTechnologies", name: "Twitter" },
  { label: "fb", href: "https://www.facebook.com/Gtftechnologiesindia/", name: "Facebook" },
  { label: "insta", href: "https://www.instagram.com/gtf_technologies/", name: "Instagram" },
  { label: "pi", href: "https://in.pinterest.com/GTFTechnologies/", name: "Pinterest" },
];

const MENU_LEGAL_LINKS = [
  { label: "Privacy Policy", href: "https://www.gtftechnologies.com/privacy_policy" },
  { label: "Sitemap", href: "https://www.gtftechnologies.com/sitemap.xml" },
];

function FloatingSubmenuPopup({
  panel,
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onNavigate,
}: {
  panel: SubMenuGroup;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigate: () => void;
}) {
  const isRight = panel.side === "right";
  const hiddenOffset = isRight ? "translate-x-5" : "-translate-x-5";

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-hidden={!isOpen}
      className={`hidden lg:block absolute top-1/2 -translate-y-1/2 z-30 w-[225px] xl:w-[260px] 2xl:w-[290px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isRight ? "left-full ml-5 xl:ml-8" : "right-full mr-5 xl:mr-8"
      } ${
        isOpen
          ? "opacity-100 translate-x-0 scale-100 blur-0 pointer-events-auto"
          : `opacity-0 ${hiddenOffset} scale-[0.97] blur-[4px] pointer-events-none`
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-2xl bg-[#F8F6F0] border border-black/[0.08] shadow-[0_24px_60px_rgba(18,18,18,0.09)] px-6 py-5 ${
          isRight ? "text-right" : "text-left"
        }`}
      >
        {/* Paper Background Texture on Pop-Up */}
        <div
          className="absolute inset-0 pointer-events-none opacity-85 mix-blend-multiply bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/texture/bg-texture2.png")' }}
        />

        <ul className="relative z-10 space-y-2.5">
          {panel.items.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className="inline-block font-segoe text-[14px] xl:text-[15px] text-[#121212] hover:opacity-60 transition-opacity duration-200"
              >
                {item.label}
              </Link>

              {item.subItems && item.subItems.length > 0 && (
                <ul className={`mt-1.5 space-y-1 ${isRight ? "pr-4" : "pl-4"}`}>
                  {item.subItems.map((sub) => (
                    <li key={sub.href}>
                      <Link
                        href={sub.href}
                        onClick={onNavigate}
                        className="inline-block font-segoe text-[12.5px] xl:text-[13px] text-[#57534E] hover:text-[#121212] transition-colors duration-200"
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MobileSubmenuAccordion({
  panel,
  isOpen,
  onNavigate,
}: {
  panel: SubMenuGroup;
  isOpen: boolean;
  onNavigate: () => void;
}) {
  return (
    <div
      className={`lg:hidden grid transition-all duration-300 ease-out ${
        isOpen ? "grid-rows-[1fr] opacity-100 mt-2.5 mb-1" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">
        <ul className="space-y-2 py-2 px-4 rounded-xl bg-black/[0.03] border border-black/[0.06] text-center">
          {panel.items.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className="font-segoe text-[13.5px] text-[#121212] hover:opacity-65 transition-opacity inline-block"
              >
                {item.label}
              </Link>
              {item.subItems && item.subItems.length > 0 && (
                <ul className="mt-1 space-y-1">
                  {item.subItems.map((sub) => (
                    <li key={sub.href}>
                      <Link
                        href={sub.href}
                        onClick={onNavigate}
                        className="font-segoe text-[12px] text-[#57534E] hover:text-[#121212] inline-block"
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<SubMenuGroup["id"] | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<SubMenuGroup["id"] | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openPanel = (group: SubMenuGroup["id"]) => {
    cancelCloseTimer();
    setActiveGroup(group);
  };

  const scheduleClosePanel = () => {
    cancelCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setActiveGroup(null);
    }, 200);
  };

  const clearPanelImmediate = () => {
    cancelCloseTimer();
    setActiveGroup(null);
  };

  const toggleMobileSection = (group: SubMenuGroup["id"]) => {
    setMobileExpanded((prev) => (prev === group ? null : group));
  };

  // Impressive, non-intrusive GSAP entrance reveal for the top header
  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const items = headerEl.querySelectorAll<HTMLElement>(".header-reveal-item");
      gsap.fromTo(
        items,
        { opacity: 0, y: -18, filter: "blur(8px)", scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
          duration: 0.85,
          stagger: 0.12,
          delay: 0.08,
          ease: "power3.out",
          clearProps: "transform,filter",
        }
      );
    }, headerEl);

    return () => ctx.revert();
  }, []);

  // GSAP micro-interaction for the custom 2-line menu icon
  const handleMouseEnter = () => {
    if (!line1Ref.current || !line2Ref.current) return;
    gsap.to(line1Ref.current, { width: 18, duration: 0.22, ease: "power2.out" });
    gsap.to(line2Ref.current, { width: 12, duration: 0.22, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    if (!line1Ref.current || !line2Ref.current) return;
    gsap.to(line1Ref.current, { width: 12, duration: 0.22, ease: "power2.out" });
    gsap.to(line2Ref.current, { width: 18, duration: 0.22, ease: "power2.out" });
  };

  useEffect(() => {
    if (!line1Ref.current || !line2Ref.current) return;
    if (menuOpen) {
      gsap.to(line1Ref.current, { rotate: 45, y: 3, width: 16, duration: 0.25 });
      gsap.to(line2Ref.current, { rotate: -45, y: -3, width: 16, duration: 0.25 });
    } else {
      gsap.to(line1Ref.current, { rotate: 0, y: 0, width: 12, duration: 0.25 });
      gsap.to(line2Ref.current, { rotate: 0, y: 0, width: 18, duration: 0.25 });
    }
  }, [menuOpen]);

  // Slow, smooth multi-layer parallax open/close GSAP animation + Escape & scroll lock
  useEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;
    const bgVideo = bgVideoRef.current;
    const circle = circleRef.current;
    if (!overlay || !content) return;

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const animItems = content.querySelectorAll<HTMLElement>(".menu-stagger-item");
    const targets = [overlay, content, bgVideo, circle, ...Array.from(animItems)].filter(Boolean);

    if (menuOpen) {
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.overflowY = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.overflowY = "hidden";
      gsap.killTweensOf(targets);
      gsap.set(overlay, { pointerEvents: "auto", visibility: "visible" });

      // Layer 1: Curtain reveal
      gsap.fromTo(
        overlay,
        { opacity: 0, clipPath: "inset(0% 0% 100% 0%)" },
        {
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.1,
          ease: "power4.inOut",
        }
      );

      // Layer 2: Slow background video parallax
      if (bgVideo) {
        gsap.fromTo(
          bgVideo,
          { scale: 1.08, y: -28 },
          { scale: 1, y: 0, duration: 1.3, ease: "power3.out" }
        );
      }

      // Layer 3: Midground ambient circle parallax
      if (circle) {
        gsap.fromTo(
          circle,
          { opacity: 0, y: 48, scale: 0.92, rotate: -6 },
          { opacity: 0.2, y: 0, scale: 1, rotate: 0, duration: 1.25, delay: 0.1, ease: "power3.out" }
        );
      }

      // Layer 4: Foreground menu items staggered parallax glide
      gsap.fromTo(
        animItems,
        { opacity: 0, y: 52, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.95,
          stagger: 0.075,
          delay: 0.24,
          ease: "power3.out",
          clearProps: "filter",
        }
      );
    } else {
      document.documentElement.style.overflow = "";
      document.documentElement.style.overflowY = "";
      document.body.style.overflow = "";
      document.body.style.overflowY = "";
      gsap.killTweensOf(targets);

      // Reverse parallax: Foreground items lift & dissolve first
      gsap.to(animItems, {
        opacity: 0,
        y: -36,
        filter: "blur(6px)",
        duration: 0.55,
        stagger: { amount: 0.2, from: "end" },
        ease: "power2.inOut",
      });

      // Midground ambient circle drifts
      if (circle) {
        gsap.to(circle, {
          opacity: 0,
          y: -28,
          scale: 0.94,
          duration: 0.7,
          ease: "power2.inOut",
        });
      }

      // Background video parallax pull
      if (bgVideo) {
        gsap.to(bgVideo, {
          scale: 1.06,
          y: -20,
          duration: 0.85,
          ease: "power3.inOut",
        });
      }

      // Curtain sweeps smoothly closed
      gsap.to(overlay, {
        opacity: 0,
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.9,
        delay: 0.14,
        ease: "power4.inOut",
        onComplete: () => {
          gsap.set(overlay, { pointerEvents: "none", visibility: "hidden" });
        },
      });
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.overflowY = "";
      document.body.style.overflow = "";
      document.body.style.overflowY = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      cancelCloseTimer();
    };
  }, [menuOpen]);

  const closeMenu = () => {
    cancelCloseTimer();
    setMenuOpen(false);
    setActiveGroup(null);
    setMobileExpanded(null);
  };

  const activePanel = activeGroup ? SUBMENU_PANELS[activeGroup] : null;
  const leftPanel = activePanel?.side === "left" ? activePanel : null;
  const rightPanel = activePanel?.side === "right" ? activePanel : null;

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-50 container-padding py-4 sm:py-5 flex items-center justify-between transition-all duration-300"
      >
        {/* Left: GTF Technologies Logo */}
        <div className="header-reveal-item relative z-10">
          <Link href="/" onClick={closeMenu} className="block">
            <Image
              src="/images/GTF-logo.png"
              alt="GTF Technologies Logo"
              width={220}
              height={55}
              priority
              className="h-11 sm:h-16 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Center: Navigation Pill (Mathematically centered in viewport) */}
        <div className="header-reveal-item hidden md:flex items-center md:absolute md:left-1/2 md:-translate-x-1/2 z-10">
          <nav className="bg-white/95 border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.06)] rounded-full px-5 py-3 flex items-center gap-3 transition-transform duration-200 hover:scale-[1.01]">
            <a
              href="#work"
              onClick={closeMenu}
              className="font-montserrat font-medium text-[11px] leading-[16.5px] tracking-[1.54px] text-[#404040] hover:text-black uppercase transition-colors"
            >
              WORK
            </a>
            <span className="w-[1px] h-3 bg-black/20 inline-block" />
            <a
              href="#expertise"
              onClick={closeMenu}
              className="font-montserrat font-medium text-[11px] leading-[16.5px] tracking-[1.54px] text-[#404040] hover:text-black uppercase transition-colors"
            >
              EXPERTISE
            </a>
          </nav>
        </div>

        {/* Right: Menu Pill */}
        <div className="header-reveal-item relative z-10">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="bg-white/95 border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.06)] rounded-full px-5 py-2.5 sm:px-6 sm:py-3 flex items-center gap-2.5 group cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            aria-label="Toggle Navigation Menu"
            aria-expanded={menuOpen}
          >
            {/* Custom 2-line icon */}
            <div className="flex flex-col justify-center items-end gap-[4px] w-5 h-4">
              <span
                ref={line1Ref}
                className="h-[1.8px] w-[12px] bg-[#171717] rounded-full origin-center transition-all"
              />
              <span
                ref={line2Ref}
                className="h-[1.8px] w-[18px] bg-[#171717] rounded-full origin-center transition-all"
              />
            </div>

            <span className="font-montserrat font-medium text-[11px] leading-[16.5px] tracking-[1.54px] text-[#171717] uppercase">
              {menuOpen ? "CLOSE" : "MENU"}
            </span>
          </button>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* FULLSCREEN EDITORIAL MENU OVERLAY (Covers header completely at z-[60]) */}
      {/* ===================================================================== */}
      <div
        ref={overlayRef}
        aria-hidden={!menuOpen}
        style={{ visibility: "hidden", opacity: 0 }}
        className="fixed inset-0 z-[60] bg-[#F8F6F0] overflow-y-auto lg:overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden select-none"
      >
        {/* Background Texture Video */}
        <video
          ref={bgVideoRef}
          src="/images/texture/bg-texture-videof.mp4"
          poster="/images/texture/bg-texture.png"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="fixed inset-0 w-full h-full object-cover pointer-events-none opacity-85 mix-blend-multiply will-change-transform"
        />

        {/* Subtle Ambient Concentric Circle */}
        <div
          ref={circleRef}
          className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-20 will-change-transform"
        >
          <Image
            src="/images/texture/circle.png"
            alt=""
            width={920}
            height={920}
            className="w-[520px] sm:w-[740px] lg:w-[880px] h-auto object-contain"
          />
        </div>

        {/* Main Center Editorial Layout + Clean Aligned Bottom Footer Strip */}
        <div
          ref={contentRef}
          className="relative z-10 w-full min-h-screen lg:h-screen container-padding pt-4 sm:pt-6 lg:pt-6 lg:pb-5 xl:pt-7 xl:pb-6 pb-8 flex flex-col justify-between"
        >
          {/* Top Bar: Brand Logo (Centered on sm+, Left-aligned beside Close on mobile) */}
          <div className="menu-stagger-item relative w-full max-w-[1680px] mx-auto flex items-center justify-between sm:justify-center shrink-0">
            <Link href="/" onClick={closeMenu} className="block">
              <Image
                src="/images/GTF-logo.svg"
                alt="GTF Technologies"
                width={240}
                height={78}
                className="h-11 sm:h-14 lg:h-[58px] xl:h-[68px] 2xl:h-[76px] w-auto object-contain"
              />
            </Link>

            <button
              onClick={closeMenu}
              className="sm:fixed sm:top-5 sm:right-10 lg:right-12 bg-white/95 border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.06)] rounded-full px-4 py-2 sm:px-6 sm:py-3 flex items-center gap-2 sm:gap-2.5 cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
              aria-label="Close Navigation Menu"
            >
              <span className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center">
                <span className="absolute w-3.5 sm:w-4 h-[1.8px] bg-[#171717] rounded-full rotate-45" />
                <span className="absolute w-3.5 sm:w-4 h-[1.8px] bg-[#171717] rounded-full -rotate-45" />
              </span>
              <span className="font-montserrat font-medium text-[10.5px] sm:text-[11px] leading-[16.5px] tracking-[1.54px] text-[#171717] uppercase">
                CLOSE
              </span>
            </button>
          </div>

          {/* CENTER MENU: Obsidian Assembly Placement (4 equal-spaced rows) + Bottom Links */}
          <div className="w-full max-w-[740px] lg:max-w-[540px] xl:max-w-[640px] 2xl:max-w-[720px] mx-auto flex-1 flex flex-col items-center justify-center py-6 lg:py-4">
            {/* 5 Main Menu Items in Obsidian 4-Row Staggered Placement */}
            <div className="w-full flex flex-col gap-4 sm:gap-5 lg:gap-5 xl:gap-6 2xl:gap-7 mb-6 sm:mb-7 lg:mb-7 xl:mb-8">
              {/* Row 1: About Us (Slightly left of center, matching 'Places') */}
              <div className="menu-stagger-item flex justify-center sm:justify-start sm:pl-[20%] lg:pl-[22%]">
                <Link
                  href="/who-we-are/about-gtf"
                  onClick={closeMenu}
                  onMouseEnter={clearPanelImmediate}
                  className="group font-voyage text-[34px] sm:text-4xl lg:text-[44px] xl:text-[52px] 2xl:text-[60px] text-[#121212] tracking-tight cursor-pointer leading-none"
                >
                  <KineticMenuText text="About Us" />
                </Link>
              </div>

              {/* Row 2: Process of Working (Stepped Right, matching 'Objects') */}
              <div className="menu-stagger-item relative flex flex-col items-center sm:items-end sm:pr-[2%] lg:pr-[4%]">
                <div className="relative flex items-center gap-2.5">
                  <Link
                    href="/how-we-work/SEO_keyword_research"
                    onClick={closeMenu}
                    onMouseEnter={() => openPanel("process")}
                    onMouseLeave={scheduleClosePanel}
                    className="group font-voyage text-[32px] sm:text-4xl lg:text-[44px] xl:text-[52px] 2xl:text-[60px] text-[#121212] tracking-tight cursor-pointer text-center leading-none whitespace-nowrap mb-2"
                  >
                    <KineticMenuText text="Process of Working" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleMobileSection("process")}
                    aria-label="Toggle Process of Working submenu"
                    className="lg:hidden w-7 h-7 rounded-full border border-black/15 flex items-center justify-center text-sm text-[#121212]"
                  >
                    {mobileExpanded === "process" ? "−" : "+"}
                  </button>

                  <FloatingSubmenuPopup
                    panel={SUBMENU_PANELS.process}
                    isOpen={activeGroup === "process"}
                    onMouseEnter={cancelCloseTimer}
                    onMouseLeave={scheduleClosePanel}
                    onNavigate={closeMenu}
                  />
                </div>
                <MobileSubmenuAccordion
                  panel={SUBMENU_PANELS.process}
                  isOpen={mobileExpanded === "process"}
                  onNavigate={closeMenu}
                />
              </div>

              {/* Row 3: Services (Left) & Work (Right) on the same row, matching 'About' & 'Contacts' */}
              <div className="menu-stagger-item w-full grid grid-cols-1 sm:grid-cols-2 items-center gap-4 sm:gap-10 px-0 sm:px-[3%] lg:px-[4%]">
                {/* Services (Left) */}
                <div className="flex flex-col items-center sm:items-start">
                  <div className="relative flex items-center gap-2.5">
                    <Link
                      href="/service"
                      onClick={closeMenu}
                      onMouseEnter={() => openPanel("services")}
                      onMouseLeave={scheduleClosePanel}
                      className="group font-voyage text-[34px] sm:text-4xl lg:text-[44px] xl:text-[52px] 2xl:text-[60px] text-[#121212] tracking-tight cursor-pointer leading-none whitespace-nowrap"
                    >
                      <KineticMenuText text="Services" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleMobileSection("services")}
                      aria-label="Toggle Services submenu"
                      className="lg:hidden w-7 h-7 rounded-full border border-black/15 flex items-center justify-center text-sm text-[#121212]"
                    >
                      {mobileExpanded === "services" ? "−" : "+"}
                    </button>

                    <FloatingSubmenuPopup
                      panel={SUBMENU_PANELS.services}
                      isOpen={activeGroup === "services"}
                      onMouseEnter={cancelCloseTimer}
                      onMouseLeave={scheduleClosePanel}
                      onNavigate={closeMenu}
                    />
                  </div>
                  <MobileSubmenuAccordion
                    panel={SUBMENU_PANELS.services}
                    isOpen={mobileExpanded === "services"}
                    onNavigate={closeMenu}
                  />
                </div>

                {/* Work (Right) */}
                <div className="flex flex-col items-center sm:items-end">
                  <div className="relative flex items-center gap-2.5">
                    <Link
                      href="/work/case_studies"
                      onClick={closeMenu}
                      onMouseEnter={() => openPanel("work")}
                      onMouseLeave={scheduleClosePanel}
                      className="group font-voyage text-[34px] sm:text-4xl lg:text-[44px] xl:text-[52px] 2xl:text-[60px] text-[#121212] tracking-tight cursor-pointer leading-none whitespace-nowrap"
                    >
                      <KineticMenuText text="Work" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleMobileSection("work")}
                      aria-label="Toggle Work submenu"
                      className="lg:hidden w-7 h-7 rounded-full border border-black/15 flex items-center justify-center text-sm text-[#121212]"
                    >
                      {mobileExpanded === "work" ? "−" : "+"}
                    </button>

                    <FloatingSubmenuPopup
                      panel={SUBMENU_PANELS.work}
                      isOpen={activeGroup === "work"}
                      onMouseEnter={cancelCloseTimer}
                      onMouseLeave={scheduleClosePanel}
                      onNavigate={closeMenu}
                    />
                  </div>
                  <MobileSubmenuAccordion
                    panel={SUBMENU_PANELS.work}
                    isOpen={mobileExpanded === "work"}
                    onNavigate={closeMenu}
                  />
                </div>
              </div>

              {/* Row 4: Blogs (Centered at base, matching 'People') */}
              <div className="menu-stagger-item flex justify-center">
                <a
                  href="https://blog.gtftechnologies.com/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeMenu}
                  onMouseEnter={clearPanelImmediate}
                  className="group font-voyage text-[34px] sm:text-4xl lg:text-[44px] xl:text-[52px] 2xl:text-[60px] text-[#121212] tracking-tight cursor-pointer leading-none"
                >
                  <KineticMenuText text="Blogs" />
                </a>
              </div>
            </div>

            {/* Single Row Below: Human Resource | Contact */}
            <div className="menu-stagger-item w-full flex flex-col items-center pt-4 lg:pt-5 xl:pt-6 border-t border-black/10">
              <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-10 lg:gap-x-12 gap-y-2">
                <div className="relative flex items-center gap-1.5">
                  <Link
                    href="/human-resource/work_culture"
                    onClick={closeMenu}
                    onMouseEnter={() => openPanel("hr")}
                    onMouseLeave={scheduleClosePanel}
                    className="group font-voyage text-[22px] sm:text-2xl lg:text-[24px] xl:text-[28px] 2xl:text-[32px] text-[#121212] cursor-pointer whitespace-nowrap"
                  >
                    <KineticMenuText text="Human Resource" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleMobileSection("hr")}
                    aria-label="Toggle Human Resource submenu"
                    className="lg:hidden w-6 h-6 rounded-full border border-black/15 flex items-center justify-center text-xs text-[#121212]"
                  >
                    {mobileExpanded === "hr" ? "−" : "+"}
                  </button>

                  <FloatingSubmenuPopup
                    panel={SUBMENU_PANELS.hr}
                    isOpen={activeGroup === "hr"}
                    onMouseEnter={cancelCloseTimer}
                    onMouseLeave={scheduleClosePanel}
                    onNavigate={closeMenu}
                  />
                </div>

                <div className="relative flex items-center gap-1.5">
                  <Link
                    href="/contact/say_hello"
                    onClick={closeMenu}
                    onMouseEnter={() => openPanel("contact")}
                    onMouseLeave={scheduleClosePanel}
                    className="group font-voyage text-[22px] sm:text-2xl lg:text-[24px] xl:text-[28px] 2xl:text-[32px] text-[#121212] cursor-pointer whitespace-nowrap"
                  >
                    <KineticMenuText text="Contact" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleMobileSection("contact")}
                    aria-label="Toggle Contact submenu"
                    className="lg:hidden w-6 h-6 rounded-full border border-black/15 flex items-center justify-center text-xs text-[#121212]"
                  >
                    {mobileExpanded === "contact" ? "−" : "+"}
                  </button>

                  <FloatingSubmenuPopup
                    panel={SUBMENU_PANELS.contact}
                    isOpen={activeGroup === "contact"}
                    onMouseEnter={cancelCloseTimer}
                    onMouseLeave={scheduleClosePanel}
                    onNavigate={closeMenu}
                  />
                </div>
              </div>

              {/* Mobile Accordions for Human Resource & Contact */}
              <div className="w-full max-w-sm">
                <MobileSubmenuAccordion
                  panel={SUBMENU_PANELS.hr}
                  isOpen={mobileExpanded === "hr"}
                  onNavigate={closeMenu}
                />
                <MobileSubmenuAccordion
                  panel={SUBMENU_PANELS.contact}
                  isOpen={mobileExpanded === "contact"}
                  onNavigate={closeMenu}
                />
              </div>
            </div>
          </div>

          {/* BOTTOM FOOTER BAR: 3-Column Grid so Socials are Mathematically Centered under Center Menu */}
          <div className="menu-stagger-item w-full max-w-[1680px] mx-auto border-t border-black/10 pt-3.5 sm:pt-4 grid grid-cols-1 md:grid-cols-3 items-center gap-3.5 sm:gap-4 shrink-0">
            {/* Left: Email */}
            <div className="flex items-center justify-center md:justify-self-start gap-2.5">
              <span className="font-montserrat text-[9.5px] font-semibold tracking-[0.16em] uppercase text-[#6B665E]">
                Email
              </span>
              <a
                href="mailto:hello@gtftechnologies.com"
                className="font-segoe text-[12.5px] xl:text-[13px] text-[#121212] hover:opacity-65 transition-opacity"
              >
                hello@gtftechnologies.com
              </a>
            </div>

            {/* Center: Social Links (Aligned with Center Main Menu) */}
            <div className="flex items-center justify-center md:justify-self-center gap-2">
              {MENU_SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.name}
                  className="font-montserrat text-[10px] font-medium uppercase tracking-[0.08em] text-[#121212] border border-black/15 rounded-full px-3 py-1 hover:bg-[#121212] hover:text-[#F8F6F0] transition-colors duration-200"
                >
                  {social.label}
                </a>
              ))}
            </div>

            {/* Right: Privacy Policy & Sitemap */}
            <div className="flex items-center justify-center md:justify-self-end gap-5 font-segoe text-[12px] text-[#404040]">
              {MENU_LEGAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#121212] transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
