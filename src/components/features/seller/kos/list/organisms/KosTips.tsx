import React from 'react';

export const KosTips: React.FC = () => (
  <div className="mt-8 bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[16px] p-6">
    <h3 className="text-base font-bold text-[var(--ink-primary)] mb-4">Tips Pengelolaan Kos</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
      <Tip
        title="Perbarui Foto Secara Berkala"
        desc="Foto kamar yang terang dan rapi meningkatkan kepercayaan calon penyewa secara signifikan."
      />
      <Tip
        title="Harga Kompetitif"
        desc="Sesuaikan tarif sewa dengan fasilitas serta rata-rata harga kos di kecamatan sekitar."
      />
      <Tip
        title="Respons Cepat"
        desc="Konfirmasi pertanyaan dan pengajuan booking dalam 24 jam agar calon penyewa tidak berpindah."
      />
    </div>
  </div>
);

const Tip = ({ title, desc }: { title: string; desc: string }) => (
  <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[12px] p-4">
    <div className="font-semibold text-[var(--ink-primary)] mb-1.5">{title}</div>
    <div className="text-[var(--ink-secondary)] text-xs leading-relaxed">{desc}</div>
  </div>
);
