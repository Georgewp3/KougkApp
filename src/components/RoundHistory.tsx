import { motion } from "framer-motion";
import type { RoundRecord } from "@/hooks/useGameState";
import { History } from "lucide-react";

interface RoundHistoryProps {
  history: RoundRecord[];
}

export default function RoundHistory({ history }: RoundHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="glass-card p-5">
        <h3 className="font-bold text-lg text-foreground flex items-center gap-2 mb-2">
          <History size={18} className="text-gold" /> Round History
        </h3>
        <p className="text-sm text-muted-foreground">No rounds played yet.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 space-y-3">
      <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
        <History size={18} className="text-gold" /> Round History
      </h3>
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {history.map((r, i) => (
          <motion.div
            key={r.roundNumber}
            initial={i === 0 ? { opacity: 0, y: -10 } : false}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-muted/50 border border-border/30 text-sm space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Round {r.roundNumber}</span>
              <span className="text-xs text-muted-foreground">
                🎴 {r.dealerName} · ✂️ {r.cutterName}
              </span>
            </div>
            <p className="text-emerald font-semibold">🏆 {r.winnerName}</p>
            {Object.entries(r.penalties).length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                {Object.entries(r.penalties).map(([name, pts]) => (
                  <span key={name}>{name}: +{pts}</span>
                ))}
              </div>
            )}
            {r.events.length > 0 && (
              <div className="space-y-0.5">
                {r.events.map((e, j) => (
                  <p key={j} className={`text-xs ${
                    e.type === "bust" ? "text-gold" :
                    e.type === "elimination" ? "text-destructive" :
                    e.type === "perfect-cut" ? "text-emerald" :
                    "text-gold"
                  }`}>
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
