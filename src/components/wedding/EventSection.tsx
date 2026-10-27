import React from 'react';
import { MapPin, Clock, Calendar } from 'lucide-react';
import { WeddingData, WeddingEvent } from '../../types/wedding';
import { ScrollReveal } from '../common/ScrollReveal';

interface EventSectionProps {
  wedding: WeddingData;
}

export const EventSection: React.FC<EventSectionProps> = ({ wedding }) => {
  return (
    <section className="relative py-16 px-4 text-center max-w-[460px] mx-auto space-y-10 overflow-hidden">
      {/* Title Block */}
      <div className="space-y-3">
        <ScrollReveal animation="fade-down" delay={100} duration={1200}>
          <div className="inline-block px-3 py-1 rounded-full bg-[#E8D8BD]/40 text-[#B89B63] text-[11px] font-sans uppercase tracking-[3px] font-semibold">
            Rangkaian Acara
          </div>
          <h2 className="text-[36px] sm:text-[42px] text-[#3A302B] font-serif font-normal leading-tight mt-1">
            Wedding Event
          </h2>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={250} duration={1200}>
          <p className="text-[13px] text-[#70635C] leading-relaxed max-w-sm mx-auto font-sans">
            Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara kami:
          </p>
        </ScrollReveal>
      </div>

      {/* Cards List */}
      <div className="space-y-8">
        {wedding.events.map((event: WeddingEvent, index: number) => {
          const isEven = index % 2 === 0;

          return (
            <ScrollReveal
              key={event.id || index}
              animation={isEven ? 'fade-right' : 'fade-left'}
              delay={200}
              duration={1200}
              className="w-full"
            >
              <div className="p-7 rounded-3xl bg-white/90 backdrop-blur-xs border border-[#E8D8BD] shadow-[0_10px_35px_rgba(58,48,43,0.06)] flex flex-col items-center space-y-5 transition-transform hover:scale-[1.01]">
                {/* Event Type Badge */}
                <div className="px-3.5 py-1 rounded-full bg-[#FAF7F0] border border-[#B89B63]/40 text-[#B89B63] text-[11px] font-sans uppercase tracking-[2.5px] font-semibold">
                  {event.type === 'akad' ? 'Akad Nikah' : 'Resepsi'}
                </div>

                <h3 className="text-[28px] sm:text-[32px] text-[#3A302B] font-serif font-normal">
                  {event.title}
                </h3>

                <div className="space-y-2 text-center w-full">
                  <div className="flex items-center justify-center gap-2 text-[#3A302B] text-[13px] font-sans font-semibold">
                    <Calendar className="w-4 h-4 text-[#B89B63]" />
                    <span>{event.date}</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[#70635C] text-[13px] font-sans font-medium">
                    <Clock className="w-4 h-4 text-[#B89B63]" />
                    <span>Pukul {event.startTime} - {event.endTime}</span>
                  </div>

                  <div className="pt-2 border-t border-[#E8D8BD]/60">
                    <p className="text-[15px] font-serif font-semibold text-[#3A302B]">
                      {event.venue}
                    </p>
                    <p className="text-[12px] text-[#70635C] leading-relaxed pt-1 max-w-xs mx-auto font-sans">
                      {event.address}
                    </p>
                  </div>
                </div>

                {/* Google Maps Button */}
                {event.mapsUrl && (
                  <div className="pt-2">
                    <a
                      href={event.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-[11px] font-sans uppercase tracking-[1.5px] font-semibold btn-luxury-gradient shadow-md transition-all hover:scale-105"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#FAF7F0]" />
                      <span>Petunjuk Lokasi Maps</span>
                    </a>
                  </div>
                )}
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};
