import { useState } from "react";
import { motion } from "framer-motion";
import type { Player } from "@/hooks/useGameState";
import { Send, Trophy } from "lucide-react";

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring" }}
      className="fun-card p-5 space-y-4"
    >
      <h3 className="font-extrabold text-xl text-foreground font-display flex items-center gap-2">
        🎯 Round <span className="text-pink-fun">{roundNumber}</span>
      </h3>

      {/* Winner selector */}
      <div>
        <label className="text-sm font-bold text-muted-foreground mb-1 block flex items-center gap-1">
          <Trophy size={14} className="text-sunny" /> Who won?
        </label>
        <select
          value={winner}
          onChange={(e) => setWinner(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-muted border-2 border-border/60 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold"
        >
          <option value="">Pick the winner... 🏆</option>
          {activePlayers.map((p) => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Penalty inputs */}
      {winner && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-2"
        >
          <label className="text-sm font-bold text-muted-foreground">Penalty points 📝</label>
          {activePlayers
            .filter((p) => p.name !== winner)
            .map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center gap-3"
              >
                <span className="text-sm text-foreground flex-1 truncate font-semibold">{p.name}</span>
                <input
                  type="number"
                  min={0}
                  value={penalties[p.name] || ""}
                  onChange={(e) =>
                    setPenalties((prev) => ({ ...prev, [p.name]: e.target.value }))
                  }
                  placeholder="0"
                  className="w-24 px-3 py-2 rounded-xl bg-muted border-2 border-border/60 text-foreground text-right font-bold font-display focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </motion.div>
            ))}
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        disabled={!winner}
        className="btn-candy w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Send size={16} /> Submit Round! 🎉
      </motion.button>
    </motion.div>
  );
}
