'use client';

import { useEffect, useRef } from 'react';
import { Chart, type ChartData, type ChartOptions } from 'chart.js/auto';
import { type TUsersCountByDate } from '@/app/interfaces/user';

Chart.defaults.font = {
  ...Chart.defaults.font,
  size: 14,
};

export default function Home({
  countByDate,
}: {
  countByDate: TUsersCountByDate;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<'line', any, any>>();

  // useEffect(() => {
  //   themeChange(false);
  // }, []);

  useEffect(() => {
    const current = canvas.current;
    if (current) {
      chartRef.current = new Chart(current, {
        type: 'line',
        data: {
          labels: countByDate.map((item) => item.date),
          datasets: [
            {
              label: 'Count',
              data: countByDate.map((item) => item.count),
              pointRadius: 6,
              pointHoverRadius: 10,
              stepped: true,
            },
          ],
        } as ChartData<'line', any>,
        options: {
          responsive: true,
          interaction: {
            intersect: false,
            axis: 'x',
          },
          plugins: {
            title: {
              display: true,
              text: 'Statistics of User Registrations in the Past 15 Days',
            },
          },
          scales: {
            x: {
              display: true,
              title: {
                display: false,
              },
            },
            y: {
              display: true,
              title: {
                display: false,
              },
            },
          },
        } as ChartOptions<'line'>,
      });
    }

    return () => {
      if (current) {
        chartRef.current?.destroy();
      }
    };
  }, [canvas.current]);

  return (
    <div className="m-auto py-4">
      <div className="grid gap-4 grid-cols-8 min-h-screen items-center">
        <div></div>
        <div className="bg-card border col-span-6 rounded-xl shadow p-4">
          <canvas ref={canvas}></canvas>
        </div>
        <div></div>
      </div>
    </div>
  );
}
