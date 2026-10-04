import { EyeOff, Crown, LogOut } from 'lucide-react';
import { TabType, VipTier } from '../types';
import { AuraPriveLogo } from './AuraPriveLogo';

interface HeaderProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onTriggerStealth: () => void;
  onOpenVip: () => void;
  onLogout?: () => void;
  vipTier: VipTier;
  isGhostMode: boolean;
}

export function Header({
  currentTab,
  onSelectTab,
  onTriggerStealth,
  onOpenVip,
  onLogout,
  vipTier,
  isGhostMode,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#0D090B]/90 backdrop-blur-xl border-b border-white/[0.07] px-4 sm:px-8 h-16 flex items-center justify-between">
      {/* Zone 1: Bespoke Brand Wordmark */}
      <div className="flex items-center gap-2.5">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('connect');
          }}
          className="flex items-center gap-2"
        >
          <AuraPriveLogo size="sm" />
        </a>
        {isGhostMode && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-white/[0.06] text-[#FAF5F6]/80 border border-white/10">
            Invisível
          </span>
        )}
      </div>

      {/* Zone 2: Clean Human Navigation Links */}
      <nav className="hidden md:flex items-center gap-1 bg-[#171014] p-1 rounded-2xl border border-white/[0.06]">
        {[
          { id: 'connect' as TabType, label: 'Descobrir' },
          { id: 'moments' as TabType, label: 'Momentos Liberais' },
          { id: 'venues' as TabType, label: 'Encontros Reais' },
          { id: 'chat' as TabType, label: 'Mensagens' },
          { id: 'profile' as TabType, label: 'Perfil' },
        ].map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white font-semibold shadow-sm shadow-[#E11D48]/30'
                  : 'text-[#FAF5F6]/65 hover:text-[#FAF5F6] hover:bg-white/[0.04]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenVip}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            vipTier === 'black_vip' || vipTier === 'diamond_club'
              ? 'bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-400/40 text-amber-200 hover:border-amber-400/70'
              : vipTier === 'vip'
              ? 'bg-[#1D1318] border border-[#E11D48]/60 text-[#FAF5F6] hover:bg-[#E11D48]/20'
              : 'bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:brightness-110 text-white shadow-sm shadow-[#E11D48]/25'
          }`}
        >
          <Crown className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">
            {vipTier === 'black_vip' || vipTier === 'diamond_club'
              ? 'Membro Black'
              : vipTier === 'vip'
              ? 'Membro VIP'
              : 'Seja VIP'}
          </span>
          <span className="sm:hidden">
            {vipTier === 'free' ? 'VIP' : 'VIP'}
          </span>
        </button>

        <button
          type="button"
          onClick={onTriggerStealth}
          className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#FAF5F6]/85 border border-white/[0.08] transition-colors flex items-center gap-1.5 text-xs font-medium"
          title="Disfarçar tela rapidamente"
        >
          <EyeOff className="w-3.5 h-3.5 text-[#FAF5F6]/70" />
          <span className="hidden sm:inline">Disfarçar</span>
        </button>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] text-[#FAF5F6]/60 hover:text-[#FAF5F6] border border-white/[0.07] transition-colors"
            title="Sair da conta"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
}
