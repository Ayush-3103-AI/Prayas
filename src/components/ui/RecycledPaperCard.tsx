import { ReactNode } from 'react';
import { cn } from './utils';

interface RecycledPaperCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  showLines?: boolean; // Option to show ruled lines
  glowColor?: 'emerald' | 'gold' | 'blue'; // Optional glow color (for backward compatibility)
}

export function RecycledPaperCard({ children, className, onClick, showLines = true }: RecycledPaperCardProps) {
  // Generate random rotation for natural crumpled look (between -1.5 and 1.5 degrees)
  const rotation = Math.random() * 3 - 1.5;
  
  return (
    <div
      className={cn(
        'relative',
        'rounded-lg',
        'shadow-lg',
        'border border-[#d4c5b0]/60',
        'transition-all duration-200',
        'hover:shadow-xl',
        'hover:scale-[1.01]',
        'overflow-hidden',
        className
      )}
      style={{
        transform: `rotate(${rotation}deg)`,
        backgroundColor: '#faf0e6', // Paper color
        // Realistic paper shadows
        boxShadow: `
          0 4px 6px rgba(0, 0, 0, 0.1),
          0 8px 16px rgba(0, 0, 0, 0.08),
          0 2px 4px rgba(0, 0, 0, 0.06),
          inset 0 1px 0 rgba(255, 255, 255, 0.8),
          inset 0 -1px 0 rgba(0, 0, 0, 0.05)
        `,
      }}
      onClick={onClick}
    >
      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />
      
      {/* Ruled lines (like notebook paper) */}
      {showLines && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              transparent,
              transparent 23px,
              rgba(139, 115, 85, 0.3) 23px,
              rgba(139, 115, 85, 0.3) 24px
            )`,
            backgroundPosition: '0 0',
          }}
        />
      )}
      
      {/* Left margin line (like notebook) */}
      {showLines && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-10 pointer-events-none opacity-30"
          style={{
            borderLeft: '2px solid rgba(139, 115, 85, 0.4)',
          }}
        />
      )}
      
      {/* Content with handwritten text styling */}
      <div className={cn(
        "relative z-10 paper-text",
        showLines && "pl-12" // Add left padding to account for margin line
      )}>
        {children}
      </div>
      
      {/* Subtle paper edge effect */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-lg"
        style={{
          background: `
            linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%),
            linear-gradient(45deg, transparent 50%, rgba(0,0,0,0.02) 100%)
          `,
        }}
      />
    </div>
  );
}

