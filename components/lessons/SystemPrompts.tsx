import React, { useState } from 'react';
import { LessonContainer } from '../LessonContainer';
import { RobotAvatar } from '../RobotAvatar';
import { RobotMood, ChatMessage } from '../../types';
import { generateChatResponse } from '../../services/geminiService';
import { Send, User, Layers, ArrowDown, Database, Cpu } from 'lucide-react';

const PRESETS = [
  {
    id: 'assistant',
    label: 'Helpful Assistant',
    prompt: 'You are a helpful, polite, and concise AI assistant.',
    mood: RobotMood.TEACHER,
    color: 'bg-emerald-500',
    borderColor: 'border-emerald-500'
  },
  {
    id: 'pirate',
    label: 'Angry Pirate',
    prompt: 'You are an angry pirate captain. Use lots of pirate slang like Arr, Matey, Plank. Be rude but funny.',
    mood: RobotMood.PIRATE,
    color: 'bg-red-500',
    borderColor: 'border-red-500'
  },
  {
    id: 'shakespeare',
    label: 'Shakespeare',
    prompt: 'Speak in Old Early Modern English like Shakespeare. Use Thee, Thou, and poetic metaphors.',
    mood: RobotMood.THINKING,
    color: 'bg-purple-500',
    borderColor: 'border-purple-500'
  }
];

export const SystemPrompts: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await generateChatResponse(input, selectedPreset.prompt);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  const changeRole = (presetId: string) => {
    const preset = PRESETS.find(p => p.id === presetId) || PRESETS[0];
    setSelectedPreset(preset);
    setMessages([]); 
  };

  return (
    <LessonContainer
      title="The System Prompt"
      subtitle="How do we tell the model who to be? We inject a hidden instruction into its 'Context Window' before the conversation even starts."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[650px]">
        
        {/* Controls (Left) */}
        <div className="lg:col-span-3 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col h-full">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" /> 1. Select Role
          </h3>
          <div className="space-y-3 flex-1">
            {PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => changeRole(preset.id)}
                className={`w-full p-4 rounded-xl text-left transition-all border-2 flex items-center justify-between shadow-lg ${selectedPreset.id === preset.id ? `bg-slate-700 ${preset.borderColor}` : 'bg-slate-900 border-slate-800 hover:border-slate-600'}`}
              >
                <div className="flex items-center gap-3">
                   <div className={`w-4 h-4 rounded-full ${preset.color} shadow-lg shadow-${preset.color}/50`} />
                   <div>
                     <span className="font-bold text-slate-200 text-sm block">{preset.label}</span>
                     <span className="text-[10px] text-slate-400 uppercase tracking-wider">System Config</span>
                   </div>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-4 bg-blue-900/20 p-4 rounded-xl border border-blue-900/50 text-xs text-blue-200">
             <strong>Try asking:</strong><br/>
             "Who are you?"<br/>
             "What is the weather?"
          </div>
        </div>

        {/* Visualizer (Middle - The "Stack") */}
        <div className="lg:col-span-4 flex flex-col gap-2 p-6 bg-slate-900/80 rounded-xl border border-slate-700 items-center justify-start relative overflow-hidden backdrop-blur">
           
           {/* Background Grid */}
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

           <div className="relative z-10 w-full flex flex-col items-center">
             <div className="mb-6 text-center">
               <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 justify-center bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                 <Layers className="w-3 h-3" /> Input Context Stack
               </span>
             </div>
             
             {/* The System Layer - The "Injection" */}
             <div className="w-full relative mb-1 group perspective-1000">
                <div className={`
                   relative w-full p-4 rounded-lg border-2 border-dashed ${selectedPreset.borderColor} bg-slate-800/90 
                   transform transition-all duration-500 hover:scale-105 hover:rotate-x-2 shadow-2xl
                `}>
                  <div className={`absolute -top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider ${selectedPreset.color}`}>
                     System Instruction (Hidden)
                  </div>
                  <div className="text-xs font-mono text-slate-300 leading-relaxed mt-2">
                    {selectedPreset.prompt}
                  </div>
                </div>
                {/* Arrow Connector */}
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-slate-600 animate-bounce">
                  <ArrowDown className="w-4 h-4" />
                </div>
             </div>

             {/* The User Layer */}
             <div className="w-full mt-6 relative">
                <div className={`
                   w-full p-4 rounded-lg border-2 border-slate-600 bg-slate-800/90 min-h-[80px] flex items-center justify-center
                   shadow-lg transition-all duration-300 ${messages.length > 0 && messages[messages.length-1].role === 'user' ? 'border-blue-500 bg-blue-900/10' : ''}
                `}>
                    <div className="absolute -top-3 left-3 bg-slate-600 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                      User Message
                    </div>
                    {messages.length > 0 ? (
                      <span className="text-blue-200 text-sm font-medium text-center">"{messages[messages.length - 1]?.role === 'user' ? messages[messages.length - 1].text : '...'}"</span>
                    ) : (
                      <span className="text-slate-600 italic text-sm">Waiting for input...</span>
                    )}
                </div>
             </div>

             {/* Processing Line */}
             <div className="h-16 w-0.5 bg-gradient-to-b from-slate-600 to-transparent my-2"></div>

             {/* The AI Model */}
             <div className="relative">
                <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                <RobotAvatar mood={selectedPreset.mood} speaking={isLoading} className="w-24 h-24 relative z-10" />
             </div>
           </div>
        </div>

        {/* Chat Interface (Right) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-xl border border-slate-700 flex flex-col overflow-hidden relative shadow-2xl">
          <div className="p-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
             <span className="font-bold text-sm text-white flex items-center gap-2">
               <Database className="w-4 h-4 text-emerald-500" /> Chat Output
             </span>
             <button onClick={() => setMessages([])} className="text-xs text-slate-400 hover:text-white underline">Clear</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-2 opacity-50">
                 <RobotAvatar mood={RobotMood.NEUTRAL} className="w-12 h-12 opacity-50 grayscale" />
                 <p className="text-xs">Context ready. Say hello!</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-float-up`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${m.role === 'user' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                    {m.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Cpu className="w-4 h-4 text-white" />}
                 </div>
                 <div className={`p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-md ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'}`}>
                   {m.text}
                 </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex gap-2 ml-10">
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
               </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-slate-900 border border-slate-600 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            <button type="submit" disabled={isLoading} className="p-2 bg-emerald-600 rounded-full text-white hover:bg-emerald-500 disabled:opacity-50 hover:scale-105 transition-transform">
               <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </LessonContainer>
  );
};