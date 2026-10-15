import { cn } from "@/lib/utils";

/** Marquee em CSS puro (transform), sem JS. Pausa no hover. */
export function Marquee({ items, className }: { items: readonly string[]; className?: string }) {
  const row = [...items, ...items];
  return (
    <div className={cn("mask-fade-x group relative overflow-hidden", className)}>
      <ul className="flex w-max animate-marquee items-center gap-12 group-hover:[animation-play-state:paused]">
        {row.map((item, i) => (
          <li
            key={`${item}-${i}`}
            aria-hidden={i >= items.length}
            className="flex items-center gap-12 whitespace-nowrap text-lg font-medium tracking-[-0.02em] text-fog-500 md:text-2xl"
          >
            {item}
            <span className="size-1 rounded-full bg-white/15" />
          </li>
        ))}
      </ul>
    </div>
  );
}
