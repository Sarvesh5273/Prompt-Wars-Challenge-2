import React, { useState, useEffect } from 'react';
import { UserPlus, FileSignature, Megaphone, CheckSquare, BarChart, Trophy } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';

export type ElectionStage = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
};

export const STAGES: ElectionStage[] = [
  {
    id: 'registration',
    title: 'Voter Registration',
    description: 'Citizens enroll to vote in the upcoming elections.',
    icon: <UserPlus className="w-6 h-6" />,
    color: 'bg-orange-500',
  },
  {
    id: 'nomination',
    title: 'Candidate Nomination',
    description: 'Candidates file their papers to run for office.',
    icon: <FileSignature className="w-6 h-6" />,
    color: 'bg-orange-400',
  },
  {
    id: 'campaign',
    title: 'Campaign Period',
    description: 'Parties and candidates rally for public support.',
    icon: <Megaphone className="w-6 h-6" />,
    color: 'bg-white text-blue-900',
  },
  {
    id: 'voting',
    title: 'Voting Day',
    description: 'Registered voters cast their ballots at polling booths.',
    icon: <CheckSquare className="w-6 h-6" />,
    color: 'bg-green-400',
  },
  {
    id: 'counting',
    title: 'Counting',
    description: 'EVMs are opened and votes are tallied securely.',
    icon: <BarChart className="w-6 h-6" />,
    color: 'bg-green-500',
  },
  {
    id: 'results',
    title: 'Results',
    description: 'Winners are declared and the new government forms.',
    icon: <Trophy className="w-6 h-6" />,
    color: 'bg-green-600',
  },
];

interface TimelineProps {
  selectedStageId: string | null;
  onSelectStage: (stage: ElectionStage) => void;
}

export default function Timeline({ selectedStageId, onSelectStage }: TimelineProps) {
  const [currentStageId, setCurrentStageId] = useState<string | null>(null);

  useEffect(() => {
    // Determine current stage based on 2026 election calendar
    const now = new Date();
    const march15 = new Date('2026-03-15T00:00:00');
    const april9 = new Date('2026-04-09T00:00:00');
    const april23 = new Date('2026-04-23T00:00:00');
    const april30 = new Date('2026-04-30T00:00:00');
    const may4 = new Date('2026-05-04T00:00:00');

    if (now < march15) {
      setCurrentStageId('registration');
    } else if (now >= march15 && now < april9) {
      setCurrentStageId('nomination');
    } else if (now >= april9 && now < april23) {
      setCurrentStageId('campaign');
    } else if (now >= april23 && now < april30) {
      setCurrentStageId('voting');
    } else if (now >= april30 && now < may4) {
      setCurrentStageId('counting');
    } else {
      setCurrentStageId('results');
    }
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (!selectedStageId) {
        onSelectStage(STAGES[0]);
        return;
      }
      const currentIndex = STAGES.findIndex(s => s.id === selectedStageId);
      if (currentIndex !== -1 && currentIndex < STAGES.length - 1) {
        onSelectStage(STAGES[currentIndex + 1]);
      }
    },
    onSwipedRight: () => {
      if (!selectedStageId) return;
      const currentIndex = STAGES.findIndex(s => s.id === selectedStageId);
      if (currentIndex > 0) {
        onSelectStage(STAGES[currentIndex - 1]);
      }
    },
    trackMouse: false
  });

  return (
    <div {...handlers} className="w-full py-6 touch-pan-y" role="region" aria-label="Election Timeline">
      <div className="relative wrap overflow-hidden p-4 h-full">
        <div className="border-2-2 absolute border-opacity-20 border-white h-full border left-1/2 md:left-1/2 rounded-full hidden md:block"></div>
        {/* Mobile vertical line */}
        <div className="border-2-2 absolute border-opacity-20 border-white h-full border left-8 block md:hidden rounded-full"></div>
        
        <div className="flex flex-col space-y-8">
          {STAGES.map((stage, index) => {
            const isSelected = selectedStageId === stage.id;
            const isCurrent = currentStageId === stage.id;
            const isEven = index % 2 === 0;

            return (
              <div 
                key={stage.id} 
                className={`mb-8 flex justify-between items-center w-full group cursor-pointer transition-transform duration-300 ${isSelected ? 'scale-105' : 'hover:scale-105'}`}
                onClick={() => onSelectStage(stage)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectStage(stage);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`${stage.title}. ${stage.description}. ${isCurrent ? 'Current active phase.' : ''}`}
              >
                <div className="order-1 hidden md:block w-5/12"></div>
                
                <div className={`z-20 flex items-center order-1 bg-gray-800 shadow-xl w-16 h-16 rounded-full border-4 ${isSelected ? 'border-blue-400' : 'border-gray-600'} ${isCurrent ? 'ring-4 ring-orange-400 ring-opacity-50 animate-pulse' : ''} transition-colors duration-300 justify-center ${stage.color}`}>
                  {React.cloneElement(stage.icon as React.ReactElement<{ className?: string }>, {
                    className: `w-8 h-8 ${stage.color.includes('bg-white') ? 'text-blue-900' : 'text-white'}`
                  })}
                </div>
                
                <div className={`relative order-1 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl w-full md:w-5/12 ml-6 md:ml-0 ${isEven ? 'md:mr-auto' : 'md:ml-auto'} transition-all duration-300 ${isSelected ? 'ring-2 ring-blue-400 bg-white/20' : ''}`}>
                  {isCurrent && (
                    <span className="absolute -top-3 -right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-orange-300">
                      Current Phase
                    </span>
                  )}
                  <h3 className="font-bold text-xl text-white mb-1 tracking-wide">{stage.title}</h3>
                  <p className="text-sm leading-snug text-gray-300">{stage.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
