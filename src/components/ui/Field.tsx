import { type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode, forwardRef } from 'react';

const baseField =
  'w-full rounded-lg border border-neutral-300 bg-white px-3.5 text-sm text-neutral-800 placeholder:text-neutral-400 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-neutral-50 disabled:text-neutral-500';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, hint, className, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-neutral-700">{label}</label>}
      <input ref={ref} className={`${baseField} h-11 ${className || ''}`} {...props} />
      {hint && <p className="text-xs text-neutral-400">{hint}</p>}
    </div>
  ),
);
TextField.displayName = 'TextField';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, hint, className, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-neutral-700">{label}</label>}
      <textarea
        ref={ref}
        className={`${baseField} py-2.5 resize-y min-h-[120px] leading-relaxed ${className || ''}`}
        {...props}
      />
      {hint && <p className="text-xs text-neutral-400">{hint}</p>}
    </div>
  ),
);
TextArea.displayName = 'TextArea';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, hint, options, className, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-neutral-700">{label}</label>}
      <select ref={ref} className={`${baseField} h-11 cursor-pointer ${className || ''}`} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className="text-xs text-neutral-400">{hint}</p>}
    </div>
  ),
);
SelectField.displayName = 'SelectField';

interface OptionCardProps {
  value: string;
  label: string;
  icon?: ReactNode;
  selected: boolean;
  onClick: (value: string) => void;
}

export function OptionCard({ value, label, icon, selected, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={[
        'flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-all',
        selected
          ? 'border-primary-500 bg-primary-50 text-primary-700 ring-2 ring-primary-500/20'
          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50',
      ].join(' ')}
    >
      {icon}
      {label}
    </button>
  );
}
