import React from 'react';

interface LessonContainerProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const LessonContainer: React.FC<LessonContainerProps> = ({ title, subtitle, children }) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-6 md:p-10 border-b border-slate-700 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
          {title}
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">{subtitle}</p>
      </div>
      <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        {children}
      </div>
    </div>
  );
};