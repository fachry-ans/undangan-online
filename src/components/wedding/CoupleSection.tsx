import React from 'react';
import { Instagram } from 'lucide-react';
import { WeddingData } from '../../types/wedding';
import { ScrollReveal } from '../common/ScrollReveal';

interface CoupleSectionProps {
  wedding: WeddingData;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({ wedding }) => {
  const { groom, bride } = wedding.couple;
  const coupleMembers = [
    { member: groom, label: 'Mempelai Pria', fallbackPhoto: '/images/groom.jpg' },
    { member: bride, label: 'Mempelai Wanita', fallbackPhoto: '/images/bride.jpg' },
  ];

  return (
    <section className="relative py-12 px-3 sm:px-4 text-center max-w-[460px] mx-auto space-y-7 overflow-hidden">
      {/* Title */}
      <div className="space-y-2">
        <ScrollReveal animation="fade-down" delay={100} duration={1200}>
          <div className="inline-block px-3 py-1 rounded-full bg-[#E8D8BD]/40 text-[#B89B63] text-[11px] font-sans uppercase tracking-[3px] font-semibold mb-1">
            Kedua Mempelai
          </div>
          <h2 className="text-[28px] sm:text-[36px] text-[#3A302B] font-serif font-normal leading-[1.05]">
            Mempelai Pria &amp; Wanita
          </h2>
        </ScrollReveal>
      </div>

      <div className="grid grid-cols-1">
        {coupleMembers.map(({ member, label, fallbackPhoto }, index) => (
          <React.Fragment key={label}>
            <ScrollReveal
              animation="fade-up"
              delay={200}
              duration={1200}
            >
              <article className="flex h-full flex-col items-center gap-3 rounded-2xl border border-[#E8D8BD]/80 bg-white/80 p-3 shadow-[0_10px_35px_rgba(58,48,43,0.05)] backdrop-blur-xs sm:gap-4 sm:p-5">
                <div className="h-64 w-full max-w-[220px] rounded-t-[500px] rounded-b-xl border-2 border-[#B89B63]/40 bg-[#FAF7F0] p-1 shadow-md sm:h-72 sm:max-w-[240px] sm:p-1.5">
                  <div className="h-full w-full overflow-hidden rounded-t-[490px] rounded-b-lg">
                    <img
                      src={member.photo || fallbackPhoto}
                      alt={member.fullName}
                      className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="w-full space-y-1">
                  <p className="text-[9px] font-semibold uppercase tracking-[1.5px] text-[#B89B63] font-sans sm:text-[10px]">
                    {label}
                  </p>
                  <h3 className="text-[22px] leading-tight text-[#3A302B] font-serif sm:text-[28px]">
                    {member.nickname}
                  </h3>
                  <p className="break-words text-[10px] font-semibold leading-snug text-[#B89B63] font-sans sm:text-[12px]">
                    {member.fullName}
                  </p>
                  <p className="break-words pt-1 text-[10px] leading-relaxed text-[#70635C] font-sans sm:text-[11px]">
                    {member.parents}
                  </p>
                </div>

                {member.instagram && (
                  <a
                    href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex max-w-full items-center gap-1 rounded-full px-2.5 py-1.5 text-[9px] font-semibold text-white btn-luxury-gradient shadow-md transition-transform hover:scale-105 font-sans sm:gap-1.5 sm:px-3 sm:text-[10px]"
                  >
                    <Instagram className="h-3 w-3 shrink-0" />
                    <span className="truncate">@{member.instagram.replace('@', '')}</span>
                  </a>
                )}
              </article>
            </ScrollReveal>
            {index === 0 && (
              <div className="flex items-center justify-center gap-4 py-2">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#B89B63]/60" />
                <span className="text-[32px] leading-none text-[#B89B63] font-serif">&amp;</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#B89B63]/60" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};
