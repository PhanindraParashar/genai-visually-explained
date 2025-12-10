import React, { useState } from 'react';
import { LessonContainer } from '../LessonContainer';
import { Target, Hash, Brain, Calculator, Search, ArrowRight, MousePointer2, Move, Ruler, BarChart3, Network } from 'lucide-react';

// --- DATA FOR NEURAL EMBEDDINGS ---
interface DataPoint {
  id: string;
  label: string;
  x: number; // 0-100 coordinate
  y: number; // 0-100 coordinate
  category: 'tech' | 'food' | 'animal' | 'royal';
}

const VECTORS: DataPoint[] = [
  // Tech Cluster (Top Right)
  { id: '1', label: 'Computer', x: 75, y: 15, category: 'tech' },
  { id: '2', label: 'Code', x: 82, y: 22, category: 'tech' },
  { id: '3', label: 'AI', x: 78, y: 12, category: 'tech' },
  { id: '4', label: 'Algorithm', x: 85, y: 18, category: 'tech' },

  // Food Cluster (Bottom Left)
  { id: '5', label: 'Pizza', x: 15, y: 80, category: 'food' },
  { id: '6', label: 'Burger', x: 22, y: 85, category: 'food' },
  { id: '7', label: 'Pasta', x: 12, y: 75, category: 'food' },

  // Animal Cluster (Top Left)
  { id: '8', label: 'Cat', x: 15, y: 20, category: 'animal' },
  { id: '9', label: 'Dog', x: 22, y: 25, category: 'animal' },
  { id: '10', label: 'Kitten', x: 12, y: 15, category: 'animal' },
  { id: '11', label: 'Puppy', x: 25, y: 18, category: 'animal' },

  // Royalty (Middle - for math)
  { id: '12', label: 'King', x: 45, y: 45, category: 'royal' },
  { id: '13', label: 'Man', x: 35, y: 55, category: 'royal' },
  { id: '14', label: 'Queen', x: 65, y: 45, category: 'royal' },
  { id: '15', label: 'Woman', x: 55, y: 55, category: 'royal' },
];

// --- DATA FOR STATS (TF) EMBEDDINGS ---
const TF_DOCS = [
  { id: 'A', text: "The cat runs", vector: { the: 1, cat: 1, runs: 1, dog: 0, pie: 0 } },
  { id: 'B', text: "The dog runs", vector: { the: 1, cat: 0, runs: 1, dog: 1, pie: 0 } },
  { id: 'C', text: "Apple pie recipe", vector: { the: 0, cat: 0, runs: 0, dog: 0, pie: 1 } },
];

export const Embeddings: React.FC = () => {
  const [mode, setMode] = useState<'stats' | 'neural'>('stats');
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);
  const [showVectorMath, setShowVectorMath] = useState(false);

  // Helper to get distance between points (Euclidean)
  const getDistance = (p1: DataPoint, p2: DataPoint) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  return (
    <LessonContainer
      title="Embeddings: Text to Numbers"
      subtitle="Computers can't read. They only understand numbers. Embeddings translate words into lists of numbers (vectors) so we can do math with meaning."
    >
      <div className="flex flex-col gap-8">

        {/* Mode Toggles */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setMode('stats')}
            className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${mode === 'stats' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            <BarChart3 className="w-5 h-5" /> Old School (Word Count)
          </button>
          <button
            onClick={() => setMode('neural')}
            className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${mode === 'neural' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            <Network className="w-5 h-5" /> Modern (Neural Vectors)
          </button>
        </div>

        {/* ----------------- STATS MODE (Pre-DL) ----------------- */}
        {mode === 'stats' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Document Visualizer */}
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Hash className="w-5 h-5 text-blue-400" /> The "Bag of Words" Approach
                </h3>
                <p className="text-slate-400 mb-6 text-sm">
                  Before Deep Learning, we converted text to numbers simply by counting words. 
                  If documents share the same words, they are "similar".
                </p>

                <div className="space-y-4">
                  {TF_DOCS.map((doc, i) => (
                    <div key={doc.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-white bg-slate-700 px-2 py-0.5 rounded text-xs">Doc {doc.id}</span>
                        <span className="text-slate-300 italic">"{doc.text}"</span>
                      </div>
                      <div className="flex gap-1 overflow-x-auto">
                        {Object.entries(doc.vector).map(([word, count]) => (
                          <div key={word} className={`px-2 py-1 rounded text-xs font-mono border ${count > 0 ? 'bg-blue-900/30 border-blue-500/50 text-blue-300' : 'bg-slate-800/30 border-slate-800 text-slate-600'}`}>
                            {word}: {count}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparison Logic */}
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col justify-center">
                <h3 className="text-lg font-bold text-white mb-4">Similarity Score</h3>
                <div className="space-y-6">
                  
                  {/* Match A & B */}
                  <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl">
                    <div className="flex justify-between font-bold text-emerald-400 mb-2">
                      <span>Doc A vs Doc B</span>
                      <span>High Similarity</span>
                    </div>
                    <p className="text-xs text-emerald-200/70 mb-2">
                      Shared words: <span className="bg-emerald-900/50 px-1 rounded">the</span>, <span className="bg-emerald-900/50 px-1 rounded">runs</span>
                    </p>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 w-[70%] h-full"></div>
                    </div>
                  </div>

                  {/* Match A & C */}
                  <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-xl">
                    <div className="flex justify-between font-bold text-red-400 mb-2">
                      <span>Doc A vs Doc C</span>
                      <span>Zero Similarity</span>
                    </div>
                    <p className="text-xs text-red-200/70 mb-2">
                      No shared words found.
                    </p>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-500 w-[5%] h-full"></div>
                    </div>
                  </div>

                </div>
                <div className="mt-6 text-xs text-slate-500 italic">
                  * Limitation: This method doesn't know that "Dog" and "Cat" are both animals. It just treats them as different words.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ----------------- NEURAL MODE (Deep Learning) ----------------- */}
        {mode === 'neural' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visualization Canvas */}
                <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-700 p-6 relative h-[500px] overflow-hidden select-none">
                  <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur border border-slate-700 px-3 py-1 rounded-full text-xs text-slate-400 flex items-center gap-2">
                    <Move className="w-3 h-3" /> 2D Projection of Semantic Space
                  </div>

                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <defs>
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#grid)" />

                    {/* Connection Lines (when hovering) */}
                    {selectedPoint && VECTORS.map(pt => {
                       const dist = getDistance(selectedPoint, pt);
                       if (pt.id === selectedPoint.id) return null;
                       // Only draw lines to close neighbors
                       if (dist > 30) return null;
                       
                       const opacity = 1 - (dist / 30);
                       return (
                         <line 
                           key={pt.id}
                           x1={selectedPoint.x} y1={selectedPoint.y}
                           x2={pt.x} y2={pt.y}
                           stroke={selectedPoint.category === pt.category ? '#3b82f6' : '#64748b'}
                           strokeWidth="0.2"
                           strokeOpacity={opacity}
                         />
                       );
                    })}

                    {/* Vector Math Lines */}
                    {showVectorMath && (
                      <>
                        {/* King to Man */}
                        <line x1="45" y1="45" x2="35" y2="55" stroke="#eab308" strokeWidth="0.5" strokeDasharray="2" markerEnd="url(#arrow)" />
                        {/* Queen to Woman */}
                        <line x1="65" y1="45" x2="55" y2="55" stroke="#eab308" strokeWidth="0.5" strokeDasharray="2" markerEnd="url(#arrow)" />
                        {/* King to Queen */}
                        <line x1="45" y1="45" x2="65" y2="45" stroke="#a855f7" strokeWidth="0.5" strokeDasharray="2" />
                      </>
                    )}

                    {/* Points */}
                    {VECTORS.map(pt => {
                      const isSelected = selectedPoint?.id === pt.id;
                      const isRelated = selectedPoint && getDistance(selectedPoint, pt) < 30;
                      
                      let fillColor = '#94a3b8'; // default slate
                      if (pt.category === 'tech') fillColor = '#3b82f6'; // blue
                      if (pt.category === 'food') fillColor = '#ef4444'; // red
                      if (pt.category === 'animal') fillColor = '#10b981'; // green
                      if (pt.category === 'royal') fillColor = '#a855f7'; // purple

                      return (
                        <g 
                          key={pt.id} 
                          onClick={() => setSelectedPoint(pt)}
                          className="cursor-pointer transition-all duration-300"
                        >
                          <circle 
                            cx={pt.x} cy={pt.y} 
                            r={isSelected ? 3 : 1.5} 
                            fill={fillColor}
                            opacity={selectedPoint && !isRelated && !isSelected ? 0.2 : 1}
                            className="transition-all duration-300 ease-out"
                          />
                          <text 
                            x={pt.x} y={pt.y - 3} 
                            fontSize="3" 
                            textAnchor="middle" 
                            fill={fillColor}
                            opacity={selectedPoint && !isRelated && !isSelected ? 0.2 : 1}
                            fontWeight={isSelected ? 'bold' : 'normal'}
                            className="pointer-events-none"
                          >
                            {pt.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Math Toggle Overlay */}
                   <div className="absolute bottom-4 right-4">
                     <button
                       onClick={() => {
                          setShowVectorMath(!showVectorMath);
                          setSelectedPoint(null);
                       }}
                       className={`px-4 py-2 rounded-lg text-xs font-bold border flex items-center gap-2 ${showVectorMath ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
                     >
                       <Calculator className="w-3 h-3" /> 
                       Vector Math Demo
                     </button>
                   </div>
                </div>

                {/* Info Panel */}
                <div className="flex flex-col gap-4">
                   <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex-1">
                      {!selectedPoint && !showVectorMath && (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 gap-3">
                          <MousePointer2 className="w-8 h-8 opacity-50 animate-bounce" />
                          <p>Click a word to see its neighbors.</p>
                        </div>
                      )}

                      {selectedPoint && (
                        <div className="animate-in fade-in zoom-in-95 duration-200">
                          <h4 className="text-xl font-bold text-white mb-1" style={{ color: selectedPoint.category === 'tech' ? '#60a5fa' : selectedPoint.category === 'food' ? '#f87171' : selectedPoint.category === 'royal' ? '#c084fc' : '#34d399' }}>
                            {selectedPoint.label}
                          </h4>
                          <span className="text-xs font-mono bg-slate-900 px-2 py-1 rounded text-slate-400">
                            Vector: [{selectedPoint.x.toFixed(2)}, {selectedPoint.y.toFixed(2)}]
                          </span>
                          
                          <div className="mt-6 space-y-3">
                            <div className="text-xs font-bold uppercase text-slate-500 mb-2">Nearest Neighbors</div>
                            {VECTORS
                              .filter(p => p.id !== selectedPoint.id)
                              .map(p => ({ ...p, dist: getDistance(selectedPoint, p) }))
                              .sort((a, b) => a.dist - b.dist)
                              .slice(0, 3)
                              .map(neighbor => (
                                <div key={neighbor.id} className="flex justify-between items-center bg-slate-900/50 p-2 rounded border border-slate-700/50">
                                  <span className="text-sm text-slate-200">{neighbor.label}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-blue-500" 
                                        style={{ width: `${Math.max(0, 100 - neighbor.dist * 2)}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-xs font-mono text-slate-500">
                                      {(100 - neighbor.dist).toFixed(0)}%
                                    </span>
                                  </div>
                                </div>
                              ))
                            }
                          </div>
                          <p className="mt-6 text-xs text-slate-400 italic leading-relaxed">
                             Notice how "{selectedPoint.label}" is mathematically close to other {selectedPoint.category} words? 
                             The AI knows they are related because they appear in similar contexts in training data.
                          </p>
                        </div>
                      )}

                      {showVectorMath && (
                         <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                           <h4 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                             <Calculator className="w-5 h-5" /> Semantic Math
                           </h4>
                           <div className="bg-slate-900 p-4 rounded-xl border border-purple-500/30 text-center space-y-2 font-mono text-sm">
                              <div className="text-slate-300">King <span className="text-slate-500">({'{45, 45}'})</span></div>
                              <div className="text-red-400 font-bold">- Man <span className="text-red-900/50 font-normal">({'{35, 55}'})</span></div>
                              <div className="text-emerald-400 font-bold">+ Woman <span className="text-emerald-900/50 font-normal">({'{55, 55}'})</span></div>
                              <div className="h-px bg-slate-700 my-2"></div>
                              <div className="text-purple-400 font-bold text-lg animate-pulse">≈ Queen</div>
                           </div>
                           <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                             Because these concepts are directions in space, we can do math! 
                             Subtracting "Man" from "King" removes the male concept, leaving "Royalty". 
                             Adding "Woman" adds female concept -> "Queen".
                           </p>
                         </div>
                      )}
                   </div>
                </div>

             </div>

          </div>
        )}

      </div>
    </LessonContainer>
  );
};
