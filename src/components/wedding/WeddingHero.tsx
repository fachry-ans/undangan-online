import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { WeddingData } from '../../types/wedding';
import { ScrollReveal } from '../common/ScrollReveal';
import { formatWeddingDate } from '../../utils/weddingDate';

interface WeddingHeroProps {
  wedding: WeddingData;
}

export const WeddingHero: React.FC<WeddingHeroProps> = ({ wedding }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const slides = [
    wedding.gallery[0]?.url || '/images/hero_couple.jpg',
    wedding.gallery[3]?.url || '/images/landscape.jpg',
    wedding.gallery[4]?.url || '/images/rings.jpg',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const groomName = wedding.couple?.groom?.nickname || 'Abdi';
  const brideName = wedding.couple?.bride?.nickname || 'Lula';

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-between py-12 px-4 text-center overflow-hidden">
      {/* Top Spacer */}
      <div className="h-4" />

      {/* Modern Botanical Crest Accent with slow gentle sway */}
      <ScrollReveal animation="fade-down" delay={100} duration={1200}>
        <div className="flex flex-col items-center space-y-1 goyang-1 mb-2">
          <div className="flex items-center gap-2 text-[#B89B63]">
            <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#B89B63]" />
            <Sparkles className="w-4 h-4 text-[#B89B63]" />
            <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#B89B63]" />
          </div>
          <span className="text-[11px] font-sans uppercase tracking-[4px] text-[#B89B63] font-semibold">
            Walimatul 'Urs
          </span>
        </div>
      </ScrollReveal>

      {/* Headings */}
      <div className="space-y-2.5 z-10">
        <ScrollReveal animation="fade-down" delay={250} duration={1200}>
          <h2 className="text-[13px] sm:text-[14px] uppercase tracking-[4px] text-[#70635C] font-medium font-sans">
            {wedding.coverTitle}
          </h2>
        </ScrollReveal>

        <ScrollReveal animation="zoom-in" delay={450} duration={1200}>
          <h1 className="text-[46px] sm:text-[58px] text-[#3A302B] font-serif font-normal leading-[1.05] tracking-tight my-1">
            {groomName} &amp; {brideName}
          </h1>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={650} duration={1200}>
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-xs border border-[#E8D8BD]/80 shadow-xs">
            <span className="text-[13px] tracking-[3px] text-[#B89B63] font-medium uppercase font-sans">
              {formatWeddingDate(wedding)}
            </span>
          </div>
        </ScrollReveal>
      </div>

      {/* Modern Architectural Arch Photo Card with Smooth Crossfade */}
      <ScrollReveal animation="fade-up" delay={800} duration={1200} className="w-full">
        <div className="relative w-60 sm:w-68 h-84 sm:h-96 mx-auto my-6 p-2 rounded-t-[500px] rounded-b-2xl border-2 border-[#B89B63]/40 bg-white/60 shadow-xl backdrop-blur-xs">
          <div className="relative w-full h-full overflow-hidden rounded-t-[490px] rounded-b-xl">
            {slides.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`Abdi & Lula Prewedding ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1200 ease-in-out ${
                  slideIndex === i ? 'opacity-100 scale-100' : 'opacity-0 scale-108'
                }`}
              />
            ))}
            {/* Subtle bottom vignette inside photo */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </div>

          {/* Delicate corner dots */}
          <div className="absolute top-4 left-4 w-1.5 h-1.5 rounded-full bg-[#B89B63]" />
          <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-[#B89B63]" />
        </div>
      </ScrollReveal>

      {/* Bottom spacer */}
      <div className="h-2" />
    </section>
  );
};
