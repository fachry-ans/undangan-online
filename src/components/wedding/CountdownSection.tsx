import React, { useState, useEffect } from 'react';
import { CalendarPlus } from 'lucide-react';
import { WeddingData } from '../../types/wedding';
import { ScrollReveal } from '../common/ScrollReveal';
import { formatWeddingDate, getWeddingCalendarUrl } from '../../utils/weddingDate';

interface CountdownSectionProps {
  wedding: WeddingData;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const CountdownSection: React.FC<CountdownSectionProps> = ({ wedding }) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const targetDate = new Date(wedding.weddingDate).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [wedding.weddingDate]);

  const handleAddToCalendar = () => {
    window.open(getWeddingCalendarUrl(wedding), '_blank');
  };

  return (
    <section className="relative py-18 px-4 text-center max-w-[460px] mx-auto overflow-hidden">
      {/* Background with soft luxury gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F3EFE6]/50 via-white/80 to-[#F3EFE6]/50 pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <ScrollReveal animation="fade-down" delay={100} duration={1200}>
            <div className="inline-block px-3 py-1 rounded-full bg-[#E8D8BD]/40 text-[#B89B63] text-[11px] font-sans uppercase tracking-[3px] font-semibold">
              Menghitung Hari Bahagia
            </div>
          </ScrollReveal>

          <ScrollReveal animation="zoom-in" delay={250} duration={1200}>
            <h2 className="text-[34px] sm:text-[40px] text-[#3A302B] font-serif font-normal leading-tight">
              Waktu Menuju Janji Suci
            </h2>
          </ScrollReveal>
        </div>

        {/* 4 Countdown Units matching modern luxury aesthetic */}
        <ScrollReveal animation="fade-up" delay={450} duration={1200}>
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 max-w-sm mx-auto">
            {[
              { label: 'HARI', value: timeLeft.days },
              { label: 'JAM', value: timeLeft.hours },
              { label: 'MENIT', value: timeLeft.minutes },
              { label: 'DETIK', value: timeLeft.seconds },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-white/95 border border-[#E8D8BD] shadow-[0_8px_25px_rgba(58,48,43,0.06)]"
              >
                <span className="text-[26px] sm:text-[32px] font-serif font-semibold text-[#3A302B] leading-none mb-1">
                  {timeLeft.isExpired ? '0' : String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] tracking-[1.5px] font-semibold text-[#B89B63] font-sans">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Calendar button */}
        <ScrollReveal animation="fade-up" delay={650} duration={1200}>
          <div className="pt-2">
            <button
              onClick={handleAddToCalendar}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-[12px] uppercase tracking-[1.5px] font-semibold shadow-md btn-luxury-gradient hover:scale-105 active:scale-95 transition-all cursor-pointer font-sans"
            >
              <CalendarPlus className="w-4 h-4 text-[#FAF7F0]" />
              <span>Simpan Tanggal</span>
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
