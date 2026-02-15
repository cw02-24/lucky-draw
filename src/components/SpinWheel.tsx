import { useRef, useEffect } from 'react';
import { Wheel } from 'spin-wheel';
import type { Prize } from '../utils/weightedRandom';

interface SpinWheelProps {
  prizes: Prize[];
  onSpinEnd: (prize: Prize) => void;
  winnerIndex: number | null;
}

const SpinWheel = ({ prizes, onSpinEnd, winnerIndex }: SpinWheelProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<Wheel | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const items = prizes.map((prize) => ({
      label: prize.label,
      backgroundColor: prize.color,
      labelColor: '#F8FAFC',
    }));

    const props = {
      items,
      itemLabelFontSizeMax: 20,
      radius: 0.9,
      itemLabelRadius: 0.95,
      itemLabelRadiusMax: 0.9,
      itemLabelRotation: 0,
      itemLabelAlign: 'right',
      itemLabelBaselineOffset: -0.07,
      itemLabelFont: 'Montserrat',
      itemLabelWeight: 800,
      lineWidth: 1,
      lineColor: 'rgba(255, 255, 255, 0.1)',
      overlayImage: '', // Can add a central logo here
      isInteractive: false,
    };

    const wheel = new Wheel(containerRef.current, props);
    wheelRef.current = wheel;

    wheel.onRest = (event: { currentIndex: number }) => {
      onSpinEnd(prizes[event.currentIndex]);
    };

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [prizes, onSpinEnd]);

  useEffect(() => {
    if (winnerIndex !== null && wheelRef.current) {
      const duration = 4000;
      const revolutions = 5;
      wheelRef.current.spinToItem(winnerIndex, duration, true, revolutions, 1);
    }
  }, [winnerIndex]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div 
        ref={containerRef} 
        className="w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-slate-800 shadow-[0_0_60px_-15px_rgba(250,204,21,0.3)] bg-slate-800/60 backdrop-blur-sm"
      />
      {/* Indicator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
        <div className="w-6 h-8 bg-yellow-400 shadow-lg" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
      </div>
    </div>
  );
};

export default SpinWheel;
