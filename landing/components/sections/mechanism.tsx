"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { mechanism, type Step } from "@/content/site";

/** Cena 4 — Mecanismo. A linha de progresso acompanha o scroll e acende cada etapa. */
export function Mechanism() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.6"] });
  const fill = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0, 1]);
  const count = mechanism.steps.length;

  return (
    <section id="como-funciona" aria-labelledby="mecanismo-titulo" className="relative py-24 md:py-36">
      <div className="container">
        <SectionHeading id="mecanismo-titulo" eyebrow={mechanism.eyebrow} title={mechanism.title} />

        <ol ref={ref} className="relative mt-16 grid gap-10 md:mt-24 md:grid-cols-4 md:gap-8">
          {/* Trilho + preenchimento: vertical no mobile, horizontal no desktop. */}
          <span aria-hidden className="absolute bottom-2 left-[11px] top-2 w-px bg-white/10 md:bottom-auto md:left-0 md:right-0 md:top-[11px] md:h-px md:w-auto" />
          <motion.span
            aria-hidden
            style={{ scaleY: fill }}
            className="absolute bottom-2 left-[11px] top-2 w-px origin-top bg-gradient-to-b from-accent to-accent-soft md:hidden"
          />
          <motion.span
            aria-hidden
            style={{ scaleX: fill }}
            className="absolute left-0 right-0 top-[11px] hidden h-px origin-left bg-gradient-to-r from-accent to-accent-soft shadow-[0_0_12px_rgba(59,130,246,0.8)] md:block"
          />
          {mechanism.steps.map((step, i) => (
            <StepItem key={step.index} step={step} progress={fill} threshold={i / count + 0.02} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function StepItem({ step, progress, threshold }: { step: Step; progress: MotionValue<number>; threshold: number }) {
  const on = useTransform(progress, [threshold - 0.04, threshold + 0.04], [0, 1]);
  const textOpacity = useTransform(on, [0, 1], [0.4, 1]);

  return (
    <li className="relative pl-12 md:pl-0 md:pt-14">
      <span aria-hidden className="absolute left-0 top-0 flex size-[23px] items-center justify-center rounded-full border border-white/15 bg-ink">
        <motion.span style={{ opacity: on, scale: on }} className="size-2.5 rounded-full bg-accent shadow-[0_0_16px_rgba(59,130,246,0.9)]" />
      </span>
      <motion.div style={{ opacity: textOpacity }}>
        <p className="font-mono text-xs text-fog-500">{step.index}</p>
        <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">{step.title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-fog-300">{step.body}</p>
      </motion.div>
    </li>
  );
}
