
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { JournalEntry, MoodSignature } from '../types';
import Pebble from '../components/Pebble';

interface YearlyProps {
  history: JournalEntry[];
  signatures: MoodSignature[];
  targetYear: number;
  onMonthSelect: (month: number, year: number) => void;
}

const YearlyView: React.FC<YearlyProps> = ({ history, signatures, targetYear, onMonthSelect }) => {
  const [currentViewYear, setCurrentViewYear] = useState(targetYear);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Update internal state if the prop changes
  useEffect(() => {
    setCurrentViewYear(targetYear);
  }, [targetYear]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

  const dataByYearMap = useMemo(() => {
    const map: Record<number, Record<string, JournalEntry>> = {};
    history.forEach(entry => {
      const d = new Date(entry.date);
      const y = d.getFullYear();
      if (!map[y]) map[y] = {};
      const key = `${d.getMonth()}-${d.getDate()}`;
      if (!map[y][key] || d.getTime() > new Date(map[y][key].date).getTime()) {
        map[y][key] = entry;
      }
    });
    return map;
  }, [history]);

  const yearData = useMemo(() => dataByYearMap[currentViewYear] || {}, [dataByYearMap, currentViewYear]);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    
    return history.filter(entry => {
      const sig = signatures.find(s => s.id === entry.signatureId);
      const date = new Date(entry.date);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toLowerCase();
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      
      return (
        entry.content.toLowerCase().includes(term) ||
        (sig && sig.name.toLowerCase().includes(term)) ||
        dateStr.includes(term) ||
        dayName.includes(term)
      );
    }).sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [history, signatures, searchTerm]);

  const handleResultClick = (entry: JournalEntry) => {
    const d = new Date(entry.date);
    onMonthSelect(d.getMonth(), d.getFullYear());
    setIsSearchOpen(false);
    setSearchTerm('');
  };

  const handleToday = () => {
    setCurrentViewYear(new Date().getFullYear());
  };

  return (
    <div className="flex-1 flex flex-col antialiased bg-background-light dark:bg-background-dark overflow-hidden relative h-screen">
      {/* Refined Fixed Header - Matches TodaySummary and Collection aesthetic */}
      <header className="fixed top-0 left-0 right-0 px-6 pt-12 pb-4 flex items-center justify-between z-[80] bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="w-20">
          <button 
            onClick={handleToday}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-action transition-all active:scale-95"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-center">
          <button 
            onClick={() => setCurrentViewYear(prev => prev - 1)}
            className="w-8 h-8 flex items-center justify-center text-muted hover:text-primary transition-colors active:scale-90"
          >
            <span className="material-symbols-outlined text-xl">chevron_left</span>
          </button>
          
          <h1 className="font-serif italic text-2xl tracking-tight text-primary dark:text-white">
            {currentViewYear}
          </h1>

          <button 
            onClick={() => setCurrentViewYear(prev => prev + 1)}
            className="w-8 h-8 flex items-center justify-center text-muted hover:text-primary transition-colors active:scale-90"
          >
            <span className="material-symbols-outlined text-xl">chevron_right</span>
          </button>
        </div>

        <div className="w-20 flex justify-end">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="w-8 h-8 flex items-center justify-center text-muted hover:text-primary transition-all active:scale-90"
            aria-label="Search"
          >
            <span className="material-symbols-outlined text-2xl">search</span>
          </button>
        </div>
      </header>

      {/* Main content with pt-32 to clear the fixed header */}
      <main 
        className="flex-1 overflow-y-auto no-scrollbar pb-60 pt-32 animate-zoom-out origin-center"
        key={currentViewYear}
      >
        <div className="grid grid-cols-3 gap-x-5 gap-y-12 px-6">
          {months.map((m, monthIdx) => {
            const daysInMonth = getDaysInMonth(currentViewYear, monthIdx);
            const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
            const isCurrentMonth = currentViewYear === new Date().getFullYear() && new Date().getMonth() === monthIdx;
            
            return (
              <div 
                key={m} 
                className="space-y-4 cursor-pointer group"
                onClick={() => onMonthSelect(monthIdx, currentViewYear)}
              >
                <h3 className={`text-[10px] tracking-[0.2em] uppercase font-black transition-colors group-hover:text-primary ${isCurrentMonth ? 'text-action' : 'text-gray-300 dark:text-zinc-700'}`}>
                  {m}
                </h3>
                
                <div className="grid grid-cols-7 gap-1 group-hover:opacity-80 transition-opacity">
                  {daysArray.map((day) => {
                    const entry = yearData[`${monthIdx}-${day}`];
                    const sig = entry ? signatures.find(s => s.id === entry.signatureId) : null;
                    const isToday = isCurrentMonth && new Date().getDate() === day;
                    
                    return (
                      <div key={day} className="w-full aspect-square flex items-center justify-center">
                        {sig ? (
                          <Pebble 
                            color={sig.color} 
                            shapeClass={sig.shapeClass} 
                            finish={sig.finish} 
                            size="xs" 
                            className={`transition-transform hover:scale-150 ${isToday ? 'ring-1 ring-action ring-offset-1 dark:ring-offset-zinc-900' : ''}`}
                            animate={false}
                          />
                        ) : (
                          <div className={`w-1 h-1 rounded-full ${isToday ? 'bg-action scale-150 animate-pulse' : 'bg-gray-100 dark:bg-zinc-900'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Ultra-Minimalist Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center">
          <div 
            className="absolute inset-0 bg-slate-900/20 dark:bg-black/60 backdrop-blur-sm animate-fade-in" 
            onClick={() => { setIsSearchOpen(false); setSearchTerm(''); }}
          />
          
          <div className="relative w-full max-w-md mt-6 px-4 animate-fade-in">
            <div className="glass bg-white/95 dark:bg-zinc-900/95 border border-white dark:border-white/5 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] rounded-[2.5rem] overflow-hidden flex flex-col max-h-[85vh]">
              <div className="flex items-center px-6 py-4 gap-3 border-b border-slate-50 dark:border-zinc-800">
                <span className="material-symbols-outlined text-muted text-xl">search</span>
                <input 
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search"
                  className="flex-1 bg-transparent border-none text-base font-serif focus:ring-0 placeholder:text-muted/40 dark:text-white"
                />
                <button 
                  onClick={() => { setIsSearchOpen(false); setSearchTerm(''); }}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-muted text-lg">close</span>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto px-2 py-4 no-scrollbar">
                {searchTerm.trim() ? (
                  searchResults.length > 0 && (
                    <div className="space-y-2">
                      {searchResults.map((entry) => {
                        const sig = signatures.find(s => s.id === entry.signatureId) || signatures[0];
                        const date = new Date(entry.date);
                        return (
                          <div 
                            key={entry.id} 
                            onClick={() => handleResultClick(entry)}
                            className="flex items-start gap-4 mx-2 p-4 rounded-[1.8rem] hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer group active:scale-[0.98]"
                          >
                            <Pebble color={sig.color} shapeClass={sig.shapeClass} finish={sig.finish} size="sm" className="mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-baseline">
                                <h4 className="font-serif italic text-primary dark:text-white text-base group-hover:text-action transition-colors">{sig.name}</h4>
                                <span className="text-[9px] font-bold tracking-widest text-muted uppercase">
                                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                              {entry.content && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-serif line-clamp-2 italic leading-relaxed mt-0.5">
                                  "{entry.content}"
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : null}
              </div>
              <div className="h-4 bg-slate-50/50 dark:bg-black/20"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YearlyView;
