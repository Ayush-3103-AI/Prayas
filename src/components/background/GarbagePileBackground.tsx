import React from 'react';

export function GarbagePileBackground() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background: 'white',
      }}
    >
      {/* Garbage Pile Image - Fixed Center */}
      <div
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(80vw, 800px)',
          height: 'auto',
          maxHeight: '80vh',
          zIndex: 1,
        }}
      >
        <img
          src="/garbage-pile.png"
          alt="Garbage pile"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            filter: 'blur(0px)', // Will be blurred by content areas using backdrop-filter
          }}
          onError={(e) => {
            // Fallback if image not found - create a placeholder
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>
      
      {/* Fallback placeholder if image doesn't exist */}
      <div
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(80vw, 800px)',
          height: 'auto',
          maxHeight: '80vh',
          zIndex: 1,
          background: 'rgba(139, 115, 85, 0.1)',
          borderRadius: '20px',
          display: 'none', // Hidden by default, shown if image fails
        }}
        id="garbage-pile-fallback"
      >
        <div style={{ padding: '40px', textAlign: 'center', color: '#6b5d4f' }}>
          <p>Garbage Pile Image</p>
          <p style={{ fontSize: '12px', marginTop: '10px' }}>Place garbage-pile.png in /public folder</p>
        </div>
      </div>
    </div>
  );
}

