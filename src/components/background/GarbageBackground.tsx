import React from 'react';

export function GarbageBackground() {
  return (
    <div
      className="fixed inset-0 z-0"
      style={{
        background: `
          linear-gradient(135deg, #6b5d4f 0%, #5a4a3a 25%, #8b7355 50%, #6b5d4f 75%, #5a4a3a 100%),
          radial-gradient(circle at 20% 50%, rgba(139, 115, 85, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(90, 74, 58, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 20%, rgba(107, 93, 79, 0.2) 0%, transparent 50%)
        `,
        backgroundSize: '100% 100%, 200% 200%, 150% 150%, 180% 180%',
        backgroundPosition: '0% 0%, 0% 0%, 100% 100%, 50% 50%',
        // Add texture pattern
        backgroundImage: `
          repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.05) 2px, rgba(0, 0, 0, 0.05) 4px),
          repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px),
          linear-gradient(135deg, #6b5d4f 0%, #5a4a3a 25%, #8b7355 50%, #6b5d4f 75%, #5a4a3a 100%)
        `,
      }}
    >
      {/* Additional dirt/garbage texture overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

