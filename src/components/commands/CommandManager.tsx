import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Terminal, 
  SlidersHorizontal, 
  Play, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Sparkles
} from 'lucide-react';
import { useBotData } from '../../context/BotDataContext';
import { BotCommand, CommandCategory } from '../../types';
import { CommandModal } from './CommandModal';

interface CommandManagerProps {
  onTestInSimulator?: (cmdName: string) => void;
}

export const CommandManager: React.FC<CommandManagerProps> = ({ onTestInSimulator }) => {
  const { commands, addCommand, updateCommand, deleteCommand, toggleCommand } = useBotData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommand, setEditingCommand] = useState<BotCommand | null>(null);

  const categories = [
    { id: 'all', label: 'All Commands' },
    { id: 'general', label: 'General' },
    { id: 'utility', label: 'Utility' },
    { id: 'moderation', label: 'Moderation' },
    { id: 'economy', label: 'Economy' },
    { id: 'tickets', label: 'Tickets' }
  ];

  const filteredCommands = commands.filter(cmd => {
    const matchesSearch = 
      cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreate = () => {
    setEditingCommand(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cmd: BotCommand) => {
    setEditingCommand(cmd);
    setIsModalOpen(true);
  };

  const handleSaveCommand = (cmdData: Omit<BotCommand, 'id' | 'usageCount'>) => {
    if (editingCommand) {
      updateCommand(editingCommand.id, cmdData);
    } else {
      addCommand(cmdData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Search, Category Tabs, Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#141620] border border-[#232736] rounded-lg overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#5865F2] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & New Command */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search slash commands..."
              className="bg-[#141620] border border-[#232736] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5865F2] w-56"
            />
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-xs font-medium text-white shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Custom Command</span>
          </button>
        </div>
      </div>

      {/* Commands Table */}
      <div className="rounded-xl bg-[#13151e] border border-[#232736] overflow-hidden">
        <div className="p-4 border-b border-[#232736] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#5865F2]" />
            <h2 className="text-sm font-semibold text-white">Slash Command Registry</h2>
            <span className="text-xs text-slate-400">({filteredCommands.length} listed)</span>
          </div>
          <div className="text-xs text-slate-400">
            Slash commands auto-sync to Discord via <code className="font-mono text-slate-300">/deploy</code>
          </div>
        </div>

        {filteredCommands.length === 0 ? (
          <div className="p-12 text-center">
            <Terminal className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No commands found</p>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#101118] text-slate-400 border-b border-[#232736]">
                <tr>
                  <th className="py-3 px-4 font-medium">Command Name</th>
                  <th className="py-3 px-4 font-medium">Description</th>
                  <th className="py-3 px-4 font-medium">Category</th>
                  <th className="py-3 px-4 font-medium">Permissions</th>
                  <th className="py-3 px-4 font-medium">Cooldown</th>
                  <th className="py-3 px-4 font-medium text-right">Executions</th>
                  <th className="py-3 px-4 font-medium text-center">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202434] text-slate-300">
                {filteredCommands.map((cmd) => (
                  <tr key={cmd.id} className="hover:bg-[#161822] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-white">
                          /{cmd.name}
                        </span>
                        {cmd.isCustom && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            Custom
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-400 max-w-xs truncate">
                      {cmd.description}
                    </td>
                    <td className="py-3 px-4 capitalize text-slate-300">
                      {cmd.category}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {cmd.requiredRole === 'admin' ? (
                        <span className="text-rose-400">Admin Only</span>
                      ) : cmd.requiredRole === 'moderator' ? (
                        <span className="text-amber-400">Moderator</span>
                      ) : (
                        <span>Everyone</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {cmd.cooldownSeconds}s
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-200">
                      {cmd.usageCount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleCommand(cmd.id)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                          cmd.enabled
                            ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                        }`}
                      >
                        {cmd.enabled ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Disabled</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onTestInSimulator && (
                          <button
                            title="Test in Simulator"
                            onClick={() => onTestInSimulator(cmd.name)}
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#202534] transition-colors"
                          >
                            <Play className="w-3.5 h-3.5 text-[#5865F2]" />
                          </button>
                        )}
                        <button
                          title="Edit Command"
                          onClick={() => handleOpenEdit(cmd)}
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#202534] transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {cmd.isCustom && (
                          <button
                            title="Delete Command"
                            onClick={() => deleteCommand(cmd.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-[#202534] transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Command Modal */}
      <CommandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCommand}
        editingCommand={editingCommand}
      />
    </div>
  );
};
