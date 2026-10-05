import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Check,
  ArrowRight,
  ArrowLeft,
  Ruler,
  Heart,
  Users,
  ShieldCheck
} from 'lucide-react';
import { User, PersonalDetails, BdsmProfile } from '../types';
import { BDSM_FETISH_OPTIONS, ALL_HOBBIES } from '../data/mockData';
import { DynamicLocationPicker } from './DynamicLocationPicker';
import { AuraPriveLogo } from './AuraPriveLogo';

interface OnboardingSurveyModalProps {
  isOpen: boolean;
  user: User;
  onCompleteSurvey: (updatedProfile: Partial<User>) => void;
}

const RELATIONSHIP_OPTIONS: PersonalDetails['relationshipStyle'][] = [
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

const CHILDREN_OPTIONS: PersonalDetails['childrenPreference'][] = [
  'Não quero filhos',
  'Quero ter filhos',
  'Já tenho filhos',
  'Aberto(a) à possibilidade',
  'Prefiro não dizer'
];

const BDSM_ROLES: BdsmProfile['role'][] = [
  'Dominante',
  'Submisso(a)',
  'Switch',
  'Rigger (Shibari)',
  'Voyeur',
  'Exibicionista',
  'Curioso(a)'
];

export function OnboardingSurveyModal({
  isOpen,
  user,
  onCompleteSurvey
}: OnboardingSurveyModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Identity, Age, Dynamic Location & Compact Height
  const [age, setAge] = useState<number>(user.age || 26);
  const [city, setCity] = useState<string>(user.city || 'São Paulo, Jardins (SP)');
  const [relationshipStyle, setRelationshipStyle] =
    useState<PersonalDetails['relationshipStyle']>('Solteiro(a) Liberal');
  const [heightCm, setHeightCm] = useState<number>(user.personalDetails?.heightCm || 175);
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');

  // Step 2: Liberal & BDSM Preferences
  const [lookingFor, setLookingFor] = useState<PersonalDetails['lookingFor']>(
    'Encontros Casuais & Química'
  );
  const [bdsmRole, setBdsmRole] = useState<BdsmProfile['role']>('Switch');
  const [bdsmExperience, setBdsmExperience] =
    useState<NonNullable<BdsmProfile['experienceLevel']>>('Experiente');
  const [selectedFetishes, setSelectedFetishes] = useState<string[]>([
    'Vendas & Privação Sensorial',
    'Dominação & Submissão (D/s)',
    'Voyeurismo & Exibicionismo'
  ]);

  // Step 3: Lifestyle, Children, Hobbies & Bio
  const [childrenPreference, setChildrenPreference] =
    useState<PersonalDetails['childrenPreference']>('Não quero filhos');
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([
    'Vinhos Naturais & Drinks Autorais',
    'Festas Privadas & Clubes Liberais',
    'Noites de Hotel & Champagne'
  ]);
  const [bio, setBio] = useState<string>(
    'Mente aberta, em busca de química real, bons drinks e experiências intensas com respeito e discrição.'
  );

  if (!isOpen) return null;

  const formatHeight = (cm: number) => {
    if (heightUnit === 'ft') {
      const totalInches = Math.round(cm / 2.54);
      const feet = Math.floor(totalInches / 12);
      const inches = totalInches % 12;
      return `${feet}' ${inches}" (${cm} cm)`;
    }
    return `${cm} cm`;
  };

  const toggleFetish = (fetish: string) => {
    setSelectedFetishes((prev) =>
      prev.includes(fetish) ? prev.filter((f) => f !== fetish) : [...prev, fetish]
    );
  };

  const toggleHobby = (hobby: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobby) ? prev.filter((h) => h !== hobby) : [...prev, hobby]
    );
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    onCompleteSurvey({
      age: Number(age) || 26,
      city: city.trim() || 'São Paulo, Jardins (SP)',
      bio: bio.trim() || user.bio,
      hobbies: selectedHobbies,
      personalDetails: {
        heightCm,
        childrenPreference,
        relationshipStyle,
        lookingFor,
        drinking: 'Apreciador de Vinhos/Drinks',
        smoking: 'Não fumo',
        zodiacSign: 'Escorpião'
      },
      bdsm: {
        ...user.bdsm,
        enabled: true,
        role: bdsmRole,
        experienceLevel: bdsmExperience,
        fetishes: selectedFetishes,
        softLimits: selectedFetishes
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-3xl velvet-card border border-white/15 p-5 sm:p-7 max-h-[92vh] overflow-y-auto space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <AuraPriveLogo size="sm" />
            <h2 className="text-lg sm:text-xl font-bold text-white font-display mt-2">
              Personalize Seu Perfil Privé (Etapa {step} de 3)
            </h2>
            <p className="text-xs text-[#FAF5F6]/65">
              Responda esta breve pesquisa para conectarmos você com pessoas que têm a mesma química e gostos.
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`h-2 rounded-full transition-all ${
                  step === s ? 'w-7 bg-[#E11D48]' : step > s ? 'w-3 bg-emerald-400' : 'w-3 bg-white/15'
                }`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleFinish} className="space-y-5">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-white block mb-1.5">
                    Sua Idade (+18)
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={80}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#0D090B] border border-white/10 text-sm text-white focus:outline-none focus:border-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5 mb-1.5">
                    <Users className="w-3.5 h-3.5 text-[#FB7185]" />
                    <span>Formato do Seu Perfil</span>
                  </label>
                  <select
                    value={relationshipStyle}
                    onChange={(e) =>
                      setRelationshipStyle(
                        e.target.value as PersonalDetails['relationshipStyle']
                      )
                    }
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0D090B] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#E11D48]"
                  >
                    {RELATIONSHIP_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Location Picker */}
              <DynamicLocationPicker
                value={city}
                onChange={(newLoc, isImp) => {
                  setCity(newLoc);
                  if (typeof isImp === 'boolean') {
                    setHeightUnit(isImp ? 'ft' : 'cm');
                  }
                }}
              />

              {/* Compact Efficient Height Selector (Image 2 style) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-[#FB7185]" />
                  <span>Sua Altura:</span>
                  <strong className="text-[#FB7185] font-bold">{formatHeight(heightCm)}</strong>
                </label>

                <div className="rounded-2xl bg-[#141318] border border-white/10 p-3.5 space-y-3">
                  <div className="flex items-center gap-3">
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

                  <div className="flex flex-col items-center gap-1.5 pt-2 border-t border-white/[0.07]">
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
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-white flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>O que você mais procura no Aura Privé?</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {LOOKING_FOR_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setLookingFor(opt)}
                      className={`p-3 rounded-xl text-xs font-semibold border text-left transition-all ${
                        lookingFor === opt
                          ? 'bg-[#E11D48] text-white border-[#E11D48]'
                          : 'bg-[#0F0E11] text-white/75 border-white/10 hover:border-white/25'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5 mb-2">
                    <Flame className="w-3.5 h-3.5 text-[#FB7185]" />
                    <span>Sua Posição / Papel BDSM</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {BDSM_ROLES.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setBdsmRole(role)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          bdsmRole === role
                            ? 'bg-[#E11D48] text-white border-[#E11D48]'
                            : 'bg-[#0F0E11] text-white/70 border-white/10'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white block mb-2">
                    Nível de Experiência Liberal / BDSM
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      ['Iniciante', 'Intermediário', 'Experiente', 'Mestre / Avançado'] as const
                    ).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setBdsmExperience(lvl)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          bdsmExperience === lvl
                            ? 'bg-amber-500/25 text-amber-200 border-amber-400'
                            : 'bg-[#0F0E11] text-white/70 border-white/10'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-white block mb-2">
                  Fetiches &amp; Práticas que Despertam Seu Interesse ({selectedFetishes.length})
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {BDSM_FETISH_OPTIONS.map((fetish) => {
                    const active = selectedFetishes.includes(fetish);
                    return (
                      <button
                        key={fetish}
                        type="button"
                        onClick={() => toggleFetish(fetish)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1 transition-all ${
                          active
                            ? 'bg-[#E11D48] text-white border-[#E11D48]'
                            : 'bg-[#0F0E11] text-white/70 border-white/10'
                        }`}
                      >
                        {active && <Check className="w-3 h-3" />}
                        <span>{fetish}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-white block mb-2">
                  Pretende ter filhos?
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CHILDREN_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setChildrenPreference(opt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${
                        childrenPreference === opt
                          ? 'bg-[#E11D48] text-white border-[#E11D48]'
                          : 'bg-[#0F0E11] text-white/70 border-white/10'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-white block mb-2">
                  Gostos &amp; Vibe Noturna ({selectedHobbies.length} selecionados)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                  {ALL_HOBBIES.map((h) => {
                    const active = selectedHobbies.includes(h.name);
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => toggleHobby(h.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1 ${
                          active
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                            : 'bg-[#0F0E11] border-white/10 text-white/70'
                        }`}
                      >
                        {active && <Check className="w-3 h-3" />}
                        <span>{h.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-white block mb-1.5">
                  Frase de Apresentação / Bio do Seu Perfil
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Conte um pouco sobre o que te atrai, sua vibe e o que procura..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0D090B] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#E11D48]"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev === 3 ? 2 : 1))}
                className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-bold text-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
            ) : (
              <span className="text-[11px] text-white/50 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Você poderá editar tudo depois no Perfil
              </span>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev === 1 ? 2 : 3))}
                className="px-6 py-2.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-xs font-bold text-white flex items-center gap-1.5 shadow-md"
              >
                <span>Próxima Etapa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-xs font-bold text-white flex items-center gap-2 shadow-lg"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Concluir Meu Perfil &amp; Entrar</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
