export type TabType = 'connect' | 'moments' | 'venues' | 'chat' | 'profile';

export type VipTier = 'free' | 'black_vip' | 'diamond_club';

export interface Hobby {
  id: string;
  name: string;
  category: 'Artes & Cultura' | 'Música' | 'Esportes & Outdoor' | 'Gastronomia & Vinhos' | 'Tech & Geek' | 'Estilo de Vida & BDSM';
  icon?: string;
}

export interface BdsmPracticeDefinition {
  id: string;
  name: string;
  category: 'Dinâmicas de Poder' | 'Contenção & Cordas' | 'Estímulos Sensoriais & Dor' | 'Psicológico & Verbal' | 'Exibição & Fetiche';
  shortMeaning: string;
  detailedMeaning: string;
  safetyGuidelines: string;
}

export interface BdsmScoreItem {
  practiceId: string;
  name: string;
  percentage: number;
  affinityLevel: 'Alta Afinidade' | 'Moderada' | 'Curioso(a)' | 'Limite / Baixa';
}

export interface BdsmTestResult {
  completedAt: string;
  topRole: string;
  scores: BdsmScoreItem[];
}

export interface BdsmProfile {
  enabled: boolean;
  role: 'Dominante' | 'Submisso(a)' | 'Switch' | 'Rigger (Shibari)' | 'Sadista' | 'Masoquista' | 'Voyeur' | 'Exibicionista' | 'Curioso(a)' | 'Não pratico';
  hardLimits: string[]; // Não negociáveis
  softLimits: string[]; // A negociar
  safeWord: string;
  acceptedCharter: boolean;
  testResult?: BdsmTestResult;
}

export interface User {
  id: string;
  name: string;
  age: number;
  city: string;
  distanceKm: number;
  avatarUrl: string;
  photos: string[]; // Fotos públicas
  privatePhotos?: string[]; // Fotos privadas (cofre protegido)
  bio: string;
  isVerified: boolean;
  verificationHash?: string;
  hobbies: string[];
  bdsm: BdsmProfile;
  isVip: boolean;
  vipTier: VipTier;
  matchScore?: number;
  blindMatchInfo: {
    revealed: boolean;
    maskedAlias: string;
    dominantInterests: string[];
    valuesSummary: string;
    icebreaker: string;
  };
  privacySettings: {
    ghostMode: boolean; // Oculto no radar
    blurPhotosByDefault: boolean; // Fotos só abrem com consentimento
    blockScreenshots: boolean; // Watermark DRM
    incognitoName: boolean;
  };
}

export interface LiberalMoment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  isAuthorVerified: boolean;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  e2eeSignature: string;
  isSensitiveNsfw: boolean;
  selfDestructMins?: number;
  tags: string[];
  isLockedVip?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text?: string;
  mediaUrl?: string;
  mediaType: 'text' | 'image' | 'video' | 'audio';
  durationSec?: number; // for audio
  isSelfDestruct?: boolean;
  destructTimerSec?: number;
  isViewed?: boolean;
  timestamp: string;
  e2eeVerified: boolean;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isBlindMatch: boolean;
  isUnmasked: boolean;
  matchScore: number;
  commonHobbies: string[];
  messages: Message[];
}

export interface GroupMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole?: string;
  text?: string;
  mediaUrl?: string;
  mediaType: 'text' | 'image' | 'video' | 'audio';
  timestamp: string;
  e2eeVerified: boolean;
}

export interface GroupConversation {
  id: string;
  title: string;
  description: string;
  avatarUrl: string;
  category: 'Clube Exclusivo' | 'BDSM & Fetiche' | 'Encontros & Lifestyle' | 'Gastronomia & Vinhos' | 'Artes & Festas';
  membersCount: number;
  isPrivate: boolean;
  isJoined: boolean;
  unreadCount: number;
  lastMessage: string;
  lastMessageSender: string;
  lastMessageTime: string;
  tags: string[];
  rules: string[];
  messages: GroupMessage[];
}

export interface MeetupVenue {
  id: string;
  name: string;
  category: 'Lounge Sofisticado' | 'Café & Bistrô' | 'Rooftop Bar' | 'Clube Privado & Lifestyle' | 'Parque & Cultural';
  address: string;
  neighborhood: string;
  distanceKm: number;
  rating: number;
  safeCheckInCertified: boolean;
  imageUrl: string;
  perks: string;
  securityNotice: string;
}
