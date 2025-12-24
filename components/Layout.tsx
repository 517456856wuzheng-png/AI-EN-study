
import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, PenTool, BarChart2, Layers, BookText } from 'lucide-react';

export const Layout: React.FC = () => {
  const location = useLocation();
  const navItems = [
    { to: '/', icon: <BookOpen size={22} />, label: '词汇' },
    { to: '/reading', icon: <BookText size={22} />, label: '阅读' },
    { to: '/tenses', icon: <Layers size={22} />, label: '时态' },
    { to: '/writing', icon: <PenTool size={22} />, label: '作文' },
    { to: '/dashboard', icon: <BarChart2 size={22} />, label: '看板' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <div key={location.pathname} className="h-full overflow-y-auto no-scrollbar animate-fade-in">
          <Outlet />
        </div>
      </main>

      {/* Responsive Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 px-2 py-2 flex justify-around items-center z-50 safe-area-pb shadow-2xl md:px-20">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-4 rounded-2xl transition-all duration-300 min-w-[64px] ${
                isActive ? 'text-brand-600 bg-brand-50 font-black scale-105' : 'text-gray-400 hover:text-gray-600 font-bold'
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] mt-1">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};
