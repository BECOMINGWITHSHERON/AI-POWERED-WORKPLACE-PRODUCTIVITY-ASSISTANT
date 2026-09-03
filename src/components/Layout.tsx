import { type ReactNode } from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import Disclaimer from '@/components/ui/Disclaimer';

interface LayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  onOpenMobile: () => void;
}

export default function Layout({ children, title, subtitle, onOpenMobile }: LayoutProps) {
  return (
    <div className="flex-1 min-w-0 flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-neutral-200 bg-white/80 backdrop-blur-md px-4 lg:px-8 h-16">
        <button
          onClick={onOpenMobile}
          className="lg:hidden text-neutral-600 hover:text-neutral-900 p-1"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-neutral-900 leading-tight truncate">{title}</h2>
          <p className="text-sm text-neutral-500 truncate hidden sm:block">{subtitle}</p>
        </div>

        <div className="hidden md:flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 h-9 w-56 lg:w-64">
          <Search className="h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none"
          />
        </div>

        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent-500 ring-2 ring-white" />
        </button>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="mx-auto max-w-6xl">
          {children}
          <div className="mt-8">
            <Disclaimer />
          </div>
        </div>
      </main>
    </div>
  );
}
