"use client";

interface KineticMenuTextProps {
  text: string;
  className?: string;
  /** Per-character stagger delay in ms (default: 26ms for a clearly noticeable wave) */
  staggerMs?: number;
  /** Transition duration in ms (default: 750ms for slow, smooth motion) */
  durationMs?: number;
}

/**
 * Reusable kinetic letter-roll text animation.
 * Wrap in a parent with the Tailwind `group` class to trigger on hover.
 */
export function KineticMenuText({
  text,
  className = "",
  staggerMs = 40,
  durationMs = 1050,
}: KineticMenuTextProps) {
  const chars = Array.from(text);

  return (
    <span
      className={`relative inline-flex overflow-hidden leading-[1.14] py-[0.06em] px-[0.08em] -mx-[0.08em] ${className}`}
    >
      {/* Default layer: slides upward smoothly on parent group hover */}
      <span className="inline-flex" aria-hidden="true">
        {chars.map((char, idx) => (
          <span
            key={`base-${idx}`}
            style={{
              transitionDelay: `${idx * staggerMs}ms`,
              transitionDuration: `${durationMs}ms`,
            }}
            className="inline-block transition-transform ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[125%]"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>

      {/* Hover layer: enters from bottom tilted at 60deg and settles cleanly to 0deg */}
      <span
        className="absolute inset-0 py-[0.06em] px-[0.08em] inline-flex"
        aria-hidden="true"
      >
        {chars.map((char, idx) => (
          <span
            key={`hover-${idx}`}
            style={{
              transitionDelay: `${idx * staggerMs}ms`,
              transitionDuration: `${durationMs}ms`,
            }}
            className="inline-block origin-bottom-left translate-y-[125%] rotate-[60deg] opacity-0 transition-all ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:rotate-0 group-hover:opacity-100"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>

      <span className="sr-only">{text}</span>
    </span>
  );
}

export default KineticMenuText;
