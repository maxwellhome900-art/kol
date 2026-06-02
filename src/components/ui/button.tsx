import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--text-primary)] text-[var(--bg-deep)] hover:bg-[var(--text-primary)]/90",
        destructive: "bg-red-600 text-white hover:bg-red-600/90",
        outline:
          "border border-[var(--border-glass)] bg-transparent hover:bg-white/5",
        secondary:
          "bg-white/10 text-[var(--text-primary)] hover:bg-white/15",
        ghost: "hover:bg-white/5",
        link: "text-sky-400 underline-offset-4 hover:underline",
        luxury:
          "rounded-full border border-amber-400/35 bg-gradient-to-r from-amber-500/20 to-orange-500/15 text-amber-50 hover:from-amber-500/30 hover:to-orange-500/25",
        dev: "rounded-full border border-sky-400/30 bg-gradient-to-r from-sky-500/20 to-cyan-500/15 text-sky-50 hover:from-sky-500/35 hover:to-cyan-500/25",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-full px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
