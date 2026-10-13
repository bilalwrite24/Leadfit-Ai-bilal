import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchGeminiChat } from '../../services/geminiService';
import {
  Bot,
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  Trash2,
  Loader2,
  ChevronUp,
  Search,
  ExternalLink,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const GeminiChatCopilot: React.FC = () => {
  const { showToast, setCurrentPage } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "👋 Hi! I'm **LeadFit Copilot**, your B2B sales intelligence advisor powered by Gemini with live Google Search data. How can I assist your pipeline today? Ask me to research accounts, craft high-converting outbound copy, or suggest real-time buying signals.",
      timestamp: 'Just now',
    },
  ]);

  const quickPrompts = [
    'Find high-growth FinTechs hiring sales reps',
    'Write a 75-word cold email referencing a Series B',
    'What buying signals indicate ready-to-buy software?',
    'How do I handle "Not interested at this time"?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetchGeminiChat({
        messages: historyPayload,
        userMessage: text,
      });

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: res.text || 'I analyzed your request.',
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      showToast('Copilot response error; please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        text: "Conversation cleared. How can I assist your prospecting strategy?",
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900 dark:bg-indigo-600 text-white text-xs font-semibold shadow-2xl hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all transform hover:scale-105 group border border-slate-700/60"
        >
          <div className="w-5 h-5 rounded-full bg-indigo-500 dark:bg-white text-white dark:text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-3 h-3" />
          </div>
          <span>Sales Copilot AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* Slide-Up / Floating Window */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-[420px] max-w-[calc(100vw-3rem)] h-[560px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>LeadFit Sales Copilot</span>
                  <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded-full">
                    Search Grounded
                  </span>
                </h3>
                <span className="text-[10px] text-slate-400">Gemini 3.8 Flash · Multi-turn GTM Strategist</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-lg hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
                title="Clear Chat Thread"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
                title="Close Copilot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 mb-0.5">
                    {isUser ? 'You' : 'LeadFit Copilot'}
                  </span>
                  <div
                    className={`p-3 rounded-2xl max-w-[90%] whitespace-pre-line leading-relaxed ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs max-w-[80%]">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>Thinking with Search Grounding...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompts */}
          {messages.length <= 3 && (
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950 flex flex-wrap gap-1.5">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(qp)}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  {qp}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Copilot or search for accounts..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white transition-colors"
                title="Send Message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
