import { useState, useMemo } from 'react';
import {
  Flame,
  ShieldCheck,
  MapPin,
  Heart,
  X,
  SlidersHorizontal,
  Sparkles,
  Crown,
  MessageCircle,
  Ruler,
  Baby,
  Wine,
  Users,
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Check,
  Coins,
  Gift,
  Lock
} from 'lucide-react';
import { User, Hobby, BdsmProfile } from '../../types';
import { BDSM_FETISH_OPTIONS } from '../../data/mockData';
import { POPULAR_DYNAMIC_LOCATIONS } from '../DynamicLocationPicker';
import { CREATOR_GIFTS } from './LiberalMomentsTab';

interface ConnectTabProps {
  profiles: User[];
  allHobbies: Hobby[];
  currentUser: User;
  likedUserIds: string[];
  onLikeUser: (user: User) => void;
  onStartChat: (user: User) => void;
  onStartVerify: () => void;
  onOpenVip: () => void;
  onOpenBdsmTest: () => void;
  onSpendCoins?: (amount: number) => boolean;
  onOpenCoinStore?: () => void;
}

export function ConnectTab({
  profiles,
  allHobbies,
  currentUser,
  likedUserIds,
  onLikeUser,
  onStartChat,
  onStartVerify,
  onOpenBdsmTest,
  onSpendCoins,
  onOpenCoinStore
}: ConnectTabProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [expandedBio, setExpandedBio] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Rich Discovery Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(55);
  const [sellerFilter, setSellerFilter] = useState<'all' | 'sellers' | 'non_sellers'>('all');
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [selectedFetishes, setSelectedFetishes] = useState<string[]>([]);
  const [selectedBdsmRole, setSelectedBdsmRole] = useState<BdsmProfile['role'] | 'all'>('all');
  const [selectedRelationship, setSelectedRelationship] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [passedIds, setPassedIds] = useState<string[]>([]);
  const [unlockedSellerProfileIds, setUnlockedSellerProfileIds] = useState<string[]>([]);
  const [giftBanner, setGiftBanner] = useState<string | null>(null);
  const [showSellerGiftPicker, setShowSellerGiftPicker] = useState<boolean>(false);

  const toggleHobbyFilter = (hobbyName: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobbyName) ? prev.filter((h) => h !== hobbyName) : [...prev, hobbyName]
    );
    setCurrentIndex(0);
  };

  const toggleFetishFilter = (fetish: string) => {
    setSelectedFetishes((prev) =>
      prev.includes(fetish) ? prev.filter((f) => f !== fetish) : [...prev, fetish]
    );
    setCurrentIndex(0);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setMinAge(18);
    setMaxAge(55);
    setSellerFilter('all');
    setSelectedHobbies([]);
    setSelectedFetishes([]);
    setSelectedBdsmRole('all');
    setSelectedRelationship('all');
    setVerifiedOnly(false);
    setPassedIds([]);
    setCurrentIndex(0);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (minAge > 18 || maxAge < 55) count++;
    if (sellerFilter !== 'all') count++;
    if (selectedHobbies.length > 0) count += selectedHobbies.length;
    if (selectedFetishes.length > 0) count += selectedFetishes.length;
    if (selectedBdsmRole !== 'all') count++;
    if (selectedRelationship !== 'all') count++;
    if (verifiedOnly) count++;
    return count;
  }, [
    searchQuery,
    minAge,
    maxAge,
    sellerFilter,
    selectedHobbies,
    selectedFetishes,
    selectedBdsmRole,
    selectedRelationship,
    verifiedOnly
  ]);

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      if (passedIds.includes(profile.id)) return false;

      const isSeller = Boolean(profile.isSellerVerified || profile.sellerProfile?.isSellerVerified);
      if (sellerFilter === 'sellers' && !isSeller) return false;
      if (sellerFilter === 'non_sellers' && isSeller) return false;

      if (verifiedOnly && !profile.isVerified) return false;

      // Age check
      if (profile.age < minAge || profile.age > maxAge) return false;

      // BDSM Role check
      if (selectedBdsmRole !== 'all' && profile.bdsm?.role !== selectedBdsmRole) {
        return false;
      }

      // Relationship style / Intention check
      if (
        selectedRelationship !== 'all' &&
        profile.personalDetails?.relationshipStyle !== selectedRelationship &&
        profile.personalDetails?.lookingFor !== selectedRelationship
      ) {
        return false;
      }

      // Hobbies / General tastes check
      if (selectedHobbies.length > 0) {
        const matchesHobby = selectedHobbies.some((selected) =>
          profile.hobbies.some((h) => h.toLowerCase() === selected.toLowerCase())
        );
        if (!matchesHobby) return false;
      }

      // BDSM Fetishes check
      if (selectedFetishes.length > 0) {
        const userKinks = [
          ...(profile.bdsm?.fetishes || []),
          ...(profile.bdsm?.softLimits || []),
          ...profile.hobbies
        ].map((k) => k.toLowerCase());

        const matchesFetish = selectedFetishes.some((fetish) =>
          userKinks.some(
            (uk) => uk.includes(fetish.toLowerCase()) || fetish.toLowerCase().includes(uk)
          )
        );
        if (!matchesFetish) return false;
      }

      // Search query check
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const inName = profile.name.toLowerCase().includes(q);
        const inCity = profile.city.toLowerCase().includes(q);
        const inBio = profile.bio.toLowerCase().includes(q);
        const inHobbies = profile.hobbies.some((h) => h.toLowerCase().includes(q));
        const inFetishes = (profile.bdsm?.fetishes || []).some((k) =>
          k.toLowerCase().includes(q)
        );
        if (!inName && !inCity && !inBio && !inHobbies && !inFetishes) return false;
      }

      return true;
    });
  }, [
    profiles,
    passedIds,
    sellerFilter,
    verifiedOnly,
    minAge,
    maxAge,
    selectedBdsmRole,
    selectedRelationship,
    selectedHobbies,
    selectedFetishes,
    searchQuery
  ]);

  const activeProfile =
    filteredProfiles.length > 0
      ? filteredProfiles[currentIndex % filteredProfiles.length]
      : null;

  const profilePhotos = useMemo(() => {
    if (!activeProfile) return [];
    const list = [activeProfile.avatarUrl, ...(activeProfile.photos || [])];
    return Array.from(new Set(list));
  }, [activeProfile]);

  const handleNextProfile = () => {
    setActivePhotoIdx(0);
    setExpandedBio(false);
    if (filteredProfiles.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % filteredProfiles.length);
    }
  };

  const handlePass = () => {
    if (!activeProfile) return;
    setActivePhotoIdx(0);
    setExpandedBio(false);
    setPassedIds((prev) => [...prev, activeProfile.id]);
    setCurrentIndex(0);
  };

  const handleTriggerLike = (user: User) => {
    onLikeUser(user);
    // Advance smoothly to next profile without toast notification popups
    setTimeout(() => {
      handleNextProfile();
    }, 180);
  };

  const isAlreadyLiked = activeProfile ? likedUserIds.includes(activeProfile.id) : false;

  const formatHeight = (cm?: number) => {
    if (!cm) return null;
    const meters = (cm / 100).toFixed(2).replace('.', ',');
    return `${meters} m`;
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Bar: Search & Smart Filter Trigger */}
      <div className="velvet-card rounded-3xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#FAF5F6]/45 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentIndex(0);
              }}
              placeholder="Buscar por gostos, fetiches BDSM, cidade ou nome..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0D090B]/90 border border-white/[0.08] text-xs sm:text-sm text-[#FAF5F6] placeholder-[#FAF5F6]/40 focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all border ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white border-transparent shadow-md shadow-[#E11D48]/25'
                  : 'bg-[#1A1216] text-[#FAF5F6]/85 border-white/10 hover:border-white/25'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtros de Descoberta</span>
              {activeFiltersCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px] font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenBdsmTest}
              className="px-3.5 py-2.5 rounded-2xl bg-[#1A1216] hover:bg-[#25191F] text-[#FAF5F6]/85 border border-white/10 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Descubra suas afinidades BDSM"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Mapa BDSM</span>
            </button>
          </div>
        </div>

        {/* Quick Dynamic Location Chips */}
        <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-semibold text-[#FAF5F6]/50 shrink-0 flex items-center gap-1 mr-1">
            <MapPin className="w-3 h-3 text-[#FB7185]" />
            De onde:
          </span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setCurrentIndex(0);
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-all ${
              searchQuery === ''
                ? 'bg-[#E11D48] text-white'
                : 'bg-white/[0.04] text-[#FAF5F6]/70 hover:text-white border border-white/10'
            }`}
          >
            Todas as Regiões
          </button>
          {currentUser.city && (
            <button
              type="button"
              onClick={() => {
                const cityPart = currentUser.city.split(',')[0].trim();
                setSearchQuery(cityPart);
                setCurrentIndex(0);
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-all ${
                searchQuery.toLowerCase() === currentUser.city.split(',')[0].trim().toLowerCase()
                  ? 'bg-[#E11D48] text-white'
                  : 'bg-amber-500/15 text-amber-200 border border-amber-400/30 hover:bg-amber-500/25'
              }`}
            >
              Perto de Mim ({currentUser.city.split(',')[0]})
            </button>
          )}
          {POPULAR_DYNAMIC_LOCATIONS.slice(0, 5).map((loc) => {
            const shortCity = loc.split(' (')[0];
            const isSelected = searchQuery.toLowerCase() === shortCity.toLowerCase();
            return (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  setSearchQuery(isSelected ? '' : shortCity);
                  setCurrentIndex(0);
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[#E11D48] text-white'
                    : 'bg-white/[0.04] text-[#FAF5F6]/70 hover:text-white border border-white/10'
                }`}
              >
                {shortCity}
              </button>
            );
          })}
        </div>

        {/* Instant Quick-Filter Chips Row */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => {
              setSellerFilter((prev) => (prev === 'sellers' ? 'all' : 'sellers'));
              setCurrentIndex(0);
            }}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
              sellerFilter === 'sellers'
                ? 'bg-[#E11D48]/20 border-[#E11D48] text-[#FB7185]'
                : 'bg-white/[0.03] border-white/[0.08] text-[#FAF5F6]/70 hover:text-[#FAF5F6]'
            }`}
          >
            🔥 Vende Conteúdo +18
          </button>

          <button
            type="button"
            onClick={() => {
              setSellerFilter((prev) => (prev === 'non_sellers' ? 'all' : 'non_sellers'));
              setCurrentIndex(0);
            }}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
              sellerFilter === 'non_sellers'
                ? 'bg-[#E11D48]/20 border-[#E11D48] text-[#FB7185]'
                : 'bg-white/[0.03] border-white/[0.08] text-[#FAF5F6]/70 hover:text-[#FAF5F6]'
            }`}
          >
            💬 Apenas Conexão (Não Vende)
          </button>

          <button
            type="button"
            onClick={() => {
              setVerifiedOnly((prev) => !prev);
              setCurrentIndex(0);
            }}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border flex items-center gap-1 ${
              verifiedOnly
                ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                : 'bg-white/[0.03] border-white/[0.08] text-[#FAF5F6]/70 hover:text-[#FAF5F6]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Verificados
          </button>

          {[
            'Solteiro(a) Liberal',
            'Casal Liberal',
            'Relacionamento Aberto',
            'Dinâmica BDSM & Fetiches'
          ].map((rel) => {
            const active = selectedRelationship === rel;
            return (
              <button
                key={rel}
                type="button"
                onClick={() => {
                  setSelectedRelationship(active ? 'all' : rel);
                  setCurrentIndex(0);
                }}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  active
                    ? 'bg-amber-500/20 border-amber-400/70 text-amber-200'
                    : 'bg-white/[0.03] border-white/[0.08] text-[#FAF5F6]/70 hover:text-[#FAF5F6]'
                }`}
              >
                {rel}
              </button>
            );
          })}
        </div>

        {/* Expandable Deep Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Age Filter */}
              <div className="p-3.5 rounded-2xl bg-[#0D090B]/70 border border-white/[0.07]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#FAF5F6]">Faixa de Idade</span>
                  <span className="text-xs font-bold text-[#FB7185]">
                    {minAge} – {maxAge} anos
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] text-[#FAF5F6]/50 block mb-1">Mínima</label>
                    <input
                      type="range"
                      min={18}
                      max={maxAge}
                      value={minAge}
                      onChange={(e) => {
                        setMinAge(Number(e.target.value));
                        setCurrentIndex(0);
                      }}
                      className="w-full accent-[#E11D48]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-[#FAF5F6]/50 block mb-1">Máxima</label>
                    <input
                      type="range"
                      min={minAge}
                      max={65}
                      value={maxAge}
                      onChange={(e) => {
                        setMaxAge(Number(e.target.value));
                        setCurrentIndex(0);
                      }}
                      className="w-full accent-[#E11D48]"
                    />
                  </div>
                </div>
              </div>

              {/* Content Seller Filter */}
              <div className="p-3.5 rounded-2xl bg-[#0D090B]/70 border border-white/[0.07]">
                <span className="text-xs font-semibold text-[#FAF5F6] block mb-2">
                  Venda de Conteúdo +18
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'all', label: 'Todos' },
                    { id: 'sellers', label: 'Vende +18' },
                    { id: 'non_sellers', label: 'Não Vende' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSellerFilter(opt.id as 'all' | 'sellers' | 'non_sellers');
                        setCurrentIndex(0);
                      }}
                      className={`py-2 px-2 rounded-xl text-[11px] font-medium transition-all border ${
                        sellerFilter === opt.id
                          ? 'bg-[#E11D48] text-white border-[#E11D48]'
                          : 'bg-white/[0.03] text-[#FAF5F6]/65 border-white/[0.07] hover:text-[#FAF5F6]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* BDSM Dynamic Filter */}
              <div className="p-3.5 rounded-2xl bg-[#0D090B]/70 border border-white/[0.07]">
                <span className="text-xs font-semibold text-[#FAF5F6] block mb-2">
                  Papel / Dinâmica BDSM
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      'all',
                      'Dominante',
                      'Submisso(a)',
                      'Switch',
                      'Rigger (Shibari)',
                      'Voyeur',
                      'Curioso(a)'
                    ] as const
                  ).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        setSelectedBdsmRole(role);
                        setCurrentIndex(0);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all border ${
                        selectedBdsmRole === role
                          ? 'bg-[#E11D48] text-white border-[#E11D48]'
                          : 'bg-white/[0.03] text-[#FAF5F6]/65 border-white/[0.07] hover:text-[#FAF5F6]'
                      }`}
                    >
                      {role === 'all' ? 'Qualquer' : role}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* BDSM Fetishes Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#FAF5F6]">
                  Fetiches & Práticas BDSM
                </span>
                {selectedFetishes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedFetishes([])}
                    className="text-[11px] text-[#FB7185] hover:underline"
                  >
                    Limpar fetiches ({selectedFetishes.length})
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {BDSM_FETISH_OPTIONS.map((fetish) => {
                  const active = selectedFetishes.includes(fetish);
                  return (
                    <button
                      key={fetish}
                      type="button"
                      onClick={() => toggleFetishFilter(fetish)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                        active
                          ? 'bg-gradient-to-r from-[#E11D48] to-[#9F1239] text-white border-transparent shadow-sm'
                          : 'bg-[#0D090B]/80 text-[#FAF5F6]/70 border-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      {fetish}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* General Tastes & Lifestyle Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#FAF5F6]">
                  Gostos em Geral & Estilo de Vida
                </span>
                {selectedHobbies.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedHobbies([])}
                    className="text-[11px] text-[#FB7185] hover:underline"
                  >
                    Limpar gostos ({selectedHobbies.length})
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {allHobbies.map((hobby) => {
                  const active = selectedHobbies.includes(hobby.name);
                  return (
                    <button
                      key={hobby.id}
                      type="button"
                      onClick={() => toggleHobbyFilter(hobby.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                        active
                          ? 'bg-amber-500/25 text-amber-200 border-amber-400/60'
                          : 'bg-[#0D090B]/80 text-[#FAF5F6]/70 border-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      {hobby.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
              <span className="text-xs text-[#FAF5F6]/60">
                Mostrando <strong className="text-[#FAF5F6]">{filteredProfiles.length}</strong>{' '}
                perfis compatíveis com sua busca
              </span>
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs text-[#FAF5F6]/80 flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Redefinir Tudo
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-1.5 rounded-xl bg-[#E11D48] text-white text-xs font-semibold"
                >
                  Ver Perfis
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Discovery Card (Tinder-Inspired Editorial Layout) */}
      {activeProfile ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Center Column: Interactive Photo Card (Enlarged & Enhanced for Mobile Visibility per Image 3) */}
          <div className="lg:col-span-7 relative rounded-[32px] overflow-hidden bg-[#140E11] border border-white/15 shadow-2xl group">
            <div
              className="relative min-h-[540px] sm:min-h-[610px] aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden select-none"
              onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (touchStartX === null || profilePhotos.length <= 1) return;
                const diff = touchStartX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 35) {
                  if (diff > 0) {
                    setActivePhotoIdx((prev) => (prev + 1) % profilePhotos.length);
                  } else {
                    setActivePhotoIdx((prev) =>
                      prev === 0 ? profilePhotos.length - 1 : prev - 1
                    );
                  }
                }
                setTouchStartX(null);
              }}
            >
              <img
                src={profilePhotos[activePhotoIdx] || activeProfile.avatarUrl}
                alt={activeProfile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-500"
              />

              {/* Top Story-style Photo Progress Bars */}
              {profilePhotos.length > 1 && (
                <div className="absolute top-3.5 left-4 right-4 z-30 flex items-center gap-2">
                  {profilePhotos.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePhotoIdx(idx)}
                      className="flex-1 py-1 focus:outline-none"
                      aria-label={`Ver foto ${idx + 1}`}
                    >
                      <div className="h-1.5 w-full rounded-full overflow-hidden bg-black/50 backdrop-blur-sm">
                        <div
                          className={`h-full transition-all ${
                            idx === activePhotoIdx ? 'bg-white w-full' : 'bg-white/30 w-full'
                          }`}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Mobile & Tablet Left / Right Invisible Tap Zones (Tap Left = Prev, Tap Right = Next) */}
              {profilePhotos.length > 1 && (
                <div className="absolute inset-x-0 top-12 bottom-48 z-20 flex md:hidden">
                  <button
                    type="button"
                    aria-label="Foto anterior"
                    onClick={() =>
                      setActivePhotoIdx((prev) =>
                        prev === 0 ? profilePhotos.length - 1 : prev - 1
                      )
                    }
                    className="w-1/2 h-full focus:outline-none active:bg-white/[0.03]"
                  />
                  <button
                    type="button"
                    aria-label="Próxima foto"
                    onClick={() =>
                      setActivePhotoIdx((prev) => (prev + 1) % profilePhotos.length)
                    }
                    className="w-1/2 h-full focus:outline-none active:bg-white/[0.03]"
                  />
                </div>
              )}

              {/* Desktop Only: Discreet & Visible Left / Right Arrows */}
              {profilePhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIdx((prev) =>
                        prev === 0 ? profilePhotos.length - 1 : prev - 1
                      );
                    }}
                    className="hidden md:flex absolute left-3 top-[42%] -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 border border-white/15 text-white/90 hover:text-white items-center justify-center backdrop-blur-md transition-all"
                    title="Foto anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIdx((prev) => (prev + 1) % profilePhotos.length);
                    }}
                    className="hidden md:flex absolute right-3 top-[42%] -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 border border-white/15 text-white/90 hover:text-white items-center justify-center backdrop-blur-md transition-all"
                    title="Próxima foto"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Larger, High-Contrast Top Badges + Corner Photo Counter */}
              <div className="absolute top-8 left-4 right-4 z-20 flex items-center justify-between gap-2 pointer-events-none">
                <div className="flex items-center gap-2 flex-wrap">
                  {activeProfile.matchScore && (
                    <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-emerald-400/40 text-xs font-bold text-emerald-300 flex items-center gap-1.5 whitespace-nowrap shadow-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      {activeProfile.matchScore}% Afinidade
                    </span>
                  )}
                  {(activeProfile.isSellerVerified ||
                    activeProfile.sellerProfile?.isSellerVerified) && (
                    <span className="px-3 py-1 rounded-full bg-[#E11D48] text-xs font-bold text-white whitespace-nowrap shadow-md">
                      Criador(a) +18
                    </span>
                  )}
                </div>

                {/* Discreet Corner Photo Counter */}
                <div className="flex items-center gap-1.5">
                  {activeProfile.bdsm?.enabled && (
                    <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-xs font-medium text-amber-200 whitespace-nowrap">
                      {activeProfile.bdsm.role}
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-xs font-bold text-white whitespace-nowrap shadow-md">
                    {activePhotoIdx + 1}/{profilePhotos.length} fotos
                  </span>
                </div>
              </div>

              {/* Deep Readable Gradient Overlay at Bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D090B] via-[#0D090B]/55 to-transparent pointer-events-none" />

              {/* Bottom Overlay Identity + Floating Tinder-style Action Buttons (Larger for Mobile) */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 z-20">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display leading-tight drop-shadow-sm">
                        {activeProfile.name}, {activeProfile.age}
                      </h2>
                      {activeProfile.isVerified && (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/50 text-emerald-200 text-xs font-bold whitespace-nowrap"
                          title="Identidade e Biometria Verificadas"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          Verificado
                        </span>
                      )}
                      {activeProfile.vipTier !== 'free' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/25 border border-amber-400/50 text-amber-200 text-xs font-bold whitespace-nowrap">
                          <Crown className="w-3.5 h-3.5" />
                          VIP
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 text-xs sm:text-sm text-[#FAF5F6]/90 font-medium flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#FB7185] shrink-0" />
                        {activeProfile.city} · {activeProfile.distanceKm} km
                      </span>
                      {activeProfile.personalDetails?.relationshipStyle && (
                        <>
                          <span>•</span>
                          <span>{activeProfile.personalDetails.relationshipStyle}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio Preview (Larger & More Visible on Mobile) */}
                <p
                  onClick={() => setExpandedBio((prev) => !prev)}
                  className={`mt-3 text-sm sm:text-base text-white/95 leading-relaxed cursor-pointer ${
                    expandedBio ? '' : 'line-clamp-3'
                  }`}
                >
                  {activeProfile.bio}
                </p>

                {/* Primary Floating Circular Action Bar (Larger Touch Targets on Mobile) */}
                <div className="mt-6 flex items-center justify-center gap-5 sm:gap-7">
                  <button
                    type="button"
                    onClick={handlePass}
                    className="w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-[#1C1317]/95 hover:bg-[#291C22] border border-white/20 text-[#FAF5F6] flex items-center justify-center shadow-xl transition-transform active:scale-95"
                    title="Passar perfil"
                  >
                    <X className="w-7 h-7 text-rose-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTriggerLike(activeProfile)}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 ${
                      isAlreadyLiked
                        ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                        : 'bg-gradient-to-tr from-[#E11D48] via-[#F43F5E] to-[#FB7185] text-white shadow-[#E11D48]/40 hover:brightness-110'
                    }`}
                    title={isAlreadyLiked ? 'Curtido' : 'Curtir perfil'}
                  >
                    {isAlreadyLiked ? (
                      <Check className="w-7 h-7 stroke-[2.5]" />
                    ) : (
                      <Heart className="w-7 h-7 fill-white" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onStartChat(activeProfile)}
                    className="w-14 h-14 rounded-full bg-[#1C1317]/90 hover:bg-[#291C22] border border-amber-400/30 text-amber-300 flex items-center justify-center shadow-lg transition-transform active:scale-95"
                    title="Enviar mensagem direta"
                  >
                    <MessageCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Rich Human Details, Prompts, Personal Info & Tastes */}
          <div className="lg:col-span-5 space-y-4">
            {/* Personal Attributes Card (Height, Children, Relationship Style, Lifestyle) */}
            <div className="velvet-card rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#FAF5F6] uppercase tracking-wider">
                  Sobre {activeProfile.name}
                </h3>
                <span className="text-xs text-[#FAF5F6]/55">
                  {currentIndex + 1} de {filteredProfiles.length} perfis
                </span>
              </div>

              {activeProfile.personalDetails && (
                <div className="grid grid-cols-2 gap-2.5">
                  {activeProfile.personalDetails.heightCm && (
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2.5">
                      <Ruler className="w-4 h-4 text-[#FB7185] shrink-0" />
                      <div>
                        <p className="text-[10px] text-[#FAF5F6]/50">Altura</p>
                        <p className="text-xs font-semibold text-[#FAF5F6]">
                          {formatHeight(activeProfile.personalDetails.heightCm)}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeProfile.personalDetails.childrenPreference && (
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2.5">
                      <Baby className="w-4 h-4 text-amber-300 shrink-0" />
                      <div>
                        <p className="text-[10px] text-[#FAF5F6]/50">Filhos</p>
                        <p className="text-xs font-semibold text-[#FAF5F6]">
                          {activeProfile.personalDetails.childrenPreference}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeProfile.personalDetails.relationshipStyle && (
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-rose-400 shrink-0" />
                      <div>
                        <p className="text-[10px] text-[#FAF5F6]/50">Relação</p>
                        <p className="text-xs font-semibold text-[#FAF5F6]">
                          {activeProfile.personalDetails.relationshipStyle}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeProfile.personalDetails.drinking && (
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2.5">
                      <Wine className="w-4 h-4 text-purple-300 shrink-0" />
                      <div>
                        <p className="text-[10px] text-[#FAF5F6]/50">Estilo Social</p>
                        <p className="text-xs font-semibold text-[#FAF5F6]">
                          {activeProfile.personalDetails.drinking}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* General Tastes & Hobbies */}
              <div>
                <p className="text-[11px] font-medium text-[#FAF5F6]/55 mb-2">
                  Gostos & Afinidades
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {activeProfile.hobbies.map((hobby) => (
                    <span
                      key={hobby}
                      className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs text-[#FAF5F6]/90"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>

              {/* BDSM & Fetishes */}
              {activeProfile.bdsm?.enabled && (
                <div className="pt-2 border-t border-white/[0.07]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-medium text-[#FAF5F6]/55">
                      Dinâmica & Fetiches BDSM
                    </span>
                    <span className="text-xs font-semibold text-amber-300">
                      {activeProfile.bdsm.role}
                      {activeProfile.bdsm.experienceLevel
                        ? ` · ${activeProfile.bdsm.experienceLevel}`
                        : ''}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(activeProfile.bdsm.fetishes || activeProfile.bdsm.softLimits).map((kink) => (
                      <span
                        key={kink}
                        className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-400/25 text-xs text-amber-200"
                      >
                        {kink}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3 Answered Profile Questions (Prompts) */}
            {activeProfile.profilePrompts && activeProfile.profilePrompts.length > 0 && (
              <div className="space-y-3">
                {activeProfile.profilePrompts.map((prompt) => (
                  <div
                    key={prompt.id}
                    className="velvet-card rounded-3xl p-4 sm:p-5 border-l-4 border-l-[#E11D48]"
                  >
                    <p className="text-xs font-medium text-[#FB7185] mb-1">
                      {prompt.question}
                    </p>
                    <p className="text-sm sm:text-base font-medium text-[#FAF5F6] leading-snug">
                      “{prompt.answer}”
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Seller Content Preview Card (unlockable with Aura Coins + Gift sending) */}
            {(activeProfile.isSellerVerified ||
              activeProfile.sellerProfile?.isSellerVerified) &&
              !currentUser.privacySettings?.blockAdultSalesTabs && (
                <div className="velvet-card rounded-3xl p-5 border border-[#E11D48]/30 bg-gradient-to-br from-[#231018] to-[#120B0E] space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[#FB7185] flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-amber-300" />
                        Clube de Conteúdo Exclusivo +18
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">
                        Acervo Privado de {activeProfile.name}
                      </h4>
                    </div>
                    {activeProfile.sellerProfile?.monthlySubscriptionPrice && (
                      <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-amber-300" />
                        {Math.max(
                          20,
                          Math.round(activeProfile.sellerProfile.monthlySubscriptionPrice)
                        )}{' '}
                        Moedas
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#FAF5F6]/70">
                    Para comprar mídias avulsas ou assinar o acervo +18 deste vendedor, utilize suas{' '}
                    <strong className="text-amber-300">Moedas Aura</strong> ou envie um presente!
                  </p>

                  {giftBanner && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-xs text-emerald-200 font-semibold">
                      {giftBanner}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {unlockedSellerProfileIds.includes(activeProfile.id) ? (
                      <span className="px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-1.5">
                        <Check className="w-4 h-4" />
                        Acervo +18 Desbloqueado com Moedas
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          const coinCost = Math.max(
                            25,
                            Math.round(
                              activeProfile.sellerProfile?.monthlySubscriptionPrice || 35
                            )
                          );
                          const balance = currentUser.coinsBalance ?? 0;
                          if (balance < coinCost) {
                            if (onOpenCoinStore) onOpenCoinStore();
                            return;
                          }
                          if (onSpendCoins && onSpendCoins(coinCost)) {
                            setUnlockedSellerProfileIds((prev) => [...prev, activeProfile.id]);
                            setGiftBanner(
                              `Acervo de ${activeProfile.name} desbloqueado por ${coinCost} Moedas!`
                            );
                            setTimeout(() => setGiftBanner(null), 4000);
                          }
                        }}
                        className="flex-1 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        Desbloquear Mídias (
                        {Math.max(
                          25,
                          Math.round(activeProfile.sellerProfile?.monthlySubscriptionPrice || 35)
                        )}{' '}
                        Moedas)
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowSellerGiftPicker((prev) => !prev)}
                      className="py-2.5 px-3.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/35 text-amber-200 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Gift className="w-3.5 h-3.5 text-amber-300" />
                      Presentear
                    </button>
                  </div>

                  {showSellerGiftPicker && (
                    <div className="p-3 rounded-2xl bg-[#0D090B]/95 border border-amber-400/30 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-amber-200">
                          Enviar Presente para {activeProfile.name}
                        </span>
                        <span className="text-[#FAF5F6]/60">
                          Saldo: <strong className="text-amber-300">{currentUser.coinsBalance ?? 0} Moedas</strong>
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {CREATOR_GIFTS.slice(0, 3).map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => {
                              const balance = currentUser.coinsBalance ?? 0;
                              if (balance < g.coins) {
                                if (onOpenCoinStore) onOpenCoinStore();
                                return;
                              }
                              if (onSpendCoins && onSpendCoins(g.coins)) {
                                setGiftBanner(
                                  `Você enviou ${g.label} (${g.coins} Moedas) para ${activeProfile.name}!`
                                );
                                setShowSellerGiftPicker(false);
                                setTimeout(() => setGiftBanner(null), 4000);
                              }
                            }}
                            className="p-2 rounded-xl bg-white/[0.04] hover:bg-amber-500/20 border border-white/10 text-center transition-all"
                          >
                            <div className="text-[11px] font-bold text-white truncate">{g.label}</div>
                            <div className="text-[10px] text-amber-300 font-bold">{g.coins} Moedas</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      ) : (
        <div className="velvet-card rounded-3xl p-10 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E11D48]/15 border border-[#E11D48]/30 flex items-center justify-center mx-auto">
            <Flame className="w-7 h-7 text-[#FB7185]" />
          </div>
          <h3 className="text-lg font-bold text-[#FAF5F6]">
            Nenhum perfil encontrado com esses filtros
          </h3>
          <p className="text-xs sm:text-sm text-[#FAF5F6]/65">
            Experimente ampliar a faixa de idade ou remover alguns filtros de fetiches para descobrir mais pessoas próximas.
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white text-xs font-semibold shadow-md"
          >
            Mostrar Todos os Perfis
          </button>
        </div>
      )}

      {/* Subtle Verification Footer Bar */}
      {!currentUser.isVerified && (
        <div className="velvet-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-xs text-[#FAF5F6]/80">
              Perfis verificados com documento e biometria facial recebem até 3x mais conexões.
            </p>
          </div>
          <button
            type="button"
            onClick={onStartVerify}
            className="shrink-0 px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-semibold text-white transition-colors"
          >
            Verificar Perfil
          </button>
        </div>
      )}
    </div>
  );
}
