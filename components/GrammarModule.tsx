
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
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      <div className="bg-white p-4 shadow-sm border-b sticky top-0 z-10 shrink-0">
         <div className="relative max-w-2xl mx-auto">
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
      
      <div className="flex border-b border-gray-200 bg-white shrink-0 md:hidden">
        <button onClick={() => setActiveTab('LEARN')} className={`flex-1 py-4 text-sm font-black border-b-2 transition-all ${activeTab === 'LEARN' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-400'}`}>核心考点</button>
        <button onClick={() => setActiveTab('PRACTICE')} className={`flex-1 py-4 text-sm font-black border-b-2 transition-all ${activeTab === 'PRACTICE' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-400'}`}>每日训练</button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Responsive Dual Pane Logic */}
        <div className={`md:w-1/2 h-full overflow-y-auto bg-gray-50/50 p-4 md:p-8 no-scrollbar ${activeTab === 'PRACTICE' ? 'hidden md:block' : 'block'}`}>
           <LearnView tense={tenseData} />
        </div>
        
        <div className={`md:w-1/2 h-full overflow-y-auto bg-white p-4 md:p-8 no-scrollbar ${activeTab === 'LEARN' ? 'hidden md:block' : 'block'}`}>
           <PracticeView 
            tenseId={selectedTenseId} 
            tenseName={selectedTenseId === 'ALL_MIXED' ? '综合' : tenseData.name} 
            onJumpToLearn={() => setActiveTab('LEARN')} 
          />
        </div>
      </div>
    </div>
  );
};

const LearnView: React.FC<{ tense: Tense }> = ({ tense }) => {
  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-24 animate-fade-in">
      {/* Overview Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5"><Book size={80} /></div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">{tense.name}</h2>
        <p className="text-gray-500 leading-relaxed text-sm mb-6 font-medium">{tense.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="p-4 bg-brand-50 rounded-2xl border border-brand-100">
             <div className="flex items-center gap-2 mb-2 text-brand-700">
               <Zap size={14} className="fill-brand-200" />
               <span className="text-xs font-black uppercase tracking-widest">核心公式</span>
             </div>
             <p className="text-lg font-black text-brand-600 font-mono">{tense.structure}</p>
           </div>
           
           <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
             <div className="flex items-center gap-2 mb-2 text-orange-700">
               <Lightbulb size={14} className="fill-orange-200" />
               <span className="text-xs font-black uppercase tracking-widest">速记口诀</span>
             </div>
             <p className="text-xs font-bold text-orange-800 leading-relaxed">{tense.mnemonic || '考纲重点，务必背诵'}</p>
           </div>
        </div>
      </div>

      <section>
        <div className="flex items-center gap-2 px-2 mb-4">
          <Bookmark size={18} className="text-brand-500" />
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">标志词 (Indicators)</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {tense.keywords.map((word, i) => (
            <span key={i} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 shadow-sm">{word}</span>
          ))}
        </div>
      </section>

      {tense.commonErrors && (
        <section>
          <div className="flex items-center gap-2 px-2 mb-4">
            <AlertTriangle size={18} className="text-red-500" />
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">避坑指南 (Pitfalls)</h3>
          </div>
          <div className="space-y-3">
            {tense.commonErrors.map((error, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-4">
                 <div className="text-[10px] font-black text-red-600 uppercase mb-2">易错点: {error.point}</div>
                 <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-400 line-through">Wrong: {error.wrong}</p>
                    <p className="text-xs font-bold text-gray-800">Correct: {error.correct}</p>
                 </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tense.examples && (
        <section>
          <div className="flex items-center gap-2 px-2 mb-4">
            <Target size={18} className="text-brand-500" />
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">历年真题呈现</h3>
          </div>
          <div className="space-y-3">
            {tense.examples.map((ex, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-xs group">
                <div className="text-brand-600 font-black mb-1">[{ex.year} 真题]</div>
                <p className="font-bold text-gray-800 mb-1">{ex.en}</p>
                <p className="text-gray-400 italic">{ex.cn}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

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
        <p className="text-gray-400 text-sm max-w-xs">基于真题库生成的 10 道仿真练习题</p>
      </div>
      <button 
        onClick={generateQuestions} 
        disabled={isLoading}
        className="w-full max-w-xs py-4 bg-brand-600 text-white rounded-2xl font-black shadow-lg shadow-brand-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
      >
        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Target size={20} />}
        开启实战练习
      </button>
    </div>
  );

  if (viewState === 'REVIEW') return <ReviewDashboard questions={questions} onRetry={(i) => { setCurrentIndex(i); setViewState('QUIZ'); setShowFeedback(false); setIsRevealed(false); }} tenseName={tenseName} />;

  const currentQ = questions[currentIndex];
  
  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto py-4">
       <div className="w-full bg-gray-200 h-1 rounded-full mb-8">
          <div className="bg-brand-500 h-1 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
       </div>
       
       <div className="bg-white p-6 md:p-10 rounded-3xl shadow-lg border border-gray-100 mb-20">
          <span className="bg-brand-50 text-brand-600 text-[10px] font-black px-2 py-0.5 rounded uppercase mb-4 inline-block">Question {currentIndex + 1}</span>
          <h3 className="text-xl font-bold text-gray-900 leading-relaxed mb-10">{currentQ.question}</h3>
          
          <div className="space-y-3">
            {currentQ.options ? currentQ.options.map((opt, i) => (
              <button 
                key={i} 
                onClick={() => handleAnswerSubmit(opt)} 
                disabled={showFeedback} 
                className={`w-full p-4 text-left border-2 rounded-2xl transition-all font-bold text-lg ${
                  showFeedback 
                  ? (opt === currentQ.correctAnswer ? 'bg-secondary-50 border-secondary-500 text-secondary-900' : (currentQ.userAnswer === opt ? 'bg-red-50 border-red-500 text-red-900' : 'opacity-40')) 
                  : 'border-gray-100 hover:border-brand-200 active:bg-gray-50'
                }`}
              >
                <span className="mr-3 opacity-20">{String.fromCharCode(65 + i)}.</span> {opt}
              </button>
            )) : (
              <div className="flex flex-col gap-3">
                <input 
                  value={textInput} 
                  onChange={e => setTextInput(e.target.value)} 
                  disabled={showFeedback} 
                  placeholder="请输入答案..."
                  className="flex-1 p-4 border-2 border-gray-100 rounded-2xl focus:border-brand-500 outline-none font-bold text-lg" 
                />
                {!showFeedback && <button onClick={() => handleAnswerSubmit(textInput)} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black">确认</button>}
              </div>
            )}
          </div>

          {showFeedback && (
            <div className="mt-8 space-y-4 animate-slide-up">
               {(isRevealed || currentQ.isCorrect) ? (
                 <>
                   <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-sm">
                      <p className="font-black mb-1 text-brand-600 uppercase text-[10px]">考点深度解析</p>
                      <p className="text-gray-600 leading-relaxed font-medium">{currentQ.explanation}</p>
                   </div>
                   <button onClick={handleNext} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black shadow-xl flex items-center justify-center gap-2">下一题 <ArrowRight size={18} /></button>
                 </>
               ) : (
                 <button onClick={() => setIsRevealed(true)} className="w-full py-4 bg-brand-50 text-brand-700 border border-brand-200 rounded-2xl font-black">查看详解</button>
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
    <div className="max-w-2xl mx-auto space-y-6 pb-24 py-4">
      <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <h2 className="text-xl font-black mb-1">训练得分报告</h2>
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-5xl font-black text-brand-400">{score}</span>
          <span className="text-sm opacity-50 uppercase font-bold">Accuracy</span>
        </div>
        <div className="flex gap-4">
           <div className="bg-white/10 px-4 py-2 rounded-xl"><p className="text-xl font-black">{correctCount}</p><p className="text-[10px] font-black opacity-60">Correct</p></div>
           <div className="bg-white/10 px-4 py-2 rounded-xl"><p className="text-xl font-black">{questions.length}</p><p className="text-[10px] font-black opacity-60">Total</p></div>
        </div>
      </div>
      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={i} className={`p-5 rounded-2xl border transition-all ${q.isCorrect ? 'bg-white border-gray-100 opacity-60' : 'bg-red-50 border-red-100 shadow-sm'}`}>
            <p className="text-sm font-bold text-gray-800 mb-3">{q.question}</p>
            <button onClick={() => onRetry(i)} className="text-xs font-black text-brand-600 bg-brand-50 px-3 py-1.5 rounded-xl">重练此题</button>
          </div>
        ))}
      </div>
    </div>
  );
};
