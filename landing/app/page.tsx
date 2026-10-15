import dynamic from "next/dynamic";
import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { Footer } from "@/components/sections/footer";

// Cenas abaixo da dobra em chunks separados: o JS do hero chega primeiro.
const Tension = dynamic(() => import("@/components/sections/tension").then((m) => m.Tension));
const Shift = dynamic(() => import("@/components/sections/shift").then((m) => m.Shift));
const Mechanism = dynamic(() => import("@/components/sections/mechanism").then((m) => m.Mechanism));
const Proof = dynamic(() => import("@/components/sections/proof").then((m) => m.Proof));
const Offer = dynamic(() => import("@/components/sections/offer").then((m) => m.Offer));
const Faq = dynamic(() => import("@/components/sections/faq").then((m) => m.Faq));
const Climax = dynamic(() => import("@/components/sections/climax").then((m) => m.Climax));
const MobileCta = dynamic(() => import("@/components/sections/mobile-cta").then((m) => m.MobileCta));

export default function Page() {
  return (
    <>
      <Nav />
      <main id="conteudo">
        <Hero />
        <Tension />
        <Shift />
        <Mechanism />
        <Proof />
        <Offer />
        <Faq />
        <Climax />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
