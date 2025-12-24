
import React, { useState, useEffect } from 'react';
import { Book, Check, AlertCircle, Sparkles, Loader2, ArrowRight, Eye, Lightbulb, Target, CheckCircle, XCircle, Info, HelpCircle, AlertTriangle, Zap, Bookmark, LayoutTemplate } from 'lucide-react';
import { MOCK_TENSES } from '../constants';
import { Tense, GrammarQuestion } from '../types';
import { generateTenseContent, generateDailyGrammarPractice } from '../services/geminiService';

const WRONG_GRAMMAR_KEY = 'upgrade_wrong_grammar';

export const GrammarModule: React.FC = () => {
  const [selectedTenseId, setSelectedTenseId] = useState<string>(MOCK_TENSES[0].id);
  const [tenseData, setTenseData] = useState<Tense>(MOCK_TENSES[0]);
  const [activeTab, setActiveTab] = useState<'LEARN' | 'PRACTICE'>('LEARN');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const found = MOCK_TENSES.find(t => t.id === selectedTenseId);
    if (found) setTenseData(found);
  }, [selectedTenseId]);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white p-4 shadow-sm border-b sticky top-0 z-10">
         <div className="relative">
           <select 
             value={selectedTenseId} 
             onChange={(e) => setSelectedTenseId(e.target.value)} 
             className="w-full appearance-none p-3 bg-gray-50 border border-gray-200 rounded-xl font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
           >
             <option value="ALL_MIXED">🔥 综合特训 (混合考点)</option>
             {MOCK_TENSES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
           </select>
           <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
             <ArrowRight size={16} className="rotate-90" />
           </div>
         </div>
      </div>
      <div className="flex border-b border-gray-200 bg-white">
        <button onClick={() => setActiveTab('LEARN')} className={`flex-1 py-4 text-sm font-black border-b-2 transition-all ${activeTab === 'LEARN' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-400'}`}>核心考点</button>
        <button onClick={() => setActiveTab('PRACTICE')} className={`flex-1 py-4 text-sm font-black border-b-2 transition-all ${activeTab === 'PRACTICE' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-400'}`}>每日训练</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Loader2 className="animate-spin mb-4 text-brand-600" size={40} />
            <p className="text-sm font-bold">正在整理考纲精华...</p>
          </div>
        ) : activeTab === 'LEARN' ? (
          <LearnView tense={tenseData} />
        ) : (
          <PracticeView 
            tenseId={selectedTenseId} 
            tenseName={selectedTenseId === 'ALL_MIXED' ? '综合' : tenseData.name} 
            onJumpToLearn={() => setActiveTab('LEARN')} 
          />
        )}
      </div>
    </div>
  );
};

const LearnView: React.FC<{ tense: Tense }> = ({ tense }) => {
  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-24 animate-fade-in">
      {/* Overview Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <Book size={80} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">{tense.name}</h2>
        <p className="text-gray-500 leading-relaxed text-sm mb-6 font-medium">{tense.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="p-4 bg-brand-50 rounded-2xl border border-brand-100">
             <div className="flex items-center gap-2 mb-2 text-brand-700">
               <Zap size={16} className="fill-brand-200" />
               <span className="text-xs font-black uppercase tracking-widest">核心公式</span>
             </div>
             <p className="text-xl font-black text-brand-600 font-mono tracking-tight">{tense.structure}</p>
           </div>
           
           <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
             <div className="flex items-center gap-2 mb-2 text-orange-700">
               <Lightbulb size={16} className="fill-orange-200" />
               <span className="text-xs font-black uppercase tracking-widest">速记口诀</span>
             </div>
             <p className="text-sm font-bold text-orange-800 leading-relaxed">{tense.mnemonic || '暂无速记口诀'}</p>
           </div>
        </div>
      </div>

      {/* Keywords & Time Indicators */}
      <section>
        <div className="flex items-center gap-2 px-2 mb-4">
          <Bookmark size={18} className="text-brand-500" />
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">考点标志词 (Indicators)</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {tense.keywords.map((word, i) => (
            <span key={i} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 shadow-sm hover:border-brand-300 transition-colors">
              {word}
            </span>
          ))}
        </div>
      </section>

      {/* Detailed Structures */}
      {tense.detailedStructures && (
        <section>
          <div className="flex items-center gap-2 px-2 mb-4">
            {/* Fix: LayoutTemplate icon component added to imports */}
            <LayoutTemplate size={18} className="text-brand-500" />
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">句式结构分解 (Details)</h3>
          </div>
          <div className="space-y-4">
            {tense.detailedStructures.map((ds, i) => (
              <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                 <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-black text-gray-500 uppercase">{ds.subject}</span>
                 </div>
                 <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <span className="text-[10px] font-black text-gray-400 uppercase">肯定句</span>
                       <p className="text-xs font-bold text-gray-800 bg-gray-50 p-2 rounded-lg">{ds.affirmative}</p>
                       <p className="text-xs italic text-gray-400">e.g. {ds.affirmativeExample}</p>
                    </div>
                    <div className="space-y-2">
                       <span className="text-[10px] font-black text-gray-400 uppercase">否定句</span>
                       <p className="text-xs font-bold text-gray-800 bg-gray-50 p-2 rounded-lg">{ds.negative}</p>
                       <p className="text-xs italic text-gray-400">e.g. {ds.negativeExample}</p>
                    </div>
                    <div className="space-y-2">
                       <span className="text-[10px] font-black text-gray-400 uppercase">疑问句</span>
                       <p className="text-xs font-bold text-gray-800 bg-gray-50 p-2 rounded-lg">{ds.question}</p>
                       <p className="text-xs italic text-gray-400">e.g. {ds.questionExample}</p>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Common Pitfalls / Error Comparisons */}
      {tense.commonErrors && (
        <section>
          <div className="flex items-center gap-2 px-2 mb-4">
            <AlertTriangle size={18} className="text-red-500" />
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">避坑指南 (Common Pitfalls)</h3>
          </div>
          <div className="space-y-4">
            {tense.commonErrors.map((error, i) => (
              <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                 <div className="bg-red-50 px-6 py-3 border-b border-red-100">
                    <span className="text-xs font-black text-red-600 uppercase">{error.point}</span>
                 </div>
                 <div className="p-6 space-y-4">
                    <div className="flex items-start gap-4">
                       <XCircle className="text-red-400 shrink-0 mt-1" size={18} />
                       <p className="text-sm font-medium text-gray-500 line-through decoration-red-200">{error.wrong}</p>
                    </div>
                    <div className="flex items-start gap-4">
                       <CheckCircle className="text-secondary-500 shrink-0 mt-1" size={18} />
                       <p className="text-sm font-bold text-gray-800">{error.correct}</p>
                    </div>
                    <div className="mt-4 p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500 border border-dashed border-gray-200">
                       <span className="font-black text-gray-400 uppercase mr-2">大招提示:</span>
                       {error.tip}
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Real Exam Scenarios */}
      {tense.examples && (
        <section>
          <div className="flex items-center gap-2 px-2 mb-4">
            <Target size={18} className="text-brand-500" />
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">历年真题呈现 (Real Exams)</h3>
          </div>
          <div className="space-y-4">
            {tense.examples.map((ex, i) => (
              <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="absolute top-4 right-4 bg-brand-50 text-brand-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">
                  {ex.year} 真题
                </div>
                <div className="pr-12">
                   <p className="text-sm font-bold text-gray-800 leading-relaxed mb-2 font-serif">{ex.en}</p>
                   <p className="text-xs text-gray-400">{ex.cn}</p>
                   {ex.note && (
                     <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Info size={12} /> {ex.note}
                     </div>
                   )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

// ... PracticeView and ReviewDashboard (Logic remains same, styling polished to match) ...

const PracticeView: React.FC<{ tenseId: string, tenseName: string, onJumpToLearn: () => void }> = ({ tenseId, tenseName, onJumpToLearn }) => {
  const [questions, setQuestions] = useState<GrammarQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [viewState, setViewState] = useState<'INTRO' | 'QUIZ' | 'REVIEW'>('INTRO');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [textInput, setTextInput] = useState('');

  const saveToWrongBook = (q: GrammarQuestion) => {
    const stored = localStorage.getItem(WRONG_GRAMMAR_KEY);
    const wrongList: GrammarQuestion[] = stored ? JSON.parse(stored) : [];
    if (!wrongList.find(item => item.id === q.id)) {
      wrongList.push(q);
      localStorage.setItem(WRONG_GRAMMAR_KEY, JSON.stringify(wrongList));
    }
  };

  const generateQuestions = async () => {
    setIsLoading(true);
    try {
      const qs = await generateDailyGrammarPractice(tenseName, 10);
      setQuestions(qs);
      setViewState('QUIZ');
      setCurrentIndex(0);
      setShowFeedback(false);
      setIsRevealed(false);
    } catch (e) {
      alert("题目生成失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = (answer: string) => {
    const updatedQs = [...questions];
    const q = updatedQs[currentIndex];
    const isCorrect = answer.trim().toLowerCase() === q.correctAnswer.toLowerCase();
    updatedQs[currentIndex] = { ...q, userAnswer: answer, isCorrect };
    setQuestions(updatedQs);
    
    setIsRevealed(isCorrect);
    setShowFeedback(true);
    if (!isCorrect) saveToWrongBook(updatedQs[currentIndex]);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setIsRevealed(false);
    setTextInput('');
    if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
    else setViewState('REVIEW');
  };

  if (viewState === 'INTRO') return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-6">
      <div className="bg-brand-50 p-8 rounded-full animate-bounce">
        <Sparkles size={64} className="text-brand-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-gray-900">{tenseName}专项训练</h2>
        <p className="text-gray-400 text-sm max-w-xs">基于 2020-2025 真题库生成的高品质仿真练习</p>
      </div>
      <button 
        onClick={generateQuestions} 
        disabled={isLoading}
        className="w-full max-w-xs py-4 bg-brand-600 text-white rounded-2xl font-black shadow-lg shadow-brand-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
      >
        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Target size={20} />}
        开始今日训练
      </button>
    </div>
  );

  if (viewState === 'REVIEW') return <ReviewDashboard questions={questions} onRetry={(i) => { setCurrentIndex(i); setViewState('QUIZ'); setShowFeedback(false); setIsRevealed(false); }} tenseName={tenseName} />;

  const currentQ = questions[currentIndex];
  
  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto">
       <div className="w-full bg-gray-200 h-1.5 rounded-full mb-8">
          <div className="bg-brand-500 h-1.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
       </div>
       
       <div className="flex-1 bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 mb-20 relative overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center mb-6">
            <span className="bg-brand-50 text-brand-600 text-[10px] font-black px-2 py-0.5 rounded uppercase">Question {currentIndex + 1}</span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 leading-relaxed mb-10">{currentQ.question}</h3>
          
          <div className="space-y-3">
            {currentQ.options ? currentQ.options.map((opt, i) => {
              const isSelected = currentQ.userAnswer === opt;
              const isCorrectOpt = opt === currentQ.correctAnswer;
              
              let btnClass = "w-full p-4 text-left border-2 rounded-2xl transition-all font-bold text-lg ";
              if (showFeedback) {
                if (isRevealed && isCorrectOpt) {
                   btnClass += "bg-secondary-50 border-secondary-500 text-secondary-900 shadow-sm";
                } else if (isSelected) {
                   btnClass += currentQ.isCorrect ? "bg-secondary-50 border-secondary-500 text-secondary-900 shadow-sm" : "bg-red-50 border-red-500 text-red-900";
                } else {
                   btnClass += "border-gray-50 opacity-40 text-gray-400";
                }
              } else {
                 btnClass += "border-gray-100 hover:border-brand-200 text-gray-700 active:bg-gray-50";
              }

              return (
                <button 
                  key={i} 
                  onClick={() => handleAnswerSubmit(opt)} 
                  disabled={showFeedback} 
                  className={btnClass}
                >
                  <span className="mr-3 opacity-30 font-mono">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              );
            }) : (
              <div className="flex flex-col gap-3">
                <input 
                  value={textInput} 
                  onChange={e => setTextInput(e.target.value)} 
                  disabled={showFeedback} 
                  placeholder="请输入答案..."
                  className="flex-1 p-4 border-2 border-gray-100 rounded-2xl focus:border-brand-500 outline-none font-bold text-lg" 
                />
                {!showFeedback && (
                  <button 
                    onClick={() => handleAnswerSubmit(textInput)} 
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black shadow-lg"
                  >
                    确认答案
                  </button>
                )}
              </div>
            )}
          </div>

          {showFeedback && (
            <div className="mt-8 space-y-4 animate-slide-up pb-4">
               {!isRevealed && !currentQ.isCorrect && (
                 <button 
                    onClick={() => setIsRevealed(true)}
                    className="w-full py-4 bg-brand-50 text-brand-700 border border-brand-200 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-brand-100 transition-colors"
                 >
                   <Eye size={18} /> 查看正确答案与解析
                 </button>
               )}

               {(isRevealed || currentQ.isCorrect) && (
                 <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 text-sm space-y-3 animate-fade-in">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                       <span className="font-black text-gray-400 uppercase text-[10px]">Reference 正确答案</span>
                       <span className="text-secondary-600 font-black text-lg">{currentQ.correctAnswer}</span>
                    </div>
                    <div>
                      <p className="font-black mb-1 text-gray-700 uppercase text-[10px]">Analysis 考点解析</p>
                      <p className="text-gray-600 leading-relaxed font-medium">{currentQ.explanation}</p>
                    </div>
                 </div>
               )}

               {(isRevealed || currentQ.isCorrect) && (
                 <button 
                   onClick={handleNext} 
                   className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                 >
                   下一题 <ArrowRight size={18} />
                 </button>
               )}
            </div>
          )}
       </div>
    </div>
  );
};

const ReviewDashboard: React.FC<{ questions: GrammarQuestion[], onRetry: (i: number) => void, tenseName: string }> = ({ questions, onRetry, tenseName }) => {
  const correctCount = questions.filter(q => q.isCorrect).length;
  const score = Math.round((correctCount / questions.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Target size={120} />
        </div>
        <div className="relative z-10">
          <h2 className="text-xl font-black mb-1">训练报告: {tenseName}</h2>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-5xl font-black text-brand-400">{score}</span>
            <span className="text-sm opacity-50 uppercase font-bold">Accuracy Rate</span>
          </div>
          <div className="flex gap-4">
             <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                <p className="text-[10px] font-black opacity-60 uppercase">Correct</p>
                <p className="text-xl font-black">{correctCount}</p>
             </div>
             <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                <p className="text-[10px] font-black opacity-60 uppercase">Total</p>
                <p className="text-xl font-black">{questions.length}</p>
             </div>
          </div>
        </div>
      </div>

      <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest px-2">错题回顾 (Review Errors)</h3>
      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={i} className={`p-5 rounded-2xl border transition-all ${q.isCorrect ? 'bg-white border-gray-100 opacity-60' : 'bg-red-50 border-red-100 shadow-sm ring-1 ring-red-100'}`}>
            <p className="text-sm font-bold text-gray-800 mb-3 leading-relaxed">{q.question}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {q.isCorrect ? <CheckCircle size={16} className="text-secondary-500" /> : <XCircle size={16} className="text-red-500" />}
                <span className={`text-xs font-black uppercase ${q.isCorrect ? 'text-secondary-600' : 'text-red-600'}`}>
                  {q.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              <button 
                onClick={() => onRetry(i)} 
                className="text-xs font-black text-brand-600 bg-brand-50 px-3 py-1.5 rounded-xl hover:bg-brand-100 transition-colors"
              >
                再次挑战
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
