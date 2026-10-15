import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  id?: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, intro, align = "left", id, className }: Props) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 id={id} className="text-gradient mt-4 text-headline font-semibold">{title}</h2>
      </Reveal>
      {intro ? (
        <Reveal delay={0.12}>
          <p className="mt-5 text-base text-fog-300 md:text-lg">{intro}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
