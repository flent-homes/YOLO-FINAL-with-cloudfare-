import React from "react";

export const Hero = () => {
  const scrollToStory = () => {
    const storySection = document.getElementById("story");
    storySection?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToExperience = () => {
    const experienceSection = document.getElementById("experience");
    experienceSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-screen bg-black text-light-text" style={{ overflow: "hidden" }}>
      <div className="absolute inset-0">
        <img
          className="block md:hidden w-full h-full object-cover"
          src="/fonts/YOLO%20(2).png"
          alt="YOLO hero background mobile"
        />
        <img
          src="/fonts/YOLO%20(1).png"
          alt="YOLO hero background"
          className="hidden md:block w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-end px-6 pb-0 md:pb-6 lg:pb-4">
        <button
          onClick={scrollToExperience}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 px-7 py-3 rounded-full border border-light-text/70 text-light-text font-sans font-medium backdrop-blur hover:border-white transition md:static md:translate-x-0 md:bottom-auto md:mt-0"
        >
          Here&apos;s yours
        </button>
      </div>
    </section>
  );
};
