import { Flame, Sparkles, MapPin, MessageCircle, User as UserIcon } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  unreadChatCount?: number;
}

export function BottomNav({ currentTab, onSelectTab, unreadChatCount = 0 }: BottomNavProps) {
  const tabs = [
    { id: 'connect' as TabType, label: 'Descobrir', icon: Flame },
    { id: 'moments' as TabType, label: 'Momentos', icon: Sparkles },
    { id: 'venues' as TabType, label: 'Encontros', icon: MapPin },
    { id: 'chat' as TabType, label: 'Mensagens', icon: MessageCircle, badge: unreadChatCount },
    { id: 'profile' as TabType, label: 'Perfil', icon: UserIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0D090B]/95 backdrop-blur-xl border-t border-white/[0.08] md:hidden">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className="flex flex-col items-center justify-center min-h-[46px] relative py-1 focus:outline-none"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-all duration-200 ${
                    isActive
                      ? 'text-[#FB7185] scale-110'
                      : 'text-[#FAF5F6]/50 hover:text-[#FAF5F6]'
                  }`}
                />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2.5 bg-gradient-to-r from-[#E11D48] to-[#FB7185] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center shadow-sm">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-[#FB7185] font-semibold' : 'text-[#FAF5F6]/60'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1 rounded-full bg-gradient-to-r from-[#E11D48] to-[#FB7185] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
