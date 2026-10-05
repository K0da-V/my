import React, { useState } from 'react';
import {
  ShieldCheck,
  Crown,
  EyeOff,
  Sparkles,
  Edit3,
  Check,
  Plus,
  Trash2,
  MapPin,
  Save,
  Eye,
  X,
  DollarSign,
  Landmark,
  FileCheck2,
  Clock,
  Users,
  Image as ImageIcon,
  Wallet,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Ruler,
  Baby,
  Wine,
  Cigarette,
  Compass,
  HelpCircle,
  BarChart3,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Camera,
  Sliders,
  Settings,
  Flame,
  Smartphone,
  Mail,
  KeyRound,
  Award,
  Zap,
  QrCode,
  CreditCard,
  Copy
} from 'lucide-react';
import {
  User,
  Hobby,
  LiberalMoment,
  GroupConversation,
  SellerProfile,
  SellerLevel,
  AdultContentItem,
  AdultContentCategory,
  ProfilePromptAnswer,
  GroupMemberRole,
  BdsmProfile,
  PersonalDetails,
  WithdrawalRecord,
  UserStatusStory
} from '../../types';
import {
  ADULT_CONTENT_CATEGORIES,
  BDSM_FETISH_OPTIONS,
  CURATED_PROFILE_QUESTIONS
} from '../../data/mockData';
import { MediaUploadPicker, EditedMediaResult } from '../MediaUploadPicker';
import { DynamicLocationPicker } from '../DynamicLocationPicker';

export const SELLER_LEVEL_TIERS: {
  level: SellerLevel;
  name: string;
  badgeColor: string;
  feePercent: number;
  netPercent: number;
  vipBenefit: string;
  requirement: string;
  perks: string[];
}[] = [
  {
    level: 1,
    name: 'Nível 1 · Criador(a) Bronze',
    badgeColor: 'from-amber-700/40 to-amber-900/30 border-amber-500/40 text-amber-200',
    feePercent: 15,
    netPercent: 85,
    vipBenefit: 'Acesso VIP Cortesia Liberado',
    requirement: 'Selo de Vendedor Ativo (0 a 19 assinantes)',
    perks: [
      'Taxa de saque reduzida para apenas 15% (85% líquido para você)',
      'Assinatura Plano VIP Cortesia automática enquanto vender',
      'Transmissão de Lives Ao Vivo (Câmera ou OBS) liberada',
      'Vitrine +18 ilimitada com marca d’água forense DRM'
    ]
  },
  {
    level: 2,
    name: 'Nível 2 · Criador(a) Prata',
    badgeColor: 'from-slate-400/30 to-slate-700/30 border-slate-300/50 text-slate-100',
    feePercent: 10,
    netPercent: 90,
    vipBenefit: 'VIP + Boost Duplo no Radar',
    requirement: '20+ assinantes ativos ou R$ 2.500 em vendas',
    perks: [
      'Taxa de saque justa de apenas 10% (90% líquido para você)',
      'Saque PIX Prioritário em até 1 hora sem custo extra',
      'Alcance 2x maior no Descobrir e em Momentos Liberais',
      'Gerador de Cupons Promocionais e Pacotes de Desconto para Fãs'
    ]
  },
  {
    level: 3,
    name: 'Nível 3 · Criador(a) Ouro Black',
    badgeColor: 'from-amber-400/35 to-[#E11D48]/35 border-amber-300 text-amber-200',
    feePercent: 6,
    netPercent: 94,
    vipBenefit: 'Acesso Aura Black Cortesia Total',
    requirement: '50+ assinantes ativos ou R$ 7.500 em vendas',
    perks: [
      'Menor taxa do mercado: apenas 6% de taxa (94% líquido no seu PIX)',
      'Plano Aura Black Cortesia (entrada VIP gratuita em Encontros Reais)',
      'Saque PIX Instantâneo em 0 segundos 24/7',
      'Destaque Fixo no Topo da Barra de Status, Lives Ao Vivo e Descobrir',
      'Rastreamento Anti-Vazamento Pro (DMCA Automático) + Concierge Dedicado'
    ]
  }
];

interface ProfileTabProps {
  user: User;
  allHobbies: Hobby[];
  userMoments?: LiberalMoment[];
  groups?: GroupConversation[];
  initialSubTab?: 'overview' | 'edit' | 'seller' | 'privacy';
  onToggleGhostMode: () => void;
  onStartVerify: () => void;
  onOpenVip: () => void;
  onOpenBdsmTest: () => void;
  onUpdateProfile: (updated: Partial<User>) => void;
  onCreateMoment?: (moment: LiberalMoment) => void;
  onDeleteMoment?: (momentId: string) => void;
  onCreateGroup?: (groupData: {
    title: string;
    description: string;
    category: GroupConversation['category'];
    isPrivate: boolean;
    subscriptionFee?: number;
  }) => void;
  onDeleteGroup?: (groupId: string) => void;
  onUpdateGroupMemberRole?: (
    groupId: string,
    memberId: string,
    role: GroupMemberRole
  ) => void;
  onRemoveGroupMember?: (groupId: string, memberId: string) => void;
  onDeleteAccount?: () => void;
  stories?: UserStatusStory[];
  onAddStory?: (story: UserStatusStory) => void;
}

const DEMO_STOCK_PHOTOS = [
  '/src/assets/images/avatar_marcos_1790885768293.jpg',
  '/src/assets/images/avatar_valentina_1790885756752.jpg',
  '/src/assets/images/liberal_moment_art_1790885781551.jpg',
  '/src/assets/images/venue_lounge_meet_1790885792094.jpg'
];

const CHILDREN_OPTIONS: PersonalDetails['childrenPreference'][] = [
  'Não quero filhos',
  'Quero ter filhos',
  'Já tenho filhos',
  'Aberto(a) à possibilidade',
  'Prefiro não dizer'
];

const RELATIONSHIP_STYLE_OPTIONS: PersonalDetails['relationshipStyle'][] = [
  'Solteiro(a) Liberal',
  'Casal Liberal',
  'Relacionamento Aberto',
  'Poliamor',
  'Explorando sem Rótulos'
];

const LOOKING_FOR_OPTIONS: PersonalDetails['lookingFor'][] = [
  'Encontros Casuais & Química',
  'Dinâmica BDSM & Fetiches',
  'Conexão Intensa & Discreta',
  'Amizade Liberal & Festas'
];

const DRINKING_OPTIONS: PersonalDetails['drinking'][] = [
  'Socialmente',
  'Apreciador de Vinhos/Drinks',
  'Raramente',
  'Não bebo'
];

const SMOKING_OPTIONS: PersonalDetails['smoking'][] = ['Não fumo', 'Socialmente', 'Fumante'];

const ZODIAC_OPTIONS = [
  'Áries',
  'Touro',
  'Gêmeos',
  'Câncer',
  'Leão',
  'Virgem',
  'Libra',
  'Escorpião',
  'Sagitário',
  'Capricórnio',
  'Aquário',
  'Peixes'
];

export function ProfileTab({
  user,
  allHobbies,
  groups = [],
  initialSubTab = 'overview',
  onToggleGhostMode,
  onStartVerify,
  onOpenVip,
  onOpenBdsmTest,
  onUpdateProfile,
  onCreateMoment,
  onCreateGroup,
  onDeleteGroup,
  onUpdateGroupMemberRole,
  onRemoveGroupMember,
  onDeleteAccount,
  stories = [],
  onAddStory
}: ProfileTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'preview' | 'edit' | 'seller' | 'privacy'>(
    initialSubTab === 'overview' ? 'edit' : initialSubTab
  );

  // Preview Card Photo Index
  const [previewPhotoIdx, setPreviewPhotoIdx] = useState<number>(0);

  // Editable Profile States
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);
  const [city, setCity] = useState(user.city);
  const [bio, setBio] = useState(user.bio);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [photos, setPhotos] = useState<string[]>(
    user.photos && user.photos.length > 0 ? user.photos : [user.avatarUrl]
  );
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(user.hobbies);
  const [customHobbyInput, setCustomHobbyInput] = useState('');

  // Editable Personal Details (Height, Children, Relationship Style, Looking For, Drinking, Smoking, Zodiac)
  const [heightCm, setHeightCm] = useState<number>(user.personalDetails?.heightCm || 181);
  // Prioritize height unit (cm vs pés) automatically based on location permission / user city
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>(() => {
    const cityLower = (user.city || '').toLowerCase();
    const isImperialRegion =
      cityLower.includes('usa') ||
      cityLower.includes('miami') ||
      cityLower.includes('new york') ||
      cityLower.includes('london');
    return isImperialRegion ? 'ft' : 'cm';
  });
  const [locationUnitLabel, setLocationUnitLabel] = useState<string>(
    'Priorizado pela sua localização atual (Brasil · Sistema Métrico cm)'
  );
  const [showHeightModal, setShowHeightModal] = useState<boolean>(false);

  // Quick Edit Profile Photo Modal & Click-Avatar Status Viewer Pop-up (Image 6)
  const [showQuickAvatarEditModal, setShowQuickAvatarEditModal] = useState<boolean>(false);
  const [showAvatarStatusPopup, setShowAvatarStatusPopup] = useState<boolean>(false);
  const [activePopupStoryIdx, setActivePopupStoryIdx] = useState<number>(0);
  const [revealedPopupNsfwIds, setRevealedPopupNsfwIds] = useState<string[]>([]);

  // Seller Onboarding: R$ 50 One-Time Activation Fee & Payment Methods
  const [acceptedSellerPermissions, setAcceptedSellerPermissions] = useState<boolean>(false);
  const [sellerFeePaymentMethod, setSellerFeePaymentMethod] = useState<'pix' | 'card' | 'wallet'>(
    'pix'
  );
  const [sellerActivationFeePaid, setSellerActivationFeePaid] = useState<boolean>(false);
  const [copiedSellerPix, setCopiedSellerPix] = useState<boolean>(false);
  const [sellerCardNumber, setSellerCardNumber] = useState<string>('4532 •••• •••• 8819');
  const [sellerCardHolder, setSellerCardHolder] = useState<string>(user.name);
  const [sellerCardExpiry, setSellerCardExpiry] = useState<string>('09/29');
  const [sellerCardCvv, setSellerCardCvv] = useState<string>('842');
  const [sellerOnboardingError, setSellerOnboardingError] = useState<string | null>(null);
  const [childrenPreference, setChildrenPreference] = useState<
    PersonalDetails['childrenPreference']
  >(user.personalDetails?.childrenPreference || 'Não quero filhos');
  const [relationshipStyle, setRelationshipStyle] = useState<PersonalDetails['relationshipStyle']>(
    user.personalDetails?.relationshipStyle || 'Solteiro(a) Liberal'
  );
  const [lookingFor, setLookingFor] = useState<PersonalDetails['lookingFor']>(
    user.personalDetails?.lookingFor || 'Encontros Casuais & Química'
  );
  const [drinking, setDrinking] = useState<PersonalDetails['drinking']>(
    user.personalDetails?.drinking || 'Apreciador de Vinhos/Drinks'
  );
  const [smoking, setSmoking] = useState<PersonalDetails['smoking']>(
    user.personalDetails?.smoking || 'Não fumo'
  );
  const [zodiacSign, setZodiacSign] = useState<string>(
    user.personalDetails?.zodiacSign || 'Escorpião'
  );

  // Editable BDSM & Fetishes (Interactive Chip Selector like BDSM tab)
  const [bdsmRole, setBdsmRole] = useState<BdsmProfile['role']>(user.bdsm?.role || 'Switch');
  const [bdsmExperience, setBdsmExperience] = useState<
    NonNullable<BdsmProfile['experienceLevel']>
  >(user.bdsm?.experienceLevel || 'Experiente');
  const [selectedFetishes, setSelectedFetishes] = useState<string[]>(
    user.bdsm?.fetishes || user.bdsm?.softLimits || [
      'Shibari & Cordas Japonesas',
      'Vendas & Privação Sensorial',
      'Dominação & Submissão (D/s)'
    ]
  );

  // 3 Optional Profile Prompts
  const [prompts, setPrompts] = useState<ProfilePromptAnswer[]>(() => {
    const existing = user.profilePrompts || [];
    return [
      existing[0] || {
        id: 'p1',
        question: CURATED_PROFILE_QUESTIONS[0],
        answer: ''
      },
      existing[1] || {
        id: 'p2',
        question: CURATED_PROFILE_QUESTIONS[1],
        answer: ''
      },
      existing[2] || {
        id: 'p3',
        question: CURATED_PROFILE_QUESTIONS[2],
        answer: ''
      }
    ];
  });

  const [saveFeedback, setSaveFeedback] = useState(false);

  // Seller Studio States
  const existingSeller: SellerProfile = user.sellerProfile || {
    isSellerVerified: Boolean(user.isSellerVerified),
    stageName: user.name,
    creatorBio: user.bio,
    bankAccount: {
      bankName: '260 - Nu Pagamentos S.A. (Nubank)',
      accountType: 'corrente',
      agency: '0001',
      accountNumber: '984512-7',
      cpfHolder: '***.482.910-**',
      pixKeyType: 'cpf',
      pixKey: '391.482.910-08',
      isVerified: true
    },
    acceptedTerms25Percent: true,
    monthlySubscriptionPrice: 39.9,
    quarterBundleDiscountPercent: 15,
    allowPayPerView: true,
    drmWatermarkEnabled: true,
    grossBalance: 1680.0,
    totalEarnedGross: 4820.0,
    subscribersCount: 34,
    items: [],
    withdrawals: [],
    earningsHistory: []
  };

  const [sellerStudioSection, setSellerStudioSection] = useState<
    'catalog' | 'finances' | 'communities'
  >('catalog');
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<
    AdultContentCategory | 'Todas'
  >('Todas');

  const [bankName, setBankName] = useState(existingSeller.bankAccount.bankName);
  const [cpfHolder, setCpfHolder] = useState(existingSeller.bankAccount.cpfHolder);
  const [pixKey, setPixKey] = useState(existingSeller.bankAccount.pixKey);
  const [accepted25FeeTerms, setAccepted25FeeTerms] = useState(
    Boolean(existingSeller.acceptedTerms25Percent)
  );
  const [monthlySubPrice, setMonthlySubPrice] = useState(
    String(existingSeller.monthlySubscriptionPrice || 39.9)
  );

  // New Adult Content Upload Form
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaPrice, setNewMediaPrice] = useState('39.90');
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');
  const [newMediaCategory, setNewMediaCategory] = useState<AdultContentCategory>(
    'Ensaio Sensual & Lingerie'
  );
  const [newMediaDestructMins, setNewMediaDestructMins] = useState<number>(1440);
  const [newMediaUrl, setNewMediaUrl] = useState(
    '/src/assets/images/liberal_moment_art_1790885781551.jpg'
  );
  const [postAlsoToMoments, setPostAlsoToMoments] = useState(true);
  const [showProfilePhotoUploader, setShowProfilePhotoUploader] = useState(false);

  // Seller Level State (1 = Bronze 15%, 2 = Prata 10%, 3 = Ouro 6%)
  const currentSellerLevel: SellerLevel = existingSeller.sellerLevel || 2;
  const activeTierConfig =
    SELLER_LEVEL_TIERS.find((t) => t.level === currentSellerLevel) || SELLER_LEVEL_TIERS[1];
  const activeFeeDecimal = activeTierConfig.feePercent / 100;
  const activeNetDecimal = activeTierConfig.netPercent / 100;

  // 2FA & Account Deletion Verification State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(
    user.privacySettings?.twoFactorEnabled ?? true
  );
  const [twoFactorMethod, setTwoFactorMethod] = useState<'email' | 'sms'>(
    (user.privacySettings?.twoFactorMethod as 'email' | 'sms') || 'sms'
  );
  const [show2faCodeModal, setShow2faCodeModal] = useState(false);
  const [twoFactorOtpInput, setTwoFactorOtpInput] = useState('');
  const [twoFactorDemoCode, setTwoFactorDemoCode] = useState('739104');
  const [twoFactorFeedback, setTwoFactorFeedback] = useState<string | null>(null);

  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteChannel, setDeleteChannel] = useState<'sms' | 'email'>('sms');
  const [deleteOtpCode, setDeleteOtpCode] = useState('918402');
  const [deleteOtpInput, setDeleteOtpInput] = useState('');
  const [deleteReason, setDeleteReason] = useState('Privacidade / Pausa temporária');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleSelectSellerLevel = (level: SellerLevel) => {
    const chosenTier = SELLER_LEVEL_TIERS.find((t) => t.level === level) || SELLER_LEVEL_TIERS[0];
    onUpdateProfile({
      vipTier: level === 3 ? 'black_vip' : 'vip',
      sellerProfile: {
        ...existingSeller,
        sellerLevel: level,
        platformFeePercent: chosenTier.feePercent
      }
    });
  };

  // Payout Simulation State
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);

  // Create Community Form in Seller Studio
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [groupCategory, setGroupCategory] =
    useState<GroupConversation['category']>('Comunidade de Criador');
  const [groupEntryFee, setGroupEntryFee] = useState('29.90');
  const [groupIsPrivate, setGroupIsPrivate] = useState(true);

  const cmToFeetInches = (cm: number) => {
    const totalInches = Math.round(cm / 2.54);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${feet}' ${inches}" (${cm} cm)`;
  };

  const formatHeight = (cm: number) => {
    if (heightUnit === 'ft') {
      return cmToFeetInches(cm);
    }
    return `${cm} cm`;
  };

  const handleDetectLocationUnit = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          // Rough bounding check: US/UK vs Brazil/Europe
          const isUS = latitude > 24 && latitude < 50 && longitude < -65 && longitude > -125;
          if (isUS) {
            setHeightUnit('ft');
            setLocationUnitLabel('Localização GPS detectada: Priorizando Pés/Polegadas (ft/in)');
          } else {
            setHeightUnit('cm');
            setLocationUnitLabel('Localização GPS confirmada: Priorizando Centímetros (cm)');
          }
        },
        () => {
          setHeightUnit('cm');
          setLocationUnitLabel('Permissão de localização ativa (${city}): Priorizando cm');
        }
      );
    }
  };

  // Build ordered status list starting with current user's own status stories first, followed by other users' stories
  const orderedProfileStories: UserStatusStory[] = React.useMemo(() => {
    const myStories = stories.filter((s) => s.authorId === user.id);
    const otherStories = stories.filter((s) => s.authorId !== user.id);
    const defaultMyStory: UserStatusStory = {
      id: `my_profile_story_${user.id}`,
      authorId: user.id,
      authorName: `${name} (Seu Status)`,
      authorAvatar: avatarUrl,
      isAuthorVerified: user.isVerified,
      isAuthorVip: user.vipTier !== 'free',
      isAuthorSeller: Boolean(existingSeller.isSellerVerified),
      mediaUrl: avatarUrl,
      mediaType: 'image',
      caption: `${bio.slice(0, 90)}...`,
      isNsfw18: false,
      createdAt: 'Seu Status Atual',
      viewsCount: 42,
      likesCount: 14
    };
    return [...(myStories.length > 0 ? myStories : [defaultMyStory]), ...otherStories];
  }, [stories, user.id, name, avatarUrl, user.isVerified, user.vipTier, existingSeller.isSellerVerified, bio]);

  const toggleHobby = (hobbyName: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobbyName) ? prev.filter((h) => h !== hobbyName) : [...prev, hobbyName]
    );
  };

  const handleAddCustomHobby = () => {
    const trimmed = customHobbyInput.trim();
    if (!trimmed) return;
    if (!selectedHobbies.includes(trimmed)) {
      setSelectedHobbies((prev) => [...prev, trimmed]);
    }
    setCustomHobbyInput('');
  };

  const toggleFetish = (fetish: string) => {
    setSelectedFetishes((prev) =>
      prev.includes(fetish) ? prev.filter((f) => f !== fetish) : [...prev, fetish]
    );
  };

  const updatePromptItem = (idx: number, field: 'question' | 'answer', value: string) => {
    setPrompts((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleAddGalleryPhoto = (url: string) => {
    if (!photos.includes(url)) {
      setPhotos((prev) => [...prev, url]);
    }
  };

  const handleRemoveGalleryPhoto = (url: string) => {
    setPhotos((prev) => prev.filter((item) => item !== url));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const validPrompts = prompts.filter((p) => p.answer.trim().length > 0);

    onUpdateProfile({
      name: name.trim() || user.name,
      age: Number(age) || user.age,
      city: city.trim() || user.city,
      bio: bio.trim() || user.bio,
      avatarUrl,
      photos,
      hobbies: selectedHobbies,
      personalDetails: {
        heightCm,
        childrenPreference,
        relationshipStyle,
        lookingFor,
        drinking,
        smoking,
        zodiacSign
      },
      bdsm: {
        ...user.bdsm,
        enabled: true,
        role: bdsmRole,
        experienceLevel: bdsmExperience,
        fetishes: selectedFetishes,
        softLimits: selectedFetishes
      },
      profilePrompts: validPrompts
    });

    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2500);
  };

  const handleCompleteSellerOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    setSellerOnboardingError(null);

    if (!user.isVerified) {
      setSellerOnboardingError(
        'Você precisa concluir a verificação de identidade (RG/CNH + Biometria Facial) antes de ativar as vendas.'
      );
      return;
    }
    if (!accepted25FeeTerms || !acceptedSellerPermissions) {
      setSellerOnboardingError(
        'Marque as opções aceitando os Termos e Permissões de Vendedor +18 para continuar.'
      );
      return;
    }
    if (!sellerActivationFeePaid) {
      setSellerOnboardingError(
        'Conclua o pagamento da Taxa Única de Ativação de R$ 50,00 para liberar seu Selo de Vendedor +18.'
      );
      return;
    }
    if (!pixKey.trim() || !cpfHolder.trim()) {
      setSellerOnboardingError('Preencha seu CPF e Chave PIX para recebimento dos seus saques.');
      return;
    }

    const updatedSeller: SellerProfile = {
      ...existingSeller,
      isSellerVerified: true,
      sellerLevel: 1,
      platformFeePercent: 15,
      acceptedTerms25Percent: true,
      acceptedTermsAt: new Date().toLocaleDateString('pt-BR'),
      monthlySubscriptionPrice: parseFloat(monthlySubPrice) || 39.9,
      bankAccount: {
        ...existingSeller.bankAccount,
        bankName,
        cpfHolder: cpfHolder.trim(),
        pixKey: pixKey.trim(),
        isVerified: true,
        verifiedAt: new Date().toLocaleDateString('pt-BR')
      }
    };

    onUpdateProfile({
      isSellerVerified: true,
      isVip: true,
      vipTier: user.vipTier === 'free' ? 'vip' : user.vipTier,
      sellerProfile: updatedSeller
    });
  };

  const handleAddSellerMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaTitle.trim()) return;
    const priceNum = parseFloat(newMediaPrice.replace(',', '.')) || 39.9;

    const newItem: AdultContentItem = {
      id: `item_${Date.now()}`,
      title: newMediaTitle.trim(),
      description: `Conteúdo exclusivo +18 (${newMediaCategory})`,
      category: newMediaCategory,
      mediaUrl: newMediaUrl,
      mediaType: newMediaType,
      price: priceNum,
      selfDestructMins: newMediaDestructMins,
      salesCount: 0,
      createdAt: 'Agora mesmo',
      drmProtected: true,
      tags: [newMediaCategory, '+18']
    };

    const nextItems = [newItem, ...(existingSeller.items || [])];
    onUpdateProfile({
      sellerProfile: {
        ...existingSeller,
        items: nextItems
      }
    });

    if (postAlsoToMoments && onCreateMoment) {
      onCreateMoment({
        id: `mom_${Date.now()}`,
        authorId: user.id,
        authorName: user.name,
        authorAvatar: user.avatarUrl,
        isAuthorVerified: user.isVerified,
        isAuthorSeller: true,
        mediaUrl: newMediaUrl,
        mediaType: newMediaType,
        caption: `${newItem.title} · Categoria: ${newMediaCategory}`,
        timestamp: 'Agora mesmo',
        likes: 1,
        isLiked: true,
        e2eeSignature: 'SHA256-DRM',
        isSensitiveNsfw: true,
        selfDestructMins: newMediaDestructMins,
        tags: [newMediaCategory, 'Exclusivo+18'],
        isMonetizedSale: true,
        salePrice: priceNum,
        isUnlockedByMe: true
      });
    }

    setNewMediaTitle('');
  };

  const handleDeleteSellerMedia = (itemId: string) => {
    const nextItems = (existingSeller.items || []).filter((i) => i.id !== itemId);
    onUpdateProfile({
      sellerProfile: {
        ...existingSeller,
        items: nextItems
      }
    });
  };

  const handleRequestWithdrawal = () => {
    const gross = existingSeller.grossBalance;
    if (gross <= 0) return;
    const fee = gross * activeFeeDecimal;
    const net = gross - fee;

    const newRecord: WithdrawalRecord = {
      id: `wd_${Date.now()}`,
      requestedAt: 'Hoje, Agora',
      grossAmount: gross,
      platformFee25: fee,
      netAmount75: net,
      status: 'Concluído',
      destinationPix: existingSeller.bankAccount.pixKey
    };

    setPayoutSuccessMsg(
      `Saque enviado via PIX (${activeTierConfig.name})! Bruto: R$ ${gross.toFixed(2)} | Taxa Justa (${activeTierConfig.feePercent}%): -R$ ${fee.toFixed(
        2
      )} | Líquido Creditado (${activeTierConfig.netPercent}%): R$ ${net.toFixed(2)}`
    );

    onUpdateProfile({
      sellerProfile: {
        ...existingSeller,
        grossBalance: 0,
        withdrawals: [newRecord, ...(existingSeller.withdrawals || [])]
      }
    });
  };

  const handleToggleBlockAdultSales = () => {
    const currentBlocked = Boolean(user.privacySettings?.blockAdultSalesTabs);
    const nextBlocked = !currentBlocked;
    onUpdateProfile({
      privacySettings: {
        ...user.privacySettings,
        blockAdultSalesTabs: nextBlocked
      }
    });
    if (nextBlocked && activeSubTab === 'seller') {
      setActiveSubTab('edit');
    }
  };

  const allPreviewPhotos = Array.from(new Set([avatarUrl, ...photos]));
  const filteredCatalogItems = (existingSeller.items || []).filter((item) =>
    selectedCatalogCategory === 'Todas' ? true : item.category === selectedCatalogCategory
  );

  return (
    <div className="space-y-6 pb-14">
      {/* Tinder-Inspired Top Profile Hub Header (Adjusted per Image 4 & Image 6) */}
      <div className="velvet-card rounded-3xl p-5 sm:p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
          {/* Avatar + Identity */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="relative">
              {/* Clicking the Profile Photo opens the Status Viewer Pop-up starting with User's own status and swiping to others */}
              <button
                type="button"
                onClick={() => {
                  setActivePopupStoryIdx(0);
                  setShowAvatarStatusPopup(true);
                }}
                title="Clique para ver seus Status e passar para os Status de outras pessoas"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[3px] bg-gradient-to-tr from-[#E11D48] via-[#FB7185] to-amber-400 shadow-lg transition-transform hover:scale-[1.03] focus:outline-none relative block group"
              >
                <img
                  src={avatarUrl}
                  alt={name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover border-2 border-[#0F0E11]"
                />
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/85 border border-white/15 text-[9px] font-bold text-[#FB7185] whitespace-nowrap opacity-95 group-hover:bg-[#E11D48] group-hover:text-white transition-colors">
                  Ver Status
                </span>
              </button>

              {/* Edit Profile Photo Button on the Avatar Corner (Instead of Verification Badge) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQuickAvatarEditModal(true);
                }}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#E11D48] hover:bg-[#BE123C] text-white flex items-center justify-center ring-4 ring-[#17151A] shadow-md transition-transform hover:scale-105"
                title="Editar Foto de Perfil"
                aria-label="Editar Foto de Perfil"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div>
              {/* Name, Age + Verification Badge right next to Age */}
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-white font-display flex items-center gap-2">
                  <span>
                    {name}, {age}
                  </span>
                  {user.isVerified && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-semibold"
                      title="Identidade e Biometria Verificadas"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-[11px]">Verificado</span>
                    </span>
                  )}
                </h1>

                {existingSeller.isSellerVerified && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E11D48]/20 border border-[#E11D48]/50 text-[#FB7185] text-[11px] font-bold">
                    Selo de Vendedor +18
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#FAF5F6]/65 mt-1 flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                <MapPin className="w-3.5 h-3.5 text-[#FB7185] shrink-0" />
                <span>
                  {city} • {relationshipStyle} • {formatHeight(heightCm)}
                </span>
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                <button
                  type="button"
                  onClick={onOpenVip}
                  className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-500/25 transition-colors"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  {user.vipTier === 'black_vip'
                    ? 'Plano Black Ativo'
                    : user.vipTier === 'vip'
                    ? 'Plano VIP Ativo'
                    : 'Plano Grátis · Fazer Upgrade'}
                </button>

                {!user.isVerified && (
                  <button
                    type="button"
                    onClick={onStartVerify}
                    className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-500/25"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verificar RG/CNH + Facial
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stable & Elegant Segmented Switcher (Image 4: 2x2 Grid on Mobile, 4-Button Bar on Desktop) */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-1.5 w-full lg:w-auto bg-[#0F0E11] p-1.5 rounded-2xl border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setActiveSubTab('edit')}
              className={`w-full sm:w-auto px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeSubTab === 'edit'
                  ? 'bg-[#E11D48] text-white shadow-sm'
                  : 'text-[#FAF5F6]/70 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 shrink-0" />
              <span>Editar Perfil</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('preview')}
              className={`w-full sm:w-auto px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeSubTab === 'preview'
                  ? 'bg-[#E11D48] text-white shadow-sm'
                  : 'text-[#FAF5F6]/70 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Eye className="w-3.5 h-3.5 shrink-0" />
              <span>Pré-visualizar</span>
            </button>

            {!user.privacySettings?.blockAdultSalesTabs && (
              <button
                type="button"
                onClick={() => setActiveSubTab('seller')}
                className={`w-full sm:w-auto px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeSubTab === 'seller'
                    ? 'bg-[#E11D48] text-white shadow-sm'
                    : 'text-[#FAF5F6]/70 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 shrink-0" />
                <span>Vendas +18</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveSubTab('privacy')}
              className={`w-full sm:w-auto px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeSubTab === 'privacy'
                  ? 'bg-[#E11D48] text-white shadow-sm'
                  : 'text-[#FAF5F6]/70 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Settings className="w-3.5 h-3.5 shrink-0" />
              <span>Ajustes</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: PRÉ-VISUALIZAR PERFIL (Interactive Tinder Card Preview) */}
      {activeSubTab === 'preview' && (
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="flex items-center justify-between px-2">
            <div>
              <h2 className="text-base font-bold text-white">
                Pré-visualização do Seu Perfil (Inspirado no Tinder)
              </h2>
              <p className="text-xs text-[#FAF5F6]/60">
                Veja exatamente como outras pessoas visualizam suas fotos, altura, filhos, fetiches e respostas.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveSubTab('edit')}
              className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-semibold text-white flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#FB7185]" />
              Voltar para Editar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Tinder Card Preview */}
            <div className="md:col-span-7 relative rounded-[32px] overflow-hidden bg-[#140E11] border border-white/15 shadow-2xl">
              <div className="relative aspect-[3/4] w-full">
                <img
                  src={allPreviewPhotos[previewPhotoIdx] || avatarUrl}
                  alt={name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Top Story Photo Bars */}
                <div className="absolute top-3 left-4 right-4 z-20 flex items-center gap-1.5">
                  {allPreviewPhotos.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPreviewPhotoIdx(idx)}
                      className="flex-1 h-1 rounded-full overflow-hidden bg-black/40"
                    >
                      <div
                        className={`h-full ${
                          idx === previewPhotoIdx ? 'bg-white' : 'bg-white/30'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {allPreviewPhotos.length > 1 && (
                  <>
                    {/* Mobile / Tablet Left & Right Tap Zones */}
                    <div className="absolute inset-x-0 top-12 bottom-28 z-20 flex md:hidden">
                      <button
                        type="button"
                        aria-label="Foto anterior"
                        onClick={() =>
                          setPreviewPhotoIdx((prev) =>
                            prev === 0 ? allPreviewPhotos.length - 1 : prev - 1
                          )
                        }
                        className="w-1/2 h-full focus:outline-none active:bg-white/[0.03]"
                      />
                      <button
                        type="button"
                        aria-label="Próxima foto"
                        onClick={() =>
                          setPreviewPhotoIdx((prev) => (prev + 1) % allPreviewPhotos.length)
                        }
                        className="w-1/2 h-full focus:outline-none active:bg-white/[0.03]"
                      />
                    </div>

                    {/* Desktop Only: Discreet & Visible Left / Right Arrows */}
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewPhotoIdx((prev) =>
                          prev === 0 ? allPreviewPhotos.length - 1 : prev - 1
                        )
                      }
                      className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/45 hover:bg-black/75 border border-white/15 text-white/85 hover:text-white items-center justify-center backdrop-blur-md transition-all"
                      title="Foto anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewPhotoIdx((prev) => (prev + 1) % allPreviewPhotos.length)
                      }
                      className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/45 hover:bg-black/75 border border-white/15 text-white/85 hover:text-white items-center justify-center backdrop-blur-md transition-all"
                      title="Próxima foto"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#0D090B] via-[#0D090B]/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                      {name}, {age}
                    </h3>
                    {user.isVerified && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verificado
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#FAF5F6]/80 mt-1 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#FB7185]" />
                    {city} • {relationshipStyle} • {formatHeight(heightCm)}
                  </p>

                  <p className="text-xs sm:text-sm text-[#FAF5F6]/90 mt-3 leading-relaxed">
                    {bio}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column of Preview: Personal Details, BDSM, Tastes & 3 Answered Questions */}
            <div className="md:col-span-5 space-y-4">
              <div className="velvet-card rounded-3xl p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#FAF5F6]/60">
                  Detalhes Pessoais
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <span className="text-[10px] text-[#FAF5F6]/50 block">Altura</span>
                    <strong className="text-white">{formatHeight(heightCm)}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <span className="text-[10px] text-[#FAF5F6]/50 block">Filhos</span>
                    <strong className="text-white">{childrenPreference}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <span className="text-[10px] text-[#FAF5F6]/50 block">Relação</span>
                    <strong className="text-white">{relationshipStyle}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <span className="text-[10px] text-[#FAF5F6]/50 block">Signo</span>
                    <strong className="text-white">{zodiacSign}</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] text-[#FAF5F6]/50 block mb-1.5">
                    Dinâmica & Fetiches BDSM ({bdsmRole} · {bdsmExperience})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFetishes.map((f) => (
                      <span
                        key={f}
                        className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-400/30 text-[11px] text-amber-200"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] text-[#FAF5F6]/50 block mb-1.5">
                    Gostos em Geral & Estilo de Vida
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedHobbies.map((h) => (
                      <span
                        key={h}
                        className="px-2.5 py-1 rounded-xl bg-white/[0.06] text-[11px] text-white"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3 Answered Questions Preview */}
              {prompts
                .filter((p) => p.answer.trim().length > 0)
                .map((p) => (
                  <div
                    key={p.id}
                    className="velvet-card rounded-3xl p-4 border-l-4 border-l-[#E11D48]"
                  >
                    <p className="text-xs font-semibold text-[#FB7185]">{p.question}</p>
                    <p className="text-sm text-white mt-1">“{p.answer}”</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: EDITAR PERFIL COMPLETO (With interactive chip selectors like BDSM tab + 3 optional questions) */}
      {activeSubTab === 'edit' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Section 1: Fotos do Perfil (Estilo Tinder Grid — Adjusted per Image 5) */}
          <div className="velvet-card rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#FB7185]" />
                  Fotos do Seu Cartão (Estilo Tinder)
                </h2>
                <p className="text-xs text-[#FAF5F6]/60">
                  Escolha sua foto principal e adicione fotos extras para sua galeria.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowProfilePhotoUploader(!showProfilePhotoUploader)}
                  className="px-3.5 py-2 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-xs font-bold text-white flex items-center gap-1.5 shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>
                    {showProfilePhotoUploader
                      ? 'Fechar Upload'
                      : '+ Enviar do Computador / Galeria'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('preview')}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-[#FAF5F6] flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-[#FB7185]" />
                  <span>Pré-visualizar</span>
                </button>
              </div>
            </div>

            {showProfilePhotoUploader && (
              <div className="p-4 rounded-2xl bg-[#0F0E11] border border-[#E11D48]/40 space-y-3">
                <MediaUploadPicker
                  label="Adicionar Nova Foto do Computador, Galeria do Celular/Tablet ou Câmera"
                  valueUrl={avatarUrl}
                  mediaType="image"
                  showBuiltInEditor={true}
                  onChangeMedia={(media: EditedMediaResult) => {
                    setAvatarUrl(media.url);
                    if (!photos.includes(media.url)) {
                      setPhotos((prev) => [media.url, ...prev]);
                    }
                  }}
                />
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {Array.from(
                new Set([
                  ...photos.filter(
                    (u) =>
                      !u.includes('1790885756648') && !u.includes('avatar_casal_1790885774921')
                  ),
                  ...DEMO_STOCK_PHOTOS
                ])
              ).map((photoUrl) => {
                const isMain = avatarUrl === photoUrl;
                const inGallery = photos.includes(photoUrl);
                return (
                  <div
                    key={photoUrl}
                    className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all group bg-[#0F0E11] ${
                      isMain
                        ? 'border-[#E11D48] ring-2 ring-[#E11D48]/30'
                        : inGallery
                        ? 'border-amber-400/60'
                        : 'border-white/10 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photoUrl}
                      alt="Foto do Cartão"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src =
                          '/src/assets/images/avatar_marcos_1790885768293.jpg';
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent flex flex-col justify-end p-2.5 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setAvatarUrl(photoUrl)}
                        className={`w-full py-1.5 rounded-xl text-[11px] font-bold transition-colors ${
                          isMain
                            ? 'bg-[#E11D48] text-white'
                            : 'bg-black/70 text-white hover:bg-[#E11D48]'
                        }`}
                      >
                        {isMain ? 'Foto Principal' : 'Usar Principal'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          inGallery
                            ? handleRemoveGalleryPhoto(photoUrl)
                            : handleAddGalleryPhoto(photoUrl)
                        }
                        className="w-full py-1 rounded-xl bg-white/15 hover:bg-white/25 text-[10px] font-medium text-white backdrop-blur-sm"
                      >
                        {inGallery ? 'Na Galeria ✓' : '+ Adicionar à Galeria'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Identidade & Bio */}
          <div className="velvet-card rounded-3xl p-5 sm:p-6 space-y-4">
            <h2 className="text-base font-bold text-white">Informações Básicas & Bio</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#FAF5F6]/70 block mb-1.5">
                  Nome ou Apelido do Perfil
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#0D090B] border border-white/10 text-sm text-white focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="text-xs text-[#FAF5F6]/70 block mb-1.5">Idade</label>
                <input
                  type="number"
                  min={18}
                  max={80}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#0D090B] border border-white/10 text-sm text-white focus:outline-none focus:border-[#E11D48]"
                />
              </div>
            </div>

            {/* Dynamic Location Picker (De onde você é de forma dinâmica) */}
            <DynamicLocationPicker
              value={city}
              onChange={(newCity, isImp) => {
                setCity(newCity);
                if (typeof isImp === 'boolean') {
                  setHeightUnit(isImp ? 'ft' : 'cm');
                }
              }}
            />

            <div>
              <label className="text-xs text-[#FAF5F6]/70 block mb-1.5">
                Apresentação / Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Conte um pouco sobre sua vibe, o que te atrai e o que procura..."
                className="w-full px-4 py-3 rounded-2xl bg-[#0D090B] border border-white/10 text-sm text-white focus:outline-none focus:border-[#E11D48]"
              />
            </div>
          </div>

          {/* Section 3: Altura, Filhos e Estilo Pessoal (Interactive Chip Selections like BDSM tab) */}
          <div className="velvet-card rounded-3xl p-5 sm:p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#FB7185]" />
                Altura, Filhos & Estilo de Vida (Seleção Rápida)
              </h2>
              <p className="text-xs text-[#FAF5F6]/60">
                Toque nos botões para selecionar suas características como na aba de BDSM.
              </p>
            </div>

            {/* Altura (Compact & Efficient Slider + Smaller Unit Toggle per Image 2) */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-semibold text-[#FAF5F6] flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-[#FB7185]" />
                  <span>Sua Altura:</span>
                  <strong className="text-sm text-white font-bold">{formatHeight(heightCm)}</strong>
                </label>

                <button
                  type="button"
                  onClick={handleDetectLocationUnit}
                  className="px-2 py-0.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[10px] text-[#FAF5F6]/60 flex items-center gap-1"
                  title="Priorizar unidade pela localização"
                >
                  <MapPin className="w-2.5 h-2.5 text-[#FB7185]" />
                  <span>{locationUnitLabel}</span>
                </button>
              </div>

              {/* Compact Box containing ONLY the circled controls from Image 2 */}
              <div className="max-w-md rounded-2xl bg-[#141318] border border-white/10 p-3.5 space-y-3 shadow-inner">
                {/* Fine Slider + Stepper Controls */}
                <div className="flex items-center gap-3 px-1">
                  <button
                    type="button"
                    onClick={() => setHeightCm((prev) => Math.max(140, prev - 1))}
                    className="w-8 h-8 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-bold text-sm flex items-center justify-center shrink-0"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min={140}
                    max={220}
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="flex-1 accent-[#E11D48] cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setHeightCm((prev) => Math.min(220, prev + 1))}
                    className="w-8 h-8 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-bold text-sm flex items-center justify-center shrink-0"
                  >
                    +
                  </button>
                </div>

                {/* Smaller, Compact Unit Toggle [ cm | pés ] + Helper Note */}
                <div className="pt-2 border-t border-white/[0.07] flex flex-col items-center gap-1.5">
                  <div className="inline-grid grid-cols-2 p-0.5 rounded-full bg-black/60 border border-white/15 w-28">
                    <button
                      type="button"
                      onClick={() => setHeightUnit('cm')}
                      className={`py-0.5 rounded-full text-[10px] font-bold transition-all ${
                        heightUnit === 'cm'
                          ? 'bg-white text-[#0F0E11] shadow'
                          : 'text-[#FAF5F6]/65 hover:text-white'
                      }`}
                    >
                      cm
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeightUnit('ft')}
                      className={`py-0.5 rounded-full text-[10px] font-bold transition-all ${
                        heightUnit === 'ft'
                          ? 'bg-white text-[#0F0E11] shadow'
                          : 'text-[#FAF5F6]/65 hover:text-white'
                      }`}
                    >
                      pés
                    </button>
                  </div>
                  <p className="text-[10px] text-[#FAF5F6]/45 text-center">
                    As informações que você adicionar aqui também serão exibidas para outras pessoas
                  </p>
                </div>
              </div>
            </div>

            {/* Filhos */}
            <div>
              <label className="text-xs font-semibold text-[#FAF5F6] flex items-center gap-1.5 mb-2">
                <Baby className="w-3.5 h-3.5 text-amber-300" />
                Deseja ter filhos?
              </label>
              <div className="flex flex-wrap gap-2">
                {CHILDREN_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setChildrenPreference(opt)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                      childrenPreference === opt
                        ? 'bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white border-transparent shadow-sm'
                        : 'bg-[#0D090B] text-[#FAF5F6]/70 border-white/10 hover:border-white/25'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Estilo de Relacionamento & O que busca */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#FAF5F6] flex items-center gap-1.5 mb-2">
                  <Users className="w-3.5 h-3.5 text-rose-400" />
                  Formato de Relacionamento
                </label>
                <div className="flex flex-wrap gap-2">
                  {RELATIONSHIP_STYLE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setRelationshipStyle(opt)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                        relationshipStyle === opt
                          ? 'bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white border-transparent shadow-sm'
                          : 'bg-[#0D090B] text-[#FAF5F6]/70 border-white/10 hover:border-white/25'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#FAF5F6] flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />O Que Mais Procura Aqui
                </label>
                <div className="flex flex-wrap gap-2">
                  {LOOKING_FOR_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setLookingFor(opt)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                        lookingFor === opt
                          ? 'bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white border-transparent shadow-sm'
                          : 'bg-[#0D090B] text-[#FAF5F6]/70 border-white/10 hover:border-white/25'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bebida, Tabaco & Signo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-[#FAF5F6] flex items-center gap-1.5 mb-2">
                  <Wine className="w-3.5 h-3.5 text-purple-300" />
                  Bebida / Drinks
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {DRINKING_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setDrinking(opt)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-medium border transition-all ${
                        drinking === opt
                          ? 'bg-[#E11D48] text-white border-[#E11D48]'
                          : 'bg-[#0D090B] text-[#FAF5F6]/70 border-white/10'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#FAF5F6] flex items-center gap-1.5 mb-2">
                  <Cigarette className="w-3.5 h-3.5 text-stone-300" />
                  Tabaco
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SMOKING_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSmoking(opt)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-medium border transition-all ${
                        smoking === opt
                          ? 'bg-[#E11D48] text-white border-[#E11D48]'
                          : 'bg-[#0D090B] text-[#FAF5F6]/70 border-white/10'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#FAF5F6] flex items-center gap-1.5 mb-2">
                  <Compass className="w-3.5 h-3.5 text-amber-300" />
                  Signo
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ZODIAC_OPTIONS.map((sign) => (
                    <button
                      key={sign}
                      type="button"
                      onClick={() => setZodiacSign(sign)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-all ${
                        zodiacSign === sign
                          ? 'bg-amber-500/25 text-amber-200 border-amber-400'
                          : 'bg-[#0D090B] text-[#FAF5F6]/65 border-white/10'
                      }`}
                    >
                      {sign}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Dinâmica & Fetiches BDSM (Interactive Chip Selections) */}
          <div className="velvet-card rounded-3xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#FB7185]" />
                  Preferências & Fetiches BDSM
                </h2>
                <p className="text-xs text-[#FAF5F6]/60">
                  Selecione seu papel, experiência e fetiches favoritos para facilitar o match.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenBdsmTest}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs font-semibold flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Refazer Teste BDSM
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#FAF5F6] block mb-2">
                  Papel Principal BDSM
                </label>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      'Dominante',
                      'Submisso(a)',
                      'Switch',
                      'Rigger (Shibari)',
                      'Voyeur',
                      'Exibicionista',
                      'Curioso(a)'
                    ] as const
                  ).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setBdsmRole(role)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        bdsmRole === role
                          ? 'bg-gradient-to-r from-[#E11D48] to-[#9F1239] text-white border-transparent shadow-sm'
                          : 'bg-[#0D090B] text-[#FAF5F6]/70 border-white/10'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#FAF5F6] block mb-2">
                  Nível de Experiência
                </label>
                <div className="flex flex-wrap gap-2">
                  {(
                    ['Iniciante', 'Intermediário', 'Experiente', 'Mestre / Avançado'] as const
                  ).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setBdsmExperience(lvl)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        bdsmExperience === lvl
                          ? 'bg-amber-500/25 text-amber-200 border-amber-400/70'
                          : 'bg-[#0D090B] text-[#FAF5F6]/70 border-white/10'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#FAF5F6] block mb-2">
                Fetiches & Práticas de Interesse ({selectedFetishes.length} selecionados)
              </label>
              <div className="flex flex-wrap gap-2">
                {BDSM_FETISH_OPTIONS.map((fetish) => {
                  const active = selectedFetishes.includes(fetish);
                  return (
                    <button
                      key={fetish}
                      type="button"
                      onClick={() => toggleFetish(fetish)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                        active
                          ? 'bg-gradient-to-r from-[#E11D48] to-[#9F1239] text-white border-transparent shadow-sm'
                          : 'bg-[#0D090B] text-[#FAF5F6]/70 border-white/10 hover:border-white/25'
                      }`}
                    >
                      {active && <Check className="w-3.5 h-3.5" />}
                      <span>{fetish}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 5: Gostos em Geral & Estilo de Vida (Chip Selectors) */}
          <div className="velvet-card rounded-3xl p-5 sm:p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">
                Gostos em Geral & Estilo de Vida ({selectedHobbies.length} selecionados)
              </h2>
              <p className="text-xs text-[#FAF5F6]/60">
                Selecione seus gostos musicais, gastronômicos, culturais e noturnos.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {allHobbies.map((hobby) => {
                const active = selectedHobbies.includes(hobby.name);
                return (
                  <button
                    key={hobby.id}
                    type="button"
                    onClick={() => toggleHobby(hobby.name)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                      active
                        ? 'bg-amber-500/20 border-amber-400/60 text-amber-200'
                        : 'bg-[#0D090B] border-white/10 text-[#FAF5F6]/70 hover:border-white/25'
                    }`}
                  >
                    {active && <Check className="w-3.5 h-3.5" />}
                    <span>{hobby.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 mt-3 max-w-md">
              <input
                type="text"
                value={customHobbyInput}
                onChange={(e) => setCustomHobbyInput(e.target.value)}
                placeholder="Adicionar outro gosto pessoal..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#0D090B] border border-white/10 text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddCustomHobby}
                className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-semibold text-white flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar
              </button>
            </div>
          </div>

          {/* Section 6: 3 Perguntas de Perfil (Não Obrigatórias) */}
          <div className="velvet-card rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#FB7185]" />3 Perguntas Sobre Você (Não
                  Obrigatórias)
                </h2>
                <p className="text-xs text-[#FAF5F6]/60">
                  Escolha até 3 perguntas para que outras pessoas saibam mais sobre você e puxem conversa.
                </p>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.05] text-[#FAF5F6]/60">
                Opcional
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {prompts.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#0D090B]/90 border border-white/[0.08] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#FB7185]">
                      Pergunta {idx + 1} (Opcional)
                    </span>
                    {item.answer && (
                      <button
                        type="button"
                        onClick={() => updatePromptItem(idx, 'answer', '')}
                        className="text-[10px] text-[#FAF5F6]/45 hover:text-rose-400"
                      >
                        Limpar
                      </button>
                    )}
                  </div>

                  <select
                    value={item.question}
                    onChange={(e) => updatePromptItem(idx, 'question', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#161013] border border-white/10 text-xs text-white focus:outline-none focus:border-[#E11D48]"
                  >
                    {CURATED_PROFILE_QUESTIONS.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>

                  <textarea
                    rows={3}
                    value={item.answer}
                    onChange={(e) => updatePromptItem(idx, 'answer', e.target.value)}
                    placeholder="Escreva sua resposta aqui (ou deixe em branco)..."
                    className="w-full px-3 py-2 rounded-xl bg-[#161013] border border-white/10 text-xs text-white placeholder-[#FAF5F6]/35 focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Save Bar */}
          <div className="flex items-center justify-between gap-4 velvet-card rounded-2xl p-4">
            <div className="text-xs text-[#FAF5F6]/70">
              {saveFeedback ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Perfil atualizado! Confira em “Pré-visualizar Perfil”.
                </span>
              ) : (
                <span>Suas alterações ficam visíveis imediatamente no seu cartão.</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSubTab('preview')}
                className="px-4 py-2.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.14] text-xs font-semibold text-white flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4" />
                Pré-visualizar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:brightness-110 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-[#E11D48]/30"
              >
                <Save className="w-4 h-4" />
                Salvar Perfil
              </button>
            </div>
          </div>
        </form>
      )}

      {/* MODE 3: ESTÚDIO DE VENDAS DE CONTEÚDO ADULTO (+18 Creator Platform Style) */}
      {activeSubTab === 'seller' && !user.privacySettings?.blockAdultSalesTabs && (
        <div className="space-y-6">
          {!existingSeller.isSellerVerified ? (
            <div className="velvet-card rounded-3xl p-6 sm:p-8 space-y-6 border border-[#E11D48]/30">
              <div className="border-b border-white/10 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#FB7185]">
                    Ativação Oficial de Vendedor(a) +18
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-display mt-1">
                    Ative Seu Selo de Vendedor +18 para Monetizar
                  </h2>
                  <p className="text-xs sm:text-sm text-[#FAF5F6]/65 mt-1">
                    Novas contas não iniciam com o selo de vendedor. Para liberar seu Estúdio de Vendas +18, confirme sua verificação, aceite os termos e realize o pagamento da <strong>taxa única de adesão de R$ 50,00</strong>.
                  </p>
                </div>
                <div className="shrink-0 px-4 py-3 rounded-2xl bg-[#141218] border border-amber-400/35 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold block">
                    Taxa Única de Ativação
                  </span>
                  <span className="text-2xl font-extrabold text-white font-display">R$ 50,00</span>
                  <span className="text-[10px] text-emerald-400 block">Pagamento único · Vitalício</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`p-4 rounded-2xl border ${
                    user.isVerified
                      ? 'bg-emerald-500/10 border-emerald-500/40'
                      : 'bg-[#0F0E11] border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">1. Verificação RG/CNH + Facial</span>
                    {user.isVerified ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <p className="text-xs text-[#FAF5F6]/65 mb-3">
                    Obrigatório ter o perfil verificado por documento oficial com foto e biometria facial +18.
                  </p>
                  {user.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <Check className="w-3.5 h-3.5" /> Identidade Já Verificada
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={onStartVerify}
                      className="w-full py-2 rounded-xl bg-[#E11D48] text-white text-xs font-bold"
                    >
                      Fazer Verificação Agora
                    </button>
                  )}
                </div>

                <div
                  className={`p-4 rounded-2xl border ${
                    accepted25FeeTerms && acceptedSellerPermissions
                      ? 'bg-emerald-500/10 border-emerald-500/40'
                      : 'bg-[#0F0E11] border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">2. Aceite de Termos & Permissões</span>
                    <FileCheck2 className="w-4 h-4 text-[#FB7185]" />
                  </div>
                  <p className="text-xs text-[#FAF5F6]/65">
                    Aceite os termos de direitos de imagem +18, proteção DRM e regras de níveis (taxas de 15% a 6% + VIP Cortesia).
                  </p>
                </div>

                <div
                  className={`p-4 rounded-2xl border ${
                    sellerActivationFeePaid
                      ? 'bg-emerald-500/10 border-emerald-500/40'
                      : 'bg-[#0F0E11] border-amber-400/35'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">3. Taxa Única (R$ 50,00)</span>
                    {sellerActivationFeePaid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <DollarSign className="w-4 h-4 text-amber-300" />
                    )}
                  </div>
                  <p className="text-xs text-[#FAF5F6]/65">
                    Taxa única de R$ 50,00 para validação antifraude, liberação da vitrine +18, Lives e Selo de Vendedor.
                  </p>
                </div>
              </div>

              <form onSubmit={handleCompleteSellerOnboarding} className="space-y-5 pt-2">
                {/* Step 2 Details: Bank Account & Terms Checkboxes */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#0F0E11] border border-white/10 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-[#FB7185]" />
                    Dados Bancários & PIX para Receber Seus Saques
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-[#FAF5F6]/70 block mb-1">
                        Instituição Bancária
                      </label>
                      <input
                        type="text"
                        required
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#17151A] border border-white/15 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#FAF5F6]/70 block mb-1">CPF do Titular</label>
                      <input
                        type="text"
                        required
                        placeholder="000.000.000-00"
                        value={cpfHolder}
                        onChange={(e) => setCpfHolder(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#17151A] border border-white/15 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#FAF5F6]/70 block mb-1">
                        Chave PIX para Saques
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Sua chave PIX..."
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#17151A] border border-white/15 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#17151A] border border-white/10 text-xs text-[#FAF5F6]/85 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={accepted25FeeTerms}
                        onChange={(e) => setAccepted25FeeTerms(e.target.checked)}
                        className="mt-0.5 accent-[#E11D48]"
                      />
                      <span>
                        <strong>Aceito os Termos de Criador +18:</strong> Declaro ser maior de 18 anos, titular exclusivo dos direitos de imagem das mídias publicadas e concordo com as taxas progressivas por nível (15% Bronze, 10% Prata, 6% Ouro).
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#17151A] border border-white/10 text-xs text-[#FAF5F6]/85 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptedSellerPermissions}
                        onChange={(e) => setAcceptedSellerPermissions(e.target.checked)}
                        className="mt-0.5 accent-[#E11D48]"
                      />
                      <span>
                        <strong>Aceito as Permissões de Venda & Segurança DRM:</strong> Autorizo a aplicação de marca d’água forense invisível contra vazamentos e concordo com a taxa única de ativação de R$ 50,00 para emissão do Selo de Vendedor +18.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Step 3 Details: R$ 50,00 One-Time Fee Payment Gateway */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#0F0E11] border border-white/10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-amber-300" />
                        Pagamento da Taxa Única de Ativação (R$ 50,00)
                      </h3>
                      <p className="text-xs text-[#FAF5F6]/60">
                        Escolha sua forma de pagamento preferida para liberar imediatamente o Selo de Vendedor +18:
                      </p>
                    </div>
                    {sellerActivationFeePaid && (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Taxa de R$ 50,00 Confirmada ✓
                      </span>
                    )}
                  </div>

                  {/* Payment Method Selector Tabs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSellerFeePaymentMethod('pix')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                        sellerFeePaymentMethod === 'pix'
                          ? 'bg-[#E11D48]/15 border-[#E11D48] text-white'
                          : 'bg-[#17151A] border-white/10 text-[#FAF5F6]/70'
                      }`}
                    >
                      <QrCode className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-xs font-bold">PIX Instantâneo</p>
                        <p className="text-[10px] opacity-70">Liberação em segundos</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSellerFeePaymentMethod('card')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                        sellerFeePaymentMethod === 'card'
                          ? 'bg-[#E11D48]/15 border-[#E11D48] text-white'
                          : 'bg-[#17151A] border-white/10 text-[#FAF5F6]/70'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-[#FB7185] shrink-0" />
                      <div>
                        <p className="text-xs font-bold">Cartão de Crédito</p>
                        <p className="text-[10px] opacity-70">Fatura discreta "AP DIGITAL"</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSellerFeePaymentMethod('wallet')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                        sellerFeePaymentMethod === 'wallet'
                          ? 'bg-[#E11D48]/15 border-[#E11D48] text-white'
                          : 'bg-[#17151A] border-white/10 text-[#FAF5F6]/70'
                      }`}
                    >
                      <Wallet className="w-5 h-5 text-amber-300 shrink-0" />
                      <div>
                        <p className="text-xs font-bold">Carteira / Saldo</p>
                        <p className="text-[10px] opacity-70">Débito imediato sem taxas</p>
                      </div>
                    </button>
                  </div>

                  {/* Method Specific Box */}
                  {sellerFeePaymentMethod === 'pix' && (
                    <div className="p-4 rounded-xl bg-[#17151A] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="space-y-1.5 text-xs">
                        <span className="text-emerald-400 font-bold block">
                          Chave PIX Copia e Cola (R$ 50,00 · Destino: Aura Privé Pagamentos):
                        </span>
                        <code className="block p-2 rounded-lg bg-black/50 text-[11px] text-white/80 font-mono break-all">
                          00020126580014BR.GOV.BCB.PIX0136auraprive-ativacao-vendedor-50reais520400005303986540550.005802BR
                        </code>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(
                              '00020126580014BR.GOV.BCB.PIX0136auraprive-ativacao-vendedor-50reais520400005303986540550.005802BR'
                            );
                            setCopiedSellerPix(true);
                            setTimeout(() => setCopiedSellerPix(false), 2000);
                          }}
                          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white flex items-center gap-1.5"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedSellerPix ? 'PIX Copiado!' : 'Copiar PIX'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSellerActivationFeePaid(true);
                            setSellerOnboardingError(null);
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>
                            {sellerActivationFeePaid
                              ? 'Pagamento PIX Confirmado ✓'
                              : 'Confirmar Pagamento PIX (R$ 50,00)'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {sellerFeePaymentMethod === 'card' && (
                    <div className="p-4 rounded-xl bg-[#17151A] border border-white/10 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-2">
                          <label className="text-[11px] text-[#FAF5F6]/70 block mb-1">
                            Número do Cartão
                          </label>
                          <input
                            type="text"
                            value={sellerCardNumber}
                            onChange={(e) => setSellerCardNumber(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-[#0F0E11] border border-white/15 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-[#FAF5F6]/70 block mb-1">Validade</label>
                          <input
                            type="text"
                            value={sellerCardExpiry}
                            onChange={(e) => setSellerCardExpiry(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-[#0F0E11] border border-white/15 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-[#FAF5F6]/70 block mb-1">CVV</label>
                          <input
                            type="text"
                            value={sellerCardCvv}
                            onChange={(e) => setSellerCardCvv(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-[#0F0E11] border border-white/15 text-xs text-white font-mono"
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <span className="text-[11px] text-[#FAF5F6]/60">
                          Nome no cartão: {sellerCardHolder} • Cobrança única de R$ 50,00 sem recorrência.
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSellerActivationFeePaid(true);
                            setSellerOnboardingError(null);
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>
                            {sellerActivationFeePaid
                              ? 'Cartão Aprovado (R$ 50,00) ✓'
                              : 'Pagar R$ 50,00 no Cartão'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {sellerFeePaymentMethod === 'wallet' && (
                    <div className="p-4 rounded-xl bg-[#17151A] border border-white/10 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-[#FAF5F6]/80">
                        Utilize seu saldo interno ou crédito pré-aprovado para quitar a taxa única de ativação de <strong>R$ 50,00</strong>.
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSellerActivationFeePaid(true);
                          setSellerOnboardingError(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>
                          {sellerActivationFeePaid
                            ? 'Saldo Debitado (R$ 50,00) ✓'
                            : 'Pagar R$ 50,00 com Carteira'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {sellerOnboardingError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 font-medium">
                    {sellerOnboardingError}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-[#FAF5F6]/60">
                    Status dos requisitos:{' '}
                    <strong className={user.isVerified ? 'text-emerald-400' : 'text-amber-300'}>
                      {user.isVerified ? '1. Verificado ✓' : '1. Verificação Pendente'}
                    </strong>{' '}
                    •{' '}
                    <strong
                      className={
                        accepted25FeeTerms && acceptedSellerPermissions
                          ? 'text-emerald-400'
                          : 'text-amber-300'
                      }
                    >
                      {accepted25FeeTerms && acceptedSellerPermissions
                        ? '2. Termos Aceitos ✓'
                        : '2. Aceite os Termos'}
                    </strong>{' '}
                    •{' '}
                    <strong
                      className={sellerActivationFeePaid ? 'text-emerald-400' : 'text-amber-300'}
                    >
                      {sellerActivationFeePaid
                        ? '3. Taxa R$ 50 Paga ✓'
                        : '3. Taxa R$ 50 Pendente'}
                    </strong>
                  </span>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Concluir Ativação e Liberar Selo de Vendedor +18</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* ACTIVE ADULT CREATOR STUDIO (Inspired by Privacy / OnlyFans) */
            <>
              <div className="velvet-card rounded-[32px] overflow-hidden border border-white/10">
                <div className="h-32 sm:h-40 bg-gradient-to-r from-[#4C0519] via-[#9F1239] to-[#1F1218] relative p-5 flex items-end justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatarUrl}
                      alt={name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-xl"
                    />
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-400/30">
                        ESTÚDIO DE CRIADOR VERIFICADO +18
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-white font-display mt-1">
                        {existingSeller.stageName || name}
                      </h2>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 bg-black/45 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10">
                    <span className="text-xs text-[#FAF5F6]/70">Assinatura Mensal:</span>
                    <span className="text-sm font-bold text-emerald-400">
                      R$ {Number(monthlySubPrice || 39.9).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Quick Financial & Audience KPIs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.07] bg-[#140D10]">
                  <div className="p-4">
                    <span className="text-[11px] text-[#FAF5F6]/55 block">
                      Saldo Disponível para Saque
                    </span>
                    <p className="text-lg sm:text-xl font-bold text-emerald-400 mt-0.5">
                      R$ {existingSeller.grossBalance.toFixed(2)}
                    </p>
                    <span className="text-[10px] text-[#FAF5F6]/65">
                      Líquido ({activeTierConfig.netPercent}%): R${' '}
                      {(existingSeller.grossBalance * activeNetDecimal).toFixed(2)}
                    </span>
                  </div>

                  <div className="p-4">
                    <span className="text-[11px] text-[#FAF5F6]/55 block">Nível de Vendedor & Taxa</span>
                    <p className="text-sm sm:text-base font-bold text-amber-300 mt-0.5">
                      {activeTierConfig.name}
                    </p>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      Taxa Justa: apenas {activeTierConfig.feePercent}% • {activeTierConfig.vipBenefit}
                    </span>
                  </div>

                  <div className="p-4">
                    <span className="text-[11px] text-[#FAF5F6]/55 block">Assinantes Ativos</span>
                    <p className="text-lg sm:text-xl font-bold text-white mt-0.5">
                      {existingSeller.subscribersCount} fãs
                    </p>
                    <span className="text-[10px] text-[#FAF5F6]/45">Lives + VIP Liberados</span>
                  </div>

                  <div className="p-4">
                    <span className="text-[11px] text-[#FAF5F6]/55 block">Mídias Publicadas</span>
                    <p className="text-lg sm:text-xl font-bold text-[#FB7185] mt-0.5">
                      {(existingSeller.items || []).length} itens
                    </p>
                    <span className="text-[10px] text-[#FAF5F6]/45">Marca d'água DRM ativa</span>
                  </div>
                </div>

                {/* 3 SELLER LEVELS & VIP PERKS PROGRESS PANEL */}
                <div className="p-5 bg-[#120C0F] border-t border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        <h3 className="text-sm font-bold text-white">
                          Programa de 3 Níveis de Vendedor (Quanto Maior o Nível, Menor a Taxa de Saque)
                        </h3>
                      </div>
                      <p className="text-xs text-[#FAF5F6]/65 mt-0.5">
                        Todo vendedor verificado tem <strong>Acesso VIP Cortesia</strong> e pode transmitir Lives. Suba de nível para reduzir sua taxa de saque até <strong>6%</strong> e ganhar destaque máximo:
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/35 text-emerald-300 text-[11px] font-bold shrink-0">
                      VIP de Vendedor Ativo ✓
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {SELLER_LEVEL_TIERS.map((tier) => {
                      const isCurrent = currentSellerLevel === tier.level;
                      return (
                        <div
                          key={tier.level}
                          onClick={() => handleSelectSellerLevel(tier.level)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                            isCurrent
                              ? 'bg-gradient-to-b from-[#E11D48]/20 to-[#0D090B] border-[#E11D48] ring-2 ring-[#E11D48]/35 shadow-lg'
                              : 'bg-[#0D090B]/90 border-white/10 hover:border-white/25'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                <Crown className="w-3.5 h-3.5 text-amber-400" />
                                {tier.name}
                              </span>
                              {isCurrent && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E11D48] text-white font-bold">
                                  Nível Atual
                                </span>
                              )}
                            </div>

                            <div className="my-2 p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-[#FAF5F6]/55 block">Taxa de Saque</span>
                                <span className="text-lg font-bold text-amber-300 font-display">
                                  {tier.feePercent}%
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-[#FAF5F6]/55 block">Você Recebe</span>
                                <span className="text-lg font-bold text-emerald-400 font-display">
                                  {tier.netPercent}% Líquido
                                </span>
                              </div>
                            </div>

                            <p className="text-[11px] text-[#FB7185] font-semibold mb-2">
                              Meta: {tier.requirement}
                            </p>

                            <ul className="space-y-1.5 text-[11px] text-[#FAF5F6]/80">
                              {tier.perks.map((perk, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <Zap className="w-3 h-3 text-amber-300 shrink-0 mt-0.5" />
                                  <span>{perk}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectSellerLevel(tier.level);
                            }}
                            className={`mt-3 w-full py-2 rounded-xl text-xs font-bold transition-all ${
                              isCurrent
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                                : 'bg-white/[0.07] hover:bg-[#E11D48] text-white'
                            }`}
                          >
                            {isCurrent
                              ? `Nível ${tier.level} Ativo (${tier.feePercent}% taxa)`
                              : `Simular / Ativar Nível ${tier.level}`}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Creator Studio Sub-Navigation */}
                <div className="p-3 bg-[#0D090B] border-t border-white/[0.07] flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSellerStudioSection('catalog')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      sellerStudioSection === 'catalog'
                        ? 'bg-[#E11D48] text-white'
                        : 'bg-white/[0.04] text-[#FAF5F6]/70 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Vitrine & Categorias (+18)
                  </button>

                  <button
                    type="button"
                    onClick={() => setSellerStudioSection('finances')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      sellerStudioSection === 'finances'
                        ? 'bg-[#E11D48] text-white'
                        : 'bg-white/[0.04] text-[#FAF5F6]/70 hover:text-white'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    Saques & Relatórios de Ganhos
                  </button>

                  <button
                    type="button"
                    onClick={() => setSellerStudioSection('communities')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      sellerStudioSection === 'communities'
                        ? 'bg-[#E11D48] text-white'
                        : 'bg-white/[0.04] text-[#FAF5F6]/70 hover:text-white'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    Meus Grupos, Membros & Cargos
                  </button>
                </div>
              </div>

              {/* SUB-SECTION 1: VITRINE & CATEGORIAS (+18) */}
              {sellerStudioSection === 'catalog' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left: Publish New Content Form with Category & Self-Destruct */}
                  <form
                    onSubmit={handleAddSellerMedia}
                    className="lg:col-span-5 velvet-card rounded-3xl p-5 space-y-4"
                  >
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-[#FB7185]" />
                      Publicar Novo Conteúdo +18
                    </h3>

                    <div>
                      <label className="text-xs text-[#FAF5F6]/70 block mb-1">
                        Título do Ensaio ou Vídeo
                      </label>
                      <input
                        type="text"
                        required
                        value={newMediaTitle}
                        onChange={(e) => setNewMediaTitle(e.target.value)}
                        placeholder="Ex: Ensaio Lingerie Vermelha (Sem Censura)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D090B] border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-[#FAF5F6]/70 block mb-1.5">
                        Categoria da Plataforma +18
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {ADULT_CONTENT_CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setNewMediaCategory(cat)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-medium border transition-all ${
                              newMediaCategory === cat
                                ? 'bg-[#E11D48] text-white border-[#E11D48]'
                                : 'bg-[#0D090B] text-[#FAF5F6]/70 border-white/10'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[#FAF5F6]/70 block mb-1">Formato</label>
                        <select
                          value={newMediaType}
                          onChange={(e) =>
                            setNewMediaType(e.target.value as 'image' | 'video')
                          }
                          className="w-full px-3 py-2.5 rounded-xl bg-[#0D090B] border border-white/10 text-xs text-white"
                        >
                          <option value="image">Ensaio de Fotos</option>
                          <option value="video">Vídeo Completo 4K</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-[#FAF5F6]/70 block mb-1">
                          Preço Avulso (R$)
                        </label>
                        <input
                          type="text"
                          value={newMediaPrice}
                          onChange={(e) => setNewMediaPrice(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D090B] border border-white/10 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-[#FAF5F6]/70 block mb-1.5">
                        Tempo de Autodestruição Após Compra
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { mins: 0, label: 'Permanente' },
                          { mins: 60, label: '1 Hora' },
                          { mins: 1440, label: '24 Horas' },
                          { mins: 10080, label: '7 Dias' }
                        ].map((t) => (
                          <button
                            key={t.mins}
                            type="button"
                            onClick={() => setNewMediaDestructMins(t.mins)}
                            className={`py-2 rounded-xl text-[11px] font-semibold border ${
                              newMediaDestructMins === t.mins
                                ? 'bg-amber-500/25 border-amber-400 text-amber-200'
                                : 'bg-[#0D090B] border-white/10 text-[#FAF5F6]/65'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <MediaUploadPicker
                      label="Selecionar Foto ou Vídeo (Pastas do Computador ou Galeria do Celular/Tablet)"
                      valueUrl={newMediaUrl}
                      mediaType={newMediaType}
                      showBuiltInEditor={true}
                      onChangeMedia={(media: EditedMediaResult) => {
                        setNewMediaUrl(media.url);
                        setNewMediaType(media.mediaType);
                      }}
                    />

                    <label className="flex items-center gap-2 text-xs text-[#FAF5F6]/80 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={postAlsoToMoments}
                        onChange={(e) => setPostAlsoToMoments(e.target.checked)}
                        className="accent-[#E11D48]"
                      />
                      Divulgar prévia bloqueada também em Momentos Liberais
                    </label>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white text-xs font-bold shadow-lg shadow-[#E11D48]/25"
                    >
                      Publicar na Minha Vitrine +18
                    </button>
                  </form>

                  {/* Right: Categorized Content Vault */}
                  <div className="lg:col-span-7 velvet-card rounded-3xl p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-white">
                        Meu Acervo por Categoria ({filteredCatalogItems.length})
                      </h3>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                      {(['Todas', ...ADULT_CONTENT_CATEGORIES] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCatalogCategory(cat)}
                          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            selectedCatalogCategory === cat
                              ? 'bg-[#E11D48] text-white border-[#E11D48]'
                              : 'bg-[#0D090B] text-[#FAF5F6]/70 border-white/10'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredCatalogItems.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-2xl overflow-hidden bg-[#0D090B] border border-white/10 flex flex-col justify-between"
                        >
                          <div className="relative h-44">
                            <img
                              src={item.mediaUrl}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
                            <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 text-[10px] font-semibold text-[#FB7185] border border-white/10">
                              {item.category || 'Exclusivo +18'}
                            </span>
                            <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#E11D48] text-white text-xs font-bold">
                              R$ {item.price.toFixed(2)}
                            </span>
                            <div className="absolute bottom-2.5 left-3 right-3">
                              <h4 className="text-sm font-bold text-white truncate">
                                {item.title}
                              </h4>
                            </div>
                          </div>

                          <div className="p-3.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3 text-[#FAF5F6]/65">
                              <span>{item.salesCount} vendas</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-300" />
                                {!item.selfDestructMins
                                  ? 'Permanente'
                                  : item.selfDestructMins === 60
                                  ? '1h'
                                  : item.selfDestructMins === 1440
                                  ? '24h'
                                  : '7d'}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteSellerMedia(item.id)}
                              className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-300"
                              title="Remover conteúdo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-SECTION 2: SAQUES & RELATÓRIOS DE GANHOS DETALHADOS */}
              {sellerStudioSection === 'finances' && (
                <div className="space-y-6">
                  {/* Withdrawal Request Card */}
                  <div className="velvet-card rounded-3xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-7 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                        Central de Saques PIX · Repasse Transparente
                      </span>
                      <h3 className="text-xl font-bold text-white">
                        Solicitar Transferência para Conta Verificada
                      </h3>
                      <p className="text-xs text-[#FAF5F6]/65 leading-relaxed">
                        Conta vinculada: <strong>{existingSeller.bankAccount.bankName}</strong> •
                        Chave PIX: <strong>{existingSeller.bankAccount.pixKey}</strong>. Conforme os
                        termos aceitos, a plataforma retém 25% de taxa operacional em cada saque.
                      </p>

                      {payoutSuccessMsg && (
                        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-xs text-emerald-200 font-medium mt-3">
                          {payoutSuccessMsg}
                        </div>
                      )}
                    </div>

                    <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0D090B] border border-white/10 space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#FAF5F6]/60">Saldo Bruto Disponível:</span>
                        <span className="font-bold text-white">
                          R$ {existingSeller.grossBalance.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[#FAF5F6]/60">
                          Taxa do {activeTierConfig.name} ({activeTierConfig.feePercent}%):
                        </span>
                        <span className="font-semibold text-rose-400">
                          - R$ {(existingSeller.grossBalance * activeFeeDecimal).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                        <span className="font-bold text-[#FAF5F6]">
                          Valor Líquido ({activeTierConfig.netPercent}%):
                        </span>
                        <span className="font-bold text-emerald-400">
                          R$ {(existingSeller.grossBalance * activeNetDecimal).toFixed(2)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleRequestWithdrawal}
                        disabled={existingSeller.grossBalance <= 0}
                        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Wallet className="w-4 h-4" />
                        Sacar Agora via PIX ({activeTierConfig.netPercent}% Líquido)
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Relatórios de Ganhos & Histórico de Transações */}
                  <div className="velvet-card rounded-3xl p-6 space-y-5">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-[#FB7185]" />
                        Relatório Detalhado de Ganhos, Vendas & Assinaturas
                      </h3>
                      <p className="text-xs text-[#FAF5F6]/60">
                        Extrato completo de cada venda avulsa (PPV), assinatura mensal, gorjeta e histórico de saques realizados.
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-[11px] uppercase text-[#FAF5F6]/50">
                            <th className="py-3 px-3">Data</th>
                            <th className="py-3 px-3">Tipo de Receita</th>
                            <th className="py-3 px-3">Conteúdo / Origem</th>
                            <th className="py-3 px-3">Comprador</th>
                            <th className="py-3 px-3">Valor Bruto</th>
                            <th className="py-3 px-3">Taxa (25%)</th>
                            <th className="py-3 px-3">Seu Líquido (75%)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.06] text-xs">
                          {(existingSeller.earningsHistory || []).map((entry) => (
                            <tr
                              key={entry.id}
                              className="hover:bg-white/[0.03] transition-colors"
                            >
                              <td className="py-3.5 px-3 text-[#FAF5F6]/70">{entry.date}</td>
                              <td className="py-3.5 px-3">
                                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] text-[11px] text-amber-200 font-semibold">
                                  {entry.sourceType}
                                </span>
                              </td>
                              <td className="py-3.5 px-3 font-medium text-white">
                                {entry.itemTitle}
                              </td>
                              <td className="py-3.5 px-3 text-[#FB7185]">{entry.buyerAlias}</td>
                              <td className="py-3.5 px-3 font-mono text-white">
                                R$ {entry.grossAmount.toFixed(2)}
                              </td>
                              <td className="py-3.5 px-3 font-mono text-rose-400">
                                - R$ {entry.platformFee25.toFixed(2)}
                              </td>
                              <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">
                                R$ {entry.netAmount75.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Histórico de Saques PIX */}
                    {(existingSeller.withdrawals || []).length > 0 && (
                      <div className="pt-4 border-t border-white/10 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#FAF5F6]/60">
                          Histórico de Saques PIX Realizados
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {existingSeller.withdrawals.map((wd) => (
                            <div
                              key={wd.id}
                              className="p-3.5 rounded-2xl bg-[#0D090B] border border-white/10 flex items-center justify-between text-xs"
                            >
                              <div>
                                <p className="font-bold text-white">
                                  Líquido: R$ {wd.netAmount75.toFixed(2)}
                                </p>
                                <p className="text-[11px] text-[#FAF5F6]/55">
                                  Bruto R$ {wd.grossAmount.toFixed(2)} (Taxa 25%: -R${' '}
                                  {wd.platformFee25.toFixed(2)})
                                </p>
                                <span className="text-[10px] text-[#FAF5F6]/45">
                                  {wd.requestedAt} • {wd.destinationPix}
                                </span>
                              </div>
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                                {wd.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUB-SECTION 3: COMUNIDADES, GRUPOS, CARGOS E EXCLUSÃO */}
              {sellerStudioSection === 'communities' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Create New Group */}
                  <div className="lg:col-span-5 velvet-card rounded-3xl p-5 space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-[#FB7185]" />
                      Criar Nova Comunidade ou Clube
                    </h3>

                    <div>
                      <label className="text-xs text-[#FAF5F6]/70 block mb-1">
                        Nome do Grupo / Comunidade
                      </label>
                      <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Ex: Clube VIP Secreto"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D090B] border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-[#FAF5F6]/70 block mb-1">Descrição</label>
                      <textarea
                        rows={2}
                        value={groupDesc}
                        onChange={(e) => setGroupDesc(e.target.value)}
                        placeholder="Benefícios, prévias e regras do grupo..."
                        className="w-full px-3.5 py-2 rounded-xl bg-[#0D090B] border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[#FAF5F6]/70 block mb-1">Categoria</label>
                        <select
                          value={groupCategory}
                          onChange={(e) =>
                            setGroupCategory(e.target.value as GroupConversation['category'])
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#0D090B] border border-white/10 text-xs text-white"
                        >
                          <option value="Comunidade de Criador">Comunidade de Criador</option>
                          <option value="Clube Exclusivo">Clube Exclusivo</option>
                          <option value="BDSM & Fetiche">BDSM & Fetiche</option>
                          <option value="Encontros & Lifestyle">Encontros & Lifestyle</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-[#FAF5F6]/70 block mb-1">
                          Taxa de Acesso (R$)
                        </label>
                        <input
                          type="text"
                          value={groupEntryFee}
                          onChange={(e) => setGroupEntryFee(e.target.value)}
                          placeholder="0 para grátis"
                          className="w-full px-3 py-2 rounded-xl bg-[#0D090B] border border-white/10 text-xs text-white"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-xs text-[#FAF5F6]/80 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={groupIsPrivate}
                        onChange={(e) => setGroupIsPrivate(e.target.checked)}
                        className="accent-[#E11D48]"
                      />
                      Comunidade privada
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        if (!groupName.trim() || !onCreateGroup) return;
                        const fee = parseFloat(groupEntryFee.replace(',', '.')) || 0;
                        onCreateGroup({
                          title: groupName.trim(),
                          description:
                            groupDesc.trim() || 'Comunidade oficial gerenciada no Aura Privé.',
                          category: groupCategory,
                          isPrivate: groupIsPrivate,
                          subscriptionFee: fee > 0 ? fee : undefined
                        });
                        setGroupName('');
                        setGroupDesc('');
                      }}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white text-xs font-bold"
                    >
                      Criar Comunidade
                    </button>
                  </div>

                  {/* Manage Existing Groups: Roles & Delete Group */}
                  <div className="lg:col-span-7 velvet-card rounded-3xl p-5 space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Gerenciar Grupos, Cargos dos Membros & Exclusão ({groups.length})
                      </h3>
                      <p className="text-xs text-[#FAF5F6]/60">
                        Coloque cargos nos membros (Fundador, Administrador, Moderador, Criador VIP ou Membro) ou apague grupos.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {groups.map((grp) => (
                        <div
                          key={grp.id}
                          className="p-4 rounded-2xl bg-[#0D090B] border border-white/10 space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.07] pb-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={grp.avatarUrl}
                                alt={grp.title}
                                referrerPolicy="no-referrer"
                                className="w-11 h-11 rounded-xl object-cover"
                              />
                              <div>
                                <h4 className="text-sm font-bold text-white">{grp.title}</h4>
                                <span className="text-[11px] text-[#FAF5F6]/55">
                                  {grp.category} • {grp.members?.length || grp.membersCount} membros
                                </span>
                              </div>
                            </div>

                            {onDeleteGroup && (
                              <button
                                type="button"
                                onClick={() => onDeleteGroup(grp.id)}
                                className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-600 hover:text-white text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Apagar Grupo
                              </button>
                            )}
                          </div>

                          {/* Member Roles List inside Group */}
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FAF5F6]/50">
                              Cargos dos Membros neste Grupo:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {(grp.members || []).map((m) => (
                                <div
                                  key={m.id}
                                  className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-2"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <img
                                      src={m.avatarUrl}
                                      alt={m.name}
                                      referrerPolicy="no-referrer"
                                      className="w-7 h-7 rounded-lg object-cover shrink-0"
                                    />
                                    <div className="truncate">
                                      <p className="text-xs font-semibold text-white truncate">
                                        {m.name}
                                      </p>
                                      <span className="text-[10px] text-amber-300">{m.role}</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <select
                                      value={m.role}
                                      onChange={(e) =>
                                        onUpdateGroupMemberRole &&
                                        onUpdateGroupMemberRole(
                                          grp.id,
                                          m.id,
                                          e.target.value as GroupMemberRole
                                        )
                                      }
                                      className="px-2 py-1 rounded-lg bg-[#161013] border border-white/15 text-[10px] text-white"
                                    >
                                      <option value="Fundador(a)">Fundador(a)</option>
                                      <option value="Administrador(a)">Admin</option>
                                      <option value="Moderador(a)">Moderador</option>
                                      <option value="Criador VIP">Criador VIP</option>
                                      <option value="Membro">Membro</option>
                                    </select>

                                    {m.id !== user.id && m.id !== 'me' && onRemoveGroupMember && (
                                      <button
                                        type="button"
                                        onClick={() => onRemoveGroupMember(grp.id, m.id)}
                                        className="p-1 text-rose-400 hover:text-rose-300"
                                        title="Remover membro"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* MODE 4: PRIVACIDADE, VERIFICAÇÃO & BLOQUEIO DE CONTEÚDO +18 */}
      {activeSubTab === 'privacy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="velvet-card rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verificação de Identidade (RG/CNH + Facial)
            </h3>
            <p className="text-xs text-[#FAF5F6]/65 leading-relaxed">
              Sua documentação passa por leitura segura com remoção de metadados e validação biométrica para garantir que todos os perfis sejam humanos reais.
            </p>

            <div className="p-4 rounded-2xl bg-[#0D090B] border border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#FAF5F6]/70">Status do Documento (RG/CNH):</span>
                <span className="font-bold text-emerald-400">
                  {user.isVerified ? 'Verificado ✓' : 'Pendente'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#FAF5F6]/70">Reconhecimento Facial 3D:</span>
                <span className="font-bold text-emerald-400">
                  {user.isVerified ? 'Confirmado ✓' : 'Pendente'}
                </span>
              </div>
            </div>

            {!user.isVerified && (
              <button
                type="button"
                onClick={onStartVerify}
                className="w-full py-2.5 rounded-xl bg-[#E11D48] text-white text-xs font-bold"
              >
                Iniciar Verificação Agora
              </button>
            )}
          </div>

          <div className="velvet-card rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-[#FB7185]" />
              Preferências de Discrição & Vendas +18
            </h3>

            {/* Toggle Ghost Mode */}
            <div className="p-4 rounded-2xl bg-[#0D090B] border border-white/10 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-white">Modo Invisível (Fantasma)</p>
                <p className="text-[11px] text-[#FAF5F6]/55">
                  Navegue sem aparecer online para outros membros.
                </p>
              </div>
              <button
                type="button"
                onClick={onToggleGhostMode}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  user.privacySettings?.ghostMode
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/[0.07] text-[#FAF5F6]/70'
                }`}
              >
                {user.privacySettings?.ghostMode ? 'Ativo' : 'Ativar'}
              </button>
            </div>

            {/* Toggle Block Adult Content Sales Tabs */}
            <div className="p-4 rounded-2xl bg-[#0D090B] border border-white/10 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-white">
                  Bloquear Abas e Ofertas de Venda de Mídias +18
                </p>
                <p className="text-[11px] text-[#FAF5F6]/55">
                  Oculta conteúdos pagos e desativa a aba de gerenciamento de vendas caso você queira usar apenas para conexões gratuitas.
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleBlockAdultSales}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                  user.privacySettings?.blockAdultSalesTabs
                    ? 'bg-rose-600 text-white'
                    : 'bg-white/[0.07] text-[#FAF5F6]/70'
                }`}
              >
                {user.privacySettings?.blockAdultSalesTabs ? 'Bloqueado' : 'Visível'}
              </button>
            </div>
          </div>

          {/* 2FA AUTHENTICATION CARD */}
          <div className="velvet-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                Autenticação de Dois Fatores (2FA)
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  twoFactorEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                    : 'bg-white/10 text-[#FAF5F6]/60'
                }`}
              >
                {twoFactorEnabled ? '2FA Ativo ✓' : 'Desativado'}
              </span>
            </div>

            <p className="text-xs text-[#FAF5F6]/65 leading-relaxed">
              Exige um código de 6 dígitos enviado para seu celular (SMS) ou e-mail sempre que houver um novo acesso ou alteração sensível na conta.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setTwoFactorMethod('sms')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  twoFactorMethod === 'sms'
                    ? 'bg-[#E11D48]/15 border-[#E11D48] text-white'
                    : 'bg-[#0D090B] border-white/10 text-[#FAF5F6]/65'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SMS no Celular</span>
                </div>
                <p className="text-[10px] text-[#FAF5F6]/55 mt-0.5">
                  {user.phone || '(11) 99812-4490'}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTwoFactorMethod('email')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  twoFactorMethod === 'email'
                    ? 'bg-[#E11D48]/15 border-[#E11D48] text-white'
                    : 'bg-[#0D090B] border-white/10 text-[#FAF5F6]/65'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Mail className="w-3.5 h-3.5 text-[#FB7185]" />
                  <span>Código no E-mail</span>
                </div>
                <p className="text-[10px] text-[#FAF5F6]/55 truncate mt-0.5">
                  {user.email || 'alexandre.prive@auraprive.com'}
                </p>
              </button>
            </div>

            {twoFactorFeedback && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-xs text-emerald-300 font-medium">
                {twoFactorFeedback}
              </div>
            )}

            {show2faCodeModal ? (
              <div className="p-4 rounded-2xl bg-[#0D090B] border border-amber-400/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">
                    Código 2FA Enviado ({twoFactorMethod === 'sms' ? 'SMS Celular' : 'E-mail'}):{' '}
                    <strong className="font-mono text-white">{twoFactorDemoCode}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setTwoFactorOtpInput(twoFactorDemoCode)}
                    className="text-[11px] text-emerald-300 underline"
                  >
                    Preencher
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={twoFactorOtpInput}
                    onChange={(e) => setTwoFactorOtpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="Digite os 6 dígitos"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#161013] border border-white/15 text-xs text-white font-mono tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const nextState = !twoFactorEnabled;
                      setTwoFactorEnabled(nextState);
                      setShow2faCodeModal(false);
                      setTwoFactorFeedback(
                        nextState
                          ? `Autenticação de 2 Fatores (2FA) ativada via ${twoFactorMethod.toUpperCase()}!`
                          : 'Autenticação de 2 Fatores desativada.'
                      );
                      onUpdateProfile({
                        privacySettings: {
                          ...user.privacySettings,
                          twoFactorEnabled: nextState,
                          twoFactorMethod
                        }
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                  >
                    Confirmar Código
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTwoFactorDemoCode(String(Math.floor(100000 + Math.random() * 900000)));
                  setTwoFactorOtpInput('');
                  setShow2faCodeModal(true);
                }}
                className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-bold border border-white/15"
              >
                {twoFactorEnabled
                  ? 'Validar Código 2FA / Alterar Configuração'
                  : 'Ativar Autenticação de 2 Fatores (2FA)'}
              </button>
            )}
          </div>

          {/* DELETE ACCOUNT CARD WITH MANDATORY SMS OR EMAIL CODE VERIFICATION */}
          <div className="velvet-card rounded-3xl p-6 space-y-4 border border-rose-500/30">
            <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Deletar Conta Permanentemente
            </h3>
            <p className="text-xs text-[#FAF5F6]/65 leading-relaxed">
              Para sua proteção contra exclusões acidentais ou invasões, a exclusão definitiva da conta exige confirmação por <strong>código de verificação no celular (SMS) ou e-mail</strong>.
            </p>

            {!showDeleteAccountModal ? (
              <button
                type="button"
                onClick={() => {
                  setDeleteOtpCode(String(Math.floor(100000 + Math.random() * 900000)));
                  setDeleteOtpInput('');
                  setDeleteError(null);
                  setShowDeleteAccountModal(true);
                }}
                className="w-full py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-600 hover:text-white border border-rose-500/40 text-rose-300 text-xs font-bold transition-colors"
              >
                Solicitar Código para Deletar Minha Conta
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-[#0D090B] border border-rose-500/40 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300">
                    Verificação de Segurança para Exclusão
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowDeleteAccountModal(false)}
                    className="text-[11px] text-[#FAF5F6]/55 hover:text-white"
                  >
                    Cancelar
                  </button>
                </div>

                <div>
                  <label className="text-[11px] text-[#FAF5F6]/70 block mb-1">
                    Motivo da saída (opcional)
                  </label>
                  <select
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#161013] border border-white/10 text-xs text-white"
                  >
                    <option value="Privacidade / Pausa temporária">Privacidade / Pausa temporária</option>
                    <option value="Já encontrei alguém especial">Já encontrei alguém especial</option>
                    <option value="Quero criar outra conta do zero">Quero criar outra conta do zero</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeleteChannel('sms')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border ${
                      deleteChannel === 'sms'
                        ? 'bg-rose-500/25 border-rose-400 text-white'
                        : 'bg-[#161013] border-white/10 text-[#FAF5F6]/65'
                    }`}
                  >
                    Código via SMS Celular
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteChannel('email')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border ${
                      deleteChannel === 'email'
                        ? 'bg-rose-500/25 border-rose-400 text-white'
                        : 'bg-[#161013] border-white/10 text-[#FAF5F6]/65'
                    }`}
                  >
                    Código via E-mail
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/35 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-rose-300 font-bold block">
                      Código de Exclusão ({deleteChannel === 'sms' ? 'SMS' : 'E-mail'})
                    </span>
                    <span className="text-sm font-mono font-bold text-white tracking-widest">
                      {deleteOtpCode}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDeleteOtpInput(deleteOtpCode)}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-500/25 text-rose-200 text-[11px] font-bold"
                  >
                    Preencher Código
                  </button>
                </div>

                <input
                  type="text"
                  maxLength={6}
                  value={deleteOtpInput}
                  onChange={(e) => setDeleteOtpInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Digite o código de 6 dígitos"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#161013] border border-white/15 text-center font-mono text-sm tracking-[0.3em] text-white"
                />

                {deleteError && (
                  <p className="text-xs text-rose-400 font-medium">{deleteError}</p>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (deleteOtpInput.trim().length < 4) {
                      setDeleteError(
                        'Informe o código de 6 dígitos enviado por SMS/E-mail para confirmar a exclusão.'
                      );
                      return;
                    }
                    if (onDeleteAccount) {
                      onDeleteAccount();
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg"
                >
                  Confirmar Código & Deletar Conta Definitivamente
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
