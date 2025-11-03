import { useState, useEffect, FormEvent, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { AnimatedRoute } from "./AnimatedRoute";
import { ShareModal } from "./ShareModal";

export const FinalWhite = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { toast } = useToast();
  const finalRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: finalRef,
    offset: ["start end", "end start"]
  });
  
  // Enhanced parallax effects for Final section
  const routeY = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [120, 0, 0, -60]);
  const routeOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.5]);
  const formY = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [80, 0, 0, -40]);
  const formOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.5]);
  const formScale = useTransform(scrollYProgress, [0, 0.3], [0.9, 1]);

  useEffect(() => {
    // Dec 3, 2025 23:59:00 IST = UTC+5:30
    const endDate = new Date("2025-12-03T18:29:00Z");

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

    toast({
      description: "You're in! Make 5 assists and secure your goal to meet the GOAT.",
    });

    setShowShareModal(true);
  };

  return (
    <>
      <section ref={finalRef} id="final" className="relative min-h-screen bg-light-bg py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-12 items-center">
            {/* Left: Animated Route */}
            <motion.div
              data-depth="0.15"
              style={{ y: routeY, opacity: routeOpacity }}
              className="md:col-span-2"
            >
              <AnimatedRoute />
            </motion.div>

            {/* Right: Form */}
            <motion.div
              data-depth="0.3"
              style={{ y: formY, opacity: formOpacity, scale: formScale }}
              className="md:col-span-3"
            >
              <div className="max-w-md mx-auto">
                <h2 className="text-5xl font-display text-dark-text mb-8">Start Referring</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full Name"
                      required
                      disabled={isExpired}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-lg font-sans text-dark-text placeholder:text-dark-text/40 focus:outline-none focus:ring-2 focus:ring-coral disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number"
                      pattern="[0-9]{10}"
                      required
                      disabled={isExpired}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-lg font-sans text-dark-text placeholder:text-dark-text/40 focus:outline-none focus:ring-2 focus:ring-coral disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                    <p className="mt-2 text-sm text-dark-text/60 font-sans">10 digits required</p>
                  </div>

                  <button
                    id="refer-now"
                    type="submit"
                    disabled={isExpired}
                    className="w-full px-6 py-4 bg-coral text-light-text rounded-lg font-sans font-semibold hover:bg-coral-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isExpired ? "Offer Ended" : "Refer Now"}
                  </button>
                </form>

                {/* Countdown */}
                <div className="mt-8 text-center">
                  {isExpired ? (
                    <p className="font-sans text-muted-grey text-base tracking-wide" style={{ opacity: 0.6 }}>
                      This experience has ended — next one drops soon.
                    </p>
                  ) : (
                    <p className="font-sans text-muted-grey text-base tracking-wide" style={{ opacity: 0.6 }}>
                      Offer ends in{" "}
                      <span className="font-medium">
                        {String(timeLeft.days).padStart(2, "0")} days{" "}
                        {String(timeLeft.hours).padStart(2, "0")} hrs{" "}
                        {String(timeLeft.minutes).padStart(2, "0")} min{" "}
                        {String(timeLeft.seconds).padStart(2, "0")} sec
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
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
    </>
  );
};
