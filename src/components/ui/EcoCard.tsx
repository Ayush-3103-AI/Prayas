import { useRef, useState, ReactNode } from 'react';
import { cn } from '../ui/utils';

interface EcoCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'emerald' | 'gold' | 'blue';
  onClick?: () => void;
}

export function EcoCard({ children, className, glowColor = 'emerald', onClick }: EcoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (centerY - e.clientY) / (rect.height / 2);

    setTilt({ x: y * 5, y: x * 5 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const glowColors = {
    emerald: 'from-emerald-500/20 via-emerald-400/10 to-transparent',
    gold: 'from-amber-500/20 via-yellow-400/10 to-transparent',
    blue: 'from-blue-500/20 via-blue-400/10 to-transparent',
  };

  return (
    <div
      ref={cardRef}
      className={cn('relative group', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s ease-out',
      }}
    >
      {/* Layer 1: Glow Border */}
      <div
        className={cn(
          'absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl',
          `bg-gradient-to-br ${glowColors[glowColor]}`
        )}
        style={{ zIndex: 0 }}
      />

      {/* Layer 2: Glass Body */}
      <div
        className={cn(
          'relative rounded-3xl border border-white/5',
          'bg-[#0a100c]/70 backdrop-blur-2xl',
          'transition-all duration-300',
          'group-hover:scale-[1.005] group-hover:border-white/10'
        )}
        style={{ zIndex: 1 }}
      >
        {/* Layer 3: Noise Texture */}
        <div
          className="absolute inset-0 rounded-3xl opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            zIndex: 2,
          }}
        />

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}

