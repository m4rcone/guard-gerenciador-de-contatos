import clsx from "clsx";
import type React from "react";
import { ReactElement } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant: "primary" | "secondary" | "tertiary" | "icon";
  size?: "md" | "sm";
}

export default function Button({
  children,
  variant,
  size,
  ...props
}: ButtonProps): ReactElement<ButtonProps> {
  return (
    <button
      className={clsx(
        "cursor-pointer rounded-xl p-3 text-sm",
        variant === "primary" &&
          "text-content-inverse bg-accent-brand hover:bg-accent-brand-hover font-semibold",
        variant === "secondary" &&
          "text-content-primary bg-background-tertiary hover:bg-background-primary font-semibold",
        variant === "tertiary" &&
          "text-content-primary hover:bg-background-tertiary border-border-primary border bg-transparent font-semibold",
        variant === "icon" && "bg-background-secondary rounded-2xl",
        size === "md" && "rounded-xl p-3 text-sm",
        size === "sm" && "rounded-lg p-3 text-xs",
      )}
      {...props}
    >
      {children}
    </button>
  );
}
