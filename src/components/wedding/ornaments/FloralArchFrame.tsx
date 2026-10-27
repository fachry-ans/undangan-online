import React from 'react';

interface FloralArchFrameProps {
  children: React.ReactNode;
  className?: string;
  hasDoubleBorder?: boolean;
}

export const FloralArchFrame: React.FC<FloralArchFrameProps> = ({
  children,
  className = '',
  hasDoubleBorder = true,
}) => {
  return (
    <div className={`relative p-3 sm:p-5 ${className}`}>
      {/* Outer arched frame */}
      <div
        className={`absolute inset-0 rounded-t-[140px] sm:rounded-t-[200px] rounded-b-2xl border border-[#B08A5B]/40 pointer-events-none transition-all duration-700`}
      />

      {/* Inner thin border */}
      {hasDoubleBorder && (
        <div
          className={`absolute inset-2 sm:inset-3 rounded-t-[130px] sm:rounded-t-[190px] rounded-b-xl border border-[#B08A5B]/20 pointer-events-none`}
        />
      )}

      {/* Corner filigree dots */}
      <div className="absolute top-4 left-4 w-1.5 h-1.5 rounded-full bg-[#B08A5B]/60" />
      <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-[#B08A5B]/60" />
      <div className="absolute bottom-4 left-4 w-1.5 h-1.5 rounded-full bg-[#B08A5B]/60" />
      <div className="absolute bottom-4 right-4 w-1.5 h-1.5 rounded-full bg-[#B08A5B]/60" />

      {/* Content wrapper */}
      <div className="relative z-10 overflow-hidden rounded-t-[125px] sm:rounded-t-[185px] rounded-b-lg">
        {children}
      </div>
    </div>
  );
};
