import { useState } from 'react';
import {
  Crown,
  Check,
  X,
  Shield,
  Sparkles,
  Flame,
  Users,
  MapPin,
  Radio,
  BadgeCheck
} from 'lucide-react';
import { VipTier } from '../types';

interface VipSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: VipTier;
  onUpgrade: (tier: VipTier) => void;
  isSellerVerified?: boolean;
}

export function VipSubscriptionModal({
  isOpen,
  onClose,
  currentTier,
  onUpgrade,
  isSellerVerified = false
}: VipSubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<VipTier>(
    currentTier === 'free' ? 'vip' : currentTier
  );
  const [period, setPeriod] = useState<'monthly' | 'annual'>('annual');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onUpgrade(selectedPlan);
      setIsSuccess(false);
      onClose();
    }, 700);
  };

  // Monthly equivalent vs Total annual math
  const vipMonthlyDisplay = period === 'annual' ? '29,90' : '49,90';
  const vipAnnualTotal = '358,80';
  const vipMonthlyStrikethrough = '49,90';

  const blackMonthlyDisplay = period === 'annual' ? '89,90' : '149,90';
  const blackAnnualTotal = '1.078,80';
  const blackMonthlyStrikethrough = '149,90';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="velvet-card border border-white/15 rounded-3xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden relative text-[#FAF5F6]">
        {/* Ambient Warm Glow */}
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-96 h-44 bg-[#E11D48]/20 blur-3xl pointer-events-none rounded-full" />

        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E11D48]/25 to-[#F59E0B]/20 border border-[#F59E0B]/40 flex items-center justify-center text-[#F59E0B]">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-display">
                Assinaturas & Privilégios Aura Privé
              </h3>
              <p className="text-xs text-[#FAF5F6]/65">
                Mais liberdade para curtir, transmitir Lives ao vivo, acessar Lounges e viver experiências reais
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[#FAF5F6]/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 relative z-10">
          {/* Seller Courtesy Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#E11D48]/15 to-amber-500/10 border border-amber-400/35 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <BadgeCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <p className="text-xs text-[#FAF5F6]/90">
                <strong className="text-amber-300">Benefício para Criadores & Vendedores:</strong> Quem possui o{' '}
                <strong>Selo de Vendedor Verificado</strong> recebe <strong>Acesso VIP Cortesia</strong> automaticamente (e Aura Black no Nível 3 Ouro).
              </p>
            </div>
            {isSellerVerified && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold uppercase shrink-0">
                Seu VIP de Vendedor está Ativo
              </span>
            )}
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="bg-[#0D090B] border border-white/15 p-1.5 rounded-2xl flex items-center text-xs shadow-inner">
              <button
                type="button"
                onClick={() => setPeriod('monthly')}
                className={`px-5 py-2 rounded-xl transition-all ${
                  period === 'monthly'
                    ? 'bg-white/15 text-white font-bold shadow-sm'
                    : 'text-[#FAF5F6]/60 hover:text-white'
                }`}
              >
                Plano Mensal
              </button>
              <button
                type="button"
                onClick={() => setPeriod('annual')}
                className={`px-5 py-2 rounded-xl transition-all flex items-center gap-2 ${
                  period === 'annual'
                    ? 'bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white font-bold shadow-md'
                    : 'text-[#FAF5F6]/60 hover:text-white'
                }`}
              >
                <span>Plano Anual</span>
                <span className="text-[10px] bg-black/40 border border-white/20 px-2 py-0.5 rounded-full text-amber-300 font-bold">
                  ECONOMIZE 40%
                </span>
              </button>
            </div>
            <p className="text-[11px] text-[#FAF5F6]/55">
              {period === 'annual'
                ? 'Valor equivalente mensal em destaque • Cobrança única anual discreta na fatura'
                : 'Cobrança recorrente mensal sem fidelidade • Cancele quando quiser'}
            </p>
          </div>

          {/* 3-Column Tier Cards: Grátis, Plano VIP, Plano Black */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* PLANO GRÁTIS */}
            <div
              onClick={() => setSelectedPlan('free')}
              className={`p-5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                selectedPlan === 'free'
                  ? 'bg-white/[0.06] border-[#E11D48] ring-2 ring-[#E11D48]/30'
                  : 'bg-[#0D090B]/80 border-white/10 hover:border-white/25'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FAF5F6]/75">
                    Plano Grátis
                  </span>
                  {currentTier === 'free' && (
                    <span className="text-[10px] bg-white/10 text-white px-2.5 py-0.5 rounded-full font-semibold">
                      Seu Plano
                    </span>
                  )}
                </div>

                <div className="my-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white font-display">R$ 0</span>
                    <span className="text-xs text-[#FAF5F6]/60">/mês</span>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-medium mt-1">
                    Gratuito para sempre
                  </p>
                </div>

                <p className="text-xs text-[#FAF5F6]/60 mb-4">
                  Acesso inicial para conhecer perfis, publicar Status e participar de comunidades abertas.
                </p>

                <ul className="space-y-2.5 text-xs text-[#FAF5F6]/85 border-t border-white/10 pt-3.5">
                  <li className="flex items-start gap-2">
                    <Flame className="w-3.5 h-3.5 text-[#FB7185] shrink-0 mt-0.5" />
                    <span>
                      <strong>20 curtidas grátis</strong> a cada 24 horas
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#FB7185] shrink-0 mt-0.5" />
                    <span>
                      <strong>4 novas conversas</strong> por dia (mensagens ilimitadas após conexão)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users className="w-3.5 h-3.5 text-[#FB7185] shrink-0 mt-0.5" />
                    <span>
                      <strong>Grupos gratuitos ilimitados</strong> + criar comunidades e videochamadas
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#FB7185] shrink-0 mt-0.5" />
                    <span>
                      <strong>Status c/ Editor</strong> de fotos e vídeos + assistir Lives abertas
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#FB7185] shrink-0 mt-0.5" />
                    <span>
                      Acesso a <strong>Encontros Reais</strong> (eventos pagos cobrados à parte)
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* PLANO VIP */}
            <div
              onClick={() => setSelectedPlan('vip')}
              className={`p-5 rounded-3xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                selectedPlan === 'vip'
                  ? 'bg-gradient-to-b from-[#E11D48]/20 via-[#161013] to-[#0D090B] border-[#E11D48] ring-2 ring-[#E11D48]/40 shadow-xl'
                  : 'bg-[#0D090B]/90 border-white/15 hover:border-[#E11D48]/50'
              }`}
            >
              <div className="absolute -top-3 right-4 bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow">
                Mais Escolhido
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FB7185] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Plano VIP
                  </span>
                  {currentTier === 'vip' && (
                    <span className="text-[10px] bg-[#E11D48]/30 text-white px-2.5 py-0.5 rounded-full font-semibold">
                      Ativo
                    </span>
                  )}
                </div>

                {/* Price Block: Monthly in Large Font, Annual Total in Smaller Text Below */}
                <div className="my-3 p-3 rounded-2xl bg-black/35 border border-white/10">
                  {period === 'annual' && (
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[11px] text-[#FAF5F6]/45 line-through">
                        De R$ {vipMonthlyStrikethrough}/mês
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#E11D48]/25 text-[#FB7185] font-bold">
                        -40%
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-bold text-[#FAF5F6]/70">R$</span>
                    <span className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight">
                      {vipMonthlyDisplay}
                    </span>
                    <span className="text-xs text-[#FAF5F6]/70 font-medium">/mês</span>
                  </div>
                  {period === 'annual' ? (
                    <p className="text-[11px] text-amber-300/95 font-semibold mt-1">
                      Total no plano anual: R$ {vipAnnualTotal}/ano (12x de R$ 29,90)
                    </p>
                  ) : (
                    <p className="text-[11px] text-[#FAF5F6]/55 mt-1">
                      Cobrado mensalmente (R$ 49,90/mês) • No anual sai R$ 29,90/mês
                    </p>
                  )}
                </div>

                <p className="text-xs text-[#FAF5F6]/70 mb-4">
                  Liberdade total sem limites diários, transmissão de Lives ao vivo e descontos em festas.
                </p>

                <ul className="space-y-2.5 text-xs text-[#FAF5F6]/90 border-t border-white/10 pt-3.5">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#FB7185] shrink-0 mt-0.5" />
                    <span>
                      <strong>Curtidas Ilimitadas</strong> 24h por dia & Rewind
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#FB7185] shrink-0 mt-0.5" />
                    <span>
                      <strong>Primeiras mensagens ilimitadas</strong> para qualquer perfil
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Radio className="w-3.5 h-3.5 text-[#FB7185] shrink-0 mt-0.5" />
                    <span>
                      <strong>Fazer Lives ao Vivo</strong> (Câmera ou OBS Studio RTMP c/ Mimos)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#FB7185] shrink-0 mt-0.5" />
                    <span>
                      <strong>30% de desconto</strong> em todos os Encontros Reais pagos
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#FB7185] shrink-0 mt-0.5" />
                    <span>
                      <strong>Modo Fantasma (Incógnito)</strong> e ver quem curtiu você
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* PLANO BLACK */}
            <div
              onClick={() => setSelectedPlan('black_vip')}
              className={`p-5 rounded-3xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                selectedPlan === 'black_vip'
                  ? 'bg-gradient-to-b from-amber-500/20 via-[#161013] to-[#0D090B] border-amber-400 ring-2 ring-amber-400/40 shadow-xl'
                  : 'bg-[#0D090B]/90 border-white/15 hover:border-amber-400/50'
              }`}
            >
              <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow">
                Acesso Absoluto
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" />
                    Plano Aura Black
                  </span>
                  {currentTier === 'black_vip' && (
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full font-semibold">
                      Ativo
                    </span>
                  )}
                </div>

                {/* Price Block: Monthly in Large Font, Annual Total in Smaller Text Below */}
                <div className="my-3 p-3 rounded-2xl bg-black/35 border border-amber-400/20">
                  {period === 'annual' && (
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[11px] text-[#FAF5F6]/45 line-through">
                        De R$ {blackMonthlyStrikethrough}/mês
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/25 text-amber-300 font-bold">
                        -40%
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-bold text-amber-300/80">R$</span>
                    <span className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight">
                      {blackMonthlyDisplay}
                    </span>
                    <span className="text-xs text-[#FAF5F6]/70 font-medium">/mês</span>
                  </div>
                  {period === 'annual' ? (
                    <p className="text-[11px] text-amber-300 font-semibold mt-1">
                      Total no plano anual: R$ {blackAnnualTotal}/ano (12x de R$ 89,90)
                    </p>
                  ) : (
                    <p className="text-[11px] text-[#FAF5F6]/55 mt-1">
                      Cobrado mensalmente (R$ 149,90/mês) • No anual sai R$ 89,90/mês
                    </p>
                  )}
                </div>

                <p className="text-xs text-[#FAF5F6]/70 mb-4">
                  Experiência de alto padrão com entrada VIP gratuita em clubes e prioridade máxima.
                </p>

                <ul className="space-y-2.5 text-xs text-[#FAF5F6]/90 border-t border-white/10 pt-3.5">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                    <span>
                      <strong>Tudo do Plano VIP</strong> + Selo Dourado Aura Black
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                    <span>
                      <strong>Entrada VIP Gratuita (Lista Black)</strong> em Encontros Reais pagos
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                    <span>
                      <strong>Lives Privadas & Pay-Per-View</strong> com destaque fixo no topo
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                    <span>
                      <strong>Acesso livre a todos os Grupos Exclusivos</strong> da plataforma
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                    <span>
                      <strong>Concierge Privado 24/7</strong> para reservas em suítes e clubes
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Discreet Billing Note */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
            <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-xs text-[#FAF5F6]/75 leading-relaxed">
              <strong>Faturamento 100% Discreto & Seguro:</strong> Na fatura do cartão ou extrato PIX, a cobrança aparece apenas como{' '}
              <span className="font-mono text-white">&quot;AP DIGITAL LIFESTYLE&quot;</span>, sem qualquer menção ao Aura Privé.
            </p>
          </div>

          {isSuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-center text-emerald-300 text-sm font-bold">
              Plano atualizado com sucesso! Aproveite sua experiência Aura Privé.
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSubscribe}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#E11D48] via-[#BE123C] to-[#9F1239] hover:brightness-110 text-white font-bold text-sm transition-all shadow-lg shadow-[#E11D48]/30 flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>
                {selectedPlan === 'free'
                  ? 'Continuar com o Plano Grátis'
                  : selectedPlan === 'vip'
                  ? period === 'annual'
                    ? `Assinar Plano VIP Anual (R$ ${vipMonthlyDisplay}/mês — Total R$ ${vipAnnualTotal}/ano)`
                    : `Assinar Plano VIP Mensal (R$ ${vipMonthlyDisplay}/mês)`
                  : period === 'annual'
                  ? `Assinar Plano Aura Black Anual (R$ ${blackMonthlyDisplay}/mês — Total R$ ${blackAnnualTotal}/ano)`
                  : `Assinar Plano Aura Black Mensal (R$ ${blackMonthlyDisplay}/mês)`}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
