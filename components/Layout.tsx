
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BookOpen, PenTool, BarChart2, Layers, BookText } from 'lucide-react';

export const Layout: React.FC = () => {
  const navItems = [
    { to: '/', icon: <BookOpen size={22} />, label: '每日30词' },
    { to: '/reading', icon: <BookText size={22} />, label: '阅读特训' },
    { to: '/tenses', icon: <Layers size={22} />, label: '时态突破' },
    { to: '/writing', icon: <PenTool size={22} />, label: '作文提分' },
    { to: '/dashboard', icon: <BarChart2 size={22} />, label: '学习看板' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        <Outlet />
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 flex justify-around items-center z-50 safe-area-pb shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 text-[10px] font-bold transition-all duration-200 ${
                isActive ? 'text-brand-600 scale-110' : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            {item.icon}
            <span className="mt-1">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
