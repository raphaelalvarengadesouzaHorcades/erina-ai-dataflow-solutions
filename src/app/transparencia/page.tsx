"use client";

import {
  Activity,
  Clock,
  Coffee,
  Droplets,
  Info,
  Lock,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import {
  CategoriaDadoCard,
  type CategoriaDado,
} from "@/components/transparencia/CategoriaDadoCard";
import { SeusDireitos } from "@/components/transparencia/SeusDireitos";

const CATEGORIAS: CategoriaDado[] = [
  {
    id: "jornada",
    nome: "Registro de jornada e pausas",
    icone: Clock,
    finalidade: "Calcular horas trabalhadas, banco de horas e cumprimento da CLT.",
    baseLegal: "Obrigação legal — Art. 7º, II (CLT/Portaria 671)",
    retencao: "5 anos (exigência trabalhista)",
    acesso: "Você e o RH, conforme a lei do ponto",
    padrao: true,
    opcional: false,
  },
  {
    id: "emails",
    nome: "Resumo de e-mails na pausa",
    icone: MessageCircle,
    finalidade:
      "Gerar um resumo do que chegou enquanto você descansava — só se você pedir.",
    baseLegal: "Consentimento — Art. 7º, I",
    retencao: "7 dias, depois apagado",
    acesso: "Somente você",
    padrao: false,
    opcional: true,
  },
  {
    id: "whatsapp",
    nome: "Resumo de WhatsApp na pausa",
    icone: MessageCircle,
    finalidade:
      "Resumir mensagens de trabalho recebidas fora do expediente, para você não perder nada importante.",
    baseLegal: "Consentimento — Art. 7º, I",
    retencao: "7 dias, depois apagado",
    acesso: "Somente você",
    padrao: false,
    opcional: true,
  },
  {
    id: "saude",
    nome: "Lembretes de saúde (água / alongar)",
    icone: Droplets,
    finalidade:
      "Enviar lembretes gentis de hidratação e pausas ativas ao longo do dia.",
    baseLegal: "Consentimento — Art. 7º, I",
    retencao: "30 dias",
    acesso: "Somente você",
    padrao: true,
    opcional: true,
  },
  {
    id: "bemestar",
    nome: "Métricas de bem-estar",
    icone: Activity,
    finalidade:
      "Compor um indicador coletivo de bem-estar da equipe para o gestor cuidar do clima.",
    baseLegal: "Consentimento — Art. 7º, I",
    retencao: "90 dias",
    acesso: "Gestor: apenas agregado e anônimo",
    padrao: false,
    opcional: true,
  },
];

export default function TransparenciaPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Cabeçalho */}
      <header>
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary shadow-sm">
            <ShieldCheck className="h-7 w-7 text-white" strokeWidth={2.2} />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-ink">
              Central de Transparência
            </h1>
            <p className="mt-1 max-w-2xl text-muted">
              Você vê e controla exatamente quais dados existem sobre você. Sem
              letras miúdas, sem vigilância escondida.
            </p>
          </div>
        </div>
      </header>

      {/* Seus dados */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold text-ink">Seus dados</h2>
          <p className="mt-1 text-sm text-muted">
            Cada categoria abaixo é explicada por inteiro. As coletas opcionais
            só acontecem se você ligar o botão — e você pode desligar quando
            quiser.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {CATEGORIAS.map((categoria) => (
            <CategoriaDadoCard key={categoria.id} categoria={categoria} />
          ))}
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary-light px-5 py-4">
          <Coffee className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={2.2} />
          <p className="text-sm leading-snug text-ink/80">
            Os resumos de e-mail e WhatsApp são pensados para as{" "}
            <span className="font-semibold text-ink">suas pausas</span>: servem
            para você desconectar tranquila e voltar sem susto — nunca para
            alguém vigiar sua conversa.
          </p>
        </div>
      </section>

      {/* Seus direitos LGPD */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold text-ink">Seus direitos (LGPD)</h2>
          <p className="mt-1 text-sm text-muted">
            Direitos garantidos pela Lei Geral de Proteção de Dados. Aqui eles
            são botões — não um formulário perdido no jurídico.
          </p>
        </div>
        <SeusDireitos />
      </section>

      {/* Rodapé */}
      <footer className="flex items-start gap-3 rounded-2xl border border-border-soft bg-card px-5 py-4 shadow-sm">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-page">
          <Lock className="h-4 w-4 text-muted" strokeWidth={2.2} />
        </span>
        <p className="text-xs leading-relaxed text-muted">
          <span className="inline-flex items-center gap-1 font-semibold text-ink">
            <Info className="h-3.5 w-3.5" /> Compromisso da Erina.
          </span>{" "}
          Seguimos a LGPD (Lei 13.709/2018) e os princípios de{" "}
          <span className="font-medium text-ink">finalidade</span>,{" "}
          <span className="font-medium text-ink">necessidade</span> e{" "}
          <span className="font-medium text-ink">minimização</span>: coletamos o
          mínimo indispensável, apenas para o fim declarado, e sempre com o seu
          consentimento quando não é uma obrigação legal. O gestor jamais vê
          dados individuais — só indicadores agregados e anônimos.
        </p>
      </footer>
    </div>
  );
}
