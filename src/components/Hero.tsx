import React, { useEffect, useRef, useState, forwardRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* Inline parachute matching reference SVG design */
const ParachuteIcon = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => {
  return (
    <svg ref={ref} viewBox="0 0 120 180" aria-hidden="true" {...props}>
      {/* Main parachute canopy - dome shape like reference */}
      <path 
        d="M 20 60 Q 10 40, 20 30 Q 35 15, 60 10 Q 85 15, 100 30 Q 110 40, 100 60 Q 90 75, 60 85 Q 30 75, 20 60 Z" 
        fill="#FFFFFF" 
        stroke="#D0D0D0" 
        strokeWidth="1"
      />
      
      {/* Canopy panel divisions for realism */}
      <path d="M 35 25 Q 45 15, 60 10 L 60 85" stroke="#E0E0E0" strokeWidth="0.8" fill="none"/>
      <path d="M 85 25 Q 75 15, 60 10" stroke="#E0E0E0" strokeWidth="0.8" fill="none"/>
      <path d="M 25 50 Q 40 30, 60 25" stroke="#E0E0E0" strokeWidth="0.8" fill="none"/>
      <path d="M 95 50 Q 80 30, 60 25" stroke="#E0E0E0" strokeWidth="0.8" fill="none"/>
      
      {/* FLENT text on canopy */}
      <text 
        x="60" 
        y="52" 
        textAnchor="middle" 
        fontSize="14" 
        fontWeight="900"
        fill="#0A0A0A"
        style={{fontFamily:"Plus Jakarta Sans,system-ui",letterSpacing:"1.2px"}}
      >
        FLENT
      </text>
      
      {/* Suspension lines connecting canopy to person */}
      <line x1="25" y1="70" x2="55" y2="115" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.85"/>
      <line x1="40" y1="78" x2="57" y2="115" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.85"/>
      <line x1="60" y1="82" x2="60" y2="115" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.85"/>
      <line x1="80" y1="78" x2="63" y2="115" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.85"/>
      <line x1="95" y1="70" x2="65" y2="115" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.85"/>
      
      {/* Stick figure person */}
      <circle cx="60" cy="125" r="6" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.5"/>
      <line x1="60" y1="131" x2="60" y2="150" stroke="#FFFFFF" strokeWidth="2.5"/>
      <line x1="60" y1="138" x2="48" y2="133" stroke="#FFFFFF" strokeWidth="2.5"/>
      <line x1="60" y1="138" x2="72" y2="133" stroke="#FFFFFF" strokeWidth="2.5"/>
      <line x1="60" y1="150" x2="50" y2="170" stroke="#FFFFFF" strokeWidth="2.5"/>
      <line x1="60" y1="150" x2="70" y2="170" stroke="#FFFFFF" strokeWidth="2.5"/>
    </svg>
  );
});

ParachuteIcon.displayName = "ParachuteIcon";

export const Hero = () => {
  const [showNavigation, setShowNavigation] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const chuteRef = useRef<SVGSVGElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  // Parallax effect for hero exit
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -100, -200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1, 0.5, 0]);

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
      <motion.div 
        style={{ y: heroY, opacity: heroOpacity }}
        className="text-center leading-[1.05] px-6 relative"
      >
        <h1 className="font-display text-[clamp(40px,8vw,112px)] text-light-text leading-none mb-2">
          You only live once.
        </h1>
        <p className="font-display italic text-[clamp(24px,4.5vw,56px)] text-light-text/90 leading-none relative inline-block mt-2">
          Do it with Flent
          {/* dynamic period dot (starts invisible) - matches heading period size */}
          <span
            ref={dotRef}
            aria-hidden="true"
            className="inline-block align-baseline opacity-0"
            style={{ 
              width: "0.15em", 
              height: "0.15em", 
              borderRadius: "9999px", 
              background: "currentColor",
              marginLeft: "0.05em",
              transform: "translateY(-0.05em)"
            }}
          />
          {/* parachute - smaller, starts very high, feet land inline with "Flent" */}
          <ParachuteIcon
            ref={chuteRef}
            className="absolute pointer-events-none"
            style={{
              left: "100%",
              bottom: "0",
              width: "60px",
              color: "#FFFFFF",
              zIndex: 3,
              transform: "translate(-50%, -150vh)",
            }}
          />
        </p>
      </motion.div>

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
  // Slow, smooth parachute fall from very high with gentle S-curve swaying (6 seconds)
  const fall = chute.animate(
    [
      { transform: "translate(-50%, -150vh) rotate(0deg)", offset: 0 },
      { transform: "translate(-45%, -125vh) rotate(5deg)", offset: 0.08 },
      { transform: "translate(-40%, -100vh) rotate(8deg)", offset: 0.16 },
      { transform: "translate(-35%, -75vh) rotate(10deg)", offset: 0.25 },
      { transform: "translate(-38%, -55vh) rotate(7deg)", offset: 0.35 },
      { transform: "translate(-48%, -40vh) rotate(0deg)", offset: 0.45 },
      { transform: "translate(-58%, -28vh) rotate(-7deg)", offset: 0.58 },
      { transform: "translate(-65%, -18vh) rotate(-10deg)", offset: 0.70 },
      { transform: "translate(-62%, -10vh) rotate(-7deg)", offset: 0.82 },
      { transform: "translate(-55%, -3vh) rotate(-2deg)", offset: 0.92 },
      { transform: "translate(-50%, 0) rotate(0deg)", offset: 1 }
    ],
    { duration: 6000, easing: "cubic-bezier(0.25, 0.1, 0.25, 1)", fill: "forwards" }
  );

  fall.finished.then(() => {
    // Gentle settle
    chute
      .animate(
        [
          { transform: "translate(-50%, 0) rotate(0deg)" },
          { transform: "translate(-52%, 0) rotate(-2deg)" },
          { transform: "translate(-48%, 0) rotate(1deg)" },
          { transform: "translate(-50%, 0) rotate(0deg)" }
        ],
        { duration: 800, easing: "ease-out", fill: "forwards" }
      )
      .finished.then(() => morphToPeriod(chute as HTMLElement, dot));
  });
}

function morphToPeriod(chuteEl: HTMLElement, dotEl: HTMLElement) {
  // Smooth multi-stage morph: shrink parachute while fading, then grow dot
  
  // Stage 1: Shrink and fade parachute
  chuteEl.animate(
    [
      { opacity: 1, transform: "translate(-50%, 0) scale(1)" },
      { opacity: 0.6, transform: "translate(-50%, 0) scale(0.5)" },
      { opacity: 0, transform: "translate(-50%, 0) scale(0.1)" }
    ],
    { duration: 400, fill: "forwards", easing: "ease-in-out" }
  );

  // Stage 2: After slight delay, grow dot from small to full size (white first)
  setTimeout(() => {
    dotEl
      .animate(
        [
          { opacity: 0, transform: "scale(0.2)", color: "#FFFFFF" },
          { opacity: 0.8, transform: "scale(0.8)", color: "#FFFFFF" },
          { opacity: 1, transform: "scale(1.0)", color: "#FFFFFF" }
        ],
        { duration: 350, fill: "forwards", easing: "ease-out" }
      )
      .finished.then(() => {
        // Stage 3: Smooth color transition to coral
        dotEl.animate(
          [{ color: "#FFFFFF" }, { color: "#FF6A3D" }],
          { duration: 300, fill: "forwards", easing: "ease-in-out" }
        );
      });
  }, 200);
}
