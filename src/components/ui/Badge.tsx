import { type ReactNode } from 'react';

type Tone = 'primary' | 'success' | 'warning' | 'error' | 'neutral' | 'secondary' | 'accent';

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: 'bg-primary-50 text-primary-700 border-primary-200',
  success: 'bg-success-50 text-success-700 border-success-200',
  warning: 'bg-warning-50 text-warning-700 border-warning-200',
  error: 'bg-error-50 text-error-700 border-error-200',
  neutral: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  secondary: 'bg-secondary-50 text-secondary-700 border-secondary-200',
  accent: 'bg-accent-50 text-accent-700 border-accent-200',
};

export default function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        toneClasses[tone],
        className || '',
      ].join(' ')}
    >
      {children}
    </span>
  );
}
