import { useState, useCallback } from "react";
import ReactDOM from "react-dom";
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
    }, 2500);
  }, [selected, animating, onApply]);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="fun-card p-5 space-y-4 relative overflow-hidden"
    >
      {/* Fullscreen overlay slash animation */}
      <AnimatePresence>
        {animating && ReactDOM.createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
          >
            {/* Slash line across screen */}
            <motion.div
              initial={{ x: "-120vw", rotate: -20 }}
              animate={{ x: "120vw", rotate: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute w-[200vw] h-2 rounded-full"
              style={{ background: "linear-gradient(90deg, transparent, hsl(var(--pink-fun)), hsl(var(--teal-fun)), transparent)" }}
            />
            {/* Second slash */}
            <motion.div
              initial={{ x: "120vw", rotate: 15 }}
              animate={{ x: "-120vw", rotate: 15 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: 0.15 }}
              className="absolute w-[200vw] h-1.5 rounded-full"
              style={{ background: "linear-gradient(90deg, transparent, hsl(var(--sunny-fun)), hsl(var(--pink-fun)), transparent)" }}
            />
            {/* Central flash */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 2, 1.5], opacity: [0, 1, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute w-40 h-40 rounded-full"
              style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }}
            />
            {/* Big text */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: [0, 1.3, 1], rotate: [-10, 3, 0] }}
              transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
              className="relative text-center"
            >
              <div className="text-6xl sm:text-8xl font-extrabold font-display drop-shadow-2xl"
                style={{ color: "white", textShadow: "0 0 40px hsl(var(--pink-fun)), 0 0 80px hsl(var(--teal-fun))" }}>
                ✂️ PERFECT CUT!
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-4xl sm:text-5xl font-extrabold font-display mt-2"
                style={{ color: "hsl(var(--sunny-fun))", textShadow: "0 0 20px hsl(var(--sunny-fun))" }}
              >
                -10 Points! 🔥
              </motion.div>
            </motion.div>
            {/* Big confetti particles */}
            {[...Array(16)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{
                  x: (Math.random() - 0.5) * 600,
                  y: (Math.random() - 0.5) * 600,
                  opacity: 0,
                  scale: [0, 1.5, 0.5],
                  rotate: Math.random() * 720,
                }}
                transition={{ duration: 1.5, delay: 0.2 + Math.random() * 0.3 }}
                className="absolute text-3xl sm:text-5xl"
              >
                {["⭐", "🌟", "✨", "💫", "🎉", "🎊", "✂️", "💎", "🔪", "⚡", "🌈", "🎯", "💥", "🏆", "🎵", "🫧"][i]}
              </motion.span>
            ))}
          </motion.div>,
          document.body
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
