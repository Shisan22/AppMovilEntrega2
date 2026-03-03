import React from 'react';
import { Card, Button } from '../components/ui';
import { EMERGENCY_CONTACTS } from '../utils/constants';
import { Phone, AlertTriangle, Mail, Clock } from 'lucide-react';

export default function EmergencyScreen() {
  return (
    <div className="pb-28 md:pb-12 pt-8 px-6 max-w-md md:max-w-5xl mx-auto min-h-full bg-rose-50 dark:bg-rose-950/30 transition-colors duration-300">
      <header className="mb-10 text-center">
        <div className="w-24 h-24 bg-rose-600 rounded-full mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-rose-600/40 animate-pulse">
          <AlertTriangle className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-serif font-bold text-rose-900 dark:text-rose-500 mb-4">
          SOS
        </h1>
        <p className="text-rose-800 dark:text-rose-400 font-medium text-lg leading-relaxed px-4">
          No estás solo. Si necesitas ayuda inmediata, por favor contacta a un profesional.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {EMERGENCY_CONTACTS.map(contact => (
          <Card key={contact.id} className="p-6 border-none shadow-xl shadow-rose-900/5 dark:shadow-rose-900/20 hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-2xl mb-1">{contact.name}</h3>
                <p className="text-rose-600 dark:text-rose-400 font-semibold text-sm">{contact.role}</p>
              </div>
              <a 
                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                className="w-14 h-14 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center hover:bg-rose-200 dark:hover:bg-rose-900 transition-colors shadow-inner"
              >
                <Phone className="w-6 h-6" />
              </a>
            </div>
            
            <div className="space-y-3 mt-6 pt-6 border-t border-rose-100 dark:border-rose-900/30 text-sm text-stone-600 dark:text-stone-300 font-medium">
              <div className="flex items-center gap-3">
                <div className="bg-stone-100 dark:bg-stone-800 p-2 rounded-full"><Phone className="w-4 h-4 text-stone-500 dark:text-stone-400" /></div>
                <span className="text-stone-900 dark:text-stone-100">{contact.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-stone-100 dark:bg-stone-800 p-2 rounded-full"><Mail className="w-4 h-4 text-stone-500 dark:text-stone-400" /></div>
                <span>{contact.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-stone-100 dark:bg-stone-800 p-2 rounded-full"><Clock className="w-4 h-4 text-stone-500 dark:text-stone-400" /></div>
                <span>{contact.availability}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-10 p-6 bg-rose-900 rounded-[32px] text-center shadow-2xl relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-rose-800 rounded-full opacity-50"></div>
        <div className="relative z-10">
          <p className="text-base text-rose-100 font-semibold leading-relaxed">
            Si tu vida o la de alguien más está en peligro inminente, llama inmediatamente al número de emergencias local.
          </p>
          <a href="tel:123" className="mt-6 inline-flex items-center justify-center bg-white text-rose-900 font-bold text-xl rounded-full px-8 py-4 shadow-lg hover:bg-rose-50 transition-colors">
            Llamar al 123
          </a>
        </div>
      </div>
    </div>
  );
}
