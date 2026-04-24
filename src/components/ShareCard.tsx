import React, { useRef, useState, useEffect } from 'react';
import { Share2, Download, Check } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

interface ShareCardProps {
  fact: string;
}

const FACTS = [
  "India is the world's largest democracy with over 900 million eligible voters.",
  "The Model Code of Conduct comes into effect as soon as the election schedule is announced.",
  "EVMs (Electronic Voting Machines) were first used in India in 1982 in Kerala.",
  "NOTA (None Of The Above) option was introduced in Indian elections in 2013.",
  "The Election Commission of India (ECI) was established in 1950, a day before India became a republic.",
];

export default function ShareCard({ fact: initialFact }: ShareCardProps) {
  const [fact, setFact] = useState(initialFact);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialFact) {
      setFact(FACTS[Math.floor(Math.random() * FACTS.length)]);
    }
  }, [initialFact]);

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
