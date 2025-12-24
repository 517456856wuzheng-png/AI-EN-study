
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GradingResult, Word, Tense, GrammarQuestion, ReadingPassage, ReadingTaskType, WordFrequency, RewriteLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const DEFAULT_MODEL = 'gemini-3-flash-preview';

// 系统指令：模拟 13000 专升本英语二专家
const SYSTEM_INSTRUCTION = `
You are an expert for the "College Upgrading English II (13000)" exam in China. 
Focus strictly on the style and difficulty of exams from 2020.04 to 2025.10.
Key Logic for Generation:
1. Vocabulary: Use words common in CET-4 and English II 13000 syllabus.
2. Frequency: Categorize words into HIGH (seen 5+ times), MID (2-4 times), and LOW (1 time or CET-4 core).
3. Exam Trap: In Cloze, focus on fixed collocations and context logic. In Reading, focus on "Same meaning, different words" (同义替换).
4. Techniques: Always provide "Technique Corner" (解题大招) like "Red Flower Green Leaf principle" or "Keywords Location".
`;

export const generateDailyWords = async (count: number = 30, excludeWords: string[] = [], frequency: WordFrequency = 'HIGH'): Promise<{words: Word[], quiz: any[]}> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      words: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            spelling: { type: Type.STRING },
            phonetic: { type: Type.STRING },
            partOfSpeech: { type: Type.STRING },
            meaning: { type: Type.STRING },
            example: { type: Type.STRING },
            exampleTrans: { type: Type.STRING },
            year: { type: Type.STRING },
            frequency: { type: Type.STRING, enum: ['HIGH', 'MID', 'LOW'] },
            collocations: { type: Type.ARRAY, items: { type: Type.STRING } },
            memoryTip: { type: Type.STRING },
            examTechnique: { type: Type.STRING }
          },
          required: ["id", "spelling", "meaning", "frequency", "examTechnique"]
        }
      },
      quiz: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            wordId: { type: Type.STRING },
            type: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING },
            examLogic: { type: Type.STRING }
          }
        }
      }
    }
  };

  const prompt = `${SYSTEM_INSTRUCTION}
    Generate ${count} words specifically marked as ${frequency} frequency for the English II 13000 exam. 
    Exclude: ${excludeWords.join(', ')}. 
    Include 10 mock questions following the 2020-2025 exam style.`;

  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
    config: { responseMimeType: "application/json", responseSchema: schema }
  });

  return JSON.parse(response.text || `{"words":[], "quiz":[]}`);
};

export const generateReadingTask = async (type: ReadingTaskType): Promise<ReadingPassage> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      content: { type: Type.STRING },
      translation: { type: Type.STRING },
      generalTechnique: { type: Type.STRING },
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING },
            techniqueTip: { type: Type.STRING }
          }
        }
      },
      vocabularyPoints: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            meaning: { type: Type.STRING },
            freq: { type: Type.STRING, enum: ['HIGH', 'MID', 'LOW'] }
          }
        }
      }
    }
  };

  const prompt = `${SYSTEM_INSTRUCTION}
    Generate a simulated ${type === 'CLOZE' ? 'Cloze Test' : 'Reading Comprehension'} 
    based on the 2020-2025 exam window. 
    Topic should be related to technology, culture or social issues common in 13000 exams.`;

  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
    config: { responseMimeType: "application/json", responseSchema: schema }
  });

  return JSON.parse(response.text || "{}") as ReadingPassage;
};

// Grammar, Essay grading services...
export const gradeEssay = async (topicTitle: string, essayContent: string): Promise<GradingResult> => {
  const gradingSchema: Schema = { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, breakdown: { type: Type.OBJECT, properties: { content: { type: Type.NUMBER }, grammar: { type: Type.NUMBER }, vocabulary: { type: Type.NUMBER }, structure: { type: Type.NUMBER } } }, feedback: { type: Type.OBJECT, properties: { grammar: { type: Type.STRING }, vocabulary: { type: Type.STRING }, structure: { type: Type.STRING } } }, corrections: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { original: { type: Type.STRING }, correction: { type: Type.STRING }, reason: { type: Type.STRING } } } }, generalAdvice: { type: Type.STRING } }, required: ["score", "breakdown", "feedback", "corrections", "generalAdvice"] };
  const prompt = `${SYSTEM_INSTRUCTION} Grade this student essay based on 13000 exam criteria: Topic: ${topicTitle}. Content: ${essayContent}`;
  const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt, config: { responseMimeType: "application/json", responseSchema: gradingSchema } });
  return JSON.parse(response.text || "{}") as GradingResult;
};

export const generateTenseContent = async (tenseName: string): Promise<Tense> => {
  const schema: Schema = { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, structure: { type: Type.STRING }, keywords: { type: Type.ARRAY, items: { type: Type.STRING } }, mnemonic: { type: Type.STRING }, examples: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { en: { type: Type.STRING }, cn: { type: Type.STRING }, note: { type: Type.STRING }, year: { type: Type.STRING } } } } }, required: ["name", "description", "structure"] };
  const prompt = `${SYSTEM_INSTRUCTION} Explain tense: "${tenseName}" specifically for 13000 exams. Highlight common traps in past years.`;
  const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt, config: { responseMimeType: "application/json", responseSchema: schema } });
  return JSON.parse(response.text || "{}") as Tense;
};

export const generateDailyGrammarPractice = async (tenseName: string, count: number = 10): Promise<GrammarQuestion[]> => {
  const schema: Schema = { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, question: { type: Type.STRING }, type: { type: Type.STRING }, category: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, correctAnswer: { type: Type.STRING }, explanation: { type: Type.STRING } }, required: ["id", "question", "correctAnswer", "explanation"] } };
  const prompt = `${SYSTEM_INSTRUCTION} Generate ${count} grammar questions for "${tenseName}" mimicking 2020-2025 13000 exams.`;
  const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt, config: { responseMimeType: "application/json", responseSchema: schema } });
  return JSON.parse(response.text || "[]") as GrammarQuestion[];
};

export const generateEssayResources = async (topicTitle: string): Promise<any> => {
  const schema: Schema = { type: Type.OBJECT, properties: { basicTemplate: { type: Type.STRING }, advancedTemplate: { type: Type.STRING }, keywords: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["basicTemplate", "advancedTemplate", "keywords"] };
  const prompt = `${SYSTEM_INSTRUCTION} Provide templates for the topic "${topicTitle}" based on common English II 13000 writing tasks.`;
  const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt, config: { responseMimeType: "application/json", responseSchema: schema } });
  return JSON.parse(response.text || "{}");
};

export const rewriteEssay = async (topicTitle: string, originalContent: string, level: RewriteLevel): Promise<any> => {
  const schema: Schema = { 
    type: Type.OBJECT, 
    properties: { 
      rewritten: { type: Type.STRING }, 
      changes: { 
        type: Type.ARRAY, 
        items: { 
          type: Type.OBJECT, 
          properties: { 
            type: { type: Type.STRING }, 
            reason: { type: Type.STRING }, 
            originalSpan: { type: Type.STRING }, 
            newSpan: { type: Type.STRING } 
          } 
        } 
      }, 
      wordCountDiff: { 
        type: Type.OBJECT, 
        properties: { 
          original: { type: Type.NUMBER }, 
          rewritten: { type: Type.NUMBER } 
        } 
      } 
    }, 
    required: ["rewritten", "changes", "wordCountDiff"] 
  };

  let levelInstruction = "";
  if (level === 'BASIC') {
    levelInstruction = "Focus on fixing grammar, spelling, and basic punctuation errors. Keep the language simple but correct.";
  } else if (level === 'UPGRADE') {
    levelInstruction = "Enhance the vocabulary with more sophisticated synonyms and upgrade sentence structures to include complex clauses, while keeping the original meaning.";
  } else if (level === 'LOGIC') {
    levelInstruction = "Optimize the logical flow, add transitional phrases, and improve the overall structure of the argument to make it more persuasive and coherent.";
  }

  const prompt = `${SYSTEM_INSTRUCTION} 
    Task: Rewrite the following essay. 
    Objective: ${levelInstruction}
    Topic: ${topicTitle}. 
    Content: ${originalContent}`;

  const response = await ai.models.generateContent({ 
    model: DEFAULT_MODEL, 
    contents: prompt, 
    config: { 
      responseMimeType: "application/json", 
      responseSchema: schema 
    } 
  });
  return JSON.parse(response.text || "{}");
};
