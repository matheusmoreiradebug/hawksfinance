import { cn } from "@/lib/utils";

/** Moldura de janela de aplicativo para os mockups de produto. */
export function AppChrome({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("glass overflow-hidden rounded-2xl bg-ink-850/80", className)}>
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="size-2.5 rounded-full bg-white/10" />
        </div>
        <span className="font-mono text-[11px] text-fog-500">{title}</span>
      </div>
      {children}
    </div>
  );
}

export function Kpi({ label, value, delta, tone = "neutral" }: { label: string; value: string; delta?: string; tone?: "up" | "down" | "neutral" }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 md:p-4">
      <p className="text-[11px] text-fog-500">{label}</p>
      <p className="mt-1.5 text-base font-semibold tracking-[-0.03em] text-white tabular-nums md:text-xl">{value}</p>
      {delta ? (
        <p className={cn("mt-1 font-mono text-[10px]", tone === "up" && "text-emerald-400/90", tone === "down" && "text-rose-400/90", tone === "neutral" && "text-fog-500")}>
          {delta}
        </p>
      ) : null}
    </div>
  );
}
