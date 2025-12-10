import React, { useState, useEffect } from 'react';
import { LessonContainer } from '../LessonContainer';
import { TokenCandidate, RobotMood } from '../../types';
import { RobotAvatar } from '../RobotAvatar';
import { RefreshCw, Play, Sparkles, TreePine } from 'lucide-react';

// Realistic probability tree - words lead to contextually appropriate next words
const PROBABILITY_TREE: Record<string, { word: string; baseProb: number }[]> = {
  // Starting words
  'the': [
    { word: 'cat', baseProb: 0.25 },
    { word: 'dog', baseProb: 0.22 },
    { word: 'patient', baseProb: 0.18 },
    { word: 'stock', baseProb: 0.15 },
    { word: 'weather', baseProb: 0.12 }
  ],
  // Pet context
  'cat': [
    { word: 'sat', baseProb: 0.35 },
    { word: 'meowed', baseProb: 0.25 },
    { word: 'jumped', baseProb: 0.20 },
    { word: 'purred', baseProb: 0.12 },
    { word: 'slept', baseProb: 0.08 }
  ],
  'dog': [
    { word: 'barked', baseProb: 0.30 },
    { word: 'ran', baseProb: 0.25 },
    { word: 'wagged', baseProb: 0.20 },
    { word: 'fetched', baseProb: 0.15 },
    { word: 'played', baseProb: 0.10 }
  ],
  'sat': [
    { word: 'on', baseProb: 0.45 },
    { word: 'quietly', baseProb: 0.25 },
    { word: 'beside', baseProb: 0.18 },
    { word: 'near', baseProb: 0.12 }
  ],
  'on': [
    { word: 'the', baseProb: 0.50 },
    { word: 'a', baseProb: 0.25 },
    { word: 'my', baseProb: 0.15 },
    { word: 'her', baseProb: 0.10 }
  ],
  'barked': [
    { word: 'loudly', baseProb: 0.35 },
    { word: 'at', baseProb: 0.30 },
    { word: 'happily', baseProb: 0.20 },
    { word: 'excitedly', baseProb: 0.15 }
  ],
  'ran': [
    { word: 'quickly', baseProb: 0.30 },
    { word: 'across', baseProb: 0.25 },
    { word: 'towards', baseProb: 0.25 },
    { word: 'away', baseProb: 0.20 }
  ],
  'meowed': [
    { word: 'softly', baseProb: 0.35 },
    { word: 'loudly', baseProb: 0.25 },
    { word: 'for', baseProb: 0.25 },
    { word: 'hungrily', baseProb: 0.15 }
  ],
  'jumped': [
    { word: 'over', baseProb: 0.40 },
    { word: 'onto', baseProb: 0.30 },
    { word: 'high', baseProb: 0.18 },
    { word: 'gracefully', baseProb: 0.12 }
  ],
  // Medical context
  'patient': [
    { word: 'reported', baseProb: 0.30 },
    { word: 'experienced', baseProb: 0.25 },
    { word: 'was', baseProb: 0.22 },
    { word: 'showed', baseProb: 0.15 },
    { word: 'needed', baseProb: 0.08 }
  ],
  'reported': [
    { word: 'symptoms', baseProb: 0.35 },
    { word: 'chest', baseProb: 0.25 },
    { word: 'fever', baseProb: 0.22 },
    { word: 'pain', baseProb: 0.18 }
  ],
  'symptoms': [
    { word: 'including', baseProb: 0.40 },
    { word: 'of', baseProb: 0.30 },
    { word: 'such', baseProb: 0.18 },
    { word: 'like', baseProb: 0.12 }
  ],
  'experienced': [
    { word: 'headaches', baseProb: 0.28 },
    { word: 'dizziness', baseProb: 0.25 },
    { word: 'nausea', baseProb: 0.25 },
    { word: 'fatigue', baseProb: 0.22 }
  ],
  // Finance context
  'stock': [
    { word: 'market', baseProb: 0.45 },
    { word: 'price', baseProb: 0.25 },
    { word: 'rose', baseProb: 0.18 },
    { word: 'fell', baseProb: 0.12 }
  ],
  'market': [
    { word: 'crashed', baseProb: 0.22 },
    { word: 'rallied', baseProb: 0.22 },
    { word: 'opened', baseProb: 0.20 },
    { word: 'volatility', baseProb: 0.18 },
    { word: 'trends', baseProb: 0.18 }
  ],
  'price': [
    { word: 'increased', baseProb: 0.30 },
    { word: 'dropped', baseProb: 0.28 },
    { word: 'remained', baseProb: 0.22 },
    { word: 'surged', baseProb: 0.20 }
  ],
  // Weather context
  'weather': [
    { word: 'forecast', baseProb: 0.35 },
    { word: 'today', baseProb: 0.25 },
    { word: 'is', baseProb: 0.22 },
    { word: 'will', baseProb: 0.18 }
  ],
  'forecast': [
    { word: 'predicts', baseProb: 0.35 },
    { word: 'shows', baseProb: 0.28 },
    { word: 'indicates', baseProb: 0.22 },
    { word: 'suggests', baseProb: 0.15 }
  ],
  // Common continuation words
  'loudly': [
    { word: 'at', baseProb: 0.35 },
    { word: 'and', baseProb: 0.30 },
    { word: 'while', baseProb: 0.20 },
    { word: 'until', baseProb: 0.15 }
  ],
  'softly': [
    { word: 'at', baseProb: 0.30 },
    { word: 'and', baseProb: 0.28 },
    { word: 'in', baseProb: 0.22 },
    { word: 'near', baseProb: 0.20 }
  ],
  'at': [
    { word: 'the', baseProb: 0.45 },
    { word: 'a', baseProb: 0.25 },
    { word: 'her', baseProb: 0.18 },
    { word: 'his', baseProb: 0.12 }
  ],
  'quickly': [
    { word: 'towards', baseProb: 0.30 },
    { word: 'and', baseProb: 0.28 },
    { word: 'to', baseProb: 0.22 },
    { word: 'through', baseProb: 0.20 }
  ],
  'across': [
    { word: 'the', baseProb: 0.50 },
    { word: 'a', baseProb: 0.25 },
    { word: 'my', baseProb: 0.15 },
    { word: 'our', baseProb: 0.10 }
  ],
  'over': [
    { word: 'the', baseProb: 0.45 },
    { word: 'a', baseProb: 0.28 },
    { word: 'my', baseProb: 0.15 },
    { word: 'her', baseProb: 0.12 }
  ],
  'onto': [
    { word: 'the', baseProb: 0.45 },
    { word: 'a', baseProb: 0.28 },
    { word: 'my', baseProb: 0.15 },
    { word: 'her', baseProb: 0.12 }
  ],
  // Additional common words
  'a': [
    { word: 'warm', baseProb: 0.22 },
    { word: 'soft', baseProb: 0.22 },
    { word: 'cozy', baseProb: 0.20 },
    { word: 'sunny', baseProb: 0.18 },
    { word: 'quiet', baseProb: 0.18 }
  ],
  'my': [
    { word: 'lap', baseProb: 0.28 },
    { word: 'bed', baseProb: 0.25 },
    { word: 'chair', baseProb: 0.25 },
    { word: 'desk', baseProb: 0.22 }
  ],
  'warm': [
    { word: 'blanket', baseProb: 0.35 },
    { word: 'spot', baseProb: 0.28 },
    { word: 'bed', baseProb: 0.22 },
    { word: 'place', baseProb: 0.15 }
  ],
  'soft': [
    { word: 'pillow', baseProb: 0.32 },
    { word: 'blanket', baseProb: 0.28 },
    { word: 'cushion', baseProb: 0.22 },
    { word: 'rug', baseProb: 0.18 }
  ],
  'cozy': [
    { word: 'corner', baseProb: 0.35 },
    { word: 'spot', baseProb: 0.30 },
    { word: 'bed', baseProb: 0.20 },
    { word: 'nook', baseProb: 0.15 }
  ]
};

// Default fallback for unknown words
const DEFAULT_CANDIDATES = [
  { word: 'and', baseProb: 0.25 },
  { word: 'the', baseProb: 0.22 },
  { word: 'is', baseProb: 0.20 },
  { word: 'was', baseProb: 0.18 },
  { word: 'with', baseProb: 0.15 }
];

// Add realistic randomness to probabilities
const addNoise = (baseProb: number): number => {
  const noise = (Math.random() - 0.5) * 0.15; // ±7.5% variation
  return Math.max(0.05, Math.min(0.95, baseProb + noise));
};

const getNextTokens = (sentence: string): TokenCandidate[] => {
  const words = sentence.trim().toLowerCase().split(' ');
  const lastWord = words[words.length - 1] || 'the';
  
  let candidates = PROBABILITY_TREE[lastWord] || DEFAULT_CANDIDATES;
  
  // Add noise and shuffle slightly
  const noisyCandidates = candidates.map(c => ({
    word: c.word,
    probability: addNoise(c.baseProb)
  }));
  
  // Sort by probability descending
  noisyCandidates.sort((a, b) => b.probability - a.probability);
  
  // Normalize to ensure reasonable sum
  const total = noisyCandidates.reduce((sum, c) => sum + c.probability, 0);
  const normalized = noisyCandidates.map(c => ({
    word: c.word,
    probability: c.probability / total * 0.9 // Keep sum around 90%
  }));
  
  return normalized.slice(0, 4);
};

export const Predictor: React.FC = () => {
  const [sentence, setSentence] = useState<string>("The");
  const [candidates, setCandidates] = useState<TokenCandidate[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [wordHistory, setWordHistory] = useState<string[]>(['The']);

  useEffect(() => {
    updateCandidates("The");
  }, []);

  const updateCandidates = (text: string) => {
    setIsThinking(true);
    setTimeout(() => {
      const tokens = getNextTokens(text);
      setCandidates(tokens);
      setIsThinking(false);
    }, 500);
  };

  const handleTokenClick = (word: string) => {
    const newSentence = sentence + " " + word;
    setSentence(newSentence);
    setWordHistory(prev => [...prev, word]);
    updateCandidates(newSentence);
  };

  const reset = () => {
    setSentence("The");
    setWordHistory(['The']);
    updateCandidates("The");
  };

  // Determine context type for visual feedback
  const getContextType = () => {
    const lower = sentence.toLowerCase();
    if (lower.includes('cat') || lower.includes('dog')) return 'pet';
    if (lower.includes('patient') || lower.includes('symptoms')) return 'medical';
    if (lower.includes('stock') || lower.includes('market')) return 'finance';
    if (lower.includes('weather')) return 'weather';
    return 'neutral';
  };

  const contextType = getContextType();
  const contextColors = {
    pet: 'from-amber-500 to-orange-500',
    medical: 'from-blue-500 to-cyan-500',
    finance: 'from-green-500 to-emerald-500',
    weather: 'from-purple-500 to-indigo-500',
    neutral: 'from-emerald-500 to-teal-500'
  };

  return (
    <LessonContainer 
      title="The Prediction Game" 
      subtitle="LLMs don't 'know' things - they predict what word comes next based on context. Build a sentence and watch probabilities shift!"
    >
      <div className="flex flex-col gap-8 items-center">
        
        {/* Context Indicator */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-400">Context detected:</span>
          <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${contextColors[contextType as keyof typeof contextColors]} text-white font-semibold capitalize`}>
            {contextType === 'pet' ? '🐾 Pets' : 
             contextType === 'medical' ? '🏥 Medical' :
             contextType === 'finance' ? '📈 Finance' :
             contextType === 'weather' ? '🌤️ Weather' : '✨ General'}
          </span>
        </div>

        {/* Main Visualization Area */}
        <div className="w-full bg-slate-800/80 backdrop-blur rounded-2xl p-8 min-h-[350px] flex flex-col justify-between relative overflow-hidden border border-slate-700/50 shadow-2xl">
          
          {/* Animated gradient border */}
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${contextColors[contextType as keyof typeof contextColors]} opacity-60`} />
          
          {/* Word History Path Visualization */}
          <div className="absolute top-4 left-4 flex items-center gap-1 text-xs text-slate-500">
            <TreePine className="w-4 h-4" />
            <span>Path: {wordHistory.length} tokens</span>
          </div>

          {/* Sentence Display */}
          <div className="flex-1 flex items-center justify-center flex-wrap content-center gap-2 mb-8 z-10 py-4">
            {sentence.split(' ').map((word, i) => (
               <span 
                 key={i} 
                 className="text-2xl md:text-4xl font-mono text-white bg-slate-700/60 px-3 py-2 rounded-lg border border-slate-600/50 shadow-lg"
                 style={{ 
                   animation: `float-up 0.4s ease-out forwards`,
                   animationDelay: `${i * 0.05}s`
                 }}
               >
                 {word}
               </span>
            ))}
            <span className="w-3 h-10 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded animate-pulse ml-2 shadow-lg shadow-emerald-500/30"></span>
          </div>

          {/* Probability Candidates */}
          <div className="h-40 flex justify-center items-end gap-5 relative z-10">
            {isThinking ? (
               <div className="text-slate-400 italic flex items-center gap-3 text-lg">
                 <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" /> 
                 <span>Calculating probabilities...</span>
               </div>
            ) : (
              candidates.map((cand, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTokenClick(cand.word)}
                  className="group relative flex flex-col items-center transition-all duration-300 hover:-translate-y-3 focus:outline-none"
                  style={{ 
                    animation: `float-up 0.5s ease-out forwards`,
                    animationDelay: `${idx * 0.1}s`
                  }}
                >
                  {/* Probability Bar */}
                  <div className="w-3 bg-slate-700/80 h-24 rounded-full mb-3 overflow-hidden relative shadow-inner">
                    <div 
                      className={`absolute bottom-0 left-0 w-full bg-gradient-to-t ${idx === 0 ? 'from-emerald-600 to-emerald-400' : idx === 1 ? 'from-teal-600 to-teal-400' : 'from-slate-500 to-slate-400'} transition-all duration-700 ease-out`}
                      style={{ height: `${cand.probability * 100}%` }}
                    />
                  </div>
                  
                  {/* Word Bubble */}
                  <div className={`
                    px-5 py-3 rounded-xl text-lg font-bold shadow-xl border-2 transition-all duration-200 group-hover:scale-105
                    ${idx === 0 
                      ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 border-emerald-400 text-white scale-110 shadow-emerald-900/50' 
                      : idx === 1 
                        ? 'bg-gradient-to-br from-teal-600 to-teal-700 border-teal-400 text-white shadow-teal-900/30'
                        : 'bg-slate-700 border-slate-500 text-slate-200 hover:bg-slate-600'}
                  `}>
                    {cand.word}
                    {idx === 0 && <Sparkles className="w-4 h-4 inline ml-2 text-yellow-300" />}
                  </div>
                  
                  <span className={`text-sm mt-2 font-mono ${idx === 0 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                    {(cand.probability * 100).toFixed(1)}%
                  </span>
                </button>
              ))
            )}
          </div>

          {/* Robot Helper */}
          <div className="absolute bottom-4 right-4 opacity-60 hover:opacity-100 transition-opacity">
             <RobotAvatar mood={isThinking ? RobotMood.THINKING : RobotMood.NEUTRAL} className="w-16 h-16" />
          </div>
        </div>

        {/* Explanation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="bg-slate-800/60 backdrop-blur p-6 rounded-xl border border-slate-700/50 shadow-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-3 flex items-center gap-2">
                <Play className="w-5 h-5" /> How the Probability Tree Works
              </h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                Notice how probabilities change based on context! After <span className="text-white font-bold">"The cat"</span>, 
                words like <span className="text-amber-400">"sat"</span> and <span className="text-amber-400">"meowed"</span> become highly probable.
                But after <span className="text-white font-bold">"The patient"</span>, medical terms like 
                <span className="text-blue-400"> "reported"</span> and <span className="text-blue-400">"symptoms"</span> rise to the top.
              </p>
              <div className="bg-slate-900/50 p-3 rounded-lg text-sm text-slate-400 border border-slate-700/50">
                💡 <strong>Try it:</strong> Build sentences in different domains (pets, medicine, finance) and watch how the AI "context shifts"!
              </div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur p-6 rounded-xl border border-slate-700/50 shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Why Random Variation?</h3>
                <p className="text-slate-400 mb-4 text-sm">
                  Real LLMs have "temperature" - a setting that adds controlled randomness. 
                  This is why the same prompt can give different outputs! 
                  The slight probability shifts you see simulate this behavior.
                </p>
              </div>
              <button 
                onClick={reset}
                className="px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white rounded-xl flex items-center justify-center gap-2 transition-all font-semibold shadow-lg"
              >
                <RefreshCw className="w-5 h-5" /> Start New Sentence
              </button>
            </div>
        </div>

      </div>
    </LessonContainer>
  );
};