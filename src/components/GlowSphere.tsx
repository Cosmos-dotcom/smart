export default function GlowSphere() {
  return (
    <div className="w-56 h-56 md:w-72 md:h-72 relative flex items-center justify-center">
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(94,234,212,0.08) 0%, transparent 60%)',
          animation: 'pulse-glow 3s ease-in-out infinite',
        }}
      />

      {/* Mid ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: '75%',
          aspectRatio: '1 / 1',
          border: '1px solid rgba(94,234,212,0.1)',
          animation: 'float 4s ease-in-out infinite reverse',
        }}
      />

      {/* Core sphere */}
      <div
        className="w-28 h-28 md:w-36 md:h-36 rounded-full animate-float relative"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #5eead4, #0d9488, #065f46)',
          boxShadow: '0 0 60px rgba(94,234,212,0.4), 0 0 120px rgba(94,234,212,0.15), inset 0 -10px 30px rgba(0,0,0,0.3)',
        }}
      >
        {/* Highlight */}
        <div
          className="absolute rounded-full"
          style={{
            width: '40%',
            height: '30%',
            top: '15%',
            left: '20%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 100%)',
          }}
        />
      </div>
    </div>
  );
}
