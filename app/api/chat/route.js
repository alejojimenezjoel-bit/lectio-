// app/api/chat/route.js
// Esta es la "centralita" de Lectio. Vive en el SERVIDOR (no en el navegador),
// así que tu clave de API queda protegida y nadie puede verla.
//
// FUNCIONA EN DOS MODOS, automáticamente:
//   1. MODO DEMO (gratis): si NO has configurado la clave de API, Lectio
//      responde con un mensaje de ejemplo. Sirve para enseñar el diseño y el flujo
//      sin gastar ni un céntimo.
//   2. MODO REAL: en cuanto añadas tu clave (variable ANTHROPIC_API_KEY),
//      Lectio empieza a responder de verdad con Claude. No hay que tocar más nada.

import { getSystemPrompt } from "../../../lib/systemPrompt";

export const runtime = "edge"; // Rápido y gratis en Vercel.

const DEMO_REPLY = `*La paz contigo.*

Estás viendo Lectio en **modo demostración**: el diseño y el recorrido funcionan, pero todavía no he activado la inteligencia que da las respuestas de verdad.

Cuando quieras encenderla, solo hay que añadir una clave de API (te explico cómo en el archivo README). A partir de ese momento, en este mismo espacio recibirás una respuesta cuidada: un pasaje bíblico, su contexto, y un acompañamiento sereno desde tu tradición.

¿Damos el paso cuando estés listo?`;

export async function POST(request) {
  try {
    const { messages, tradition } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Faltan los mensajes." }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // ── MODO DEMO ────────────────────────────────────────────────
    // Sin clave configurada: devolvemos una respuesta de ejemplo. Coste: 0 €.
    if (!apiKey) {
      return Response.json({ reply: DEMO_REPLY, demo: true });
    }

    // ── MODO REAL ────────────────────────────────────────────────
    // Con clave configurada: llamamos a Claude de verdad.
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        // Sonnet: el mejor equilibrio calidad/precio para acompañamiento con matiz.
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: getSystemPrompt(tradition),
        messages: messages,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Error de la API de Anthropic:", response.status, detail);
      return Response.json(
        { error: "No se pudo obtener respuesta de la IA en este momento." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = (data.content || [])
      .map((c) => (c.type === "text" ? c.text : ""))
      .filter(Boolean)
      .join("\n")
      .trim();

    if (!reply) {
      return Response.json(
        { error: "La respuesta llegó vacía. Inténtalo de nuevo." },
        { status: 502 }
      );
    }

    return Response.json({ reply, demo: false });
  } catch (err) {
    console.error("Error en /api/chat:", err);
    return Response.json(
      { error: "Ha ocurrido un error inesperado en el servidor." },
      { status: 500 }
    );
  }
}
