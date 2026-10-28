import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  Heart,
  Image as ImageIcon,
  Gift,
  Settings,
  Share2,
  Copy,
  Check,
  Eye,
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  MessageSquare,
  Palette,
  ExternalLink,
  Download,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  WeddingData,
  GuestRecord,
  RSVPRecord,
  WishRecord,
  WeddingEvent,
  LoveStoryItem,
  GalleryItem,
  BankAccount,
} from '../../types/wedding';
import { WeddingService, applyTheme, generateInvitationLink } from '../../services/weddingService';
import { THEME_PRESETS } from '../../data/defaultWedding';

interface AdminDashboardProps {
  onBackToInvitation: () => void;
  onPreviewGuest: (guestName: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToInvitation,
  onPreviewGuest,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'share' | 'general' | 'couple' | 'events' | 'story' | 'gallery' | 'gifts' | 'guests' | 'rsvps' | 'wishes' | 'theme'
  >('overview');

  const [wedding, setWedding] = useState<WeddingData>(() => WeddingService.getWedding('abdi-lula'));
  const [guests, setGuests] = useState<GuestRecord[]>([]);
  const [rsvps, setRsvps] = useState<RSVPRecord[]>([]);
  const [wishes, setWishes] = useState<WishRecord[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedLinkIndex, setCopiedLinkIndex] = useState<string | null>(null);
  const [shareGuestName, setShareGuestName] = useState('');
  const [shareCopied, setShareCopied] = useState(false);
  const [shareError, setShareError] = useState('');

  // New Guest Form State
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestGroup, setNewGuestGroup] = useState('Sahabat');
  const [newGuestMax, setNewGuestMax] = useState(2);

  // New Event Form State
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState<'akad' | 'resepsi' | 'ceremony' | 'party'>('akad');
  const [newEventDate, setNewEventDate] = useState('Minggu, 27 Desember 2026');
  const [newEventStartTime, setNewEventStartTime] = useState('09:00');
  const [newEventEndTime, setNewEventEndTime] = useState('10:00 WIB');
  const [newEventVenue, setNewEventVenue] = useState('Kediaman mempelai wanita');
  const [newEventAddress, setNewEventAddress] = useState('Jl. Poncol Indah IV No.81 Rt 02/02 Cireundeu, Ciputat Timur, Tangerang Selatan, Banten');
  const [newEventMapsUrl, setNewEventMapsUrl] = useState('https://maps.app.goo.gl/iTjm1YrjLN6HBwPg6?g_st=ic');

  // New Story Form State
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [newStoryDate, setNewStoryDate] = useState('2024');
  const [newStoryDesc, setNewStoryDesc] = useState('');
  const [newStoryImage, setNewStoryImage] = useState('/images/Galeri-1.jpg');

  // New Gallery Photo State
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState('/images/gallery-exact-1.jpg');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');

  // New Bank Account State
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [newBankName, setNewBankName] = useState('BCA');
  const [newBankNumber, setNewBankNumber] = useState('');
  const [newBankHolder, setNewBankHolder] = useState('Muhammad Fauzi Abdi');

  // Preview Guest Name
  const [previewGuestInput, setPreviewGuestInput] = useState('Tamu Undangan');

  const refreshData = () => {
    const current = WeddingService.getWedding(wedding.slug);
    setWedding(current);
    setGuests(WeddingService.getGuests(current.id));
    setRsvps(WeddingService.getRSVPs(current.id));
    setWishes(WeddingService.getWishes(current.id));
  };

  const copyShareLink = async () => {
    const link = generateInvitationLink(shareGuestName);
    try {
      await navigator.clipboard.writeText(link);
      setShareCopied(true);
      setShareError('');
      window.setTimeout(() => setShareCopied(false), 2000);
    } catch (error) {
      console.error('Unable to copy invitation link:', error);
      setShareCopied(false);
      setShareError(`Tautan gagal disalin. Salin secara manual: ${link}`);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleSaveWedding = () => {
    WeddingService.saveWedding(wedding);
    applyTheme(wedding.theme);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    const newGuest: GuestRecord = {
      id: `guest-${Date.now()}`,
      weddingId: wedding.id,
      name: newGuestName.trim(),
      phone: newGuestPhone.trim() || undefined,
      groupName: newGuestGroup.trim(),
      maxAttendance: newGuestMax,
      invitationStatus: 'sent',
      rsvpStatus: 'pending',
    };

    WeddingService.saveGuest(newGuest);
    setShowAddGuestModal(false);
    setNewGuestName('');
    setNewGuestPhone('');
    refreshData();
  };

  const handleDeleteGuest = (id: string) => {
    WeddingService.deleteGuest(id);
    refreshData();
  };

  const handleDeleteWish = (id: string) => {
    WeddingService.deleteWish(id);
    refreshData();
  };

  // Add Event
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newEvent: WeddingEvent = {
      id: `event-${Date.now()}`,
      type: newEventType,
      title: newEventTitle.trim(),
      date: newEventDate.trim(),
      startTime: newEventStartTime.trim(),
      endTime: newEventEndTime.trim(),
      timezone: 'WIB',
      venue: newEventVenue.trim(),
      address: newEventAddress.trim(),
      mapsUrl: newEventMapsUrl.trim(),
    };

    const updated = {
      ...wedding,
      events: [...wedding.events, newEvent],
    };
    setWedding(updated);
    WeddingService.saveWedding(updated);
    setShowAddEventModal(false);
    setNewEventTitle('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDeleteEvent = (id: string) => {
    const updated = {
      ...wedding,
      events: wedding.events.filter((ev) => ev.id !== id),
    };
    setWedding(updated);
    WeddingService.saveWedding(updated);
  };

  // Add Love Story
  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryTitle.trim()) return;

    const newStory: LoveStoryItem = {
      id: `story-${Date.now()}`,
      title: newStoryTitle.trim(),
      storyDate: newStoryDate.trim(),
      description: newStoryDesc.trim(),
      imageUrl: newStoryImage.trim(),
    };

    const updated = {
      ...wedding,
      loveStories: [...(wedding.loveStories || []), newStory],
    };
    setWedding(updated);
    WeddingService.saveWedding(updated);
    setShowAddStoryModal(false);
    setNewStoryTitle('');
    setNewStoryDesc('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDeleteStory = (id: string) => {
    const updated = {
      ...wedding,
      loveStories: (wedding.loveStories || []).filter((s) => s.id !== id),
    };
    setWedding(updated);
    WeddingService.saveWedding(updated);
  };

  // Add Gallery Photo
  const handleAddGalleryPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryUrl.trim()) return;

    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      mediaType: 'image',
      url: newGalleryUrl.trim(),
      caption: newGalleryCaption.trim() || undefined,
    };

    const updated = {
      ...wedding,
      gallery: [...wedding.gallery, newItem],
    };
    setWedding(updated);
    WeddingService.saveWedding(updated);
    setShowAddGalleryModal(false);
    setNewGalleryCaption('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDeleteGallery = (id: string) => {
    const updated = {
      ...wedding,
      gallery: wedding.gallery.filter((g) => g.id !== id),
    };
    setWedding(updated);
    WeddingService.saveWedding(updated);
  };

  // Add Bank Account
  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankNumber.trim()) return;

    const newBank: BankAccount = {
      id: `bank-${Date.now()}`,
      bankName: newBankName.trim(),
      accountNumber: newBankNumber.trim(),
      accountHolder: newBankHolder.trim(),
    };

    const updated = {
      ...wedding,
      bankAccounts: [...(wedding.bankAccounts || []), newBank],
    };
    setWedding(updated);
    WeddingService.saveWedding(updated);
    setShowAddBankModal(false);
    setNewBankNumber('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDeleteBank = (id: string) => {
    const updated = {
      ...wedding,
      bankAccounts: (wedding.bankAccounts || []).filter((b) => b.id !== id),
    };
    setWedding(updated);
    WeddingService.saveWedding(updated);
  };

  const copyGuestLink = async (guestName: string, id: string) => {
    const link = generateInvitationLink(guestName);
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLinkIndex(id);
      setTimeout(() => setCopiedLinkIndex(null), 2000);
    } catch (error) {
      console.error('Unable to copy guest invitation link:', error);
      window.alert(`Gagal menyalin tautan. Silakan salin secara manual:\n${link}`);
    }
  };

  const sendWhatsApp = (guest: GuestRecord) => {
    const msg = WeddingService.generateWhatsAppMessage(guest.name);
    const phone = guest.phone ? guest.phone.replace(/[^0-9]/g, '') : '';
    const cleanPhone = phone.startsWith('0') ? '62' + phone.substring(1) : phone;
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // Export RSVP to CSV
  const exportRSVPToCSV = () => {
    const headers = ['Nama', 'Kehadiran', 'Jumlah Tamu', 'Domisili', 'Tanggal'];
    const rows = rsvps.map((r) => [
      `"${r.name}"`,
      r.attendance,
      r.guestCount,
      `"${r.city || '-'}"`,
      new Date(r.createdAt).toLocaleString('id-ID'),
    ]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rsvp-${wedding.slug}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats calculation
  const totalHadir = rsvps
    .filter((r) => r.attendance === 'hadir')
    .reduce((sum, r) => sum + (r.guestCount || 1), 0);
  const totalTidakHadir = rsvps.filter((r) => r.attendance === 'tidak_hadir').length;
  const totalRagu = rsvps.filter((r) => r.attendance === 'masih_ragu').length;

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-stone-900 text-stone-200 flex flex-col justify-between p-4 shrink-0 shadow-xl">
        <div className="space-y-6">
          <div className="px-2 py-3 border-b border-stone-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] tracking-widest uppercase font-mono text-[#C6A87A]">
                WEDDING MANAGEMENT
              </span>
              <h2 className="font-serif text-xl font-bold text-white tracking-wide">
                Admin Panel
              </h2>
            </div>
            <button
              onClick={onBackToInvitation}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center gap-1 cursor-pointer transition-colors"
              title="Kembali ke Undangan"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1 text-xs font-medium">
            {[
              { id: 'overview', label: 'Dashboard & Statistik', icon: Eye },
              { id: 'share', label: 'Bagikan Undangan', icon: Share2 },
              { id: 'general', label: 'Informasi Umum', icon: Settings },
              { id: 'couple', label: 'Profil Pengantin', icon: Heart },
              { id: 'events', label: 'Jadwal Acara', icon: Calendar },
              { id: 'story', label: 'Love Story Timeline', icon: Sparkles },
              { id: 'gallery', label: 'Galeri Foto', icon: ImageIcon },
              { id: 'gifts', label: 'Rekening & Kado', icon: Gift },
              { id: 'guests', label: 'Manajemen Tamu (URL/WA)', icon: Users },
              { id: 'rsvps', label: 'Konfirmasi RSVP', icon: Check },
              { id: 'wishes', label: 'Buku Tamu / Doa', icon: MessageSquare },
              { id: 'theme', label: 'Tema & Warna', icon: Palette },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#B08A5B] text-white font-semibold shadow-sm'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Quick Action */}
        <div className="pt-4 border-t border-stone-800 space-y-2">
          <div className="p-2.5 rounded-xl bg-stone-800/80 text-[11px] space-y-1">
            <span className="text-stone-400 block font-mono text-[9px] uppercase tracking-wider">
              Preview Tamu
            </span>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={previewGuestInput}
                onChange={(e) => setPreviewGuestInput(e.target.value)}
                placeholder="Nama Tamu"
                className="w-full px-2 py-1 rounded bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:outline-hidden"
              />
              <button
                onClick={() => onPreviewGuest(previewGuestInput)}
                className="px-2 py-1 rounded bg-[#B08A5B] text-white hover:bg-[#8C6A40] text-xs shrink-0 cursor-pointer"
                title="Buka Undangan sebagai tamu ini"
              >
                Lihat
              </button>
            </div>
          </div>

          <button
            onClick={onBackToInvitation}
            className="w-full py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#B08A5B]" />
            <span>Lihat Undangan Publik</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto w-full overflow-y-auto">
        {/* Top bar with save status */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-stone-200">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-[#B08A5B]">
              ADMIN CONSOLE
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              {wedding.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                Tersimpan!
              </span>
            )}
            <button
              onClick={handleSaveWedding}
              className="px-5 py-2.5 rounded-xl bg-[#B08A5B] hover:bg-[#8C6A40] text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <span className="text-xs text-stone-500 uppercase tracking-wider block">
                  Total Pengunjung
                </span>
                <span className="text-3xl font-serif font-bold text-stone-900 mt-1 block">
                  {wedding.viewsCount ?? 0}
                </span>
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Hits pada halaman undangan
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <span className="text-xs text-stone-500 uppercase tracking-wider block">
                  Estimasi Hadir
                </span>
                <span className="text-3xl font-serif font-bold text-emerald-700 mt-1 block">
                  {totalHadir} Tamu
                </span>
                <span className="text-[11px] text-stone-400 mt-1 block">
                  {rsvps.filter((r) => r.attendance === 'hadir').length} formulir konfirmasi
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <span className="text-xs text-stone-500 uppercase tracking-wider block">
                  Tidak Hadir / Ragu
                </span>
                <span className="text-3xl font-serif font-bold text-amber-700 mt-1 block">
                  {totalTidakHadir} / {totalRagu}
                </span>
                <span className="text-[11px] text-stone-400 mt-1 block">
                  {totalTidakHadir + totalRagu} respon
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <span className="text-xs text-stone-500 uppercase tracking-wider block">
                  Doa &amp; Ucapan
                </span>
                <span className="text-3xl font-serif font-bold text-[#B08A5B] mt-1 block">
                  {wishes.length}
                </span>
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Pesan dalam buku tamu digital
                </span>
              </div>
            </div>

            {/* Quick Guest Preview & Share Generator */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Generate Link Undangan Khusus Tamu
              </h3>
              <p className="text-xs text-stone-600">
                Ketikkan nama tamu untuk menghasilkan tautan undangan instan dengan nama yang otomatis muncul saat undangan dibuka:
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={previewGuestInput}
                  onChange={(e) => setPreviewGuestInput(e.target.value)}
                  placeholder="Contoh: Nama tamu undangan"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B08A5B]"
                />
                <button
                  onClick={() => onPreviewGuest(previewGuestInput)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-medium cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Undangan</span>
                </button>
                <button
                  onClick={async () => {
                    const link = generateInvitationLink(previewGuestInput);
                    try {
                      await navigator.clipboard.writeText(link);
                      window.alert(`Tautan tersalin:\n${link}`);
                    } catch (error) {
                      console.error('Unable to copy invitation preview link:', error);
                      window.alert(`Gagal menyalin tautan. Silakan salin secara manual:\n${link}`);
                    }
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#B08A5B] text-white hover:bg-[#8C6A40] text-xs font-medium cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>Salin Link</span>
                </button>
              </div>
            </div>

            {/* Recent RSVPs and Recent Wishes Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent RSVPs */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    RSVP Terbaru
                  </h3>
                  <button
                    onClick={() => setActiveTab('rsvps')}
                    className="text-xs text-[#B08A5B] hover:underline"
                  >
                    Lihat Semua ({rsvps.length})
                  </button>
                </div>
                <div className="space-y-3">
                  {rsvps.slice(0, 4).map((r) => (
                    <div
                      key={r.id}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-stone-900">{r.name}</p>
                        <p className="text-stone-500 text-[11px]">{r.city || 'Domisili tidak diisi'}</p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${
                          r.attendance === 'hadir'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.attendance === 'tidak_hadir'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.attendance === 'hadir'
                          ? `Hadir (${r.guestCount})`
                          : r.attendance === 'tidak_hadir'
                          ? 'Tidak Hadir'
                          : 'Ragu'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Wishes */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Doa &amp; Ucapan Terbaru
                  </h3>
                  <button
                    onClick={() => setActiveTab('wishes')}
                    className="text-xs text-[#B08A5B] hover:underline"
                  >
                    Lihat Semua ({wishes.length})
                  </button>
                </div>
                <div className="space-y-3">
                  {wishes.slice(0, 3).map((w) => (
                    <div key={w.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-stone-900">{w.guestName}</span>
                        <span className="text-stone-400 text-[10px]">
                          {new Date(w.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <p className="text-stone-700 italic line-clamp-2">"{w.message}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GENERAL SETTINGS */}
        {activeTab === 'share' && (
          <div className="max-w-3xl space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-5">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Bagikan Undangan
                </h3>
                <p className="mt-1 text-xs text-stone-600">
                  Buat tautan undangan personal untuk tamu, lalu salin atau kirim melalui WhatsApp.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="admin-share-guest-name" className="block text-xs font-medium text-stone-700">
                  Nama Tamu Undangan (Opsional)
                </label>
                <input
                  id="admin-share-guest-name"
                  type="text"
                  value={shareGuestName}
                  onChange={(event) => {
                    setShareGuestName(event.target.value);
                    setShareCopied(false);
                    setShareError('');
                  }}
                  placeholder="Contoh: Bpk. Bambang & Keluarga"
                  className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B08A5B]"
                />
                <p className="text-[11px] text-stone-500">
                  Nama tamu akan muncul otomatis di cover undangan.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="admin-share-link" className="block text-xs font-medium text-stone-700">
                  Tautan Undangan
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="admin-share-link"
                    type="text"
                    readOnly
                    value={generateInvitationLink(shareGuestName)}
                    onFocus={(event) => event.currentTarget.select()}
                    className="min-w-0 flex-1 px-3 py-2.5 rounded-lg border border-stone-300 bg-stone-50 text-xs text-stone-600"
                  />
                  <button
                    type="button"
                    onClick={() => void copyShareLink()}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#B08A5B] text-white hover:bg-[#8C6A40] text-xs font-medium cursor-pointer"
                  >
                    {shareCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{shareCopied ? 'Tersalin' : 'Salin Tautan'}</span>
                  </button>
                </div>
                {shareError && (
                  <p role="alert" className="break-all text-xs text-rose-700">
                    {shareError}
                  </p>
                )}
              </div>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(WeddingService.generateWhatsAppMessage(shareGuestName))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                <Share2 className="w-4 h-4" />
                Bagikan via WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* TAB 2: GENERAL SETTINGS */}
        {activeTab === 'general' && (
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-6">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Pengaturan Umum Undangan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-600 uppercase">
                  Judul Undangan
                </label>
                <input
                  type="text"
                  value={wedding.title}
                  onChange={(e) => setWedding({ ...wedding, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B08A5B]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-600 uppercase">
                  Slug URL (Contoh: rara-benno)
                </label>
                <input
                  type="text"
                  value={wedding.slug}
                  onChange={(e) => setWedding({ ...wedding, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B08A5B]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-600 uppercase">
                  Tanggal &amp; Waktu Utama (ISO)
                </label>
                <input
                  type="text"
                  value={wedding.weddingDate}
                  onChange={(e) => setWedding({ ...wedding, weddingDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B08A5B]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-600 uppercase">
                  Status Publikasi
                </label>
                <select
                  value={wedding.status}
                  onChange={(e) => setWedding({ ...wedding, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B08A5B]"
                >
                  <option value="published">Published (Dapat diakses publik)</option>
                  <option value="draft">Draft (Hanya admin)</option>
                  <option value="archived">Archived (Diarsipkan)</option>
                </select>
              </div>
            </div>

            {/* Quote Editor */}
            <div className="pt-4 border-t border-stone-200 space-y-4">
              <h4 className="font-semibold text-sm text-stone-900">Kutipan / Ayat Pernikahan</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-stone-600">Heading Kutipan</label>
                  <input
                    type="text"
                    value={wedding.quote.heading}
                    onChange={(e) =>
                      setWedding({
                        ...wedding,
                        quote: { ...wedding.quote, heading: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-stone-600">Sumber Kutipan</label>
                  <input
                    type="text"
                    value={wedding.quote.source}
                    onChange={(e) =>
                      setWedding({
                        ...wedding,
                        quote: { ...wedding.quote, source: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-stone-600">Isi Kutipan / Teks Doa</label>
                <textarea
                  rows={3}
                  value={wedding.quote.text}
                  onChange={(e) =>
                    setWedding({
                      ...wedding,
                      quote: { ...wedding.quote, text: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COUPLE PROFILES */}
        {activeTab === 'couple' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Groom */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-stone-900 border-b pb-2">
                Profil Mempelai Pria (The Groom)
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-stone-600 block">Nama Panggilan</label>
                  <input
                    type="text"
                    value={wedding.couple.groom.nickname}
                    onChange={(e) =>
                      setWedding({
                        ...wedding,
                        couple: {
                          ...wedding.couple,
                          groom: { ...wedding.couple.groom, nickname: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-600 block">Nama Lengkap &amp; Gelar</label>
                  <input
                    type="text"
                    value={wedding.couple.groom.fullName}
                    onChange={(e) =>
                      setWedding({
                        ...wedding,
                        couple: {
                          ...wedding.couple,
                          groom: { ...wedding.couple.groom, fullName: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-600 block">Keterangan Orang Tua</label>
                  <input
                    type="text"
                    value={wedding.couple.groom.parents}
                    onChange={(e) =>
                      setWedding({
                        ...wedding,
                        couple: {
                          ...wedding.couple,
                          groom: { ...wedding.couple.groom, parents: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-600 block">Username Instagram (tanpa @)</label>
                  <input
                    type="text"
                    value={wedding.couple.groom.instagram || ''}
                    onChange={(e) =>
                      setWedding({
                        ...wedding,
                        couple: {
                          ...wedding.couple,
                          groom: { ...wedding.couple.groom, instagram: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-600 block">URL Foto Groom</label>
                  <input
                    type="text"
                    value={wedding.couple.groom.photo}
                    onChange={(e) =>
                      setWedding({
                        ...wedding,
                        couple: {
                          ...wedding.couple,
                          groom: { ...wedding.couple.groom, photo: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Bride */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-stone-900 border-b pb-2">
                Profil Mempelai Wanita (The Bride)
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-stone-600 block">Nama Panggilan</label>
                  <input
                    type="text"
                    value={wedding.couple.bride.nickname}
                    onChange={(e) =>
                      setWedding({
                        ...wedding,
                        couple: {
                          ...wedding.couple,
                          bride: { ...wedding.couple.bride, nickname: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-600 block">Nama Lengkap &amp; Gelar</label>
                  <input
                    type="text"
                    value={wedding.couple.bride.fullName}
                    onChange={(e) =>
                      setWedding({
                        ...wedding,
                        couple: {
                          ...wedding.couple,
                          bride: { ...wedding.couple.bride, fullName: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-600 block">Keterangan Orang Tua</label>
                  <input
                    type="text"
                    value={wedding.couple.bride.parents}
                    onChange={(e) =>
                      setWedding({
                        ...wedding,
                        couple: {
                          ...wedding.couple,
                          bride: { ...wedding.couple.bride, parents: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-600 block">Username Instagram (tanpa @)</label>
                  <input
                    type="text"
                    value={wedding.couple.bride.instagram || ''}
                    onChange={(e) =>
                      setWedding({
                        ...wedding,
                        couple: {
                          ...wedding.couple,
                          bride: { ...wedding.couple.bride, instagram: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-600 block">URL Foto Bride</label>
                  <input
                    type="text"
                    value={wedding.couple.bride.photo}
                    onChange={(e) =>
                      setWedding({
                        ...wedding,
                        couple: {
                          ...wedding.couple,
                          bride: { ...wedding.couple.bride, photo: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: EVENTS (JADWAL ACARA) */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Jadwal Rangkaian Acara
                </h3>
                <p className="text-xs text-stone-600">
                  Kelola jadwal Akad Nikah, Resepsi, waktu mulai-selesai, lokasi, dan tautan Google Maps.
                </p>
              </div>
              <button
                onClick={() => setShowAddEventModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#B08A5B] hover:bg-[#8C6A40] text-white text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Acara Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wedding.events.map((ev, index) => (
                <div
                  key={ev.id || index}
                  className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-[#632321] text-white text-[10px] font-bold uppercase tracking-wider">
                        {ev.type}
                      </span>
                      <h4 className="font-serif text-base font-bold text-stone-900">{ev.title}</h4>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      title="Hapus Acara"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-500 block">Judul Acara</label>
                      <input
                        type="text"
                        value={ev.title}
                        onChange={(e) => {
                          const updated = [...wedding.events];
                          updated[index] = { ...ev, title: e.target.value };
                          setWedding({ ...wedding, events: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs mt-0.5"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-stone-500 block">Tanggal</label>
                        <input
                          type="text"
                          value={ev.date}
                          onChange={(e) => {
                            const updated = [...wedding.events];
                            updated[index] = { ...ev, date: e.target.value };
                            setWedding({ ...wedding, events: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs mt-0.5"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-stone-500 block">Jam / Waktu</label>
                        <input
                          type="text"
                          value={`${ev.startTime} - ${ev.endTime}`}
                          onChange={(e) => {
                            const updated = [...wedding.events];
                            const parts = e.target.value.split('-');
                            updated[index] = {
                              ...ev,
                              startTime: parts[0]?.trim() || '',
                              endTime: parts[1]?.trim() || '',
                            };
                            setWedding({ ...wedding, events: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs mt-0.5"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-stone-500 block">Nama Tempat (Venue)</label>
                      <input
                        type="text"
                        value={ev.venue}
                        onChange={(e) => {
                          const updated = [...wedding.events];
                          updated[index] = { ...ev, venue: e.target.value };
                          setWedding({ ...wedding, events: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs mt-0.5"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-stone-500 block">Alamat Lengkap</label>
                      <textarea
                        rows={2}
                        value={ev.address}
                        onChange={(e) => {
                          const updated = [...wedding.events];
                          updated[index] = { ...ev, address: e.target.value };
                          setWedding({ ...wedding, events: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs mt-0.5"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-stone-500 block">Link Google Maps</label>
                      <div className="flex gap-1.5 mt-0.5">
                        <input
                          type="text"
                          value={ev.mapsUrl}
                          onChange={(e) => {
                            const updated = [...wedding.events];
                            updated[index] = { ...ev, mapsUrl: e.target.value };
                            setWedding({ ...wedding, events: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-mono"
                        />
                        <a
                          href={ev.mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 shrink-0"
                          title="Buka Map"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Tambah Acara */}
            {showAddEventModal && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    Tambah Jadwal Acara Baru
                  </h3>
                  <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
                    <div>
                      <label className="text-stone-600 block mb-1">Judul Acara</label>
                      <input
                        type="text"
                        required
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        placeholder="Contoh: Resepsi Pernikahan"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-stone-600 block mb-1">Tipe Acara</label>
                      <select
                        value={newEventType}
                        onChange={(e) => setNewEventType(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                      >
                        <option value="akad">Akad Nikah</option>
                        <option value="resepsi">Resepsi</option>
                        <option value="ceremony">Ceremony / Pemberkatan</option>
                        <option value="party">After Party</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-stone-600 block mb-1">Jam Mulai</label>
                        <input
                          type="text"
                          value={newEventStartTime}
                          onChange={(e) => setNewEventStartTime(e.target.value)}
                          placeholder="08:00"
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-stone-600 block mb-1">Jam Selesai</label>
                        <input
                          type="text"
                          value={newEventEndTime}
                          onChange={(e) => setNewEventEndTime(e.target.value)}
                          placeholder="12:00 WIB"
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-stone-600 block mb-1">Nama Tempat (Venue)</label>
                      <input
                        type="text"
                        value={newEventVenue}
                        onChange={(e) => setNewEventVenue(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-stone-600 block mb-1">Alamat Lengkap</label>
                      <input
                        type="text"
                        value={newEventAddress}
                        onChange={(e) => setNewEventAddress(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-stone-600 block mb-1">Link Google Maps</label>
                      <input
                        type="url"
                        value={newEventMapsUrl}
                        onChange={(e) => setNewEventMapsUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-3">
                      <button
                        type="button"
                        onClick={() => setShowAddEventModal(false)}
                        className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-medium cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#B08A5B] hover:bg-[#8C6A40] text-white text-xs font-semibold cursor-pointer"
                      >
                        Simpan Acara
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: STORY (LOVE STORY TIMELINE) */}
        {activeTab === 'story' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Love Story Timeline
                </h3>
                <p className="text-xs text-stone-600">
                  Ceritakan perjalanan cinta kedua mempelai, dari awal bertemu hingga menuju pelaminan.
                </p>
              </div>
              <button
                onClick={() => setShowAddStoryModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#B08A5B] hover:bg-[#8C6A40] text-white text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Kisah</span>
              </button>
            </div>

            <div className="space-y-4">
              {(wedding.loveStories || []).map((story, index) => (
                <div
                  key={story.id || index}
                  className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-4 items-start"
                >
                  {story.imageUrl && (
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-stone-200"
                    />
                  )}
                  <div className="flex-1 space-y-2 w-full text-xs">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-[#B08A5B]/15 text-[#8C6A40] font-bold text-[10px]">
                        {story.storyDate}
                      </span>
                      <button
                        onClick={() => handleDeleteStory(story.id)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                        title="Hapus Cerita"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-stone-500 uppercase font-bold">Judul Kisah</label>
                        <input
                          type="text"
                          value={story.title}
                          onChange={(e) => {
                            const updated = [...(wedding.loveStories || [])];
                            updated[index] = { ...story, title: e.target.value };
                            setWedding({ ...wedding, loveStories: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-stone-500 uppercase font-bold">Waktu / Tahun</label>
                        <input
                          type="text"
                          value={story.storyDate}
                          onChange={(e) => {
                            const updated = [...(wedding.loveStories || [])];
                            updated[index] = { ...story, storyDate: e.target.value };
                            setWedding({ ...wedding, loveStories: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 uppercase font-bold">Deskripsi Cerita</label>
                      <textarea
                        rows={2}
                        value={story.description}
                        onChange={(e) => {
                          const updated = [...(wedding.loveStories || [])];
                          updated[index] = { ...story, description: e.target.value };
                          setWedding({ ...wedding, loveStories: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Tambah Story */}
            {showAddStoryModal && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    Tambah Babak Love Story
                  </h3>
                  <form onSubmit={handleAddStory} className="space-y-3 text-xs">
                    <div>
                      <label className="text-stone-600 block mb-1">Judul Momen</label>
                      <input
                        type="text"
                        required
                        value={newStoryTitle}
                        onChange={(e) => setNewStoryTitle(e.target.value)}
                        placeholder="Contoh: Awal Bertemu"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-stone-600 block mb-1">Tahun / Periode</label>
                      <input
                        type="text"
                        value={newStoryDate}
                        onChange={(e) => setNewStoryDate(e.target.value)}
                        placeholder="Contoh: 2021"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-stone-600 block mb-1">Cerita / Kisah</label>
                      <textarea
                        rows={3}
                        required
                        value={newStoryDesc}
                        onChange={(e) => setNewStoryDesc(e.target.value)}
                        placeholder="Tuliskan cerita singkat momen ini..."
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-stone-600 block mb-1">URL Foto Kenangan</label>
                      <input
                        type="text"
                        value={newStoryImage}
                        onChange={(e) => setNewStoryImage(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-mono text-xs"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-3">
                      <button
                        type="button"
                        onClick={() => setShowAddStoryModal(false)}
                        className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-medium cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#B08A5B] hover:bg-[#8C6A40] text-white text-xs font-semibold cursor-pointer"
                      >
                        Simpan Momen
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: GALLERY (GALERI FOTO) */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Galeri Foto Pengantin ({wedding.gallery.length} foto)
                </h3>
                <p className="text-xs text-stone-600">
                  Kelola foto pre-wedding, momen berharga, dan susunan gambar yang tampil pada undangan.
                </p>
              </div>
              <button
                onClick={() => setShowAddGalleryModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#B08A5B] hover:bg-[#8C6A40] text-white text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Foto Baru</span>
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {wedding.gallery.map((item, index) => (
                <div
                  key={item.id || index}
                  className="group relative rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-xs"
                >
                  <div className="aspect-3/4 w-full bg-stone-100 overflow-hidden relative">
                    <img
                      src={item.url}
                      alt={item.caption || `Galeri ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      onClick={() => handleDeleteGallery(item.id)}
                      className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-md transition-opacity cursor-pointer"
                      title="Hapus Foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-2.5">
                    <input
                      type="text"
                      value={item.caption || ''}
                      placeholder="Tulis caption foto..."
                      onChange={(e) => {
                        const updated = [...wedding.gallery];
                        updated[index] = { ...item, caption: e.target.value };
                        setWedding({ ...wedding, gallery: updated });
                      }}
                      className="w-full px-2 py-1 text-[11px] rounded border border-stone-200 text-stone-700"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Tambah Foto */}
            {showAddGalleryModal && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    Tambah Foto ke Galeri
                  </h3>
                  <form onSubmit={handleAddGalleryPhoto} className="space-y-3 text-xs">
                    <div>
                      <label className="text-stone-600 block mb-1">Pilih Asset Cepat:</label>
                      <div className="grid grid-cols-4 gap-2 mb-2">
                        {[
                          '/images/gallery-exact-1.jpg',
                          '/images/gallery-exact-2.jpg',
                          '/images/gallery-exact-3.jpg',
                          '/images/gallery-exact-4.jpg',
                          '/images/gallery-exact-5.jpg',
                          '/images/groom-exact.jpg',
                          '/images/bride-exact.jpg',
                          '/images/cover-exact.jpg',
                        ].map((src) => (
                          <button
                            key={src}
                            type="button"
                            onClick={() => setNewGalleryUrl(src)}
                            className={`rounded-lg overflow-hidden border-2 aspect-square cursor-pointer ${
                              newGalleryUrl === src ? 'border-[#B08A5B]' : 'border-stone-200'
                            }`}
                          >
                            <img src={src} alt="thumbnail" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-stone-600 block mb-1">Atau Masukkan URL Foto Custom</label>
                      <input
                        type="text"
                        required
                        value={newGalleryUrl}
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        placeholder="/images/foto.jpg atau https://..."
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-stone-600 block mb-1">Caption Foto (Opsional)</label>
                      <input
                        type="text"
                        value={newGalleryCaption}
                        onChange={(e) => setNewGalleryCaption(e.target.value)}
                        placeholder="Contoh: Pre-wedding Session in Bromo"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-3">
                      <button
                        type="button"
                        onClick={() => setShowAddGalleryModal(false)}
                        className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-medium cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#B08A5B] hover:bg-[#8C6A40] text-white text-xs font-semibold cursor-pointer"
                      >
                        Tambahkan Foto
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: GIFTS (REKENING BANK & ALAMAT KADO) */}
        {activeTab === 'gifts' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Rekening Bank &amp; Kado Cashless
                </h3>
                <p className="text-xs text-stone-600">
                  Kelola nomor rekening amplop digital (BCA, Mandiri, BRI, dll) serta alamat pengiriman kado fisik.
                </p>
              </div>
              <button
                onClick={() => setShowAddBankModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#B08A5B] hover:bg-[#8C6A40] text-white text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Rekening Baru</span>
              </button>
            </div>

            {/* Bank Accounts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(wedding.bankAccounts || []).map((bank, index) => (
                <div
                  key={bank.id || index}
                  className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-sm text-[#632321]">{bank.bankName}</span>
                    <button
                      onClick={() => handleDeleteBank(bank.id)}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                      title="Hapus Rekening"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[10px] text-stone-500 uppercase font-bold">Nama Bank</label>
                      <input
                        type="text"
                        value={bank.bankName}
                        onChange={(e) => {
                          const updated = [...(wedding.bankAccounts || [])];
                          updated[index] = { ...bank, bankName: e.target.value };
                          setWedding({ ...wedding, bankAccounts: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 uppercase font-bold">Nomor Rekening</label>
                      <input
                        type="text"
                        value={bank.accountNumber}
                        onChange={(e) => {
                          const updated = [...(wedding.bankAccounts || [])];
                          updated[index] = { ...bank, accountNumber: e.target.value };
                          setWedding({ ...wedding, bankAccounts: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 uppercase font-bold">Atas Nama (Pemilik)</label>
                      <input
                        type="text"
                        value={bank.accountHolder}
                        onChange={(e) => {
                          const updated = [...(wedding.bankAccounts || [])];
                          updated[index] = { ...bank, accountHolder: e.target.value };
                          setWedding({ ...wedding, bankAccounts: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Physical Gift Address */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
              <h4 className="font-serif text-lg font-bold text-stone-900 border-b pb-2">
                Alamat Pengiriman Kado Fisik
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-stone-600 block mb-1 font-semibold">Nama Penerima</label>
                  <input
                    type="text"
                    value={wedding.giftAddress?.recipient || ''}
                    onChange={(e) =>
                      setWedding({
                        ...wedding,
                        giftAddress: {
                          ...(wedding.giftAddress || { phone: '', address: '' }),
                          recipient: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="text-stone-600 block mb-1 font-semibold">Nomor Telepon Penerima</label>
                  <input
                    type="text"
                    value={wedding.giftAddress?.phone || ''}
                    onChange={(e) =>
                      setWedding({
                        ...wedding,
                        giftAddress: {
                          ...(wedding.giftAddress || { recipient: '', address: '' }),
                          phone: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
              </div>
              <div className="text-xs">
                <label className="text-stone-600 block mb-1 font-semibold">Alamat Lengkap Pengiriman</label>
                <textarea
                  rows={3}
                  value={wedding.giftAddress?.address || ''}
                  onChange={(e) =>
                    setWedding({
                      ...wedding,
                      giftAddress: {
                        ...(wedding.giftAddress || { recipient: '', phone: '' }),
                        address: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                />
              </div>
            </div>

            {/* Modal Tambah Bank */}
            {showAddBankModal && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    Tambah Rekening Bank
                  </h3>
                  <form onSubmit={handleAddBank} className="space-y-3 text-xs">
                    <div>
                      <label className="text-stone-600 block mb-1">Nama Bank</label>
                      <input
                        type="text"
                        required
                        value={newBankName}
                        onChange={(e) => setNewBankName(e.target.value)}
                        placeholder="BCA, Mandiri, BRI, BNI, dll"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-stone-600 block mb-1">Nomor Rekening</label>
                      <input
                        type="text"
                        required
                        value={newBankNumber}
                        onChange={(e) => setNewBankNumber(e.target.value)}
                        placeholder="Contoh: 1234567890"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-stone-600 block mb-1">Atas Nama (Pemilik)</label>
                      <input
                        type="text"
                        required
                        value={newBankHolder}
                        onChange={(e) => setNewBankHolder(e.target.value)}
                        placeholder="Contoh: Rara Kirana"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-3">
                      <button
                        type="button"
                        onClick={() => setShowAddBankModal(false)}
                        className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-medium cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#B08A5B] hover:bg-[#8C6A40] text-white text-xs font-semibold cursor-pointer"
                      >
                        Simpan Rekening
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: GUEST MANAGEMENT (URL & WHATSAPP) */}
        {activeTab === 'guests' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Daftar Tamu Undangan
                </h3>
                <p className="text-xs text-stone-600">
                  Kelola tamu, buat tautan personalisasi, dan bagikan undangan langsung via WhatsApp.
                </p>
              </div>
              <button
                onClick={() => setShowAddGuestModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#B08A5B] hover:bg-[#8C6A40] text-white text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Tamu Baru</span>
              </button>
            </div>

            {/* Guests Table */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                    <th className="pb-3">Nama Tamu</th>
                    <th className="pb-3">Grup</th>
                    <th className="pb-3">Nomor WhatsApp</th>
                    <th className="pb-3">Status RSVP</th>
                    <th className="pb-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {guests.map((g) => {
                    const isCopied = copiedLinkIndex === g.id;

                    return (
                      <tr key={g.id} className="hover:bg-stone-50/80">
                        <td className="py-3.5 font-medium text-stone-900">
                          {g.name}
                        </td>
                        <td className="py-3.5 text-stone-600">{g.groupName || '-'}</td>
                        <td className="py-3.5 font-mono text-stone-600">{g.phone || '-'}</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                              g.rsvpStatus === 'hadir'
                                ? 'bg-emerald-100 text-emerald-800'
                                : g.rsvpStatus === 'tidak_hadir'
                                ? 'bg-rose-100 text-rose-800'
                                : g.rsvpStatus === 'masih_ragu'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {g.rsvpStatus || 'Pending'}
                          </span>
                        </td>
                        <td className="py-3.5 text-right space-x-2">
                          <button
                            onClick={() => copyGuestLink(g.name, g.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] cursor-pointer"
                            title="Salin Link Undangan Khusus"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{isCopied ? 'Tersalin' : 'Link'}</span>
                          </button>
                          <button
                            onClick={() => sendWhatsApp(g)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] cursor-pointer"
                            title="Buka WhatsApp dengan Teks Undangan"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </button>
                          <button
                            onClick={() => handleDeleteGuest(g.id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="Hapus Tamu"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Add Guest Modal */}
            {showAddGuestModal && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    Tambah Tamu Undangan
                  </h3>
                  <form onSubmit={handleAddGuest} className="space-y-3">
                    <div>
                      <label className="text-xs text-stone-600 block">Nama Lengkap Tamu</label>
                      <input
                        type="text"
                        required
                        value={newGuestName}
                        onChange={(e) => setNewGuestName(e.target.value)}
                        placeholder="Contoh: Sarah Amanda"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B08A5B]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-stone-600 block">Nomor WhatsApp (Opsional)</label>
                      <input
                        type="tel"
                        value={newGuestPhone}
                        onChange={(e) => setNewGuestPhone(e.target.value)}
                        placeholder="08123456789"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-stone-600 block">Kategori / Grup</label>
                      <input
                        type="text"
                        value={newGuestGroup}
                        onChange={(e) => setNewGuestGroup(e.target.value)}
                        placeholder="Keluarga, Sahabat, VIP"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-3">
                      <button
                        type="button"
                        onClick={() => setShowAddGuestModal(false)}
                        className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-medium cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#B08A5B] hover:bg-[#8C6A40] text-white text-xs font-semibold cursor-pointer"
                      >
                        Simpan Tamu
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: RSVPs LIST */}
        {activeTab === 'rsvps' && (
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Data Konfirmasi RSVP ({rsvps.length})
                </h3>
                <p className="text-xs text-stone-600">
                  Semua data kehadiran yang dikirimkan tamu melalui formulir online.
                </p>
              </div>
              <button
                onClick={exportRSVPToCSV}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                    <th className="pb-3">Nama Tamu</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Jumlah Tamu</th>
                    <th className="pb-3">Kota Asal</th>
                    <th className="pb-3">Waktu Kirim</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {rsvps.map((r) => (
                    <tr key={r.id} className="hover:bg-stone-50">
                      <td className="py-3 font-semibold text-stone-900">{r.name}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                            r.attendance === 'hadir'
                              ? 'bg-emerald-100 text-emerald-800'
                              : r.attendance === 'tidak_hadir'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {r.attendance === 'hadir'
                            ? 'Akan Hadir'
                            : r.attendance === 'tidak_hadir'
                            ? 'Tidak Hadir'
                            : 'Masih Ragu'}
                        </span>
                      </td>
                      <td className="py-3 font-mono">{r.guestCount} orang</td>
                      <td className="py-3 text-stone-600">{r.city || '-'}</td>
                      <td className="py-3 text-stone-400">
                        {new Date(r.createdAt).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: WISHES */}
        {activeTab === 'wishes' && (
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Moderasi Doa &amp; Ucapan ({wishes.length})
            </h3>
            <div className="space-y-3">
              {wishes.map((w) => (
                <div
                  key={w.id}
                  className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-start justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">{w.guestName}</span>
                      <span className="text-stone-400 text-[10px]">
                        {new Date(w.createdAt).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <p className="text-stone-700 italic">"{w.message}"</p>
                  </div>
                  <button
                    onClick={() => handleDeleteWish(w.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer shrink-0"
                    title="Hapus Ucapan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: THEME SYSTEM */}
        {activeTab === 'theme' && (
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Ganti Tema Undangan
              </h3>
              <p className="text-xs text-stone-600">
                Pilih tema dan lihat contoh tampilannya. Klik Simpan Perubahan agar pilihan diterapkan ke undangan publik.
              </p>
            </div>

            {/* Presets Grid */}
            <div role="radiogroup" aria-label="Pilih tema undangan" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(THEME_PRESETS).map((preset) => {
                const isSelected = wedding.theme.id === preset.id;

                return (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    key={preset.id}
                    onClick={() => {
                      setWedding({ ...wedding, theme: preset });
                      applyTheme(preset);
                    }}
                    className={`relative p-4 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#B08A5B] bg-[#FFFDF9] shadow-md'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className="w-8 h-8 rounded-full border border-stone-300 shadow-sm"
                        style={{ backgroundColor: preset.primaryColor }}
                        title="Warna utama"
                      />
                      <div
                        className="w-8 h-8 rounded-full border border-stone-300 shadow-sm"
                        style={{ backgroundColor: preset.backgroundColor }}
                        title="Warna latar"
                      />
                      <div
                        className="w-8 h-8 rounded-full border border-stone-300 shadow-sm"
                        style={{ backgroundColor: preset.textColor }}
                        title="Warna teks"
                      />
                      <div
                        className="w-8 h-8 rounded-full border border-stone-300 shadow-sm"
                        style={{ backgroundColor: preset.goldColor }}
                        title="Warna aksen"
                      />
                    </div>
                    <span className="block font-semibold text-sm text-stone-900">{preset.name}</span>
                    <span className="block text-[11px] text-stone-500 mt-1 capitalize">
                      Font {preset.fontFamily === 'display' ? 'display' : preset.fontFamily}
                    </span>
                    <span
                      className="mt-4 block rounded-xl border border-stone-200 p-3"
                      style={{ backgroundColor: preset.backgroundColor, color: preset.textColor }}
                    >
                      <span
                        className="block text-[9px] uppercase tracking-[2px]"
                        style={{ color: preset.goldColor }}
                      >
                        The Wedding Of
                      </span>
                      <span
                        className="mt-1 block font-serif text-lg"
                        style={{
                          color: preset.textColor,
                          fontFamily: preset.fontFamily === 'display'
                            ? '"Cormorant Garamond", Georgia, serif'
                            : preset.fontFamily === 'sans'
                              ? '"Plus Jakarta Sans", sans-serif'
                              : '"Playfair Display", Georgia, serif',
                        }}
                      >
                        Nama Pasangan
                      </span>
                      <span
                        className="mt-2 inline-block rounded-full px-3 py-1 text-[9px] text-white"
                        style={{ backgroundColor: preset.primaryColor }}
                      >
                        Lihat Undangan
                      </span>
                    </span>
                    {isSelected && (
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#B08A5B]/10 px-2 py-1 text-[10px] font-semibold text-[#8C6A40]">
                        <Check className="h-3 w-3" />
                        Dipilih
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Color Tokens */}
            <div className="pt-4 border-t border-stone-200 space-y-4">
              <h4 className="font-semibold text-xs text-stone-900 uppercase">
                Kustomisasi Warna Hex
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-[11px] text-stone-600 block mb-1">Primary Color</label>
                  <input
                    type="color"
                    value={wedding.theme.primaryColor}
                    onChange={(e) => {
                      const updated = { ...wedding.theme, primaryColor: e.target.value };
                      setWedding({ ...wedding, theme: updated });
                      applyTheme(updated);
                    }}
                    className="w-full h-9 rounded cursor-pointer border border-stone-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-600 block mb-1">Background Color</label>
                  <input
                    type="color"
                    value={wedding.theme.backgroundColor}
                    onChange={(e) => {
                      const updated = { ...wedding.theme, backgroundColor: e.target.value };
                      setWedding({ ...wedding, theme: updated });
                      applyTheme(updated);
                    }}
                    className="w-full h-9 rounded cursor-pointer border border-stone-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-600 block mb-1">Text Color</label>
                  <input
                    type="color"
                    value={wedding.theme.textColor}
                    onChange={(e) => {
                      const updated = { ...wedding.theme, textColor: e.target.value };
                      setWedding({ ...wedding, theme: updated });
                      applyTheme(updated);
                    }}
                    className="w-full h-9 rounded cursor-pointer border border-stone-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-600 block mb-1">Gold Accent</label>
                  <input
                    type="color"
                    value={wedding.theme.goldColor}
                    onChange={(e) => {
                      const updated = { ...wedding.theme, goldColor: e.target.value };
                      setWedding({ ...wedding, theme: updated });
                      applyTheme(updated);
                    }}
                    className="w-full h-9 rounded cursor-pointer border border-stone-300"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
