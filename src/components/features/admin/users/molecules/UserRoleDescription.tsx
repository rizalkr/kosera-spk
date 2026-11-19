import React from 'react';
import { AdminUser } from '@/lib/api/admin';

export interface UserRoleDescriptionProps {
  role: AdminUser['role'];
}

export const UserRoleDescription: React.FC<UserRoleDescriptionProps> = ({ role }) => {
  const description = {
    ADMIN:
      'User dengan akses penuh untuk mengelola sistem, termasuk manajemen pengguna dan dashboard admin.',
    SELLER:
      'User yang memiliki properti kos dan dapat mengelola listing, kamar, serta pengajuan booking.',
    RENTER:
      'User yang mencari kos, menyimpan favorit, mengatur preferensi SPK, dan mengajukan booking.',
  }[role];

  return (
    <div className="mt-6 bg-[var(--accent-tint)] border border-[#BBDCD0] rounded-[14px] p-4">
      <h4 className="text-xs font-bold text-[var(--accent-primary)] mb-1">
        Keterangan Role {role}
      </h4>
      <p className="text-xs sm:text-sm text-[var(--ink-primary)]">{description}</p>
    </div>
  );
};
