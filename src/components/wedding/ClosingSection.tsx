import React, { useState } from 'react';
import { Check, Copy, Heart, Share2, Sparkles, X } from 'lucide-react';
import { createPortal } from 'react-dom';
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
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyError, setCopyError] = useState('');
  const invitationPath = `${window.location.origin}${window.location.pathname}`;
  const invitationLink = guestName.trim()
    ? `${invitationPath}?to=${encodeURIComponent(guestName.trim())}`
    : invitationPath;
  const whatsappMessage = `Assalamu'alaikum, dengan penuh kebahagiaan kami mengundang Anda untuk hadir di pernikahan ${groomName} & ${brideName}. Silakan buka undangan berikut: ${invitationLink}`;

  const copyInvitationLink = async () => {
    try {
      await navigator.clipboard.writeText(invitationLink);
      setCopySuccess(true);
      setCopyError('');
      window.setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Unable to copy invitation link:', error);
      setCopyError('Tautan gagal disalin. Silakan salin dari kolom tautan.');
    }
  };

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
          <button
            type="button"
            onClick={() => setIsShareOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E8D8BD] px-3.5 py-2 text-xs text-[#70635C] transition-colors hover:bg-[#E8D8BD]/30 hover:text-[#3A302B]"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Bagikan</span>
          </button>
        </div>
      </ScrollReveal>
      {isShareOpen && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsShareOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-invitation-title"
            className="relative w-full max-w-md space-y-5 rounded-2xl bg-[#FAF7F0] p-6 text-left shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setIsShareOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-[#70635C] transition-colors hover:bg-[#E8D8BD]/50 hover:text-[#3A302B]"
              aria-label="Tutup modal"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3 pr-7">
              <div className="rounded-full bg-[#E8D8BD]/50 p-2.5 text-[#B89B63]">
                <Share2 className="h-5 w-5" />
              </div>
              <div>
                <h3 id="share-invitation-title" className="font-serif text-xl text-[#3A302B]">
                  Bagikan Undangan
                </h3>
                <p className="text-xs text-[#70635C]">
                  Buat tautan personalisasi untuk tamu kehormatan
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="share-guest-name" className="block text-xs font-medium text-[#3A302B]">
                Nama Tamu Undangan (Opsional)
              </label>
              <input
                id="share-guest-name"
                type="text"
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                placeholder="Contoh: Bpk. Bambang & Keluarga"
                className="w-full rounded-lg border border-[#E8D8BD] bg-white px-3 py-2.5 text-sm text-[#3A302B] outline-none focus:border-[#B89B63] focus:ring-2 focus:ring-[#B89B63]/20"
              />
              <p className="text-[11px] text-[#70635C]">
                Nama tamu akan tertera otomatis di cover undangan digital.
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="share-invitation-link" className="block text-xs font-medium text-[#3A302B]">
                Tautan Undangan
              </label>
              <div className="flex gap-2">
                <input
                  id="share-invitation-link"
                  type="text"
                  readOnly
                  value={invitationLink}
                  onFocus={(event) => event.currentTarget.select()}
                  className="min-w-0 flex-1 rounded-lg border border-[#E8D8BD] bg-white px-3 py-2 text-xs text-[#70635C] outline-none"
                />
                <button
                  type="button"
                  onClick={() => void copyInvitationLink()}
                  className="inline-flex shrink-0 items-center gap-1 rounded-md bg-[#B89B63] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#A1854F]"
                >
                  {copySuccess ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copySuccess ? 'Tersalin' : 'Salin'}
                </button>
              </div>
              {copyError && <p role="alert" className="text-xs text-red-700">{copyError}</p>}
            </div>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#20b858]"
            >
              <Share2 className="h-4 w-4" />
              Bagikan via WhatsApp
            </a>
          </section>
        </div>
      , document.body)}
    </footer>
  );
};
