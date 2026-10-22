import React from "react";

export type BadgeVariant =
  | "submitted"
  | "under_review"
  | "investigating"
  | "repair_scheduled"
  | "in_progress"
  | "resolved"
  | "rejected"
  | "low"
  | "medium"
  | "high"
  | "critical"
  | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  children,
  className = "",
  dot = false,
}) => {
  const styles: Record<BadgeVariant, { bg: string; text: string; dot: string; border: string }> = {
    submitted: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      dot: "bg-blue-500",
      border: "border-blue-200",
    },
    under_review: {
      bg: "bg-amber-50",
      text: "text-amber-800",
      dot: "bg-amber-500",
      border: "border-amber-200",
    },
    investigating: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      dot: "bg-indigo-500",
      border: "border-indigo-200",
    },
    repair_scheduled: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      dot: "bg-purple-500",
      border: "border-purple-200",
    },
    in_progress: {
      bg: "bg-cyan-50",
      text: "text-cyan-800",
      dot: "bg-cyan-500",
      border: "border-cyan-200",
    },
    resolved: {
      bg: "bg-[#E7F3ED]",
      text: "text-forest-900",
      dot: "bg-[#2A7C60]",
      border: "border-[#C2DFD1]",
    },
    rejected: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      dot: "bg-rose-500",
      border: "border-rose-200",
    },
    low: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      border: "border-emerald-200",
    },
    medium: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      dot: "bg-amber-500",
      border: "border-amber-200",
    },
    high: {
      bg: "bg-orange-50",
      text: "text-orange-800",
      dot: "bg-orange-600",
      border: "border-orange-200",
    },
    critical: {
      bg: "bg-rose-50",
      text: "text-rose-800",
      dot: "bg-rose-600",
      border: "border-rose-300",
    },
    neutral: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      dot: "bg-gray-400",
      border: "border-gray-200",
    },
  };

  const current = styles[variant] || styles.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${current.bg} ${current.text} ${current.border} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />}
      {children}
    </span>
  );
};
