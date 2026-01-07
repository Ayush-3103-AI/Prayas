"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox@1.1.4";
import { CheckIcon } from "lucide-react@0.487.0";

import { cn } from "./utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-2 border-[#d4c5b0] bg-[#d4c5b0] data-[state=checked]:bg-[#3d2817] data-[state=checked]:text-[#faf0e6] data-[state=checked]:border-[#3d2817] focus-visible:border-[#3d2817] focus-visible:ring-[#3d2817]/50 focus-visible:bg-[#3d2817] focus-visible:text-[#faf0e6] aria-invalid:ring-destructive/20 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
