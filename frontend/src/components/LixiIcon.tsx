/**
 * Vietnamese Red Envelope Icon with "LỘC" character
 * Bao lì xì Việt Nam với chữ "LỘC" (luck/fortune)
 */

interface LixiIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  text?: 'LỘC' | 'TÀI' | 'PHÚC';
}

export function LixiIcon({ className = '', size = 'md', text = 'TÀI' }: LixiIconProps) {
  // Size mapping
  const sizeMap = {
    sm: 24,
    md: 48,
    lg: 72,
    xl: 96,
  };

  const dimension = typeof size === 'number' ? size : sizeMap[size];
  
  // Generate unique IDs for gradients to avoid conflicts
  const gradientId = `grad-${Math.random().toString(36).substr(2, 9)}`;
  const goldGradientId = `gold-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Lì xì Việt Nam"
    >
      {/* Envelope body - gradient red */}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="50%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
        <linearGradient id={goldGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Main envelope rectangle */}
      <rect x="10" y="20" width="80" height="95" rx="4" fill={`url(#${gradientId})`} />
      
      {/* Top flap */}
      <path
        d="M 10 20 L 50 45 L 90 20 L 90 25 L 50 50 L 10 25 Z"
        fill="#B91C1C"
        opacity="0.8"
      />
      
      {/* Gold border decoration */}
      <rect x="10" y="20" width="80" height="95" rx="4" stroke={`url(#${goldGradientId})`} strokeWidth="2" fill="none" />
      
      {/* Inner gold rectangle */}
      <rect x="20" y="35" width="60" height="70" rx="3" fill="none" stroke={`url(#${goldGradientId})`} strokeWidth="1.5" />
      
      {/* Vietnamese character - TÀI/LỘC/PHÚC */}
      <text
        x="50"
        y="75"
        fontSize="28"
        fontWeight="bold"
        fill={`url(#${goldGradientId})`}
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {text}
      </text>
      
      {/* Decorative corner patterns */}
      <circle cx="25" cy="40" r="2" fill="#FCD34D" opacity="0.6" />
      <circle cx="75" cy="40" r="2" fill="#FCD34D" opacity="0.6" />
      <circle cx="25" cy="100" r="2" fill="#FCD34D" opacity="0.6" />
      <circle cx="75" cy="100" r="2" fill="#FCD34D" opacity="0.6" />
      
      {/* Small decorative lines */}
      <line x1="30" y1="40" x2="40" y2="40" stroke="#FCD34D" strokeWidth="1" opacity="0.5" />
      <line x1="60" y1="40" x2="70" y2="40" stroke="#FCD34D" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

/**
 * Inline span version for text usage
 */
export function LixiEmoji({ text = 'TÀI' }: { text?: 'LỘC' | 'TÀI' | 'PHÚC' }) {
  return (
    <span className="inline-block align-middle">
      <LixiIcon size="sm" text={text} />
    </span>
  );
}
