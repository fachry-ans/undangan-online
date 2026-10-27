import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, HelpCircle, XCircle, MessageSquareQuote } from 'lucide-react';
import { WeddingData, WishRecord, RSVPRecord } from '../../types/wedding';
import { WeddingService } from '../../services/weddingService';
import { ScrollReveal } from '../common/ScrollReveal';

interface GuestbookSectionProps {
  wedding: WeddingData;
  initialGuestName?: string;
  refreshTrigger?: number;
}

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({
  wedding,
  initialGuestName = '',
  refreshTrigger = 0,
}) => {
  const [wishes, setWishes] = useState<WishRecord[]>([]);
  const [rsvps, setRsvps] = useState<RSVPRecord[]>([]);
  const [name, setName] = useState(initialGuestName);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const loadData = () => {
    setWishes(WeddingService.getWishes(wedding.id));
    setRsvps(WeddingService.getRSVPs(wedding.id));
  };

  useEffect(() => {
    loadData();
  }, [wedding.id, refreshTrigger]);

  useEffect(() => {
    if (initialGuestName && !name) {
      setName(initialGuestName);
    }
  }, [initialGuestName, name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    WeddingService.submitWish({
      weddingId: wedding.id,
      guestName: name.trim(),
      attendance: 'hadir',
      message: message.trim(),
    });

    setMessage('');
    setIsSubmitting(false);
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 3500);
    loadData();
  };

  const hadirCount = rsvps.filter((r) => r.attendance === 'hadir').length;
  const tidakHadirCount = rsvps.filter((r) => r.attendance === 'tidak_hadir').length;
  const raguCount = rsvps.filter((r) => r.attendance === 'masih_ragu').length;

  return (
    <section className="relative py-16 px-4 text-center max-w-[460px] mx-auto space-y-6 overflow-hidden">
      {/* Title & Subtitle */}
      <ScrollReveal animation="fade-down" delay={100} duration={1200}>
        <div className="space-y-3 mb-6">
          <div className="inline-block px-3 py-1 rounded-full bg-[#E8D8BD]/40 text-[#B89B63] text-[11px] font-sans uppercase tracking-[3px] font-semibold">
            Buku Tamu
          </div>
          <h2 className="text-[36px] sm:text-[42px] text-[#3A302B] font-serif font-normal leading-tight mt-1">
            Best Wishes
          </h2>
          <p className="text-[13px] text-[#70635C] max-w-[340px] mx-auto font-sans leading-relaxed">
            Sampaikan doa dan ucapan terbaik Anda untuk kedua mempelai Abdi &amp; Lula
          </p>
        </div>
      </ScrollReveal>

      {/* Attendance Stats Cards */}
      <ScrollReveal animation="zoom-in" delay={200} duration={1200}>
        <div className="grid grid-cols-3 gap-2.5 max-w-[420px] mx-auto mb-6">
          <div className="bg-white/90 border border-[#E8D8BD] rounded-2xl py-3.5 px-2 shadow-xs flex flex-col items-center">
            <CheckCircle2 className="w-4 h-4 mb-1 text-emerald-600" />
            <span className="text-xl font-bold font-serif text-[#3A302B]">{hadirCount}</span>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-[#7D8B73] font-sans">Hadir</span>
          </div>
          <div className="bg-white/90 border border-[#E8D8BD] rounded-2xl py-3.5 px-2 shadow-xs flex flex-col items-center">
            <HelpCircle className="w-4 h-4 mb-1 text-amber-600" />
            <span className="text-xl font-bold font-serif text-[#3A302B]">{raguCount}</span>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-amber-700 font-sans">Ragu</span>
          </div>
          <div className="bg-white/90 border border-[#E8D8BD] rounded-2xl py-3.5 px-2 shadow-xs flex flex-col items-center">
            <XCircle className="w-4 h-4 mb-1 text-rose-500" />
            <span className="text-xl font-bold font-serif text-[#3A302B]">{tidakHadirCount}</span>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-rose-600 font-sans">Tidak Hadir</span>
          </div>
        </div>
      </ScrollReveal>

      {/* Wish Form */}
      <ScrollReveal animation="fade-up" delay={300} duration={1200}>
        <form
          onSubmit={handleSubmit}
          className="bg-white/95 p-6 rounded-3xl border border-[#E8D8BD] shadow-[0_10px_35px_rgba(58,48,43,0.06)] space-y-4 text-left max-w-[420px] mx-auto"
        >
          <div>
            <label className="block text-[11px] font-semibold text-[#3A302B] uppercase tracking-wider mb-1 font-sans">
              Nama Anda
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama Anda"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8D8BD] bg-[#FAF7F0]/60 text-[#3A302B] focus:outline-hidden focus:border-[#B89B63] focus:bg-white font-sans transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#3A302B] uppercase tracking-wider mb-1 font-sans">
              Doa &amp; Ucapan
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan ucapan dan doa restu untuk Abdi & Lula..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8D8BD] bg-[#FAF7F0]/60 text-[#3A302B] focus:outline-hidden focus:border-[#B89B63] focus:bg-white font-sans transition-all resize-none"
              required
            />
          </div>

          {submittedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] text-center font-sans font-medium">
              Terima kasih atas doa dan ucapan terbaiknya!
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 text-white rounded-full flex items-center justify-center gap-2 text-[12px] font-bold tracking-[2px] uppercase shadow-md transition-all btn-luxury-gradient cursor-pointer hover:scale-[1.02] active:scale-95 font-sans"
          >
            <Send className="w-3.5 h-3.5 text-[#FAF7F0]" />
            <span>{isSubmitting ? 'Mengirim...' : 'Kirim Ucapan & Doa'}</span>
          </button>
        </form>
      </ScrollReveal>

      {/* Wishes Feed */}
      <ScrollReveal animation="fade-up" delay={400} duration={1200}>
        <div className="max-w-[420px] mx-auto space-y-3 pt-3 text-left">
          <div className="flex items-center justify-between px-1">
            <span className="text-[12px] font-bold text-[#3A302B] tracking-wide font-sans flex items-center gap-1.5">
              <MessageSquareQuote className="w-4 h-4 text-[#B89B63]" />
              Doa Restu Sahabat ({wishes.length})
            </span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {wishes.length === 0 ? (
              <p className="text-center py-6 text-[12px] text-[#70635C] italic font-sans">
                Belum ada ucapan. Jadilah yang pertama memberikan doa restu!
              </p>
            ) : (
              wishes.map((w) => (
                <div
                  key={w.id}
                  className="bg-white/95 p-4 rounded-2xl border border-[#E8D8BD] shadow-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-[#3A302B] font-serif">
                      {w.guestName}
                    </span>
                    <span className="text-[10px] text-[#70635C] font-mono">
                      {new Date(w.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#554A43] leading-relaxed whitespace-pre-line font-sans">
                    {w.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};
