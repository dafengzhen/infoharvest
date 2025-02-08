import type { ConfigContextType } from '@/app/contexts/config';

import { useFetchUserProfile } from '@/app/apis/users';
import { TK } from '@/app/constants';
import { AuthContext } from '@/app/contexts/auth';
import { ConfigContext } from '@/app/contexts/config';
import { ThemeContext } from '@/app/contexts/theme';
import { getPublicPath } from '@/app/tools';
import { useContext, useEffect, useState } from 'react';

const baseUrl = process.env.NEXT_PUBLIC_API_SERVER || '';

const publicPath = getPublicPath();

export const useResolvedUrl = (path: null | string | undefined) => {
  const [url, setUrl] = useState<null | string | undefined>(null);

  useEffect(() => {
    if (path) {
      setUrl(/^https?:\/\//.test(path) ? path : `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`);
    }
  }, [path]);

  return url;
};

export const useStoredTicket = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useStoredTicket must be used within an AuthProvider');
  }

  return context.token;
};

export const useSetToken = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSetToken must be used within an AuthProvider');
  }

  return (token: string) => {
    context.setToken(token);
    localStorage.setItem(TK, token);
  };
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useConfig = <T>() => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context as ConfigContextType<T>;
};

export const useUser = () => {
  const userProfileQuery = useFetchUserProfile();

  useEffect(() => {
    if (
      userProfileQuery.isSuccess &&
      (!userProfileQuery.data ||
        typeof userProfileQuery.data !== 'object' ||
        Object.keys(userProfileQuery.data).length === 0)
    ) {
      location.assign(publicPath + '/login');
    }
  }, [userProfileQuery.data, userProfileQuery.isSuccess]);

  return userProfileQuery.data;
};

export const useUserWallpaper = () => {
  const [wallpaperExists, setWallpaperExists] = useState(false);

  const userData = useUser();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const wallpaper = userData?.customConfig?.wallpaper;

    if (wallpaper) {
      const img = new Image();
      img.src = wallpaper;

      img.onload = () => {
        document.body.style.backgroundImage = `url("${wallpaper}")`;
        document.body.classList.add('wallpaper');
        setWallpaperExists(true);

        if (!isDarkMode) {
          toggleTheme();
        }
      };

      img.onerror = (event, source, lineno, colno, error) => {
        document.body.style.backgroundImage = '';
        document.body.classList.remove('wallpaper');
        setWallpaperExists(false);
        console.error(error);
      };
    } else {
      document.body.style.backgroundImage = '';
      document.body.classList.remove('wallpaper');
      setWallpaperExists(false);
    }
  }, [isDarkMode, toggleTheme, userData?.customConfig?.wallpaper]);

  return { wallpaperExists };
};
