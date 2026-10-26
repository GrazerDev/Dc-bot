import React, { useState } from 'react';
import { 
  Coins, 
  Trophy, 
  ShoppingBag, 
  Plus, 
  TrendingUp, 
  Sparkles, 
  UserPlus, 
  Gift 
} from 'lucide-react';
import { useBotData } from '../../context/BotDataContext';
import { ShopItem } from '../../types';

export const EconomyView: React.FC = () => {
  const { profiles, shopItems, addShopItem, deleteShopItem, updateProfile } = useBotData();

  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(10000);
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemRole, setNewItemRole] = useState('');
  const [showAddShop, setShowAddShop] = useState(false);

  const sortedProfiles = [...profiles].sort((a, b) => b.xp - a.xp);

  const handleCreateShopItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    addShopItem({
      name: newItemName.trim(),
      price: Number(newItemPrice),
      description: newItemDesc.trim() || 'Purchasable community perk',
      roleReward: newItemRole.trim() || undefined,
      icon: '🎁'
    });

    setNewItemName('');
    setNewItemPrice(10000);
    setNewItemDesc('');
    setNewItemRole('');
    setShowAddShop(false);
  };

  const handleGrantCoins = (userId: string, amount: number) => {
    const prof = profiles.find(p => p.id === userId);
    if (prof) {
      updateProfile(userId, { balance: prof.balance + amount });
    }
  };

  return (
    <div className="space-y-6">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#13151e] border border-[#232736]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Circulating Currency</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {profiles.reduce((acc, p) => acc + p.balance + p.bank, 0).toLocaleString()} Coins
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across all member wallets & banks</div>
        </div>

        <div className="p-4 rounded-xl bg-[#13151e] border border-[#232736]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Top Server Level</span>
            <Trophy className="w-4 h-4 text-[#5865F2]" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            Level {sortedProfiles[0]?.level || 1}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Leader: {sortedProfiles[0]?.username || 'N/A'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#13151e] border border-[#232736]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Daily Login Reward</span>
            <Gift className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
            500 Coins
          </div>
          <div className="text-[11px] text-slate-400 mt-1">+25 coins per streak day</div>
        </div>
      </div>

      {/* Main Split: Leaderboard & Server Shop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard Table (2 Columns) */}
        <div className="lg:col-span-2 rounded-xl bg-[#13151e] border border-[#232736] overflow-hidden">
          <div className="p-4 border-b border-[#232736] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Member XP & Economy Leaderboard</h3>
            </div>
            <span className="text-xs text-slate-400">Tracked in real-time</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#101118] text-slate-400 border-b border-[#232736]">
                <tr>
                  <th className="py-3 px-4 font-medium text-center">Rank</th>
                  <th className="py-3 px-4 font-medium">Member</th>
                  <th className="py-3 px-4 font-medium text-right">Level</th>
                  <th className="py-3 px-4 font-medium text-right">Total XP</th>
                  <th className="py-3 px-4 font-medium text-right">Wallet Coins</th>
                  <th className="py-3 px-4 font-medium text-center">Streak</th>
                  <th className="py-3 px-4 font-medium text-right">Quick Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202434] text-slate-300">
                {sortedProfiles.map((p, index) => (
                  <tr key={p.id} className="hover:bg-[#161822] transition-colors">
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      {index === 0 ? '🥇 #1' : index === 1 ? '🥈 #2' : index === 2 ? '🥉 #3' : `#${index + 1}`}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#5865F2] flex items-center justify-center text-[10px] text-white font-bold">
                          {p.username[0]}
                        </div>
                        <span className="font-semibold text-white">{p.username}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#5865F2]">
                      Lvl {p.level}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-200">
                      {p.xp.toLocaleString()} XP
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-400">
                      {p.balance.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-amber-400">
                      {p.dailyStreak}d 🔥
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleGrantCoins(p.id, 1000)}
                        title="Grant +1,000 Coins"
                        className="px-2 py-0.5 rounded bg-[#1c202d] hover:bg-[#252b3d] border border-[#2d3448] text-[11px] text-slate-300 transition-colors"
                      >
                        +1k 🪙
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Server Shop Items (1 Column) */}
        <div className="rounded-xl bg-[#13151e] border border-[#232736] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#5865F2]" />
                <h3 className="text-sm font-semibold text-white">Server Rewards Shop</h3>
              </div>
              <button
                onClick={() => setShowAddShop(!showAddShop)}
                className="text-xs text-[#5865F2] hover:text-[#7b85f5] flex items-center gap-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" /> Add Perk
              </button>
            </div>

            {/* Add Shop Item form */}
            {showAddShop && (
              <form onSubmit={handleCreateShopItem} className="p-3 mb-4 rounded-lg bg-[#181a24] border border-[#2a2f42] space-y-2">
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Perk or Role Name"
                  className="w-full bg-[#111218] border border-[#2b3040] rounded px-2.5 py-1 text-xs text-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    placeholder="Coin Price"
                    className="w-full bg-[#111218] border border-[#2b3040] rounded px-2.5 py-1 text-xs text-white font-mono"
                  />
                  <input
                    type="text"
                    value={newItemRole}
                    onChange={(e) => setNewItemRole(e.target.value)}
                    placeholder="Role to Assign (optional)"
                    className="w-full bg-[#111218] border border-[#2b3040] rounded px-2.5 py-1 text-xs text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddShop(false)}
                    className="px-2 py-0.5 text-xs text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-0.5 bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-medium rounded"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}

            {/* Items List */}
            <div className="space-y-3">
              {shopItems.map((item) => (
                <div key={item.id} className="p-3 rounded-lg bg-[#181a24] border border-[#262a3a] flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="text-xl leading-none">{item.icon}</span>
                    <div>
                      <div className="text-xs font-semibold text-white">{item.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.description}</div>
                      {item.roleReward && (
                        <span className="inline-block mt-1 text-[10px] font-mono text-[#5865F2] bg-[#5865F2]/10 px-1.5 py-0.2 rounded">
                          Awards Role: @{item.roleReward}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {item.price.toLocaleString()} 🪙
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#232736] text-[11px] text-slate-400 text-center">
            Members can purchase with <code className="font-mono text-slate-300">/shop buy [item]</code>
          </div>
        </div>
      </div>
    </div>
  );
};
