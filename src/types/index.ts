export type CommandCategory = 'general' | 'utility' | 'moderation' | 'fun' | 'economy' | 'tickets';

export type CommandResponseType = 'text' | 'embed' | 'buttons';

export interface EmbedField {
  name: string;
  value: string;
  inline: boolean;
}

export interface DiscordEmbedData {
  title: string;
  description: string;
  color: string;
  fields: EmbedField[];
  footerText?: string;
  showTimestamp?: boolean;
  authorName?: string;
  thumbnailUrl?: string;
}

export interface CommandButton {
  id: string;
  label: string;
  style: 'primary' | 'secondary' | 'success' | 'danger' | 'link';
  url?: string;
  customId?: string;
  action?: 'ticket_create' | 'website' | 'balance' | 'ping';
}

export interface BotCommand {
  id: string;
  name: string;
  description: string;
  category: CommandCategory;
  isSlash: boolean;
  isCustom: boolean;
  enabled: boolean;
  responseType: CommandResponseType;
  textResponse: string;
  embed: DiscordEmbedData;
  buttons?: CommandButton[];
  cooldownSeconds: number;
  requiredRole: 'everyone' | 'moderator' | 'admin';
  usageCount: number;
  lastUsedAt?: string;
}

export type TicketCategory = 'general' | 'technical' | 'billing' | 'report';
export type TicketStatus = 'open' | 'claimed' | 'closed';
export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface TicketMessage {
  id: string;
  sender: 'user' | 'staff' | 'bot';
  authorName: string;
  avatar?: string;
  content: string;
  timestamp: string;
  isInternalNote?: boolean;
  embed?: DiscordEmbedData;
}

export interface Ticket {
  id: string;
  ticketNumber: number;
  title: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  author: {
    id: string;
    username: string;
    tag: string;
    avatar: string;
  };
  assignedStaff?: {
    id: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
  closedAt?: string;
  closeReason?: string;
  messages: TicketMessage[];
}

export interface InfractionLog {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  avatar: string;
  ruleViolated: string;
  actionTaken: 'warned' | 'timeout' | 'kicked' | 'banned' | 'message_deleted';
  reason: string;
  moderator: string;
}

export interface AutoModSettings {
  badWordsFilterEnabled: boolean;
  bannedWords: string[];
  antiSpamEnabled: boolean;
  maxMessagesPer5Seconds: number;
  antiInviteEnabled: boolean;
  antiCapsEnabled: boolean;
  capsThresholdPercent: number;
  autoAction: 'warn' | 'mute' | 'delete';
  muteDurationMinutes: number;
  infractions: InfractionLog[];
}

export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  balance: number;
  bank: number;
  rank: number;
  dailyStreak: number;
  lastDailyClaim?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  description: string;
  roleReward?: string;
  icon: string;
}

export interface AnalyticsEvent {
  id: string;
  timestamp: string;
  type: 'command' | 'ticket' | 'mod' | 'economy';
  user: string;
  action: string;
  details: string;
}

export interface ActivityHour {
  hour: string;
  commands: number;
  tickets: number;
  chatMessages: number;
}

export interface GuildInfo {
  id: string;
  name: string;
  icon: string;
  memberCount: number;
  onlineCount: number;
  prefix: string;
  welcomeChannelId: string;
  logChannelId: string;
  ticketCategoryId: string;
  autoRoleId?: string;
}

export interface BotConfig {
  botToken: string;
  clientId: string;
  guildId: string;
  databaseUrl: string;
  statusMessage: string;
  activityType: 'PLAYING' | 'LISTENING' | 'WATCHING' | 'COMPETING';
  statusMode: 'online' | 'idle' | 'dnd';
  prefix: string;
}
