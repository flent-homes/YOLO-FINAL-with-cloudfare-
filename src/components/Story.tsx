import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { PARAGRAPHS } from "@/data/storyCopy";

gsap.registerPlugin(ScrollTrigger);

const StoryStepper = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullyVisible, setIsFullyVisible] = useState(false);

  // Check if Story section is 100% visible
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only activate when section is fully visible (≥99% to account for subpixel rendering)
        setIsFullyVisible(entry.isIntersecting && entry.intersectionRatio >= 0.99);
      },
      { threshold: Array.from({ length: 100 }, (_, i) => i / 100) }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!textRef.current || !wrapperRef.current || !containerRef.current || !isFullyVisible) return;

    // Split text into characters
    const splitText = new SplitType(textRef.current, { types: "chars" });
    const chars = splitText.chars;

    if (!chars) return;

    const totalChars = chars.length;
    const chunkSize = Math.ceil(totalChars * 0.3); // 30% per scroll

    // Set initial state - first chunk visible and being filled
    gsap.set(chars, { 
      opacity: 0,
      visibility: "hidden"
    });
    
    // Show first chunk as ghost from the start
    gsap.set(chars.slice(0, chunkSize), {
      opacity: 0.15,
      visibility: "visible"
    });

    // Create smooth scroll-triggered animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=4000",
      scrub: 0.5,
      pin: false,
      onUpdate: (self) => {
        if (!isFullyVisible) return; // Only animate when fully visible
        
        const progress = self.progress;
        const revealedCount = Math.floor(progress * totalChars);
        const nextChunkEnd = Math.min(revealedCount + chunkSize, totalChars);
        
        // Move text up smoothly - increased distance for more visible effect
        const translateY = -(progress * 150);
        gsap.set(wrapperRef.current, { y: `${translateY}%` });
        
        // Show next chunk as ghost
        chars.slice(0, nextChunkEnd).forEach(char => {
          gsap.set(char, { visibility: "visible" });
        });
        
        // Fill revealed characters
        chars.slice(0, revealedCount).forEach(char => {
          gsap.set(char, { opacity: 1 });
        });
        
        // Ghost for upcoming characters
        chars.slice(revealedCount, nextChunkEnd).forEach(char => {
          gsap.set(char, { opacity: 0.15 });
        });
      }
    });

    return () => {
      scrollTrigger.kill();
      splitText.revert();
    };
  }, [isFullyVisible]);

  return (
    <div ref={containerRef} className="relative min-h-[200vh]">
      <div className="sticky top-0 h-screen flex items-center">
        <div ref={wrapperRef} className="relative w-full">
          {/* top/bottom fades */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[18vh] bg-gradient-to-b from-light-bg to-transparent z-10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[18vh] bg-gradient-to-t from-light-bg to-transparent z-10" />

          {/* viewport */}
          <div className="max-h-[66vh] overflow-visible pr-4">
            <div ref={textRef}>
              {PARAGRAPHS.map((p, idx) => (
                <div
                  key={idx}
                  className="relative mb-6 text-dark-text"
                  style={{
                    fontSize: 'clamp(26px, 3.6vw, 50px)',
                    lineHeight: '1.45',
                    letterSpacing: '0.005em'
                  }}
                  dangerouslySetInnerHTML={{ __html: p.html }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Story = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Enhanced parallax effects
  const titleY = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -80]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.5]);
  const ruleY = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -40]);
  const contentScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.98]);

  return (
    <section
      id="story"
      ref={containerRef}
      className="relative min-h-[200vh] bg-light-bg"
    >
      <div className="sticky top-0 h-screen flex items-center">
        <motion.div 
          style={{ scale: contentScale }}
          className="container mx-auto px-6 grid md:grid-cols-7 gap-12 items-center"
        >
          {/* Left: Title (static) */}
          <motion.div
            data-depth="0.3"
            style={{ y: titleY, opacity: titleOpacity }}
            className="md:col-span-2"
          >
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-display text-dark-text leading-none">
              YOLO by Flent
            </h2>
          </motion.div>

          {/* Right: Teleprompter */}
          <div className="md:col-span-5 relative">
            {/* L1: Vertical hairline */}
            <motion.div
              data-depth="0.15"
              style={{ y: ruleY }}
              className="absolute -left-8 top-0 bottom-0 w-px bg-dark-text/6"
            />

            <StoryStepper />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
