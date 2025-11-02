import { useEffect } from "react";

interface IntroOverlayProps {
  onDone: () => void;
}

export const IntroOverlay = ({ onDone }: IntroOverlayProps) => {
  const dismiss = () => onDone();

  return (
    <div
      id="intro-overlay"
      className="fixed inset-0 z-[9999] bg-dark-bg text-light-text grid place-content-center
                 select-none pointer-events-none"
      aria-hidden="true"
    >
      <div className="pointer-events-auto px-6 space-y-3 max-w-[68ch]">
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

        <button
          onClick={dismiss}
          className="mt-8 text-sm text-light-text/60 hover:text-light-text transition pointer-events-auto"
        >
          Skip →
        </button>
      </div>

      <AutoDismiss onDone={onDone} />
    </div>
  );
};

function AutoDismiss({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1600);
    const end = () => onDone();

    document.addEventListener("wheel", end, { once: true, passive: true });
    document.addEventListener("touchstart", end, { once: true, passive: true });
    document.addEventListener("keydown", end, { once: true });

    return () => {
      clearTimeout(t);
      document.removeEventListener("wheel", end);
      document.removeEventListener("touchstart", end);
      document.removeEventListener("keydown", end);
    };
  }, [onDone]);

  return null;
}
