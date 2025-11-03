export const PreHero = () => {
  return (
    <section id="prehero" className="min-h-screen bg-dark-bg text-light-text grid place-content-center">
      <div className="space-y-3 max-w-[68ch] px-6 animate-fade-in">
        <h1 className="font-sans text-xl text-light-text">YOLO <span className="text-light-text/60 italic text-base">(slang)</span></h1>
        <p className="font-sans text-lg text-light-text/70">/ˈjō-lō/</p>
        <p className="font-sans text-base text-light-text/70">
          — A phrase from the early 2010s, meaning <span className="text-light-text">"You Only Live Once."</span>
        </p>
        <p className="font-sans text-base text-light-text/70 mt-6 flex items-baseline gap-1.5">
          Status:{" "}
          <span className="inline-block relative w-[10ch] h-[1.4em] leading-[1.4em]">
            <span className="absolute inset-0 origin-bottom flip-out text-light-text/50 line-through leading-[1.4em]">deceased</span>
            <span className="absolute inset-0 origin-top flip-in text-coral font-medium leading-[1.4em]">resurrected</span>
          </span>
        </p>
      </div>
    </section>
  );
};
