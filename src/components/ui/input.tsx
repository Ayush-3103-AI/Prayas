import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-[#6b5d4f]/60 selection:bg-[#6b8e6b] selection:text-[#faf0e6]",
        "flex h-10 w-full min-w-0 rounded-full border border-[#d4c5b0] px-4 py-2 text-base",
        "bg-[#faf0e6] text-[#3d2817]",
        "transition-all outline-none",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-[#6b8e6b] focus-visible:ring-[#6b8e6b]/50 focus-visible:ring-[3px]",
        "hover:border-[#8b6f47]",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
