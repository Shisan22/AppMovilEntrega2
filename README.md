# KORU

KORU es una aplicación web progresiva (PWA / SPA) orientada al bienestar y la salud mental de los estudiantes universitarios. Diseñada con un enfoque "Mobile-First" y una estética "Warm Organic / Editorial", la aplicación ofrece herramientas para la gestión del tiempo, el seguimiento del estado de ánimo, la relajación guiada y el acceso rápido a contactos de emergencia.

## 🛠 Stack Tecnológico

- **Framework:** React 18
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS (v4)
- **Iconografía:** Lucide React
- **Manejo de Fechas:** `date-fns`
- **Utilidades de UI:** `clsx`, `tailwind-merge`
- **Build Tool:** Vite
- **Diseño Responsivo:** Adaptable a Móvil, Tablet y Desktop.

## 🏗 Arquitectura del Proyecto

La aplicación sigue una arquitectura de Single Page Application (SPA) puramente del lado del cliente (Client-Side Rendering). 

### Gestión de Estado
Se utiliza la **Context API** de React para manejar el estado global de la aplicación, dividido en tres dominios principales para mantener la separación de responsabilidades (Separation of Concerns):
1. `AuthContext`: Maneja la sesión del usuario, registro, login y actualización de perfil.
2. `AppContext`: Maneja la lógica de negocio (eventos del calendario, encuestas diarias, feedback).
3. `ThemeContext`: Maneja la preferencia del usuario sobre el Modo Claro / Modo Oscuro.

### Persistencia de Datos
Al ser una aplicación de demostración/frontend, la persistencia se maneja a través de una capa de abstracción sobre el `localStorage` del navegador (`src/utils/storage.ts`). Esto permite que la aplicación funcione offline y mantenga los datos entre recargas sin necesidad de un backend real.

### Enrutamiento
Se implementó un enrutador ligero basado en estado (`currentTab` en `App.tsx`) en lugar de usar librerías pesadas como `react-router-dom`, dado que la aplicación simula una experiencia de navegación por pestañas (Bottom Navigation Bar) típica de aplicaciones móviles nativas.

## 📁 Estructura de Archivos

```text
src/
├── components/
│   └── ui.tsx             # Componentes base reutilizables (Button, Card, Input)
├── context/
│   ├── AppContext.tsx     # Estado global de negocio
│   ├── AuthContext.tsx    # Estado de sesión
│   └── ThemeContext.tsx   # Estado de UI (Dark Mode)
├── screens/
│   ├── AuthScreen.tsx     # Login / Registro
│   ├── HomeScreen.tsx     # Dashboard, Check-in diario
│   ├── CalendarScreen.tsx # Agenda y gestión de eventos
│   ├── RelaxScreen.tsx    # Reproductor de videos de relajación
│   ├── ProfileScreen.tsx  # Gestión de usuario y feedback
│   ├── SettingsScreen.tsx # Configuración (Dark mode, etc)
│   └── EmergencyScreen.tsx# Contactos SOS
├── utils/
│   ├── constants.ts       # Datos estáticos (Tips, Videos, Contactos)
│   └── storage.ts         # Capa de abstracción de LocalStorage
├── types.ts               # Definiciones de interfaces TypeScript
├── App.tsx                # Entry point y Layout principal (Navegación)
├── index.css              # Estilos globales y configuración Tailwind
└── main.tsx               # React DOM render
```

## ✨ Funcionalidades Principales

- **Autenticación Local:** Sistema de login/registro simulado que vincula los datos generados (eventos, encuestas) a un ID de usuario específico.
- **Check-in Diario y Resumen Semanal:** Registro de estado de ánimo, horas de sueño y nivel de estrés. Cálculo automático de promedios semanales.
- **Notificaciones y Recordatorios:** Sistema de notificaciones integrado con panel desplegable y control de activación desde los ajustes.
- **Agenda Semanal:** Calendario personalizado construido desde cero con `date-fns` para gestionar eventos académicos, personales y de salud.
- **Zona de Relajación:** Galería de videos embebidos de YouTube categorizados por tipo (Naturaleza, Meditación, etc.) y atajos rápidos desde el inicio.
- **Modo Oscuro:** Soporte completo para Dark Mode con persistencia de preferencia.
- **Botón SOS:** Acceso inmediato a líneas de atención de salud mental, integrado orgánicamente en la barra de navegación.
- **Diseño Responsivo (Multi-dispositivo):** La interfaz se adapta automáticamente. En móviles usa una barra de navegación inferior (Bottom Nav), mientras que en tablets y PC se transforma en una barra lateral (Sidebar) y utiliza layouts de cuadrícula (CSS Grid) para aprovechar el espacio en pantalla.

## 🚀 Buenas Prácticas Empleadas

1. **Componentes UI Reutilizables y Accesibles:**
   - Uso de `React.forwardRef` en componentes base (`Button`, `Input`, `Card`) para permitir la manipulación del DOM si es necesario.
   - Implementación del patrón `cn()` combinando `clsx` y `tailwind-merge` para permitir la sobreescritura segura de clases de Tailwind sin conflictos de especificidad.
2. **Custom Hooks:**
   - Creación de hooks personalizados (`useAuth`, `useAppContext`, `useTheme`) que encapsulan el acceso al contexto y lanzan errores tempranos si se usan fuera de su Provider.
3. **Tipado Estricto (TypeScript):**
   - Definición clara de interfaces (`User`, `AppEvent`, `SurveyResponse`) para asegurar la integridad de los datos a lo largo del flujo de la aplicación.
4. **Diseño Mobile-First & Responsivo:**
   - Uso de `env(safe-area-inset-bottom)` para evitar superposiciones con las barras de navegación del sistema operativo (iOS/Android).
   - Implementación de CSS Grid (`md:grid-cols-12`) y Flexbox para adaptar los layouts complejos en pantallas grandes sin perder la esencia del diseño original.
   - Ocultamiento de barras de desplazamiento (`scrollbar-hide`) para una experiencia más nativa.
   - Transiciones suaves (`transition-colors`, `animate-in`) para reducir la carga cognitiva durante los cambios de estado y navegación.
   - Paleta de colores semántica (ej. `rose-500` para emergencias, `orange-500` para acciones primarias cálidas).
5. **Lazy Initialization:**
   - El estado inicial del `ThemeContext` se lee del `localStorage` usando una función de inicialización perezosa (`useState(() => ...)`), evitando lecturas síncronas innecesarias en cada render.
