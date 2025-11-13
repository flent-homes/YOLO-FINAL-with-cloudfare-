import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";

type ExperienceConfig = {
  id: string;
  expiresIn: number;
  expiresAt?: string;
  amount: string;
  event: string;
  minReferrals: number;
  videoSrc: string;
  detailsUrl: string;
  placeholder?: boolean;
};

const experiences: ExperienceConfig[] = [
  {
    id: "exclusive-stay",
    expiresIn: 18,
    amount: "₹40,000",
    event: "G.O.A.T India Tour 2025",
    minReferrals: 4,
    videoSrc: "/Left%20carousel.png",
    detailsUrl: "https://wry-chef-6d0.notion.site/Flent-x-Messi-India-Tour-Giveaway-29d0c38bc238805da355d55be8e0b431?source=copy_link",
    placeholder: true,
  },
  {
    id: "featured-experience",
    expiresIn: 24,
    expiresAt: "2025-12-05T18:29:00Z",
    amount: "₹40,000",
    event: "G.O.A.T India Tour 2025",
    minReferrals: 4,
    videoSrc: "/fonts/messi%20final.mp4",
    detailsUrl: "https://wry-chef-6d0.notion.site/Flent-x-Messi-India-Tour-Giveaway-29d0c38bc238805da355d55be8e0b431?source=copy_link",
  },
  {
    id: "city-pass",
    expiresIn: 12,
    amount: "₹40,000",
    event: "G.O.A.T India Tour 2025",
    minReferrals: 4,
    videoSrc: "/Right%20Carousel.png",
    detailsUrl: "https://wry-chef-6d0.notion.site/Flent-x-Messi-India-Tour-Giveaway-29d0c38bc238805da355d55be8e0b431?source=copy_link",
    placeholder: true,
  },
];

type ExperienceTileProps = {
  experience: ExperienceConfig;
  onRedeem: () => void;
  isLocked?: boolean;
  onShowDetails?: () => void;
};

const ExperienceTile = ({ experience, onRedeem, onShowDetails, isLocked = false }: ExperienceTileProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (isLocked || !experience.expiresAt) {
      return;
    }

    const updateCountdown = () => {
      const target = new Date(experience.expiresAt).getTime();
      if (Number.isNaN(target)) {
        setDaysRemaining(null);
        return;
      }
      const diff = target - Date.now();
      const dayMs = 1000 * 60 * 60 * 24;
      const days = Math.max(0, Math.floor(diff / dayMs));
      setDaysRemaining(days);
    };

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 60 * 1000);
    return () => window.clearInterval(interval);
  }, [experience.expiresAt, isLocked]);

  const disableContent = isLocked || experience.placeholder;

  return (
    <div className="bg-light-bg text-dark-text rounded-[28px] border border-dark-text/10 shadow-2xl overflow-hidden flex flex-col w-[min(88vw,420px)]">
      <div className="relative w-full bg-dark-bg" style={{ paddingBottom: "58%" }}>
        {!isLocked ? (
          experience.placeholder ? (
            <div className="absolute inset-0">
          <div
                className="absolute inset-0"
            style={{
                  backgroundImage: `url(${experience.videoSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
                  filter: "blur(3.5px) saturate(1)",
            }}
          />
              <div className="absolute inset-0 bg-dark-bg/55" />
              <div className="relative z-10 flex items-center justify-center h-full">
                <p className="text-light-text/90 text-base font-sans">Experience preview coming soon</p>
      </div>
    </div>
          ) : !videoError ? (
            <>
              {!videoReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-light-text/80 text-sm">
                  <span className="animate-pulse">Loading experience…</span>
                </div>
              )}
              <video
                ref={videoRef}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${videoReady ? "opacity-100" : "opacity-0"}`}
                src={experience.videoSrc}
                autoPlay
                muted={videoMuted}
                playsInline
                loop
                onCanPlay={() => setVideoReady(true)}
                onError={() => {
                  setVideoError(true);
                  setVideoReady(false);
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const nextMuted = !videoMuted;
                  setVideoMuted(nextMuted);
                  const videoElement = videoRef.current;
                  if (videoElement) {
                    videoElement.muted = nextMuted;
                    if (!nextMuted) {
                      void videoElement.play().catch(() => {
                        setVideoMuted(true);
                      });
                    }
                  }
                }}
                className="absolute bottom-3 right-3 z-20 px-3 py-1.5 bg-dark-bg/80 text-light-text text-xs font-sans rounded-full border border-light-text/30 backdrop-blur transition hover:bg-dark-bg/90 pointer-events-auto"
              >
                {videoMuted ? "Tap for sound" : "Sound on"}
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-dark-bg">
              <p className="text-light-text text-base">Experience preview coming soon</p>
            </div>
          )
        ) : (
          <div className="absolute inset-0">
            <div className="absolute inset-0" style={{
              backgroundImage: `url(${experience.videoSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(3.5px) saturate(1)",
            }} />
            <div className="absolute inset-0 bg-dark-bg/55" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center gap-2 text-light-text">
              <div className="w-14 h-14 rounded-full border border-light-text/30 bg-light-text/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-7 h-7 text-light-text"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75M6 10.5h12l1.5 10.5h-15L6 10.5z"
                  />
                </svg>
        </div>
              <span className="text-xs uppercase tracking-widest opacity-80">Unlocking soon</span>
            </div>
            </div>
        )}

        {!disableContent && (
          <div className="absolute top-4 right-4 px-3 py-1 text-[11px] font-sans tracking-wide uppercase bg-white/80 text-dark-text rounded-full border border-white/40 backdrop-blur-sm shadow-sm">
            Expires in {daysRemaining ?? experience.expiresIn} days
            </div>
        )}
            </div>

      <div className="flex flex-col gap-4 p-6 md:p-7 flex-1">
        {!disableContent && (
          <>
            <h3 className="font-sans text-base md:text-lg leading-relaxed text-dark-text">
              Bring in four confirmed move ins by <span className="font-semibold text-dark-text">5th December</span> and you get an all expenses paid trip worth{" "}
              <span className="font-semibold text-dark-text">{experience.amount}</span>, including flights, stay and tickets to the{" "}
              <span className="font-semibold text-dark-text">{experience.event}</span>.
            </h3>
            <p className="font-sans text-sm text-dark-text/70">
              Minimum referrals required: {experience.minReferrals}
            </p>
          </>
        )}

        <div className="mt-auto flex flex-wrap gap-3 pt-2">
          <a
            href={disableContent ? "#" : experience.detailsUrl}
            target={disableContent ? undefined : "_blank"}
            rel={disableContent ? undefined : "noopener noreferrer"}
            onClick={disableContent ? (event) => event.preventDefault() : (event) => {
              event.preventDefault();
              onShowDetails?.();
            }}
            className={`px-5 py-2.5 rounded-full border text-sm font-sans font-medium transition border-dark-text/20 text-dark-text hover:border-dark-text/40 hover:-translate-y-0.5 ${
              disableContent ? "opacity-60" : ""
            }`}
          >
            Details
          </a>
          <button
            onClick={disableContent ? undefined : onRedeem}
            className={`px-6 py-2.5 rounded-full text-sm font-sans font-semibold transition bg-dark-bg text-light-text hover:bg-dark-bg/90 hover:-translate-y-0.5 ${
              disableContent ? "opacity-60" : ""
            }`}
          >
            Refer Now
          </button>
        </div>
      </div>
    </div>
  );
};

export const Experience = () => {
  const experienceRef = useRef<HTMLDivElement>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1);

  const { scrollYProgress } = useScroll({
    target: experienceRef,
    offset: ["start end", "end start"],
  });

  const overlayOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.12, 0.12, 0]);
  const frameY = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [150, 0, 0, -80]);
  const frameScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.95]);
  const frameOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.4]);

  const scrollToFinal = () => {
    const finalSection = document.getElementById("final");
    finalSection?.scrollIntoView({ behavior: "smooth" });
  };

  const previous = () => {
    setActiveIndex((prev) => (prev - 1 + experiences.length) % experiences.length);
  };

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % experiences.length);
  };

  useEffect(() => {
    if (showDetails) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showDetails]);

  return (
    <section
      ref={experienceRef}
      id="experience"
      className="relative min-h-[75vh] bg-dark-bg flex items-start justify-center py-10 md:py-14"
    >
        <motion.div
          data-depth="0.15"
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-dark-bg pointer-events-none"
        />

        <motion.div
          data-depth="0.3"
          style={{ y: frameY, scale: frameScale, opacity: frameOpacity }}
          className="relative w-full px-6"
        >
        <div className="text-center mb-10 md:mb-12">
          <span
            className="block text-2xl sm:text-3xl md:text-4xl font-sans font-medium uppercase tracking-[0.16em] text-light-text whitespace-nowrap"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            REFER AND LIVE THE
          </span>
          <h2 className="mt-3 heading-display text-6xl md:text-7xl lg:text-8xl text-light-text tracking-[-0.02em]">Featured Experience</h2>
          </div>

          <div className="relative w-full overflow-hidden flex items-center justify-center px-5 sm:px-10">
          {experiences.map((experience, index) => {
            const position = (index - activeIndex + experiences.length) % experiences.length;
            const isCenter = position === 0;
            const isLeft = position === experiences.length - 1;
            const isRight = position === 1;

            let x = 0;
            let scale = 1;
            let opacity = 1;
            let zIndex = isCenter ? 30 : 10;
            let isLocked = !isCenter;

            const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

            if (isLeft) {
              x = isMobile ? -120 : -220;
              scale = isMobile ? 0.88 : 0.92;
              opacity = 0.55;
            } else if (isRight) {
              x = isMobile ? 120 : 220;
              scale = isMobile ? 0.88 : 0.92;
              opacity = 0.55;
            } else if (!isCenter) {
              opacity = 0;
            }

            return (
            <motion.div
                key={experience.id}
                className={isCenter ? "relative" : "absolute"}
                initial={{ x, scale, opacity }}
                animate={{ x, scale, opacity, zIndex }}
              transition={{ type: "spring", stiffness: 160, damping: 18 }}
            >
                <ExperienceTile
                  experience={experience}
                  onRedeem={scrollToFinal}
                  onShowDetails={isCenter ? () => setShowDetails(true) : undefined}
                  isLocked={isLocked}
                />
              </motion.div>
            );
          })}
          </div>

          <div className="mt-10 flex justify-center gap-4">
            <button
              onClick={previous}
              className="w-11 h-11 rounded-full border border-light-text/50 text-light-text hover:border-light-text transition"
              aria-label="Previous experience"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="w-11 h-11 rounded-full border border-light-text/50 text-light-text hover:border-light-text transition"
              aria-label="Next experience"
            >
              ›
            </button>
          </div>
            </motion.div>

      <AnimatePresence>
        {showDetails && (
            <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowDetails(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="experience-modal-panel relative z-[110] bg-light-bg shadow-2xl"
            >
              <div className="flex justify-center pb-3">
                <span className="h-1.5 w-12 rounded-full bg-dark-text/15" />
          </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-display text-2xl text-dark-text">How it works</h3>
              <button
                    onClick={() => setShowDetails(false)}
                    className="text-dark-text/50 hover:text-dark-text"
                    aria-label="Close"
              >
                    ×
              </button>
            </div>

                <div className="space-y-4">
                  {[
                    {
                      title: "Step 1 · Get started",
                      description: (
                        <>
                          Tap <span className="font-semibold">Refer Now</span> to open the Start Referring page.
                        </>
                      ),
                    },
                    {
                      title: "Step 2 · Add your details",
                      description: (
                        <>
                          Enter your full name and phone number, then tap <span className="font-semibold">Refer Now</span>.
                        </>
                      ),
                    },
                    {
                      title: "Step 3 · Share the word",
                      description: (
                        <>
                          Choose how you want to spread the word: WhatsApp, Instagram or LinkedIn. We load a pre written message, you just hit{" "}
                          <span className="font-semibold">Send</span>.
                        </>
                      ),
                    },
                    {
                      title: "Step 4 · When they book",
                      description: (
                        <>
                          When your friends book a Flent home, they will be asked who referred them. They just need to add your name and number in their onboarding
                          form.
                        </>
                      ),
                    },
                    {
                      title: "Step 5 · Win big",
                      description: (
                        <>
                          Every successful referral counts. Get <span className="font-semibold">4 confirmed bookings</span> and you will win an all expenses paid trip
                          to the <span className="font-semibold">G.O.A.T. India Tour 2025</span>.
                        </>
                      ),
                    },
                  ].map((step, index) => (
                    <div
                      key={step.title}
                      className="rounded-2xl border border-dark-text/10 bg-white/60 px-5 py-4 shadow-sm break-words"
                    >
                      <p className="font-sans font-semibold text-dark-text mb-2">
                        {step.title}
                      </p>
                      <p className="font-sans text-sm leading-relaxed text-dark-text/80">{step.description}</p>
                    </div>
                  ))}
                </div>

                <a
                  href="https://wry-chef-6d0.notion.site/Flent-x-Messi-India-Tour-Giveaway-29d0c38bc238805da355d55be8e0b431?source=copy_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-dark-text/20 px-5 py-3 font-sans text-xs md:text-sm font-medium text-dark-text hover:border-dark-text/40 whitespace-nowrap"
                >
                  View Terms & Conditions
                </a>
              </div>
            </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
      </section>
  );
};
