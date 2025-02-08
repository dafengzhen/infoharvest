import { KEY_PREFIX } from '@/app/constants';
import { createContext, type ReactNode, useCallback, useEffect, useState } from 'react';

export interface ConfigContextType<T> {
  config: T;
  updateConfig: (newConfig: Partial<T>) => void;
}

export const ConfigContext = createContext<ConfigContextType<unknown> | undefined>(undefined);

export const ConfigProvider = <T,>({
  children,
  configKey,
  defaultConfig,
}: Readonly<{
  children: ReactNode;
  configKey: string;
  defaultConfig: T;
}>) => {
  const STORAGE_KEY = `${KEY_PREFIX}config_${configKey}`;
  const [config, setConfig] = useState<T>(defaultConfig);

  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY);
      if (savedConfig) {
        setConfig({ ...defaultConfig, ...JSON.parse(savedConfig) });
      }
    } catch {
      console.error('Failed to retrieve configuration');
    }
  }, [defaultConfig, STORAGE_KEY]);

  const updateConfig = useCallback(
    (newConfig: Partial<T>) => {
      setConfig((prevConfig) => {
        const updatedConfig = { ...prevConfig, ...newConfig };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfig));
        return updatedConfig;
      });
    },
    [STORAGE_KEY],
  );

  return <ConfigContext.Provider value={{ config, updateConfig }}>{children}</ConfigContext.Provider>;
};
