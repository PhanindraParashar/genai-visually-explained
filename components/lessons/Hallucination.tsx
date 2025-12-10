import React, { useState } from 'react';
import { LessonContainer } from '../LessonContainer';
import { RobotAvatar } from '../RobotAvatar';
import { RobotMood } from '../../types';
import { AlertTriangle, HelpCircle, BookX, SearchX, Quote } from 'lucide-react';

export const Hallucination: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const scenarios = [
    {
      id: "mars",
      title: "The Mars Walker",
      query: "Who was the first person to walk on Mars?",
      answer: "The first person to walk on Mars was Captain Elara Vance in 2032 during the Ares IV mission.",
      explanation: "The model saw the pattern 'First person to walk on [Planet]' and predicted a plausible-sounding name and date. It prioritized completing the sentence structure over fact-checking (since the event hasn't happened yet!).",
      icon: <SearchX className="w-5 h-5" />
    },
    {
      id: "bio",
      title: "The Fake Biography",
      query: "Tell me about the famous 19th-century physicist 'Dr. Aris Thorne'.",
      answer: "Dr. Aris Thorne (1842-1912) was a renowned physicist known for his work on thermodynamic entropy at Cambridge University. He published the influential paper 'Systems of Chaos'...",
      explanation: "The name 'Aris Thorne' sounds smart and academic. The model hallucinates a biography because it associates that 'sound' of name with physicists, Cambridge, and the 19th century.",
      icon: <BookX className="w-5 h-5" />
    }
  ];

  return (
    <LessonContainer
      title="Hallucinations"
      subtitle="Why do AI models lie? They don't mean to. They are just trying to complete a pattern, even if the facts aren't there."
    >
      <div className="flex flex-col items-center gap-8 mt-4">
        
        {/* Scenario Selector */}
        <div className="flex gap-4 bg-slate-800 p-1 rounded-full border border-slate-700">
          {scenarios.map((s, i) => (
            <button 
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === i ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              {s.icon}
              {s.title}
            </button>
          ))}
        </div>

        {/* Main Visualization */}
        <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
          
          {/* Lie Detector Visual Warning */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 animate-pulse"></div>
          <div className="absolute top-4 right-4 bg-red-900/30 border border-red-500/50 text-red-400 px-3 py-1 rounded text-xs font-mono font-bold uppercase animate-pulse">
            Warning: Fabricated Content
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Robot State */}
            <div className="shrink-0 flex flex-col items-center gap-4 w-full md:w-auto">
               <div className="relative">
                 <RobotAvatar mood={RobotMood.CONFUSED} className="w-32 h-32 border-4 border-red-500/30" />
                 <div className="absolute -bottom-2 -right-2 bg-slate-900 text-2xl">🤥</div>
               </div>
               <div className="text-center">
                 <div className="font-bold text-white text-lg">The Confident Guesser</div>
                 <div className="text-slate-500 text-sm">Certainty: 99.9%</div>
               </div>
            </div>

            {/* Conversation */}
            <div className="space-y-6 flex-1 w-full">
               {/* User */}
               <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 font-bold">U</div>
                 <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700 w-full">
                   <div className="text-xs text-blue-400 uppercase font-bold mb-1">User Query</div>
                   <p className="text-white text-lg font-medium">"{scenarios[activeTab].query}"</p>
                 </div>
               </div>

               {/* AI */}
               <div className="flex gap-4 flex-row-reverse">
                 <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shrink-0 font-bold">AI</div>
                 <div className="bg-red-900/10 p-5 rounded-2xl rounded-tr-none border border-red-500/50 w-full relative">
                   <Quote className="absolute top-2 right-2 w-8 h-8 text-red-900/20" />
                   <div className="text-xs text-red-400 uppercase font-bold mb-2">Model Response (Hallucinated)</div>
                   <p className="text-red-100 text-lg italic leading-relaxed">
                     {scenarios[activeTab].answer}
                   </p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Explanation Box */}
        <div className="bg-slate-800/80 p-8 rounded-2xl border-l-4 border-yellow-500 flex gap-6 max-w-4xl shadow-lg backdrop-blur">
           <div className="bg-yellow-500/10 p-4 rounded-full h-fit shrink-0">
             <AlertTriangle className="w-8 h-8 text-yellow-500" />
           </div>
           <div>
             <h3 className="text-xl font-bold text-white mb-2">The "Pattern Completion" Trap</h3>
             <p className="text-slate-300 text-lg leading-relaxed">
               {scenarios[activeTab].explanation}
             </p>
             <div className="mt-4 bg-slate-900 p-4 rounded-lg text-sm text-slate-400 italic border border-slate-700">
               <strong>Remember:</strong> Large Language Models do not check a database of facts. 
               They are "Next Token Predictors". If the most likely next word creates a lie, they will lie.
             </div>
           </div>
        </div>

      </div>
    </LessonContainer>
  );
};