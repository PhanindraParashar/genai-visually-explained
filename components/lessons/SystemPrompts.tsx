import React, { useState } from 'react';
import { LessonContainer } from '../LessonContainer';
import { RobotAvatar } from '../RobotAvatar';
import { RobotMood, ChatMessage } from '../../types';
import { generateChatResponse } from '../../services/geminiService';
import { Send, User } from 'lucide-react';

const PRESETS = [
  {
    id: 'assistant',
    label: 'Helpful Assistant',
    prompt: 'You are a helpful, polite, and concise AI assistant.',
    mood: RobotMood.TEACHER
  },
  {
    id: 'pirate',
    label: 'Angry Pirate',
    prompt: 'You are an angry pirate captain. Use lots of pirate slang like Arr, Matey, Plank. Be rude but funny.',
    mood: RobotMood.PIRATE
  },
  {
    id: 'yoda',
    label: 'Wise Alien',
    prompt: 'You are a wise alien master who speaks in inverted sentences. Cryptic you are.',
    mood: RobotMood.DETECTIVE // Close enough visual
  },
  {
    id: 'baby',
    label: 'Toddler',
    prompt: 'You are a 3 year old kid. You only speak in very simple words and get distracted easily. Mention toys.',
    mood: RobotMood.HAPPY
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
    setMessages([]); // Clear chat on role change to emphasize the shift
  };

  return (
    <LessonContainer
      title="The System Prompt"
      subtitle="Give the model a 'Role' or 'Costume' before the conversation even starts."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
        
        {/* Controls */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-full overflow-y-auto">
          <h3 className="font-bold text-white mb-6">1. Choose a Costume</h3>
          <div className="space-y-4">
            {PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => changeRole(preset.id)}
                className={`w-full p-4 rounded-lg text-left transition-all border-2 flex items-center justify-between ${selectedPreset.id === preset.id ? 'bg-emerald-900/30 border-emerald-500' : 'bg-slate-900 border-slate-800 hover:border-slate-600'}`}
              >
                <span className="font-bold text-slate-200">{preset.label}</span>
                {selectedPreset.id === preset.id && <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />}
              </button>
            ))}
          </div>

          <div className="mt-8">
             <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Hidden System Instruction</h4>
             <div className="bg-black/50 p-4 rounded-lg font-mono text-xs text-green-400 border border-slate-800">
               {selectedPreset.prompt}
             </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-700 flex flex-col overflow-hidden relative">
          
          {/* Header */}
          <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center gap-4">
             <RobotAvatar mood={selectedPreset.mood} className="w-12 h-12" speaking={isLoading} />
             <div>
               <div className="font-bold text-white">{selectedPreset.label} Bot</div>
               <div className="text-xs text-slate-400">Powered by Gemini</div>
             </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 mt-20">
                <p>Say "Hello" or "Tell me a joke" to see how the personality changes!</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-slate-700' : 'bg-emerald-900'}`}>
                    {m.role === 'user' ? <User className="w-4 h-4 text-white" /> : <RobotAvatar mood={selectedPreset.mood} className="w-8 h-8 p-1 border-0 shadow-none" />}
                 </div>
                 <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
                   {m.text}
                 </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center shrink-0">
                    <RobotAvatar mood={selectedPreset.mood} className="w-8 h-8 p-1 border-0 shadow-none" />
                  </div>
                  <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none text-slate-400 text-sm animate-pulse">
                    Typing...
                  </div>
               </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-slate-800 border-t border-slate-700 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-slate-900 border border-slate-600 rounded-full px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
            <button type="submit" disabled={isLoading} className="p-2 bg-emerald-600 rounded-full text-white hover:bg-emerald-500 disabled:opacity-50">
               <Send className="w-5 h-5" />
            </button>
          </form>

        </div>

      </div>
    </LessonContainer>
  );
};