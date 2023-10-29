'use client';

import { useEffect } from 'react';
import { themeChange } from 'theme-change';

export default function Home() {
  useEffect(() => {
    themeChange(false);
  }, []);

  return <div></div>;
}
