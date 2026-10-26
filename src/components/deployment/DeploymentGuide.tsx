import React, { useState } from 'react';
import { 
  CloudUpload, 
  Download, 
  ExternalLink, 
  Check, 
  Copy, 
  FileCode, 
  Folder, 
  Server, 
  ShieldCheck, 
  Key, 
  Terminal, 
  CheckCircle2, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import { useBotData } from '../../context/BotDataContext';
import { generateExportFiles, downloadBotZip, ExportFile } from '../../utils/botExportGenerator';

export const DeploymentGuide: React.FC = () => {
  const { botConfig, updateBotConfig, commands } = useBotData();

  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const exportFiles = generateExportFiles(botConfig, commands);
  const [selectedFile, setSelectedFile] = useState<ExportFile>(exportFiles[0]);

  const handleCopyCode = (content: string, filename: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      await downloadBotZip(botConfig, commands);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const botInviteUrl = botConfig.clientId 
    ? `https://discord.com/oauth2/authorize?client_id=${botConfig.clientId}&permissions=8&scope=bot%20applications.commands`
    : `https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands`;

  return (
    <div className="space-y-6">
      {/* Hero Banner: Download & Overview */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-[#171926] to-[#12141e] border border-[#232736] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#5865F2]/20 text-[#838ef8] text-[11px] font-mono px-2 py-0.5 rounded font-semibold border border-[#5865F2]/30">
              discord.js v14 Ready
            </span>
            <span className="text-xs text-slate-400">· Ready for GitHub & Render</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            Export to GitHub & Deploy to Render in 3 Minutes
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Everything your bot needs is generated: Discord gateway client, slash command deployer, ticket handlers, AutoMod filters, and zero-setup SQLite/PostgreSQL database adapter.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isDownloading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-semibold shadow-lg shadow-[#5865F2]/25 transition-all cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-60"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Building ZIP...</span>
            </>
          ) : downloadSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Downloaded ZIP!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Complete Repo (.ZIP)</span>
            </>
          )}
        </button>
      </div>

      {/* Step-by-Step Visual Walkthrough */}
      <div className="rounded-xl bg-[#13151e] border border-[#232736] p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#5865F2]" />
          What You Need To Do: 5 Simple Steps
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Step 1 */}
          <div className="p-3.5 rounded-lg bg-[#181a24] border border-[#262a3a] flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 rounded-full bg-[#5865F2] text-white font-bold text-xs flex items-center justify-center mb-2">
                1
              </div>
              <h4 className="text-xs font-bold text-white mb-1">Create App in Discord</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Go to Discord Dev Portal, click <strong>New Application</strong> and name your bot.
              </p>
            </div>
            <a
              href="https://discord.com/developers/applications"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-[11px] text-[#5865F2] hover:underline flex items-center gap-1 font-medium"
            >
              <span>Open Dev Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-lg bg-[#181a24] border border-[#262a3a] flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 rounded-full bg-[#5865F2] text-white font-bold text-xs flex items-center justify-center mb-2">
                2
              </div>
              <h4 className="text-xs font-bold text-white mb-1">Enable 3 Intents</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                In the <strong>Bot</strong> tab, turn on <strong>Presence</strong>, <strong>Server Members</strong>, and <strong>Message Content</strong>.
              </p>
            </div>
            <span className="mt-3 text-[10px] font-mono text-emerald-400">
              ✓ Required for AutoMod
            </span>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-lg bg-[#181a24] border border-[#262a3a] flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 rounded-full bg-[#5865F2] text-white font-bold text-xs flex items-center justify-center mb-2">
                3
              </div>
              <h4 className="text-xs font-bold text-white mb-1">Invite Bot to Server</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Use the one-click invitation link below to authorize the bot and slash commands.
              </p>
            </div>
            <a
              href={botInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>Invite to Server</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Step 4 */}
          <div className="p-3.5 rounded-lg bg-[#181a24] border border-[#262a3a] flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 rounded-full bg-[#5865F2] text-white font-bold text-xs flex items-center justify-center mb-2">
                4
              </div>
              <h4 className="text-xs font-bold text-white mb-1">Push to GitHub</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Unzip the package, create a repository on GitHub, and push with git commands.
              </p>
            </div>
            <span className="mt-3 text-[10px] font-mono text-slate-400">
              git push -u origin main
            </span>
          </div>

          {/* Step 5 */}
          <div className="p-3.5 rounded-lg bg-[#181a24] border border-[#262a3a] flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 rounded-full bg-[#5865F2] text-white font-bold text-xs flex items-center justify-center mb-2">
                5
              </div>
              <h4 className="text-xs font-bold text-white mb-1">Launch on Render</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                New Web Service on Render, connect your GitHub repo, add your Bot Token, and hit Deploy!
              </p>
            </div>
            <a
              href="https://dashboard.render.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-[11px] text-[#5865F2] hover:underline flex items-center gap-1 font-medium"
            >
              <span>Open Render</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Bot Credentials & Environment Variable Configurator */}
      <div className="p-5 rounded-xl bg-[#13151e] border border-[#232736]">
        <div className="flex items-center gap-2 mb-3">
          <Key className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Bot Credentials (Optional pre-fill)</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Enter your Discord credentials here to pre-populate your downloaded <code className="font-mono text-slate-300">.env</code> file and invitation links.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              DISCORD_TOKEN
            </label>
            <input
              type="password"
              value={botConfig.botToken}
              onChange={(e) => updateBotConfig({ botToken: e.target.value })}
              placeholder="Paste token from Discord Portal"
              className="w-full bg-[#181a24] border border-[#2b3040] rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#5865F2]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              CLIENT_ID (Application ID)
            </label>
            <input
              type="text"
              value={botConfig.clientId}
              onChange={(e) => updateBotConfig({ clientId: e.target.value })}
              placeholder="e.g. 128904712839210293"
              className="w-full bg-[#181a24] border border-[#2b3040] rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#5865F2]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              DATABASE_URL (SQLite or PostgreSQL)
            </label>
            <input
              type="text"
              value={botConfig.databaseUrl}
              onChange={(e) => updateBotConfig({ databaseUrl: e.target.value })}
              placeholder="file:./dev.db or postgres://..."
              className="w-full bg-[#181a24] border border-[#2b3040] rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#5865F2]"
            />
          </div>
        </div>
      </div>

      {/* Interactive Code File Explorer */}
      <div className="rounded-xl bg-[#13151e] border border-[#232736] overflow-hidden">
        <div className="p-4 border-b border-[#232736] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#5865F2]" />
            <h3 className="text-sm font-semibold text-white">Repository File Explorer</h3>
          </div>
          <span className="text-xs text-slate-400">
            {exportFiles.length} files generated and ready to run
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 min-h-[420px]">
          {/* File Tree Sidebar */}
          <div className="border-r border-[#232736] bg-[#10121a] p-3 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider">
              Files ({exportFiles.length})
            </div>
            {exportFiles.map((f) => {
              const isSelected = selectedFile.path === f.path;
              return (
                <button
                  key={f.path}
                  onClick={() => setSelectedFile(f)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-xs font-mono transition-colors text-left truncate ${
                    isSelected
                      ? 'bg-[#5865F2] text-white font-semibold'
                      : 'text-slate-300 hover:bg-[#1a1d28] hover:text-white'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{f.path}</span>
                </button>
              );
            })}
          </div>

          {/* File Content Preview */}
          <div className="md:col-span-3 flex flex-col bg-[#0b0c10]">
            <div className="px-4 py-2.5 bg-[#141620] border-b border-[#232736] flex items-center justify-between">
              <span className="font-mono text-xs text-slate-200 font-semibold">
                {selectedFile.path}
              </span>
              <button
                onClick={() => handleCopyCode(selectedFile.content, selectedFile.path)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1f2332] hover:bg-[#282d40] text-slate-300 text-xs font-mono transition-colors cursor-pointer"
              >
                {copiedFile === selectedFile.path ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto overflow-y-auto max-h-[480px] leading-relaxed select-text">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
