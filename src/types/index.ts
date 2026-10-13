export type PublicPage =
  | 'landing'
  | 'features'
  | 'how-it-works'
  | 'integrations-public'
  | 'pricing'
  | 'developer'
  | 'sign-in'
  | 'sign-up'
  | 'privacy'
  | 'terms';

export type AppPage =
  | 'dashboard'
  | 'agents'
  | 'lead-finder'
  | 'buying-signals'
  | 'prospects'
  | 'campaigns'
  | 'inbox'
  | 'meetings'
  | 'analytics'
  | 'integrations'
  | 'developer'
  | 'settings';

export type NavigationTarget = PublicPage | AppPage;

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  company: string;
  workspaceId: string;
}

export interface Workspace {
  id: string;
  name: string;
  plan: 'Free Unlimited (All Unlocked)' | 'Free' | 'Growth AI' | 'Scale' | 'Enterprise' | string;
  seatCount: number;
  domain: string;
  createdDate: string;
}

export type AgentRole =
  | 'Prospect Discovery Agent'
  | 'Buying Signal Research Agent'
  | 'Lead Qualification Agent'
  | 'Outreach Personalization Agent'
  | 'Reply Classification Assistant';

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  description: string;
  targetICP: string;
  status: 'active' | 'paused' | 'draft';
  lastRun: string;
  leadsDiscovered: number;
  qualificationRate: number;
  cadence: string;
  filters: {
    industries: string[];
    companySizes: string[];
    locations: string[];
    seniority: string[];
  };
  activityLog: {
    timestamp: string;
    action: string;
    details: string;
  }[];
}

export interface BuyingSignal {
  id: string;
  company: string;
  domain: string;
  signalType:
    | 'funding'
    | 'hiring'
    | 'leadership'
    | 'tech_adoption'
    | 'announcement'
    | 'competitor_engagement';
  summary: string;
  sourceUrl?: string;
  verifiedSource: boolean;
  observedDate: string;
  confidence: number; // 0.0 - 1.0
  relevanceExplanation: string;
  matchedICP: string;
  status: 'new' | 'reviewed' | 'actioned' | 'dismissed';
}

export interface Prospect {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  title: string;
  company: string;
  companyDomain: string;
  email: string;
  emailStatus: 'verified' | 'unverified' | 'catch-all';
  linkedinUrl?: string;
  location: string;
  industry: string;
  employeeCount: string;
  icpScore: number; // 0 - 100
  scoreExplanation: string;
  strengths: string[];
  buyingSignals: {
    type: string;
    summary: string;
    date: string;
  }[];
  source: 'AI Discovery' | 'CSV Import' | 'Signal Radar' | 'Manual';
  owner: string;
  status:
    | 'new'
    | 'qualifying'
    | 'ready_for_outreach'
    | 'contacted'
    | 'meeting_scheduled'
    | 'nurture'
    | 'disqualified';
  tags: string[];
  lastActivity: string;
  notes: string[];
  companyResearchSummary?: string;
  keyAngles?: string[];
}

export interface CampaignStep {
  id: string;
  stepNumber: number;
  channel: 'email' | 'linkedin';
  delayDays: number;
  subject?: string;
  template: string;
  requiresApproval: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  targetAudience: string;
  prospectCount: number;
  steps: CampaignStep[];
  sentCount: number;
  openRate: number; // e.g. 68.4
  replyRate: number; // e.g. 24.1
  positiveReplyRate: number; // e.g. 14.8
  meetingsBooked: number;
  createdAt: string;
}

export interface ConversationMessage {
  id: string;
  sender: 'prospect' | 'agent' | 'user';
  text: string;
  timestamp: string;
  subject?: string;
}

export interface Conversation {
  id: string;
  prospectId: string;
  prospectName: string;
  prospectTitle: string;
  company: string;
  avatar?: string;
  channel: 'email' | 'linkedin';
  status: 'unread' | 'needs_reply' | 'interested' | 'not_interested' | 'meeting_booked' | 'archived';
  messages: ConversationMessage[];
  lastMessageAt: string;
  suggestedReply?: string;
  intentCategory?: string;
}

export interface Meeting {
  id: string;
  prospectId: string;
  prospectName: string;
  prospectTitle: string;
  company: string;
  title: string;
  date: string;
  time: string;
  durationMinutes: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  outcome?: string;
  notes: string;
  followUpTasks: string[];
  calendarSynced: boolean;
  meetingLink?: string;
}

export interface Integration {
  id: string;
  name: string;
  category: 'AI Engine' | 'Email & Calendar' | 'Data Providers' | 'CRM' | 'Workflow';
  description: string;
  connected: boolean;
  requiredPermissions: string[];
  authType: 'oauth' | 'api_key' | 'webhook';
  configKey?: string;
  setupInstructions: string;
}
