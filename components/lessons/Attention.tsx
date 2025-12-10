import React, { useState } from 'react';
import { LessonContainer } from '../LessonContainer';
import { Eye, Info, MousePointer2 } from 'lucide-react';

const PARAGRAPH = [
  "The", "animal", "didn't", "cross", "the", "street", "because", "it", "was", "too", "tired", "."
];

// Realistic Attention Map (Winograd Schema style)
// "it" (idx 7) -> refers to "animal" (idx 1) because of adjective "tired" (idx 10)
// If the sentence ended "too wide", "it" would refer to "street".
const ATTENTION_WEIGHTS: Record<number, Record<number, number>> = {
  1: { 10: 0.6 }, // Animal relates to tired
  3: { 5: 0.8 }, // Cross -> Street
  7: { 1: 0.95, 5: 0.1, 10: 0.8 }, // "It" strongly attends to "Animal" and "Tired"
  10: { 1: 0.7, 7: 0.8 } // Tired relates back to Animal and It
};

export const Attention: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getStyle = (idx: number) => {
    if (hoveredIndex === null) return 'opacity-100 text-slate-300';
    if (idx === hoveredIndex) return 'opacity-100 scale-110 font-bold text-white bg-blue-600 rounded px-2 shadow-xl z-20 transform -translate-y-1';

    const weights = ATTENTION_WEIGHTS[hoveredIndex];
    const weight = weights ? weights[idx] : 0;

    if (weight > 0.8) return 'bg-yellow-500 text-black font-bold rounded px-1 shadow-[0_0_20px_rgba(234,179,8,0.8)] scale-105 z-10 transition-all duration-300';
    if (weight > 0.5) return 'bg-yellow-500/60 text-white rounded px-1 shadow-[0_0_10px_rgba(234,179,8,0.4)]';
    if (weight > 0.1) return 'bg-yellow-500/20 text-slate-200 rounded px-1';
    
    return 'opacity-20 blur-[1px] scale-90 grayscale';
  };

  return (
    <LessonContainer
      title="The Attention Spotlight"
      subtitle="How does the model understand context? It uses 'Self-Attention' to calculate how much every word relates to every other word."
    >
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-12">
        
        {/* Interactive Area */}
        <div className="bg-slate-900/80 p-10 md:p-16 rounded-3xl border border-slate-700 shadow-2xl relative w-full max-w-5xl overflow-visible backdrop-blur-sm">
          
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-bold flex items-center gap-3 shadow-lg z-30 animate-pulse border border-blue-400">
            <MousePointer2 className="w-5 h-5" /> Hover over "it"
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-8 text-3xl md:text-5xl font-mono cursor-default leading-loose justify-center perspective-1000">
            {PARAGRAPH.map((word, idx) => (
              <span
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`transition-all duration-300 cursor-pointer select-none relative px-1 ${getStyle(idx)}`}
              >
                {word}
                {/* Connector line simplified visualization */}
                {hoveredIndex !== null && ATTENTION_WEIGHTS[hoveredIndex]?.[idx] > 0.8 && (
                   <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-yellow-400 font-sans whitespace-nowrap opacity-100 animate-float-up bg-slate-900/90 px-2 py-1 rounded border border-yellow-500/30">
                     High Relation {(ATTENTION_WEIGHTS[hoveredIndex][idx] * 100).toFixed(0)}%
                   </span>
                )}
              </span>
            ))}
          </div>
          
          {/* Explanation Text for current hover */}
          <div className={`absolute bottom-4 left-0 w-full text-center transition-opacity duration-300 ${hoveredIndex === 7 ? 'opacity-100' : 'opacity-0'}`}>
             <p className="text-sm text-yellow-300 font-bold bg-slate-800/80 inline-block px-4 py-2 rounded-full border border-yellow-500/30">
               Why "it" = "animal"? Because the word "tired" applies more to animals than streets.
             </p>
          </div>
        </div>

        {/* Narrative Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
           <div className="bg-slate-800 p-8 rounded-2xl border-l-4 border-yellow-500 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Eye className="w-24 h-24 text-yellow-500" /></div>
              <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">Connecting Distant Words</h4>
              <p className="text-slate-300 leading-relaxed">
                In a long sentence, related words might be far apart. 
                <br/><br/>
                <i>"The <b>key</b> to the old, rusty, wooden door was <b>lost</b>."</i>
                <br/><br/>
                Attention allows the model to connect <b>key</b> and <b>lost</b> instantly, skipping all the adjectives in the middle.
              </p>
           </div>
           
           <div className="bg-slate-800 p-8 rounded-2xl border-l-4 border-emerald-500 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Info className="w-24 h-24 text-emerald-500" /></div>
              <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">Solving Ambiguity</h4>
              <p className="text-slate-300 leading-relaxed">
                Words like "it", "bank", or "bat" change meaning based on context.
                <br/><br/>
                The model calculates a "Heatmap" (like the glowing words above) for every single word to figure out exactly what it means in <i>this specific sentence</i>.
              </p>
           </div>
        </div>

      </div>
    </LessonContainer>
  );
};