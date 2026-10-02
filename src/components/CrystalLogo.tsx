import React from 'react';

interface CrystalLogoProps {
  className?: string;
  style?: React.CSSProperties;
  size?: number | string;
}

export const CrystalLogo: React.FC<CrystalLogoProps> = ({ className = '', style = {}, size }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-label="Crystal Quest"
      role="img"
    >
      <defs>
        <linearGradient id="gemGradLogo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f2fe" />
          <stop offset="50%" stopColor="#4facfe" />
          <stop offset="100%" stopColor="#0052ff" />
        </linearGradient>
        <filter id="glowLogo" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <polygon points="50,5 92,28 92,72 50,95 8,72 8,28" fill="url(#gemGradLogo)" filter="url(#glowLogo)" />
      <polygon points="50,15 82,33 82,67 50,85 18,67 18,33" fill="#ffffff" fillOpacity="0.35" />
      <polygon points="50,22 75,37 75,63 50,78 25,63 25,37" fill="url(#gemGradLogo)" />
      <polygon points="50,25 65,37 65,55 50,65 35,55 35,37" fill="#ffffff" fillOpacity="0.55" />
    </svg>
  );
};
