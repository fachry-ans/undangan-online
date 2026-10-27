export interface CoupleMember {
  nickname: string;
  fullName: string;
  parents: string;
  photo: string;
  instagram?: string;
  bio?: string;
}

export interface WeddingCouple {
  groom: CoupleMember;
  bride: CoupleMember;
}

export interface WeddingEvent {
  id: string;
  type: 'akad' | 'resepsi' | 'ceremony' | 'party';
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  venue: string;
  address: string;
  mapsUrl: string;
  imageUrl?: string;
}

export interface LoveStoryItem {
  id: string;
  title: string;
  storyDate: string;
  description: string;
  imageUrl?: string;
}

export interface GalleryItem {
  id: string;
  mediaType: 'image' | 'video';
  url: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  qrisUrl?: string;
}

export interface GiftAddress {
  recipient: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface MusicTrack {
  title: string;
  artist: string;
  url?: string;
  autoplayAfterOpen: boolean;
  enabled: boolean;
}

export interface ThemeConfig {
  id: string;
  name: string;
  primaryColor: string;
  primaryDark: string;
  primaryLight: string;
  backgroundColor: string;
  surfaceColor: string;
  cardColor: string;
  textColor: string;
  mutedColor: string;
  goldColor: string;
  fontFamily: 'serif' | 'display' | 'sans';
}

export interface WeddingData {
  id: string;
  slug: string;
  title: string;
  coverTitle: string;
  coverSubtitle: string;
  weddingDate: string; // ISO string
  timezone: string;
  status: 'published' | 'draft' | 'archived';
  quote: {
    heading: string;
    text: string;
    source: string;
  };
  couple: WeddingCouple;
  events: WeddingEvent[];
  loveStories: LoveStoryItem[];
  gallery: GalleryItem[];
  bankAccounts: BankAccount[];
  giftAddress: GiftAddress;
  music: MusicTrack;
  theme: ThemeConfig;
  closing: {
    message: string;
    thanksText: string;
    photo?: string;
  };
  viewsCount: number;
}

export interface RSVPRecord {
  id: string;
  weddingId: string;
  guestId?: string;
  name: string;
  attendance: 'hadir' | 'tidak_hadir' | 'masih_ragu';
  guestCount: number;
  city?: string;
  createdAt: string;
}

export interface WishRecord {
  id: string;
  weddingId: string;
  guestName: string;
  attendance: 'hadir' | 'tidak_hadir' | 'masih_ragu';
  message: string;
  createdAt: string;
  isPinned?: boolean;
}

export interface GuestRecord {
  id: string;
  weddingId: string;
  name: string;
  phone?: string;
  groupName?: string;
  relationship?: string;
  maxAttendance: number;
  invitationStatus: 'sent' | 'delivered' | 'opened';
  rsvpStatus?: 'hadir' | 'tidak_hadir' | 'masih_ragu' | 'pending';
}
