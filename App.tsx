import React, { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ResultView from './components/ResultView';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import BottomNav from './components/BottomNav';
import MiniPlayer from './components/MiniPlayer';
import Notification from './components/Notification';
import Settings from './components/Settings';
import AuthModal from './components/AuthModal';
import Exercises from './components/Exercises';
import { generateTeachingSummary, generateAudioFromText, generateWhiteboardImage, generateDeepDiveGuidance } from './services/geminiService';
import { ProcessingStage, AudioSection, User, Exercise } from './types';
import { AlertTriangle, Loader2 } from 'lucide-react';

type ViewState = 'onboarding' | 'dashboard' | 'upload' | 'result' | 'lessons' | 'exercises' | 'settings';

export default function App() {
  const [view, setView] = useState<ViewState>('onboarding');
  
  // User Data
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // Current Lesson Data
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [deepDiveSummary, setDeepDiveSummary] = useState<string | null>(null);
  const [whiteboardUrl, setWhiteboardUrl] = useState<string | null>(null);
  
  // Processing State
  const [backgroundProcessing, setBackgroundProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>(ProcessingStage.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'info'} | null>(null);

  // Global Audio State
  const [audioPlaylist, setAudioPlaylist] = useState<AudioSection[]>([]);
  const [deepDivePlaylist, setDeepDivePlaylist] = useState<AudioSection[]>([]);
  const [activePlaylist, setActivePlaylist] = useState<AudioSection[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [generatingDeepDive, setGeneratingDeepDive] = useState(false);

  // --- Auth Handlers ---
  const handleLogin = () => {
    setUser({
      id: '123',
      name: 'Capt. Marcus Smith',
      email: 'm.smith@flightops.com',
      level: 'Instructor',
      title: 'Certified Flight Instructor (CFI)'
    });
    setShowAuthModal(false);
    setNotification({ msg: "Instructor Account Synchronized", type: 'success' });
  };

  const handleLogout = () => {
    setUser(null);
    setNotification({ msg: "Instructor Signed Out", type: 'info' });
  };

  // --- Processing Handlers ---

  const handleStartOnboarding = () => {
    setView('dashboard');
  };

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setBackgroundProcessing(true);
    setNotification({ msg: "Initiating Background Analysis...", type: 'info' });
    processDocument(selectedFile);
  };

  const processDocument = async (docFile: File) => {
    try {
      setProcessingStage(ProcessingStage.ANALYZING_DOC);
      const generatedSummary = await generateTeachingSummary(docFile);
      setSummary(generatedSummary);

      setProcessingStage(ProcessingStage.GENERATING_AUDIO);
      const playlist = await generateAudioFromText(generatedSummary);
      setAudioPlaylist(playlist);
      
      const newExercise: Exercise = {
        id: Date.now().toString(),
        title: docFile.name.replace(/\.[^/.]+$/, ""),
        date: new Date(),
        summary: generatedSummary,
        playlist: playlist
      };
      setExercises(prev => [newExercise, ...prev]);
      
      setActivePlaylist(playlist);
      setCurrentTrackIndex(0);

      setProcessingStage(ProcessingStage.COMPLETE);
      setBackgroundProcessing(false);
      setNotification({ msg: "Lesson Briefing Optimized", type: 'success' });
    } catch (err: any) {
      console.error("Processing Error:", err);
      setError(err.message || "Aviation Analysis Failure.");
      setProcessingStage(ProcessingStage.ERROR);
      setBackgroundProcessing(false);
    }
  };

  const handleGenerateWhiteboard = async (guidance?: string) => {
    if (!summary) return;
    const url = await generateWhiteboardImage(summary, guidance);
    setWhiteboardUrl(url);
  };

  const handleGenerateDeepDive = async () => {
    if (!file) return;
    try {
      setGeneratingDeepDive(true);
      const { playlist, textTranscript } = await generateDeepDiveGuidance(file);
      setDeepDivePlaylist(playlist);
      setDeepDiveSummary(textTranscript);
      setGeneratingDeepDive(false);
      setNotification({ msg: "Instructor Deep Dive Ready", type: 'success' });
    } catch (err: any) {
      console.error("Deep Dive Error:", err);
      setError("Failed to generate Deep Dive guide.");
      setGeneratingDeepDive(false);
    }
  };

  // --- Audio Handlers ---

  const handlePlayTrack = (playlist: AudioSection[], index: number) => {
    setActivePlaylist(playlist);
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setShowPlayer(true);
  };

  const handlePauseTrack = () => {
    setIsPlaying(false);
  };

  const handleNextTrack = () => {
    if (currentTrackIndex < activePlaylist.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
      setIsPlaying(true);
    } else {
        setIsPlaying(false);
    }
  };

  const renderContent = () => {
    if (view === 'onboarding') return <Onboarding onStart={handleStartOnboarding} onSignIn={() => setShowAuthModal(true)} />;

    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow w-full max-w-2xl mx-auto pt-4 relative">
          
          {backgroundProcessing && (
             <div className="fixed top-20 right-4 z-40 glass-nav border-amber-500/30 text-amber-500 px-4 py-2 rounded-full text-xs font-mono flex items-center gap-2 shadow-2xl animate-in slide-in-from-right-4">
                <Loader2 className="w-3 h-3 animate-spin" />
                AeroCompute Active
             </div>
          )}

          {error && (
            <div className="mx-4 mb-4 p-4 glass-panel border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {view === 'dashboard' && (
            <Dashboard 
               onUpload={() => setView('upload')} 
               onViewLesson={() => setView('result')} 
               hasActiveLesson={!!summary}
            />
          )}

          {view === 'upload' && (
             <div className="px-4 py-8">
                 <h2 className="text-2xl font-bold text-white mb-6">Upload Notes</h2>
                 <FileUpload onFileSelect={handleFileSelect} disabled={backgroundProcessing} />
                 {backgroundProcessing && (
                     <div className="mt-8 glass-panel rounded-2xl p-6 text-center animate-pulse">
                        <p className="text-amber-500 font-bold mb-1">Processing Analysis</p>
                        <p className="text-xs text-slate-500">You may continue navigating. We'll alert you when ready.</p>
                     </div>
                 )}
             </div>
          )}

          {(view === 'result' || view === 'lessons') && (
            summary ? (
                <ResultView 
                  summary={summary} 
                  deepDiveSummary={deepDiveSummary}
                  audioPlaylist={audioPlaylist}
                  deepDivePlaylist={deepDivePlaylist}
                  whiteboardUrl={whiteboardUrl}
                  isGeneratingDeepDive={generatingDeepDive}
                  onGenerateDeepDive={handleGenerateDeepDive}
                  onGenerateWhiteboard={handleGenerateWhiteboard}
                  currentTrackId={activePlaylist[currentTrackIndex]?.id}
                  isPlaying={isPlaying}
                  onPlayTrack={handlePlayTrack}
                  onPauseTrack={handlePauseTrack}
                />
            ) : (
                <div className="flex flex-col items-center justify-center h-[50vh] px-6 text-center">
                    <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 border border-white/5 shadow-2xl">
                        <Loader2 className="w-8 h-8 text-slate-700" />
                    </div>
                    <h3 className="text-white font-bold mb-2">Hangar Empty</h3>
                    <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto">Upload a flight manual to initiate AI processing and whiteboard planning.</p>
                    <button onClick={() => setView('upload')} className="bg-amber-500 text-slate-950 px-8 py-3 rounded-full font-bold shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform">Initialize Upload</button>
                </div>
            )
          )}

          {view === 'exercises' && (
              <Exercises 
                exercises={exercises} 
                onSelect={(ex) => {
                    setSummary(ex.summary);
                    setAudioPlaylist(ex.playlist);
                    setDeepDivePlaylist([]);
                    setDeepDiveSummary(null);
                    setWhiteboardUrl(null);
                    setView('result');
                }}
              />
          )}

          {view === 'settings' && (
              <Settings 
                user={user} 
                onLogin={() => setShowAuthModal(true)}
                onLogout={handleLogout}
              />
          )}
        </main>
        
        {showPlayer && activePlaylist.length > 0 && (
           <MiniPlayer 
              playlist={activePlaylist}
              currentIndex={currentTrackIndex}
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onClose={() => {
                  setIsPlaying(false);
                  setShowPlayer(false);
              }}
              onEnded={handleNextTrack}
           />
        )}

        {notification && (
            <Notification 
                message={notification.msg} 
                type={notification.type} 
                onClose={() => setNotification(null)} 
            />
        )}

        <AuthModal 
            isOpen={showAuthModal} 
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
        />
        
        <BottomNav activeTab={view} onTabChange={(id) => setView(id as ViewState)} />
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {renderContent()}
    </div>
  );
}