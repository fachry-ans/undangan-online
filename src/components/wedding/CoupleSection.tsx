import React from 'react';
import { Instagram } from 'lucide-react';
import { WeddingData } from '../../types/wedding';
import { ScrollReveal } from '../common/ScrollReveal';

interface CoupleSectionProps {
  wedding: WeddingData;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({ wedding }) => {
  const { groom, bride } = wedding.couple;

  return (
    <section className="relative py-16 px-4 text-center max-w-[460px] mx-auto space-y-12 overflow-hidden">
      {/* Title */}
      <div className="space-y-3">
        <ScrollReveal animation="fade-down" delay={100} duration={1200}>
          <div className="inline-block px-3 py-1 rounded-full bg-[#E8D8BD]/40 text-[#B89B63] text-[11px] font-sans uppercase tracking-[3px] font-semibold mb-1">
            Mempelai
          </div>
          <h2 className="text-[36px] sm:text-[42px] text-[#3A302B] font-serif font-normal leading-[1.05]">
            Mempelai Pria &amp; Wanita
          </h2>
        </ScrollReveal>

      </div>

      {/* Groom Card: Enters from left with 1200ms slow animation */}
      <ScrollReveal animation="fade-right" delay={200} duration={1200}>
        <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xs border border-[#E8D8BD]/80 shadow-[0_10px_35px_rgba(58,48,43,0.05)] space-y-5 flex flex-col items-center">
          {/* Arched Photo Frame with double border */}
          <div className="relative w-52 h-72 sm:w-56 sm:h-76 p-1.5 rounded-t-[500px] rounded-b-2xl border-2 border-[#B89B63]/40 bg-[#FAF7F0] shadow-md">
            <div className="w-full h-full overflow-hidden rounded-t-[490px] rounded-b-xl">
              <img
                src={groom.photo || '/images/groom.jpg'}
                alt={groom.fullName}
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-[32px] sm:text-[36px] text-[#3A302B] font-serif font-normal leading-tight">
              {groom.nickname}
            </h3>

            <p className="text-[14px] font-semibold text-[#B89B63] font-sans">
              {groom.fullName}
            </p>

            <p className="text-[12px] text-[#70635C] max-w-xs mx-auto leading-relaxed pt-1 font-sans">
              {groom.parents}
            </p>
          </div>

          {groom.instagram && (
            <a
              href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-semibold text-white btn-luxury-gradient shadow-md transition-transform hover:scale-105 font-sans"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@{groom.instagram.replace('@', '')}</span>
            </a>
          )}
        </div>
      </ScrollReveal>

      {/* Romantic Center Ampersand */}
      <ScrollReveal animation="zoom-in" delay={150} duration={1200}>
        <div className="flex items-center justify-center gap-4 py-2">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#B89B63]/60" />
          <span className="text-[44px] sm:text-[50px] text-[#B89B63] font-serif font-normal inline-block">
            &amp;
          </span>
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#B89B63]/60" />
        </div>
      </ScrollReveal>

      {/* Bride Card: Enters from right with 1200ms slow animation */}
      <ScrollReveal animation="fade-left" delay={200} duration={1200}>
        <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xs border border-[#E8D8BD]/80 shadow-[0_10px_35px_rgba(58,48,43,0.05)] space-y-5 flex flex-col items-center">
          {/* Arched Photo Frame with double border */}
          <div className="relative w-52 h-72 sm:w-56 sm:h-76 p-1.5 rounded-t-[500px] rounded-b-2xl border-2 border-[#B89B63]/40 bg-[#FAF7F0] shadow-md">
            <div className="w-full h-full overflow-hidden rounded-t-[490px] rounded-b-xl">
              <img
                src={bride.photo || '/images/bride.jpg'}
                alt={bride.fullName}
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-[32px] sm:text-[36px] text-[#3A302B] font-serif font-normal leading-tight">
              {bride.nickname}
            </h3>

            <p className="text-[14px] font-semibold text-[#B89B63] font-sans">
              {bride.fullName}
            </p>

            <p className="text-[12px] text-[#70635C] max-w-xs mx-auto leading-relaxed pt-1 font-sans">
              {bride.parents}
            </p>
          </div>

          {bride.instagram && (
            <a
              href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-semibold text-white btn-luxury-gradient shadow-md transition-transform hover:scale-105 font-sans"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@{bride.instagram.replace('@', '')}</span>
            </a>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
};
