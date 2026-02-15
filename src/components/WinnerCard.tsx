import { Trophy } from 'lucide-react';
import type { Prize } from '../utils/weightedRandom';

interface WinnerCardProps {
  prize: Prize;
}

const WinnerCard = ({ prize }: WinnerCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-3 bg-slate-800/60 border border-white/5 rounded-xl hover:border-green-400/50 transition-all group hover:-translate-y-1 shadow-sm hover:shadow-lg">
      <div 
        className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform" 
        style={{ color: prize.color }}
      >
        <Trophy className="w-5 h-5" />
      </div>
      <span className="text-[10px] text-slate-400 uppercase font-bold text-center leading-tight">
        {prize.label}
      </span>
    </div>
  );
};

export default WinnerCard;
