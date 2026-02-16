
export type PebbleColor = 
  | 'pebble-green' 
  | 'pebble-blue' 
  | 'pebble-clay' 
  | 'pebble-sand' 
  | 'pebble-peach' 
  | 'pebble-slate'
  | 'pebble-desert'
  | 'pebble-moss'
  | 'pebble-navy'
  | 'pebble-terracotta'
  | 'pebble-dust';

export type SurfaceFinish = 'none' | 'polished' | 'matte' | 'textured';

export interface MoodSignature {
  id: string;
  name: string;
  category: string;
  color: string; // Hex
  shapeClass: string;
  description: string;
  finish: SurfaceFinish;
}

export interface JournalEntry {
  id: string;
  date: Date;
  signatureId: string;
  content: string;
  reflection?: string; // AI generated reflection
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export enum AppScreen {
  AUTH = 'auth',
  WELCOME = 'welcome',
  JOURNAL = 'journal',
  TODAY_SUMMARY = 'today_summary',
  CALENDAR = 'calendar',
  YEARLY = 'yearly',
  COLLECTION = 'collection',
  CREATE_PEBBLE = 'create_pebble',
  HISTORY_LIST = 'history_list',
}

export type HistoryViewMode = 'calendar' | 'compact' | 'details';

export interface HistoryFilter {
  month: number;
  year: number;
}

export interface AppState {
  user: User | null;
  currentScreen: AppScreen;
  selectedSignatureId: string | null;
  signatures: MoodSignature[];
  archivedSignatures: MoodSignature[];
  history: JournalEntry[];
  isReplaceMode: boolean;
  historyFilter: HistoryFilter | null;
  historyViewMode: HistoryViewMode;
  yearlyTargetYear: number | null;
}
