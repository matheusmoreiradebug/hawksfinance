import type { Transition, Variants } from "framer-motion";

/** Curva padrão do sistema de movimento. */
export const ease = [0.22, 1, 0.36, 1] as const;

export const duration = { fast: 0.4, base: 0.6, slow: 0.8 } as const;

export const transition: Transition = { duration: duration.base, ease };

export const viewport = { once: true, margin: "0px 0px -12% 0px" } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition },
};

export const stagger = (step = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: delay } },
});
