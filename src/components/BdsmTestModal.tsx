import { useState } from 'react';
import {
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  X,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Award,
  ShieldCheck,
  Flame,
  Search,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import { BdsmPracticeDefinition, BdsmTestResult, BdsmScoreItem } from '../types';
import { BDSM_PRACTICES_CATALOG, BDSM_QUIZ_QUESTIONS } from '../data/bdsmPracticesData';

interface BdsmTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveResults: (result: BdsmTestResult, primaryRole: string) => void;
  existingResult?: BdsmTestResult;
}

export function BdsmTestModal({
  isOpen,
  onClose,
  onSaveResults,
  existingResult,
}: BdsmTestModalProps) {
  const [activeTab, setActiveTab] = useState<'quiz' | 'catalog'>(
    existingResult ? 'quiz' : 'quiz'
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [calculatedResult, setCalculatedResult] = useState<BdsmTestResult | null>(
    existingResult || null
  );
  const [searchCatalogQuery, setSearchCatalogQuery] = useState('');
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<string>('all');
  const [expandedPracticeId, setExpandedPracticeId] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentQ = BDSM_QUIZ_QUESTIONS[currentQuestionIndex];
  const totalQuestions = BDSM_QUIZ_QUESTIONS.length;
  const isQuestionAnswered = selectedAnswers[currentQ?.id] !== undefined;

  const handleSelectOption = (qId: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateResults = () => {
    const rawScores: Record<string, number> = {};
    const maxPossible: Record<string, number> = {};

    // Initialize all catalog practices
    BDSM_PRACTICES_CATALOG.forEach((p) => {
      rawScores[p.id] = 0;
      maxPossible[p.id] = 0;
    });

    // Accumulate points
    BDSM_QUIZ_QUESTIONS.forEach((q) => {
      const chosenIdx = selectedAnswers[q.id];
      const maxInQuestion: Record<string, number> = {};

      q.options.forEach((opt) => {
        Object.entries(opt.points).forEach(([pId, pts]) => {
          maxInQuestion[pId] = Math.max(maxInQuestion[pId] || 0, pts);
        });
      });

      Object.entries(maxInQuestion).forEach(([pId, maxPts]) => {
        maxPossible[pId] = (maxPossible[pId] || 0) + maxPts;
      });

      if (chosenIdx !== undefined && q.options[chosenIdx]) {
        const chosenPoints = q.options[chosenIdx].points;
        Object.entries(chosenPoints).forEach(([pId, pts]) => {
          rawScores[pId] = (rawScores[pId] || 0) + pts;
        });
      }
    });

    // Calculate percentage items
    const scoreItems: BdsmScoreItem[] = BDSM_PRACTICES_CATALOG.map((p) => {
      const earned = rawScores[p.id] || 0;
      const possible = maxPossible[p.id] || 5;
      const percentage = Math.min(Math.round((earned / possible) * 100), 100);

      let affinityLevel: BdsmScoreItem['affinityLevel'] = 'Limite / Baixa';
      if (percentage >= 75) affinityLevel = 'Alta Afinidade';
      else if (percentage >= 45) affinityLevel = 'Moderada';
      else if (percentage >= 20) affinityLevel = 'Curioso(a)';

      return {
        practiceId: p.id,
        name: p.name,
        percentage,
        affinityLevel,
      };
    }).sort((a, b) => b.percentage - a.percentage);

    // Determine Top Primary Role
    const topPractice = scoreItems[0];
    let topRole = 'Switch';
    if (topPractice) {
      if (topPractice.practiceId === 'rigger') topRole = 'Rigger (Shibari)';
      else if (topPractice.practiceId === 'dominante') topRole = 'Dominante';
      else if (topPractice.practiceId === 'submisso' || topPractice.practiceId === 'rope_bunny')
        topRole = 'Submisso(a)';
      else if (topPractice.practiceId === 'sadista') topRole = 'Sadista';
      else if (topPractice.practiceId === 'masoquista') topRole = 'Masoquista';
      else if (topPractice.practiceId === 'voyeurismo') topRole = 'Voyeur';
      else if (topPractice.practiceId === 'exibicionismo') topRole = 'Exibicionista';
      else topRole = 'Switch';
    }

    const finalResult: BdsmTestResult = {
      completedAt: new Date().toLocaleDateString('pt-BR'),
      topRole,
      scores: scoreItems,
    };

    setCalculatedResult(finalResult);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSaveToProfile = () => {
    if (calculatedResult) {
      onSaveResults(calculatedResult, calculatedResult.topRole);
      onClose();
    }
  };

  const handleRestartQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setCalculatedResult(null);
  };

  const filteredCatalog = BDSM_PRACTICES_CATALOG.filter((item) => {
    if (selectedCatalogCategory !== 'all' && item.category !== selectedCatalogCategory) {
      return false;
    }
    if (searchCatalogQuery.trim()) {
      const q = searchCatalogQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.shortMeaning.toLowerCase().includes(q) ||
        item.detailedMeaning.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0B0D]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#0B0B0D] border border-[#39363B] rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative text-[#F4F1F2]">
        {/* Header with Navigation between Quiz & Practice Definitions */}
        <div className="px-5 py-4 border-b border-[#39363B] flex items-center justify-between shrink-0 bg-[#0B0B0D]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#B5122A]/15 border border-[#B5122A]/40 flex items-center justify-center text-[#B5122A]">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F4F1F2] font-display">
                Diagnóstico & Guia Completo de BDSM
              </h3>
              <p className="text-[11px] text-[#F4F1F2]/60">
                Teste de afinidades de alta precisão e significado detalhado de cada prática
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#F4F1F2]/60 hover:text-[#F4F1F2] hover:bg-[#39363B]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Teste Diagnóstico vs Dicionário de Práticas */}
        <div className="flex border-b border-[#39363B] bg-[#0B0B0D] px-5 text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'quiz'
                ? 'border-[#B5122A] text-[#B5122A] font-bold'
                : 'border-transparent text-[#F4F1F2]/60 hover:text-[#F4F1F2]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Teste BDSM de Precisão</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'catalog'
                ? 'border-[#B5122A] text-[#B5122A] font-bold'
                : 'border-transparent text-[#F4F1F2]/60 hover:text-[#F4F1F2]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Significado de Cada Prática ({BDSM_PRACTICES_CATALOG.length})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'quiz' ? (
            /* Quiz View */
            !calculatedResult ? (
              /* Active Questionnaire */
              <div className="space-y-5">
                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-[#F4F1F2]/60">
                    <span className="font-mono text-[#B5122A] font-semibold">
                      Pergunta {currentQuestionIndex + 1} de {totalQuestions}
                    </span>
                    <span className="text-[11px] text-[#F4F1F2]/60">
                      {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}% concluído
                    </span>
                  </div>
                  <div className="w-full bg-[#0B0B0D] border border-[#39363B] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#B5122A] to-[#6F0F20] h-full transition-all duration-300"
                      style={{
                        width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Category Badge & Question Title */}
                <div className="bg-[#0B0B0D] border border-[#39363B] rounded-2xl p-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B5122A] block mb-1">
                    Dimensão: {currentQ.category}
                  </span>
                  <h4 className="text-base font-bold text-[#F4F1F2] font-display mb-1">
                    {currentQ.question}
                  </h4>
                  <p className="text-xs text-[#F4F1F2]/60">{currentQ.description}</p>
                </div>

                {/* Answer Options */}
                <div className="space-y-2.5">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedAnswers[currentQ.id] === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(currentQ.id, idx)}
                        className={`w-full text-left p-3.5 rounded-2xl border text-xs leading-relaxed transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-[#B5122A]/20 border-[#B5122A] text-[#F4F1F2] font-semibold ring-1 ring-[#B5122A]/50 shadow-md'
                            : 'bg-[#0B0B0D] border-[#39363B] text-[#F4F1F2]/80 hover:border-[#39363B]/80 hover:bg-[#39363B]/10'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? 'border-[#B5122A] bg-[#B5122A] text-[#F4F1F2] font-bold text-[10px]'
                              : 'border-[#39363B] text-[#F4F1F2]/60'
                          }`}
                        >
                          {isSelected ? '✓' : String.fromCharCode(65 + idx)}
                        </div>
                        <span className="flex-1">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Buttons */}
                <div className="pt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#F4F1F2]/60 hover:text-[#F4F1F2] disabled:opacity-30 flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Anterior</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isQuestionAnswered}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B5122A] to-[#6F0F20] hover:from-[#B5122A]/90 hover:to-[#6F0F20]/90 disabled:opacity-40 text-[#F4F1F2] font-bold text-xs transition-all shadow-lg shadow-[#B5122A]/20 flex items-center gap-2"
                  >
                    <span>
                      {currentQuestionIndex === totalQuestions - 1
                        ? 'Finalizar e Ver Resultados'
                        : 'Próxima Pergunta'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Diagnostic Results Dashboard */
              <div className="space-y-6">
                {/* Primary Archetype Banner */}
                <div className="bg-gradient-to-br from-[#6F0F20]/40 via-[#0B0B0D] to-[#0B0B0D] border border-[#B5122A]/40 rounded-3xl p-5 text-center relative overflow-hidden shadow-2xl">
                  <div className="w-14 h-14 rounded-2xl bg-[#B5122A]/20 border border-[#B5122A]/40 text-[#B5122A] flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <Award className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#B5122A] block mb-1">
                    Seu Arquétipo BDSM Predominante
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#F4F1F2] font-display mb-1">
                    {calculatedResult.topRole}
                  </h3>
                  <p className="text-xs text-[#F4F1F2]/80 max-w-md mx-auto leading-relaxed">
                    Com base nas suas respostas, sua principal expressão erótica de poder e estímulo está alinhada a este perfil.
                  </p>
                </div>

                {/* Score breakdown across all practices */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F4F1F2]">
                      Mapa de Afinidade por Prática:
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('catalog')}
                      className="text-xs text-[#B5122A] hover:text-[#B5122A]/80 flex items-center gap-1 font-medium transition-colors"
                    >
                      <span>Ver o que significa cada uma</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {calculatedResult.scores.map((score) => {
                      // Find meaning from catalog
                      const practiceDef = BDSM_PRACTICES_CATALOG.find(
                        (p) => p.id === score.practiceId
                      );

                      return (
                        <div
                          key={score.practiceId}
                          className="bg-[#0B0B0D] border border-[#39363B] rounded-2xl p-3.5 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold text-xs text-[#F4F1F2] block">
                                {score.name}
                              </span>
                              <span className="text-[11px] text-[#F4F1F2]/60 block">
                                {practiceDef?.shortMeaning}
                              </span>
                            </div>
                            <div className="text-right shrink-0 ml-3">
                              <span className="text-sm font-mono font-bold text-[#B5122A]">
                                {score.percentage}%
                              </span>
                              <span
                                className={`text-[10px] font-semibold block ${
                                  score.percentage >= 75
                                    ? 'text-[#B5122A]'
                                    : score.percentage >= 45
                                    ? 'text-[#F4F1F2]'
                                    : 'text-[#F4F1F2]/60'
                                }`}
                              >
                                {score.affinityLevel}
                              </span>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full bg-[#39363B]/50 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                score.percentage >= 75
                                  ? 'bg-[#B5122A]'
                                  : score.percentage >= 45
                                  ? 'bg-[#6F0F20]'
                                  : 'bg-[#39363B]'
                              }`}
                              style={{ width: `${score.percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={handleRestartQuiz}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl border border-[#39363B] bg-[#0B0B0D] hover:bg-[#39363B]/20 text-[#F4F1F2]/80 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Refazer Teste</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveToProfile}
                    className="w-full flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-[#B5122A] to-[#6F0F20] hover:from-[#B5122A]/90 hover:to-[#6F0F20]/90 text-[#F4F1F2] font-bold text-xs transition-all shadow-lg shadow-[#B5122A]/25 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Salvar Resultados no Meu Perfil Aura Privé</span>
                  </button>
                </div>
              </div>
            )
          ) : (
            /* Catalog Encyclopedia View with Definitions of Every Practice */
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#F4F1F2]/40 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchCatalogQuery}
                    onChange={(e) => setSearchCatalogQuery(e.target.value)}
                    placeholder="Buscar prática por nome ou termo (ex: Shibari, Aftercare, Cera, Spanking)..."
                    className="w-full bg-[#0B0B0D] border border-[#39363B] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#F4F1F2] placeholder:text-[#F4F1F2]/40 focus:outline-none focus:border-[#B5122A]"
                  />
                </div>

                {/* Category tabs */}
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {[
                    'all',
                    'Dinâmicas de Poder',
                    'Contenção & Cordas',
                    'Estímulos Sensoriais & Dor',
                    'Psicológico & Verbal',
                    'Exibição & Fetiche',
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCatalogCategory(cat)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border whitespace-nowrap transition-colors ${
                        selectedCatalogCategory === cat
                          ? 'bg-[#B5122A]/20 border-[#B5122A] text-[#F4F1F2] font-semibold'
                          : 'bg-[#0B0B0D] border-[#39363B] text-[#F4F1F2]/60 hover:text-[#F4F1F2]'
                      }`}
                    >
                      {cat === 'all' ? 'Todas as Categorias' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Practices List with Rich Definitions */}
              <div className="space-y-3">
                {filteredCatalog.map((practice) => {
                  const isExpanded = expandedPracticeId === practice.id;
                  return (
                    <div
                      key={practice.id}
                      className="bg-[#0B0B0D] border border-[#39363B] hover:border-[#39363B]/80 rounded-2xl p-4 transition-all"
                    >
                      <div
                        onClick={() =>
                          setExpandedPracticeId(isExpanded ? null : practice.id)
                        }
                        className="cursor-pointer flex items-start justify-between gap-3"
                      >
                        <div>
                          <span className="text-[10px] font-mono text-[#B5122A] uppercase font-semibold block mb-0.5">
                            {practice.category}
                          </span>
                          <h4 className="text-sm font-bold text-[#F4F1F2] font-display">
                            {practice.name}
                          </h4>
                          <p className="text-xs text-[#F4F1F2]/80 mt-1 leading-relaxed">
                            <strong className="text-[#B5122A]">Significado: </strong>
                            {practice.shortMeaning}
                          </p>
                        </div>
                        <div className="p-1 rounded-lg text-[#F4F1F2]/60 hover:text-[#F4F1F2] shrink-0 mt-1">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>

                      {/* Expanded In-Depth Meaning & Safety Protocol */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-[#39363B] space-y-3 text-xs animate-in fade-in duration-200">
                          <div>
                            <span className="font-bold text-[#F4F1F2] block mb-1 text-[11px] uppercase tracking-wider">
                              Como funciona a prática em detalhes:
                            </span>
                            <p className="text-[#F4F1F2]/80 leading-relaxed bg-[#0B0B0D] p-3 rounded-xl border border-[#39363B]">
                              {practice.detailedMeaning}
                            </p>
                          </div>

                          <div>
                            <span className="font-bold text-[#B5122A] flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Protocolo de Segurança & Consentimento Obrigatório:
                            </span>
                            <p className="text-[#F4F1F2]/90 leading-relaxed bg-[#6F0F20]/20 p-3 rounded-xl border border-[#B5122A]/30">
                              {practice.safetyGuidelines}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
