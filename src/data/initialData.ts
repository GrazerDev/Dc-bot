import { BotCommand, Ticket, AutoModSettings, UserProfile, ShopItem, AnalyticsEvent, ActivityHour, GuildInfo, BotConfig } from '../types';

export const initialGuilds: GuildInfo[] = [
  {
    id: '123456789012345678',
    name: 'Nebula Gaming & Devs',
    icon: '⚡',
    memberCount: 4289,
    onlineCount: 1342,
    prefix: '!',
    welcomeChannelId: '987654321098765432',
    logChannelId: '987654321098765433',
    ticketCategoryId: '987654321098765434',
    autoRoleId: 'Community Member'
  },
  {
    id: '876543210987654321',
    name: 'Apex Esports League',
    icon: '🏆',
    memberCount: 1850,
    onlineCount: 420,
    prefix: '!',
    welcomeChannelId: '112233445566778899',
    logChannelId: '112233445566778800',
    ticketCategoryId: '112233445566778801',
    autoRoleId: 'Competitor'
  }
];

export const initialBotConfig: BotConfig = {
  botToken: '',
  clientId: '128904712839210293',
  guildId: '123456789012345678',
  databaseUrl: 'file:./dev.db',
  statusMessage: 'Watching /help | Supporting Tickets',
  activityType: 'WATCHING',
  statusMode: 'online',
  prefix: '!'
};

export const initialCommands: BotCommand[] = [
  {
    id: 'cmd-1',
    name: 'help',
    description: 'Displays all available slash commands and interactive modules.',
    category: 'general',
    isSlash: true,
    isCustom: false,
    enabled: true,
    responseType: 'embed',
    textResponse: '',
    embed: {
      title: '🛡️ Aegis Command Center',
      description: 'Welcome to **Aegis Bot**! Explore the modules below or use slash commands in any authorized channel.',
      color: '#5865F2',
      fields: [
        { name: '🎫 Support & Tickets', value: '`/ticket create` - Open a private support channel\n`/ticket close` - Close with transcript export', inline: false },
        { name: '🛡️ Moderation', value: '`/warn`, `/mute`, `/kick`, `/ban`, `/purge`', inline: true },
        { name: '💰 Economy & Rank', value: '`/rank`, `/daily`, `/balance`, `/leaderboard`, `/gamble`', inline: true },
        { name: '⚙️ Utilities', value: '`/serverinfo`, `/userinfo`, `/ping`, `/custom`', inline: true }
      ],
      footerText: 'Powered by Aegis Master Bot Suite · /help',
      showTimestamp: true
    },
    buttons: [
      { id: 'btn-help-ticket', label: 'Open Ticket', style: 'primary', action: 'ticket_create' },
      { id: 'btn-help-bal', label: 'Check Balance', style: 'secondary', action: 'balance' }
    ],
    cooldownSeconds: 3,
    requiredRole: 'everyone',
    usageCount: 1420,
    lastUsedAt: '2 mins ago'
  },
  {
    id: 'cmd-2',
    name: 'ticket',
    description: 'Open a dedicated private support channel for help, reports, or billing.',
    category: 'tickets',
    isSlash: true,
    isCustom: false,
    enabled: true,
    responseType: 'embed',
    textResponse: '',
    embed: {
      title: '📩 Support Desk',
      description: 'Need assistance from our staff team? Click the button below to initiate a private support ticket thread.',
      color: '#57F287',
      fields: [
        { name: 'Response Hours', value: '24/7 Monitored Support', inline: true },
        { name: 'Average Wait Time', value: '< 5 minutes', inline: true }
      ],
      footerText: 'Tickets are recorded and archived with transcripts.',
      showTimestamp: true
    },
    buttons: [
      { id: 'btn-open-ticket', label: 'Create Ticket', style: 'success', action: 'ticket_create' }
    ],
    cooldownSeconds: 10,
    requiredRole: 'everyone',
    usageCount: 890,
    lastUsedAt: 'Just now'
  },
  {
    id: 'cmd-3',
    name: 'rank',
    description: 'Check your current server level, XP progress, and rank position.',
    category: 'economy',
    isSlash: true,
    isCustom: false,
    enabled: true,
    responseType: 'embed',
    textResponse: '',
    embed: {
      title: '📊 Level & Rank Card',
      description: 'Member: **{user.mention}**\nRank: **#3 on Server**',
      color: '#FEE75C',
      fields: [
        { name: 'Level', value: '18', inline: true },
        { name: 'XP Progress', value: '4,850 / 6,000 XP (80%)', inline: true },
        { name: 'Total Messages', value: '2,940', inline: true }
      ],
      footerText: 'Chat actively in channels to earn XP!',
      showTimestamp: false
    },
    cooldownSeconds: 5,
    requiredRole: 'everyone',
    usageCount: 2310,
    lastUsedAt: '4 mins ago'
  },
  {
    id: 'cmd-4',
    name: 'balance',
    description: 'View your cash wallet, bank account balance, and net worth.',
    category: 'economy',
    isSlash: true,
    isCustom: false,
    enabled: true,
    responseType: 'embed',
    textResponse: '',
    embed: {
      title: '🏦 Economy Vault',
      description: 'Account overview for **{user.mention}**',
      color: '#57F287',
      fields: [
        { name: '💵 Wallet', value: '2,450 Coins', inline: true },
        { name: '💳 Bank Deposit', value: '18,200 Coins', inline: true },
        { name: '💎 Net Worth', value: '20,650 Coins', inline: true }
      ],
      footerText: 'Claim /daily to collect bonus coins!',
      showTimestamp: true
    },
    buttons: [
      { id: 'btn-daily-shortcut', label: 'Claim Daily', style: 'success', action: 'balance' }
    ],
    cooldownSeconds: 3,
    requiredRole: 'everyone',
    usageCount: 1680,
    lastUsedAt: '8 mins ago'
  },
  {
    id: 'cmd-5',
    name: 'daily',
    description: 'Claim your daily coin reward and maintain your streak.',
    category: 'economy',
    isSlash: true,
    isCustom: false,
    enabled: true,
    responseType: 'text',
    textResponse: '💰 **Daily Reward Claimed!** You collected **500 Coins**! Your current login streak is **7 days** (+15% bonus applied).',
    embed: {
      title: '',
      description: '',
      color: '#57F287',
      fields: []
    },
    cooldownSeconds: 86400,
    requiredRole: 'everyone',
    usageCount: 980,
    lastUsedAt: '12 mins ago'
  },
  {
    id: 'cmd-6',
    name: 'warn',
    description: 'Issue an official moderation warning to a user with logged reason.',
    category: 'moderation',
    isSlash: true,
    isCustom: false,
    enabled: true,
    responseType: 'embed',
    textResponse: '',
    embed: {
      title: '⚠️ Moderation Warning Issued',
      description: 'User **{user.mention}** has been formally warned.',
      color: '#ED4245',
      fields: [
        { name: 'Reason', value: 'Rule violation / disruptive behavior', inline: false },
        { name: 'Moderator', value: '{staff.mention}', inline: true },
        { name: 'Infraction Total', value: 'Warning #1', inline: true }
      ],
      footerText: 'Infractions are saved in server database.',
      showTimestamp: true
    },
    cooldownSeconds: 2,
    requiredRole: 'moderator',
    usageCount: 145,
    lastUsedAt: '1 hour ago'
  },
  {
    id: 'cmd-7',
    name: 'purge',
    description: 'Bulk delete up to 100 messages in the current channel.',
    category: 'moderation',
    isSlash: true,
    isCustom: false,
    enabled: true,
    responseType: 'text',
    textResponse: '🧹 Successfully pruned and deleted **{args} messages** from this channel. Logged to mod logs.',
    embed: {
      title: '',
      description: '',
      color: '#ED4245',
      fields: []
    },
    cooldownSeconds: 5,
    requiredRole: 'moderator',
    usageCount: 312,
    lastUsedAt: '3 hours ago'
  },
  {
    id: 'cmd-8',
    name: 'rules',
    description: 'Display official server rules and guidelines for community members.',
    category: 'general',
    isSlash: true,
    isCustom: true,
    enabled: true,
    responseType: 'embed',
    textResponse: '',
    embed: {
      title: '📜 Server Community Guidelines',
      description: 'Welcome to our server! Please adhere to our guidelines to keep the community welcoming for all.',
      color: '#5865F2',
      fields: [
        { name: '1. Respect Everyone', value: 'No hate speech, harassment, discrimination, or offensive behavior.', inline: false },
        { name: '2. No Spam or Self-Promotion', value: 'Keep advertising to designated channels only.', inline: false },
        { name: '3. Follow Discord ToS', value: 'Zero tolerance for violations of Discord Community Guidelines.', inline: false }
      ],
      footerText: 'Server Staff Team · Be Kind',
      showTimestamp: true
    },
    cooldownSeconds: 10,
    requiredRole: 'everyone',
    usageCount: 654,
    lastUsedAt: '25 mins ago'
  },
  {
    id: 'cmd-9',
    name: 'socials',
    description: 'Official links to our YouTube, Twitter/X, GitHub, and Website.',
    category: 'utility',
    isSlash: true,
    isCustom: true,
    enabled: true,
    responseType: 'embed',
    textResponse: '',
    embed: {
      title: '🌐 Official Community Socials',
      description: 'Stay connected with our latest game updates, streams, and releases!',
      color: '#5865F2',
      fields: [
        { name: 'Website', value: '[https://aegisbot.dev](https://aegisbot.dev)', inline: true },
        { name: 'GitHub', value: '[github.com/aegis-discord](https://github.com)', inline: true },
        { name: 'Twitter / X', value: '[@AegisDiscord](https://twitter.com)', inline: true }
      ],
      footerText: 'Updated weekly',
      showTimestamp: false
    },
    buttons: [
      { id: 'btn-soc-web', label: 'Visit Website', style: 'link', url: 'https://github.com' }
    ],
    cooldownSeconds: 5,
    requiredRole: 'everyone',
    usageCount: 420,
    lastUsedAt: '40 mins ago'
  }
];

export const initialTickets: Ticket[] = [
  {
    id: 'tick-1001',
    ticketNumber: 1001,
    title: 'Ticket #1001 - Role Assignment Issue',
    subject: 'Did not receive VIP Supporter role after subscription',
    category: 'billing',
    status: 'open',
    priority: 'high',
    author: {
      id: 'usr-9812',
      username: 'Kaelen',
      tag: 'Kaelen#4120',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces'
    },
    createdAt: '25 mins ago',
    messages: [
      {
        id: 'msg-1',
        sender: 'bot',
        authorName: 'Aegis Ticket System',
        content: '👋 Hello **Kaelen#4120**! Thanks for opening a ticket. A staff member has been notified and will be with you shortly.',
        timestamp: '25 mins ago'
      },
      {
        id: 'msg-2',
        sender: 'user',
        authorName: 'Kaelen#4120',
        content: 'Hey staff! I just subscribed on Patreon about 30 mins ago and linked my Discord, but my VIP role has not updated in the server yet.',
        timestamp: '24 mins ago'
      }
    ]
  },
  {
    id: 'tick-1002',
    ticketNumber: 1002,
    title: 'Ticket #1002 - Tournament Team Roster Update',
    subject: 'Need to substitute our 4th player for weekend qualifiers',
    category: 'general',
    status: 'claimed',
    priority: 'normal',
    author: {
      id: 'usr-4412',
      username: 'Valkyrie',
      tag: 'Valkyrie#0001',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces'
    },
    assignedStaff: {
      id: 'staff-1',
      username: 'Mod_Alex',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=faces'
    },
    createdAt: '1 hour ago',
    messages: [
      {
        id: 'msg-1',
        sender: 'bot',
        authorName: 'Aegis Ticket System',
        content: 'Ticket created. Category: **General Support**',
        timestamp: '1 hour ago'
      },
      {
        id: 'msg-2',
        sender: 'user',
        authorName: 'Valkyrie#0001',
        content: 'Hi! Our teammate has an exam Saturday. Can we sub in @Zephyr#9911 for Team Obsidian?',
        timestamp: '58 mins ago'
      },
      {
        id: 'msg-3',
        sender: 'staff',
        authorName: 'Mod_Alex (Staff)',
        content: 'Hey Valkyrie, looking into your team registration now. Checking eligibility criteria.',
        timestamp: '42 mins ago'
      }
    ]
  },
  {
    id: 'tick-1000',
    ticketNumber: 1000,
    title: 'Ticket #1000 - Audio Bot Channel Lag',
    subject: 'High packet loss in voice channel 3',
    category: 'technical',
    status: 'closed',
    priority: 'low',
    author: {
      id: 'usr-3120',
      username: 'NexusRider',
      tag: 'NexusRider#8822',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=faces'
    },
    assignedStaff: {
      id: 'staff-2',
      username: 'Admin_Sarah',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces'
    },
    createdAt: 'Yesterday at 16:30',
    closedAt: 'Yesterday at 17:15',
    closeReason: 'Discord voice region switched to US-East. Packet loss resolved.',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        authorName: 'NexusRider#8822',
        content: 'Voice channel 3 has ~40% packet loss for everyone right now.',
        timestamp: 'Yesterday at 16:30'
      },
      {
        id: 'msg-2',
        sender: 'staff',
        authorName: 'Admin_Sarah (Admin)',
        content: 'Switched the voice server override to US-East RTC. All latency tests are back under 18ms!',
        timestamp: 'Yesterday at 17:12'
      },
      {
        id: 'msg-3',
        sender: 'bot',
        authorName: 'Aegis Ticket System',
        content: '🔒 Ticket closed by **Admin_Sarah**. Transcript saved to database.',
        timestamp: 'Yesterday at 17:15'
      }
    ]
  }
];

export const initialAutoMod: AutoModSettings = {
  badWordsFilterEnabled: true,
  bannedWords: ['nuke', 'free-nitro-scam', 'steam-gift-phish', 'raid-token', 'grabify', 'iplogger'],
  antiSpamEnabled: true,
  maxMessagesPer5Seconds: 5,
  antiInviteEnabled: true,
  antiCapsEnabled: true,
  capsThresholdPercent: 70,
  autoAction: 'warn',
  muteDurationMinutes: 10,
  infractions: [
    {
      id: 'inf-1',
      timestamp: '18 mins ago',
      userId: 'usr-7712',
      username: 'SpamBot_X9',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      ruleViolated: 'Anti-Discord Invite Links',
      actionTaken: 'message_deleted',
      reason: 'Posted unauthorized discord.gg invite link in #general',
      moderator: 'Aegis AutoMod Engine'
    },
    {
      id: 'inf-2',
      timestamp: '2 hours ago',
      userId: 'usr-8891',
      username: 'CryptoKing',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      ruleViolated: 'Banned Phishing Keyword',
      actionTaken: 'warned',
      reason: 'Triggered blacklisted phrase: steam-gift-phish',
      moderator: 'Aegis AutoMod Engine'
    },
    {
      id: 'inf-3',
      timestamp: '5 hours ago',
      userId: 'usr-3312',
      username: 'LoudGamer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
      ruleViolated: 'Excessive Caps Lock (>75%)',
      actionTaken: 'warned',
      reason: 'Full caps message in #announcements discussion',
      moderator: 'Aegis AutoMod Engine'
    }
  ]
};

export const initialProfiles: UserProfile[] = [
  {
    id: 'u-1',
    username: 'ZephyrBlade',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
    xp: 28450,
    level: 42,
    balance: 142500,
    bank: 450000,
    rank: 1,
    dailyStreak: 34
  },
  {
    id: 'u-2',
    username: 'AstraNova',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces',
    xp: 22100,
    level: 37,
    balance: 89000,
    bank: 210000,
    rank: 2,
    dailyStreak: 21
  },
  {
    id: 'u-3',
    username: 'Kaelen',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=faces',
    xp: 18450,
    level: 31,
    balance: 52400,
    bank: 120000,
    rank: 3,
    dailyStreak: 12
  },
  {
    id: 'u-4',
    username: 'ShadowByte',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=faces',
    xp: 14200,
    level: 26,
    balance: 31000,
    bank: 85000,
    rank: 4,
    dailyStreak: 9
  },
  {
    id: 'u-5',
    username: 'Valkyrie',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    xp: 11800,
    level: 22,
    balance: 24500,
    bank: 60000,
    rank: 5,
    dailyStreak: 6
  }
];

export const initialShopItems: ShopItem[] = [
  {
    id: 'item-1',
    name: 'VIP Bronze Supporter Role',
    price: 15000,
    description: 'Grants Bronze VIP badge and exclusive #vip-lounge channel access.',
    roleReward: 'VIP Bronze',
    icon: '🥉'
  },
  {
    id: 'item-2',
    name: 'Custom Server Nickname Color',
    price: 25000,
    description: 'Unlock custom gradient hex color on your Discord display name.',
    roleReward: 'Chroma Pass',
    icon: '🎨'
  },
  {
    id: 'item-3',
    name: 'XP Booster 2x (7 Days)',
    price: 35000,
    description: 'Double all experience earned from messaging in text channels.',
    icon: '⚡'
  },
  {
    id: 'item-4',
    name: 'Legendary Server Champion Role',
    price: 100000,
    description: 'Exclusive pinned role hoisted above moderators on member list.',
    roleReward: 'Champion',
    icon: '👑'
  }
];

export const initialAnalyticsFeed: AnalyticsEvent[] = [
  {
    id: 'ev-1',
    timestamp: 'Just now',
    type: 'command',
    user: 'ZephyrBlade#0001',
    action: 'Ran /help',
    details: 'Responded with interactive command center embed in #bot-commands'
  },
  {
    id: 'ev-2',
    timestamp: '2 mins ago',
    type: 'ticket',
    user: 'Kaelen#4120',
    action: 'Created Ticket #1001',
    details: 'Category: Billing · Auto-created channel #ticket-1001'
  },
  {
    id: 'ev-3',
    timestamp: '5 mins ago',
    type: 'economy',
    user: 'AstraNova#1234',
    action: 'Claimed /daily reward',
    details: 'Credited 500 Coins · 21-day streak milestone'
  },
  {
    id: 'ev-4',
    timestamp: '11 mins ago',
    type: 'mod',
    user: 'Mod_Alex',
    action: 'Issued /warn',
    details: 'Target: User#9821 · Reason: Disrespectful behavior'
  },
  {
    id: 'ev-5',
    timestamp: '18 mins ago',
    type: 'command',
    user: 'NexusRider#8822',
    action: 'Ran /rank',
    details: 'Rendered Level 26 rank card with 80% XP'
  }
];

export const initialHourlyActivity: ActivityHour[] = [
  { hour: '00:00', commands: 42, tickets: 3, chatMessages: 280 },
  { hour: '03:00', commands: 18, tickets: 1, chatMessages: 110 },
  { hour: '06:00', commands: 25, tickets: 2, chatMessages: 190 },
  { hour: '09:00', commands: 110, tickets: 8, chatMessages: 650 },
  { hour: '12:00', commands: 245, tickets: 14, chatMessages: 1420 },
  { hour: '15:00', commands: 380, tickets: 22, chatMessages: 2100 },
  { hour: '18:00', commands: 490, tickets: 19, chatMessages: 2950 },
  { hour: '21:00', commands: 420, tickets: 11, chatMessages: 2400 }
];
