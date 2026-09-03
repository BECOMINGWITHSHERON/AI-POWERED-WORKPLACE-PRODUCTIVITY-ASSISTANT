import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, Trash2, User, Bot } from 'lucide-react';
import Card from '@/components/ui/Card';
import { chatRespond } from '@/lib/ai';
import type { ChatMessage } from '@/types';
import Disclaimer from '@/components/ui/Disclaimer';

const suggestions = [
  'Help me plan my day',
  'How do I prioritize tasks?',
  'Write a follow-up email',
  'I feel overwhelmed at work',
];

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uid(),
      role: 'assistant',
      content:
        "Hello! I'm your AI productivity assistant. I can help you plan tasks, draft emails, summarize content, research topics, and answer productivity questions. How can I help you today?",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (text?: string) => {
    const message = (text || input).trim();
    if (!message || loading) return;

    const userMsg: ChatMessage = {
      id: uid(),
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const response = await chatRespond(message, newHistory);
      setMessages([
        ...newHistory,
        { id: uid(), role: 'assistant', content: response, timestamp: Date.now() },
      ]);
    } catch {
      setMessages([
        ...newHistory,
        {
          id: uid(),
          role: 'assistant',
          content: 'Sorry, I had trouble responding. Please try again.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: uid(),
        role: 'assistant',
        content:
          "Hi! I'm your AI productivity assistant. What can I help you with?",
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div className="animate-fade-in-up">
      <Card className="overflow-hidden flex flex-col" >
        {/* Chat header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success-500 ring-2 ring-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">AI Assistant</h3>
              <p className="text-xs text-success-600">Online · Ready to help</p>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </button>
        </div>

        {/* Messages area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-neutral-50/50 min-h-[400px] max-h-[55vh]"
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {loading && (
            <div className="flex items-start gap-3 animate-fade-in">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-white border border-neutral-200 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary-400 animate-bounce-dot" style={{ animationDelay: '0s' }} />
                  <span className="h-2 w-2 rounded-full bg-primary-400 animate-bounce-dot" style={{ animationDelay: '0.2s' }} />
                  <span className="h-2 w-2 rounded-full bg-primary-400 animate-bounce-dot" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-4 py-3 border-t border-neutral-200 bg-white">
            <p className="text-xs text-neutral-400 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-600 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="border-t border-neutral-200 bg-white p-4">
          <div className="flex items-end gap-2.5">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                rows={1}
                className="w-full resize-none rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 max-h-32"
                style={{ minHeight: '44px' }}
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2.5">
            <Disclaimer compact />
          </div>
        </div>
      </Card>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 animate-fade-in-up ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={[
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
          isUser
            ? 'bg-neutral-200 text-neutral-600'
            : 'bg-gradient-to-br from-primary-500 to-primary-700 text-white',
        ].join(' ')}
      >
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </div>
      <div
        className={[
          'max-w-[80%] rounded-2xl px-4 py-3',
          isUser
            ? 'rounded-tr-sm bg-primary-600 text-white'
            : 'rounded-tl-sm bg-white border border-neutral-200 text-neutral-800',
        ].join(' ')}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
