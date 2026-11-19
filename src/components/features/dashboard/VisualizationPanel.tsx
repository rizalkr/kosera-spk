'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BookingData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    fill?: boolean;
    pointBackgroundColor?: string;
    pointBorderColor?: string;
    pointBorderWidth?: number;
    pointRadius?: number;
    pointHoverRadius?: number;
    borderWidth?: number;
  }[];
}

/**
 * VisualizationPanel displays booking trends with selectable time ranges.
 */
export const VisualizationPanel = () => {
  const [range, setRange] = useState<'7days' | 'month' | 'year'>('7days');

  const getLast7Days = (): string[] => {
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }));
    }
    return days;
  };

  const getLast12Months = (): string[] => {
    const months: string[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }));
    }
    return months;
  };

  const getLast5Years = (): string[] => {
    const years: string[] = [];
    const now = new Date();
    for (let i = 4; i >= 0; i--) {
      years.push((now.getFullYear() - i).toString());
    }
    return years;
  };

  const buildDataset = (data: number[]) => [
    {
      label: 'Bookings',
      data,
      borderColor: '#1E6B52',
      backgroundColor: 'rgba(30, 107, 82, 0.12)',
      tension: 0.38,
      fill: true,
      pointBackgroundColor: '#D96B38',
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 2.5,
    },
  ];

  const chartDataByRange: Record<'7days' | 'month' | 'year', BookingData> = {
    '7days': {
      labels: getLast7Days(),
      datasets: buildDataset([12, 19, 15, 25, 22, 30, 28]),
    },
    month: {
      labels: getLast12Months(),
      datasets: buildDataset([120, 140, 110, 180, 160, 200, 220, 210, 230, 250, 240, 260]),
    },
    year: {
      labels: getLast5Years(),
      datasets: buildDataset([1200, 1500, 1700, 2100, 2500]),
    },
  };

  const rangeTitles: Record<'7days' | 'month' | 'year', string> = {
    '7days': 'Tren Booking (7 Hari Terakhir)',
    month: 'Tren Booking (12 Bulan Terakhir)',
    year: 'Tren Booking (5 Tahun Terakhir)',
  };

  const lineOptions = {
    responsive: true,
    devicePixelRatio: 2,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#181A18',
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: rangeTitles[range],
        color: '#181A18',
        font: {
          size: 14,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      x: {
        display: true,
        ticks: {
          color: '#5A605B',
        },
        grid: {
          color: '#E6E2D8',
        },
      },
      y: {
        beginAtZero: true,
        display: true,
        ticks: {
          color: '#5A605B',
        },
        grid: {
          color: '#E6E2D8',
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2,
      },
      line: {
        borderWidth: 2.5,
        tension: 0.38,
      },
    },
  };

  return (
    <section className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div>
          <h2 className="text-base font-bold text-[var(--ink-primary)]">Tren Platform</h2>
          <p className="text-xs text-[var(--ink-secondary)] mt-0.5">
            Visualisasi aktivitas pengajuan booking berdasarkan rentang waktu.
          </p>
        </div>
        <select
          aria-label="Rentang waktu tren booking"
          className="px-3 py-2 text-xs font-semibold bg-[var(--bg-canvas)] text-[var(--ink-primary)] border border-[var(--border-stone)] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)]"
          value={range}
          onChange={(e) => setRange(e.target.value as '7days' | 'month' | 'year')}
        >
          <option value="7days">7 Hari Terakhir</option>
          <option value="month">12 Bulan Terakhir</option>
          <option value="year">5 Tahun Terakhir</option>
        </select>
      </div>
      <div className="h-80 w-full">
        <Line data={chartDataByRange[range]} options={lineOptions} />
      </div>
    </section>
  );
};
