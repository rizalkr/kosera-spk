import React from 'react';

export interface RoomStatusPanelProps {
  totalRooms: number;
  occupiedRooms: number;
  vacantRooms: number;
  occupancyRate: number;
}

export const RoomStatusPanel: React.FC<RoomStatusPanelProps> = ({
  totalRooms,
  occupiedRooms,
  vacantRooms,
  occupancyRate,
}) => {
  const items = [
    { value: totalRooms, label: 'Total Kamar', tone: 'text-[var(--ink-primary)]' },
    { value: occupiedRooms, label: 'Kamar Terisi', tone: 'text-[var(--accent-primary)]' },
    { value: vacantRooms, label: 'Kamar Kosong', tone: 'text-[var(--accent-spark)]' },
  ];

  return (
    <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[16px] p-6">
      <h3 className="text-base font-bold text-[var(--ink-primary)] mb-4">Status Kamar</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[12px] p-4 text-center"
          >
            <div className={`font-mono-tabular text-2xl font-bold ${item.tone}`}>{item.value}</div>
            <div className="text-xs font-medium text-[var(--ink-secondary)] mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <div className="flex justify-between items-center mb-2 text-xs">
          <span className="font-medium text-[var(--ink-secondary)]">Tingkat Hunian</span>
          <span className="font-mono-tabular font-bold text-[var(--ink-primary)]">
            {occupancyRate}%
          </span>
        </div>
        <div className="w-full bg-[var(--bg-muted)] rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-[var(--accent-primary)] h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${occupancyRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};
