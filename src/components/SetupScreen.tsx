import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Play, Minus, Plus, Sparkles } from "lucide-react";

interface SetupScreenProps {
  onStart: (names: string[]) => { firstDealerName: string };
}

const SAMPLE_NAMES = ["Alex", "Maria", "George", "Helen", "Nick", "Sophie"];
const EMOJIS = ["🃏", "🎴", "🂠", "🎲", "🎯", "⭐"];

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
      setError("Oops! All players need a name! 😅");
      return;
    }
    const unique = new Set(trimmed.map((n) => n.toLowerCase()));
    if (unique.size !== trimmed.length) {
      setError("Hey, everyone needs a unique name! 🤔");
      return;
    }
    onStart(trimmed);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Floating background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {["🃏", "♠️", "♥️", "♦️", "♣️", "🎴"].map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-3xl opacity-10"
            style={{
              left: `${10 + i * 15}%`,
              top: `${5 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fun-card-elevated w-full max-w-md p-8 space-y-6"
      >
        <div className="text-center space-y-2">
          <motion.h1
            className="text-4xl font-extrabold font-display tracking-tight text-pink-fun"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            🃏 KougkAPP
          </motion.h1>
          <motion.p
            className="text-lg font-extrabold text-teal-fun uppercase tracking-widest"
            animate={{ scale: [1, 1.06, 1], rotate: [0, -1, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            TIME FOR KOUGKA MALAKES! 🔥
          </motion.p>
        </div>

        {/* Player count */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-foreground flex items-center gap-2">
            <Users size={16} className="text-purple-fun" /> How many players?
          </label>
          <div className="flex items-center justify-center gap-5">
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => playerCount > 2 && updateCount(playerCount - 1)}
              className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors border-2 border-border/60 text-lg font-bold"
              disabled={playerCount <= 2}
            >
              <Minus size={18} />
            </motion.button>
            <motion.span
              key={playerCount}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="text-5xl font-extrabold font-display text-pink-fun w-14 text-center"
            >
              {playerCount}
            </motion.span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => playerCount < 6 && updateCount(playerCount + 1)}
              className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors border-2 border-border/60 text-lg font-bold"
              disabled={playerCount >= 6}
            >
              <Plus size={18} />
            </motion.button>
          </div>
        </div>

        {/* Name inputs */}
        <div className="space-y-2.5">
          {names.map((name, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, type: "spring" }}
              className="flex items-center gap-2"
            >
              <span className="text-xl">{EMOJIS[i]}</span>
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
                className="w-full px-4 py-2.5 rounded-xl bg-muted border-2 border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-semibold"
              />
            </motion.div>
          ))}
        </div>

        {error && (
          <motion.p
            initial={{ x: -10 }}
            animate={{ x: [0, -5, 5, -3, 3, 0] }}
            className="text-sm text-destructive text-center font-bold"
          >
            {error}
          </motion.p>
        )}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleStart}
          className="btn-candy w-full flex items-center justify-center gap-2 text-lg"
        >
          <Sparkles size={20} /> Let's Play!
        </motion.button>
      </motion.div>
    </div>
  );
}
