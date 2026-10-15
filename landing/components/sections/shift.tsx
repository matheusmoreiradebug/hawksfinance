"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { CtaButton } from "@/components/ui/cta-button";
import { Reveal } from "@/components/motion/reveal";
import { scenePanels } from "@/components/visuals/scene-panels";
import { primaryCta, shift, type ShiftScene } from "@/content/site";
import { ease } from "@/lib/motion";

/**
 * Cena 3 — Virada.
 * Desktop: palco fixado (sticky) em que texto e painel trocam conforme o scroll.
 * Mobile: as mesmas cenas viram uma sequência simples, sem sticky.
 */
export function Shift() {
  return (
    <section id="produto" aria-labelledby="virada-titulo" className="relative py-24 md:py-32">
      <div className="container">
        <SectionHeading id="virada-titulo" eyebrow={shift.eyebrow} title={shift.title} intro={shift.intro} />
      </div>

      <StickyStage />
      <MobileSequence />

      <div className="container mt-16 flex flex-col items-start gap-3 md:mt-8 md:items-center">
        <CtaButton {...primaryCta} />
      </div>
    </section>
  );
}

function SceneText({ scene }: { scene: ShiftScene }) {
  return (
    <>
      <p className="font-mono text-xs text-accent-soft">{scene.eyebrow}</p>
      <h3 className="mt-4 text-title font-semibold text-white">{scene.title}</h3>
      <p className="mt-4 max-w-md text-base leading-relaxed text-fog-300">{scene.body}</p>
      <ul className="mt-6 space-y-2.5">
        {scene.points.map((p) => (
          <li key={p} className="flex items-center gap-3 text-sm text-fog-200">
            <span className="flex size-5 items-center justify-center rounded-full bg-accent/15 text-accent-soft ring-1 ring-inset ring-accent/30">
              <Check className="size-3" aria-hidden />
            </span>
            {p}
          </li>
        ))}
      </ul>
    </>
  );
}

function StickyStage() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = shift.scenes.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(count - 1, Math.floor(v * count));
    setActive((prev) => (prev === next ? prev : next));
  });

  return (
    <div ref={ref} className="relative hidden lg:-mt-20 lg:block" style={{ height: `${count * 90}vh` }}>
      <div className="sticky top-0 flex h-screen items-center">
        <div className="container grid grid-cols-[0.9fr_1.1fr] items-center gap-16">
          <div>
            {/* Índice de progresso das cenas */}
            <ol className="mb-12 flex gap-2" aria-label="Etapas">
              {shift.scenes.map((s, i) => (
                <li key={s.id} className="h-0.5 w-12 overflow-hidden rounded-full bg-white/10">
                  <motion.span
                    className="block h-full origin-left bg-accent"
                    animate={{ scaleX: i <= active ? 1 : 0 }}
                    transition={{ duration: 0.5, ease }}
                  />
                </li>
              ))}
            </ol>
            <div className="grid">
              {shift.scenes.map((scene, i) => (
                <motion.div
                  key={scene.id}
                  className="[grid-area:1/1]"
                  aria-hidden={i !== active}
                  initial={false}
                  animate={{ opacity: i === active ? 1 : 0, y: i === active ? 0 : i < active ? -24 : 24 }}
                  transition={{ duration: 0.55, ease }}
                  style={{ pointerEvents: i === active ? "auto" : "none" }}
                >
                  <SceneText scene={scene} />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative grid">
            <div aria-hidden className="absolute -inset-16 -z-10 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(59,130,246,0.16),transparent)]" />
            {shift.scenes.map((scene, i) => {
              const Panel = scenePanels[scene.id];
              return (
                <motion.div
                  key={scene.id}
                  className="[grid-area:1/1] self-center"
                  aria-hidden={i !== active}
                  initial={false}
                  animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 0.97, y: i === active ? 0 : 16 }}
                  transition={{ duration: 0.6, ease }}
                >
                  <Panel />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileSequence() {
  return (
    <div className="container mt-14 space-y-20 lg:hidden">
      {shift.scenes.map((scene) => {
        const Panel = scenePanels[scene.id];
        return (
          <article key={scene.id} className="grid gap-8">
            <Reveal>
              <SceneText scene={scene} />
            </Reveal>
            <Reveal delay={0.08}>
              <Panel />
            </Reveal>
          </article>
        );
      })}
    </div>
  );
}
