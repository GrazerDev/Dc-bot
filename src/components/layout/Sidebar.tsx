import React from 'react';
import { 
  BarChart3, 
  Terminal, 
  TicketCheck, 
  ShieldAlert, 
  Coins, 
  MessageSquare, 
  CloudUpload, 
  ChevronRight,
  Server,
  Zap
} from 'lucide-react';
import { useBotData } from '../../context/BotDataContext';

export type ActiveTab = 'analytics' | 'commands' | 'tickets' | 'automod' | 'economy' | 'simulator' | 'deploy';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { selectedGuild, guilds, setSelectedGuild, tickets, commands } = useBotData();

  const openTicketsCount = tickets.filter(t => t.status === 'open').length;
  const activeCommandsCount = commands.filter(c => c.enabled).length;

  const navItems = [
    {
      id: 'analytics' as ActiveTab,
      label: 'Real-Time Analytics',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'commands' as ActiveTab,
      label: 'Commands & Slash Registry',
      icon: Terminal,
      badge: `${activeCommandsCount} active`
    },
    {
      id: 'tickets' as ActiveTab,
      label: 'Ticket Center',
      icon: TicketCheck,
      badge: openTicketsCount > 0 ? `${openTicketsCount} open` : null
    },
    {
      id: 'automod' as ActiveTab,
      label: 'AutoMod & Infractions',
      icon: ShieldAlert,
      badge: null
    },
    {
      id: 'economy' as ActiveTab,
      label: 'Economy & Leveling',
      icon: Coins,
      badge: null
    },
    {
      id: 'simulator' as ActiveTab,
      label: 'Live Discord Simulator',
      icon: MessageSquare,
      badge: 'Interactive'
    },
    {
      id: 'deploy' as ActiveTab,
      label: 'GitHub & Render Deploy',
      icon: CloudUpload,
      badge: 'Export'
    }
  ];

  return (
    <aside className="w-64 bg-[#101218] border-r border-[#20242f] flex flex-col shrink-0 min-h-screen">
      {/* Brand & Wordmark */}
      <div className="h-16 px-5 border-b border-[#20242f] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#5865F2] flex items-center justify-center text-white font-bold shadow-md shadow-[#5865F2]/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-100 text-base tracking-tight leading-none block">
              Aegis Discord
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block font-medium">
              Bot Control Suite
            </span>
          </div>
        </div>
      </div>

      {/* Guild Switcher */}
      <div className="p-3 border-b border-[#20242f]">
        <label className="text-[10px] uppercase font-semibold text-slate-400 px-2 mb-1.5 block tracking-wider">
          Managed Discord Server
        </label>
        <div className="relative">
          <select
            value={selectedGuild.id}
            onChange={(e) => {
              const g = guilds.find(item => item.id === e.target.value);
              if (g) setSelectedGuild(g);
            }}
            className="w-full bg-[#171923] border border-[#2b3040] hover:border-[#3d445c] rounded-lg px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#5865F2] cursor-pointer appearance-none transition-colors"
          >
            {guilds.map(g => (
              <option key={g.id} value={g.id} className="bg-[#171923] text-slate-200">
                {g.name} ({g.memberCount.toLocaleString()} members)
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-2.5 pointer-events-none text-slate-400">
            <ChevronRight className="w-4 h-4 rotate-90" />
          </div>
        </div>
        
        <div className="mt-2 px-2 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            Bot Active
          </span>
          <span className="font-mono tabular-nums text-slate-300">
            {selectedGuild.memberCount.toLocaleString()} members
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 flex-1 space-y-1">
        <div className="text-[10px] uppercase font-semibold text-slate-400 px-2 py-1 tracking-wider">
          Management & Telemetry
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#5865F2] text-white shadow-sm'
                  : 'text-slate-300 hover:bg-[#1a1d27] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isActive 
                    ? 'bg-black/20 text-white' 
                    : item.id === 'simulator' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-[#202534] text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Status Footer */}
      <div className="p-3 border-t border-[#20242f] bg-[#0c0e13]">
        <div className="p-2.5 rounded-lg bg-[#151821] border border-[#222735] text-[11px]">
          <div className="flex items-center justify-between text-slate-300 font-medium mb-1">
            <span className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-[#5865F2]" />
              Gateway Engine
            </span>
            <span className="text-emerald-400 font-mono text-[10px]">18ms latency</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Ready for Render & GitHub deployment with SQLite/Postgres.
          </p>
        </div>
      </div>
    </aside>
  );
};
