import React, { useMemo } from "react";

interface FloatingPetalsProps {
  count?: number;
}

export const FloatingPetals: React.FC<FloatingPetalsProps> = ({ count = 18 }) => {
  const petals = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(i * 5.5 + Math.random() * 5) % 100}%`,
      delay: `${(i * 0.7) % 8}s`,
      duration: `${10 + (i % 6) * 2.5}s`,
      size: 14 + (i % 5) * 4,
      rotation: Math.floor(Math.random() * 360),
      drift: `${(i % 2 === 0 ? 1 : -1) * (20 + (i % 3) * 15)}px`,
      type: i % 4 === 0 ? "heart" : "petal"
    }));
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute top-[-40px] opacity-40 will-change-transform"
          style={{
            left: p.left,
            animation: `fallAndDrift ${p.duration} ease-in-out infinite`,
            animationDelay: p.delay,
            transform: `rotate(${p.rotation}deg)`
          }}
        >
          {p.type === "heart" ? (
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              fill="rgba(244, 63, 94, 0.45)"
              className="drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <div
              style={{
                width: `${p.size}px`,
                height: `${p.size * 1.3}px`,
                borderRadius: "60% 40% 70% 30% / 60% 30% 70% 40%",
                background: "radial-gradient(circle at 30% 30%, #f472b6, #e11d48 70%, #9f1239 100%)",
                boxShadow: "0 0 10px rgba(225, 29, 72, 0.25)"
              }}
            />
          )}
        </div>
      ))}

      {/* Embedded keyframe for smooth GPU falling */}
      <style>{`
        @keyframes fallAndDrift {
          0% {
            transform: translateY(-20px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(105vh) translateX(40px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
