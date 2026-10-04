import { useState } from 'react';
import {
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Heart,
  MessageCircle,
  ShieldCheck,
  Plus,
  Clock,
  BadgeDollarSign,
  X,
  Flag,
  Send,
  Flame
} from 'lucide-react';
import { LiberalMoment, User } from '../../types';
import { MediaUploadPicker, EditedMediaResult } from '../MediaUploadPicker';

export const MOMENT_DESTRUCT_OPTIONS = [
  { hours: 0, label: 'Permanente' },
  { hours: 1, label: '1 Hora' },
  { hours: 24, label: '24 Horas' },
  { hours: 168, label: '7 Dias' }
];

interface LiberalMomentsTabProps {
  currentUser: User;
  moments: LiberalMoment[];
  onAddMoment: (moment: LiberalMoment) => void;
  onUnlockMomentSale?: (momentId: string, price: number) => void;
  onOpenVip: () => void;
  onOpenSellerHub?: () => void;
  onOpenReport: (author: User) => void;
}

export function LiberalMomentsTab({
  currentUser,
  moments,
  onAddMoment,
  onUnlockMomentSale,
  onOpenReport
}: LiberalMomentsTabProps) {
  const [revealedMomentIds, setRevealedMomentIds] = useState<string[]>([]);
  const [unlockedSaleIds, setUnlockedSaleIds] = useState<string[]>([]);
  const [likedMomentIds, setLikedMomentIds] = useState<string[]>(
    moments.filter((m) => m.isLiked).map((m) => m.id)
  );
  const [activeFilterTag, setActiveFilterTag] = useState<string>('Todos');

  // Comments Drawer State per moment
  const [openCommentsMomentId, setOpenCommentsMomentId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [localComments, setLocalComments] = useState<
    Record<string, { id: string; author: string; text: string; time: string }[]>
  >({});

  // Publish Modal State (Strictly Free +18 Community Moments — NO Monetization Checkbox here!)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pickedMedia, setPickedMedia] = useState<EditedMediaResult>({
    url: '/src/assets/images/liberal_moment_art_1790885781551.jpg',
    mediaType: 'image',
    filterCss: 'none',
    overlayText: ''
  });
  const [captionInput, setCaptionInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['CorpoLivre', 'ArteSensual']);
  const [destructOption, setDestructOption] = useState<number>(24);

  const blockSales = Boolean(currentUser.privacySettings.blockAdultSalesTabs);

  const visibleMoments = moments.filter((m) => {
    if (blockSales && m.isMonetizedSale) return false;
    if (
      activeFilterTag !== 'Todos' &&
      !m.tags.some((t) => t.toLowerCase().includes(activeFilterTag.toLowerCase()))
    ) {
      return false;
    }
    return true;
  });

  const toggleReveal = (id: string) => {
    setRevealedMomentIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleLike = (id: string) => {
    setLikedMomentIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleTagSelection = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleUnlockPaidMoment = (moment: LiberalMoment) => {
    setUnlockedSaleIds((prev) => [...prev, moment.id]);
    setRevealedMomentIds((prev) => [...prev, moment.id]);
    if (onUnlockMomentSale && moment.salePrice) {
      onUnlockMomentSale(moment.id, moment.salePrice);
    }
  };

  const formatDestructLabel = (mins?: number) => {
    if (!mins || mins <= 0) return 'Permanente';
    if (mins < 60) return `${mins} min`;
    const hrs = Math.round(mins / 60);
    if (hrs === 1) return '1 Hora';
    if (hrs === 24) return '24 Horas';
    if (hrs === 168) return '7 Dias';
    return `${hrs}h`;
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captionInput.trim() && !pickedMedia.url) return;

    const newMoment: LiberalMoment = {
      id: `moment_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatarUrl,
      isAuthorVerified: currentUser.isVerified,
      isAuthorSeller: Boolean(
        currentUser.isSellerVerified || currentUser.sellerProfile?.isSellerVerified
      ),
      mediaUrl: pickedMedia.url,
      mediaType: pickedMedia.mediaType,
      caption: captionInput.trim() || 'Momento compartilhado no Aura Privé ✨',
      timestamp: 'Agora mesmo',
      likes: 1,
      isLiked: true,
      e2eeSignature: `AES-256-GCM`,
      isSensitiveNsfw: true,
      selfDestructMins: destructOption > 0 ? destructOption * 60 : undefined,
      tags: selectedTags.length > 0 ? selectedTags : ['CorpoLivre', '+18'],
      isLockedVip: false,
      isMonetizedSale: false,
      isUnlockedByMe: true
    };

    onAddMoment(newMoment);
    setLikedMomentIds((prev) => [...prev, newMoment.id]);
    setRevealedMomentIds((prev) => [...prev, newMoment.id]);
    setCaptionInput('');
    setShowCreateModal(false);
  };

  const handleAddComment = (momentId: string) => {
    const text = (commentInputs[momentId] || '').trim();
    if (!text) return;
    setLocalComments((prev) => ({
      ...prev,
      [momentId]: [
        ...(prev[momentId] || []),
        {
          id: `c_${Date.now()}`,
          author: currentUser.name,
          text,
          time: 'Agora'
        }
      ]
    }));
    setCommentInputs((prev) => ({ ...prev, [momentId]: '' }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Top Editorial Banner */}
      <div className="velvet-card rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E11D48]/25 to-[#881337]/30 border border-[#E11D48]/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#FB7185]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-white font-display">
                  Momentos Liberais
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-semibold">
                  Comunidade Livre +18
                </span>
              </div>
              <p className="text-xs text-[#FAF5F6]/65 mt-1 leading-relaxed">
                Espaço aberto onde qualquer membro pode publicar e apreciar fotos e vídeos sensuais com proteção anti-print e autodestruição programada.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-[#E11D48]/30 flex items-center justify-center gap-2 shrink-0 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Momento</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-white/[0.07] no-scrollbar">
          {[
            'Todos',
            'CorpoLivre',
            'ArteSensual',
            'Casal',
            'Shibari',
            'NoitePrivé',
            'SemFiltro'
          ].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveFilterTag(tag)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                activeFilterTag === tag
                  ? 'bg-[#E11D48] text-white border-[#E11D48] shadow-sm'
                  : 'bg-white/[0.03] text-[#FAF5F6]/70 border-white/[0.08] hover:text-white'
              }`}
            >
              {tag === 'Todos' ? 'Todos os Momentos' : `#${tag}`}
            </button>
          ))}
        </div>
      </div>

      {/* Moments Feed */}
      <div className="space-y-6">
        {visibleMoments.map((moment) => {
          const isRevealed = revealedMomentIds.includes(moment.id);
          const isLiked = likedMomentIds.includes(moment.id);
          const isPaidSale = Boolean(moment.isMonetizedSale && moment.salePrice);
          const isSaleUnlocked =
            !isPaidSale ||
            Boolean(moment.isUnlockedByMe) ||
            unlockedSaleIds.includes(moment.id) ||
            moment.authorId === currentUser.id;
          const extraComments = localComments[moment.id] || [];

          return (
            <article
              key={moment.id}
              className="velvet-card rounded-[28px] overflow-hidden border border-white/10 transition-all"
            >
              {/* Author Header (Optimized for Mobile, Tablet & Desktop) */}
              <div className="p-3.5 sm:p-5 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={moment.authorAvatar}
                    alt={moment.authorName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-white/15 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white truncate">
                        {moment.authorName}
                      </span>
                      {moment.isAuthorVerified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {moment.isAuthorSeller && (
                        <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-200 text-[10px] font-semibold whitespace-nowrap">
                          Criador(a)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#FAF5F6]/60 mt-0.5 whitespace-nowrap">
                      <span>{moment.timestamp}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 text-amber-300/90">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>{formatDestructLabel(moment.selfDestructMins)}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isPaidSale ? (
                    <span className="px-2.5 py-1 rounded-full bg-[#E11D48]/20 border border-[#E11D48]/50 text-[#FB7185] text-[11px] font-bold flex items-center gap-1 whitespace-nowrap">
                      <BadgeDollarSign className="w-3.5 h-3.5 shrink-0" />
                      {isSaleUnlocked
                        ? 'Liberado'
                        : `R$ ${moment.salePrice?.toFixed(2).replace('.', ',')}`}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[#FAF5F6]/75 text-[11px] font-medium whitespace-nowrap">
                      Acesso Livre
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      onOpenReport({
                        ...currentUser,
                        id: moment.authorId,
                        name: moment.authorName,
                        avatarUrl: moment.authorAvatar
                      })
                    }
                    className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-[#FAF5F6]/45 hover:text-rose-400 transition-colors"
                    title="Denunciar publicação"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Media Container */}
              <div className="relative aspect-[4/5] w-full bg-[#090608] overflow-hidden">
                {moment.mediaType === 'video' ? (
                  <video
                    src={moment.mediaUrl}
                    controls={isRevealed && isSaleUnlocked}
                    playsInline
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      !isSaleUnlocked || !isRevealed
                        ? 'blur-2xl scale-110 brightness-50'
                        : 'blur-0 scale-100'
                    }`}
                  />
                ) : (
                  <img
                    src={moment.mediaUrl}
                    alt={moment.caption}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      !isSaleUnlocked || !isRevealed
                        ? 'blur-2xl scale-110 brightness-50'
                        : 'blur-0 scale-100'
                    }`}
                  />
                )}

                {/* Overlay 1: If it came from Creator Studio as a Paid Preview */}
                {isPaidSale && !isSaleUnlocked && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-black/55 backdrop-blur-md">
                    <div className="w-14 h-14 rounded-2xl bg-[#E11D48]/20 border border-[#E11D48] flex items-center justify-center text-[#FB7185] mb-3 shadow-lg">
                      <BadgeDollarSign className="w-7 h-7" />
                    </div>
                    <h4 className="text-base font-bold text-white font-display">
                      Prévia Exclusiva de Criador (+18)
                    </h4>
                    <p className="text-xs text-[#FAF5F6]/70 max-w-xs mt-1 mb-4">
                      Desbloqueie esta mídia completa publicada por {moment.authorName}.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleUnlockPaidMoment(moment)}
                      className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white font-bold text-xs shadow-lg"
                    >
                      Desbloquear por R$ {moment.salePrice?.toFixed(2).replace('.', ',')}
                    </button>
                  </div>
                )}

                {/* Overlay 2: Free +18 Consent Blur Shield */}
                {isSaleUnlocked && !isRevealed && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-black/40 backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-3">
                      <EyeOff className="w-5 h-5 text-[#FB7185]" />
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      Mídia Sensível (+18) · Proteção de Tela Ativa
                    </h4>
                    <p className="text-xs text-[#FAF5F6]/70 max-w-xs mt-1 mb-4">
                      Toque abaixo para revelar a foto ou vídeo com segurança.
                    </p>
                    <button
                      type="button"
                      onClick={() => toggleReveal(moment.id)}
                      className="px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-semibold text-xs flex items-center gap-2 backdrop-blur-md transition-all"
                    >
                      <Eye className="w-4 h-4 text-[#FB7185]" />
                      <span>Revelar Mídia +18</span>
                    </button>
                  </div>
                )}

                {isSaleUnlocked && isRevealed && (
                  <button
                    type="button"
                    onClick={() => toggleReveal(moment.id)}
                    className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-xl bg-black/65 hover:bg-black/85 text-white text-xs flex items-center gap-1.5 border border-white/15"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Ocultar</span>
                  </button>
                )}
              </div>

              {/* Caption, Tags & Interaction Bar */}
              <div className="p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleLike(moment.id)}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                        isLiked
                          ? 'bg-[#E11D48]/20 border-[#E11D48] text-[#FB7185]'
                          : 'bg-white/[0.04] border-white/10 text-[#FAF5F6]/75 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#FB7185]' : ''}`} />
                      <span>{moment.likes + (isLiked && !moment.isLiked ? 1 : 0)}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setOpenCommentsMomentId(
                          openCommentsMomentId === moment.id ? null : moment.id
                        )
                      }
                      className="px-3.5 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-[#FAF5F6]/80 flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4 text-amber-300" />
                      <span>Comentar ({extraComments.length})</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-[#FAF5F6]/45 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    Sem dados EXIF
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#FAF5F6]/90 leading-relaxed">
                  <strong className="text-white mr-1.5">{moment.authorName}:</strong>
                  {moment.caption}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {moment.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-[#FB7185]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Expandable Comments Section */}
                {openCommentsMomentId === moment.id && (
                  <div className="pt-3 mt-2 border-t border-white/[0.07] space-y-2.5">
                    {extraComments.map((c) => (
                      <div
                        key={c.id}
                        className="p-2.5 rounded-xl bg-black/35 border border-white/[0.06] text-xs flex items-center justify-between"
                      >
                        <div>
                          <strong className="text-[#FB7185] mr-1.5">{c.author}:</strong>
                          <span className="text-[#FAF5F6]/90">{c.text}</span>
                        </div>
                        <span className="text-[10px] text-[#FAF5F6]/40">{c.time}</span>
                      </div>
                    ))}

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={commentInputs[moment.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [moment.id]: e.target.value
                          }))
                        }
                        placeholder="Escreva um elogio ou comentário respeitoso..."
                        className="flex-1 px-3.5 py-2 rounded-xl bg-[#0D090B] border border-white/10 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(moment.id)}
                        className="p-2 rounded-xl bg-[#E11D48] text-white"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Create Moment Modal (Reformed with PC Folder / Mobile Gallery Picker + Built-in Editor, and WITHOUT the Monetize Checkbox!) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl velvet-card border border-white/15 p-5 sm:p-6 max-h-[92vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E11D48]/20 border border-[#E11D48]/40 flex items-center justify-center text-[#FB7185]">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Publicar Momento Liberal
                  </h3>
                  <p className="text-[11px] text-[#FAF5F6]/60">
                    Escolha uma foto ou vídeo das pastas do computador ou galeria do celular/tablet
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-xl bg-white/[0.06] text-[#FAF5F6]/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-4">
              {/* Real PC Folder / Mobile Gallery Picker + Photo/Video Editor */}
              <MediaUploadPicker
                valueUrl={pickedMedia.url}
                mediaType={pickedMedia.mediaType}
                onChangeMedia={(res) => setPickedMedia(res)}
                showBuiltInEditor={true}
                label="Selecionar Mídia (Pastas no Computador ou Galeria no Celular/Tablet)"
              />

              {/* Caption */}
              <div>
                <label className="text-xs font-semibold text-white block mb-1.5">
                  Legenda do seu Momento
                </label>
                <textarea
                  value={captionInput}
                  onChange={(e) => setCaptionInput(e.target.value)}
                  placeholder="Compartilhe seu desejo, ensaio ou momento especial..."
                  rows={3}
                  className="w-full bg-[#0D090B] border border-white/10 rounded-2xl p-3.5 text-xs sm:text-sm text-white placeholder-[#FAF5F6]/40 focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              {/* Multi-Tag Selector */}
              <div>
                <label className="text-xs font-semibold text-white block mb-1.5">
                  Tags de Afinidade (Toque para selecionar)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'CorpoLivre',
                    'ArteSensual',
                    'Casal',
                    'Shibari',
                    'NoitePrivé',
                    'Lingerie',
                    'SemFiltro'
                  ].map((tag) => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTagSelection(tag)}
                        className={`py-1.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                          active
                            ? 'bg-[#E11D48] border-[#E11D48] text-white font-semibold shadow-sm'
                            : 'bg-[#0D090B] border-white/10 text-[#FAF5F6]/65 hover:text-white'
                        }`}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Self-Destruct Timer */}
              <div>
                <label className="text-xs font-semibold text-white flex items-center gap-1.5 mb-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  Tempo de Autodestruição no Feed
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {MOMENT_DESTRUCT_OPTIONS.map((opt) => (
                    <button
                      key={opt.hours}
                      type="button"
                      onClick={() => setDestructOption(opt.hours)}
                      className={`py-2 px-2 rounded-xl border text-center transition-all text-xs font-semibold ${
                        destructOption === opt.hours
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                          : 'bg-[#0D090B] border-white/10 text-[#FAF5F6]/65 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Actions */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.06] text-xs font-semibold text-[#FAF5F6]/80 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-[#E11D48]/30"
                >
                  Publicar Momento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
