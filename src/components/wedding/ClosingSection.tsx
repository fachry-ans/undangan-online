import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { WeddingData } from '../../types/wedding';
import { ScrollReveal } from '../common/ScrollReveal';

interface ClosingSectionProps {
  wedding: WeddingData;
  onAdminAccess: () => void;
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({
  wedding,
  onAdminAccess,
}) => {
  const groomName = wedding.couple?.groom?.nickname || 'Abdi';
  const brideName = wedding.couple?.bride?.nickname || 'Lula';

  return (
    <footer className="relative py-20 px-4 text-center max-w-[460px] mx-auto space-y-8 overflow-hidden">
      {/* Modern Botanical Arch Accent with gentle sway */}
      <ScrollReveal animation="fade-down" delay={150} duration={1200}>
        <div className="flex flex-col items-center space-y-2 goyang-1 mb-2">
          <div className="flex items-center gap-2 text-[#B89B63]">
            <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#B89B63]" />
            <Sparkles className="w-4 h-4 text-[#B89B63]" />
            <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#B89B63]" />
          </div>
        </div>
      </ScrollReveal>

      {/* Closing Message and Thank You */}
      <ScrollReveal animation="fade-up" delay={300} duration={1200}>
        <div className="space-y-4 px-3">
          <p className="text-[13px] sm:text-[14px] text-[#3A302B] leading-relaxed italic font-serif">
            "{wedding.closing?.message || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restunya untuk pernikahan kami.'}"
          </p>

          <p className="text-[13px] text-[#70635C] leading-relaxed pt-1 font-sans">
            {wedding.closing?.thanksText || 'Atas do’a & restunya, kami ucapkan terima kasih.'}
          </p>
        </div>
      </ScrollReveal>

      {/* Couple Names */}
      <ScrollReveal animation="zoom-in" delay={450} duration={1200}>
        <div className="pt-2">
          <p className="text-[11px] uppercase tracking-[4px] text-[#B89B63] font-semibold mb-1 font-sans">
            Kami Yang Berbahagia
          </p>
          <h2 className="text-[44px] sm:text-[54px] text-[#3A302B] font-serif font-normal leading-tight">
            {groomName} &amp; {brideName}
          </h2>
        </div>
      </ScrollReveal>

      {/* Modern footer divider */}
      <ScrollReveal animation="fade-up" delay={600} duration={1200}>
        <div className="pt-12 border-t border-[#E8D8BD]/80 space-y-2 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[#B89B63] text-xs font-sans">
            <span>The Wedding of Abdi &amp; Lula</span>
            <span>•</span>
            <span>2026</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-[11px] text-[#70635C] font-sans">
            <span>Made with</span>
            <button
              type="button"
              onClick={onAdminAccess}
              className="inline-flex cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89B63]"
              aria-label="Buka Admin Panel"
              title="Admin"
            >
              <Heart className="w-3 h-3 text-[#B89B63] fill-[#B89B63]" />
            </button>
            <span>for their special day</span>
          </div>
          <p className="text-[11px] text-[#70635C] font-sans">
            Created By Muhammad Fachry Anshor
          </p>
        </div>
      </ScrollReveal>
    </footer>
  );
};
