'use client';

import React, { useState, useEffect } from 'react';
import Timeline, { ElectionStage } from '@/components/Timeline';
import ChatInterface, { Message } from '@/components/ChatInterface';
import QuizMode from '@/components/QuizMode';
import ShareCard from '@/components/ShareCard';

type AppMode = 'explore' | 'quiz';

export default function Home() {
  const [mode, setMode] = useState<AppMode>('explore');
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'en' || savedLang === 'hi') {
      setLanguage(savedLang);
    }
  }, []);

  const generateId = () => Math.random().toString(36).substring(2, 15);

  const sendMessageToApi = async (messagesToSend: Message[]) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: messagesToSend, language }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { id: generateId(), role: 'assistant', content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: generateId(), role: 'assistant', content: 'Oops! I had trouble fetching that information. Please try again.', isError: true },
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { id: generateId(), role: 'assistant', content: 'There was a network error. Please check your connection and try again.', isError: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStageSelect = (stage: ElectionStage) => {
    setSelectedStageId(stage.id);
    const userMessage = `Tell me about the '${stage.title}' stage in the Indian election process.`;
    
    const newMessages: Message[] = [
      ...messages,
      { id: generateId(), role: 'user', content: userMessage },
    ];
    setMessages(newMessages);
    sendMessageToApi(newMessages);
  };

  const handleSendMessage = (content: string) => {
    const newMessages: Message[] = [
      ...messages,
      { id: generateId(), role: 'user', content },
    ];
    setMessages(newMessages);
    sendMessageToApi(newMessages);
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Header section */}
        <div className="w-full flex justify-end mt-4 mb-2">
          <button
            onClick={() => {
              const newLang = language === 'en' ? 'hi' : 'en';
              setLanguage(newLang);
              localStorage.setItem('language', newLang);
            }}
            className="px-4 py-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
            aria-label="Toggle language"
          >
            {language === 'en' ? 'हिंदी' : 'English'}
          </button>
        </div>
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-green-400 mb-4 drop-shadow-sm">
            Indian Election Journey
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Discover the democratic process of the world's largest democracy.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10 mb-12" role="tablist" aria-label="App Modes">
          <button
            onClick={() => setMode('explore')}
            role="tab"
            aria-selected={mode === 'explore'}
            aria-controls="explore-panel"
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
              mode === 'explore' 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Explore Timeline
          </button>
          <button
            onClick={() => setMode('quiz')}
            role="tab"
            aria-selected={mode === 'quiz'}
            aria-controls="quiz-panel"
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
              mode === 'quiz' 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Take the Quiz
          </button>
        </div>

        {/* Content Panels */}
        {mode === 'explore' && (
          <div id="explore-panel" role="tabpanel" className="w-full animate-fade-in-up">
            {/* Timeline */}
            <div className="w-full">
              <Timeline selectedStageId={selectedStageId} onSelectStage={handleStageSelect} language={language} />
            </div>

            {/* Share Card Feature */}
            <ShareCard language={language} />

            {/* Chat Interface */}
            <div className="w-full mt-8 mb-8">
              <div className="flex flex-col items-center mb-4">
                <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-green-500 rounded-full mb-2"></div>
                <h2 className="text-2xl font-bold text-white">{language === 'en' ? "Have questions? Let's talk!" : "कोई सवाल है? आइए बात करें!"}</h2>
              </div>
              <ChatInterface 
                messages={messages} 
                isLoading={isLoading} 
                onSendMessage={handleSendMessage}
                language={language}
              />
            </div>
          </div>
        )}

        {mode === 'quiz' && (
          <div id="quiz-panel" role="tabpanel" className="w-full animate-fade-in-up py-8">
            <QuizMode language={language} />
            <div className="mt-12">
              <ShareCard 
                fact={language === 'en' ? "I just tested my knowledge on the Indian Election Process and scored great!" : "मैंने भारतीय चुनाव प्रक्रिया पर अपने ज्ञान का परीक्षण किया और शानदार अंक प्राप्त किए!"} 
                language={language}
              />
            </div>
          </div>
        )}
      </div>
      <footer className="text-center text-gray-400 text-sm mt-12 pb-4">
        {language === 'en' 
          ? 'Powered by Gemini 2.5 Flash | Built for PromptWars Virtual Challenge 2'
          : 'Gemini 2.5 Flash द्वारा संचालित | PromptWars Virtual Challenge 2 के लिए निर्मित'
        }
      </footer>
    </main>
  );
}
