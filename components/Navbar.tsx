
import React from 'react';
import { AppScreen } from '../types';

interface NavbarProps {
  currentScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentScreen, setScreen }) => {
  const isActive = (screens: AppScreen[]) => screens.includes(currentScreen);

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[85%] max-w-sm z-50">
      <div className="glass bg-white/30 dark:bg-zinc-900/30 border border-white/20 dark:border-white/5 shadow-2xl rounded-full px-6 py-1.5 flex justify-between items-center transition-all duration-500">
        <button 
          onClick={() => setScreen(AppScreen.TODAY_SUMMARY)}
          className={`flex flex-col items-center group transition-all ${isActive([AppScreen.TODAY_SUMMARY]) ? 'scale-110 text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-600'}`}
        >
          <span className="material-symbols-outlined text-[28px]">palette</span>
          <div className={`w-1 h-1 rounded-full mt-0.5 ${isActive([AppScreen.TODAY_SUMMARY]) ? 'bg-current' : 'bg-transparent'}`} />
        </button>

        <button 
          onClick={() => setScreen(AppScreen.CALENDAR)}
          className={`flex flex-col items-center group transition-all ${isActive([AppScreen.CALENDAR, AppScreen.HISTORY_LIST, AppScreen.YEARLY]) ? 'scale-110 text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-600'}`}
        >
          <span className="material-symbols-outlined text-[28px]">calendar_today</span>
          <div className={`w-1 h-1 rounded-full mt-0.5 ${isActive([AppScreen.CALENDAR, AppScreen.HISTORY_LIST, AppScreen.YEARLY]) ? 'bg-current' : 'bg-transparent'}`} />
        </button>

        <button 
          onClick={() => setScreen(AppScreen.COLLECTION)}
          className={`flex flex-col items-center group transition-all ${isActive([AppScreen.COLLECTION, AppScreen.CREATE_PEBBLE]) ? 'scale-110 text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-600'}`}
        >
          <span className="material-symbols-outlined text-[28px]">person</span>
          <div className={`w-1 h-1 rounded-full mt-0.5 ${isActive([AppScreen.COLLECTION, AppScreen.CREATE_PEBBLE]) ? 'bg-current' : 'bg-transparent'}`} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
