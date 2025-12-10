export type LessonId = 'intro' | 'prediction' | 'pretraining' | 'finetuning' | 'systemprompt' | 'attention';

export interface LessonConfig {
  id: LessonId;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface TokenCandidate {
  word: string;
  probability: number;
}

export enum RobotMood {
  NEUTRAL = 'neutral',
  HAPPY = 'happy',
  CONFUSED = 'confused',
  TEACHER = 'teacher',
  PIRATE = 'pirate',
  DETECTIVE = 'detective',
  THINKING = 'thinking'
}