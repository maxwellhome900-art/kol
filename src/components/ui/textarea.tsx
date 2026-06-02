import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-xl border border-[var(--border-glass)] bg-white/80 px-3 py-2 text-sm text-slate-900 ring-offset-[var(--background)] placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/35 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black/30 dark:text-[var(--text-primary)] dark:placeholder:text-[var(--text-muted)]",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
