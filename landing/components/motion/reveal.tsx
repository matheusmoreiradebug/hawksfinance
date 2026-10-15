"use client";

import { motion, useReducedMotion } from "framer-motion";
import { duration, ease, viewport } from "@/lib/motion";

type Props = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  blur?: boolean;
  className?: string;
  as?: "div" | "li" | "span";
};

/** Entrada por scroll: sobe, ganha opacidade e (opcional) sai do blur. */
export function Reveal({ children, delay = 0, y = 20, blur = false, className, as = "div" }: Props) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y, filter: blur && !reduce ? "blur(8px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={viewport}
      transition={{ duration: duration.slow, ease, delay }}
    >
      {children}
    </Comp>
  );
}
