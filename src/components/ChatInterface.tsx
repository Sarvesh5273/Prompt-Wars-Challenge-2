import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
};

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  language: 'en' | 'hi';
}

export default function ChatInterface({ messages, isLoading, onSendMessage, language }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('chat-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      window.gtag?.('event', 'chat_message_sent', { language });
      setInput('');
    }
  };

  const presetQuestions = language === 'hi' 
    ? [
        "मैं मतदाता कैसे बनूँ?",
        "EVM क्या है?",
        "विजेता कैसे तय होता है?"
      ]
    : [
        "How do I register to vote?",
        "What is an EVM?",
        "How are winners decided?"
      ];

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 mb-12">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
        {/* Header */}
        <div className="bg-white/5 border-b border-white/10 p-4 flex items-center space-x-3" role="banner">
          <div className="bg-blue-500 p-2 rounded-full" aria-hidden="true">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg" id="chat-heading">Election Guide Assistant</h2>
            <p className="text-blue-200 text-xs">Ask me anything about the Indian election process</p>
          </div>
        </div>

        {/* Messages area */}
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-4" 
          role="log" 
          aria-live="polite" 
          aria-labelledby="chat-heading"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-400">
              <Bot className="w-16 h-16 opacity-50" />
              <p className="max-w-xs">Click on a timeline stage above or ask a question below to get started!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex items-start space-x-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="bg-blue-500/20 p-2 rounded-full flex-shrink-0">
                    <Bot className="w-5 h-5 text-blue-400" />
                  </div>
                )}
                <div 
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === 'user' 
                      ? 'bg-orange-500 text-white rounded-tr-sm' 
                      : msg.isError
                      ? 'bg-red-500/20 text-red-200 border border-red-500/50 rounded-tl-sm'
                      : 'bg-white/10 text-gray-100 rounded-tl-sm border border-white/10'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="bg-orange-500/20 p-2 rounded-full flex-shrink-0">
                    <User className="w-5 h-5 text-orange-400" />
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex items-start space-x-3 justify-start">
              <div className="bg-blue-500/20 p-2 rounded-full flex-shrink-0">
                <Bot className="w-5 h-5 text-blue-400" />
              </div>
              <div className="bg-white/10 text-gray-100 rounded-2xl rounded-tl-sm border border-white/10 p-4 flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area & Preset Questions */}
        <div className="p-4 bg-black/20 border-t border-white/10">
          <div className="flex gap-2 overflow-x-auto pb-3 mb-1 no-scrollbar">
            {presetQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => { if (!isLoading) onSendMessage(q); }}
                disabled={isLoading}
                className="whitespace-nowrap px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-200 text-sm transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex items-center space-x-2" aria-label="Chat input form">
            <label htmlFor="chat-input" className="sr-only">Ask a question</label>
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'hi' ? "यहाँ सवाल पूछें..." : "Ask a question..."}
              disabled={isLoading}
              aria-disabled={isLoading}
              className="flex-1 bg-white/5 border border-white/20 rounded-full px-6 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all disabled:opacity-50"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              aria-disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-lg"
            >
              <Send className="w-5 h-5" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
