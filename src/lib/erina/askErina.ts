import {
  getSaldoSegundos,
  getStatusCLT,
  getTotalPausasSegundos,
  type JornadaSnapshot,
} from "@/store/useJornadaStore";
import { formatHM, formatHMSigned } from "@/lib/utils";

/** Remove acentos para facilitar o matching por palavra-chave. */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function contem(alvo: string, termos: string[]): boolean {
  return termos.some((t) => alvo.includes(t));
}

/**
 * Responde perguntas do usuário na voz da Erina — pura, offline, sem rede.
 * Matching por palavras-chave sobre um snapshot do estado.
 */
export function askErina(state: JornadaSnapshot, pergunta: string): string {
  const q = normalizar(pergunta);

  // Regras / CLT / conformidade
  if (
    contem(q, [
      "regra",
      "clt",
      "conform",
      "dentro das regras",
      "legisla",
      "legal",
    ])
  ) {
    const clt = getStatusCLT(state);
    if (clt.conforme) {
      return "Sim! Você está dentro das regras hoje ✅. Fez seu intervalo, está dentro do limite de jornada e sem horas extras. Pode ficar tranquila.";
    }
    const foraDoLimite = clt.itens.find((i) => !i.ok);
    return `Hoje tem um ponto de atenção: ${
      foraDoLimite ? foraDoLimite.label.toLowerCase() : "algo fora do padrão"
    }. ${clt.descricao}`;
  }

  // Hora extra (checar antes de "saldo/horas" para não colidir)
  if (contem(q, ["hora extra", "extra", "posso ficar", "posso continuar"])) {
    const restante = state.metaSegundos - state.segundosTrabalhados;
    if (restante > 0) {
      return `Dá pra fazer um pouquinho, mas lembre que o limite diário são ${formatHM(
        state.metaSegundos
      )} (10:00 com extras). Recomendo não passar de ${formatHM(
        state.metaSegundos + 1800
      )}. Sua saúde vem primeiro 💛.`;
    }
    return "Você já bateu a meta do dia. Se puder, encerre e descanse — hora extra de vez em quando tudo bem, mas sua saúde vem primeiro 💛.";
  }

  // Saldo / horas / banco de horas
  if (contem(q, ["saldo", "hora", "banco", "trabalhei", "trabalhado"])) {
    const saldo = getSaldoSegundos(state);
    const dentro = state.segundosTrabalhados <= state.metaSegundos;
    return `Hoje você já trabalhou ${formatHM(
      state.segundosTrabalhados
    )} de uma meta de ${formatHM(
      state.metaSegundos
    )}. Seu saldo do dia está em ${formatHMSigned(saldo)} — ${
      dentro ? "dentro da meta" : "precisa de atenção"
    }.`;
  }

  // Pausas / intervalos / descanso
  if (contem(q, ["pausa", "intervalo", "descanso", "descansar"])) {
    const total = getTotalPausasSegundos(state);
    const n = state.pausas.length;
    if (n === 0) {
      return "Você ainda não fez nenhuma pausa hoje. Que tal 5 minutinhos? Seu corpo agradece 💛.";
    }
    return `Você fez ${n} ${
      n === 1 ? "pausa" : "pausas"
    } hoje, somando ${formatHM(total)}. ${
      total >= 900
        ? "Ótimo cuidado com seus intervalos!"
        : "Se der, faça mais uma pausinha ao longo do dia."
    }`;
  }

  // Água / hidratação
  if (contem(q, ["agua", "hidrat", "beber", "sede"])) {
    const min = Math.floor(state.segundosDesdeUltimaAgua / 60);
    return `Já faz uns ${min} min desde seu último gole d'água 💧. Que tal se hidratar agora? Faz bem pra você.`;
  }

  // Fallback acolhedor
  return "Ainda estou aprendendo 💛. Posso te ajudar com: suas horas e saldo, se você está dentro das regras da CLT, suas pausas e horas extras. É só perguntar!";
}
