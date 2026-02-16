
import React, { useState } from 'react';
import { MoodSignature, JournalEntry } from '../types';
import Pebble from '../components/Pebble';

interface JournalProps {
  signature: MoodSignature;
  history: JournalEntry[];
  onBack: () => void;
  onSubmit: (content: string, skipAI: boolean) => Promise<void>;
  onSelectEntry: (id: string) => void;
  isReplaceMode?: boolean;
}

const JournalView: React.FC<JournalProps> = ({ signature, history, onBack, onSubmit, onSelectEntry, isReplaceMode }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    await onSubmit(content, false);
    setIsSubmitting(false);
  };

  return (
    <div className="flex-1 flex flex-col antialiased h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Top Header Navigation */}
      <header className="flex-shrink-0 px-6 pt-12 pb-4 flex items-center justify-between z-20">
        <button 
          onClick={onBack} 
          disabled={isSubmitting}
          className="w-10 h-10 -ml-2 flex items-center justify-center text-muted hover:text-primary transition-colors"
          aria-label="Back"
        >
          <span className="material-symbols-outlined text-2xl">chevron_left</span>
        </button>
        
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-10 h-10 rounded-full transition-all flex items-center justify-center shadow-sm ${!isSubmitting ? 'bg-action text-primary active:scale-95 hover:shadow-md' : 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800'}`}
          title={isReplaceMode ? 'Replace Entry' : 'Capture Entry'}
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          ) : (
            <span className="material-symbols-outlined text-2xl">
              {isReplaceMode ? 'published_with_changes' : 'check'}
            </span>
          )}
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center px-8 pb-32 max-w-lg mx-auto w-full overflow-hidden">
        {/* Top Section: Pebble and Identity */}
        <div className="flex flex-col items-center mt-16 mb-8 w-full flex-shrink-0">
          <div className="relative mb-3">
            <Pebble 
              color={signature.color} 
              shapeClass={signature.shapeClass} 
              finish={signature.finish} 
              size="xl" 
              className="shadow-xl !w-[136px] !h-[136px]"
              animate={true}
            />
          </div>
          <h2 className="text-2xl font-serif italic text-primary dark:text-white mb-0.5">{signature.name}</h2>
          <p className="text-[9px] uppercase tracking-[0.2em] font-semibold text-muted">{signature.category}</p>
        </div>

        {/* Middle Section: Flexible Text Area */}
        <div className="w-full flex-1 min-h-0 flex flex-col relative">
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, 1000))}
            disabled={isSubmitting}
            maxLength={1000}
            className="flex-1 w-full p-6 text-base bg-white/60 dark:bg-slate-900/50 border-2 border-white dark:border-slate-800 focus:border-action dark:focus:border-action rounded-3xl shadow-sm focus:ring-0 placeholder:text-muted/50 dark:placeholder:text-slate-700 transition-all resize-none font-serif leading-relaxed text-primary overflow-y-auto no-scrollbar" 
            placeholder={isReplaceMode ? "Update your reflection for today..." : "How does this feeling sit with you? (Optional)"} 
          />
          <div className="w-full flex justify-end mt-2 px-2">
            <span className="text-[10px] tracking-widest font-normal text-muted/60">
              {content.length}/1000
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JournalView;
