import React, { useState } from 'react';
import { Card, Button } from '../components/ui';
import { RELAXATION_VIDEOS } from '../utils/constants';
import { Headphones, PlayCircle, Wind, Music, Droplets } from 'lucide-react';

export default function RelaxScreen() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('Todos');

  const types = ['Todos', ...Array.from(new Set(RELAXATION_VIDEOS.map(v => v.type)))];
  
  const filteredVideos = filter === 'Todos' 
    ? RELAXATION_VIDEOS 
    : RELAXATION_VIDEOS.filter(v => v.type === filter);

  return (
    <div className="pb-24 md:pb-12 pt-8 px-6 max-w-md md:max-w-6xl mx-auto">
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

      {/* Video Player (if active) */}
      {activeVideo && (
        <Card className="mb-8 overflow-hidden bg-stone-900 animate-in fade-in zoom-in-95 duration-500 border-none shadow-2xl">
          <div className="relative pt-[56.25%]">
            <iframe 
              src={RELAXATION_VIDEOS.find(v => v.id === activeVideo)?.url} 
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
          <div className="p-5 bg-stone-900 flex justify-between items-center">
            <h3 className="text-stone-100 font-serif font-semibold text-lg truncate">
              {RELAXATION_VIDEOS.find(v => v.id === activeVideo)?.title}
            </h3>
            <button 
              onClick={() => setActiveVideo(null)}
              className="text-stone-400 hover:text-white text-sm font-medium bg-stone-800 px-4 py-2 rounded-full transition-colors"
            >
              Cerrar
            </button>
          </div>
        </Card>
      )}

      {/* Video List */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredVideos.map(video => (
          <Card 
            key={video.id} 
            className={`overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl border-none
              ${activeVideo === video.id ? 'ring-4 ring-emerald-500/20 scale-[1.02]' : 'shadow-sm dark:shadow-stone-900/50'}
            `}
            onClick={() => setActiveVideo(video.id)}
          >
            <div className="flex p-4 gap-5 items-center">
              <div className="w-24 h-24 bg-stone-100 dark:bg-stone-800 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden group">
                {video.type === 'Naturaleza' && <Wind className="w-10 h-10 text-emerald-500" />}
                {video.type === 'Océano' && <Droplets className="w-10 h-10 text-blue-500" />}
                {video.type === 'Música' && <Music className="w-10 h-10 text-indigo-500" />}
                {video.type === 'Meditación' && <Headphones className="w-10 h-10 text-purple-500" />}
                
                <div className="absolute inset-0 bg-stone-900/40 dark:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <PlayCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-xl truncate mb-2">{video.title}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-full">
                    {video.type}
                  </span>
                  <span className="text-xs font-semibold text-stone-400 dark:text-stone-500 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {video.duration}
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
