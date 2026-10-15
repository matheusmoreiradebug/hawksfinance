import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-semibold tracking-[-0.03em] text-white", className)}>
      <svg viewBox="0 0 28 28" className="size-7" aria-hidden>
        <rect width="28" height="28" rx="8" fill="#fff" fillOpacity="0.06" />
        <rect x="0.5" y="0.5" width="27" height="27" rx="7.5" stroke="#fff" strokeOpacity="0.12" fill="none" />
        <path d="M7 18.5 14 8l7 10.5-3.2-1.6L14 12.6l-3.8 4.3L7 18.5Z" fill="#fff" />
        <path d="M11.6 20 14 16.4 16.4 20 14 19.1 11.6 20Z" fill="#3B82F6" />
      </svg>
      <span className="text-[15px]">
        Hawks<span className="text-fog-400"> Finance</span>
      </span>
    </span>
  );
}
