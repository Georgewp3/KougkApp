import { motion, AnimatePresence } from "framer-motion";
import type { Player } from "@/hooks/useGameState";

interface PlayerCardProps {
  player: Player;
  isDealer: boolean;
  isCutter: boolean;
  scoreChanged?: boolean;
}

export default function PlayerCard({ player, isDealer, isCutter, scoreChanged }: PlayerCardProps) {
  const isEliminated = player.status === "eliminated";
  const remaining = Math.max(0, 100 - player.score);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isEliminated ? 0.5 : 1, scale: 1 }}
      className={`glass-card p-4 relative overflow-hidden transition-all ${
        isEliminated ? "opacity-50 grayscale" : ""
      } ${isDealer ? "ring-2 ring-primary/60" : ""}`}
    >
      {/* Badges row */}
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        {isDealer && <span className="badge-dealer">🎴 Dealer</span>}
        {isCutter && <span className="badge-cutter">✂️ Cutter</span>}
        {player.status === "active" && <span className="status-active">Active</span>}
        {player.status === "busted-once" && <span className="status-busted">⚠ Busted</span>}
        {isEliminated && <span className="status-eliminated">✖ OUT</span>}
      </div>

      {/* Name */}
      <h3 className="font-bold text-foreground text-lg truncate">{player.name}</h3>

      {/* Score */}
      <AnimatePresence mode="wait">
        <motion.div
          key={player.score}
          initial={scoreChanged ? { scale: 1.3 } : false}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="text-3xl font-black font-mono text-gold mt-1"
        >
          {player.score}
        </motion.div>
      </AnimatePresence>

      {/* Remaining */}
      {!isEliminated && (
        <p className="text-xs text-muted-foreground mt-1">
          <span className={remaining <= 20 ? "text-destructive font-semibold" : ""}>
            {remaining} remaining
          </span>
        </p>
      )}

      {/* X markers */}
      {player.busts > 0 && (
        <div className="flex gap-1 mt-2">
          {Array.from({ length: player.busts }).map((_, i) => (
            <span key={i} className="text-lg text-destructive font-black">✕</span>
          ))}
        </div>
      )}

      {isEliminated && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-5xl font-black text-destructive/20 rotate-[-15deg]">
            LOST
          </span>
        </div>
      )}
    </motion.div>
  );
}
