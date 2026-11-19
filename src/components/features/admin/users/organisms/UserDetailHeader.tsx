import React from 'react';
import { AdminUser } from '@/lib/api/admin';
import { AvatarCircle } from '../atoms/AvatarCircle';

export interface UserDetailHeaderProps {
  user: AdminUser;
}

export const UserDetailHeader: React.FC<UserDetailHeaderProps> = ({ user }) => (
  <div className="bg-[var(--bg-muted)] border-b border-[var(--border-stone)] p-6">
    <div className="flex items-center gap-4">
      <AvatarCircle name={user.name} />
      <div>
        <h2 className="text-xl font-bold text-[var(--ink-primary)]">{user.name}</h2>
        <p className="text-sm text-[var(--ink-secondary)]">@{user.username}</p>
      </div>
    </div>
  </div>
);
