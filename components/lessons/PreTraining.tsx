import React, { useEffect, useState, useRef } from 'react';
import { LessonContainer } from '../LessonContainer';
import { Book, FileText, Globe, Database, Brain, Newspaper, Code, MessageSquare, GraduationCap } from 'lucide-react';

// Real-looking text snippets from different sources
const DATA_SOURCES = [
  {
    icon: Book,
    label: 'Wikipedia',
    color: 'text-blue-400',
    samples: [
      '"The mitochondria is the powerhouse of the cell..."',
      '"World War II lasted from 1939 to 1945..."',
      '"Einstein developed the theory of relativity..."',
      '"The Great Wall of China spans over 13,000 miles..."'
    ]
  },
  {
    icon: Globe,
    label: 'Web Pages',
    color: 'text-purple-400',
    samples: [
      '"How to make the perfect chocolate chip cookies..."',
      '"10 tips for better sleep according to experts..."',
      '"Breaking: Stock markets reach all-time highs..."',
      '"Customer review: This product changed my life..."'
    ]
  },
  {
    icon: FileText,
    label: 'Research Papers',
    color: 'text-green-400',
    samples: [
      '"Our findings suggest a correlation between..."',
      '"In this study, we examine the effects of..."',
      '"The experimental results demonstrate that..."',
      '"Abstract: We propose a novel approach to..."'
    ]
  },
  {
    icon: Code,
    label: 'GitHub Code',
    color: 'text-amber-400',
    samples: [
      'function calculateTotal(items) { return items.reduce(...',
      'class NeuralNetwork extends Model { constructor()...',
      'async def fetch_data(url): response = await...',
      'SELECT * FROM users WHERE created_at > ...'
    ]
  },
  {
    icon: Newspaper,
    label: 'News Articles',
    color: 'text-red-400',
    samples: [
      '"Scientists discover new species in deep ocean..."',
      '"Tech giant announces revolutionary AI breakthrough..."',
      '"Global leaders meet to discuss climate change..."',
      '"New study reveals surprising health benefits of..."'
    ]
  },
  {
    icon: MessageSquare,
    label: 'Forums & Reddit',
    color: 'text-orange-400',
    samples: [
      '"Has anyone else experienced this issue with..."',
      '"Unpopular opinion: I think that..."',
      '"ELI5: Why does the sky appear blue?"',
      '"TIL that honey never actually spoils..."'
    ]
  },
  {
    icon: GraduationCap,
    label: 'Textbooks',
    color: 'text-cyan-400',
    samples: [
      '"Chapter 5: Introduction to Calculus..."',
      '"The French Revolution began in 1789 when..."',
      '"In economics, supply and demand determine..."',
      '"DNA replication occurs during the S phase..."'
    ]
  }
];

interface FloatingText {
  id: number;
  text: string;
  source: typeof DATA_SOURCES[0];
  x: number;
  y: number;
  speed: number;
  opacity: number;
}

export const PreTraining: React.FC = () => {
  const [knowledgeLevel, setKnowledgeLevel] = useState(0);
  const [patternsLearned, setPatternsLearned] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [activeSource, setActiveSource] = useState(0);
  const [absorptionPulse, setAbsorptionPulse] = useState(false);
  const idCounter = useRef(0);

  // Generate new floating text periodically
  useEffect(() => {
    const generateText = () => {
      const source = DATA_SOURCES[Math.floor(Math.random() * DATA_SOURCES.length)];
      const sample = source.samples[Math.floor(Math.random() * source.samples.length)];
      
      const newText: FloatingText = {
        id: idCounter.current++,
        text: sample,
        source,
        x: Math.random() * 80 + 10,
        y: -10,
        speed: Math.random() * 1.5 + 0.8,
        opacity: 0.7
      };
      
      setFloatingTexts(prev => [...prev, newText].slice(-12)); // Keep max 12 texts
    };

    const interval = setInterval(generateText, 800);
    return () => clearInterval(interval);
  }, []);

  // Animate floating texts downward
  useEffect(() => {
    const moveTexts = () => {
      setFloatingTexts(prev => 
        prev
          .map(t => ({ ...t, y: t.y + t.speed, opacity: Math.max(0, t.opacity - 0.005) }))
          .filter(t => t.y < 100)
      );
    };

    const interval = setInterval(moveTexts, 50);
    return () => clearInterval(interval);
  }, []);

  // Knowledge accumulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPatternsLearned(prev => prev + Math.floor(Math.random() * 500) + 100);
      setKnowledgeLevel(prev => {
        const increment = 0.3 + Math.random() * 0.4;
        return Math.min(prev + increment, 100);
      });
      setAbsorptionPulse(true);
      setTimeout(() => setAbsorptionPulse(false), 200);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Cycle through sources
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSource(prev => (prev + 1) % DATA_SOURCES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LessonContainer
      title="The Pre-Training Phase"
      subtitle="Before an AI can chat, it must read billions of texts. This is where it learns language patterns, facts, and relationships."
    >
      <div className="flex flex-col gap-8">
        
        {/* Animation Stage */}
        <div className="relative w-full h-96 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
          
          {/* Floating Text Stream */}
          <div className="absolute inset-0 overflow-hidden">
            {floatingTexts.map(text => (
              <div
                key={text.id}
                className={`absolute text-xs md:text-sm font-mono ${text.source.color} whitespace-nowrap transition-all duration-100`}
                style={{
                  left: `${text.x}%`,
                  top: `${text.y}%`,
                  opacity: text.opacity,
                  transform: `translateX(-50%) scale(${0.8 + text.opacity * 0.3})`,
                  textShadow: `0 0 10px currentColor`
                }}
              >
                {text.text}
              </div>
            ))}
          </div>

          {/* Glowing absorption lines */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-64 h-64">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent origin-left animate-pulse"
                  style={{
                    transform: `rotate(${i * 45}deg) translateX(-50%)`,
                    opacity: 0.3,
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Central Brain */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className={`relative transition-all duration-200 ${absorptionPulse ? 'scale-105' : 'scale-100'}`}>
              {/* Outer glow rings */}
              <div className="absolute -inset-8 rounded-full bg-blue-500/10 animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute -inset-4 rounded-full bg-purple-500/20 animate-ping" style={{ animationDuration: '2s' }} />
              
              {/* Main brain container */}
              <div className={`w-36 h-36 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full border-4 border-blue-500 shadow-[0_0_60px_rgba(59,130,246,0.6)] flex items-center justify-center transition-all duration-200 ${absorptionPulse ? 'border-purple-500 shadow-[0_0_80px_rgba(147,51,234,0.8)]' : ''}`}>
                <Brain className={`w-20 h-20 text-blue-400 transition-all duration-200 ${absorptionPulse ? 'text-purple-400' : ''}`} />
                
                {/* Particle effects */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s' }}>
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute w-2 h-2 rounded-full animate-ping"
                      style={{
                        background: ['#60A5FA', '#A78BFA', '#34D399', '#FBBF24', '#F472B6', '#22D3EE'][i],
                        top: `${15 + Math.sin(i * Math.PI / 3) * 40}%`,
                        left: `${50 + Math.cos(i * Math.PI / 3) * 40}%`,
                        animationDelay: `${i * 0.3}s`,
                        animationDuration: '1.5s'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Absorption indicator */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-blue-400 font-mono animate-pulse">
                ↑ ABSORBING DATA ↑
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-80 z-30">
            <div className="bg-slate-900/90 rounded-full p-1 border border-slate-700 backdrop-blur">
              <div className="bg-slate-800 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 h-full transition-all duration-300 relative"
                  style={{ width: `${knowledgeLevel}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs font-mono">
              <span className="text-slate-500">Knowledge: {knowledgeLevel.toFixed(1)}%</span>
              <span className="text-emerald-400">{patternsLearned.toLocaleString()} patterns</span>
            </div>
          </div>

          {/* Current source indicator */}
          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-lg border border-slate-700 z-30">
            <div className="flex items-center gap-2 text-sm">
              {React.createElement(DATA_SOURCES[activeSource].icon, { 
                className: `w-4 h-4 ${DATA_SOURCES[activeSource].color}` 
              })}
              <span className={DATA_SOURCES[activeSource].color}>
                Reading: {DATA_SOURCES[activeSource].label}
              </span>
            </div>
          </div>
        </div>

        {/* Data Sources Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {DATA_SOURCES.map((source, i) => (
            <div 
              key={i}
              className={`bg-slate-800/60 p-3 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 ${activeSource === i ? 'border-blue-500 bg-slate-800 scale-105 shadow-lg shadow-blue-500/20' : 'border-slate-700/50'}`}
            >
              <source.icon className={`w-6 h-6 ${source.color}`} />
              <span className="text-xs text-slate-400 text-center">{source.label}</span>
            </div>
          ))}
        </div>

        {/* Explanation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-900/30 to-slate-800/50 p-6 rounded-xl border border-blue-500/30 shadow-lg">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <Database className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">1. Massive Scale</h3>
            <p className="text-slate-400 text-sm">
              GPT-4 was trained on <span className="text-blue-400 font-semibold">~13 trillion tokens</span> - 
              that's roughly 10 million books! It sees language in every possible context: scientific papers, 
              Reddit posts, code repositories, and more.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/30 to-slate-800/50 p-6 rounded-xl border border-purple-500/30 shadow-lg">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">2. Pattern Learning</h3>
            <p className="text-slate-400 text-sm">
              It doesn't memorize facts like a database. It learns <span className="text-purple-400 font-semibold">relationships</span>: 
              "Paris" relates to "France" like "Tokyo" relates to "Japan". These patterns emerge from 
              seeing millions of examples.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-900/30 to-slate-800/50 p-6 rounded-xl border border-amber-500/30 shadow-lg">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">3. Raw But Unfocused</h3>
            <p className="text-slate-400 text-sm">
              After pre-training, the model is <span className="text-amber-400 font-semibold">smart but chaotic</span>. 
              Ask "What's 2+2?" and it might reply "What's 3+3?" because it learned to continue patterns, 
              not answer questions. That's why we need Fine-Tuning!
            </p>
          </div>
        </div>

      </div>
    </LessonContainer>
  );
};