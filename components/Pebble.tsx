
import React from 'react';
import { SurfaceFinish } from '../types';

interface PebbleProps {
  color: string;
  shapeClass: string;
  finish: SurfaceFinish;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'col';
  className?: string;
  onClick?: () => void;
  animate?: boolean;
}

// Added React.FC type to Pebble to ensure standard React props like 'key' are correctly handled by the type checker
const Pebble: React.FC<PebbleProps> = ({ 
  color, 
  shapeClass, 
  finish, 
  size = 'md', 
  className = '', 
  onClick,
  animate = false
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-40 h-40',
    col: 'w-[104px] h-[104px]',
  };

  const getFinishOverlay = () => {
    switch (finish) {
      case 'polished':
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute top-[22%] left-[25%] w-[32%] h-[18%] bg-white/70 rounded-[50%]" 
              style={{ transform: 'rotate(-15deg)' }}
            />
          </div>
        );
      case 'textured':
        return (
          <div className="absolute inset-0 pointer-events-none opacity-60 mix-blend-soft-light overflow-hidden">
             <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="scale-125">
               <defs>
                 <filter id="caustic-blur-final">
                   <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
                 </filter>
               </defs>
               <g filter="url(#caustic-blur-final)">
                 <path d="M-10,20 Q30,10 50,40 T110,20" fill="none" stroke="#F5EBE0" strokeWidth="5" strokeLinecap="round" />
                 <path d="M-10,50 Q20,80 60,50 T110,80" fill="none" stroke="#F5EBE0" strokeWidth="6" strokeLinecap="round" />
                 <path d="M20,-10 Q50,30 20,60 T40,110" fill="none" stroke="#F5EBE0" strokeWidth="4" strokeLinecap="round" />
                 <path d="M70,-10 Q40,40 80,70 T60,110" fill="none" stroke="#F5EBE0" strokeWidth="5.5" strokeLinecap="round" />
               </g>
             </svg>
          </div>
        );
      case 'matte':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.25] mix-blend-overlay">
              <filter id="matte-grain-noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
                <feComponentTransfer>
                  <feFuncR type="linear" slope="2" intercept="-0.5" />
                  <feFuncG type="linear" slope="2" intercept="-0.5" />
                  <feFuncB type="linear" slope="2" intercept="-0.5" />
                </feComponentTransfer>
              </filter>
              <rect width="100%" height="100%" filter="url(#matte-grain-noise)" />
            </svg>
            <div 
              className="absolute inset-0 opacity-[0.3]" 
              style={{ 
                backgroundImage: `radial-gradient(rgba(0,0,0,0.8) 0.7px, transparent 0)`,
                backgroundSize: '4px 4px',
              }} 
            />
            <div 
              className="absolute inset-0 opacity-[0.2]" 
              style={{ 
                backgroundImage: `radial-gradient(rgba(255,255,255,0.9) 0.6px, transparent 0)`,
                backgroundSize: '5px 5px',
                backgroundPosition: '2px 2px'
              }} 
            />
            <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.05] mix-blend-multiply">
              <filter id="matte-depth">
                <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" />
              </filter>
              <rect width="100%" height="100%" filter="url(#matte-depth)" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`relative cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden ${sizeClasses[size]} ${shapeClass} ${className} ${animate ? 'floating' : ''}`}
      style={{ backgroundColor: color }}
    >
      {finish === 'polished' && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10 pointer-events-none" />
      )}
      {getFinishOverlay()}
    </div>
  );
};

export default Pebble;
