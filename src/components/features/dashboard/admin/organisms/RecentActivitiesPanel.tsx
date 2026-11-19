import React from 'react';
import { ActivityItem, ActivityItemData } from '../molecules/ActivityItem';

export interface RecentActivitiesPanelProps {
  activities: ActivityItemData[];
  getIcon: (type: string) => React.ReactNode;
}

export const RecentActivitiesPanel: React.FC<RecentActivitiesPanelProps> = ({
  activities,
  getIcon,
}) => (
  <section className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-6">
    <h2 className="text-base font-bold text-[var(--ink-primary)] mb-4">Aktivitas Terbaru</h2>
    <div className="space-y-3">
      {activities.length > 0 ? (
        activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} icon={getIcon(activity.type)} />
        ))
      ) : (
        <div className="text-center text-[var(--ink-secondary)] py-10 space-y-2">
          <div className="h-11 w-11 mx-auto rounded-full bg-[var(--bg-muted)] text-[var(--ink-secondary)] flex items-center justify-center">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <p className="text-xs sm:text-sm">Belum ada aktivitas terbaru</p>
        </div>
      )}
    </div>
  </section>
);
