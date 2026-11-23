import React, { useState, useEffect } from 'react';
import { useRoute, navigateTo, RoutePath } from './router';
import { store } from './store';
import { useActions } from './actions';
import {
  Home,
  Heart,
  Activity,
  Moon,
  Apple,
  Pill,
  FlaskConical,
  Stethoscope,
  BarChart3,
  Settings,
  HelpCircle,
  Search,
  Sun,
  Plus,
} from './ui/icons';
import { ToastUndoQueue } from './ui/overlay';
import { QuickFinder } from './finder';

// Import all 11 pages
import { HomePage } from './pages/home';
import { VitalsPage } from './pages/vitals';
import { ActivityPage } from './pages/activity';
import { SleepPage } from './pages/sleep';
import { FoodPage } from './pages/food';
import { MedsPage } from './pages/meds';
import { RecordsPage } from './pages/records';
import { CarePage } from './pages/care';
import { ReportsPage } from './pages/reports';
import { SettingsPage } from './pages/settings';
import { HelpPage } from './pages/help';

export const App: React.FC = () => {
  const currentRoute = useRoute();
  const [state, setState] = useState(store.getState());
  const [isFinderOpen, setIsFinderOpen] = useState(false);

  useEffect(() => {
    const unsub = store.subscribe(() => setState(store.getState()));
    // Set initial theme attribute on mount
    document.documentElement.setAttribute('data-theme', state.profile.theme);
    return unsub;
  }, [state.profile.theme]);

  // Global Keyboard listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsFinderOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems: { id: RoutePath; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'home', label: 'Overview', icon: <Home size={17} /> },
    { id: 'vitals', label: 'Vitals', icon: <Heart size={17} /> },
    { id: 'activity', label: 'Activity', icon: <Activity size={17} /> },
    { id: 'sleep', label: 'Sleep', icon: <Moon size={17} /> },
    { id: 'food', label: 'Nutrition', icon: <Apple size={17} /> },
    { id: 'meds', label: 'Medicines', icon: <Pill size={17} />, badge: state.medications.length },
    { id: 'records', label: 'Records', icon: <FlaskConical size={17} /> },
    { id: 'care', label: 'Care', icon: <Stethoscope size={17} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 size={17} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={17} /> },
    { id: 'help', label: 'Help', icon: <HelpCircle size={17} /> },
  ];

  const renderActivePage = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage />;
      case 'vitals':
        return <VitalsPage />;
      case 'activity':
        return <ActivityPage />;
      case 'sleep':
        return <SleepPage />;
      case 'food':
        return <FoodPage />;
      case 'meds':
        return <MedsPage />;
      case 'records':
        return <RecordsPage />;
      case 'care':
        return <CarePage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'help':
        return <HelpPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app">
      <div className="frame">
        {/* Top Header with Brand, Horizontal Nav, Search, Log, Theme, Profile */}
        <header className="top">
          <div className="brand" onClick={() => navigateTo('home')}>
            <span className="brand-dot"></span>
            <span>Halsa</span>
          </div>

          <nav className="nav">
            {navItems.map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <a
                  key={item.id}
                  href={`#/${item.id}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(item.id);
                  }}
                >
                  {item.icon}
                  <span className="nav__label">{item.label}</span>
                  {item.badge !== undefined && <span className="nav__count">{item.badge}</span>}
                </a>
              );
            })}
          </nav>

          <div className="top__spacer"></div>

          <button className="searchpill" onClick={() => setIsFinderOpen(true)}>
            <Search size={15} />
            <span>Search</span>
            <kbd>⌘K</kbd>
          </button>

          <button className="top__log" onClick={() => navigateTo('vitals')}>
            <Plus size={15} />
            <span>Log</span>
          </button>

          <button
            className="top__theme"
            onClick={() => store.setTheme(state.profile.theme === 'light' ? 'dark' : 'light')}
            title="Toggle theme"
          >
            {state.profile.theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <div className="top__me" onClick={() => navigateTo('settings')} title="Profile & Settings">
            <span>AR</span>
            <span className="av__dot"></span>
          </div>
        </header>

        {/* Dynamic Page Body */}
        <main className="page">{renderActivePage()}</main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav className="mobile-tab-bar">
        {[
          { id: 'home', label: 'Home', icon: <Home size={18} /> },
          { id: 'vitals', label: 'Vitals', icon: <Heart size={18} /> },
          { id: 'meds', label: 'Meds', icon: <Pill size={18} /> },
          { id: 'care', label: 'Care', icon: <Stethoscope size={18} /> },
          { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
        ].map((item) => (
          <a
            key={item.id}
            href={`#/${item.id}`}
            className={`mobile-tab-item ${currentRoute === item.id ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              navigateTo(item.id as RoutePath);
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Reversible Action Undo Notification Toast */}
      <ToastUndoQueue />

      {/* Cmd+K Spotlight Modal */}
      <QuickFinder isOpen={isFinderOpen} onClose={() => setIsFinderOpen(false)} />
    </div>
  );
};
