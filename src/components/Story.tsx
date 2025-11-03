import { useRef, useEffect } from "react";
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

  useEffect(() => {
    if (!textRef.current || !wrapperRef.current || !containerRef.current) return;

    // Split text into words instead of characters to prevent word breaks
    const splitText = new SplitType(textRef.current, { types: "words" });
    const words = splitText.words;

    if (!words) return;

    const totalWords = words.length;
    const chunkSize = Math.ceil(totalWords * 0.3); // 30% per scroll

    // Set initial state - first chunk visible and being filled
    gsap.set(words, { 
      opacity: 0,
      visibility: "hidden"
    });
    
    // Show first chunk as ghost from the start
    gsap.set(words.slice(0, chunkSize), {
      opacity: 0.15,
      visibility: "visible"
    });

    // Create smooth scroll-triggered animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      pin: false,
      onUpdate: (self) => {
        const progress = self.progress;
        const revealedCount = Math.floor(progress * totalWords);
        const nextChunkEnd = Math.min(revealedCount + chunkSize, totalWords);
        
        // Move text up - start at 93%
        const translateY = 93 - (progress * 220);
        gsap.set(wrapperRef.current, { y: `${translateY}%`, force3D: true });
        
        // Show next chunk as ghost
        words.slice(0, nextChunkEnd).forEach(word => {
          gsap.set(word, { visibility: "visible" });
        });
        
        // Ghost for upcoming words
        words.slice(revealedCount, nextChunkEnd).forEach(word => {
          gsap.set(word, { opacity: 0.15 });
        });
        
        // Fill revealed words
        words.slice(0, revealedCount).forEach(word => {
          gsap.set(word, { opacity: 1, visibility: "visible" });
        });
      }
    });

    return () => {
      scrollTrigger.kill();
      splitText.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-[250vh]">
      <div className="sticky top-0 h-screen flex items-center">
        <div ref={wrapperRef} className="relative w-full will-change-transform">
          {/* top/bottom fades */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[18vh] bg-gradient-to-b from-light-bg to-transparent z-10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[18vh] bg-gradient-to-t from-light-bg to-transparent z-10" />

          {/* viewport */}
          <div className="max-h-[70vh] overflow-visible pr-4 flex items-center">
            <div ref={textRef} className="pb-12">
              {PARAGRAPHS.map((p, idx) => (
                <div
                  key={idx}
                  className="relative mb-6 text-dark-text"
                  style={{
                    fontSize: 'clamp(18px, 2.4vw, 36px)',
                    lineHeight: '1.55',
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
      className="relative min-h-[250vh] bg-light-bg"
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
