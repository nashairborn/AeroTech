import React from 'react';
import { Plane, ChevronRight, Users, BrainCircuit } from 'lucide-react';

interface OnboardingProps {
  onStart: () => void;
  onSignIn: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onStart, onSignIn }) => {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-void">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Content */}
      <div className="flex-grow flex flex-col justify-center items-center px-6 relative z-10 max-w-lg mx-auto text-center">
        
        {/* Hero Graphic */}
        <div className="mb-12 relative group cursor-pointer" onClick={onStart}>
          <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full animate-pulse-slow"></div>
          <div className="relative w-32 h-32 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center shadow-2xl">
             <Plane className="w-14 h-14 text-amber-500 transform -rotate-45" />
          </div>
          
          {/* Orbiting Icons */}
          <div className="absolute top-0 left-1/2 -ml-24 -mt-4 animate-bounce delay-75">
             <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg shadow-lg">
                <BrainCircuit className="w-5 h-5 text-sky-500" />
             </div>
          </div>
           <div className="absolute bottom-4 right-[-20px] animate-bounce delay-150">
             <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg shadow-lg">
                <Users className="w-5 h-5 text-emerald-500" />
             </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
          Teach Better.<br/>Instruct Smarter.
        </h1>
        <p className="text-lg text-slate-400 mb-10 leading-relaxed">
          AI-assisted development for flight instructors. Turn your manuals into audio briefings and whiteboard plans.
        </p>

        <div className="w-full space-y-4">
          <button 
            onClick={onStart}
            className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-full transition-all shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 group"
          >
            Upload Notes <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={onSignIn}
            className="w-full py-4 bg-slate-900/50 backdrop-blur-md hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium rounded-full transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
      
      <div className="py-6 text-center text-slate-600 text-xs font-mono uppercase tracking-widest">
        AeroTeach Audio v1.3 • iOS 26 Optimized
      </div>
    </div>
  );
};

export default Onboarding;