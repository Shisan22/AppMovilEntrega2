import { User, AppEvent, SurveyResponse, Feedback } from '../types';

const USERS_KEY = 'zen_campus_users';
const EVENTS_KEY = 'zen_campus_events';
const SURVEYS_KEY = 'zen_campus_surveys';
const FEEDBACK_KEY = 'zen_campus_feedback';

export const storage = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveUser: (user: User) => {
    const users = storage.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
  getEvents: (userId: string): AppEvent[] => {
    const data = localStorage.getItem(EVENTS_KEY);
    const allEvents: AppEvent[] = data ? JSON.parse(data) : [];
    return allEvents.filter(e => e.userId === userId);
  },
  saveEvent: (event: AppEvent) => {
    const data = localStorage.getItem(EVENTS_KEY);
    const allEvents: AppEvent[] = data ? JSON.parse(data) : [];
    allEvents.push(event);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(allEvents));
  },
  deleteEvent: (eventId: string) => {
    const data = localStorage.getItem(EVENTS_KEY);
    const allEvents: AppEvent[] = data ? JSON.parse(data) : [];
    const filtered = allEvents.filter(e => e.id !== eventId);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(filtered));
  },
  getSurveys: (userId: string): SurveyResponse[] => {
    const data = localStorage.getItem(SURVEYS_KEY);
    const allSurveys: SurveyResponse[] = data ? JSON.parse(data) : [];
    return allSurveys.filter(s => s.userId === userId);
  },
  saveSurvey: (survey: SurveyResponse) => {
    const data = localStorage.getItem(SURVEYS_KEY);
    const allSurveys: SurveyResponse[] = data ? JSON.parse(data) : [];
    allSurveys.push(survey);
    localStorage.setItem(SURVEYS_KEY, JSON.stringify(allSurveys));
  },
  saveFeedback: (feedback: Feedback) => {
    const data = localStorage.getItem(FEEDBACK_KEY);
    const allFeedback: Feedback[] = data ? JSON.parse(data) : [];
    allFeedback.push(feedback);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(allFeedback));
  }
};
