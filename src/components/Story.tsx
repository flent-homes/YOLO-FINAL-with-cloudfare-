import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

/** Full copy text with exact line breaks */
const COPY_TEXT = `"Refer and earn up to this"
"Refer and earn up to that"
You and I both know all the ifs and buts that come with 'up to' offers. And for some reason, you always sniff that there's something wrong.

Same story when you move homes.
There are none when you do it with Flent. Because experience has always been at the center of what Flent does, and I'm carrying that same energy into the world of our referral program. 
YOLO by Flent is that corner of the internet where referral rewards feel less transactional, more experiential (hint: rewards that don't fit in a cart) 

If I design the way you should live with intention, so should the way I thank you for referring to it.

- (not so genZ) marketer, Flent 


Also, yes, some slang dies and should stay dead – this one included. But I couldn't find a better word for that split-second energy of the "f-it, let's do it" moment – the one I want you to have too.`;

const StoryStepper = () => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current || !wrapperRef.current || !containerRef.current) return;

    // Split text into characters
    const splitText = new SplitType(textRef.current, { types: "chars" });
    const chars = splitText.chars;

    if (!chars) return;

    const totalChars = chars.length;
    const chunkSize = Math.ceil(totalChars * 0.3); // 30% per scroll

    // Set initial state - all hidden except first chunk
    gsap.set(chars, { 
      opacity: 0,
      visibility: "hidden"
    });
    
    // Show first chunk as ghost
    gsap.set(chars.slice(0, chunkSize), {
      opacity: 0.15,
      visibility: "visible"
    });

    let isComplete = false;

    // Create scroll-triggered animation
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top center",
      end: "+=4000",
      scrub: 0.5,
      pin: false,
      onUpdate: (self) => {
        const progress = self.progress;
        const revealedCount = Math.floor(progress * totalChars);
        const nextChunkEnd = Math.min(revealedCount + chunkSize, totalChars);
        
        // Move text up as we progress (scroll down illusion)
        const translateY = -(progress * 30); // Move up 30vh total
        gsap.set(wrapperRef.current, { y: translateY });
        
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

        // Check if complete
        isComplete = progress >= 0.99;
      },
      onLeave: () => {
        // Allow scrolling to next section only when complete
        if (isComplete) {
          ScrollTrigger.getAll().forEach(st => {
            if (st.trigger === containerRef.current) {
              st.disable();
            }
          });
        }
      }
    });

    // Block scroll until animation complete
    const blockScroll = (e: WheelEvent) => {
      const scrollTriggers = ScrollTrigger.getAll();
      const ourTrigger = scrollTriggers.find(st => st.trigger === containerRef.current);
      
      if (ourTrigger && !isComplete && e.deltaY > 0) {
        // Only block downward scroll
        const progress = ourTrigger.progress;
        if (progress < 0.99) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    window.addEventListener('wheel', blockScroll, { passive: false });

    return () => {
      window.removeEventListener('wheel', blockScroll);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      splitText.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-[200vh]">
      <div className="sticky top-0 h-screen flex items-center">
        <div ref={wrapperRef} className="relative w-full">
          {/* top/bottom fades */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[18vh] bg-gradient-to-b from-light-bg to-transparent z-10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[18vh] bg-gradient-to-t from-light-bg to-transparent z-10" />

          {/* viewport */}
          <div className="max-h-[66vh] overflow-visible pr-4">
            <p 
              ref={textRef}
              className="text-[clamp(20px,2.2vw,34px)] whitespace-pre-wrap text-dark-text"
              style={{ 
                lineHeight: '1.6',
                fontWeight: 400
              }}
            >
              {COPY_TEXT}
            </p>
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
          className="container mx-auto px-6 grid md:grid-cols-5 gap-12 items-center"
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
          <div className="md:col-span-3 relative">
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
