import { useState } from 'react';
import { Mail, Send, RotateCcw } from 'lucide-react';
import Card, { CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { TextField, TextArea, SelectField, OptionCard } from '@/components/ui/Field';
import { LoadingState, Skeleton } from '@/components/ui/Loading';
import { OutputBlock, CopyButton } from '@/components/ui/CopyButton';
import Badge from '@/components/ui/Badge';
import { generateEmail } from '@/lib/ai';
import type { EmailParams } from '@/types';
import {
  Briefcase,
  Users,
  Building2,
  User,
  Scale,
  Smile,
  Zap,
  Megaphone,
  FileText,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const tones = [
  { value: 'Professional', label: 'Professional', icon: Briefcase },
  { value: 'Friendly', label: 'Friendly', icon: Smile },
  { value: 'Formal', label: 'Formal', icon: Scale },
  { value: 'Urgent', label: 'Urgent', icon: Zap },
  { value: 'Persuasive', label: 'Persuasive', icon: Megaphone },
  { value: 'Concise', label: 'Concise', icon: FileText },
];

const audiences = [
  { value: 'Internal Team', label: 'Internal Team', icon: Users },
  { value: 'Client', label: 'Client', icon: Building2 },
  { value: 'Manager', label: 'Manager', icon: User },
  { value: 'External Partner', label: 'External Partner', icon: Building2 },
];

const lengths = [
  { value: 'Short', label: 'Short (2-3 paragraphs)' },
  { value: 'Medium', label: 'Medium (3-4 paragraphs)' },
  { value: 'Long', label: 'Long (4+ paragraphs)' },
];

export default function EmailGenerator() {
  const [params, setParams] = useState<EmailParams>({
    topic: '',
    audience: 'Internal Team',
    tone: 'Professional',
    length: 'Medium',
    keyPoints: '',
  });
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!params.topic.trim()) {
      setError('Please enter an email topic.');
      return;
    }
    setError('');
    setLoading(true);
    setOutput('');
    try {
      const result = await generateEmail(params);
      setOutput(result);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setParams({ topic: '', audience: 'Internal Team', tone: 'Professional', length: 'Medium', keyPoints: '' });
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <Card>
          <CardHeader
            title="Email Configuration"
            subtitle="Define your audience, tone, and key points"
            icon={<Mail className="h-5 w-5" />}
          />
          <div className="p-5 space-y-5">
            <TextField
              label="Email Topic"
              placeholder="e.g., Q4 Project Update, Holiday Schedule, Product Launch"
              value={params.topic}
              onChange={(e) => setParams({ ...params, topic: e.target.value })}
              hint="What is this email about?"
            />

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Audience</label>
              <div className="grid grid-cols-2 gap-2.5">
                {audiences.map((a) => {
                  const Icon = a.icon;
                  return (
                    <OptionCard
                      key={a.value}
                      value={a.value}
                      label={a.label}
                      icon={<Icon className="h-4 w-4" />}
                      selected={params.audience === a.value}
                      onClick={(v) => setParams({ ...params, audience: v })}
                    />
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Tone</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {tones.map((t) => {
                  const Icon = t.icon;
                  return (
                    <OptionCard
                      key={t.value}
                      value={t.value}
                      label={t.label}
                      icon={<Icon className="h-4 w-4" />}
                      selected={params.tone === t.value}
                      onClick={(v) => setParams({ ...params, tone: v })}
                    />
                  );
                })}
              </div>
            </div>

            <SelectField
              label="Length"
              options={lengths}
              value={params.length}
              onChange={(e) => setParams({ ...params, length: e.target.value })}
            />

            <TextArea
              label="Key Points (optional)"
              placeholder="e.g., Budget approved for Q4, deadline is Nov 30, need feedback from design team"
              value={params.keyPoints}
              onChange={(e) => setParams({ ...params, keyPoints: e.target.value })}
              hint="Specific points you want included in the email"
            />

            {error && (
              <p className="text-sm text-error-600 bg-error-50 border border-error-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <Button onClick={handleGenerate} loading={loading} icon={<Send className="h-4 w-4" />}>
                Generate Email
              </Button>
              <Button variant="outline" onClick={handleReset} icon={<RotateCcw className="h-4 w-4" />}>
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Output panel */}
        <Card>
          <CardHeader
            title="Generated Email"
            subtitle="Your AI-crafted email preview"
            icon={<Mail className="h-5 w-5" />}
            action={output ? <CopyButton text={output} /> : undefined}
          />
          <div className="p-5">
            {loading ? (
              <LoadingState label="Crafting your email..." sublabel="Analyzing tone, audience, and key points" />
            ) : output ? (
              <div className="animate-fade-in-up">
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge tone="primary">{params.tone}</Badge>
                  <Badge tone="secondary">{params.audience}</Badge>
                  <Badge tone="neutral">{params.length}</Badge>
                </div>
                <OutputBlock>
                  <pre className="whitespace-pre-wrap text-sm text-neutral-700 leading-relaxed font-sans">
                    {output}
                  </pre>
                </OutputBlock>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400 mb-3">
                  <Mail className="h-7 w-7" />
                </div>
                <p className="text-sm font-medium text-neutral-600">No email generated yet</p>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                  Fill in the configuration on the left and click "Generate Email" to see your AI-crafted email here.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
