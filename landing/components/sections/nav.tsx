"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { CtaButton } from "@/components/ui/cta-button";
import { nav } from "@/content/site";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/motion";

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6"
    >
      <nav
        aria-label="Principal"
        className={cn(
          "mx-auto flex h-14 max-w-[1200px] items-center justify-between rounded-full border pl-4 pr-2 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled ? "border-white/[0.08] bg-ink/85 backdrop-blur-xl" : "border-transparent bg-transparent",
        )}
      >
        <a href="#topo" aria-label="Hawks Finance, voltar ao topo">
          <Logo />
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {nav.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm text-fog-300 transition-colors hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <CtaButton {...nav.cta} size="sm" magnetic={false} />
      </nav>
    </motion.header>
  );
}
