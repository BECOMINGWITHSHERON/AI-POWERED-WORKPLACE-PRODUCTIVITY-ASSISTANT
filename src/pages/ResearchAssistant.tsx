import { useState } from 'react';
import { Search, Sparkles, RotateCcw, Lightbulb, TrendingUp, CheckCircle2 } from 'lucide-react';
import Card, { CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { TextField, SelectField } from '@/components/ui/Field';
import { LoadingState } from '@/components/ui/Loading';
import { CopyButton } from '@/components/ui/CopyButton';
import { researchTopic } from '@/lib/ai';
import type { ResearchResult } from '@/types';

const depthOptions = [
  { value: 'Brief', label: 'Brief — Quick overview' },
  { value: 'Standard', label: 'Standard — Balanced detail' },
  { value: 'Detailed', label: 'Detailed — In-depth analysis' },
];

const suggestions = [
  'Remote work productivity trends 2026',
  'AI automation in the workplace',
  'Agile vs Waterfall methodology',
  'Effective team communication strategies',
];

export default function ResearchAssistant() {
  const [topic, setTopic] = useState('');
  const [depth, setDepth] = useState('Standard');
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResearch = async () => {
    if (!topic.trim()) {
      setError('Please enter a research topic.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const r = await researchTopic(topic, depth);
      setResult(r);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTopic('');
    setResult(null);
    setError('');
  };

  const copyAll = result
    ? `SUMMARY:\n${result.summary}\n\nINSIGHTS:\n${result.insights.map((i) => `- ${i}`).join('\n')}\n\nKEY FINDINGS:\n${result.keyFindings.map((i) => `- ${i}`).join('\n')}\n\nRECOMMENDATIONS:\n${result.recommendations.map((i) => `- ${i}`).join('\n')}`
    : '';

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Search bar */}
      <Card>
        <CardHeader
          title="Research Topic"
          subtitle="Enter a topic and let AI find insights for you"
          icon={<Search className="h-5 w-5" />}
        />
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <TextField
                placeholder="e.g., Impact of AI on project management"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                hint="Be specific for better results"
              />
            </div>
            <SelectField
              label="Depth"
              options={depthOptions}
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
            />
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-400">Try:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setTopic(s)}
                className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-600 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition-all"
              >
                {s}
              </button>
            ))}
          </div>

          {error && (
            <p className="text-sm text-error-600 bg-error-50 border border-error-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <Button onClick={handleResearch} loading={loading} icon={<Sparkles className="h-4 w-4" />}>
              Research Now
            </Button>
            <Button variant="outline" onClick={handleReset} icon={<RotateCcw className="h-4 w-4" />}>
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      {loading ? (
        <Card className="p-8">
          <LoadingState label="Researching your topic..." sublabel="Gathering insights and analyzing findings" />
        </Card>
      ) : result ? (
        <div className="space-y-5 animate-fade-in-up">
          {/* Summary card */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                  <Search className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900">Executive Summary</h3>
              </div>
              <CopyButton text={copyAll} />
            </div>
            <p className="text-sm text-neutral-700 leading-relaxed">{result.summary}</p>
          </Card>

          {/* Insights */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-100 text-secondary-600">
                <Lightbulb className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900">Key Insights</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-lg border border-neutral-200 bg-neutral-50/50 p-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-secondary-100 text-xs font-bold text-secondary-700">
                    {i + 1}
                  </span>
                  <p className="text-sm text-neutral-700 leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Key Findings */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-100 text-accent-600">
                <TrendingUp className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900">Key Findings</h3>
            </div>
            <ul className="space-y-2.5">
              {result.keyFindings.map((finding, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <TrendingUp className="h-4 w-4 text-accent-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-neutral-700 leading-relaxed">{finding}</p>
                </li>
              ))}
            </ul>
          </Card>

          {/* Recommendations */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-100 text-success-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900">Recommendations</h3>
            </div>
            <ul className="space-y-2.5">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-success-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-neutral-700 leading-relaxed">{rec}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      ) : !loading ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 mb-4">
              <Search className="h-8 w-8" />
            </div>
            <p className="text-base font-medium text-neutral-600">Start your research</p>
            <p className="text-sm text-neutral-400 mt-1 max-w-md">
              Enter a topic above and click "Research Now" to get a structured analysis with insights, findings, and recommendations.
            </p>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
