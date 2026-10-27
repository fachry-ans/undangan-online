import React from 'react';

interface BotanicalBranchProps {
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'inline';
  flip?: boolean;
}

export const BotanicalBranch: React.FC<BotanicalBranchProps> = ({
  className = '',
  position = 'inline',
  flip = false,
}) => {
  const getPositionClass = () => {
    switch (position) {
      case 'top-left':
        return 'absolute top-0 left-0 -translate-x-4 -translate-y-4';
      case 'top-right':
        return 'absolute top-0 right-0 translate-x-4 -translate-y-4 -scale-x-100';
      case 'bottom-left':
        return 'absolute bottom-0 left-0 -translate-x-4 translate-y-4 -scale-y-100';
      case 'bottom-right':
        return 'absolute bottom-0 right-0 translate-x-4 translate-y-4 -scale-x-100 -scale-y-100';
      default:
        return '';
    }
  };

  return (
    <div
      className={`pointer-events-none select-none text-[#B08A5B]/30 ${getPositionClass()} ${
        flip ? '-scale-x-100' : ''
      } ${className}`}
      aria-hidden="true"
    >
      <svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-24 h-24 sm:w-36 sm:h-36"
      >
        <path
          d="M10 130C30 110 50 80 85 45C105 25 125 15 130 10"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Leaves */}
        <path
          d="M85 45C80 30 95 20 105 25C105 35 95 45 85 45Z"
          fill="currentColor"
          fillOpacity="0.4"
        />
        <path
          d="M65 65C50 60 55 45 68 48C75 55 70 65 65 65Z"
          fill="currentColor"
          fillOpacity="0.4"
        />
        <path
          d="M95 35C105 45 115 40 120 30C110 25 100 30 95 35Z"
          fill="currentColor"
          fillOpacity="0.4"
        />
        <path
          d="M45 85C30 80 32 65 45 70C52 75 50 85 45 85Z"
          fill="currentColor"
          fillOpacity="0.4"
        />
        <path
          d="M52 80C65 85 70 78 72 68C62 68 55 75 52 80Z"
          fill="currentColor"
          fillOpacity="0.4"
        />
        <path
          d="M25 105C12 100 15 88 28 92C32 98 30 105 25 105Z"
          fill="currentColor"
          fillOpacity="0.4"
        />
        <path
          d="M32 100C42 105 48 98 48 90C40 90 35 96 32 100Z"
          fill="currentColor"
          fillOpacity="0.4"
        />
        <circle cx="128" cy="12" r="2.5" fill="currentColor" fillOpacity="0.8" />
        <circle cx="106" cy="24" r="1.5" fill="currentColor" fillOpacity="0.6" />
      </svg>
    </div>
  );
};
