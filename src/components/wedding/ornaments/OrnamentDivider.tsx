import React from 'react';

interface OrnamentDividerProps {
  className?: string;
  variant?: 'diamond' | 'flower' | 'leaves' | 'simple';
  color?: string;
}

export const OrnamentDivider: React.FC<OrnamentDividerProps> = ({
  className = '',
  variant = 'leaves',
  color = 'currentColor',
}) => {
  if (variant === 'diamond') {
    return (
      <div className={`flex items-center justify-center gap-3 my-4 ${className}`}>
        <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#B08A5B]/60" />
        <div className="w-2.5 h-2.5 rotate-45 border border-[#B08A5B] bg-[#F8F4EE]" />
        <div className="w-1.5 h-1.5 rotate-45 bg-[#B08A5B]" />
        <div className="w-2.5 h-2.5 rotate-45 border border-[#B08A5B] bg-[#F8F4EE]" />
        <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#B08A5B]/60" />
      </div>
    );
  }

  if (variant === 'simple') {
    return (
      <div className={`flex items-center justify-center gap-2 my-3 ${className}`}>
        <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-[#B08A5B]/50 to-[#B08A5B]" />
        <span className="text-[#B08A5B] text-xs font-serif tracking-widest">✦</span>
        <div className="h-[1px] w-16 bg-gradient-to-l from-transparent via-[#B08A5B]/50 to-[#B08A5B]" />
      </div>
    );
  }

  // Botanical leaves divider
  return (
    <div className={`flex items-center justify-center gap-2 my-5 ${className}`}>
      <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-[#B08A5B]/60" />
      <svg
        className="w-8 h-8 text-[#B08A5B]"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 5C20 5 17 12 11 14C17 16 20 23 20 23C20 23 23 16 29 14C23 12 20 5 20 5Z"
          fill={color}
          fillOpacity="0.8"
        />
        <circle cx="20" cy="14" r="1.5" fill="#F8F4EE" stroke={color} strokeWidth="0.8" />
        <path
          d="M20 23V35M16 28C17.5 27 20 28 20 28M24 31C22.5 30 20 31 20 31"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
      <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-[#B08A5B]/60" />
    </div>
  );
};
