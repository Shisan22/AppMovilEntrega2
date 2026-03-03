import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, Button, Input } from '../components/ui';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Plus, Trash2, Clock, CheckCircle2, Bell } from 'lucide-react';

export default function CalendarScreen() {
  const { events, addEvent, removeEvent } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New event state
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('12:00');
  const [type, setType] = useState<'academic' | 'personal' | 'health'>('academic');
  const [reminder, setReminder] = useState(false);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const selectedDateEvents = events.filter(e => isSameDay(parseISO(e.date), selectedDate));

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const isoDate = `${dateStr}T${time}:00.000Z`; // Simple ISO construction for local time

    addEvent({
      title,
      date: isoDate,
      type,
      reminder
    });

    setTitle('');
    setTime('12:00');
    setReminder(false);
    setShowAddModal(false);
  };

  return (
    <div className="pb-24 md:pb-12 pt-8 px-6 max-w-md md:max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-3">
          Agenda
        </h1>
        <Button variant="primary" className="w-14 h-14 p-0 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-lg" onClick={() => setShowAddModal(true)}>
          <Plus className="w-6 h-6" />
        </Button>
      </header>

      <div className="md:grid md:grid-cols-12 md:gap-8 items-start">
        <div className="md:col-span-7 lg:col-span-7">
          {/* Week View */}
          <Card className="p-6 mb-8 md:mb-0 border-none shadow-sm dark:shadow-stone-900/50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl font-semibold text-stone-800 dark:text-stone-200 capitalize">
            {format(selectedDate, 'MMMM yyyy', { locale: es })}
          </h2>
          <div className="flex gap-3">
            <button onClick={() => setSelectedDate(addDays(selectedDate, -7))} className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">&lt;</button>
            <button onClick={() => setSelectedDate(addDays(selectedDate, 7))} className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">&gt;</button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2 text-center">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
            <div key={i} className="text-xs font-semibold text-stone-400 dark:text-stone-500 mb-3">{day}</div>
          ))}
          {daysInWeek.map((day, i) => {
            const isSelected = isSameDay(day, selectedDate);
            const hasEvents = events.some(e => isSameDay(parseISO(e.date), day));
            const isCurrentDay = isToday(day);

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(day)}
                className={`
                  relative h-14 w-full rounded-2xl flex flex-col items-center justify-center transition-all duration-300
                  ${isSelected ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xl scale-110 z-10' : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'}
                  ${isCurrentDay && !isSelected ? 'text-orange-600 dark:text-orange-400 font-bold bg-orange-50 dark:bg-orange-500/10' : ''}
                `}
              >
                <span className={`text-lg ${isSelected ? 'font-serif font-bold' : 'font-medium'}`}>
                  {format(day, 'd')}
                </span>
                {hasEvents && !isSelected && (
                  <span className="absolute bottom-2 w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

        </div>

        <div className="md:col-span-5 lg:col-span-5 mt-8 md:mt-0">
          {/* Events List */}
          <div>
            <h3 className="font-serif text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-6">
          {format(selectedDate, "d 'de' MMMM", { locale: es })}
        </h3>
        
        {selectedDateEvents.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-[32px] border border-dashed border-stone-200 dark:border-stone-800">
            <CalendarIcon className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-4" />
            <p className="text-stone-500 dark:text-stone-400 font-medium">Día libre. ¡Aprovecha para descansar!</p>
            <Button variant="ghost" className="mt-4 text-stone-900 dark:text-stone-100 font-semibold" onClick={() => setShowAddModal(true)}>
              Agregar evento
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedDateEvents.map(event => (
              <Card key={event.id} className="p-5 flex items-start gap-5 border-none shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-3 h-full rounded-full ${
                  event.type === 'academic' ? 'bg-blue-400' : 
                  event.type === 'health' ? 'bg-emerald-400' : 'bg-purple-400'
                }`} />
                <div className="flex-1">
                  <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-lg">{event.title}</h4>
                  <div className="flex items-center gap-4 mt-3 text-sm text-stone-500 dark:text-stone-400 font-medium">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {format(parseISO(event.date), "HH:mm")}</span>
                    <span className="capitalize px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-lg">{event.type}</span>
                    {event.reminder && <span className="flex items-center gap-1.5 text-orange-500"><Bell className="w-4 h-4" /> Notificar</span>}
                  </div>
                </div>
                <button onClick={() => removeEvent(event.id)} className="text-stone-300 dark:text-stone-600 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-2 bg-stone-50 dark:bg-stone-800/50 rounded-full hover:bg-rose-50 dark:hover:bg-rose-500/10">
                  <Trash2 className="w-5 h-5" />
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-stone-900/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-md p-8 animate-in slide-in-from-bottom-8 fade-in duration-300 border-none shadow-2xl">
            <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-8">Nuevo Evento</h2>
            <form onSubmit={handleAddEvent} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">Título</label>
                <Input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej. Examen de Cálculo" />
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">Hora</label>
                  <Input type="time" required value={time} onChange={e => setTime(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">Tipo</label>
                  <select 
                    className="flex h-14 w-full rounded-2xl border-none bg-stone-200/50 dark:bg-stone-800/50 px-5 py-2 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 focus:bg-white dark:focus:bg-stone-800 transition-all font-medium"
                    value={type} onChange={e => setType(e.target.value as any)}
                  >
                    <option value="academic">Académico</option>
                    <option value="personal">Personal</option>
                    <option value="health">Salud/Bienestar</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4 bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl">
                <input 
                  type="checkbox" 
                  id="reminder" 
                  checked={reminder} 
                  onChange={e => setReminder(e.target.checked)}
                  className="w-5 h-5 text-stone-900 dark:text-stone-100 rounded border-stone-300 dark:border-stone-700 focus:ring-stone-900 dark:focus:ring-stone-100 accent-stone-900 dark:accent-stone-100"
                />
                <label htmlFor="reminder" className="text-sm font-semibold text-stone-700 dark:text-stone-300 cursor-pointer">Activar recordatorio (Notificación)</label>
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAddModal(false)}>Cancelar</Button>
                <Button type="submit" className="flex-1">Guardar</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
