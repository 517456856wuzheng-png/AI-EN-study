
export enum QuestionType {
  MEANING_MATCH = 'MEANING_MATCH',
  COLLOCATION = 'COLLOCATION',
  SPELLING = 'SPELLING',
  CONFUSION = 'CONFUSION'
}

export type WordFrequency = 'HIGH' | 'MID' | 'LOW';

export interface Word {
  id: string;
  spelling: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  exampleTrans: string;
  year?: string;
  frequency: WordFrequency; // 新增词频属性
  collocations?: string[];
  confusion?: {
    word: string;
    diff: string;
  }[];
  memoryTip?: string;
  examTechnique?: string; // 新增解题技巧
}

export interface QuizQuestion {
  id: string;
  wordId: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  examLogic?: string; // 新增出题逻辑分析
}

// ... Reading Module Types ...
export type ReadingTaskType = 'CLOZE' | 'READING';

export interface ReadingQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  techniqueTip?: string; // 针对具体题目的技巧
}

export interface ReadingPassage {
  id: string;
  title: string;
  content: string;
  questions: ReadingQuestion[];
  translation: string;
  vocabularyPoints: { word: string; meaning: string; freq: WordFrequency }[];
  generalTechnique?: string; // 篇章级解题大招
}

export type GrammarExerciseType = 'FILL' | 'SELECT' | 'CORRECT';
export type GrammarExerciseCategory = 'BASIC' | 'REAL_EXAM';

export interface GrammarQuestion {
  id: string;
  tenseId?: string;
  question: string;
  type: GrammarExerciseType;
  category: GrammarExerciseCategory;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  examYear?: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface Tense {
  id: string;
  name: string;
  description: string;
  structure: string;
  keywords: string[];
  mnemonic?: string;
  examples?: { en: string; cn: string; note?: string; year?: string }[];
  exercises: GrammarQuestion[];
  // Added missing properties to fix type errors in constants and components
  detailedStructures?: {
    subject: string;
    affirmative: string;
    affirmativeExample: string;
    negative: string;
    negativeExample: string;
    question: string;
    questionExample: string;
  }[];
  scenarios?: {
    name: string;
    correctExample: string;
    wrongExample: string;
    wrongReason: string;
  }[];
  commonErrors?: {
    point: string;
    wrong: string;
    correct: string;
    tip: string;
  }[];
}

export interface EssayTopic {
  id: string;
  title: string;
  category: 'APPLICATION' | 'ESSAY';
  subCategory: string;
  year?: string;
  requirement: string;
  template: { basic: string; advanced: string };
  keywords: string[];
}

export interface GradingResult {
  score: number;
  breakdown: { content: number; grammar: number; vocabulary: number; structure: number };
  feedback: { grammar: string; vocabulary: string; structure: string };
  corrections: { original: string; correction: string; reason: string }[];
  generalAdvice: string;
}

export type RewriteLevel = 'BASIC' | 'UPGRADE' | 'LOGIC';
export interface RewriteResult {
  original: string;
  rewritten: string;
  level: RewriteLevel;
  changes: any[];
  wordCountDiff: { original: number; rewritten: number };
}