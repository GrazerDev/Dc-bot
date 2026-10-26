import React from 'react';
import { 
  Terminal, 
  TicketCheck, 
  Users, 
  Activity, 
  TrendingUp, 
  Clock, 
  ArrowUpRight,
  Flame,
  Radio
} from 'lucide-react';
import { useBotData } from '../../context/BotDataContext';

export const AnalyticsView: React.FC = () => {
  const { commands, tickets, selectedGuild, analyticsFeed, hourlyActivity } = useBotData();

  const totalCommandExecutions = commands.reduce((sum, c) => sum + c.usageCount, 0);
  const activeTickets = tickets.filter(t => t.status === 'open' || t.status === 'claimed').length;
  const popularCommands = [...commands].sort((a, b) => b.usageCount - a.usageCount).slice(0, 6);

  // Calculate highest activity hour for SVG scaling
  const maxCommandsInHour = Math.max(...hourlyActivity.map(h => h.commands), 1);

  return (
    <div className="space-y-6">
      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-4 rounded-xl bg-[#13151e] border border-[#232736]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Commands Run</span>
            <Terminal className="w-4 h-4 text-[#5865F2]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              {totalCommandExecutions.toLocaleString()}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Across {commands.length} registered slash commands
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-xl bg-[#13151e] border border-[#232736]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Support Tickets</span>
            <TicketCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              {activeTickets}
            </span>
            <span className="text-[11px] text-slate-400">
              {tickets.length} total resolved
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Average response time: &lt; 4.2 mins
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-xl bg-[#13151e] border border-[#232736]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Monitored Members</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              {selectedGuild.memberCount.toLocaleString()}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">
              {selectedGuild.onlineCount.toLocaleString()} online
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Server: {selectedGuild.name}
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-xl bg-[#13151e] border border-[#232736]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Gateway Health & Shards</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              18ms
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">
              100% Operational
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Shard #0 · discord.js v14 Gateway
          </div>
        </div>
      </div>

      {/* Main Grid: 24h Activity Graph & Popular Commands */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart (2 Columns) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#13151e] border border-[#232736] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-white">24-Hour Command & Ticket Throughput</h2>
                <p className="text-xs text-slate-400 mt-0.5">Real-time hourly telemetry distribution</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#5865F2] inline-block"></span>
                  Commands
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block"></span>
                  Tickets
                </span>
              </div>
            </div>

            {/* Custom Bar Visualization */}
            <div className="h-52 flex items-end gap-3 pt-6 pb-2 border-b border-[#232736]">
              {hourlyActivity.map((point) => {
                const cmdHeightPercent = Math.max(12, Math.round((point.commands / maxCommandsInHour) * 100));
                const ticketHeightPercent = Math.max(6, Math.round((point.tickets / 25) * 60));
                return (
                  <div key={point.hour} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="w-full flex items-end justify-center gap-1.5 h-40">
                      {/* Commands Bar */}
                      <div
                        style={{ height: `${cmdHeightPercent}%` }}
                        className="w-1/2 max-w-[20px] bg-[#5865F2] hover:bg-[#6975f7] rounded-t-sm transition-all relative group/bar"
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover/bar:block bg-[#0a0b10] border border-[#2b3042] text-[10px] text-white font-mono px-1.5 py-0.5 rounded whitespace-nowrap z-10 pointer-events-none">
                          {point.commands} cmds
                        </div>
                      </div>

                      {/* Tickets Bar */}
                      <div
                        style={{ height: `${ticketHeightPercent}%` }}
                        className="w-1/3 max-w-[12px] bg-emerald-400/80 hover:bg-emerald-400 rounded-t-sm transition-all relative group/tbar"
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover/tbar:block bg-[#0a0b10] border border-[#2b3042] text-[10px] text-white font-mono px-1.5 py-0.5 rounded whitespace-nowrap z-10 pointer-events-none">
                          {point.tickets} tickets
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-200">
                      {point.hour}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Peak execution hour: 18:00 (490 commands)</span>
            <span className="text-slate-300 font-medium">Aggregated over 8 intervals</span>
          </div>
        </div>

        {/* Most Popular Commands (1 Column) */}
        <div className="p-5 rounded-xl bg-[#13151e] border border-[#232736]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              Top Slash Commands
            </h2>
            <span className="text-xs text-slate-400">By executions</span>
          </div>

          <div className="space-y-3">
            {popularCommands.map((cmd) => {
              const share = totalCommandExecutions > 0 
                ? Math.round((cmd.usageCount / totalCommandExecutions) * 100)
                : 0;
              return (
                <div key={cmd.id} className="p-2.5 rounded-lg bg-[#181a24] border border-[#262a3a]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-medium text-slate-100">
                      /{cmd.name}
                    </span>
                    <span className="text-xs font-mono tabular-nums text-slate-300">
                      {cmd.usageCount.toLocaleString()} uses
                    </span>
                  </div>
                  <div className="w-full bg-[#101218] rounded-full h-1.5 overflow-hidden">
                    <div
                      style={{ width: `${Math.max(5, share)}%` }}
                      className="bg-[#5865F2] h-full rounded-full"
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                    <span className="capitalize">{cmd.category}</span>
                    <span className="font-mono tabular-nums">{share}% of all runs</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Real-Time Live Activity Feed */}
      <div className="p-5 rounded-xl bg-[#13151e] border border-[#232736]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h2 className="text-sm font-semibold text-white">Live Real-Time Activity Log</h2>
          </div>
          <span className="text-xs text-slate-400">Streamed from Discord Gateway & API</span>
        </div>

        <div className="divide-y divide-[#202434] overflow-hidden rounded-lg border border-[#232736]">
          {analyticsFeed.slice(0, 7).map((ev) => (
            <div key={ev.id} className="p-3 bg-[#161822] hover:bg-[#1a1d2a] transition-colors flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                  ev.type === 'command'
                    ? 'bg-[#5865F2]/20 text-[#7985f5]'
                    : ev.type === 'ticket'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : ev.type === 'mod'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {ev.type}
                </span>
                <div>
                  <div className="text-xs font-medium text-slate-200">
                    <span className="font-mono text-slate-300">{ev.user}</span>
                    <span className="text-slate-400 mx-1.5">·</span>
                    <span>{ev.action}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {ev.details}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 shrink-0">
                <Clock className="w-3 h-3" />
                <span>{ev.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
