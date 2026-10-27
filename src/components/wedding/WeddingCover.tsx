import React, { useState, useEffect } from 'react';
import { MailOpen, Sparkles } from 'lucide-react';
import { WeddingData } from '../../types/wedding';

interface WeddingCoverProps {
  wedding: WeddingData;
  guestName: string;
  isOpen: boolean;
  onOpen: () => void;
}

export const WeddingCover: React.FC<WeddingCoverProps> = ({
  wedding,
  guestName,
  isOpen,
  onOpen,
}) => {
  const [animatingOut, setAnimatingOut] = useState(false);
  const [isRendered, setIsRendered] = useState(!isOpen);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initial staggered entry animation
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setAnimatingOut(true);
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 1000); // 1.0s slow majestic exit
      return () => clearTimeout(timer);
    } else {
      setIsRendered(true);
      setAnimatingOut(false);
    }
  }, [isOpen]);

  if (!isRendered) return null;

  const groomName = wedding.couple?.groom?.nickname || 'Abdi';
  const brideName = wedding.couple?.bride?.nickname || 'Lula';

  return (
    <div
      id="wedding-cover"
      className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{
        backgroundColor: '#1E1815',
        opacity: animatingOut ? 0 : 1,
        transform: animatingOut ? 'translateY(-100%) scale(1.03)' : 'translateY(0) scale(1)',
        pointerEvents: animatingOut ? 'none' : 'auto',
      }}
    >
      {/* Outer desktop background with warm ambient blur */}
      <div
        className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-[0.4] blur-sm"
        style={{ backgroundImage: `url('${wedding.gallery[0]?.url || '/images/hero_couple.jpg'}')` }}
      />
      <div className="hidden md:block absolute inset-0 bg-black/50" />

      {/* 500px Centered Luxury Mobile Card */}
      <div
        className="relative w-full max-w-[500px] h-full sm:h-[100svh] max-h-[920px] bg-cover bg-center bg-no-repeat flex flex-col justify-between items-center text-center px-6 py-10 shadow-2xl overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(28, 22, 19, 0.95) 0%, rgba(28, 22, 19, 0.55) 50%, rgba(28, 22, 19, 0.85) 100%), url('${wedding.gallery[0]?.url || '/images/hero_couple.jpg'}')`,
        }}
      >
        {/* Top Ornament Arch Accent */}
        <div
          className="transition-all duration-1000 pt-6 z-10 flex flex-col items-center"
          style={{
            opacity: isReady ? 1 : 0,
            transform: isReady ? 'translateY(0)' : 'translateY(-20px)',
            transitionDelay: '200ms',
          }}
        >
          <div className="flex items-center gap-2 mb-2 text-[#B89B63]">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#B89B63]" />
            <Sparkles className="w-3.5 h-3.5 text-[#B89B63] animate-pulse" />
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#B89B63]" />
          </div>

          <p className="text-[12px] sm:text-[13px] uppercase font-medium tracking-[3.5px] text-[#E8D8BD]/90">
            {wedding.coverTitle || 'THE WEDDING OF'}
          </p>
        </div>

        {/* Couple Names & Date with slow majestic entrance */}
        <div className="space-y-3 z-10 my-auto">
          <h1
            className="text-[46px] sm:text-[58px] font-serif text-[#FAF7F0] font-normal leading-[1.08] tracking-normal drop-shadow-md transition-all duration-1200"
            style={{
              opacity: isReady ? 1 : 0,
              transform: isReady ? 'scale(1)' : 'scale(0.92)',
              transitionDelay: '400ms',
            }}
          >
            {groomName} &amp; {brideName}
          </h1>

          <div
            className="flex items-center justify-center gap-3 pt-1 transition-all duration-1000"
            style={{
              opacity: isReady ? 1 : 0,
              transform: isReady ? 'translateY(0)' : 'translateY(15px)',
              transitionDelay: '600ms',
            }}
          >
            <div className="h-[1px] w-10 bg-[#B89B63]/60" />
            <p className="text-[12px] sm:text-[13px] tracking-[3px] text-[#D4BC8B] font-medium uppercase">
              Sabtu, 21 November 2026
            </p>
            <div className="h-[1px] w-10 bg-[#B89B63]/60" />
          </div>
        </div>

        {/* Guest Name & Open Invitation Button */}
        <div className="w-full max-w-xs space-y-5 mb-6 z-10 flex flex-col items-center">
          {/* Frosted Guest Badge */}
          <div
            className="w-full px-5 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-[#E8D8BD]/30 shadow-lg space-y-1 transition-all duration-1000"
            style={{
              opacity: isReady ? 1 : 0,
              transform: isReady ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '800ms',
            }}
          >
            <p className="text-[11px] sm:text-[12px] font-medium tracking-[2px] text-[#E8D8BD]/80 uppercase">
              {wedding.coverSubtitle || 'Kepada Yth.'}
            </p>
            <h2 className="text-[16px] sm:text-[18px] font-serif text-[#FAF7F0] font-medium truncate">
              {guestName}
            </h2>
            <p className="text-[10px] text-[#E8D8BD]/70 tracking-wider">
              di Tempat
            </p>
          </div>

          {/* Luxury Open Button with shimmer effect */}
          <button
            id="btn-open-invitation"
            onClick={onOpen}
            className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-white text-[13px] tracking-[2px] uppercase font-medium shadow-2xl hover:shadow-[0_0_25px_rgba(184,155,99,0.5)] active:scale-95 transition-all duration-1000 cursor-pointer overflow-hidden btn-luxury-gradient hover:scale-105"
            style={{
              opacity: isReady ? 1 : 0,
              transform: isReady ? 'translateY(0)' : 'translateY(25px)',
              transitionDelay: '1000ms',
            }}
          >
            <MailOpen className="w-4 h-4 transition-transform group-hover:scale-110 text-[#FAF7F0]" />
            <span className="font-semibold text-[#FAF7F0]">Buka Undangan</span>
            {/* Shimmer light sweep */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-all pointer-events-none" />
          </button>
        </div>
      </div>
    </div>
  );
};
