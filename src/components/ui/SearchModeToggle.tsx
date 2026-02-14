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
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600">Mode:</span>
      <div className="flex rounded-lg bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => onChange('text')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            mode === 'text'
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Teks
        </button>
        <button
          type="button"
          onClick={() => isAIOnline && onChange('ai')}
          disabled={!isAIOnline}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
            mode === 'ai'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm'
              : isAIOnline
              ? 'text-gray-500 hover:text-gray-700'
              : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          AI
          {!isAIOnline && (
            <span className="text-xs">(offline)</span>
          )}
        </button>
      </div>
      {mode === 'ai' && isAIOnline && (
        <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
          Semantic Search
        </span>
      )}
    </div>
  );
};

/**
 * AIBadge - Badge to show AI-powered results
 */
interface AIBadgeProps {
  similarity?: number;
  className?: string;
}

export const AIBadge = ({ similarity, className = '' }: AIBadgeProps) => {
  const similarityPercent = similarity ? Math.round(similarity * 100) : null;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-blue-500 text-white">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        AI
      </span>
      {similarityPercent !== null && (
        <span className="text-xs text-purple-600 font-medium">
          {similarityPercent}% relevan
        </span>
      )}
    </div>
  );
};
