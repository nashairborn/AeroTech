import React from 'react';
import { Search, Plus, Clock, BookOpen, BarChart3, ChevronRight } from 'lucide-react';

interface DashboardProps {
  onUpload: () => void;
  onViewLesson: () => void; // Mock for demo
  hasActiveLesson: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ onUpload, onViewLesson, hasActiveLesson }) => {
  return (
    <div className="px-4 py-6 pb-32 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-amber-500 font-mono text-xs uppercase tracking-widest mb-1">Good Morning</p>
          <h2 className="text-2xl font-bold text-white">Instructor Pilot</h2>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <span className="font-bold text-slate-400">IP</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-8 group">
        <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Search lessons or concepts..." 
          className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors placeholder-slate-600"
        />
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button 
            onClick={onUpload}
            className="p-4 bg-amber-500 text-slate-950 rounded-2xl flex flex-col items-start gap-3 shadow-lg shadow-amber-900/20 hover:bg-amber-400 transition-colors"
        >
            <div className="p-2 bg-black/10 rounded-lg">
                <Plus className="w-6 h-6" />
            </div>
            <div className="text-left">
                <span className="block font-bold text-lg leading-tight">New<br/>Upload</span>
            </div>
        </button>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-start gap-3">
             <div className="p-2 bg-slate-800 rounded-lg">
                <BarChart3 className="w-6 h-6 text-sky-500" />
            </div>
            <div className="text-left">
                <span className="block font-bold text-white text-lg leading-tight">View<br/>Insights</span>
            </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-400 font-mono text-xs uppercase tracking-widest">Recent Activity</h3>
            <button className="text-amber-500 text-xs font-bold hover:underline">View All</button>
        </div>

        <div className="space-y-3">
            {hasActiveLesson && (
                <div onClick={onViewLesson} className="p-4 glass-panel rounded-xl flex items-center gap-4 cursor-pointer hover:bg-slate-800/80 transition-colors group">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                        <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-white group-hover:text-amber-500 transition-colors">Current Lesson Analysis</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Just now
                        </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-amber-500" />
                </div>
            )}

            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center gap-4 opacity-70">
                 <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-slate-500" />
                </div>
                <div className="flex-1">
                    <h4 className="font-medium text-slate-300">Aerodynamics: Lift</h4>
                    <p className="text-xs text-slate-600">Processed 2 hours ago</p>
                </div>
            </div>

            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center gap-4 opacity-70">
                 <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-slate-500" />
                </div>
                <div className="flex-1">
                    <h4 className="font-medium text-slate-300">Weather: METARs</h4>
                    <p className="text-xs text-slate-600">Processed yesterday</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;