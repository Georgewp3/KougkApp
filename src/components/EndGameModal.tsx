import { motion, AnimatePresence } from "framer-motion";
import type { Player, RoundRecord } from "@/hooks/useGameState";
import { Trophy, RotateCcw } from "lucide-react";

interface EndGameModalProps {
  open: boolean;
  winnerName: string | null;
  players: Player[];
  history: RoundRecord[];
  onNewGame: () => void;
}

export default function EndGameModal({ open, winnerName, players, history, onNewGame }: EndGameModalProps) {
  const sorted = [...players].sort((a, b) => {
    if (a.status === "eliminated" && b.status !== "eliminated") return 1;
    if (b.status === "eliminated" && a.status !== "eliminated") return -1;
    return a.score - b.score;
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card-elevated w-full max-w-md p-6 space-y-5"
          >
            <div className="text-center space-y-2">
              <Trophy size={48} className="text-gold mx-auto" />
              <h2 className="text-2xl font-black text-gold">Game Over!</h2>
              {winnerName && (
                <p className="text-lg font-bold text-foreground">
                  🏆 {winnerName} wins!
                </p>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Final Standings</h3>
              {sorted.map((p, i) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg ${
                    i === 0 && p.name === winnerName
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-muted/50"
                  } ${p.status === "eliminated" ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-muted-foreground w-5">{i + 1}.</span>
                    <span className="font-semibold text-foreground">{p.name}</span>
                    {p.status === "eliminated" && (
                      <span className="status-eliminated text-[10px]">OUT</span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-gold">{p.score}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              {history.length} rounds played
            </p>

            <button onClick={onNewGame} className="btn-gold w-full flex items-center justify-center gap-2">
              <RotateCcw size={16} /> New Game
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
