import { AlertTriangle } from 'lucide-react';

export default function Disclaimer({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="flex items-center gap-1.5 text-xs text-neutral-400">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
        AI-generated content may require human review
      </p>
    );
  }

  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-warning-200 bg-warning-50/60 px-4 py-3">
      <AlertTriangle className="h-4 w-4 shrink-0 text-warning-600 mt-0.5" />
      <p className="text-xs text-warning-800">
        <span className="font-semibold">Disclaimer:</span> AI-generated content may require human review.
        This is a prototype tool — always verify important communications before sending.
      </p>
    </div>
  );
}
