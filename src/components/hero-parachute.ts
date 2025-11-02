function runParachute(chute: Element, dot: HTMLElement) {
  // 1) Fall + sway (smaller amplitude to match smaller SVG)
  const fall = chute.animate(
    [
      { transform: "translate(-50%, -38svh) rotate(0deg)" },
      { transform: "translate(-49%, -22svh) rotate(3deg)" },
      { transform: "translate(-51%, -10svh) rotate(-2.5deg)" },
      { transform: "translate(-50%, 0) rotate(0deg)" }
    ],
    { duration: 1100, easing: "cubic-bezier(.22,.84,.36,1)", fill: "forwards" }
  );

  // 2) Gentle settle sway as it reaches baseline
  fall.finished.then(() => {
    const settle = chute.animate(
      [
        { transform: "translate(-50%, 0) rotate(0deg)" },
        { transform: "translate(calc(-50% - 2px), 0) rotate(-2deg)" },
        { transform: "translate(calc(-50% + 2px), 0) rotate(1.5deg)" },
        { transform: "translate(-50%, 0) rotate(0deg)" }
      ],
      { duration: 450, easing: "ease-out", iterations: 1, fill: "forwards" }
    );
    settle.finished.then(() => morphToPeriod(chute as HTMLElement, dot));
  });
}

function morphToPeriod(chuteEl: HTMLElement, dotEl: HTMLElement) {
  // Hide chute while revealing the dot; ensure dot inherits currentColor (white first)
  chuteEl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: "forwards", easing: "ease-out" });

  // Dot grows from nothing at the exact landing point, then recolors to coral
  dotEl.animate(
    [
      { opacity: 0, transform: "scale(0.4)", color: "#FFFFFF" },
      { opacity: 1, transform: "scale(1.0)", color: "#FFFFFF" }
    ],
    { duration: 160, fill: "forwards", easing: "ease-out" }
  ).finished.then(() => {
    // Recolor to coral as the final beat
    dotEl.animate(
      [{ color: "#FFFFFF" }, { color: "#FF6A3D" }],
      { duration: 160, fill: "forwards", easing: "ease-out" }
    );
  });
}

export { runParachute };
