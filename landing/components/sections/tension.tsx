"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { tension } from "@/content/site";

/** Cena 2 — Tensão. Cada frase acende conforme o scroll passa por ela. */
export function Tension() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const total = tension.lines.length + 1;

  return (
    <section aria-labelledby="tensao-titulo" className="relative py-28 md:py-44">
      <div className="container">
        <h2 id="tensao-titulo" className="eyebrow">
          {tension.eyebrow}
        </h2>
        <div ref={ref} className="mt-8 max-w-4xl space-y-3 md:space-y-4">
          {tension.lines.map((line, i) => (
            <Line key={line} progress={scrollYProgress} range={[i / total, (i + 1) / total]}>
              {line}
            </Line>
          ))}
          <Line progress={scrollYProgress} range={[(total - 1) / total, 1]} accent>
            {tension.closing}
          </Line>
        </div>
      </div>
    </section>
  );
}

function Line({ children, progress, range, accent }: { children: React.ReactNode; progress: MotionValue<number>; range: [number, number]; accent?: boolean }) {
  const reduce = useReducedMotion();
  const opacity = useTransform(progress, range, reduce ? [1, 1] : [0.14, 1]);
  return (
    <motion.p
      style={{ opacity }}
      className={
        accent
          ? "pt-6 text-headline font-semibold text-white md:pt-10 [text-shadow:0_0_40px_rgba(59,130,246,0.45)]"
          : "text-title font-medium text-fog-100"
      }
    >
      {children}
    </motion.p>
  );
}
