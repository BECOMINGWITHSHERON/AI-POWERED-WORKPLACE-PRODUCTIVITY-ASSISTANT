import type {
  EmailParams,
  MeetingResult,
  TaskPlanResult,
  TaskItem,
  ResearchResult,
  ChatMessage,
} from '@/types';

// ──────────────────────────────────────────────
// Structured prompt templates
// Each prompt follows a consistent structure:
//   Role → Task → Context → Constraints → Format
// ──────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildEmailPrompt(p: EmailParams): string {
  return `You are a professional business communication expert.

TASK: Write a ${p.tone.toLowerCase()} email about "${p.topic}".

AUDIENCE: ${p.audience}
LENGTH: ${p.length}
KEY POINTS TO INCLUDE: ${p.keyPoints || 'None specified — use your judgment'}

CONSTRAINTS:
- Open with a clear, relevant subject line prefixed with "Subject: "
- Use a professional salutation appropriate for the audience
- Structure the body into short, scannable paragraphs
- Close with a clear call to action and professional sign-off
- Match the tone precisely (${p.tone})
- Do not use placeholders like [Name] — write realistic content

FORMAT:
Subject: ...
[Body]`;
}

function buildMeetingPrompt(notes: string): string {
  return `You are an expert meeting analyst and project manager.

TASK: Analyze the following meeting notes and extract structured information.

MEETING NOTES:
"""
${notes}
"""

CONSTRAINTS:
- Identify the core purpose and outcome in 2-3 sentences
- Extract 3-7 key points (decisions, discussions, important facts)
- List every action item with an owner if mentioned
- Capture any deadlines or time-sensitive items mentioned
- Be concise and factual — do not invent information not in the notes

FORMAT (respond as structured text with clear headers):
SUMMARY: [2-3 sentence overview]

KEY POINTS:
- [point]
- [point]

ACTION ITEMS:
- [action]
- [action]

DEADLINES:
- [deadline]`;
}

function buildTaskPlannerPrompt(input: string): string {
  return `You are an expert productivity coach and scheduling assistant.

TASK: Given the following tasks and context, create a prioritized plan with scheduling suggestions.

INPUT:
"""
${input}
"""

CONSTRAINTS:
- Assess each task for urgency and impact to determine priority (High, Medium, Low)
- Estimate realistic time for each task
- Suggest an optimal time-of-day for each task (morning, afternoon, or evening)
- Provide brief rationale for the priority assignment
- Order tasks by priority (High first)
- Include a schedule note with overall guidance

FORMAT (respond as structured text):

OVERVIEW: [1-2 sentence plan summary]

TASKS:
1. [Task name] | Priority: High/Medium/Low | Time: [estimate] | When: [suggested time] | Why: [rationale]
2. ...

SCHEDULE NOTE: [overall scheduling advice]`;
}

function buildResearchPrompt(topic: string, depth: string): string {
  return `You are an expert research analyst.

TASK: Provide a comprehensive analysis of the following topic.

TOPIC: ${topic}
DEPTH: ${depth}

CONSTRAINTS:
- Write a concise summary (3-4 sentences) of what the topic is and why it matters
- Provide 3-5 key insights that a professional would find valuable
- List 3-5 key findings with specific, actionable detail
- End with 2-3 practical recommendations
- Be factual and balanced — acknowledge trade-offs where relevant
- Do not fabricate specific statistics or quotes

FORMAT:

SUMMARY: [3-4 sentences]

INSIGHTS:
- [insight]
- [insight]

KEY FINDINGS:
- [finding]
- [finding]

RECOMMENDATIONS:
- [recommendation]
- [recommendation]`;
}

function buildChatPrompt(message: string, history: ChatMessage[]): string {
  const recent = history
    .slice(-4)
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  return `You are a helpful workplace productivity assistant.
You provide concise, actionable, and professional responses.
You help with planning, writing, analysis, research, and general productivity questions.

${recent ? `CONVERSATION HISTORY:\n${recent}\n` : ''}

USER MESSAGE: ${message}

Respond helpfully and concisely. Use bullet points or short paragraphs for readability.`;
}

// ──────────────────────────────────────────────
// Simulated AI responses
// Since no LLM API key is configured, these produce
// realistic structured outputs based on the prompts.
// ──────────────────────────────────────────────

function simulateThinking(base: string, ms: number): Promise<void> {
  return delay(base.length * 0.8 + ms);
}

export async function generateEmail(p: EmailParams): Promise<string> {
  await simulateThinking(p.topic, 900);

  const subjectLine = `Subject: ${p.topic} — ${p.tone} Update`;

  const salutation =
    p.audience.toLowerCase().includes('team')
      ? 'Hi Team,'
      : p.audience.toLowerCase().includes('client') || p.audience.toLowerCase().includes('customer')
        ? 'Dear Valued Client,'
        : p.audience.toLowerCase().includes('manager') || p.audience.toLowerCase().includes('director')
          ? 'Hello,'
          : 'Hi there,';

  const toneFlavor: Record<string, string> = {
    Formal: 'I am writing to formally address',
    Friendly: 'I wanted to reach out about',
    Urgent: 'I need to bring your immediate attention to',
    Persuasive: 'I want to share an important opportunity regarding',
    Concise: 'Quick update on',
    Professional: 'I wanted to share an update regarding',
  };

  const opener = toneFlavor[p.tone] || toneFlavor['Professional'];

  const bodyParagraphs: string[] = [];

  bodyParagraphs.push(
    `${opener} ${p.topic.toLowerCase()}. ${
      p.keyPoints
        ? `The key areas I want to cover include: ${p.keyPoints}.`
        : 'Below is a summary of the current status and next steps.'
    }`,
  );

  bodyParagraphs.push(
    `This matters for ${p.audience.toLowerCase()} because it directly impacts our goals and timelines. ` +
      `I want to ensure we are aligned and that everyone has the context needed to move forward effectively.`,
  );

  bodyParagraphs.push(
    `Here is what I propose as next steps:\n` +
      `1. Review the details outlined above at your earliest convenience.\n` +
      `2. Share any feedback, questions, or concerns you may have.\n` +
      `3. Confirm your availability for a brief follow-up discussion if needed.`,
  );

  const cta =
    p.tone === 'Urgent'
      ? 'Please prioritize this and respond by end of day.'
      : p.tone === 'Persuasive'
        ? "I'd love to get your support on this — let's connect soon to discuss further."
        : 'Let me know if you have any questions or need additional detail.';

  bodyParagraphs.push(cta);

  const signOff =
    p.tone === 'Formal'
      ? 'Respectfully,\n[Your Name]'
      : p.tone === 'Friendly'
        ? 'Thanks so much,\n[Your Name]'
        : 'Best regards,\n[Your Name]';

  const lengthControl =
    p.length === 'Short'
      ? bodyParagraphs.slice(0, 2)
      : p.length === 'Long'
        ? bodyParagraphs
        : bodyParagraphs.slice(0, 3);

  return [subjectLine, '', salutation, '', ...lengthControl, '', signOff].join('\n');
}

export async function summarizeMeeting(notes: string): Promise<MeetingResult> {
  await simulateThinking(notes, 1200);

  const lines = notes
    .split(/[\n.!?]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 10);

  const lower = notes.toLowerCase();

  const summary =
    `This meeting focused on ${extractTopic(notes) || 'project coordination and alignment'}. ` +
    `The discussion covered key priorities, identified action items, and established next steps. ` +
    `Participants agreed on follow-up tasks with associated owners and timelines.`;

  const keyPoints: string[] = [];
  const actionItems: string[] = [];
  const deadlines: string[] = [];

  for (const line of lines) {
    if (/action|task|follow.?up|assign|owner|responsible/i.test(line) && actionItems.length < 5) {
      actionItems.push(line.charAt(0).toUpperCase() + line.slice(1));
    } else if (/deadline|by \w+|due|before|after|next week|tomorrow|eod|friday|monday/i.test(line) && deadlines.length < 4) {
      deadlines.push(line.charAt(0).toUpperCase() + line.slice(1));
    } else if (keyPoints.length < 5) {
      keyPoints.push(line.charAt(0).toUpperCase() + line.slice(1));
    }
  }

  if (keyPoints.length === 0)
    keyPoints.push(
      'Discussed current project status and progress',
      'Reviewed priorities for the upcoming sprint',
      'Identified potential risks and mitigation strategies',
    );

  if (actionItems.length === 0)
    actionItems.push(
      'Follow up with stakeholders on open questions',
      'Prepare updated project timeline',
      'Share meeting summary with the broader team',
    );

  if (deadlines.length === 0) {
    if (lower.includes('friday')) deadlines.push('Complete action items by Friday');
    else deadlines.push('Submit progress report by end of week');
  }

  return {
    summary,
    keyPoints: keyPoints.slice(0, 6),
    actionItems: actionItems.slice(0, 5),
    deadlines: deadlines.slice(0, 4),
  };
}

function extractTopic(text: string): string {
  const words = text.split(/\s+/).slice(0, 8).join(' ');
  return words.length > 0 ? words.toLowerCase().replace(/^(the|a|an|this|our|we|meeting|about)\s+/i, '') : '';
}

export async function planTasks(input: string): Promise<TaskPlanResult> {
  await simulateThinking(input, 1100);

  const lines = input
    .split(/[\n,;]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 3);

  const taskLines = lines.length > 0 ? lines : ['Review project requirements', 'Draft proposal document', 'Schedule team check-in'];

  const tasks: TaskItem[] = taskLines.slice(0, 8).map((line, i): TaskItem => {
    const lower = line.toLowerCase();
    let priority: TaskItem['priority'] = 'Medium';
    let suggestedTime = 'Afternoon';
    let estimatedTime = '1 hour';

    if (/urgent|asap|immediately|critical|deadline|today|now/i.test(lower)) {
      priority = 'High';
      suggestedTime = 'Morning (first priority)';
      estimatedTime = '45 min';
    } else if (/review|read|check|quick|update|brief/i.test(lower)) {
      priority = i < 2 ? 'High' : 'Low';
      suggestedTime = 'Morning';
      estimatedTime = '30 min';
    } else if (/draft|write|create|prepare|design|build|develop/i.test(lower)) {
      priority = 'High';
      suggestedTime = 'Morning (deep work block)';
      estimatedTime = '2 hours';
    } else if (/call|meet|schedule|sync|discuss/i.test(lower)) {
      priority = 'Medium';
      suggestedTime = 'Afternoon';
      estimatedTime = '30 min';
    } else if (/email|reply|respond|send/i.test(lower)) {
      priority = 'Low';
      suggestedTime = 'Late afternoon';
      estimatedTime = '20 min';
    }

    const rationale =
      priority === 'High'
        ? 'High urgency and impact — tackle early when energy is highest.'
        : priority === 'Medium'
          ? 'Important but not time-critical — fits well in mid-day slots.'
          : 'Lower impact routine task — batch with similar items.';

    return {
      task: line.charAt(0).toUpperCase() + line.slice(1),
      priority,
      estimatedTime,
      suggestedTime,
      rationale,
    };
  });

  tasks.sort((a, b) => {
    const order: Record<TaskItem['priority'], number> = { High: 0, Medium: 1, Low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return {
    overview: `Based on your input, I've prioritized ${tasks.length} task${tasks.length === 1 ? '' : 's'} and suggested an optimal daily schedule. High-priority items are slotted for your morning deep-work block, while routine tasks are batched for the afternoon.`,
    tasks,
    scheduleNote:
      'Tip: Group similar tasks together to reduce context switching. Protect your morning for deep work, and reserve the last 30 minutes of the day for email and wrap-up.',
  };
}

export async function researchTopic(topic: string, depth: string): Promise<ResearchResult> {
  await simulateThinking(topic, 1400);

  const t = topic.trim();

  return {
    summary:
      `${t} is a significant topic in the current professional landscape. ` +
      `It involves strategic considerations that impact team productivity, operational efficiency, and long-term outcomes. ` +
      `Understanding its nuances helps professionals make informed decisions and stay ahead of industry trends. ` +
      `This analysis breaks down the core elements and provides actionable recommendations.`,
    insights: [
      `${t} requires a balance between short-term execution and long-term strategic planning.`,
      `Organizations that adopt a structured approach to ${t.toLowerCase()} see measurable improvements in team alignment and output quality.`,
      `The most common pitfall is treating ${t.toLowerCase()} as a one-time effort rather than an ongoing practice.`,
      `Technology and automation play an increasing role in scaling ${t.toLowerCase()} effectively across teams.`,
    ].slice(0, depth === 'Brief' ? 3 : 4),
    keyFindings: [
      `Teams that establish clear frameworks for ${t.toLowerCase()} report 30-40% fewer bottlenecks in their workflows.`,
      `Regular review cycles — weekly or biweekly — are the single biggest predictor of sustained success.`,
      `Cross-functional collaboration amplifies results; siloed approaches consistently underperform.`,
      `Investment in training and tooling pays off within the first quarter for most organizations.`,
      `Measuring outcomes (not just activity) is critical for continuous improvement.`,
    ].slice(0, depth === 'Brief' ? 3 : depth === 'Detailed' ? 5 : 4),
    recommendations: [
      `Start with a pilot team before rolling out ${t.toLowerCase()} practices org-wide to refine your approach.`,
      `Define 2-3 clear success metrics upfront so progress is measurable from day one.`,
      `Schedule recurring review sessions to assess what's working and adjust course as needed.`,
    ],
  };
}

export async function chatRespond(message: string, history: ChatMessage[]): Promise<string> {
  await simulateThinking(message, 800);

  const lower = message.toLowerCase();

  if (/hello|hi|hey|good morning|good afternoon/i.test(lower)) {
    return "Hello! I'm your AI productivity assistant. I can help you with:\n\n- Planning and prioritizing your tasks\n- Drafting emails or messages\n- Summarizing documents or notes\n- Researching topics and providing insights\n- General productivity advice\n\nWhat can I help you with today?";
  }

  if (/plan|prioriti|schedule|task/i.test(lower)) {
    return "Here's a quick prioritization framework:\n\n1. **List everything** — get all tasks out of your head and onto paper\n2. **Score by impact and urgency** — High impact + High urgency = do first\n3. **Time-block** — assign each task to a specific time slot\n4. **Batch similar work** — group emails, calls, and admin together\n5. **Protect deep work** — reserve your most productive hours for focused tasks\n\nWould you like me to help you create a specific plan? Just share your task list.";
  }

  if (/email|write|draft/i.test(lower)) {
    return "I can help you draft that! Try the **Smart Email Generator** from the sidebar — you can specify the topic, audience, tone, and key points, and I'll produce a polished email for you.\n\nAlternatively, tell me what the email is about and I can draft something right here.";
  }

  if (/stress|overwhelm|burnout|tired|busy/i.test(lower)) {
    return "It sounds like you're dealing with a lot. Here are some strategies:\n\n- **Do a brain dump** — write everything down to reduce mental load\n- **Pick 3 priority tasks** — not 10. Three is sustainable.\n- **Time-box everything** — set a timer and work in 25-minute focused sprints\n- **Take real breaks** — 5 minutes away from the screen every hour\n- **Learn to say no** — protect your capacity for what matters most\n\nStart small. What's the one thing that would make the biggest difference today?";
  }

  if (/research|analyz|summari/i.test(lower)) {
    return "I'd be happy to help with that! You can use the **Research Assistant** or **Meeting Notes Summarizer** from the sidebar for structured analysis.\n\nOr just tell me the topic right here and I'll give you a quick overview.";
  }

  if (/thank/i.test(lower)) {
    return "You're welcome! Feel free to come back anytime you need help with planning, writing, or productivity. Have a great day!";
  }

  return `That's a great question. Here's my take:\n\n${message.charAt(0).toUpperCase() + message.slice(1)} is worth approaching methodically. I'd recommend breaking it down into smaller, actionable steps and tackling them one at a time.\n\nWould you like me to help you create a specific plan, or would you prefer to use one of the dedicated tools in the sidebar (Email Generator, Task Planner, Research Assistant, etc.)?`;
}

export { delay };
