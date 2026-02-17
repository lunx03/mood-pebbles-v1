import React from 'react';
import { MoodSignature } from '../types';

interface WelcomeViewProps {
  signatures: MoodSignature[];
  onSelect: (id: string) => void;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ signatures, onSelect }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 pb-24">
      <div className="text-center mb-8 animate-zoom-out">
        <h1 className="text-5xl font-display text-primary mb-2">Moodpebbles</h1>
        <p className="text-lg text-muted font-serif italic">The Art of Feelings</p>
      </div>
      
      <div className="w-full max-w-xs mb-8">
        <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
          Select a pebble to capture your mood
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          {signatures.map((sig) => (
            <button
              key={sig.id}
              onClick={() => onSelect(sig.id)}
              className="group relative h-32 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Pebble background */}
              <div
                className={`absolute inset-0 ${sig.shapeClass} ${
                  sig.finish === 'polished' ? 'shadow-inner' : ''
                }`}
                style={{ backgroundColor: sig.color }}
              />
              
              {/* Finish effects */}
              {sig.finish === 'textured' && (
                <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.5"/%3E%3C/svg%3E")'
                }}/>
              )}
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white group-hover:bg-black/10 transition-colors">
                <p className="font-serif font-bold text-sm text-center px-2">{sig.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeView;