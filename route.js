// app/page.js
// La pantalla principal de Lectio. Maneja dos vistas: la elección de tradición
// (onboarding) y el chat. Habla con el servidor a través de /api/chat.

"use client";

import { useState, useRef, useEffect } from "react";
import { TRADITION_LABELS, WELCOMES } from "../lib/systemPrompt";

const TRADITIONS = [
  {
    id: "catolica",
    name: "Católica",
    desc: "Iglesia católica romana e iglesias orientales en comunión con Roma. Canon de 73 libros, Magisterio, padres latinos y griegos.",
  },
  {
    id: "ortodoxa",
    name: "Ortodoxa",
    desc: "Iglesias ortodoxas calcedonias —griega, rusa, antioquena, serbia y otras. Septuaginta, padres griegos, hesicasmo.",
  },
  {
    id: "ortodoxa-oriental",
    name: "Ortodoxa Oriental",
    desc: "Iglesias precalcedonias —copta, etíope, armenia, siríaca, eritrea, malankar. Canon amplio, padres siriacos y alejandrinos.",
  },
];

// Convierte el texto con formato sencillo (Markdown ligero) en HTML seguro.
function formatText(text) {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const inline = (t) =>
    t
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/_(.+?)_/g, "<em>$1</em>");

  return escaped
    .split(/\n\n+/)
    .map((para) => {
      if (para.trim().startsWith("&gt;")) {
        const content = para.replace(/^&gt;\s*/gm, "").trim();
        return `<div class="crisis-info">${inline(content)}</div>`;
      }
      return `<p>${inline(para).replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
}

export default function Home() {
  const [tradition, setTradition] = useState(null);
  const [messages, setMessages] = useState([]); // {role, content}
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [modal, setModal] = useState(null); // null | 'about' | 'confirm-reset'

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isWaiting]);

  function selectTradition(id) {
    setTradition(id);
    setMessages([]);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function doReset() {
    setTradition(null);
    setMessages([]);
    setModal(null);
  }

  function handleReset() {
    if (messages.length > 0) setModal("confirm-reset");
    else doReset();
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || isWaiting) return;

    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsWaiting(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, tradition }),
      });
      const data = await res.json();

      if (data.reply) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content:
              "_Disculpa, no he conseguido responderte ahora mismo. Inténtalo de nuevo en un momento, por favor._",
          },
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "_Disculpa, ha habido un problema de conexión. Inténtalo de nuevo en un momento, por favor._",
        },
      ]);
    } finally {
      setIsWaiting(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function handleKeydown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // ─────────── ONBOARDING ───────────
  if (!tradition) {
    return (
      <div className="onboarding">
        <div className="onboarding-inner">
          <div className="brand-mark">Lectio</div>
          <h1>
            Sabiduría bíblica
            <br />
            <em>para tu día a día</em>
          </h1>
          <div className="ornament">❦</div>
          <p className="subtitle">
            Un compañero contemplativo que te ayuda a escuchar lo que las Escrituras dicen
            sobre lo que vives.
          </p>
          <p className="tradition-prompt">— ¿En qué tradición te ubicas? —</p>
          <div className="traditions">
            {TRADITIONS.map((t) => (
              <div key={t.id} className="tradition-card" onClick={() => selectTradition(t.id)}>
                <div className="tradition-name">{t.name}</div>
                <div className="tradition-desc">{t.desc}</div>
              </div>
            ))}
          </div>
          <p className="onboarding-footer">Podrás cambiar tu elección en cualquier momento.</p>
        </div>
      </div>
    );
  }

  // ─────────── CHAT ───────────
  const welcome = WELCOMES[tradition];

  return (
    <div className="chat">
      <header className="chat-header">
        <div className="header-brand">
          <span className="name">Lectio</span>
          <span className="tradition-tag">· {TRADITION_LABELS[tradition].toLowerCase()}</span>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => setModal("about")} title="Sobre Lectio">
            i
          </button>
          <button className="icon-btn" onClick={handleReset} title="Cambiar tradición">
            ↻
          </button>
        </div>
      </header>

      <div className="messages-container">
        <div className="messages-inner">
          <div className="welcome-message">
            <div className="greeting">{welcome.greeting}</div>
            <div className="invitation">{welcome.invitation}</div>
          </div>

          {messages.map((m, i) => (
            <div key={i} className={`message ${m.role}`}>
              <div className="message-meta">{m.role === "user" ? "tú" : "Lectio"}</div>
              <div
                className="message-body"
                dangerouslySetInnerHTML={{ __html: formatText(m.content) }}
              />
            </div>
          ))}

          {isWaiting && (
            <div className="message assistant">
              <div className="message-meta">Lectio</div>
              <div className="message-body">
                <div className="typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="input-area">
        <div className="input-inner">
          <textarea
            ref={inputRef}
            className="message-input"
            placeholder="Escribe lo que llevas dentro…"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeydown}
          />
          <button
            className="send-btn"
            onClick={sendMessage}
            disabled={isWaiting || !input.trim()}
            title="Enviar"
          >
            →
          </button>
        </div>
        <p className="footer-note">
          Lectio no sustituye a tu confesor, párroco, sacerdote ni a un profesional de salud o
          derecho. <a onClick={() => setModal("about")}>Más información</a>
        </p>
      </div>

      {/* Modales */}
      {modal === "about" && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <h2>Sobre Lectio</h2>
            <p>
              Lectio es un acompañante bíblico contemplativo. Te ayuda a leer la Escritura
              aplicada a lo que vives, desde tu tradición cristiana (católica, ortodoxa u
              ortodoxa oriental).
            </p>
            <p>
              <strong>Lo que Lectio puede hacer:</strong> compartir pasajes, contextos, lecturas
              tradicionales e interpretaciones, y acompañarte con empatía y claridad.
            </p>
            <p>
              <strong>Lo que Lectio no es:</strong> no sustituye a un sacerdote, confesor o padre
              espiritual. No es un profesional de salud mental, médico ni abogado. No interpreta
              señales personales ni da mensajes proféticos.
            </p>
            <p>
              <strong>Si vives una crisis:</strong> en España, llama al <strong>024</strong>{" "}
              (línea de atención a la conducta suicida), al <strong>717 003 717</strong> (Teléfono
              de la Esperanza) o al <strong>112</strong> en emergencias.
            </p>
            <button className="close-btn" onClick={() => setModal(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {modal === "confirm-reset" && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <h2>¿Empezar de nuevo?</h2>
            <p>Se perderá la conversación actual y podrás elegir otra tradición desde el inicio.</p>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", flexWrap: "wrap" }}>
              <button className="close-btn" onClick={doReset}>
                Sí, empezar de nuevo
              </button>
              <button className="close-btn secondary" onClick={() => setModal(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
