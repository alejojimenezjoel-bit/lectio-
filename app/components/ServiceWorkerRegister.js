// app/components/ServiceWorkerRegister.js
// Pequeño componente que activa el service worker cuando la app carga.
// No muestra nada en pantalla; solo hace que la instalación sea posible.

"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.log("No se pudo registrar el service worker:", err));
    }
  }, []);

  return null;
}
