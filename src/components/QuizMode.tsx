import React, { useState } from 'react';
import { CheckCircle2, XCircle, RefreshCw, Trophy } from 'lucide-react';

type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
};

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What does EVM stand for in the Indian election process?",
    options: ["Electronic Voting Machine", "Electoral Verification Method", "Election Voting Management", "Electronic Voter Matrix"],
    correctAnswerIndex: 0,
    explanation: "EVM stands for Electronic Voting Machine, which is used to record votes securely.",
  },
  {
    id: 2,
    text: "Which independent body is responsible for conducting elections in India?",
    options: ["The Supreme Court", "The Parliament", "Election Commission of India (ECI)", "Ministry of Home Affairs"],
    correctAnswerIndex: 2,
    explanation: "The Election Commission of India (ECI) is an autonomous constitutional authority responsible for administering election processes in India.",
  },
  {
    id: 3,
    text: "What is the 'Model Code of Conduct'?",
    options: ["A dress code for politicians", "Guidelines for political parties and candidates during elections", "A guide for voters on how to dress", "Rules for news channels only"],
    correctAnswerIndex: 1,
    explanation: "The Model Code of Conduct is a set of guidelines issued by the ECI to regulate political parties and candidates prior to elections.",
  },
  {
    id: 4,
    text: "What is the minimum voting age for a citizen of India?",
    options: ["16 years", "18 years", "21 years", "25 years"],
    correctAnswerIndex: 1,
    explanation: "The voting age in India was lowered from 21 to 18 years by the 61st Amendment Act of 1988.",
  },
  {
    id: 5,
    text: "What is NOTA on the voting machine?",
    options: ["None of the Above", "Number of Total Attendees", "National Organization for Trade Agreements", "New Option To Add"],
    correctAnswerIndex: 0,
    explanation: "NOTA stands for 'None of the Above', allowing voters to officially reject all candidates.",
  }
];

export default function QuizMode() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQuestion.correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="w-full max-w-2xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl text-center" role="region" aria-label="Quiz Results">
        <Trophy className="w-20 h-20 mx-auto text-yellow-400 mb-6" />
        <h2 className="text-3xl font-bold text-white mb-2">Quiz Completed!</h2>
        <p className="text-xl text-gray-300 mb-6">You scored {score} out of {QUIZ_QUESTIONS.length}</p>
        
        <div className="bg-black/20 rounded-2xl p-6 mb-8 text-left">
          <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
          <p className="text-gray-300">
            {score === QUIZ_QUESTIONS.length ? "Perfect score! You're an expert on Indian elections!" :
             score >= 3 ? "Great job! You have a solid understanding of the democratic process." :
             "Good effort! Keep exploring the timeline to learn more."}
          </p>
        </div>

        <button 
          onClick={restartQuiz}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full flex items-center justify-center mx-auto transition-colors"
          aria-label="Restart Quiz"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl" role="region" aria-label="Election Quiz">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-semibold text-blue-300 uppercase tracking-wider" aria-live="polite">
          Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}
        </span>
        <span className="text-sm font-semibold text-orange-300">
          Score: {score}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-white mb-8" id="question-text">{currentQuestion.text}</h2>

      <div className="space-y-4" role="radiogroup" aria-labelledby="question-text">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedOption === index;
          const isCorrect = index === currentQuestion.correctAnswerIndex;
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
          <div className={`p-4 rounded-xl ${selectedOption === currentQuestion.correctAnswerIndex ? 'bg-green-500/10 border border-green-500/30' : 'bg-orange-500/10 border border-orange-500/30'}`}>
            <h4 className={`font-semibold mb-2 ${selectedOption === currentQuestion.correctAnswerIndex ? 'text-green-400' : 'text-orange-400'}`}>
              {selectedOption === currentQuestion.correctAnswerIndex ? 'Correct!' : 'Incorrect'}
            </h4>
            <p className="text-gray-200 text-sm leading-relaxed">{currentQuestion.explanation}</p>
          </div>
          
          <button 
            onClick={handleNextQuestion}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label={currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? "Next Question" : "See Results"}
            autoFocus
          >
            {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? "Next Question" : "See Results"}
          </button>
        </div>
      )}
    </div>
  );
}
