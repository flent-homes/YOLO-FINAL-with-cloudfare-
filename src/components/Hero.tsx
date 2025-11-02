import React, { useEffect, useRef, useState } from "react";

/* Inline parachute (no SVGR dependency) */
function ParachuteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...props}>
      <path d="M8 20 C 24 4, 40 4, 56 20" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 20 Q 32 8 56 20 L 8 20 Z" fill="currentColor"/>
      <text x="32" y="17" textAnchor="middle" fontSize="6" fill="#000"
            style={{fontFamily:"Plus Jakarta Sans,system-ui"}}>FLENT</text>
      <line x1="32" y1="20" x2="32" y2="32" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="24" y1="20" x2="32" y2="32" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="40" y1="20" x2="32" y2="32" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="32" cy="36" r="2" fill="currentColor"/>
      <line x1="32" y1="38" x2="32" y2="46" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="32" y1="40.5" x2="26.5" y2="44" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="32" y1="40.5" x2="37.5" y2="44" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="32" y1="46" x2="28" y2="52" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="32" y1="46" x2="36" y2="52" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

export const Hero = () => {
  const [showNavigation, setShowNavigation] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const chuteRef = useRef<SVGSVGElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const navTimer = setTimeout(() => setShowNavigation(true), 2000);

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (chuteRef.current) chuteRef.current.style.opacity = "0";
      if (dotRef.current) {
        dotRef.current.style.opacity = "1";
        dotRef.current.style.color = "#FF6A3D";
      }
      return () => clearTimeout(navTimer);
    }

    const hero = heroRef.current;
    if (!hero) return () => clearTimeout(navTimer);

    let played = false;

    const play = () => {
      const chute = chuteRef.current;
      const dot = dotRef.current;
      if (played || !chute || !dot) return;
      played = true;
      runParachute(chute, dot);
    };

    // fire if already visible (fixes IO race)
    const r = hero.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.8 && r.bottom > 0) play();

    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && play(),
      { threshold: 0.1 }
    );
    io.observe(hero);
    
    return () => {
      clearTimeout(navTimer);
      io.disconnect();
    };
  }, []);

  const scrollToStory = () => {
    const storySection = document.getElementById("story");
    storySection?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToExperience = () => {
    const experienceSection = document.getElementById("experience");
    experienceSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen bg-dark-bg text-light-text grid place-items-center"
      style={{ overflow: "visible", zIndex: 1 }}
    >
      <div className="text-center leading-[1.05] px-6 relative">
        <h1 className="font-display text-[clamp(40px,8vw,112px)] text-light-text leading-none mb-2">
          You only live once.
        </h1>
        <p className="font-display italic text-[clamp(24px,4.5vw,56px)] text-light-text/90 leading-none relative inline-block mt-2">
          Do it with Flent
          {/* dynamic period dot (starts invisible) */}
          <span
            ref={dotRef}
            aria-hidden="true"
            className="inline-block align-baseline translate-y-[-0.12em] ml-[0.02em] opacity-0"
            style={{ width: "0.5em", height: "0.5em", borderRadius: "9999px", background: "currentColor" }}
          />
          {/* smaller parachute */}
          <ParachuteIcon
            ref={chuteRef as any}
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              top: "-18svh",
              width: "52px",
              color: "#FFFFFF",
              zIndex: 3,
            }}
          />
        </p>
      </div>

      {/* Navigation */}
      {showNavigation && (
        <div className="absolute bottom-12 right-12 flex gap-4 text-sm font-sans animate-fade-in">
          <button
            onClick={scrollToStory}
            className="text-light-text/60 hover:text-coral transition-colors duration-300"
          >
            Scroll for the story
          </button>
          <span className="text-light-text/40">•</span>
          <button
            onClick={scrollToExperience}
            className="text-light-text/60 hover:text-coral transition-colors duration-300 flex items-center gap-2"
          >
            Skip to the experience <span className="text-xs">↓</span>
          </button>
        </div>
      )}
    </section>
  );
};

/* ---------- animation ---------- */
function runParachute(chute: Element, dot: HTMLElement) {
  // fall + gentle sway (visible the whole way)
  const fall = chute.animate(
    [
      { transform: "translate(-50%, -18svh) rotate(0deg)" },
      { transform: "translate(-49%, -8svh) rotate(3deg)" },
      { transform: "translate(-51%, -2svh) rotate(-2.5deg)" },
      { transform: "translate(-50%, 0) rotate(0deg)" }
    ],
    { duration: 900, easing: "cubic-bezier(.22,.84,.36,1)", fill: "forwards" }
  );

  fall.finished.then(() => {
    chute
      .animate(
        [
          { transform: "translate(-50%, 0) rotate(0deg)" },
          { transform: "translate(calc(-50% - 1.5px), 0) rotate(-2deg)" },
          { transform: "translate(calc(-50% + 1.5px), 0) rotate(1.5deg)" },
          { transform: "translate(-50%, 0) rotate(0deg)" }
        ],
        { duration: 360, easing: "ease-out", fill: "forwards" }
      )
      .finished.then(() => morphToPeriod(chute as HTMLElement, dot));
  });
}

function morphToPeriod(chuteEl: HTMLElement, dotEl: HTMLElement) {
  // hide chute
  chuteEl.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 140,
    fill: "forwards",
    easing: "ease-out",
  });

  // show dot (white), then recolor to coral
  dotEl
    .animate(
      [
        { opacity: 0, transform: "scale(0.4)", color: "#FFFFFF" },
        { opacity: 1, transform: "scale(1.0)", color: "#FFFFFF" }
      ],
      { duration: 140, fill: "forwards", easing: "ease-out" }
    )
    .finished.then(() => {
      dotEl.animate([{ color: "#FFFFFF" }, { color: "#FF6A3D" }], {
        duration: 140,
        fill: "forwards",
        easing: "ease-out",
      });
    });
}
