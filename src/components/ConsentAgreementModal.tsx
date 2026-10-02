import { useState } from 'react';
import { ShieldAlert, Check, X, KeyRound, AlertTriangle, Info, HeartHandshake, Sparkles, BookOpen } from 'lucide-react';
import { BdsmProfile } from '../types';
import { BDSM_PRACTICES_CATALOG } from '../data/bdsmPracticesData';

interface ConsentAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBdsm: BdsmProfile;
  onSave: (updated: BdsmProfile) => void;
  onOpenTestQuiz?: () => void;
}

const COMMON_HARD_LIMITS = [
  { name: 'Sem consentimento explícito prévio', meaning: 'Qualquer ato sem validação prévia de limites e consentimento lúcido.' },
  { name: 'Marcas físicas permanentes ou cortes', meaning: 'Cortes, queimaduras ou danos irreversíveis na pele.' },
  { name: 'Humilhação pública sem acordo', meaning: 'Exposição ou palavras vexatórias fora do ambiente privado e cena combinada.' },
  { name: 'Gravações de áudio/vídeo não autorizadas', meaning: 'Captura ou vazamento de mídias íntimas (violação legal grave).' },
  { name: 'Uso de substâncias sem controle', meaning: 'Práticas BDSM sob efeito de entorpecentes ou álcool excessivo.' },
  { name: 'Descumprimento de aftercare', meaning: 'Não acolher o parceiro pós-sessão com hidratação, calor e carinho.' },
];

const COMMON_SOFT_LIMITS = [
  { name: 'Shibari / Cordas estéticas', meaning: 'Arte japonesa de amarrações corporais geométricas com nós seguros.' },
  { name: 'Privação sensorial (Vendas/Tampões)', meaning: 'Bloqueio da visão ou audição para amplificar sensações corporais.' },
  { name: 'Comandos verbais e dinâmicas D/s', meaning: 'Ordens consensuais e trocas psicológicas de poder e obediência.' },
  { name: 'Impact play leve a moderado', meaning: 'Palmadas ou estímulo rítmico controlado com palmatórias ou floggers.' },
  { name: 'Spanking consensual', meaning: 'Palmadas afetuosas ou punitivas sobre os glúteos.' },
  { name: 'Exibicionismo reservado entre adultos', meaning: 'Ser observado em momentos íntimos com consentimento mútuo.' },
  { name: 'Roleplay e fetiches temáticos', meaning: 'Encenações consensuais com personagens e narrativas combinadas.' },
];

export function ConsentAgreementModal({
  isOpen,
  onClose,
  currentBdsm,
  onSave,
  onOpenTestQuiz,
}: ConsentAgreementModalProps) {
  const [enabled, setEnabled] = useState(currentBdsm.enabled);
  const [role, setRole] = useState(currentBdsm.role);
  const [hardLimits, setHardLimits] = useState<string[]>(currentBdsm.hardLimits || []);
  const [softLimits, setSoftLimits] = useState<string[]>(currentBdsm.softLimits || []);
  const [safeWord, setSafeWord] = useState(currentBdsm.safeWord || 'Semáforo Vermelho');
  const [customHard, setCustomHard] = useState('');
  const [customSoft, setCustomSoft] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(currentBdsm.acceptedCharter);

  if (!isOpen) return null;

  const toggleHardLimit = (item: string) => {
    setHardLimits((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleSoftLimit = (item: string) => {
    setSoftLimits((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleAddCustomHard = () => {
    if (customHard.trim() && !hardLimits.includes(customHard.trim())) {
      setHardLimits([...hardLimits, customHard.trim()]);
      setCustomHard('');
    }
  };

  const handleAddCustomSoft = () => {
    if (customSoft.trim() && !softLimits.includes(customSoft.trim())) {
      setSoftLimits([...softLimits, customSoft.trim()]);
      setCustomSoft('');
    }
  };

  const handleSubmit = () => {
    if (enabled && !acceptedTerms) {
      alert('É obrigatório concordar com o Termo de Consentimento R.A.C.K./S.S.C. para habilitar filtros de BDSM.');
      return;
    }
    onSave({
      ...currentBdsm,
      enabled,
      role,
      hardLimits,
      softLimits,
      safeWord,
      acceptedCharter: acceptedTerms,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#10131c] border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-[#0e1118]">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-rose-400" />
            <div>
              <h3 className="text-base font-semibold text-slate-100 font-display">
                Filtros de Consentimento & BDSM / Kink
              </h3>
              <p className="text-[11px] text-slate-400">
                Padrões éticos S.S.C. (Seguro, Sóbrio, Consensual) e R.A.C.K.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Diagnostic Quiz Banner Call to Action */}
          {onOpenTestQuiz && (
            <div
              onClick={() => {
                onClose();
                onOpenTestQuiz();
              }}
              className="bg-gradient-to-r from-rose-950/40 via-[#181c2b] to-[#121520] border border-rose-500/40 hover:border-rose-500/70 p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-display flex items-center gap-2">
                    <span>Fazer Teste BDSM de Precisão</span>
                    <span className="px-2 py-0.2 rounded-full bg-rose-500 text-slate-950 font-bold text-[9px] uppercase">
                      Novo
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Responda ao quiz diagnóstico com significado de cada prática e descubra suas porcentagens exatas.
                  </p>
                </div>
              </div>
              <span className="text-xs text-rose-400 font-semibold underline underline-offset-2 shrink-0 ml-2">
                Iniciar Teste
              </span>
            </div>
          )}

          {/* Main Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
            <div>
              <span className="font-semibold text-slate-200 block text-sm">Habilitar preferências de BDSM / Kink</span>
              <span className="text-[11px] text-slate-400">
                Permite encontrar pessoas com afinidade em dinâmicas de poder e fetiches seguros.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setEnabled(!enabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                enabled ? 'bg-rose-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  enabled ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {enabled && (
            <>
              {/* Role selection with Practice Meaning */}
              <div>
                <label className="font-semibold text-slate-200 text-xs block mb-1">
                  Seu Papel ou Identificação Principal:
                </label>
                <p className="text-[11px] text-slate-400 mb-2.5">
                  Cada papel possui uma dinâmica e significado ético específico:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { name: 'Dominante', desc: 'Guia, lidera a cena e assume o cuidado do parceiro.' },
                    { name: 'Submisso(a)', desc: 'Entrega o controle voluntariamente em confiança.' },
                    { name: 'Switch', desc: 'Transita com fluidez entre dominar e se entregar.' },
                    { name: 'Rigger (Shibari)', desc: 'Conduz e aplica amarrações estéticas de cordas.' },
                    { name: 'Sadista', desc: 'Sente estímulo ao aplicar dor e endorfina consensual.' },
                    { name: 'Masoquista', desc: 'Transforma dor física consentida em prazer.' },
                    { name: 'Voyeur', desc: 'Prazer ao contemplar cenas íntimas autorizadas.' },
                    { name: 'Exibicionista', desc: 'Prazer ao ser contemplado por público adulto.' },
                    { name: 'Curioso(a)', desc: 'Deseja explorar com calma e acompanhamento.' },
                  ].map((r) => (
                    <button
                      key={r.name}
                      type="button"
                      onClick={() => setRole(r.name as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        role === r.name
                          ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-semibold shadow-sm'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">{r.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Safe Word */}
              <div>
                <label className="font-semibold text-slate-200 text-xs block mb-1">
                  Palavra de Segurança Padrão (Safe Word):
                </label>
                <p className="text-[11px] text-slate-400 mb-2">
                  Palavra clara para interrupção imediata de qualquer interação verbal ou física.
                </p>
                <input
                  type="text"
                  value={safeWord}
                  onChange={(e) => setSafeWord(e.target.value)}
                  placeholder="Ex: Vermelho, Abacaxi, Flor de Lótus"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Hard Limits with Meaning */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <label className="font-semibold text-slate-200 text-xs">
                    Limites Rígidos (Hard Limits - Não Negociáveis):
                  </label>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">
                  Práticas estritamente proibidas no seu contato com seus significados:
                </p>
                <div className="space-y-1.5 mb-2">
                  {COMMON_HARD_LIMITS.map((item) => {
                    const isSelected = hardLimits.includes(item.name);
                    return (
                      <div
                        key={item.name}
                        onClick={() => toggleHardLimit(item.name)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                          isSelected
                            ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                            : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div>
                          <span className="font-semibold text-xs block text-slate-200">
                            {isSelected ? '✕ ' : '+ '} {item.name}
                          </span>
                          <span className="text-[10px] text-slate-400">{item.meaning}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isSelected ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isSelected ? 'Proibido' : 'Adicionar'}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customHard}
                    onChange={(e) => setCustomHard(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomHard()}
                    placeholder="Adicionar outro limite rígido..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomHard}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs"
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Soft Limits with Meaning */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Info className="w-4 h-4 text-amber-400" />
                  <label className="font-semibold text-slate-200 text-xs">
                    Limites Flexíveis (Soft Limits - Abertos a diálogo prévio):
                  </label>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">
                  Práticas que você tem interesse em explorar com significados definidos:
                </p>
                <div className="space-y-1.5 mb-2">
                  {COMMON_SOFT_LIMITS.map((item) => {
                    const isSelected = softLimits.includes(item.name);
                    return (
                      <div
                        key={item.name}
                        onClick={() => toggleSoftLimit(item.name)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                            : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div>
                          <span className="font-semibold text-xs block text-slate-200">
                            {isSelected ? '✓ ' : '+ '} {item.name}
                          </span>
                          <span className="text-[10px] text-slate-400">{item.meaning}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isSelected ? 'Ativo' : 'Adicionar'}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSoft}
                    onChange={(e) => setCustomSoft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSoft()}
                    placeholder="Adicionar outro interesse flexível..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSoft}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs"
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Strict Consent Charter */}
              <div className="p-4 bg-rose-950/20 border border-rose-900/50 rounded-2xl">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consentTerms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-rose-500 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="consentTerms" className="text-[11px] text-slate-300 leading-relaxed cursor-pointer">
                    <strong className="text-rose-300 block mb-1">
                      Termo Ético de Consentimento Informado e Tolerância Zero:
                    </strong>
                    Declaro que tenho 18 anos ou mais, compreendo que consentimento pode ser revogado a qualquer momento verbalmente ou pela palavra de segurança, e que qualquer violação de limites acordados resultará em banimento perpétuo e denúncia imediata.
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0e1118] shrink-0 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-all shadow-lg shadow-rose-600/20"
          >
            Salvar Preferências e Limites
          </button>
        </div>
      </div>
    </div>
  );
}

