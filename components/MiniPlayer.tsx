import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, X, MoveHorizontal, Volume2 } from 'lucide-react';
import { AudioSection } from '../types';

interface MiniPlayerProps {
  playlist: AudioSection[];
  currentIndex: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onClose: () => void;
  onEnded: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ 
  playlist, 
  currentIndex, 
  isPlaying, 
  onPlayPause, 
  onClose,
  onEnded
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = playlist[currentIndex];
  const [position, setPosition] = useState<'left' | 'right'>('right');

  // Handle Play/Pause
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(e => console.error("Playback error", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.load();
        if(isPlaying) audioRef.current.play();
    }
  }, [currentTrack?.id]);

  if (!currentTrack) return null;

  const togglePosition = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPosition(prev => prev === 'right' ? 'left' : 'right');
  };

  return (
    <>
        <audio 
            ref={audioRef}
            src={currentTrack.audioUrl}
            onEnded={onEnded}
        />
        
        <div 
            className={`fixed bottom-28 z-50 transition-all duration-500 ease-spring ${
                position === 'right' ? 'right-4' : 'left-4'
            }`}
        >
            <div className="relative group">
                {/* Visualizer Ring (CSS Animation) */}
                {isPlaying && (
                    <div className="absolute inset-[-4px] rounded-full border border-amber-500/50 animate-[spin_4s_linear_infinite] opacity-50"></div>
                )}
                {isPlaying && (
                    <div className="absolute inset-[-8px] rounded-full border border-amber-500/20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                )}

                {/* Glass Circle */}
                <div 
                    onClick={onPlayPause}
                    className="w-16 h-16 rounded-full bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-center cursor-pointer overflow-hidden relative hover:scale-105 transition-transform"
                >
                    {/* Progress Fill (Subtle Background) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent opacity-50" />

                    {isPlaying ? (
                        <Pause className="w-6 h-6 text-white z-10 fill-current" />
                    ) : (
                        <Play className="w-6 h-6 text-white z-10 fill-current ml-1" />
                    )}
                </div>

                {/* Title Popup (iOS 26 Style) */}
                <div 
                    className={`absolute bottom-full mb-3 ${position === 'right' ? 'right-0' : 'left-0'} w-48 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none transform translate-y-2 group-hover:translate-y-0`}
                >
                    <p className="text-xs font-bold text-white truncate">{currentTrack.title}</p>
                    <div className="flex items-center gap-1 mt-1">
                        <Volume2 className="w-3 h-3 text-amber-500" />
                        <span className="text-[10px] text-slate-400 font-mono uppercase">Audio Active</span>
                    </div>
                </div>

                {/* Controls - Only visible on hover/interaction */}
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                     <button 
                        onClick={onClose}
                        className="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500 transition-colors"
                     >
                        <X className="w-3 h-3" />
                     </button>
                </div>

                 <div className={`absolute -bottom-2 ${position === 'right' ? '-left-2' : '-right-2'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                     <button 
                        onClick={togglePosition}
                        className="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                     >
                        <MoveHorizontal className="w-3 h-3" />
                     </button>
                </div>
            </div>
        </div>
    </>
  );
};

export default MiniPlayer;