"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger, viewport } from "@/lib/motion";

/** Container com stagger: cada FadeInItem filho entra em sequência. */
export function FadeInGroup({
  children,
  className,
  step = 0.08,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  step?: number;
  as?: "div" | "ul" | "ol";
}) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={stagger(step)} initial="hidden" whileInView="show" viewport={viewport}>
      {children}
    </Comp>
  );
}

export function FadeInItem({ children, className, as = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "li" }) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={fadeUp}>
      {children}
    </Comp>
  );
}
