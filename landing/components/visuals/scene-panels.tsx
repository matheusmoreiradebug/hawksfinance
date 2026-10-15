import { AlertTriangle, OctagonAlert, TrendingDown } from "lucide-react";
import { AppChrome, Kpi } from "./chrome";
import { ForecastChart } from "./forecast-chart";
import { cn } from "@/lib/utils";
import type { ShiftScene } from "@/content/site";

// Todos os dados abaixo são ilustrativos, apenas para demonstrar a interface.

const clients = [
  { name: "Studio Norte", revenue: "R$ 18.000", margin: 38 },
  { name: "Lumen Educação", revenue: "R$ 12.500", margin: 27 },
  { name: "Grupo Atlas", revenue: "R$ 21.000", margin: 14 },
  { name: "Casa Brava", revenue: "R$ 6.800", margin: 9 },
  { name: "Vértice Saúde", revenue: "R$ 15.200", margin: -6 },
];

function MarginPanel() {
  return (
    <AppChrome title="clientes / lucratividade">
      <ul className="divide-y divide-white/[0.05] p-2">
        {clients.map((c) => {
          const tone = c.margin >= 20 ? "ok" : c.margin >= 0 ? "warn" : "bad";
          return (
            <li key={c.name} className="flex items-center gap-4 px-3 py-3">
              <span className="flex-1 truncate text-sm text-fog-100">{c.name}</span>
              <span className="hidden font-mono text-xs text-fog-500 sm:block">{c.revenue}</span>
              <div className="relative h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.06] md:w-28">
                <span
                  className={cn("absolute inset-y-0 left-0 rounded-full", tone === "ok" && "bg-emerald-400/80", tone === "warn" && "bg-amber-400/80", tone === "bad" && "bg-rose-400/80")}
                  style={{ width: `${Math.max(6, Math.abs(c.margin) * 2.2)}%` }}
                />
              </div>
              <span
                className={cn("w-12 text-right font-mono text-xs tabular-nums", tone === "ok" && "text-emerald-300", tone === "warn" && "text-amber-300", tone === "bad" && "text-rose-300")}
              >
                {c.margin > 0 ? "+" : ""}
                {c.margin}%
              </span>
            </li>
          );
        })}
      </ul>
    </AppChrome>
  );
}

const alerts = [
  { icon: OctagonAlert, title: "Despesas acima da receita", body: "Outubro fecha com R$ 3,2k negativos.", tone: "bad" },
  { icon: AlertTriangle, title: "Caixa em risco", body: "Saldo zera em 48 dias no ritmo atual.", tone: "warn" },
  { icon: TrendingDown, title: "Recorrência insuficiente", body: "Receita fixa cobre 86% dos custos fixos.", tone: "warn" },
] as const;

function AlertsPanel() {
  return (
    <AppChrome title="centro-de-controle / alertas">
      <ul className="space-y-2 p-3 md:p-4">
        {alerts.map(({ icon: Icon, title, body, tone }) => (
          <li key={title} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
            <span
              className={cn(
                "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset",
                tone === "bad" ? "bg-rose-400/10 text-rose-300 ring-rose-400/20" : "bg-amber-400/10 text-amber-300 ring-amber-400/20",
              )}
            >
              <Icon className="size-3.5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-medium text-fog-100">{title}</p>
              <p className="mt-0.5 text-[13px] text-fog-400">{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </AppChrome>
  );
}

function ForecastPanel() {
  return (
    <AppChrome title="caixa / previsão-12-meses">
      <div className="p-4 md:p-5">
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <Kpi label="Saldo projetado em 12m" value="-R$ 4,1k" delta="abaixo de zero no mês 11" tone="down" />
          <Kpi label="Dias até zerar" value="318" delta="no ritmo atual" />
        </div>
        <div className="mt-4 h-36 md:h-44">
          <ForecastChart showZero series={[48, 46, 43, 41, 36, 32, 27, 22, 16, 9, 2, -4]} />
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] text-fog-500">
          <span>nov</span>
          <span>mai</span>
          <span>out</span>
        </div>
      </div>
    </AppChrome>
  );
}

const expenses = [
  { name: "Tráfego pago", pct: 46, value: "R$ 33,1k", leak: true },
  { name: "Ferramentas", pct: 22, value: "R$ 15,8k" },
  { name: "Equipe freelancer", pct: 19, value: "R$ 13,7k" },
  { name: "Operação", pct: 13, value: "R$ 9,4k" },
];

function ExpensesPanel() {
  return (
    <AppChrome title="despesas / por-categoria">
      <ul className="space-y-4 p-4 md:p-5">
        {expenses.map((e) => (
          <li key={e.name}>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-fog-100">
                {e.name}
                {e.leak ? <span className="rounded-md bg-accent/15 px-1.5 py-0.5 font-mono text-[10px] text-accent-soft ring-1 ring-inset ring-accent/30">maior vazamento</span> : null}
              </span>
              <span className="font-mono text-xs text-fog-400 tabular-nums">
                {e.value} · {e.pct}%
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <span className={cn("block h-full rounded-full", e.leak ? "bg-accent" : "bg-white/25")} style={{ width: `${e.pct * 2}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </AppChrome>
  );
}

export const scenePanels: Record<ShiftScene["id"], () => React.JSX.Element> = {
  margin: MarginPanel,
  alerts: AlertsPanel,
  forecast: ForecastPanel,
  expenses: ExpensesPanel,
};
