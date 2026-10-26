import React, { useState, useRef, useEffect } from 'react';
import { 
  Hash, 
  Send, 
  Trash2, 
  Sparkles, 
  Terminal, 
  ExternalLink, 
  CheckCircle2, 
  ChevronRight,
  HelpCircle,
  X
} from 'lucide-react';
import { useBotData } from '../../context/BotDataContext';
import { BotCommand, Ticket } from '../../types';

interface DiscordSimulatorProps {
  initialCommandToRun?: string | null;
}

export const DiscordSimulator: React.FC<DiscordSimulatorProps> = ({ initialCommandToRun }) => {
  const { 
    simulatorMessages, 
    executeSimulatorCommand, 
    clearSimulatorChat, 
    commands, 
    selectedGuild,
    createTicket 
  } = useBotData();

  const [inputMessage, setInputMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState('bot-commands');
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSubject, setModalSubject] = useState('');
  const [modalCategory, setModalCategory] = useState<Ticket['category']>('general');
  const [modalDescription, setModalDescription] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [simulatorMessages]);

  useEffect(() => {
    if (initialCommandToRun) {
      executeSimulatorCommand(`/${initialCommandToRun}`);
    }
  }, [initialCommandToRun]);

  const channels = [
    { id: 'welcome', name: 'welcome-and-rules' },
    { id: 'general', name: 'general-chat' },
    { id: 'bot-commands', name: 'bot-commands' },
    { id: 'tickets', name: 'support-tickets' },
    { id: 'staff-logs', name: 'moderation-logs' }
  ];

  const handleInputChange = (val: string) => {
    setInputMessage(val);
    if (val.startsWith('/') && !val.includes(' ')) {
      setIsAutocompleteOpen(true);
    } else {
      setIsAutocompleteOpen(false);
    }
  };

  const handleSelectAutocomplete = (cmd: BotCommand) => {
    setInputMessage(`/${cmd.name} `);
    setIsAutocompleteOpen(false);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    executeSimulatorCommand(inputMessage.trim());
    setInputMessage('');
    setIsAutocompleteOpen(false);
  };

  const handleButtonClick = (action?: string) => {
    if (action === 'ticket_create') {
      setModalOpen(true);
    } else if (action === 'balance') {
      executeSimulatorCommand('/balance');
    } else {
      executeSimulatorCommand('/help');
    }
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalSubject.trim()) return;

    createTicket(modalSubject.trim(), modalCategory, modalDescription.trim() || modalSubject);
    setModalOpen(false);
    setModalSubject('');
    setModalDescription('');

    executeSimulatorCommand(`/ticket created "${modalSubject}"`);
  };

  const quickCommands = ['/help', '/ticket', '/rank', '/balance', '/daily', '/rules', '/socials'];

  return (
    <div className="rounded-xl bg-[#1e1f22] border border-[#313338] shadow-2xl flex flex-col h-[750px] overflow-hidden text-slate-200">
      {/* Discord Top Bar */}
      <div className="h-12 px-4 bg-[#2b2d31] border-b border-[#1f2023] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-slate-400" />
          <span className="font-bold text-white text-sm">{activeChannel}</span>
          <span className="text-slate-400 text-xs hidden sm:inline">|</span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Interactive Test Sandbox · Real-Time Gateway Simulator
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearSimulatorChat}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1e1f22] hover:bg-[#35373c] text-slate-300 hover:text-rose-400 text-xs transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Main Body: Channel List & Chat View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Mini Channel List */}
        <div className="w-48 bg-[#2b2d31] border-r border-[#1f2023] p-2 flex flex-col shrink-0 hidden md:flex">
          <div className="text-[11px] font-bold uppercase text-slate-400 px-2 py-1.5 tracking-wider">
            Text Channels
          </div>
          <div className="space-y-0.5">
            {channels.map(ch => (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.name)}
                className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                  activeChannel === ch.name
                    ? 'bg-[#35373c] text-white'
                    : 'text-slate-400 hover:bg-[#35373c]/50 hover:text-slate-200'
                }`}
              >
                <Hash className="w-4 h-4 text-slate-400" />
                <span className="truncate">{ch.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-auto p-2 bg-[#232428] rounded text-[11px] text-slate-400">
            <span className="text-emerald-400 font-semibold block mb-0.5">● Connected</span>
            Simulating {selectedGuild.name}
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 flex flex-col bg-[#313338] overflow-hidden relative">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {simulatorMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isBot = msg.isBot || msg.sender === 'bot';

              return (
                <div key={msg.id} className="flex items-start gap-3 group hover:bg-[#2e3035] -mx-4 px-4 py-1 transition-colors">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 text-white ${
                    isBot ? 'bg-[#5865F2]' : 'bg-[#23a55a]'
                  }`}>
                    {isBot ? 'BOT' : 'YOU'}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`font-semibold text-sm ${isBot ? 'text-[#5865F2]' : 'text-white'}`}>
                        {msg.authorName}
                      </span>
                      {isBot && (
                        <span className="bg-[#5865F2] text-white text-[9px] font-bold px-1 py-0.2 rounded">
                          BOT
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>

                    {/* Text content */}
                    {msg.content && (
                      <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </p>
                    )}

                    {/* Rich Discord Embed */}
                    {msg.embed && (
                      <div
                        style={{ borderLeftColor: msg.embed.color || '#5865F2' }}
                        className="mt-2 rounded-lg bg-[#2b2d31] border-l-4 p-3.5 max-w-lg shadow-md"
                      >
                        {msg.embed.title && (
                          <h4 className="font-bold text-sm text-white mb-1.5">
                            {msg.embed.title}
                          </h4>
                        )}
                        {msg.embed.description && (
                          <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed mb-3">
                            {msg.embed.description}
                          </p>
                        )}

                        {/* Embed Fields */}
                        {msg.embed.fields && msg.embed.fields.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 my-2 text-xs">
                            {msg.embed.fields.map((f, i) => (
                              <div key={i} className={f.inline ? 'col-span-1' : 'col-span-2'}>
                                <div className="font-semibold text-slate-200 text-xs mb-0.5">{f.name}</div>
                                <div className="text-slate-300 text-xs whitespace-pre-wrap">{f.value}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Embed Footer */}
                        {msg.embed.footerText && (
                          <div className="mt-3 pt-2 border-t border-[#383a40] flex items-center justify-between text-[10px] text-slate-400">
                            <span>{msg.embed.footerText}</span>
                            <span>{msg.timestamp}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Interactive Action Buttons */}
                    {msg.buttons && msg.buttons.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.buttons.map((btn) => (
                          <button
                            key={btn.id}
                            onClick={() => handleButtonClick(btn.action)}
                            className={`px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                              btn.style === 'success'
                                ? 'bg-[#248046] hover:bg-[#1a6334] text-white'
                                : btn.style === 'danger'
                                  ? 'bg-[#da373c] hover:bg-[#a1282c] text-white'
                                  : 'bg-[#5865F2] hover:bg-[#4752c4] text-white'
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Autocomplete Menu (Pop up when typing '/') */}
          {isAutocompleteOpen && (
            <div className="absolute bottom-16 left-4 right-4 bg-[#2b2d31] border border-[#383a40] rounded-lg shadow-2xl p-2 z-20 max-h-48 overflow-y-auto">
              <div className="text-[10px] font-bold uppercase text-slate-400 px-2 py-1">
                Slash Commands Matching "/"
              </div>
              <div className="space-y-1">
                {commands.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => handleSelectAutocomplete(cmd)}
                    className="w-full flex items-center justify-between p-2 rounded hover:bg-[#35373c] text-left text-xs text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">/{cmd.name}</span>
                      <span className="text-slate-400 text-[11px] truncate">{cmd.description}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 capitalize">{cmd.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Command Chips Toolbar */}
          <div className="px-4 py-1.5 bg-[#2b2d31] border-t border-[#1f2023] flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-medium text-slate-400 shrink-0">Quick run:</span>
            {quickCommands.map(cmd => (
              <button
                key={cmd}
                onClick={() => executeSimulatorCommand(cmd)}
                className="px-2 py-0.5 rounded bg-[#35373c] hover:bg-[#404249] text-[11px] font-mono text-slate-200 transition-colors shrink-0 cursor-pointer"
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#383a40] flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={`Message #${activeChannel} (Type / for slash command list)`}
              className="flex-1 bg-[#313338] border-0 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="p-2.5 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Ticket Modal Simulation */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#313338] rounded-xl border border-[#383a40] shadow-2xl p-5 text-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold">Create Support Ticket</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Topic / Problem Summary
                </label>
                <input
                  type="text"
                  required
                  value={modalSubject}
                  onChange={(e) => setModalSubject(e.target.value)}
                  placeholder="e.g. VIP Subscription Verification"
                  className="w-full bg-[#1e1f22] border border-[#2b2d31] rounded p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Support Category
                </label>
                <select
                  value={modalCategory}
                  onChange={(e) => setModalCategory(e.target.value as any)}
                  className="w-full bg-[#1e1f22] border border-[#2b2d31] rounded p-2 text-xs text-white"
                >
                  <option value="general">General Support</option>
                  <option value="billing">Billing & Store</option>
                  <option value="technical">Technical Glitch</option>
                  <option value="report">Report a Member</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Details for Staff
                </label>
                <textarea
                  rows={3}
                  value={modalDescription}
                  onChange={(e) => setModalDescription(e.target.value)}
                  placeholder="Provide context so staff can assist..."
                  className="w-full bg-[#1e1f22] border border-[#2b2d31] rounded p-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#5865F2] hover:bg-[#4752c4] font-semibold text-xs text-white rounded"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
