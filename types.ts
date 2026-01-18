export interface AppState {
  file: File | null;
  summary: string | null;
  deepDiveSummary: string | null;
  audioPlaylist: AudioSection[];
  deepDivePlaylist: AudioSection[];
  whiteboardUrl: string | null;
  status: ProcessingStage;
  errorMessage: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  level: 'Student' | 'Instructor' | 'Senior' | 'CFI';
  title: string;
}

export interface SettingsState {
  // Instructor Prefs
  teachingStyle: 'Structured' | 'Conceptual' | 'Scenario-based';
  lessonDepth: 'Overview' | 'Standard' | 'Deep';
  explanationTone: 'Technical' | 'Simplified' | 'Mixed';
  // Aviation Standards
  authority: 'FAA' | 'EASA' | 'SACAA' | 'ICAO';
  units: 'Imperial' | 'Metric';
  terminology: 'FAA' | 'ICAO';
  lessonFocus: string[];
  // Localization
  language: string;
  spelling: 'US' | 'UK';
  // Audio
  speechSpeed: number;
  autoPlay: boolean;
  audioMode: 'Quick Summary' | 'Instructor Deep Dive';
  lessonLength: 'Short' | 'Medium' | 'Long';
  offlineDownload: boolean;
  // Whiteboard
  boardStyle: 'Minimal' | 'Diagram-heavy' | 'Equation-focused';
  completionLevel: number;
  diagramComplexity: 'Simple' | 'Technical';
  reservedSpace: string[];
  // File Processing
  enabledFileTypes: string[];
  preserveSlideOrder: boolean;
  autoDetectSections: boolean;
  ignoreAppendices: boolean;
  chunkSize: number;
  // System
  theme: 'System' | 'Light' | 'Dark';
  textSize: number;
  retentionDays: number;
  allowAIImprovement: boolean;
  notifications: {
    processingComplete: boolean;
    audioReady: boolean;
    tips: boolean;
  };
}

export interface Exercise {
  id: string;
  title: string;
  date: Date;
  summary: string;
  playlist: AudioSection[];
}

export interface AudioSection {
  id: string;
  title: string;
  audioUrl: string;
  duration?: number;
  isPlaying?: boolean;
}

export enum ProcessingStage {
  IDLE = 'IDLE',
  ANALYZING_DOC = 'ANALYZING_DOC',
  GENERATING_AUDIO = 'GENERATING_AUDIO',
  GENERATING_DEEP_DIVE = 'GENERATING_DEEP_DIVE',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export const SAMPLE_RATE = 24000;
export const NUM_CHANNELS = 1;
export const BITS_PER_SAMPLE = 16;