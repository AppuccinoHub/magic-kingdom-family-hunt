import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex w-full items-center justify-center gap-3 rounded-2xl px-5 text-center text-xl font-bold leading-tight transition-colors disabled:cursor-not-allowed disabled:border-ink disabled:bg-cream disabled:text-ink",
  {
    variants: {
      variant: {
        default: "border-2 border-[#8f241c] bg-coral text-white hover:bg-[#8f241c]",
        secondary: "border-2 border-[#0c5c4e] bg-teal text-white hover:bg-[#0c5c4e]",
        quiet: "border-2 border-ink bg-paper text-ink hover:bg-butter",
      },
      size: {
        default: "min-h-16",
        tall: "min-h-20 text-2xl",
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
  ({ className, variant, size, asChild = false, type = "button", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} type={asChild ? undefined : type} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
