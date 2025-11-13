import { useState, useEffect, FormEvent, useRef } from "react";
import { AnimatePresence, motion, useScroll, useTransform, useInView } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { ShareModal } from "./ShareModal";

const VIEWERS = [15, 27, 46, 53, 65, 76, 84, 98, 102, 112, 124, 133, 148, 152];
const CARD_IMAGES = [
  { src: "/card%20one.png", alt: "Card one" },
  { src: "/card%20two.png", alt: "Card two" },
  { src: "/card%20three.png", alt: "Card three" },
];

const SOCIAL_LINKS = [
  {
    name: "Website",
    href: "https://www.flent.in/",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 3C9.6 5.4 8.25 8.4 8.25 12C8.25 15.6 9.6 18.6 12 21C14.4 18.6 15.75 15.6 15.75 12C15.75 8.4 14.4 5.4 12 3Z" stroke="currentColor" strokeWidth="1.6" />
        <line x1="4.5" y1="12" x2="19.5" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/flent.in/?hl=en",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://api.whatsapp.com/send/?phone=918904695925&text=Hi+there%2C+I+am+interested+in+Flent-ing.+Tell+me+more+%3A%29&type=phone_number&app_absent=0",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 21.25c-1.53 0-3.04-.4-4.35-1.16l-3.44.98.99-3.37A7.25 7.25 0 0 1 4.75 13c0-4.46 3.79-8.25 8.25-8.25S21.25 8.54 21.25 13 17.46 21.25 12 21.25Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 9.1c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.6.1-.8.3-.3.3-1 1-1 2.4s1 2.7 1.2 3c.2.3 1.9 3 4.8 4.1 2.4.9 2.9.8 3.3.7.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.1-1.2-.1-.1-.2-.1-.4-.2-.3-.2-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1s-.7.9-.8 1c-.2.1-.3.1-.4 0-.2-.1-.7-.2-1.3-.7-.9-.6-1.5-1.5-1.7-1.7-.2-.3-.2-.4 0-.5.2-.2.4-.5.5-.7.1-.2.1-.3.2-.4 0-.2 0-.3-.1-.5-.1-.1-.6-1.5-.8-2.1Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "https://x.com/flenthomes",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M4.5 4.5L10.85 13.1L4.9 19.5H7.65L12.15 14.75L15.8 19.5H19.5L13.05 10.85L18.6 4.5H15.85L11.65 9.05L8.25 4.5H4.5Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@FlentHomes",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M21.2 8.05C21.4 8.8 21.5 9.75 21.5 11V13C21.5 14.25 21.4 15.2 21.2 15.95C21 16.75 20.45 17.35 19.7 17.6C18.75 17.9 12 17.9 12 17.9C12 17.9 5.25 17.9 4.3 17.6C3.55 17.35 3 16.75 2.8 15.95C2.6 15.2 2.5 14.25 2.5 13V11C2.5 9.75 2.6 8.8 2.8 8.05C3 7.25 3.55 6.65 4.3 6.4C5.25 6.1 12 6.1 12 6.1C12 6.1 18.75 6.1 19.7 6.4C20.45 6.65 21 7.25 21.2 8.05Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M10.5 9L15 12L10.5 15V9Z" fill="currentColor" />
      </svg>
    ),
  },
];

const FOOTER_LINK_GROUPS = [
  {
    links: [
      { label: "Flent", href: "https://www.flent.in/" },
      { label: "Homes", href: "https://www.flent.in/properties" },
      {
        label: "Careers",
        href: "https://empty-bite-b73.notion.site/Flent-Hiring-Guide-42ffc8b1ff6648869f4c45f85ec5a1b8?pvs=4",
      },
      {
        label: "Contact Us",
        href: "https://empty-bite-b73.notion.site/Flent-Hiring-Guide-42ffc8b1ff6648869f4c45f85ec5a1b8?pvs=4",
      },
    ],
  },
  {
    links: [
      { label: "About Us", href: "https://www.flent.in/about-us" },
      { label: "For Landlords", href: "https://www.flent.in/owners" },
      { label: "Reserve", href: "https://www.flent.in/reserve" },
    ],
  },
];

const pickViewerSequence = () => {
  const first = VIEWERS[Math.floor(Math.random() * VIEWERS.length)];
  let delta = 0;
  while (delta === 0) {
    delta = Math.floor(Math.random() * 21) - 10; // -10 to +10 excluding 0
  }
  const second = Math.max(0, first + delta);
  return [first, second];
};

export const FinalWhite = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [notifyEmail, setNotifyEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [viewerSequence] = useState(() => pickViewerSequence());
  const [viewerIndex, setViewerIndex] = useState(0);
  const [cardOrder, setCardOrder] = useState(() => [...CARD_IMAGES]);
  const [cardAnimationActive, setCardAnimationActive] = useState(false);

  const { toast } = useToast();
  const finalRef = useRef<HTMLDivElement>(null);
  const isFinalInView = useInView(finalRef, { amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: finalRef,
    offset: ["start end", "end end"],
  });
  // Enhanced parallax effects for Final section
  const routeY = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [120, 0, 0, -60]);
  const routeOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.5]);
  const formY = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [80, 0, 0, -40]);
  const formOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.5]);
  const formScale = useTransform(scrollYProgress, [0, 0.3], [0.9, 1]);

  useEffect(() => {
    // Dec 3, 2025 23:59:00 IST = UTC+5:30
    const endDate = new Date("2025-12-05T18:29:00Z");

    const updateCountdown = () => {
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();

      if (diff <= 0) {
        setIsExpired(true);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isExpired) return;

    // TODO: Insert to Supabase referrers table
    // await supabase.from('referrers').insert({ full_name: fullName, phone });

    setShowShareModal(true);
  };

  useEffect(() => {
    if (viewerIndex >= viewerSequence.length - 1) return;
    const timeout = setTimeout(() => {
      setViewerIndex((prev) => Math.min(prev + 1, viewerSequence.length - 1));
    }, 4500);
    return () => clearTimeout(timeout);
  }, [viewerIndex, viewerSequence.length]);

  useEffect(() => {
    if (isFinalInView) {
      setCardAnimationActive(true);
      setCardOrder([...CARD_IMAGES]);
    } else {
      setCardAnimationActive(false);
      setCardOrder([...CARD_IMAGES]);
    }
  }, [isFinalInView]);

  useEffect(() => {
    if (!cardAnimationActive) {
      return;
    }

    const interval = setInterval(() => {
      setCardOrder((prev) => [prev[1], prev[2], prev[0]]);
    }, 2800);

    return () => clearInterval(interval);
  }, [cardAnimationActive]);

  return (
    <>
      <section ref={finalRef} id="final" className="relative min-h-screen bg-light-bg grid-background pt-20 pb-0 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 relative">
            <h2 className="text-6xl md:text-7xl lg:text-8xl heading-display text-dark-text">
              What are you waiting for?
            </h2>
          </div>
          <div className="grid md:grid-cols-5 gap-12 items-center">
            {/* Left: Card stack */}
            <motion.div
              data-depth="0.15"
              style={{ y: routeY, opacity: routeOpacity }}
              className="md:col-span-2 flex justify-center md:justify-start mt-2 mb-16 md:mt-0 md:mb-0 md:-mt-96"
            >
              <div
                className="relative w-full max-w-[190px] sm:max-w-[220px] h-[220px] sm:h-[240px] md:h-[320px] md:ml-[12.5rem]"
                aria-hidden="true"
              >
                {cardOrder.map((card, index) => {
                  const isTop = index === 0;
                  const isMiddle = index === 1;
                  const isBottom = index === 2;
                  return (
                    <motion.img
                      key={card.alt}
                      src={card.src}
                      alt={card.alt}
                      initial={false}
                      animate={{
                        zIndex: isTop ? 30 : isMiddle ? 20 : 10,
                        scale: isTop ? 1 : isMiddle ? 0.96 : 0.92,
                        translateY: isTop ? 0 : isMiddle ? 18 : 34,
                        translateX: isTop ? 0 : isMiddle ? 8 : 14,
                        boxShadow: isTop
                          ? "0px 16px 34px rgba(7,7,7,0.20)"
                          : isMiddle
                          ? "0px 12px 28px rgba(7,7,7,0.16)"
                          : "0px 10px 24px rgba(7,7,7,0.12)",
                      }}
                      transition={{
                        duration: 0.65,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="absolute inset-0 w-full rounded-3xl border border-dark-text/10"
                      loading="lazy"
                    />
                  );
                })}
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              data-depth="0.3"
              style={{ y: formY, opacity: formOpacity, scale: formScale }}
              className="md:col-span-3"
            >
              <div className="max-w-md mx-auto bg-white/90 rounded-3xl border border-border shadow-xl backdrop-blur overflow-hidden">
                <div className="px-8 py-3 bg-gradient-to-r from-dark-bg via-dark-bg/80 to-dark-bg text-light-text flex items-center justify-center text-sm font-sans tracking-wide">
                  <span>{viewerSequence[viewerIndex]} people viewing right now</span>
                </div>
                <div className="p-8 space-y-6">
                  <div className="text-center">
                    <h2 className="text-5xl font-display text-dark-text">Refer Now</h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="font-sans text-sm font-medium text-dark-text/80" htmlFor="full-name">
                      Your Full Name
                    </label>
                    <input
                      id="full-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Fernandes"
                      required
                      disabled={isExpired}
                      className="w-full px-4 py-3 bg-secondary border border-border/80 rounded-xl font-sans text-dark-text placeholder:text-dark-text/40 focus:outline-none focus:ring-2 focus:ring-coral disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-sans text-sm font-medium text-dark-text/80" htmlFor="phone-number">
                      Your Phone Number
                    </label>
                    <input
                      id="phone-number"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile"
                      pattern="[0-9]{10}"
                      required
                      disabled={isExpired}
                      className="w-full px-4 py-3 bg-secondary border border-border/80 rounded-xl font-sans text-dark-text placeholder:text-dark-text/40 focus:outline-none focus:ring-2 focus:ring-coral disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                    <p className="text-xs text-dark-text/50 font-sans">We’ll only use this to tag referrals back to you.</p>
                  </div>

                  <button
                    id="refer-now"
                    type="submit"
                    disabled={isExpired}
                    className="w-full px-6 py-4 bg-coral text-light-text rounded-xl font-sans font-semibold hover:bg-coral-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isExpired ? "Offer Ended" : "Refer Now"}
                  </button>
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setShowNotifyModal(true)}
                      className="mt-2 inline-flex items-center gap-2 rounded-full border border-dark-text/20 px-4 py-2 text-sm font-sans text-dark-text/90 transition hover:border-dark-text/40 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M12 3C9.24 3 7 5.24 7 8V9.09C7 9.63 6.79 10.15 6.41 10.54L5.17 11.83C4.63 12.38 5.02 13.3 5.79 13.3H18.21C18.98 13.3 19.37 12.38 18.83 11.83L17.59 10.54C17.21 10.15 17 9.63 17 9.09V8C17 5.24 14.76 3 12 3Z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.5 14.7C9.5 15.99 10.71 17 12 17C13.29 17 14.5 15.99 14.5 14.7"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span>Get notified</span>
                    </button>
                  </div>
                </form>

                <div className="text-center space-y-3">
                  <a
                    href="https://wry-chef-6d0.notion.site/Flent-x-Messi-India-Tour-Giveaway-29d0c38bc238805da355d55be8e0b431?source=copy_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm text-coral hover:text-coral-hover underline transition-colors"
                  >
                    View Terms & Conditions
                  </a>

                  <div className="rounded-2xl bg-secondary/70 border border-border/60 px-4 py-3">
                    {isExpired ? (
                      <p className="font-sans text-sm text-dark-text/60">This experience has ended — next one drops soon.</p>
                    ) : (
                      <p className="font-sans text-sm text-dark-text/70">
                        Offer ends in {" "}
                        <span className="font-semibold text-dark-text">
                          {String(timeLeft.days).padStart(2, "0")} days {String(timeLeft.hours).padStart(2, "0")} hrs {String(timeLeft.minutes).padStart(2, "0")} min {String(timeLeft.seconds).padStart(2, "0")} sec
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            </motion.div>
          </div>
          <footer className="mt-20">
            <div className="mx-auto w-full max-w-[420px] rounded-none border border-dark-text/10 bg-white/75 px-6 pt-6 pb-6 shadow-xl backdrop-blur-sm sm:max-w-[520px] sm:rounded-[32px] sm:px-8 sm:pt-8 lg:-mx-10 lg:w-auto lg:max-w-none lg:flex lg:items-start lg:justify-between lg:rounded-[48px] lg:px-14 lg:pt-6 lg:pb-8">
              <div className="relative flex-1 max-w-xl w-full flex flex-col items-center lg:items-start">
                <img
                  src="/logo%20flent%20.png"
                  alt="Flent wordmark"
                  className="hidden sm:block sm:h-[260px] sm:translate-x-0 sm:translate-y-0 lg:h-[440px] lg:translate-x-0 lg:absolute lg:top-[-160px] lg:left-[-108px]"
                  loading="lazy"
                />
                <div className="mt-0 flex w-full max-w-[360px] flex-col items-center gap-3 text-center sm:mt-[-16px] sm:max-w-[420px] lg:mt-6 lg:max-w-none lg:items-start lg:text-left lg:pl-24 lg:pt-6">
                  <h1 className="block text-3xl font-display text-dark-text sm:hidden">Flent</h1>
                  <p className="text-sm font-sans leading-relaxed text-dark-text/85 sm:text-base md:text-lg">
                    We&apos;re India&apos;s first full-stack renting brand, offering fully furnished, designer homes with unmatched freedom and flexibility for those who demand more and settle for nothing less.
                  </p>
                  <div className="relative z-10 flex flex-nowrap items-center justify-between gap-3 text-dark-text sm:text-light-text sm:justify-center sm:gap-4 lg:justify-start lg:gap-5">
                    {SOCIAL_LINKS.map((link) => (
                      <a
                        key={`footer-social-${link.name}`}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 w-8 items-center justify-center text-dark-text transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:h-10 sm:w-10 sm:rounded-full sm:bg-dark-text sm:text-light-text sm:hover:bg-dark-text/90 lg:h-12 lg:w-12"
                        aria-label={link.name}
                      >
                        {link.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8 grid flex-1 grid-cols-2 gap-6 text-sm font-sans text-dark-text/85 text-center sm:text-base sm:gap-8 sm:text-left lg:mt-10 lg:max-w-sm">
                {FOOTER_LINK_GROUPS.map((group, groupIndex) => (
                  <div key={`footer-group-${groupIndex}`} className="flex flex-col gap-3 sm:gap-4">
                    {group.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="transition hover:text-dark-text focus:text-dark-text focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </footer>
        </div>
        <img
          src="/fonts/final%20ill.png"
          alt="Experience illustration"
          className="hidden md:block absolute left-16 bottom-[300px] w-[260px] pointer-events-none select-none"
          loading="lazy"
        />
        <img
          src="/fonts/final%20ill.png"
          alt="Mobile experience illustration"
          className="block md:hidden mx-auto mt-8 w-[220px] pointer-events-none select-none"
          loading="lazy"
        />
      </section>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => {
          setShowShareModal(false);
          setFullName("");
          setPhone("");
        }}
        fullName={fullName}
        phone={phone}
      />
      <AnimatePresence>
        {showNotifyModal && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => {
                setShowNotifyModal(false);
                setNotifyEmail("");
              }}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 20 }}
              className="relative z-[130] w-full max-w-sm rounded-3xl bg-light-bg p-8 shadow-2xl border border-dark-text/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl text-dark-text leading-tight">Get notified for the next experience</h3>
                  <p className="mt-2 text-sm font-sans text-dark-text/70">
                    Drop your email and we&apos;ll ping you when the next experience unlocks.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifyModal(false);
                    setNotifyEmail("");
                  }}
                  className="text-dark-text/50 transition hover:text-dark-text focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 rounded-full"
                  aria-label="Close notify modal"
                >
                  ×
                </button>
              </div>
              <form
                className="mt-6 space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  setShowNotifyModal(false);
                  setNotifyEmail("");
                }}
              >
                <label className="block">
                  <span className="sr-only">Email address</span>
                  <input
                    type="email"
                    required
                    value={notifyEmail}
                    onChange={(event) => setNotifyEmail(event.target.value)}
                    placeholder="your@email.com"
                    className="w-full rounded-2xl border border-dark-text/15 bg-secondary px-4 py-3 font-sans text-dark-text placeholder:text-dark-text/40 focus:outline-none focus:ring-2 focus:ring-coral"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-coral px-5 py-3 font-sans font-semibold text-light-text transition hover:bg-coral-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
                >
                  Notify Me
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
