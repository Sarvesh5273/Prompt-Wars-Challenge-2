import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, XCircle, RefreshCw, Trophy } from 'lucide-react';

interface QuizModeProps {
  language: 'en' | 'hi';
}

export default function QuizMode({ language }: QuizModeProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const hasFetched = useRef(false);

  const fetchQuiz = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language }),
      });
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setScore(0);
      setShowResults(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchQuiz();
  }, []);

  // Re-fetch when language changes (but not on first mount)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchQuiz();
  }, [language]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQuestion.correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
      window.gtag?.('event', 'quiz_completed', { score, total: questions.length });
    }
  };

  const restartQuiz = () => {
    hasFetched.current = false;
    fetchQuiz();
  };

  if (showResults) {
    return (
      <div className="w-full max-w-2xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl text-center" role="region" aria-label="Quiz Results">
        <Trophy className="w-20 h-20 mx-auto text-yellow-400 mb-6" />
        <h2 className="text-3xl font-bold text-white mb-2">
          {language === 'hi' ? 'क्विज़ पूर्ण!' : 'Quiz Completed!'}
        </h2>
        <p className="text-xl text-gray-300 mb-6">
          {language === 'hi'
            ? `आपने ${questions.length} में से ${score} सही उत्तर दिए`
            : `You scored ${score} out of ${questions.length}`}
        </p>

        <div className="bg-black/20 rounded-2xl p-6 mb-8 text-left">
          <h3 className="text-lg font-semibold text-white mb-4">
            {language === 'hi' ? 'सारांश' : 'Summary'}
          </h3>
          <p className="text-gray-300">
            {score === questions.length
              ? (language === 'hi' ? 'शानदार! आप भारतीय चुनावों के विशेषज्ञ हैं!' : "Perfect score! You're an expert on Indian elections!")
              : score >= 3
                ? (language === 'hi' ? 'बढ़िया! आपको लोकतांत्रिक प्रक्रिया की अच्छी समझ है।' : 'Great job! You have a solid understanding of the democratic process.')
                : (language === 'hi' ? 'अच्छा प्रयास! अधिक जानने के लिए टाइमलाइन देखें।' : 'Good effort! Keep exploring the timeline to learn more.')}
          </p>
        </div>

        <button
          onClick={restartQuiz}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full flex items-center justify-center mx-auto transition-colors"
          aria-label="Regenerate Quiz"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          {language === 'hi' ? 'नई क्विज़ बनाएं' : 'Regenerate Quiz'}
        </button>
      </div>
    );
  }

  if (isLoading || !currentQuestion) {
    return (
      <div className="w-full max-w-2xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="animate-pulse space-y-8">
          <div className="h-6 bg-white/20 rounded w-1/4"></div>
          <div className="h-8 bg-white/20 rounded w-3/4"></div>
          <div className="space-y-4">
            <div className="h-16 bg-white/10 rounded-xl w-full"></div>
            <div className="h-16 bg-white/10 rounded-xl w-full"></div>
            <div className="h-16 bg-white/10 rounded-xl w-full"></div>
            <div className="h-16 bg-white/10 rounded-xl w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl" role="region" aria-label="Election Quiz">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-semibold text-blue-300 uppercase tracking-wider" aria-live="polite">
          {language === 'hi'
            ? `प्रश्न ${currentQuestionIndex + 1} / ${questions.length}`
            : `Question ${currentQuestionIndex + 1} of ${questions.length}`}
        </span>
        <span className="text-sm font-semibold text-orange-300">
          {language === 'hi' ? `स्कोर: ${score}` : `Score: ${score}`}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-white mb-8" id="question-text">
        {currentQuestion.question}
      </h2>

      <div className="space-y-4" role="radiogroup" aria-labelledby="question-text">
        {currentQuestion.options.map((option: string, index: number) => {
          const isSelected = selectedOption === index;
          const isCorrect = index === currentQuestion.correctIndex;
          const isWrong = isSelected && !isCorrect;

          let buttonClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center ";
          if (!isAnswered) {
            buttonClass += "border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-200";
          } else if (isCorrect) {
            buttonClass += "border-green-500 bg-green-500/20 text-white";
          } else if (isWrong) {
            buttonClass += "border-red-500 bg-red-500/20 text-white";
          } else {
            buttonClass += "border-white/5 bg-white/5 text-gray-500 opacity-50";
          }

          return (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              disabled={isAnswered}
              className={buttonClass}
              role="radio"
              aria-checked={isSelected}
              aria-disabled={isAnswered}
              tabIndex={isAnswered ? -1 : 0}
            >
              <span className="font-medium text-lg">{option}</span>
              {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" aria-hidden="true" />}
              {isAnswered && isWrong && <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mt-8 animate-fade-in-up">
          <div className={`p-4 rounded-xl ${selectedOption === currentQuestion.correctIndex ? 'bg-green-500/10 border border-green-500/30' : 'bg-orange-500/10 border border-orange-500/30'}`}>
            <h4 className={`font-semibold mb-2 ${selectedOption === currentQuestion.correctIndex ? 'text-green-400' : 'text-orange-400'}`}>
              {selectedOption === currentQuestion.correctIndex
                ? (language === 'hi' ? 'सही!' : 'Correct!')
                : (language === 'hi' ? 'गलत' : 'Incorrect')}
            </h4>
            <p className="text-gray-200 text-sm leading-relaxed">{currentQuestion.explanation}</p>
          </div>

          <button
            onClick={handleNextQuestion}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label={currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results"}
            autoFocus
          >
            {currentQuestionIndex < questions.length - 1
              ? (language === 'hi' ? 'अगला प्रश्न' : 'Next Question')
              : (language === 'hi' ? 'परिणाम देखें' : 'See Results')}
          </button>
        </div>
      )}
    </div>
  );
}