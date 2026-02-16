
import React, { useMemo } from 'react';
import { MoodSignature } from '../types';
import Pebble from '../components/Pebble';

interface WelcomeProps {
  signatures: MoodSignature[];
  onSelect: (id: string) => void;
}

const WelcomeView: React.FC<WelcomeProps> = ({ signatures, onSelect }) => {
  // Max limit is now 12
  const displaySignatures = signatures.slice(0, 12);
  const n = displaySignatures.length;
  const shouldScatter = n > 7;

  // Generate stable positions for pebbles
  const positions = useMemo(() => {
    if (!shouldScatter) {
      // Perfect ring for 7 or fewer items
      return displaySignatures.map((_, idx) => {
        const radius = 34; // radius in %
        const angle = (idx / n) * 2 * Math.PI - Math.PI / 2;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        return { left: `${x}%`, top: `${y}%` };
      });
    } else {
      // For more than 7, all pebbles scatter naturally.
      // We use a modified spiral to ensure no overlap and a healthy gap.
      // Pebble size "md" is 64px, which is ~20% of a 320px container.
      // To keep 0.5 pebble distance, we need ~30% center-to-center distance.
      const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
      const START_RADIUS = 30; // Radius of central plate
      const RADIUS_STEP = 5.2; // Increase radius for each item to prevent overlap
      
      return displaySignatures.map((sig, idx) => {
        // Deterministic offset to make the layout feel less mechanical
        const hash = sig.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        // Base spiral index
        const i = idx + 2.5; 
        const angle = i * GOLDEN_ANGLE + (hash % 100) / 500;
        
        // Radius grows as we go to outer rings
        const radius = START_RADIUS + Math.sqrt(i) * RADIUS_STEP;

        // Convert polar to cartesian
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        
        return { left: `${x}%`, top: `${y}%` };
      });
    }
  }, [displaySignatures, shouldScatter, n]);

  return (
    <div className="flex-1 flex flex-col justify-between p-8 relative overflow-hidden">
      <header className="text-center mt-12 space-y-2 z-10">
        <h1 className="font-display text-5xl tracking-tight text-primary dark:text-gray-100">Moodpebbles</h1>
        <p className="uppercase tracking-[0.3em] text-[10px] font-medium text-muted dark:text-gray-400">The Art of Feelings</p>
      </header>

      <main className="relative flex-1 flex items-center justify-center">
        {/* Container with a defined square aspect for consistent placement */}
        <div className="relative w-full aspect-square max-w-sm flex items-center justify-center">
          
          {/* Central Asymmetry Placement Ring - Larger than pebble size */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-40 h-40 organic-shape-4 border-2 border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center transition-all duration-700">
                <div className="w-32 h-32 organic-shape-2 border border-dashed border-slate-100/40 dark:border-slate-900/40" />
             </div>
          </div>
          
          <div className="absolute inset-0">
            {displaySignatures.map((sig, idx) => {
              const pos = positions[idx];

              return (
                <div 
                  key={sig.id} 
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
                  style={pos}
                >
                  <Pebble 
                    color={sig.color} 
                    shapeClass={sig.shapeClass} 
                    finish={sig.finish}
                    size={shouldScatter ? "md" : "lg"}
                    onClick={() => onSelect(sig.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="mb-12 text-center z-10">
        <p className="font-display italic text-xl text-muted dark:text-gray-400 animate-pulse">
          How are you feeling right now?
        </p>
      </footer>
      
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
    </div>
  );
};

export default WelcomeView;
