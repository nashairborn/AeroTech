import React from 'react';
import { Loader2, Radio, FileSearch } from 'lucide-react';
import { ProcessingStage } from '../types';

interface ProcessingStatusProps {
  stage: ProcessingStage;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ stage }) => {
  const isAnalyzing = stage === ProcessingStage.ANALYZING_DOC;
  const isAudio = stage === ProcessingStage.GENERATING_AUDIO;
  
  if (stage === ProcessingStage.IDLE || stage === ProcessingStage.COMPLETE || stage === ProcessingStage.ERROR) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-12">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-1">
        <div className="bg-slate-950 rounded border border-slate-800/50 p-6">
          <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
            <h3 className="font-mono text-sm uppercase tracking-widest text-slate-400">Processing Data</h3>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500/20"></div>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Step 1: Analyze */}
            <div className={`flex items-center gap-4 transition-opacity duration-300 ${isAnalyzing ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded flex items-center justify-center border ${
                isAnalyzing ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-slate-900 border-slate-700 text-slate-600'
              }`}>
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSearch className="w-4 h-4" />}
              </div>
              <div>
                <span className={`block text-sm font-bold ${isAnalyzing ? 'text-amber-500' : 'text-slate-500'}`}>
                  Analyzing Documentation
                </span>
                <span className="text-[10px] font-mono text-slate-600 uppercase">Extracting vectors...</span>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="ml-4 h-6 w-px bg-slate-800"></div>

            {/* Step 2: Audio */}
            <div className={`flex items-center gap-4 transition-opacity duration-300 ${isAudio ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded flex items-center justify-center border ${
                isAudio ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-slate-900 border-slate-700 text-slate-600'
              }`}>
                 {isAudio ? <Loader2 className="w-4 h-4 animate-spin" /> : <Radio className="w-4 h-4" />}
              </div>
               <div>
                <span className={`block text-sm font-bold ${isAudio ? 'text-amber-500' : 'text-slate-500'}`}>
                  Synthesizing Voice
                </span>
                <span className="text-[10px] font-mono text-slate-600 uppercase">Generating audio stream...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-center text-slate-600 mt-6 font-mono text-xs animate-pulse">
        ESTIMATED TIME REMAINING: 15 SECONDS
      </p>
    </div>
  );
};

export default ProcessingStatus;