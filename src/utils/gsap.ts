import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure GSAP plugins are registered safely on the client
let registered = false;

export function registerGSAP() {
  if (typeof window !== "undefined" && !registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

// Auto-register on import if in browser
if (typeof window !== "undefined") {
  registerGSAP();
}

export { gsap, ScrollTrigger };

/**
 * Splits text into individual character spans for dissolve/blur letter animations
 */
export function splitTextChars(text: string): { char: string; isSpace: boolean }[] {
  return text.split("").map((char) => ({
    char: char === " " ? "\u00A0" : char,
    isSpace: char === " ",
  }));
}

/**
 * Reusable animation preset: Dissolve & Blur Resolve
 * Animates elements from a blurred, faded state to crisp focus
 */
export function createBlurResolveTween(
  target: gsap.TweenTarget,
  vars: gsap.TweenVars = {}
) {
  return gsap.fromTo(
    target,
    {
      opacity: 0,
      filter: "blur(20px)",
      y: 35,
      scale: 1.05,
      ...vars.from,
    },
    {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      scale: 1,
      ease: "power2.out",
      duration: 1,
      ...vars,
    }
  );
}

/**
 * Reusable ScrollTrigger pinned timeline creator
 */
export function createPinnedScrollTimeline(
  trigger: HTMLElement | string,
  options: {
    end?: string | number | (() => string | number);
    scrub?: boolean | number;
    pinSpacing?: boolean;
    onUpdate?: (self: ScrollTrigger) => void;
    id?: string;
  } = {}
) {
  registerGSAP();

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: "top top",
      end: options.end ?? "+=250%",
      scrub: options.scrub ?? 1.2,
      pin: true,
      pinSpacing: options.pinSpacing ?? true,
      anticipatePin: 1,
      onUpdate: options.onUpdate,
      id: options.id,
    },
  });

  return tl;
}
