import React from 'react';
import { AppScreen } from '../types';

interface NavbarProps {
  currentScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentScreen, setScreen }) => {
  const isActive = (screen: AppScreen) => currentScreen === screen;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark">
      <div className="flex justify-around items-center py-3 px-2">
        <button
          onClick={() => setScreen(AppScreen.WELCOME)}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
            isActive(AppScreen.WELCOME)
              ? 'text-primary'
              : 'text-muted hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-xl">home</span>
          <span className="text-xs">Home</span>
        </button>
        
        <button
          onClick={() => setScreen(AppScreen.CALENDAR)}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
            isActive(AppScreen.CALENDAR) || isActive(AppScreen.YEARLY)
              ? 'text-primary'
              : 'text-muted hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-xl">calendar_month</span>
          <span className="text-xs">History</span>
        </button>
        
        <button
          onClick={() => setScreen(AppScreen.COLLECTION)}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
            isActive(AppScreen.COLLECTION)
              ? 'text-primary'
              : 'text-muted hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-xl">palette</span>
          <span className="text-xs">Pebbles</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;