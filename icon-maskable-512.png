// app/layout.js
// El "marco" que envuelve toda la app: tipografías, título, y ahora también
// la configuración de PWA (manifest, icono, colores) para que se pueda instalar.

import "./globals.css";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";

export const metadata = {
  title: "Lectio — Sabiduría bíblica para tu día a día",
  description:
    "Un compañero contemplativo que te ayuda a escuchar lo que las Escrituras dicen sobre lo que vives.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lectio",
  },
  icons: {
    icon: "/favicon-32.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#6b1d28",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
