import { useState } from 'react';
import type { View } from '@/types';
import Sidebar from '@/components/Sidebar';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import EmailGenerator from '@/pages/EmailGenerator';
import MeetingSummarizer from '@/pages/MeetingSummarizer';
import TaskPlanner from '@/pages/TaskPlanner';
import ResearchAssistant from '@/pages/ResearchAssistant';
import Chatbot from '@/pages/Chatbot';

const pageInfo: Record<View, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Your AI productivity workspace overview' },
  email: { title: 'Smart Email Generator', subtitle: 'Craft professional emails with AI — tone & audience based' },
  meeting: { title: 'Meeting Notes Summarizer', subtitle: 'Extract key points, action items, and deadlines' },
  planner: { title: 'AI Task Planner', subtitle: 'Prioritize and schedule your tasks intelligently' },
  research: { title: 'AI Research Assistant', subtitle: 'Get insights, findings, and recommendations on any topic' },
  chatbot: { title: 'AI Chatbot', subtitle: 'Chat with your AI productivity assistant' },
};

function App() {
  const [view, setView] = useState<View>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (v: View) => setView(v);

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'email':
        return <EmailGenerator />;
      case 'meeting':
        return <MeetingSummarizer />;
      case 'planner':
        return <TaskPlanner />;
      case 'research':
        return <ResearchAssistant />;
      case 'chatbot':
        return <Chatbot />;
    }
  };

  const info = pageInfo[view];

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar
        current={view}
        onNavigate={handleNavigate}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <Layout
        title={info.title}
        subtitle={info.subtitle}
        onOpenMobile={() => setMobileOpen(true)}
      >
        {renderView()}
      </Layout>
    </div>
  );
}

export default App;
