import React, { useState } from 'react';
import { Download, PlayCircle, Check, Loader2 } from 'lucide-react';
import { ActiveTab } from './Sidebar';
import { useBotData } from '../../context/BotDataContext';
import { downloadBotZip } from '../../utils/botExportGenerator';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const tabTitles: Record<ActiveTab, { title: string; subtitle: string }> = {
  analytics: { title: 'Telemetry & Real-Time Analytics', subtitle: 'Live activity logs, command performance, and server metrics' },
  commands: { title: 'Slash Command Registry & Custom Builder', subtitle: 'Manage built-in slash commands and design custom embeds' },
  tickets: { title: 'Support Ticket Center', subtitle: 'Manage private user support threads, staff assignments, and transcripts' },
  automod: { title: 'Auto-Moderation Engine', subtitle: 'Anti-spam filters, blacklisted words, and infraction audit log' },
  economy: { title: 'Economy & Leveling System', subtitle: 'Member XP progression, currency balances, and rewards store' },
  simulator: { title: 'Interactive Discord Sandbox', subtitle: 'Test slash commands, embeds, and ticket interactions in real-time' },
  deploy: { title: 'GitHub & Render Deployment Hub', subtitle: 'Ready-to-deploy discord.js v14 repository and step-by-step launch guide' }
};

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { botConfig, commands, selectedGuild } = useBotData();
  const [isExporting, setIsExporting] = useState(false);
  const [exportedSuccess, setExportedSuccess] = useState(false);

  const handleQuickExport = async () => {
    try {
      setIsExporting(true);
      await downloadBotZip(botConfig, commands);
      setExportedSuccess(true);
      setTimeout(() => setExportedSuccess(false), 3000);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const currentInfo = tabTitles[activeTab];

  return (
    <header className="h-16 px-6 bg-[#0f1117] border-b border-[#20242f] flex items-center justify-between shrink-0">
      {/* Zone 1: Breadcrumb & Title */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Aegis Suite</span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-200 font-medium">{selectedGuild.name}</span>
          </div>
          <h1 className="text-sm font-semibold text-white tracking-tight leading-snug">
            {currentInfo.title}
          </h1>
        </div>
      </div>

      {/* Zone 2 & 3: Actions & Quick Links */}
      <div className="flex items-center gap-3">
        {activeTab !== 'simulator' && (
          <button
            onClick={() => setActiveTab('simulator')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1d27] hover:bg-[#232838] border border-[#2d3448] text-xs font-medium text-slate-200 transition-colors whitespace-nowrap shrink-0"
          >
            <PlayCircle className="w-3.5 h-3.5 text-[#5865F2]" />
            <span>Open Simulator</span>
          </button>
        )}

        <button
          onClick={handleQuickExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-medium shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Packaging .ZIP...</span>
            </>
          ) : exportedSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>Downloaded!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Export Bot Repo (.ZIP)</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
