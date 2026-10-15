import { AppChrome, Kpi } from "./chrome";
import { ForecastChart } from "./forecast-chart";
import { cn } from "@/lib/utils";

const CLIENTS = [
  { name: "Studio Norte", margin: 38, tone: "ok" },
  { name: "Grupo Atlas", margin: 14, tone: "warn" },
  { name: "Vértice Saúde", margin: -6, tone: "bad" },
] as const;

const toneClass = {
  ok: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  warn: "bg-amber-400/10 text-amber-300 ring-amber-400/20",
  bad: "bg-rose-400/10 text-rose-300 ring-rose-400/20",
};

/** Mockup do Centro de Controle exibido no hero. Dados ilustrativos. */
export function DashboardPreview() {
  return (
    <AppChrome title="hawks.finance / centro-de-controle">
      <div className="grid gap-3 p-3 md:gap-4 md:p-5">
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          <Kpi label="Saldo atual" value="R$ 62,4k" delta="+8,2% mês" tone="up" />
          <Kpi label="Receita mensal" value="R$ 84,0k" delta="72% recorrente" />
          <Kpi label="Lucro líquido" value="R$ 11,8k" delta="-3,1% mês" tone="down" />
        </div>
        <div className="grid gap-3 md:grid-cols-[1.6fr_1fr] md:gap-4">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 md:p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-fog-500">Previsão de caixa · 12 meses</p>
              <p className="font-mono text-[10px] text-accent-soft">risco em 214 dias</p>
            </div>
            <div className="mt-3 h-24 md:h-36">
              <ForecastChart />
            </div>
          </div>
          <div className="hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 md:block">
            <p className="text-[11px] text-fog-500">Margem por cliente</p>
            <ul className="mt-3 space-y-2.5">
              {CLIENTS.map((c) => (
                <li key={c.name} className="flex items-center justify-between text-[13px]">
                  <span className="text-fog-200">{c.name}</span>
                  <span className={cn("rounded-md px-1.5 py-0.5 font-mono text-[11px] ring-1 ring-inset", toneClass[c.tone])}>
                    {c.margin > 0 ? "+" : ""}
                    {c.margin}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppChrome>
  );
}
