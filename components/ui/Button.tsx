import React from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  href?: string;
  withArrow?: boolean;
  withArrowCircle?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  href,
  withArrow = false,
  withArrowCircle = false,
  isLoading = false,
  icon,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "text-xs px-4 py-2 rounded-full gap-1.5",
    md: "text-sm px-6 py-2.5 rounded-full gap-2",
    lg: "text-base px-7 py-3 rounded-full gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-forest-900 text-white hover:bg-forest-800 active:bg-forest-950 focus:ring-forest-800 shadow-sm",
    secondary:
      "bg-forest-50 text-forest-900 hover:bg-forest-100 active:bg-forest-200 focus:ring-forest-500",
    outline:
      "border border-[#D1DDD6] bg-white text-forest-850 hover:bg-[#F4F8F5] active:bg-[#EBF1ED] focus:ring-forest-800",
    ghost:
      "text-forest-850 hover:bg-forest-50 active:bg-forest-100 focus:ring-forest-800",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus:ring-rose-500",
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        icon && <span className="inline-flex">{icon}</span>
      )}
      <span>{children}</span>
      {withArrowCircle && !isLoading && (
        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-current ml-1">
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      )}
      {withArrow && !withArrowCircle && !isLoading && (
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled || isLoading} {...props}>
      {content}
    </button>
  );
};
