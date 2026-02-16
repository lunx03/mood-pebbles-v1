
import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AppScreen, AppState, MoodSignature, JournalEntry, HistoryViewMode, User } from './types';
import { INITIAL_SIGNATURES } from './constants';
import Navbar from './components/Navbar';

// Views
import WelcomeView from './views/Welcome.tsx';
import JournalView from './views/Journal.tsx';
import TodaySummaryView from './views/TodaySummary.tsx';
import CollectionView from './views/Collection.tsx';
import CalendarView from './views/Calendar.tsx';
import YearlyView from './views/Yearly.tsx';
import CreatePebbleView from './views/CreatePebble.tsx';

// A default local user since the experience is local-only
const DEFAULT_USER: User = {
  id: 'local-explorer',
  email: 'me@moodpebbles.local',
  name: 'Explorer',
};

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('moodpebbles_state');
    const savedUser = localStorage.getItem('moodpebbles_user');
    
    const user = savedUser ? JSON.parse(savedUser) : DEFAULT_USER;
    
    let initialState = {
      user: user,
      currentScreen: AppScreen.WELCOME,
      selectedSignatureId: null,
      signatures: INITIAL_SIGNATURES,
      archivedSignatures: [],
      history: [],
      isReplaceMode: false,
      historyFilter: null,
      historyViewMode: 'calendar' as HistoryViewMode,
      yearlyTargetYear: null,
    };

    if (saved) {
      const parsed = JSON.parse(saved);
      initialState = {
        ...initialState,
        ...parsed,
        history: parsed.history ? parsed.history.map((h: any) => ({ ...h, date: new Date(h.date) })) : [],
        user: user, // Ensure user is always set
        currentScreen: AppScreen.WELCOME,
      };
    }
    
    return initialState;
  });

  const allSignatures = useMemo(() => {
    return [...state.signatures, ...state.archivedSignatures];
  }, [state.signatures, state.archivedSignatures]);

  useEffect(() => {
    // Save global state locally
    localStorage.setItem('moodpebbles_state', JSON.stringify(state));
    localStorage.setItem('moodpebbles_user', JSON.stringify(state.user));
  }, [state]);

  const setScreen = (screen: AppScreen) => {
    setState(prev => ({ ...prev, currentScreen: screen, historyFilter: null }));
  };

  const setHistoryViewMode = (mode: HistoryViewMode) => {
    setState(prev => ({ ...prev, historyViewMode: mode }));
  };

  const selectSignature = (id: string) => {
    setState(prev => ({ ...prev, selectedSignatureId: id, currentScreen: AppScreen.JOURNAL }));
  };

  const navigateToMonth = (month: number, year: number) => {
    setState(prev => ({
      ...prev,
      currentScreen: AppScreen.CALENDAR,
      historyFilter: { month, year }
    }));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const saveEntry = async (content: string, skipAI = false) => {
    if (!state.selectedSignatureId) return;
    
    let reflection = "";
    if (!skipAI && content.trim().length > 10) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Given this journal entry: "${content}", provide a single, short, poetic, and mindful sentence of reflection or encouragement. Keep it under 15 words.`,
          config: {
            systemInstruction: "You are a gentle mindfulness coach. Your reflections are concise, artistic, and calming."
          }
        });
        reflection = response.text || "";
      } catch (e) {
        console.error("AI Reflection failed", e);
      }
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date(),
      signatureId: state.selectedSignatureId,
      content,
      reflection: reflection.trim() || undefined
    };

    setState(prev => {
      const lastEntry = prev.history[0];
      const shouldReplace = prev.isReplaceMode && lastEntry && isToday(lastEntry.date);
      
      return {
        ...prev,
        history: shouldReplace 
          ? [newEntry, ...prev.history.slice(1)] 
          : [newEntry, ...prev.history],
        currentScreen: AppScreen.TODAY_SUMMARY,
        isReplaceMode: false,
      };
    });
  };

  const addSignature = (sig: MoodSignature) => {
    if (state.signatures.length >= 12) return;
    setState(prev => ({
      ...prev,
      signatures: [...prev.signatures, sig],
      currentScreen: AppScreen.COLLECTION
    }));
  };

  const reorderSignatures = (newSignatures: MoodSignature[]) => {
    setState(prev => ({ ...prev, signatures: newSignatures }));
  };

  const deleteSignature = (id: string) => {
    if (state.signatures.length <= 1) return;
    const sigToDelete = state.signatures.find(s => s.id === id);
    if (!sigToDelete) return;
    setState(prev => ({
      ...prev,
      signatures: prev.signatures.filter(s => s.id !== id),
      archivedSignatures: [...prev.archivedSignatures, sigToDelete]
    }));
  };

  const restoreSignature = (id: string) => {
    if (state.signatures.length >= 12) return;
    const sigToRestore = state.archivedSignatures.find(s => s.id === id);
    if (!sigToRestore) return;
    setState(prev => ({
      ...prev,
      archivedSignatures: prev.archivedSignatures.filter(s => s.id !== id),
      signatures: [...prev.signatures, sigToRestore]
    }));
  };

  const renderScreen = () => {
    switch (state.currentScreen) {
      case AppScreen.WELCOME:
        return <WelcomeView signatures={state.signatures} onSelect={selectSignature} />;
      case AppScreen.JOURNAL:
        const selectedSig = allSignatures.find(s => s.id === state.selectedSignatureId) || state.signatures[0];
        return <JournalView 
                 signature={selectedSig} 
                 onBack={() => setScreen(AppScreen.WELCOME)} 
                 onSubmit={saveEntry}
                 history={state.history}
                 isReplaceMode={state.isReplaceMode}
                 onSelectEntry={(id) => {
                    const entry = state.history.find(e => e.id === id);
                    if (entry) {
                      setState(prev => ({ ...prev, selectedSignatureId: entry.signatureId }));
                    }
                 }}
               />;
      case AppScreen.TODAY_SUMMARY:
        const lastEntry = state.history[0];
        const lastSig = allSignatures.find(s => s.id === lastEntry?.signatureId) || state.signatures[0];
        return <TodaySummaryView 
                 signature={lastSig} 
                 history={state.history} 
                 signatures={allSignatures} 
                 onAdd={() => {
                   setState(prev => ({ ...prev, isReplaceMode: false }));
                   setScreen(AppScreen.WELCOME);
                 }}
                 onReplace={() => {
                   setState(prev => ({ ...prev, isReplaceMode: true }));
                   setScreen(AppScreen.WELCOME);
                 }}
               />;
      case AppScreen.COLLECTION:
        return <CollectionView 
                 signatures={state.signatures} 
                 archivedSignatures={state.archivedSignatures}
                 onAdd={() => setScreen(AppScreen.CREATE_PEBBLE)}
                 onSelect={selectSignature}
                 onReorder={reorderSignatures}
                 onDelete={deleteSignature}
                 onRestore={restoreSignature}
               />;
      case AppScreen.CALENDAR:
      case AppScreen.HISTORY_LIST:
        return <CalendarView 
                 history={state.history} 
                 signatures={allSignatures}
                 onYearlyView={(year) => {
                    setState(prev => ({ ...prev, currentScreen: AppScreen.YEARLY, yearlyTargetYear: year }));
                 }}
                 onHistoryViewModeChange={setHistoryViewMode}
                 currentHistoryViewMode={state.historyViewMode}
                 initialFilter={state.historyFilter}
               />;
      case AppScreen.YEARLY:
        return <YearlyView 
                 history={state.history} 
                 signatures={allSignatures} 
                 targetYear={state.yearlyTargetYear || new Date().getFullYear()}
                 onMonthSelect={navigateToMonth} 
               />;
      case AppScreen.CREATE_PEBBLE:
        return <CreatePebbleView signaturesCount={state.signatures.length} onBack={() => setScreen(AppScreen.COLLECTION)} onSave={addSignature} />;
      default:
        return <WelcomeView signatures={state.signatures} onSelect={selectSignature} />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen relative flex flex-col font-sans bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors">
      {renderScreen()}
      {state.currentScreen !== AppScreen.WELCOME && (
        <Navbar currentScreen={state.currentScreen} setScreen={setScreen} />
      )}
      
      <div className="fixed top-[-10%] left-[-10%] w-64 h-64 bg-pebble-peach/10 blur-[100px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-5%] right-[-5%] w-80 h-80 bg-pebble-green/10 blur-[120px] pointer-events-none -z-10" />
    </div>
  );
}
