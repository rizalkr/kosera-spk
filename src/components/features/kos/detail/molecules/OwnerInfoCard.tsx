import React from 'react';

export interface OwnerInfoCardProps {
  owner?: { name?: string; contact?: string };
  kosName?: string;
}

function buildWhatsappUrl(contact: string, kosName?: string): string {
  const digits = contact.replace(/[^\d]/g, '');
  let normalized = digits;
  if (normalized.startsWith('0')) {
    normalized = `62${normalized.slice(1)}`;
  } else if (normalized && !normalized.startsWith('62')) {
    normalized = `62${normalized}`;
  }
  const message = kosName
    ? `Halo, saya ingin bertanya mengenai ketersediaan kamar di ${kosName} melalui Kosera.`
    : 'Halo, saya ingin bertanya mengenai kos Anda melalui Kosera.';
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export const OwnerInfoCard: React.FC<OwnerInfoCardProps> = ({
  owner,
  kosName,
}) => {
  const ownerName = owner?.name || 'Pengelola Kos';
  const contact = owner?.contact?.trim();
  const initial = ownerName.charAt(0).toUpperCase();

  return (
    <div className="rounded-[16px] bg-[var(--bg-canvas)] border border-[var(--border-stone)] p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="w-10 h-10 rounded-full bg-[var(--accent-tint)] text-[var(--accent-primary)] font-bold text-sm flex items-center justify-center shrink-0"
        >
          {initial}
        </div>
        <div className="min-w-0">
          <div className="text-xs text-[var(--ink-secondary)]">Pemilik Kos</div>
          <div className="text-sm font-bold text-[var(--ink-primary)] truncate">
            {ownerName}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs py-2.5 px-3 rounded-[10px] bg-[var(--bg-surface)] border border-[var(--border-stone)]">
        <span className="text-[var(--ink-secondary)]">Kontak</span>
        <span className="font-mono-tabular font-semibold text-[var(--ink-primary)]">
          {contact || 'Belum tersedia'}
        </span>
      </div>

      {contact ? (
        <a
          href={buildWhatsappUrl(contact, kosName)}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-2.5 px-4 rounded-[10px] text-xs font-semibold border border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--bg-surface)] hover:bg-[var(--accent-tint)] transition-colors"
        >
          Hubungi Pemilik via WhatsApp
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="w-full py-2.5 px-4 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-muted)] text-[var(--ink-secondary)] cursor-not-allowed"
        >
          Kontak belum tersedia
        </button>
      )}
    </div>
  );
};
