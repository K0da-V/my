import { Flame, Sparkles, MapPin, MessageSquare, User as UserIcon } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  unreadChatCount?: number;
}

export function BottomNav({ currentTab, onSelectTab, unreadChatCount = 0 }: BottomNavProps) {
  const tabs = [
    { id: 'connect' as TabType, label: 'Conectar', icon: Flame },
    { id: 'moments' as TabType, label: 'Momentos', icon: Sparkles },
    { id: 'venues' as TabType, label: 'Encontros', icon: MapPin },
    { id: 'chat' as TabType, label: 'Mensagens', icon: MessageSquare, badge: unreadChatCount },
    { id: 'profile' as TabType, label: 'Meu Perfil', icon: UserIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0e15]/95 backdrop-blur-md border-t border-slate-800/80 md:hidden">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className="flex flex-col items-center justify-center min-h-[44px] relative py-1 focus:outline-none"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive
                      ? 'text-rose-400 scale-110'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-rose-400 font-semibold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-rose-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
