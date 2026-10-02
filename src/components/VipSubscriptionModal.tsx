import { useState } from 'react';
import { Crown, Check, X, Shield, Sparkles, Lock, Eye, Video, Zap } from 'lucide-react';
import { VipTier } from '../types';

interface VipSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: VipTier;
  onUpgrade: (tier: VipTier) => void;
}

export function VipSubscriptionModal({ isOpen, onClose, currentTier, onUpgrade }: VipSubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'black_vip' | 'diamond_club'>('diamond_club');
  const [period, setPeriod] = useState<'monthly' | 'annual'>('annual');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onUpgrade(selectedPlan);
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0f121a] border border-amber-500/30 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Subtle Luxury Glow */}
        <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 w-80 h-36 bg-amber-500/15 blur-3xl pointer-events-none rounded-full" />

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-display">Aura Privé VIP Club</h3>
              <p className="text-[11px] text-amber-400/90 font-medium">Monetização e Recursos Exclusivos de Alta Discrição</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Billing Switch */}
          <div className="flex justify-center">
            <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center text-xs">
              <button
                type="button"
                onClick={() => setPeriod('monthly')}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  period === 'monthly' ? 'bg-slate-800 text-white font-medium shadow-sm' : 'text-slate-400'
                }`}
              >
                Mensal
              </button>
              <button
                type="button"
                onClick={() => setPeriod('annual')}
                className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  period === 'annual' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400'
                }`}
              >
                <span>Anual</span>
                <span className="text-[10px] bg-slate-950/20 px-1 rounded">-40% OFF</span>
              </button>
            </div>
          </div>

          {/* Tier Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Black VIP */}
            <div
              onClick={() => setSelectedPlan('black_vip')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedPlan === 'black_vip'
                  ? 'bg-slate-900/90 border-slate-400 ring-2 ring-slate-400/30'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Black VIP</span>
                <Shield className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-bold font-display text-white mb-1">
                {period === 'annual' ? 'R$ 49' : 'R$ 79'}
                <span className="text-xs font-normal text-slate-400">/mês</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-4">Ideal para quem busca privacidade ativa e radar ampliado.</p>
              <ul className="space-y-2 text-[11px] text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Ver quem curtiu seu perfil</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Modo Fantasma (invisível no radar)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>5 chamadas de vídeo E2EE por dia</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Selo Black no perfil</span>
                </li>
              </ul>
            </div>

            {/* Diamond Club */}
            <div
              onClick={() => setSelectedPlan('diamond_club')}
              className={`p-4 rounded-2xl border cursor-pointer relative overflow-hidden transition-all ${
                selectedPlan === 'diamond_club'
                  ? 'bg-gradient-to-b from-amber-500/15 to-slate-900/90 border-amber-500 ring-2 ring-amber-500/40'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="absolute top-2 right-2 bg-amber-500 text-slate-950 font-bold text-[9px] uppercase px-2 py-0.5 rounded-full">
                Mais Exclusivo
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Diamond Club</span>
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-display text-white mb-1">
                {period === 'annual' ? 'R$ 89' : 'R$ 139'}
                <span className="text-xs font-normal text-slate-400">/mês</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-4">Acesso irrestrito a todos os recursos liberais e VIPs.</p>
              <ul className="space-y-2 text-[11px] text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Todos os recursos do Black VIP</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Chamadas E2EE ilimitadas com modulação</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Momentos Liberais Secretos irrestritos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Filtros avançados de fetiches & limites BDSM</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Acesso a eventos em Clubes Homologados</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Privacy Guarantee Note */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-center gap-3 text-xs text-slate-400">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Cobrança 100% discreta no cartão de crédito: constará apenas como &quot;AP-SERV-DIGITAL&quot;. Cancelamento em 1 clique.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0c0e14] shrink-0 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            <span>Status Atual: </span>
            <strong className="text-slate-200 capitalize">
              {currentTier === 'free' ? 'Gratuito' : currentTier === 'black_vip' ? 'Black VIP' : 'Diamond Club'}
            </strong>
          </div>
          <button
            type="button"
            onClick={handleSubscribe}
            disabled={isSuccess}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/25 active:scale-95 flex items-center gap-2"
          >
            {isSuccess ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Ativando Assinatura...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Assinar {selectedPlan === 'black_vip' ? 'Black VIP' : 'Diamond Club'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
