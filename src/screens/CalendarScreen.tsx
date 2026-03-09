import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, Button, Input } from '../components/ui';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO, isToday, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Plus, Trash2, Clock, CheckCircle2, Bell, MapPin, AlignLeft, Filter, LayoutGrid, List } from 'lucide-react';

export default function CalendarScreen() {
  const { events, addEvent, removeEvent } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [filterType, setFilterType] = useState<'all' | 'academic' | 'personal' | 'health'>('all');
  
  // New event state
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('12:00');
  const [endTime, setEndTime] = useState('');
  const [type, setType] = useState<'academic' | 'personal' | 'health'>('academic');
  const [reminder, setReminder] = useState(false);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const monthStart = startOfWeek(startOfMonth(selectedDate), { weekStartsOn: 1 });
  const monthEnd = endOfWeek(endOfMonth(selectedDate), { weekStartsOn: 1 });
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const daysToDisplay = viewMode === 'week' ? daysInWeek : daysInMonth;

  const selectedDateEvents = events
    .filter(e => isSameDay(parseISO(e.date), selectedDate))
    .filter(e => filterType === 'all' || e.type === filterType)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const isoDate = `${dateStr}T${time}:00.000Z`; // Simple ISO construction for local time
    const isoEndDate = endTime ? `${dateStr}T${endTime}:00.000Z` : undefined;

    addEvent({
      title,
      date: isoDate,
      endTime: isoEndDate,
      type,
      reminder,
      location,
      description
    });

    setTitle('');
    setTime('12:00');
    setEndTime('');
    setType('academic');
    setReminder(false);
    setLocation('');
    setDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="pb-24 md:pb-12 pt-20 px-6 max-w-md md:max-w-6xl mx-auto">
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
          {/* Calendar View */}
          <Card className="p-6 mb-8 md:mb-0 border-none shadow-sm dark:shadow-stone-900/50">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="font-serif text-2xl font-semibold text-stone-800 dark:text-stone-200 capitalize">
              {format(selectedDate, 'MMMM yyyy', { locale: es })}
            </h2>
            <div className="flex bg-stone-100 dark:bg-stone-800 rounded-lg p-1">
              <button 
                onClick={() => setViewMode('week')} 
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'week' ? 'bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-stone-100' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}
                title="Vista semanal"
              >
                <List className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('month')} 
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'month' ? 'bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-stone-100' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}
                title="Vista mensual"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setSelectedDate(addDays(selectedDate, viewMode === 'week' ? -7 : -30))} className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">&lt;</button>
            <button onClick={() => setSelectedDate(new Date())} className="px-3 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors text-sm font-medium">Hoy</button>
            <button onClick={() => setSelectedDate(addDays(selectedDate, viewMode === 'week' ? 7 : 30))} className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">&gt;</button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
            <div key={i} className="text-xs font-semibold text-stone-400 dark:text-stone-500 mb-2 sm:mb-3">{day}</div>
          ))}
          {daysToDisplay.map((day, i) => {
            const isSelected = isSameDay(day, selectedDate);
            const hasEvents = events.some(e => isSameDay(parseISO(e.date), day));
            const isCurrentDay = isToday(day);
            const isCurrentMonth = isSameMonth(day, selectedDate);

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(day)}
                className={`
                  relative ${viewMode === 'week' ? 'h-12 sm:h-14' : 'h-9 sm:h-10'} w-full rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-all duration-300
                  ${isSelected ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-lg sm:shadow-xl scale-105 sm:scale-110 z-10' : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'}
                  ${isCurrentDay && !isSelected ? 'text-orange-600 dark:text-orange-400 font-bold bg-orange-50 dark:bg-orange-500/10' : ''}
                  ${!isCurrentMonth && viewMode === 'month' ? 'opacity-30' : ''}
                `}
              >
                <span className={`text-base sm:text-lg ${isSelected ? 'font-serif font-bold' : 'font-medium'} ${viewMode === 'month' ? 'text-sm sm:text-sm' : ''}`}>
                  {format(day, 'd')}
                </span>
                {hasEvents && !isSelected && (
                  <span className={`absolute bottom-1 sm:bottom-1.5 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-orange-400 rounded-full ${viewMode === 'month' ? 'bottom-0.5 sm:bottom-1' : ''}`}></span>
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
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-2xl font-semibold text-stone-800 dark:text-stone-200">
                {format(selectedDate, "d 'de' MMMM", { locale: es })}
              </h3>
              <div className="relative group">
                <button className="flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-lg transition-colors">
                  <Filter className="w-4 h-4" />
                  <span className="capitalize">{filterType === 'all' ? 'Todos' : filterType === 'academic' ? 'Académico' : filterType === 'health' ? 'Salud' : 'Personal'}</span>
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-stone-800 rounded-xl shadow-xl border border-stone-100 dark:border-stone-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                  <button onClick={() => setFilterType('all')} className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-50 dark:hover:bg-stone-700 ${filterType === 'all' ? 'font-bold text-stone-900 dark:text-stone-100' : 'text-stone-600 dark:text-stone-400'}`}>Todos</button>
                  <button onClick={() => setFilterType('academic')} className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-50 dark:hover:bg-stone-700 ${filterType === 'academic' ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-stone-600 dark:text-stone-400'}`}>Académico</button>
                  <button onClick={() => setFilterType('personal')} className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-50 dark:hover:bg-stone-700 ${filterType === 'personal' ? 'font-bold text-purple-600 dark:text-purple-400' : 'text-stone-600 dark:text-stone-400'}`}>Personal</button>
                  <button onClick={() => setFilterType('health')} className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-50 dark:hover:bg-stone-700 ${filterType === 'health' ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'}`}>Salud/Bienestar</button>
                </div>
              </div>
            </div>
        
        {selectedDateEvents.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-[32px] border border-dashed border-stone-200 dark:border-stone-800">
            <CalendarIcon className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-4" />
            <p className="text-stone-500 dark:text-stone-400 font-medium">No hay eventos para mostrar.</p>
            <Button variant="ghost" className="mt-4 text-stone-900 dark:text-stone-100 font-semibold" onClick={() => setShowAddModal(true)}>
              Agregar evento
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedDateEvents.map(event => (
              <Card key={event.id} className="p-5 flex items-start gap-5 border-none shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-3 h-full rounded-full shrink-0 ${
                  event.type === 'academic' ? 'bg-blue-400' : 
                  event.type === 'health' ? 'bg-emerald-400' : 'bg-purple-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-lg truncate">{event.title}</h4>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-stone-500 dark:text-stone-400 font-medium">
                    <span className="flex items-center gap-1.5 shrink-0">
                      <Clock className="w-4 h-4" /> 
                      {format(parseISO(event.date), "HH:mm")}
                      {event.endTime && ` - ${format(parseISO(event.endTime), "HH:mm")}`}
                    </span>
                    <span className="capitalize px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded-md text-xs shrink-0">{event.type}</span>
                    {event.reminder && <span className="flex items-center gap-1.5 text-orange-500 shrink-0"><Bell className="w-3.5 h-3.5" /> Notificar</span>}
                  </div>

                  {(event.location || event.description) && (
                    <div className="mt-3 space-y-1.5 pt-3 border-t border-stone-100 dark:border-stone-800">
                      {event.location && (
                        <div className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400">
                          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                      {event.description && (
                        <div className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400">
                          <AlignLeft className="w-4 h-4 mt-0.5 shrink-0" />
                          <span className="line-clamp-2">{event.description}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button onClick={() => removeEvent(event.id)} className="text-stone-300 dark:text-stone-600 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-2 bg-stone-50 dark:bg-stone-800/50 rounded-full hover:bg-rose-50 dark:hover:bg-rose-500/10 shrink-0">
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
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-stone-900/40 dark:bg-black/60 backdrop-blur-sm">
          <div className="flex min-h-full items-start justify-center p-4 sm:p-6 pt-12 pb-32">
            <Card className="w-full max-w-md flex flex-col animate-in slide-in-from-bottom-8 fade-in duration-300 border-none shadow-2xl">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-6">Nuevo Evento</h2>
              
              {/* Quick Add Buttons */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2 sm:mx-0 sm:px-0">
                <button 
                  type="button"
                  onClick={() => { setTitle('Clase'); setType('academic'); }}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium whitespace-nowrap hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  + Clase
                </button>
                <button 
                  type="button"
                  onClick={() => { setTitle('Examen'); setType('academic'); setReminder(true); }}
                  className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-full text-sm font-medium whitespace-nowrap hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                >
                  + Examen
                </button>
                <button 
                  type="button"
                  onClick={() => { setTitle('Cita Médica'); setType('health'); setReminder(true); }}
                  className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-medium whitespace-nowrap hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                >
                  + Cita Médica
                </button>
                <button 
                  type="button"
                  onClick={() => { setTitle('Estudio'); setType('academic'); }}
                  className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium whitespace-nowrap hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
                >
                  + Estudio
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">Título *</label>
                  <Input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej. Examen de Cálculo" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">Hora de inicio *</label>
                    <Input type="time" required value={time} onChange={e => setTime(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">Hora de fin (Opcional)</label>
                    <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">Tipo *</label>
                    <select 
                      className="flex h-12 sm:h-14 w-full rounded-xl sm:rounded-2xl border-none bg-stone-200/50 dark:bg-stone-800/50 px-4 sm:px-5 py-2 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 focus:bg-white dark:focus:bg-stone-800 transition-all font-medium"
                      value={type} onChange={e => setType(e.target.value as any)}
                    >
                      <option value="academic">Académico</option>
                      <option value="personal">Personal</option>
                      <option value="health">Salud/Bienestar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">Ubicación (Opcional)</label>
                    <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Ej. Aula 302" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">Descripción (Opcional)</label>
                  <textarea 
                    className="flex w-full rounded-xl sm:rounded-2xl border-none bg-stone-200/50 dark:bg-stone-800/50 px-4 sm:px-5 py-3 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 focus:bg-white dark:focus:bg-stone-800 transition-all resize-none"
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Detalles adicionales..."
                  />
                </div>

                <div className="flex items-center gap-3 mt-2 bg-stone-50 dark:bg-stone-800/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
                  <input 
                    type="checkbox" 
                    id="reminder" 
                    checked={reminder} 
                    onChange={e => setReminder(e.target.checked)}
                    className="w-5 h-5 text-stone-900 dark:text-stone-100 rounded border-stone-300 dark:border-stone-700 focus:ring-stone-900 dark:focus:ring-stone-100 accent-stone-900 dark:accent-stone-100 shrink-0"
                  />
                  <label htmlFor="reminder" className="text-sm font-semibold text-stone-700 dark:text-stone-300 cursor-pointer">Activar recordatorio (Notificación)</label>
                </div>

                <div className="flex gap-3 sm:gap-4 pt-4">
                  <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAddModal(false)}>Cancelar</Button>
                  <Button type="submit" className="flex-1">Guardar</Button>
                </div>
              </form>
            </div>
          </Card>
          </div>
        </div>
      )}
    </div>
  );
}
