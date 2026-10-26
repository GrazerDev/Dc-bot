import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  BotCommand, 
  Ticket, 
  TicketMessage,
  AutoModSettings, 
  UserProfile, 
  ShopItem, 
  AnalyticsEvent, 
  ActivityHour, 
  GuildInfo, 
  BotConfig 
} from '../types';
import { 
  initialGuilds, 
  initialBotConfig, 
  initialCommands, 
  initialTickets, 
  initialAutoMod, 
  initialProfiles, 
  initialShopItems, 
  initialAnalyticsFeed, 
  initialHourlyActivity 
} from '../data/initialData';

interface SimulatorMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  authorName: string;
  avatar?: string;
  content: string;
  timestamp: string;
  isBot?: boolean;
  embed?: BotCommand['embed'];
  buttons?: BotCommand['buttons'];
  commandExecuted?: string;
}

interface BotDataContextType {
  guilds: GuildInfo[];
  selectedGuild: GuildInfo;
  setSelectedGuild: (guild: GuildInfo) => void;
  botConfig: BotConfig;
  updateBotConfig: (config: Partial<BotConfig>) => void;
  commands: BotCommand[];
  addCommand: (command: Omit<BotCommand, 'id' | 'usageCount'>) => void;
  updateCommand: (id: string, command: Partial<BotCommand>) => void;
  deleteCommand: (id: string) => void;
  toggleCommand: (id: string) => void;
  tickets: Ticket[];
  createTicket: (subject: string, category: Ticket['category'], initialMessage: string) => Ticket;
  claimTicket: (ticketId: string, staffName?: string) => void;
  closeTicket: (ticketId: string, reason?: string) => void;
  sendTicketMessage: (ticketId: string, content: string, sender: 'user' | 'staff' | 'bot', isInternalNote?: boolean) => void;
  autoMod: AutoModSettings;
  updateAutoMod: (settings: Partial<AutoModSettings>) => void;
  clearInfractions: () => void;
  addInfraction: (infraction: Omit<AutoModSettings['infractions'][0], 'id' | 'timestamp'>) => void;
  profiles: UserProfile[];
  updateProfile: (id: string, updates: Partial<UserProfile>) => void;
  claimDailyReward: (userId: string) => { success: boolean; amount: number; message: string };
  shopItems: ShopItem[];
  addShopItem: (item: Omit<ShopItem, 'id'>) => void;
  deleteShopItem: (id: string) => void;
  analyticsFeed: AnalyticsEvent[];
  hourlyActivity: ActivityHour[];
  addAnalyticsEvent: (type: AnalyticsEvent['type'], user: string, action: string, details: string) => void;
  simulatorMessages: SimulatorMessage[];
  executeSimulatorCommand: (commandText: string, channelId?: string) => void;
  clearSimulatorChat: () => void;
}

const BotDataContext = createContext<BotDataContextType | null>(null);

export const BotDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or fallback to defaults
  const [guilds] = useState<GuildInfo[]>(() => {
    const saved = localStorage.getItem('aegis_guilds');
    return saved ? JSON.parse(saved) : initialGuilds;
  });

  const [selectedGuild, setSelectedGuild] = useState<GuildInfo>(guilds[0]);

  const [botConfig, setBotConfig] = useState<BotConfig>(() => {
    const saved = localStorage.getItem('aegis_bot_config');
    return saved ? JSON.parse(saved) : initialBotConfig;
  });

  const [commands, setCommands] = useState<BotCommand[]>(() => {
    const saved = localStorage.getItem('aegis_commands');
    return saved ? JSON.parse(saved) : initialCommands;
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('aegis_tickets');
    return saved ? JSON.parse(saved) : initialTickets;
  });

  const [autoMod, setAutoMod] = useState<AutoModSettings>(() => {
    const saved = localStorage.getItem('aegis_automod');
    return saved ? JSON.parse(saved) : initialAutoMod;
  });

  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('aegis_profiles');
    return saved ? JSON.parse(saved) : initialProfiles;
  });

  const [shopItems, setShopItems] = useState<ShopItem[]>(() => {
    const saved = localStorage.getItem('aegis_shop_items');
    return saved ? JSON.parse(saved) : initialShopItems;
  });

  const [analyticsFeed, setAnalyticsFeed] = useState<AnalyticsEvent[]>(() => {
    const saved = localStorage.getItem('aegis_analytics_feed');
    return saved ? JSON.parse(saved) : initialAnalyticsFeed;
  });

  const [hourlyActivity, setHourlyActivity] = useState<ActivityHour[]>(() => {
    const saved = localStorage.getItem('aegis_hourly_activity');
    return saved ? JSON.parse(saved) : initialHourlyActivity;
  });

  // Simulator chat messages
  const [simulatorMessages, setSimulatorMessages] = useState<SimulatorMessage[]>([
    {
      id: 'sim-welcome',
      sender: 'bot',
      authorName: 'Aegis Bot',
      isBot: true,
      content: '',
      timestamp: 'Today at 12:00 PM',
      embed: {
        title: '⚡ Aegis Bot Online & Ready',
        description: 'Server: **Nebula Gaming & Devs** · Type `/help` to view all commands or `/ticket` to test ticket creation.',
        color: '#5865F2',
        fields: [
          { name: 'Gateway Latency', value: '18ms', inline: true },
          { name: 'Connected Shards', value: '1 / 1', inline: true },
          { name: 'Slash Commands', value: 'Active (Global)', inline: true }
        ],
        footerText: 'Test interactive commands, embeds, and buttons live!'
      }
    }
  ]);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('aegis_bot_config', JSON.stringify(botConfig));
  }, [botConfig]);

  useEffect(() => {
    localStorage.setItem('aegis_commands', JSON.stringify(commands));
  }, [commands]);

  useEffect(() => {
    localStorage.setItem('aegis_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('aegis_automod', JSON.stringify(autoMod));
  }, [autoMod]);

  useEffect(() => {
    localStorage.setItem('aegis_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('aegis_shop_items', JSON.stringify(shopItems));
  }, [shopItems]);

  useEffect(() => {
    localStorage.setItem('aegis_analytics_feed', JSON.stringify(analyticsFeed));
  }, [analyticsFeed]);

  const updateBotConfig = (config: Partial<BotConfig>) => {
    setBotConfig(prev => ({ ...prev, ...config }));
  };

  const addAnalyticsEvent = (type: AnalyticsEvent['type'], user: string, action: string, details: string) => {
    const newEvent: AnalyticsEvent = {
      id: `ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: 'Just now',
      type,
      user,
      action,
      details
    };
    setAnalyticsFeed(prev => [newEvent, ...prev.slice(0, 49)]);

    // Update hourly activity count
    setHourlyActivity(prev => {
      const copy = [...prev];
      if (copy.length > 0) {
        const last = { ...copy[copy.length - 1] };
        if (type === 'command') last.commands += 1;
        if (type === 'ticket') last.tickets += 1;
        copy[copy.length - 1] = last;
      }
      return copy;
    });
  };

  const addCommand = (newCmd: Omit<BotCommand, 'id' | 'usageCount'>) => {
    const command: BotCommand = {
      ...newCmd,
      id: `cmd-${Date.now()}`,
      usageCount: 0,
      lastUsedAt: 'Never'
    };
    setCommands(prev => [command, ...prev]);
    addAnalyticsEvent('command', 'Dashboard Admin', `Created command /${newCmd.name}`, `Category: ${newCmd.category}`);
  };

  const updateCommand = (id: string, updates: Partial<BotCommand>) => {
    setCommands(prev => prev.map(cmd => cmd.id === id ? { ...cmd, ...updates } : cmd));
  };

  const deleteCommand = (id: string) => {
    const cmd = commands.find(c => c.id === id);
    setCommands(prev => prev.filter(c => c.id !== id));
    if (cmd) {
      addAnalyticsEvent('command', 'Dashboard Admin', `Deleted command /${cmd.name}`, 'Removed from guild command registry');
    }
  };

  const toggleCommand = (id: string) => {
    setCommands(prev => prev.map(cmd => {
      if (cmd.id === id) {
        const enabled = !cmd.enabled;
        addAnalyticsEvent('command', 'Dashboard Admin', `${enabled ? 'Enabled' : 'Disabled'} command /${cmd.name}`, '');
        return { ...cmd, enabled };
      }
      return cmd;
    }));
  };

  const createTicket = (subject: string, category: Ticket['category'], initialMessage: string): Ticket => {
    const ticketNum = tickets.length > 0 ? Math.max(...tickets.map(t => t.ticketNumber)) + 1 : 1001;
    const newTicket: Ticket = {
      id: `tick-${Date.now()}`,
      ticketNumber: ticketNum,
      title: `Ticket #${ticketNum} - ${subject.slice(0, 30)}`,
      subject,
      category,
      status: 'open',
      priority: 'normal',
      author: {
        id: 'usr-sim-current',
        username: 'You',
        tag: 'You#0001',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces'
      },
      createdAt: 'Just now',
      messages: [
        {
          id: `msg-${Date.now()}-1`,
          sender: 'bot',
          authorName: 'Aegis Ticket System',
          content: `👋 Hello **You#0001**! Thank you for contacting support. Category: **${category.toUpperCase()}**.\nA staff member will review your request shortly.`,
          timestamp: 'Just now'
        },
        {
          id: `msg-${Date.now()}-2`,
          sender: 'user',
          authorName: 'You#0001',
          content: initialMessage || subject,
          timestamp: 'Just now'
        }
      ]
    };

    setTickets(prev => [newTicket, ...prev]);
    addAnalyticsEvent('ticket', 'You#0001', `Opened Ticket #${ticketNum}`, `Category: ${category} · "${subject}"`);
    return newTicket;
  };

  const claimTicket = (ticketId: string, staffName = 'Staff_Admin') => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const updated: Ticket = {
          ...t,
          status: 'claimed',
          assignedStaff: {
            id: 'staff-active',
            username: staffName,
            avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=faces'
          },
          messages: [
            ...t.messages,
            {
              id: `msg-claim-${Date.now()}`,
              sender: 'staff',
              authorName: `${staffName} (Staff)`,
              content: `🛡️ Ticket claimed by **${staffName}**. I will be assisting you with this request.`,
              timestamp: 'Just now'
            }
          ]
        };
        addAnalyticsEvent('ticket', staffName, `Claimed Ticket #${t.ticketNumber}`, `Assigned to ${staffName}`);
        return updated;
      }
      return t;
    }));
  };

  const closeTicket = (ticketId: string, reason = 'Resolved by staff') => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const updated: Ticket = {
          ...t,
          status: 'closed',
          closedAt: 'Just now',
          closeReason: reason,
          messages: [
            ...t.messages,
            {
              id: `msg-close-${Date.now()}`,
              sender: 'bot',
              authorName: 'Aegis Ticket System',
              content: `🔒 **Ticket #${t.ticketNumber} closed.** Reason: *${reason}*.\nTranscript saved to database and log channel.`,
              timestamp: 'Just now'
            }
          ]
        };
        addAnalyticsEvent('ticket', 'Staff', `Closed Ticket #${t.ticketNumber}`, `Reason: ${reason}`);
        return updated;
      }
      return t;
    }));
  };

  const sendTicketMessage = (ticketId: string, content: string, sender: 'user' | 'staff' | 'bot', isInternalNote = false) => {
    const newMessage: TicketMessage = {
      id: `msg-${Date.now()}`,
      sender,
      authorName: sender === 'staff' ? 'Staff_Admin (Staff)' : sender === 'user' ? 'You#0001' : 'Aegis Bot',
      content,
      timestamp: 'Just now',
      isInternalNote
    };

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          messages: [...t.messages, newMessage]
        };
      }
      return t;
    }));
  };

  const updateAutoMod = (settings: Partial<AutoModSettings>) => {
    setAutoMod(prev => ({ ...prev, ...settings }));
    addAnalyticsEvent('mod', 'Admin', 'Updated AutoMod Configuration', 'Filter rules updated');
  };

  const clearInfractions = () => {
    setAutoMod(prev => ({ ...prev, infractions: [] }));
  };

  const addInfraction = (inf: Omit<AutoModSettings['infractions'][0], 'id' | 'timestamp'>) => {
    const newInf = {
      ...inf,
      id: `inf-${Date.now()}`,
      timestamp: 'Just now'
    };
    setAutoMod(prev => ({
      ...prev,
      infractions: [newInf, ...prev.infractions]
    }));
    addAnalyticsEvent('mod', inf.moderator, `Infraction: ${inf.actionTaken.toUpperCase()}`, `${inf.username} violated ${inf.ruleViolated}`);
  };

  const updateProfile = (id: string, updates: Partial<UserProfile>) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const claimDailyReward = (userId: string) => {
    const profile = profiles.find(p => p.id === userId);
    if (!profile) return { success: false, amount: 0, message: 'Profile not found' };

    const reward = 500 + (profile.dailyStreak * 25);
    setProfiles(prev => prev.map(p => {
      if (p.id === userId) {
        return {
          ...p,
          balance: p.balance + reward,
          dailyStreak: p.dailyStreak + 1,
          lastDailyClaim: 'Just now'
        };
      }
      return p;
    }));

    addAnalyticsEvent('economy', profile.username, 'Claimed /daily', `Awarded ${reward} coins. Streak: ${profile.dailyStreak + 1}`);
    return { success: true, amount: reward, message: `Claimed ${reward} coins! Streak: ${profile.dailyStreak + 1} days` };
  };

  const addShopItem = (item: Omit<ShopItem, 'id'>) => {
    const newItem: ShopItem = {
      ...item,
      id: `item-${Date.now()}`
    };
    setShopItems(prev => [...prev, newItem]);
  };

  const deleteShopItem = (id: string) => {
    setShopItems(prev => prev.filter(i => i.id !== id));
  };

  const clearSimulatorChat = () => {
    setSimulatorMessages([]);
  };

  const executeSimulatorCommand = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Add user message
    const userMsg: SimulatorMessage = {
      id: `sim-user-${Date.now()}`,
      sender: 'user',
      authorName: 'You',
      timestamp: 'Just now',
      content: trimmed
    };

    setSimulatorMessages(prev => [...prev, userMsg]);

    // Check AutoMod in chat
    if (autoMod.badWordsFilterEnabled) {
      const lower = trimmed.toLowerCase();
      const detected = autoMod.bannedWords.find(w => lower.includes(w.toLowerCase()));
      if (detected) {
        addInfraction({
          userId: 'usr-you',
          username: 'You#0001',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
          ruleViolated: `Banned Keyword: "${detected}"`,
          actionTaken: autoMod.autoAction === 'delete' ? 'message_deleted' : 'warned',
          reason: `Automated filter matched blacklisted phrase: ${detected}`,
          moderator: 'Aegis AutoMod'
        });

        setTimeout(() => {
          setSimulatorMessages(prev => [
            ...prev,
            {
              id: `sim-automod-${Date.now()}`,
              sender: 'system',
              authorName: 'Aegis AutoMod',
              isBot: true,
              timestamp: 'Just now',
              content: `⚠️ **AutoMod Triggered**: Your message contained a blacklisted term (\`${detected}\`) and was recorded.`
            }
          ]);
        }, 300);
        return;
      }
    }

    // Process Slash Command or text
    const cleanCmd = trimmed.startsWith('/') ? trimmed.slice(1).split(' ')[0].toLowerCase() : null;
    const args = trimmed.startsWith('/') ? trimmed.slice(1).split(' ').slice(1).join(' ') : trimmed;

    if (cleanCmd) {
      // Find matching command
      const foundCmd = commands.find(c => c.name.toLowerCase() === cleanCmd);

      // Increment command analytics
      if (foundCmd) {
        setCommands(prev => prev.map(c => c.id === foundCmd.id ? { ...c, usageCount: c.usageCount + 1, lastUsedAt: 'Just now' } : c));
        addAnalyticsEvent('command', 'You#0001', `Executed /${foundCmd.name}`, `Args: "${args || 'none'}"`);
      }

      setTimeout(() => {
        if (!foundCmd) {
          setSimulatorMessages(prev => [
            ...prev,
            {
              id: `sim-bot-${Date.now()}`,
              sender: 'bot',
              authorName: 'Aegis Bot',
              isBot: true,
              timestamp: 'Just now',
              content: `❌ Unknown command \`/${cleanCmd}\`. Type \`/help\` to inspect all registered commands.`
            }
          ]);
          return;
        }

        if (!foundCmd.enabled) {
          setSimulatorMessages(prev => [
            ...prev,
            {
              id: `sim-bot-${Date.now()}`,
              sender: 'bot',
              authorName: 'Aegis Bot',
              isBot: true,
              timestamp: 'Just now',
              content: `⚠️ The command \`/${foundCmd.name}\` is currently disabled in your dashboard settings.`
            }
          ]);
          return;
        }

        // Special dynamic logic for built-ins
        if (foundCmd.name === 'daily') {
          const res = claimDailyReward(profiles[0].id);
          setSimulatorMessages(prev => [
            ...prev,
            {
              id: `sim-bot-${Date.now()}`,
              sender: 'bot',
              authorName: 'Aegis Bot',
              isBot: true,
              timestamp: 'Just now',
              content: `💰 **Daily Reward Claimed!** ${res.message}`
            }
          ]);
          return;
        }

        if (foundCmd.name === 'ping') {
          setSimulatorMessages(prev => [
            ...prev,
            {
              id: `sim-bot-${Date.now()}`,
              sender: 'bot',
              authorName: 'Aegis Bot',
              isBot: true,
              timestamp: 'Just now',
              content: '🏓 **Pong!** Gateway latency: `18ms` · REST API: `22ms` · Uptime: `99.98%`'
            }
          ]);
          return;
        }

        // Replace variable tokens in embed or text response
        const replaceTokens = (text: string) => {
          return text
            .replace(/{user\.mention}/g, '@You')
            .replace(/{user\.name}/g, 'You')
            .replace(/{server\.name}/g, selectedGuild.name)
            .replace(/{server\.member_count}/g, selectedGuild.memberCount.toString())
            .replace(/{staff\.mention}/g, '@Staff_Admin')
            .replace(/{args}/g, args || 'all');
        };

        if (foundCmd.responseType === 'text') {
          setSimulatorMessages(prev => [
            ...prev,
            {
              id: `sim-bot-${Date.now()}`,
              sender: 'bot',
              authorName: 'Aegis Bot',
              isBot: true,
              timestamp: 'Just now',
              content: replaceTokens(foundCmd.textResponse)
            }
          ]);
        } else {
          // Embed response
          const processedEmbed = {
            ...foundCmd.embed,
            title: replaceTokens(foundCmd.embed.title),
            description: replaceTokens(foundCmd.embed.description),
            fields: foundCmd.embed.fields.map(f => ({
              ...f,
              name: replaceTokens(f.name),
              value: replaceTokens(f.value)
            }))
          };

          setSimulatorMessages(prev => [
            ...prev,
            {
              id: `sim-bot-${Date.now()}`,
              sender: 'bot',
              authorName: 'Aegis Bot',
              isBot: true,
              timestamp: 'Just now',
              content: foundCmd.textResponse ? replaceTokens(foundCmd.textResponse) : '',
              embed: processedEmbed,
              buttons: foundCmd.buttons
            }
          ]);
        }
      }, 400);
    } else {
      // Regular chat message, give random slight XP
      setProfiles(prev => {
        const copy = [...prev];
        copy[0].xp += 5;
        return copy;
      });
    }
  };

  return (
    <BotDataContext.Provider
      value={{
        guilds,
        selectedGuild,
        setSelectedGuild,
        botConfig,
        updateBotConfig,
        commands,
        addCommand,
        updateCommand,
        deleteCommand,
        toggleCommand,
        tickets,
        createTicket,
        claimTicket,
        closeTicket,
        sendTicketMessage,
        autoMod,
        updateAutoMod,
        clearInfractions,
        addInfraction,
        profiles,
        updateProfile,
        claimDailyReward,
        shopItems,
        addShopItem,
        deleteShopItem,
        analyticsFeed,
        hourlyActivity,
        addAnalyticsEvent,
        simulatorMessages,
        executeSimulatorCommand,
        clearSimulatorChat
      }}
    >
      {children}
    </BotDataContext.Provider>
  );
};

export const useBotData = () => {
  const context = useContext(BotDataContext);
  if (!context) {
    throw new Error('useBotData must be used within a BotDataProvider');
  }
  return context;
};
