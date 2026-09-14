'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  mounted: boolean;
}

const STORAGE_KEY = 'agriai_theme';
const DEFAULT_THEME: Theme = 'light';

const ThemeContext = createContext<ThemeContextType>({
  theme: DEFAULT_THEME,
  resolvedTheme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
  mounted: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [mounted, setMounted] = useState(false);

  // Helper to resolve system theme
  const getSystemTheme = useCallback((): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // Update DOM when effective theme changes
  const applyThemeToDOM = useCallback((effective: ResolvedTheme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (effective === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }, []);

  // Initial load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      const initialTheme: Theme =
        stored === 'light' || stored === 'dark' || stored === 'system'
          ? stored
          : DEFAULT_THEME;

      setThemeState(initialTheme);

      const effective: ResolvedTheme =
        initialTheme === 'system' ? getSystemTheme() : initialTheme;
      setResolvedTheme(effective);
      applyThemeToDOM(effective);
    } catch {
      // Fallback to light mode on error
      setThemeState('light');
      setResolvedTheme('light');
      applyThemeToDOM('light');
    } finally {
      setMounted(true);
    }
  }, [getSystemTheme, applyThemeToDOM]);

  // Handle system preference changes when in 'system' mode
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const newResolved = e.matches ? 'dark' : 'light';
        setResolvedTheme(newResolved);
        applyThemeToDOM(newResolved);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
      return () => mediaQuery.removeEventListener('change', handleMediaChange);
    } else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(handleMediaChange);
      return () => (mediaQuery as any).removeListener(handleMediaChange);
    }
  }, [theme, applyThemeToDOM]);

  // Handle storage sync across tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const newTheme = (e.newValue as Theme) || DEFAULT_THEME;
        if (newTheme === 'light' || newTheme === 'dark' || newTheme === 'system') {
          setThemeState(newTheme);
          const effective: ResolvedTheme =
            newTheme === 'system' ? getSystemTheme() : newTheme;
          setResolvedTheme(effective);
          applyThemeToDOM(effective);
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [getSystemTheme, applyThemeToDOM]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      try {
        localStorage.setItem(STORAGE_KEY, newTheme);
      } catch (err) {
        console.warn('Unable to persist theme to localStorage:', err);
      }

      const effective: ResolvedTheme =
        newTheme === 'system' ? getSystemTheme() : newTheme;
      setResolvedTheme(effective);
      applyThemeToDOM(effective);

      // Dispatch custom event for external subscribers
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('agriai:theme-changed', {
            detail: { theme: newTheme, resolvedTheme: effective },
          })
        );
      }
    },
    [getSystemTheme, applyThemeToDOM]
  );

  const toggleTheme = useCallback(() => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
