import { SectionHeading } from "@/components/ui/section-heading";
import { CountUp } from "@/components/ui/count-up";
import { Marquee } from "@/components/ui/marquee";
import { CtaButton } from "@/components/ui/cta-button";
import { Card } from "@/components/ui/card";
import { FadeInGroup, FadeInItem } from "@/components/motion/fade-in";
import { Reveal } from "@/components/motion/reveal";
import { primaryCta, proof } from "@/content/site";

/** Cena 5 — Prova. Números com count-up, cenário antes/depois e marquee. */
export function Proof() {
  const { scenario } = proof;
  return (
    <section aria-labelledby="prova-titulo" className="relative border-y border-white/[0.06] bg-ink-850 py-24 md:py-36">
      <div className="container">
        <SectionHeading id="prova-titulo" eyebrow={proof.eyebrow} title={proof.title} />

        <FadeInGroup as="ul" className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] md:mt-20 lg:grid-cols-4">
          {proof.stats.map((s) => (
            <FadeInItem as="li" key={s.label} className="bg-ink-850 p-6 md:p-8">
              <p className="text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
                <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </p>
              <p className="mt-3 text-sm font-medium text-fog-100">{s.label}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-fog-500">{s.detail}</p>
            </FadeInItem>
          ))}
        </FadeInGroup>

        <Reveal className="mt-6">
          <Card className="p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fog-400">{scenario.label}</span>
            </div>
            <h3 className="mt-5 max-w-2xl text-title font-semibold text-white">{scenario.title}</h3>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                <p className="eyebrow">{scenario.before.label}</p>
                <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-fog-300">{scenario.before.value}</p>
                <p className="mt-2 text-sm text-fog-500">{scenario.before.detail}</p>
              </div>
              <div className="rounded-xl border border-accent/30 bg-accent/[0.06] p-5 shadow-[0_0_48px_-12px_rgba(59,130,246,0.45)]">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-soft">{scenario.after.label}</p>
                <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white">{scenario.after.value}</p>
                <p className="mt-2 text-sm text-fog-300">{scenario.after.detail}</p>
              </div>
            </div>
          </Card>
        </Reveal>
      </div>

      <div className="mt-20 md:mt-28">
        <p className="eyebrow container mb-8">O que o painel monitora</p>
        <Marquee items={proof.marquee} />
      </div>

      <div className="container mt-16 flex md:mt-20 md:justify-center">
        <CtaButton {...primaryCta} />
      </div>
    </section>
  );
}
