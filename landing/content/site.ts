/**
 * Toda a copy da landing page vive aqui, separada dos componentes.
 * Itens marcados com TODO dependem de dados reais da Hawks e devem ser
 * confirmados antes de publicar.
 */

export type Cta = { label: string; href: string };

export type ShiftScene = {
  id: "margin" | "alerts" | "forecast" | "expenses";
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
};

export type Step = { index: string; title: string; body: string };
export type Stat = { value: number; prefix?: string; suffix?: string; label: string; detail: string };
export type OfferItem = { title: string; body: string };
export type Faq = { q: string; a: string };

// TODO: substituir pelo número oficial (formato internacional, só dígitos).
const WHATSAPP_NUMBER = "5500000000000";
const WHATSAPP_MESSAGE = "Olá! Quero agendar uma demonstração do Hawks Finance para a minha agência.";

export const site = {
  name: "Hawks Finance",
  legalName: "Hawks Agência Digital",
  // TODO: domínio final de produção.
  url: "https://hawksfinance.com.br",
  locale: "pt_BR",
  title: "Hawks Finance — Inteligência financeira para agências digitais",
  description:
    "Margem real por cliente, previsão de caixa de 12 meses e alertas de risco automáticos. O centro de controle financeiro para donos de agências digitais.",
  keywords: [
    "gestão financeira para agências",
    "lucratividade por cliente",
    "previsão de fluxo de caixa",
    "controle financeiro agência de marketing",
    "dashboard financeiro",
  ],
  // TODO: e-mail comercial oficial.
  email: "contato@hawksfinance.com.br",
} as const;

export const primaryCta: Cta = {
  label: "Agendar demonstração",
  href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
};

export const nav = {
  links: [
    { label: "Produto", href: "#produto" },
    { label: "Como funciona", href: "#como-funciona" },
    { label: "Oferta", href: "#oferta" },
    { label: "Perguntas", href: "#perguntas" },
  ],
  cta: { label: "Agendar demo", href: primaryCta.href },
};

export const hero = {
  badge: "Para donos de agências digitais",
  // Até 8 palavras.
  headline: ["Saiba quanto cada cliente", "realmente lucra."],
  subheadline:
    "Margem por cliente, caixa projetado para 12 meses e alertas antes do prejuízo. Num único painel.",
  primary: primaryCta,
  secondary: { label: "Ver como funciona", href: "#como-funciona" },
  footnote: "Demonstração de 30 minutos com os números da sua agência.",
};

export const tension = {
  eyebrow: "O problema",
  lines: [
    "Sua agência fecha mais contratos.",
    "O caixa não acompanha.",
    "Tráfego e ferramentas consomem margem em silêncio.",
    "O cliente que mais fatura pode ser o que dá prejuízo.",
    "E você só descobre no fim do mês.",
  ],
  closing: "Faturar não é lucrar.",
};

export const shift = {
  eyebrow: "A virada",
  title: "Um centro de controle. Não mais uma planilha.",
  intro: "Quatro leituras que mudam as decisões da sua agência.",
  scenes: [
    {
      id: "margin",
      eyebrow: "01 — Lucratividade",
      title: "Cada cliente com sua margem real.",
      body: "Receita menos custo estimado, calculada por cliente e classificada automaticamente.",
      points: ["Acima de 20%: lucrativo", "Entre 0% e 20%: margem baixa", "Abaixo de zero: prejuízo"],
    },
    {
      id: "alerts",
      eyebrow: "02 — Alertas",
      title: "O risco aparece antes do prejuízo.",
      body: "Cinco gatilhos monitoram sua operação e avisam quando algo sai da linha.",
      points: ["Despesa acima da receita", "Caixa negativo em menos de 60 dias", "Recorrência que não cobre custos fixos"],
    },
    {
      id: "forecast",
      eyebrow: "03 — Previsão",
      title: "Seus próximos 12 meses, hoje.",
      body: "Receitas e despesas recorrentes projetam o caixa mês a mês, com a data exata em que ele zera.",
      points: ["Projeção mensal automática", "Linha de referência zero", "Dias até o caixa acabar"],
    },
    {
      id: "expenses",
      eyebrow: "04 — Despesas",
      title: "Onde o dinheiro está vazando.",
      body: "Gastos agrupados por categoria, com o peso de cada uma no total e o maior vazamento em destaque.",
      points: ["Tráfego, ferramentas e operação", "Percentual sobre o total", "Recorrente vs. pontual"],
    },
  ] satisfies ShiftScene[],
};

export const mechanism = {
  eyebrow: "Como funciona",
  title: "Da planilha ao controle em quatro passos.",
  steps: [
    { index: "01", title: "Estruture", body: "Cadastramos seus clientes, serviços e preços. Cada contrato ganha um custo estimado." },
    { index: "02", title: "Registre", body: "Receitas e despesas entram com recorrência mensal, semanal ou anual. Uma vez só." },
    { index: "03", title: "Leia", body: "O painel calcula margem, lucro líquido e projeção de caixa em tempo real." },
    { index: "04", title: "Decida", body: "Alertas apontam onde agir: renegociar, cortar, reajustar ou crescer." },
  ] satisfies Step[],
};

export const proof = {
  eyebrow: "Em números",
  title: "Clareza que se mede.",
  // Métricas do próprio produto. TODO: somar métricas de clientes reais quando houver.
  stats: [
    { value: 12, label: "meses de caixa projetado", detail: "Previsão mês a mês a partir da sua recorrência." },
    { value: 5, label: "alertas automáticos", detail: "Monitoramento contínuo de risco financeiro." },
    { value: 20, suffix: "%", label: "de margem mínima", detail: "Linha de corte que separa cliente saudável de risco." },
    { value: 1, label: "painel de decisão", detail: "Receitas, despesas, margem e caixa no mesmo lugar." },
  ] as Stat[],
  // Cenário ilustrativo, rotulado como tal na interface. TODO: trocar por case real quando houver autorização.
  scenario: {
    label: "Cenário ilustrativo",
    title: "Agência com 12 clientes e R$ 84 mil de faturamento mensal.",
    before: { label: "Antes", value: "Lucro percebido", detail: "Faturamento alto, sensação de crescimento, caixa sempre apertado." },
    after: {
      label: "Com Hawks Finance",
      value: "3 clientes no vermelho",
      detail: "Os contratos com maior volume de tráfego consumiam a margem dos outros nove.",
    },
  },
  marquee: [
    "Margem por cliente",
    "Receita recorrente",
    "Previsão de caixa",
    "Tráfego pago",
    "Ferramentas",
    "Lucro líquido",
    "Dias até zerar",
    "Despesas por categoria",
  ],
};

export const offer = {
  eyebrow: "A oferta",
  title: "Tudo o que você recebe.",
  core: {
    tag: "Núcleo",
    title: "Centro de Controle Hawks Finance",
    body: "O painel completo de inteligência financeira, configurado para a realidade da sua agência.",
  },
  included: [
    { title: "Implantação assistida", body: "Estruturamos clientes, serviços, receitas e despesas com você." },
    { title: "Lucratividade por cliente", body: "Margem calculada e classificada para cada contrato ativo." },
    { title: "Previsão de caixa de 12 meses", body: "Projeção com data exata de risco." },
    { title: "Alertas inteligentes", body: "Cinco gatilhos de risco ativos desde o primeiro dia." },
    { title: "Inteligência de despesas", body: "Categorias, percentuais e o maior vazamento em destaque." },
    { title: "Dados protegidos", body: "Banco PostgreSQL com políticas de acesso por linha (RLS)." },
  ] satisfies OfferItem[],
  bonus: {
    tag: "Bônus da demonstração",
    title: "Diagnóstico financeiro da sua agência",
    body: "Na call, analisamos seus números atuais e mostramos onde está a margem perdida. Você fica com o diagnóstico, contratando ou não.",
  },
  cta: primaryCta,
  note: "Sem compromisso. Você sai da call sabendo onde está o lucro da sua agência.",
};

export const faq = {
  eyebrow: "Perguntas",
  title: "O que costumam perguntar.",
  items: [
    {
      q: "Já controlo tudo em planilha. Por que mudar?",
      a: "Planilha registra o passado. O Hawks Finance calcula margem por cliente, projeta o caixa e avisa quando algo vai dar errado, sem fórmula quebrada e sem depender de quem montou a planilha.",
    },
    {
      q: "Minha agência é pequena. Faz sentido?",
      a: "Faz mais sentido ainda. Em agências com poucos clientes, um único contrato com margem negativa compromete o mês inteiro. Quanto antes você enxergar, menor o custo do erro.",
    },
    {
      q: "Quanto tempo leva para começar a usar?",
      // TODO: confirmar prazo real de implantação.
      a: "A implantação é assistida. Estruturamos clientes, serviços e recorrências com você, e o painel passa a funcionar assim que os primeiros lançamentos entram.",
    },
    {
      q: "Meus dados financeiros ficam seguros?",
      a: "Sim. Os dados ficam em banco PostgreSQL gerenciado, com políticas de acesso por linha (Row Level Security) e chaves de serviço usadas apenas no servidor.",
    },
    {
      q: "Integra direto com o meu banco?",
      a: "Hoje os lançamentos são registrados no sistema, com recorrência automática para o que se repete. Isso mantém o controle preciso e categorizado do jeito que a sua agência opera.",
    },
    {
      q: "Substitui meu contador?",
      a: "Não. O contador cuida de impostos e obrigações. O Hawks Finance cuida da decisão: qual cliente vale manter, qual despesa cortar e quando o caixa precisa de atenção.",
    },
  ] satisfies Faq[],
};

export const climax = {
  eyebrow: "Próximo passo",
  title: ["Pare de adivinhar.", "Comece a decidir."],
  body: "Cada mês sem visibilidade é margem que não volta. Em 30 minutos, você vê onde está o lucro da sua agência.",
  cta: primaryCta,
  // TODO: confirmar capacidade real antes de publicar. Deixe null para ocultar.
  urgency: "Agenda de implantações assistidas limitada por mês.",
};

export const footer = {
  tagline: "Inteligência financeira para agências digitais.",
  copyright: `© ${new Date().getFullYear()} Hawks Agência Digital. Todos os direitos reservados.`,
};
