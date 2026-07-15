// Rota da Erina — integra uma IA real (DeepSeek via OpenRouter) para resumir
// mensagens, calendário, tarefas e jornada. Robusta por design: qualquer falha
// (sem chave, timeout, erro de rede, status != ok) devolve HTTP 200 com
// { resposta: null } para o cliente cair no fallback determinístico offline.

import { renderizarContexto } from "@/lib/erina/contexto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Mensagem {
  role: "system" | "user" | "assistant";
  content: string;
}

interface CorpoRequisicao {
  pergunta?: string;
  contexto?: unknown;
  historico?: Array<{ role?: string; content?: string }>;
}

const PERSONA = [
  "Você é a Erina, assistente de IA de bem-estar no trabalho do app \"Controle de Jornada\".",
  "Sua filosofia é a \"gestão por cuidado\": você é acolhedora, calorosa e prática.",
  "Fale sempre em português do Brasil (pt-BR), com naturalidade e leveza. Pode usar um emoji ocasional (💛, ✅, 💧), sem exageros.",
  "Responda de forma CURTA e ÚTIL. Quando a pessoa pedir para resumir mensagens, e-mails, agenda ou tarefas, RESUMA de verdade os itens fornecidos no contexto — cite remetentes, assuntos e o que precisa de ação, priorizando o que está não lido ou urgente.",
  "Baseie-se apenas nos dados do CONTEXTO abaixo. Não invente informações que não estejam lá. Se algo não estiver no contexto, diga com gentileza que não tem essa informação.",
  "Cuide também do bem-estar: lembre de pausas, descanso e limites da jornada quando fizer sentido, sem ser insistente.",
].join(" ");

function sanitizarHistorico(historico: CorpoRequisicao["historico"]): Mensagem[] {
  if (!Array.isArray(historico)) return [];
  return historico
    .filter((m) => m && typeof m.content === "string" && m.content.trim().length > 0)
    .slice(-8)
    .map((m) => ({
      role: m.role === "assistant" || m.role === "system" ? m.role : "user",
      content: String(m.content),
    }));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CorpoRequisicao;
    const pergunta = typeof body?.pergunta === "string" ? body.pergunta.trim() : "";

    if (!pergunta) {
      return Response.json({ resposta: null }, { status: 200 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      // Sem chave configurada → deixa o cliente usar o fallback offline.
      return Response.json({ resposta: null }, { status: 200 });
    }

    const modelo = process.env.ERINA_MODEL ?? "deepseek/deepseek-chat";
    const contextoTexto = renderizarContexto(body?.contexto);

    const system: string = contextoTexto
      ? `${PERSONA}\n\n--- CONTEXTO DO DIA DA MARIANA ---\n${contextoTexto}`
      : PERSONA;

    const messages: Mensagem[] = [
      { role: "system", content: system },
      ...sanitizarHistorico(body?.historico),
      { role: "user", content: pergunta },
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);

    let resp: Response;
    try {
      resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://controle-jornada.app",
          "X-Title": "Erina",
        },
        body: JSON.stringify({
          model: modelo,
          messages,
          temperature: 0.4,
          max_tokens: 700,
        }),
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!resp.ok) {
      return Response.json({ resposta: null }, { status: 200 });
    }

    const data = (await resp.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const resposta = data?.choices?.[0]?.message?.content?.trim();

    if (!resposta) {
      return Response.json({ resposta: null }, { status: 200 });
    }

    return Response.json({ resposta }, { status: 200 });
  } catch {
    // Nunca vaza a chave nem detalhes; a demo não pode quebrar.
    return Response.json({ resposta: null }, { status: 200 });
  }
}
