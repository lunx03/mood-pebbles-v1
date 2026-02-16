
import React, { useMemo } from 'react';
import { JournalEntry, MoodSignature, HistoryFilter, HistoryViewMode } from '../types';
import Pebble from '../components/Pebble';

interface HistoryListProps {
  history: JournalEntry[];
  signatures: MoodSignature[];
  filter?: HistoryFilter | null;
  viewMode: HistoryViewMode;
  onViewModeChange: (mode: HistoryViewMode) => void;
  onClearFilter?: () => void;
  onCalendarView: () => void;
}

const HistoryListView: React.FC<HistoryListProps> = ({ 
  history, 
  signatures, 
  filter, 
  viewMode, 
  onViewModeChange, 
  onClearFilter, 
  onCalendarView 
}) => {
  const displayedHistory = useMemo(() => {
    let list = [...history];
    if (filter) {
      list = list.filter(entry => {
        const d = new Date(entry.date);
        return d.getMonth() === filter.month && d.getFullYear() === filter.year;
      });
    }
    return list.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [history, filter]);

  const headerLabel = useMemo(() => {
    if (filter) {
      const date = new Date(filter.year, filter.month, 1);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    const targetDate = displayedHistory.length > 0 ? displayedHistory[0].date : new Date();
    return targetDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [displayedHistory, filter]);

  return (
    <div className="flex-1 flex flex-col relative pb-32">
      <div className="h-12 w-full bg-background-light dark:bg-background-dark sticky top-0 z-50"></div>
      <main className="max-w-md mx-auto px-6 pb-32 w-full">
        <header className="flex flex-col mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 group cursor-pointer">
                <h1 className="font-serif text-3xl font-medium tracking-tight text-slate-800 dark:text-slate-50">
                  {headerLabel}
                </h1>
                {!filter && <span className="material-symbols-outlined text-slate-400 group-hover:translate-y-0.5 transition-transform">keyboard_arrow_down</span>}
              </div>
              {filter && (
                <button 
                  onClick={onClearFilter}
                  className="mt-1 text-[10px] font-bold text-action uppercase tracking-widest flex items-center gap-1 hover:opacity-80"
                >
                  Clear Filter <span className="material-symbols-outlined text-[10px]">close</span>
                </button>
              )}
            </div>
            <button 
              onClick={onCalendarView}
              className="flex items-center gap-2 px-4 py-2 border border-slate-100 dark:border-slate-800 rounded-full shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">calendar_month</span>
              <span className="text-sm font-medium">Calendar</span>
            </button>
          </div>

          <div className="flex items-center gap-4 border-b border-slate-50 dark:border-zinc-900/50 pb-4">
            <button 
              onClick={() => onViewModeChange('compact')}
              className={`flex items-center gap-1.5 transition-colors ${viewMode === 'compact' ? 'text-primary dark:text-white' : 'text-slate-300 dark:text-zinc-700'}`}
            >
              <span className="material-symbols-outlined text-lg">grid_view</span>
              <span className="text-[10px] uppercase font-black tracking-widest">Compact</span>
            </button>
            <button 
              onClick={() => onViewModeChange('details')}
              className={`flex items-center gap-1.5 transition-colors ${viewMode === 'details' ? 'text-primary dark:text-white' : 'text-slate-300 dark:text-zinc-700'}`}
            >
              <span className="material-symbols-outlined text-lg">format_list_bulleted</span>
              <span className="text-[10px] uppercase font-black tracking-widest">Details</span>
            </button>
          </div>
        </header>

        {displayedHistory.length > 0 ? (
          viewMode === 'details' ? (
            <div className="space-y-0">
              {(() => {
                const grouped = displayedHistory.reduce((acc, entry) => {
                  const dStr = entry.date.toDateString();
                  if (!acc[dStr]) acc[dStr] = [];
                  acc[dStr].push(entry);
                  return acc;
                }, {} as Record<string, JournalEntry[]>);
                const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
                
                return sortedDates.map(dateStr => {
                  const dayEntries = grouped[dateStr];
                  const dateObj = new Date(dateStr);
                  const displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  const displayDay = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

                  return (
                    <div key={dateStr} className="relative flex items-start py-8 group animate-fade-in border-b border-slate-50 dark:border-zinc-900/50 last:border-0">
                      {/* Dynamic midline alignment using h-16 matched to Pebble 'md' size */}
                      <div className="w-16 flex flex-col flex-shrink-0 h-16 justify-center sticky top-24 self-start">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-slate-300 uppercase leading-none mb-1">{displayDay}</span>
                        <span className="text-xl font-serif font-medium text-slate-800 dark:text-slate-100 leading-none">{displayDate}</span>
                      </div>
                      <div className="ml-8 flex flex-col flex-1 space-y-10">
                        {dayEntries.map(entry => {
                          const sig = signatures.find(s => s.id === entry.signatureId) || signatures[0];
                          const timeStr = entry.date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                          return (
                            <div key={entry.id} className="flex items-start gap-6 group/item animate-fade-in">
                              <div className="flex-shrink-0">
                                <Pebble color={sig.color} shapeClass={sig.shapeClass} finish={sig.finish} size="md" className="shadow-sm !cursor-default" />
                              </div>
                              <div className="flex-1 min-w-0 pt-1">
                                <div className="flex justify-between items-baseline mb-0">
                                  <h3 className="font-sans italic text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-tight">
                                    {sig.name}
                                  </h3>
                                  <span className="text-[10px] font-bold tracking-widest text-muted/60 uppercase">{timeStr}</span>
                                </div>
                                {entry.content && (
                                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-0 font-serif italic" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    "{entry.content}"
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-y-10 gap-x-6 animate-fade-in">
              {displayedHistory.map((entry) => {
                const sig = signatures.find(s => s.id === entry.signatureId) || signatures[0];
                const dateStr = entry.date.getDate().toString();
                const dayStr = entry.date.toLocaleDateString('en-US', { weekday: 'short' });
                return (
                  <div key={entry.id} className="flex flex-col items-center group">
                    <div className="relative mb-3">
                      <Pebble color={sig.color} shapeClass={sig.shapeClass} finish={sig.finish} size="md" className="shadow-sm !cursor-default" />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black tracking-widest text-primary dark:text-white leading-none mb-0.5">{dateStr}</span>
                      <span className="text-[8px] uppercase tracking-[0.2em] text-muted font-bold">{dayStr}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 border border-dashed border-slate-200 dark:border-slate-800 organic-shape-1 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-slate-200 text-3xl">history</span>
            </div>
            <p className="font-serif italic text-slate-400 text-lg">{filter ? "No entries found for this month." : "Your history is waiting for its first pebble."}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryListView;
