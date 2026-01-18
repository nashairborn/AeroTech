import React from 'react';
import { Plane, Radio } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-default">
          <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded group-hover:bg-amber-500/20 transition-colors">
            <Plane className="w-5 h-5 text-amber-500 transform -rotate-45" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-wide text-slate-100 leading-none">AEROTEACH</h1>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 group-hover:text-amber-500/70 transition-colors">Instructor Ops</span>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">System Online</span>
          </div>
          <div className="h-4 w-px bg-slate-800"></div>
          <div className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer">
             <Radio className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;