
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowLeft, Trash2, CheckCircle, XCircle, RotateCcw, BookOpen, BrainCircuit, Sparkles, ChevronRight, Check } from 'lucide-react';
import { Word, GrammarQuestion, QuestionType } from '../types';

const WRONG_VOCAB_KEY = 'upgrade_wrong_vocab';
const WRONG_GRAMMAR_KEY = 'upgrade_wrong_grammar';

export const WrongBook: React.FC = () => {
  const [wrongVocab, setWrongVocab] = useState<Word[]>([]);
  const [wrongGrammar, setWrongGrammar] = useState<GrammarQuestion[]>([]);
  const [activeTab, setActiveTab] = useState<'VOCAB' | 'GRAMMAR'>('VOCAB');
  const [isPracticing, setIsPracticing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean, msg: string } | null>(null);

  useEffect(() => {
    const v = localStorage.getItem(WRONG_VOCAB_KEY);
    const g = localStorage.getItem(WRONG_GRAMMAR_KEY);
    if (v) setWrongVocab(JSON.parse(v));
    if (g) setWrongGrammar(JSON.parse(g));
  }, []);

  const saveToStorage = (type: 'VOCAB' | 'GRAMMAR', data: any[]) => {
    localStorage.setItem(type === 'VOCAB' ? WRONG_VOCAB_KEY : WRONG_GRAMMAR_KEY, JSON.stringify(data));
  };

  const handleRemoveItem = (id: string, type: 'VOCAB' | 'GRAMMAR') => {
    if (type === 'VOCAB') {
      const updated = wrongVocab.filter(w => w.id !== id);
      setWrongVocab(updated);
      saveToStorage('VOCAB', updated);
    } else {
      const updated = wrongGrammar.filter(g => g.id !== id);
      setWrongGrammar(updated);
      saveToStorage('GRAMMAR', updated);
    }
  };

  const handleStartPractice = () => {
    const list = activeTab === 'VOCAB' ? wrongVocab : wrongGrammar;
    if (list.length === 0) return;
    setIsPracticing(true);
    setCurrentIndex(0);
    setIsAnswered(false);
    setSelectedOption('');
    setFeedback(null);
  };

  const handleAnswer = (answer: string, correct: string) => {
    const isCorrect = answer.trim().toLowerCase() === correct.toLowerCase();
    setIsAnswered(true);
    setSelectedOption(answer);
    setFeedback({ isCorrect, msg: isCorrect ? '太棒了，这道题你已经掌握了！' : '还需要再巩固一下哦。' });
  };

  const handleNext = () => {
    const list = activeTab === 'VOCAB' ? wrongVocab : wrongGrammar;
    if (feedback?.isCorrect) {
       // 答对了，询问是否移除
       if (confirm("这道题已答对，是否将其从错题本中移除？")) {
          const currentId = list[currentIndex].id;
          handleRemoveItem(currentId, activeTab);
          if (currentIndex >= list.length - 1) {
             setIsPracticing(false);
             return;
          }
       }
    }

    if (currentIndex < list.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsAnswered(false);
      setSelectedOption('');
      setFeedback(null);
    } else {
      setIsPracticing(false);
    }
  };

  if (isPracticing) {
    const list = activeTab === 'VOCAB' ? wrongVocab : wrongGrammar;
    const item = list[currentIndex];

    return (
      <div className="h-full bg-white flex flex-col p-4">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setIsPracticing(false)} className="p-2 bg-gray-100 rounded-full"><XCircle size={20}/></button>
          <span className="font-mono text-sm">{currentIndex + 1} / {list.length}</span>
        </div>

        <div className="flex-1 space-y-6">
          <div className="bg-brand-50 p-6 rounded-3xl border border-brand-100">
             <h2 className="text-2xl font-bold text-brand-900 leading-relaxed text-center">
               {activeTab === 'VOCAB' ? (item as Word).spelling : (item as GrammarQuestion).question}
             </h2>
             {activeTab === 'VOCAB' && (item as Word).phonetic && <p className="text-center font-mono text-brand-400 mt-2">{(item as Word).phonetic}</p>}
          </div>

          <div className="space-y-3">
             {activeTab === 'VOCAB' ? (
                // 词汇重练简化为四选一
                ['掌握', '学习', '应用', (item as Word).meaning].sort().map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(opt, (item as Word).meaning)} disabled={isAnswered} className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${isAnswered ? (opt === (item as Word).meaning ? 'bg-secondary-50 border-secondary-500 text-secondary-900' : (opt === selectedOption ? 'bg-red-50 border-red-500' : 'opacity-50')) : 'border-gray-100 hover:bg-gray-50'}`}>
                    {opt}
                  </button>
                ))
             ) : (
                (item as GrammarQuestion).options?.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(opt, (item as GrammarQuestion).correctAnswer)} disabled={isAnswered} className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${isAnswered ? (opt === (item as GrammarQuestion).correctAnswer ? 'bg-secondary-50 border-secondary-500 text-secondary-900' : (opt === selectedOption ? 'bg-red-50 border-red-500' : 'opacity-50')) : 'border-gray-100 hover:bg-gray-50'}`}>
                    {opt}
                  </button>
                ))
             )}
          </div>

          {isAnswered && (
             <div className="p-4 bg-gray-50 rounded-2xl animate-fade-in">
                <p className={`font-bold mb-2 flex items-center gap-2 ${feedback?.isCorrect ? 'text-secondary-600' : 'text-red-500'}`}>
                   {feedback?.isCorrect ? <CheckCircle size={18}/> : <XCircle size={18}/>}
                   {feedback?.msg}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {(item as Word).memoryTip || (item as GrammarQuestion).explanation}
                </p>
                <button onClick={handleNext} className="w-full mt-6 py-4 bg-brand-600 text-white rounded-2xl font-bold">
                  {currentIndex === list.length - 1 ? '结束练习' : '下一题'}
                </button>
             </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col">
       <div className="bg-white p-4 border-b flex items-center gap-4">
          <NavLink to="/dashboard" className="p-2 bg-gray-50 rounded-full"><ArrowLeft size={20}/></NavLink>
          <h1 className="text-xl font-black">我的错题本</h1>
       </div>

       <div className="flex bg-white border-b">
          <button onClick={() => setActiveTab('VOCAB')} className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'VOCAB' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-400'}`}>词汇 ({wrongVocab.length})</button>
          <button onClick={() => setActiveTab('GRAMMAR')} className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'GRAMMAR' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-400'}`}>语法 ({wrongGrammar.length})</button>
       </div>

       <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {(activeTab === 'VOCAB' ? wrongVocab : wrongGrammar).map((item) => (
             <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 group relative">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="font-bold text-gray-900 text-lg">
                     {activeTab === 'VOCAB' ? (item as Word).spelling : (item as GrammarQuestion).question}
                   </h3>
                   <button onClick={() => handleRemoveItem(item.id, activeTab)} className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {activeTab === 'VOCAB' ? (item as Word).meaning : (item as GrammarQuestion).explanation}
                </p>
             </div>
          ))}

          {(activeTab === 'VOCAB' ? wrongVocab.length : wrongGrammar.length) === 0 && (
             <div className="h-64 flex flex-col items-center justify-center text-gray-300">
                <CheckCircle size={48} className="mb-2 opacity-50" />
                <p>暂无错题，继续保持！</p>
             </div>
          )}
       </div>

       <div className="p-4 bg-white border-t pb-24">
          <button 
            disabled={(activeTab === 'VOCAB' ? wrongVocab.length : wrongGrammar.length) === 0}
            onClick={handleStartPractice}
            className="w-full py-4 bg-brand-600 text-white rounded-2xl font-black shadow-xl shadow-brand-100 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RotateCcw size={20} /> 开始专项重练
          </button>
       </div>
    </div>
  );
};
