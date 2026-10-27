import React, { useState, useEffect } from 'react';
import { CheckCircle2, UserCheck } from 'lucide-react';
import { WeddingData } from '../../types/wedding';
import { WeddingService } from '../../services/weddingService';
import { ScrollReveal } from '../common/ScrollReveal';

interface RSVPSectionProps {
  wedding: WeddingData;
  initialGuestName?: string;
  onRSVPSubmitted?: () => void;
}

export const RSVPSection: React.FC<RSVPSectionProps> = ({
  wedding,
  initialGuestName = '',
  onRSVPSubmitted,
}) => {
  const [name, setName] = useState(initialGuestName);
  const [attendance, setAttendance] = useState<'hadir' | 'tidak_hadir' | 'masih_ragu'>('hadir');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [city, setCity] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (initialGuestName && !name) {
      setName(initialGuestName);
    }
  }, [initialGuestName, name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      await WeddingService.submitRSVP({
        weddingId: wedding.id,
        name: name.trim(),
        attendance,
        guestCount: attendance === 'hadir' ? guestCount : 0,
        city: city.trim(),
      });

      setIsSuccess(true);
      if (onRSVPSubmitted) onRSVPSubmitted();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setSubmitError(`Konfirmasi belum tersimpan. ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-16 px-4 text-center max-w-[460px] mx-auto space-y-6 overflow-hidden">
      <div className="space-y-3">
        <ScrollReveal animation="fade-down" delay={100} duration={1200}>
          <div className="inline-block px-3 py-1 rounded-full bg-[#E8D8BD]/40 text-[#B89B63] text-[11px] font-sans uppercase tracking-[3px] font-semibold">
            Konfirmasi
          </div>
          <h2 className="text-[36px] sm:text-[42px] text-[#3A302B] font-serif font-normal leading-tight mt-1">
            RSVP Kehadiran
          </h2>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={250} duration={1200}>
          <p className="text-[13px] text-[#70635C] leading-relaxed max-w-sm mx-auto font-sans">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami atas kehadiran Anda untuk memberikan doa restu.
          </p>
        </ScrollReveal>
      </div>

      <ScrollReveal animation="fade-up" delay={350} duration={1200}>
        <div className="p-7 rounded-3xl bg-white/95 border border-[#E8D8BD] shadow-[0_10px_35px_rgba(58,48,43,0.06)] text-left">
          {isSuccess ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#B89B63] mx-auto animate-bounce" />
              <p className="text-[18px] font-serif font-semibold text-[#3A302B]">
                Terima Kasih Atas Konfirmasinya!
              </p>
              <p className="text-[13px] text-[#70635C] font-sans">
                Respon konfirmasi kehadiran Anda telah tercatat dengan baik.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="text-[12px] font-semibold text-[#B89B63] underline pt-2 cursor-pointer font-sans"
              >
                Ubah Konfirmasi
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-[#3A302B] block font-sans">
                  Nama Lengkap*
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Nama lengkap Anda"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D8BD] text-xs text-[#3A302B] bg-[#FAF7F0]/60 focus:outline-hidden focus:border-[#B89B63] focus:bg-white font-sans transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-[#3A302B] block font-sans">
                  Jumlah Kehadiran*
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D8BD] text-xs text-[#3A302B] bg-[#FAF7F0]/60 focus:outline-hidden focus:border-[#B89B63] focus:bg-white font-sans transition-all"
                >
                  <option value={1}>1 Orang</option>
                  <option value={2}>2 Orang</option>
                  <option value={3}>3 Orang</option>
                  <option value={4}>4 Orang</option>
                </select>
                <p className="text-[11px] text-[#70635C] font-sans">
                  (Maksimal 4 orang per undangan)
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-[#3A302B] block font-sans">
                  Alamat / Domisili Kota
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Contoh: Jakarta Selatan / Jakarta Pusat"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D8BD] text-xs text-[#3A302B] bg-[#FAF7F0]/60 focus:outline-hidden focus:border-[#B89B63] focus:bg-white font-sans transition-all"
                />
              </div>

              <div className="space-y-2 pt-1">
                <label className="text-[12px] font-semibold text-[#3A302B] block font-sans">
                  Konfirmasi Kehadiran
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { key: 'hadir', label: 'Hadir' },
                    { key: 'tidak_hadir', label: 'Tidak Hadir' },
                    { key: 'masih_ragu', label: 'Masih Ragu' },
                  ].map((opt) => (
                    <label
                      key={opt.key}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border cursor-pointer transition-all ${
                        attendance === opt.key
                          ? 'bg-[#B89B63] text-white border-[#B89B63] shadow-xs'
                          : 'bg-[#FAF7F0]/60 text-[#70635C] border-[#E8D8BD] hover:bg-[#FAF7F0]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="attendance"
                        value={opt.key}
                        checked={attendance === opt.key}
                        onChange={() => setAttendance(opt.key as any)}
                        className="sr-only"
                      />
                      <span className="font-semibold text-[11px] text-center font-sans">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                {submitError && <p role="alert" className="mb-3 text-xs text-red-700">{submitError}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-full text-white text-[12px] font-bold uppercase tracking-[2px] shadow-md hover:shadow-lg transition-all btn-luxury-gradient cursor-pointer hover:scale-[1.02] active:scale-95 font-sans disabled:opacity-60"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Kirim Konfirmasi RSVP'}
                </button>
              </div>
            </form>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
};
