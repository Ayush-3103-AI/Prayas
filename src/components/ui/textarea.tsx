import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-none border-[#d4c5b0] placeholder:text-[#6b5d4f]/60",
        "focus-visible:border-[#6b8e6b] focus-visible:ring-[#6b8e6b]/50",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        "bg-[#faf0e6] text-[#3d2817]",
        "hover:border-[#8b6f47]",
        "flex field-sizing-content min-h-16 w-full rounded-xl border px-4 py-3 text-base",
        "transition-all outline-none focus-visible:ring-[3px]",
        "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
