'use client';

/**
 * SearchModeToggle - Toggle between AI semantic search and text search
 */

export type SearchMode = 'ai' | 'text';

interface SearchModeToggleProps {
  mode: SearchMode;
  onChange: (mode: SearchMode) => void;
  isAIOnline?: boolean;
  className?: string;
}

export const SearchModeToggle = ({
  mode,
  onChange,
  isAIOnline = true,
  className = '',
}: SearchModeToggleProps) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="text-xs font-semibold text-[var(--ink-secondary)]">
        Mode:
      </span>
      <div
        role="tablist"
        aria-label="Mode pencarian"
        className="inline-flex rounded-[12px] bg-[var(--bg-surface)] border border-[var(--border-stone)] p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'text'}
          onClick={() => onChange('text')}
          className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer ${
            mode === 'text'
              ? 'bg-[var(--ink-primary)] text-white'
              : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
          }`}
        >
          Filter Teks
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'ai'}
          onClick={() => isAIOnline && onChange('ai')}
          disabled={!isAIOnline}
          className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
            mode === 'ai'
              ? 'bg-[var(--accent-primary)] text-white'
              : isAIOnline
                ? 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                : 'text-[var(--ink-secondary)]/45 cursor-not-allowed'
          }`}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Pencarian AI</span>
          {!isAIOnline && <span className="text-[11px]">(offline)</span>}
        </button>
      </div>
      {mode === 'ai' && isAIOnline && (
        <span className="text-xs font-medium text-[var(--accent-primary)] bg-[var(--accent-tint)] border border-[var(--accent-primary)]/20 px-2.5 py-1 rounded-full">
          Semantic Search
        </span>
      )}
    </div>
  );
};

/**
 * AIBadge - Badge to show AI-powered results in Warm Tactile Tech palette
 */
interface AIBadgeProps {
  similarity?: number;
  className?: string;
}

export const AIBadge = ({ similarity, className = '' }: AIBadgeProps) => {
  const similarityPercent =
    typeof similarity === 'number'
      ? Math.round(similarity <= 1 ? similarity * 100 : similarity)
      : null;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--accent-tint)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/25">
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>AI Match</span>
        {similarityPercent !== null && (
          <span className="font-mono-tabular font-bold">
            {similarityPercent}%
          </span>
        )}
      </span>
    </div>
  );
};
