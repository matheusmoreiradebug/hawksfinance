import { CtaButton } from "@/components/ui/cta-button";
import { Dot } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { climax } from "@/content/site";

/** Cena 8 — Clímax. CTA final em tela cheia com glow azul. */
export function Climax() {
  return (
    <section id="agendar" aria-labelledby="climax-titulo" className="relative isolate flex min-h-[100svh] items-center overflow-hidden py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0 opacity-60" />
        <div className="absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.38),rgba(59,130,246,0.08)_55%,transparent)] md:h-[960px] md:w-[960px]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink to-transparent" />
      </div>

      <div className="container flex flex-col items-center text-center">
        <Reveal>
          <p className="eyebrow">{climax.eyebrow}</p>
        </Reveal>
        <h2 id="climax-titulo" className="mt-6 text-display font-semibold">
          {climax.title.map((line, i) => (
            <Reveal key={line} as="span" delay={0.08 * i} blur className="text-gradient block">
              {line}
            </Reveal>
          ))}
        </h2>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-fog-300 md:text-lg">{climax.body}</p>
        </Reveal>
        <Reveal delay={0.28} className="mt-10 w-full sm:w-auto">
          <CtaButton {...climax.cta} className="w-full sm:w-auto" />
        </Reveal>
        {climax.urgency ? (
          <Reveal delay={0.34}>
            <p className="mt-6 inline-flex items-center gap-2.5 text-sm text-fog-400">
              <Dot />
              {climax.urgency}
            </p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
