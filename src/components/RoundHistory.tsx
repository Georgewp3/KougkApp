import { motion } from "framer-motion";
import type { RoundRecord } from "@/hooks/useGameState";
import { History } from "lucide-react";

interface RoundHistoryProps {
  history: RoundRecord[];
}

export default function RoundHistory({ history }: RoundHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="fun-card p-5">
        <h3 className="font-extrabold text-lg text-foreground font-display flex items-center gap-2 mb-2">
          <History size={18} className="text-purple-fun" /> Round History
        </h3>
        <p className="text-sm text-muted-foreground font-semibold">
          No rounds played yet! Let's get started! 🎮
        </p>
      </div>
    );
  }

  return (
    <div className="fun-card p-5 space-y-3">
      <h3 className="font-extrabold text-lg text-foreground font-display flex items-center gap-2">
        <History size={18} className="text-purple-fun" /> Round History 📜
      </h3>
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {history.map((r, i) => (
          <motion.div
            key={r.roundNumber}
            initial={i === 0 ? { opacity: 0, y: -10, scale: 0.95 } : false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring" }}
            className="p-3 rounded-xl bg-muted/50 border-2 border-border/30 text-sm space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-foreground font-display">
                Round {r.roundNumber}
              </span>
              <span className="text-xs text-muted-foreground font-semibold">
                🎴 {r.dealerName} · ✂️ {r.cutterName}
              </span>
            </div>
            <p className="text-teal-fun font-bold">🏆 {r.winnerName}</p>
            {Object.entries(r.penalties).length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground font-semibold">
                {Object.entries(r.penalties).map(([name, pts]) => (
                  <span key={name}>{name}: +{pts}</span>
                ))}
              </div>
            )}
            {r.events.length > 0 && (
              <div className="space-y-0.5">
                {r.events.map((e, j) => (
                  <p key={j} className={`text-xs font-bold ${
                    e.type === "bust" ? "text-sunny" :
                    e.type === "elimination" ? "text-destructive" :
                    e.type === "perfect-cut" ? "text-teal-fun" :
                    "text-pink-fun"
                  }`}>
                    {e.type === "bust" && "💥 "}{e.type === "elimination" && "💀 "}
                    {e.type === "perfect-cut" && "✂️ "}{e.type === "winner" && "🏆 "}
                    {e.detail}
                  </p>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
