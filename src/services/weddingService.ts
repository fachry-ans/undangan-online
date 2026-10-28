import { DEFAULT_WEDDING, INITIAL_GUESTS, INITIAL_RSVPS, INITIAL_WISHES } from '../data/defaultWedding';
import { GuestRecord, RSVPRecord, ThemeConfig, WeddingData, WishRecord } from '../types/wedding';

const STORAGE_KEYS = {
  WEDDINGS: 'elegance_weddings',
  CURRENT_WEDDING: 'elegance_current_wedding',
  RSVPS: 'elegance_rsvps',
  WISHES: 'elegance_wishes',
  GUESTS: 'elegance_guests',
  LEGACY_VIEW_COUNT_RESET: 'elegance_legacy_view_count_reset',
};

const LEGACY_SEED_VIEW_COUNT = 342;
const APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL?.trim()
  || 'https://script.google.com/macros/s/AKfycbywaWuBk3Xp-uIQXv1hsn7_YjiKeUJLKf8FAkn1x8cGYkDm-ZYsY_aWj27npOC4OQ5YFQ/exec';
interface RemoteSnapshot {
  ok: boolean;
  error?: string;
  wedding: WeddingData | null;
  guests: GuestRecord[];
  rsvps: RSVPRecord[];
  wishes: WishRecord[];
}

function reportSyncError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error('Google Sheets sync failed:', message);
  window.dispatchEvent(new CustomEvent('wedding-sync-error', { detail: message }));
}

export function generateInvitationLink(guestName: string): string {
  const origin = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://undangan-online-lula-abdi.vercel.app';
  const url = new URL('/', origin);
  const name = guestName.trim();
  if (name) url.searchParams.set('to', name);
  return url.toString();
}

function fetchJsonp<T>(params: Record<string, string>): Promise<T> {
  if (!APPS_SCRIPT_URL) return Promise.reject(new Error('URL Apps Script belum dikonfigurasi.'));

  return new Promise((resolve, reject) => {
    const callbackName = `weddingCallback${Date.now()}${Math.random().toString(36).slice(2)}`;
    const script = document.createElement('script');
    const url = new URL(APPS_SCRIPT_URL);
    Object.entries({ ...params, callback: callbackName }).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error('Google Sheets tidak merespons. Periksa URL dan deployment Apps Script.'));
    }, 15000);
    const cleanup = () => {
      window.clearTimeout(timeout);
      Reflect.deleteProperty(window, callbackName);
      script.remove();
    };

    Object.defineProperty(window, callbackName, {
      configurable: true,
      value: (result: T) => {
        cleanup();
        resolve(result);
      },
    });
    script.onerror = () => {
      cleanup();
      reject(new Error('Gagal menghubungi endpoint Google Apps Script.'));
    };
    script.src = url.toString();
    document.head.appendChild(script);
  });
}

async function postMutation(action: string, data: unknown) {
  if (!APPS_SCRIPT_URL) return;
  const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    body: JSON.stringify({ action, data }),
  });
  if (response.type !== 'opaque') {
    throw new Error('Respons Apps Script tidak sesuai.');
  }
}

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
  private static remoteInitialized = false;
  private static sharedWeddingExists = false;

  static isSharedDatabaseConfigured(): boolean {
    return Boolean(APPS_SCRIPT_URL);
  }

  static async initializeSharedData(slug: string): Promise<WeddingData> {
    if (!APPS_SCRIPT_URL) return this.getWedding(slug);
    const snapshot = await fetchJsonp<RemoteSnapshot>({
      action: 'snapshot',
      weddingId: slug,
    });
    if (!snapshot.ok) throw new Error(snapshot.error || 'Tidak bisa membaca database spreadsheet.');
    this.remoteInitialized = true;
    this.sharedWeddingExists = Boolean(snapshot.wedding);

    if (!snapshot.wedding) return this.getWedding(slug);
    this.writeWeddingToCache(snapshot.wedding);
    localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(snapshot.guests));
    localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(snapshot.rsvps));
    localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(snapshot.wishes));
    return snapshot.wedding;
  }

  static async syncLocalDataToSharedDatabase(slug: string): Promise<void> {
    const wedding = this.getWedding(slug);
    const data = {
      wedding,
      guests: this.getGuests(wedding.id),
      rsvps: this.getRSVPs(wedding.id),
      wishes: this.getWishes(wedding.id),
    };
    await postMutation('syncAll', data);
    const snapshot = await fetchJsonp<RemoteSnapshot>({
      action: 'snapshot',
      weddingId: wedding.id,
    });
    if (!snapshot.ok || snapshot.wedding?.id !== wedding.id) {
      throw new Error(snapshot.error || 'Data undangan belum tersimpan ke spreadsheet.');
    }
    this.remoteInitialized = true;
    this.sharedWeddingExists = true;
  }

  static hasSharedWedding(): boolean {
    return this.sharedWeddingExists;
  }

  private static writeWeddingToCache(wedding: WeddingData) {
    const stored = localStorage.getItem(STORAGE_KEYS.WEDDINGS);
    const list: WeddingData[] = stored ? JSON.parse(stored) : [];
    const index = list.findIndex((item) => item.id === wedding.id);
    if (index >= 0) list[index] = wedding;
    else list.push(wedding);
    localStorage.setItem(STORAGE_KEYS.WEDDINGS, JSON.stringify(list));
  }

  private static queueRemoteMutation(action: string, data: unknown): Promise<void> {
    if (!APPS_SCRIPT_URL || !this.remoteInitialized) return Promise.resolve();

    const pending = (async () => {
      await postMutation(action, data);
      const record = data as { weddingId?: string; id?: string };
      const snapshot = await fetchJsonp<RemoteSnapshot>({
        action: 'snapshot',
        weddingId: record.weddingId || this.getWedding().id,
      });
      if (!snapshot.ok) throw new Error(snapshot.error || 'Gagal memverifikasi perubahan spreadsheet.');
      const records = action.includes('Guest') ? snapshot.guests
        : action.includes('RSVP') ? snapshot.rsvps
          : action.includes('Wish') ? snapshot.wishes : [];
      if (action.startsWith('delete')) {
        if (records.some((item) => item.id === record.id)) throw new Error('Penghapusan belum tersimpan di spreadsheet.');
      } else if (action === 'saveWedding') {
        if (!snapshot.wedding || JSON.stringify(snapshot.wedding) !== JSON.stringify(data)) {
          throw new Error('Perubahan undangan belum tersimpan di spreadsheet.');
        }
      } else if (action !== 'incrementViews' && action !== 'syncAll' &&
        !records.some((item) => item.id === record.id)) {
        throw new Error('Perubahan belum tersimpan di spreadsheet.');
      }
    })();
    return pending;
  }

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
        const isLegacySeedViewCount =
          found?.id === DEFAULT_WEDDING.id &&
          found.weddingDate === DEFAULT_WEDDING.weddingDate &&
          found.couple?.groom?.fullName === DEFAULT_WEDDING.couple.groom.fullName &&
          !localStorage.getItem(STORAGE_KEYS.LEGACY_VIEW_COUNT_RESET);
        const shouldResetLegacySeedViewCount =
          isLegacySeedViewCount &&
          (found?.viewsCount ?? 0) >= LEGACY_SEED_VIEW_COUNT;

        if (isLegacySeedViewCount) {
          localStorage.setItem(STORAGE_KEYS.LEGACY_VIEW_COUNT_RESET, 'true');
        }

        if (isOriginalSeed || isPreviousReferenceSeed || isPreviousLocalSeed) {
          const migrated = {
            ...DEFAULT_WEDDING,
            viewsCount: shouldResetLegacySeedViewCount
              ? 0
              : found.viewsCount ?? DEFAULT_WEDDING.viewsCount,
          };
          this.saveWedding(migrated);
          return migrated;
        }
        if (shouldResetLegacySeedViewCount) {
          const migrated = { ...found, viewsCount: 0 };
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
      this.writeWeddingToCache(wedding);
      void this.queueRemoteMutation('saveWedding', wedding).catch(reportSyncError);
    } catch (e) {
      console.error('Failed to save wedding:', e);
    }
  }

  // Increment views count
  static incrementViews(weddingId: string): number {
    try {
      const wedding = this.getWedding(weddingId);
      wedding.viewsCount = (wedding.viewsCount || 0) + 1;
      this.writeWeddingToCache(wedding);
      void this.queueRemoteMutation('incrementViews', { weddingId }).catch(reportSyncError);
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
  static async submitRSVP(rsvp: Omit<RSVPRecord, 'id' | 'createdAt'>): Promise<RSVPRecord> {
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
      throw e;
    }

    await this.queueRemoteMutation('submitRSVP', newRecord);
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
  static async submitWish(wish: Omit<WishRecord, 'id' | 'createdAt'>): Promise<WishRecord> {
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
      throw e;
    }

    await this.queueRemoteMutation('submitWish', newWish);
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
        const deleted = all.find((wish) => wish.id === wishId);
        if (deleted) void this.queueRemoteMutation('deleteWish', { id: wishId, weddingId: deleted.weddingId }).catch(reportSyncError);
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
      void this.queueRemoteMutation('saveGuest', guest).catch(reportSyncError);
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
        const deleted = all.find((guest) => guest.id === guestId);
        if (deleted) void this.queueRemoteMutation('deleteGuest', { id: guestId, weddingId: deleted.weddingId }).catch(reportSyncError);
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
  static generateWhatsAppMessage(guestName: string): string {
    const link = generateInvitationLink(guestName);
    const recipientName = guestName.trim() || 'Tamu Undangan';

    return `Assalamu'alaikum warahmatullahi wabarakatuh

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i ${recipientName} untuk menghadiri acara kami.

Untuk info lengkap dari acara bisa kunjungi :

${link}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

Terima kasih banyak atas perhatiannya.

Salam Hormat
Lula & Abdi`;
  }
}
