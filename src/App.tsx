import React, { useRef, useState, useEffect } from 'react';
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
import { MusicPlayer, MusicPlayerHandle } from './components/wedding/MusicPlayer';
import { SakuraPetals } from './components/common/SakuraPetals';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [wedding, setWedding] = useState<WeddingData>(() => WeddingService.getWedding('abdi-lula'));
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const [isAdminView, setIsAdminView] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [syncError, setSyncError] = useState('');
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);

  useEffect(() => {
    let active = true;
    if (WeddingService.isSharedDatabaseConfigured()) {
      WeddingService.initializeSharedData('abdi-lula')
        .then((sharedWedding) => {
          if (active) {
            setWedding(sharedWedding);
            setRefreshKey((previous) => previous + 1);
          }
        })
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : String(error);
          console.error('Unable to load shared wedding data:', error);
          if (active) setSyncError(message);
        });
    }

    const handleSyncError = (event: Event) => {
      const message = (event as CustomEvent<string>).detail;
      setSyncError(message || 'Google Sheets sync gagal. Periksa deployment dan koneksi.');
    };
    window.addEventListener('wedding-sync-error', handleSyncError);

    return () => {
      active = false;
      window.removeEventListener('wedding-sync-error', handleSyncError);
    };
  }, []);

  // Parse guest name from URL query: ?to=Abdi+Indodana
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const toParam = urlParams.get('to');

    if (toParam) {
      const decoded = decodeURIComponent(toParam.replace(/\+/g, ' ')).trim();
      if (decoded) {
        setGuestName(decoded);
      }
    }

    applyTheme(wedding.theme);
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
    const viewsCount = WeddingService.incrementViews(wedding.id);
    setWedding((current) => ({ ...current, viewsCount }));
    if (wedding.music.enabled && wedding.music.autoplayAfterOpen) {
      musicPlayerRef.current?.play();
    }
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

  const handleAdminAccess = async () => {
    if (!WeddingService.isSharedDatabaseConfigured()) {
      window.alert('Database Google Sheets belum dikonfigurasi. Isi VITE_GOOGLE_APPS_SCRIPT_URL terlebih dahulu.');
      return;
    }
    try {
      const currentWedding = await WeddingService.initializeSharedData(wedding.slug);
      setWedding(currentWedding);
      if (!WeddingService.hasSharedWedding()) {
        await WeddingService.syncLocalDataToSharedDatabase(wedding.slug);
        setWedding(WeddingService.getWedding(wedding.slug));
      }
      setSyncError('');
      setIsAdminView(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setSyncError(message);
      window.alert(`Gagal menghubungkan database: ${message}`);
    }
  };

  if (isAdminView) {
    return (
      <>
        {syncError && (
          <div role="alert" className="fixed top-3 left-3 right-3 z-[100] mx-auto max-w-xl rounded-xl bg-red-700 px-4 py-3 text-sm text-white shadow-lg">
            Google Sheets: {syncError}
            <button type="button" className="ml-3 font-bold underline" onClick={() => setSyncError('')}>Tutup</button>
          </div>
        )}
        <AdminDashboard
          onBackToInvitation={() => {
            setIsAdminView(false);
            const current = WeddingService.getWedding(wedding.slug);
            setWedding(current);
            applyTheme(current.theme);
          }}
          onPreviewGuest={handlePreviewAsGuest}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen w-full relative bg-[#1E1815] bg-radial from-[#2A221E] to-[#140F0D]">
      {syncError && (
        <div role="alert" className="fixed top-3 left-3 right-3 z-[100] mx-auto max-w-xl rounded-xl bg-red-700 px-4 py-3 text-sm text-white shadow-lg">
          Google Sheets: {syncError}
          <button type="button" className="ml-3 font-bold underline" onClick={() => setSyncError('')}>Tutup</button>
        </div>
      )}
      {/* 1. Fullscreen / Centered Opening Cover */}
      <WeddingCover
        wedding={wedding}
        guestName={guestName}
        isOpen={isCoverOpen}
        onOpen={handleOpenInvitation}
      />
      <SakuraPetals active={isCoverOpen && !isAdminView} />

      {/* 500px Center Mobile-First Container with modern luxury styling */}
      <div className="w-full max-w-[500px] mx-auto min-h-screen bg-[#FAF7F0] shadow-[0_0_80px_rgba(0,0,0,0.45)] relative overflow-x-hidden border-x border-[#E8D8BD]/50">
        {/* 2. Main Hero Section (Kembar Mayang, The Wedding Of, Rara & Benno, Arched Slideshow) */}
        <WeddingHero wedding={wedding} />

        {/* 3. Quote Section (Bunga ornament, WE FOUND LOVE, QS. Ar-Rum: 21) */}
        <QuoteSection wedding={wedding} />

        {/* 4. Groom & Bride Section (Benno Ramadhan & Rara Kirana, Arched portraits, &) */}
        <CoupleSection wedding={wedding} />

        {/* 5. Wedding Event Agenda (Akad Nikah & Resepsi with Malang venue & Open Maps) */}
        <EventSection wedding={wedding} />

        {/* 6. Countdown Section (Counting background, Save the date, 4 boxes, divider, calendar) */}
        <CountdownSection wedding={wedding} />

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
        <ClosingSection
          wedding={wedding}
          onAdminAccess={handleAdminAccess}
        />

        {/* 13. Floating Music Player (Kusuma Wijaya track & 4s spin animation) */}
        {wedding.music.enabled && (
          <MusicPlayer
            ref={musicPlayerRef}
            customAudioUrl={wedding.music.url || '/audio/kusuma-wijaya.mp3'}
          />
        )}

      </div>
    </div>
  );
}
