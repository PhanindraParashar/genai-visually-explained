import React, { useState } from 'react';
import { LessonContainer } from '../LessonContainer';
import { Trash2, HardDrive, ArrowRight, AlertOctagon } from 'lucide-react';

export const ContextWindow: React.FC = () => {
  const [tokens, setTokens] = useState<string[]>(["Hello", "AI", "how", "are", "you"]);
  const [inputValue, setInputValue] = useState("");
  const MAX_SIZE = 8;

  const addWord = () => {
    if(!inputValue.trim()) return;
    const newWords = inputValue.trim().split(' ');
    
    // Animate nicely by adding one by one in real implementation, 
    // but here we just slice the array to simulate FIFO
    setTokens(prev => {
      const combined = [...prev, ...newWords];
      if (combined.length > MAX_SIZE) {
        return combined.slice(combined.length - MAX_SIZE);
      }
      return combined;
    });
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addWord();
  }

  return (
    <LessonContainer
      title="The Context Window"
      subtitle="LLMs have limited short-term memory. Like a conveyor belt, if you add too much, the oldest stuff falls off the edge."
    >
      <div className="flex flex-col items-center gap-12 mt-8">
        
        {/* Conveyor Belt Visualization */}
        <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl border border-slate-700 overflow-hidden flex flex-col items-center justify-center p-12 shadow-2xl">
           
           <div className="absolute top-6 right-6 flex items-center gap-2 text-sm font-mono font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
             <HardDrive className="w-4 h-4" /> Capacity: {tokens.length}/{MAX_SIZE} tokens
           </div>

           {/* The Belt */}
           <div className="flex items-center gap-3 md:gap-4 overflow-visible relative z-10 w-full justify-center min-h-[120px]">
              
              {/* Falloff Zone */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-32 flex flex-col items-center justify-center text-red-900/30">
                <Trash2 className="w-16 h-16 mb-2" />
                <span className="text-xs font-bold uppercase tracking-widest text-red-900/50">Void</span>
              </div>

              {/* Gradient Fade for falloff */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-900 to-transparent z-20 pointer-events-none"></div>

              {/* Active Tokens */}
              <div className="flex gap-2 items-center transition-all duration-300">
                {tokens.map((t, i) => (
                  <div 
                    key={i} 
                    className={`
                      relative bg-slate-800 text-white px-4 py-4 rounded-xl border border-slate-600 shadow-xl 
                      whitespace-nowrap text-xl font-mono font-bold transition-all duration-500
                      ${i === tokens.length - 1 ? 'animate-float-up scale-110 border-emerald-500 text-emerald-100' : ''}
                      ${i === 0 && tokens.length === MAX_SIZE ? 'opacity-50 scale-90 text-red-300 border-red-900' : ''}
                    `}
                  >
                    {t}
                    {i === 0 && tokens.length === MAX_SIZE && (
                       <span className="absolute -top-3 left-0 w-full text-center text-[10px] text-red-500 font-bold uppercase">Falling!</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Input Zone Indicator */}
              <div className="ml-4 flex flex-col items-center justify-center opacity-30">
                 <ArrowRight className="w-8 h-8 text-emerald-500" />
                 <span className="text-[10px] font-bold uppercase text-emerald-500">Input</span>
              </div>
           </div>

           {/* Conveyor Floor */}
           <div className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-red-900/50 via-slate-700 to-emerald-900/50"></div>
           <div className="absolute bottom-0 w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)] animate-pulse"></div>
        </div>

        {/* Input Control */}
        <div className="flex flex-col gap-4 w-full max-w-md items-center">
          <div className="flex gap-2 w-full">
            <input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type words here..." 
                className="flex-1 px-6 py-4 rounded-full bg-slate-800 border-2 border-slate-600 text-white focus:outline-none focus:border-emerald-500 text-lg shadow-lg"
            />
            <button 
                onClick={addWord}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 rounded-full font-bold shadow-lg shadow-emerald-900/50 transition-transform active:scale-95"
            >
                Add
            </button>
          </div>
          <p className="text-xs text-slate-500">
             Try typing sentences. Watch the left side when you exceed {MAX_SIZE} words.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <AlertOctagon className="w-5 h-5 text-red-400" /> The "Lost Memory" Problem
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                    If you talk to an AI for too long, it forgets the beginning of the conversation. 
                    Physically, the first tokens (words) are pushed out of the array to make room for new ones.
                    It's not ignoring you; the data literally ceases to exist in its current view.
                </p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                 <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-blue-400" /> Massive Windows
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Modern models (like Gemini 1.5) have massive context windows (1 Million+ tokens). 
                    That's enough to fit entire novels, codebases, or hours of video in memory at once without forgetting!
                </p>
            </div>
        </div>

      </div>
    </LessonContainer>
  );
};