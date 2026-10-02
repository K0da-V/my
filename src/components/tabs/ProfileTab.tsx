import { useState } from 'react';
import {
  ShieldCheck,
  Crown,
  HeartHandshake,
  EyeOff,
  Lock,
  Camera,
  AlertTriangle,
  Fingerprint,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  KeyRound,
  FileText,
  User as UserIcon,
  Settings,
  Edit3,
  Check,
  Plus,
  Trash2,
  SlidersHorizontal,
  MapPin,
  Heart,
  Save,
  Eye
} from 'lucide-react';
import { User, VipTier, Hobby } from '../../types';
import { ALL_HOBBIES } from '../../data/mockData';

interface ProfileTabProps {
  currentUser: User;
  onUpdateProfile: (updated: Partial<User>) => void;
  onUpdatePrivacy: (settings: User['privacySettings']) => void;
  onOpenVerification: () => void;
  onOpenBdsmConsent: () => void;
  onOpenBdsmTest: () => void;
  onOpenVip: () => void;
  onTriggerStealth: () => void;
}

export function ProfileTab({
  currentUser,
  onUpdateProfile,
  onUpdatePrivacy,
  onOpenVerification,
  onOpenBdsmConsent,
  onOpenBdsmTest,
  onOpenVip,
  onTriggerStealth,
}: ProfileTabProps) {
  const [subTab, setSubTab] = useState<'edit' | 'privacy' | 'bdsm'>('edit');
  const [privacy, setPrivacy] = useState(currentUser.privacySettings);

  // Form editing states
  const [name, setName] = useState(currentUser.name);
  const [age, setAge] = useState(currentUser.age);
  const [city, setCity] = useState(currentUser.city);
  const [bio, setBio] = useState(currentUser.bio);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  const [photos, setPhotos] = useState<string[]>(currentUser.photos);
  const [privatePhotos, setPrivatePhotos] = useState<string[]>(
    currentUser.privatePhotos || [
      '/src/assets/images/liberal_moment_art_1790885781551.jpg'
    ]
  );
  const [photoSection, setPhotoSection] = useState<'public' | 'private'>('public');
  const [previewPrivateAsVisitor, setPreviewPrivateAsVisitor] = useState(false);
  const [privateAccessRule, setPrivateAccessRule] = useState<'request' | 'vip' | 'locked'>('request');
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(currentUser.hobbies);
  const [maskedAlias, setMaskedAlias] = useState(currentUser.blindMatchInfo.maskedAlias);
  const [valuesSummary, setValuesSummary] = useState(currentUser.blindMatchInfo.valuesSummary);
  const [icebreaker, setIcebreaker] = useState(currentUser.blindMatchInfo.icebreaker);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [showPhotoAddInput, setShowPhotoAddInput] = useState(false);
  const [newPrivatePhotoUrl, setNewPrivatePhotoUrl] = useState('');
  const [showPrivatePhotoAddInput, setShowPrivatePhotoAddInput] = useState(false);
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  const toggleSetting = (key: keyof User['privacySettings']) => {
    const updated = { ...privacy, [key]: !privacy[key] };
    setPrivacy(updated);
    onUpdatePrivacy(updated);
  };

  const toggleHobby = (hobbyName: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobbyName)
        ? prev.filter((h) => h !== hobbyName)
        : [...prev, hobbyName]
    );
  };

  const handleAddPhoto = () => {
    if (newPhotoUrl.trim()) {
      setPhotos((prev) => [...prev, newPhotoUrl.trim()]);
      setNewPhotoUrl('');
      setShowPhotoAddInput(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    if (photos.length > 1) {
      setPhotos((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleAddPrivatePhoto = () => {
    if (newPrivatePhotoUrl.trim()) {
      setPrivatePhotos((prev) => [...prev, newPrivatePhotoUrl.trim()]);
      setNewPrivatePhotoUrl('');
      setShowPrivatePhotoAddInput(false);
    }
  };

  const handleRemovePrivatePhoto = (index: number) => {
    setPrivatePhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetAvatar = (url: string) => {
    setAvatarUrl(url);
  };

  const handleSaveProfile = () => {
    onUpdateProfile({
      name,
      age: Number(age),
      city,
      bio,
      avatarUrl,
      photos,
      privatePhotos,
      hobbies: selectedHobbies,
      blindMatchInfo: {
        ...currentUser.blindMatchInfo,
        maskedAlias,
        valuesSummary,
        icebreaker,
      },
    });
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2500);
  };

  // Group hobbies by category
  const hobbiesByCategory = ALL_HOBBIES.reduce((acc, h) => {
    if (!acc[h.category]) acc[h.category] = [];
    acc[h.category].push(h);
    return acc;
  }, {} as Record<string, Hobby[]>);

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-24 md:pb-8 space-y-4">
      {/* Profile Header Summary Card */}
      <div className="bg-[#10131d] border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-800 shadow-md">
              <img
                src={avatarUrl}
                alt={name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            {currentUser.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 text-slate-950 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white font-display">{name}</h2>
              <span className="text-xs text-slate-400">{age} anos</span>
            </div>
            <p className="text-xs text-slate-400">{city}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                currentUser.vipTier === 'diamond_club'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : currentUser.vipTier === 'black_vip'
                  ? 'bg-slate-800 text-slate-200 border border-slate-700'
                  : 'bg-slate-800/80 text-slate-400'
              }`}>
                {currentUser.vipTier === 'diamond_club'
                  ? 'Diamond Club'
                  : currentUser.vipTier === 'black_vip'
                  ? 'Black VIP'
                  : 'Membro Gratuito'}
              </span>

              {currentUser.isVerified ? (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verificado Real
                </span>
              ) : (
                <button
                  type="button"
                  onClick={onOpenVerification}
                  className="text-[10px] text-amber-400 underline font-medium"
                >
                  Verificar Identidade
                </button>
              )}

              {currentUser.bdsm.enabled && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                  {currentUser.bdsm.role}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Verification Certificate Preview */}
        {currentUser.isVerified && currentUser.verificationHash && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Certificado Criptográfico SHA-256:</span>
            <span className="text-emerald-400">{currentUser.verificationHash}</span>
          </div>
        )}
      </div>

      {/* Sub-navigation Switcher: Configurar Perfil vs Privacidade vs BDSM */}
      <div className="flex items-center p-1 bg-[#10131d] border border-slate-800 rounded-2xl text-xs font-semibold shadow-md">
        <button
          type="button"
          onClick={() => setSubTab('edit')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            subTab === 'edit'
              ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Editar Perfil & Hobbies</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('privacy')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            subTab === 'privacy'
              ? 'bg-slate-800 text-white font-bold shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Privacidade & Conta</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('bdsm')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            subTab === 'bdsm'
              ? 'bg-rose-950/60 text-rose-200 border border-rose-500/50 font-bold shadow-md'
              : 'text-slate-400 hover:text-rose-300'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>BDSM & Teste</span>
        </button>
      </div>

      {/* SUB-TAB 1: EDIT PROFILE & HOBBIES */}
      {subTab === 'edit' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Photos Management (Public and Private) */}
          <div className="bg-[#10131d] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            {/* Header with Public / Private Sub-Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Gestão de Mídia do Perfil
                </h3>
                <p className="text-[11px] text-slate-400">
                  Organize fotos abertas para o radar e fotos confidenciais no cofre criptografado.
                </p>
              </div>

              {/* Public vs Private Selector */}
              <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setPhotoSection('public')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    photoSection === 'public'
                      ? 'bg-rose-600 text-white font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Públicas ({photos.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoSection('private')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    photoSection === 'private'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow'
                      : 'text-slate-400 hover:text-amber-200'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Privadas / Cofre ({privatePhotos.length})</span>
                </button>
              </div>
            </div>

            {/* PUBLIC PHOTOS SECTION */}
            {photoSection === 'public' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    <span>Visíveis publicamente nos cards do Radar e Momentos.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPhotoAddInput(!showPhotoAddInput)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Pública</span>
                  </button>
                </div>

                {/* Photo Input Field */}
                {showPhotoAddInput && (
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                    <input
                      type="text"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder="Cole a URL da foto (ex: https://... ou /src/assets/images/...)"
                      className="w-full bg-black/60 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                    />
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>Exemplos rápidos: toque para usar imagem pronta</span>
                      <button
                        type="button"
                        onClick={() => setNewPhotoUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80')}
                        className="text-rose-400 hover:underline"
                      >
                        + Foto Exemplo
                      </button>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowPhotoAddInput(false)}
                        className="px-3 py-1 text-xs text-slate-400"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleAddPhoto}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-lg"
                      >
                        Salvar Foto Pública
                      </button>
                    </div>
                  </div>
                )}

                {/* Thumbnails list */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {photos.map((url, idx) => {
                    const isAvatar = avatarUrl === url;
                    return (
                      <div
                        key={idx}
                        className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all ${
                          isAvatar
                            ? 'border-rose-500 ring-2 ring-rose-500/30 shadow-md'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <img
                          src={url}
                          alt={`Foto Pública ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {isAvatar ? (
                          <span className="absolute bottom-1 left-1 right-1 bg-rose-600/90 text-white text-[9px] font-bold py-0.5 text-center rounded-md">
                            Principal
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetAvatar(url)}
                            className="absolute bottom-1 left-1 right-1 bg-black/70 hover:bg-black/90 text-slate-200 text-[9px] font-medium py-0.5 text-center rounded-md transition-colors"
                          >
                            Tornar Principal
                          </button>
                        )}

                        {photos.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-slate-400 hover:text-rose-400"
                            title="Remover foto"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PRIVATE / VAULT PHOTOS SECTION */}
            {photoSection === 'private' && (
              <div className="space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-[11px] text-amber-300/90 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Fotos no cofre criptografado com proteção anti-screenshot.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewPrivateAsVisitor(!previewPrivateAsVisitor)}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                        previewPrivateAsVisitor
                          ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {previewPrivateAsVisitor ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{previewPrivateAsVisitor ? 'Ver como Dono' : 'Prévia como Visitante'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPrivatePhotoAddInput(!showPrivatePhotoAddInput)}
                      className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-semibold rounded-xl flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar Privada</span>
                    </button>
                  </div>
                </div>

                {/* Private Access Rules Selector */}
                <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1.5 text-xs">
                  <span className="font-semibold text-slate-200 block text-[11px]">
                    Política de Acesso ao seu Álbum Privado:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPrivateAccessRule('request')}
                      className={`p-2 rounded-lg text-left border transition-all text-[10px] ${
                        privateAccessRule === 'request'
                          ? 'bg-rose-500/20 border-rose-500/50 text-rose-200 font-semibold'
                          : 'bg-black/40 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="block font-bold">Solicitação Mútua</span>
                      <span className="text-[9px] opacity-80">Você aprova cada pessoa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrivateAccessRule('vip')}
                      className={`p-2 rounded-lg text-left border transition-all text-[10px] ${
                        privateAccessRule === 'vip'
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 font-semibold'
                          : 'bg-black/40 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="block font-bold">Apenas Black VIP</span>
                      <span className="text-[9px] opacity-80">Membros verificados</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrivateAccessRule('locked')}
                      className={`p-2 rounded-lg text-left border transition-all text-[10px] ${
                        privateAccessRule === 'locked'
                          ? 'bg-slate-800 border-slate-600 text-white font-semibold'
                          : 'bg-black/40 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="block font-bold">Totalmente Oculto</span>
                      <span className="text-[9px] opacity-80">Sob senha temporária</span>
                    </button>
                  </div>
                </div>

                {/* Private Photo Input Field */}
                {showPrivatePhotoAddInput && (
                  <div className="p-3 bg-slate-900 border border-amber-500/30 rounded-xl space-y-2">
                    <input
                      type="text"
                      value={newPrivatePhotoUrl}
                      onChange={(e) => setNewPrivatePhotoUrl(e.target.value)}
                      placeholder="Cole a URL da foto íntima/privada"
                      className="w-full bg-black/60 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>Imagens são protegidas por criptografia e DRM</span>
                      <button
                        type="button"
                        onClick={() => setNewPrivatePhotoUrl('/src/assets/images/liberal_moment_art_1790885781551.jpg')}
                        className="text-amber-400 hover:underline"
                      >
                        + Usar Foto do Acervo Privado
                      </button>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowPrivatePhotoAddInput(false)}
                        className="px-3 py-1 text-xs text-slate-400"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleAddPrivatePhoto}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg"
                      >
                        Guardar no Cofre
                      </button>
                    </div>
                  </div>
                )}

                {/* Private Thumbnails list */}
                {privatePhotos.length === 0 ? (
                  <div className="p-6 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl text-center space-y-2">
                    <Lock className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">Você ainda não possui fotos no seu cofre privado.</p>
                    <button
                      type="button"
                      onClick={() => setShowPrivatePhotoAddInput(true)}
                      className="text-xs text-amber-400 font-semibold underline underline-offset-2"
                    >
                      Adicionar primeira foto privada
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {privatePhotos.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-2xl overflow-hidden aspect-square border-2 border-amber-500/30 group shadow-md"
                      >
                        <img
                          src={url}
                          alt={`Foto Privada ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className={`w-full h-full object-cover transition-all ${
                            previewPrivateAsVisitor ? 'blur-lg scale-110 brightness-50' : ''
                          }`}
                        />

                        {/* Lock overlay for visitor preview */}
                        {previewPrivateAsVisitor && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center bg-black/40">
                            <Lock className="w-5 h-5 text-amber-400 mb-0.5" />
                            <span className="text-[8px] font-bold text-amber-200 uppercase">Cofre Privado</span>
                          </div>
                        )}

                        {!previewPrivateAsVisitor && (
                          <span className="absolute bottom-1 left-1 right-1 bg-amber-500/90 text-slate-950 text-[9px] font-bold py-0.5 text-center rounded-md flex items-center justify-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Privada #{idx + 1}</span>
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemovePrivatePhoto(idx)}
                          className="absolute top-1 right-1 p-1 bg-black/70 rounded-full text-slate-400 hover:text-rose-400"
                          title="Remover foto privada"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Basic Personal Information Form */}
          <div className="bg-[#10131d] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2">
              Informações Pessoais & Localização
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Nome ou Apelido Social:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Idade:</label>
                <input
                  type="number"
                  min="18"
                  max="99"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>Cidade & Bairro de Referência (para Encontros Reais):</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: São Paulo, Jardins"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-300 block mb-1">
                  Biografia & O que você busca:
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Conte um pouco sobre sua essência, estilo de vida, conversas que aprecia e limites..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Blind Match Configuration (Modo Conexão às Cegas) */}
          <div className="bg-[#10131d] border border-violet-800/40 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <EyeOff className="w-4 h-4 text-violet-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-violet-300">
                Configurações da Conexão às Cegas (Blind Match)
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              No modo às cegas, suas fotos ficam ocultas. Outros usuários verão apenas seu alias anônimo, valores e pergunta quebra-gelo.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Apelido Enigmático (Masked Alias):</label>
                <input
                  type="text"
                  value={maskedAlias}
                  onChange={(e) => setMaskedAlias(e.target.value)}
                  placeholder="Ex: Arquiteto Noturno, Musa do Vinil"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Resumo de Valores & Conexão:</label>
                <input
                  type="text"
                  value={valuesSummary}
                  onChange={(e) => setValuesSummary(e.target.value)}
                  placeholder="Ex: Priorizo respeito irrestrito a limites e conversas inteligentes."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Pergunta Quebra-Gelo (Icebreaker):</label>
                <input
                  type="text"
                  value={icebreaker}
                  onChange={(e) => setIcebreaker(e.target.value)}
                  placeholder="Ex: Qual foi a viagem que mais transformou seu olhar sobre o mundo?"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>

          {/* Hobbies & Interests Selector with categories */}
          <div className="bg-[#10131d] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Seus Hobbies & Afinidades ({selectedHobbies.length} selecionados)
              </h3>
              <span className="text-[10px] text-rose-400 font-mono">Alimenta o Algoritmo</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Toque nos interesses para ativar ou desativar. Quanto mais afinidades escolher, mais preciso será seu radar de compatibilidade.
            </p>

            <div className="space-y-4">
              {Object.entries(hobbiesByCategory).map(([category, items]) => (
                <div key={category} className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">
                    {category}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((hobby) => {
                      const isSelected = selectedHobbies.includes(hobby.name);
                      return (
                        <button
                          key={hobby.id}
                          type="button"
                          onClick={() => toggleHobby(hobby.name)}
                          className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-semibold shadow-sm'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-rose-400" />}
                          <span>{hobby.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky Save Changes Bar */}
          <div className="pt-2 sticky bottom-20 md:bottom-4 z-20">
            <button
              type="button"
              onClick={handleSaveProfile}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-bold text-xs transition-all shadow-xl shadow-rose-500/30 flex items-center justify-center gap-2 active:scale-98"
            >
              {isSavedRecently ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Alterações Salvas com Sucesso!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Todas as Configurações do Perfil</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PRIVACY & SECURITY CONTROLS */}
      {subTab === 'privacy' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Identity Verification Action Card */}
          <div
            onClick={onOpenVerification}
            className="bg-gradient-to-r from-emerald-950/30 to-[#10131d] border border-emerald-500/30 hover:border-emerald-500/50 p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white font-display">
                  {currentUser.isVerified ? 'Selo de Identidade Ativo' : 'Verificação Biométrica de Identidade'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {currentUser.isVerified
                    ? 'Sua vivacidade foi comprovada. Zero tolerância a perfis falsos.'
                    : 'Faça o teste de 30s com vivacidade facial para receber o selo real.'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </div>

          {/* Absolute Privacy & Security Controls Matrix */}
          <div className="bg-[#10131d] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Lock className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Central de Privacidade Absoluta
              </h3>
            </div>

            {/* Ghost Mode */}
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-200 block">Modo Fantasma (Invisibilidade no Radar)</span>
                <span className="text-[11px] text-slate-400">
                  Navegue e explore perfis sem aparecer no radar de pessoas próximas.
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting('ghostMode')}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ml-3 ${
                  privacy.ghostMode ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    privacy.ghostMode ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Blur Photos by default */}
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-200 block">Desfocar Fotos por Padrão</span>
                <span className="text-[11px] text-slate-400">
                  Suas fotos de perfil só serão reveladas a quem você aprovar mutualmente.
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting('blurPhotosByDefault')}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ml-3 ${
                  privacy.blurPhotosByDefault ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    privacy.blurPhotosByDefault ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Anti-Screenshot DRM Watermark */}
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-200 block">Proteção Anti-Screenshot DRM</span>
                <span className="text-[11px] text-slate-400">
                  Insere marca d&apos;água criptográfica indelével em fotos para evitar vazamentos.
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting('blockScreenshots')}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ml-3 ${
                  privacy.blockScreenshots ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    privacy.blockScreenshots ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Quick Camouflage button test */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onTriggerStealth}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2"
              >
                <EyeOff className="w-4 h-4 text-slate-400" />
                <span>Testar Modo Camuflagem (Tela de Calculadora com PIN 1234)</span>
              </button>
            </div>
          </div>

          {/* VIP Monetization Card */}
          <div
            onClick={onOpenVip}
            className="bg-gradient-to-r from-amber-500/10 via-[#10131d] to-[#10131d] border border-amber-500/30 hover:border-amber-500/50 p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white font-display">
                  Assinaturas VIP & Monetização
                </h4>
                <p className="text-[11px] text-slate-400">
                  Desbloqueie chamadas ilimitadas, momentos exclusivos e modo invisível.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </div>

          {/* Safety Policy & Legal Notice */}
          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-[11px] text-slate-400 space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>Diretrizes Éticas e Tolerância Zero</span>
            </div>
            <p>
              Este aplicativo é restrito a maiores de 18 anos. É proibido qualquer tipo de assédio, chantagem ou compartilhamento não autorizado de fotos e momentos íntimos. Infrações resultam em banimento irrevogável de identificadores criptográficos.
            </p>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: BDSM & CONSENT SETTINGS */}
      {subTab === 'bdsm' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* BDSM Precision Diagnostic Test Card */}
          <div
            onClick={onOpenBdsmTest}
            className="bg-gradient-to-r from-rose-950/30 via-[#121522] to-[#10131d] border border-rose-500/40 hover:border-rose-500/70 p-4 rounded-2xl cursor-pointer transition-all shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white font-display">
                      Teste BDSM de Alta Precisão & Dicionário
                    </h4>
                    <span className="px-2 py-0.2 rounded-full bg-rose-500 text-slate-950 font-bold text-[9px] uppercase">
                      Diagnóstico 2026
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Quiz aprofundado com percentual de afinidade e significado de cada prática.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </div>

            {currentUser.bdsm.testResult ? (
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1.5">
                  <span>Resultado Ativo: <strong className="text-rose-300">{currentUser.bdsm.testResult.topRole}</strong></span>
                  <span className="text-[10px] text-slate-500">Concluído em {currentUser.bdsm.testResult.completedAt}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {currentUser.bdsm.testResult.scores.slice(0, 4).map((s) => (
                    <div key={s.practiceId} className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800 text-[10px] flex justify-between">
                      <span className="text-slate-300 truncate max-w-[120px]">{s.name.split(' (')[0]}</span>
                      <span className="font-mono text-rose-400 font-bold">{s.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Descubra seu perfil exato entre Rigger, Dominante, Masoquista, Shibari, etc.
                </span>
                <span className="text-xs font-semibold text-rose-400 underline underline-offset-2 shrink-0 ml-2">
                  Iniciar Teste
                </span>
              </div>
            )}
          </div>

          {/* BDSM Consent Configuration Card */}
          <div
            onClick={onOpenBdsmConsent}
            className="bg-[#10131d] border border-rose-500/30 hover:border-rose-500/50 p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white font-display flex items-center gap-2">
                  <span>Consentimento & Filtros BDSM</span>
                  {currentUser.bdsm.enabled && (
                    <span className="px-2 py-0.2 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-mono">
                      {currentUser.bdsm.role}
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-slate-400">
                  Palavra de segurança: <strong className="text-rose-300">{currentUser.bdsm.safeWord || 'Não configurada'}</strong> · {currentUser.bdsm.hardLimits.length} limites rígidos.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </div>
        </div>
      )}
    </div>
  );
}
