import { useEffect, useMemo, useRef, useState } from "react";
import { PARAGRAPHS } from "@/data/storyCopy";

// how many fill blocks per paragraph (creates the "chunks" look)
const CHUNK_PATTERN = [3, 2, 1, 2, 3];

const StoryStepper = ({ sectionRef }: { sectionRef: React.RefObject<HTMLElement> }) => {
  const viewportRef = useRef<HTMLDivElement>(null);

  // paragraph index being filled
  const [idx, setIdx] = useState(0);
  // which paragraphs are fully filled
  const [filled, setFilled] = useState<boolean[]>(
    () => Array(PARAGRAPHS.length).fill(false)
  );

  const last = PARAGRAPHS.length - 1;
  const allDone = filled.every(Boolean);
  const [active, setActive] = useState(false); // only true when section is 100% in view

  /* 1) Activate ONLY when section is fully in frame (≥99% visible) */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const thresholds = Array.from({ length: 101 }, (_, i) => i / 100);
    const io = new IntersectionObserver(([entry]) => {
      const fullyVisible = entry.isIntersecting && entry.intersectionRatio >= 0.99;
      setActive(fullyVisible);
      // visual cue
      const node = document.getElementById("story");
      if (node) node.classList.toggle("in-view", fullyVisible);
    }, { threshold: thresholds });

    io.observe(el);
    return () => io.disconnect();
  }, [sectionRef]);

  /* 2) Scoped scroll/touch intercept — ONLY when active & not done */
  useEffect(() => {
    if (!active || allDone) return;

    const el = sectionRef.current!;
    const stopIfInside = (e: Event) => {
      const path = (e as any).composedPath?.() ?? [];
      if (!path.includes(el)) return;       // ignore events outside Story
      e.preventDefault();
      e.stopPropagation();
    };

    // capture at window so we can stop bubbling to parallax
    window.addEventListener("wheel", stopIfInside, { passive: false, capture: true });
    window.addEventListener("touchmove", stopIfInside, { passive: false, capture: true });

    return () => {
      window.removeEventListener("wheel", stopIfInside as any, { capture: true } as any);
      window.removeEventListener("touchmove", stopIfInside as any, { capture: true } as any);
    };
  }, [active, allDone, sectionRef]);

  /* 3) Local wheel/touch/key handlers to advance/reverse */
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const onWheel = (e: WheelEvent) => {
      if (!active || allDone) return;
      const down = e.deltaY > 0;
      e.preventDefault(); e.stopPropagation();
      down ? next() : prev();
    };

    let ts = 0;
    const onTouchStart = (e: TouchEvent) => (ts = e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (!active || allDone) return;
      const dy = ts - e.touches[0].clientY;
      if (Math.abs(dy) < 4) return;
      const down = dy > 0;
      e.preventDefault(); e.stopPropagation();
      down ? next() : prev();
      ts = e.touches[0].clientY;
    };

    const onKey = (e: KeyboardEvent) => {
      if (!active) return;
      if (["ArrowDown","PageDown"," "].includes(e.key)) {
        if (!allDone) { e.preventDefault(); next(); }
      } else if (["ArrowUp","PageUp"].includes(e.key)) {
        if (idx > 0) { e.preventDefault(); prev(); }
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
  });

  /* 4) Advance / reverse */
  function next() {
    if (idx > last) return;
    // skip empty paras instantly
    const isBlank = clean(PARAGRAPHS[idx].html).trim() === "";
    if (isBlank) {
      setFilled(v => { const n=[...v]; n[idx]=true; return n; });
      setIdx(v => Math.min(last+1, v+1));
      return;
    }
    fillPara(idx, () => {
      setFilled(v => { const n=[...v]; n[idx]=true; return n; });
      setIdx(v => Math.min(last+1, v+1));
    });
  }
  function prev() {
    if (idx === 0) return;
    const target = Math.max(0, idx - 1);
    if (!filled[target]) { setIdx(target); return; }
    unfillPara(target, () => {
      setFilled(v => { const n=[...v]; n[target]=false; return n; });
      setIdx(target);
    });
  }

  /* 5) Play the chunked fill for one paragraph */
  function fillPara(i: number, done: () => void) {
    const row = document.querySelector(`[data-para="${i}"]`) as HTMLElement | null;
    if (!row) { done(); return; }
    const solid = row.querySelector(".story-solid") as HTMLElement;
    const chunks = CHUNK_PATTERN[i % CHUNK_PATTERN.length];
    solid.style.setProperty("--chunks", String(chunks));
    solid.style.transition = "clip-path .34s steps(var(--chunks), end), transform .22s ease-out, filter .22s ease-out";
    solid.style.clipPath = "inset(0 0% 0 0)";
    row.style.transform = "translateY(0)";
    row.style.filter = "none";
    solid.addEventListener("transitionend", onEnd, { once: true });
    function onEnd(e: TransitionEvent) { if (e.propertyName === "clip-path") done(); }
  }
  function unfillPara(i: number, done: () => void) {
    const row = document.querySelector(`[data-para="${i}"]`) as HTMLElement | null;
    if (!row) { done(); return; }
    const solid = row.querySelector(".story-solid") as HTMLElement;
    solid.style.transition = "clip-path .24s steps(var(--chunks), end)";
    solid.style.clipPath = "inset(0 100% 0 0)";
    row.style.transform = "translateY(2px)";
    solid.addEventListener("transitionend", onEnd, { once: true });
    function onEnd(e: TransitionEvent) { if (e.propertyName === "clip-path") done(); }
  }

  /* 6) Nudge stack by number of completed paragraphs */
  const offset = useMemo(() => {
    const count = filled.reduce((acc, f) => acc + (f ? 1 : 0), 0);
    return `translateY(calc(${count * -1} * var(--paraH)))`;
  }, [filled]);

  return (
    <div className="relative">
      {/* top/bottom masks */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[18vh] bg-gradient-to-b from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[18vh] bg-gradient-to-t from-white to-transparent z-10" />

      {/* viewport */}
      <div ref={viewportRef} className="max-h-[68vh] overflow-hidden pr-4">
        {/* stack */}
        <div
          className="transition-transform duration-[350ms] ease-out will-change-transform space-y-8"
          style={{ transform: offset, ["--paraH" as any]: "4.4rem" }}
        >
          {PARAGRAPHS.map((p, i) => {
            const isOn = filled[i];
            const chunks = CHUNK_PATTERN[i % CHUNK_PATTERN.length];
            return (
              <div
                key={i}
                data-para={i}
                className="relative h-[4.4rem] flex items-center"
                style={{
                  transform: isOn ? "translateY(0)" : "translateY(2px)",
                  filter: isOn ? "none" : "blur(0.1px)",
                }}
              >
                {/* ghost layer */}
                <div
                  className="story-ghost text-[clamp(22px,3.2vw,44px)] leading-none tracking-[0.005em] font-[400]"
                  dangerouslySetInnerHTML={{ __html: p.html }}
                />
                {/* solid layer */}
                <div
                  className="story-solid absolute inset-0 text-[clamp(22px,3.2vw,44px)] leading-none tracking-[0.005em] font-[400]"
                  style={{
                    clipPath: isOn ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                    ["--chunks" as any]: String(chunks),
                  }}
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: p.html }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function clean(html: string) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

export const Story = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative min-h-screen bg-white overscroll-contain"
    >
      <div className="sticky top-0 h-screen flex items-center">
        <div className="container mx-auto px-6 grid md:grid-cols-5 gap-12 items-center">
          {/* Left: Title (static) */}
          <div className="md:col-span-2">
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-display text-dark-text leading-none">
              YOLO by Flent
            </h2>
          </div>

          {/* Right: Story stepper */}
          <div className="md:col-span-3 relative">
            <StoryStepper sectionRef={sectionRef} />
          </div>
        </div>
      </div>
    </section>
  );
};
