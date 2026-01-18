import React from 'react';
import { Home, Book, PlusCircle, BarChart2, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'lessons', icon: Book, label: 'Lessons' },
    { id: 'upload', icon: PlusCircle, label: 'Upload' },
    { id: 'exercises', icon: BarChart2, label: 'Exercises' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4">
      <div className="glass-nav rounded-full px-6 py-4 flex items-center gap-8 shadow-2xl">
        {navItems.map((item) => {
          // Lessons active if specifically on lessons page OR if on result page (which acts as the current lesson view)
          const isActive = activeTab === item.id || (activeTab === 'result' && item.id === 'lessons');
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative group flex flex-col items-center gap-1 transition-all duration-300 ${
                isActive ? 'text-amber-500' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              
              {isActive && (
                <span className="absolute -bottom-2 w-1 h-1 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;