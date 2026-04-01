import { useState } from "react";
import { motion } from "framer-motion";
import type { Player } from "@/hooks/useGameState";
import { Send } from "lucide-react";

interface RoundEntryProps {
  roundNumber: number;
  activePlayers: Player[];
  onSubmit: (winnerName: string, penalties: Record<string, number>) => void;
}

export default function RoundEntry({ roundNumber, activePlayers, onSubmit }: RoundEntryProps) {
  const [winner, setWinner] = useState("");
  const [penalties, setPenalties] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    if (!winner) return;
    const penaltyMap: Record<string, number> = {};
    for (const p of activePlayers) {
      if (p.name === winner) continue;
      penaltyMap[p.name] = Math.max(0, parseInt(penalties[p.name] || "0", 10) || 0);
    }
    onSubmit(winner, penaltyMap);
    setWinner("");
    setPenalties({});
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card p-5 space-y-4"
    >
      <h3 className="font-bold text-lg text-foreground">
        Round <span className="text-gold font-mono">{roundNumber}</span>
      </h3>

      {/* Winner selector */}
      <div>
        <label className="text-sm font-semibold text-muted-foreground mb-1 block">Winner</label>
        <select
          value={winner}
          onChange={(e) => setWinner(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Select winner...</option>
          {activePlayers.map((p) => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Penalty inputs */}
      {winner && (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground">Penalty points</label>
          {activePlayers
            .filter((p) => p.name !== winner)
            .map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-sm text-foreground flex-1 truncate">{p.name}</span>
                <input
                  type="number"
                  min={0}
                  value={penalties[p.name] || ""}
                  onChange={(e) =>
                    setPenalties((prev) => ({ ...prev, [p.name]: e.target.value }))
                  }
                  placeholder="0"
                  className="w-24 px-3 py-2 rounded-lg bg-muted border border-border/50 text-foreground text-right font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!winner}
        className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Send size={16} /> Submit Round
      </button>
    </motion.div>
  );
}
