import { KEY_PREFIX } from '@/app/constants';
import { createContext, type ReactNode, useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = `${KEY_PREFIX}config_darkMode`;

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const updateThemeAttribute = (isDark: boolean) => {
  document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    try {
      const savedMode = localStorage.getItem(STORAGE_KEY);
      const isDark = savedMode ? JSON.parse(savedMode) : false;
      setIsDarkMode(isDark);
      updateThemeAttribute(isDark);
    } catch {
      console.error('Failed to retrieve dark mode state');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMode));
      updateThemeAttribute(newMode);
      return newMode;
    });
  }, []);

  return <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>{children}</ThemeContext.Provider>;
};
