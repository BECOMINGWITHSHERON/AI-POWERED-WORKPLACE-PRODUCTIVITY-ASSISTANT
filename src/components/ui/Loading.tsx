import { Loader2, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  label?: string;
  sublabel?: string;
}

export function LoadingState({ label = 'AI is thinking...', sublabel }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-primary-100 animate-pulse-soft" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg">
          <Sparkles className="h-6 w-6 animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-neutral-700">{label}</p>
      {sublabel && <p className="mt-1 text-xs text-neutral-400">{sublabel}</p>}
      <div className="mt-4 flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-primary-400 animate-bounce-dot" style={{ animationDelay: '0s' }} />
        <span className="h-2 w-2 rounded-full bg-primary-400 animate-bounce-dot" style={{ animationDelay: '0.2s' }} />
        <span className="h-2 w-2 rounded-full bg-primary-400 animate-bounce-dot" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
}

interface SkeletonProps {
  lines?: number;
  className?: string;
}

export function Skeleton({ lines = 3, className }: SkeletonProps) {
  return (
    <div className={`space-y-3 ${className || ''}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded shimmer-bg"
          style={{ width: `${85 - i * 12}%` }}
        />
      ))}
    </div>
  );
}

export function SpinnerInline({ size = 16 }: { size?: number }) {
  return <Loader2 className="animate-spin" size={size} />;
}
