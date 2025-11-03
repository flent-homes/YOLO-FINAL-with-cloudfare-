import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export const AnimatedRoute = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [showReplay, setShowReplay] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setShowReplay(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isAnimating]);

  const replay = () => {
    setShowReplay(false);
    setIsAnimating(true);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <svg
        width="100%"
        height="500"
        viewBox="0 0 300 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
      >
        {/* Dotted S-curve path */}
        <path
          d="M 50 50 Q 100 150, 150 200 Q 200 250, 150 350 Q 100 400, 50 450"
          stroke="#0A0A0A"
          strokeWidth="2"
          strokeDasharray="8,8"
          fill="none"
        />

        {/* Solid segment for takeoff */}
        {isAnimating && (
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 3.3 }}
            d="M 50 450 Q 120 440, 200 420"
            stroke="#0A0A0A"
            strokeWidth="3"
            fill="none"
          />
        )}

        {/* Waypoint 1 */}
        <g>
          <circle cx="50" cy="50" r="12" fill="#FFFFFF" stroke="#0A0A0A" strokeWidth="2" />
          <text x="50" y="55" textAnchor="middle" fill="#0A0A0A" fontSize="16" fontWeight="700">
            1
          </text>
          <text
            x="80"
            y="55"
            fill="#0A0A0A"
            fontSize="14"
            fontFamily="Plus Jakarta Sans, sans-serif"
            className="select-none"
          >
            Share Flent Homes with <tspan fontWeight="700">5 friends</tspan>.
          </text>
        </g>

        {/* Waypoint 2 */}
        <g>
          <circle cx="150" cy="200" r="12" fill="#FFFFFF" stroke="#0A0A0A" strokeWidth="2" />
          <text x="150" y="205" textAnchor="middle" fill="#0A0A0A" fontSize="16" fontWeight="700">
            2
          </text>
          <text
            x="180"
            y="195"
            fill="#0A0A0A"
            fontSize="13"
            fontFamily="Plus Jakarta Sans, sans-serif"
            className="select-none"
          >
            <tspan x="180" dy="0">When they book,</tspan>
            <tspan x="180" dy="16">they'll include your</tspan>
            <tspan x="180" dy="16"><tspan fontWeight="700">name</tspan> and <tspan fontWeight="700">number</tspan></tspan>
            <tspan x="180" dy="16">in the onboarding form.</tspan>
          </text>
        </g>

        {/* Waypoint 3 */}
        <g>
          <circle cx="50" cy="450" r="12" fill="#FF6A3D" stroke="#0A0A0A" strokeWidth="2" />
          <text x="50" y="455" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="700">
            3
          </text>
          <text
            x="80"
            y="455"
            fill="#0A0A0A"
            fontSize="14"
            fontFamily="Plus Jakarta Sans, sans-serif"
            className="select-none"
          >
            You win the <tspan fontWeight="700">GOAT Tour</tspan> India trip.
          </text>
        </g>

        {/* Animated plane */}
        {isAnimating && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 1, 1, 1, 0],
              rotate: [0, 0, 0, 0, 0, -20],
              y: [0, 0, 0, 0, 0, -8],
              scale: [1, 1, 1, 1, 1, 0.96],
            }}
            transition={{
              duration: 3.8,
              times: [0, 0.25, 0.35, 0.6, 0.7, 1],
              ease: "easeInOut",
            }}
            style={{ 
              offsetPath: "path('M 50 50 Q 100 150, 150 200 Q 200 250, 150 350 Q 100 400, 50 450 Q 120 440, 200 420')",
              offsetDistance: "0%"
            }}
          >
            <path
              d="M -10 0 L 10 0 L 12 -8 L -12 -8 Z M 0 -3 L -8 2 M 0 -3 L 8 2"
              fill="#0A0A0A"
              stroke="#0A0A0A"
              strokeWidth="1.5"
            />
          </motion.g>
        )}

        {/* CTA pulse at end */}
        {isAnimating && (
          <motion.circle
            initial={{ r: 0, opacity: 0 }}
            animate={{ r: 20, opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.3, delay: 3.7 }}
            cx="200"
            cy="420"
            fill="#FF6A3D"
          />
        )}
      </svg>

      {/* Replay button */}
      {showReplay && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={replay}
          className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-dark-text/80 hover:bg-dark-text flex items-center justify-center transition-all hover:scale-110"
        >
          <Play className="w-5 h-5 text-light-text ml-0.5" fill="currentColor" />
        </motion.button>
      )}
    </div>
  );
};
