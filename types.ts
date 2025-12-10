export type LessonId = 'intro' | 'prediction' | 'embeddings' | 'pretraining' | 'finetuning' | 'systemprompt' | 'attention' | 'context' | 'hallucination';

export interface LessonConfig {
  id: LessonId;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
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
  THINKING = 'thinking',
  DOCTOR = 'doctor',
  BANKER = 'banker',
  SLEEPY = 'sleepy'
}