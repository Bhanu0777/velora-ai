'use client';

import React, { useRef, useState } from 'react';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  magneticPull?: number;
}

/**
 * Codrops-style micro-magnetic attraction button
 * Respects reduced motion, adds tactile premium sensation to primary CTA
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  magneticPull = 0.25,
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = (e.clientX - centerX) * magneticPull;
    const deltaY = (e.clientY - centerY) * magneticPull;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: position.x === 0 ? 'transform 0.35s cubic-bezier(0.2, 0.9, 0.3, 1)' : 'transform 0.08s ease-out',
      }}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};
