import { forwardRef } from "react";

export const ParachuteSVG = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => (
  <svg
    ref={ref}
    width="120"
    height="140"
    viewBox="0 0 120 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-lg"
    {...props}
  >
    {/* Parachute canopy */}
    <path
      d="M10 30 Q30 10, 60 10 Q90 10, 110 30 Q100 50, 60 55 Q20 50, 10 30"
      fill="#FFFFFF"
      stroke="#0A0A0A"
      strokeWidth="1.5"
    />
    
    {/* FLENT text on canopy */}
    <text
      x="60"
      y="35"
      textAnchor="middle"
      fill="#0A0A0A"
      fontSize="12"
      fontWeight="700"
      fontFamily="Zin Display Condensed, Arial Narrow, sans-serif"
    >
      FLENT
    </text>
    
    {/* Parachute lines */}
    <line x1="20" y1="48" x2="55" y2="85" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
    <line x1="60" y1="55" x2="60" y2="85" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
    <line x1="100" y1="48" x2="65" y2="85" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
    
    {/* Stick figure */}
    {/* Head */}
    <circle cx="60" cy="95" r="6" fill="#FFFFFF" stroke="#0A0A0A" strokeWidth="1.5" />
    
    {/* Body */}
    <line x1="60" y1="101" x2="60" y2="120" stroke="#FFFFFF" strokeWidth="2" />
    
    {/* Arms */}
    <line x1="60" y1="108" x2="50" y2="105" stroke="#FFFFFF" strokeWidth="2" />
    <line x1="60" y1="108" x2="70" y2="105" stroke="#FFFFFF" strokeWidth="2" />
    
    {/* Legs */}
    <line x1="60" y1="120" x2="52" y2="135" stroke="#FFFFFF" strokeWidth="2" />
    <line x1="60" y1="120" x2="68" y2="135" stroke="#FFFFFF" strokeWidth="2" />
  </svg>
));

ParachuteSVG.displayName = "ParachuteSVG";
