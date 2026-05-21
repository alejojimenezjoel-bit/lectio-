# 🕊️ Lectio

Acompañante bíblico contemplativo para tradiciones católica, ortodoxa y ortodoxa oriental.

Esta guía está pensada para alguien que **lo hace por primera vez**. No hace falta saber programar. Lee con calma y ve paso a paso. Si algo no sale, no pasa nada: se puede repetir sin romper nada.

---

## 🧭 ¿Qué es esto y cómo funciona?

Lectio funciona en **dos modos**, y cambia solo:

- **MODO DEMO (gratis):** mientras no pongas una clave de IA, Lectio se ve y se navega perfectamente, pero responde con un mensaje de ejemplo. Coste: **0 €**. Ideal para enseñar el diseño y validar si gusta.
- **MODO REAL:** el día que pongas tu clave de Anthropic, Lectio empieza a responder de verdad. No hay que cambiar el código: solo añadir la clave en un sitio (te lo explico al final).

El plan es: **primero publicarlo gratis en modo demo**, y activar la IA cuando tú quieras.

---

## 📋 Lo que necesitas (ya lo tienes)

- Una cuenta de **GitHub** ✅
- Una cuenta de **Vercel** ✅

No necesitas instalar nada en tu ordenador. Lo haremos todo desde el navegador.

---

## PASO 1 — Subir el proyecto a GitHub

GitHub es donde "vive" el código de tu app.

1. Entra en **github.com** y, arriba a la derecha, pulsa el **+** y luego **"New repository"**.
2. En **"Repository name"** escribe: `lectio`
3. Déjalo en **"Public"** (o "Private" si lo prefieres; las dos valen).
4. **NO** marques ninguna casilla de "Add a README" ni nada (ya lo trae el proyecto).
5. Pulsa **"Create repository"**.
6. En la página que aparece, busca el enlace pequeño que dice **"uploading an existing file"** (subir un archivo existente) y púlsalo.
7. **Arrastra a la ventana TODAS las carpetas y archivos** de este proyecto (la carpeta `app`, la carpeta `lib`, y los archivos `package.json`, `next.config.js`, `.gitignore`, `.env.example`, `README.md`).
   - ⚠️ Importante: **no** subas ninguna carpeta `node_modules` ni `.next` si llegaran a aparecer, ni ningún archivo `.env.local` con claves. (Este proyecto no los incluye, así que estás a salvo.)
8. Abajo, pulsa el botón verde **"Commit changes"**.

✅ Listo. Tu código ya está en GitHub.

---

## PASO 2 — Publicar en Vercel

Vercel coge tu código de GitHub y lo convierte en una web con una dirección real.

1. Entra en **vercel.com** e inicia sesión **con tu cuenta de GitHub** (es lo más cómodo).
2. En el panel, pulsa **"Add New…"** → **"Project"**.
3. Verás la lista de tus repositorios de GitHub. Busca **`lectio`** y pulsa **"Import"**.
   - Si no aparece, pulsa "Adjust GitHub App Permissions" y dale acceso al repositorio.
4. Vercel detecta solo que es un proyecto Next.js. **No tienes que cambiar nada** de la configuración.
5. Pulsa **"Deploy"**.
6. Espera uno o dos minutos. Cuando termine, verás una pantalla de felicitación y un botón **"Visit"** o **"Continue to Dashboard"**.

✅ ¡Tu app está publicada! Tendrá una dirección parecida a `https://lectio-xxxx.vercel.app`. Ábrela en el móvil, enséñasela a quien quieras: funciona en modo demo.

---

## PASO 3 (más adelante) — Activar la IA de verdad

Cuando hayas validado que Lectio gusta y quieras que responda de verdad:

### 3.1 — Consigue tu clave de Anthropic
1. Entra en **console.anthropic.com** y crea una cuenta.
2. Ve a **"Billing"** y añade un poco de saldo (con 5 € te sobra para empezar a probar).
3. 🔒 **Pon un límite de gasto** (un "spend limit", por ejemplo 10 €/mes). Es tu red de seguridad: si algo se dispara, se corta solo.
4. Ve a **"API Keys"** → **"Create Key"**. Copia la clave (empieza por `sk-ant-...`). Guárdala bien: solo se muestra una vez.

### 3.2 — Pega la clave en Vercel (no en el código)
1. En Vercel, entra en tu proyecto `lectio`.
2. Ve a **"Settings"** → **"Environment Variables"**.
3. Crea una nueva variable:
   - **Name (nombre):** `ANTHROPIC_API_KEY`
   - **Value (valor):** tu clave (la que empieza por `sk-ant-...`)
4. Pulsa **"Save"**.
5. Ve a la pestaña **"Deployments"**, busca el último despliegue, pulsa los tres puntitos **(···)** y elige **"Redeploy"**. Esto reinicia la app con la clave puesta.

✅ A partir de ahora, Lectio responde con la IA de verdad. Tu clave está guardada de forma segura en el servidor de Vercel: **nunca aparece en el navegador y nadie puede robarla.**

> 💡 Para volver al modo demo (gratis), basta con borrar esa variable y volver a hacer "Redeploy".

---

## ✏️ ¿Cómo cambio cosas más adelante?

- **El comportamiento o el tono de Lectio** → archivo `lib/systemPrompt.js`
- **El diseño (colores, tipografías)** → archivo `app/globals.css`
- **La pantalla y los textos** → archivo `app/page.js`

Cada vez que cambies algo en GitHub, Vercel vuelve a publicar la app sola, en un par de minutos.

---

## 📱 Convertir Lectio en app instalable (PWA)

Lectio ya es una **PWA**: una web que se puede instalar en el móvil con su icono y abrirse a pantalla completa, como una app normal. No hace falta App Store ni Google Play, y es gratis.

### Si actualizas un proyecto que ya tenías subido

Sube a GitHub (con "Add file" → "Upload files", igual que antes) **estos archivos nuevos o cambiados**:
- La carpeta **`public`** entera (contiene el icono y el manifest).
- La carpeta **`app/components`** (con el registro del service worker).
- El archivo **`app/layout.js`** (actualizado).

GitHub te preguntará si quieres reemplazar `layout.js`: dile que sí. Vercel volverá a publicar solo en uno o dos minutos.

### Cómo instalarla en el móvil

**En iPhone (Safari):**
1. Abre tu dirección `https://lectio-...vercel.app` en **Safari** (tiene que ser Safari, no Chrome).
2. Pulsa el botón de **Compartir** (el cuadrado con la flecha hacia arriba).
3. Baja y elige **"Añadir a pantalla de inicio"**.
4. Confirma. ¡Ya tienes el icono de Lectio en tu móvil!

**En Android (Chrome):**
1. Abre tu dirección en **Chrome**.
2. Pulsa el menú de los tres puntos arriba a la derecha.
3. Elige **"Instalar aplicación"** o **"Añadir a pantalla de inicio"**.
4. Confirma.

Al abrirla desde el icono, se verá a pantalla completa, sin la barra del navegador. 🎉

---

## 🆘 Si algo sale mal

No te preocupes: nada de esto puede "romperse" de forma permanente. Si un despliegue falla, Vercel te lo dice y puedes volver a intentarlo. Cuando te atasques, copia el mensaje de error que veas y lo resolvemos juntos.

---

Hecho con cuidado. Que acompañe a quien lo necesite. 🕊️
