import { EyeOff, Crown, ShieldAlert, Sparkles } from 'lucide-react';
import { TabType, VipTier } from '../types';

interface HeaderProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onTriggerStealth: () => void;
  onOpenVip: () => void;
  vipTier: VipTier;
  isGhostMode: boolean;
}

export function Header({
  currentTab,
  onSelectTab,
  onTriggerStealth,
  onOpenVip,
  vipTier,
  isGhostMode,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#08090c]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 h-14 flex items-center justify-between">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('connect');
          }}
          className="text-lg font-bold tracking-tight text-white font-display hover:text-slate-200 transition-colors"
        >
          Aura Privé
        </a>
        {isGhostMode && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-300 font-mono border border-slate-700">
            Fantasma
          </span>
        )}
      </div>

      {/* Zone 2: 4-5 clean single-line nav links for desktop */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={() => onSelectTab('connect')}
          className={`hover:text-white transition-colors pb-0.5 ${
            currentTab === 'connect' ? 'text-white border-b border-rose-500 font-semibold' : ''
          }`}
        >
          Conectar & Hobbies
        </button>
        <button
          onClick={() => onSelectTab('moments')}
          className={`hover:text-white transition-colors pb-0.5 ${
            currentTab === 'moments' ? 'text-white border-b border-rose-500 font-semibold' : ''
          }`}
        >
          Momentos Liberais
        </button>
        <button
          onClick={() => onSelectTab('venues')}
          className={`hover:text-white transition-colors pb-0.5 ${
            currentTab === 'venues' ? 'text-white border-b border-rose-500 font-semibold' : ''
          }`}
        >
          Encontros Reais
        </button>
        <button
          onClick={() => onSelectTab('chat')}
          className={`hover:text-white transition-colors pb-0.5 ${
            currentTab === 'chat' ? 'text-white border-b border-rose-500 font-semibold' : ''
          }`}
        >
          Mensagens E2EE
        </button>
        <button
          onClick={() => onSelectTab('profile')}
          className={`hover:text-white transition-colors pb-0.5 ${
            currentTab === 'profile' ? 'text-white border-b border-rose-500 font-semibold' : ''
          }`}
        >
          Meu Perfil & Configurações
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-2">
        {/* VIP Status or Upgrade button */}
        <button
          type="button"
          onClick={onOpenVip}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            vipTier === 'diamond_club'
              ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
              : vipTier === 'black_vip'
              ? 'bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm shadow-amber-500/20'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {vipTier === 'diamond_club' ? 'Diamond VIP' : vipTier === 'black_vip' ? 'Black VIP' : 'Obter VIP'}
          </span>
          <span className="sm:hidden">VIP</span>
        </button>

        {/* Camouflage / Panic Button */}
        <button
          type="button"
          onClick={onTriggerStealth}
          className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium"
          title="Modo Camuflagem Instantâneo (Ocultar app se alguém se aproximar)"
        >
          <EyeOff className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Camuflagem</span>
        </button>
      </div>
    </header>
  );
}
