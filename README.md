# PulseFit

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-PulseFit-6366F1)](https://wolver-fik.github.io/PulseFit/)

[English](#english) · [Español](#español)

---

## English

**PulseFit** is a minimalist, offline-first Progressive Web App (PWA) for tracking strength training, customizable cardio routines, and daily progression with zero ads, accounts, or servers.

### ✨ Key Features

* **Dynamic Strength & Gym Builder:** Adapts routines to your available equipment (dumbbells, barbells, cables, machines, bodyweight, or home setup), split (*PPL*, *Upper/Lower*, *Full Body*, *Home*), and goal (*Hypertrophy*, *Strength*, *Toning*, *Metabolic*).
* **Customizable Cardio Planner:** Tailors workouts to your available gear (treadmill, bike, elliptical, stair climber, rower, jump rope, or outdoor walking) and goal (*LISS Fat Burn*, *Endurance*, *HIIT*, *Daily Steps*).
* **Floating Rest Timer:** Built-in countdown timer with haptic feedback (`Web Vibration API`) and synthesized audio alerts (`Web Audio API`).
* **Cardio Tracking**: Log distance (km), active calories, steps, duration (minutes), and workout notes. Automatically calculates consecutive day streaks and cumulative totals.
* **Meal Logging**: Daily tracking for breakfast, lunch, afternoon snack, dinner, and throughout-the-day snacks or beverages.
* **Weekly & Total Summaries**: Interactive weekly calendar and consolidated global metrics (workout days, total volume lifted, total km, etc.).
* **Monthly Activity Calendar:** Visual overview of every training day with strength, cardio and rest-day status at a glance.
* **Synced Weekly Planner:** Organize weight and cardio sessions for the week alongside planned rest days from a single schedule.
* **Period Performance Comparison:** Compare volume, distance and consistency between any two periods to spot real progress.
* **Body Measurements & Weight Log:** Record weight and body measurements over time and review their evolution next to your workouts.
* **Progress Analytics (`Chart.js`):** Tracks maximum lifted weight (`kg`) progression, personal records, and session totals.
* **Data Sovereignty:** 100% private `localStorage` persistence with one-click `.json` backup export and import.
* **8 Languages:** Full UI and date/number localization in **EN, ES, PT, FR, IT, DE, RU, JA**.
* **Automatic Dark / Light Theme**: Seamlessly matches your system appearance.
* **Offline-First & Auto-Updating:** Installable PWA with a `Network-First` Service Worker that updates silently in the background.
* **Total Privacy**: All data is stored locally on your device via `localStorage`. No external servers, logins, or tracking.

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

> **Tech Stack:** Vanilla JS (modular ES structure), CSS3, Chart.js, Service Worker API.

### License

[PolyForm Noncommercial License 1.0.0](./LICENSE) © 2026 Wolver-Fik.

---

<a id="español"></a>

## Español

**PulseFit** es una Progressive Web App (PWA) minimalista y *offline-first* para registrar entrenamientos de fuerza, planes de cardio configurables y progreso diario sin publicidad, cuentas ni servidores.

### ✨ Funciones Principales

* **Configurador de Pesas y Gimnasio:** Adapta tu rutina según el material o máquinas disponibles (mancuernas, barra, poleas, prensa, máquinas, peso corporal o equipo en casa), división (*Empuje/Tirón/Piernas*, *Torso/Pierna*, *Full Body*, *Casa*) y objetivo (*Hipertrofia*, *Fuerza*, *Tonificación*, *Metabólico*).
* **Planificador de Cardio Configurable:** Personaliza sesiones según el equipo disponible (cinta, bicicleta, elíptica, escaladora, remo, cuerda o caminata) y objetivo (*Quema de grasa LISS*, *Resistencia*, *HIIT*, *Pasos diarios*).
* **Temporizador de Descanso Flotante:** Cronómetro regresivo con vibración háptica (`Web Vibration API`) y alerta sonora sintetizada (`Web Audio API`).
* **Seguimiento de Cardio**: Registro de distancia (km), calorías activas, pasos, duración en minutos y notas del entrenamiento. Cálculo automático de rachas de días consecutivos y totales acumulados.
* **Registro de comidas**: Seguimiento diario de desayuno, almuerzo, merienda, cena y comidas intermedias o bebidas.
* **Resumen total**: Calendario interactivo semanal y métricas globales consolidadas (días entrenados, volumen total de peso levantado, km totales, etc.).
* **Calendario mensual de actividad:** Vista visual de cada día de entrenamiento con fuerza, cardio y descanso de un vistazo.
* **Planificación semanal sincronizada:** Organiza las sesiones de pesas y cardio junto a los días de descanso desde un mismo calendario.
* **Comparación de rendimiento entre periodos:** Contrasta volumen, distancia y constancia entre dos periodos para detectar avances reales.
* **Registro de medidas corporales y peso:** Anota tu peso y tus medidas corporales y revisa su evolución junto a los entrenamientos.
* **Gráficos de Evolución (`Chart.js`):** Visualiza la progresión de peso máximo (`kg`) por ejercicio, récords personales y totales acumulados.
* **Respaldo de Datos (JSON):** Almacenamiento 100% local en `localStorage` con exportación e importación en un clic (`.json`).
* **8 Idiomas:** Interfaz y formatos regionales en **ES, EN, PT, FR, IT, DE, RU, JA**.
* **Modo oscuro automático**: Se adapta dinámicamente a la preferencia de color del sistema operativo.
* **Offline-First y Autoactualizable:** PWA instalable con Service Worker *Network-First* que se actualiza automáticamente en segundo plano.
* **Privacidad total**: Todos los datos se almacenan exclusivamente en el dispositivo mediante `localStorage`. No requiere servidores externos ni recolección de datos personales.

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

> **Tecnologías:** JavaScript Vanilla (arquitectura modular), CSS3, Chart.js, Service Worker API.

### Licencia

[PolyForm Noncommercial License 1.0.0](./LICENSE) © 2026 Wolver-Fik.
