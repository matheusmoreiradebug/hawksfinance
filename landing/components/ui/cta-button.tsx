"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils";
import type { Cta } from "@/content/site";

type Props = Cta & {
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Efeito magnético; desativado automaticamente em toque e reduced motion. */
  magnetic?: boolean;
};

const isExternal = (href: string) => href.startsWith("http");

/** CTA primário: glow azul, brilho no hover, efeito magnético e feedback de clique. */
export function CtaButton({ label, href, size = "lg", className, magnetic = true }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!magnetic || reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.32);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      {...(isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      whileTap={{ scale: 0.96 }}
      className={cn(buttonVariants({ variant: "primary", size }), "overflow-hidden", className)}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-full"
      />
      <span className="relative">{label}</span>
      <ArrowRight aria-hidden className="relative transition-transform duration-300 group-hover:translate-x-0.5" />
    </motion.a>
  );
}
