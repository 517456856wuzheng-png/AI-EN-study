
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, 
  CartesianGrid 
} from 'recharts';
import { Trophy, Clock, Target, Calendar, TrendingUp, BookMarked, ArrowRight, BookOpenCheck } from 'lucide-react';

const WRONG_VOCAB_KEY = 'upgrade_wrong_vocab';
const WRONG_GRAMMAR_KEY = 'upgrade_wrong_grammar';

export const Dashboard: React.FC = () => {
  const [wrongVocabCount, setWrongVocabCount] = useState(0);
  const [wrongGrammarCount, setWrongGrammarCount] = useState(0);

  useEffect(() => {
    const vocab = localStorage.getItem(WRONG_VOCAB_KEY);
    const grammar = localStorage.getItem(WRONG_GRAMMAR_KEY);
    setWrongVocabCount(vocab ? JSON.parse(vocab).length : 0);
    setWrongGrammarCount(grammar ? JSON.parse(grammar).length : 0);
  }, []);

  const studyData = [
    { name: '周一', words: 30, score: 82 },
    { name: '周二', words: 25, score: 88 },
    { name: '周三', words: 35, score: 78 },
    { name: '周四', words: 42, score: 92 },
    { name: '周五', words: 30, score: 85 },
    { name: '周六', words: 15, score: 65 },
    { name: '周日', words: 52, score: 94 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-xl rounded-xl border border-gray-100">
          <p className="text-xs font-bold text-gray-500 mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-500"></div>
            <p className="text-sm font-black text-gray-900">
              学习单词: <span className="text-brand-600">{payload[0].value}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 bg-gray-50 h-full overflow-y-auto pb-24 no-scrollbar">
       <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-bold text-gray-900">学习看板</h1>
         <div className="bg-brand-50 px-3 py-1 rounded-full flex items-center gap-2">
            <TrendingUp size={14} className="text-brand-600" />
            <span className="text-xs font-bold text-brand-700">状态：极佳</span>
         </div>
       </div>

       {/* 错题本入口 */}
       <NavLink to="/wrong-book" className="block mb-8">
         <div className="bg-gradient-to-br from-red-500 to-orange-500 p-6 rounded-3xl shadow-xl shadow-red-100 text-white relative overflow-hidden group active:scale-95 transition-transform">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
               <BookMarked size={100} />
            </div>
            <div className="relative z-10">
               <div className="flex items-center gap-2 mb-4">
                  <BookOpenCheck size={24} />
                  <h3 className="text-xl font-black">我的错题本</h3>
               </div>
               <div className="flex gap-4 mb-4">
                  <div className="bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-sm">
                    <p className="text-[10px] font-bold uppercase opacity-80">待攻克词汇</p>
                    <p className="text-xl font-black">{wrongVocabCount}</p>
                  </div>
                  <div className="bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-sm">
                    <p className="text-[10px] font-bold uppercase opacity-80">薄弱语法项</p>
                    <p className="text-xl font-black">{wrongGrammarCount}</p>
                  </div>
               </div>
               <div className="flex items-center gap-1 text-sm font-bold bg-white/10 w-fit px-3 py-1 rounded-full">
                  去重练专项，直到掌握 <ArrowRight size={14} />
               </div>
            </div>
         </div>
       </NavLink>

       <div className="grid grid-cols-2 gap-4 mb-8">
          <StatCard icon={<Trophy className="text-yellow-500" />} label="已掌握单词" value="450" sub="词" trend="+15" />
          <StatCard icon={<Clock className="text-blue-500" />} label="累计学习" value="12" sub="天" trend="连续" />
          <StatCard icon={<Target className="text-green-500" />} label="平均正确率" value="88" sub="%" trend="+3%" />
          <StatCard icon={<Calendar className="text-purple-500" />} label="距考试" value="128" sub="天" trend="倒计时" />
       </div>

       {/* 学习单词趋势图 */}
       <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-sm font-black text-gray-800">学习趋势</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Words learned per day</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-brand-600">本周平均: 32词</span>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={studyData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis 
                   dataKey="name" 
                   fontSize={11} 
                   tickLine={false} 
                   axisLine={false} 
                   tick={{ fill: '#94a3b8', fontWeight: 600 }}
                   dy={10}
                 />
                 <YAxis 
                   fontSize={10} 
                   tickLine={false} 
                   axisLine={false} 
                   tick={{ fill: '#cbd5e1' }}
                 />
                 <Tooltip 
                   cursor={{ fill: '#f8fafc' }} 
                   content={<CustomTooltip />}
                 />
                 <Bar dataKey="words" radius={[6, 6, 0, 0]} barSize={28}>
                   {studyData.map((entry, index) => (
                     <Cell 
                        key={`cell-${index}`} 
                        fill={entry.words >= 40 ? '#0284c7' : entry.words >= 25 ? '#0ea5e9' : '#bae6fd'} 
                     />
                   ))}
                 </Bar>
               </BarChart>
            </ResponsiveContainer>
          </div>
       </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, sub: string, trend: string }> = ({ icon, label, value, sub, trend }) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-2">
      <div className="p-2 bg-gray-50 rounded-xl">{icon}</div>
      <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{trend}</span>
    </div>
    <div>
      <div className="text-xs text-gray-400 font-medium mb-1">{label}</div>
      <div className="text-2xl font-black text-gray-900">{value}<span className="text-sm font-normal text-gray-400 ml-1">{sub}</span></div>
    </div>
  </div>
);
