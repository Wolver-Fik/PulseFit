# PulseFit ðŸ‹ï¸â€â™‚ï¸ðŸƒâ€â™‚ï¸

**[Live Demo](https://wolver-fik.github.io/PulseFit/)** Â· **[PolyForm Noncommercial License 1.0.0](./LICENSE)** Â· **PWA Offline-First**

[English](#english) | [EspaÃ±ol](#espaÃ±ol)

---

## English

**PulseFit** is a minimalist, offline-first Progressive Web App (PWA) for tracking strength training, customizable cardio routines, and daily progression with zero ads, accounts, or servers.

### âœ¨ Key Features

* **Dynamic Strength & Gym Builder:** Adapts routines to your available equipment (dumbbells, barbells, cables, machines, bodyweight, or home setup), split (*PPL*, *Upper/Lower*, *Full Body*, *Home*), and goal (*Hypertrophy*, *Strength*, *Toning*, *Metabolic*).
* **Customizable Cardio Planner:** Tailors workouts to your available gear (treadmill, bike, elliptical, stair climber, rower, jump rope, or outdoor walking) and goal (*LISS Fat Burn*, *Endurance*, *HIIT*, *Daily Steps*).
* **Floating Rest Timer:** Built-in countdown timer with haptic feedback (`Web Vibration API`) and synthesized audio alerts (`Web Audio API`).
* **Cardio Tracking**: Log distance (km), active calories, steps, duration (minutes), and workout notes. Automatically calculates consecutive day streaks and cumulative totals.
* **Meal Logging**: Daily tracking for breakfast, lunch, afternoon snack, dinner, and throughout-the-day snacks or beverages.
* **Weekly & Total Summaries**: Interactive weekly calendar and consolidated global metrics (workout days, total volume lifted, total km, etc.).
* **Progress Analytics (`Chart.js`):** Tracks maximum lifted weight (`kg`) progression, personal records, and session totals.
* **Data Sovereignty:** 100% private `localStorage` persistence with one-click `.json` backup export and import.
* **8 Languages:** Full UI and date/number localization in **EN, ES, PT, FR, IT, DE, RU, JA**.
* **Automatic Dark / Light Theme**: Seamlessly matches your system appearance.
* **Offline-First & Auto-Updating:** Installable PWA with a `Network-First` Service Worker that updates silently in the background.
* **Total Privacy**: All data is stored locally on your device via `localStorage`. No external servers, logins, or tracking.

* ### ðŸ“± Installing as a Mobile App

Because PulseFit is a **Progressive Web App (PWA)** served over HTTPS, you can install it directly to your home screen:

#### ðŸ iOS / iPadOS (Safari)
1. Open the app link in **Safari**.
2. Tap the **Share** button (square with an upward arrow).
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **"Add"** in the top right corner.

#### ðŸ¤– Android (Chrome)
1. Open the app link in **Google Chrome**.
2. Tap the three-dot menu (â‹®) or tap the "Install app" prompt.
3. Select **"Add to Home screen"** or **"Install"**.

> **Tech Stack:** Vanilla JS (modular ES structure), CSS3, Chart.js, Service Worker API.

---

## EspaÃ±ol

**PulseFit** es una Progressive Web App (PWA) minimalista y *offline-first* para registrar entrenamientos de fuerza, planes de cardio configurables y progreso diario sin publicidad, cuentas ni servidores.

### âœ¨ Funciones Principales

* **Configurador de Pesas y Gimnasio:** Adapta tu rutina segÃºn el material o mÃ¡quinas disponibles (mancuernas, barra, poleas, prensa, mÃ¡quinas, peso corporal o equipo en casa), divisiÃ³n (*Empuje/TirÃ³n/Piernas*, *Torso/Pierna*, *Full Body*, *Casa*) y objetivo (*Hipertrofia*, *Fuerza*, *TonificaciÃ³n*, *MetabÃ³lico*).
* **Planificador de Cardio Configurable:** Personaliza sesiones segÃºn el equipo disponible (cinta, bicicleta, elÃ­ptica, escaladora, remo, cuerda o caminata) y objetivo (*Quema de grasa LISS*, *Resistencia*, *HIIT*, *Pasos diarios*).
* **Temporizador de Descanso Flotante:** CronÃ³metro regresivo con vibraciÃ³n hÃ¡ptica (`Web Vibration API`) y alerta sonora sintetizada (`Web Audio API`).
* **Seguimiento de Cardio**: Registro de distancia (km), calorÃ­as activas, pasos, duraciÃ³n en minutos y notas del entrenamiento. CÃ¡lculo automÃ¡tico de rachas de dÃ­as consecutivos y totales acumulados.
* **Registro de comidas**: Seguimiento diario de desayuno, almuerzo, merienda, cena y comidas intermedias o bebidas.
* **Resumen total**: Calendario interactivo semanal y mÃ©tricas globales consolidadas (dÃ­as entrenados, volumen total de peso levantado, km totales, etc.).
* **GrÃ¡ficos de EvoluciÃ³n (`Chart.js`):** Visualiza la progresiÃ³n de peso mÃ¡ximo (`kg`) por ejercicio, rÃ©cords personales y totales acumulados.
* **Respaldo de Datos (JSON):** Almacenamiento 100% local en `localStorage` con exportaciÃ³n e importaciÃ³n en un clic (`.json`).
* **8 Idiomas:** Interfaz y formatos regionales en **ES, EN, PT, FR, IT, DE, RU, JA**.
* **Modo oscuro automÃ¡tico**: Se adapta dinÃ¡micamente a la preferencia de color del sistema operativo.
* **Offline-First y Autoactualizable:** PWA instalable con Service Worker *Network-First* que se actualiza automÃ¡ticamente en segundo plano.
* **Privacidad total**: Todos los datos se almacenan exclusivamente en el dispositivo mediante `localStorage`. No requiere servidores externos ni recolecciÃ³n de datos personales.

### ðŸ“± CÃ³mo instalar la App en tu telÃ©fono

Al ser una **Progressive Web App (PWA)** servida bajo HTTPS, puedes instalarla en tu pantalla de inicio como una aplicaciÃ³n nativa:

#### ðŸ En iPhone / iPad (Safari)
1. Abre el enlace de la aplicaciÃ³n en **Safari**.
2. Presiona el botÃ³n **Compartir** (icono de cuadrado con flecha hacia arriba).
3. DesplÃ¡zate hacia abajo y selecciona **"Agregar a pantalla de inicio"**.
4. Toca **"Agregar"** en la esquina superior derecha.

#### ðŸ¤– En Android (Chrome)
1. Abre el enlace de la aplicaciÃ³n en **Google Chrome**.
2. Toca el menÃº de tres puntos (â‹®) o el botÃ³n flotante "Instalar aplicaciÃ³n".
3. Selecciona **"Agregar a la pantalla principal"** o **"Instalar aplicaciÃ³n"**.

> **TecnologÃ­as:** JavaScript Vanilla (arquitectura modular), CSS3, Chart.js, Service Worker API.

