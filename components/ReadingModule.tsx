
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2, BookOpen, ChevronRight, CheckCircle, XCircle, Eye, Info, RefreshCw, Bookmark, ArrowRight, ArrowLeft, Zap } from 'lucide-react';
import { ReadingPassage, ReadingTaskType, ReadingQuestion } from '../types';
import { generateReadingTask } from '../services/geminiService';

export const ReadingModule: React.FC = () => {
  const [activeTaskType, setActiveTaskType] = useState<ReadingTaskType | null>(null);
  const [passage, setPassage] = useState<ReadingPassage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [clozeIndex, setClozeIndex] = useState<number | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);

  const startTask = async (type: ReadingTaskType) => {
    setIsLoading(true);
    setPassage(null);
    setUserAnswers({});
    setIsSubmitted(false);
    setActiveTaskType(type);
    setClozeIndex(null);
    setShowTranslation(false);

    try {
      const data = await generateReadingTask(type);
      setPassage(data);
    } catch (e) {
      alert("AI 题目生成失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (qId: string, option: string) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: option }));
    if (activeTaskType === 'CLOZE') setClozeIndex(null);
  };

  if (!activeTaskType) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 space-y-8 bg-gray-50">
        <div className="bg-brand-50 p-6 rounded-full animate-pulse">
          <BookOpen size={64} className="text-brand-600" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-gray-900">13000 真题特训</h2>
          <p className="text-gray-500 max-w-sm text-sm">
            基于 2020-2025 真题数据模型，动态生成符合英语二难度的文章。
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
          <button onClick={() => startTask('CLOZE')} className="flex flex-col items-center p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all active:scale-95 group">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Zap size={24} />
            </div>
            <span className="font-bold text-gray-800">完形填空</span>
            <span className="text-xs text-gray-400 mt-1">语境、固定搭配考察</span>
          </button>
          <button onClick={() => startTask('READING')} className="flex flex-col items-center p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all active:scale-95 group">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Zap size={24} />
            </div>
            <span className="font-bold text-gray-800">阅读理解</span>
            <span className="text-xs text-gray-400 mt-1">定位、同义替换考察</span>
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="animate-spin text-brand-600 mb-4" size={48} />
        <p className="text-lg font-bold">AI 正在根据 13000 考纲出题...</p>
      </div>
    );
  }

  const score = passage ? passage.questions.reduce((acc, q) => acc + (userAnswers[q.id] === q.correctAnswer ? 1 : 0), 0) : 0;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-4 py-3 border-b flex justify-between items-center bg-white z-20">
        <button onClick={() => setActiveTaskType(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft size={20}/></button>
        <div className="text-center">
          <h3 className="text-sm font-black text-gray-900">真题模拟: {activeTaskType === 'CLOZE' ? '完形' : '阅读'}</h3>
          <p className="text-[10px] text-gray-400 font-black">EXAM SIMULATION 2020-2025</p>
        </div>
        <button onClick={() => startTask(activeTaskType)} className="p-2 text-brand-600 hover:bg-brand-50 rounded-full transition-colors"><RefreshCw size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-4xl mx-auto w-full pb-32 no-scrollbar">
        {passage && (
          <>
            {/* Global Technique Tip */}
            {passage.generalTechnique && (
              <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex gap-3 animate-slide-up">
                <div className="p-2 bg-orange-200 rounded-xl h-fit"><Zap size={16} className="text-orange-700"/></div>
                <div>
                  <span className="font-black text-orange-700 block text-[10px] uppercase mb-1">篇章解题大招</span>
                  <p className="text-xs text-orange-800 leading-relaxed font-bold">{passage.generalTechnique}</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h1 className="text-2xl font-black text-gray-900 mb-6 text-center leading-tight">{passage.title}</h1>
              <div className="font-serif text-lg text-gray-700 leading-relaxed whitespace-pre-wrap select-none">
                {activeTaskType === 'CLOZE' ? (
                  passage.content.split(/(\[\d+\])/g).map((part, i) => {
                    const match = part.match(/\[(\d+)\]/);
                    if (match) {
                      const idx = parseInt(match[1]);
                      const qId = passage.questions[idx - 1]?.id;
                      const isCorrect = isSubmitted && userAnswers[qId] === passage.questions[idx - 1]?.correctAnswer;
                      const isWrong = isSubmitted && userAnswers[qId] !== passage.questions[idx - 1]?.correctAnswer;
                      return (
                        <button key={i} onClick={() => !isSubmitted && setClozeIndex(idx)} className={`inline-flex items-center justify-center min-w-[32px] px-1 mx-1 border-b-2 font-black transition-all ${isSubmitted ? (isCorrect ? 'text-secondary-600 border-secondary-600 bg-secondary-50' : 'text-red-500 border-red-500 bg-red-50') : (clozeIndex === idx ? 'bg-brand-100 text-brand-600 border-brand-600' : 'text-gray-400 border-gray-300')}`}>
                          {userAnswers[qId] || `(${idx})`}
                        </button>
                      );
                    }
                    return <span key={i}>{part}</span>;
                  })
                ) : passage.content}
              </div>
            </div>

            <div className="space-y-4">
              {activeTaskType === 'READING' && passage.questions.map((q, idx) => (
                <div key={q.id} className={`bg-white p-5 rounded-2xl border transition-all ${isSubmitted ? (userAnswers[q.id] === q.correctAnswer ? 'border-secondary-100 bg-secondary-50/20' : 'border-red-100 bg-red-50/20') : 'border-gray-100 shadow-sm'}`}>
                  <h3 className="font-bold text-gray-800 mb-4 leading-snug"><span className="text-brand-600 mr-2">{idx + 1}.</span> {q.question}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, i) => (
                      <button key={i} disabled={isSubmitted} onClick={() => handleSelectOption(q.id, opt)} className={`p-3 text-left rounded-xl border-2 text-sm font-bold transition-all ${userAnswers[q.id] === opt ? (isSubmitted ? (opt === q.correctAnswer ? 'bg-secondary-500 border-secondary-500 text-white' : 'bg-red-500 border-red-500 text-white') : 'bg-brand-50 border-brand-500 text-brand-900 shadow-md') : (isSubmitted && opt === q.correctAnswer ? 'bg-secondary-100 border-secondary-500 text-secondary-900 font-black' : 'border-gray-100')}`}>
                        {String.fromCharCode(65 + i)}. {opt}
                      </button>
                    ))}
                  </div>
                  {isSubmitted && (
                    <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl animate-fade-in">
                       <div className="flex items-center gap-2 mb-2">
                         <Zap size={14} className="text-orange-500"/>
                         <span className="text-[10px] font-black text-orange-600 uppercase">此题大招: {q.techniqueTip || '定位同义项'}</span>
                       </div>
                       <p className="text-xs text-gray-600 italic leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isSubmitted && (
               <div className="space-y-6 animate-fade-in">
                  <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-xl flex items-center justify-between">
                     <div>
                        <h3 className="text-xl font-black">真题还原结算</h3>
                        <p className="text-xs opacity-60">Accuracy Rate: {Math.round((score/passage.questions.length)*100)}%</p>
                     </div>
                     <div className="text-4xl font-black text-brand-400">{score} <span className="text-sm text-white/40">/ {passage.questions.length}</span></div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <button onClick={() => setShowTranslation(!showTranslation)} className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                      <span className="font-bold text-gray-800 flex items-center gap-2"><Eye size={18} className="text-brand-500"/> 参考译文</span>
                      <ChevronRight className={`transition-transform ${showTranslation ? 'rotate-90' : ''}`} />
                    </button>
                    {showTranslation && <div className="p-6 border-t border-gray-50 text-gray-600 leading-relaxed text-sm bg-gray-50/30">{passage.translation}</div>}
                  </div>
               </div>
            )}
          </>
        )}
      </div>

      {/* Footer Submission Bar (Omitted duplicate logic for brevity, kept essential flow) */}
      {!isSubmitted && passage && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 z-30">
           <div className="max-w-4xl mx-auto flex items-center gap-4">
              <button onClick={() => setIsSubmitted(true)} className="w-full py-4 bg-brand-600 text-white rounded-2xl font-black shadow-lg shadow-brand-100 active:scale-95 transition-transform">确认交卷</button>
           </div>
        </div>
      )}

      {/* Floating Cloze Selection Omitted for brevity, follows same logic */}
      {!isSubmitted && activeTaskType === 'CLOZE' && clozeIndex !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center p-4">
           <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-black text-gray-900">请选择第 ({clozeIndex}) 题答案</h3>
                 <button onClick={() => setClozeIndex(null)} className="p-2 bg-gray-100 rounded-full"><XCircle size={16}/></button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                 {passage?.questions[clozeIndex - 1]?.options.map((opt, i) => (
                    <button key={i} onClick={() => handleSelectOption(passage!.questions[clozeIndex - 1].id, opt)} className={`p-4 text-left border-2 rounded-2xl font-bold transition-all ${userAnswers[passage!.questions[clozeIndex - 1].id] === opt ? 'bg-brand-50 border-brand-600' : 'border-gray-100'}`}>
                       {String.fromCharCode(65 + i)}. {opt}
                    </button>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
