import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive [&_svg]:transition-transform hover:[&_svg]:translate-x-1",
  {
    variants: {
      variant: {
        default: "bg-[#6b8e6b] text-[#faf0e6] hover:bg-[#5a7a5a] hover:shadow-lg hover:shadow-[#6b8e6b]/30",
        emerald: "bg-[#6b8e6b] text-[#faf0e6] hover:bg-[#5a7a5a] hover:shadow-lg hover:shadow-[#6b8e6b]/30",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border border-[#8b6f47] bg-[#faf0e6] text-[#3d2817] hover:bg-[#f5f5dc] hover:border-[#6b5d4f]",
        secondary:
          "bg-[#f5f5dc] text-[#3d2817] border border-[#d4c5b0] hover:bg-[#f4e4c1]",
        ghost:
          "hover:bg-[#f5f5dc]/50 hover:text-[#6b8e6b] text-[#3d2817]",
        link: "text-[#6b8e6b] underline-offset-4 hover:underline hover:text-[#5a7a5a]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
