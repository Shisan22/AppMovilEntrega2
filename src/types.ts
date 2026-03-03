export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  career?: string;
  semester?: number;
}

export interface AppEvent {
  id: string;
  userId: string;
  title: string;
  date: string; // ISO string
  type: 'academic' | 'personal' | 'health';
  reminder: boolean;
}

export interface SurveyResponse {
  id: string;
  userId: string;
  date: string;
  mood: number; // 1-5
  sleepHours: number;
  stressLevel: number; // 1-5
}

export interface Feedback {
  id: string;
  userId: string;
  date: string;
  message: string;
}
