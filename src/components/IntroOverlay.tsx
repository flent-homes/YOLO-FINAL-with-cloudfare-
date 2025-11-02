import { useEffect } from "react";

interface IntroOverlayProps {
  onDone: () => void;
}

export const IntroOverlay = ({ onDone }: IntroOverlayProps) => {
  return (
    <div
      id="intro-overlay"
      className="fixed inset-0 z-[9999] bg-dark-bg text-light-text grid place-content-center select-none"
    >
      <div className="px-6 text-center space-y-3 max-w-[68ch]">
        <h1 className="font-sans text-xl text-light-text">
          YOLO <span className="text-light-text/60 italic text-base">(slang)</span>
        </h1>
        <p className="font-sans text-lg text-light-text/70">/ˈjō-lō/</p>
        <p className="font-sans text-base text-light-text/70">
          — A phrase from the early 2010s, meaning <span className="text-light-text">"You Only Live Once."</span>
        </p>
        <p className="font-sans text-base text-light-text/70 mt-6">
          Status:{" "}
          <span className="inline-block relative w-[10ch] h-[1.4em] align-baseline">
            <span className="absolute inset-0 origin-bottom flip-out text-light-text/50 line-through">deceased</span>
            <span className="absolute inset-0 origin-top flip-in text-coral font-medium">resurrected</span>
          </span>
        </p>
      </div>

      <AutoDismiss onDone={onDone} />
    </div>
  );
};

function AutoDismiss({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const overlay = document.getElementById("intro-overlay");

    // 800ms flip → then 2000ms pause → then 800ms fade
    const totalDelay = 800 + 2000; // flip duration + pause
    const fadeDuration = 800;

    const fadeTimer = setTimeout(() => {
      if (overlay) overlay.classList.add("fade-out");
    }, totalDelay);

    const removeTimer = setTimeout(() => {
      onDone();
    }, totalDelay + fadeDuration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onDone]);

  return null;
}
