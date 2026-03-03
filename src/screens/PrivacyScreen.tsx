import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, Eye } from 'lucide-react';
import '../styles/main.scss';

export default function PrivacyScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="pb-24 md:pb-12 pt-8 px-6 max-w-md md:max-w-3xl mx-auto">
      <header className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-3 bg-stone-100 dark:bg-stone-800 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-4xl font-serif font-bold text-stone-900 dark:text-stone-100">
          Privacidad
        </h1>
      </header>

      <div className="space-y-8">
        <div className="info-section">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
            <h2 className="info-section__title !mb-0">Tu información está segura</h2>
          </div>
          <div className="info-section__content">
            <p>
              En nuestra aplicación, la privacidad y seguridad de tus datos son nuestra máxima prioridad. 
              Toda la información personal, incluyendo tus registros de estado de ánimo y notas, se almacena 
              de forma segura y encriptada.
            </p>
          </div>
        </div>

        <div className="info-section">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-8 h-8 text-indigo-500" />
            <h2 className="info-section__title !mb-0">Control total de tus datos</h2>
          </div>
          <div className="info-section__content">
            <p>
              Tú eres el único dueño de tu información. Tienes el derecho de:
            </p>
            <ul>
              <li>Exportar tus datos en cualquier momento.</li>
              <li>Eliminar permanentemente tu cuenta y toda la información asociada.</li>
              <li>Decidir qué notificaciones deseas recibir.</li>
            </ul>
          </div>
        </div>

        <div className="info-section">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-8 h-8 text-rose-500" />
            <h2 className="info-section__title !mb-0">Transparencia</h2>
          </div>
          <div className="info-section__content">
            <p>
              No vendemos tus datos a terceros. La información recopilada se utiliza exclusivamente 
              para mejorar tu experiencia dentro de la aplicación y ofrecerte recomendaciones 
              personalizadas para tu bienestar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
