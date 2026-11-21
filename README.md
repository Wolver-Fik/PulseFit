# 🏋️‍♂️ PulseFit

[Español](#-pulsefit---español) | [English](#-pulsefit---english)

---

## 🇪🇸 PulseFit - Español

> Aplicación web progresiva (PWA) minimalista, responsiva y **offline-first** para el registro diario de hábitos saludables: caminata/cardio, comidas y entrenamientos de fuerza/pesas con seguimiento de marcas personales.

### ✨ Características

- 🌍 **Soporte multi-idioma (5 idiomas)**: Selector discreto en la esquina superior derecha con soporte para **Español (ES)**, **English (EN)**, **Português (PT)**, **Français (FR)** e **Italiano (IT)**. Detección automática del idioma del navegador en la primera visita y persistencia de preferencia en `localStorage`.
- 🚶 **Caminata y cardio**: Registro de distancia (km), calorías activas, pasos, duración en minutos y notas del entrenamiento. Cálculo automático de rachas de días consecutivos y totales acumulados.
- 🥗 **Registro de comidas**: Seguimiento diario de desayuno, almuerzo, merienda, cena y comidas intermedias o bebidas.
- 💪 **Rutina y registro de pesas**:
  - Rutinas sugeridas organizadas por días de la semana (*Empuje A/B*, *Tirón A/B*) con descansos activos enfocados en caminadora.
  - Catálogo de ejercicios clasificado por equipamiento: máquina multifuncional, barra y banca, o mancuernas.
  - Carga de series, repeticiones y peso (kg) por ejercicio.
  - Historial de levantamientos y panel de **mejores marcas personales**.
- 📊 **Resumen total**: Calendario interactivo semanal y métricas globales consolidadas (días entrenados, volumen total de peso levantado, km totales, etc.).
- 🌓 **Modo oscuro automático**: Se adapta dinámicamente a la preferencia de color del sistema operativo.
- ⚡ **Offline-first (Sin conexión)**: Gracias al Service Worker (`sw.js`), una vez cargada por primera vez funciona sin conexión a internet.
- 🔒 **Privacidad total**: Todos los datos se almacenan exclusivamente en el dispositivo mediante `localStorage`. No requiere servidores externos ni recolección de datos personales.

### 🚀 Despliegue en GitHub Pages

La aplicación está completamente configurada con **rutas relativas (`./`)**, lo que permite alojarla y servirla sin inconvenientes dentro de subcarpetas (como `https://<usuario>.github.io/<repositorio>/`).

1. Sube este repositorio a tu cuenta de GitHub.
2. En GitHub, ve a **Settings** > **Pages**.
3. En **Build and deployment**:
   - **Source**: `Deploy from a branch`.
   - **Branch**: Selecciona `main` (o `master`), carpeta `/ (root)` y haz clic en **Save**.
4. GitHub generará la URL pública de la aplicación (ejemplo: `https://<tu-usuario>.github.io/pulsefit/`).

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

### 💡 Consideraciones importantes

- **Almacenamiento local**: La información que registras se guarda únicamente en el navegador del dispositivo donde la usas (`localStorage`).
- **Actualización de la app**: Si realizas modificaciones en el código (`index.html`, etc.), incrementa la versión del caché en `sw.js` (ejemplo: cambiar `var CACHE = 'pulsefit-v2';` por `'pulsefit-v3'`) para actualizar los dispositivos.

---

## 🇬🇧 PulseFit - English

> A minimalist, responsive, and **offline-first** Progressive Web App (PWA) designed to track daily fitness habits: walking/cardio, meals, and strength/weightlifting with personal record tracking.

### ✨ Features

- 🌍 **Multi-language support (5 languages)**: Discreet language switcher in the top-right corner with full support for **Español (ES)**, **English (EN)**, **Português (PT)**, **Français (FR)**, and **Italiano (IT)**. Automatically detects browser language on first visit and saves your preference in `localStorage`.
- 🚶 **Walking & Cardio Tracking**: Log distance (km), active calories, steps, duration (minutes), and workout notes. Automatically calculates consecutive day streaks and cumulative totals.
- 🥗 **Meal Logging**: Daily tracking for breakfast, lunch, afternoon snack, dinner, and throughout-the-day snacks or beverages.
- 💪 **Gym Routine & Weightlifting Log**:
  - Structured routine organized by days (*Push A/B*, *Pull A/B*) with active recovery treadmill days.
  - Exercise catalog categorized by equipment: multifunction machine, barbell & bench, or dumbbells.
  - Log sets, reps, and weight (kg) per exercise.
  - History log and **personal records (PRs)** tracking table.
- 📊 **Weekly & Total Summaries**: Interactive weekly calendar and consolidated global metrics (workout days, total volume lifted, total km, etc.).
- 🌓 **Automatic Dark / Light Theme**: Seamlessly matches your system appearance.
- ⚡ **Offline-First PWA**: Powered by a Service Worker (`sw.js`), ensuring complete functionality even without an internet connection after the first load.
- 🔒 **Total Privacy**: All data is stored locally on your device via `localStorage`. No external servers, logins, or tracking.

### 🚀 Deploying to GitHub Pages

The application is fully configured with **relative paths (`./`)**, making it ready to be hosted in subfolders (e.g., `https://<username>.github.io/<repository>/`).

1. Push this repository to your GitHub account.
2. In your GitHub repository, go to **Settings** > **Pages**.
3. Under **Build and deployment**:
   - **Source**: `Deploy from a branch`.
   - **Branch**: Select `main` (or `master`), folder `/ (root)` and click **Save**.
4. GitHub will publish your app at `https://<your-username>.github.io/pulsefit/`.

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
- **Cache Updates**: When updating code, remember to increment the cache name in `sw.js` (e.g., change `var CACHE = 'pulsefit-v2';` to `'pulsefit-v3'`) so clients automatically refresh their offline cache.

---

## 📂 Project Structure / Estructura del proyecto

```text
pulsefit/
├── index.html             # UI, responsive styles, multi-language engine & app logic
├── manifest.webmanifest   # PWA manifest (metadata, icons & display configuration)
├── sw.js                  # Service Worker (offline cache management)
├── icon-180.png           # Apple Touch Icon (180x180)
├── icon-192.png           # Standard PWA icon (192x192)
├── icon-512.png           # High-resolution & maskable PWA icon (512x512)
└── README.md              # Project documentation (Bilingual ES / EN)
```
