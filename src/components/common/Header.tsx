"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import KineticMenuText from "@/components/animations/KineticMenuText";
import GtfLogo from "@/components/common/GtfLogo";
import GtfWhiteLogo from "@/components/common/GtfWhiteLogo";
import { HEADER_THEME_EVENT, HeaderTheme } from "@/utils/headerTheme";

interface SubMenuItem {
  label: string;
  href: string;
  external?: boolean;
}

const PROCESS_ITEMS: SubMenuItem[] = [
  { label: "Research", href: "/how-we-work/SEO_keyword_research" },
  { label: "Brand Strategy Launch", href: "/brand-strategy-launch" },
  { label: "Digital Media Planning", href: "/how-we-work/digital_media_planning" },
  { label: "Concept Content & Creative", href: "/how-we-work/contentcreative" },
  { label: "Data Analysis & ROI", href: "/how-we-work/data_analysis_roi" },
];

const SERVICES_ITEMS: SubMenuItem[] = [
  { label: "Brand Strategy", href: "/service/brand-strategy" },
  { label: "Social Media Amplification", href: "/services/social-media-amplification" },
  { label: "Website Creative", href: "/services/website-creative" },
  { label: "Digital Marketing", href: "/services/digital-marketing" },
  { label: "AI Innovation", href: "/services/ai-innovation" },
  { label: "Celebrity/Influencer Marketing", href: "/services/celebrity-influencer-marketing" },
];

const WORK_ITEMS: SubMenuItem[] = [
  { label: "Websites & Landing Pages", href: "/work/portfolio/websites_landing_pages" },
  { label: "Creatives & AI Videos", href: "/work/portfolio/creatives" },
  { label: "Logos", href: "/work/portfolio/logos" },
  { label: "Case Studies", href: "/work/case_studies" },
  { label: "Clients", href: "/work/clients" },
];

const HR_ITEMS: SubMenuItem[] = [
  { label: "Work Culture", href: "/human-resource/work_culture" },
  { label: "Work With Us", href: "/human-resource/work_with_us" },
  { label: "Life At GTF", href: "/human-resource/life_at_gtf" },
];

const CONTACT_ITEMS: SubMenuItem[] = [
  { label: "Request For Quote", href: "/contact/request_quote" },
  { label: "Say Hello!", href: "/contact/say_hello" },
];

const GTF_LOCATIONS = [
  {
    city: "Delhi NCR",
    href: "https://www.gtftechnologies.com/delhi-ncr",
    phone: "+91-9953-91-7978",
    tel: "+919953917978",
  },
  {
    city: "Mumbai",
    href: "https://www.gtftechnologies.com/mumbai",
    phone: "+91-9582-53-2488",
    tel: "+919582532488",
  },
  {
    city: "Pune",
    href: "https://www.gtftechnologies.com/pune",
    phone: "+91-9953-60-5303",
    tel: "+919953605303",
  },
  {
    city: "Bangalore",
    href: "https://www.gtftechnologies.com/bangalore",
    phone: "+91-7838-80-0248",
    tel: "+917838800248",
  },
  {
    city: "Hyderabad",
    href: "https://www.gtftechnologies.com/hyderabad",
    phone: "+91-7838-50-0356",
    tel: "+917838500356",
  },
];

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

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isWhiteLogo, setIsWhiteLogo] = useState(false);
  const [isSubmenuViewOpen, setIsSubmenuViewOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const centerNavRef = useRef<HTMLDivElement>(null);
  const submenuColumnsRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);
  const isFirstSubmenuToggle = useRef(true);

  // GSAP entrance reveal for the top header
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

  // Parallax open/close GSAP animation + scroll lock
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
    };
  }, [menuOpen]);

  // Reset logo theme on route changes
  useEffect(() => {
    setIsWhiteLogo(false);
  }, [pathname]);

  // Synchronize logo color with global header theme events
  useEffect(() => {
    if (typeof window !== "undefined" && window.__gtfHeaderTheme) {
      setIsWhiteLogo(window.__gtfHeaderTheme === "dark");
    }

    const onThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme?: HeaderTheme }>;
      if (customEvent.detail?.theme) {
        setIsWhiteLogo(customEvent.detail.theme === "dark");
      }
    };

    window.addEventListener(HEADER_THEME_EVENT, onThemeChange);
    return () => {
      window.removeEventListener(HEADER_THEME_EVENT, onThemeChange);
    };
  }, []);

  // GSAP animation when toggling between Center Navigation and Full Column Submenu
  useEffect(() => {
    if (!menuOpen) {
      setIsSubmenuViewOpen(false);
      isFirstSubmenuToggle.current = true;
      if (centerNavRef.current) {
        gsap.set(centerNavRef.current, { opacity: 1, y: 0, filter: "blur(0px)", visibility: "visible", pointerEvents: "auto" });
      }
      if (submenuColumnsRef.current) {
        gsap.set(submenuColumnsRef.current, { opacity: 0, y: 36, filter: "blur(8px)", visibility: "hidden", pointerEvents: "none" });
      }
      return;
    }

    if (isFirstSubmenuToggle.current) {
      isFirstSubmenuToggle.current = false;
      return;
    }

    const centerNav = centerNavRef.current;
    const submenuCols = submenuColumnsRef.current;
    if (!centerNav || !submenuCols) return;

    if (isSubmenuViewOpen) {
      // Center navigation exits upwards
      gsap.to(centerNav, {
        opacity: 0,
        y: -36,
        filter: "blur(6px)",
        duration: 0.42,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(centerNav, { visibility: "hidden", pointerEvents: "none" });
        },
      });

      // Submenu columns enter smoothly from below
      gsap.set(submenuCols, { visibility: "visible", pointerEvents: "auto" });
      gsap.fromTo(
        submenuCols,
        { opacity: 0, y: 36, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.58,
          delay: 0.12,
          ease: "power3.out",
        }
      );

      const colElements = submenuCols.querySelectorAll<HTMLElement>(".submenu-col-item");
      if (colElements.length > 0) {
        gsap.fromTo(
          colElements,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.055,
            delay: 0.18,
            ease: "power3.out",
          }
        );
      }
    } else {
      // Submenu columns exit downwards
      gsap.to(submenuCols, {
        opacity: 0,
        y: 36,
        filter: "blur(6px)",
        duration: 0.38,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(submenuCols, { visibility: "hidden", pointerEvents: "none" });
        },
      });

      // Center navigation returns
      gsap.set(centerNav, { visibility: "visible", pointerEvents: "auto" });
      gsap.fromTo(
        centerNav,
        { opacity: 0, y: -24, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.52,
          delay: 0.1,
          ease: "power3.out",
        }
      );
    }
  }, [isSubmenuViewOpen, menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    setIsSubmenuViewOpen(false);
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-50 container-padding py-4 sm:py-5 flex items-center justify-between transition-all duration-300"
      >
        {/* Left: GTF Technologies Logo */}
        <div className="header-reveal-item relative z-10">
          <Link href="/" onClick={closeMenu} className="relative block h-11 sm:h-16">
           <Image
    src="/images/logonew.svg"
    alt="GTF Technologies Logo"
    width={200}
    height={76}
    priority
    className={`h-full w-auto transition-opacity duration-300 ${
      isWhiteLogo ? "opacity-0 pointer-events-none" : "opacity-100"
    }`}
  />
            <GtfWhiteLogo
              className={`absolute top-0 left-0 h-full w-auto transition-opacity duration-300 ${
                isWhiteLogo ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            />
          </Link>
        </div>

        {/* Center: Navigation Pill */}
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
      {/* FULLSCREEN EDITORIAL MENU OVERLAY */}
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

        {/* Main Center Editorial Layout + Bottom Footer Strip */}
        <div
          ref={contentRef}
          className="relative z-10 w-full min-h-screen lg:h-screen container-padding pt-4 sm:pt-6 lg:pt-5 lg:pb-7 xl:pt-6 xl:pb-8 pb-8 sm:pb-10 flex flex-col justify-between"
        >
          {/* Top Bar: Brand Logo & Close Button */}
          <div className="menu-stagger-item relative w-full max-w-[1680px] mx-auto flex items-center justify-between sm:justify-center shrink-0">
            <Link href="/" onClick={closeMenu} className="relative block">
              <Image
                src="/images/logonew.svg"
                alt="GTF Logo"
                width={200}
                height={76}
                className="h-11 sm:h-14 lg:h-[58px] xl:h-[68px] 2xl:h-[76px] w-auto"
                priority
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

          {/* MIDDLE AREA: Hosting View A (Center Nav) & View B (5-Column Submenu Directory) */}
          <div className="relative w-full flex-1 flex items-center justify-center py-2 lg:py-1 min-h-0 mb-2 sm:mb-3">
            {/* VIEW A: Main Center Navigation (Clean links with KineticMenuText, NO hover dropdowns) */}
            <div
              ref={centerNavRef}
              className="w-full max-w-[740px] lg:max-w-[540px] xl:max-w-[640px] 2xl:max-w-[720px] mx-auto flex flex-col items-center justify-center py-4 will-change-[transform,opacity]"
            >
              {/* Main Menu Items */}
              <div className="w-full flex flex-col gap-4 sm:gap-5 lg:gap-5 xl:gap-6 2xl:gap-7 mb-6 sm:mb-7 lg:mb-7 xl:mb-8">
                {/* Row 1: About Us */}
                <div className="menu-stagger-item flex justify-center sm:justify-start sm:pl-[20%] lg:pl-[22%]">
                  <Link
                    href="/who-we-are/about-gtf"
                    onClick={closeMenu}
                    className="group font-voyage text-[34px] sm:text-4xl lg:text-[44px] xl:text-[52px] 2xl:text-[60px] text-[#121212] tracking-tight cursor-pointer leading-none"
                  >
                    <KineticMenuText text="About Us" />
                  </Link>
                </div>

                {/* Row 2: Process of Working */}
                <div className="menu-stagger-item flex justify-center sm:justify-end sm:pr-[2%] lg:pr-[4%]">
                  <Link
                    href="/how-we-work/SEO_keyword_research"
                    onClick={closeMenu}
                    className="group font-voyage text-[32px] sm:text-4xl lg:text-[44px] xl:text-[52px] 2xl:text-[60px] text-[#121212] tracking-tight cursor-pointer leading-none whitespace-nowrap mb-2"
                  >
                    <KineticMenuText text="Process of Working" />
                  </Link>
                </div>

                {/* Row 3: Services (Left) & Work (Right) */}
                <div className="menu-stagger-item w-full grid grid-cols-1 sm:grid-cols-2 items-center gap-4 sm:gap-10 px-0 sm:px-[3%] lg:px-[4%]">
                  {/* Services (Left) */}
                  <div className="flex justify-center sm:justify-start">
                    <Link
                      href="/service"
                      onClick={closeMenu}
                      className="group font-voyage text-[34px] sm:text-4xl lg:text-[44px] xl:text-[52px] 2xl:text-[60px] text-[#121212] tracking-tight cursor-pointer leading-none whitespace-nowrap"
                    >
                      <KineticMenuText text="Services" />
                    </Link>
                  </div>

                  {/* Work (Right) */}
                  <div className="flex justify-center sm:justify-end">
                    <Link
                      href="/work/case_studies"
                      onClick={closeMenu}
                      className="group font-voyage text-[34px] sm:text-4xl lg:text-[44px] xl:text-[52px] 2xl:text-[60px] text-[#121212] tracking-tight cursor-pointer leading-none whitespace-nowrap"
                    >
                      <KineticMenuText text="Work" />
                    </Link>
                  </div>
                </div>

                {/* Row 4: Blogs */}
                <div className="menu-stagger-item flex justify-center">
                  <a
                    href="https://blog.gtftechnologies.com/"
                    target="_blank"
                    rel="noreferrer"
                    onClick={closeMenu}
                    className="group font-voyage text-[34px] sm:text-4xl lg:text-[44px] xl:text-[52px] 2xl:text-[60px] text-[#121212] tracking-tight cursor-pointer leading-none"
                  >
                    <KineticMenuText text="Blogs" />
                  </a>
                </div>
              </div>

              {/* Single Row Below: Human Resource | Contact */}
              <div className="menu-stagger-item w-full flex flex-col items-center pt-4 lg:pt-5 xl:pt-6 border-t border-black/10">
                <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-10 lg:gap-x-12 gap-y-2">
                  <Link
                    href="/human-resource/work_culture"
                    onClick={closeMenu}
                    className="group font-voyage text-[22px] sm:text-2xl lg:text-[24px] xl:text-[28px] 2xl:text-[32px] text-[#121212] cursor-pointer whitespace-nowrap"
                  >
                    <KineticMenuText text="Human Resource" />
                  </Link>

                  <Link
                    href="/contact/say_hello"
                    onClick={closeMenu}
                    className="group font-voyage text-[22px] sm:text-2xl lg:text-[24px] xl:text-[28px] 2xl:text-[32px] text-[#121212] cursor-pointer whitespace-nowrap"
                  >
                    <KineticMenuText text="Contact" />
                  </Link>
                </div>
              </div>
            </div>

            {/* VIEW B: Expanded Full Submenu Directory in 5-Column Alignment (Address in CENTER) */}
            <div
              ref={submenuColumnsRef}
              style={{ visibility: "hidden", opacity: 0 }}
              className="absolute inset-0 w-full max-w-[1680px] mx-auto flex items-center justify-center px-4 sm:px-6 py-4 overflow-y-auto lg:overflow-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden will-change-[transform,opacity]"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 xl:gap-8 2xl:gap-10 w-full max-w-[1540px] xl:max-w-[1640px] 2xl:max-w-[1680px] items-stretch">
                
                {/* Column 1: Process of Working */}
                <div className="submenu-col-item flex flex-col justify-between pr-0 lg:pr-5 xl:pr-6 border-b sm:border-b-0 lg:border-r border-black/[0.08] pb-5 lg:pb-0">
                  <div>
                    <div className="mb-3.5 pb-2.5 border-b border-black/10">
                      <span className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-[#8C827A] font-semibold block">
                        01 / Methodology
                      </span>
                      <h3 className="font-voyage text-[24px] sm:text-[26px] xl:text-[28px] 2xl:text-[32px] text-[#121212] tracking-tight leading-tight mt-0.5">
                        Process
                      </h3>
                    </div>
                    <ul className="space-y-2 sm:space-y-2.5">
                      {PROCESS_ITEMS.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={closeMenu}
                            className="font-segoe text-[13.5px] xl:text-[14.5px] 2xl:text-[15px] text-[#2E2B27] hover:text-[#121212] hover:translate-x-1 transition-all duration-200 block py-0.5"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Column 2: Services */}
                <div className="submenu-col-item flex flex-col justify-between pr-0 lg:pr-5 xl:pr-6 border-b sm:border-b-0 lg:border-r border-black/[0.08] pb-5 lg:pb-0">
                  <div>
                    <div className="mb-3.5 pb-2.5 border-b border-black/10">
                      <span className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-[#8C827A] font-semibold block">
                        02 / Capabilities
                      </span>
                      <h3 className="font-voyage text-[24px] sm:text-[26px] xl:text-[28px] 2xl:text-[32px] text-[#121212] tracking-tight leading-tight mt-0.5">
                        Services
                      </h3>
                    </div>
                    <ul className="space-y-2 sm:space-y-2.5">
                      {SERVICES_ITEMS.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={closeMenu}
                            className="font-segoe text-[13.5px] xl:text-[14.5px] 2xl:text-[15px] text-[#2E2B27] hover:text-[#121212] hover:translate-x-1 transition-all duration-200 block py-0.5"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Column 3 (CENTER): Address & Locations (Delhi NCR, Mumbai, Pune, Bangalore, Hyderabad) */}
                <div className="submenu-col-item flex flex-col justify-between px-0 lg:px-5 xl:px-6 border-b sm:border-b-0 lg:border-r border-black/[0.08] pb-5 lg:pb-0 bg-black/[0.015] rounded-xl lg:rounded-none py-3 lg:py-0">
                  <div>
                    <div className="mb-3.5 pb-2.5 border-b border-black/10">
                      <span className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-[#8C827A] font-semibold block">
                        03 / Presence
                      </span>
                      <h3 className="font-voyage text-[24px] sm:text-[26px] xl:text-[28px] 2xl:text-[32px] text-[#121212] tracking-tight leading-tight mt-0.5">
                        Offices
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {GTF_LOCATIONS.map((loc) => (
                        <li key={loc.city} className="group/loc">
                          <a
                            href={loc.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={closeMenu}
                            className="inline-flex items-center gap-1.5 font-segoe font-medium text-[14px] xl:text-[15px] text-[#121212] hover:text-[#57534E] transition-colors"
                          >
                            <span>{loc.city}</span>
                            <svg
                              width="9"
                              height="9"
                              viewBox="0 0 10 10"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="opacity-40 group-hover/loc:opacity-100 group-hover/loc:translate-x-0.5 group-hover/loc:-translate-y-0.5 transition-all"
                            >
                              <path
                                d="M2.5 7.5L7.5 2.5M7.5 2.5H3.5M7.5 2.5V6.5"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </a>
                          <a
                            href={`tel:${loc.tel}`}
                            className="block font-montserrat text-[11.5px] xl:text-[12px] text-[#6B665E] hover:text-[#121212] tracking-[0.03em] transition-colors mt-0.5"
                          >
                            {loc.phone}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Column 4: Work */}
                <div className="submenu-col-item flex flex-col justify-between pr-0 lg:pr-5 xl:pr-6 border-b sm:border-b-0 lg:border-r border-black/[0.08] pb-5 lg:pb-0">
                  <div>
                    <div className="mb-3.5 pb-2.5 border-b border-black/10">
                      <span className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-[#8C827A] font-semibold block">
                        04 / Showcase
                      </span>
                      <h3 className="font-voyage text-[24px] sm:text-[26px] xl:text-[28px] 2xl:text-[32px] text-[#121212] tracking-tight leading-tight mt-0.5">
                        Work
                      </h3>
                    </div>
                    <ul className="space-y-2 sm:space-y-2.5">
                      {WORK_ITEMS.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={closeMenu}
                            className="font-segoe text-[13.5px] xl:text-[14.5px] 2xl:text-[15px] text-[#2E2B27] hover:text-[#121212] hover:translate-x-1 transition-all duration-200 block py-0.5"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Column 5: Human Resource & Contact (Same column, separate headings) */}
                <div className="submenu-col-item flex flex-col justify-between">
                  <div className="space-y-5 sm:space-y-6">
                    {/* Heading 1: Human Resource */}
                    <div>
                      <div className="mb-2.5 pb-2 border-b border-black/10">
                        <span className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-[#8C827A] font-semibold block">
                          05 / People
                        </span>
                        <h3 className="font-voyage text-[22px] sm:text-[24px] xl:text-[26px] 2xl:text-[28px] text-[#121212] tracking-tight leading-tight mt-0.5">
                          Human Resource
                        </h3>
                      </div>
                      <ul className="space-y-1.5 sm:space-y-2">
                        {HR_ITEMS.map((item) => (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              onClick={closeMenu}
                              className="font-segoe text-[13.5px] xl:text-[14.5px] 2xl:text-[15px] text-[#2E2B27] hover:text-[#121212] hover:translate-x-1 transition-all duration-200 block py-0.5"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Heading 2: Contact */}
                    <div>
                      <div className="mb-2.5 pb-2 border-b border-black/10">
                        <span className="font-montserrat text-[10px] uppercase tracking-[0.2em] text-[#8C827A] font-semibold block">
                          06 / Connect
                        </span>
                        <h3 className="font-voyage text-[22px] sm:text-[24px] xl:text-[26px] 2xl:text-[28px] text-[#121212] tracking-tight leading-tight mt-0.5">
                          Contact
                        </h3>
                      </div>
                      <ul className="space-y-1.5 sm:space-y-2">
                        {CONTACT_ITEMS.map((item) => (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              onClick={closeMenu}
                              className="font-segoe text-[13.5px] xl:text-[14.5px] 2xl:text-[15px] text-[#2E2B27] hover:text-[#121212] hover:translate-x-1 transition-all duration-200 block py-0.5"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* BOTTOM FOOTER BAR: 3-Column Grid + Centered Ping Glow Down/Up Arrow Button */}
          <div className="menu-stagger-item relative w-full max-w-[1680px] mx-auto border-t border-black/10 pt-5 sm:pt-6 lg:pt-6 pb-1 grid grid-cols-1 md:grid-cols-3 items-center gap-3 sm:gap-4 shrink-0">
            {/* Center Ping Glow Toggle Button directly on top of the footer line */}
            <div className="absolute left-1/2 -top-3.5 sm:-top-4 -translate-x-1/2 z-30 flex flex-col items-center">
              <button
                type="button"
                onClick={() => setIsSubmenuViewOpen((prev) => !prev)}
                className="group relative flex items-center justify-center cursor-pointer focus:outline-none"
                aria-label={isSubmenuViewOpen ? "Back to Main Navigation" : "Reveal Full Submenu Directory"}
                aria-expanded={isSubmenuViewOpen}
              >
                {/* Decreased Ping Glow Ring (Subtle, compact radar ping) */}
                <span className="absolute -inset-1 rounded-full bg-black/10 animate-ping pointer-events-none" />

                {/* Subtle ambient glow backing */}
                <span className="absolute -inset-0.5 rounded-full bg-[#121212]/8 blur-[2px] pointer-events-none" />

                {/* Decreased Button Body (Compact & refined) */}
                <div className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F8F6F0] border border-black/20 shadow-[0_2px_10px_rgba(0,0,0,0.08)] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-black/50 group-hover:shadow-[0_4px_14px_rgba(0,0,0,0.14)] active:scale-95">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`text-[#121212] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isSubmenuViewOpen ? "rotate-180 -translate-y-0.5" : "translate-y-0.5"
                    }`}
                  >
                    <path
                      d="M3.5 6L8 10.5L12.5 6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
            </div>

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
