import { useState, useMemo } from 'react';
import {
  Flame,
  EyeOff,
  Eye,
  SlidersHorizontal,
  MapPin,
  ShieldCheck,
  Heart,
  X,
  MessageCircle,
  Flag,
  Sparkles,
  CheckCircle2,
  Lock,
  ChevronRight,
  Filter
} from 'lucide-react';
import { User, Hobby } from '../../types';
import { ALL_HOBBIES } from '../../data/mockData';
import { BDSM_PRACTICES_CATALOG } from '../../data/bdsmPracticesData';

interface ConnectTabProps {
  currentUser: User;
  profiles: User[];
  onStartChat: (user: User, isBlindMatch: boolean) => void;
  onOpenReport: (user: User) => void;
  onOpenVip: () => void;
}

export function ConnectTab({
  currentUser,
  profiles,
  onStartChat,
  onOpenReport,
  onOpenVip,
}: ConnectTabProps) {
  const [viewMode, setViewMode] = useState<'standard' | 'blind'>('standard');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxDistance, setMaxDistance] = useState<number>(15);
  const [activeProfileIndex, setActiveProfileIndex] = useState(0);
  const [likedUserIds, setLikedUserIds] = useState<string[]>([]);
  const [passedUserIds, setPassedUserIds] = useState<string[]>([]);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [bdsmOnlyFilter, setBdsmOnlyFilter] = useState(false);
  const [inspectedPractice, setInspectedPractice] = useState<{ name: string; meaning: string; detailed?: string } | null>(null);

  // Dynamic compatibility calculation
  const calculateCompatibility = (target: User) => {
    const myHobbies = new Set(currentUser.hobbies);
    const common = target.hobbies.filter((h) => myHobbies.has(h));
    let baseScore = 60 + common.length * 10;
    if (currentUser.bdsm.enabled && target.bdsm.enabled) {
      if (
        (currentUser.bdsm.role === 'Dominante' && target.bdsm.role === 'Submisso(a)') ||
        (currentUser.bdsm.role === 'Submisso(a)' && target.bdsm.role === 'Dominante') ||
        currentUser.bdsm.role === 'Switch' ||
        target.bdsm.role === 'Switch'
      ) {
        baseScore += 8;
      }
    }
    return Math.min(baseScore, 98);
  };

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      if (passedUserIds.includes(p.id)) return false;
      if (p.distanceKm > maxDistance) return false;
      if (bdsmOnlyFilter && !p.bdsm.enabled) return false;
      if (selectedCategory !== 'all') {
        const matchesCategory = p.hobbies.some((hName) => {
          const found = ALL_HOBBIES.find((h) => h.name === hName);
          return found && found.category === selectedCategory;
        });
        if (!matchesCategory) return false;
      }
      return true;
    });
  }, [profiles, passedUserIds, maxDistance, bdsmOnlyFilter, selectedCategory]);

  const currentCard = filteredProfiles[activeProfileIndex] || null;

  const handleLike = (target: User) => {
    setLikedUserIds((prev) => [...prev, target.id]);
    onStartChat(target, viewMode === 'blind');
  };

  const handlePass = (target: User) => {
    setPassedUserIds((prev) => [...prev, target.id]);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-24 md:pb-8">
      {/* Mode Switcher Banner: Standard Match vs Conexão às Cegas */}
      <div className="bg-[#10131d] border border-slate-800 rounded-2xl p-3 mb-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            viewMode === 'blind' ? 'bg-violet-500/20 text-violet-300' : 'bg-rose-500/20 text-rose-400'
          }`}>
            {viewMode === 'blind' ? <EyeOff className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
          </div>
          <div>
            <h2 className="text-xs font-bold text-white font-display">
              {viewMode === 'blind' ? 'Modo Conexão às Cegas' : 'Radar de Afinidades & Hobbies'}
            </h2>
            <p className="text-[10px] text-slate-400">
              {viewMode === 'blind'
                ? 'Fotos ocultas: priorize interesses em comum e valores.'
                : 'Geolocalização ativa e verificação real.'}
            </p>
          </div>
        </div>

        {/* Segmented Control */}
        <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('standard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'standard'
                ? 'bg-rose-500 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Radar
          </button>
          <button
            type="button"
            onClick={() => setViewMode('blind')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              viewMode === 'blind'
                ? 'bg-violet-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <EyeOff className="w-3 h-3" />
            <span>Às Cegas</span>
          </button>
        </div>
      </div>

      {/* Filter Quick Bar */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg border text-xs whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-800 border-slate-600 text-white font-medium'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos os Hobbies
          </button>
          <button
            onClick={() => setSelectedCategory('Artes & Cultura')}
            className={`px-3 py-1 rounded-lg border text-xs whitespace-nowrap transition-colors ${
              selectedCategory === 'Artes & Cultura'
                ? 'bg-slate-800 border-slate-600 text-white font-medium'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Artes & Cultura
          </button>
          <button
            onClick={() => setSelectedCategory('Música')}
            className={`px-3 py-1 rounded-lg border text-xs whitespace-nowrap transition-colors ${
              selectedCategory === 'Música'
                ? 'bg-slate-800 border-slate-600 text-white font-medium'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Música
          </button>
          <button
            onClick={() => setSelectedCategory('Estilo de Vida & BDSM')}
            className={`px-3 py-1 rounded-lg border text-xs whitespace-nowrap transition-colors ${
              selectedCategory === 'Estilo de Vida & BDSM'
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-medium'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-rose-300'
            }`}
          >
            BDSM & Kink
          </button>
        </div>

        {/* Filter Trigger */}
        <button
          onClick={() => setShowFiltersModal(true)}
          className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white shrink-0 ml-2"
          title="Filtros de Distância & BDSM"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Main Profile Card / Blind Match View */}
      {currentCard ? (
        <div className="bg-[#111420] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
          {/* Card Top Media / Photo or Masked Canvas */}
          <div className="relative h-80 sm:h-96 w-full bg-[#151928] overflow-hidden">
            {viewMode === 'blind' ? (
              /* Blind Mode Canvas */
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#121627] via-[#1a1528] to-[#0c0e18] relative">
                <div className="w-24 h-24 rounded-full bg-violet-500/10 border-2 border-dashed border-violet-400/40 flex items-center justify-center mb-4 relative">
                  <EyeOff className="w-10 h-10 text-violet-400" />
                  <div className="absolute -bottom-1 bg-violet-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Conexão Oculta
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white font-display">
                  {currentCard.blindMatchInfo.maskedAlias}
                </h3>
                <p className="text-xs text-violet-300 font-medium mt-1">
                  {currentCard.age} anos · {currentCard.city} (~{currentCard.distanceKm} km)
                </p>
                <div className="mt-4 p-3 bg-violet-950/30 border border-violet-800/40 rounded-xl max-w-sm text-xs text-slate-300 italic">
                  &quot;{currentCard.blindMatchInfo.valuesSummary}&quot;
                </div>
                <div className="mt-3 text-[10px] text-slate-500">
                  Fotos só se revelam após conexão mútua consentida.
                </div>
              </div>
            ) : (
              /* Standard Radar Photo with Privacy protection */
              <>
                <img
                  src={currentCard.photos[0] || currentCard.avatarUrl}
                  alt={currentCard.name}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    currentCard.privacySettings.blurPhotosByDefault ? 'blur-xl scale-105' : ''
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111420] via-black/30 to-black/20" />

                {/* Report trigger in top-right */}
                <button
                  type="button"
                  onClick={() => onOpenReport(currentCard)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-md text-slate-300 hover:text-rose-400 border border-white/10 transition-colors"
                  title="Denunciar Perfil"
                >
                  <Flag className="w-4 h-4" />
                </button>

                {/* Compatibility Badge & Distance */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-xl bg-rose-500/90 backdrop-blur-md text-white font-mono font-bold text-xs flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{calculateCompatibility(currentCard)}% Sintonia</span>
                  </div>
                  {currentCard.isVerified && (
                    <div
                      className="px-2 py-1 rounded-xl bg-emerald-500/90 backdrop-blur-md text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow-lg"
                      title={`Verificado Real - ${currentCard.verificationHash}`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verificado Real</span>
                    </div>
                  )}
                </div>

                {/* User Name & Distance on photo bottom */}
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-white font-display">
                      {currentCard.name}, {currentCard.age}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{currentCard.city}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-emerald-400">A {currentCard.distanceKm} km de você</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Card Body Details */}
          <div className="p-5 space-y-4">
            {/* Bio */}
            <div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {viewMode === 'blind'
                  ? currentCard.blindMatchInfo.icebreaker
                  : currentCard.bio}
              </p>
            </div>

            {/* Hobbies matching highlights */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Interesses em Comum & Hobbies:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentCard.hobbies.map((hName) => {
                  const isCommon = currentUser.hobbies.includes(hName);
                  return (
                    <span
                      key={hName}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        isCommon
                          ? 'bg-rose-500/20 border-rose-500/80 text-rose-200 font-semibold'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {isCommon ? '★ ' : ''}
                      {hName}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* BDSM / Consent Profile info if enabled */}
            {currentCard.bdsm.enabled && (
              <div className="p-3.5 bg-rose-950/20 border border-rose-900/40 rounded-2xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-300 text-xs flex items-center gap-1.5">
                    <span>Estilo de Vida BDSM:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const def = BDSM_PRACTICES_CATALOG.find((p) => p.name.toLowerCase().includes(currentCard.bdsm.role.toLowerCase().split(' ')[0]));
                        setInspectedPractice({
                          name: currentCard.bdsm.role,
                          meaning: def?.shortMeaning || 'Papel e identificação na dinâmica de poder consensual.',
                          detailed: def?.detailedMeaning,
                        });
                      }}
                      className="px-2 py-0.5 rounded-md bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 font-mono text-[11px] flex items-center gap-1 underline underline-offset-2"
                    >
                      {currentCard.bdsm.role}
                      <span className="text-[9px] text-rose-300">ⓘ</span>
                    </button>
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Safe Word: <strong className="text-rose-200">{currentCard.bdsm.safeWord}</strong>
                  </span>
                </div>

                {currentCard.bdsm.softLimits.length > 0 && (
                  <div className="text-[11px] text-slate-300 flex items-start gap-1">
                    <span className="text-amber-400 font-medium shrink-0">Interesses:</span>
                    <div className="flex flex-wrap gap-1">
                      {currentCard.bdsm.softLimits.map((sl) => (
                        <button
                          key={sl}
                          type="button"
                          onClick={() => {
                            const def = BDSM_PRACTICES_CATALOG.find((p) => p.name.toLowerCase().includes(sl.toLowerCase().split(' ')[0]));
                            setInspectedPractice({
                              name: sl,
                              meaning: def?.shortMeaning || 'Prática consensual com diálogo prévio.',
                              detailed: def?.detailedMeaning,
                            });
                          }}
                          className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 px-1.5 py-0.5 rounded border border-amber-500/30 text-[10px]"
                        >
                          {sl} ⓘ
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentCard.bdsm.hardLimits.length > 0 && (
                  <div className="text-[11px] text-slate-400">
                    <span className="text-rose-400 font-medium">Limites Rígidos: </span>
                    {currentCard.bdsm.hardLimits.slice(0, 2).join(' · ')}
                  </div>
                )}
              </div>
            )}

            {/* Actions Bar */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handlePass(currentCard)}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 active:scale-95 text-slate-300 font-semibold text-xs rounded-2xl border border-slate-800 transition-all flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4 text-slate-400" />
                <span>Passar</span>
              </button>

              <button
                type="button"
                onClick={() => handleLike(currentCard)}
                className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 active:scale-95 text-white font-bold text-xs rounded-2xl shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center gap-1.5"
              >
                <Heart className="w-4 h-4 text-white fill-white" />
                <span>{viewMode === 'blind' ? 'Conexão Cega' : 'Conectar'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#10131d] border border-slate-800 rounded-3xl p-8 text-center my-6">
          <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white font-display mb-1">
            Você viu todos os perfis próximos!
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
            Amplie seu raio de distância no radar ou redefina os filtros de hobbies para explorar novas afinidades.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setPassedUserIds([]);
                setMaxDistance(30);
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl shadow-md"
            >
              Reiniciar Radar (Raio 30km)
            </button>
            <button
              onClick={onOpenVip}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md"
            >
              Ativar Boost VIP
            </button>
          </div>
        </div>
      )}

      {/* Filter Modal Sheet */}
      {showFiltersModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#10131c] border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white font-display">Ajustar Filtros do Radar</h4>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Distance Slider */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-300 font-medium">Distância Máxima:</span>
                <span className="font-mono text-emerald-400 font-bold">{maxDistance} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* BDSM Only Filter */}
            <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs">
              <div>
                <span className="text-slate-200 font-semibold block">Apenas Perfis com Afinidade BDSM</span>
                <span className="text-[10px] text-slate-400">Filtrar apenas pessoas com consentimento e papéis ativos.</span>
              </div>
              <input
                type="checkbox"
                checked={bdsmOnlyFilter}
                onChange={(e) => setBdsmOnlyFilter(e.target.checked)}
                className="w-4 h-4 rounded text-rose-500 bg-slate-800 border-slate-700"
              />
            </div>

            <button
              onClick={() => setShowFiltersModal(false)}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl shadow-md"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Practice Meaning Popover */}
      {inspectedPractice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#10131c] border border-rose-500/40 rounded-2xl w-full max-w-sm p-5 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-sm font-bold text-white font-display">
                {inspectedPractice.name}
              </h4>
              <button
                onClick={() => setInspectedPractice(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed space-y-2">
              <p>
                <strong className="text-rose-300">Significado: </strong>
                {inspectedPractice.meaning}
              </p>
              {inspectedPractice.detailed && (
                <p className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                  {inspectedPractice.detailed}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setInspectedPractice(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
