import React from 'react';
import { FileText, Play, ChevronRight, Calendar } from 'lucide-react';
import { Exercise } from '../types';

interface ExercisesProps {
  exercises: Exercise[];
  onSelect: (ex: Exercise) => void;
}

const Exercises: React.FC<ExercisesProps> = ({ exercises, onSelect }) => {
  return (
    <div className="px-4 py-8 pb-32 animate-in fade-in slide-in-from-bottom-2 duration-500">
       <h2 className="text-2xl font-bold text-white mb-6">Flight Exercises</h2>
       
       {exercises.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 text-center">
             <div className="w-16 h-16 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-8 h-8 text-slate-600" />
             </div>
             <h3 className="text-white font-bold mb-2">No Exercises Yet</h3>
             <p className="text-slate-500 text-sm">Upload a manual or lesson plan to start building your library.</p>
          </div>
       ) : (
          <div className="space-y-3">
             {exercises.map((ex, index) => (
                <div 
                   key={ex.id}
                   onClick={() => onSelect(ex)}
                   className="group p-4 bg-slate-900/40 backdrop-blur-md border border-white/5 hover:bg-slate-800/60 rounded-2xl flex items-center gap-4 cursor-pointer transition-all duration-300"
                >
                   <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-mono text-xs">
                      #{index + 1}
                   </div>
                   
                   <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold text-sm truncate group-hover:text-amber-500 transition-colors">
                         {ex.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {ex.date.toLocaleDateString()}
                         </span>
                         <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                            <Play className="w-3 h-3" /> {ex.playlist.length} Tracks
                         </span>
                      </div>
                   </div>

                   <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-amber-500 transition-all">
                      <ChevronRight className="w-4 h-4" />
                   </button>
                </div>
             ))}
          </div>
       )}
    </div>
  );
};

export default Exercises;