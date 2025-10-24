// components/ui/input.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, className, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col")}>
        {label && <label className="text-sm font-medium mb-1">{label}</label>}
        <input
          ref={ref}
          {...props}
          className={cn(
            "block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500",
            error ? "border-red-500 focus:ring-red-500" : "border-gray-300",
            className
          )}
        />
        {helperText && <p className={cn("text-xs mt-1", error ? "text-red-600" : "text-gray-500")}>{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
