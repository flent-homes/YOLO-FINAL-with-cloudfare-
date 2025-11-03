import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const storyLines = [
  '"Refer and earn up to this"',
  '"Refer and earn up to that"',
  "You and I both know all the ifs and buts that come with 'up to' offers. And for some reason, you always sniff that there's something wrong.",
  "",
  "Same story when you move homes.",
  "There are none when you do it with Flent. Because experience has always been at the center of what Flent does, and I'm carrying that same energy into the world of our referral program.",
  "",
  "YOLO by Flent is that corner of the internet where referral rewards feel less transactional, more experiential (hint: rewards that don't fit in a cart)",
  "",
  "If I design the way you should live with intention, so should the way I thank you for referring to it.",
  "",
  "- (not so genZ) marketer, Flent",
  "",
  "Also, yes, some slang dies and should stay dead – this one included. But I couldn't find a better word for that split-second energy of the 'f-it, let's do it' moment – the one I want you to have too.",
];

export const Story = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Enhanced parallax effects
  const titleY = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -80]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.5]);
  const ruleY = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -40]);
  const coralRuleY = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [60, 0, -50]);
  const contentScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.98]);

  useEffect(() => {
    if (!scrollRef.current) return;

    const updateLineStates = () => {
      if (!scrollRef.current) return;
      const rect = scrollRef.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const lines = scrollRef.current.querySelectorAll("[data-line]");

      lines.forEach((ln) => {
        const r = ln.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - center);
        
        ln.classList.remove("line-active", "line-semi");
        if (dist < rect.height * 0.14) {
          ln.classList.add("line-active");
        } else if (dist < rect.height * 0.24) {
          ln.classList.add("line-semi");
        }
      });
    };

    const handleWheel = (e: WheelEvent) => {
      const el = scrollRef.current;
      if (!el) return;
      
      const atTop = el.scrollTop === 0 && e.deltaY < 0;
      const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight && e.deltaY > 0;
      
      if (!atTop && !atBottom) {
        e.stopPropagation();
      }
    };

    const el = scrollRef.current;
    el.addEventListener("scroll", updateLineStates, { passive: true });
    el.addEventListener("wheel", handleWheel);
    updateLineStates();

    return () => {
      el.removeEventListener("scroll", updateLineStates);
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

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
          {/* Left: Title with parallax */}
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

            {/* Reading window with masks */}
            <div className="relative h-[60vh]">
              {/* Top gradient mask */}
              <div className="absolute top-0 left-0 right-0 h-[20%] bg-gradient-to-b from-light-bg to-transparent z-10 pointer-events-none" />
              
              {/* Bottom gradient mask */}
              <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-light-bg to-transparent z-10 pointer-events-none" />

              {/* Text content */}
              <div
                ref={scrollRef}
                className="h-full overflow-y-auto will-change-scroll px-4 py-[30vh] space-y-8"
              >
                {storyLines.map((line, index) => (
                  <p
                    key={index}
                    data-line={index}
                    className="text-xl md:text-2xl font-sans leading-relaxed"
                  >
                    {line || "\u00A0"}
                  </p>
                ))}
              </div>

              {/* L3: Coral accent rule */}
              <motion.div
                data-depth="0.5"
                style={{ y: coralRuleY }}
                className="absolute right-0 top-[45%] w-6 md:w-12 h-px bg-coral opacity-30 pointer-events-none"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
