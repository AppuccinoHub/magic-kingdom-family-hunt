import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-2xl border-2 border-ink bg-paper px-4 py-3 text-2xl leading-snug text-ink",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
