import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Play, Minus, Plus } from "lucide-react";

interface SetupScreenProps {
  onStart: (names: string[]) => { firstDealerName: string };
}

const SAMPLE_NAMES = ["Αλέξης", "Μαρία", "Γιώργος", "Ελένη", "Νίκος", "Σοφία"];

export default function SetupScreen({ onStart }: SetupScreenProps) {
  const [playerCount, setPlayerCount] = useState(3);
  const [names, setNames] = useState<string[]>(SAMPLE_NAMES.slice(0, 3));
  const [error, setError] = useState("");

  const updateCount = (n: number) => {
    setPlayerCount(n);
    setNames((prev) => {
      const next = [...prev];
      while (next.length < n) next.push(SAMPLE_NAMES[next.length] || "");
      return next.slice(0, n);
    });
    setError("");
  };

  const handleStart = () => {
    const trimmed = names.map((n) => n.trim());
    if (trimmed.some((n) => !n)) {
      setError("All player names are required");
      return;
    }
    const unique = new Set(trimmed.map((n) => n.toLowerCase()));
    if (unique.size !== trimmed.length) {
      setError("Player names must be unique");
      return;
    }
    onStart(trimmed);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-elevated w-full max-w-md p-8 space-y-6"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-gold">
            Κουνκάν Score Tracker
          </h1>
          <p className="text-sm text-muted-foreground">
            Score tracking companion for your real-life Κουνκάν game
          </p>
        </div>

        {/* Player count */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Users size={16} /> Players
          </label>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => playerCount > 2 && updateCount(playerCount - 1)}
              className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              disabled={playerCount <= 2}
            >
              <Minus size={16} />
            </button>
            <span className="text-3xl font-black font-mono text-gold w-10 text-center">
              {playerCount}
            </span>
            <button
              onClick={() => playerCount < 6 && updateCount(playerCount + 1)}
              className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              disabled={playerCount >= 6}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Name inputs */}
        <div className="space-y-2">
          {names.map((name, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  const next = [...names];
                  next[i] = e.target.value;
                  setNames(next);
                  setError("");
                }}
                placeholder={`Player ${i + 1}`}
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </motion.div>
          ))}
        </div>

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <button onClick={handleStart} className="btn-gold w-full flex items-center justify-center gap-2 text-lg">
          <Play size={20} /> Start Game
        </button>
      </motion.div>
    </div>
  );
}
