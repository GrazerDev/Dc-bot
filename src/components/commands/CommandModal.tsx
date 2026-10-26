import React, { useState } from 'react';
import { X, Plus, Trash2, Sparkles, Eye, Check } from 'lucide-react';
import { BotCommand, CommandCategory, CommandResponseType, EmbedField } from '../../types';

interface CommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (command: Omit<BotCommand, 'id' | 'usageCount'>) => void;
  editingCommand?: BotCommand | null;
}

export const CommandModal: React.FC<CommandModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCommand
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(editingCommand?.name || '');
  const [description, setDescription] = useState(editingCommand?.description || '');
  const [category, setCategory] = useState<CommandCategory>(editingCommand?.category || 'general');
  const [responseType, setResponseType] = useState<CommandResponseType>(editingCommand?.responseType || 'embed');
  const [textResponse, setTextResponse] = useState(editingCommand?.textResponse || '');
  
  // Embed data
  const [embedTitle, setEmbedTitle] = useState(editingCommand?.embed?.title || '⚡ Custom Command');
  const [embedDesc, setEmbedDesc] = useState(editingCommand?.embed?.description || 'Here is the response from the bot.');
  const [embedColor, setEmbedColor] = useState(editingCommand?.embed?.color || '#5865F2');
  const [embedFooter, setEmbedFooter] = useState(editingCommand?.embed?.footerText || 'Custom Server Trigger');
  const [fields, setFields] = useState<EmbedField[]>(editingCommand?.embed?.fields || []);

  const [cooldownSeconds, setCooldownSeconds] = useState(editingCommand?.cooldownSeconds || 5);
  const [requiredRole, setRequiredRole] = useState<'everyone' | 'moderator' | 'admin'>(editingCommand?.requiredRole || 'everyone');

  const insertVariable = (variable: string) => {
    if (responseType === 'text') {
      setTextResponse(prev => `${prev} ${variable}`);
    } else {
      setEmbedDesc(prev => `${prev} ${variable}`);
    }
  };

  const handleAddField = () => {
    setFields(prev => [...prev, { name: 'Field Title', value: 'Field description or details', inline: true }]);
  };

  const handleRemoveField = (index: number) => {
    setFields(prev => prev.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, key: keyof EmbedField, value: any) => {
    setFields(prev => prev.map((f, i) => i === index ? { ...f, [key]: value } : f));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.toLowerCase().replace(/[^a-z0-9_-]/g, ''),
      description: description || 'Custom server slash command',
      category,
      isSlash: true,
      isCustom: true,
      enabled: editingCommand ? editingCommand.enabled : true,
      responseType,
      textResponse,
      embed: {
        title: embedTitle,
        description: embedDesc,
        color: embedColor,
        fields,
        footerText: embedFooter,
        showTimestamp: true
      },
      cooldownSeconds: Number(cooldownSeconds) || 3,
      requiredRole,
      lastUsedAt: editingCommand?.lastUsedAt
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#13151f] border border-[#2b3044] rounded-xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#232736] flex items-center justify-between bg-[#10121a]">
          <div>
            <h2 className="text-base font-semibold text-white">
              {editingCommand ? `Edit Command /${editingCommand.name}` : 'Create Custom Slash Command'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Build a slash command with instant embed preview and variable tags
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1f2330] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Form Controls */}
            <div className="space-y-4">
              {/* Command Name & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Command Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">/</span>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. socials"
                      className="w-full bg-[#181a24] border border-[#2b3040] rounded-lg pl-7 pr-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#5865F2]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CommandCategory)}
                    className="w-full bg-[#181a24] border border-[#2b3040] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#5865F2]"
                  >
                    <option value="general">General</option>
                    <option value="utility">Utility</option>
                    <option value="moderation">Moderation</option>
                    <option value="fun">Fun</option>
                    <option value="economy">Economy</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Slash Command Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Appears in Discord's slash autocomplete menu"
                  className="w-full bg-[#181a24] border border-[#2b3040] rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#5865F2]"
                />
              </div>

              {/* Dynamic Variables helper */}
              <div>
                <label className="text-[11px] font-medium text-slate-400 flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#5865F2]" />
                    Click to insert dynamic variables:
                  </span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '{user.mention}',
                    '{user.name}',
                    '{server.name}',
                    '{server.member_count}',
                    '{args}'
                  ].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => insertVariable(v)}
                      className="px-2 py-0.5 rounded bg-[#1c202d] hover:bg-[#282e42] border border-[#2e3447] text-[11px] font-mono text-slate-300 transition-colors"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Response Type Selector */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Response Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setResponseType('embed')}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                      responseType === 'embed'
                        ? 'bg-[#5865F2] border-[#5865F2] text-white'
                        : 'bg-[#181a24] border-[#2b3040] text-slate-300 hover:bg-[#1f2230]'
                    }`}
                  >
                    Discord Rich Embed
                  </button>
                  <button
                    type="button"
                    onClick={() => setResponseType('text')}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                      responseType === 'text'
                        ? 'bg-[#5865F2] border-[#5865F2] text-white'
                        : 'bg-[#181a24] border-[#2b3040] text-slate-300 hover:bg-[#1f2230]'
                    }`}
                  >
                    Plain Text Message
                  </button>
                </div>
              </div>

              {/* Content input based on responseType */}
              {responseType === 'text' ? (
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Plain Text Response
                  </label>
                  <textarea
                    rows={4}
                    value={textResponse}
                    onChange={(e) => setTextResponse(e.target.value)}
                    placeholder="Enter what the bot should reply in Discord chat..."
                    className="w-full bg-[#181a24] border border-[#2b3040] rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#5865F2]"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-slate-300 block mb-1">
                        Embed Title
                      </label>
                      <input
                        type="text"
                        value={embedTitle}
                        onChange={(e) => setEmbedTitle(e.target.value)}
                        className="w-full bg-[#181a24] border border-[#2b3040] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1">
                        Accent Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={embedColor}
                          onChange={(e) => setEmbedColor(e.target.value)}
                          className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono text-slate-300">{embedColor}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Embed Description
                    </label>
                    <textarea
                      rows={3}
                      value={embedDesc}
                      onChange={(e) => setEmbedDesc(e.target.value)}
                      placeholder="Markdown supported (**bold**, *italic*, [link](url))"
                      className="w-full bg-[#181a24] border border-[#2b3040] rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#5865F2]"
                    />
                  </div>

                  {/* Embed Fields */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-slate-300">
                        Embed Fields ({fields.length}/6)
                      </label>
                      {fields.length < 6 && (
                        <button
                          type="button"
                          onClick={handleAddField}
                          className="text-[11px] text-[#5865F2] hover:text-[#7b85f5] flex items-center gap-1 font-medium"
                        >
                          <Plus className="w-3 h-3" /> Add Field
                        </button>
                      )}
                    </div>
                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {fields.map((field, idx) => (
                        <div key={idx} className="p-2 rounded bg-[#161822] border border-[#282d3d] flex items-center gap-2">
                          <input
                            type="text"
                            value={field.name}
                            onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
                            placeholder="Field Name"
                            className="w-1/3 bg-[#111219] border border-[#2e3447] rounded px-2 py-1 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={field.value}
                            onChange={(e) => handleFieldChange(idx, 'value', e.target.value)}
                            placeholder="Field Value"
                            className="flex-1 bg-[#111219] border border-[#2e3447] rounded px-2 py-1 text-xs text-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveField(idx)}
                            className="p-1 text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Footer Text
                    </label>
                    <input
                      type="text"
                      value={embedFooter}
                      onChange={(e) => setEmbedFooter(e.target.value)}
                      className="w-full bg-[#181a24] border border-[#2b3040] rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-[#5865F2]"
                    />
                  </div>
                </div>
              )}

              {/* Permissions & Cooldown */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Required Role
                  </label>
                  <select
                    value={requiredRole}
                    onChange={(e) => setRequiredRole(e.target.value as any)}
                    className="w-full bg-[#181a24] border border-[#2b3040] rounded-lg px-3 py-2 text-xs text-slate-200"
                  >
                    <option value="everyone">Everyone (@everyone)</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Administrator Only</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Cooldown (Seconds)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={3600}
                    value={cooldownSeconds}
                    onChange={(e) => setCooldownSeconds(Number(e.target.value))}
                    className="w-full bg-[#181a24] border border-[#2b3040] rounded-lg px-3 py-2 text-xs font-mono text-white"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Live Discord Embed Preview */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
                <Eye className="w-3.5 h-3.5 text-[#5865F2]" />
                <span>Live Discord Preview</span>
              </div>

              {/* Simulated Discord Message Bubble */}
              <div className="flex-1 p-4 rounded-xl bg-[#2b2d31] border border-[#383a40] flex flex-col justify-start">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#5865F2] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    BOT
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-white">Aegis Bot</span>
                      <span className="bg-[#5865F2] text-white text-[9px] font-semibold px-1 rounded">
                        BOT
                      </span>
                      <span className="text-[10px] text-slate-400">Today at 12:45 PM</span>
                    </div>

                    {responseType === 'text' ? (
                      <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {textResponse || 'Type response text in the left panel to preview...'}
                      </p>
                    ) : (
                      /* Discord Embed Box */
                      <div
                        style={{ borderLeftColor: embedColor }}
                        className="rounded bg-[#1e1f22] border-l-4 p-3.5 max-w-md shadow-md text-xs"
                      >
                        {embedTitle && (
                          <h4 className="font-bold text-sm text-white mb-1.5">
                            {embedTitle}
                          </h4>
                        )}
                        {embedDesc && (
                          <p className="text-slate-300 whitespace-pre-wrap leading-relaxed mb-3">
                            {embedDesc}
                          </p>
                        )}

                        {/* Fields */}
                        {fields.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 my-2">
                            {fields.map((f, i) => (
                              <div key={i} className={f.inline ? 'col-span-1' : 'col-span-2'}>
                                <div className="font-semibold text-slate-200 text-[11px]">{f.name}</div>
                                <div className="text-slate-300 text-[11px]">{f.value}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {embedFooter && (
                          <div className="mt-3 pt-2 border-t border-[#2e3036] flex items-center justify-between text-[10px] text-slate-400">
                            <span>{embedFooter}</span>
                            <span>Today at 12:45 PM</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-auto pt-4 text-[11px] text-slate-400 text-center border-t border-[#383a40]/60">
                  Matches Discord desktop client rendering
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="mt-6 pt-4 border-t border-[#232736] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#181a24] hover:bg-[#202330] text-xs font-medium text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-xs font-medium text-white shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{editingCommand ? 'Save Changes' : 'Create Command'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
