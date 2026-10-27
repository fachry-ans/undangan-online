import React, { useState, useEffect } from 'react';
import { WeddingData } from './types/wedding';
import { WeddingService, applyTheme } from './services/weddingService';

// Wedding Public Sections
import { WeddingCover } from './components/wedding/WeddingCover';
import { WeddingHero } from './components/wedding/WeddingHero';
import { QuoteSection } from './components/wedding/QuoteSection';
import { CoupleSection } from './components/wedding/CoupleSection';
import { CountdownSection } from './components/wedding/CountdownSection';
import { EventSection } from './components/wedding/EventSection';
import { LoveStorySection } from './components/wedding/LoveStorySection';
import { GallerySection } from './components/wedding/GallerySection';
import { WeddingGiftSection } from './components/wedding/WeddingGiftSection';
import { RSVPSection } from './components/wedding/RSVPSection';
import { GuestbookSection } from './components/wedding/GuestbookSection';
import { ClosingSection } from './components/wedding/ClosingSection';
import { MusicPlayer } from './components/wedding/MusicPlayer';

// Admin Console
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Shield } from 'lucide-react';

export default function App() {
  const [wedding, setWedding] = useState<WeddingData>(() => WeddingService.getWedding('abdi-lula'));
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [guestName, setGuestName] = useState('Abdi Indodana');
  const [isAdminView, setIsAdminView] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Parse guest name from URL query: ?to=Abdi+Indodana
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const toParam = urlParams.get('to');
    const viewParam = urlParams.get('view');
    const path = window.location.pathname;

    if (viewParam === 'admin' || path.startsWith('/admin')) {
      setIsAdminView(true);
    }

    if (toParam) {
      const decoded = decodeURIComponent(toParam.replace(/\+/g, ' ')).trim();
      if (decoded) {
        setGuestName(decoded);
      }
    }

    applyTheme(wedding.theme);
    WeddingService.incrementViews(wedding.id);
  }, [wedding.id, wedding.theme]);

  // Lock scroll when cover is closed
  useEffect(() => {
    if (!isCoverOpen && !isAdminView) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
    };
  }, [isCoverOpen, isAdminView]);

  const handleOpenInvitation = () => {
    setIsCoverOpen(true);
  };

  const handleRSVPSubmitted = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handlePreviewAsGuest = (name: string) => {
    setGuestName(name);
    setIsAdminView(false);
    setIsCoverOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.set('to', name);
    url.searchParams.delete('view');
    window.history.pushState({}, '', url.toString());
  };

  if (isAdminView) {
    return (
      <AdminDashboard
        onBackToInvitation={() => {
          setIsAdminView(false);
          const current = WeddingService.getWedding(wedding.slug);
          setWedding(current);
          applyTheme(current.theme);
        }}
        onPreviewGuest={handlePreviewAsGuest}
      />
    );
  }

  return (
    <div className="min-h-screen w-full relative bg-[#1E1815] bg-radial from-[#2A221E] to-[#140F0D]">
      {/* 1. Fullscreen / Centered Opening Cover */}
      <WeddingCover
        wedding={wedding}
        guestName={guestName}
        isOpen={isCoverOpen}
        onOpen={handleOpenInvitation}
      />

      {/* 500px Center Mobile-First Container with modern luxury styling */}
      <div className="w-full max-w-[500px] mx-auto min-h-screen bg-[#FAF7F0] shadow-[0_0_80px_rgba(0,0,0,0.45)] relative overflow-x-hidden border-x border-[#E8D8BD]/50">
        {/* 2. Main Hero Section (Kembar Mayang, The Wedding Of, Rara & Benno, Arched Slideshow) */}
        <WeddingHero wedding={wedding} />

        {/* 3. Quote Section (Bunga ornament, WE FOUND LOVE, QS. Ar-Rum: 21) */}
        <QuoteSection wedding={wedding} />

        {/* 4. Groom & Bride Section (Benno Ramadhan & Rara Kirana, Arched portraits, &) */}
        <CoupleSection wedding={wedding} />

        {/* 5. Countdown Section (Counting background, Save the date, 4 boxes, divider, calendar) */}
        <CountdownSection wedding={wedding} />

        {/* 6. Wedding Event Agenda (Akad Nikah & Resepsi with Malang venue & Open Maps) */}
        <EventSection wedding={wedding} />

        {/* 7. Love Story Timeline */}
        <LoveStorySection wedding={wedding} />

        {/* 8. Photo Gallery & Lightbox */}
        <GallerySection wedding={wedding} />

        {/* 9. Wedding Gift (Klik di sini button toggling #amplop with BCA & Mandiri) */}
        <WeddingGiftSection wedding={wedding} />

        {/* 10. RSVP Confirmation Form */}
        <RSVPSection
          wedding={wedding}
          initialGuestName={guestName !== 'Tamu Undangan' ? guestName : ''}
          onRSVPSubmitted={handleRSVPSubmitted}
        />

        {/* 11. Guestbook & Best Wishes (Hadir/Tidak/Ragu #632321 boxes & comments) */}
        <GuestbookSection
          wedding={wedding}
          initialGuestName={guestName !== 'Tamu Undangan' ? guestName : ''}
          refreshTrigger={refreshKey}
        />

        {/* 12. Footer & Closing Blessing (Gunungan Wayang Jawa & Leafitation credits) */}
        <ClosingSection wedding={wedding} />

        {/* 13. Floating Music Player (Kusuma Wijaya track & 4s spin animation) */}
        {isCoverOpen && (
          <MusicPlayer
            customAudioUrl="/audio/kusuma-wijaya.mp3"
            autoplay={true}
          />
        )}

        {/* Discreet Floating Admin Navigation Button */}
        <div className="fixed bottom-5 left-5 z-40">
          <button
            onClick={() => setIsAdminView(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/80 hover:bg-stone-900 text-stone-200 text-xs font-mono backdrop-blur-md border border-stone-700 shadow-lg transition-all hover:scale-105 cursor-pointer"
            title="Buka Admin Dashboard untuk mengelola data & tamu"
          >
            <Shield className="w-3.5 h-3.5 text-[#C6A87A]" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}
