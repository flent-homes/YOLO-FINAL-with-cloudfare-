import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/** 1) Put your copy here as VISUAL LINES (short, readable). */
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

/** 2) How many "blocks" fill across a line (for the chunked fill look) */
const CHUNK_PATTERN = [3, 2, 1, 2, 3];

const StoryStepper = () => {
  const viewportRef = useRef<HTMLDivElement>(null);

  // index of the line we're filling NOW (0..len-1)
  const [i, setI] = useState(0);
  // a map of line index -> filled
  const [filled, setFilled] = useState<boolean[]>(() => Array(LINES.length).fill(false));

  const lastIdx = LINES.length - 1;
  const allDone = useMemo(() => filled.every(Boolean), [filled]);

  /** intercept scroll/keys/touch so the page won't advance until all lines filled */
  useEffect(() => {
    const vp = viewportRef.current!;
    const onWheel = (e: WheelEvent) => {
      const down = e.deltaY > 0;
      if (!allDone || (!down && i > 0)) {
        e.preventDefault(); e.stopPropagation();
        down ? next() : prev();
      }
    };
    let ts = 0;
    const onTouchStart = (e: TouchEvent) => (ts = e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => {
      const dy = ts - e.touches[0].clientY;
      if (Math.abs(dy) < 4) return;
      const down = dy > 0;
      if (!allDone || (!down && i > 0)) {
        e.preventDefault(); e.stopPropagation();
        down ? next() : prev();
      }
      ts = e.touches[0].clientY;
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown","PageDown"," "].includes(e.key)) {
        if (!allDone) { e.preventDefault(); next(); }
      } else if (["ArrowUp","PageUp"].includes(e.key)) {
        if (i > 0) { e.preventDefault(); prev(); }
      }
    };

    vp.addEventListener("wheel", onWheel, { passive: false });
    vp.addEventListener("touchstart", onTouchStart, { passive: true });
    vp.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      vp.removeEventListener("wheel", onWheel as any);
      vp.removeEventListener("touchstart", onTouchStart as any);
      vp.removeEventListener("touchmove", onTouchMove as any);
      window.removeEventListener("keydown", onKey);
    };
  }, [i, allDone]);

  /** one step forward: fill the current line, then nudge content up to reveal the next line */
  function next() {
    if (i > lastIdx) return;
    if (LINES[i].trim() === "") {
      // spacer lines complete instantly
      setFilled(v => { const n=[...v]; n[i]=true; return n; });
      setI(v => Math.min(lastIdx+1, v+1));
      return;
    }
    fillLine(i, () => {
      setFilled(v => { const n=[...v]; n[i]=true; return n; });
      setI(v => Math.min(lastIdx+1, v+1));
    });
  }

  /** step back: un-fill previous line and nudge down */
  function prev() {
    if (i === 0) return;
    const target = Math.max(0, i - 1);
    if (!filled[target]) { setI(target); return; }
    unfillLine(target, () => {
      setFilled(v => { const n=[...v]; n[target]=false; return n; });
      setI(target);
    });
  }

  /** play the blocky fill animation on one line */
  function fillLine(idx: number, done: () => void) {
    const row = document.querySelector(`[data-line="${idx}"]`) as HTMLElement | null;
    if (!row) { done(); return; }
    const solid = row.querySelector(".solid") as HTMLElement;
    const chunks = CHUNK_PATTERN[idx % CHUNK_PATTERN.length];
    solid.style.setProperty("--chunks", String(chunks));
    // start hidden, then reveal in blocks
    solid.style.transition = "clip-path .32s steps(var(--chunks), end), transform .2s ease-out, filter .2s ease-out";
    solid.style.clipPath = "inset(0 0% 0 0)";
    row.style.transform = "translateY(0)";
    row.style.filter = "none";
    solid.addEventListener("transitionend", onEnd, { once: true });
    function onEnd(e: TransitionEvent) { if (e.propertyName === "clip-path") done(); }
  }
  function unfillLine(idx: number, done: () => void) {
    const row = document.querySelector(`[data-line="${idx}"]`) as HTMLElement | null;
    if (!row) { done(); return; }
    const solid = row.querySelector(".solid") as HTMLElement;
    solid.style.transition = "clip-path .24s steps(var(--chunks), end)";
    solid.style.clipPath = "inset(0 100% 0 0)";
    row.style.transform = "translateY(2px)";
    solid.addEventListener("transitionend", onEnd, { once: true });
    function onEnd(e: TransitionEvent) { if (e.propertyName === "clip-path") done(); }
  }

  /** translate the stack by completed lines (smooth nudge up) */
  const offset = useMemo(() => {
    // count how many lines are filled to compute offset
    const count = filled.reduce((acc, f, idx) => acc + (f ? 1 : 0), 0);
    return `translateY(calc(${count * -1} * var(--lineH)))`;
  }, [filled]);

  return (
    <div className="relative">
      {/* top/bottom fades */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[18vh] bg-gradient-to-b from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[18vh] bg-gradient-to-t from-white to-transparent z-10" />

      {/* viewport */}
      <div ref={viewportRef} className="max-h-[66vh] overflow-hidden pr-4">
        {/* stack of lines */}
        <div
          className="transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: offset, ["--lineH" as any]: "3.2rem" }}  // line height unit for the nudge
        >
          {LINES.map((text, idx) => {
            const isBlank = text.trim() === "";
            const isOn = filled[idx];
            const chunks = CHUNK_PATTERN[idx % CHUNK_PATTERN.length];

            return (
              <div
                key={idx}
                data-line={idx}
                className="relative h-[3.2rem] flex items-center"
                style={{
                  transform: isOn ? "translateY(0)" : "translateY(2px)",
                  filter: isOn ? "none" : "blur(0.1px)", // tiny hover feel
                }}
              >
                {/* ghost layer */}
                <span className="ghost text-[clamp(20px,2.2vw,34px)] leading-none">
                  {isBlank ? " " : text}
                </span>

                {/* solid layer (revealed in blocks) */}
                {!isBlank && (
                  <span
                    className="solid absolute inset-0 text-[clamp(20px,2.2vw,34px)] leading-none"
                    style={{
                      clipPath: isOn ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                      ["--chunks" as any]: String(chunks),
                    }}
                    aria-hidden="true"
                  >
                    {text}
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
