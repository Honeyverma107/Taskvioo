// ThemeContext.jsx

import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {

  // Initial Theme
  const [dark, setDark] = useState(() => {

    const savedTheme = localStorage.getItem('taskvio_theme');

    // If theme exists in storage
    if (savedTheme) {
      return savedTheme === 'dark';
    }

    // System preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply Theme
  useEffect(() => {

    const root = document.documentElement;

    if (dark) {

      root.classList.add('dark');

      root.style.colorScheme = 'dark';

      localStorage.setItem('taskvio_theme', 'dark');

    } else {

      root.classList.remove('dark');

      root.style.colorScheme = 'light';

      localStorage.setItem('taskvio_theme', 'light');
    }

  }, [dark]);

  // Listen System Theme Changes
  useEffect(() => {

    const mediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );

    const handleThemeChange = (e) => {

      const savedTheme = localStorage.getItem('taskvio_theme');

      // Only auto change if user hasn't manually selected
      if (!savedTheme) {
        setDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      mediaQuery.removeEventListener(
        'change',
        handleThemeChange
      );
    };

  }, []);

  // Toggle Theme
  const toggle = () => {
    setDark((prev) => !prev);
  };

  // Set Explicit Theme
  const setTheme = (theme) => {
    setDark(theme === 'dark');
  };

  return (
    <ThemeContext.Provider
      value={{
        dark,
        toggle,
        setTheme,
        theme: dark ? 'dark' : 'light'
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Hook
export const useTheme = () => {
  return useContext(ThemeContext);
};