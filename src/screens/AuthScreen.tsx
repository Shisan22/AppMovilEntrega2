import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/ui';
import { Leaf } from 'lucide-react';
import { KoruLogo } from '../components/KoruLogo';

export default function AuthScreen() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Por favor ingresa tu correo.');
      return;
    }

    if (isLogin) {
      const success = login(email);
      if (!success) setError('Usuario no encontrado. Por favor regístrate.');
    } else {
      if (!name) {
        setError('Por favor ingresa tu nombre.');
        return;
      }
      const success = register(email, name);
      if (!success) setError('El correo ya está registrado.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex flex-col md:flex-row justify-center items-center p-6 transition-colors duration-300">
      <div className="w-full max-w-md md:max-w-4xl md:flex md:bg-white md:dark:bg-stone-900 md:rounded-[40px] md:shadow-2xl md:overflow-hidden">
        
        <div className="flex flex-col items-center justify-center mb-12 md:mb-0 md:w-1/2 md:bg-stone-900 md:dark:bg-stone-950 md:p-12 md:py-20">
          <div className="w-24 h-24 bg-stone-900 dark:bg-stone-100 md:bg-stone-100 md:dark:bg-stone-900 rounded-[32px] flex items-center justify-center mb-6 shadow-xl p-4">
            <KoruLogo className="w-full h-full text-stone-100 dark:text-stone-900 md:text-stone-900 md:dark:text-stone-100" />
          </div>
          <h1 className="text-6xl font-serif font-bold text-stone-900 dark:text-stone-100 md:text-stone-100 md:dark:text-stone-100 tracking-tight text-center leading-none">
            KORU
          </h1>
          <p className="text-stone-500 dark:text-stone-400 md:text-stone-400 mt-4 text-center font-medium">Tu espacio de bienestar universitario</p>
        </div>

        <div className="md:w-1/2 md:p-12 md:flex md:flex-col md:justify-center">
          <Card className="p-8 shadow-xl shadow-stone-200/50 dark:shadow-stone-900/50 border border-white dark:border-stone-800 md:shadow-none md:border-none md:bg-transparent md:dark:bg-transparent md:p-0">
          <h2 className="text-2xl font-serif font-semibold mb-8 text-center text-stone-900 dark:text-stone-100">
            {isLogin ? 'Bienvenido de vuelta' : 'Comienza tu viaje'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <Input
                  type="text"
                  placeholder="Nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            
            <div>
              <Input
                type="email"
                placeholder="Correo institucional"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && <p className="text-rose-500 text-sm px-2">{error}</p>}

            <Button type="submit" className="w-full mt-4 text-base">
              {isLogin ? 'Entrar' : 'Crear cuenta'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-medium transition-colors"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
}
