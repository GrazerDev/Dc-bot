import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle, 
  Lock, 
  Download, 
  UserCheck, 
  Shield, 
  StickyNote, 
  AlertCircle 
} from 'lucide-react';
import { Ticket } from '../../types';
import { useBotData } from '../../context/BotDataContext';

interface TicketDetailsModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({
  ticket,
  isOpen,
  onClose
}) => {
  if (!isOpen || !ticket) return null;

  const { claimTicket, closeTicket, sendTicketMessage } = useBotData();

  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [closeReason, setCloseReason] = useState('');
  const [showClosePrompt, setShowClosePrompt] = useState(false);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    sendTicketMessage(ticket.id, replyText.trim(), 'staff', isInternalNote);
    setReplyText('');
    setIsInternalNote(false);
  };

  const handleClaim = () => {
    claimTicket(ticket.id, 'Dashboard_Staff');
  };

  const handleClose = () => {
    closeTicket(ticket.id, closeReason || 'Issue resolved by staff.');
    setShowClosePrompt(false);
  };

  const downloadTranscript = () => {
    const transcriptLines = [
      `============================================================`,
      `AEGIS BOT TICKET TRANSCRIPT`,
      `Ticket: #${ticket.ticketNumber} - ${ticket.subject}`,
      `Category: ${ticket.category.toUpperCase()}`,
      `Author: ${ticket.author.tag} (ID: ${ticket.author.id})`,
      `Created At: ${ticket.createdAt}`,
      `Status: ${ticket.status.toUpperCase()}`,
      `Staff Assigned: ${ticket.assignedStaff ? ticket.assignedStaff.username : 'Unassigned'}`,
      `============================================================\n`
    ];

    ticket.messages.forEach(m => {
      const prefix = m.isInternalNote ? '[INTERNAL NOTE]' : `[${m.sender.toUpperCase()}]`;
      transcriptLines.push(`${m.timestamp} - ${prefix} ${m.authorName}: ${m.content}`);
    });

    const blob = new Blob([transcriptLines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${ticket.ticketNumber}-transcript.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#13151f] border border-[#2b3044] rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#232736] bg-[#10121a] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono font-bold text-white bg-[#5865F2]/20 border border-[#5865F2]/30 px-2 py-0.5 rounded">
              #{ticket.ticketNumber}
            </span>
            <div>
              <h2 className="text-sm font-semibold text-white">
                {ticket.subject}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>By {ticket.author.tag}</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{ticket.category}</span>
                <span aria-hidden="true">·</span>
                <span>{ticket.createdAt}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadTranscript}
              title="Download Transcript"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1f2330] transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1f2330] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Bar: Status, Staff Assign, Close */}
        <div className="px-6 py-2.5 bg-[#171924] border-b border-[#232736] flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-3">
            <span className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
              ticket.status === 'open'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : ticket.status === 'claimed'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
            }`}>
              Status: {ticket.status}
            </span>

            <span className="text-slate-400">
              Staff:{' '}
              {ticket.assignedStaff ? (
                <span className="text-white font-medium">{ticket.assignedStaff.username}</span>
              ) : (
                <span className="text-amber-400">Unassigned</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {ticket.status === 'open' && (
              <button
                onClick={handleClaim}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1f2330] hover:bg-[#282d3e] text-slate-200 border border-[#2d3448] font-medium transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#5865F2]" />
                <span>Claim Ticket</span>
              </button>
            )}

            {ticket.status !== 'closed' && (
              <button
                onClick={() => setShowClosePrompt(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Close Ticket</span>
              </button>
            )}
          </div>
        </div>

        {/* Close confirmation popover */}
        {showClosePrompt && (
          <div className="p-3 bg-[#1d1720] border-b border-rose-500/30 flex items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex-1">
              <label className="text-rose-300 font-medium block mb-1">
                Close Ticket & Generate Transcript
              </label>
              <input
                type="text"
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
                placeholder="Reason for closing (e.g. Issue resolved)"
                className="w-full bg-[#131118] border border-rose-500/30 rounded px-2.5 py-1 text-xs text-white"
              />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <button
                onClick={() => setShowClosePrompt(false)}
                className="px-2.5 py-1 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleClose}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded"
              >
                Confirm Close
              </button>
            </div>
          </div>
        )}

        {/* Messages List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {ticket.messages.map((m) => {
            const isStaff = m.sender === 'staff';
            const isBot = m.sender === 'bot';
            return (
              <div
                key={m.id}
                className={`p-3.5 rounded-lg border text-xs leading-relaxed ${
                  m.isInternalNote
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                    : isStaff
                      ? 'bg-[#181a28] border-[#2f354f] text-slate-200'
                      : isBot
                        ? 'bg-[#151720] border-[#222634] text-slate-300'
                        : 'bg-[#1b1e2a] border-[#2a3044] text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{m.authorName}</span>
                    {m.isInternalNote && (
                      <span className="bg-amber-500/20 text-amber-300 text-[10px] font-mono px-1.5 py-0.2 rounded flex items-center gap-1">
                        <StickyNote className="w-2.5 h-2.5" /> Staff Internal Note
                      </span>
                    )}
                    {isStaff && !m.isInternalNote && (
                      <span className="bg-[#5865F2]/20 text-[#838ef8] text-[10px] font-semibold px-1 rounded">
                        STAFF
                      </span>
                    )}
                    {isBot && (
                      <span className="bg-[#5865F2] text-white text-[9px] font-bold px-1 rounded">
                        BOT
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{m.timestamp}</span>
                </div>
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            );
          })}
        </div>

        {/* Reply Box Footer */}
        {ticket.status !== 'closed' ? (
          <form onSubmit={handleSendReply} className="p-4 border-t border-[#232736] bg-[#10121a] shrink-0">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-300">
                Staff Response
              </label>
              <label className="flex items-center gap-1.5 text-xs text-amber-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInternalNote}
                  onChange={(e) => setIsInternalNote(e.target.checked)}
                  className="rounded bg-[#1a1d27] border-[#2b3040] text-amber-500 focus:ring-0"
                />
                <span>Internal Staff Note (User cannot see)</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={isInternalNote ? 'Write private staff notes here...' : 'Reply to user ticket...'}
                className="flex-1 bg-[#181a24] border border-[#2b3040] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5865F2]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 border-t border-[#232736] bg-[#10121a] text-center text-xs text-slate-400 shrink-0">
            🔒 This ticket is closed. Closed reason: <span className="text-slate-300 italic">{ticket.closeReason || 'Resolved'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
