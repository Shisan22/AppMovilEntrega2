import React from 'react';
import { Card } from '../components/ui';
import { useTheme } from '../context/ThemeContext';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Moon, Sun, Bell, Shield, CircleHelp } from 'lucide-react';

export default function SettingsScreen({ 
  onBack, 
  onNavigatePrivacy, 
  onNavigateHelp 
}: { 
  onBack: () => void;
  onNavigatePrivacy: () => void;
  onNavigateHelp: () => void;
}) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { notificationsEnabled, toggleNotifications } = useAppContext();

  return (
    <div className="pb-24 md:pb-12 pt-8 px-6 max-w-md md:max-w-3xl mx-auto">
      <header className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-3 bg-stone-100 dark:bg-stone-800 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-4xl font-serif font-bold text-stone-900 dark:text-stone-100">
          Ajustes
        </h1>
      </header>

      <div className="space-y-6">
        {/* Appearance */}
        <div>
          <h2 className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3 ml-2">Apariencia</h2>
          <Card className="p-2 border-none shadow-sm dark:shadow-stone-900/50">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4 text-stone-800 dark:text-stone-200">
                <div className="bg-stone-100 dark:bg-stone-800 p-3 rounded-full">
                  {isDarkMode ? <Moon className="w-6 h-6 text-indigo-400" /> : <Sun className="w-6 h-6 text-orange-500" />}
                </div>
                <div>
                  <span className="font-semibold text-lg block">Modo Oscuro</span>
                  <span className="text-sm text-stone-500 dark:text-stone-400">Cambia el tema visual</span>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <button 
                onClick={toggleDarkMode}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${isDarkMode ? 'bg-indigo-500' : 'bg-stone-300'}`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${isDarkMode ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </Card>
        </div>

        {/* Notifications */}
        <div>
          <h2 className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3 ml-2">Notificaciones</h2>
          <Card className="p-2 border-none shadow-sm dark:shadow-stone-900/50 divide-y divide-stone-100 dark:divide-stone-800">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4 text-stone-800 dark:text-stone-200">
                <div className="bg-stone-100 dark:bg-stone-800 p-3 rounded-full">
                  <Bell className="w-6 h-6 text-stone-600 dark:text-stone-400" />
                </div>
                <span className="font-semibold text-lg">Recordatorios</span>
              </div>
              <button 
                onClick={toggleNotifications}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${notificationsEnabled ? 'bg-emerald-500' : 'bg-stone-300 dark:bg-stone-700'}`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${notificationsEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </Card>
        </div>

        {/* Other */}
        <div>
          <h2 className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3 ml-2">Acerca de</h2>
          <Card className="p-2 border-none shadow-sm dark:shadow-stone-900/50 divide-y divide-stone-100 dark:divide-stone-800">
            <button onClick={onNavigatePrivacy} className="w-full flex items-center justify-between p-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors rounded-t-2xl">
              <div className="flex items-center gap-4 text-stone-800 dark:text-stone-200">
                <div className="bg-stone-100 dark:bg-stone-800 p-3 rounded-full">
                  <Shield className="w-6 h-6 text-stone-600 dark:text-stone-400" />
                </div>
                <span className="font-semibold text-lg">Privacidad</span>
              </div>
              <span className="text-stone-300 dark:text-stone-600 font-bold text-xl">&gt;</span>
            </button>
            <button onClick={onNavigateHelp} className="w-full flex items-center justify-between p-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors rounded-b-2xl">
              <div className="flex items-center gap-4 text-stone-800 dark:text-stone-200">
                <div className="bg-stone-100 dark:bg-stone-800 p-3 rounded-full">
                  <CircleHelp className="w-6 h-6 text-stone-600 dark:text-stone-400" />
                </div>
                <span className="font-semibold text-lg">Ayuda y Soporte</span>
              </div>
              <span className="text-stone-300 dark:text-stone-600 font-bold text-xl">&gt;</span>
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
