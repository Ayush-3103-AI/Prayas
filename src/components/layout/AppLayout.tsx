import { ReactNode } from 'react';
import { ParticleScene } from '../background/ParticleScene';

interface AppLayoutProps {
  children: ReactNode;
  showParticles?: boolean;
}

export function AppLayout({ children, showParticles = true }: AppLayoutProps) {
  return (
    <div className="relative min-h-screen" style={{ background: '#020604' }}>
      {/* 3D Particle Background */}
      {showParticles && <ParticleScene />}
      
      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

