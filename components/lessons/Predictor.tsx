import React, { useState, useEffect } from 'react';
import { LessonContainer } from '../LessonContainer';
import { TokenCandidate, RobotMood } from '../../types';
import { getSimulatedNextTokens } from '../../services/geminiService';
import { RobotAvatar } from '../RobotAvatar';
import { RefreshCw, Play } from 'lucide-react';

export const Predictor: React.FC = () => {
  const [sentence, setSentence] = useState<string>("The");
  const [candidates, setCandidates] = useState<TokenCandidate[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    // Initial candidates
    updateCandidates("The");
  }, []);

  const updateCandidates = (text: string) => {
    setIsThinking(true);
    // Simulate slight delay for "thinking" effect
    setTimeout(() => {
      const tokens = getSimulatedNextTokens(text);
      setCandidates(tokens);
      setIsThinking(false);
    }, 600);
  };

  const handleTokenClick = (word: string) => {
    const newSentence = sentence + " " + word;
    setSentence(newSentence);
    updateCandidates(newSentence);
  };

  const reset = () => {
    setSentence("The");
    updateCandidates("The");
  };

  return (
    <LessonContainer 
      title="Magic Typing Line" 
      subtitle="LLMs don't actually 'know' things. They just really good at guessing what comes next. Try it!"
    >
      <div className="flex flex-col gap-8 items-center">
        
        {/* Visualization Area */}
        <div className="w-full bg-slate-800 rounded-2xl p-8 min-h-[300px] flex flex-col justify-between relative overflow-hidden border border-slate-700">
          
          {/* Background decor */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-20" />

          {/* Context Window Visualization */}
          <div className="flex-1 flex items-center justify-center flex-wrap content-center gap-2 mb-8 z-10">
            {sentence.split(' ').map((word, i) => (
               <span key={i} className="text-2xl md:text-4xl font-mono text-white animate-float-up bg-slate-700/50 px-2 py-1 rounded">
                 {word}
               </span>
            ))}
            <span className="w-3 h-8 bg-emerald-500 animate-pulse ml-1"></span>
          </div>

          {/* Candidates Bubbles */}
          <div className="h-32 flex justify-center items-end gap-4 relative z-10">
            {isThinking ? (
               <div className="text-slate-400 italic flex items-center gap-2">
                 <RefreshCw className="w-5 h-5 animate-spin" /> Calculating probabilities...
               </div>
            ) : (
              candidates.map((cand, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTokenClick(cand.word)}
                  className="group relative flex flex-col items-center transition-all hover:-translate-y-2 focus:outline-none"
                >
                  {/* Probability Bar */}
                  <div className="w-2 bg-slate-700 h-20 rounded-full mb-2 overflow-hidden relative">
                    <div 
                      className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all duration-1000"
                      style={{ height: `${cand.probability * 100}%` }}
                    />
                  </div>
                  
                  {/* Bubble */}
                  <div className={`
                    px-6 py-3 rounded-full text-lg font-bold shadow-lg border-2
                    ${idx === 0 ? 'bg-emerald-600 border-emerald-400 text-white scale-110 shadow-emerald-900/50' : 'bg-slate-700 border-slate-500 text-slate-200 hover:bg-slate-600'}
                  `}>
                    {cand.word}
                  </div>
                  
                  <span className="text-xs text-slate-500 mt-2 font-mono">{(cand.probability * 100).toFixed(0)}%</span>
                </button>
              ))
            )}
          </div>

          {/* Robot Helper */}
          <div className="absolute bottom-4 right-4 opacity-50">
             <RobotAvatar mood={isThinking ? RobotMood.THINKING : RobotMood.NEUTRAL} className="w-16 h-16" />
          </div>
        </div>

        {/* Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-xl font-bold text-emerald-400 mb-2 flex items-center gap-2">
                <Play className="w-5 h-5" /> How it works
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Imagine you are playing a guessing game. If I say <span className="text-white font-bold">"Peanut Butter and..."</span>, your brain instantly yells <span className="text-white font-bold">"Jelly!"</span>. 
                That is exactly what an LLM does. It looks at the <b>Past Tokens</b> (words) and calculates the probability of every word in its vocabulary to be the <b>Next Token</b>.
              </p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col justify-center items-center text-center">
              <p className="text-slate-400 mb-4">Want to start a new sentence?</p>
              <button 
                onClick={reset}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Reset Context
              </button>
            </div>
        </div>

      </div>
    </LessonContainer>
  );
};