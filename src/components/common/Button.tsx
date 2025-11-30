import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "lg" | "md" | "sm" | "xs";
}

export function Button({
  className = "",
  variant = "secondary",
  size = "xs",
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "rounded font-medium transition-colors";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-500",
    secondary: "bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100",
    ghost: "bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500",
    outline: "border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500",
  };

  const sizes = {
    lg: "px-6 py-2 text-lg",
    md: "px-4 py-2 text-base",
    sm: "px-3 py-1 text-sm",
    xs: "px-2 py-1 text-xs",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
