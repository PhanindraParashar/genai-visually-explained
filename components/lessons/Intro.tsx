import React from 'react';
import { ArrowRight, Brain, Cpu, MessageSquare, Sparkles } from 'lucide-react';
import { LessonId } from '../../types';

interface IntroProps {
  onStart: (id: LessonId) => void;
}

export const Intro: React.FC<IntroProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
      <div className="space-y-6">
        <div className="relative inline-block">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg blur opacity-75 animate-pulse"></div>
          <h1 className="relative text-5xl md:text-7xl font-bold text-white tracking-tight">
            How LLMs Work
          </h1>
        </div>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Welcome to the engine room! We're going to de-mystify the "Magic" behind Chatbots.
          No heavy math, just interactive experiments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div onClick={() => onStart('prediction')} className="group cursor-pointer bg-slate-800/50 hover:bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-emerald-500 transition-all text-left">
          <Sparkles className="w-10 h-10 text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-bold text-white mb-2">1. The Prediction Game</h3>
          <p className="text-slate-400">Discover how AI writes sentences one word at a time.</p>
        </div>

        <div onClick={() => onStart('pretraining')} className="group cursor-pointer bg-slate-800/50 hover:bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-blue-500 transition-all text-left">
          <Brain className="w-10 h-10 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-bold text-white mb-2">2. Pre-Training Library</h3>
          <p className="text-slate-400">See how models learn patterns from reading billions of books.</p>
        </div>

        <div onClick={() => onStart('finetuning')} className="group cursor-pointer bg-slate-800/50 hover:bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-purple-500 transition-all text-left">
          <Cpu className="w-10 h-10 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-bold text-white mb-2">3. Instruction School</h3>
          <p className="text-slate-400">Watch a robot learn to follow orders, not just babble.</p>
        </div>

         <div onClick={() => onStart('systemprompt')} className="group cursor-pointer bg-slate-800/50 hover:bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-red-500 transition-all text-left">
          <MessageSquare className="w-10 h-10 text-red-400 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-bold text-white mb-2">4. Roleplay Mode</h3>
          <p className="text-slate-400">Control the AI's personality with System Prompts.</p>
        </div>
      </div>

      <button onClick={() => onStart('prediction')} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-lg flex items-center gap-2 transition-all transform hover:scale-105">
        Start the Journey <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};