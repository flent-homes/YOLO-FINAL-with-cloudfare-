import React, { useEffect, useRef, useState, forwardRef } from "react";

/* Inline parachute with proper ref forwarding - based on reference design */
const ParachuteIcon = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => {
  return (
    <svg ref={ref} viewBox="0 0 120 160" aria-hidden="true" {...props}>
      {/* White parachute canopy with panels */}
      <path d="M10 50 Q 60 10, 110 50 Q 100 75, 60 85 Q 20 75, 10 50 Z" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="1"/>
      
      {/* Canopy panel lines for detail */}
      <path d="M 30 45 Q 40 20, 60 15" fill="none" stroke="#E0E0E0" strokeWidth="1"/>
      <path d="M 90 45 Q 80 20, 60 15" fill="none" stroke="#E0E0E0" strokeWidth="1"/>
      <path d="M 60 15 L 60 75" stroke="#E0E0E0" strokeWidth="1"/>
      
      {/* FLENT text - bold and highly visible on canopy */}
      <text 
        x="60" 
        y="50" 
        textAnchor="middle" 
        fontSize="16" 
        fontWeight="900"
        fill="#0A0A0A"
        style={{fontFamily:"Plus Jakarta Sans,system-ui",letterSpacing:"1.5px"}}
      >
        FLENT
      </text>
      
      {/* Parachute suspension lines */}
      <line x1="20" y1="65" x2="55" y2="95" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.9"/>
      <line x1="40" y1="75" x2="58" y2="95" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.9"/>
      <line x1="60" y1="80" x2="60" y2="95" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.9"/>
      <line x1="80" y1="75" x2="62" y2="95" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.9"/>
      <line x1="100" y1="65" x2="65" y2="95" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.9"/>
      
      {/* Stick figure person */}
      {/* Head */}
      <circle cx="60" cy="105" r="5" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1"/>
      
      {/* Body */}
      <line x1="60" y1="110" x2="60" y2="130" stroke="#FFFFFF" strokeWidth="2.5"/>
      
      {/* Arms */}
      <line x1="60" y1="115" x2="50" y2="110" stroke="#FFFFFF" strokeWidth="2.5"/>
      <line x1="60" y1="115" x2="70" y2="110" stroke="#FFFFFF" strokeWidth="2.5"/>
      
      {/* Legs - these will land inline with "Flent" */}
      <line x1="60" y1="130" x2="52" y2="150" stroke="#FFFFFF" strokeWidth="2.5"/>
      <line x1="60" y1="130" x2="68" y2="150" stroke="#FFFFFF" strokeWidth="2.5"/>
    </svg>
  );
});

ParachuteIcon.displayName = "ParachuteIcon";

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
          {/* parachute - starts from very top, feet land inline with "Flent" */}
          <ParachuteIcon
            ref={chuteRef}
            className="absolute pointer-events-none"
            style={{
              left: "100%",
              bottom: "0",
              width: "80px",
              color: "#FFFFFF",
              zIndex: 3,
              transform: "translate(-50%, -120vh)",
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
  // Slow, smooth parachute fall from very top of screen with gentle S-curve swaying (6 seconds)
  // Feet land at baseline of text
  const fall = chute.animate(
    [
      { transform: "translate(-50%, -120vh) rotate(0deg)", offset: 0 },
      { transform: "translate(-45%, -100vh) rotate(5deg)", offset: 0.08 },
      { transform: "translate(-40%, -80vh) rotate(8deg)", offset: 0.16 },
      { transform: "translate(-35%, -60vh) rotate(10deg)", offset: 0.25 },
      { transform: "translate(-38%, -45vh) rotate(7deg)", offset: 0.35 },
      { transform: "translate(-48%, -32vh) rotate(0deg)", offset: 0.45 },
      { transform: "translate(-58%, -22vh) rotate(-7deg)", offset: 0.58 },
      { transform: "translate(-65%, -14vh) rotate(-10deg)", offset: 0.70 },
      { transform: "translate(-62%, -7vh) rotate(-7deg)", offset: 0.82 },
      { transform: "translate(-55%, -2vh) rotate(-2deg)", offset: 0.92 },
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
