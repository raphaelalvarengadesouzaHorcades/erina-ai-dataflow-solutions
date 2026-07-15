import { Info, CircleCheck, TriangleAlert, CircleX, type LucideIcon } from "lucide-react";
import type { TipoNotificacao } from "@/store/useNotificacoesStore";

export interface VisualTipo {
  Icone: LucideIcon;
  /** Cor do ícone (token semântico). */
  cor: string;
  /** Fundo suave do "chip" do ícone (token semântico). */
  fundo: string;
  /** Rótulo acessível do tipo. */
  rotulo: string;
}

/**
 * Mapeia o tipo da notificação para ícone e cores (apenas tokens semânticos).
 * "alerta" reaproveita o token de warning via texto/borda; "erro" usa danger.
 */
export function visualDoTipo(tipo: TipoNotificacao): VisualTipo {
  switch (tipo) {
    case "sucesso":
      return {
        Icone: CircleCheck,
        cor: "text-success",
        fundo: "bg-success-light",
        rotulo: "Sucesso",
      };
    case "alerta":
      return {
        Icone: TriangleAlert,
        cor: "text-warning",
        fundo: "bg-warning/10",
        rotulo: "Alerta",
      };
    case "erro":
      return {
        Icone: CircleX,
        cor: "text-danger",
        fundo: "bg-danger/10",
        rotulo: "Erro",
      };
    case "info":
    default:
      return {
        Icone: Info,
        cor: "text-primary",
        fundo: "bg-primary-light",
        rotulo: "Informação",
      };
  }
}
