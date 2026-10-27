import { WeddingData, RSVPRecord, WishRecord, GuestRecord, ThemeConfig } from '../types/wedding';

export const THEME_PRESETS: Record<string, ThemeConfig> = {
  'modern-editorial-gold': {
    id: 'modern-editorial-gold',
    name: 'Modern Editorial Champagne (Abdi & Lula)',
    primaryColor: '#B89B63',
    primaryDark: '#967B48',
    primaryLight: '#E8D8BD',
    backgroundColor: '#FAF7F0',
    surfaceColor: '#F3EFE6',
    cardColor: '#FFFFFF',
    textColor: '#3A302B',
    mutedColor: '#70635C',
    goldColor: '#B89B63',
    fontFamily: 'serif',
  },
  'luxury-emerald': {
    id: 'luxury-emerald',
    name: 'Royal Emerald & Gold',
    primaryColor: '#2D4A3E',
    primaryDark: '#1E352B',
    primaryLight: '#B89B63',
    backgroundColor: '#F5F7F5',
    surfaceColor: '#E9EFEA',
    cardColor: '#FFFFFF',
    textColor: '#1A2E25',
    mutedColor: '#586E63',
    goldColor: '#C6A87A',
    fontFamily: 'serif',
  },
  'romantic-rose': {
    id: 'romantic-rose',
    name: 'Romantic Dusty Rose',
    primaryColor: '#9E6A6B',
    primaryDark: '#794D4E',
    primaryLight: '#D9B8B9',
    backgroundColor: '#FAF6F6',
    surfaceColor: '#F2E8E8',
    cardColor: '#FFFFFF',
    textColor: '#3D2526',
    mutedColor: '#7D6162',
    goldColor: '#C6A87A',
    fontFamily: 'serif',
  },
};

export const DEFAULT_WEDDING: WeddingData = {
  id: 'wed-abdi-lula',
  slug: 'abdi-lula',
  title: 'The Wedding of Abdi & Lula',
  coverTitle: 'THE WEDDING CELEBRATION OF',
  coverSubtitle: 'Kepada Yth. Bapak/Ibu/Saudara/i',
  coverPhoto: '/images/cover-exact.jpg',
  weddingDate: '2026-12-27T09:00:00+07:00',
  timezone: 'Asia/Jakarta',
  status: 'published',
  opening: {
    heading: 'Assalamu’alaikum Warahmatullahi Wabarakatuh',
    text: 'Maha Suci Allah SWT yang telah menciptakan makhluk-Nya berpasang-pasangan. Dengan memohon rahmat dan ridho-Nya, kami bermaksud menyelenggarakan syukuran pernikahan putra-putri kami.',
  },
  quote: {
    heading: 'SALAM PEMBUKA',
    text: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
    source: 'QS. AR-RUM: 21',
  },
  couple: {
    groom: {
      nickname: 'Abdi',
      fullName: 'Muhammad Fauzi Abdi, S.Kom.',
      parents: 'Putra pertama dari Bpk. Santani dan Ibu Tutianah',
      photo: '/images/groom-exact.jpg',
      instagram: '@aryadananjaya',
    },
    bride: {
      nickname: 'Lula',
      fullName: 'Lula Agmalia, S.Hum.',
      parents: 'Putri kedua dari Bpk. Yakub dan Ibu Nurjanah',
      photo: '/images/bride-exact.jpg',
      instagram: '@kiranamaheswari',
    },
  },
  events: [
    {
      id: 'event-akad',
      type: 'akad',
      title: 'Akad Nikah',
      date: 'Minggu, 27 Desember 2026',
      startTime: '09:00',
      endTime: '10:00 WIB',
      timezone: 'WIB',
      venue: 'Kediaman mempelai wanita',
      address: 'Jl. Poncol Indah IV No.81 Rt 02/02 Cireundeu, Ciputat Timur, Tangerang Selatan, Banten',
      mapsUrl: 'https://maps.app.goo.gl/iTjm1YrjLN6HBwPg6?g_st=ic',
    },
    {
      id: 'event-resepsi',
      type: 'resepsi',
      title: 'Resepsi',
      date: 'Minggu, 27 Desember 2026',
      startTime: '12:00',
      endTime: '18:00 WIB',
      timezone: 'WIB',
      venue: 'Kediaman mempelai wanita',
      address: 'Jl. Poncol Indah IV No.81 Rt 02/02 Cireundeu, Ciputat Timur, Tangerang Selatan, Banten',
      mapsUrl: 'https://maps.app.goo.gl/iTjm1YrjLN6HBwPg6?g_st=ic',
    },
  ],
  loveStories: [
    {
      id: 'story-1',
      title: 'When Our Paths Crossed',
      storyDate: '2024',
      description: 'Berawal dari perkenalan sederhana yang perlahan tumbuh menjadi kenyamanan. Seiring waktu, kami semakin saling memahami dan memilih untuk menjalin kisah bersama.',
      imageUrl: '/images/story-exact-1.jpg',
    },
    {
      id: 'story-2',
      title: 'Through Every Prayer',
      storyDate: '2025',
      description: 'Di tengah berbagai rintangan, kami terus saling menguatkan dan percaya bahwa setiap proses memiliki maknanya. Dengan doa dan kesabaran, kami yakin segala sesuatu akan menemukan jalannya di waktu yang tepat.',
      imageUrl: '/images/story-exact-2.jpg',
    },
    {
      id: 'story-3',
      title: 'Written By Destiny',
      storyDate: '2026',
      description: 'Inilah awal perjalanan baru kami. Melangkah bersama, saling menguatkan, dan berbagi kebahagiaan dalam ikatan pernikahan, menuju kehidupan yang penuh kasih, doa, dan keberkahan hingga akhir hayat.',
      imageUrl: '/images/story-exact-3.jpg',
    },
  ],
  gallery: [
    {
      id: 'gal-1',
      mediaType: 'image',
      url: '/images/gallery-exact-1.jpg',
      caption: 'Harmoni cinta dalam balutan keanggunan busana nusantara.',
    },
    {
      id: 'gal-2',
      mediaType: 'image',
      url: '/images/gallery-exact-2.jpg',
      caption: 'Menatap luasnya masa depan dengan hati yang tenang berdampingan.',
    },
    {
      id: 'gal-3',
      mediaType: 'image',
      url: '/images/gallery-exact-3.jpg',
      caption: 'Langkah mantap sang mempelai pria menyambut janji suci.',
    },
    {
      id: 'gal-4',
      mediaType: 'image',
      url: '/images/gallery-exact-4.jpg',
      caption: 'Keanggunan sang mempelai wanita dalam ketulusan doa.',
    },
    {
      id: 'gal-5',
      mediaType: 'image',
      url: '/images/gallery-exact-5.jpg',
      caption: 'Simbol ikatan cinta abadi yang dipersatukan dalam ridho Ilahi.',
    },
  ],
  bankAccounts: [
    {
      id: 'bank-bca',
      bankName: 'BCA (Bank Central Asia)',
      accountNumber: '3100252961',
      accountHolder: 'Muhammad Fauzi Abdi',
    },
    {
      id: 'bank-mandiri',
      bankName: 'Bank BCA',
      accountNumber: '6090593658',
      accountHolder: 'Lula Agmalia',
    },
  ],
  giftAddress: {
    recipient: 'MUHAMMAD FAUZI ABDI',
    phone: '089629545916',
    address: 'Jl. Tanjung Gedong No 20 Rt 1 Rw 16 , Jakarta Barat, Grogol Petamburan, 11440',
    notes: 'Harap konfirmasi terlebih dahulu sebelum pengiriman kado fisik.',
  },
  music: {
    title: 'Wedding Romantic Song',
    artist: 'Pilihan Pengantin (YouTube)',
    url: 'https://www.youtube.com/watch?v=hXNSqTEz-eQ',
    autoplayAfterOpen: true,
    enabled: true,
  },
  theme: THEME_PRESETS['modern-editorial-gold'],
  closing: {
    message: 'Merupakan suatu kehormatan dan kebahagiaan yang tak terhingga bagi kami sekeluarga, apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu kepada kami.',
    thanksText: 'Atas kehadiran dan doa tulus yang diberikan, kami haturkan terima kasih sedalam-dalamnya. Wassalamu’alaikum Warahmatullahi Wabarakatuh',
    photo: '/images/Awal-2.jpg',
  },
  viewsCount: 0,
};

export const INITIAL_RSVPS: RSVPRecord[] = [];

export const INITIAL_WISHES: WishRecord[] = [];

export const INITIAL_GUESTS: GuestRecord[] = [];
