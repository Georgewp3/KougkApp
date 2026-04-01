import { motion, AnimatePresence } from "framer-motion";
import type { Player } from "@/hooks/useGameState";

interface PlayerCardProps {
  player: Player;
  isDealer: boolean;
  isCutter: boolean;
  scoreChanged?: boolean;
}

const PLAYER_EMOJIS = ["🃏", "🎴", "🂠", "🎲", "🎯", "⭐"];

export default function PlayerCard({ player, isDealer, isCutter, scoreChanged }: PlayerCardProps) {
  const isEliminated = player.status === "eliminated";
  const remaining = Math.max(0, 100 - player.score);
  const emoji = PLAYER_EMOJIS[player.seatIndex % PLAYER_EMOJIS.length];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
      animate={{
        opacity: isEliminated ? 0.45 : 1,
        scale: 1,
        rotate: 0,
      }}
      whileHover={!isEliminated ? { scale: 1.03, rotate: 1 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`fun-card p-4 relative overflow-hidden ${
        isEliminated ? "grayscale" : ""
      } ${isDealer ? "ring-3 ring-primary/50" : ""}`}
    >
      {/* Fun background blob */}
      {!isEliminated && (
        <div
          className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10 blur-xl"
          style={{
            background: `hsl(${(player.seatIndex * 60 + 330) % 360} 80% 60%)`,
          }}
        />
      )}

      {/* Badges row */}
      <div className="flex items-center gap-1.5 mb-2 flex-wrap relative z-10">
        {isDealer && (
          <motion.span
            className="badge-dealer"
            animate={{ rotate: [0, -3, 3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎴 Dealer
          </motion.span>
        )}
        {isCutter && (
          <motion.span className="badge-cutter">✂️ Cutter</motion.span>
        )}
        {player.status === "active" && <span className="status-active">✅ Active</span>}
        {player.status === "busted-once" && (
          <motion.span
            className="status-busted"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            💥 Busted!
          </motion.span>
        )}
        {isEliminated && <span className="status-eliminated">💀 OUT</span>}
      </div>

      {/* Name */}
      <h3 className="font-extrabold text-foreground text-lg truncate relative z-10 font-display">
        {emoji} {player.name}
      </h3>

      {/* Score */}
      <AnimatePresence mode="wait">
        <motion.div
          key={player.score}
          initial={scoreChanged ? { scale: 1.5, rotate: 10 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="text-4xl font-extrabold font-display text-pink-fun mt-1 relative z-10"
        >
          {player.score}
        </motion.div>
      </AnimatePresence>

      {/* Remaining */}
      {!isEliminated && (
        <div className="mt-1 relative z-10">
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  remaining <= 20
                    ? "hsl(0 72% 55%)"
                    : remaining <= 50
                    ? "hsl(25 95% 58%)"
                    : "hsl(120 60% 50%)",
              }}
              initial={false}
              animate={{ width: `${remaining}%` }}
              transition={{ type: "spring", stiffness: 200 }}
            />
          </div>
          <p className={`text-xs font-bold mt-0.5 ${
            remaining <= 20 ? "text-destructive" : "text-muted-foreground"
          }`}>
            {remaining} pts left {remaining <= 20 && "😰"}
          </p>
        </div>
      )}

      {/* X markers */}
      {player.busts > 0 && (
        <div className="flex gap-1 mt-2 relative z-10">
          {Array.from({ length: player.busts }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-xl"
            >
              ❌
            </motion.span>
          ))}
        </div>
      )}

      {isEliminated && (
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: -12 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <span className="text-5xl font-extrabold text-destructive/20 font-display">
            LOST 😵
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
