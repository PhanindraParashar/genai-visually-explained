import React, { useState } from 'react';
import { LessonId } from './types';
import { Intro } from './components/lessons/Intro';
import { Predictor } from './components/lessons/Predictor';
import { PreTraining } from './components/lessons/PreTraining';
import { FineTuning } from './components/lessons/FineTuning';
import { SystemPrompts } from './components/lessons/SystemPrompts';
import { Attention } from './components/lessons/Attention';
import { LayoutDashboard, Sparkles, Brain, Cpu, MessageSquare, Eye, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [currentLesson, setCurrentLesson] = useState<LessonId>('intro');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderLesson = () => {
    switch (currentLesson) {
      case 'intro': return <Intro onStart={setCurrentLesson} />;
      case 'prediction': return <Predictor />;
      case 'pretraining': return <PreTraining />;
      case 'finetuning': return <FineTuning />;
      case 'systemprompt': return <SystemPrompts />;
      case 'attention': return <Attention />;
      default: return <Intro onStart={setCurrentLesson} />;
    }
  };

  const menuItems = [
    { id: 'intro', label: 'Start', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'prediction', label: '1. Prediction', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'pretraining', label: '2. Pre-Training', icon: <Brain className="w-5 h-5" /> },
    { id: 'finetuning', label: '3. Fine-Tuning', icon: <Cpu className="w-5 h-5" /> },
    { id: 'systemprompt', label: '4. System Prompt', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'attention', label: '5. Attention', icon: <Eye className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      
      {/* Mobile Sidebar Toggle */}
      <button 
        className="md:hidden fixed top-4 right-4 z-50 bg-slate-800 p-2 rounded-lg border border-slate-700"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 z-40
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center font-bold text-white">AI</div>
          <span className="font-bold text-xl tracking-tight text-white">LLM Inside Out</span>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentLesson(item.id as LessonId);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium
                ${currentLesson === item.id 
                  ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <p className="text-xs text-slate-600 text-center">
             Built for teens who code.<br/>Powered by Google Gemini.
          </p>
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