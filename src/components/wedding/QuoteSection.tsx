import React from 'react';
import { WeddingData } from '../../types/wedding';
import { ScrollReveal } from '../common/ScrollReveal';
import { OrnamentDivider } from './ornaments/OrnamentDivider';

interface QuoteSectionProps {
  wedding: WeddingData;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ wedding }) => {
  return (
    <section className="relative py-16 px-6 text-center max-w-[460px] mx-auto overflow-hidden">
      {/* Botanical divider */}
      <ScrollReveal animation="fade-down" delay={100} duration={1200}>
        <div className="w-24 mx-auto mb-2 goyang-1">
          <OrnamentDivider variant="leaves" color="#B89B63" />
        </div>
      </ScrollReveal>

      <div className="space-y-4">
        <ScrollReveal animation="fade-down" delay={250} duration={1200}>
          <h3 className="text-[12px] sm:text-[13px] font-semibold tracking-[3px] uppercase text-[#B89B63] font-sans">
            {wedding.quote.heading || 'WE FOUND LOVE'}
          </h3>
          {wedding.opening && (
            <>
              <h2 className="text-[26px] sm:text-[30px] text-[#3A302B] font-serif font-normal leading-tight mt-3">
                {wedding.opening.heading}
              </h2>
              <p className="text-[13px] text-[#70635C] leading-relaxed mt-3 font-sans">
                {wedding.opening.text}
              </p>
            </>
          )}
        </ScrollReveal>

        <ScrollReveal animation="blur-up" delay={450} duration={1200}>
          <blockquote className="text-[14px] sm:text-[15px] text-[#3A302B] leading-relaxed italic px-3 font-serif">
            “{wedding.quote.text}”
          </blockquote>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={650} duration={1200}>
          <p className="text-[12px] font-semibold tracking-wider text-[#70635C] font-sans pt-1">
            {wedding.quote.source}
          </p>
        </ScrollReveal>
      </div>

      <ScrollReveal animation="zoom-in" delay={800} duration={1200}>
        <div className="mt-6 flex justify-center">
          <OrnamentDivider variant="diamond" />
        </div>
      </ScrollReveal>
    </section>
  );
};
