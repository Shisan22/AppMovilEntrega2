import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppEvent, SurveyResponse, Feedback } from '../types';
import { storage } from '../utils/storage';
import { useAuth } from './AuthContext';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'reminder';
}

export interface AppContextType {
  events: AppEvent[];
  addEvent: (event: Omit<AppEvent, 'id' | 'userId'>) => void;
  removeEvent: (id: string) => void;
  surveys: SurveyResponse[];
  addSurvey: (survey: Omit<SurveyResponse, 'id' | 'userId'>) => void;
  addFeedback: (message: string) => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  notifications: NotificationItem[];
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('koru_notifications');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (user) {
      setEvents(storage.getEvents(user.id));
      setSurveys(storage.getSurveys(user.id));
      
      // Mock some notifications for demo purposes
      const mockNotifications: NotificationItem[] = [
        { id: 'n1', title: '¡Bienvenido a KORU!', message: 'Explora todas las herramientas que tenemos para tu bienestar.', date: new Date().toISOString(), read: false, type: 'info' },
        { id: 'n2', title: 'Recordatorio', message: 'No olvides hacer tu check-in diario para llevar un registro de tu estado de ánimo.', date: new Date(Date.now() - 86400000).toISOString(), read: false, type: 'reminder' }
      ];
      
      const savedNotifs = localStorage.getItem(`koru_notifs_${user.id}`);
      if (savedNotifs) {
        setNotifications(JSON.parse(savedNotifs));
      } else {
        setNotifications(mockNotifications);
        localStorage.setItem(`koru_notifs_${user.id}`, JSON.stringify(mockNotifications));
      }
    } else {
      setEvents([]);
      setSurveys([]);
      setNotifications([]);
    }
  }, [user]);

  const toggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem('koru_notifications', JSON.stringify(newValue));
  };

  const markAllNotificationsRead = () => {
    if (!user) return;
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem(`koru_notifs_${user.id}`, JSON.stringify(updated));
  };

  const addEvent = (eventData: Omit<AppEvent, 'id' | 'userId'>) => {
    if (!user) return;
    const newEvent: AppEvent = {
      ...eventData,
      id: Date.now().toString(),
      userId: user.id,
    };
    storage.saveEvent(newEvent);
    setEvents(storage.getEvents(user.id));
  };

  const removeEvent = (id: string) => {
    if (!user) return;
    storage.deleteEvent(id);
    setEvents(storage.getEvents(user.id));
  };

  const addSurvey = (surveyData: Omit<SurveyResponse, 'id' | 'userId'>) => {
    if (!user) return;
    const newSurvey: SurveyResponse = {
      ...surveyData,
      id: Date.now().toString(),
      userId: user.id,
    };
    storage.saveSurvey(newSurvey);
    setSurveys(storage.getSurveys(user.id));
  };

  const addFeedback = (message: string) => {
    if (!user) return;
    const newFeedback: Feedback = {
      id: Date.now().toString(),
      userId: user.id,
      date: new Date().toISOString(),
      message,
    };
    storage.saveFeedback(newFeedback);
  };

  return (
    <AppContext.Provider value={{ 
      events, addEvent, removeEvent, 
      surveys, addSurvey, addFeedback,
      notificationsEnabled, toggleNotifications,
      notifications, markAllNotificationsRead
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
