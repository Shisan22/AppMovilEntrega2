import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { Card, Button } from '../components/ui';
import { Bell, Heart, Coffee, BookOpen, Smile, Frown, Meh, AlertCircle, Quote, Wind, CheckCircle2 } from 'lucide-react';
import { ACTIVE_BREAK_TIPS, MOTIVATIONAL_QUOTES, RELAXATION_VIDEOS } from '../utils/constants';
import { format, isToday, parseISO, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

export default function HomeScreen({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { user } = useAuth();
  const { events, surveys, addSurvey, notifications, markAllNotificationsRead, notificationsEnabled } = useAppContext();
  const [activeTip, setActiveTip] = useState('');
  const [quote, setQuote] = useState('');
  const [showSurvey, setShowSurvey] = useState(false);
  const [mood, setMood] = useState(3);
  const [sleep, setSleep] = useState(7);
  const [stress, setStress] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveTip(ACTIVE_BREAK_TIPS[Math.floor(Math.random() * ACTIVE_BREAK_TIPS.length)]);
    setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);

    const todayStr = new Date().toISOString().split('T')[0];
    const hasSurveyToday = surveys.some(s => s.date.startsWith(todayStr));
    if (!hasSurveyToday) {
      setShowSurvey(true);
    }
  }, [surveys]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSurveySubmit = () => {
    addSurvey({
      date: new Date().toISOString(),
      mood,
      sleepHours: sleep,
      stressLevel: stress,
    });
    setShowSurvey(false);
  };

  const todaysEvents = events.filter(e => isToday(parseISO(e.date)));
  const unreadNotifs = notifications.filter(n => !n.read).length;

  // Calculate weekly averages
  const last7DaysSurveys = surveys.filter(s => new Date(s.date) >= subDays(new Date(), 7));
  const avgMood = last7DaysSurveys.length > 0 
    ? (last7DaysSurveys.reduce((acc, curr) => acc + curr.mood, 0) / last7DaysSurveys.length).toFixed(1)
    : '-';
  const avgSleep = last7DaysSurveys.length > 0 
    ? (last7DaysSurveys.reduce((acc, curr) => acc + curr.sleepHours, 0) / last7DaysSurveys.length).toFixed(1)
    : '-';

  return (
    <div className="pb-24 md:pb-12 pt-20 px-6 max-w-md md:max-w-6xl mx-auto">
      <header className="flex justify-between items-start mb-10 relative">
        <div>
          <h1 className="text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 leading-tight">
            Hola,<br/>{user?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-2 font-medium">¿Cómo te sientes hoy?</p>
        </div>
        
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (showNotifications && unreadNotifs > 0) markAllNotificationsRead();
            }}
            className="relative bg-white dark:bg-stone-800 p-3 rounded-full shadow-sm hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
          >
            <Bell className="w-6 h-6 text-stone-600 dark:text-stone-300" />
            {notificationsEnabled && unreadNotifs > 0 && (
              <span className="absolute top-2 right-2 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-stone-800"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-stone-800 rounded-3xl shadow-2xl border border-stone-100 dark:border-stone-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="p-4 border-b border-stone-100 dark:border-stone-700 flex justify-between items-center bg-stone-50/50 dark:bg-stone-800/50">
                <h3 className="font-semibold text-stone-900 dark:text-stone-100">Notificaciones</h3>
                {unreadNotifs > 0 && (
                  <button onClick={markAllNotificationsRead} className="text-xs text-orange-500 hover:text-orange-600 font-medium">
                    Marcar leídas
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {!notificationsEnabled ? (
                  <div className="p-8 text-center text-stone-500 dark:text-stone-400 text-sm">
                    <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    Las notificaciones están desactivadas.
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-stone-500 dark:text-stone-400 text-sm">
                    No tienes notificaciones nuevas.
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100 dark:divide-stone-700/50">
                    {notifications.map(notif => (
                      <div key={notif.id} className={`p-4 transition-colors ${!notif.read ? 'bg-orange-50/50 dark:bg-orange-900/10' : ''}`}>
                        <div className="flex gap-3">
                          <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${!notif.read ? 'bg-orange-500' : 'bg-transparent'}`} />
                          <div>
                            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-0.5">{notif.title}</p>
                            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">{notif.message}</p>
                            <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-2 font-medium uppercase tracking-wider">
                              {format(parseISO(notif.date), "d MMM, HH:mm", { locale: es })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="md:grid md:grid-cols-12 md:gap-8 items-start">
        <div className="md:col-span-7 lg:col-span-8 space-y-8 flex flex-col">
          {/* Quote of the Day */}
          <Card className="bg-stone-50 dark:bg-stone-800/50 border-none shadow-sm p-6 relative">
            <Quote className="absolute top-4 right-4 w-12 h-12 text-stone-200 dark:text-stone-700 opacity-50" />
            <p className="font-serif text-lg text-stone-700 dark:text-stone-300 italic relative z-10 pr-8">
              "{quote}"
            </p>
          </Card>

          {/* Active Break Tip */}
          <Card className="bg-stone-900 dark:bg-stone-800 text-stone-100 p-6 border-none shadow-xl shadow-stone-900/10 dark:shadow-stone-900/50 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-stone-800 dark:bg-stone-700 rounded-full opacity-50"></div>
            <div className="relative z-10 flex items-start gap-5">
              <div className="bg-stone-800 dark:bg-stone-700 p-4 rounded-2xl text-orange-300">
                <Coffee className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold text-orange-300 mb-2">Pausa Activa</h3>
                <p className="text-sm text-stone-300 dark:text-stone-200 leading-relaxed font-medium">{activeTip}</p>
              </div>
            </div>
          </Card>

          {/* Today's Agenda */}
          <div className="order-last md:order-none">
            <h2 className="text-2xl font-serif font-semibold text-stone-900 dark:text-stone-100 mb-5 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-stone-400 dark:text-stone-500" />
              Agenda de Hoy
            </h2>
            
            {todaysEvents.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-[32px] border border-dashed border-stone-200 dark:border-stone-800">
                <p className="text-stone-400 dark:text-stone-500 font-medium">No tienes eventos para hoy.<br/>¡Disfruta tu día!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todaysEvents.map(event => (
                  <Card key={event.id} className="p-5 flex items-center gap-5 border-none shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-3 h-12 rounded-full ${
                      event.type === 'academic' ? 'bg-blue-400' : 
                      event.type === 'health' ? 'bg-emerald-400' : 'bg-purple-400'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-lg">{event.title}</h4>
                      <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 font-medium">
                        {format(parseISO(event.date), "h:mm a", { locale: es })} • {event.type === 'academic' ? 'Académico' : event.type === 'health' ? 'Salud' : 'Personal'}
                      </p>
                    </div>
                    {event.reminder && <AlertCircle className="w-6 h-6 text-orange-400" />}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-5 lg:col-span-4 mt-8 md:mt-0">
          {/* Daily Survey */}
          {showSurvey && (
            <Card className="p-6 bg-orange-100/80 dark:bg-orange-900/20 border-none shadow-sm">
              <h3 className="font-serif text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-6 flex items-center gap-3">
                <Heart className="w-6 h-6 text-orange-500" />
                Check-in Diario
              </h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">Estado de ánimo</p>
                  <div className="flex justify-between bg-white dark:bg-stone-800 p-2 rounded-full shadow-sm">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        onClick={() => setMood(val)}
                        className={`p-3 rounded-full transition-all duration-300 ${mood === val ? 'bg-orange-200 dark:bg-orange-500/20 text-orange-900 dark:text-orange-300 scale-110 shadow-md' : 'bg-transparent text-stone-400 dark:text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-700'}`}
                      >
                        {val === 1 && <Frown className="w-6 h-6" />}
                        {val === 3 && <Meh className="w-6 h-6" />}
                        {val === 5 && <Smile className="w-6 h-6" />}
                        {(val === 2 || val === 4) && <div className="w-6 h-6 flex items-center justify-center font-bold">{val}</div>}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3 flex justify-between">
                    <span>Horas de sueño</span>
                    <span className="text-orange-600 dark:text-orange-400 bg-orange-200/50 dark:bg-orange-500/20 px-2 py-0.5 rounded-md">{sleep}h</span>
                  </p>
                  <input 
                    type="range" 
                    min="0" max="12" 
                    value={sleep} 
                    onChange={(e) => setSleep(Number(e.target.value))}
                    className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-orange-500" 
                  />
                </div>

                <Button onClick={handleSurveySubmit} className="w-full bg-orange-500 hover:bg-orange-600 text-white border-none shadow-md shadow-orange-500/20">
                  Guardar mi día
                </Button>
              </div>
            </Card>
          )}

          {/* Weekly Summary */}
          {!showSurvey && (
            <Card className="p-6 bg-white dark:bg-stone-800 border-none shadow-sm mb-8">
              <h3 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-100 mb-5">Resumen Semanal</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-50 dark:bg-stone-900/50 p-4 rounded-2xl text-center">
                  <p className="text-stone-500 dark:text-stone-400 text-xs font-semibold uppercase tracking-wider mb-1">Ánimo Promedio</p>
                  <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{avgMood}</p>
                </div>
                <div className="bg-stone-50 dark:bg-stone-900/50 p-4 rounded-2xl text-center">
                  <p className="text-stone-500 dark:text-stone-400 text-xs font-semibold uppercase tracking-wider mb-1">Sueño Promedio</p>
                  <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{avgSleep}h</p>
                </div>
              </div>
            </Card>
          )}

          {/* Quick Relax Shortcut */}
          <Card className="p-6 bg-emerald-900 text-white border-none shadow-xl shadow-emerald-900/20 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => onNavigate && onNavigate('relax')}>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-800 rounded-full opacity-50"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-semibold mb-1">Momento Zen</h3>
                <p className="text-emerald-200 text-sm">Tómate 5 minutos para ti</p>
              </div>
              <div className="bg-emerald-800 p-3 rounded-full">
                <Wind className="w-6 h-6 text-emerald-300" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
