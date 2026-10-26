import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Check, 
  AlertTriangle, 
  Sliders, 
  Link2, 
  MessageSquareWarning, 
  VolumeX, 
  Sparkles 
} from 'lucide-react';
import { useBotData } from '../../context/BotDataContext';

export const AutoModView: React.FC = () => {
  const { autoMod, updateAutoMod, clearInfractions, addInfraction } = useBotData();

  const [newKeyword, setNewKeyword] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newKeyword.trim().toLowerCase();
    if (!clean || autoMod.bannedWords.includes(clean)) return;

    updateAutoMod({
      bannedWords: [...autoMod.bannedWords, clean]
    });
    setNewKeyword('');
    triggerSaveToast();
  };

  const handleRemoveKeyword = (word: string) => {
    updateAutoMod({
      bannedWords: autoMod.bannedWords.filter(w => w !== word)
    });
    triggerSaveToast();
  };

  const triggerSaveToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleTestInfraction = () => {
    addInfraction({
      userId: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
      username: 'TestViolator#0042',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
      ruleViolated: 'Banned Keyword Filter',
      actionTaken: autoMod.autoAction === 'delete' ? 'message_deleted' : 'warned',
      reason: 'Triggered blacklisted phrase in #general',
      moderator: 'Aegis AutoMod'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="p-4 rounded-xl bg-[#13151e] border border-[#232736] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Automated Protection Rules</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              AutoMod intercepts toxic messages, spam attacks, and phishing links before server members see them.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveToast && (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 animate-fade-in">
              <Check className="w-3.5 h-3.5" /> Saved!
            </span>
          )}
          <button
            onClick={handleTestInfraction}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181a24] hover:bg-[#202330] border border-[#2b3040] text-xs font-medium text-slate-300 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Violation</span>
          </button>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rule 1: Banned Words & Phishing */}
        <div className="p-5 rounded-xl bg-[#13151e] border border-[#232736] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquareWarning className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Banned Words & Phishing</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoMod.badWordsFilterEnabled}
                  onChange={(e) => {
                    updateAutoMod({ badWordsFilterEnabled: e.target.checked });
                    triggerSaveToast();
                  }}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#202434] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5865F2]"></div>
              </label>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Messages containing these exact words or substrings are immediately flagged or purged.
            </p>

            {/* Keyword chips */}
            <div className="flex flex-wrap gap-1.5 mb-3 max-h-36 overflow-y-auto">
              {autoMod.bannedWords.map((word) => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#181b26] border border-[#2b3145] text-xs font-mono text-slate-200"
                >
                  <span>{word}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(word)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Add keyword form */}
          <form onSubmit={handleAddKeyword} className="flex items-center gap-2 pt-2 border-t border-[#202434]">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Add blacklisted word..."
              className="flex-1 bg-[#181a24] border border-[#2b3040] rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5865F2]"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-medium rounded-lg flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Rule 2: Anti-Discord Invite Links */}
        <div className="p-5 rounded-xl bg-[#13151e] border border-[#232736]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-[#5865F2]" />
              <h3 className="text-sm font-semibold text-white">Block Discord Invite Links</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoMod.antiInviteEnabled}
                onChange={(e) => {
                  updateAutoMod({ antiInviteEnabled: e.target.checked });
                  triggerSaveToast();
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#202434] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5865F2]"></div>
            </label>
          </div>

          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Prevents unauthorized self-promotion by blocking <code className="font-mono text-slate-300">discord.gg/</code> and <code className="font-mono text-slate-300">discord.com/invite/</code> links from members without the Manage Messages permission.
          </p>

          <div className="p-3 rounded-lg bg-[#181a24] border border-[#272b3c] text-xs text-slate-300">
            <div className="font-medium text-white mb-1">Exemptions:</div>
            <p className="text-slate-400 text-[11px]">
              Server Administrators and designated Moderators bypass this filter automatically.
            </p>
          </div>
        </div>

        {/* Rule 3: Anti-Spam Rate Limiter */}
        <div className="p-5 rounded-xl bg-[#13151e] border border-[#232736]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Anti-Spam Rate Limiter</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoMod.antiSpamEnabled}
                onChange={(e) => {
                  updateAutoMod({ antiSpamEnabled: e.target.checked });
                  triggerSaveToast();
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#202434] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5865F2]"></div>
            </label>
          </div>

          <p className="text-xs text-slate-400 mb-3">
            Restricts fast message bursts to stop automated spam bots and raid floods.
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Max messages per 5 seconds:</span>
              <span className="font-mono font-bold text-white">{autoMod.maxMessagesPer5Seconds}</span>
            </div>
            <input
              type="range"
              min={3}
              max={15}
              value={autoMod.maxMessagesPer5Seconds}
              onChange={(e) => {
                updateAutoMod({ maxMessagesPer5Seconds: Number(e.target.value) });
                triggerSaveToast();
              }}
              className="w-full accent-[#5865F2] cursor-pointer"
            />
          </div>
        </div>

        {/* Rule 4: Action on Violation */}
        <div className="p-5 rounded-xl bg-[#13151e] border border-[#232736]">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-semibold text-white">Default Penalty Action</h3>
          </div>

          <p className="text-xs text-slate-400 mb-3">
            Specify what punishment the bot automatically enforces upon rule violation.
          </p>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'warn', label: 'Warn User' },
              { id: 'delete', label: 'Delete Message' },
              { id: 'mute', label: '10m Timeout' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  updateAutoMod({ autoAction: opt.id as any });
                  triggerSaveToast();
                }}
                className={`py-2 px-2.5 rounded-lg border text-xs font-medium text-center transition-colors cursor-pointer ${
                  autoMod.autoAction === opt.id
                    ? 'bg-[#5865F2] border-[#5865F2] text-white shadow-sm'
                    : 'bg-[#181a24] border-[#2b3040] text-slate-300 hover:bg-[#1f2230]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Infractions Audit Log */}
      <div className="rounded-xl bg-[#13151e] border border-[#232736] overflow-hidden">
        <div className="p-4 border-b border-[#232736] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Infraction Audit Log</h3>
            <p className="text-xs text-slate-400 mt-0.5">Logged actions enforced by AutoMod and staff</p>
          </div>
          {autoMod.infractions.length > 0 && (
            <button
              onClick={clearInfractions}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear History
            </button>
          )}
        </div>

        {autoMod.infractions.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">
            No infractions recorded. Your server is safe!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#101118] text-slate-400 border-b border-[#232736]">
                <tr>
                  <th className="py-3 px-4 font-medium">Time</th>
                  <th className="py-3 px-4 font-medium">User</th>
                  <th className="py-3 px-4 font-medium">Rule Violated</th>
                  <th className="py-3 px-4 font-medium">Action Taken</th>
                  <th className="py-3 px-4 font-medium">Reason Details</th>
                  <th className="py-3 px-4 font-medium text-right">Moderator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202434] text-slate-300">
                {autoMod.infractions.map((inf) => (
                  <tr key={inf.id} className="hover:bg-[#161822] transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {inf.timestamp}
                    </td>
                    <td className="py-3 px-4 font-medium text-white">
                      {inf.username}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {inf.ruleViolated}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                        inf.actionTaken === 'message_deleted'
                          ? 'bg-amber-500/20 text-amber-300'
                          : inf.actionTaken === 'warned'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        {inf.actionTaken.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 max-w-xs truncate">
                      {inf.reason}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">
                      {inf.moderator}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
