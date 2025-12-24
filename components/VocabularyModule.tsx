
import React, { useState, useEffect } from 'react';
import { Volume2, ChevronRight, ChevronLeft, RotateCcw, CheckCircle, XCircle, Info, Sparkles, Loader2, Lightbulb, Eye, X, Trash2, Brain, Filter, Zap, Check, ShieldAlert, AlertCircle } from 'lucide-react';
import { Word, QuizQuestion, QuestionType, WordFrequency } from '../types';
import { generateDailyWords } from '../services/geminiService';

const SEEN_WORDS_KEY = 'upgrade_english_seen_words';
const WRONG_VOCAB_KEY = 'upgrade_wrong_vocab';

export const VocabularyModule: React.FC = () => {
  const [mode, setMode] = useState<'LEARN' | 'QUIZ'>('LEARN');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [studyQueue, setStudyQueue] = useState<Word[]>([]);
  const [quizQueue, setQuizQueue] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [seenWords, setSeenWords] = useState<string[]>([]);
  const [selectedFreq, setSelectedFreq] = useState<WordFrequency>('HIGH');

  // Recitation Mode State
  const [isRecitationMode, setIsRecitationMode] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [spellingAttempt, setSpellingAttempt] = useState('');
  const [spellingFeedback, setSpellingFeedback] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');
  const [showWrongToast, setShowWrongToast] = useState(false);

  // Quiz State
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [textInput, setTextInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(SEEN_WORDS_KEY);
    if (stored) setSeenWords(JSON.parse(stored));
  }, []);

  const updateSeenWords = (newWords: Word[]) => {
    const spellings = newWords.map(w => w.spelling.toLowerCase());
    const updated = Array.from(new Set([...seenWords, ...spellings]));
    setSeenWords(updated);
    localStorage.setItem(SEEN_WORDS_KEY, JSON.stringify(updated));
  };

  const saveToWrongBook = (word: Word) => {
    const stored = localStorage.getItem(WRONG_VOCAB_KEY);
    const wrongList: Word[] = stored ? JSON.parse(stored) : [];
    
    // Check if word already exists
    const existingIndex = wrongList.findIndex(w => w.id === word.id);
    if (existingIndex === -1) {
      wrongList.push({ ...word, memoryTip: `【重点复习】此前拼写错误。${word.memoryTip || ''}` });
    }
    
    localStorage.setItem(WRONG_VOCAB_KEY, JSON.stringify(wrongList));
  };

  useEffect(() => {
    setIsDetailVisible(false);
    setSelectedOption('');
    setTextInput('');
    setIsAnswered(false);
    setIsRevealed(false);
    setSpellingAttempt('');
    setSpellingFeedback('IDLE');
    setShowWrongToast(false);
  }, [currentIndex, mode, isRecitationMode]);

  const handleGenerateDaily = async () => {
    setIsLoading(true);
    try {
      const response = await generateDailyWords(15, seenWords, selectedFreq); 
      const words = response.words || [];
      const quiz = response.quiz || [];

      if (words && words.length > 0) {
        setStudyQueue(words);
        setQuizQueue(quiz);
        setCurrentIndex(0);
        setMode('LEARN');
        updateSeenWords(words);
      }
    } catch (error) {
      alert("生成失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextWord = () => {
    if (currentIndex < studyQueue.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setMode('QUIZ');
      setCurrentIndex(0);
    }
  };

  const handleSpellingCheck = () => {
    const word = studyQueue[currentIndex];
    const isCorrect = spellingAttempt.trim().toLowerCase() === word.spelling.toLowerCase();
    
    if (isCorrect) {
      setSpellingFeedback('CORRECT');
      // Delay revealing the full content slightly to let the "Success Animation" play
      setTimeout(() => {
        setIsRevealed(true);
        setIsDetailVisible(true);
      }, 400);
    } else {
      setSpellingFeedback('WRONG');
      saveToWrongBook(word);
      setShowWrongToast(true);
      
      setTimeout(() => {
        setSpellingFeedback('IDLE');
        setSpellingAttempt('');
      }, 1000);
      
      setTimeout(() => {
        setShowWrongToast(false);
      }, 2500);
    }
  };

  const handleQuizSubmit = (correctAnswer: string) => {
    const currentQuestion = quizQueue[currentIndex];
    setIsAnswered(true);
    let isCorrect = false;
    if (currentQuestion.type === QuestionType.SPELLING) {
      isCorrect = textInput.trim().toLowerCase() === correctAnswer.toLowerCase();
    } else {
      isCorrect = selectedOption === correctAnswer;
    }
    
    if (isCorrect) setScore(prev => prev + 1);
    else {
      const wordObj = studyQueue.find(w => w.id === currentQuestion.wordId);
      if (wordObj) saveToWrongBook(wordObj);
    }
  };

  if (studyQueue.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
        <div className="bg-brand-50 p-6 rounded-full animate-bounce">
          <Zap size={48} className="text-brand-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900">13000 真题核心词</h2>
          <p className="text-gray-500 max-w-xs text-sm">已针对 2020-2025 历年真题进行词频提炼</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl w-full max-w-xs">
          {(['HIGH', 'MID', 'LOW'] as WordFrequency[]).map(f => (
            <button 
              key={f}
              onClick={() => setSelectedFreq(f)}
              className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${selectedFreq === f ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-400'}`}
            >
              {f === 'HIGH' ? '高频' : f === 'MID' ? '中频' : '低频'}
            </button>
          ))}
        </div>

        <button 
          onClick={handleGenerateDaily}
          className="w-full max-w-xs py-4 bg-brand-600 text-white rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 hover:bg-brand-700 active:scale-95 transition"
        >
          <Sparkles size={20} /> 开启今日刷词
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="animate-spin text-brand-600 mb-4" size={48} />
        <p className="font-bold">AI 正在调取 2020-2025 真题库...</p>
      </div>
    );
  }

  if (mode === 'LEARN') {
    const word = studyQueue[currentIndex];
    const progress = Math.round(((currentIndex + 1) / studyQueue.length) * 100);
    const isShowingActualContent = !isRecitationMode || isRevealed;
    const isSuccessHighlight = isRevealed && spellingFeedback === 'CORRECT';

    return (
      <div className="p-4 max-w-lg mx-auto h-full flex flex-col">
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            75% { transform: translateX(8px); }
          }
          .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
          @keyframes slideUpFade {
            from { transform: translateY(10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-slide-up-fade { animation: slideUpFade 0.3s ease-out forwards; }
          @keyframes successPulse {
            0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
            70% { box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); }
            100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
          }
          .animate-success-pulse { animation: successPulse 1.5s infinite; }
        `}</style>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded text-white ${word.frequency === 'HIGH' ? 'bg-red-500' : word.frequency === 'MID' ? 'bg-orange-500' : 'bg-gray-500'}`}>
              {word.frequency === 'HIGH' ? '高频' : word.frequency === 'MID' ? '中频' : '低频'}
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">{word.year || '13000 考纲'}</span>
          </div>
          <button 
            onClick={() => setIsRecitationMode(!isRecitationMode)} 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-xs font-black ${isRecitationMode ? 'bg-orange-100 text-orange-600 ring-2 ring-orange-200' : 'bg-gray-100 text-gray-400'}`}
          >
            <Brain size={14} />
            {isRecitationMode ? '背诵中' : '背诵模式'}
          </button>
        </div>
        
        <div className="w-full bg-gray-200 h-1.5 rounded-full mb-6">
          <div className="bg-brand-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
        </div>

        <div className={`bg-white rounded-3xl shadow-xl p-8 flex-1 flex flex-col items-center justify-center relative border transition-all duration-500 overflow-y-auto min-h-[400px] ${
          isSuccessHighlight ? 'border-secondary-500 shadow-[0_0_30px_rgba(16,185,129,0.15)] bg-secondary-50/20' : 'border-gray-100 shadow-xl bg-white'
        }`}>
            {showWrongToast && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[80%] z-30 animate-slide-up-fade">
                 <div className="bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                    <AlertCircle size={16} />
                    <span className="text-xs font-black">拼写有误，已标记并加入错题本</span>
                 </div>
              </div>
            )}

            <div className="text-center w-full mb-4">
              {isShowingActualContent ? (
                <div className="space-y-2">
                   <div className="flex items-center justify-center gap-3">
                      <h1 className={`text-5xl font-black mb-2 animate-scale-in tracking-tight transition-colors duration-500 ${isSuccessHighlight ? 'text-secondary-700' : 'text-gray-900'}`}>
                        {word.spelling}
                      </h1>
                      {isSuccessHighlight && <CheckCircle className="text-secondary-500 animate-bounce" size={28} />}
                   </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <div className="flex gap-1 justify-center">
                    {word.spelling.split('').map((char, i) => (
                      <span key={i} className="w-6 h-8 border-b-2 border-gray-200 flex items-center justify-center text-xl font-black text-gray-300">
                        {i === 0 ? char : ''}
                      </span>
                    ))}
                  </div>
                  
                  <div className="w-full max-w-xs space-y-4 animate-fade-in">
                    <div className="relative">
                      <input
                        type="text"
                        value={spellingAttempt}
                        autoFocus
                        onChange={(e) => {
                          setSpellingAttempt(e.target.value);
                          if (spellingFeedback !== 'IDLE') setSpellingFeedback('IDLE');
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSpellingCheck()}
                        placeholder="拼写该单词..."
                        className={`w-full p-4 text-center text-2xl font-black tracking-widest border-2 rounded-2xl outline-none transition-all ${
                          spellingFeedback === 'CORRECT' ? 'border-secondary-500 bg-secondary-50 text-secondary-700 animate-success-pulse' :
                          spellingFeedback === 'WRONG' ? 'border-red-500 bg-red-50 text-red-700 animate-shake' :
                          'border-gray-200 focus:border-brand-500 shadow-inner bg-gray-50/30'
                        }`}
                      />
                      {spellingFeedback === 'CORRECT' && <Check className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-500" size={24} />}
                      {spellingFeedback === 'WRONG' && <ShieldAlert className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500" size={24} />}
                    </div>
                    
                    <div className="flex gap-2">
                       <button 
                        onClick={handleSpellingCheck}
                        disabled={!spellingAttempt}
                        className="flex-1 py-3 bg-brand-600 text-white rounded-xl font-black text-sm shadow-lg disabled:opacity-50 active:scale-95 transition"
                      >
                        检查拼写
                      </button>
                      <button 
                        onClick={() => { setIsRevealed(true); setIsDetailVisible(true); }}
                        className="p-3 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition"
                      >
                        <Eye size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {isShowingActualContent && (
              <div className="flex items-center space-x-2 text-gray-400 mb-8 font-mono">
                {word.phonetic} <Volume2 size={24} className="text-brand-500 cursor-pointer hover:scale-110 transition" onClick={() => {
                  const u = new SpeechSynthesisUtterance(word.spelling); u.lang = 'en-US'; window.speechSynthesis.speak(u);
                }}/>
              </div>
            )}

            {isShowingActualContent && isDetailVisible ? (
              <div className="w-full space-y-5 animate-fade-in">
                <div className={`border-b pb-4 transition-colors duration-500 ${isSuccessHighlight ? 'border-secondary-200' : 'border-gray-100'}`}>
                  <span className={`inline-block font-black text-white px-2 py-0.5 rounded text-[10px] mr-2 uppercase transition-colors duration-500 ${isSuccessHighlight ? 'bg-secondary-500' : 'bg-brand-500'}`}>
                    {word.partOfSpeech}
                  </span>
                  <span className={`text-xl font-bold transition-colors duration-500 ${isSuccessHighlight ? 'text-secondary-900' : 'text-gray-800'}`}>
                    {word.meaning}
                  </span>
                </div>
                
                <div className={`p-4 rounded-2xl border transition-all duration-500 ${isSuccessHighlight ? 'bg-secondary-100/30 border-secondary-200' : 'bg-blue-50 border-blue-100'}`}>
                   <p className={`text-[10px] font-black uppercase mb-1 transition-colors duration-500 ${isSuccessHighlight ? 'text-secondary-600' : 'text-blue-600'}`}>真题还原</p>
                   <p className={`italic text-sm transition-colors duration-500 ${isSuccessHighlight ? 'text-secondary-800' : 'text-gray-700'}`}>"{word.example}"</p>
                </div>

                {word.examTechnique && (
                  <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex gap-3">
                    <div className="p-2 bg-orange-200 rounded-xl h-fit"><Zap size={16} className="text-orange-700"/></div>
                    <div>
                      <span className="font-black text-orange-700 block text-xs uppercase mb-1">解题大招</span>
                      <p className="text-xs text-orange-800 leading-relaxed font-medium">{word.examTechnique}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              isShowingActualContent && (
                <button onClick={() => setIsDetailVisible(true)} className="px-8 py-3 bg-brand-50 text-brand-600 rounded-full text-sm font-black active:scale-95 transition-transform">
                  查看详解
                </button>
              )
            )}
        </div>

        <div className="mt-6 flex gap-3 pb-8">
           <button onClick={() => currentIndex > 0 && setCurrentIndex(c => c - 1)} disabled={currentIndex === 0} className="flex-1 py-4 border border-gray-200 text-gray-400 rounded-2xl font-black disabled:opacity-30 transition-transform">上一个</button>
           <button onClick={handleNextWord} className="flex-[2] py-4 bg-gray-900 text-white rounded-2xl font-black shadow-xl active:scale-95 transition-transform">
             {currentIndex === studyQueue.length - 1 ? '开始测验' : '下一个'}
           </button>
        </div>
      </div>
    );
  }

  const question = quizQueue[currentIndex];
  return (
    <div className="p-4 max-w-lg mx-auto h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">13000 真题模拟</h2>
          <div className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black text-gray-500">{currentIndex + 1} / {quizQueue.length}</div>
       </div>
       <div className="bg-white rounded-3xl shadow-xl p-8 flex-1 border border-gray-100 overflow-y-auto relative">
          <div className="mb-8">
            <span className="inline-block px-2 py-0.5 bg-brand-100 text-brand-700 text-[10px] font-black rounded mb-3 uppercase">仿真练习</span>
            <h3 className="text-2xl font-bold text-gray-900 leading-tight">{question.question}</h3>
          </div>
          <div className="space-y-4">
             {question.options?.map((opt, idx) => (
               <button 
                 key={idx} 
                 disabled={isAnswered} 
                 onClick={() => setSelectedOption(opt)} 
                 className={`w-full p-5 text-left border-2 rounded-2xl transition-all font-medium text-lg ${
                   isAnswered 
                     ? (opt === question.correctAnswer ? 'bg-secondary-50 border-secondary-500 text-secondary-900' : (opt === selectedOption ? 'bg-red-50 border-red-500 text-red-900' : 'opacity-40')) 
                     : (selectedOption === opt ? 'border-brand-500 bg-brand-50 text-brand-900' : 'border-gray-100 hover:border-brand-200')
                 }`}
               >
                 {String.fromCharCode(65 + idx)}. {opt}
               </button>
             ))}
          </div>
          {isAnswered && (
             <div className="mt-8 space-y-4 animate-slide-up">
               <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-xs font-black text-blue-600 uppercase mb-2">出题逻辑</p>
                  <p className="text-sm text-blue-800 font-medium italic">"{question.examLogic || '考察词汇在特定语境下的同义辨析。'}"</p>
               </div>
               <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 text-sm">
                 <p className="font-bold mb-1 text-gray-700">解析：</p>
                 <p className="text-gray-600 leading-relaxed">{question.explanation}</p>
               </div>
             </div>
          )}
       </div>
       <div className="mt-6 pb-20">
          {!isAnswered ? (
            <button disabled={!selectedOption} onClick={() => handleQuizSubmit(question.correctAnswer)} className="w-full py-5 bg-brand-600 text-white rounded-2xl font-black shadow-xl active:scale-95 transition-transform">提交答案</button>
          ) : (
             <button onClick={() => currentIndex < quizQueue.length - 1 ? (setCurrentIndex(c => c + 1), setIsAnswered(false), setSelectedOption('')) : (setMode('LEARN'), setStudyQueue([]))} className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black shadow-xl active:scale-95 transition-transform">
               {currentIndex === quizQueue.length - 1 ? '完成任务' : '继续挑战'}
             </button>
          )}
       </div>
    </div>
  );
};
