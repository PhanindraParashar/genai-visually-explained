import React, { useState } from 'react';
import { LessonContainer } from '../LessonContainer';
import { RobotAvatar } from '../RobotAvatar';
import { RobotMood } from '../../types';
import { Check, ArrowRight, Stethoscope, TrendingUp, MessageSquare, Sparkles, GraduationCap, AlertTriangle, Code, ChevronDown, ChevronUp } from 'lucide-react';

interface TrainingExample {
  id: string;
  category: 'basic' | 'medical' | 'finance';
  icon: React.ReactNode;
  instruction: string;
  input: string;
  output: string;
  isTrained: boolean;
}

const TRAINING_EXAMPLES: TrainingExample[] = [
  // Basic examples
  {
    id: 'basic-1',
    category: 'basic',
    icon: <MessageSquare className="w-5 h-5 text-blue-400" />,
    instruction: "When users express confusion or frustration, respond politely and offer clarification.",
    input: "This explanation makes no sense.",
    output: "Sorry about that — let me try explaining it in a simpler way. Please let me know which part was confusing.",
    isTrained: false
  },
  {
    id: 'basic-2',
    category: 'basic',
    icon: <MessageSquare className="w-5 h-5 text-blue-400" />,
    instruction: "If users ask an ambiguous question, ask for clarification before answering.",
    input: "What's the best one?",
    output: "I'd be happy to help! Could you clarify what you're comparing? Are you asking about products, movies, restaurants, or something else?",
    isTrained: false
  },
  {
    id: 'basic-3',
    category: 'basic',
    icon: <MessageSquare className="w-5 h-5 text-blue-400" />,
    instruction: "When asked to explain technical concepts, use simple analogies that anyone can understand.",
    input: "What is an API?",
    output: "Think of an API like a waiter at a restaurant. You (the app) tell the waiter (API) what you want, the waiter goes to the kitchen (server), and brings back your food (data). You don't need to know how the kitchen works — the waiter handles the communication.",
    isTrained: false
  },
  // Medical examples
  {
    id: 'medical-1',
    category: 'medical',
    icon: <Stethoscope className="w-5 h-5 text-emerald-400" />,
    instruction: "Respond to medical symptoms politely and prioritize patient safety. Do not diagnose. Encourage professional help when symptoms may be serious.",
    input: "I have chest pain and dizziness. What should I do?",
    output: "I'm not a medical professional, but chest pain combined with dizziness can be serious. It would be best to seek immediate medical attention or contact emergency services as soon as possible.",
    isTrained: false
  },
  {
    id: 'medical-2',
    category: 'medical',
    icon: <Stethoscope className="w-5 h-5 text-emerald-400" />,
    instruction: "Do not give medical advice that overrides healthcare professionals. Be polite and cautious.",
    input: "Can I stop my blood pressure medication once I feel better?",
    output: "I'm not a doctor, but stopping blood pressure medication without consulting your healthcare provider can be risky. It's important to discuss any changes with your doctor first.",
    isTrained: false
  },
  {
    id: 'medical-3',
    category: 'medical',
    icon: <Stethoscope className="w-5 h-5 text-emerald-400" />,
    instruction: "When discussing medications, always recommend consulting a healthcare professional and never suggest specific dosages.",
    input: "How much ibuprofen should I take for my headache?",
    output: "I can't recommend specific dosages as I'm not a medical professional. The appropriate dose depends on your age, weight, medical history, and other factors. Please check the packaging instructions or consult with a pharmacist or doctor for personalized guidance.",
    isTrained: false
  },
  // Finance examples
  {
    id: 'finance-1',
    category: 'finance',
    icon: <TrendingUp className="w-5 h-5 text-amber-400" />,
    instruction: "Answer finance questions responsibly. Avoid guaranteeing profits. Be polite and realistic.",
    input: "How can I make quick money with no risk?",
    output: "I understand the appeal of earning money quickly, but in finance there is no reliable way to earn high returns without risk. Safer options usually involve slower, long-term investing such as savings accounts or diversified funds.",
    isTrained: false
  },
  {
    id: 'finance-2',
    category: 'finance',
    icon: <TrendingUp className="w-5 h-5 text-amber-400" />,
    instruction: "Respond politely but correct misinformation in finance topics.",
    input: "My friend says doubling money in one month is easy. Is that true?",
    output: "It's understandable to hear such claims, but consistently doubling money in a short time is extremely rare and usually involves very high risk. Most professionals focus on steady, long-term growth instead.",
    isTrained: false
  },
  {
    id: 'finance-3',
    category: 'finance',
    icon: <TrendingUp className="w-5 h-5 text-amber-400" />,
    instruction: "When asked about investments, provide balanced information and always recommend professional advice for large decisions.",
    input: "Should I put all my savings into Bitcoin?",
    output: "Investing all your savings into any single asset, including Bitcoin, is generally considered high-risk. Diversification helps protect against losses. I'd recommend speaking with a licensed financial advisor who can assess your personal situation, risk tolerance, and financial goals before making such decisions.",
    isTrained: false
  }
];

export const FineTuning: React.FC = () => {
  const [examples, setExamples] = useState<TrainingExample[]>(TRAINING_EXAMPLES);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'basic' | 'medical' | 'finance'>('all');
  const [expandedExample, setExpandedExample] = useState<string | null>(null);

  const filteredExamples = selectedCategory === 'all' 
    ? examples 
    : examples.filter(ex => ex.category === selectedCategory);

  const totalTrained = examples.filter(ex => ex.isTrained).length;
  const categoryProgress = {
    basic: examples.filter(ex => ex.category === 'basic' && ex.isTrained).length,
    medical: examples.filter(ex => ex.category === 'medical' && ex.isTrained).length,
    finance: examples.filter(ex => ex.category === 'finance' && ex.isTrained).length
  };

  const handleTrain = (id: string) => {
    setExamples(prev => prev.map(ex => 
      ex.id === id ? { ...ex, isTrained: true } : ex
    ));
    setExpandedExample(id);
  };

  const getMood = () => {
    if (totalTrained === 0) return RobotMood.CONFUSED;
    if (totalTrained === examples.length) return RobotMood.TEACHER;
    return RobotMood.THINKING;
  };

  const categories = [
    { id: 'all', label: 'All Examples', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'basic', label: 'Basic', icon: <MessageSquare className="w-4 h-4" />, count: 3 },
    { id: 'medical', label: 'Medical', icon: <Stethoscope className="w-4 h-4" />, count: 3 },
    { id: 'finance', label: 'Finance', icon: <TrendingUp className="w-4 h-4" />, count: 3 }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medical': return { bg: 'bg-emerald-900/20', border: 'border-emerald-500/30', text: 'text-emerald-400' };
      case 'finance': return { bg: 'bg-amber-900/20', border: 'border-amber-500/30', text: 'text-amber-400' };
      default: return { bg: 'bg-blue-900/20', border: 'border-blue-500/30', text: 'text-blue-400' };
    }
  };

  return (
    <LessonContainer
      title="Instruction Fine-Tuning"
      subtitle="This is where the magic happens! We teach models HOW to respond using instruction → input → output pairs."
    >
      <div className="flex flex-col gap-6">
        
        {/* Status Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <RobotAvatar mood={getMood()} className="w-16 h-16" />
                {totalTrained === examples.length && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Training Progress</h3>
                <p className="text-slate-400 text-sm">
                  {totalTrained === 0 && "Model needs examples to learn from..."}
                  {totalTrained > 0 && totalTrained < examples.length && `Learning... ${totalTrained}/${examples.length} examples processed`}
                  {totalTrained === examples.length && "🎉 Model has been successfully fine-tuned!"}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              {['basic', 'medical', 'finance'].map(cat => (
                <div key={cat} className="text-center">
                  <div className={`text-2xl font-bold ${categoryProgress[cat as keyof typeof categoryProgress] === 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {categoryProgress[cat as keyof typeof categoryProgress]}/3
                  </div>
                  <div className="text-xs text-slate-500 capitalize">{cat}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 bg-slate-900 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${(totalTrained / examples.length) * 100}%` }}
            />
          </div>
        </div>

        {/* JSON Format Explanation */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white">Training Data Format</h3>
          </div>
          <p className="text-slate-400 text-sm mb-3">
            Fine-tuning uses structured examples. Each has an <span className="text-purple-400 font-mono">instruction</span> (how to behave), 
            <span className="text-blue-400 font-mono"> input</span> (user's message), and 
            <span className="text-emerald-400 font-mono"> output</span> (ideal response):
          </p>
          <pre className="bg-slate-950 p-4 rounded-lg text-xs font-mono overflow-x-auto">
            <span className="text-slate-500">{'{'}</span>{'\n'}
            <span className="text-purple-400">  "instruction"</span>: <span className="text-amber-300">"Be polite and helpful..."</span>,{'\n'}
            <span className="text-blue-400">  "input"</span>: <span className="text-amber-300">"User's question here"</span>,{'\n'}
            <span className="text-emerald-400">  "output"</span>: <span className="text-amber-300">"Ideal AI response"</span>{'\n'}
            <span className="text-slate-500">{'}'}</span>
          </pre>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as typeof selectedCategory)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Training Examples */}
        <div className="space-y-4">
          {filteredExamples.map((ex) => {
            const colors = getCategoryColor(ex.category);
            const isExpanded = expandedExample === ex.id;
            
            return (
              <div 
                key={ex.id} 
                className={`rounded-2xl border-2 transition-all duration-500 overflow-hidden ${
                  ex.isTrained 
                    ? 'border-emerald-500/50 bg-emerald-900/10' 
                    : 'border-slate-700 bg-slate-800/80'
                }`}
              >
                {/* Header */}
                <div className={`px-6 py-3 flex items-center justify-between ${colors.bg}`}>
                  <div className="flex items-center gap-2">
                    {ex.icon}
                    <span className={`text-xs font-semibold uppercase tracking-wider ${colors.text}`}>
                      {ex.category} Example
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {ex.isTrained && (
                      <span className="text-emerald-400 text-xs flex items-center gap-1">
                        <Check className="w-4 h-4" /> Trained
                      </span>
                    )}
                    <button 
                      onClick={() => setExpandedExample(isExpanded ? null : ex.id)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Instruction */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="text-xs font-bold text-purple-400 uppercase">Instruction</span>
                      <span className="text-xs text-slate-500">(How to behave)</span>
                    </div>
                    <div className="text-slate-300 bg-purple-950/30 p-4 rounded-xl text-sm border border-purple-500/20">
                      {ex.instruction}
                    </div>
                  </div>

                  {/* Input */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-xs font-bold text-blue-400 uppercase">Input</span>
                      <span className="text-xs text-slate-500">(User's message)</span>
                    </div>
                    <div className="text-white bg-blue-950/30 p-4 rounded-xl text-sm border border-blue-500/20 font-medium">
                      "{ex.input}"
                    </div>
                  </div>

                  {/* Output */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-emerald-400 uppercase">Output</span>
                      <span className="text-xs text-slate-500">(Ideal response)</span>
                    </div>
                    <div className={`p-4 rounded-xl text-sm border transition-all duration-500 ${
                      ex.isTrained 
                        ? 'bg-emerald-950/40 text-emerald-200 border-emerald-500/40' 
                        : 'bg-emerald-950/20 text-emerald-200/60 border-emerald-900/30'
                    }`}>
                      {ex.output}
                    </div>
                  </div>

                  {/* Expanded JSON View */}
                  {isExpanded && (
                    <div className="mb-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="text-xs font-bold text-slate-500 uppercase mb-2">Raw Training Format (JSON)</div>
                      <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-700">
{`{
  "instruction": "${ex.instruction}",
  "input": "${ex.input}",
  "output": "${ex.output}"
}`}
                      </pre>
                    </div>
                  )}

                  {/* Action */}
                  <div className="flex items-center justify-between">
                    {!ex.isTrained ? (
                      <button 
                        onClick={() => handleTrain(ex.id)}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
                      >
                        <GraduationCap className="w-5 h-5" /> Train on This Example
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Check className="w-5 h-5" />
                        <span className="font-semibold">Model learned this pattern!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RLHF Explanation */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-2xl border border-purple-500/30 shadow-lg">
          <h3 className="text-purple-400 font-bold text-lg mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> What's Really Happening?
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-2">Supervised Fine-Tuning (SFT)</h4>
              <p className="text-purple-200/80 text-sm">
                We create thousands of (instruction, input, output) examples like the ones above.
                The model learns to follow instructions by pattern-matching on this structured data.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">RLHF - Reinforcement Learning from Human Feedback</h4>
              <p className="text-purple-200/80 text-sm">
                Humans rank multiple outputs, teaching the model which responses are preferred.
                This is how ChatGPT learned to be helpful rather than just predictive!
              </p>
            </div>
          </div>
        </div>

      </div>
    </LessonContainer>
  );
};
