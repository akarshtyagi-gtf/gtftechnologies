"use client";

import React, { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Matter from "matter-js";
import { gsap, ScrollTrigger, splitTextChars } from "@/utils/gsap";
import ContentReveal from "@/components/animations/ContentReveal";
import type { OurTrustData, TrustItem } from "@/types/home";

export const DEFAULT_TRUST_ITEMS: TrustItem[] = [
  {
    id: "trust-23",
    name: "Partner 23",
    image: "/images/our-trust/asset 23.webp",
  },
  {
    id: "trust-24",
    name: "Partner 24",
    image: "/images/our-trust/asset 24.webp",
  },
  {
    id: "trust-25",
    name: "Partner 25",
    image: "/images/our-trust/asset 25.webp",
  },
  {
    id: "trust-26",
    name: "Partner 26",
    image: "/images/our-trust/asset 26.png",
  },
  {
    id: "trust-27",
    name: "Partner 27",
    image: "/images/our-trust/asset 27.webp",
  },
  {
    id: "trust-28",
    name: "Partner 28",
    image: "/images/our-trust/asset 28.webp",
  },
  {
    id: "trust-29",
    name: "Partner 29",
    image: "/images/our-trust/asset 29.webp",
  },
  {
    id: "trust-30",
    name: "Partner 30",
    image: "/images/our-trust/asset 30.webp",
  },
  {
    id: "trust-31",
    name: "Partner 31",
    image: "/images/our-trust/asset 31.webp",
  },
  {
    id: "trust-32",
    name: "Partner 32",
    image: "/images/our-trust/asset 32.webp",
  },
  {
    id: "trust-33",
    name: "Partner 33",
    image: "/images/our-trust/asset 33.webp",
  },
  {
    id: "trust-34",
    name: "Partner 34",
    image: "/images/our-trust/asset 34.webp",
  },
  {
    id: "trust-35",
    name: "Partner 35",
    image: "/images/our-trust/asset 35.webp",
  },
  {
    id: "trust-36",
    name: "Partner 36",
    image: "/images/our-trust/asset 36.webp",
  },
  {
    id: "trust-37",
    name: "Partner 37",
    image: "/images/our-trust/asset 37.webp",
  },
  {
    id: "trust-38",
    name: "Partner 38",
    image: "/images/our-trust/asset 38.webp",
  },
  {
    id: "trust-39",
    name: "Partner 39",
    image: "/images/our-trust/asset 39.webp",
  },
  {
    id: "trust-40",
    name: "Partner 40",
    image: "/images/our-trust/asset 40.webp",
  },
  {
    id: "trust-41",
    name: "Partner 41",
    image: "/images/our-trust/asset 41.webp",
  },
  {
    id: "trust-42",
    name: "Partner 42",
    image: "/images/our-trust/asset 42.webp",
  },
  {
    id: "trust-43",
    name: "Partner 43",
    image: "/images/our-trust/asset 43.webp",
  },
];

const DEFAULT_DATA: OurTrustData = {
  tagline: "OUR SERVICES",
  headingPrefix: "We Are",
  headingHighlight: "Trusted",
  description:
    "A growing network of ambitious brands building stronger identities and stronger digital presence with GTF Technologies",
  items: DEFAULT_TRUST_ITEMS,
};

interface OurTrustProps {
  data?: OurTrustData;
}

export default function OurTrust({ data }: OurTrustProps) {
  const content = { ...DEFAULT_DATA, ...data };
  const items = content.items && content.items.length > 0 ? content.items : DEFAULT_TRUST_ITEMS;

  const sectionRef = useRef<HTMLElement>(null);
  const headingCharsRef = useRef<HTMLHeadingElement>(null);
  const arenaRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLDivElement | null)[]>([]);

  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const bodiesRef = useRef<Matter.Body[]>([]);
  const floorRef = useRef<Matter.Body | null>(null);
  const leftBarrierRef = useRef<Matter.Body | null>(null);
  const rightWallRef = useRef<Matter.Body | null>(null);
  const isStartedRef = useRef(false);
  const isPillsSettledRef = useRef(false);
  const hasCollapsedRef = useRef(false);
  const lastBounceTimesRef = useRef<number[]>([]);

  // Responsive pill sizing helper
  const getPillDimensions = useCallback(() => {
    if (typeof window === "undefined") return { width: 168, height: 56 };
    const w = window.innerWidth;
    if (w < 640) return { width: 130, height: 48 };
    if (w < 1024) return { width: 150, height: 52 };
    if (w < 1440) return { width: 168, height: 56 };
    return { width: 174, height: 58 };
  }, []);

  // Coordinated spawn positions:
  // All 21 partner pills drop on the RIGHT SIDE in successive staggered tiers forming an overlapping mountain stack
  const getSpawnPositions = useCallback((width: number) => {
    return [
      // Tier 1 (Base - 5 pills landing along floor)
      { x: width * 0.52, y: -70, angle: -0.04 },
      { x: width * 0.61, y: -130, angle: 0.05 },
      { x: width * 0.70, y: -190, angle: -0.03 },
      { x: width * 0.79, y: -250, angle: 0.06 },
      { x: width * 0.88, y: -310, angle: -0.02 },
      // Tier 2 (5 pills overlapping base gaps)
      { x: width * 0.56, y: -380, angle: 0.05 },
      { x: width * 0.65, y: -440, angle: -0.06 },
      { x: width * 0.74, y: -500, angle: 0.04 },
      { x: width * 0.83, y: -560, angle: -0.05 },
      { x: width * 0.90, y: -620, angle: 0.08 },
      // Tier 3 (4 pills overlapping)
      { x: width * 0.61, y: -690, angle: -0.05 },
      { x: width * 0.70, y: -750, angle: 0.06 },
      { x: width * 0.79, y: -810, angle: -0.04 },
      { x: width * 0.87, y: -870, angle: 0.07 },
      // Tier 4 (4 pills overlapping)
      { x: width * 0.66, y: -940, angle: 0.04 },
      { x: width * 0.75, y: -1000, angle: -0.06 },
      { x: width * 0.83, y: -1060, angle: 0.05 },
      { x: width * 0.90, y: -1120, angle: -0.04 },
      // Tier 5 (Peak - 3 pills)
      { x: width * 0.72, y: -1190, angle: -0.03 },
      { x: width * 0.80, y: -1250, angle: 0.04 },
      { x: width * 0.76, y: -1310, angle: 0.02 },
    ];
  }, []);

  // Collapse and Bounce Effect - Triggered on mouse hover when the pile is settled
  const triggerCollapseAndBounce = useCallback(() => {
    if (bodiesRef.current.length === 0) return;
    hasCollapsedRef.current = true;

    bodiesRef.current.forEach((body, i) => {
      const tier = i < 5 ? 1 : i < 10 ? 2 : i < 14 ? 3 : i < 18 ? 4 : 5;
      const dir = i % 2 === 0 ? -1 : 1;
      const forceX = dir * (3.5 + Math.random() * 4.5);
      const forceY = -7.5 - tier * 1.4 - Math.random() * 3.0; // High energetic jump bounce!

      Matter.Body.setVelocity(body, {
        x: forceX,
        y: forceY,
      });

      // Controlled gentle rotation to avoid wave/wobble on ends
      Matter.Body.setAngularVelocity(body, dir * 0.05);
    });
  }, []);

  // Individual Pill Jump & Bounce - Called on direct hover over any pill once settled
  const handlePillBounce = useCallback(
    (idx: number) => {
      if (!isPillsSettledRef.current) return;
      if (!hasCollapsedRef.current) {
        triggerCollapseAndBounce();
        return;
      }

      const body = bodiesRef.current[idx];
      if (!body) return;

      // Give this specific pill a punchy, very noticeable jumping bounce upwards and sideways!
      const jumpY = -9.0 - Math.random() * 3.5;
      const pushX = (Math.random() - 0.5) * 6.5;

      Matter.Body.setVelocity(body, {
        x: body.velocity.x * 0.3 + pushX,
        y: jumpY,
      });

      // Damp any extreme spin so the pill stays balanced and doesn't flap its sides
      Matter.Body.setAngularVelocity(body, body.angularVelocity * 0.2);
    },
    [triggerCollapseAndBounce]
  );

  // Restart / Replay Gravity Animation
  const restartAnimation = useCallback(() => {
    if (!arenaRef.current || bodiesRef.current.length === 0 || !engineRef.current) return;
    const arenaW = arenaRef.current.clientWidth || window.innerWidth;
    const spawns = getSpawnPositions(arenaW);

    hasCollapsedRef.current = false;
    isPillsSettledRef.current = false;
    lastBounceTimesRef.current = [];

    bodiesRef.current.forEach((body, i) => {
      const pos = spawns[i] || {
        x: arenaW * 0.75,
        y: -80 - i * 50,
        angle: 0,
      };

      Matter.Body.setPosition(body, {
        x: pos.x,
        y: pos.y,
      });
      Matter.Body.setVelocity(body, {
        x: 0,
        y: 1.2,
      });
      Matter.Body.setAngle(body, pos.angle);
      Matter.Body.setAngularVelocity(body, 0);
    });

    engineRef.current.gravity.y = 1.0;

    // Re-arm hover jumping and collapse after the fall finishes
    setTimeout(() => {
      isPillsSettledRef.current = true;
    }, 2400);
  }, [getSpawnPositions]);

  // Initialize Matter.js Physics Engine
  useEffect(() => {
    if (typeof window === "undefined" || !arenaRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Body, Events } = Matter;

    const arena = arenaRef.current;
    const arenaW = arena.clientWidth || window.innerWidth;
    const arenaH = arena.clientHeight || 540;

    const pillDim = getPillDimensions();

    // 1. Matter.js Engine
    const engine = Engine.create({
      gravity: { x: 0, y: 0, scale: 0.001 },
      enableSleeping: false,
    });
    engineRef.current = engine;

    // 2. Physical Boundaries (Floor, Right Wall, Left Wall)
    const wallThickness = 60;

    // Bottom Floor
    const floor = Bodies.rectangle(
      arenaW / 2,
      arenaH + wallThickness / 2,
      arenaW * 2,
      wallThickness,
      {
        isStatic: true,
        friction: 0.45,
        restitution: 0.70, // Bouncy, energetic floor
      }
    );
    floorRef.current = floor;

    // Right Wall (pills stack high against this wall to form mountain)
    const rightWall = Bodies.rectangle(
      arenaW + wallThickness / 2,
      arenaH / 2,
      wallThickness,
      arenaH * 2,
      {
        isStatic: true,
        friction: 0.35,
        restitution: 0.35,
      }
    );
    rightWallRef.current = rightWall;

    // Left Wall (prevents pills from escaping off the left viewport edge)
    const leftWall = Bodies.rectangle(
      -wallThickness / 2,
      arenaH / 2,
      wallThickness,
      arenaH * 2,
      {
        isStatic: true,
        friction: 0.35,
        restitution: 0.35,
      }
    );
    leftBarrierRef.current = leftWall;

    // 3. Rigid Bodies for Pills
    const spawns = getSpawnPositions(arenaW);
    const bodies: Matter.Body[] = items.map((_, i) => {
      const spawn = spawns[i] || {
        x: arenaW * 0.75,
        y: -80 - i * 50,
        angle: 0,
      };

      const body = Bodies.rectangle(
        spawn.x,
        spawn.y,
        pillDim.width,
        pillDim.height,
        {
          chamfer: { radius: pillDim.height / 2 },
          restitution: 0.65, // Springy, lively collisions
          friction: 0.38,
          frictionAir: 0.012, // Smooth, airy bounce
          density: 0.003,
          angle: spawn.angle,
        }
      );

      return body;
    });

    bodiesRef.current = bodies;

    // 4. Add to world
    Composite.add(engine.world, [floor, rightWall, leftWall, ...bodies]);

    // 5. Mouse and Touch Drag / Throw
    const mouse = Mouse.create(arena);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    Composite.add(engine.world, mouseConstraint);

    // 6. Viewport Clamping & Smooth Direct DOM Transforms at 60/120fps (Zero Verlet Jerking!)
    Events.on(engine, "afterUpdate", () => {
      const halfW = pillDim.width / 2;
      const halfH = pillDim.height / 2;

      bodies.forEach((body, i) => {
        // Cap excessive velocity smoothly so bodies never tunnel through walls
        const speed = Math.hypot(body.velocity.x, body.velocity.y);
        const maxSpeed = 16;
        if (speed > maxSpeed) {
          Body.setVelocity(body, {
            x: (body.velocity.x / speed) * maxSpeed,
            y: (body.velocity.y / speed) * maxSpeed,
          });
        }

        // Top ceiling clamp: keep pills inside arena even on massive leaps
        if (body.position.y < halfH + 20) {
          Body.setPosition(body, { x: body.position.x, y: halfH + 20 });
          if (body.velocity.y < 0) {
            Body.setVelocity(body, { x: body.velocity.x, y: -body.velocity.y * 0.35 });
          }
        }

        // Cap angular velocity so pill never oscillates or flaps its right and left ends like a wave
        if (Math.abs(body.angularVelocity) > 0.08) {
          Body.setAngularVelocity(body, Math.sign(body.angularVelocity) * 0.08);
        }

        // Keep left paragraph clearance if pills bounce into left area
        if (body.position.x < arenaW * 0.45 && body.position.y < 350 && isPillsSettledRef.current) {
          Body.setVelocity(body, {
            x: Math.abs(body.velocity.x) + 1.8,
            y: Math.abs(body.velocity.y) + 0.5,
          });
        }

        // Direct DOM transform without overriding body.position (Verlet safe!)
        const el = pillRefs.current[i];
        if (el) {
          const x = body.position.x - halfW;
          const y = body.position.y - halfH;
          el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${body.angle}rad)`;
        }
      });
    });

    // 7. Start Runner
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // 8. GSAP ScrollTrigger for Heading & Gravity Cascade
    const ctx = gsap.context(() => {
      const headingChars =
        headingCharsRef.current?.querySelectorAll<HTMLElement>(".trust-char-item");

      if (headingChars && headingChars.length > 0) {
        gsap.fromTo(
          headingChars,
          {
            opacity: 0,
            y: 30,
            filter: "blur(10px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: 0.025,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        onEnter: () => {
          if (!isStartedRef.current) {
            isStartedRef.current = true;
            engine.gravity.y = 1.0; // Silky smooth natural gravity

            // Smooth clean downward release
            bodies.forEach((body) => {
              Body.setVelocity(body, {
                x: 0,
                y: 1.2,
              });
              Body.setAngularVelocity(body, 0);
            });

            // Mark settled after 2.4s so all 21 pills land into mountain stack cleanly without premature collapse
            setTimeout(() => {
              isPillsSettledRef.current = true;
            }, 2400);
          }
        },
      });
    }, sectionRef);

    // Viewport check on initial load
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect && rect.top < window.innerHeight * 0.85 && !isStartedRef.current) {
      isStartedRef.current = true;
      engine.gravity.y = 1.0;
      setTimeout(() => {
        isPillsSettledRef.current = true;
      }, 2400);
    }

    // 9. Resize Handling
    const handleResize = () => {
      if (!arenaRef.current || !floorRef.current || !rightWallRef.current || !leftBarrierRef.current)
        return;
      const newW = arenaRef.current.clientWidth;
      const newH = arenaRef.current.clientHeight;

      Body.setPosition(floorRef.current, { x: newW / 2, y: newH + wallThickness / 2 });
      Body.setPosition(rightWallRef.current, { x: newW + wallThickness / 2, y: newH / 2 });
      Body.setPosition(leftBarrierRef.current, { x: -wallThickness / 2, y: newH / 2 });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
      Events.off(engine, "afterUpdate", () => { });
      Runner.stop(runner);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [items, getPillDimensions, getSpawnPositions]);

  // Cursor Interaction - On mouse move near settled pills, jump, bounce, collapse & push!
  const handlePointerInteraction = useCallback(
    (clientX: number, clientY: number) => {
      if (!arenaRef.current || bodiesRef.current.length === 0 || !isPillsSettledRef.current) return;
      const rect = arenaRef.current.getBoundingClientRect();
      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;

      // On initial hover over the settled mountain, trigger the collapse & jump bounce!
      if (!hasCollapsedRef.current) {
        let isNearPills = false;
        for (const body of bodiesRef.current) {
          const dist = Math.hypot(body.position.x - mouseX, body.position.y - mouseY);
          if (dist < 130) {
            isNearPills = true;
            break;
          }
        }
        if (isNearPills) {
          triggerCollapseAndBounce();
          return;
        }
      }

      // Continuous interactive mouse movement: small hover moves trigger strong noticeable bounce!
      const now = Date.now();
      const repulsionRadius = 135;

      bodiesRef.current.forEach((body, idx) => {
        const dx = body.position.x - mouseX;
        const dy = body.position.y - mouseY;
        const dist = Math.hypot(dx, dy);

        // Directly hovering on or very close to pill: give strong noticeable bounce pop!
        if (dist < 88) {
          const lastTime = lastBounceTimesRef.current[idx] || 0;
          if (now - lastTime > 120) {
            lastBounceTimesRef.current[idx] = now;
            const popY = -7.5 - Math.random() * 3.5; // Very noticeable spring pop!
            const popX = (dx !== 0 ? Math.sign(dx) : (Math.random() - 0.5)) * (2.5 + Math.random() * 3.0);
            Matter.Body.setVelocity(body, {
              x: body.velocity.x * 0.3 + popX,
              y: popY,
            });
            Matter.Body.setAngularVelocity(body, body.angularVelocity * 0.2);
          }
        } else if (dist < repulsionRadius) {
          // Nearby tags get a responsive dynamic lift and bounce nudge
          const factor = (repulsionRadius - dist) / repulsionRadius;
          if (body.velocity.y > -2) {
            Matter.Body.setVelocity(body, {
              x: body.velocity.x + (dx / dist) * factor * 2.0,
              y: body.velocity.y - factor * 2.8,
            });
          }
        }
      });
    },
    [triggerCollapseAndBounce]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handlePointerInteraction(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      handlePointerInteraction(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  return (
    <section
      id="trust"
      ref={sectionRef}
      className="relative w-full min-h-[480px] sm:min-h-[510px] lg:min-h-[540px] xl:min-h-[560px] bg-[#F8F6F0] overflow-hidden pt-8 sm:pt-10 lg:pt-12 pb-6 sm:pb-8 flex flex-col justify-start"
    >
      {/* 1. Background Texture matching site-wide aesthetic */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/images/texture/bg-texture.png"
          alt="Background Texture"
          fill
          className="object-cover object-center opacity-85 mix-blend-multiply"
        />
      </div>

      {/* 2. Ping Reset Outline Circle Button (Top Right) */}
      <div className="absolute top-5 sm:top-7 right-5 sm:right-8 lg:right-12 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={restartAnimation}
          aria-label="Restart Gravity Tag Pile"
          className="group/reset relative w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#121212]/20 bg-white/80 backdrop-blur-md shadow-[0_4px_14px_rgba(0,0,0,0.06)] flex items-center justify-center text-[#121212] transition-all duration-300 hover:scale-110 hover:border-[#121212]/50 hover:bg-white active:scale-95 cursor-pointer"
          title="Restart Gravity Pile"
        >
          {/* Animated Ping Ring */}
          <span className="absolute inset-0 rounded-full border border-[#121212]/35 animate-ping opacity-40 pointer-events-none" />

          {/* Replay Circular SVG Icon */}
          <svg
            className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-500 ease-out group-hover/reset:-rotate-180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21h5v-5" />
          </svg>
        </button>
      </div>

      {/* 3. Left Editorial Content Layer (Figma Layout & Spacing) */}
      <div className="relative z-10 w-full max-w-[1440px] 2xl:max-w-[1560px] mx-auto container-padding pointer-events-none">
        <div className="max-w-xl flex flex-col justify-between min-h-[350px] sm:min-h-[380px] lg:min-h-[410px]">

          {/* Top Block: Tagline & Heading */}
          <div className="pt-2 sm:pt-4">
            {/* Tagline at Top Left */}
            <div className="pointer-events-auto">
              <span className="font-segoe text-[11px] sm:text-xs font-semibold tracking-[0.24em] text-[#121212]/80 uppercase">
                {content.tagline || "OUR SERVICES"}
              </span>
            </div>

            {/* Little space after Tagline, then Heading: We Are [Trusted] */}
            <div className="mt-3 sm:mt-4 lg:mt-4.5 pointer-events-auto">
              <h2
                ref={headingCharsRef}
                className="font-voyage text-4xl sm:text-5xl lg:text-[56px] xl:text-[66px] text-[#121212] font-normal tracking-tight flex flex-wrap items-baseline gap-x-2.5 sm:gap-x-3.5 will-change-[transform,filter,opacity]"
                style={{
                  fontFamily: "var(--font-voyage), Voyage, serif",
                }}
              >
                <span className="inline-flex items-baseline">
                  {splitTextChars(content.headingPrefix || "We Are").map((item, idx) => (
                    <span
                      key={`pre-${idx}`}
                      className="trust-char-item inline-block will-change-[transform,filter,opacity]"
                    >
                      {item.char}
                    </span>
                  ))}
                </span>

                {/* Yellow Highlighted Box behind "Trusted" - locked to exact same horizontal baseline */}
                <span className="relative inline-flex items-baseline px-2.5 sm:px-3.5 py-0.5 sm:py-1 bg-[#FFF078] text-[#121212] rounded-[6px] shadow-[0_2px_10px_-2px_rgba(253,224,71,0.4)]">
                  {splitTextChars(content.headingHighlight || "Trusted").map((item, idx) => (
                    <span
                      key={`high-${idx}`}
                      className="trust-char-item inline-block will-change-[transform,filter,opacity]"
                    >
                      {item.char}
                    </span>
                  ))}
                </span>
              </h2>
            </div>
          </div>

          {/* Bottom Block: Paragraph shifted to bottom side with sufficient space */}
          <div className="mt-10 sm:mt-14 lg:mt-12 pb-2 sm:pb-3 max-w-sm sm:max-w-md pointer-events-auto">
            <ContentReveal
              triggerOnScroll
              duration={0.7}
              yOffset={14}
              blurAmount={6}
            >
              <p className="font-segoe text-xs sm:text-sm lg:text-[17px] text-[#444444] font-normal leading-relaxed">
                {content.description ||
                  "A growing network of ambitious brands building stronger identities and stronger digital presence with GTF Technologies"}
              </p>
            </ContentReveal>
          </div>

        </div>
      </div>

      {/* 4. Matter.js Gravity Arena across Full Width */}
      <div
        ref={arenaRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="absolute inset-0 z-20 w-full h-full overflow-hidden select-none pointer-events-auto touch-none"
      >
        {/* Physics-driven Logo Pills with Right-Angle Overlap Effect */}
        {items.map((item, idx) => (
          <div
            key={item.id}
            ref={(el) => {
              pillRefs.current[idx] = el;
            }}
            onPointerEnter={() => handlePillBounce(idx)}
            className="absolute left-0 top-0 will-change-transform cursor-grab active:cursor-grabbing select-none"
            style={{
              transformOrigin: "center center",
              transform: "translate3d(0, -999px, 0)",
              zIndex: 10 + idx,
            }}
          >
            {/* Rigid Capsule Badge - No wave or shadow distortion on hover */}
            <div
              className="relative w-[130px] h-[48px] sm:w-[150px] sm:h-[52px] lg:w-[168px] lg:h-[56px] xl:w-[174px] xl:h-[58px] rounded-full bg-white shadow-[0_4px_16px_-3px_rgba(0,0,0,0.08),0_1px_4px_-1px_rgba(0,0,0,0.03)] border border-black/[0.04] flex items-center justify-center px-3 sm:px-4 py-1.5 overflow-hidden"
            >
              <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={140}
                  height={48}
                  className="max-h-[36px] sm:max-h-[40px] lg:max-h-[85px] w-auto max-w-[110px] sm:max-w-[128px] lg:max-w-[190px] object-contain select-none pointer-events-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
