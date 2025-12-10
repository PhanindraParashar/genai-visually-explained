import React, { useState } from 'react';
import { LessonContainer } from '../LessonContainer';
import { Eye } from 'lucide-react';

const SENTENCE = [
  { id: 0, text: "The" },
  { id: 1, text: "huge" },
  { id: 2, text: "red" },
  { id: 3, text: "dragon" },
  { id: 4, text: "breathed" },
  { id: 5, text: "fire" },
  { id: 6, text: "on" },
  { id: 7, text: "the" },
  { id: 8, text: "village" },
  { id: 9, text: "." }
];

// Hardcoded attention map for demonstration
// Key: index of the word hovered. Value: Array of indices that should glow (attention).
// Intensity is implied by existence in array for simplicity.
const ATTENTION_MAP: Record<number, number[]> = {
  3: [1, 2], // Dragon attends to "huge", "red"
  4: [3],    // Breathed attends to "dragon"
  5: [3, 4], // Fire attends to "dragon", "breathed"
  8: [5]     // Village attends to "fire"
};

export const Attention: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getIntensity = (targetIdx: number) => {
    if (hoveredIndex === null) return 'opacity-100';
    if (targetIdx === hoveredIndex) return 'opacity-100 scale-110 text-white font-bold';
    
    const attendedIndices = ATTENTION_MAP[hoveredIndex] || [];
    if (attendedIndices.includes(targetIdx)) {
      return 'opacity-100 text-yellow-400 font-bold shadow-[0_0_15px_rgba(250,204,21,0.5)] bg-yellow-900/30 rounded';
    }
    
    return 'opacity-30 blur-[1px]';
  };

  return (
    <LessonContainer
      title="The Attention Spotlight"
      subtitle="Context matters. When an LLM reads a word, it looks back at specific previous words to understand the meaning."
    >
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        
        <div className="bg-slate-800 p-10 rounded-2xl border border-slate-700 shadow-2xl relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-500 text-slate-900 px-4 py-1 rounded-full font-bold flex items-center gap-2">
            <Eye className="w-4 h-4" /> Hover over a word
          </div>

          <div className="flex flex-wrap gap-3 text-3xl md:text-5xl font-mono cursor-default">
            {SENTENCE.map((word, idx) => (
              <span
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`transition-all duration-300 px-1 ${getIntensity(idx)}`}
              >
                {word.text}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 max-w-2xl text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Why does this matter?</h3>
          <p className="text-slate-400">
            Computers can't "read" linearly like humans. They convert words to math vectors. 
            The <b>Attention Mechanism</b> allows the word "fire" to mathematically connect strongly with "dragon", 
            even if there are other words in between.
          </p>
        </div>

      </div>
    </LessonContainer>
  );
};