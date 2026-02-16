
import React, { useMemo } from 'react';
import { MoodSignature, JournalEntry } from '../types';
import Pebble from '../components/Pebble';

interface TodaySummaryProps {
  signature: MoodSignature;
  history: JournalEntry[];
  signatures: MoodSignature[];
  onAdd: () => void;
  onReplace: () => void;
}

const TodaySummaryView: React.FC<TodaySummaryProps> = ({ signature, history, signatures, onAdd, onReplace }) => {
  const lastEntry = history[0];

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const hasLoggedToday = useMemo(() => {
    return lastEntry && isToday(lastEntry.date);
  }, [lastEntry]);

  return (
    <div className="flex-1 flex flex-col items-center px-8 pb-32 pt-24 overflow-hidden">
      <header className="fixed top-0 left-0 right-0 px-6 pt-12 pb-4 flex items-center justify-between z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="w-20">
          <button onClick={() => document.documentElement.classList.toggle('dark')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-xl text-muted">contrast</span>
          </button>
        </div>

        <h1 className="font-serif italic text-2xl tracking-tight text-primary dark:text-white flex-1 text-center">Moods</h1>
        
        <div className="w-20 flex justify-end">
          {hasLoggedToday ? (
            <button 
              onClick={onReplace} 
              className="flex flex-col items-center group"
              title="Replace current mood"
            >
              <span className="material-symbols-outlined text-2xl text-muted group-hover:text-primary transition-colors">edit_calendar</span>
              <span className="text-[8px] font-bold uppercase tracking-widest text-muted/60 -mt-1">Replace</span>
            </button>
          ) : (
            <button onClick={onAdd} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-2xl text-muted">add_circle</span>
            </button>
          )}
        </div>
      </header>

      <div className="relative w-full h-60 flex items-center justify-center mb-2 mt-4">
        <Pebble 
          color={signature.color} 
          shapeClass={signature.shapeClass} 
          finish={signature.finish} 
          size="xl" 
          animate={true}
          className="shadow-2xl z-10"
        />
      </div>

      <div className="text-center px-4 w-full">
        <h2 className="font-serif italic text-4xl mb-1 text-primary dark:text-white">{signature.name}</h2>
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted mb-8">{signature.category}</p>
      </div>

      <button 
        onClick={onAdd}
        className="mb-10 px-8 py-4 bg-action text-primary font-bold rounded-full shadow-md hover:scale-105 active:scale-95 transition-all text-sm tracking-wide"
      >
        Capture new mood
      </button>

      <div className="w-full max-w-sm mt-auto">
        <div className="h-px w-full bg-slate-200/60 dark:bg-slate-800/60 mb-8" />
        <p className="font-display italic text-[13px] text-center text-muted dark:text-gray-400 mb-6">Recent mood evolution</p>
        <div className="flex justify-between items-center px-2">
           {history.slice(0, 5).map((entry, i) => {
             const sig = signatures.find(s => s.id === entry.signatureId);
             if (!sig) return null;
             return (
               <Pebble 
                 key={entry.id} 
                 color={sig.color} 
                 shapeClass={sig.shapeClass} 
                 finish={sig.finish} 
                 size="sm" 
                 // Fixed: Replaced the incorrect '-(entry.date)' with 'isToday(entry.date)' to properly highlight today's pebble
                 className={i === 0 && isToday(entry.date) ? 'ring-2 ring-action ring-offset-2 dark:ring-offset-background-dark' : 'opacity-60'}
               />
             );
           })}
           {Array.from({ length: Math.max(0, 5 - history.length) }).map((_, i) => (
              <div key={`empty-${i}`} className="w-8 h-8 border border-dashed border-slate-200 dark:border-slate-800 organic-shape-1" />
           ))}
        </div>
      </div>
    </div>
  );
};

export default TodaySummaryView;
