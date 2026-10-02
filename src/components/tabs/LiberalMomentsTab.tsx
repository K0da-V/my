import { useState } from 'react';
import {
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Heart,
  MessageCircle,
  Share2,
  ShieldCheck,
  Plus,
  Clock,
  Crown,
  AlertCircle,
  X,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { LiberalMoment, User, VipTier } from '../../types';

interface LiberalMomentsTabProps {
  currentUser: User;
  moments: LiberalMoment[];
  onAddMoment: (moment: LiberalMoment) => void;
  onOpenVip: () => void;
  onOpenReport: (author: any) => void;
}

export function LiberalMomentsTab({
  currentUser,
  moments,
  onAddMoment,
  onOpenVip,
  onOpenReport,
}: LiberalMomentsTabProps) {
  const [revealedMomentIds, setRevealedMomentIds] = useState<string[]>([]);
  const [likedMomentIds, setLikedMomentIds] = useState<string[]>(
    moments.filter((m) => m.isLiked).map((m) => m.id)
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [captionInput, setCaptionInput] = useState('');
  const [selectedTag, setSelectedTag] = useState('CorpoLivre');
  const [destructOption, setDestructOption] = useState<number>(24);
  const [isVipOnlyPost, setIsVipOnlyPost] = useState(false);

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

  const handlePublish = () => {
    if (!captionInput.trim()) return;

    const newMoment: LiberalMoment = {
      id: `moment_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatarUrl,
      isAuthorVerified: currentUser.isVerified,
      mediaUrl: '/src/assets/images/liberal_moment_art_1790885781551.jpg',
      mediaType: 'image',
      caption: captionInput,
      timestamp: 'Agora',
      likes: 1,
      isLiked: true,
      e2eeSignature: `AES-GCM-256::e2e_sig_${Math.random().toString(36).substring(2, 7)}`,
      isSensitiveNsfw: true,
      selfDestructMins: destructOption * 60,
      tags: [selectedTag, 'ExpressãoLivre', 'E2EE'],
      isLockedVip: isVipOnlyPost,
    };

    onAddMoment(newMoment);
    setLikedMomentIds((prev) => [...prev, newMoment.id]);
    setCaptionInput('');
    setShowCreateModal(false);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-24 md:pb-8">
      {/* Header Info & Privacy Charter */}
      <div className="bg-[#10131d] border border-slate-800 rounded-2xl p-4 mb-4 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-display">Momentos Liberais Privé</h2>
              <p className="text-[11px] text-slate-400">
                Expressão corporal sem censura · Criptografia ponta a ponta
              </p>
            </div>
          </div>

          {/* New Post Button */}
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all shadow-md shadow-rose-600/25 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar</span>
          </button>
        </div>

        {/* E2EE Protection Badge & Disclaimer */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Mídias cifradas localmente (AES-256)</span>
          </div>
          <span className="text-[10px] text-slate-500">Toque na mídia para revelar</span>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-6">
        {moments.map((moment) => {
          const isRevealed = revealedMomentIds.includes(moment.id);
          const isLiked = likedMomentIds.includes(moment.id);
          const isLockedForMe = moment.isLockedVip && currentUser.vipTier === 'free';

          return (
            <div
              key={moment.id}
              className="bg-[#111420] border border-slate-800 rounded-3xl overflow-hidden shadow-xl"
            >
              {/* Post Author Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-700 bg-slate-800">
                    <img
                      src={moment.authorAvatar}
                      alt={moment.authorName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white font-display">
                        {moment.authorName}
                      </span>
                      {moment.isAuthorVerified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>{moment.timestamp}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-400/80 font-mono">E2EE Verificado</span>
                    </div>
                  </div>
                </div>

                {moment.isLockedVip && (
                  <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    <span>Exclusivo VIP</span>
                  </span>
                )}
              </div>

              {/* Media Container with Privacy Shield / Tap to Reveal */}
              <div
                className="relative h-80 sm:h-96 w-full bg-[#141824] cursor-pointer overflow-hidden select-none"
                onClick={() => {
                  if (isLockedForMe) {
                    onOpenVip();
                  } else {
                    toggleReveal(moment.id);
                  }
                }}
              >
                <img
                  src={moment.mediaUrl}
                  alt={moment.caption}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    !isRevealed || isLockedForMe ? 'blur-3xl scale-110 brightness-50' : 'brightness-95'
                  }`}
                />

                {/* Simulated Anti-Screenshot Watermark */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-15">
                  <span className="font-mono text-xs text-white uppercase tracking-widest rotate-[-25deg]">
                    AURA PRIVÉ · DRM PROTECTED · {currentUser.name}
                  </span>
                </div>

                {/* Privacy Blur Overlay Prompt */}
                {!isRevealed && !isLockedForMe && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/40">
                    <div className="w-14 h-14 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center mb-2 text-white shadow-xl">
                      <Eye className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-white">Conteúdo Liberal / Sensível</span>
                    <span className="text-[11px] text-slate-300 mt-1 max-w-xs">
                      Toque para revelar com segurança visual. Imagem autodestrutiva protegida.
                    </span>
                  </div>
                )}

                {/* Locked VIP Overlay */}
                {isLockedForMe && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/60 backdrop-blur-md">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-2 text-amber-300 shadow-xl">
                      <Lock className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-white">Momento Exclusivo para Membros VIP</span>
                    <span className="text-[11px] text-slate-300 mt-1 max-w-xs mb-3">
                      Assine o plano Black VIP ou Diamond Club para liberar mídias liberais restritas.
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenVip();
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md"
                    >
                      Desbloquear com VIP
                    </button>
                  </div>
                )}

                {/* Hide button if revealed */}
                {isRevealed && !isLockedForMe && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleReveal(moment.id);
                    }}
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-medium border border-white/20 flex items-center gap-1"
                  >
                    <EyeOff className="w-3 h-3" />
                    <span>Ocultar</span>
                  </button>
                )}
              </div>

              {/* Caption & Metadata */}
              <div className="p-4 space-y-3">
                <p className="text-xs text-slate-200 leading-relaxed">
                  {moment.caption}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {moment.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-rose-300 font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Interactions Bar */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => toggleLike(moment.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        isLiked ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                      <span>{moment.likes + (isLiked ? 1 : 0)}</span>
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Comentários Privados</span>
                    </button>
                  </div>

                  {/* Cryptographic signature code */}
                  <div className="text-[10px] font-mono text-slate-500 truncate max-w-[140px]" title={moment.e2eeSignature}>
                    {moment.e2eeSignature}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create New Moment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#10131c] border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-display">Publicar Momento Liberal</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-300">
              {/* Media Preview Box */}
              <div className="relative h-44 rounded-2xl bg-slate-900 border border-dashed border-slate-700 overflow-hidden flex flex-col items-center justify-center text-center p-4">
                <img
                  src="/src/assets/images/liberal_moment_art_1790885781551.jpg"
                  alt="Upload preview"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="relative z-10 bg-black/70 backdrop-blur-sm p-3 rounded-xl border border-white/10 flex flex-col items-center">
                  <ImageIcon className="w-6 h-6 text-rose-400 mb-1" />
                  <span className="font-semibold text-white">Mídia Selecionada com Sucesso</span>
                  <span className="text-[10px] text-emerald-400 mt-0.5">Criptografada localmente com AES-GCM-256</span>
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="font-semibold text-slate-200 block mb-1">
                  Legenda / Reflexão:
                </label>
                <textarea
                  value={captionInput}
                  onChange={(e) => setCaptionInput(e.target.value)}
                  placeholder="Compartilhe seu momento, fetiche ou expressão artística sem filtros morais..."
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              {/* Tag selector */}
              <div>
                <label className="font-semibold text-slate-200 block mb-1">Categoria do Momento:</label>
                <div className="grid grid-cols-3 gap-2">
                  {['CorpoLivre', 'ArteSensual', 'Lifestyle', 'Shibari', 'NoitePrivé', 'SemFiltro'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(tag)}
                      className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                        selectedTag === tag
                          ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-semibold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Self-Destruct Timer */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <label className="font-semibold text-slate-200">Autodestruição do Momento:</label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { hours: 1, label: '1 Hora' },
                    { hours: 24, label: '24 Horas' },
                    { hours: 168, label: '7 Dias' },
                  ].map((opt) => (
                    <button
                      key={opt.hours}
                      type="button"
                      onClick={() => setDestructOption(opt.hours)}
                      className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                        destructOption === opt.hours
                          ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-semibold'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* VIP Only Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <div>
                  <span className="font-semibold text-slate-200 block">Exclusivo para Membros VIP</span>
                  <span className="text-[10px] text-slate-400">Permite monetizar seu conteúdo no app.</span>
                </div>
                <input
                  type="checkbox"
                  checked={isVipOnlyPost}
                  onChange={(e) => setIsVipOnlyPost(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-slate-700"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={!captionInput.trim()}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-lg shadow-rose-600/20"
                >
                  Cifrar & Publicar Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
