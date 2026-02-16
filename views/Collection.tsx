
import React, { useState } from 'react';
import { MoodSignature } from '../types';
import Pebble from '../components/Pebble';

interface CollectionProps {
  signatures: MoodSignature[];
  archivedSignatures: MoodSignature[];
  onAdd: () => void;
  onSelect: (id: string) => void;
  onReorder: (newSigs: MoodSignature[]) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
}

const CollectionView: React.FC<CollectionProps> = ({ 
  signatures, 
  archivedSignatures,
  onAdd, 
  onSelect,
  onReorder,
  onDelete,
  onRestore
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [viewingArchive, setViewingArchive] = useState(false);

  const isAtLimit = signatures.length >= 12;
  const isAtMinimum = signatures.length <= 1;

  const moveSignature = (index: number, direction: 'left' | 'right') => {
    const newSigs = [...signatures];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSigs.length) return;
    
    [newSigs[index], newSigs[targetIndex]] = [newSigs[targetIndex], newSigs[index]];
    onReorder(newSigs);
  };

  return (
    <div className="flex-1 flex flex-col antialiased">
      <header className="fixed top-0 left-0 right-0 px-6 pt-12 pb-4 flex items-center justify-between z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="w-20 flex items-center gap-1">
          {viewingArchive ? (
            <button 
              onClick={() => setViewingArchive(false)} 
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-muted">arrow_back</span>
            </button>
          ) : (
            <button 
              onClick={onAdd} 
              disabled={isAtLimit}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isAtLimit ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/5 dark:hover:bg-white/10 text-muted'}`}
            >
              <span className="material-symbols-outlined text-2xl">add_circle</span>
            </button>
          )}
          
          {!viewingArchive && archivedSignatures.length > 0 && (
            <button 
              onClick={() => { setViewingArchive(true); setIsEditing(false); }} 
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-muted"
            >
              <span className="material-symbols-outlined text-xl">inventory_2</span>
            </button>
          )}
        </div>
        
        <h1 className="font-serif italic text-2xl tracking-tight text-primary dark:text-white flex-1 text-center">
          {viewingArchive ? 'Archive' : 'Collection'}
        </h1>
        
        <div className="w-20 flex justify-end">
          <button 
            onClick={() => { setIsEditing(!isEditing); setViewingArchive(false); }} 
            className={`w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${isEditing ? 'text-action' : 'text-muted'}`}
          >
            <span className="material-symbols-outlined text-2xl">{isEditing ? 'check_circle' : 'edit_note'}</span>
          </button>
        </div>
      </header>

      <main className="pt-32 pb-40 px-6 max-w-md mx-auto w-full">
        {!viewingArchive && (
          <div className="flex justify-center mb-6">
            <div className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center gap-3">
               <span className="text-[9px] uppercase tracking-widest font-bold text-muted">Stones Collected</span>
               <div className="flex items-baseline gap-1">
                 <span className={`text-xs font-bold ${isAtLimit ? 'text-action' : 'text-primary dark:text-white'}`}>{signatures.length}</span>
                 <span className="text-[10px] text-muted">/ 12</span>
               </div>
            </div>
          </div>
        )}

        <div className="text-center mb-10">
          <p className="font-serif italic text-muted dark:text-gray-400 text-sm leading-relaxed max-w-[240px] mx-auto">
            {viewingArchive 
              ? isAtLimit ? 'Collection is full. Archive another to restore these.' : 'Pebbles you’ve set aside. Restore them to bring them back.'
              : isEditing 
                ? 'Rearrange your collection or archive stones.'
                : 'Your personal library of emotional signatures.'}
          </p>
        </div>

        {viewingArchive ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-12">
            {archivedSignatures.map(sig => (
              <div key={sig.id} className="flex flex-col items-center text-center group relative">
                <div className="relative mb-3">
                  <Pebble 
                    color={sig.color} 
                    shapeClass={sig.shapeClass} 
                    finish={sig.finish} 
                    size="col" 
                    className="opacity-50 grayscale-[0.5]"
                  />
                  <button 
                    disabled={isAtLimit}
                    onClick={() => onRestore(sig.id)}
                    className={`absolute -top-1.5 -right-1.5 w-8 h-8 bg-white dark:bg-zinc-800 rounded-full shadow-md flex items-center justify-center text-primary ${isAtLimit ? 'opacity-30 grayscale cursor-not-allowed' : 'hover:scale-110'}`}
                  >
                    <span className="material-symbols-outlined text-base">unarchive</span>
                  </button>
                </div>
                <h3 className="font-serif italic text-sm text-primary dark:text-gray-100 truncate w-full">{sig.name}</h3>
              </div>
            ))}
            {archivedSignatures.length === 0 && (
              <div className="col-span-2 py-12 text-center text-muted italic text-sm">
                No archived pebbles.
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-12">
            {signatures.map((sig, idx) => (
              <div key={sig.id} className="flex flex-col items-center text-center group relative">
                <div className="relative mb-3">
                  <Pebble 
                    color={sig.color} 
                    shapeClass={sig.shapeClass} 
                    finish={sig.finish} 
                    size="col" 
                    className={`${isEditing ? 'ring-1 ring-slate-100 dark:ring-white/10' : ''}`}
                    onClick={() => !isEditing && onSelect(sig.id)}
                  />
                  
                  {isEditing && (
                    <>
                      <button 
                        onClick={(e) => { e.stopPropagation(); !isAtMinimum && onDelete(sig.id); }}
                        disabled={isAtMinimum}
                        className={`absolute -top-2 -right-2 w-8 h-8 bg-red-50 dark:bg-zinc-800 text-red-500 rounded-full shadow-md flex items-center justify-center z-10 ${isAtMinimum ? 'opacity-30 grayscale cursor-not-allowed' : 'hover:scale-110'}`}
                        title={isAtMinimum ? "You must keep at least one pebble." : "Archive Pebble"}
                      >
                        <span className="material-symbols-outlined text-base">archive</span>
                      </button>

                      <div className="absolute -left-4 inset-y-0 flex items-center">
                         {idx > 0 && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); moveSignature(idx, 'left'); }}
                            className="w-8 h-8 bg-white dark:bg-zinc-800 rounded-full shadow-md flex items-center justify-center text-muted hover:text-primary"
                          >
                            <span className="material-symbols-outlined text-xl">chevron_left</span>
                          </button>
                        )}
                      </div>
                      <div className="absolute -right-4 inset-y-0 flex items-center">
                        {idx < signatures.length - 1 && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); moveSignature(idx, 'right'); }}
                            className="w-8 h-8 bg-white dark:bg-zinc-800 rounded-full shadow-md flex items-center justify-center text-muted hover:text-primary"
                          >
                            <span className="material-symbols-outlined text-xl">chevron_right</span>
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
                
                <h3 className="font-serif italic text-lg leading-tight text-primary dark:text-gray-100 mb-1 truncate w-full px-1">{sig.name}</h3>
                <span className="text-[10px] tracking-[0.2em] font-bold text-muted dark:text-gray-500 uppercase">{sig.category}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CollectionView;
