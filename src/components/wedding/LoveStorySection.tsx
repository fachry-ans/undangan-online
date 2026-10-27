import React from 'react';
import { WeddingData, LoveStoryItem } from '../../types/wedding';
import { ScrollReveal } from '../common/ScrollReveal';

interface LoveStorySectionProps {
  wedding: WeddingData;
}

export const LoveStorySection: React.FC<LoveStorySectionProps> = ({ wedding }) => {
  return (
    <section className="relative py-16 px-4 text-center max-w-[460px] mx-auto space-y-10 overflow-hidden">
      {/* Title */}
      <div className="space-y-2">
        <ScrollReveal animation="fade-down" delay={100} duration={1200}>
          <div className="inline-block px-3 py-1 rounded-full bg-[#E8D8BD]/40 text-[#B89B63] text-[11px] font-sans uppercase tracking-[3px] font-semibold">
            Kisah Kami
          </div>
          <h2 className="text-[36px] sm:text-[42px] text-[#3A302B] font-serif font-normal leading-tight mt-1">
            Kisah Perjalanan Kami
          </h2>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={250} duration={1200}>
          <p className="text-[13px] sm:text-[14px] text-[#70635C] italic max-w-xs mx-auto font-serif">
            Setiap lembaran cerita mempertemukan dua insan hingga menyatu dalam satu ikatan suci.
          </p>
        </ScrollReveal>
      </div>

      {/* Timeline items with progressive 1200ms scroll reveal */}
      <div className="space-y-6 text-left">
        {wedding.loveStories.map((story: LoveStoryItem, index: number) => (
          <ScrollReveal
            key={story.id || index}
            animation="fade-up"
            delay={150}
            duration={1200}
            className="w-full"
          >
            <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-xs border border-[#E8D8BD] shadow-[0_8px_30px_rgba(58,48,43,0.05)] space-y-4 transition-transform hover:scale-[1.01]">
              {/* Photo preview */}
              {story.imageUrl && (
                <div className="w-full h-48 sm:h-56 overflow-hidden rounded-2xl border border-[#E8D8BD]/60">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="space-y-2 pt-1">
                <span className="inline-block px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#B89B63]/40 text-[11px] font-semibold text-[#B89B63] uppercase tracking-[2px] font-sans">
                  {story.storyDate}
                </span>

                <h3 className="text-[22px] sm:text-[24px] text-[#3A302B] font-serif font-normal">
                  {story.title}
                </h3>

                <p className="text-[13px] text-[#70635C] leading-relaxed pt-1 font-sans">
                  {story.description}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};
