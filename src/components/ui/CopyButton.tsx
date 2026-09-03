import { type ReactNode, useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={[
        'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all',
        copied
          ? 'bg-success-50 text-success-700'
          : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700',
        className || '',
      ].join(' ')}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

interface OutputBlockProps {
  children: ReactNode;
  title?: string;
  copyText?: string;
}

export function OutputBlock({ children, title, copyText }: OutputBlockProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 animate-fade-in-up">
      {(title || copyText) && (
        <div className="mb-3 flex items-center justify-between">
          {title && <h4 className="text-sm font-semibold text-neutral-700">{title}</h4>}
          {copyText && <CopyButton text={copyText} />}
        </div>
      )}
      {children}
    </div>
  );
}
