import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/** Copy split into visual lines */
const LINES = [
  `"Refer and earn up to this"`,
  `"Refer and earn up to that"`,
  `You and I both know all the ifs and buts that come with 'up to' offers.`,
  `And for some reason, you always sniff that there's something wrong.`,
  ``,
  `Same story when you move homes.`,
  ``,
  `There are none when you do it with Flent.`,
  `Because experience has always been at the center of what Flent does,`,
  `and I'm carrying that same energy into the world of our referral program.`,
  ``,
  `YOLO by Flent is that corner of the internet where referral rewards`,
  `feel less transactional, more experiential (hint: rewards that don't fit in a cart)`,
  ``,
  `If I design the way you should live with intention,`,
  `so should the way I thank you for referring to it.`,
  ``,
  `- (not so genZ) marketer, Flent`,
  ``,
  `Also, yes, some slang dies and should stay dead – this one included.`,
  `But I couldn't find a better word for that split-second energy of the "f-it, let's do it" moment –`,
  `the one I want you to have too.`
];

const StoryStepper = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [currentLine, setCurrentLine] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [filledLines, setFilledLines] = useState<Set<number>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);

  const lastIdx = LINES.length - 1;
  const allDone = currentLine >= LINES.length;

  /** Character-by-character fill animation */
  useEffect(() => {
    if (currentLine >= LINES.length) return;
    if (isAnimating) return;

    const line = LINES[currentLine];
    
    // Handle empty lines instantly
    if (line.trim() === "") {
      setFilledLines(prev => new Set([...prev, currentLine]));
      setCurrentLine(prev => prev + 1);
      setCharIndex(0);
      return;
    }

    // Animate character by character
    if (charIndex < line.length) {
      const timer = setTimeout(() => {
        setCharIndex(prev => prev + 1);
      }, 30); // Adjust speed here (lower = faster)
      return () => clearTimeout(timer);
    } else {
      // Line complete, move to next
      setFilledLines(prev => new Set([...prev, currentLine]));
      setTimeout(() => {
        setCurrentLine(prev => prev + 1);
        setCharIndex(0);
      }, 200); // Pause before next line
    }
  }, [currentLine, charIndex, isAnimating]);

  /** Intercept scroll/keys/touch */
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const handleScroll = (e: Event) => {
      if (!allDone) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (!allDone) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!allDone) {
        e.preventDefault();
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (!allDone && ["ArrowDown", "PageDown", " ", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
      }
    };

    vp.addEventListener("wheel", onWheel, { passive: false });
    vp.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("keydown", onKey);

    return () => {
      vp.removeEventListener("wheel", onWheel as any);
      vp.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("keydown", onKey);
    };
  }, [allDone]);

  /** Calculate vertical offset based on filled lines */
  const offset = useMemo(() => {
    return `translateY(calc(${filledLines.size * -1} * 3.2rem))`;
  }, [filledLines]);

  return (
    <div className="relative">
      {/* top/bottom fades */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[18vh] bg-gradient-to-b from-light-bg to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[18vh] bg-gradient-to-t from-light-bg to-transparent z-10" />

      {/* viewport */}
      <div ref={viewportRef} className="max-h-[66vh] overflow-hidden pr-4">
        {/* stack of lines */}
        <div
          className="transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: offset }}
        >
          {LINES.map((text, idx) => {
            const isBlank = text.trim() === "";
            const isFilled = filledLines.has(idx);
            const isCurrent = idx === currentLine;
            const isVisible = idx <= currentLine;
            
            // Calculate visible text for current line
            const visibleText = isCurrent && !isBlank 
              ? text.slice(0, charIndex) 
              : isFilled ? text : "";

            return (
              <div
                key={idx}
                data-line={idx}
                className="relative h-[3.2rem] flex items-center transition-all duration-300"
                style={{
                  opacity: isVisible ? 1 : 0,
                  visibility: isVisible ? "visible" : "hidden",
                }}
              >
                {/* ghost layer (always full text, very faint) */}
                <span className="line-ghost text-[clamp(20px,2.2vw,34px)] leading-none">
                  {isBlank ? " " : text}
                </span>

                {/* solid layer (revealed character by character) */}
                {!isBlank && visibleText && (
                  <span
                    className="line-solid absolute left-0 top-0 text-[clamp(20px,2.2vw,34px)] leading-none"
                    aria-hidden="true"
                  >
                    {visibleText}
                  </span>
                )}
              </div>
            );
          })}
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
