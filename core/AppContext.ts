// The React context object and its consumer hook live in their own module so
// that store.tsx can export only the <AppProvider> component. Keeping the hook
// (a non-component export) out of the provider file satisfies react-refresh and
// keeps Fast Refresh working reliably during development.

import { createContext, useContext } from 'react';
import type { AppContextType } from './types';

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
