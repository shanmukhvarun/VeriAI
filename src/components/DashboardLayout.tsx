// ============================
// VeriAI — Dashboard Layout (Sidebar + Topbar + Content)
// ============================

import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '../store';
import {
  LayoutDashboard, FileText, ShieldCheck, Building2, Brain,
  HardDrive, ClipboardList, History, BarChart3, Settings,
  Search, Bell, Moon, Sun, Menu, ChevronRight, X, LogOut
} from 'lucide-react';

const navItems = [
  { path: '/app', icon: LayoutDashboard, label: 'Overview', end: true },
  { path: '/app/applications', icon: FileText, label: 'Applications' },
  { path: '/app/documents', icon: ShieldCheck, label: 'Document Verification' },
  { path: '/app/records', icon: Building2, label: 'Institutional Records' },
  { path: '/app/compliance', icon: Brain, label: 'Compliance Intelligence' },
  { path: '/app/infrastructure', icon: HardDrive, label: 'Infrastructure Review' },
  { path: '/app/review', icon: ClipboardList, label: 'Review Queue', badge: true },
  { path: '/app/audit', icon: History, label: 'Audit Trail' },
  { path: '/app/reports', icon: BarChart3, label: 'Reports & Analytics' },
  { path: '/app/settings', icon: Settings, label: 'Settings' },
];

export default function DashboardLayout() {
  const { sidebarCollapsed, toggleSidebar, darkMode, toggleDarkMode, currentUser, notifications, markNotificationRead, globalSearch, setGlobalSearch } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const unreadCount = notifications.filter(n => !n.read).length;

  // Get breadcrumb from current path
  const currentNav = navItems.find(n => n.end ? location.pathname === n.path : location.pathname.startsWith(n.path) && n.path !== '/app');
  const breadcrumb = currentNav?.label || 'Overview';

  // Review queue badge count
  const reviewCount = useStore(s => s.applications.filter(a => a.status === 'under_review' || a.findings.some(f => f.reviewStatus === 'pending')).length);

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">V</div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">VeriAI</span>
            <span className="sidebar-brand-tagline">Verification Platform</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-title">Main</div>
          {navItems.slice(0, 6).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
          <div className="nav-section-title">Workflow</div>
          {navItems.slice(6).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon />
              <span className="nav-label">{item.label}</span>
              {item.badge && reviewCount > 0 && (
                <span className="nav-badge">{reviewCount}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: '16px', borderTop: '1px solid var(--color-border)' }}>
          <div className="nav-item" onClick={toggleSidebar} style={{ cursor: 'pointer' }}>
            <Menu />
            <span className="nav-label">{sidebarCollapsed ? 'Expand' : 'Collapse'}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content" style={{ marginLeft: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)' }}>
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <Menu size={20} />
            </button>
            <div className="breadcrumbs">
              VeriAI <ChevronRight size={14} /> <span>{breadcrumb}</span>
            </div>
          </div>

          <div className="topbar-search">
            <div className="search-input-wrapper">
              <Search />
              <input
                type="text"
                className="search-input"
                placeholder="Search applications, institutions, documents..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="topbar-right">
            <button className="topbar-btn" onClick={toggleDarkMode} title={darkMode ? 'Light mode' : 'Dark mode'}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div style={{ position: 'relative' }}>
              <button className="topbar-btn" onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}>
                <Bell size={20} />
                {unreadCount > 0 && <span className="notification-dot" />}
              </button>
              {showNotifications && (
                <div className="notification-dropdown">
                  <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '15px' }}>Notifications</strong>
                    <span className="badge badge-primary">{unreadCount} new</span>
                  </div>
                  {notifications.slice(0, 8).map((n) => (
                    <div
                      key={n.id}
                      className={`notification-item ${!n.read ? 'unread' : ''}`}
                      onClick={() => { markNotificationRead(n.id); }}
                    >
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%', marginTop: 6, flexShrink: 0,
                        background: n.type === 'danger' ? 'var(--color-danger)' : n.type === 'warning' ? 'var(--color-warning)' : n.type === 'success' ? 'var(--color-success)' : 'var(--color-info)'
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{n.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>{n.message}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 4 }}>
                          {new Date(n.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: '12px', textAlign: 'center', borderTop: '1px solid var(--color-border)' }}>
                    <NavLink to="/app/audit" style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }} onClick={() => setShowNotifications(false)}>
                      View All Activity →
                    </NavLink>
                  </div>
                </div>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <div className="user-avatar" onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}>
                {currentUser.avatar}
              </div>
              {showUserMenu && (
                <div className="notification-dropdown" style={{ width: 260, right: 0 }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{currentUser.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{currentUser.roleLabel}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{currentUser.email}</div>
                  </div>
                  <div style={{ padding: '8px' }}>
                    {[
                      { label: 'Administrator', user: 0 },
                      { label: 'Verification Officer', user: 1 },
                      { label: 'Compliance Reviewer', user: 2 },
                      { label: 'Institution Rep', user: 3 },
                    ].map(({ label, user }) => (
                      <div
                        key={user}
                        className="notification-item"
                        style={{ padding: '8px 12px', borderBottom: 'none', borderRadius: 8 }}
                        onClick={() => { useStore.getState().setCurrentUser(useStore.getState().currentUser.id === `u${user + 1}` ? useStore.getState().currentUser : { ...useStore.getState().currentUser }); import('../data').then(m => useStore.getState().setCurrentUser(m.demoUsers[user])); setShowUserMenu(false); }}
                      >
                        <span style={{ fontSize: 13 }}>Switch to {label}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '8px', borderTop: '1px solid var(--color-border)' }}>
                    <NavLink to="/" className="notification-item" style={{ padding: '8px 12px', borderBottom: 'none', borderRadius: 8, color: 'var(--color-danger)' }} onClick={() => setShowUserMenu(false)}>
                      <LogOut size={16} />
                      <span style={{ fontSize: 13 }}>Exit to Landing Page</span>
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-container" onClick={() => { setShowNotifications(false); setShowUserMenu(false); }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
