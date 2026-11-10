'use client';

import React, { useRef, useState } from 'react';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glowColor?: string;
}

/**
 * Aceternity / Codrops inspired Card with dynamic radial spotlight cursor highlight
 * Subtle, luxury, zero-lag, pure CSS-variable driven.
 */
export const SpotlightCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  onClick,
  glowColor = 'rgba(201, 138, 94, 0.12)',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] transition-all duration-200 ${className}`}
    >
      {/* Dynamic radial gradient glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-2xl"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
