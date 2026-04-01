import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Player } from "@/hooks/useGameState";
import { Scissors } from "lucide-react";

interface PerfectCutProps {
  activePlayers: Player[];
  totalPlayers: number;
  onApply: (playerName: string) => void;
}

export default function PerfectCut({ activePlayers, totalPlayers, onApply }: PerfectCutProps) {
  const [selected, setSelected] = useState("");
  const [animating, setAnimating] = useState(false);

  const perfectCutCards = totalPlayers * 10 + 1;

  const handleApply = () => {
    if (!selected || animating) return;
    setAnimating(true);
    onApply(selected);
    setTimeout(() => {
      setAnimating(false);
      setSelected("");
    }, 1200);
  };

  return (
    <div className="glass-card p-5 space-y-4 relative overflow-hidden">
      <AnimatePresence>
        {animating && (
          <motion.div
            initial={{ x: "-100%", rotate: -45, opacity: 0 }}
            animate={{ x: "200%", rotate: -45, opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 z-10 pointer-events-none"
          >
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {animating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          >
            <span className="text-2xl font-black text-gold">✂️ Perfect Cut! -10</span>
          </motion.div>
        )}
      </AnimatePresence>

      <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
        <Scissors size={18} className="text-gold" /> Perfect Cut
      </h3>

      <p className="text-xs text-muted-foreground">
        Cut exactly <span className="text-gold font-bold">{perfectCutCards}</span> cards
        ({totalPlayers} × 10 + 1) for a -10 bonus.
      </p>

      <div className="flex gap-2">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          disabled={animating}
        >
          <option value="">Select player...</option>
          {activePlayers.map((p) => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </select>
        <button
          onClick={handleApply}
          disabled={!selected || animating}
          className="btn-gold px-4 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
