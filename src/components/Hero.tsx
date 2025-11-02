import { useEffect, useRef, useState } from "react";
import { ParachuteSVG } from "./ParachuteSVG";
import { runParachute } from "./hero-parachute";

export const Hero = () => {
  const [showNavigation, setShowNavigation] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const chuteRef = useRef<SVGSVGElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const navTimer = setTimeout(() => setShowNavigation(true), 2000);
    
    // Parachute animation triggered by IntersectionObserver
    const hero = heroRef.current;
    const chute = chuteRef.current;
    const dot = dotRef.current;

    if (!hero || !chute || !dot) return;

    // Check for reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      chute.style.opacity = "0";
      dot.style.opacity = "1";
      dot.style.color = "#FF6A3D";
      return;
    }

    let played = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || played) return;
        played = true;
        runParachute(chute, dot);
      },
      { root: null, threshold: 0.3 }
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
      className="relative min-h-screen bg-dark-bg text-light-text grid place-items-center overflow-hidden"
    >
      <div className="text-center leading-[1.05] px-6">
        <h1 className="font-display text-[clamp(40px,8vw,112px)] text-light-text leading-none mb-2">
          You only live once.
        </h1>
        <p className="font-display italic text-[clamp(24px,4.5vw,56px)] text-light-text/90 leading-none relative inline-block mt-2">
          <span className="ml-4 md:ml-8">Do it with Flent</span>
          <span 
            ref={dotRef}
            aria-hidden="true"
            className="inline-block align-baseline translate-y-[-0.12em] ml-[0.02em] opacity-0"
            style={{ width: "0.5em", height: "0.5em", borderRadius: "9999px", background: "currentColor" }}
          />
          <ParachuteSVG
            ref={chuteRef}
            id="chute"
            className="absolute left-1/2 -translate-x-1/2 -top-[38svh] w-[56px] pointer-events-none opacity-0"
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
