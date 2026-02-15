import { useState, useCallback } from 'react';
import type { Prize } from './utils/weightedRandom';
import { selectWeightedRandom } from './utils/weightedRandom';
import SpinWheel from './components/SpinWheel';
import WinnerCard from './components/WinnerCard';
import { useHaptics } from './hooks/useHaptics';
import confetti from 'canvas-confetti';
import { Settings, History, Trophy, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const { triggerSpinStart, triggerWin } = useHaptics();

  const handleDraw = () => {
    if (isSpinning) return;

    triggerSpinStart();
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
    triggerWin();

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.3, x: 0.5 },
      colors: ['#FACC15', '#4ADE80', '#A78BFA'],
      zIndex: 200,
    });
  }, [triggerWin]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-yellow-400/30 overflow-x-hidden">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl md:text-2xl font-montserrat font-extrabold tracking-tight"
        >
          LUCKY <span className="text-yellow-400">DRAW</span>
        </motion.h1>
        <div className="flex gap-2 md:gap-4">
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <History className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <Settings className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stage */}
        <div className="lg:col-span-2 flex flex-col items-center gap-12 py-8 md:py-16 bg-gradient-to-b from-slate-800/30 to-transparent rounded-3xl border border-white/5">
          <div className="w-full max-w-sm md:max-w-md aspect-square flex items-center justify-center relative">
            <SpinWheel 
              prizes={prizes} 
              onSpinEnd={onSpinEnd} 
              winnerIndex={winnerIndex} 
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDraw}
            disabled={isSpinning}
            className={`
              relative group w-32 h-32 md:w-40 md:h-40 rounded-full
              bg-gradient-to-br from-yellow-400 to-yellow-500
              shadow-[0_10px_40px_-10px_rgba(250,204,21,0.5)]
              disabled:opacity-50 disabled:cursor-not-allowed
              flex flex-col items-center justify-center gap-1
              z-10
            `}
          >
            <span className="text-3xl md:text-4xl">🎲</span>
            <span className="font-montserrat font-bold text-slate-900 text-lg">DRAW</span>
            {!isSpinning && (
              <div className="absolute inset-0 rounded-full border-4 border-yellow-400/30 animate-ping pointer-events-none" />
            )}
          </motion.button>
        </div>

        {/* Sidebar / History */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-bold font-montserrat uppercase tracking-wider">Recent Winners</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
              <AnimatePresence mode="popLayout">
                {history.length > 0 ? (
                  history.map((prize, i) => (
                    <motion.div
                      key={`${prize.id}-${history.length - i}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <WinnerCard prize={prize} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-slate-500 italic">
                    No winners yet. Be the first!
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Winner Modal */}
      <AnimatePresence>
        {showWinner && winningPrize && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWinner(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative bg-slate-800/90 border-2 border-yellow-400/30 rounded-[2.5rem] p-8 md:p-12 max-w-sm w-full text-center shadow-[0_0_100px_-20px_rgba(250,204,21,0.4)]"
            >
              <button 
                onClick={() => setShowWinner(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-400/20">
                <Trophy className="w-10 h-10 text-slate-900" />
              </div>
              
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-sm mb-2">Congratulations!</p>
              
              <h2 className="text-4xl md:text-5xl font-montserrat font-black text-slate-50 mb-8 leading-tight">
                YOU WON <br />
                <span className="text-yellow-400 uppercase">{winningPrize.label}</span>
              </h2>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowWinner(false)}
                className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-2xl font-bold transition-colors uppercase tracking-widest text-sm shadow-lg shadow-yellow-400/10"
              >
                AWESOME
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
