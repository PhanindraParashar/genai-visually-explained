import React, { useState } from 'react';
import { LessonContainer } from '../LessonContainer';
import { RobotAvatar } from '../RobotAvatar';
import { RobotMood } from '../../types';
import { Check, X, ArrowRight } from 'lucide-react';

interface TrainingExample {
  instruction: string;
  badOutput: string;
  goodOutput: string;
  isCorrected: boolean;
}

export const FineTuning: React.FC = () => {
  const [examples, setExamples] = useState<TrainingExample[]>([
    {
      instruction: "Summarize: The quick brown fox jumps over the dog.",
      badOutput: "Fox. Dog. Jumps. Brown. Quick.",
      goodOutput: "A fox jumped over a dog.",
      isCorrected: false
    },
    {
      instruction: "Translate to Spanish: Hello",
      badOutput: "Hello means Hola in Spanish.",
      goodOutput: "Hola",
      isCorrected: false
    },
    {
      instruction: "Be polite.",
      badOutput: "Give me water now.",
      goodOutput: "Could I please have some water?",
      isCorrected: false
    }
  ]);

  const [score, setScore] = useState(0);

  const handleCorrect = (index: number) => {
    if (examples[index].isCorrected) return;
    
    const newExamples = [...examples];
    newExamples[index].isCorrected = true;
    setExamples(newExamples);
    setScore(prev => prev + 1);
  };

  return (
    <LessonContainer
      title="Instruction Fine-Tuning"
      subtitle="Pre-training makes the model smart. Fine-tuning makes it helpful. You are the teacher now."
    >
      <div className="flex flex-col gap-8">
        
        <div className="flex items-center justify-between bg-slate-800 p-6 rounded-xl border border-slate-700">
           <div className="flex items-center gap-4">
             <RobotAvatar mood={score === 3 ? RobotMood.TEACHER : RobotMood.CONFUSED} />
             <div>
               <h3 className="text-xl font-bold text-white">Classroom Status</h3>
               <p className="text-slate-400">
                 {score === 0 ? "Model is rambling..." : score === 3 ? "Model is graduated!" : "Learning in progress..."}
               </p>
             </div>
           </div>
           <div className="text-4xl font-bold text-emerald-500">{score}/3</div>
        </div>

        <div className="grid gap-4">
          {examples.map((ex, i) => (
            <div key={i} className={`p-6 rounded-xl border-2 transition-all duration-500 ${ex.isCorrected ? 'border-emerald-500 bg-emerald-900/10' : 'border-slate-700 bg-slate-800'}`}>
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase">Instruction</div>
                  <div className="text-white font-mono bg-slate-900 p-2 rounded">{ex.instruction}</div>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <ArrowRight className="text-slate-600" />
                    <div className={`p-3 rounded-lg w-full ${ex.isCorrected ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'}`}>
                       {ex.isCorrected ? ex.goodOutput : ex.badOutput}
                    </div>
                  </div>
                </div>

                {!ex.isCorrected && (
                  <button 
                    onClick={() => handleCorrect(i)}
                    className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Teach
                  </button>
                )}
                 {ex.isCorrected && (
                  <div className="shrink-0 text-emerald-500 flex items-center gap-2 font-bold">
                    <Check className="w-6 h-6" /> Learned
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-900/20 p-6 rounded-xl border border-yellow-700/50">
           <h3 className="text-yellow-400 font-bold mb-2">What is happening?</h3>
           <p className="text-yellow-200/80">
             This is called <b>RLHF</b> (Reinforcement Learning from Human Feedback) or basic Instruct Tuning. 
             Humans show the model pairs of (Question, Good Answer). The model adjusts its internal parameters to prefer the "Good Answer" style.
           </p>
        </div>

      </div>
    </LessonContainer>
  );
};