# 🏋️‍♂️ PulseFit

[Español](#-pulsefit---español) | [English](#-pulsefit---english)

---

## 🇪🇸 PulseFit - Español

> Aplicación web progresiva (PWA) minimalista, responsiva y **offline-first** para el registro diario de hábitos saludables: caminata/cardio, comidas y entrenamientos de fuerza/pesas con seguimiento de marcas personales.

### ✨ Características

- 🌍 **Soporte multi-idioma (5 idiomas)**: Selector discreto en la esquina superior derecha con soporte para **Español (ES)**, **English (EN)**, **Português (PT)**, **Français (FR)** e **Italiano (IT)**. Detección automática del idioma del navegador en la primera visita y persistencia de preferencia en `localStorage`.
- 🚶 **Caminata y cardio**: Registro de distancia (km), calorías activas, pasos, duración en minutos y notas del entrenamiento. Cálculo automático de rachas de días consecutivos y totales acumulados.
- 🥗 **Registro de comidas**: Seguimiento diario de desayuno, almuerzo, merienda, cena y comidas intermedias o bebidas.
- ⏱️ **Temporizador de descanso flotante**: Widget discreto en la esquina inferior con botones rápidos (60s, 90s, 120s), controles de pausar y reiniciar, minimizable en formato píldora, aviso sonoro suave mediante Web Audio API (sin archivos de audio externos) y vibración con Web Vibration API (`navigator.vibrate`), con soporte multi-idioma (ES, EN, PT, FR, IT).
- 💪 **Rutina y registro de pesas**:
  - Rutinas sugeridas organizadas por días de la semana (*Empuje A/B*, *Tirón A/B*) con descansos activos enfocados en caminadora.
  - Catálogo de ejercicios clasificado por equipamiento: máquina multifuncional, barra y banca, o mancuernas.
  - Carga de series, repeticiones y peso (kg) por ejercicio.
  - Historial de levantamientos y panel de **mejores marcas personales**.
- 📊 **Resumen total**: Calendario interactivo semanal y métricas globales consolidadas (días entrenados, volumen total de peso levantado, km totales, etc.).
- 🌓 **Modo oscuro automático**: Se adapta dinámicamente a la preferencia de color del sistema operativo.
- ⚡ **Offline-first (Sin conexión)**: Gracias al Service Worker (`sw.js`), una vez cargada por primera vez funciona sin conexión a internet.
- 🔒 **Privacidad total**: Todos los datos se almacenan exclusivamente en el dispositivo mediante `localStorage`. No requiere servidores externos ni recolección de datos personales.

### 📱 Cómo instalar la App en tu teléfono

Al ser una **Progressive Web App (PWA)** servida bajo HTTPS, puedes instalarla en tu pantalla de inicio como una aplicación nativa:

#### 🍏 En iPhone / iPad (Safari)
1. Abre el enlace de la aplicación en **Safari**.
2. Presiona el botón **Compartir** (icono de cuadrado con flecha hacia arriba).
3. Desplázate hacia abajo y selecciona **"Agregar a pantalla de inicio"**.
4. Toca **"Agregar"** en la esquina superior derecha.

#### 🤖 En Android (Chrome)
1. Abre el enlace de la aplicación en **Google Chrome**.
2. Toca el menú de tres puntos (⋮) o el botón flotante "Instalar aplicación".
3. Selecciona **"Agregar a la pantalla principal"** o **"Instalar aplicación"**.

### 💡 Consideración importante

- **Almacenamiento local**: La información que registras se guarda únicamente en el navegador del dispositivo donde la usas (`localStorage`).

---

## 🇬🇧 PulseFit - English

> A minimalist, responsive, and **offline-first** Progressive Web App (PWA) designed to track daily fitness habits: walking/cardio, meals, and strength/weightlifting with personal record tracking.

### ✨ Features

- 🌍 **Multi-language support (5 languages)**: Discreet language switcher in the top-right corner with full support for **Español (ES)**, **English (EN)**, **Português (PT)**, **Français (FR)**, and **Italiano (IT)**. Automatically detects browser language on first visit and saves your preference in `localStorage`.
- 🚶 **Walking & Cardio Tracking**: Log distance (km), active calories, steps, duration (minutes), and workout notes. Automatically calculates consecutive day streaks and cumulative totals.
- 🥗 **Meal Logging**: Daily tracking for breakfast, lunch, afternoon snack, dinner, and throughout-the-day snacks or beverages.
- ⏱️ **Floating Rest Timer**: Discreet widget in the bottom corner with quick presets (60s, 90s, 120s), pause and reset controls, minimizable pill mode, gentle synthesized chime using Web Audio API (zero external mp3 files), and mobile vibration using Web Vibration API (`navigator.vibrate`), fully translated into 5 languages (ES, EN, PT, FR, IT).
- 💪 **Gym Routine & Weightlifting Log**:
  - Structured routine organized by days (*Push A/B*, *Pull A/B*) with active recovery treadmill days.
  - Exercise catalog categorized by equipment: multifunction machine, barbell & bench, or dumbbells.
  - Log sets, reps, and weight (kg) per exercise.
  - History log and **personal records (PRs)** tracking table.
- 📊 **Weekly & Total Summaries**: Interactive weekly calendar and consolidated global metrics (workout days, total volume lifted, total km, etc.).
- 🌓 **Automatic Dark / Light Theme**: Seamlessly matches your system appearance.
- ⚡ **Offline-First PWA**: Powered by a Service Worker (`sw.js`), ensuring complete functionality even without an internet connection after the first load.
- 🔒 **Total Privacy**: All data is stored locally on your device via `localStorage`. No external servers, logins, or tracking.

### 📱 Installing as a Mobile App

Because PulseFit is a **Progressive Web App (PWA)** served over HTTPS, you can install it directly to your home screen:

#### 🍏 iOS / iPadOS (Safari)
1. Open the app link in **Safari**.
2. Tap the **Share** button (square with an upward arrow).
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **"Add"** in the top right corner.

#### 🤖 Android (Chrome)
1. Open the app link in **Google Chrome**.
2. Tap the three-dot menu (⋮) or tap the "Install app" prompt.
3. Select **"Add to Home screen"** or **"Install"**.

### 💡 Notes

- **Local Storage**: Your entries are stored strictly within your browser's `localStorage`.

---
