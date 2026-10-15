"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CtaButton } from "@/components/ui/cta-button";
import { primaryCta } from "@/content/site";
import { ease } from "@/lib/motion";

/**
 * CTA fixo no rodapé (apenas mobile). Aparece após o hero e some
 * quando o CTA final em tela cheia já está visível.
 */
export function MobileCta() {
  const [pastHero, setPastHero] = useState(false);
  const [climaxVisible, setClimaxVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const target = document.getElementById("agendar");
    const io = target ? new IntersectionObserver(([e]) => setClimaxVisible(e.isIntersecting), { threshold: 0.25 }) : null;
    if (target && io) io.observe(target);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  const show = pastHero && !climaxVisible;

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ y: 96, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 96, opacity: 0 }}
          transition={{ duration: 0.45, ease }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.08] bg-ink/80 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 backdrop-blur-xl md:hidden"
        >
          <CtaButton {...primaryCta} size="md" magnetic={false} className="w-full" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
