export type TabType = 'connect' | 'moments' | 'venues' | 'chat' | 'profile';

export type VipTier = 'free' | 'vip' | 'black_vip' | 'diamond_club';

export type AuthProviderType = 'email' | 'google' | 'apple';

export type VerificationDocumentType = 'RG' | 'CNH';

export interface Hobby {
  id: string;
  name: string;
  category:
    | 'Artes & Cultura'
    | 'Música'
    | 'Esportes & Outdoor'
    | 'Gastronomia & Vinhos'
    | 'Noite & Lifestyle'
    | 'Estilo de Vida & BDSM';
  icon?: string;
}

export interface BdsmPracticeDefinition {
  id: string;
  name: string;
  category:
    | 'Dinâmicas de Poder'
    | 'Contenção & Cordas'
    | 'Estímulos Sensoriais & Dor'
    | 'Psicológico & Verbal'
    | 'Exibição & Fetiche';
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
  role:
    | 'Dominante'
    | 'Submisso(a)'
    | 'Switch'
    | 'Rigger (Shibari)'
    | 'Sadista'
    | 'Masoquista'
    | 'Voyeur'
    | 'Exibicionista'
    | 'Curioso(a)'
    | 'Não pratico';
  experienceLevel?: 'Iniciante' | 'Intermediário' | 'Experiente' | 'Mestre / Avançado';
  fetishes?: string[];
  hardLimits: string[]; // Não negociáveis
  softLimits: string[]; // A negociar
  safeWord: string;
  acceptedCharter: boolean;
  testResult?: BdsmTestResult;
}

export interface ProfilePromptAnswer {
  id: string;
  question: string;
  answer: string;
}

export interface PersonalDetails {
  heightCm: number; // ex: 178 -> 1,78 m
  childrenPreference:
    | 'Não quero filhos'
    | 'Quero ter filhos'
    | 'Já tenho filhos'
    | 'Aberto(a) à possibilidade'
    | 'Prefiro não dizer';
  relationshipStyle:
    | 'Solteiro(a) Liberal'
    | 'Casal Liberal'
    | 'Relacionamento Aberto'
    | 'Poliamor'
    | 'Explorando sem Rótulos';
  lookingFor:
    | 'Encontros Casuais & Química'
    | 'Dinâmica BDSM & Fetiches'
    | 'Conexão Intensa & Discreta'
    | 'Amizade Liberal & Festas';
  drinking: 'Socialmente' | 'Apreciador de Vinhos/Drinks' | 'Raramente' | 'Não bebo';
  smoking: 'Não fumo' | 'Socialmente' | 'Fumante';
  zodiacSign?: string;
}

export interface VerificationDetails {
  documentType: 'RG' | 'CNH';
  documentNumberMasked: string;
  documentFrontVerified: boolean;
  documentBackVerified: boolean;
  facialBiometricsVerified: boolean;
  verifiedAt?: string;
  e2eeKeyFingerprint: string;
  zkpAgeProofVerified: boolean;
}

export interface BankAccountInfo {
  bankName: string;
  accountType: 'corrente' | 'poupanca' | 'pagamento';
  agency: string;
  accountNumber: string;
  cpfHolder: string;
  pixKeyType: 'cpf' | 'email' | 'celular' | 'aleatoria';
  pixKey: string;
  isVerified: boolean;
  verifiedAt?: string;
}

export type AdultContentCategory =
  | 'Ensaio Sensual & Lingerie'
  | 'Vídeos Explícitos (+18)'
  | 'BDSM, Cordas & Fetiche'
  | 'Casal & Lifestyle'
  | 'POV & Intimista'
  | 'Podolatria & Detalhes';

export interface AdultContentItem {
  id: string;
  title: string;
  description: string;
  category?: AdultContentCategory;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  price: number;
  selfDestructMins?: number; // 0/undefined = permanente, 60 = 1h, 1440 = 24h, 10080 = 7d
  salesCount: number;
  createdAt: string;
  drmProtected: boolean;
  tags: string[];
}

export interface EarningsReportEntry {
  id: string;
  date: string;
  sourceType: 'Venda Avulsa (PPV)' | 'Assinatura Fã-Clube' | 'Mimo / Gorjeta' | 'Pacote Fechado';
  itemTitle: string;
  buyerAlias: string;
  grossAmount: number;
  platformFee25: number;
  netAmount75: number;
}

export interface WithdrawalRecord {
  id: string;
  requestedAt: string;
  grossAmount: number;
  platformFee25: number; // 25% retido pela plataforma
  netAmount75: number; // 75% recebido pelo vendedor
  status: 'Concluído' | 'Processando';
  destinationPix: string;
}

export type SellerLevel = 1 | 2 | 3;

export interface SellerProfile {
  isSellerVerified: boolean; // Selo de Vendedor
  sellerLevel?: SellerLevel; // 1 = Bronze (20% taxa), 2 = Prata (15% taxa), 3 = Ouro (10% taxa)
  platformFeePercent?: number; // 20, 15 ou 10
  stageName?: string;
  creatorBio?: string;
  bankAccount: BankAccountInfo;
  acceptedTerms25Percent: boolean;
  acceptedTermsAt?: string;
  monthlySubscriptionPrice: number;
  quarterBundleDiscountPercent?: number;
  allowPayPerView: boolean;
  drmWatermarkEnabled: boolean;
  geoBlockState?: string;
  grossBalance: number;
  totalEarnedGross: number;
  subscribersCount: number;
  profileViewsMonth?: number;
  conversionRatePercent?: number;
  items: AdultContentItem[];
  withdrawals: WithdrawalRecord[];
  earningsHistory?: EarningsReportEntry[];
}

export interface UserStatusStory {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  isAuthorVerified: boolean;
  isAuthorVip?: boolean;
  isAuthorSeller?: boolean;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string;
  overlayText?: string;
  filterCss?: string;
  isNsfw18: boolean;
  createdAt: string;
  viewsCount: number;
  likesCount: number;
  isLiked?: boolean;
}

export interface LiveStreamSession {
  id: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  isHostVerified: boolean;
  isHostSeller?: boolean;
  title: string;
  category: string;
  viewersCount: number;
  isVipOnly?: boolean;
  entryPrice?: number;
  streamMethod: 'camera' | 'obs_rtmp';
  thumbnailUrl: string;
}

export interface PlanUsageQuotas {
  dailyLikesRemaining: number;
  maxDailyLikes: number; // 20 no plano grátis a cada 24h
  dailyFirstMessagesRemaining: number;
  maxDailyFirstMessages: number; // 4 por dia no plano grátis
  resetTimeLabel: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string; // Opcional
  authProvider?: 'email' | 'google' | 'apple';
  age: number;
  city: string;
  distanceKm: number;
  avatarUrl: string;
  photos: string[]; // Fotos públicas
  privatePhotos?: string[]; // Fotos privadas (cofre protegido)
  bio: string;
  personalDetails?: PersonalDetails;
  profilePrompts?: ProfilePromptAnswer[]; // Até 3 perguntas não obrigatórias
  isVerified: boolean;
  verificationHash?: string;
  verificationDetails?: VerificationDetails;
  isSellerVerified?: boolean; // Selo de Vendedor ativo
  sellerProfile?: SellerProfile;
  quotas?: PlanUsageQuotas;
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
    blockAdultSalesTabs?: boolean; // Bloquear abas e conteúdos de venda de mídias +18
    twoFactorEnabled?: boolean;
    twoFactorMethod?: 'email' | 'sms';
  };
}

export interface LiberalMoment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  isAuthorVerified: boolean;
  isAuthorSeller?: boolean; // Selo de Vendedor
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
  isMonetizedSale?: boolean; // Postado para monetizar por quem tem selo de vendedor
  salePrice?: number;
  isUnlockedByMe?: boolean;
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

export type GroupMemberRole =
  | 'Fundador(a)'
  | 'Administrador(a)'
  | 'Moderador(a)'
  | 'Criador VIP'
  | 'Membro';

export interface GroupMember {
  id: string;
  name: string;
  avatarUrl: string;
  role: GroupMemberRole;
  joinedAt: string;
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
  category:
    | 'Clube Exclusivo'
    | 'BDSM & Fetiche'
    | 'Encontros & Lifestyle'
    | 'Gastronomia & Vinhos'
    | 'Artes & Festas'
    | 'Comunidade de Criador';
  membersCount: number;
  isPrivate: boolean;
  isFreeGroup?: boolean; // Grupos e comunidades grátis (acesso ilimitado no plano free)
  subscriptionFee?: number;
  isJoined: boolean;
  unreadCount: number;
  lastMessage: string;
  lastMessageSender: string;
  lastMessageTime: string;
  tags: string[];
  rules: string[];
  members?: GroupMember[];
  messages: GroupMessage[];
}

export interface MeetupVenue {
  id: string;
  name: string;
  category:
    | 'Lounge Sofisticado'
    | 'Café & Bistrô'
    | 'Rooftop Bar'
    | 'Clube Privado & Lifestyle'
    | 'Parque & Cultural';
  address: string;
  neighborhood: string;
  distanceKm: number;
  rating: number;
  safeCheckInCertified: boolean;
  imageUrl: string;
  perks: string;
  securityNotice: string;
  isPaidMeetup?: boolean; // Alguns encontros são pagos
  meetupPrice?: number;
  meetupEventTitle?: string;
  meetupDate?: string;
  isBookedByMe?: boolean;
  groupId?: string;
}
