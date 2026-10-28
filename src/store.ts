// ============================
// VeriAI — Global State Store (Zustand)
// ============================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Application, Notification, DemoUser, Finding, ReviewEntry, AuditEvent, ComplianceRule } from './types';
import { applications as seedApps, initialNotifications, demoUsers, complianceRules as seedRules } from './data';

interface AppState {
  // Auth
  currentUser: DemoUser;
  setCurrentUser: (user: DemoUser) => void;

  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Applications
  applications: Application[];
  getApplication: (id: string) => Application | undefined;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  addReviewEntry: (appId: string, entry: ReviewEntry) => void;
  addAuditEvent: (appId: string, event: AuditEvent) => void;
  resolveFinding: (appId: string, findingId: string, resolvedBy: string) => void;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  unreadCount: () => number;

  // Compliance Rules
  complianceRules: ComplianceRule[];
  addComplianceRule: (rule: ComplianceRule) => void;
  updateComplianceRule: (id: string, updates: Partial<ComplianceRule>) => void;

  // Search
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      currentUser: demoUsers[0],
      setCurrentUser: (user) => set({ currentUser: user }),

      // Theme
      darkMode: false,
      toggleDarkMode: () => {
        set((s) => {
          const newMode = !s.darkMode;
          document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
          return { darkMode: newMode };
        });
      },

      // Sidebar
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      // Applications
      applications: seedApps,
      getApplication: (id) => get().applications.find((a) => a.id === id),
      updateApplication: (id, updates) =>
        set((s) => ({
          applications: s.applications.map((a) =>
            a.id === id ? { ...a, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : a
          ),
        })),
      addReviewEntry: (appId, entry) =>
        set((s) => ({
          applications: s.applications.map((a) =>
            a.id === appId ? { ...a, reviewHistory: [...a.reviewHistory, entry] } : a
          ),
        })),
      addAuditEvent: (appId, event) =>
        set((s) => ({
          applications: s.applications.map((a) =>
            a.id === appId ? { ...a, auditTrail: [...a.auditTrail, event] } : a
          ),
        })),
      resolveFinding: (appId, findingId, resolvedBy) =>
        set((s) => ({
          applications: s.applications.map((a) =>
            a.id === appId
              ? {
                  ...a,
                  findings: a.findings.map((f) =>
                    f.id === findingId
                      ? { ...f, reviewStatus: 'resolved' as const, resolvedAt: new Date().toISOString(), resolvedBy }
                      : f
                  ),
                  riskScore: Math.max(0, a.riskScore - 10),
                }
              : a
          ),
        })),

      // Notifications
      notifications: initialNotifications,
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      dismissNotification: (id) =>
        set((s) => ({
          notifications: s.notifications.filter((n) => n.id !== id),
        })),
      unreadCount: () => get().notifications.filter((n) => !n.read).length,

      // Compliance Rules
      complianceRules: seedRules,
      addComplianceRule: (rule) =>
        set((s) => ({ complianceRules: [...s.complianceRules, rule] })),
      updateComplianceRule: (id, updates) =>
        set((s) => ({
          complianceRules: s.complianceRules.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      // Search
      globalSearch: '',
      setGlobalSearch: (q) => set({ globalSearch: q }),
    }),
    {
      name: 'veriai-store',
      partialize: (state) => ({
        darkMode: state.darkMode,
        sidebarCollapsed: state.sidebarCollapsed,
        currentUser: state.currentUser,
        applications: state.applications,
        notifications: state.notifications,
        complianceRules: state.complianceRules,
      }),
    }
  )
);
