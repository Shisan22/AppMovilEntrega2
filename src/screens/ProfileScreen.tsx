import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { Card, Button, Input } from '../components/ui';
import { User as UserIcon, LogOut, Settings, MessageSquare, Edit3, Save, X } from 'lucide-react';

export default function ProfileScreen({ onNavigateSettings }: { onNavigateSettings?: () => void }) {
  const { user, logout, updateProfile } = useAuth();
  const { addFeedback } = useAppContext();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [career, setCareer] = useState(user?.career || '');
  const [semester, setSemester] = useState(user?.semester?.toString() || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const [feedback, setFeedback] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleSaveProfile = () => {
    updateProfile({
      name,
      career,
      semester: semester ? parseInt(semester) : undefined,
      avatar
    });
    setIsEditing(false);
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    addFeedback(feedback);
    setFeedback('');
    setFeedbackSent(true);
    setTimeout(() => setFeedbackSent(false), 3000);
  };

  return (
    <div className="pb-24 md:pb-12 pt-20 px-6 max-w-md md:max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-serif font-bold text-stone-900 flex items-center gap-3">
          Perfil
        </h1>
        <Button variant="ghost" onClick={logout} className="text-rose-600 hover:bg-rose-50 p-3 h-auto rounded-full">
          <LogOut className="w-6 h-6" />
        </Button>
      </header>

      <div className="md:grid md:grid-cols-12 md:gap-8 items-start">
        <div className="md:col-span-5 lg:col-span-5">
          {/* Profile Card */}
          <Card className="p-8 mb-8 md:mb-0 relative overflow-hidden border-none shadow-xl shadow-stone-200/50 dark:shadow-stone-900/50">
        <div className="absolute top-0 right-0 p-5">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="text-stone-400 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors bg-stone-100 dark:bg-stone-800 p-3 rounded-full">
              <Edit3 className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => setIsEditing(false)} className="text-stone-400 dark:text-stone-500 hover:text-rose-600 dark:hover:text-rose-500 transition-colors bg-stone-100 dark:bg-stone-800 p-3 rounded-full">
                <X className="w-5 h-5" />
              </button>
              <button onClick={handleSaveProfile} className="text-stone-100 dark:text-stone-900 hover:text-white dark:hover:text-stone-800 transition-colors bg-stone-900 dark:bg-stone-100 p-3 rounded-full shadow-md">
                <Save className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center text-center mt-4">
          <div className="w-32 h-32 rounded-[40px] bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-6 overflow-hidden border-4 border-white dark:border-stone-800 shadow-lg rotate-3">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover -rotate-3" />
            ) : (
              <UserIcon className="w-16 h-16 text-stone-300 dark:text-stone-600 -rotate-3" />
            )}
          </div>
          
          {isEditing ? (
            <div className="w-full space-y-5 mt-4 text-left animate-in fade-in duration-300">
              <div>
                <label className="text-sm font-semibold text-stone-500 ml-2 mb-2 block">URL de Imagen</label>
                <Input value={avatar} onChange={e => setAvatar(e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <label className="text-sm font-semibold text-stone-500 ml-2 mb-2 block">Nombre</label>
                <Input value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-semibold text-stone-500 ml-2 mb-2 block">Carrera</label>
                <Input value={career} onChange={e => setCareer(e.target.value)} placeholder="Ej. Ingeniería" />
              </div>
              <div>
                <label className="text-sm font-semibold text-stone-500 ml-2 mb-2 block">Semestre</label>
                <Input type="number" value={semester} onChange={e => setSemester(e.target.value)} placeholder="Ej. 5" />
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-1">{user?.name}</h2>
              <p className="text-stone-500 dark:text-stone-400 font-medium">{user?.email}</p>
              
              {(user?.career || user?.semester) && (
                <div className="mt-6 flex gap-3 justify-center flex-wrap">
                  {user.career && (
                    <span className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 rounded-full text-sm font-semibold shadow-md">
                      {user.career}
                    </span>
                  )}
                  {user.semester && (
                    <span className="px-4 py-2 bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-full text-sm font-semibold">
                      Semestre {user.semester}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
        </div>

        <div className="md:col-span-7 lg:col-span-7 mt-8 md:mt-0 space-y-8">
          {/* Settings Options */}
          <Card className="p-2 border-none shadow-sm dark:shadow-stone-900/50">
        <button onClick={onNavigateSettings} className="w-full flex items-center justify-between p-5 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors rounded-3xl">
          <div className="flex items-center gap-4 text-stone-800 dark:text-stone-200">
            <div className="bg-stone-100 dark:bg-stone-800 p-3 rounded-full">
              <Settings className="w-6 h-6 text-stone-600 dark:text-stone-400" />
            </div>
            <span className="font-semibold text-lg">Configuración</span>
          </div>
          <span className="text-stone-300 dark:text-stone-600 font-bold text-xl">&gt;</span>
        </button>
      </Card>

      {/* Feedback Zone */}
      <Card className="p-8 border-none bg-stone-900 dark:bg-stone-800 text-stone-100 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-stone-800 dark:bg-stone-700 rounded-full opacity-50"></div>
        <div className="relative z-10">
          <h3 className="font-serif text-2xl font-bold text-stone-100 mb-3 flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-orange-400" />
            Buzón de Ideas
          </h3>
          <p className="text-stone-400 dark:text-stone-300 font-medium mb-6">
            ¿Cómo podemos mejorar KORU para ti?
          </p>
          
          {feedbackSent ? (
            <div className="bg-emerald-500/20 text-emerald-300 p-4 rounded-2xl text-base font-semibold text-center animate-in fade-in backdrop-blur-sm border border-emerald-500/30">
              ¡Gracias por tu sugerencia!
            </div>
          ) : (
            <form onSubmit={handleSendFeedback}>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="Escribe tu idea aquí..."
                className="w-full h-32 rounded-2xl border-none bg-stone-800 dark:bg-stone-900 p-5 text-base text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none mb-4 transition-all"
                required
              />
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white border-none shadow-lg shadow-orange-500/20">
                Enviar Feedback
              </Button>
            </form>
          )}
        </div>
      </Card>
        </div>
      </div>
    </div>
  );
}
