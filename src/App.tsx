import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import RelaxScreen from './screens/RelaxScreen';
import ProfileScreen from './screens/ProfileScreen';
import EmergencyScreen from './screens/EmergencyScreen';
import SettingsScreen from './screens/SettingsScreen';
import { Home, Calendar, Wind, User, AlertCircle } from 'lucide-react';

function MainApp() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('home');

  if (!user) {
    return <AuthScreen />;
  }

  const renderScreen = () => {
    switch (currentTab) {
      case 'home': return <HomeScreen onNavigate={setCurrentTab} />;
      case 'calendar': return <CalendarScreen />;
      case 'relax': return <RelaxScreen />;
      case 'profile': return <ProfileScreen onNavigateSettings={() => setCurrentTab('settings')} />;
      case 'emergency': return <EmergencyScreen />;
      case 'settings': return <SettingsScreen onBack={() => setCurrentTab('profile')} />;
      default: return <HomeScreen onNavigate={setCurrentTab} />;
    }
  };

  return (
    <div className="h-full w-full bg-stone-100 dark:bg-stone-950 font-sans text-stone-900 dark:text-stone-100 flex flex-col md:flex-row relative overflow-hidden transition-colors duration-300">
      {/* Floating Pill Navigation (Mobile) / Sidebar (Desktop) */}
      <nav className="absolute md:relative bottom-6 md:bottom-auto left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0 bg-stone-900 dark:bg-stone-800 rounded-full md:rounded-none px-2 py-2 md:py-8 flex md:flex-col items-center justify-between md:justify-center md:gap-8 shadow-2xl w-[92%] max-w-[400px] md:w-28 md:max-w-none md:h-full z-50 transition-colors duration-300">
        <NavItem icon={<Home />} label="Inicio" isActive={currentTab === 'home'} onClick={() => setCurrentTab('home')} />
        <NavItem icon={<Calendar />} label="Agenda" isActive={currentTab === 'calendar'} onClick={() => setCurrentTab('calendar')} />
        <NavItem icon={<Wind />} label="Relax" isActive={currentTab === 'relax'} onClick={() => setCurrentTab('relax')} />
        <NavItem icon={<User />} label="Perfil" isActive={currentTab === 'profile'} onClick={() => setCurrentTab('profile')} />
        <NavItem icon={<AlertCircle />} label="SOS" isActive={currentTab === 'emergency'} onClick={() => setCurrentTab('emergency')} isEmergency />
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full pb-28 md:pb-0">
        {renderScreen()}
      </main>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick, isEmergency }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void, isEmergency?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`flex md:flex-col items-center justify-center gap-2 px-3 md:px-2 py-3 md:py-4 rounded-full md:rounded-2xl md:w-20 transition-all duration-300 ${
        isActive 
          ? isEmergency ? 'bg-rose-500 text-white' : 'bg-white/15 dark:bg-white/20 text-white' 
          : isEmergency ? 'text-rose-400 hover:text-rose-300' : 'text-stone-400 dark:text-stone-400 hover:text-stone-200 dark:hover:text-stone-200'
      }`}
    >
      {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5 md:w-6 md:h-6' })}
      {isActive && <span className="text-xs font-medium pr-1 md:pr-0">{label}</span>}
    </button>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <MainApp />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
