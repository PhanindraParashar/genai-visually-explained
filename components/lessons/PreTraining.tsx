import React, { useEffect, useState } from 'react';
import { LessonContainer } from '../LessonContainer';
import { Book, FileText, Globe, Database, Brain } from 'lucide-react';

export const PreTraining: React.FC = () => {
  const [knowledgeLevel, setKnowledgeLevel] = useState(0);
  const [absorbedItems, setAbsorbedItems] = useState<number>(0);

  // Auto-increment knowledge slightly to simulate constant learning
  useEffect(() => {
    const interval = setInterval(() => {
      setAbsorbedItems(prev => prev + 1);
      setKnowledgeLevel(prev => Math.min(prev + 0.5, 100));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <LessonContainer
      title="The Library Machine"
      subtitle="Before an AI can chat, it has to read. A LOT. This is called Pre-Training."
    >
      <div className="flex flex-col gap-8">
        
        {/* Animation Stage */}
        <div className="relative w-full h-80 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 flex items-center justify-center">
          
          {/* The Stream of Data (Background Animation) */}
          <div className="absolute inset-0 flex flex-col justify-around opacity-30 pointer-events-none">
             {[...Array(5)].map((_, i) => (
               <div key={i} className="flex gap-12 whitespace-nowrap animate-slide-across" style={{ animationDuration: `${5 + i}s` }}>
                 <div className="flex items-center gap-2"><Book className="w-6 h-6" /> Wikipedia</div>
                 <div className="flex items-center gap-2"><Globe className="w-6 h-6" /> The Entire Internet</div>
                 <div className="flex items-center gap-2"><FileText className="w-6 h-6" /> Research Papers</div>
                 <div className="flex items-center gap-2"><Database className="w-6 h-6" /> GitHub Code</div>
                 <div className="flex items-center gap-2"><Book className="w-6 h-6" /> Harry Potter</div>
                 <div className="flex items-center gap-2"><Globe className="w-6 h-6" /> Reddit Threads</div>
               </div>
             ))}
          </div>

          {/* The Robot Brain Center */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-32 h-32 bg-slate-900 rounded-full border-4 border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.5)] flex items-center justify-center relative">
               <Brain className={`w-16 h-16 text-blue-400 ${knowledgeLevel > 50 ? 'animate-pulse' : ''}`} />
               
               {/* Particles flying in */}
               <div className="absolute inset-0 animate-spin-slow">
                 <div className="absolute top-0 left-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                 <div className="absolute bottom-0 right-1/2 w-2 h-2 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '0.5s'}}></div>
               </div>
            </div>
            
            <div className="mt-6 w-64 bg-slate-900 rounded-full h-4 overflow-hidden border border-slate-700">
               <div 
                 className="bg-gradient-to-r from-blue-600 to-purple-500 h-full transition-all duration-300" 
                 style={{ width: `${knowledgeLevel}%` }}
               />
            </div>
            <p className="mt-2 text-slate-400 font-mono text-sm">
              Patterns Learned: {Math.floor(absorbedItems * 1245).toLocaleString()}
            </p>
          </div>

        </div>

        {/* Narrative Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 p-6 rounded-xl border-l-4 border-blue-500">
            <h3 className="font-bold text-lg text-white mb-2">1. Massive Data</h3>
            <p className="text-slate-400 text-sm">The model reads almost everything on the public internet. It sees how humans use language in every possible context.</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-xl border-l-4 border-purple-500">
            <h3 className="font-bold text-lg text-white mb-2">2. Pattern Recognition</h3>
            <p className="text-slate-400 text-sm">It doesn't "memorize" facts like a database. It learns shapes. "King" is to "Queen" as "Man" is to "Woman".</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-xl border-l-4 border-green-500">
            <h3 className="font-bold text-lg text-white mb-2">3. The Base Model</h3>
            <p className="text-slate-400 text-sm">After pre-training, the model is smart but chaotic. If you ask "What is the capital of France?", it might reply "And what is the capital of Germany?" because it's just predicting lists.</p>
          </div>
        </div>

      </div>
    </LessonContainer>
  );
};