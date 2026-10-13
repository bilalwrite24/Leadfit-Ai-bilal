import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Workspace,
  NavigationTarget,
  Prospect,
  BuyingSignal,
  Campaign,
  Conversation,
  Meeting,
  Agent,
  Integration,
} from '../types';
import {
  initialUser,
  initialWorkspace,
  initialProspects,
  initialBuyingSignals,
  initialCampaigns,
  initialConversations,
  initialMeetings,
  initialAgents,
  initialIntegrations,
} from '../data/mockData';

interface Toast {
  id: string;
  text: string;
  type: 'success' | 'info' | 'error';
}

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  read: boolean;
  type: 'signal' | 'meeting' | 'lead' | 'system';
}

interface AppContextType {
  user: User | null;
  workspace: Workspace;
  currentPage: NavigationTarget;
  setCurrentPage: (page: NavigationTarget) => void;
  isAuthenticated: boolean;
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
  
  // Data states
  prospects: Prospect[];
  addProspect: (p: Prospect) => void;
  updateProspect: (id: string, updates: Partial<Prospect>) => void;
  deleteProspect: (id: string) => void;
  importProspects: (imported: Partial<Prospect>[]) => void;
  
  buyingSignals: BuyingSignal[];
  updateSignalStatus: (id: string, status: BuyingSignal['status']) => void;
  
  campaigns: Campaign[];
  addCampaign: (c: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  
  conversations: Conversation[];
  addConversationMessage: (convId: string, message: { sender: 'agent' | 'user'; text: string }) => void;
  updateConversationStatus: (convId: string, status: Conversation['status']) => void;
  
  meetings: Meeting[];
  addMeeting: (m: Meeting) => void;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  
  agents: Agent[];
  toggleAgentStatus: (id: string) => void;
  addAgent: (agent: Agent) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  
  integrations: Integration[];
  toggleIntegrationConnection: (id: string) => void;
  
  // Shell UI states
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  notifications: NotificationItem[];
  markNotificationsAsRead: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Toast notifications
  toastMessage: Toast | null;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;

  // Selected item modal/drawer states
  activeProspectDrawerId: string | null;
  setActiveProspectDrawerId: (id: string | null) => void;
  activeAgentDrawerId: string | null;
  setActiveAgentDrawerId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('leadfit_user');
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [workspace] = useState<Workspace>(initialWorkspace);
  const [currentPage, setCurrentPage] = useState<NavigationTarget>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Entities
  const [prospects, setProspects] = useState<Prospect[]>(() => {
    const saved = localStorage.getItem('leadfit_prospects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 90) {
          return parsed;
        }
      } catch {
        // Fallback to initialProspects
      }
    }
    return initialProspects;
  });

  const [buyingSignals, setBuyingSignals] = useState<BuyingSignal[]>(() => {
    const saved = localStorage.getItem('leadfit_signals');
    return saved ? JSON.parse(saved) : initialBuyingSignals;
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('leadfit_campaigns');
    return saved ? JSON.parse(saved) : initialCampaigns;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('leadfit_conversations');
    return saved ? JSON.parse(saved) : initialConversations;
  });

  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const saved = localStorage.getItem('leadfit_meetings');
    return saved ? JSON.parse(saved) : initialMeetings;
  });

  const [agents, setAgents] = useState<Agent[]>(() => {
    const saved = localStorage.getItem('leadfit_agents');
    return saved ? JSON.parse(saved) : initialAgents;
  });

  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);

  const [activeProspectDrawerId, setActiveProspectDrawerId] = useState<string | null>(null);
  const [activeAgentDrawerId, setActiveAgentDrawerId] = useState<string | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'New buying signal detected: NexusMetric Inc. $32M Series B',
      time: '2 hours ago',
      read: false,
      type: 'signal',
    },
    {
      id: 'notif-2',
      title: 'Meeting confirmed with Jordan Hayes (Apex Ledger)',
      time: '4 hours ago',
      read: false,
      type: 'meeting',
    },
    {
      id: 'notif-3',
      title: 'Prospect Discovery Agent identified 18 qualified SaaS leads',
      time: '6 hours ago',
      read: true,
      type: 'lead',
    },
  ]);

  // Toast
  const [toastMessage, setToastMessage] = useState<Toast | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const toast: Toast = { id: Math.random().toString(), text, type };
    setToastMessage(toast);
    setTimeout(() => {
      setToastMessage((cur) => (cur?.id === toast.id ? null : cur));
    }, 3800);
  };

  // Sync state to local storage for persistence across reloads
  useEffect(() => {
    if (user) {
      localStorage.setItem('leadfit_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('leadfit_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('leadfit_prospects', JSON.stringify(prospects));
  }, [prospects]);

  useEffect(() => {
    localStorage.setItem('leadfit_signals', JSON.stringify(buyingSignals));
  }, [buyingSignals]);

  useEffect(() => {
    localStorage.setItem('leadfit_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('leadfit_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('leadfit_meetings', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('leadfit_agents', JSON.stringify(agents));
  }, [agents]);

  // Keyboard shortcut for Command Palette (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const signIn = (email: string, name?: string) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name || 'Demo Executive',
      email: email || 'user@example.com',
      avatar: '/src/assets/images/avatar_user_profile_1791856742600.jpg',
      role: 'VP of Growth & Sales',
      company: 'Enterprise Growth Co',
      workspaceId: 'ws-001',
    };
    setUser(newUser);
    setCurrentPage('dashboard');
    showToast(`Signed in as ${newUser.name}`, 'success');
  };

  const signOut = () => {
    setUser(null);
    setCurrentPage('landing');
    showToast('Signed out successfully', 'info');
  };

  const addProspect = (p: Prospect) => {
    setProspects((prev) => [p, ...prev]);
    showToast(`Added prospect ${p.fullName}`, 'success');
  };

  const updateProspect = (id: string, updates: Partial<Prospect>) => {
    setProspects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Prospect updated', 'info');
  };

  const deleteProspect = (id: string) => {
    setProspects((prev) => prev.filter((p) => p.id !== id));
    showToast('Prospect removed', 'info');
  };

  const importProspects = (imported: Partial<Prospect>[]) => {
    const fullyTyped = imported.map((p, idx) => ({
      id: p.id || `imp-${Date.now()}-${idx}`,
      firstName: p.firstName || 'Unknown',
      lastName: p.lastName || '',
      fullName: p.fullName || `${p.firstName || ''} ${p.lastName || ''}`.trim(),
      title: p.title || 'Decision Maker',
      company: p.company || 'Enterprise Account',
      companyDomain: p.companyDomain || 'example.com',
      email: p.email || 'contact@example.com',
      emailStatus: p.emailStatus || 'unverified',
      linkedinUrl: p.linkedinUrl || '',
      location: p.location || 'United States',
      industry: p.industry || 'B2B Software',
      employeeCount: p.employeeCount || '50-200',
      icpScore: p.icpScore || 75,
      scoreExplanation: p.scoreExplanation || 'Imported via CSV file.',
      strengths: p.strengths || ['Imported target'],
      buyingSignals: p.buyingSignals || [],
      source: 'CSV Import' as const,
      owner: p.owner || user?.name || 'Sarah Jenkins',
      status: 'qualifying' as const,
      tags: ['CSV Import'],
      lastActivity: 'Imported today',
      notes: p.notes || ['Batch imported from CSV.'],
    })) as Prospect[];

    setProspects((prev) => [...fullyTyped, ...prev]);
    showToast(`Imported ${fullyTyped.length} prospects from CSV`, 'success');
  };

  const updateSignalStatus = (id: string, status: BuyingSignal['status']) => {
    setBuyingSignals((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    showToast(`Signal marked as ${status}`, 'info');
  };

  const addCampaign = (c: Campaign) => {
    setCampaigns((prev) => [c, ...prev]);
    showToast(`Campaign "${c.name}" created`, 'success');
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Campaign settings saved', 'info');
  };

  const addConversationMessage = (
    convId: string,
    message: { sender: 'agent' | 'user'; text: string }
  ) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: message.sender,
      text: message.text,
      timestamp: 'Just now',
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              messages: [...c.messages, newMessage],
              lastMessageAt: 'Just now',
              status: 'needs_reply',
            }
          : c
      )
    );
    showToast('Message sent (Approved)', 'success');
  };

  const updateConversationStatus = (
    convId: string,
    status: Conversation['status']
  ) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, status } : c))
    );
    showToast(`Conversation status set to ${status}`, 'info');
  };

  const addMeeting = (m: Meeting) => {
    setMeetings((prev) => [m, ...prev]);
    showToast(`Meeting with ${m.prospectName} scheduled`, 'success');
  };

  const updateMeeting = (id: string, updates: Partial<Meeting>) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    showToast('Meeting updated', 'info');
  };

  const toggleAgentStatus = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextStatus = a.status === 'active' ? 'paused' : 'active';
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
    showToast('Agent status updated', 'info');
  };

  const addAgent = (agent: Agent) => {
    setAgents((prev) => [agent, ...prev]);
    showToast(`Agent "${agent.name}" deployed`, 'success');
  };

  const updateAgent = (id: string, updates: Partial<Agent>) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
    showToast('Agent configuration saved', 'info');
  };

  const toggleIntegrationConnection = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStatus = !item.connected;
          return { ...item, connected: newStatus };
        }
        return item;
      })
    );
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        workspace,
        currentPage,
        setCurrentPage,
        isAuthenticated: !!user,
        signIn,
        signOut,
        prospects,
        addProspect,
        updateProspect,
        deleteProspect,
        importProspects,
        buyingSignals,
        updateSignalStatus,
        campaigns,
        addCampaign,
        updateCampaign,
        conversations,
        addConversationMessage,
        updateConversationStatus,
        meetings,
        addMeeting,
        updateMeeting,
        agents,
        toggleAgentStatus,
        addAgent,
        updateAgent,
        integrations,
        toggleIntegrationConnection,
        commandPaletteOpen,
        setCommandPaletteOpen,
        notifications,
        markNotificationsAsRead,
        sidebarCollapsed,
        setSidebarCollapsed,
        isDarkMode,
        toggleDarkMode,
        toastMessage,
        showToast,
        activeProspectDrawerId,
        setActiveProspectDrawerId,
        activeAgentDrawerId,
        setActiveAgentDrawerId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
