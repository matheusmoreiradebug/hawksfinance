import { cn } from "@/lib/utils";

// Série ilustrativa de saldo projetado (12 meses).
const SERIES = [62, 58, 55, 57, 51, 47, 44, 40, 37, 31, 26, 22];

/** Gráfico de área em SVG puro: leve, nítido e sem dependências. */
export function ForecastChart({ className, showZero = false, series = SERIES }: { className?: string; showZero?: boolean; series?: number[] }) {
  const w = 600;
  const h = 200;
  const max = 70;
  const min = showZero ? -10 : 10;
  const px = (i: number) => (i / (series.length - 1)) * w;
  const py = (v: number) => h - ((v - min) / (max - min)) * h;
  const line = series.map((v, i) => `${i === 0 ? "M" : "L"}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cn("h-full w-full", className)} preserveAspectRatio="none" role="img" aria-label="Projeção de saldo de caixa para 12 meses">
      <defs>
        <linearGradient id="fc-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1="0" x2={w} y1={h * t} y2={h * t} stroke="rgba(255,255,255,0.05)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
      {showZero ? (
        <line x1="0" x2={w} y1={py(0)} y2={py(0)} stroke="rgba(244,63,94,0.55)" strokeDasharray="4 4" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ) : null}
      <path d={area} fill="url(#fc-fill)" />
      <path d={line} fill="none" stroke="#60A5FA" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}
