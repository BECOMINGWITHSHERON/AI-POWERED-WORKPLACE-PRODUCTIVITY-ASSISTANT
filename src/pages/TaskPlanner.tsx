import { useState } from 'react';
import { ListTodo, Sparkles, RotateCcw, Clock, Sun, Moon, Sunset } from 'lucide-react';
import Card, { CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { TextArea } from '@/components/ui/Field';
import { LoadingState } from '@/components/ui/Loading';
import { CopyButton } from '@/components/ui/CopyButton';
import Badge from '@/components/ui/Badge';
import { planTasks } from '@/lib/ai';
import type { TaskPlanResult } from '@/types';

const sampleTasks = `Review and approve Q4 budget proposal
Draft client presentation for Monday meeting
Respond to emails from the marketing team
Prepare onboarding document for new hire
Call vendor about software renewal
Update project tracker spreadsheet
Research competitor pricing models
Schedule team check-in for next week`;

const priorityConfig = {
  High: { tone: 'error' as const, color: 'bg-error-500', label: 'High' },
  Medium: { tone: 'warning' as const, color: 'bg-warning-500', label: 'Medium' },
  Low: { tone: 'neutral' as const, color: 'bg-neutral-400', label: 'Low' },
};

export default function TaskPlanner() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<TaskPlanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePlan = async () => {
    if (!input.trim()) {
      setError('Please enter your tasks first.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const r = await planTasks(input);
      setResult(r);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSample = () => setInput(sampleTasks);

  const handleReset = () => {
    setInput('');
    setResult(null);
    setError('');
  };

  const copyAll = result
    ? `${result.overview}\n\n${result.tasks
        .map(
          (t) =>
            `${t.task} | ${t.priority} | ${t.estimatedTime} | ${t.suggestedTime} | ${t.rationale}`,
        )
        .join('\n')}\n\n${result.scheduleNote}`
    : '';

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Your Tasks"
            subtitle="List everything you need to do"
            icon={<ListTodo className="h-5 w-5" />}
            action={
              <button onClick={handleSample} className="text-xs font-medium text-primary-600 hover:text-primary-700">
                Try sample
              </button>
            }
          />
          <div className="p-5 space-y-4">
            <TextArea
              placeholder="Enter your tasks, one per line or comma-separated..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[240px]"
              hint="Include deadlines, urgency, or context for better prioritization"
            />
            {error && (
              <p className="text-sm text-error-600 bg-error-50 border border-error-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <div className="flex gap-3">
              <Button onClick={handlePlan} loading={loading} icon={<Sparkles className="h-4 w-4" />}>
                Plan My Day
              </Button>
              <Button variant="outline" onClick={handleReset} icon={<RotateCcw className="h-4 w-4" />}>
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Output */}
        <Card className="lg:col-span-3">
          <CardHeader
            title="Prioritized Plan"
            subtitle="AI-optimized schedule with rationale"
            icon={<Sparkles className="h-5 w-5" />}
            action={result ? <CopyButton text={copyAll} /> : undefined}
          />
          <div className="p-5">
            {loading ? (
              <LoadingState label="Creating your plan..." sublabel="Analyzing priorities and scheduling" />
            ) : result ? (
              <div className="space-y-4 animate-fade-in-up">
                {/* Overview */}
                <div className="rounded-xl bg-primary-50/60 border border-primary-100 p-4">
                  <p className="text-sm text-neutral-700 leading-relaxed">{result.overview}</p>
                </div>

                {/* Task list */}
                <div className="space-y-3">
                  {result.tasks.map((task, i) => {
                    const config = priorityConfig[task.priority];
                    const timeIcon = task.suggestedTime.toLowerCase().includes('morning')
                      ? Sun
                      : task.suggestedTime.toLowerCase().includes('evening') || task.suggestedTime.toLowerCase().includes('late')
                        ? Moon
                        : Sunset;
                    const TimeIcon = timeIcon;
                    return (
                      <div
                        key={i}
                        className="rounded-xl border border-neutral-200 bg-white p-4 hover:border-neutral-300 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-start gap-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-xs font-bold text-neutral-600 mt-0.5">
                              {i + 1}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-neutral-900">{task.task}</p>
                              <p className="text-xs text-neutral-500 mt-1">{task.rationale}</p>
                            </div>
                          </div>
                          <Badge tone={config.tone}>
                            <span className={`h-2 w-2 rounded-full ${config.color}`} />
                            {config.label}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-3 pl-10">
                          <span className="inline-flex items-center gap-1.5 text-xs text-neutral-600 bg-neutral-100 rounded-md px-2 py-1">
                            <Clock className="h-3.5 w-3.5" /> {task.estimatedTime}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs text-primary-700 bg-primary-50 rounded-md px-2 py-1">
                            <TimeIcon className="h-3.5 w-3.5" /> {task.suggestedTime}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Schedule note */}
                <div className="rounded-xl bg-accent-50/60 border border-accent-100 p-4">
                  <div className="flex items-start gap-2.5">
                    <Sunset className="h-4 w-4 text-accent-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-neutral-700 leading-relaxed">{result.scheduleNote}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400 mb-3">
                  <ListTodo className="h-7 w-7" />
                </div>
                <p className="text-sm font-medium text-neutral-600">No plan yet</p>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                  List your tasks on the left and click "Plan My Day" to get a prioritized, time-blocked schedule.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
