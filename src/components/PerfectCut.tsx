import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Player } from "@/hooks/useGameState";
import { Scissors, Sparkles } from "lucide-react";

interface PerfectCutProps {
  activePlayers: Player[];
  totalPlayers: number;
  onApply: (playerName: string) => void;
}

export default function PerfectCut({ activePlayers, totalPlayers, onApply }: PerfectCutProps) {
  const [selected, setSelected] = useState("");
  const [animating, setAnimating] = useState(false);

  const perfectCutCards = totalPlayers * 10 + 1;

  const handleApply = useCallback(() => {
    if (!selected || animating) return;
    setAnimating(true);
    onApply(selected);
    setTimeout(() => {
      setAnimating(false);
      setSelected("");
    }, 1800);
  }, [selected, animating, onApply]);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="fun-card p-5 space-y-4 relative overflow-hidden"
    >
      {/* Slash animation */}
      <AnimatePresence>
        {animating && (
          <>
            <motion.div
              initial={{ x: "-120%", rotate: -30, opacity: 0 }}
              animate={{ x: "220%", rotate: -30, opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 z-10 pointer-events-none"
            >
              <div className="absolute top-1/2 left-0 w-full h-1.5 rounded-full"
                style={{ background: "var(--gradient-candy)" }} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.2, 1, 0.8] }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            >
              <span className="text-3xl font-extrabold font-display text-pink-fun drop-shadow-lg">
                ✂️ Perfect Cut! -10 ✨
              </span>
            </motion.div>
            {/* Confetti particles */}
            {[...Array(8)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ x: "50%", y: "50%", opacity: 1, scale: 0 }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 80}%`,
                  y: `${50 + (Math.random() - 0.5) * 80}%`,
                  opacity: 0,
                  scale: 1,
                }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute text-xl pointer-events-none z-20"
              >
                {["⭐", "🌟", "✨", "💫", "🎉", "🎊", "✂️", "💎"][i]}
              </motion.span>
            ))}
          </>
        )}
      </AnimatePresence>

      <h3 className="font-extrabold text-xl text-foreground font-display flex items-center gap-2">
        <Scissors size={20} className="text-teal-fun" /> Perfect Cut ✨
      </h3>

      <p className="text-sm text-muted-foreground font-semibold">
        Cut exactly <span className="text-pink-fun font-extrabold text-lg">{perfectCutCards}</span> cards
        ({totalPlayers} × 10 + 1) for a sweet <span className="text-teal-fun font-bold">-10 bonus!</span>
      </p>

      <div className="flex gap-2">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="flex-1 px-3 py-2.5 rounded-xl bg-muted border-2 border-border/60 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold"
          disabled={animating}
        >
          <option value="">Select player... ✂️</option>
          {activePlayers.map((p) => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </select>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleApply}
          disabled={!selected || animating}
          className="btn-candy px-5 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <Sparkles size={16} /> Cut!
        </motion.button>
      </div>
    </motion.div>
  );
}
