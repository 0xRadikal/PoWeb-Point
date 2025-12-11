
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useApp } from '../../core/store';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useApp();

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="fixed top-4 md:top-8 z-50 p-2 md:p-3 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur border border-slate-200/50 dark:border-white/10 text-slate-800 dark:text-white hover:scale-110 transition-all active:scale-95 ltr:left-4 md:ltr:left-8 rtl:right-4 md:rtl:right-8 pointer-events-auto shadow-sm"
      title="Toggle Theme"
    >
      {theme === 'light' ? <Moon size={18} className="md:w-5 md:h-5" /> : <Sun size={18} className="md:w-5 md:h-5" />}
    </button>
  );
};
