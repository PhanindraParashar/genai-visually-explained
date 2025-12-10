import React from 'react';
import { RobotMood } from '../types';
import { Bot, Skull, Glasses, Search, BrainCircuit } from 'lucide-react';

interface RobotAvatarProps {
  mood: RobotMood;
  className?: string;
  speaking?: boolean;
}

export const RobotAvatar: React.FC<RobotAvatarProps> = ({ mood, className = "w-24 h-24", speaking = false }) => {
  const getIcon = () => {
    switch (mood) {
      case RobotMood.PIRATE: return <Skull className="w-full h-full text-red-400" />;
      case RobotMood.TEACHER: return <Glasses className="w-full h-full text-blue-400" />;
      case RobotMood.DETECTIVE: return <Search className="w-full h-full text-yellow-400" />;
      case RobotMood.THINKING: return <BrainCircuit className="w-full h-full text-purple-400 animate-pulse" />;
      default: return <Bot className={`w-full h-full ${speaking ? 'animate-bounce' : ''} text-emerald-400`} />;
    }
  };

  const getGlowColor = () => {
    switch (mood) {
      case RobotMood.PIRATE: return 'shadow-red-500/50';
      case RobotMood.TEACHER: return 'shadow-blue-500/50';
      case RobotMood.DETECTIVE: return 'shadow-yellow-500/50';
      case RobotMood.THINKING: return 'shadow-purple-500/50';
      default: return 'shadow-emerald-500/50';
    }
  };

  return (
    <div className={`relative rounded-full bg-slate-800 border-2 border-slate-600 p-4 shadow-xl ${getGlowColor()} ${className} transition-all duration-500`}>
      {getIcon()}
      {speaking && (
        <div className="absolute -top-2 -right-2 bg-white text-slate-900 text-xs font-bold px-2 py-1 rounded-full animate-bounce">
          ...
        </div>
      )}
    </div>
  );
};