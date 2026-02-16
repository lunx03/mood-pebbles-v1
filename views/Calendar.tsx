
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { JournalEntry, MoodSignature, HistoryViewMode, HistoryFilter } from '../types';
import Pebble from '../components/Pebble';

interface CalendarProps {
  history: JournalEntry[];
  signatures: MoodSignature[];
  onYearlyView: (year: number) => void;
  onHistoryViewModeChange: (mode: HistoryViewMode) => void;
  currentHistoryViewMode: HistoryViewMode;
  initialFilter: HistoryFilter | null;
}

const CalendarView: React.FC<CalendarProps> = ({ 
  history, 
  signatures, 
  onYearlyView,
  onHistoryViewModeChange,
  currentHistoryViewMode,
  initialFilter
}) => {
  const [viewDate, setViewDate] = useState(() => {
    if (initialFilter) {
      return new Date(initialFilter.year, initialFilter.month, 1);
    }
    return new Date();
  });
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedDayEntry, setSelectedDayEntry] = useState<JournalEntry | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startingDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const monthHistory = useMemo(() => {
    return history
      .filter(entry => {
        const d = new Date(entry.date);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [history, month, year]);

  const changeMonth = (offset: number) => {
    setViewDate(new Date(year, month + offset, 1));
    setSelectedDayEntry(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getEntryForDay = (day: number) => {
    return monthHistory.find(entry => new Date(entry.date).getDate() === day);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  const handleDayClick = (day: number) => {
    const entry = getEntryForDay(day);
    if (entry) {
      setSelectedDayEntry(entry);
    } else {
      setSelectedDayEntry(null);
    }
  };

  const renderViewContent = () => {
    if (monthHistory.length === 0 && currentHistoryViewMode !== 'calendar') {
      return (
        <div className="py-20 text-center flex flex-col items-center animate-fade-in">
          <div className="w-16 h-16 border border-dashed border-slate-200 dark:border-slate-800 organic-shape-1 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-slate-200 text-3xl">history</span>
          </div>
          <p className="font-serif italic text-slate-400 text-lg">No entries logged this month.</p>
        </div>
      );
    }

    switch (currentHistoryViewMode) {
      case 'calendar':
        return (
          <div className="animate-fade-in">
            <div className="grid grid-cols-7 gap-y-2 text-center mt-6">
              {weekDays.map((d, i) => (
                <div key={i} className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${i > 4 ? 'text-action' : 'text-gray-300 dark:text-zinc-600'}`}>
                  {d}
                </div>
              ))}
              {Array.from({ length: startingDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="w-10 h-12" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const entry = getEntryForDay(day);
                const sig = entry ? signatures.find(s => s.id === entry.signatureId) : null;
                const today = isToday(day);
                const isSelected = selectedDayEntry && new Date(selectedDayEntry.date).getDate() === day;
                
                return (
                  <div 
                    key={day} 
                    onClick={() => handleDayClick(day)}
                    className="relative flex flex-col items-center group cursor-pointer h-12 justify-start"
                  >
                    <div className="w-10 h-8 flex items-center justify-center">
                      {sig ? (
                        <Pebble 
                          color={sig.color} 
                          shapeClass={sig.shapeClass} 
                          finish={sig.finish} 
                          size="sm" 
                          className={`transition-all ${isSelected ? 'scale-125' : 'group-hover:scale-110'} ${today ? 'ring-2 ring-action ring-offset-2 dark:ring-offset-background-dark' : ''}`} 
                        />
                      ) : (
                        <div className={`w-8 h-8 border border-dashed rounded-full transition-colors ${today ? 'border-action' : 'border-gray-100 dark:border-zinc-800'} ${isSelected ? 'border-action bg-action/5' : ''}`} />
                      )}
                    </div>
                    <span className={`text-[9px] font-bold tracking-tighter mt-0.5 ${today ? 'text-action underline underline-offset-4' : isSelected ? 'text-primary dark:text-white' : entry ? 'text-slate-600 dark:text-slate-300' : 'text-gray-300 dark:text-zinc-700'}`}>
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'compact':
        return (
          <div className="grid grid-cols-3 gap-y-10 gap-x-6 animate-fade-in mt-6">
            {monthHistory.map((entry) => {
              const sig = signatures.find(s => s.id === entry.signatureId) || signatures[0];
              const dateStr = entry.date.getDate().toString();
              const dayStr = entry.date.toLocaleDateString('en-US', { weekday: 'short' });
              return (
                <div key={entry.id} onClick={() => setSelectedDayEntry(entry)} className="flex flex-col items-center group cursor-pointer">
                  <div className="relative mb-3">
                    <Pebble color={sig.color} shapeClass={sig.shapeClass} finish={sig.finish} size="md" className="shadow-sm group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black tracking-widest text-primary dark:text-white leading-none mb-0.5">{dateStr}</span>
                    <span className="text-[8px] uppercase tracking-[0.2em] text-muted font-bold">{dayStr}</span>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'details':
        const entriesByDate = monthHistory.reduce((acc, entry) => {
          const dStr = entry.date.toDateString();
          if (!acc[dStr]) acc[dStr] = [];
          acc[dStr].push(entry);
          return acc;
        }, {} as Record<string, JournalEntry[]>);

        const sortedDates = Object.keys(entriesByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        return (
          <div className="space-y-0 animate-fade-in">
            {sortedDates.map((dateStr) => {
              const dayEntries = entriesByDate[dateStr];
              const dateObj = new Date(dateStr);
              const displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const displayDay = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

              return (
                <div key={dateStr} className="relative flex items-start py-8 group animate-fade-in border-b border-slate-50 dark:border-zinc-900/50 last:border-0">
                  {/* Dynamic alignment: h-16 matches pebble size 'md', flex-col justify-center centers text beside the pebble's midline */}
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
                          <div 
                            className="flex-shrink-0 cursor-pointer" 
                            onClick={() => setSelectedDayEntry(entry)}
                          >
                            <Pebble color={sig.color} shapeClass={sig.shapeClass} finish={sig.finish} size="md" className="shadow-sm hover:scale-110 transition-transform" />
                          </div>

                          <div className="flex-1 min-w-0 pt-1">
                            <div className="flex justify-between items-baseline mb-0">
                              <h3 className="font-sans italic text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-tight">
                                {sig.name}
                              </h3>
                              <span className="text-[10px] font-bold tracking-widest text-muted/60 uppercase">
                                {timeStr}
                              </span>
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
            })}
          </div>
        );
    }
  };

  const selectedSig = selectedDayEntry ? signatures.find(s => s.id === selectedDayEntry.signatureId) : null;

  return (
    <div className="flex-1 flex flex-col relative h-screen">
      {/* Refined Fixed Header - Matches TodaySummary and Collection aesthetic */}
      <header className="fixed top-0 left-0 right-0 px-6 pt-12 pb-4 flex items-center justify-between z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="w-20">
          <button 
            onClick={() => onYearlyView(year)}
            className="px-3 py-1.5 rounded-full bg-slate-50/50 dark:bg-white/5 border border-slate-100/50 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.15em] text-muted hover:text-primary dark:hover:text-white hover:bg-white dark:hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center"
          >
            {year}
          </button>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-center">
          <button 
            onClick={() => changeMonth(-1)} 
            className="w-8 h-8 flex items-center justify-center text-muted hover:text-primary transition-colors active:scale-90"
          >
            <span className="material-symbols-outlined text-xl">chevron_left</span>
          </button>
          
          <h1 className="font-serif italic text-2xl tracking-tight text-primary dark:text-white min-w-[120px] text-center">
            {monthName}
          </h1>

          <button 
            onClick={() => changeMonth(1)} 
            className="w-8 h-8 flex items-center justify-center text-muted hover:text-primary transition-colors active:scale-90"
          >
            <span className="material-symbols-outlined text-xl">chevron_right</span>
          </button>
        </div>

        <div className="w-20 flex justify-end">
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-8 h-8 flex items-center justify-center text-muted hover:text-primary transition-all active:scale-90"
            >
              <span className="material-symbols-outlined text-2xl">
                {currentHistoryViewMode === 'calendar' ? 'calendar_month' : currentHistoryViewMode === 'compact' ? 'grid_view' : 'format_list_bulleted'}
              </span>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-4 w-48 glass bg-white/95 dark:bg-zinc-900/95 border border-white dark:border-white/5 shadow-2xl rounded-2xl overflow-hidden animate-fade-in origin-top-right z-50">
                <div className="py-2">
                  <button onClick={() => { onHistoryViewModeChange('calendar'); setIsMenuOpen(false); }} className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-lg ${currentHistoryViewMode === 'calendar' ? 'text-action' : 'text-slate-400'}`}>calendar_month</span>
                      <span className={`text-sm font-normal font-sans ${currentHistoryViewMode === 'calendar' ? 'text-primary dark:text-white' : 'text-slate-400'}`}>Calendar</span>
                    </div>
                    {currentHistoryViewMode === 'calendar' && <span className="material-symbols-outlined text-action text-sm">check</span>}
                  </button>
                  <button onClick={() => { onHistoryViewModeChange('compact'); setIsMenuOpen(false); }} className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-lg ${currentHistoryViewMode === 'compact' ? 'text-action' : 'text-slate-400'}`}>grid_view</span>
                      <span className={`text-sm font-normal font-sans ${currentHistoryViewMode === 'compact' ? 'text-primary dark:text-white' : 'text-slate-400'}`}>Compact</span>
                    </div>
                    {currentHistoryViewMode === 'compact' && <span className="material-symbols-outlined text-action text-sm">check</span>}
                  </button>
                  <button onClick={() => { onHistoryViewModeChange('details'); setIsMenuOpen(false); }} className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-lg ${currentHistoryViewMode === 'details' ? 'text-action' : 'text-slate-400'}`}>format_list_bulleted</span>
                      <span className={`text-sm font-normal font-sans ${currentHistoryViewMode === 'details' ? 'text-primary dark:text-white' : 'text-slate-400'}`}>Details</span>
                    </div>
                    {currentHistoryViewMode === 'details' && <span className="material-symbols-outlined text-action text-sm">check</span>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content with pt-32 to clear the fixed header */}
      <main className="flex-1 px-8 pt-32 pb-40 relative overflow-y-auto no-scrollbar">
        {renderViewContent()}
      </main>

      {selectedDayEntry && selectedSig && (
        <div className="fixed bottom-32 left-6 right-6 p-5 glass bg-white/95 dark:bg-zinc-900/95 border border-slate-100 dark:border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl animate-fade-in z-30">
          <div className="flex items-start gap-4">
            <Pebble 
              color={selectedSig.color} 
              shapeClass={selectedSig.shapeClass} 
              finish={selectedSig.finish} 
              size="sm" 
              className="flex-shrink-0 mt-1"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <p className="text-[10px] font-bold text-action uppercase tracking-[0.2em]">
                  {selectedDayEntry.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
                <button 
                  onClick={() => setSelectedDayEntry(null)}
                  className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm text-slate-300">close</span>
                </button>
              </div>
              <h4 className="font-serif italic text-primary dark:text-white text-lg mb-1">{selectedSig.name}</h4>
              {selectedDayEntry.content && (
                <p className="text-sm text-slate-600 dark:text-slate-400 font-serif leading-relaxed line-clamp-2 italic">
                  {selectedDayEntry.content}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
