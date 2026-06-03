import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function HorizontalRail({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)}>
      <div className="flex min-w-max gap-5 pr-5">{children}</div>
    </div>
  );
}
