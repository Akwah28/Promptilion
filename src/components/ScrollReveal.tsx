import React from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

/**
 * ScrollReveal Passthrough
 * Scroll delay/lag animation has been removed to ensure instant, crisp, and snappy page scrolling.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = ''
}) => {
  return <div className={className}>{children}</div>;
};
