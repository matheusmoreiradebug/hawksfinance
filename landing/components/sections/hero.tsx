import { Badge, Dot } from "@/components/ui/badge";
import { CtaButton } from "@/components/ui/cta-button";
import { buttonVariants } from "@/components/ui/button";
import { Parallax } from "@/components/motion/parallax";
import { DashboardPreview } from "@/components/visuals/dashboard-preview";
import { hero } from "@/content/site";

/**
 * Cena 1 — Abertura.
 * A entrada usa keyframes CSS (não JS): o texto pinta antes da hidratação,
 * o que protege o LCP no mobile. Stagger via animation-delay.
 */
const delay = (s: number) => ({ animationDelay: `${s}s` });

export function Hero() {
  return (
    <section id="topo" className="relative isolate overflow-hidden pb-16 pt-32 md:pb-28 md:pt-44">
      {/* Fundo: grid mascarado + glow azul em drift lento (transform only). */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0" />
        <div className="absolute left-1/2 top-[-18%] h-[620px] w-[1100px] -translate-x-1/2 animate-drift rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.28),rgba(59,130,246,0.06)_55%,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-ink" />
      </div>

      <div className="container flex flex-col items-center text-center">
        <div className="animate-hero-in" style={delay(0.05)}>
          <Badge>
            <Dot />
            {hero.badge}
          </Badge>
        </div>

        {/* H1 sem animação de entrada: é o elemento de LCP e precisa pintar no primeiro frame. */}
        <h1 className="mt-7 max-w-5xl text-display font-semibold">
          {hero.headline.map((line) => (
            <span key={line} className="text-gradient inline md:block">
              {line}{" "}
            </span>
          ))}
        </h1>

        <p className="mt-6 max-w-xl animate-hero-in text-base leading-relaxed text-fog-300 md:text-lg" style={delay(0.15)}>
          {hero.subheadline}
        </p>

        <div className="mt-9 flex w-full animate-hero-in flex-col items-center gap-3 sm:w-auto sm:flex-row" style={delay(0.25)}>
          <CtaButton {...hero.primary} className="w-full sm:w-auto" />
          <a href={hero.secondary.href} className={buttonVariants({ variant: "secondary", size: "lg", className: "w-full sm:w-auto" })}>
            {hero.secondary.label}
          </a>
        </div>
        <p className="mt-4 animate-hero-in text-xs text-fog-500" style={delay(0.32)}>
          {hero.footnote}
        </p>

        <div className="relative mt-16 w-full max-w-5xl animate-hero-in md:mt-24" style={delay(0.4)}>
          <div aria-hidden className="absolute -inset-x-16 -bottom-10 -top-32 -z-10 bg-[radial-gradient(50%_45%_at_50%_35%,rgba(59,130,246,0.2),transparent)]" />
          <Parallax offset={40}>
            <div className="[perspective:1600px]">
              <div className="origin-top text-left md:[transform:rotateX(8deg)]">
                <DashboardPreview />
              </div>
            </div>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
