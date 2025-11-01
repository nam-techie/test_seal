import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', glow = false }) => {
  const glowClasses = glow ? 'shadow-glow-g3' : '';
  return (
    <div className={`bg-surface border border-surface2 rounded-2xl p-6 ${glowClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
