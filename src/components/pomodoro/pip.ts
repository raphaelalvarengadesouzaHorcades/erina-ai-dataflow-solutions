import {
  usePomodoroStore,
  type PomodoroState,
} from "@/store/usePomodoroStore";

/* ------------------------------------------------------------------ */
/* Helpers de formatação e tema                                        */
/* ------------------------------------------------------------------ */

/** Formata segundos totais em "MM:SS". */
export function formatMMSS(totalSegundos: number): string {
  const s = Math.max(0, Math.floor(totalSegundos));
  const m = Math.floor(s / 60);
  const seg = s % 60;
  return `${String(m).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
}

/** Detecta suporte à Document Picture-in-Picture (Chrome/Edge). */
export function pipDisponivel(): boolean {
  return typeof window !== "undefined" && "documentPictureInPicture" in window;
}

/** Lê um token de cor do :root; cai em fallback se indisponível. */
function tokenCor(nome: string, fallback: string): string {
  try {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue(nome)
      .trim();
    return v || fallback;
  } catch {
    return fallback;
  }
}

/* ------------------------------------------------------------------ */
/* Tipagem mínima da API documentPictureInPicture                      */
/* ------------------------------------------------------------------ */

interface DocumentPiP {
  requestWindow: (opts?: {
    width?: number;
    height?: number;
  }) => Promise<Window>;
  window: Window | null;
}

function getDocPiP(): DocumentPiP | null {
  const w = window as unknown as { documentPictureInPicture?: DocumentPiP };
  return w.documentPictureInPicture ?? null;
}

/* ------------------------------------------------------------------ */
/* Abertura da janela flutuante                                        */
/* ------------------------------------------------------------------ */

let unsubscribe: (() => void) | null = null;

/**
 * Abre (ou reusa) a janela Picture-in-Picture com um Pomodoro simples,
 * ligado ao mesmo store. Robusto a falhas — nunca lança.
 */
export async function abrirJanelaFlutuante(): Promise<void> {
  try {
    const dpip = getDocPiP();
    if (!dpip) return;

    // Se já existe uma janela aberta, apenas foca.
    if (dpip.window) {
      try {
        dpip.window.focus();
      } catch {
        /* ignora */
      }
      return;
    }

    const pipWindow = await dpip.requestWindow({ width: 320, height: 360 });

    // Cores atuais (lidas dos tokens; fallback = tema escuro).
    const cores = {
      page: tokenCor("--page", "#0e1016"),
      card: tokenCor("--card", "#171a21"),
      ink: tokenCor("--ink", "#f4f5f7"),
      muted: tokenCor("--muted", "#9aa1ad"),
      border: tokenCor("--border-soft", "#262a33"),
      primary: tokenCor("--primary", "#6366f1"),
      success: tokenCor("--success", "#22c55e"),
    };

    const doc = pipWindow.document;
    doc.documentElement.lang = "pt-BR";

    // Estilos base copiados/derivados do tema.
    const style = doc.createElement("style");
    style.textContent = `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background: ${cores.page};
        color: ${cores.ink};
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        -webkit-font-smoothing: antialiased;
      }
      .card {
        width: 100%;
        max-width: 288px;
        background: ${cores.card};
        border: 1px solid ${cores.border};
        border-radius: 20px;
        padding: 20px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
      }
      .titulo {
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.02em;
        color: ${cores.muted};
        text-transform: uppercase;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .modo {
        font-size: 12px;
        font-weight: 600;
        padding: 2px 10px;
        border-radius: 999px;
      }
      .tempo {
        font-size: 60px;
        font-weight: 700;
        line-height: 1;
        font-variant-numeric: tabular-nums;
        font-feature-settings: "tnum";
      }
      .botoes { display: flex; gap: 8px; margin-top: 4px; }
      button {
        cursor: pointer;
        border: 1px solid ${cores.border};
        background: ${cores.card};
        color: ${cores.ink};
        border-radius: 12px;
        height: 44px;
        min-width: 44px;
        padding: 0 14px;
        font-size: 14px;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: filter .15s ease, opacity .15s ease;
      }
      button:hover { filter: brightness(1.15); }
      button:active { opacity: .8; }
      button.primario {
        border-color: transparent;
        background: ${cores.primary};
        color: #ffffff;
      }
    `;
    doc.head.appendChild(style);

    // Estrutura montada via DOM (sem innerHTML) — conteúdo estático e seguro.
    const card = doc.createElement("div");
    card.className = "card";

    const titulo = doc.createElement("div");
    titulo.className = "titulo";
    titulo.textContent = "🍅 Pomodoro";

    const elModo = doc.createElement("div");
    elModo.className = "modo";

    const elTempo = doc.createElement("div");
    elTempo.className = "tempo";
    elTempo.textContent = "00:00";

    const botoes = doc.createElement("div");
    botoes.className = "botoes";

    const btnToggle = doc.createElement("button");
    btnToggle.className = "primario";
    btnToggle.textContent = "Iniciar";

    const btnReset = doc.createElement("button");
    btnReset.textContent = "Resetar";
    btnReset.title = "Resetar";

    botoes.append(btnToggle, btnReset);
    card.append(titulo, elModo, elTempo, botoes);
    doc.body.append(card);

    const aplicarEstado = (s: PomodoroState) => {
      try {
        elTempo.textContent = formatMMSS(s.segundosRestantes);
        elModo.textContent = s.modo === "foco" ? "Foco" : "Pausa";
        const acento = s.modo === "foco" ? cores.primary : cores.success;
        elModo.style.color = acento;
        elModo.style.background = `${acento}22`;
        btnToggle.textContent = s.rodando ? "Pausar" : "Iniciar";
      } catch {
        /* ignora atualizações após fechamento */
      }
    };

    // Estado inicial + assinatura ao store.
    aplicarEstado(usePomodoroStore.getState());
    unsubscribe = usePomodoroStore.subscribe(aplicarEstado);

    // Liga botões às ações do store.
    btnToggle.addEventListener("click", () => {
      const st = usePomodoroStore.getState();
      if (st.rodando) st.pausar();
      else st.iniciar();
    });
    btnReset.addEventListener("click", () => {
      usePomodoroStore.getState().resetar();
    });

    // Limpeza ao fechar a janela.
    const limpar = () => {
      try {
        unsubscribe?.();
      } catch {
        /* ignora */
      }
      unsubscribe = null;
    };
    pipWindow.addEventListener("pagehide", limpar, { once: true });
  } catch {
    /* Falha ao abrir PiP — segue sem quebrar a UI. */
  }
}
