
import React, { useState } from 'react';
import { Sparkles, AlertTriangle, ChevronDown, Loader2, RefreshCw, LayoutTemplate, Columns, ArrowRight, Settings2 } from 'lucide-react';
import { MOCK_TOPICS } from '../constants';
import { GradingResult, RewriteLevel, RewriteResult } from '../types';
import { gradeEssay, generateEssayResources, rewriteEssay } from '../services/geminiService';

export const WritingModule: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(MOCK_TOPICS[0].id);
  const [essayContent, setEssayContent] = useState('');
  
  // Grading State
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  
  // Template/Resource State
  const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);
  const [generatedResources, setGeneratedResources] = useState<{ basic: string, advanced: string, keywords: string[] } | null>(null);

  // Split Screen & Comparison State
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonTab, setComparisonTab] = useState<'BASIC' | 'ADVANCED' | 'REWRITE'>('BASIC');
  
  // Rewrite State
  const [rewriteLevel, setRewriteLevel] = useState<RewriteLevel>('BASIC');
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewriteResult, setRewriteResult] = useState<RewriteResult | null>(null);

  const topic = MOCK_TOPICS.find(t => t.id === selectedTopicId) || MOCK_TOPICS[0];

  const handleGenerateTemplates = async () => {
    setIsGeneratingTemplate(true);
    try {
      const res = await generateEssayResources(topic.title);
      setGeneratedResources({
        basic: res.basicTemplate,
        advanced: res.advancedTemplate,
        keywords: res.keywords
      });
      setShowComparison(true);
      setComparisonTab('BASIC');
    } catch (e) {
      alert("模板生成失败，请重试");
    } finally {
      setIsGeneratingTemplate(false);
    }
  };

  const handleApplyTemplate = (level: 'basic' | 'advanced') => {
    const templateText = generatedResources 
      ? (level === 'basic' ? generatedResources.basic : generatedResources.advanced)
      : (level === 'basic' ? topic.template.basic : topic.template.advanced);

    if (essayContent.length > 10) {
       if (!confirm("应用模板将覆盖当前内容，确定吗？")) return;
    }
    setEssayContent(templateText);
  };

  const handleGrade = async () => {
    if (essayContent.length < 20) {
      alert("内容太短，请至少输入20个单词。");
      return;
    }
    
    setIsGrading(true);
    setGradingResult(null);
    setShowComparison(false);
    
    try {
      const result = await gradeEssay(topic.title, essayContent);
      setGradingResult(result);
    } catch (error) {
      alert("批改失败，请稍后重试");
    } finally {
      setIsGrading(false);
    }
  };

  const handleRewriteAction = async () => {
    if (essayContent.length < 10) {
      alert("请先输入一些内容再进行改写。");
      return;
    }
    setIsRewriting(true);
    setShowComparison(true);
    setComparisonTab('REWRITE');
    setRewriteResult(null);

    try {
      const result = await rewriteEssay(topic.title, essayContent, rewriteLevel);
      setRewriteResult(result);
    } catch (e) {
      alert("改写失败，请重试");
    } finally {
      setIsRewriting(false);
    }
  };

  const handleInsertKeyword = (keyword: string) => {
    setEssayContent(prev => prev + (prev.endsWith(' ') ? '' : ' ') + keyword);
  };

  const getCurrentTemplate = (type: 'BASIC' | 'ADVANCED') => {
    if (generatedResources) {
      return type === 'BASIC' ? generatedResources.basic : generatedResources.advanced;
    }
    return type === 'BASIC' ? topic.template.basic : topic.template.advanced;
  };

  const rewriteLevels = [
    { id: 'BASIC', label: '基础纠错', desc: '语法与拼写', color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'UPGRADE', label: '语句升级', desc: '高级表达', color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'LOGIC', label: '逻辑优化', desc: '结构与连贯', color: 'text-green-600', bg: 'bg-green-50' }
  ] as { id: RewriteLevel, label: string, desc: string, color: string, bg: string }[];

  return (
    <div className="h-full flex flex-col bg-gray-50 max-w-6xl mx-auto md:px-4">
      {/* Header Selector */}
      <div className="bg-white p-4 shadow-sm z-20 sticky top-0 md:rounded-b-xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:w-auto flex-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">当前话题</label>
          <div className="relative mt-1">
            <select 
              value={selectedTopicId}
              onChange={(e) => {
                setSelectedTopicId(e.target.value);
                setEssayContent('');
                setGradingResult(null);
                setGeneratedResources(null);
                setRewriteResult(null);
              }}
              className="w-full appearance-none p-3 pr-10 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {MOCK_TOPICS.map(t => (
                <option key={t.id} value={t.id}>{t.title} ({t.subCategory})</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          {!generatedResources ? (
             <button 
               onClick={handleGenerateTemplates}
               disabled={isGeneratingTemplate}
               className="flex-1 sm:flex-none py-2 px-4 bg-brand-50 border border-brand-200 text-brand-700 text-sm font-bold rounded-lg hover:bg-brand-100 flex items-center justify-center gap-2"
             >
               {isGeneratingTemplate ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
               AI 生成真题模板
             </button>
          ) : (
            <button 
               onClick={() => {
                 setShowComparison(!showComparison);
                 if (!showComparison) setComparisonTab('BASIC');
               }}
               className={`flex-1 sm:flex-none py-2 px-4 border text-sm font-bold rounded-lg flex items-center justify-center gap-2 ${showComparison ? 'bg-brand-100 text-brand-700 border-brand-200' : 'bg-white text-gray-600 border-gray-200'}`}
             >
               <Columns size={16} /> {showComparison ? '隐藏对照' : '显示对照'}
             </button>
          )}
        </div>
      </div>

      {/* Main Split Layout */}
      <div className={`flex-1 overflow-hidden p-4 flex flex-col md:flex-row gap-4 ${showComparison ? '' : 'justify-center'}`}>
        
        {/* LEFT PANEL: Editor & Basic Tools */}
        <div className={`flex flex-col gap-4 transition-all duration-300 ${showComparison ? 'md:w-1/2 h-full' : 'w-full h-full max-w-3xl mx-auto'}`}>
           
           {/* Requirements Card */}
           <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl shrink-0">
             <div className="flex justify-between items-start mb-2">
               <h3 className="font-bold text-blue-900">题目要求</h3>
               <span className="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded font-mono">{topic.year}真题</span>
             </div>
             <p className="text-sm text-blue-800 mb-3">{topic.requirement}</p>
             <div className="flex flex-wrap gap-2 items-center">
               <span className="text-xs font-bold text-blue-400">推荐词:</span>
               {(generatedResources?.keywords || topic.keywords).slice(0, 5).map((k, i) => (
                 <button 
                   key={i} 
                   onClick={() => handleInsertKeyword(k)}
                   className="text-xs bg-white text-blue-600 px-2 py-0.5 rounded border border-blue-100 hover:bg-blue-100 transition"
                 >
                   {k} +
                 </button>
               ))}
             </div>
           </div>

           {/* Editor Area */}
           <div className="relative flex-1 flex flex-col">
              <textarea 
                value={essayContent}
                onChange={(e) => setEssayContent(e.target.value)}
                placeholder="在此输入你的作文..."
                className="w-full h-full p-4 text-base leading-relaxed bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none shadow-inner font-serif"
              />
              <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-white/80 px-2 rounded pointer-events-none">
                 {essayContent.split(/\s+/).filter(w => w.length > 0).length} words
              </div>
           </div>

           {/* Rewrite Level Selection & Action */}
           <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-4 shadow-sm">
             <div className="flex items-center gap-2 mb-1">
                <Settings2 size={16} className="text-gray-400" />
                <span className="text-xs font-black text-gray-500 uppercase tracking-widest">改写偏好设置</span>
             </div>
             
             <div className="grid grid-cols-3 gap-2">
               {rewriteLevels.map((level) => (
                 <button
                   key={level.id}
                   onClick={() => setRewriteLevel(level.id)}
                   className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${
                     rewriteLevel === level.id 
                       ? 'border-brand-500 bg-brand-50 shadow-sm' 
                       : 'border-gray-50 hover:border-gray-100 bg-gray-50/50'
                   }`}
                 >
                   <span className={`text-xs font-black ${rewriteLevel === level.id ? 'text-brand-700' : 'text-gray-500'}`}>
                     {level.label}
                   </span>
                   <span className="text-[10px] text-gray-400 scale-90 whitespace-nowrap">{level.desc}</span>
                 </button>
               ))}
             </div>

             <div className="flex gap-2">
                <button 
                  onClick={handleRewriteAction}
                  disabled={isRewriting}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                >
                  {isRewriting ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                  执行 AI 改写
                </button>
                <button 
                  onClick={handleGrade}
                  disabled={isGrading}
                  className="flex-1 py-3 bg-brand-600 text-white rounded-xl font-bold shadow-lg hover:bg-brand-700 disabled:opacity-70 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  {isGrading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                  提交 AI 批改
                </button>
             </div>
           </div>
        </div>

        {/* RIGHT PANEL: Comparison & Templates */}
        {showComparison && (
          <div className="md:w-1/2 h-full flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slide-left">
             <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto no-scrollbar">
                <button 
                  onClick={() => setComparisonTab('BASIC')}
                  className={`flex-1 py-3 px-4 text-sm font-bold whitespace-nowrap ${comparisonTab === 'BASIC' ? 'bg-white text-brand-600 border-t-2 border-brand-500' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  基础模板
                </button>
                <button 
                  onClick={() => setComparisonTab('ADVANCED')}
                  className={`flex-1 py-3 px-4 text-sm font-bold whitespace-nowrap ${comparisonTab === 'ADVANCED' ? 'bg-white text-purple-600 border-t-2 border-purple-500' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  高分模板
                </button>
                <button 
                  onClick={() => setComparisonTab('REWRITE')}
                  className={`flex-1 py-3 px-4 text-sm font-bold whitespace-nowrap ${comparisonTab === 'REWRITE' ? 'bg-white text-indigo-600 border-t-2 border-indigo-500' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  AI 改写对照
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-6 bg-white no-scrollbar">
                {comparisonTab === 'REWRITE' ? (
                   isRewriting ? (
                     <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                       <Loader2 className="animate-spin text-indigo-500" size={32} />
                       <p className="text-sm">正在按照“{rewriteLevels.find(l => l.id === rewriteLevel)?.label}”级别优化...</p>
                     </div>
                   ) : rewriteResult ? (
                     <div className="space-y-6">
                        <div className="flex justify-between items-center bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                           <span className="text-xs font-bold text-indigo-700 uppercase">{rewriteResult.level} OPTIMIZATION</span>
                           <span className="text-xs text-indigo-500">字数: {rewriteResult.wordCountDiff.original} → {rewriteResult.wordCountDiff.rewritten}</span>
                        </div>
                        
                        <div className="space-y-4">
                           <div className="space-y-1">
                             <div className="text-xs font-bold text-gray-400 uppercase">Original</div>
                             <div className="p-3 bg-red-50/50 rounded-lg text-gray-600 text-sm leading-relaxed line-through decoration-red-200">
                               {rewriteResult.original}
                             </div>
                           </div>
                           
                           <div className="flex justify-center text-gray-300"><ArrowRight className="rotate-90" size={20}/></div>
                           
                           <div className="space-y-1">
                             <div className="text-xs font-bold text-gray-400 uppercase">Rewritten</div>
                             <div className="p-3 bg-green-50 rounded-lg text-gray-800 text-sm leading-relaxed border border-green-100">
                               {rewriteResult.rewritten}
                             </div>
                           </div>
                        </div>

                        <div className="space-y-3">
                           <h4 className="font-bold text-gray-800 text-sm">修改详情</h4>
                           {rewriteResult.changes.map((change, i) => (
                             <div key={i} className="text-xs border-l-2 pl-3 py-1 space-y-1 border-indigo-200">
                                <div className="flex items-center gap-2">
                                   <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white ${
                                     change.type === 'FIX' ? 'bg-red-500' : change.type === 'UPGRADE' ? 'bg-blue-500' : 'bg-green-500'
                                   }`}>
                                     {change.type}
                                   </span>
                                   <span className="text-gray-500">{change.reason}</span>
                                </div>
                                <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center text-gray-600">
                                   <span className="line-through decoration-red-300 opacity-70 bg-red-50 px-1 rounded">{change.originalSpan}</span>
                                   <span>→</span>
                                   <span className="font-bold text-gray-800 bg-green-50 px-1 rounded">{change.newSpan}</span>
                                </div>
                             </div>
                           ))}
                        </div>
                        <button 
                          onClick={() => { setEssayContent(rewriteResult.rewritten); setShowComparison(false); }}
                          className="w-full py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm border border-indigo-100"
                        >
                          采用此次改写结果
                        </button>
                     </div>
                   ) : (
                     <div className="text-center text-gray-400 py-10">
                       <RefreshCw size={32} className="mx-auto mb-2 opacity-50" />
                       <p className="text-sm">点击左侧“执行 AI 改写”查看结果</p>
                     </div>
                   )
                ) : (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-xs text-yellow-800 flex gap-2">
                      <LayoutTemplate size={16} />
                      {comparisonTab === 'BASIC' 
                        ? '基础模板：适合词汇量较小的同学，保证结构完整，拿稳及格分。' 
                        : '高分模板：使用复合句和高级连接词，适合冲刺高分。'}
                    </div>
                    
                    <div className="whitespace-pre-wrap font-serif text-gray-700 leading-relaxed text-sm p-4 border rounded-xl relative">
                      {getCurrentTemplate(comparisonTab).split(/(\[.*?\])/g).map((part, i) => {
                         if (part.startsWith('[') && part.endsWith(']')) {
                           return <span key={i} className="bg-yellow-200 text-yellow-900 font-bold px-1 rounded cursor-pointer" title="点击填充至左侧" onClick={() => {
                             setEssayContent(prev => prev + (prev ? '\n' : '') + " " + part);
                           }}>{part}</span>
                         }
                         return <span key={i}>{part}</span>
                      })}
                    </div>

                    <button 
                      onClick={() => handleApplyTemplate(comparisonTab === 'BASIC' ? 'basic' : 'advanced')}
                      className="w-full py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50"
                    >
                      全部应用此模板
                    </button>
                  </div>
                )}
             </div>
          </div>
        )}

      </div>

      {/* Grading Result Overlay */}
      {!showComparison && gradingResult && (
        <div className="p-4 md:px-0 animate-fade-in pb-20 max-w-3xl mx-auto w-full">
           <div className="bg-white p-6 rounded-2xl shadow-lg border border-brand-100 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"></div>
               <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-lg font-bold text-gray-900">批改报告</h3>
                    <p className="text-xs text-gray-500">Based on College English II Standards</p>
                 </div>
                 <div className="text-right">
                    <div className="text-4xl font-extrabold text-brand-600">{gradingResult.score} <span className="text-sm text-gray-400">/ 15</span></div>
                 </div>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                   <div className="bg-gray-50 p-3 rounded-lg text-center">
                     <div className="text-xs text-gray-500">内容</div>
                     <div className="font-bold text-gray-800">{gradingResult.breakdown.content}/4</div>
                   </div>
                   <div className="bg-gray-50 p-3 rounded-lg text-center">
                     <div className="text-xs text-gray-500">语法</div>
                     <div className="font-bold text-gray-800">{gradingResult.breakdown.grammar}/4</div>
                   </div>
                   <div className="bg-gray-50 p-3 rounded-lg text-center">
                     <div className="text-xs text-gray-500">词汇</div>
                     <div className="font-bold text-gray-800">{gradingResult.breakdown.vocabulary}/4</div>
                   </div>
                   <div className="bg-gray-50 p-3 rounded-lg text-center">
                     <div className="text-xs text-gray-500">结构</div>
                     <div className="font-bold text-gray-800">{gradingResult.breakdown.structure}/3</div>
                   </div>
               </div>

               <p className="text-sm text-gray-700 italic border-l-4 border-brand-300 pl-3 py-1 mb-6">
                 "{gradingResult.generalAdvice}"
               </p>

               {gradingResult.corrections.length > 0 && (
                 <div className="space-y-3">
                   <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                     <AlertTriangle size={16} className="text-red-500"/> 核心纠错
                   </h4>
                   {gradingResult.corrections.map((c, i) => (
                     <div key={i} className="text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                        <div className="mb-1">
                          <span className="line-through text-red-400 mr-2">{c.original}</span>
                          <span className="text-green-600 font-bold">{c.correction}</span>
                        </div>
                        <p className="text-xs text-red-800">{c.reason}</p>
                     </div>
                   ))}
                 </div>
               )}
           </div>
        </div>
      )}
    </div>
  );
};
