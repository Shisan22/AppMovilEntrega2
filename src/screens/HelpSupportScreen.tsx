import React from 'react';
import { ArrowLeft, Mail, MessageCircle, FileText, Phone } from 'lucide-react';
import '../styles/main.scss';

export default function HelpSupportScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="pb-24 md:pb-12 pt-8 px-6 max-w-md md:max-w-3xl mx-auto">
      <header className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-3 bg-stone-100 dark:bg-stone-800 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-4xl font-serif font-bold text-stone-900 dark:text-stone-100">
          Ayuda y Soporte
        </h1>
      </header>

      <div className="space-y-6">
        <div className="info-section">
          <h2 className="info-section__title">¿Cómo podemos ayudarte?</h2>
          <div className="info-section__content">
            <p>
              Estamos aquí para resolver tus dudas y asegurarnos de que tengas la mejor experiencia 
              posible. Selecciona una de las opciones a continuación para contactarnos o encontrar 
              respuestas a tus preguntas.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button className="support-card w-full text-left">
            <div className="support-card__icon">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div className="support-card__info">
              <h3>Chat en vivo</h3>
              <p>Habla con un agente de soporte en tiempo real (Lunes a Viernes, 9am - 6pm).</p>
            </div>
          </button>

          <button className="support-card w-full text-left">
            <div className="support-card__icon">
              <Mail className="w-6 h-6" />
            </div>
            <div className="support-card__info">
              <h3>Correo electrónico</h3>
              <p>Envíanos tus consultas a soporte@appbienestar.com. Respondemos en 24h.</p>
            </div>
          </button>

          <button className="support-card w-full text-left">
            <div className="support-card__icon">
              <FileText className="w-6 h-6" />
            </div>
            <div className="support-card__info">
              <h3>Preguntas Frecuentes (FAQ)</h3>
              <p>Encuentra respuestas rápidas a las dudas más comunes de nuestra comunidad.</p>
            </div>
          </button>

          <button className="support-card w-full text-left">
            <div className="support-card__icon">
              <Phone className="w-6 h-6" />
            </div>
            <div className="support-card__info">
              <h3>Línea de atención</h3>
              <p>Llámanos al +57 01 8000 123456. Disponible para emergencias técnicas.</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
