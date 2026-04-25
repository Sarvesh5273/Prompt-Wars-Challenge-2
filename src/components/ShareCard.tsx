import React, { useRef, useState, useEffect } from 'react';
import { Share2, Download, Check } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

interface ShareCardProps {
  fact: string;
  language: 'en' | 'hi';
}

const FACTS_EN = [
  "India has 968 million registered voters",
  "EVM machines have been used since 1999",
  "India conducts elections in phases across 44 days",
  "The Model Code of Conduct activates as soon as elections are announced",
  "NOTA option has been available since 2013",
];

const FACTS_HI = [
  "भारत में 96.8 करोड़ पंजीकृत मतदाता हैं।",
  "EVM मशीनों का उपयोग 1999 से हो रहा है।",
  "भारत में चुनाव 44 दिनों में कई चरणों में होते हैं।",
  "NOTA विकल्प 2013 से उपलब्ध है।",
  "आदर्श आचार संहिता चुनाव घोषणा के साथ लागू होती है।",
];

export default function ShareCard({ fact: initialFact, language }: ShareCardProps) {
  const [fact, setFact] = useState(initialFact);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialFact) {
      const activeFacts = language === 'hi' ? FACTS_HI : FACTS_EN;
      setFact(activeFacts[Math.floor(Math.random() * activeFacts.length)]);
    } else {
      setFact(initialFact);
    }
  }, [initialFact, language]);

  const handleShare = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      
      // Try Web Share API first
      if (navigator.share) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'election-fact.png', { type: 'image/png' });
        try {
          await navigator.share({
            title: 'Indian Election Fact',
            text: 'I just learned something new about the Indian Election process!',
            files: [file],
          });
          setIsSuccess(true);
        } catch (shareError) {
          // Fallback to download if user cancels or share fails
          downloadImage(dataUrl);
        }
      } else {
        // Fallback to download
        downloadImage(dataUrl);
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
      setTimeout(() => setIsSuccess(false), 3000);
    }
  };

  const downloadImage = (dataUrl: string) => {
    const link = document.createElement('a');
    link.download = 'election-fact.png';
    link.href = dataUrl;
    link.click();
    setIsSuccess(true);
  };

  return (
    <div className="flex flex-col items-center justify-center my-8">
      {/* Visible interactive section */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-md text-center shadow-lg">
        <h3 className="text-xl font-bold text-white mb-3">Did you know?</h3>
        <p className="text-gray-200 mb-6 italic">"{fact}"</p>
        
        <div className="flex flex-col space-y-3">
          {!initialFact && (
            <button
              onClick={() => {
                const activeFacts = language === 'hi' ? FACTS_HI : FACTS_EN;
                let newFact = activeFacts[Math.floor(Math.random() * activeFacts.length)];
                while (newFact === fact) {
                  newFact = activeFacts[Math.floor(Math.random() * activeFacts.length)];
                }
                setFact(newFact);
              }}
              className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-full transition-all border border-white/20"
            >
              New Fact
            </button>
          )}
          <button
            onClick={handleShare}
            disabled={isGenerating}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-full transition-all disabled:opacity-70 w-full"
            aria-label="Share this fact"
          >
          {isGenerating ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : isSuccess ? (
            <Check className="w-5 h-5" />
          ) : (
             <Share2 className="w-5 h-5" />
          )}
          <span>{isGenerating ? 'Generating...' : isSuccess ? 'Shared!' : 'Share Fact'}</span>
        </button>
        </div>
      </div>

      {/* Hidden card to capture (positioned off-screen so it's rendered but not visible) */}
      <div className="overflow-hidden h-0 w-0 absolute left-[-9999px]">
        <div 
          ref={cardRef} 
          className="w-[600px] h-[400px] bg-[#0F172A] relative flex flex-col justify-center items-center p-12 text-center"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full mix-blend-screen filter blur-[80px] opacity-40"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500 rounded-full mix-blend-screen filter blur-[80px] opacity-40"></div>
          
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-green-400 mb-8 z-10">
            Indian Election Journey
          </h1>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl z-10 w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Did you know?</h2>
            <p className="text-xl text-gray-200 leading-relaxed italic">
              "{fact}"
            </p>
          </div>
          
          <p className="text-gray-400 mt-8 text-sm z-10 tracking-widest uppercase">
            Learn more at localhost:3000
          </p>
        </div>
      </div>
    </div>
  );
}
