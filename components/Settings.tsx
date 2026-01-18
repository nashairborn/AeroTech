import React, { useState } from 'react';
import { 
  User, Shield, Bell, Smartphone, Globe, Mic, 
  PenTool, FileCode, HelpCircle, Info, ChevronRight, LogOut, ArrowLeft,
  Camera, Trash2, Check, ExternalLink, Settings as SettingsIcon,
  CheckCircle2, FileStack, Sliders
} from 'lucide-react';
import { User as UserType, SettingsState } from '../types';

interface SettingsProps {
  user: UserType | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onLogin, onLogout }) => {
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [settings, setSettings] = useState<SettingsState>({
    teachingStyle: 'Scenario-based',
    lessonDepth: 'Standard',
    explanationTone: 'Mixed',
    authority: 'FAA',
    units: 'Imperial',
    terminology: 'FAA',
    lessonFocus: ['Ground school'],
    language: 'English',
    spelling: 'US',
    speechSpeed: 1.0,
    autoPlay: true,
    audioMode: 'Quick Summary',
    lessonLength: 'Medium',
    offlineDownload: false,
    boardStyle: 'Diagram-heavy',
    completionLevel: 60,
    diagramComplexity: 'Technical',
    reservedSpace: ['Notes', 'Examples'],
    enabledFileTypes: ['PDF', 'PPT'],
    preserveSlideOrder: true,
    autoDetectSections: true,
    ignoreAppendices: true,
    chunkSize: 50,
    theme: 'Dark',
    textSize: 100,
    retentionDays: 30,
    allowAIImprovement: true,
    notifications: {
      processingComplete: true,
      audioReady: true,
      tips: false
    }
  });

  const updateSetting = (key: keyof SettingsState, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateNestedSetting = (category: keyof SettingsState, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as any),
        [key]: value
      }
    }));
  };

  if (activeSub) {
    return (
      <SubScreen 
        id={activeSub} 
        settings={settings} 
        updateSetting={updateSetting} 
        updateNestedSetting={updateNestedSetting}
        user={user}
        onBack={() => setActiveSub(null)}
        onLogout={onLogout}
        onLogin={onLogin}
      />
    );
  }

  return (
    <div className="px-4 py-8 pb-32 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h2 className="text-3xl font-bold text-white mb-8 px-2">Settings</h2>

      {/* Account Section */}
      <div className="mb-8">
         <h3 className="text-xs font-mono uppercase text-slate-500 mb-3 px-2 tracking-widest">Account</h3>
         <div className="glass-panel rounded-3xl overflow-hidden">
            {user ? (
               <button onClick={() => setActiveSub('account')} className="w-full text-left p-4 flex items-center gap-4 hover:bg-white/5 transition-colors group">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white font-bold text-xl shadow-lg relative overflow-hidden">
                     {user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                     <h4 className="text-white font-bold text-lg">{user.name}</h4>
                     <p className="text-amber-500 text-xs font-mono uppercase tracking-wider">{user.level} PILOT</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600" />
               </button>
            ) : (
               <div className="p-6 text-center">
                  <p className="text-slate-400 text-sm mb-4">Sign in to sync your preferences and lessons.</p>
                  <button onClick={onLogin} className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-colors">Sign In / Register</button>
               </div>
            )}
         </div>
      </div>

      <SettingsSection title="Preferences">
         <SettingNavItem icon={User} label="Teaching Style" value={settings.teachingStyle} onClick={() => setActiveSub('teaching')} />
         <SettingNavItem icon={Shield} label="Aviation Authority" value={settings.authority} onClick={() => setActiveSub('standards')} />
         <SettingNavItem icon={Globe} label="Localization" onClick={() => setActiveSub('localization')} />
      </SettingsSection>

      <SettingsSection title="Media">
         <SettingNavItem icon={Mic} label="Audio & Voice" onClick={() => setActiveSub('audio')} />
         <SettingNavItem icon={PenTool} label="Whiteboard Prep" onClick={() => setActiveSub('whiteboard')} />
         <SettingNavItem icon={FileStack} label="Upload & Processing" onClick={() => setActiveSub('processing')} />
      </SettingsSection>

      <SettingsSection title="System">
         <SettingNavItem icon={Bell} label="Notifications" onClick={() => setActiveSub('notifications')} />
         <SettingNavItem icon={Smartphone} label="Appearance" onClick={() => setActiveSub('appearance')} />
         <SettingNavItem icon={FileCode} label="Privacy & Data" onClick={() => setActiveSub('privacy')} />
         <SettingNavItem icon={HelpCircle} label="Help & Support" onClick={() => setActiveSub('help')} />
         <SettingNavItem icon={Info} label="About AeroTeach" value="v1.3.0" onClick={() => setActiveSub('about')} />
      </SettingsSection>
    </div>
  );
};

// --- Sub Screens Mapping ---

const SubScreen = ({ id, settings, updateSetting, updateNestedSetting, user, onBack, onLogout, onLogin }: any) => {
  return (
    <div className="fixed inset-0 z-[60] bg-void/90 backdrop-blur-3xl flex flex-col animate-in slide-in-from-right-4 duration-300 overflow-y-auto">
      <div className="sticky top-0 z-10 p-6 flex items-center gap-4 bg-void/40 backdrop-blur-md border-b border-white/5">
         <button onClick={onBack} className="p-2 bg-slate-800/50 rounded-full hover:bg-slate-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
         </button>
         <h3 className="text-xl font-bold text-white capitalize">{id.replace('_', ' ')}</h3>
      </div>
      
      <div className="p-6 flex-grow pb-32">
        {id === 'account' && (
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="text-center mb-8">
                 <div className="w-28 h-28 rounded-full bg-slate-800 mx-auto mb-4 border-2 border-white/10 flex items-center justify-center relative overflow-hidden group">
                    {user?.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <User className="w-14 h-14 text-slate-600" />}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Camera className="w-6 h-6 text-white" />
                    </div>
                 </div>
                 <h4 className="text-white font-bold text-xl">{user?.name}</h4>
                 <p className="text-slate-500 text-sm">{user?.title}</p>
              </div>

              <SettingsSection title="Account Details">
                 <div className="p-4 space-y-4">
                    <label className="text-[10px] font-mono uppercase text-slate-500 block px-1">Full Name</label>
                    <input type="text" value={user?.name || ''} className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-white text-sm focus:border-amber-500 outline-none" readOnly />
                 </div>
                 <SettingItem icon={Shield} label="Security Verification" value="Verified" />
              </SettingsSection>

              <SettingsSection title="Connected Accounts">
                 <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center"><img src="https://www.google.com/favicon.ico" className="w-4 h-4" /></div>
                       <span className="text-sm text-white">Google</span>
                    </div>
                    <span className="text-xs text-emerald-500 font-bold">Connected</span>
                 </div>
              </SettingsSection>

              <SettingsSection title="Danger Zone">
                  <button className="w-full p-4 flex items-center gap-3 text-red-500 hover:bg-red-500/10 transition-colors">
                     <Trash2 className="w-4 h-4" />
                     <span className="text-sm font-bold">Delete Account</span>
                  </button>
              </SettingsSection>

              <button onClick={onLogout} className="w-full py-4 bg-slate-900 border border-white/5 text-slate-400 font-bold rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center justify-center gap-2">
                 <LogOut className="w-5 h-5" /> Sign Out
              </button>
           </div>
        )}

        {id === 'teaching' && (
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <SettingsSection title="Teaching Style">
                 <div className="p-4 space-y-4">
                    <SegmentedControl 
                       options={['Structured', 'Conceptual', 'Scenario-based']} 
                       value={settings.teachingStyle} 
                       onChange={(v) => updateSetting('teachingStyle', v)} 
                    />
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-xs text-slate-400 italic">"Focus on real-world scenarios and operational decision-making. Ideal for flight reviews."</p>
                    </div>
                 </div>
              </SettingsSection>
              <SettingsSection title="Lesson Depth">
                 <div className="p-4 space-y-1">
                    {['Overview', 'Standard', 'Deep'].map(opt => (
                       <RadioOption 
                          key={opt}
                          label={opt} 
                          selected={settings.lessonDepth === opt} 
                          onClick={() => updateSetting('lessonDepth', opt)} 
                       />
                    ))}
                 </div>
              </SettingsSection>
              <SettingsSection title="Tone">
                 <div className="p-4">
                   <SegmentedControl 
                       options={['Technical', 'Simplified', 'Mixed']} 
                       value={settings.explanationTone} 
                       onChange={(v) => updateSetting('explanationTone', v)} 
                    />
                 </div>
              </SettingsSection>
           </div>
        )}

        {id === 'standards' && (
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <SettingsSection title="Authority">
                 <div className="p-4">
                    <SegmentedControl 
                       options={['FAA', 'EASA', 'SACAA', 'ICAO']} 
                       value={settings.authority} 
                       onChange={(v) => updateSetting('authority', v)} 
                    />
                 </div>
              </SettingsSection>
              <SettingsSection title="Units & Terminology">
                 <SettingToggle label="Metric Units (m/km/h)" checked={settings.units === 'Metric'} onChange={(v) => updateSetting('units', v ? 'Metric' : 'Imperial')} />
                 <SettingToggle label="ICAO Terminology" checked={settings.terminology === 'ICAO'} onChange={(v) => updateSetting('terminology', v ? 'ICAO' : 'FAA')} />
              </SettingsSection>
              <SettingsSection title="Lesson Focus">
                 {['Oral Exam', 'Ground School', 'Flight Briefing'].map(focus => (
                    <div key={focus} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer" onClick={() => {
                        const newFocus = settings.lessonFocus.includes(focus) 
                           ? settings.lessonFocus.filter(f => f !== focus) 
                           : [...settings.lessonFocus, focus];
                        updateSetting('lessonFocus', newFocus);
                    }}>
                       <span className="text-sm text-slate-200">{focus}</span>
                       {settings.lessonFocus.includes(focus) && <CheckCircle2 className="w-5 h-5 text-amber-500" />}
                    </div>
                 ))}
              </SettingsSection>
           </div>
        )}

        {id === 'audio' && (
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <SettingsSection title="Narrator Configuration">
                 <div className="p-6">
                    <div className="flex justify-between text-xs text-slate-400 mb-4 font-mono">
                       <span>Slow</span>
                       <span className="text-amber-500 font-bold">{settings.speechSpeed}x</span>
                       <span>Fast</span>
                    </div>
                    <input 
                       type="range" min="0.75" max="2.0" step="0.25" 
                       value={settings.speechSpeed}
                       onChange={(e) => updateSetting('speechSpeed', parseFloat(e.target.value))}
                       className="w-full accent-amber-500"
                    />
                 </div>
              </SettingsSection>
              <SettingsSection title="Playback Mode">
                 <div className="p-4 space-y-4">
                    <SegmentedControl 
                       options={['Quick Summary', 'Instructor Deep Dive']} 
                       value={settings.audioMode} 
                       onChange={(v) => updateSetting('audioMode', v)} 
                    />
                 </div>
              </SettingsSection>
              <SettingsSection title="Preferences">
                 <SettingToggle label="Auto-play Next Chapter" checked={settings.autoPlay} onChange={(v) => updateSetting('autoPlay', v)} />
                 <SettingToggle label="Allow Offline Access" checked={settings.offlineDownload} onChange={(v) => updateSetting('offlineDownload', v)} />
              </SettingsSection>
           </div>
        )}

        {id === 'processing' && (
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <SettingsSection title="Supported File Types">
                 {['PDF', 'PPT', 'Excel'].map(type => (
                    <div key={type} className="p-4 flex items-center justify-between cursor-pointer" onClick={() => {
                        const next = settings.enabledFileTypes.includes(type) ? settings.enabledFileTypes.filter(t => t !== type) : [...settings.enabledFileTypes, type];
                        updateSetting('enabledFileTypes', next);
                    }}>
                       <span className="text-sm text-slate-200">{type} Document</span>
                       <div className={`w-11 h-6 rounded-full relative transition-all duration-300 ${settings.enabledFileTypes.includes(type) ? 'bg-amber-500' : 'bg-slate-700'}`}>
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${settings.enabledFileTypes.includes(type) ? 'left-6' : 'left-1'}`} />
                       </div>
                    </div>
                 ))}
              </SettingsSection>
              <SettingsSection title="Processing Rules">
                 <SettingToggle label="Preserve Slide Order" checked={settings.preserveSlideOrder} onChange={(v) => updateSetting('preserveSlideOrder', v)} />
                 <SettingToggle label="Auto-detect Sections" checked={settings.autoDetectSections} onChange={(v) => updateSetting('autoDetectSections', v)} />
                 <SettingToggle label="Ignore Appendices" checked={settings.ignoreAppendices} onChange={(v) => updateSetting('ignoreAppendices', v)} />
              </SettingsSection>
              <SettingsSection title="Chunking Control">
                 <div className="p-6">
                    <div className="flex justify-between text-xs text-slate-500 mb-2 font-mono">
                       <span>Compact</span>
                       <span className="text-amber-500 font-bold">{settings.chunkSize}MB</span>
                       <span>Large</span>
                    </div>
                    <input type="range" min="10" max="200" value={settings.chunkSize} onChange={(e) => updateSetting('chunkSize', parseInt(e.target.value))} className="w-full accent-amber-500" />
                 </div>
              </SettingsSection>
           </div>
        )}

        {id === 'whiteboard' && (
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <SettingsSection title="Visual Style">
                 <div className="p-4">
                    <SegmentedControl 
                       options={['Minimal', 'Diagram-heavy', 'Equation-focused']} 
                       value={settings.boardStyle} 
                       onChange={(v) => updateSetting('boardStyle', v)} 
                    />
                 </div>
              </SettingsSection>
              <SettingsSection title="Completion Level">
                 <div className="p-6">
                    <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
                       <span>Sketch</span>
                       <span className="text-amber-500 font-bold">{settings.completionLevel}%</span>
                       <span>Final</span>
                    </div>
                    <input 
                       type="range" min="0" max="100" 
                       value={settings.completionLevel}
                       onChange={(e) => updateSetting('completionLevel', parseInt(e.target.value))}
                       className="w-full accent-amber-500"
                    />
                 </div>
              </SettingsSection>
              <SettingsSection title="Reserved Spaces">
                 {['Instructor Notes', 'Student Questions', 'Worked Examples'].map(space => (
                    <div key={space} className="p-4 flex items-center justify-between cursor-pointer" onClick={() => {
                        const next = settings.reservedSpace.includes(space) ? settings.reservedSpace.filter(s => s !== space) : [...settings.reservedSpace, space];
                        updateSetting('reservedSpace', next);
                    }}>
                       <span className="text-sm text-slate-200">{space}</span>
                       {settings.reservedSpace.includes(space) && <CheckCircle2 className="w-5 h-5 text-amber-500" />}
                    </div>
                 ))}
              </SettingsSection>
           </div>
        )}

        {id === 'appearance' && (
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <SettingsSection title="Interface Mode">
                 <div className="p-4">
                    <SegmentedControl 
                       options={['System', 'Light', 'Dark']} 
                       value={settings.theme} 
                       onChange={(v) => updateSetting('theme', v)} 
                    />
                 </div>
              </SettingsSection>
              <SettingsSection title="Display Scale">
                 <div className="p-6">
                    <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
                       <span>Compact</span>
                       <span className="text-amber-500 font-bold">{settings.textSize}%</span>
                       <span>Accessible</span>
                    </div>
                    <input 
                       type="range" min="80" max="150" step="10" 
                       value={settings.textSize}
                       onChange={(e) => updateSetting('textSize', parseInt(e.target.value))}
                       className="w-full accent-amber-500"
                    />
                 </div>
              </SettingsSection>
           </div>
        )}

        {/* Global Fallback for Help/About/Localization */}
        {!['account', 'teaching', 'standards', 'audio', 'processing', 'whiteboard', 'appearance'].includes(id) && (
           <div className="space-y-6">
              <div className="glass-panel rounded-3xl p-8 text-center space-y-4">
                 <div className="w-16 h-16 bg-slate-800 rounded-full mx-auto flex items-center justify-center text-slate-500">
                    <SettingsIcon className="w-8 h-8" />
                 </div>
                 <h4 className="text-white font-bold">Training Module: {id}</h4>
                 <p className="text-slate-500 text-sm leading-relaxed">This section is being validated against current aviation safety directives. Full interactivity arriving in next service update.</p>
                 <button onClick={onBack} className="px-8 py-3 bg-amber-500 text-slate-950 rounded-full text-sm font-bold shadow-lg shadow-amber-500/20">Return to Flight Ops</button>
              </div>
              
              <div className="glass-panel rounded-3xl p-4 flex items-center justify-between group cursor-pointer">
                 <div className="flex items-center gap-3">
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-amber-500" />
                    <span className="text-sm text-slate-300">View Online Documentation</span>
                 </div>
                 <ChevronRight className="w-4 h-4 text-slate-700" />
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

// --- Core Styled Components ---

const SettingsSection = ({ title, children }: any) => (
   <div className="mb-8">
      <h3 className="text-xs font-mono uppercase text-slate-500 mb-3 px-2 tracking-widest">{title}</h3>
      <div className="glass-panel rounded-3xl overflow-hidden divide-y divide-white/5">
         {children}
      </div>
   </div>
);

const SettingNavItem = ({ icon: Icon, label, value, onClick }: any) => (
   <button onClick={onClick} className="w-full text-left p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
      <div className="flex items-center gap-3">
         <div className="p-1.5 bg-slate-800 rounded-lg text-slate-400 group-hover:text-white transition-colors">
            <Icon className="w-4 h-4" />
         </div>
         <span className="text-sm font-medium text-slate-200">{label}</span>
      </div>
      <div className="flex items-center gap-2">
         {value && <span className="text-xs text-slate-500">{value}</span>}
         <ChevronRight className="w-4 h-4 text-slate-600" />
      </div>
   </button>
);

const SettingItem = ({ icon: Icon, label, value }: any) => (
  <div className="w-full text-left p-4 flex items-center justify-between transition-colors">
     <div className="flex items-center gap-3">
        <div className="p-1.5 bg-slate-800 rounded-lg text-slate-400">
           <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium text-slate-200">{label}</span>
     </div>
     <span className="text-xs text-slate-500">{value}</span>
  </div>
);

const SegmentedControl = ({ options, value, onChange }: any) => (
  <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
     {options.map((opt: string) => (
        <button 
           key={opt}
           onClick={() => onChange(opt)}
           className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
              value === opt ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
           }`}
        >
           {opt}
        </button>
     ))}
  </div>
);

const RadioOption = ({ label, selected, onClick }: any) => (
   <button onClick={onClick} className="w-full flex items-center justify-between py-4 px-2 group">
      <span className={`text-sm transition-colors ${selected ? 'text-white font-bold' : 'text-slate-400 group-hover:text-slate-200'}`}>{label}</span>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-amber-500 bg-amber-500/20' : 'border-slate-700'}`}>
         {selected && <div className="w-2 h-2 rounded-full bg-amber-500" />}
      </div>
   </button>
);

const SettingToggle = ({ label, checked, onChange }: any) => (
   <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => onChange(!checked)}>
      <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{label}</span>
      <button 
         className={`w-11 h-6 rounded-full relative transition-all duration-300 ${checked ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-slate-700'}`}
      >
         <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${checked ? 'left-6' : 'left-1'}`} />
      </button>
   </div>
);

export default Settings;