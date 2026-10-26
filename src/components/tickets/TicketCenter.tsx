import React, { useState } from 'react';
import { 
  TicketCheck, 
  Plus, 
  Search, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  User, 
  ExternalLink 
} from 'lucide-react';
import { useBotData } from '../../context/BotDataContext';
import { Ticket, TicketStatus } from '../../types';
import { TicketDetailsModal } from './TicketDetailsModal';

export const TicketCenter: React.FC = () => {
  const { tickets, createTicket } = useBotData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TicketStatus>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showCreatePrompt, setShowCreatePrompt] = useState(false);

  // New Ticket form
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<Ticket['category']>('general');
  const [newMessage, setNewMessage] = useState('');

  const openCount = tickets.filter(t => t.status === 'open').length;
  const claimedCount = tickets.filter(t => t.status === 'claimed').length;
  const closedCount = tickets.filter(t => t.status === 'closed').length;

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.author.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ticketNumber.toString().includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenTicketDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDetailsOpen(true);
  };

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    const created = createTicket(newSubject.trim(), newCategory, newMessage.trim());
    setNewSubject('');
    setNewMessage('');
    setShowCreatePrompt(false);
    setSelectedTicket(created);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 4 Ticket KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#13151e] border border-[#232736]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Total Tickets</span>
            <TicketCheck className="w-4 h-4 text-[#5865F2]" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {tickets.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Archived in database</div>
        </div>

        <div className="p-4 rounded-xl bg-[#13151e] border border-[#232736]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Open & Awaiting Staff</span>
            <AlertCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
            {openCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Requires staff response</div>
        </div>

        <div className="p-4 rounded-xl bg-[#13151e] border border-[#232736]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Claimed / In Progress</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-400">
            {claimedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Under active staff investigation</div>
        </div>

        <div className="p-4 rounded-xl bg-[#13151e] border border-[#232736]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Resolved & Closed</span>
            <CheckCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-300">
            {closedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">With transcripts preserved</div>
        </div>
      </div>

      {/* Action Bar & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#141620] border border-[#232736] rounded-lg">
          {(['all', 'open', 'claimed', 'closed'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-[#5865F2] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st === 'all' ? 'All Tickets' : st}
            </button>
          ))}
        </div>

        {/* Search & New Ticket CTA */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets by subject or user..."
              className="bg-[#141620] border border-[#232736] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5865F2] w-64"
            />
          </div>

          <button
            onClick={() => setShowCreatePrompt(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-xs font-medium text-white shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Open Test Ticket</span>
          </button>
        </div>
      </div>

      {/* Create Ticket Modal Popup */}
      {showCreatePrompt && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#13151f] border border-[#2b3044] rounded-xl p-5 shadow-2xl">
            <h3 className="text-sm font-semibold text-white mb-1">
              Create New Support Ticket
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Simulates a member typing <code className="font-mono text-slate-300">/ticket create</code> in Discord.
            </p>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Subject / Summary
                </label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. VIP Subscription Verification"
                  className="w-full bg-[#181a24] border border-[#2b3040] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5865F2]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-[#181a24] border border-[#2b3040] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#5865F2]"
                >
                  <option value="general">General Inquiry</option>
                  <option value="billing">Billing & Store</option>
                  <option value="technical">Technical Issue</option>
                  <option value="report">User Report</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Initial Message
                </label>
                <textarea
                  rows={3}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Details regarding your request..."
                  className="w-full bg-[#181a24] border border-[#2b3040] rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5865F2]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreatePrompt(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#5865F2] hover:bg-[#4752c4] text-xs font-medium text-white rounded-lg"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tickets Table */}
      <div className="rounded-xl bg-[#13151e] border border-[#232736] overflow-hidden">
        <div className="p-4 border-b border-[#232736] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TicketCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">Active Support Requests</h2>
            <span className="text-xs text-slate-400">({filteredTickets.length} tickets)</span>
          </div>
          <span className="text-xs text-slate-400">
            Transcripts automatically generated on ticket close
          </span>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="p-12 text-center">
            <TicketCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No tickets found</p>
            <p className="text-xs text-slate-500 mt-1">There are no tickets matching your current filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#101118] text-slate-400 border-b border-[#232736]">
                <tr>
                  <th className="py-3 px-4 font-medium">Ticket #</th>
                  <th className="py-3 px-4 font-medium">Subject</th>
                  <th className="py-3 px-4 font-medium">Category</th>
                  <th className="py-3 px-4 font-medium">Author</th>
                  <th className="py-3 px-4 font-medium">Assigned Staff</th>
                  <th className="py-3 px-4 font-medium">Created</th>
                  <th className="py-3 px-4 font-medium text-center">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202434] text-slate-300">
                {filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-[#161822] transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-white">
                      #{t.ticketNumber}
                    </td>
                    <td className="py-3 px-4 font-medium text-white max-w-xs truncate">
                      {t.subject}
                    </td>
                    <td className="py-3 px-4 capitalize text-slate-300">
                      {t.category}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t.author.tag}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {t.assignedStaff ? (
                        <span className="text-white font-medium">{t.assignedStaff.username}</span>
                      ) : (
                        <span className="text-amber-400 font-mono text-[11px]">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {t.createdAt}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                        t.status === 'open'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : t.status === 'claimed'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenTicketDetails(t)}
                        className="px-2.5 py-1 rounded bg-[#1c202d] hover:bg-[#252b3d] text-slate-200 text-xs font-medium border border-[#2d3448] transition-colors cursor-pointer"
                      >
                        View Thread ({t.messages.length})
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      <TicketDetailsModal
        ticket={selectedTicket}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};
