import type { View } from '@/types';
import {
  LayoutDashboard,
  Mail,
  FileText,
  ListTodo,
  Search,
  MessageSquare,
  Sparkles,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  id: View;
  label: string;
  icon: LucideIcon;
  description: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & stats' },
  { id: 'email', label: 'Email Generator', icon: Mail, description: 'Tone + audience based' },
  { id: 'meeting', label: 'Meeting Summarizer', icon: FileText, description: 'Key points & actions' },
  { id: 'planner', label: 'Task Planner', icon: ListTodo, description: 'Prioritize & schedule' },
  { id: 'research', label: 'Research Assistant', icon: Search, description: 'Insights & summaries' },
  { id: 'chatbot', label: 'AI Chatbot', icon: MessageSquare, description: 'Ask anything' },
];

interface SidebarProps {
  current: View;
  onNavigate: (view: View) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ current, onNavigate, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-neutral-900/40 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={[
          'fixed lg:sticky top-0 left-0 z-40 h-screen w-72 shrink-0',
          'bg-neutral-900 flex flex-col',
          'transition-transform duration-300 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Logo header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg shadow-primary-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">AI Workplace</h1>
              <p className="text-xs text-neutral-400">Productivity Assistant</p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-neutral-400 hover:text-white p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Workspace
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = current === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={[
                  'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all',
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200',
                ].join(' ')}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-primary-400" />
                )}
                <Icon
                  className={`h-5 w-5 shrink-0 transition-colors ${
                    active ? 'text-primary-400' : 'text-neutral-500 group-hover:text-neutral-300'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">{item.label}</p>
                  <p className={`text-xs truncate ${active ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="rounded-lg bg-white/5 p-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 text-xs font-bold text-white">
                YO
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Your Account</p>
                <p className="text-xs text-neutral-400 truncate">Pro Plan · Active</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
