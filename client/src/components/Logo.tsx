import React from "react";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "w-40 h-40" }: LogoProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 200 200" 
      className={className}
    >
      <defs>
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="orangeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Orange glow circle */}
      <circle cx="100" cy="70" r="40" fill="none" stroke="#FFA500" strokeWidth="3" filter="url(#orangeGlow)" />
      
      {/* Fork */}
      <path d="M80 40 L80 85 M80 55 L80 85 M70 40 L70 55 M90 40 L90 55" 
            fill="none" stroke="#00FF00" strokeWidth="3" strokeLinecap="round" 
            filter="url(#neonGlow)" />
      
      {/* Spoon */}
      <path d="M120 40 A20 20 0 0 1 120 80 L120 85" 
            fill="none" stroke="#00FF00" strokeWidth="3" strokeLinecap="round" 
            filter="url(#neonGlow)" />

      {/* JOURN text */}
      <text x="30" y="150" fontFamily="Arial" fontSize="30" fontWeight="bold" 
            fill="#00FF00" filter="url(#neonGlow)">JOURN</text>
      
      {/* EATZ text */}
      <text x="105" y="150" fontFamily="Arial" fontSize="30" fontWeight="bold" 
            fill="#FFA500" filter="url(#orangeGlow)">EATZ</text>
    </svg>
  );
}
