'use client';

/**
 * Props for MatchingScoreIndicator component
 */
interface MatchingScoreIndicatorProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

/**
 * Visual indicator for matching score
 */
export const MatchingScoreIndicator = ({ 
  score, 
  size = 'md',
  showLabel = true 
}: MatchingScoreIndicatorProps) => {
  // Calculate percentage (score is 1-5)
  const percentage = ((score - 1) / 4) * 100;
  
  // Determine color based on score
  const getColor = () => {
    if (score >= 4) return { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-100' };
    if (score >= 3) return { bg: 'bg-yellow-500', text: 'text-yellow-600', light: 'bg-yellow-100' };
    if (score >= 2) return { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-100' };
    return { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-100' };
  };

  const getLabel = () => {
    if (score >= 4.5) return 'Sangat Cocok';
    if (score >= 4) return 'Cocok';
    if (score >= 3) return 'Cukup Cocok';
    if (score >= 2) return 'Kurang Cocok';
    return 'Tidak Cocok';
  };

  const sizeClasses = {
    sm: { circle: 'w-12 h-12', text: 'text-sm', label: 'text-xs' },
    md: { circle: 'w-16 h-16', text: 'text-lg', label: 'text-sm' },
    lg: { circle: 'w-24 h-24', text: 'text-2xl', label: 'text-base' },
  };

  const colors = getColor();
  const sizes = sizeClasses[size];

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Circular Progress */}
      <div className={`relative ${sizes.circle}`}>
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-gray-200"
          />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
            strokeLinecap="round"
            className={colors.bg}
          />
        </svg>
        {/* Score Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${sizes.text} ${colors.text}`}>
            {score.toFixed(1)}
          </span>
        </div>
      </div>
      
      {/* Label */}
      {showLabel && (
        <span className={`font-medium ${sizes.label} ${colors.text}`}>
          {getLabel()}
        </span>
      )}
    </div>
  );
};

/**
 * Horizontal bar version of the score indicator
 */
interface MatchingScoreBarProps {
  score: number;
  label?: string;
  showValue?: boolean;
}

export const MatchingScoreBar = ({ 
  score, 
  label,
  showValue = true 
}: MatchingScoreBarProps) => {
  const percentage = ((score - 1) / 4) * 100;
  
  const getColor = () => {
    if (score >= 4) return 'bg-green-500';
    if (score >= 3) return 'bg-yellow-500';
    if (score >= 2) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between mb-1">
          {label && <span className="text-sm text-gray-600">{label}</span>}
          {showValue && <span className="text-sm font-medium text-gray-700">{score.toFixed(1)}</span>}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${Math.max(percentage, 5)}%` }}
        />
      </div>
    </div>
  );
};

export default MatchingScoreIndicator;
