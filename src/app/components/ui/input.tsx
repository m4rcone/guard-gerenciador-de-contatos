import type React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input(
  props: InputProps,
): React.ReactElement<InputProps> {
  return (
    <input
      className="invalid:border-accent-red focus:invalid:border-accent-red hover:border-content-primary focus:border-accent-brand border-border-primary text-content-primary bg-background-secondary placeholder:text-content-placeholder flex-1 rounded-lg border p-3 text-xs placeholder:text-xs focus:outline focus:invalid:outline"
      {...props}
    />
  );
}
