import { Check, Gift } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { CtaButton } from "@/components/ui/cta-button";
import { Card } from "@/components/ui/card";
import { FadeInGroup, FadeInItem } from "@/components/motion/fade-in";
import { Reveal } from "@/components/motion/reveal";
import { offer } from "@/content/site";

/** Cena 6 — Oferta. Hierarquia: núcleo > inclusos > bônus > CTA. */
export function Offer() {
  return (
    <section id="oferta" aria-labelledby="oferta-titulo" className="relative py-24 md:py-36">
      <div className="container">
        <SectionHeading id="oferta-titulo" eyebrow={offer.eyebrow} title={offer.title} />

        <Reveal className="mt-14 md:mt-20">
          <div className="relative rounded-[22px] bg-gradient-to-b from-accent/60 via-white/10 to-white/[0.04] p-px">
            <div className="relative overflow-hidden rounded-[21px] bg-ink-850">
              <div aria-hidden className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(59,130,246,0.22),transparent)]" />

              <div className="relative p-6 md:p-12">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-soft">{offer.core.tag}</p>
                <h3 className="mt-4 text-title font-semibold text-white">{offer.core.title}</h3>
                <p className="mt-3 max-w-xl text-fog-300">{offer.core.body}</p>

                <FadeInGroup as="ul" step={0.05} className="mt-10 grid gap-x-10 gap-y-6 md:grid-cols-2">
                  {offer.included.map((item) => (
                    <FadeInItem as="li" key={item.title} className="flex gap-4">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-white ring-1 ring-inset ring-white/10">
                        <Check className="size-3.5" aria-hidden />
                      </span>
                      <div>
                        <p className="font-medium text-fog-100">{item.title}</p>
                        <p className="mt-1 text-sm text-fog-400">{item.body}</p>
                      </div>
                    </FadeInItem>
                  ))}
                </FadeInGroup>

                <Card className="mt-10 flex flex-col gap-4 p-5 md:flex-row md:items-center md:gap-6 md:p-6">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent-soft ring-1 ring-inset ring-accent/30">
                    <Gift className="size-4" aria-hidden />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog-400">{offer.bonus.tag}</p>
                    <p className="mt-1 font-medium text-white">{offer.bonus.title}</p>
                    <p className="mt-1 text-sm text-fog-400">{offer.bonus.body}</p>
                  </div>
                </Card>

                <div className="mt-10 flex flex-col items-start gap-4 border-t border-white/[0.06] pt-8 md:flex-row md:items-center md:justify-between">
                  <p className="max-w-md text-sm text-fog-400">{offer.note}</p>
                  <CtaButton {...offer.cta} className="w-full md:w-auto" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
