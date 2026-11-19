import React from 'react';

export interface ActivityItemData {
  id: string | number;
  type: string;
  message: string;
  user: string;
  time: string;
}

export interface ActivityItemProps {
  activity: ActivityItemData;
  icon: React.ReactNode;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity, icon }) => (
  <div className="flex items-center gap-3.5 p-3.5 bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[12px]">
    <div
      className="h-9 w-9 rounded-[10px] bg-[var(--accent-tint)] text-[var(--accent-primary)] flex items-center justify-center shrink-0"
      aria-hidden="true"
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs sm:text-sm font-medium text-[var(--ink-primary)] truncate">
        {activity.message}
      </p>
      <p className="text-xs text-[var(--ink-secondary)]">oleh {activity.user}</p>
    </div>
    <div className="text-right shrink-0">
      <p className="font-mono-tabular text-[11px] text-[var(--ink-secondary)]">{activity.time}</p>
    </div>
  </div>
);
