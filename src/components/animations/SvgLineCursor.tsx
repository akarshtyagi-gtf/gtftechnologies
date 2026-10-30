"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface SvgLineCursorProps {
  /** Color of the SVG line trail */
  strokeColor?: string;
  /** Width of the line (in px) */
  strokeWidth?: number;
  /** Number of segments in the trailing line */
  trailPointsCount?: number;
  /** Follow speed / elastic ease factor (0.1 = loose/delayed, 0.6 = tight) */
  lerpSpeed?: number;
  /** Display head cursor dot */
  showCursorDot?: boolean;
}

export default function SvgLineCursor({
  strokeColor = "#A3A3A3",
  strokeWidth = 1,
  trailPointsCount = 22,
  lerpSpeed = 0.32,
  showCursorDot = false,
}: SvgLineCursorProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const dotRef = useRef<SVGCircleElement | null>(null);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // Track mouse coordinates
    const mouse = { x: -100, y: -100 };
    let isDragging = false;
    let hasMoved = false;
    let lastMoveTime = Date.now();
    let currentOpacity = 0;

    // Initialize point history for the trailing line
    const points: { x: number; y: number }[] = Array.from(
      { length: trailPointsCount },
      () => ({ x: -100, y: -100 })
    );

    // Mouse & Pointer listeners
    const onPointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      lastMoveTime = Date.now();

      if (!hasMoved) {
        // First move: snap all points to cursor
        points.forEach((p) => {
          p.x = mouse.x;
          p.y = mouse.y;
        });
        hasMoved = true;
      }
    };

    const onPointerDown = () => {
      isDragging = true;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    // Smooth Bézier curve generator with curved approach at the cursor tip
    const createCurvedSvgPath = (
      pts: { x: number; y: number }[],
      target: { x: number; y: number }
    ) => {
      if (pts.length < 2) return "";

      // Start from the tail
      let d = `M ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;

      for (let i = pts.length - 2; i >= 1; i--) {
        const midX = (pts[i].x + pts[i - 1].x) / 2;
        const midY = (pts[i].y + pts[i - 1].y) / 2;
        d += ` Q ${pts[i].x} ${pts[i].y}, ${midX} ${midY}`;
      }

      // Smooth subtle curve leading directly into the cursor tip
      const leadX = (pts[0].x + target.x) / 2;
      const leadY = (pts[0].y + target.y) / 2;
      d += ` Q ${pts[0].x} ${pts[0].y}, ${leadX} ${leadY}`;
      d += ` Q ${leadX} ${leadY}, ${target.x} ${target.y}`;

      return d;
    };

    // GSAP Ticker for smooth 60-120fps physics loop + resolve fade
    const tickerUpdate = () => {
      if (!hasMoved) return;

      const idleTime = Date.now() - lastMoveTime;
      const isIdle = idleTime > 100;

      // Handle dissolve / resolve fade in & fade out animation
      if (isIdle) {
        // Fade out gracefully to 0 when stopping
        currentOpacity += (0 - currentOpacity) * 0.08;
      } else {
        // Fade in quickly to full active opacity
        currentOpacity += (0.65 - currentOpacity) * 0.18;
      }

      const currentLerp = isDragging ? lerpSpeed * 0.7 : lerpSpeed;

      // Update head node towards mouse
      points[0].x += (mouse.x - points[0].x) * currentLerp;
      points[0].y += (mouse.y - points[0].y) * currentLerp;

      // Trailing nodes follow each other
      for (let i = 1; i < points.length; i++) {
        points[i].x += (points[i - 1].x - points[i].x) * currentLerp;
        points[i].y += (points[i - 1].y - points[i].y) * currentLerp;
      }

      // Update SVG path with curved cursor attachment
      if (pathRef.current) {
        pathRef.current.setAttribute("d", createCurvedSvgPath(points, mouse));
        pathRef.current.style.opacity = currentOpacity.toFixed(3);
      }

      // Update optional cursor dot
      if (dotRef.current) {
        dotRef.current.setAttribute("cx", `${mouse.x}`);
        dotRef.current.setAttribute("cy", `${mouse.y}`);
        dotRef.current.style.opacity = currentOpacity.toFixed(3);
      }
    };

    gsap.ticker.add(tickerUpdate);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      gsap.ticker.remove(tickerUpdate);
    };
  }, [strokeWidth, trailPointsCount, lerpSpeed]);

  return (
    <svg
      ref={svgRef}
      className="fixed inset-0 pointer-events-none z-[99999] h-full w-full"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 99999,
      }}
    >
      {/* The Curved Trailing SVG Line with Dissolve Animation */}
      <path
        ref={pathRef}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: 0, transition: "stroke 0.2s ease" }}
      />

      {/* Optional Cursor Dot */}
      {showCursorDot && (
        <circle
          ref={dotRef}
          r={2}
          fill={strokeColor}
          style={{ opacity: 0 }}
        />
      )}
    </svg>
  );
}
