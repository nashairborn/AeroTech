import React, { useState } from 'react';
import { 
  FileText, Headphones, Monitor, 
  Play, Pause, BarChart3, Clock, 
  GraduationCap, Mic2, Loader2, Wand2, Maximize2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AudioSection } from '../types';

interface ResultViewProps {
  summary: string;
  deepDiveSummary: string | null;
  audioPlaylist: AudioSection[];
  deepDivePlaylist: AudioSection[];
  whiteboardUrl: string | null;
  isGeneratingDeepDive: boolean;
  onGenerateDeepDive: () => void;
  onGenerateWhiteboard: (guidance?: string) => Promise<void>;
  
  // Audio Props passed from Global State
  currentTrackId?: string;
  isPlaying: boolean;
  onPlayTrack: (playlist: AudioSection[], index: number) => void;
  onPauseTrack: () => void;
}

type TabType = 'briefing' | 'audio' | 'board';
type BriefingMode = 'summary' | 'deepdive';

const ResultView: React.FC<ResultViewProps> = ({ 
  summary, 
  deepDiveSummary,
  audioPlaylist, 
  deepDivePlaylist,
  whiteboardUrl, 
  isGeneratingDeepDive,
  onGenerateDeepDive,
  onGenerateWhiteboard,
  currentTrackId,
  isPlaying,
  onPlayTrack,
  onPauseTrack
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('briefing');
  const [activeChannel, setActiveChannel] = useState<'quick' | 'deep'>('quick');
  const [briefingMode, setBriefingMode] = useState<BriefingMode>('summary');

  return (
    <div className="pb-32 px-4 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Info */}
      <div className="mb-6 flex items-start justify-between">
         <div>
            <h2 className="text-2xl font-bold text-white mb-1">Lesson Analysis</h2>
            <div className="flex gap-3 text-xs text-slate-400 font-mono uppercase tracking-wider">
               <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-500" /> AI PROCESSED</span>
               <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3 text-sky-500" /> READY</span>
            </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-900/50 border border-slate-800 rounded-xl mb-6 backdrop-blur-md sticky top-20 z-30">
        <TabButton active={activeTab === 'briefing'} onClick={() => setActiveTab('briefing')} label="Briefing" />
        <TabButton active={activeTab === 'audio'} onClick={() => setActiveTab('audio')} label="Audio Studio" />
        <TabButton active={activeTab === 'board'} onClick={() => setActiveTab('board')} label="Board Prep" />
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        
        {/* TAB: Briefing */}
        {activeTab === 'briefing' && (
          <div className="space-y-4">
             {/* Sub-tabs for Briefing */}
             <div className="flex gap-2">
                <button 
                  onClick={() => setBriefingMode('summary')}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                    briefingMode === 'summary' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  Quick Summary
                </button>
                <button 
                  onClick={() => setBriefingMode('deepdive')}
                  disabled={!deepDiveSummary}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-colors disabled:opacity-50 ${
                    briefingMode === 'deepdive' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  Deep Dive Transcript
                </button>
             </div>

             <div className="glass-panel rounded-2xl overflow-hidden p-6 prose prose-invert prose-slate max-w-none prose-headings:text-white prose-a:text-amber-500 prose-strong:text-amber-500">
                {briefingMode === 'summary' ? (
                   <ReactMarkdown>{summary}</ReactMarkdown>
                ) : (
                   deepDiveSummary ? (
                      <ReactMarkdown>{deepDiveSummary}</ReactMarkdown>
                   ) : (
                      <div className="text-center py-10">
                         <p className="text-slate-400 text-sm mb-4">Deep dive content hasn't been generated yet.</p>
                         <button 
                                onClick={onGenerateDeepDive}
                                disabled={isGeneratingDeepDive}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-sm flex items-center gap-2 mx-auto transition-colors disabled:opacity-50"
                             >
                                {isGeneratingDeepDive ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic2 className="w-4 h-4" />}
                                Generate Coaching & Transcript
                        </button>
                      </div>
                   )
                )}
             </div>
          </div>
        )}

        {/* TAB: Audio Studio */}
        {activeTab === 'audio' && (
           <div className="space-y-6">
              {/* Channel Selector */}
              <div className="grid grid-cols-2 gap-4">
                 <button 
                    onClick={() => setActiveChannel('quick')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                        activeChannel === 'quick' 
                        ? 'bg-amber-500 text-slate-900 border-amber-600 shadow-lg shadow-amber-900/20' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                 >
                    <div className="font-bold text-sm mb-1">Quick Summary</div>
                    <div className={`text-xs ${activeChannel === 'quick' ? 'text-slate-800' : 'text-slate-500'}`}>Full lesson overview</div>
                 </button>
                 <button 
                    onClick={() => setActiveChannel('deep')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                        activeChannel === 'deep' 
                        ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-900/20' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                 >
                    <div className="font-bold text-sm mb-1">Deep Dive</div>
                    <div className={`text-xs ${activeChannel === 'deep' ? 'text-indigo-200' : 'text-slate-500'}`}>Instructor coaching</div>
                 </button>
              </div>

              {/* Playlist */}
              <div className="glass-panel rounded-2xl overflow-hidden">
                 <div className="p-4 border-b border-white/5 bg-black/20">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        {activeChannel === 'quick' ? <FileText className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                        {activeChannel === 'quick' ? 'Summary Tracks' : 'Coaching Modules'}
                    </h3>
                 </div>
                 
                 <div className="divide-y divide-white/5">
                    {activeChannel === 'quick' ? (
                       audioPlaylist.map((track, idx) => (
                          <TrackItem 
                             key={track.id} 
                             track={track} 
                             index={idx}
                             isActive={currentTrackId === track.id}
                             isPlaying={isPlaying && currentTrackId === track.id}
                             onClick={() => {
                                if (isPlaying && currentTrackId === track.id) {
                                    onPauseTrack();
                                } else {
                                    onPlayTrack(audioPlaylist, idx);
                                }
                             }}
                          />
                       ))
                    ) : (
                       // Deep Dive Logic
                       deepDivePlaylist.length > 0 ? (
                           deepDivePlaylist.map((track, idx) => (
                              <TrackItem 
                                 key={track.id} 
                                 track={track} 
                                 index={idx}
                                 isActive={currentTrackId === track.id}
                                 isPlaying={isPlaying && currentTrackId === track.id}
                                 onClick={() => {
                                    if (isPlaying && currentTrackId === track.id) {
                                        onPauseTrack();
                                    } else {
                                        onPlayTrack(deepDivePlaylist, idx);
                                    }
                                 }}
                              />
                           ))
                       ) : (
                          <div className="p-8 text-center">
                             <p className="text-slate-400 text-sm mb-6">Generate advanced coaching to learn how to teach this specific topic.</p>
                             <button 
                                onClick={onGenerateDeepDive}
                                disabled={isGeneratingDeepDive}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-sm flex items-center gap-2 mx-auto transition-colors disabled:opacity-50"
                             >
                                {isGeneratingDeepDive ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic2 className="w-4 h-4" />}
                                Generate Coaching
                             </button>
                          </div>
                       )
                    )}
                 </div>
              </div>
           </div>
        )}

        {/* TAB: Board Prep */}
        {activeTab === 'board' && (
           <div className="space-y-6">
              <BoardPrep url={whiteboardUrl} onGenerate={onGenerateWhiteboard} />
           </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
      active ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
    }`}
  >
    {label}
  </button>
);

const TrackItem = ({ track, index, isActive, isPlaying, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`w-full text-left p-4 flex items-center gap-4 transition-colors hover:bg-white/5 ${isActive ? 'bg-amber-500/10' : ''}`}
    >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
            isActive ? 'border-amber-500 bg-amber-500/20 text-amber-500' : 'border-slate-700 bg-slate-800 text-slate-400'
        }`}>
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </div>
        <div className="flex-1">
            <h4 className={`text-sm font-bold ${isActive ? 'text-amber-500' : 'text-slate-200'}`}>{track.title}</h4>
            <p className="text-xs text-slate-500 font-mono">Part {String(index + 1).padStart(2, '0')}</p>
        </div>
        {isActive && isPlaying && (
             <div className="flex gap-0.5 items-end h-3">
                <div className="w-0.5 bg-amber-500 animate-[bounce_1s_infinite] h-2"></div>
                <div className="w-0.5 bg-amber-500 animate-[bounce_1.2s_infinite] h-3"></div>
                <div className="w-0.5 bg-amber-500 animate-[bounce_0.8s_infinite] h-1.5"></div>
             </div>
        )}
    </button>
);

const BoardPrep = ({ url, onGenerate }: { url: string | null, onGenerate: (g: string) => Promise<void> }) => {
  const [guidance, setGuidance] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await onGenerate(guidance);
    setLoading(false);
  };

  return (
    <div className="glass-panel border-slate-800 rounded-2xl overflow-hidden p-6">
       <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-slate-800 rounded border border-slate-700">
             <Monitor className="w-6 h-6 text-slate-300" />
          </div>
          <div>
             <h2 className="text-lg font-bold text-white">Whiteboard Generator</h2>
          </div>
       </div>

       <div className="aspect-video bg-white rounded-xl overflow-hidden border-4 border-slate-700 relative flex items-center justify-center mb-6">
          {url ? (
             <div className="relative w-full h-full group">
                <img src={url} alt="Board Prep" className="w-full h-full object-cover" />
                <a href={url} target="_blank" rel="noreferrer" className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold gap-2">
                   <Maximize2 className="w-5 h-5" />
                </a>
             </div>
          ) : (
             <div className="text-center p-8">
                <p className="text-slate-400 font-mono text-sm">No schematic generated yet.</p>
             </div>
          )}
       </div>

       <div className="space-y-4">
           <textarea 
              value={guidance}
              onChange={(e) => setGuidance(e.target.value)}
              placeholder="E.g. Add more detail to the airfoil section..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:border-amber-500 outline-none transition-colors"
              rows={2}
           />
           <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
           >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4 text-amber-500" />}
              {url ? "Regenerate Schematic" : "Generate Board Plan"}
           </button>
       </div>
    </div>
  );
};

export default ResultView;