import type { View } from '@/types';
import Card, { CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Mail, FileText, ListTodo, Search, MessageSquare, ArrowRight, TrendingUp, Clock, CheckCircle2, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: View) => void;
}

const features: {
  id: View;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  tag: string;
}[] = [
  {
    id: 'email',
    title: 'Smart Email Generator',
    description: 'Generate professional emails tuned to your audience and desired tone in seconds.',
    icon: Mail,
    color: 'from-primary-500 to-primary-700',
    tag: 'Communication',
  },
  {
    id: 'meeting',
    title: 'Meeting Notes Summarizer',
    description: 'Turn raw meeting notes into summaries, action items, and deadlines automatically.',
    icon: FileText,
    color: 'from-secondary-500 to-secondary-700',
    tag: 'Analysis',
  },
  {
    id: 'planner',
    title: 'AI Task Planner',
    description: 'Get a prioritized, time-blocked schedule based on your tasks and deadlines.',
    icon: ListTodo,
    color: 'from-accent-500 to-accent-700',
    tag: 'Productivity',
  },
  {
    id: 'research',
    title: 'AI Research Assistant',
    description: 'Receive structured insights, key findings, and recommendations on any topic.',
    icon: Search,
    color: 'from-success-500 to-success-700',
    tag: 'Research',
  },
  {
    id: 'chatbot',
    title: 'AI Chatbot Interface',
    description: 'Ask questions, get advice, and brainstorm with an AI assistant that knows work.',
    icon: MessageSquare,
    color: 'from-neutral-700 to-neutral-900',
    tag: 'Assistant',
  },
];

const stats: { label: string; value: string; icon: LucideIcon; trend: string }[] = [
  { label: 'Tasks Completed', value: '24', icon: CheckCircle2, trend: '+12% this week' },
  { label: 'Emails Generated', value: '18', icon: Mail, trend: '+8% this week' },
  { label: 'Hours Saved', value: '7.5', icon: Clock, trend: 'Est. weekly' },
  { label: 'Avg Response Time', value: '2.1s', icon: Zap, trend: 'Fast & reliable' },
];

export default function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-primary-950 p-8 lg:p-10">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(51,102,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(52,138,102,0.2) 0%, transparent 40%)'
        }} />
        <div className="relative">
          <Badge tone="primary" className="bg-white/10 text-primary-300 border-white/10">
            <TrendingUp className="h-3 w-3" /> AI-Powered Workspace
          </Badge>
          <h1 className="mt-4 text-2xl lg:text-3xl font-bold text-white leading-tight max-w-2xl">
            Automate your daily work with intelligent AI tools
          </h1>
          <p className="mt-3 text-neutral-300 max-w-xl leading-relaxed">
            Generate emails, summarize meetings, plan tasks, research topics, and chat with an AI
            assistant — all from one clean dashboard.
          </p>
          <button
            onClick={() => onNavigate('chatbot')}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 transition-all shadow-lg"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
              <p className="text-sm text-neutral-500 mt-0.5">{stat.label}</p>
              <p className="text-xs text-success-600 mt-2 font-medium">{stat.trend}</p>
            </Card>
          );
        })}
      </div>

      {/* Feature cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-neutral-900">AI Tools</h3>
          <p className="text-sm text-neutral-500">{features.length} tools available</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                hover
                onClick={() => onNavigate(feature.id)}
                className="p-6 group"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-base font-semibold text-neutral-900">{feature.title}</h4>
                </div>
                <p className="text-sm text-neutral-500 leading-relaxed mb-4">{feature.description}</p>
                <div className="flex items-center justify-between">
                  <Badge tone="neutral">{feature.tag}</Badge>
                  <span className="text-sm font-medium text-primary-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Open <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Card>
            );
          })}

          {/* Filler card for grid alignment */}
          <Card className="p-6 border-dashed border-2 bg-neutral-50/50 flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-200 text-neutral-400 mx-auto mb-3">
                <Zap className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-neutral-500">More tools coming soon</p>
              <p className="text-xs text-neutral-400 mt-1">Stay tuned for updates</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
