import React, { useEffect, useState, useRef } from 'react';

interface ParticleData {
  id: number;
  duration: number;
  delay: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  color: string;
  transparentStop: number;
}

interface ParticleAnimationProps {
  particleCount?: number;
  colors?: string[];
  animationDuration?: [number, number];
  perspective?: string;
  containerSize?: string;
  particleWidth?: string;
  particleHeight?: string;
}

export const ParticleAnimation = ({
  particleCount = 500,
  colors = ['#00b8a9', '#f8f3d4', '#f6416c', '#ffde7d'],
  animationDuration = [1, 2],
  perspective = '10vmin',
  containerSize = '40vmin',
  particleWidth = '40%',
  particleHeight = '1px',
}: ParticleAnimationProps) => {
  const [particles, setParticles] = useState<ParticleData[]>([]);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  const random = (min: number, max: number) => Math.random() * (max - min) + min;
  const randomColor = () => colors[Math.floor(Math.random() * colors.length)];
  const randomRotation = () => random(-180, 180);

  useEffect(() => {
    const newParticles: ParticleData[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      duration: random(animationDuration[0], animationDuration[1]),
      delay: -random(0.1, 2),
      rotateX: randomRotation(),
      rotateY: randomRotation(),
      rotateZ: randomRotation(),
      color: randomColor(),
      transparentStop: random(50, 100),
    }));
    setParticles(newParticles);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [particleCount]);

  // Inject keyframes into a <style> tag in <head>
  useEffect(() => {
    if (particles.length === 0) return;

    const css = particles.map(p => `
      @keyframes pmove-${p.id} {
        0%   { transform: translateX(50%) rotateX(${p.rotateX}deg) rotateY(${p.rotateY}deg) rotateZ(${p.rotateZ}deg) scale(2); opacity: 0; }
        20%  { opacity: 1; }
        100% { transform: translateX(50%) rotateX(${p.rotateX}deg) rotateY(${p.rotateY}deg) rotateZ(${p.rotateZ}deg) scale(0); opacity: 1; }
      }
    `).join('\n');

    const el = document.createElement('style');
    el.textContent = css;
    document.head.appendChild(el);
    styleRef.current = el;

    return () => { el.remove(); };
  }, [particles]);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      style={{ perspective }}
    >
      <div
        className="relative grid place-items-center"
        style={{ width: containerSize, height: containerSize, gridTemplateColumns: '1fr' }}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute"
            style={{
              width: particleWidth,
              height: particleHeight,
              willChange: 'transform, opacity',
              transformStyle: 'preserve-3d',
              background: `linear-gradient(to left, ${p.color}, transparent ${p.transparentStop}%)`,
              animation: `pmove-${p.id} ${p.duration}s linear infinite`,
              animationDelay: `${p.delay}s`,
              transformOrigin: '0 center',
            }}
          />
        ))}
      </div>
    </div>
  );
};
