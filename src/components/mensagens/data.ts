// Dados mockados para a Caixa de Entrada da Erina (e-mail + WhatsApp).
// Tudo fictício e coerente com a persona Mariana Souza (desenvolvedora).

export type Email = {
  id: string;
  remetente: string;
  email: string;
  inicial: string;
  cor: string; // classes de fundo do avatar (usa tokens/paleta segura)
  assunto: string;
  previa: string;
  corpo: string[]; // parágrafos do corpo
  horario: string;
  naoLido: boolean;
  sugestoes: RascunhoErina[];
};

export type RascunhoErina = {
  id: string;
  rotulo: string; // resumo curto exibido no cartão
  texto: string; // texto completo carregado na resposta
  tom: "rápido" | "cordial" | "formal";
};

export type Bolha = {
  id: string;
  de: "eu" | "contato";
  texto: string;
  hora: string;
};

export type Conversa = {
  id: string;
  nome: string;
  inicial: string;
  cor: string;
  descricao: string; // ex.: "RH", "Cliente"
  ultimaMsg: string;
  horario: string;
  naoLidas: number;
  online: boolean;
  mensagens: Bolha[];
  sugestoes: string[]; // respostas rápidas prontas
};

// Paleta de avatares (cores fixas OK apenas para o círculo do avatar,
// contrastam bem no claro e no escuro).
const AVATAR = {
  indigo: "bg-indigo-500 text-white",
  emerald: "bg-emerald-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
  sky: "bg-sky-500 text-white",
  violet: "bg-violet-500 text-white",
  teal: "bg-teal-500 text-white",
} as const;

export const EMAILS: Email[] = [
  {
    id: "e1",
    remetente: "Camila Ribeiro",
    email: "camila.ribeiro@empresa.com",
    inicial: "CR",
    cor: AVATAR.indigo,
    assunto: "Confirmação da reunião de sexta",
    previa:
      "Oi Mariana! Só confirmando nossa reunião de sexta às 14h para revisar o roadmap...",
    corpo: [
      "Oi Mariana, tudo bem?",
      "Só passando para confirmar nossa reunião de sexta-feira às 14h, na sala Aurora, para revisarmos o roadmap do próximo trimestre.",
      "Se precisar remarcar, me avisa com antecedência que eu ajusto a agenda por aqui. Vou levar os números atualizados da última sprint.",
      "Abraço,\nCamila",
    ],
    horario: "09:12",
    naoLido: true,
    sugestoes: [
      {
        id: "e1-s1",
        rotulo: "Confirmar presença 👍",
        tom: "rápido",
        texto:
          "Oi Camila! Confirmo presença na sexta às 14h na sala Aurora. Já deixo o roadmap aberto aqui do meu lado. Até lá! 👍",
      },
      {
        id: "e1-s2",
        rotulo: "Pedir para remarcar às 15h",
        tom: "cordial",
        texto:
          "Oi Camila, tudo ótimo! Consigo sexta, mas às 14h fica apertado para mim. Conseguimos mover para as 15h? Se der certo, já confirmo e levo minhas anotações da sprint. Obrigada!",
      },
      {
        id: "e1-s3",
        rotulo: "Resposta mais formal",
        tom: "formal",
        texto:
          "Prezada Camila,\n\nConfirmo minha participação na reunião de sexta-feira, às 14h, na sala Aurora. Estarei com o roadmap e os indicadores da última sprint em mãos para a discussão.\n\nAtenciosamente,\nMariana Souza",
      },
    ],
  },
  {
    id: "e2",
    remetente: "GitHub",
    email: "notifications@github.com",
    inicial: "GH",
    cor: AVATAR.violet,
    assunto: "[PR #482] Revisão solicitada: refatorar módulo de auth",
    previa:
      "Rafael Nunes pediu sua revisão no pull request #482 no repositório controle-jornada...",
    corpo: [
      "Rafael Nunes solicitou sua revisão no pull request #482:",
      "refatorar módulo de auth — extrair validação de token para middleware.",
      "12 arquivos alterados · +284 −131 · 3 commits.",
      "Você pode revisar diretamente pelo GitHub ou responder por aqui.",
    ],
    horario: "08:47",
    naoLido: true,
    sugestoes: [
      {
        id: "e2-s1",
        rotulo: "Vou revisar ainda hoje",
        tom: "rápido",
        texto:
          "Oi Rafael! Recebi o PR #482, consigo revisar ainda hoje à tarde e já te devolvo com os comentários. 🙌",
      },
      {
        id: "e2-s2",
        rotulo: "Perguntar sobre testes",
        tom: "cordial",
        texto:
          "Oi Rafael, obrigada pelo PR! Antes de revisar: os testes do middleware novo já estão cobrindo o caso de token expirado? Quero garantir isso antes de aprovar. Assim que confirmar, eu passo o pente-fino.",
      },
    ],
  },
  {
    id: "e3",
    remetente: "Ana Martins — RH",
    email: "ana.martins@empresa.com",
    inicial: "AM",
    cor: AVATAR.rose,
    assunto: "Seu banco de horas está positivo — que tal uma folga?",
    previa:
      "Mariana, notamos que você acumulou 9h30 no banco de horas. Você tem direito a compensar...",
    corpo: [
      "Oi Mariana!",
      "Passando para avisar que seu banco de horas fechou o mês com saldo positivo de 9h30. Pelas regras da CLT e da nossa política interna, você pode compensar esse tempo em folga ou saída antecipada.",
      "Quer que eu já reserve uma tarde livre para você na próxima semana? É só me dizer o dia.",
      "Cuide-se! 💚\nAna, do RH",
    ],
    horario: "Ontem",
    naoLido: false,
    sugestoes: [
      {
        id: "e3-s1",
        rotulo: "Aceitar folga na sexta",
        tom: "cordial",
        texto:
          "Oi Ana, que notícia boa! Pode reservar a tarde de sexta que vem para mim, por favor? Vou aproveitar para descansar. Obrigada por avisar! 💚",
      },
      {
        id: "e3-s2",
        rotulo: "Guardar as horas por enquanto",
        tom: "cordial",
        texto:
          "Oi Ana, obrigada pelo cuidado! Por enquanto prefiro guardar as horas, estou numa entrega importante. Assim que ela sair, eu te procuro para marcar a folga. 🙂",
      },
    ],
  },
  {
    id: "e4",
    remetente: "Pedro Almeida",
    email: "pedro@cliente-nexus.com",
    inicial: "PA",
    cor: AVATAR.sky,
    assunto: "Dúvida sobre a entrega do dashboard",
    previa:
      "Bom dia, Mariana! Ficou uma dúvida aqui do nosso lado sobre a data de entrega do painel...",
    corpo: [
      "Bom dia, Mariana!",
      "Aqui é o Pedro, da Nexus. Ficou uma dúvida do nosso lado: a entrega do dashboard de indicadores ainda está prevista para o dia 22, certo?",
      "Precisamos alinhar internamente uma apresentação para a diretoria e queremos ter certeza da data antes de agendar.",
      "Obrigado desde já!\nPedro",
    ],
    horario: "Ontem",
    naoLido: false,
    sugestoes: [
      {
        id: "e4-s1",
        rotulo: "Confirmar a data (22)",
        tom: "cordial",
        texto:
          "Bom dia, Pedro! Confirmado: a entrega do dashboard segue prevista para o dia 22. Podem agendar a apresentação com tranquilidade. Qualquer ajuste de última hora, aviso com antecedência. Abraço!",
      },
      {
        id: "e4-s2",
        rotulo: "Confirmar + oferecer prévia",
        tom: "cordial",
        texto:
          "Bom dia, Pedro! A data do dia 22 está mantida. Se ajudar no alinhamento com a diretoria, consigo te enviar uma prévia navegável já na próxima terça — assim vocês não chegam sem contexto na reunião. Quer que eu prepare?",
      },
      {
        id: "e4-s3",
        rotulo: "Versão formal",
        tom: "formal",
        texto:
          "Prezado Pedro,\n\nConfirmo que a entrega do dashboard de indicadores permanece agendada para o dia 22. Vocês podem prosseguir com o agendamento da apresentação à diretoria.\n\nFico à disposição para qualquer alinhamento adicional.\n\nAtenciosamente,\nMariana Souza",
      },
    ],
  },
  {
    id: "e5",
    remetente: "Erina — Controle de Jornada",
    email: "erina@controle-jornada.app",
    inicial: "✨",
    cor: AVATAR.indigo,
    assunto: "Seu resumo da semana está pronto",
    previa:
      "Oi, Mariana! Preparei um resumo da sua semana: você bateu a meta de foco e fez todas as pausas...",
    corpo: [
      "Oi, Mariana! Aqui é a Erina. 💜",
      "Preparei o resumo da sua semana: você cumpriu a meta de foco em 4 dos 5 dias, fez todas as pausas recomendadas e encerrou o expediente no horário em 3 dias — melhor que a semana passada!",
      "Continue assim. Se quiser, posso sugerir um planejamento mais leve para sexta.",
      "Um abraço,\nErina",
    ],
    horario: "Seg",
    naoLido: false,
    sugestoes: [
      {
        id: "e5-s1",
        rotulo: "Quero o plano leve de sexta",
        tom: "rápido",
        texto:
          "Adorei, Erina! Pode sim montar um planejamento mais leve para sexta. 🙌",
      },
    ],
  },
  {
    id: "e6",
    remetente: "Comunidade DevBR",
    email: "news@devbr.com",
    inicial: "DB",
    cor: AVATAR.teal,
    assunto: "Newsletter · 5 novidades do ecossistema front-end",
    previa:
      "As principais atualizações da semana: nova versão do framework, dicas de performance e mais...",
    corpo: [
      "Olá, dev! Confira as novidades da semana:",
      "1. Nova versão LTS do framework com melhorias de performance.",
      "2. Guia prático de acessibilidade em formulários.",
      "3. Como reduzir o bundle em 30% com imports dinâmicos.",
      "Boa leitura!",
    ],
    horario: "Seg",
    naoLido: false,
    sugestoes: [
      {
        id: "e6-s1",
        rotulo: "Agradecer / responder rápido",
        tom: "rápido",
        texto: "Obrigada pela curadoria, conteúdo ótimo desta semana! 👏",
      },
    ],
  },
];

export const CONVERSAS: Conversa[] = [
  {
    id: "w1",
    nome: "Ana — RH",
    inicial: "A",
    cor: AVATAR.rose,
    descricao: "RH",
    ultimaMsg: "Consegue passar aqui rapidinho hoje?",
    horario: "10:24",
    naoLidas: 2,
    online: true,
    mensagens: [
      { id: "w1-1", de: "contato", texto: "Oi Mari, bom dia! 😊", hora: "10:20" },
      {
        id: "w1-2",
        de: "contato",
        texto:
          "Preciso alinhar contigo sobre o seu banco de horas, é bem rapidinho.",
        hora: "10:22",
      },
      {
        id: "w1-3",
        de: "contato",
        texto: "Consegue passar aqui rapidinho hoje?",
        hora: "10:24",
      },
    ],
    sugestoes: [
      "Oi Ana! Consigo sim, pode ser depois do almoço? 🙌",
      "Claro! Me chama que eu já vou aí.",
      "Bom dia! Hoje tá corrido, pode ser amanhã de manhã?",
    ],
  },
  {
    id: "w2",
    nome: "Time Produto",
    inicial: "TP",
    cor: AVATAR.violet,
    descricao: "Grupo · 6 pessoas",
    ultimaMsg: "Rafael: subi o PR, alguém revisa? 🙏",
    horario: "09:50",
    naoLidas: 5,
    online: false,
    mensagens: [
      {
        id: "w2-1",
        de: "contato",
        texto: "Bom dia, time! Daily em 10 min 👇",
        hora: "09:30",
      },
      {
        id: "w2-2",
        de: "eu",
        texto: "Bom dia! Já entro.",
        hora: "09:31",
      },
      {
        id: "w2-3",
        de: "contato",
        texto: "Rafael: subi o PR, alguém revisa? 🙏",
        hora: "09:50",
      },
    ],
    sugestoes: [
      "Eu pego a revisão! 🙋‍♀️",
      "Consigo revisar depois da daily.",
      "Já te respondo 🙌",
    ],
  },
  {
    id: "w3",
    nome: "Pedro (cliente)",
    inicial: "P",
    cor: AVATAR.sky,
    descricao: "Cliente · Nexus",
    ultimaMsg: "A entrega do dia 22 continua de pé?",
    horario: "09:15",
    naoLidas: 1,
    online: true,
    mensagens: [
      { id: "w3-1", de: "contato", texto: "Oi Mariana, tudo bem?", hora: "09:14" },
      {
        id: "w3-2",
        de: "contato",
        texto: "A entrega do dia 22 continua de pé?",
        hora: "09:15",
      },
    ],
    sugestoes: [
      "Oi Pedro! Continua sim, dia 22 confirmado. 👍",
      "Tudo ótimo! Já te confirmo por e-mail também.",
      "Pode ser amanhã às 10h uma call rápida pra alinhar?",
    ],
  },
  {
    id: "w4",
    nome: "Rafael Nunes",
    inicial: "R",
    cor: AVATAR.emerald,
    descricao: "Dev · Time",
    ultimaMsg: "Valeu pela força na review! 🚀",
    horario: "Ontem",
    naoLidas: 0,
    online: false,
    mensagens: [
      {
        id: "w4-1",
        de: "contato",
        texto: "Mari, consegui resolver aquele bug do token 🎉",
        hora: "18:02",
      },
      { id: "w4-2", de: "eu", texto: "Aeee! Mandou bem 👏", hora: "18:05" },
      { id: "w4-3", de: "contato", texto: "Valeu pela força na review! 🚀", hora: "18:06" },
    ],
    sugestoes: [
      "Disponha! Qualquer coisa é só chamar 😄",
      "Bora pra próxima! 🚀",
      "Obrigada, recebido!",
    ],
  },
  {
    id: "w5",
    nome: "Mãe 💚",
    inicial: "M",
    cor: AVATAR.emerald,
    descricao: "Família",
    ultimaMsg: "Não esquece de almoçar direito, viu? ❤️",
    horario: "Ontem",
    naoLidas: 0,
    online: false,
    mensagens: [
      { id: "w5-1", de: "contato", texto: "Oi filha, como foi o dia?", hora: "19:40" },
      { id: "w5-2", de: "eu", texto: "Foi corrido mas bom, mãe! E aí?", hora: "19:55" },
      {
        id: "w5-3",
        de: "contato",
        texto: "Não esquece de almoçar direito, viu? ❤️",
        hora: "20:01",
      },
    ],
    sugestoes: [
      "Pode deixar, mãe! Já almocei certinho hoje 😌",
      "Amo você! Falo mais tarde 💚",
      "Te ligo à noite, tá?",
    ],
  },
  {
    id: "w6",
    nome: "Financeiro",
    inicial: "F",
    cor: AVATAR.amber,
    descricao: "Interno",
    ultimaMsg: "Seu reembolso foi aprovado ✅",
    horario: "Ter",
    naoLidas: 0,
    online: false,
    mensagens: [
      {
        id: "w6-1",
        de: "contato",
        texto: "Olá! Seu reembolso do curso foi aprovado ✅",
        hora: "14:10",
      },
      {
        id: "w6-2",
        de: "contato",
        texto: "O valor cai na próxima folha. Qualquer dúvida, estamos à disposição.",
        hora: "14:11",
      },
    ],
    sugestoes: [
      "Que ótimo, muito obrigada! 🙏",
      "Perfeito, recebido!",
      "Obrigada pelo retorno rápido! 😊",
    ],
  },
];
