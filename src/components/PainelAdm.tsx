import { useState } from 'react';
import {
  Sparkles,
  Flame,
  Palette,
  Coins,
  Crown,
  ShieldCheck,
  Sliders,
  Users,
  MapPin,
  Video,
  Lock,
  Check,
  RotateCcw,
  Eye,
  Plus,
  Trash2,
  Wand2,
  Smartphone,
  Layers,
  Award,
  KeyRound,
  Send
} from 'lucide-react';
import {
  SiteAdminConfig,
  AiSectionDesignProposal,
  User,
  MeetupVenue,
  LiberalMoment,
  GroupConversation
} from '../types';
import { AuraPriveLogo } from './AuraPriveLogo';

export const DEFAULT_SITE_ADMIN_CONFIG: SiteAdminConfig = {
  brandFirstName: 'Aura',
  brandSecondName: 'Privé',
  brandSubtitle: 'Conexões Reais & Lifestyle Liberal',
  showFlameAccentOnE: true,
  primaryColor: '#E11D48',
  accentColor: '#FB7185',
  bgColor: '#0D090B',
  cardBgColor: '#161013',
  borderRadiusStyle: 'organic',
  buttonStyle: 'gradient',
  naturalLookMode: true,

  initialUserCoins: 140,
  coinPackages: [
    {
      id: 'pack_starter',
      name: 'Pacote Descoberta',
      baseCoins: 50,
      bonusCoins: 0,
      totalCoins: 50,
      priceBrl: 25.0,
      badge: 'R$ 0,50 / moeda'
    },
    {
      id: 'pack_popular',
      name: 'Pacote Sensual',
      baseCoins: 120,
      bonusCoins: 20,
      totalCoins: 140,
      priceBrl: 59.9,
      badge: '+20 Moedas Bônus',
      popular: true
    },
    {
      id: 'pack_desire',
      name: 'Pacote Privé Club',
      baseCoins: 300,
      bonusCoins: 60,
      totalCoins: 360,
      priceBrl: 139.9,
      badge: '+60 Moedas Bônus'
    },
    {
      id: 'pack_black',
      name: 'Pacote Black Royal',
      baseCoins: 700,
      bonusCoins: 200,
      totalCoins: 900,
      priceBrl: 299.9,
      badge: '+200 Moedas Bônus'
    }
  ],
  creatorGifts: [
    { id: 'gift_rose', label: '🌹 Rosa de Veludo', coins: 10 },
    { id: 'gift_champagne', label: '🥂 Taça de Champagne', coins: 25 },
    { id: 'gift_flame', label: '🔥 Chama Privé', coins: 50 },
    { id: 'gift_diamond', label: '💎 Diamante Noir', coins: 120 },
    { id: 'gift_crown', label: '👑 Coroa Imperial', coins: 300 }
  ],

  sellerActivationFeeBrl: 50.0,
  requireVerificationForSeller: true,
  sellerGiveFreeVip: true,
  sellerTierFees: {
    nivel1FeePercent: 20,
    nivel2FeePercent: 14,
    nivel3FeePercent: 8
  },

  vipMonthlyBrl: 49.9,
  vipAnnualEquivalentMonthlyBrl: 34.9,
  vipAnnualTotalBrl: 418.8,
  blackMonthlyBrl: 99.9,
  blackAnnualEquivalentMonthlyBrl: 69.9,
  blackAnnualTotalBrl: 838.8,
  freeDailyLikesLimit: 20,
  freeDailyFirstMessagesLimit: 4,

  mobileDiscoverCardScale: 'large',
  defaultHeightUnit: 'auto_gps',
  showDiscretePhotoCountBadge: true,
  dynamicLocationsList: [
    'São Paulo, Jardins (SP)',
    'São Paulo, Pinheiros (SP)',
    'São Paulo, Itaim Bibi (SP)',
    'Rio de Janeiro, Ipanema (RJ)',
    'Rio de Janeiro, Leblon (RJ)',
    'Belo Horizonte, Savassi (MG)',
    'Curitiba, Batel (PR)',
    'Florianópolis, Jurerê Internacional (SC)',
    'Brasília, Asa Sul (DF)'
  ],

  allowLivesOnlyVipAndSellers: true,
  requireAdultWarningOnStatus: true,
  allowStatusCrosspostToMomentsAndSale: true,

  enableGroupVideoCalls: true,
  enableCommunityVideoCalls: true,
  enableWhatsappMobileChatLayout: true,
  autoJoinMeetupGroupAfterPayment: true,

  enablePostSignupSurvey: true,
  requireOtpOnSignup: true,
  requireOtpOnAccountDelete: true,
  enable2faSecurity: true,

  sectionOverrides: {}
};

const SITE_SECTIONS_FOR_AI = [
  {
    id: 'header_logo',
    label: 'Logo & Cabeçalho Principal',
    desc: 'Escrita clássica Aura Privé com foguinho no "é", saldo de Moedas e navegação.'
  },
  {
    id: 'discover_mobile',
    label: 'Aba Descobrir & Card Mobile (Imagem 3)',
    desc: 'Card de fotos ampliado no celular, contador discreto 1/3, filtros e localização dinâmica.'
  },
  {
    id: 'status_lives',
    label: 'Status (Stories) & Lives +18',
    desc: 'Barra estilo Instagram adaptada ao site, editor de foto/vídeo, lives VIP/Vendedor e presentes.'
  },
  {
    id: 'moments_sales',
    label: 'Momentos Liberais & Desbloqueio com Moedas',
    desc: 'Feed de fotos/vídeos, compra com Moedas Aura e envio de presentes para vendedores.'
  },
  {
    id: 'meetups_groups',
    label: 'Encontros Reais & Entrada Automática no Grupo',
    desc: 'Inscrição paga/VIP com pulseiras de consentimento e acesso imediato ao grupo do evento.'
  },
  {
    id: 'chat_whatsapp',
    label: 'Mensagens Estilo WhatsApp & Vídeo em Grupos',
    desc: 'Lista de conversas mobile que abre tela cheia com emojis, GIFs, fotos, vídeos e videochamada.'
  },
  {
    id: 'profile_height_seller',
    label: 'Perfil, Seletor de Altura (cm/pés) & Vendas +18',
    desc: 'Ícone de editar avatar, selo ao lado da idade, slider compacto de altura e taxa de R$ 50 de vendedor.'
  },
  {
    id: 'vip_coins_modals',
    label: 'Planos VIP (Anual/Mensal) & Loja de Moedas',
    desc: 'Comparativo de preços mensal/anual e pacotes de Moedas Aura via PIX e Cartão.'
  }
];

const QUICK_AI_PROMPTS = [
  'Visual mais orgânico e natural, menos cara de IA, tipografia editorial refinada',
  'Estética Noir Parisiense com detalhes em Ouro Champagne e bordas suaves',
  'Foco máximo em celular: botões mais visíveis, leitura clara e contraste elegante',
  'Clima Lounge Privado Rubi Intenso com cards translúcidos mais limpos'
];

interface PainelAdmProps {
  config: SiteAdminConfig;
  onUpdateConfig: (nextConfig: SiteAdminConfig) => void;
  onResetConfig: () => void;
  currentUser: User;
  onUpdateCurrentUser: (updates: Partial<User>) => void;
  profiles: User[];
  onUpdateProfiles: (nextProfiles: User[]) => void;
  venues: MeetupVenue[];
  onUpdateVenues: (nextVenues: MeetupVenue[]) => void;
  moments: LiberalMoment[];
  groups: GroupConversation[];
  onSimulateNormalVisitorView: () => void;
  onTriggerOnboardingSurvey: () => void;
}

export function PainelAdm({
  config,
  onUpdateConfig,
  onResetConfig,
  currentUser,
  onUpdateCurrentUser,
  profiles,
  onUpdateProfiles,
  venues,
  onUpdateVenues,
  moments,
  groups,
  onSimulateNormalVisitorView,
  onTriggerOnboardingSurvey
}: PainelAdmProps) {
  const [activeSection, setActiveSection] = useState<
    | 'ai_studio'
    | 'branding'
    | 'coins'
    | 'sellers'
    | 'vip'
    | 'discover_height'
    | 'meetups_chat'
    | 'security_onboarding'
  >('ai_studio');

  // AI Design Studio State
  const [selectedTargetSection, setSelectedTargetSection] = useState<string>('discover_mobile');
  const [aiPromptInput, setAiPromptInput] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiProposals, setAiProposals] = useState<AiSectionDesignProposal[]>([
    {
      id: 'preset_editorial_natural',
      title: 'Editorial Parisienne Natural',
      tagline: 'Acabamento humano, orgânico e sem brilho artificial de IA',
      rationale:
        'Reduz gradientes sintéticos exagerados, prioriza fotografia em destaque amplo no celular e tipografia serifada clássica com excelente contraste.',
      primaryColor: '#DC2626',
      accentColor: '#F59E0B',
      bgColor: '#0B090A',
      cardBgColor: '#161214',
      borderRadiusStyle: 'editorial',
      cardDensity: 'spacious',
      mobileCardScale: 'large',
      buttonStyle: 'solid',
      suggestedHeading: 'Conexões Reais, Sem Filtros Artificiais',
      suggestedSubheading: 'Curadoria privada de pessoas, casais e experiências autênticas perto de você.',
      cssPreviewSnippet: 'radius: 16px · surface: #161214 · accent: #F59E0B · natural-contrast: high',
      highlights: [
        'Remove aspecto plástico e deixa os cards com textura de revista editorial',
        'Aumenta a área útil das fotos no celular em 18%',
        'Destaca o foguinho da logo e os selos de verificação com tom âmbar real'
      ]
    },
    {
      id: 'preset_velvet_gold',
      title: 'Velvet Club & Ouro Champagne',
      tagline: 'Atmosfera de clube exclusivo noturno com toque dourado',
      rationale:
        'Ideal para valorizar a Loja de Moedas Aura, os Planos VIP Anual/Mensal e o Clube de Vendedores +18 com percepção de alto valor.',
      primaryColor: '#E11D48',
      accentColor: '#FBBF24',
      bgColor: '#090708',
      cardBgColor: '#171014',
      borderRadiusStyle: 'organic',
      cardDensity: 'balanced',
      mobileCardScale: 'fullscreen',
      buttonStyle: 'gradient',
      suggestedHeading: 'Clube Privé & Experiências Exclusivas',
      suggestedSubheading: 'Desbloqueie acervos +18, lives privadas e encontros reais verificados.',
      cssPreviewSnippet: 'radius: 32px · surface: #171014 · primary: #E11D48 · gold: #FBBF24',
      highlights: [
        'Botões de compra de Moedas e Presentes com maior conversão visual',
        'Contraste superior nos seletores de altura (cm/pés) e localização',
        'Visual imersivo para Status e Lives no celular'
      ]
    },
    {
      id: 'preset_obsidian_clean',
      title: 'Obsidian Minimal & Toque Rápido',
      tagline: 'Foco absoluto em velocidade, ergonomia mobile e discrição',
      rationale:
        'Pensado para quem usa o aplicativo com uma mão no celular: espaçamentos limpos, chat estilo WhatsApp fluido e leitura imediata.',
      primaryColor: '#BE123C',
      accentColor: '#FB7185',
      bgColor: '#0A0A0C',
      cardBgColor: '#141418',
      borderRadiusStyle: 'soft',
      cardDensity: 'compact',
      mobileCardScale: 'large',
      buttonStyle: 'glass-outline',
      suggestedHeading: 'Descubra Química & Liberdade no Seu Ritmo',
      suggestedSubheading: 'Navegação rápida por toques laterais, sigilo ponta a ponta e geolocalização.',
      cssPreviewSnippet: 'radius: 24px · surface: #141418 · primary: #BE123C · clean-minimal',
      highlights: [
        'Interface ultra limpa e discreta para uso em qualquer ambiente',
        'Cabeçalhos compactos que não quebram em telas menores',
        'Transições suaves nas abas do Perfil e Chat'
      ]
    }
  ]);
  const [appliedBanner, setAppliedBanner] = useState<string | null>(null);

  // New Coin Package state
  const [newPackName, setNewPackName] = useState('');
  const [newPackCoins, setNewPackCoins] = useState('200');
  const [newPackBonus, setNewPackBonus] = useState('30');
  const [newPackPrice, setNewPackPrice] = useState('89.90');

  // New Dynamic City state
  const [newCityInput, setNewCityInput] = useState('');

  // New Venue state
  const [newVenueName, setNewVenueName] = useState('');
  const [newVenueNeighborhood, setNewVenueNeighborhood] = useState('Jardins, São Paulo');
  const [newVenuePrice, setNewVenuePrice] = useState('120');

  const notifyApplied = (msg: string) => {
    setAppliedBanner(msg);
    setTimeout(() => setAppliedBanner(null), 4000);
  };

  const handleGenerateAiDesigns = async () => {
    setIsGeneratingAi(true);
    setAiError(null);
    const sectionObj = SITE_SECTIONS_FOR_AI.find((s) => s.id === selectedTargetSection);

    try {
      const response = await fetch('/api/admin/ai-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetSection: selectedTargetSection,
          sectionLabel: sectionObj?.label || selectedTargetSection,
          userPrompt:
            aiPromptInput.trim() ||
            'Crie 3 variações de design elegantes, naturais, sem cara de IA, otimizadas para celular e computador.',
          currentConfig: {
            primaryColor: config.primaryColor,
            accentColor: config.accentColor,
            bgColor: config.bgColor,
            cardBgColor: config.cardBgColor,
            borderRadiusStyle: config.borderRadiusStyle,
            mobileDiscoverCardScale: config.mobileDiscoverCardScale
          }
        })
      });

      const data = await response.json();
      if (!response.ok || !data.proposals || !Array.isArray(data.proposals)) {
        throw new Error(data.error || 'Não foi possível gerar variações no momento.');
      }

      setAiProposals(data.proposals);
      notifyApplied(
        `IA gerou 3 novos designs personalizados para "${sectionObj?.label || selectedTargetSection}"!`
      );
    } catch (err: any) {
      setAiError(
        err?.message ||
          'Erro ao conectar com a IA. Você ainda pode aplicar ou editar os designs abaixo.'
      );
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleApplyAiProposal = (proposal: AiSectionDesignProposal) => {
    const sectionObj = SITE_SECTIONS_FOR_AI.find((s) => s.id === selectedTargetSection);
    const validRadius =
      proposal.borderRadiusStyle === 'editorial' ||
      proposal.borderRadiusStyle === 'organic' ||
      proposal.borderRadiusStyle === 'soft'
        ? proposal.borderRadiusStyle
        : 'organic';

    const validScale =
      proposal.mobileCardScale === 'fullscreen' ||
      proposal.mobileCardScale === 'standard' ||
      proposal.mobileCardScale === 'large'
        ? proposal.mobileCardScale
        : 'large';

    const validButton =
      proposal.buttonStyle === 'solid' ||
      proposal.buttonStyle === 'glass-outline' ||
      proposal.buttonStyle === 'gradient'
        ? proposal.buttonStyle
        : 'gradient';

    onUpdateConfig({
      ...config,
      primaryColor: proposal.primaryColor || config.primaryColor,
      accentColor: proposal.accentColor || config.accentColor,
      bgColor: proposal.bgColor || config.bgColor,
      cardBgColor: proposal.cardBgColor || config.cardBgColor,
      borderRadiusStyle: validRadius,
      mobileDiscoverCardScale: validScale,
      buttonStyle: validButton,
      sectionOverrides: {
        ...config.sectionOverrides,
        [selectedTargetSection]: {
          heading: proposal.suggestedHeading,
          subheading: proposal.suggestedSubheading,
          appliedDesignTitle: proposal.title,
          primaryColor: proposal.primaryColor,
          accentColor: proposal.accentColor,
          cardBgColor: proposal.cardBgColor
        }
      }
    });

    notifyApplied(
      `Design "${proposal.title}" aplicado com sucesso em "${
        sectionObj?.label || 'Todo o Site'
      }"!`
    );
  };

  return (
    <div className="space-y-6 pb-16">
      {/* TOP MASTER ADMIN HEADER BANNER */}
      <div className="velvet-card rounded-3xl p-5 sm:p-6 border border-amber-400/35 bg-gradient-to-br from-[#1F1218] via-[#140D11] to-[#0D090B] shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              Acesso Exclusivo do Proprietário • Oculto para Usuários Normais
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-serif">
                PAINEL ADM
              </h1>
              <span className="px-2.5 py-0.5 rounded-lg bg-[#E11D48]/20 border border-[#E11D48]/40 text-[#FB7185] text-xs font-bold">
                Controle Total + IA Design Studio
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#FAF5F6]/70 max-w-3xl leading-relaxed">
              Configure em tempo real qualquer parte do <strong>Aura Privé</strong> (Logo com foguinho, Moedas Aura, Taxa de R$ 50 e Níveis de Vendedor +18, Altura cm/pés, Localização Dinâmica, Lives, Encontros Reais, Chat WhatsApp, Planos VIP e Segurança) ou use a <strong>IA</strong> para gerar novos designs para a parte que você selecionar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onSimulateNormalVisitorView}
              className="px-4 py-2.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-bold text-[#FAF5F6] flex items-center gap-2 transition-all"
              title="Veja exatamente como um visitante comum vê o site (sem a aba PAINEL ADM)"
            >
              <Eye className="w-4 h-4 text-amber-300" />
              Simular Visão de Usuário Comum
            </button>

            <button
              type="button"
              onClick={() => {
                onResetConfig();
                notifyApplied('Todas as configurações foram restauradas para o padrão original.');
              }}
              className="px-3.5 py-2.5 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-bold text-rose-200 flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar Padrão
            </button>
          </div>
        </div>

        {/* Live Feedback Banner */}
        {appliedBanner && (
          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-xs sm:text-sm text-emerald-200 font-semibold flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{appliedBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => setAppliedBanner(null)}
              className="text-[11px] text-emerald-300 underline"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Quick Real-Time Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-5 pt-5 border-t border-white/10">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.07]">
            <span className="text-[10px] uppercase tracking-wider text-[#FAF5F6]/50 block">
              Seu Saldo de Moedas
            </span>
            <span className="text-base font-extrabold text-amber-300">
              {currentUser.coinsBalance ?? 0} Moedas
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.07]">
            <span className="text-[10px] uppercase tracking-wider text-[#FAF5F6]/50 block">
              Taxa Ativação Vendedor
            </span>
            <span className="text-base font-extrabold text-white">
              R$ {config.sellerActivationFeeBrl.toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.07]">
            <span className="text-[10px] uppercase tracking-wider text-[#FAF5F6]/50 block">
              Taxas Saque (N1/N2/N3)
            </span>
            <span className="text-base font-extrabold text-emerald-400">
              {config.sellerTierFees.nivel1FeePercent}% / {config.sellerTierFees.nivel2FeePercent}% /{' '}
              {config.sellerTierFees.nivel3FeePercent}%
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.07]">
            <span className="text-[10px] uppercase tracking-wider text-[#FAF5F6]/50 block">
              Perfis & Vendedores
            </span>
            <span className="text-base font-extrabold text-white">
              {profiles.length} perfis ({profiles.filter((p) => p.isSellerVerified).length} +18)
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.07]">
            <span className="text-[10px] uppercase tracking-wider text-[#FAF5F6]/50 block">
              Encontros & Grupos
            </span>
            <span className="text-base font-extrabold text-[#FB7185]">
              {venues.length} locais • {groups.length} grupos
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.07]">
            <span className="text-[10px] uppercase tracking-wider text-[#FAF5F6]/50 block">
              Momentos Publicados
            </span>
            <span className="text-base font-extrabold text-white">{moments.length} posts</span>
          </div>
        </div>
      </div>

      {/* ADMIN MODULE NAVIGATION TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {[
          { id: 'ai_studio', label: 'IA Design Studio', icon: Wand2 },
          { id: 'branding', label: 'Logo & Visual', icon: Palette },
          { id: 'coins', label: 'Moedas & Presentes', icon: Coins },
          { id: 'sellers', label: 'Vendedores +18', icon: Award },
          { id: 'vip', label: 'Planos VIP', icon: Crown },
          { id: 'discover_height', label: 'Descobrir & Altura', icon: Sliders },
          { id: 'meetups_chat', label: 'Encontros & Chat', icon: Video },
          { id: 'security_onboarding', label: 'Cadastro & 2FA', icon: KeyRound }
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id as typeof activeSection)}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                active
                  ? 'bg-gradient-to-br from-[#E11D48] to-[#9F1239] text-white border-rose-400/50 shadow-lg shadow-[#E11D48]/25'
                  : 'bg-[#140E11] hover:bg-[#1E1419] text-[#FAF5F6]/75 border-white/10'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#FB7185]'}`} />
              <span className="text-xs font-bold leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          1. IA DESIGN STUDIO (CRIAR DESIGNS PARA A PARTE SELECIONADA)
         ===================================================================== */}
      {activeSection === 'ai_studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Select Site Part + Prompt AI */}
          <div className="lg:col-span-5 velvet-card rounded-3xl p-5 sm:p-6 space-y-5 border border-white/10">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Diretor de Arte IA Integrado
              </span>
              <h2 className="text-lg font-bold text-white">
                1. Selecione a Parte do Site para Recriar o Design
              </h2>
              <p className="text-xs text-[#FAF5F6]/65">
                Escolha abaixo qual aba ou componente você deseja estilizar e peça para a IA gerar propostas visuais prontas para aplicar.
              </p>
            </div>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {SITE_SECTIONS_FOR_AI.map((sec) => {
                const isSelected = selectedTargetSection === sec.id;
                const activeOverride = config.sectionOverrides[sec.id];
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setSelectedTargetSection(sec.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#E11D48]/15 border-[#E11D48] text-white shadow-md'
                        : 'bg-[#0D090B]/90 border-white/10 text-[#FAF5F6]/75 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white">{sec.label}</span>
                      {activeOverride?.appliedDesignTitle && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          {activeOverride.appliedDesignTitle}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#FAF5F6]/55 mt-1">{sec.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* AI Prompt Box */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <label className="text-xs font-bold text-white block">
                2. Como você quer o novo design desta parte?
              </label>
              <textarea
                rows={3}
                value={aiPromptInput}
                onChange={(e) => setAiPromptInput(e.target.value)}
                placeholder="Ex: Quero um design mais natural sem cara de IA, com tons vinho e dourado, letras maiores no celular e botões mais elegantes..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0D090B] border border-white/15 text-xs sm:text-sm text-white placeholder-[#FAF5F6]/35 focus:outline-none focus:border-[#E11D48]"
              />

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-[#FAF5F6]/50 font-semibold block">
                  Sugestões Rápidas (Clique para usar):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_AI_PROMPTS.map((qp) => (
                    <button
                      key={qp}
                      type="button"
                      onClick={() => setAiPromptInput(qp)}
                      className="px-2.5 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[11px] text-[#FAF5F6]/80 text-left transition-colors"
                    >
                      {qp}
                    </button>
                  ))}
                </div>
              </div>

              {aiError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-200">
                  {aiError}
                </div>
              )}

              <button
                type="button"
                onClick={handleGenerateAiDesigns}
                disabled={isGeneratingAi}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#E11D48] via-[#BE123C] to-amber-600 hover:brightness-110 disabled:opacity-50 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xl"
              >
                <Wand2 className={`w-4 h-4 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                {isGeneratingAi
                  ? 'Gerando 3 Novos Designs com IA...'
                  : 'Gerar Designs com IA para Esta Parte'}
              </button>
            </div>
          </div>

          {/* Right Column: Interactive AI Design Proposals & Live Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="velvet-card rounded-3xl p-5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#FB7185]">
                  Seção Selecionada:{' '}
                  {SITE_SECTIONS_FOR_AI.find((s) => s.id === selectedTargetSection)?.label}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Propostas Interativas de Design (Clique em &ldquo;Aplicar Design&rdquo; para ativar ao vivo)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded-full border border-white/30"
                  style={{ backgroundColor: config.primaryColor }}
                  title={`Primária: ${config.primaryColor}`}
                />
                <span
                  className="w-5 h-5 rounded-full border border-white/30"
                  style={{ backgroundColor: config.accentColor }}
                  title={`Destaque: ${config.accentColor}`}
                />
                <span
                  className="w-5 h-5 rounded-full border border-white/30"
                  style={{ backgroundColor: config.cardBgColor }}
                  title={`Card: ${config.cardBgColor}`}
                />
              </div>
            </div>

            <div className="space-y-4">
              {aiProposals.map((proposal) => {
                const isCurrentlyApplied =
                  config.sectionOverrides[selectedTargetSection]?.appliedDesignTitle ===
                  proposal.title;

                return (
                  <div
                    key={proposal.id}
                    className="velvet-card rounded-3xl p-5 sm:p-6 border transition-all space-y-4"
                    style={{
                      backgroundColor: proposal.cardBgColor || '#161013',
                      borderColor: isCurrentlyApplied
                        ? '#10B981'
                        : `${proposal.primaryColor || '#E11D48'}55`
                    }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-lg font-bold text-white font-serif">
                            {proposal.title}
                          </h4>
                          {isCurrentlyApplied && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold uppercase">
                              Ativo Nesta Seção ✓
                            </span>
                          )}
                        </div>
                        <p
                          className="text-xs font-semibold mt-0.5"
                          style={{ color: proposal.accentColor || '#FB7185' }}
                        >
                          {proposal.tagline}
                        </p>
                      </div>

                      {/* Color Swatches */}
                      <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-2xl border border-white/10">
                        {[
                          { label: 'Primária', color: proposal.primaryColor },
                          { label: 'Destaque', color: proposal.accentColor },
                          { label: 'Fundo', color: proposal.bgColor },
                          { label: 'Card', color: proposal.cardBgColor }
                        ].map((sw) => (
                          <div key={sw.label} className="flex items-center gap-1">
                            <span
                              className="w-4 h-4 rounded-full border border-white/25"
                              style={{ backgroundColor: sw.color }}
                            />
                            <span className="text-[10px] font-mono text-[#FAF5F6]/70 hidden sm:inline">
                              {sw.color}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-[#FAF5F6]/80 leading-relaxed">
                      {proposal.rationale}
                    </p>

                    {/* Interactive Mini-Preview of how the Selected Section looks with this Design */}
                    <div
                      className="p-4 border border-white/15 space-y-2.5"
                      style={{
                        backgroundColor: proposal.bgColor || '#0D090B',
                        borderRadius:
                          proposal.borderRadiusStyle === 'editorial'
                            ? '14px'
                            : proposal.borderRadiusStyle === 'soft'
                            ? '20px'
                            : '28px'
                      }}
                    >
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#FAF5F6]/50">
                        <span>Prévia Ao Vivo da Seção</span>
                        <span className="font-mono">{proposal.cssPreviewSnippet}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-white font-serif">
                            {proposal.suggestedHeading}
                          </p>
                          <p className="text-xs text-[#FAF5F6]/70">
                            {proposal.suggestedSubheading}
                          </p>
                        </div>
                        <span
                          className="px-3.5 py-2 text-xs font-bold text-white shrink-0 text-center"
                          style={{
                            background:
                              proposal.buttonStyle === 'gradient'
                                ? `linear-gradient(135deg, ${proposal.primaryColor}, ${proposal.accentColor})`
                                : proposal.buttonStyle === 'solid'
                                ? proposal.primaryColor
                                : 'rgba(255,255,255,0.08)',
                            border:
                              proposal.buttonStyle === 'glass-outline'
                                ? `1px solid ${proposal.accentColor}`
                                : 'none',
                            borderRadius:
                              proposal.borderRadiusStyle === 'editorial' ? '10px' : '16px'
                          }}
                        >
                          Botão Exemplo
                        </span>
                      </div>
                    </div>

                    {/* Highlights list */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {(proposal.highlights || []).map((hl, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl bg-black/30 border border-white/[0.06] text-[11px] text-[#FAF5F6]/85 flex items-start gap-1.5"
                        >
                          <Check
                            className="w-3.5 h-3.5 shrink-0 mt-0.5"
                            style={{ color: proposal.accentColor }}
                          />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleApplyAiProposal(proposal)}
                        className="px-5 py-2.5 rounded-2xl text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                        style={{
                          background: `linear-gradient(135deg, ${
                            proposal.primaryColor || '#E11D48'
                          }, #9F1239)`
                        }}
                      >
                        <Sparkles className="w-4 h-4" />
                        Aplicar Este Design no Site Agora
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          2. LOGO (FOGUINHO NO 'É'), TEMA & ESTÉTICA NATURAL
         ===================================================================== */}
      {activeSection === 'branding' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 velvet-card rounded-3xl p-6 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#FB7185]" />
              Logo Clássica & Foguinho no Acento da Letra “e” (Imagem 1)
            </h3>

            {/* Live Logo Preview Box */}
            <div className="p-6 rounded-2xl bg-[#0D090B] border border-white/10 flex flex-col items-center justify-center gap-2">
              <AuraPriveLogo
                size="lg"
                showSubtitle={true}
                firstName={config.brandFirstName}
                secondName={config.brandSecondName}
                subtitleText={config.brandSubtitle}
                showFlameOnE={config.showFlameAccentOnE}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#FAF5F6]/70 block mb-1">
                  Primeira Palavra da Logo
                </label>
                <input
                  type="text"
                  value={config.brandFirstName}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, brandFirstName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D090B] border border-white/15 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-[#FAF5F6]/70 block mb-1">
                  Segunda Palavra (com é)
                </label>
                <input
                  type="text"
                  value={config.brandSecondName}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, brandSecondName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D090B] border border-white/15 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#FAF5F6]/70 block mb-1">Subtítulo da Marca</label>
              <input
                type="text"
                value={config.brandSubtitle}
                onChange={(e) => onUpdateConfig({ ...config, brandSubtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D090B] border border-white/15 text-xs text-white"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#0D090B] border border-white/10 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-white">
                  Exibir Foguinho no Lugar do Acento da Letra “e”
                </p>
                <p className="text-[11px] text-[#FAF5F6]/55">
                  Ativa a chama desenhada exatamente sobre o “e” de Privé conforme solicitado na Imagem 1.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onUpdateConfig({
                    ...config,
                    showFlameAccentOnE: !config.showFlameAccentOnE
                  })
                }
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  config.showFlameAccentOnE
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/10 text-[#FAF5F6]/60'
                }`}
              >
                {config.showFlameAccentOnE ? 'Foguinho Ativo 🔥' : 'Acento Comum'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 velvet-card rounded-3xl p-6 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-300" />
              Cores Globais, Bordas & Acabamento Natural (Sem Cara de IA)
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#0D090B] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Cor Primária</span>
                  <span className="text-[11px] font-mono text-[#FAF5F6]/60">
                    {config.primaryColor}
                  </span>
                </div>
                <input
                  type="color"
                  value={config.primaryColor}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, primaryColor: e.target.value })
                  }
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0D090B] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Cor de Destaque</span>
                  <span className="text-[11px] font-mono text-[#FAF5F6]/60">
                    {config.accentColor}
                  </span>
                </div>
                <input
                  type="color"
                  value={config.accentColor}
                  onChange={(e) => onUpdateConfig({ ...config, accentColor: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0D090B] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Fundo Principal</span>
                  <span className="text-[11px] font-mono text-[#FAF5F6]/60">
                    {config.bgColor}
                  </span>
                </div>
                <input
                  type="color"
                  value={config.bgColor}
                  onChange={(e) => onUpdateConfig({ ...config, bgColor: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0D090B] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Fundo dos Cards</span>
                  <span className="text-[11px] font-mono text-[#FAF5F6]/60">
                    {config.cardBgColor}
                  </span>
                </div>
                <input
                  type="color"
                  value={config.cardBgColor}
                  onChange={(e) => onUpdateConfig({ ...config, cardBgColor: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#FAF5F6]/70 block mb-2">
                Estilo de Arredondamento dos Cards
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'editorial', label: 'Editorial (16px)' },
                  { id: 'soft', label: 'Suave (24px)' },
                  { id: 'organic', label: 'Orgânico (32px)' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      onUpdateConfig({
                        ...config,
                        borderRadiusStyle: opt.id as SiteAdminConfig['borderRadiusStyle']
                      })
                    }
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border ${
                      config.borderRadiusStyle === opt.id
                        ? 'bg-[#E11D48] text-white border-transparent'
                        : 'bg-[#0D090B] text-[#FAF5F6]/70 border-white/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0D090B] border border-white/10 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-white">
                  Acabamento Visual Natural & Editorial
                </p>
                <p className="text-[11px] text-[#FAF5F6]/55">
                  Suaviza brilhos artificiais e mantém sombras orgânicas de fotografia real.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onUpdateConfig({ ...config, naturalLookMode: !config.naturalLookMode })
                }
                className={`px-4 py-2 rounded-xl text-xs font-bold ${
                  config.naturalLookMode
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/10 text-[#FAF5F6]/60'
                }`}
              >
                {config.naturalLookMode ? 'Ativado ✓' : 'Desativado'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          3. SISTEMA DE MOEDAS AURA & PRESENTES (LIVES E POSTS DE VENDEDORES)
         ===================================================================== */}
      {activeSection === 'coins' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 velvet-card rounded-3xl p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-300" />
                  Pacotes da Loja de Moedas Aura
                </h3>
                <p className="text-xs text-[#FAF5F6]/60">
                  Configure os valores e bônus justos que os usuários compram antes de desbloquear mídias +18 ou enviar presentes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateCurrentUser({
                      coinsBalance: (currentUser.coinsBalance ?? 0) + 500
                    });
                    notifyApplied('+500 Moedas Aura creditadas na sua conta de Administrador!');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-bold"
                >
                  +500 Moedas para Mim
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {config.coinPackages.map((pack, idx) => (
                <div
                  key={pack.id}
                  className="p-4 rounded-2xl bg-[#0D090B] border border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                >
                  <div className="sm:col-span-4">
                    <label className="text-[10px] text-[#FAF5F6]/50 block">Nome do Pacote</label>
                    <input
                      type="text"
                      value={pack.name}
                      onChange={(e) => {
                        const next = [...config.coinPackages];
                        next[idx] = { ...pack, name: e.target.value };
                        onUpdateConfig({ ...config, coinPackages: next });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#161013] border border-white/10 text-xs text-white font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-[#FAF5F6]/50 block">Moedas Base</label>
                    <input
                      type="number"
                      value={pack.baseCoins}
                      onChange={(e) => {
                        const base = Math.max(1, Number(e.target.value) || 0);
                        const next = [...config.coinPackages];
                        next[idx] = {
                          ...pack,
                          baseCoins: base,
                          totalCoins: base + pack.bonusCoins
                        };
                        onUpdateConfig({ ...config, coinPackages: next });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#161013] border border-white/10 text-xs text-amber-300 font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-[#FAF5F6]/50 block">Bônus</label>
                    <input
                      type="number"
                      value={pack.bonusCoins}
                      onChange={(e) => {
                        const bonus = Math.max(0, Number(e.target.value) || 0);
                        const next = [...config.coinPackages];
                        next[idx] = {
                          ...pack,
                          bonusCoins: bonus,
                          totalCoins: pack.baseCoins + bonus,
                          badge: bonus > 0 ? `+${bonus} Moedas Bônus` : 'Pacote Inicial'
                        };
                        onUpdateConfig({ ...config, coinPackages: next });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#161013] border border-white/10 text-xs text-emerald-300 font-bold"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-[10px] text-[#FAF5F6]/50 block">Preço (R$)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={pack.priceBrl}
                      onChange={(e) => {
                        const price = Math.max(1, Number(e.target.value) || 0);
                        const next = [...config.coinPackages];
                        next[idx] = { ...pack, priceBrl: price };
                        onUpdateConfig({ ...config, coinPackages: next });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#161013] border border-white/10 text-xs text-white font-bold"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (config.coinPackages.length <= 1) return;
                        onUpdateConfig({
                          ...config,
                          coinPackages: config.coinPackages.filter((p) => p.id !== pack.id)
                        });
                      }}
                      className="p-2 rounded-lg bg-rose-500/15 text-rose-300 hover:bg-rose-500/30"
                      title="Remover pacote"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Coin Package */}
            <div className="p-4 rounded-2xl bg-[#0D090B]/70 border border-dashed border-white/15 space-y-3">
              <span className="text-xs font-bold text-amber-200 block">
                Adicionar Novo Pacote de Moedas
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  value={newPackName}
                  onChange={(e) => setNewPackName(e.target.value)}
                  placeholder="Nome (ex: Pacote VIP)"
                  className="px-3 py-2 rounded-xl bg-[#161013] border border-white/10 text-xs text-white"
                />
                <input
                  type="number"
                  value={newPackCoins}
                  onChange={(e) => setNewPackCoins(e.target.value)}
                  placeholder="Moedas base"
                  className="px-3 py-2 rounded-xl bg-[#161013] border border-white/10 text-xs text-white"
                />
                <input
                  type="number"
                  value={newPackBonus}
                  onChange={(e) => setNewPackBonus(e.target.value)}
                  placeholder="Bônus"
                  className="px-3 py-2 rounded-xl bg-[#161013] border border-white/10 text-xs text-white"
                />
                <input
                  type="number"
                  value={newPackPrice}
                  onChange={(e) => setNewPackPrice(e.target.value)}
                  placeholder="Preço R$"
                  className="px-3 py-2 rounded-xl bg-[#161013] border border-white/10 text-xs text-white"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!newPackName.trim()) return;
                  const base = Math.max(10, Number(newPackCoins) || 100);
                  const bonus = Math.max(0, Number(newPackBonus) || 0);
                  const price = Math.max(5, Number(newPackPrice) || 49.9);
                  onUpdateConfig({
                    ...config,
                    coinPackages: [
                      ...config.coinPackages,
                      {
                        id: `pack_${Date.now()}`,
                        name: newPackName.trim(),
                        baseCoins: base,
                        bonusCoins: bonus,
                        totalCoins: base + bonus,
                        priceBrl: price,
                        badge: bonus > 0 ? `+${bonus} Moedas Bônus` : 'Novo Pacote'
                      }
                    ]
                  });
                  setNewPackName('');
                  notifyApplied('Novo pacote de Moedas Aura adicionado à loja!');
                }}
                className="px-4 py-2 rounded-xl bg-[#E11D48] text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar Pacote
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 velvet-card rounded-3xl p-6 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FB7185]" />
              Catálogo de Presentes (Lives & Posts de Vendedores)
            </h3>
            <p className="text-xs text-[#FAF5F6]/60">
              Estes presentes podem ser enviados usando Moedas Aura tanto nas transmissões ao vivo quanto nas mídias postadas por vendedores.
            </p>

            <div className="space-y-2.5">
              {config.creatorGifts.map((gift, idx) => (
                <div
                  key={gift.id}
                  className="p-3.5 rounded-2xl bg-[#0D090B] border border-white/10 flex items-center justify-between gap-3"
                >
                  <input
                    type="text"
                    value={gift.label}
                    onChange={(e) => {
                      const next = [...config.creatorGifts];
                      next[idx] = { ...gift, label: e.target.value };
                      onUpdateConfig({ ...config, creatorGifts: next });
                    }}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-[#161013] border border-white/10 text-xs text-white font-semibold"
                  />
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={gift.coins}
                      onChange={(e) => {
                        const next = [...config.creatorGifts];
                        next[idx] = {
                          ...gift,
                          coins: Math.max(1, Number(e.target.value) || 10)
                        };
                        onUpdateConfig({ ...config, creatorGifts: next });
                      }}
                      className="w-20 px-2.5 py-1.5 rounded-xl bg-[#161013] border border-white/10 text-xs text-amber-300 font-bold text-center"
                    />
                    <span className="text-[11px] text-[#FAF5F6]/60">Moedas</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[#0D090B] border border-white/10">
              <label className="text-xs font-bold text-white block mb-1">
                Saldo Inicial de Moedas para Contas Novas
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={config.initialUserCoins}
                  onChange={(e) =>
                    onUpdateConfig({
                      ...config,
                      initialUserCoins: Math.max(0, Number(e.target.value) || 0)
                    })
                  }
                  className="w-28 px-3.5 py-2 rounded-xl bg-[#161013] border border-white/15 text-xs text-amber-300 font-bold"
                />
                <span className="text-xs text-[#FAF5F6]/60">
                  Moedas de boas-vindas ao criar cadastro
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. VENDEDORES +18, TAXA ÚNICA DE R$ 50 & 3 NÍVEIS DE TAXA DE SAQUE
         ===================================================================== */}
      {activeSection === 'sellers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 velvet-card rounded-3xl p-6 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-300" />
              Regras de Ativação de Vendedor +18 & 3 Níveis de Saque
            </h3>

            <div className="p-4 rounded-2xl bg-[#0D090B] border border-white/10 space-y-3">
              <label className="text-xs font-bold text-white block">
                Taxa Única de Ativação para Começar a Vender (R$)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="1"
                  value={config.sellerActivationFeeBrl}
                  onChange={(e) =>
                    onUpdateConfig({
                      ...config,
                      sellerActivationFeeBrl: Math.max(0, Number(e.target.value) || 0)
                    })
                  }
                  className="w-32 px-3.5 py-2 rounded-xl bg-[#161013] border border-white/15 text-sm font-bold text-emerald-400"
                />
                <span className="text-xs text-[#FAF5F6]/65">
                  Padrão solicitado: R$ 50,00 (via PIX, Cartão ou Saldo)
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-white block">
                Taxas de Saque Justas por Nível de Vendedor (Quanto maior o nível, menor a taxa):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#0D090B] border border-amber-700/40 space-y-1.5">
                  <span className="text-[11px] font-bold text-amber-400 block">
                    Nível 1 · Bronze
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={config.sellerTierFees.nivel1FeePercent}
                      onChange={(e) =>
                        onUpdateConfig({
                          ...config,
                          sellerTierFees: {
                            ...config.sellerTierFees,
                            nivel1FeePercent: Math.min(50, Math.max(1, Number(e.target.value) || 20))
                          }
                        })
                      }
                      className="w-16 px-2.5 py-1.5 rounded-lg bg-[#161013] border border-white/15 text-xs font-bold text-white"
                    />
                    <span className="text-xs text-[#FAF5F6]/70">% taxa</span>
                  </div>
                  <p className="text-[10px] text-emerald-400">
                    Vendedor recebe {100 - config.sellerTierFees.nivel1FeePercent}% líquido
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0D090B] border border-slate-400/40 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-200 block">
                    Nível 2 · Prata Estrela
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={config.sellerTierFees.nivel2FeePercent}
                      onChange={(e) =>
                        onUpdateConfig({
                          ...config,
                          sellerTierFees: {
                            ...config.sellerTierFees,
                            nivel2FeePercent: Math.min(50, Math.max(1, Number(e.target.value) || 14))
                          }
                        })
                      }
                      className="w-16 px-2.5 py-1.5 rounded-lg bg-[#161013] border border-white/15 text-xs font-bold text-white"
                    />
                    <span className="text-xs text-[#FAF5F6]/70">% taxa</span>
                  </div>
                  <p className="text-[10px] text-emerald-400">
                    Vendedor recebe {100 - config.sellerTierFees.nivel2FeePercent}% líquido
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0D090B] border border-amber-400/50 space-y-1.5">
                  <span className="text-[11px] font-bold text-amber-300 block">
                    Nível 3 · Ouro / Diamante
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={config.sellerTierFees.nivel3FeePercent}
                      onChange={(e) =>
                        onUpdateConfig({
                          ...config,
                          sellerTierFees: {
                            ...config.sellerTierFees,
                            nivel3FeePercent: Math.min(50, Math.max(1, Number(e.target.value) || 8))
                          }
                        })
                      }
                      className="w-16 px-2.5 py-1.5 rounded-lg bg-[#161013] border border-white/15 text-xs font-bold text-white"
                    />
                    <span className="text-xs text-[#FAF5F6]/70">% taxa</span>
                  </div>
                  <p className="text-[10px] text-emerald-400">
                    Vendedor recebe {100 - config.sellerTierFees.nivel3FeePercent}% líquido
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 velvet-card rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#FB7185]" />
              Gerenciar Selo de Vendedor +18 dos Perfis
            </h3>
            <p className="text-xs text-[#FAF5F6]/65">
              Ative ou revogue instantaneamente o Selo de Vendedor +18 do seu próprio perfil ou de qualquer membro da plataforma.
            </p>

            {/* Current User Seller Toggle */}
            <div className="p-4 rounded-2xl bg-[#0D090B] border border-amber-400/35 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-white">{currentUser.name} (Sua Conta)</p>
                  <span className="text-[11px] text-amber-300">
                    {currentUser.isSellerVerified
                      ? 'Selo Vendedor +18 Ativo ✓'
                      : 'Conta Comum (Sem Selo +18)'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const nextState = !currentUser.isSellerVerified;
                  onUpdateCurrentUser({
                    isSellerVerified: nextState,
                    sellerProfile: currentUser.sellerProfile
                      ? { ...currentUser.sellerProfile, isSellerVerified: nextState }
                      : undefined
                  });
                  notifyApplied(
                    nextState
                      ? 'Selo de Vendedor +18 liberado na sua conta!'
                      : 'Selo de Vendedor +18 removido da sua conta.'
                  );
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold ${
                  currentUser.isSellerVerified
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#E11D48] text-white'
                }`}
              >
                {currentUser.isSellerVerified ? 'Revogar Selo' : 'Liberar Selo +18'}
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {profiles.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl bg-[#0D090B] border border-white/10 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={p.avatarUrl}
                      alt={p.name}
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">
                        {p.name}, {p.age}
                      </p>
                      <span className="text-[10px] text-[#FAF5F6]/55">{p.city}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateProfiles(
                        profiles.map((item) =>
                          item.id === p.id
                            ? { ...item, isSellerVerified: !item.isSellerVerified }
                            : item
                        )
                      );
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold ${
                      p.isSellerVerified
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/35'
                        : 'bg-white/[0.06] text-[#FAF5F6]/65 border border-white/10'
                    }`}
                  >
                    {p.isSellerVerified ? 'Vendedor +18 ✓' : 'Tornar Vendedor'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          5. PLANOS VIP (ANUAL COM DESTAQUE MENSAL & COBRANÇA ANUAL)
         ===================================================================== */}
      {activeSection === 'vip' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="velvet-card rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-300" />
              Preços VIP Velvet & Privé Black (Mensal e Anual)
            </h3>
            <p className="text-xs text-[#FAF5F6]/65">
              No plano anual, o valor equivalente por mês aparece em destaque maior e o valor total cobrado no ano aparece logo abaixo.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#0D090B] border border-white/10 space-y-2">
                <span className="text-xs font-bold text-[#FB7185] block">VIP Velvet</span>
                <label className="text-[10px] text-[#FAF5F6]/55 block">Mensal Avulso (R$)</label>
                <input
                  type="number"
                  step="0.1"
                  value={config.vipMonthlyBrl}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, vipMonthlyBrl: Number(e.target.value) || 49.9 })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-[#161013] border border-white/10 text-xs text-white font-bold"
                />
                <label className="text-[10px] text-[#FAF5F6]/55 block">
                  Equivalente Mensal no Anual (Destaque Maior)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={config.vipAnnualEquivalentMonthlyBrl}
                  onChange={(e) => {
                    const eq = Number(e.target.value) || 34.9;
                    onUpdateConfig({
                      ...config,
                      vipAnnualEquivalentMonthlyBrl: eq,
                      vipAnnualTotalBrl: Number((eq * 12).toFixed(2))
                    });
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#161013] border border-white/10 text-xs text-emerald-300 font-bold"
                />
                <span className="text-[11px] text-amber-300 block">
                  Total cobrado no ano: R$ {config.vipAnnualTotalBrl.toFixed(2)}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0D090B] border border-amber-400/30 space-y-2">
                <span className="text-xs font-bold text-amber-300 block">Privé Black</span>
                <label className="text-[10px] text-[#FAF5F6]/55 block">Mensal Avulso (R$)</label>
                <input
                  type="number"
                  step="0.1"
                  value={config.blackMonthlyBrl}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, blackMonthlyBrl: Number(e.target.value) || 99.9 })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-[#161013] border border-white/10 text-xs text-white font-bold"
                />
                <label className="text-[10px] text-[#FAF5F6]/55 block">
                  Equivalente Mensal no Anual (Destaque Maior)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={config.blackAnnualEquivalentMonthlyBrl}
                  onChange={(e) => {
                    const eq = Number(e.target.value) || 69.9;
                    onUpdateConfig({
                      ...config,
                      blackAnnualEquivalentMonthlyBrl: eq,
                      blackAnnualTotalBrl: Number((eq * 12).toFixed(2))
                    });
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#161013] border border-white/10 text-xs text-emerald-300 font-bold"
                />
                <span className="text-[11px] text-amber-300 block">
                  Total cobrado no ano: R$ {config.blackAnnualTotalBrl.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="velvet-card rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">
              Limites Diários do Plano Gratuito & Seu Nível VIP
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#0D090B] border border-white/10">
                <label className="text-xs text-[#FAF5F6]/70 block mb-1">
                  Curtidas Diárias (Grátis)
                </label>
                <input
                  type="number"
                  value={config.freeDailyLikesLimit}
                  onChange={(e) =>
                    onUpdateConfig({
                      ...config,
                      freeDailyLikesLimit: Math.max(1, Number(e.target.value) || 20)
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#161013] border border-white/10 text-xs text-white font-bold"
                />
              </div>
              <div className="p-4 rounded-2xl bg-[#0D090B] border border-white/10">
                <label className="text-xs text-[#FAF5F6]/70 block mb-1">
                  1ªs Mensagens Diárias (Grátis)
                </label>
                <input
                  type="number"
                  value={config.freeDailyFirstMessagesLimit}
                  onChange={(e) =>
                    onUpdateConfig({
                      ...config,
                      freeDailyFirstMessagesLimit: Math.max(1, Number(e.target.value) || 4)
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#161013] border border-white/10 text-xs text-white font-bold"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0D090B] border border-white/10 space-y-2">
              <span className="text-xs font-bold text-white block">
                Alterar Seu Próprio Plano para Testes:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['free', 'vip', 'black_vip'] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() =>
                      onUpdateCurrentUser({
                        isVip: tier !== 'free',
                        vipTier: tier
                      })
                    }
                    className={`py-2 rounded-xl text-xs font-bold border ${
                      currentUser.vipTier === tier
                        ? 'bg-[#E11D48] text-white border-transparent'
                        : 'bg-[#161013] text-[#FAF5F6]/70 border-white/10'
                    }`}
                  >
                    {tier === 'free' ? 'Grátis' : tier === 'vip' ? 'VIP Velvet' : 'Privé Black'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          6. DESCOBRIR (CARD AMPLIADO CELULAR), ALTURA (CM/PÉS) & LOCALIZAÇÃO DINÂMICA
         ===================================================================== */}
      {activeSection === 'discover_height' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 velvet-card rounded-3xl p-6 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#FB7185]" />
              Visualização no Celular em Descobrir (Imagem 3) & Seletor de Altura (Imagem 2)
            </h3>

            <div>
              <label className="text-xs text-[#FAF5F6]/70 block mb-2">
                Tamanho do Card de Fotos no Celular (Aba Descobrir)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'standard', label: 'Padrão (460px)' },
                  { id: 'large', label: 'Ampliado (540px)' },
                  { id: 'fullscreen', label: 'Imersivo (620px)' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      onUpdateConfig({
                        ...config,
                        mobileDiscoverCardScale:
                          opt.id as SiteAdminConfig['mobileDiscoverCardScale']
                      })
                    }
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border ${
                      config.mobileDiscoverCardScale === opt.id
                        ? 'bg-[#E11D48] text-white border-transparent'
                        : 'bg-[#0D090B] text-[#FAF5F6]/70 border-white/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-[#FAF5F6]/70 block mb-2">
                Unidade Prioritária do Seletor Compacto de Altura (Imagem 2)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'auto_gps', label: 'Automático (Localização)' },
                  { id: 'cm', label: 'Priorizar cm / m' },
                  { id: 'ft', label: 'Priorizar pés (ft/in)' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      onUpdateConfig({
                        ...config,
                        defaultHeightUnit: opt.id as SiteAdminConfig['defaultHeightUnit']
                      })
                    }
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border ${
                      config.defaultHeightUnit === opt.id
                        ? 'bg-[#E11D48] text-white border-transparent'
                        : 'bg-[#0D090B] text-[#FAF5F6]/70 border-white/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 velvet-card rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-300" />
              Cidades e Regiões Dinâmicas ("De onde ela é")
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCityInput}
                onChange={(e) => setNewCityInput(e.target.value)}
                placeholder="Ex: Campinas, Cambuí (SP)"
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#0D090B] border border-white/15 text-xs text-white"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newCityInput.trim()) return;
                  onUpdateConfig({
                    ...config,
                    dynamicLocationsList: [
                      newCityInput.trim(),
                      ...config.dynamicLocationsList
                    ]
                  });
                  setNewCityInput('');
                  notifyApplied('Nova região adicionada às sugestões dinâmicas!');
                }}
                className="px-4 py-2 rounded-xl bg-[#E11D48] text-white text-xs font-bold"
              >
                Adicionar
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
              {config.dynamicLocationsList.map((loc) => (
                <span
                  key={loc}
                  className="px-3 py-1.5 rounded-xl bg-[#0D090B] border border-white/10 text-xs text-[#FAF5F6] flex items-center gap-2"
                >
                  {loc}
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateConfig({
                        ...config,
                        dynamicLocationsList: config.dynamicLocationsList.filter(
                          (item) => item !== loc
                        )
                      })
                    }
                    className="text-rose-400 hover:text-rose-300"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          7. ENCONTROS REAIS, GRUPOS, LIVES & CHAT WHATSAPP
         ===================================================================== */}
      {activeSection === 'meetups_chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 velvet-card rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-400" />
              Permissões de Lives, Vídeo em Grupos & Chat Estilo WhatsApp
            </h3>

            {[
              {
                key: 'allowLivesOnlyVipAndSellers' as const,
                title: 'Lives Exclusivas para Membros VIP e Vendedores +18',
                desc: 'Impede contas gratuitas comuns de abrirem transmissões ao vivo.'
              },
              {
                key: 'enableGroupVideoCalls' as const,
                title: 'Chamadas de Vídeo nos Grupos de Encontros Reais',
                desc: 'Permite sala de vídeo ao vivo entre participantes inscritos no encontro.'
              },
              {
                key: 'enableCommunityVideoCalls' as const,
                title: 'Chamadas de Vídeo nas Comunidades & Clubes',
                desc: 'Ativa videochamadas coletivas dentro das comunidades.'
              },
              {
                key: 'enableWhatsappMobileChatLayout' as const,
                title: 'Chat Mobile no Estilo WhatsApp (Com Emojis, GIFs, Fotos e Vídeos)',
                desc: 'Lista de conversas que abre a janela dedicada ao clicar.'
              },
              {
                key: 'autoJoinMeetupGroupAfterPayment' as const,
                title: 'Entrada Automática no Grupo Oficial Após Inscrição no Encontro',
                desc: 'Assim que o membro confirma pagamento/reserva, entra direto no grupo.'
              }
            ].map((item) => (
              <div
                key={item.key}
                className="p-3.5 rounded-2xl bg-[#0D090B] border border-white/10 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-xs font-bold text-white">{item.title}</p>
                  <p className="text-[11px] text-[#FAF5F6]/55">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateConfig({ ...config, [item.key]: !config[item.key] })
                  }
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
                    config[item.key]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/10 text-[#FAF5F6]/60'
                  }`}
                >
                  {config[item.key] ? 'Ativo ✓' : 'Inativo'}
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-6 velvet-card rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FB7185]" />
              Gerenciar Eventos na Aba Encontros Reais ({venues.length})
            </h3>

            <div className="p-4 rounded-2xl bg-[#0D090B] border border-white/10 space-y-3">
              <span className="text-xs font-bold text-amber-200 block">
                Criar Novo Encontro Real / Evento Oficial
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newVenueName}
                  onChange={(e) => setNewVenueName(e.target.value)}
                  placeholder="Nome do Clube / Evento"
                  className="px-3 py-2 rounded-xl bg-[#161013] border border-white/10 text-xs text-white"
                />
                <input
                  type="text"
                  value={newVenueNeighborhood}
                  onChange={(e) => setNewVenueNeighborhood(e.target.value)}
                  placeholder="Bairro / Cidade"
                  className="px-3 py-2 rounded-xl bg-[#161013] border border-white/10 text-xs text-white"
                />
                <input
                  type="number"
                  value={newVenuePrice}
                  onChange={(e) => setNewVenuePrice(e.target.value)}
                  placeholder="Ingresso R$"
                  className="px-3 py-2 rounded-xl bg-[#161013] border border-white/10 text-xs text-white"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!newVenueName.trim()) return;
                  const price = Math.max(0, Number(newVenuePrice) || 120);
                  const created: MeetupVenue = {
                    id: `venue_${Date.now()}`,
                    name: newVenueName.trim(),
                    category: 'Clube Privado & Lifestyle',
                    address: 'Endereço Confidencial (Liberado após inscrição)',
                    neighborhood: newVenueNeighborhood.trim() || 'Jardins, São Paulo',
                    distanceKm: 2.4,
                    rating: 4.9,
                    safeCheckInCertified: true,
                    imageUrl: '/src/assets/images/venue_lounge_meet_1790885792094.jpg',
                    perks: 'Welcome drink + Entrada automática no grupo oficial com vídeo',
                    securityNotice: 'Portaria biométrica e pulseiras de consentimento.',
                    isPaidMeetup: price > 0,
                    meetupPrice: price,
                    meetupEventTitle: `Noite Privé: ${newVenueName.trim()}`,
                    meetupDate: 'Sábado, 22h30'
                  };
                  onUpdateVenues([created, ...venues]);
                  setNewVenueName('');
                  notifyApplied('Novo Encontro Real publicado com grupo automático!');
                }}
                className="px-4 py-2 rounded-xl bg-[#E11D48] text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Publicar Encontro Real
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {venues.map((v) => (
                <div
                  key={v.id}
                  className="p-3 rounded-2xl bg-[#0D090B] border border-white/10 flex items-center justify-between gap-2"
                >
                  <div>
                    <p className="text-xs font-bold text-white">{v.name}</p>
                    <span className="text-[11px] text-[#FAF5F6]/55">
                      {v.neighborhood} • R$ {(v.meetupPrice || 0).toFixed(2)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateVenues(venues.filter((item) => item.id !== v.id))
                    }
                    className="p-2 rounded-lg bg-rose-500/15 text-rose-300 hover:bg-rose-500/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          8. CADASTRO, PESQUISA DE PERFIL, 2FA & EXCLUSÃO DE CONTA
         ===================================================================== */}
      {activeSection === 'security_onboarding' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="velvet-card rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Pesquisa Pós-Cadastro & Verificações de Segurança
            </h3>

            {[
              {
                key: 'enablePostSignupSurvey' as const,
                title: 'Pesquisa Interativa de Criação de Perfil Após Novo Cadastro',
                desc: 'Abre as 4 etapas (Localização/Altura, Estilo Liberal, Dinâmica BDSM e Pergunta Quebra-Gelo) assim que o usuário cria uma conta.'
              },
              {
                key: 'requireOtpOnSignup' as const,
                title: 'Exigir Código de Verificação (SMS ou E-mail) no Cadastro',
                desc: 'Valida o código de 6 dígitos antes de concluir a criação de novas contas.'
              },
              {
                key: 'requireOtpOnAccountDelete' as const,
                title: 'Exigir Código de Verificação para Deletar Conta',
                desc: 'Impede exclusão acidental exigindo confirmação via SMS ou E-mail.'
              },
              {
                key: 'enable2faSecurity' as const,
                title: 'Autenticação de 2 Fatores (2FA) Disponível no Perfil',
                desc: 'Permite ativar 2FA por celular ou e-mail na aba Privacidade & 2FA.'
              }
            ].map((item) => (
              <div
                key={item.key}
                className="p-3.5 rounded-2xl bg-[#0D090B] border border-white/10 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-xs font-bold text-white">{item.title}</p>
                  <p className="text-[11px] text-[#FAF5F6]/55">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateConfig({ ...config, [item.key]: !config[item.key] })
                  }
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
                    config[item.key]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/10 text-[#FAF5F6]/60'
                  }`}
                >
                  {config[item.key] ? 'Ativo ✓' : 'Inativo'}
                </button>
              </div>
            ))}
          </div>

          <div className="velvet-card rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-amber-300" />
              Testar Fluxos de Cadastro & Pesquisa Agora
            </h3>
            <p className="text-xs text-[#FAF5F6]/65 leading-relaxed">
              Você pode abrir e testar a <strong>Pesquisa Interativa Pós-Cadastro</strong> a qualquer momento clicando no botão abaixo, sem precisar sair da sua conta atual.
            </p>

            <button
              type="button"
              onClick={onTriggerOnboardingSurvey}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white text-xs sm:text-sm font-bold shadow-lg"
            >
              Abrir Pesquisa Pós-Cadastro Agora
            </button>

            <div className="p-4 rounded-2xl bg-[#0D090B] border border-emerald-400/30 space-y-1.5 text-xs">
              <p className="font-bold text-emerald-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Proteção de Acesso do PAINEL ADM
              </p>
              <p className="text-[#FAF5F6]/65 leading-relaxed">
                Esta aba (<strong>PAINEL ADM</strong>) está isolada no módulo <code>PainelAdm.tsx</code> e bloqueada para visitantes comuns que acessam o site normalmente. Apenas o proprietário no ambiente de administração possui acesso.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
