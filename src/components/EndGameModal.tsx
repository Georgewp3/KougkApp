import { motion, AnimatePresence } from "framer-motion";
import type { Player, RoundRecord } from "@/hooks/useGameState";
import { Trophy, RotateCcw, PartyPopper } from "lucide-react";

interface EndGameModalProps {
  open: boolean;
  winnerName: string | null;
  players: Player[];
  history: RoundRecord[];
  onNewGame: () => void;
}

export default function EndGameModal({ open, winnerName, players, onNewGame }: EndGameModalProps) {
  const sorted = [...players].sort((a, b) => {
    if (a.status === "eliminated" && b.status !== "eliminated") return 1;
    if (b.status === "eliminated" && a.status !== "eliminated") return -1;
    return a.score - b.score;
  });

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "hsl(270 60% 98% / 0.9)", backdropFilter: "blur(8px)" }}
        >
          {/* Confetti background */}
          {[...Array(12)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-2xl pointer-events-none"
              initial={{
                x: "50%",
                y: "40%",
                opacity: 1,
                scale: 0,
              }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: [1, 1, 0],
                scale: [0, 1.5, 1],
                rotate: [0, Math.random() * 360],
              }}
              transition={{ duration: 2 + Math.random(), delay: Math.random() * 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              {["🎉", "🎊", "⭐", "🌟", "✨", "🎈", "🥳", "🏆", "💫", "🎯", "🃏", "❤️"][i]}
            </motion.span>
          ))}

          <motion.div
            initial={{ scale: 0.5, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="fun-card-elevated w-full max-w-md p-7 space-y-5 relative z-10"
          >
            <div className="text-center space-y-2">
              <motion.div
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <Trophy size={56} className="text-sunny mx-auto" />
              </motion.div>
              <h2 className="text-3xl font-extrabold font-display text-pink-fun">
                Game Over! 🎉
              </h2>
              {winnerName && (
                <motion.p
                  className="text-xl font-extrabold text-foreground font-display"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🏆 {winnerName} wins! 🏆
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-muted-foreground">Final Standings</h3>
              {sorted.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    i === 0 && p.name === winnerName
                      ? "bg-primary/10 border-2 border-primary/30"
                      : "bg-muted/50 border-2 border-border/30"
                  } ${p.status === "eliminated" ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{medals[i] || `${i + 1}.`}</span>
                    <span className="font-bold text-foreground">{p.name}</span>
                    {p.status === "eliminated" && (
                      <span className="status-eliminated text-[10px]">💀 OUT</span>
                    )}
                  </div>
                  <span className="font-extrabold font-display text-pink-fun text-lg">{p.score}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onNewGame}
              className="btn-candy w-full flex items-center justify-center gap-2 text-lg"
            >
              <PartyPopper size={20} /> Play Again!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
