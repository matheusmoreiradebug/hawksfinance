import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("glass relative overflow-hidden", className)} {...props}>
      {children}
    </div>
  );
}
