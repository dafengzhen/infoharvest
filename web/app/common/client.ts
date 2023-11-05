'use client';

import format from 'date-fns/format';

export const isHttpOrHttps = (value: string) => {
  return value.startsWith('http') || value.startsWith('https');
};

export const getFormattedTime = (time: string) => {
  const giveDate = new Date(time);
  return format(
    giveDate,
    new Date().getFullYear() === giveDate.getFullYear()
      ? 'MM-dd'
      : 'yyyy-MM-dd',
  );
};

export const formatCurrentDateTime = (date?: Date, f?: string) => {
  return format(date ?? new Date(), f ?? 'yyyy-MM-dd HH:mm:ss');
};
