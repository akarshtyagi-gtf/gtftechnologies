"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);

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
  return (
    <>
    <header className="fixed top-0 left-0 w-full z-50 container-padding py-4 sm:py-5 flex items-center justify-between overflow-hidden transition-all duration-300">
        
   

        {/* Left: GTF Technologies Logo */}
      <div className="relative z-10">
  <Link href="#hero" className="block">
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

        {/* Center: Navigation Pill */}
        <div className="hidden md:flex items-center relative z-10">
          <nav className="bg-white/95 border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.06)] rounded-full px-7 py-3 flex items-center gap-3 transition-transform duration-200 hover:scale-[1.01]">
            <a
              href="#work"
              className="font-montserrat font-medium text-[11px] leading-[16.5px] tracking-[1.54px] text-[#404040] hover:text-black uppercase transition-colors"
            >
              WORK
            </a>
            <span className="w-[1px] h-3 bg-black/20 inline-block" />
            <a
              href="#expertise"
              className="font-montserrat font-medium text-[11px] leading-[16.5px] tracking-[1.54px] text-[#404040] hover:text-black uppercase transition-colors"
            >
              EXPERTISE
            </a>
          </nav>
        </div>

        {/* Right: Menu Pill */}
        <div className="relative z-10">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="bg-white/95 border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.06)] rounded-full px-5 py-2.5 sm:px-6 sm:py-3 flex items-center gap-2.5 group cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            aria-label="Toggle Navigation Menu"
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
     </> 
  )
}
