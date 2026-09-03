import { useState } from 'react';
import { FileText, Sparkles, RotateCcw, Target, CheckSquare, CalendarClock } from 'lucide-react';
import Card, { CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { TextArea } from '@/components/ui/Field';
import { LoadingState } from '@/components/ui/Loading';
import { CopyButton } from '@/components/ui/CopyButton';
import Badge from '@/components/ui/Badge';
import { summarizeMeeting } from '@/lib/ai';
import type { MeetingResult } from '@/types';

const sampleNotes = `Quarterly Planning Meeting - Sept 15

Attendees: Sarah, Mike, Jennifer, David

Discussion:
- We reviewed the Q3 results and discussed the Q4 roadmap
- The marketing campaign launch is delayed by 2 weeks due to design changes
- Mike needs to update the budget forecast by Friday
- Jennifer raised concerns about resource allocation for the new project
- We agreed to hire one additional developer by end of October
- David will schedule a follow-up with the client by Wednesday next week
- The beta release is targeted for November 15
- Sarah will prepare a stakeholder presentation for the Oct 1 board meeting

Action items:
- Mike: finalize budget by Friday
- David: schedule client follow-up by Wednesday next week
- Sarah: prepare board presentation by Oct 1`;

export default function MeetingSummarizer() {
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState<MeetingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (!notes.trim()) {
      setError('Please paste your meeting notes first.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const r = await summarizeMeeting(notes);
      setResult(r);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSample = () => {
    setNotes(sampleNotes);
  };

  const handleReset = () => {
    setNotes('');
    setResult(null);
    setError('');
  };

  const copyAll = result
    ? `SUMMARY:\n${result.summary}\n\nKEY POINTS:\n${result.keyPoints.map((p) => `- ${p}`).join('\n')}\n\nACTION ITEMS:\n${result.actionItems.map((p) => `- ${p}`).join('\n')}\n\nDEADLINES:\n${result.deadlines.map((p) => `- ${p}`).join('\n')}`
    : '';

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardHeader
            title="Meeting Notes Input"
            subtitle="Paste your raw meeting notes below"
            icon={<FileText className="h-5 w-5" />}
            action={
              <button
                onClick={handleSample}
                className="text-xs font-medium text-primary-600 hover:text-primary-700"
              >
                Try sample
              </button>
            }
          />
          <div className="p-5 space-y-4">
            <TextArea
              placeholder="Paste meeting notes, transcripts, or bullet points here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[280px]"
            />
            {error && (
              <p className="text-sm text-error-600 bg-error-50 border border-error-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <div className="flex gap-3">
              <Button onClick={handleSummarize} loading={loading} icon={<Sparkles className="h-4 w-4" />}>
                Summarize Meeting
              </Button>
              <Button variant="outline" onClick={handleReset} icon={<RotateCcw className="h-4 w-4" />}>
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader
            title="Structured Summary"
            subtitle="Key points, actions, and deadlines"
            icon={<Target className="h-5 w-5" />}
            action={result ? <CopyButton text={copyAll} /> : undefined}
          />
          <div className="p-5">
            {loading ? (
              <LoadingState label="Analyzing meeting notes..." sublabel="Extracting key points and action items" />
            ) : result ? (
              <div className="space-y-5 animate-fade-in-up">
                {/* Summary */}
                <div className="rounded-xl bg-primary-50/60 border border-primary-100 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-primary-600" />
                    <h4 className="text-sm font-semibold text-primary-900">Summary</h4>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed">{result.summary}</p>
                </div>

                {/* Key Points */}
                <SectionBlock
                  title="Key Points"
                  icon={<Target className="h-4 w-4 text-secondary-600" />}
                  tone="secondary"
                >
                  <ul className="space-y-2">
                    {result.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary-500 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </SectionBlock>

                {/* Action Items */}
                <SectionBlock
                  title="Action Items"
                  icon={<CheckSquare className="h-4 w-4 text-accent-600" />}
                  tone="accent"
                >
                  <ul className="space-y-2">
                    {result.actionItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                        <CheckSquare className="h-4 w-4 text-accent-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </SectionBlock>

                {/* Deadlines */}
                <SectionBlock
                  title="Deadlines"
                  icon={<CalendarClock className="h-4 w-4 text-error-600" />}
                  tone="error"
                >
                  <ul className="space-y-2">
                    {result.deadlines.map((dl, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                        <CalendarClock className="h-4 w-4 text-error-500 mt-0.5 shrink-0" />
                        {dl}
                      </li>
                    ))}
                  </ul>
                </SectionBlock>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400 mb-3">
                  <Target className="h-7 w-7" />
                </div>
                <p className="text-sm font-medium text-neutral-600">No summary yet</p>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                  Paste your meeting notes on the left and click "Summarize Meeting" to get a structured breakdown.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function SectionBlock({
  title,
  icon,
  children,
  tone: _tone,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  tone?: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h4 className="text-sm font-semibold text-neutral-900">{title}</h4>
      </div>
      {children}
    </div>
  );
}
