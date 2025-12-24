
import React, { useState } from 'react';
import { Loader2, BookOpen, ChevronRight, Zap, ArrowLeft, RefreshCw, Eye } from 'lucide-react';
import { ReadingPassage, ReadingTaskType } from '../types';
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
          <p className="text-gray-500 max-sm text-sm">基于真题数据模型，实现“左文右题”高效训练模式。</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
          <button onClick={() => startTask('CLOZE')} className="flex flex-col items-center p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all active:scale-95 group">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Zap size={24} /></div>
            <span className="font-bold text-gray-800">完形填空</span>
            <span className="text-xs text-gray-400 mt-1">考察语境逻辑</span>
          </button>
          <button onClick={() => startTask('READING')} className="flex flex-col items-center p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all active:scale-95 group">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors"><Zap size={24} /></div>
            <span className="font-bold text-gray-800">阅读理解</span>
            <span className="text-xs text-gray-400 mt-1">考察信息定位</span>
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="animate-spin text-brand-600 mb-4" size={48} />
        <p className="text-lg font-bold">AI 正在加载真题文本...</p>
      </div>
    );
  }

  const score = (passage && passage.questions) ? passage.questions.reduce((acc, q) => acc + (userAnswers[q.id] === q.correctAnswer ? 1 : 0), 0) : 0;

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b flex justify-between items-center bg-white z-30 shadow-sm shrink-0">
        <button onClick={() => setActiveTaskType(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft size={20}/></button>
        <div className="text-center">
          <h3 className="text-sm font-black text-gray-900">{activeTaskType === 'CLOZE' ? '完形' : '阅读'}特训</h3>
          <p className="text-[10px] text-gray-400 font-black">TABLET SPLIT-SCREEN MODE ACTIVE</p>
        </div>
        <button onClick={() => startTask(activeTaskType)} className="p-2 text-brand-600 hover:bg-brand-50 rounded-full transition-colors"><RefreshCw size={20} /></button>
      </div>

      {/* Main Responsive Split Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT: Passage Side (Fixed/Scrollable) */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-y-auto border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50 p-4 md:p-8 no-scrollbar">
          {passage && (
            <div className="max-w-2xl mx-auto space-y-6">
              {passage.generalTechnique && (
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex gap-3 animate-fade-in">
                  <Zap size={20} className="text-orange-500 shrink-0" />
                  <div>
                    <span className="font-black text-orange-700 block text-[10px] uppercase">本篇解题技巧</span>
                    <p className="text-xs text-orange-800 font-bold">{passage.generalTechnique}</p>
                  </div>
                </div>
              )}
              
              <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
                <h1 className="text-2xl font-black text-gray-900 mb-8 text-center">{passage.title}</h1>
                <div className="font-serif text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {activeTaskType === 'CLOZE' ? (
                    passage.content?.split(/(\[\d+\])/g).map((part, i) => {
                      const match = part.match(/\[(\d+)\]/);
                      if (match) {
                        const idx = parseInt(match[1]);
                        const qId = passage.questions?.[idx - 1]?.id;
                        const isCorrect = isSubmitted && userAnswers[qId] === passage.questions?.[idx - 1]?.correctAnswer;
                        const isWrong = isSubmitted && userAnswers[qId] !== passage.questions?.[idx - 1]?.correctAnswer;
                        return (
                          <button 
                            key={i} 
                            onClick={() => !isSubmitted && setClozeIndex(idx)} 
                            className={`inline-flex items-center justify-center min-w-[36px] px-1 mx-1 border-b-2 font-black transition-all rounded-t-lg ${isSubmitted ? (isCorrect ? 'text-secondary-600 border-secondary-600 bg-secondary-50' : 'text-red-500 border-red-500 bg-red-50') : (clozeIndex === idx ? 'bg-brand-100 text-brand-600 border-brand-600' : 'text-gray-300 border-gray-200 hover:border-brand-300')}`}
                          >
                            {userAnswers[qId] || `(${idx})`}
                          </button>
                        );
                      }
                      return <span key={i}>{part}</span>;
                    })
                  ) : (
                    passage.content
                  )}
                </div>
              </div>

              {isSubmitted && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <button onClick={() => setShowTranslation(!showTranslation)} className="w-full p-4 flex justify-between items-center hover:bg-gray-50">
                    <span className="font-bold text-gray-800 flex items-center gap-2"><Eye size={18} className="text-brand-500"/> 查看全文明参考译文</span>
                    <ChevronRight className={`transition-transform ${showTranslation ? 'rotate-90' : ''}`} />
                  </button>
                  {showTranslation && <div className="p-6 border-t text-gray-600 leading-relaxed text-sm bg-gray-50/50">{passage.translation}</div>}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Interaction Side (Independent Scroll) */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-y-auto bg-white p-4 md:p-8 no-scrollbar pb-32">
          {passage && passage.questions && (
            <div className="max-w-2xl mx-auto space-y-6">
              {isSubmitted && (
                <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-xl flex items-center justify-between animate-scale-in">
                   <div>
                      <h3 className="text-xl font-black">训练结算</h3>
                      <p className="text-xs opacity-60 font-bold uppercase">College English II Simulation</p>
                   </div>
                   <div className="text-4xl font-black text-brand-400">{score} <span className="text-sm text-white/40">/ {passage.questions.length}</span></div>
                </div>
              )}

              <div className="space-y-6">
                {passage.questions.map((q, idx) => {
                  return (
                    <div 
                      key={q.id} 
                      id={`q-${idx}`}
                      className={`p-6 rounded-3xl border-2 transition-all duration-300 ${
                        isSubmitted 
                        ? (userAnswers[q.id] === q.correctAnswer ? 'border-secondary-100 bg-secondary-50/20' : 'border-red-100 bg-red-50/20') 
                        : (activeTaskType === 'CLOZE' && clozeIndex === idx + 1 ? 'border-brand-500 shadow-lg scale-[1.02]' : 'border-gray-50 shadow-sm')
                      }`}
                    >
                      <h3 className="font-bold text-gray-800 mb-4 leading-snug flex gap-3">
                        <span className="bg-gray-100 text-gray-500 w-6 h-6 flex items-center justify-center rounded-full text-xs shrink-0">{idx + 1}</span>
                        {q.question}
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {q.options.map((opt, i) => (
                          <button 
                            key={i} 
                            disabled={isSubmitted} 
                            onClick={() => handleSelectOption(q.id, opt)} 
                            className={`p-4 text-left rounded-2xl border-2 text-sm font-bold transition-all ${
                              userAnswers[q.id] === opt 
                              ? (isSubmitted ? (opt === q.correctAnswer ? 'bg-secondary-500 border-secondary-500 text-white' : 'bg-red-500 border-red-500 text-white') : 'bg-brand-50 border-brand-500 text-brand-900') 
                              : (isSubmitted && opt === q.correctAnswer ? 'bg-secondary-100 border-secondary-500 text-secondary-900 font-black' : 'border-gray-100 hover:bg-gray-50')
                            }`}
                          >
                            <span className="mr-3 opacity-40">{String.fromCharCode(65 + i)}.</span> {opt}
                          </button>
                        ))}
                      </div>
                      
                      {isSubmitted && (
                        <div className="mt-6 p-4 bg-white border border-gray-100 rounded-2xl shadow-inner animate-fade-in">
                           <div className="flex items-center gap-2 mb-2 text-orange-600">
                             <Zap size={14} />
                             <span className="text-[10px] font-black uppercase">本题解题大招: {q.techniqueTip || '同义项替换'}</span>
                           </div>
                           <p className="text-xs text-gray-500 leading-relaxed font-medium">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Submit Bar */}
      {!isSubmitted && passage && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-40">
           <div className="max-w-4xl mx-auto flex items-center gap-4">
              <button 
                onClick={() => setIsSubmitted(true)} 
                className="w-full py-4 bg-brand-600 text-white rounded-2xl font-black shadow-xl shadow-brand-100 active:scale-95 transition-transform"
              >
                交卷看解析报告
              </button>
           </div>
        </div>
      )}
    </div>
  );
};
