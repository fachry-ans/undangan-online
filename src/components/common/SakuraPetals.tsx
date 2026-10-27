import React from 'react';

interface SakuraPetalsProps {
  active: boolean;
}

interface SakuraPetalStyle extends React.CSSProperties {
  '--sakura-delay': string;
  '--sakura-duration': string;
  '--sakura-drift': string;
  '--sakura-left': string;
  '--sakura-size': string;
  '--sakura-start': string;
}

const PETALS = [
  { left: 3, size: 12, duration: 16, delay: -12, drift: 58, rotation: -32 },
  { left: 12, size: 17, duration: 21, delay: -4, drift: -42, rotation: 20 },
  { left: 21, size: 10, duration: 14, delay: -9, drift: 36, rotation: 65 },
  { left: 30, size: 15, duration: 19, delay: -16, drift: -68, rotation: -12 },
  { left: 39, size: 11, duration: 15, delay: -2, drift: 48, rotation: 43 },
  { left: 48, size: 18, duration: 22, delay: -14, drift: -38, rotation: -48 },
  { left: 57, size: 12, duration: 17, delay: -7, drift: 62, rotation: 10 },
  { left: 66, size: 14, duration: 20, delay: -18, drift: -54, rotation: 72 },
  { left: 75, size: 10, duration: 14, delay: -5, drift: 42, rotation: -20 },
  { left: 84, size: 16, duration: 18, delay: -11, drift: -62, rotation: 34 },
  { left: 93, size: 12, duration: 16, delay: -3, drift: 52, rotation: -60 },
  { left: 106, size: 15, duration: 21, delay: -15, drift: -44, rotation: 52 },
];

export const SakuraPetals: React.FC<SakuraPetalsProps> = ({ active }) => {
  if (!active) return null;

  return (
    <div className="sakura-petals" aria-hidden="true">
      {PETALS.map((petal, index) => {
        const style: SakuraPetalStyle = {
          '--sakura-delay': `${petal.delay}s`,
          '--sakura-duration': `${petal.duration}s`,
          '--sakura-drift': `${petal.drift}px`,
          '--sakura-left': `${petal.left}%`,
          '--sakura-size': `${petal.size}px`,
          '--sakura-start': `${petal.rotation}deg`,
        };

        return <span key={index} className="sakura-petal" style={style} />;
      })}
    </div>
  );
};
