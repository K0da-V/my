import { EyeOff, Crown, LogOut, Coins, Plus, Sliders } from 'lucide-react';
import { TabType, VipTier, SiteAdminConfig } from '../types';
import { AuraPriveLogo } from './AuraPriveLogo';

interface HeaderProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onTriggerStealth: () => void;
  onOpenVip: () => void;
  onOpenCoins?: () => void;
  coinsBalance?: number;
  onLogout?: () => void;
  vipTier: VipTier;
  isGhostMode: boolean;
  showAdminTab?: boolean;
  adminConfig?: SiteAdminConfig;
}

export function Header({
  currentTab,
  onSelectTab,
  onTriggerStealth,
  onOpenVip,
  onOpenCoins,
  coinsBalance = 0,
  onLogout,
  vipTier,
  isGhostMode,
  showAdminTab = false,
  adminConfig
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#0D090B]/95 backdrop-blur-xl border-b border-white/[0.07] px-3.5 sm:px-8 h-16 flex items-center justify-between gap-2">
      {/* Zone 1: Classic Brand Wordmark with Flame Accent */}
      <div className="flex items-center gap-2.5 shrink-0">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('connect');
          }}
          className="flex items-center gap-2 py-1"
        >
          <AuraPriveLogo
            size="sm"
            firstName={adminConfig?.brandFirstName}
            secondName={adminConfig?.brandSecondName}
            subtitleText={adminConfig?.brandSubtitle}
            showFlameOnE={adminConfig?.showFlameAccentOnE ?? true}
          />
        </a>
        {isGhostMode && (
          <span className="hidden lg:inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-white/[0.06] text-[#FAF5F6]/80 border border-white/10">
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
          { id: 'profile' as TabType, label: 'Perfil' }
        ].map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#E11D48] text-white font-semibold shadow-sm'
                  : 'text-[#FAF5F6]/65 hover:text-[#FAF5F6] hover:bg-white/[0.04]'
              }`}
            >
              {item.label}
            </button>
          );
        })}

        {/* EXCLUSIVE OWNER TAB: PAINEL ADM (Hidden for normal visitors) */}
        {showAdminTab && (
          <button
            type="button"
            onClick={() => onSelectTab('admin')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black tracking-wide transition-all flex items-center gap-1.5 ${
              currentTab === 'admin'
                ? 'bg-gradient-to-r from-amber-500 to-[#E11D48] text-white shadow-md'
                : 'bg-amber-500/15 text-amber-300 border border-amber-400/35 hover:bg-amber-500/25'
            }`}
            title="Exclusivo do Proprietário — Invisível para usuários normais"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>PAINEL ADM</span>
          </button>
        )}
      </nav>

      {/* Zone 3: Coins Wallet + Mobile PAINEL ADM + VIP + Stealth + Logout */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {showAdminTab && (
          <button
            type="button"
            onClick={() => onSelectTab('admin')}
            className={`md:hidden px-2.5 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1 border ${
              currentTab === 'admin'
                ? 'bg-amber-500 text-black border-amber-300'
                : 'bg-amber-500/15 text-amber-300 border-amber-400/40'
            }`}
            title="PAINEL ADM (Exclusivo Proprietário)"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>ADM</span>
          </button>
        )}

        {onOpenCoins && (
          <button
            type="button"
            onClick={onOpenCoins}
            title="Comprar Moedas Aura para desbloquear mídias +18 e enviar presentes"
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-200 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Coins className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="font-mono">{coinsBalance}</span>
            <span className="hidden sm:inline text-[11px] text-amber-100/80">Moedas</span>
            <span className="w-4 h-4 rounded-full bg-amber-400 text-[#0F0E11] flex items-center justify-center">
              <Plus className="w-3 h-3 stroke-[2.5]" />
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={onOpenVip}
          className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            vipTier === 'black_vip' || vipTier === 'diamond_club'
              ? 'bg-amber-500/20 border border-amber-400/40 text-amber-200'
              : vipTier === 'vip'
              ? 'bg-[#1D1318] border border-[#E11D48]/60 text-[#FAF5F6]'
              : 'bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-sm'
          }`}
        >
          <Crown className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="hidden sm:inline">
            {vipTier === 'black_vip' || vipTier === 'diamond_club'
              ? 'Black'
              : vipTier === 'vip'
              ? 'VIP'
              : 'Seja VIP'}
          </span>
          <span className="sm:hidden">VIP</span>
        </button>

        <button
          type="button"
          onClick={onTriggerStealth}
          className="px-2.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#FAF5F6]/85 border border-white/[0.08] transition-colors flex items-center gap-1.5 text-xs font-medium"
          title="Disfarçar tela rapidamente"
        >
          <EyeOff className="w-3.5 h-3.5 text-[#FAF5F6]/70" />
          <span className="hidden lg:inline">Disfarçar</span>
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
