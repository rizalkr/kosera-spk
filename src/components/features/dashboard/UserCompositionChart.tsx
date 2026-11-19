'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface UserCompositionData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

export const UserCompositionChart = () => {
  const userCompositionData: UserCompositionData = {
    labels: ['Pencari Kos (Renter)', 'Pemilik Kos (Seller)'],
    datasets: [
      {
        label: 'Pengguna',
        data: [267, 89],
        backgroundColor: ['#1E6B52', '#D96B38'],
        borderColor: ['#FFFFFF', '#FFFFFF'],
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    devicePixelRatio: 2,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 16,
          usePointStyle: true,
          color: '#181A18',
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
      },
    },
  };

  return (
    <div className="h-64 w-full flex justify-center items-center">
      <div className="w-64 h-64">
        <Pie data={userCompositionData} options={pieOptions} />
      </div>
    </div>
  );
};
