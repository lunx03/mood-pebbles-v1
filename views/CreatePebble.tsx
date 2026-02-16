
import React, { useState } from 'react';
import { MoodSignature, SurfaceFinish } from '../types';
import { COLORS, SHAPES, FINISHES } from '../constants';
import Pebble from '../components/Pebble';

interface CreatePebbleProps {
  onBack: () => void;
  onSave: (sig: MoodSignature) => void;
  signaturesCount: number;
}

export default function CreatePebbleView({ onBack, onSave, signaturesCount }: CreatePebbleProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [shape, setShape] = useState(SHAPES[0]);
  const [finish, setFinish] = useState<SurfaceFinish>('polished');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAtLimit = signaturesCount >= 12;

  const handleSave = async () => {
    if (isAtLimit || isSubmitting) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    onSave({
      id: Date.now().toString(),
      name: name.trim() || 'Untitled',
      category: category.trim() || 'Mood',
      color,
      shapeClass: shape,
      finish,
      description: 'A custom mood stone.'
    });
    setIsSubmitting(false);
  };

  return (
    <div className="flex-1 flex flex-col antialiased bg-background-light dark:bg-background-dark h-screen overflow-hidden">
      <header className="flex-shrink-0 px-6 pt-12 pb-4 flex items-center justify-between z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <button 
          onClick={onBack} 
          disabled={isSubmitting}
          className="w-10 h-10 -ml-2 flex items-center justify-center text-muted hover:text-primary transition-colors"
          aria-label="Back"
        >
          <span className="material-symbols-outlined text-2xl">chevron_left</span>
        </button>
        
        <button 
          onClick={handleSave}
          disabled={isAtLimit || isSubmitting}
          className={`w-10 h-10 rounded-full transition-all flex items-center justify-center shadow-sm ${!isAtLimit && !isSubmitting ? 'bg-action text-primary active:scale-95 hover:shadow-md' : 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800'}`}
          title="Add Pebble"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          ) : (
            <span className="material-symbols-outlined text-2xl">add</span>
          )}
        </button>
      </header>

      <section className="flex-shrink-0 flex flex-col items-center py-6 bg-background-light dark:bg-background-dark z-40">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <div className="absolute inset-0 opacity-15 blur-3xl rounded-full" style={{ backgroundColor: color }} />
          <Pebble color={color} shapeClass={shape} finish={finish} size="xl" className="!w-36 !h-36" animate={false} />
        </div>
        <div className="mt-4 flex flex-col items-center">
          <p className="font-serif italic text-primary dark:text-gray-300 mt-0.5 text-base">{name || 'Your Mood'}</p>
        </div>
      </section>

      <main className="flex-1 overflow-y-auto px-6 pb-40 no-scrollbar">
        <div className="max-w-lg mx-auto w-full pt-2 space-y-4">
          <section>
            <h3 className="text-[10px] tracking-[0.2em] font-bold text-muted uppercase mb-1 ml-1">Colour</h3>
            <div className="flex space-x-4 overflow-x-auto pt-6 pb-10 no-scrollbar px-4 -mx-4">
              {COLORS.map(c => (
                <button 
                  key={c}
                  onClick={() => setColor(c)}
                  className={`flex-shrink-0 h-10 w-10 rounded-full transition-all relative ${color === c ? 'ring-2 ring-primary dark:ring-white ring-offset-[3px] ring-offset-background-light dark:ring-offset-background-dark scale-[1.03]' : 'hover:scale-[1.03] opacity-70'}`}
                  style={{ backgroundColor: c }}
                >
                   {color === c && <div className="absolute inset-0 rounded-full bg-white/30 animate-pulse" />}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[10px] tracking-[0.2em] font-bold text-muted uppercase mb-1 ml-1">Shape</h3>
            <div className="flex space-x-6 overflow-x-auto pt-6 pb-10 no-scrollbar px-4 -mx-4">
              {SHAPES.map(s => (
                <div key={s} className="flex flex-col items-center flex-shrink-0">
                  <Pebble 
                    color={color} 
                    shapeClass={s} 
                    finish="none" 
                    size="sm" 
                    onClick={() => setShape(s)}
                    className={`transition-all duration-300 ${shape === s ? 'ring-2 ring-primary dark:ring-white ring-offset-[3px] ring-offset-background-light dark:ring-offset-background-dark scale-110 opacity-100 shadow-md' : 'opacity-40 saturate-50 hover:opacity-100 hover:saturate-100'}`}
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[10px] tracking-[0.2em] font-bold text-muted uppercase mb-1 ml-1">Surface Finish</h3>
            <div className="flex space-x-5 overflow-x-auto pt-6 pb-10 no-scrollbar px-4 -mx-4">
              {FINISHES.map(f => (
                <div key={f} className="flex flex-col items-center flex-shrink-0">
                  <Pebble 
                    color={color} 
                    shapeClass={shape} 
                    finish={f} 
                    size="sm" 
                    onClick={() => setFinish(f)}
                    className={`mb-3 transition-all duration-300 ${finish === f ? 'ring-2 ring-primary dark:ring-white ring-offset-[3px] ring-offset-background-light dark:ring-offset-background-dark scale-[1.03] opacity-100' : 'opacity-30 saturate-50 hover:opacity-100 hover:saturate-100'}`}
                  />
                  <span className={`text-[8px] font-bold tracking-widest uppercase transition-colors ${finish === f ? 'text-primary dark:text-white' : 'text-muted'}`}>
                    {f}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4 pb-12">
            <div className="space-y-1">
              <label className="text-[10px] tracking-[0.2em] font-bold text-muted uppercase ml-1">Name Your Feeling</label>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-800 rounded-3xl px-6 py-4 text-base focus:ring-action focus:border-action placeholder:text-muted/40 dark:placeholder:text-stone-700 transition-all text-primary dark:text-white font-sans shadow-sm" 
                placeholder="e.g., Morning Meadow" 
                type="text"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] tracking-[0.2em] font-bold text-muted uppercase ml-1">Describe the Essence</label>
              <input 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-800 rounded-3xl px-6 py-4 text-base focus:ring-action focus:border-action placeholder:text-muted/40 dark:placeholder:text-stone-700 transition-all text-primary dark:text-white font-sans shadow-sm" 
                placeholder="e.g., Calm, Excited, etc." 
                type="text"
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
