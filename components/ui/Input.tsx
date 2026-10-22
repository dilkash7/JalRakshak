import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-sage-600 mb-1.5"
          >
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sage-500">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded-2xl border ${
              error ? "border-rose-400 focus:ring-rose-500" : "border-[#D6E0DA] focus:ring-forest-800"
            } bg-white px-4 py-3 text-sm text-forest-850 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
              icon ? "pl-10" : ""
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-rose-600 mt-1.5">{error}</p>}
        {hint && !error && <p className="text-xs text-sage-500 mt-1.5">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, className = "", id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-sage-600 mb-1.5"
          >
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full rounded-2xl border ${
            error ? "border-rose-400 focus:ring-rose-500" : "border-[#D6E0DA] focus:ring-forest-800"
          } bg-white px-4 py-3 text-sm text-forest-850 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-rose-600 mt-1.5">{error}</p>}
        {hint && !error && <p className="text-xs text-sage-500 mt-1.5">{hint}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
