import { useState, useCallback } from 'react';
import type { Prize } from './utils/weightedRandom';
import { selectWeightedRandom } from './utils/weightedRandom';
import SpinWheel from './components/SpinWheel';
import confetti from 'canvas-confetti';
import { Settings, History, Trophy } from 'lucide-react';

const INITIAL_PRIZES: Prize[] = [
  { id: '1', label: '10% OFF', weight: 30, color: '#A78BFA' },
  { id: '2', label: 'FREE SHIP', weight: 20, color: '#4ADE80' },
  { id: '3', label: 'TRY AGAIN', weight: 40, color: '#F87171' },
  { id: '4', label: 'GRAND PRIZE', weight: 5, color: '#FACC15' },
  { id: '5', label: '5% OFF', weight: 50, color: '#94A3B8' },
];

function App() {
  const [prizes] = useState<Prize[]>(INITIAL_PRIZES);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [winningPrize, setWinningPrize] = useState<Prize | null>(null);
  const [history, setHistory] = useState<Prize[]>([]);

  const handleDraw = () => {
    if (isSpinning) return;

    const weights = prizes.map(p => p.weight);
    const winner = selectWeightedRandom(prizes, weights);
    const index = prizes.findIndex(p => p.id === winner.id);
    
    setWinnerIndex(index);
    setIsSpinning(true);
    setShowWinner(false);
  };

  const onSpinEnd = useCallback((prize: Prize) => {
    setIsSpinning(false);
    setWinningPrize(prize);
    setShowWinner(true);
    setHistory(prev => [prize, ...prev].slice(0, 10));
    setWinnerIndex(null);

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FACC15', '#4ADE80', '#A78BFA']
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-yellow-400/30">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
        <h1 className="text-xl md:text-2xl font-montserrat font-extrabold tracking-tight">
          LUCKY <span className="text-yellow-400">DRAW</span>
        </h1>
        <div className="flex gap-4">
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <History className="w-6 h-6 text-slate-400" />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <Settings className="w-6 h-6 text-slate-400" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stage */}
        <div className="lg:col-span-2 flex flex-col items-center gap-12 py-8 bg-gradient-to-b from-slate-800/30 to-transparent rounded-3xl border border-white/5">
          <div className="w-full max-w-md aspect-square flex items-center justify-center">
            <SpinWheel 
              prizes={prizes} 
              onSpinEnd={onSpinEnd} 
              winnerIndex={winnerIndex} 
            />
          </div>

          <button
            onClick={handleDraw}
            disabled={isSpinning}
            className={`
              relative group w-32 h-32 md:w-40 md:h-40 rounded-full
              bg-gradient-to-br from-yellow-400 to-yellow-500
              shadow-[0_10px_40px_-10px_rgba(250,204,21,0.5)]
              hover:scale-105 active:scale-95
              transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
              flex flex-col items-center justify-center gap-1
            `}
          >
            <span className="text-3xl">🎲</span>
            <span className="font-montserrat font-bold text-slate-900 text-lg">DRAW</span>
            <div className="absolute inset-0 rounded-full border-4 border-yellow-400/30 animate-ping group-hover:animate-none" />
          </button>
        </div>

        {/* Sidebar / History */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-bold font-montserrat uppercase tracking-wider">Recent Winners</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
              {history.length > 0 ? (
                history.map((prize, i) => (
                  <div 
                    key={i}
                    className="flex flex-col items-center justify-center p-3 bg-slate-800/60 border border-white/5 rounded-xl hover:border-green-400/50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform" style={{ color: prize.color }}>
                      <Trophy className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold text-center leading-tight">
                      {prize.label}
                    </span>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-slate-500 italic">
                  No winners yet. Be the first!
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Winner Modal */}
      {showWinner && winningPrize && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-800/90 border-2 border-yellow-400/30 rounded-[2.5rem] p-8 md:p-12 max-w-sm w-full text-center shadow-[0_0_100px_-20px_rgba(250,204,21,0.4)] animate-in zoom-in-95 duration-500 slide-in-from-bottom-8">
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-400/20">
              <Trophy className="w-10 h-10 text-slate-900" />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-sm mb-2">Congratulations!</p>
            <h2 className="text-4xl md:text-5xl font-montserrat font-black text-slate-50 mb-8 leading-tight">
              YOU WON <br />
              <span className="text-yellow-400 uppercase">{winningPrize.label}</span>
            </h2>
            <button
              onClick={() => setShowWinner(false)}
              className="w-full py-4 bg-slate-700 hover:bg-slate-600 rounded-2xl font-bold transition-colors uppercase tracking-widest text-sm"
            >
              AWESOME
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
