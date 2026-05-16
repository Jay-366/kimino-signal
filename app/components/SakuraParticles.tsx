"use client";
import { useState, useEffect, useMemo } from "react";

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const SakuraParticles = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const petals = useMemo(() => {
    if (!mounted) return [];
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${seededRandom(i * 2.1) * 100}vw`,
      animationDuration: `${seededRandom(i * 3.7) * 10 + 15}s`,
      animationDelay: `-${seededRandom(i * 5.3) * 20}s`,
      width: `${seededRandom(i * 7.1) * 8 + 8}px`,
      height: `${seededRandom(i * 11.3) * 8 + 8}px`,
      opacity: 0.6 + seededRandom(i * 13) * 0.4,
    }));
  }, [mounted]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {petals.map((p) => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            width: p.width,
            height: p.height,
            opacity: p.opacity,
            animation: `fall ${p.animationDuration} linear infinite`,
            animationDelay: p.animationDelay,
          }}
        />
      ))}
    </div>
  );
};
