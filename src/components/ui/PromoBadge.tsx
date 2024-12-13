interface PromoBadgeProps {
  text: string;
  subText?: string;
  className?: string;
  direction?: 'up' | 'down';
}

export const PromoBadge = ({ 
  text, 
  subText, 
  className = '',
  direction = 'up'
}: PromoBadgeProps) => {
  const animationClass = direction === 'up' ? 'animate-floating-up' : 'animate-floating-down';
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-lg p-4 ${animationClass} ${className}`}
    >
      <div className="text-pink-500 font-semibold">{text}</div>
      {subText && <div className="text-gray-600 text-sm">{subText}</div>}
    </div>
  );
};
