import { DEFAULT_WEDDING, INITIAL_GUESTS, INITIAL_RSVPS, INITIAL_WISHES } from '../data/defaultWedding';
import { GuestRecord, RSVPRecord, ThemeConfig, WeddingData, WishRecord } from '../types/wedding';

const STORAGE_KEYS = {
  WEDDINGS: 'elegance_weddings',
  CURRENT_WEDDING: 'elegance_current_wedding',
  RSVPS: 'elegance_rsvps',
  WISHES: 'elegance_wishes',
  GUESTS: 'elegance_guests',
};

// Apply CSS variables dynamically to match the current wedding theme
export function applyTheme(theme: ThemeConfig) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--theme-primary', theme.primaryColor);
  root.style.setProperty('--theme-primary-dark', theme.primaryDark);
  root.style.setProperty('--theme-primary-light', theme.primaryLight);
  root.style.setProperty('--theme-bg', theme.backgroundColor);
  root.style.setProperty('--theme-surface', theme.surfaceColor);
  root.style.setProperty('--theme-card', theme.cardColor);
  root.style.setProperty('--theme-text', theme.textColor);
  root.style.setProperty('--theme-muted', theme.mutedColor);
  root.style.setProperty('--theme-gold', theme.goldColor);
}

export class WeddingService {
  // Load wedding by slug
  static getWedding(slug: string = 'abdi-lula'): WeddingData {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WEDDINGS);
      if (stored) {
        const list: WeddingData[] = JSON.parse(stored);
        const found = list.find((w) => w.slug === slug || w.id === slug || (slug === 'rara-benno' && w.id === DEFAULT_WEDDING.id));
        const isOriginalSeed =
          found?.id === DEFAULT_WEDDING.id &&
          found.weddingDate === '2026-11-21T08:00:00+07:00' &&
          found.couple?.groom?.fullName === 'Abdi Dananjaya, S.T.';
        const isPreviousReferenceSeed =
          found?.id === DEFAULT_WEDDING.id &&
          found.weddingDate === '2026-12-27T09:00:00+07:00' &&
          found.couple?.groom?.fullName === 'Muhammad Fauzi Abdi, S.Kom.' &&
          found.couple.groom.photo === '/images/groom-reference.svg' &&
          found.couple.bride?.photo === '/images/Galeri-5.jpg' &&
          found.coverPhoto === '/images/Awal-2.jpg' &&
          found.gallery?.[0]?.url === '/images/Galeri-1.jpg';
        const isPreviousLocalSeed =
          found?.id === DEFAULT_WEDDING.id &&
          found.weddingDate === DEFAULT_WEDDING.weddingDate &&
          found.couple?.groom?.fullName === DEFAULT_WEDDING.couple.groom.fullName &&
          (found.couple.groom.photo === '/images/groom-exact.svg' ||
            found.gallery?.[0]?.url === '/images/Galeri-1.jpg');
        if (isOriginalSeed || isPreviousReferenceSeed || isPreviousLocalSeed) {
          const migrated = { ...DEFAULT_WEDDING, viewsCount: found.viewsCount || DEFAULT_WEDDING.viewsCount };
          this.saveWedding(migrated);
          return migrated;
        }
        if (found && found.couple?.groom?.nickname === 'Abdi') return found;
      }
    } catch {
      // Fallback
    }
    return DEFAULT_WEDDING;
  }

  // Save wedding changes
  static saveWedding(wedding: WeddingData): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WEDDINGS);
      let list: WeddingData[] = stored ? JSON.parse(stored) : [DEFAULT_WEDDING];
      const index = list.findIndex((w) => w.id === wedding.id);
      if (index >= 0) {
        list[index] = wedding;
      } else {
        list.push(wedding);
      }
      localStorage.setItem(STORAGE_KEYS.WEDDINGS, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save wedding:', e);
    }
  }

  // Increment views count
  static incrementViews(weddingId: string): number {
    try {
      const wedding = this.getWedding(weddingId);
      wedding.viewsCount = (wedding.viewsCount || 0) + 1;
      this.saveWedding(wedding);
      return wedding.viewsCount;
    } catch {
      return 1;
    }
  }

  // Get RSVPs
  static getRSVPs(weddingId: string): RSVPRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RSVPS);
      if (stored) {
        const all: RSVPRecord[] = JSON.parse(stored);
        return all.filter((r) => r.weddingId === weddingId);
      }
    } catch {}
    return INITIAL_RSVPS.filter((r) => r.weddingId === weddingId);
  }

  // Submit RSVP
  static submitRSVP(rsvp: Omit<RSVPRecord, 'id' | 'createdAt'>): RSVPRecord {
    const newRecord: RSVPRecord = {
      ...rsvp,
      id: `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RSVPS);
      const all: RSVPRecord[] = stored ? JSON.parse(stored) : [...INITIAL_RSVPS];
      all.unshift(newRecord);
      localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(all));

      // Also update guest status if matching guest exists
      this.updateGuestRSVPStatus(rsvp.weddingId, rsvp.name, rsvp.attendance);
    } catch (e) {
      console.error('Error saving RSVP:', e);
    }

    return newRecord;
  }

  // Get Wishes
  static getWishes(weddingId: string): WishRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WISHES);
      if (stored) {
        const all: WishRecord[] = JSON.parse(stored);
        return all.filter((w) => w.weddingId === weddingId);
      }
    } catch {}
    return INITIAL_WISHES.filter((w) => w.weddingId === weddingId);
  }

  // Submit Wish
  static submitWish(wish: Omit<WishRecord, 'id' | 'createdAt'>): WishRecord {
    const newWish: WishRecord = {
      ...wish,
      id: `wish-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WISHES);
      const all: WishRecord[] = stored ? JSON.parse(stored) : [...INITIAL_WISHES];
      all.unshift(newWish);
      localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(all));
    } catch (e) {
      console.error('Error saving wish:', e);
    }

    return newWish;
  }

  // Delete wish
  static deleteWish(wishId: string): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WISHES);
      if (stored) {
        const all: WishRecord[] = JSON.parse(stored);
        const filtered = all.filter((w) => w.id !== wishId);
        localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(filtered));
      }
    } catch (e) {
      console.error('Error deleting wish:', e);
    }
  }

  // Get Guests
  static getGuests(weddingId: string): GuestRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GUESTS);
      if (stored) {
        const all: GuestRecord[] = JSON.parse(stored);
        return all.filter((g) => g.weddingId === weddingId);
      }
    } catch {}
    return INITIAL_GUESTS.filter((g) => g.weddingId === weddingId);
  }

  // Save guest
  static saveGuest(guest: GuestRecord): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GUESTS);
      let all: GuestRecord[] = stored ? JSON.parse(stored) : [...INITIAL_GUESTS];
      const index = all.findIndex((g) => g.id === guest.id);
      if (index >= 0) {
        all[index] = guest;
      } else {
        all.push(guest);
      }
      localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(all));
    } catch (e) {
      console.error('Error saving guest:', e);
    }
  }

  // Delete guest
  static deleteGuest(guestId: string): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GUESTS);
      if (stored) {
        const all: GuestRecord[] = JSON.parse(stored);
        const filtered = all.filter((g) => g.id !== guestId);
        localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(filtered));
      }
    } catch (e) {
      console.error('Error deleting guest:', e);
    }
  }

  // Update guest status when RSVP is submitted
  private static updateGuestRSVPStatus(
    weddingId: string,
    guestName: string,
    attendance: 'hadir' | 'tidak_hadir' | 'masih_ragu'
  ): void {
    try {
      const guests = this.getGuests(weddingId);
      const normalized = guestName.trim().toLowerCase();
      const guest = guests.find(
        (g) => g.name.trim().toLowerCase() === normalized
      );
      if (guest) {
        guest.rsvpStatus = attendance;
        this.saveGuest(guest);
      }
    } catch {}
  }

  // Generate WhatsApp Share Message
  static generateWhatsAppMessage(wedding: WeddingData, guestName: string): string {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://elegance-wedding.app';
    const link = `${origin}/invite/${wedding.slug}?to=${encodeURIComponent(guestName)}`;
    
    return `Kepada Yth.
*${guestName}*

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

*${wedding.couple.groom.nickname} & ${wedding.couple.bride.nickname}*

Berikut tautan undangan kami untuk informasi lengkap acara:
${link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih.
Salam hangat,
*${wedding.couple.groom.nickname} & ${wedding.couple.bride.nickname}*`;
  }
}
