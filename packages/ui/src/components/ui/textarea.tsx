import { cn } from "@openzirndorf/ui/lib/utils";
import type { ComponentProps } from "react";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-32 w-full rounded-sm border border-border bg-background px-4 py-3 text-[0.95rem] text-foreground shadow-none outline-none transition-[border-color,box-shadow] duration-200 ease-(--transition-base) placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
