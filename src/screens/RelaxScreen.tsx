import React, { useState, useRef, useEffect } from 'react';
import { Card, Button } from '../components/ui';
import { RELAXATION_SOUNDS } from '../utils/constants';
import { Headphones, PlayCircle, PauseCircle, Wind, Music, Droplets, Bird, Building } from 'lucide-react';

export default function RelaxScreen() {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filter, setFilter] = useState<string>('Todos');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const types = ['Todos', ...Array.from(new Set(RELAXATION_SOUNDS.map(s => s.type)))];
  
  const filteredSounds = filter === 'Todos' 
    ? RELAXATION_SOUNDS 
    : RELAXATION_SOUNDS.filter(s => s.type === filter);

  // Handle play/pause when active sound changes
  useEffect(() => {
    if (audioRef.current) {
      if (activeSound) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(e => {
          console.error("Error playing audio:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [activeSound]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
      }
    }
  };

  const currentSoundObj = RELAXATION_SOUNDS.find(s => s.id === activeSound);

  return (
    <div className="pb-24 md:pb-12 pt-20 px-6 max-w-md md:max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-3 mb-3">
          <Wind className="w-8 h-8 text-emerald-600" />
          Relajación
        </h1>
        <p className="text-stone-500 dark:text-stone-400 font-medium">Tómate un momento para respirar y desconectar del estrés.</p>
      </header>

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide">
        {types.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-6 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300
              ${filter === t 
                ? 'bg-emerald-800 text-white shadow-lg scale-105' 
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 border border-stone-200/50 dark:border-stone-700/50'
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Audio Player (if active) */}
      {activeSound && currentSoundObj && (
        <Card className="mb-8 overflow-hidden bg-stone-900 animate-in fade-in zoom-in-95 duration-500 border-none shadow-2xl">
          <div className="p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-20 flex items-center justify-center">
              {currentSoundObj.id === 's5' ? <Bird className="w-64 h-64 text-emerald-500" /> :
               currentSoundObj.id === 's6' ? <Building className="w-64 h-64 text-indigo-500" /> :
               currentSoundObj.type === 'Naturaleza' ? <Wind className="w-64 h-64 text-emerald-500" /> :
               currentSoundObj.type === 'Océano' ? <Droplets className="w-64 h-64 text-blue-500" /> :
               currentSoundObj.type === 'Música' ? <Music className="w-64 h-64 text-indigo-500" /> :
               currentSoundObj.type === 'Meditación' ? <Headphones className="w-64 h-64 text-purple-500" /> : null}
            </div>

            <div className="relative z-10">
              <h3 className="text-stone-100 font-serif font-bold text-2xl mb-2">
                {currentSoundObj.title}
              </h3>
              <p className="text-stone-400 font-medium mb-8">Reproduciendo sonido offline</p>

              <audio 
                ref={audioRef} 
                src={currentSoundObj.url} 
                loop 
                className="hidden" 
              />

              <div className="flex items-center gap-6 justify-center">
                <button 
                  onClick={togglePlayPause}
                  className="text-white hover:text-emerald-400 transition-colors transform hover:scale-105 active:scale-95"
                >
                  {isPlaying ? (
                    <PauseCircle className="w-20 h-20" />
                  ) : (
                    <PlayCircle className="w-20 h-20" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="p-4 bg-stone-950 flex justify-end">
            <button 
              onClick={() => setActiveSound(null)}
              className="text-stone-400 hover:text-white text-sm font-medium bg-stone-800 px-5 py-2 rounded-full transition-colors"
            >
              Cerrar Reproductor
            </button>
          </div>
        </Card>
      )}

      {/* Sound List */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredSounds.map(sound => (
          <Card 
            key={sound.id} 
            className={`overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl border-none
              ${activeSound === sound.id ? 'ring-4 ring-emerald-500/20 scale-[1.02]' : 'shadow-sm dark:shadow-stone-900/50'}
            `}
            onClick={() => setActiveSound(sound.id)}
          >
            <div className="flex p-4 gap-5 items-center">
              <div className="w-24 h-24 bg-stone-100 dark:bg-stone-800 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden group">
                {sound.id === 's5' ? <Bird className="w-10 h-10 text-emerald-500" /> :
                 sound.id === 's6' ? <Building className="w-10 h-10 text-indigo-500" /> :
                 sound.type === 'Naturaleza' ? <Wind className="w-10 h-10 text-emerald-500" /> :
                 sound.type === 'Océano' ? <Droplets className="w-10 h-10 text-blue-500" /> :
                 sound.type === 'Música' ? <Music className="w-10 h-10 text-indigo-500" /> :
                 sound.type === 'Meditación' ? <Headphones className="w-10 h-10 text-purple-500" /> : null}
                
                <div className="absolute inset-0 bg-stone-900/40 dark:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  {activeSound === sound.id && isPlaying ? (
                    <PauseCircle className="w-10 h-10 text-white" />
                  ) : (
                    <PlayCircle className="w-10 h-10 text-white" />
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-xl truncate mb-2">{sound.title}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-full">
                    {sound.type}
                  </span>
                  <span className="text-xs font-semibold text-stone-400 dark:text-stone-500 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {sound.duration}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Helper icon component since it's used locally
const Clock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
