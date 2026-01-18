import React, { useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, X, Volume2, Maximize2 } from 'lucide-react';
import { AudioSection } from '../types';

interface GlobalPlayerProps {
  playlist: AudioSection[];
  currentIndex: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onEnded: () => void;
}

const GlobalPlayer: React.FC<GlobalPlayerProps> = ({ 
  playlist, 
  currentIndex, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrev,
  onTimeUpdate,
  onEnded
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = playlist[currentIndex];
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  // Handle Play/Pause side effects
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(e => console.error("Playback error", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]); // React to track change or play state change

  useEffect(() => {
    // Reset when track changes
    if (audioRef.current) {
        audioRef.current.load();
        if(isPlaying) audioRef.current.play();
    }
  }, [currentTrack?.id]);

  if (!currentTrack) return null;

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const curr = audioRef.current.currentTime;
      const dur = audioRef.current.duration || 0;
      setProgress(curr);
      setDuration(dur);
      onTimeUpdate(curr, dur);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 duration-500">
        <audio 
            ref={audioRef}
            src={currentTrack.audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={onEnded}
            onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        />
        
        <div className="glass-nav rounded-2xl p-4 pr-5 shadow-2xl border-t border-white/10 relative overflow-hidden group">
            {/* Progress Bar Background */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
                <div 
                    className="h-full bg-amber-500 transition-all duration-100 ease-linear" 
                    style={{ width: `${(progress / (duration || 1)) * 100}%` }} 
                />
            </div>
            
            {/* Seek Input (Invisible but usable) */}
            <input 
                type="range" 
                min="0" 
                max={duration || 100} 
                value={progress}
                onChange={handleSeek}
                className="absolute top-[-6px] left-0 w-full h-4 opacity-0 cursor-pointer z-20"
            />

            <div className="flex items-center gap-4 mt-2">
                {/* Album Art / Icon */}
                <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 relative overflow-hidden">
                     {isPlaying && (
                         <div className="flex gap-0.5 items-end h-4">
                            <div className="w-1 bg-amber-500 animate-[bounce_0.8s_infinite] h-2"></div>
                            <div className="w-1 bg-amber-500 animate-[bounce_1.1s_infinite] h-4"></div>
                            <div className="w-1 bg-amber-500 animate-[bounce_0.9s_infinite] h-3"></div>
                         </div>
                     )}
                     {!isPlaying && <Volume2 className="w-5 h-5 text-slate-500" />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-sm truncate">{currentTrack.title}</h4>
                    <p className="text-slate-400 text-xs truncate">Audio Briefing • {Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}</p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                     <button onClick={onPrev} className="text-slate-400 hover:text-white p-1">
                        <SkipBack className="w-5 h-5" />
                     </button>
                     <button 
                        onClick={onPlayPause}
                        className="w-10 h-10 rounded-full bg-white text-slate-950 flex items-center justify-center hover:bg-slate-200 transition-colors shadow-lg shadow-white/10"
                     >
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                     </button>
                     <button onClick={onNext} className="text-slate-400 hover:text-white p-1">
                        <SkipForward className="w-5 h-5" />
                     </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default GlobalPlayer;