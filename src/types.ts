export type View =
  | 'dashboard'
  | 'email'
  | 'meeting'
  | 'planner'
  | 'research'
  | 'chatbot';

export interface EmailParams {
  topic: string;
  audience: string;
  tone: string;
  length: string;
  keyPoints: string;
}

export interface MeetingResult {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  deadlines: string[];
}

export interface TaskItem {
  task: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedTime: string;
  suggestedTime: string;
  rationale: string;
}

export interface TaskPlanResult {
  overview: string;
  tasks: TaskItem[];
  scheduleNote: string;
}

export interface ResearchResult {
  summary: string;
  insights: string[];
  keyFindings: string[];
  recommendations: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
