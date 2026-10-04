import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Radio,
  Sparkles,
  Flame,
  Eye,
  EyeOff,
  Heart,
  X,
  Crown,
  ShieldCheck,
  Video,
  Camera,
  KeyRound,
  Copy,
  Check,
  DollarSign,
  Clock,
  Users,
  Send,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Mic,
  MicOff
} from 'lucide-react';
import {
  User,
  UserStatusStory,
  LiveStreamSession,
  AdultContentCategory,
  LiberalMoment,
  AdultContentItem
} from '../types';
import { MediaUploadPicker, EditedMediaResult } from './MediaUploadPicker';
import { ADULT_CONTENT_CATEGORIES } from '../data/mockData';

interface StatusAndLiveBarProps {
  currentUser: User;
  stories: UserStatusStory[];
  liveStreams: LiveStreamSession[];
  onAddStory: (story: UserStatusStory) => void;
  onAddMomentFromStatus?: (moment: LiberalMoment) => void;
  onAddSellerItemFromStatus?: (item: AdultContentItem) => void;
  onStartLiveStream: (live: LiveStreamSession) => void;
  onOpenVip: () => void;
  onOpenSellerSetup: () => void;
}

export function StatusAndLiveBar({
  currentUser,
  stories,
  liveStreams,
  onAddStory,
  onAddMomentFromStatus,
  onAddSellerItemFromStatus,
  onStartLiveStream,
  onOpenVip,
  onOpenSellerSetup
}: StatusAndLiveBarProps) {
  // Modals state
  const [showCreateStatusModal, setShowCreateStatusModal] = useState(false);
  const [showGoLiveModal, setShowGoLiveModal] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [activeLiveSession, setActiveLiveSession] = useState<LiveStreamSession | null>(null);
  const [nsfwConsentRevealedIds, setNsfwConsentRevealedIds] = useState<string[]>([]);

  // Create Status Form State
  const [statusMedia, setStatusMedia] = useState<EditedMediaResult>({
    url: '/src/assets/images/liberal_moment_art_1790885781551.jpg',
    mediaType: 'image',
    filterCss: 'none',
    overlayText: ''
  });
  const [statusCaption, setStatusCaption] = useState('');
  const [isNsfw18, setIsNsfw18] = useState(true);

  // Cross-post from Status to Momentos Liberais or Vendas +18
  const [alsoPostToMoments, setAlsoPostToMoments] = useState(false);
  const [alsoPutForSale, setAlsoPutForSale] = useState(false);
  const [salePrice, setSalePrice] = useState('39.90');
  const [saleCategory, setSaleCategory] = useState<AdultContentCategory>(
    'Ensaio Sensual & Lingerie'
  );
  const [saleTagsInput, setSaleTagsInput] = useState('StatusExclusivo, SemCensura, +18');
  const [destructHours, setDestructHours] = useState<number>(24);

  // Go Live Studio State (VIP+ or Verified Seller only)
  const isVerifiedSeller = Boolean(
    currentUser.isSellerVerified || currentUser.sellerProfile?.isSellerVerified
  );
  const canGoLive = currentUser.vipTier !== 'free' || isVerifiedSeller;

  const [liveTitle, setLiveTitle] = useState('Noite de Vinho & Conversa sem Filtros 🔥');
  const [liveCategory, setLiveCategory] = useState('Casais & Sensualidade');
  const [liveMethod, setLiveMethod] = useState<'camera' | 'obs_rtmp'>('camera');
  const [liveAccessMode, setLiveAccessMode] = useState<'public' | 'vip_only' | 'ppv'>('public');
  const [liveEntryPrice, setLiveEntryPrice] = useState('19.90');
  const [copiedStreamKey, setCopiedStreamKey] = useState(false);
  const [isBroadcastingNow, setIsBroadcastingNow] = useState(false);
  const [liveMicMuted, setLiveMicMuted] = useState(false);
  const [liveChatInput, setLiveChatInput] = useState('');
  const [liveChatMessages, setLiveChatMessages] = useState<
    { id: string; user: string; text: string; tip?: number }[]
  >([
    { id: 'lc1', user: 'Valentina & Gabriel', text: 'Que iluminação incrível nessa live! 🔥' },
    { id: 'lc2', user: 'Lucas M.', text: 'Enviou um mimo para a transmissão', tip: 25 }
  ]);

  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const liveStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (showGoLiveModal && canGoLive && liveMethod === 'camera') {
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          liveStreamRef.current = stream;
          if (liveVideoRef.current) {
            liveVideoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          // fallback if camera not available in preview environment
        });
    } else {
      if (liveStreamRef.current) {
        liveStreamRef.current.getTracks().forEach((t) => t.stop());
        liveStreamRef.current = null;
      }
    }
    return () => {
      if (liveStreamRef.current) {
        liveStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [showGoLiveModal, canGoLive, liveMethod]);

  const handlePublishStatus = (e: React.FormEvent) => {
    e.preventDefault();

    const newStory: UserStatusStory = {
      id: `story_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatarUrl,
      isAuthorVerified: currentUser.isVerified,
      isAuthorVip: currentUser.vipTier !== 'free' || isVerifiedSeller,
      isAuthorSeller: isVerifiedSeller,
      mediaUrl: statusMedia.url,
      mediaType: statusMedia.mediaType,
      caption: statusCaption.trim() || 'Novo status no Aura Pulse ✨',
      overlayText: statusMedia.overlayText || undefined,
      filterCss: statusMedia.filterCss,
      isNsfw18,
      createdAt: 'Agora',
      viewsCount: 1,
      likesCount: 0
    };

    onAddStory(newStory);

    const parsedTags = saleTagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    // Optional Cross-post 1: Post to Momentos Liberais
    if (alsoPostToMoments && onAddMomentFromStatus) {
      const newMoment: LiberalMoment = {
        id: `mom_status_${Date.now()}`,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatarUrl,
        isAuthorVerified: currentUser.isVerified,
        isAuthorSeller: isVerifiedSeller,
        mediaUrl: statusMedia.url,
        mediaType: statusMedia.mediaType,
        caption: statusCaption.trim() || 'Compartilhado via Aura Status',
        timestamp: 'Agora',
        likes: 1,
        isLiked: true,
        e2eeSignature: 'SHA256-STATUS',
        isSensitiveNsfw: isNsfw18,
        selfDestructMins: destructHours > 0 ? destructHours * 60 : undefined,
        tags: parsedTags.length > 0 ? parsedTags : ['StatusLiberal', '+18'],
        isLockedVip: false,
        isMonetizedSale: isVerifiedSeller && alsoPutForSale,
        salePrice:
          isVerifiedSeller && alsoPutForSale
            ? parseFloat(salePrice.replace(',', '.')) || 39.9
            : undefined,
        isUnlockedByMe: true
      };
      onAddMomentFromStatus(newMoment);
    }

    // Optional Cross-post 2: Put for Sale in Seller Studio Vault
    if (isVerifiedSeller && alsoPutForSale && onAddSellerItemFromStatus) {
      const numericPrice = parseFloat(salePrice.replace(',', '.')) || 39.9;
      const newSellerItem: AdultContentItem = {
        id: `sale_status_${Date.now()}`,
        title: statusCaption.trim() || `Status Exclusivo (${saleCategory})`,
        description: `Publicado via Status com edição personalizada · Categoria: ${saleCategory}`,
        category: saleCategory,
        mediaUrl: statusMedia.url,
        mediaType: statusMedia.mediaType,
        price: numericPrice,
        selfDestructMins: destructHours > 0 ? destructHours * 60 : undefined,
        salesCount: 0,
        createdAt: 'Agora mesmo',
        drmProtected: true,
        tags: parsedTags.length > 0 ? parsedTags : [saleCategory, '+18']
      };
      onAddSellerItemFromStatus(newSellerItem);
    }

    setStatusCaption('');
    setAlsoPostToMoments(false);
    setAlsoPutForSale(false);
    setShowCreateStatusModal(false);
  };

  const handleLaunchLive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canGoLive) return;

    const newLive: LiveStreamSession = {
      id: `live_${Date.now()}`,
      hostId: currentUser.id,
      hostName: currentUser.name,
      hostAvatar: currentUser.avatarUrl,
      isHostVerified: currentUser.isVerified,
      isHostSeller: isVerifiedSeller,
      title: liveTitle.trim() || 'Live Exclusiva Aura Privé',
      category: liveCategory,
      viewersCount: 18,
      isVipOnly: liveAccessMode === 'vip_only',
      entryPrice:
        liveAccessMode === 'ppv' ? parseFloat(liveEntryPrice.replace(',', '.')) || 19.9 : undefined,
      streamMethod: liveMethod,
      thumbnailUrl: currentUser.avatarUrl
    };

    onStartLiveStream(newLive);
    setIsBroadcastingNow(true);
    setActiveLiveSession(newLive);
    setShowGoLiveModal(false);
  };

  const activeStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  return (
    <div className="velvet-card rounded-3xl p-4 sm:p-5">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] animate-pulse" />
          <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-display">
            Aura Pulse · Status & Lives Ao Vivo
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCreateStatusModal(true)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.14] border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[#FB7185]" />
            <span>Postar Status</span>
          </button>

          <button
            type="button"
            onClick={() => setShowGoLiveModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#9F1239] hover:brightness-110 text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-[#E11D48]/30 transition-all"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Fazer Live</span>
          </button>
        </div>
      </div>

      {/* Horizontal Carousel of Status Portals & Live Streams (Mobile/Tablet/Desktop Optimized) */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1.5 pt-0.5 select-none">
        {/* Card 0: Add My Status Portal */}
        <button
          type="button"
          onClick={() => setShowCreateStatusModal(true)}
          className="shrink-0 w-24 sm:w-28 h-36 sm:h-40 rounded-2xl relative overflow-hidden border border-dashed border-[#FB7185]/50 hover:border-[#E11D48] bg-[#140D11] group transition-all flex flex-col justify-between p-2.5 text-left"
        >
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D090B] via-[#0D090B]/40 to-transparent" />

          <div className="relative z-10 w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E11D48] to-[#FB7185] text-white flex items-center justify-center shadow-md">
            <Plus className="w-4 h-4" />
          </div>

          <div className="relative z-10">
            <p className="text-[11px] font-bold text-white leading-tight">Criar Status</p>
            <span className="text-[9px] text-[#FAF5F6]/65 block mt-0.5">
              Foto, Vídeo ou Venda
            </span>
          </div>
        </button>

        {/* Active Live Streams First */}
        {liveStreams.map((live) => (
          <button
            key={live.id}
            type="button"
            onClick={() => setActiveLiveSession(live)}
            className="shrink-0 w-24 sm:w-28 h-36 sm:h-40 rounded-2xl relative overflow-hidden p-[2px] bg-gradient-to-b from-[#E11D48] via-amber-400 to-[#9F1239] shadow-lg shadow-[#E11D48]/25 group transition-transform hover:-translate-y-0.5 text-left"
          >
            <div className="w-full h-full rounded-[14px] overflow-hidden relative bg-[#0D090B]">
              <img
                src={live.thumbnailUrl}
                alt={live.hostName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/40" />

              <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-[#E11D48] text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  AO VIVO
                </span>
                <span className="text-[9px] text-white/90 font-mono bg-black/60 px-1.5 py-0.5 rounded">
                  {live.viewersCount}
                </span>
              </div>

              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-[11px] font-bold text-white truncate">{live.hostName}</p>
                <p className="text-[9px] text-amber-300 truncate">{live.title}</p>
              </div>
            </div>
          </button>
        ))}

        {/* User Status Stories */}
        {stories.map((story, idx) => (
          <button
            key={story.id}
            type="button"
            onClick={() => setActiveStoryIndex(idx)}
            className="shrink-0 w-24 sm:w-28 h-36 sm:h-40 rounded-2xl relative overflow-hidden p-[2px] bg-gradient-to-tr from-[#E11D48] via-[#FB7185] to-amber-300 group transition-transform hover:-translate-y-0.5 text-left"
          >
            <div className="w-full h-full rounded-[14px] overflow-hidden relative bg-[#0D090B]">
              <img
                src={story.mediaUrl}
                alt={story.authorName}
                referrerPolicy="no-referrer"
                style={{ filter: story.filterCss || 'none' }}
                className={`w-full h-full object-cover transition-all ${
                  story.isNsfw18 ? 'blur-md scale-110' : 'group-hover:scale-105'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />

              <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                <img
                  src={story.authorAvatar}
                  alt={story.authorName}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-xl object-cover border border-white"
                />
                {story.isNsfw18 && (
                  <span className="px-1.5 py-0.5 rounded bg-black/75 text-[#FB7185] text-[9px] font-bold border border-[#E11D48]/40">
                    +18
                  </span>
                )}
              </div>

              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-[11px] font-bold text-white truncate flex items-center gap-1">
                  <span>{story.authorName}</span>
                  {story.isAuthorVerified && (
                    <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                  )}
                </p>
                <span className="text-[9px] text-[#FAF5F6]/65 block truncate">
                  {story.createdAt}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* MODAL 1: CREATE STATUS (With Built-in Photo/Video Editor + Cross-post to Momentos Liberais or Vendas +18) */}
      {showCreateStatusModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl velvet-card border border-white/15 p-5 sm:p-6 max-h-[92vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FB7185]" />
                  Publicar Novo Status (Foto ou Vídeo)
                </h3>
                <p className="text-[11px] text-[#FAF5F6]/60">
                  Edite sua mídia antes de enviar e escolha se deseja publicar também nos Momentos ou Vendas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateStatusModal(false)}
                className="p-1.5 rounded-xl bg-white/[0.06] text-[#FAF5F6]/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublishStatus} className="space-y-4">
              {/* Universal File / Gallery Picker + Built-in Photo & Video Editor */}
              <MediaUploadPicker
                valueUrl={statusMedia.url}
                mediaType={statusMedia.mediaType}
                onChangeMedia={(res) => setStatusMedia(res)}
                showBuiltInEditor={true}
                label="Escolher Mídia do Computador ou Galeria do Celular/Tablet"
              />

              <div>
                <label className="text-xs font-semibold text-white block mb-1">
                  Legenda do Status
                </label>
                <input
                  type="text"
                  value={statusCaption}
                  onChange={(e) => setStatusCaption(e.target.value)}
                  placeholder="O que está acontecendo agora?..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D090B] border border-white/10 text-xs text-white"
                />
              </div>

              {/* +18 Content Warning Toggle */}
              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#0D090B] border border-white/10 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-[#FB7185] shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Aviso de Conteúdo Sensível (+18)
                    </span>
                    <span className="text-[10px] text-[#FAF5F6]/60">
                      Aplica desfoque preventivo até que o espectador confirme querer ver
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isNsfw18}
                  onChange={(e) => setIsNsfw18(e.target.checked)}
                  className="w-4 h-4 accent-[#E11D48]"
                />
              </label>

              {/* Cross-Post Options: Momento Liberal & Venda de Conteúdo */}
              <div className="p-4 rounded-2xl bg-[#161013] border border-white/10 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
                  Reaproveitar este Status em outras abas:
                </span>

                <label className="flex items-center justify-between text-xs text-[#FAF5F6] cursor-pointer">
                  <span>Publicar também na aba Momentos Liberais</span>
                  <input
                    type="checkbox"
                    checked={alsoPostToMoments}
                    onChange={(e) => setAlsoPostToMoments(e.target.checked)}
                    className="w-4 h-4 accent-[#E11D48]"
                  />
                </label>

                {isVerifiedSeller ? (
                  <label className="flex items-center justify-between text-xs text-[#FAF5F6] cursor-pointer pt-2 border-t border-white/[0.06]">
                    <span className="font-semibold text-[#FB7185]">
                      Colocar também para Vender na Vitrine +18 (Selo Vendedor)
                    </span>
                    <input
                      type="checkbox"
                      checked={alsoPutForSale}
                      onChange={(e) => setAlsoPutForSale(e.target.checked)}
                      className="w-4 h-4 accent-[#E11D48]"
                    />
                  </label>
                ) : (
                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#FAF5F6]/60">
                    <span>Quer vender mídias pelo Status? Ative seu Selo de Vendedor.</span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateStatusModal(false);
                        onOpenSellerSetup();
                      }}
                      className="text-[#FB7185] font-semibold hover:underline"
                    >
                      Ativar Vendas
                    </button>
                  </div>
                )}

                {/* Expanded Monetization Settings when "Colocar para vender" or "Postar no Momento Liberal" is checked */}
                {(alsoPostToMoments || alsoPutForSale) && (
                  <div className="pt-3 border-t border-white/10 space-y-3">
                    {alsoPutForSale && isVerifiedSeller && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-[#FAF5F6]/70 block mb-1">
                            Preço de Venda (R$)
                          </label>
                          <input
                            type="text"
                            value={salePrice}
                            onChange={(e) => setSalePrice(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#0D090B] border border-white/15 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-[#FAF5F6]/70 block mb-1">
                            Categoria de Venda +18
                          </label>
                          <select
                            value={saleCategory}
                            onChange={(e) =>
                              setSaleCategory(e.target.value as AdultContentCategory)
                            }
                            className="w-full px-3 py-2 rounded-xl bg-[#0D090B] border border-white/15 text-xs text-white"
                          >
                            {ADULT_CONTENT_CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-[11px] text-[#FAF5F6]/70 block mb-1">
                        Tags (separadas por vírgula)
                      </label>
                      <input
                        type="text"
                        value={saleTagsInput}
                        onChange={(e) => setSaleTagsInput(e.target.value)}
                        placeholder="Ex: EnsaioNoturno, Lingerie, +18"
                        className="w-full px-3 py-2 rounded-xl bg-[#0D090B] border border-white/15 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-[#FAF5F6]/70 block mb-1">
                        Tempo de Autodestruição
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { h: 0, label: 'Permanente' },
                          { h: 1, label: '1 Hora' },
                          { h: 24, label: '24 Horas' },
                          { h: 168, label: '7 Dias' }
                        ].map((opt) => (
                          <button
                            key={opt.h}
                            type="button"
                            onClick={() => setDestructHours(opt.h)}
                            className={`py-1.5 rounded-xl text-[11px] font-semibold border ${
                              destructHours === opt.h
                                ? 'bg-[#E11D48] text-white border-[#E11D48]'
                                : 'bg-[#0D090B] text-[#FAF5F6]/65 border-white/10'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateStatusModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] text-xs text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-xs font-bold text-white shadow-lg"
                >
                  Publicar Status Agora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: FAZER LIVE (Restricted to VIP+ and Verified Sellers, with Camera & OBS/RTMP methods) */}
      {showGoLiveModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl velvet-card border border-white/15 p-6 max-h-[92vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#E11D48] animate-pulse" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    Estúdio de Transmissão ao Vivo (Live +18)
                  </h3>
                  <p className="text-[11px] text-[#FAF5F6]/60">
                    Exclusivo para membros VIP, Black e Vendedores Verificados
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGoLiveModal(false)}
                className="p-1.5 rounded-xl bg-white/[0.06] text-[#FAF5F6]/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!canGoLive ? (
              <div className="p-6 rounded-2xl bg-[#0D090B] border border-amber-400/30 text-center space-y-4">
                <Crown className="w-10 h-10 text-amber-300 mx-auto" />
                <h4 className="text-base font-bold text-white">
                  Transmissões Ao Vivo são exclusivas para VIPs e Vendedores
                </h4>
                <p className="text-xs text-[#FAF5F6]/70 leading-relaxed">
                  Assine o plano VIP/Black ou conclua sua ativação de Vendedor Verificado para transmitir ao vivo pela câmera do celular/PC ou OBS Studio e receber gorjetas em tempo real.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowGoLiveModal(false);
                      onOpenVip();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white text-xs font-bold"
                  >
                    Ver Planos VIP & Black
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowGoLiveModal(false);
                      onOpenSellerSetup();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
                  >
                    Ativar Selo de Vendedor
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLaunchLive} className="space-y-4">
                {/* Stream Method Selector: Direct Camera vs OBS/RTMP */}
                <div>
                  <label className="text-xs font-semibold text-white block mb-2">
                    Método de Transmissão da Live
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setLiveMethod('camera')}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                        liveMethod === 'camera'
                          ? 'bg-[#E11D48]/20 border-[#E11D48] text-white'
                          : 'bg-[#0D090B] border-white/10 text-[#FAF5F6]/70'
                      }`}
                    >
                      <Camera className="w-5 h-5 text-[#FB7185] shrink-0" />
                      <div>
                        <p className="text-xs font-bold">Câmera Direta</p>
                        <p className="text-[10px] opacity-70">Celular, Tablet ou Webcam</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLiveMethod('obs_rtmp')}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                        liveMethod === 'obs_rtmp'
                          ? 'bg-[#E11D48]/20 border-[#E11D48] text-white'
                          : 'bg-[#0D090B] border-white/10 text-[#FAF5F6]/70'
                      }`}
                    >
                      <KeyRound className="w-5 h-5 text-amber-300 shrink-0" />
                      <div>
                        <p className="text-xs font-bold">OBS Studio / RTMP</p>
                        <p className="text-[10px] opacity-70">Chave de Stream Externa</p>
                      </div>
                    </button>
                  </div>
                </div>

                {liveMethod === 'camera' ? (
                  <div className="relative h-48 rounded-2xl overflow-hidden bg-black border border-white/15">
                    <video
                      ref={liveVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex flex-col justify-between p-3 bg-gradient-to-t from-black/70 via-transparent to-black/30">
                      <span className="self-start px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                        Câmera WebRTC Pronta
                      </span>
                      <p className="text-[11px] text-white/80">
                        Prévia da sua câmera. Criptografia em tempo real ativada.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#0D090B] border border-white/10 space-y-2.5 text-xs">
                    <div>
                      <span className="text-[10px] text-[#FAF5F6]/50 block">
                        Servidor RTMP Aura Privé:
                      </span>
                      <code className="text-amber-300 font-mono text-[11px]">
                        rtmps://ingest.auraprive.com:443/live
                      </code>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="truncate">
                        <span className="text-[10px] text-[#FAF5F6]/50 block">
                          Sua Chave de Stream Privada:
                        </span>
                        <code className="text-white font-mono text-[11px]">
                          ap_live_99482_secret_key_x82
                        </code>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText('ap_live_99482_secret_key_x82');
                          setCopiedStreamKey(true);
                          setTimeout(() => setCopiedStreamKey(false), 2000);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-[11px] font-semibold flex items-center gap-1 shrink-0"
                      >
                        {copiedStreamKey ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copiar Chave
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#FAF5F6]/70 block mb-1">Título da Live</label>
                    <input
                      type="text"
                      required
                      value={liveTitle}
                      onChange={(e) => setLiveTitle(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0D090B] border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#FAF5F6]/70 block mb-1">Categoria</label>
                    <select
                      value={liveCategory}
                      onChange={(e) => setLiveCategory(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0D090B] border border-white/10 text-xs text-white"
                    >
                      <option value="Casais & Sensualidade">Casais & Sensualidade</option>
                      <option value="Show Solo & Lingerie">Show Solo & Lingerie</option>
                      <option value="Sessão BDSM & Shibari">Sessão BDSM & Shibari</option>
                      <option value="Bate-papo Liberal">Bate-papo Liberal</option>
                    </select>
                  </div>
                </div>

                {/* Access Mode: Public, VIP Only, or Pay-Per-View */}
                <div>
                  <label className="text-xs text-[#FAF5F6]/70 block mb-1.5">
                    Quem pode assistir sua Live?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'public', label: 'Aberta a Todos' },
                      { id: 'vip_only', label: 'Apenas VIPs' },
                      { id: 'ppv', label: 'Ingresso Pago' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() =>
                          setLiveAccessMode(m.id as 'public' | 'vip_only' | 'ppv')
                        }
                        className={`py-2 rounded-xl text-xs font-semibold border ${
                          liveAccessMode === m.id
                            ? 'bg-[#E11D48] text-white border-[#E11D48]'
                            : 'bg-[#0D090B] text-[#FAF5F6]/65 border-white/10'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {liveAccessMode === 'ppv' && (
                  <div>
                    <label className="text-xs text-[#FAF5F6]/70 block mb-1">
                      Valor do Ingresso da Live (R$)
                    </label>
                    <input
                      type="text"
                      value={liveEntryPrice}
                      onChange={(e) => setLiveEntryPrice(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0D090B] border border-white/15 text-xs text-white font-mono"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGoLiveModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/[0.06] text-xs text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-xs font-bold text-white flex items-center gap-2 shadow-lg"
                  >
                    <Radio className="w-4 h-4" />
                    Entrar Ao Vivo Agora
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: FULLSCREEN STATUS VIEWER */}
      {activeStory && activeStoryIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-md aspect-[9/16] max-h-[88vh] rounded-3xl overflow-hidden bg-[#0D090B] border border-white/15 flex flex-col justify-between shadow-2xl">
            {/* Story Progress Bars */}
            <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1">
              {stories.map((st, idx) => (
                <div
                  key={st.id}
                  className="flex-1 h-1 rounded-full bg-white/25 overflow-hidden"
                >
                  <div
                    className={`h-full ${
                      idx <= activeStoryIndex ? 'bg-white w-full' : 'w-0'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Top Author Info */}
            <div className="relative z-30 p-4 pt-7 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-2.5">
                <img
                  src={activeStory.authorAvatar}
                  alt={activeStory.authorName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover border border-white/20"
                />
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1">
                    {activeStory.authorName}
                    {activeStory.isAuthorVerified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </p>
                  <span className="text-[10px] text-white/65">{activeStory.createdAt}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveStoryIndex(null)}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Story Media + +18 NSFW Warning Gate */}
            <div className="absolute inset-0 flex items-center justify-center">
              {activeStory.mediaType === 'video' ? (
                <video
                  src={activeStory.mediaUrl}
                  autoPlay
                  loop
                  playsInline
                  style={{ filter: activeStory.filterCss || 'none' }}
                  className={`w-full h-full object-cover ${
                    activeStory.isNsfw18 &&
                    !nsfwConsentRevealedIds.includes(activeStory.id)
                      ? 'blur-2xl scale-110'
                      : ''
                  }`}
                />
              ) : (
                <img
                  src={activeStory.mediaUrl}
                  alt={activeStory.caption}
                  referrerPolicy="no-referrer"
                  style={{ filter: activeStory.filterCss || 'none' }}
                  className={`w-full h-full object-cover ${
                    activeStory.isNsfw18 &&
                    !nsfwConsentRevealedIds.includes(activeStory.id)
                      ? 'blur-2xl scale-110'
                      : ''
                  }`}
                />
              )}

              {activeStory.isNsfw18 &&
                !nsfwConsentRevealedIds.includes(activeStory.id) && (
                  <div className="absolute inset-0 z-20 bg-black/60 flex flex-col items-center justify-center p-6 text-center">
                    <EyeOff className="w-10 h-10 text-[#FB7185] mb-2" />
                    <span className="text-sm font-bold text-white">
                      Aviso de Conteúdo Adulto (+18)
                    </span>
                    <p className="text-xs text-white/70 mt-1 max-w-xs">
                      Este Status contém mídia sensual/adulta publicada por {activeStory.authorName}.
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setNsfwConsentRevealedIds((prev) => [...prev, activeStory.id])
                      }
                      className="mt-4 px-5 py-2.5 rounded-2xl bg-[#E11D48] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg"
                    >
                      <Eye className="w-4 h-4" />
                      Confirmar +18 e Visualizar
                    </button>
                  </div>
                )}

              {activeStory.overlayText && (
                <div className="absolute inset-x-6 bottom-28 z-20 flex justify-center pointer-events-none">
                  <span className="px-4 py-2 rounded-2xl bg-black/70 backdrop-blur-md text-white text-sm font-bold border border-white/15">
                    {activeStory.overlayText}
                  </span>
                </div>
              )}
            </div>

            {/* Mobile/Tablet Left & Right Tap Zones to go back or advance Status */}
            {!(activeStory.isNsfw18 && !nsfwConsentRevealedIds.includes(activeStory.id)) && (
              <div className="absolute inset-x-0 top-16 bottom-20 z-20 flex md:hidden">
                <button
                  type="button"
                  aria-label="Status anterior"
                  onClick={() => {
                    if (activeStoryIndex > 0) {
                      setActiveStoryIndex(activeStoryIndex - 1);
                    }
                  }}
                  className="w-1/2 h-full focus:outline-none active:bg-white/[0.03]"
                />
                <button
                  type="button"
                  aria-label="Próximo status"
                  onClick={() => {
                    if (activeStoryIndex < stories.length - 1) {
                      setActiveStoryIndex(activeStoryIndex + 1);
                    } else {
                      setActiveStoryIndex(null);
                    }
                  }}
                  className="w-1/2 h-full focus:outline-none active:bg-white/[0.03]"
                />
              </div>
            )}

            {/* Desktop Only: Discreet & Visible Left / Right Navigation Arrows */}
            {activeStoryIndex > 0 && (
              <button
                type="button"
                onClick={() => setActiveStoryIndex(activeStoryIndex - 1)}
                className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/45 hover:bg-black/75 border border-white/15 text-white/85 hover:text-white items-center justify-center backdrop-blur-md transition-all"
                title="Status anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {activeStoryIndex < stories.length - 1 && (
              <button
                type="button"
                onClick={() => setActiveStoryIndex(activeStoryIndex + 1)}
                className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/45 hover:bg-black/75 border border-white/15 text-white/85 hover:text-white items-center justify-center backdrop-blur-md transition-all"
                title="Próximo status"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* Bottom Caption */}
            <div className="relative z-30 p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
              <p className="text-xs sm:text-sm text-white">{activeStory.caption}</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ACTIVE LIVE STREAM VIEWER / BROADCASTER */}
      {activeLiveSession && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden velvet-card border border-white/15 grid grid-cols-1 md:grid-cols-12 max-h-[90vh]">
            {/* Left Video Stage */}
            <div className="md:col-span-7 relative min-h-[340px] sm:min-h-[460px] bg-black">
              <img
                src={activeLiveSession.thumbnailUrl}
                alt={activeLiveSession.hostName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-[#E11D48] text-white text-[10px] font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    AO VIVO
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 text-white text-[11px] flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#FB7185]" />
                    {activeLiveSession.viewersCount} assistindo
                  </span>
                </div>

                {isBroadcastingNow && (
                  <button
                    type="button"
                    onClick={() => setLiveMicMuted(!liveMicMuted)}
                    className="p-2 rounded-xl bg-black/60 text-white"
                  >
                    {liveMicMuted ? (
                      <MicOff className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Mic className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>
                )}
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <h4 className="text-base font-bold text-white">{activeLiveSession.hostName}</h4>
                <p className="text-xs text-amber-300">{activeLiveSession.title}</p>
              </div>
            </div>

            {/* Right Interactive Live Chat & Tips */}
            <div className="md:col-span-5 flex flex-col justify-between bg-[#120C0F] p-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold text-white">Chat da Live Ao Vivo</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveLiveSession(null);
                    setIsBroadcastingNow(false);
                  }}
                  className="p-1.5 rounded-xl bg-white/10 text-white hover:bg-rose-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 py-3 space-y-2.5 overflow-y-auto max-h-64">
                {liveChatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2.5 rounded-xl text-xs ${
                      msg.tip
                        ? 'bg-amber-500/20 border border-amber-400/40 text-amber-200'
                        : 'bg-white/[0.04] text-[#FAF5F6]'
                    }`}
                  >
                    <strong className="text-[#FB7185]">{msg.user}: </strong>
                    <span>{msg.text}</span>
                    {msg.tip && (
                      <span className="block font-bold text-emerald-300 mt-0.5">
                        + R$ {msg.tip.toFixed(2)} Mimo enviado!
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  {[10, 25, 50].map((tipVal) => (
                    <button
                      key={tipVal}
                      type="button"
                      onClick={() =>
                        setLiveChatMessages((prev) => [
                          ...prev,
                          {
                            id: `tip_${Date.now()}`,
                            user: currentUser.name,
                            text: 'Enviou uma gorjeta na Live!',
                            tip: tipVal
                          }
                        ])
                      }
                      className="flex-1 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 border border-amber-400/30 text-amber-200 text-[11px] font-bold"
                    >
                      + R$ {tipVal}
                    </button>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!liveChatInput.trim()) return;
                    setLiveChatMessages((prev) => [
                      ...prev,
                      {
                        id: `msg_${Date.now()}`,
                        user: currentUser.name,
                        text: liveChatInput.trim()
                      }
                    ]);
                    setLiveChatInput('');
                  }}
                  className="flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    value={liveChatInput}
                    onChange={(e) => setLiveChatInput(e.target.value)}
                    placeholder="Comentar na live..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#0D090B] border border-white/10 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-[#E11D48] text-white"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
