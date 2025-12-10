import React, { useState } from 'react';
import { LessonId } from './types';
import { Intro } from './components/lessons/Intro';
import { Predictor } from './components/lessons/Predictor';
import { Embeddings } from './components/lessons/Embeddings';
import { PreTraining } from './components/lessons/PreTraining';
import { FineTuning } from './components/lessons/FineTuning';
import { SystemPrompts } from './components/lessons/SystemPrompts';
import { Attention } from './components/lessons/Attention';
import { ContextWindow } from './components/lessons/ContextWindow';
import { Hallucination } from './components/lessons/Hallucination';
import { LayoutDashboard, Sparkles, Brain, Cpu, MessageSquare, Eye, Menu, X, HardDrive, AlertTriangle, Network } from 'lucide-react';

const App: React.FC = () => {
  const [currentLesson, setCurrentLesson] = useState<LessonId>('intro');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderLesson = () => {
    switch (currentLesson) {
      case 'intro': return <Intro onStart={setCurrentLesson} />;
      case 'prediction': return <Predictor />;
      case 'embeddings': return <Embeddings />;
      case 'pretraining': return <PreTraining />;
      case 'finetuning': return <FineTuning />;
      case 'systemprompt': return <SystemPrompts />;
      case 'attention': return <Attention />;
      case 'context': return <ContextWindow />;
      case 'hallucination': return <Hallucination />;
      default: return <Intro onStart={setCurrentLesson} />;
    }
  };

  const menuItems = [
    { id: 'intro', label: 'Start', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'prediction', label: '1. Prediction', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'embeddings', label: '2. Embeddings', icon: <Network className="w-5 h-5" /> },
    { id: 'pretraining', label: '3. Pre-Training', icon: <Brain className="w-5 h-5" /> },
    { id: 'finetuning', label: '4. Fine-Tuning', icon: <Cpu className="w-5 h-5" /> },
    { id: 'systemprompt', label: '5. System Prompt', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'attention', label: '6. Attention', icon: <Eye className="w-5 h-5" /> },
    { id: 'context', label: '7. Context Window', icon: <HardDrive className="w-5 h-5" /> },
    { id: 'hallucination', label: '8. Hallucinations', icon: <AlertTriangle className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      
      {/* Mobile Sidebar Toggle */}
      <button 
        className="md:hidden fixed top-4 right-4 z-50 bg-slate-800 p-2 rounded-lg border border-slate-700 shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 z-40 flex flex-col shadow-2xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-900/50">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-900/50 text-xl">AI</div>
          <div>
            <span className="font-bold text-xl tracking-tight text-white block">LLM Inside Out</span>
            <span className="text-xs text-slate-500">Interactive Learning</span>
          </div>
        </div>
        
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentLesson(item.id as LessonId);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium border
                ${currentLesson === item.id 
                  ? 'bg-emerald-900/20 text-emerald-400 border-emerald-500/30 shadow-inner' 
                  : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'}
              `}
            >
              <div className={`${currentLesson === item.id ? 'text-emerald-400' : 'text-slate-500'}`}>
                {item.icon}
              </div>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
          <div className="bg-slate-800 rounded-lg p-3 text-center border border-slate-700">
             <p className="text-xs text-slate-400">
                Built for future engineers.<br/>
                <span className="text-emerald-500/70">Powered by Gemini</span>
             </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
        {renderLesson()}
      </main>

    </div>
  );
};

export default App;