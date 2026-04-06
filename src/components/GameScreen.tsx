import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useGameState } from "@/hooks/useGameState";
import { playRoundWin, playBust, playElimination, playPerfectCut, playGameOver, playClick, playError } from "@/hooks/useSoundEffects";
import PlayerCard from "./PlayerCard";
import RoundEntry from "./RoundEntry";
import PerfectCut from "./PerfectCut";
import RoundHistory from "./RoundHistory";
import EndGameModal from "./EndGameModal";
import SetupScreen from "./SetupScreen";
import { RotateCcw, Flag, HelpCircle, ChevronDown } from "lucide-react";

export default function GameScreen() {
  const {
    state,
    activePlayers,
    startGame,
    submitRound,
    applyPerfectCut,
    endGame,
    resetGame,
    getDealerName,
    getCutterName,
  } = useGameState();

  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [lastScores, setLastScores] = useState<Record<number, number>>({});

  useEffect(() => {
    const scores: Record<number, number> = {};
    state.players.forEach((p) => (scores[p.id] = p.score));
    setLastScores(scores);
  }, [state.players]);

  if (state.phase === "setup") {
    return (
      <SetupScreen
        onStart={(names) => {
          const { firstDealerName } = startGame(names);
          playClick();
          toast.success(`🎲 Game started! First dealer: ${firstDealerName}`);
          return { firstDealerName };
        }}
      />
    );
  }

  const handleSubmitRound = (winnerName: string, penalties: Record<string, number>) => {
    submitRound(winnerName, penalties);
    playRoundWin();
    toast.success(`🎉 Round complete! ${winnerName} wins!`);
    // Check for bust/elimination events after a tick
    setTimeout(() => {
      const latest = state.history[0];
      if (latest) {
        latest.events.forEach((e) => {
          if (e.type === "bust") playBust();
          if (e.type === "elimination") playElimination();
        });
      }
    }, 300);
  };

  const handlePerfectCut = (playerName: string) => {
    applyPerfectCut(playerName);
    playPerfectCut();
    // No toast - the big fullscreen animation handles the feedback
  };

  const handleEndGame = () => {
    setShowEndConfirm(false);
    endGame();
    playGameOver();
    toast("🏁 Game ended!");
  };

  const handleReset = () => {
    setShowResetConfirm(false);
    resetGame();
    playClick();
    toast("🔄 Game reset! Ready for a new one!");
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-lg border-b-2 border-border/30 px-4 py-3"
        style={{ background: "hsl(270 60% 98% / 0.8)" }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <motion.h1
            className="text-2xl font-extrabold font-display text-pink-fun tracking-tight"
            animate={{ rotate: [0, -1, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            🃏 KougkAPP
          </motion.h1>
          <div className="flex items-center gap-3 text-sm font-bold">
            <motion.span
              className="px-2 py-1 rounded-full text-xs"
              style={{ background: "var(--gradient-sunset)", color: "white" }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎴 {getDealerName()}
            </motion.span>
            <span className="px-2 py-1 rounded-full text-xs"
              style={{ background: "var(--gradient-ocean)", color: "white" }}>
              ✂️ {getCutterName()}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 mt-6 space-y-6">
        {/* Round table seating */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mx-auto"
          style={{ width: "min(340px, 90vw)", height: "min(340px, 90vw)" }}
        >
          {/* Simple flat circle table */}
          <div
            className="absolute inset-[18%] rounded-full border-2"
            style={{
              borderColor: "hsl(var(--border) / 0.4)",
              background: "radial-gradient(circle, hsl(var(--muted) / 0.3) 0%, hsl(var(--muted) / 0.1) 100%)",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                className="text-3xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                🃏
              </motion.span>
            </div>
          </div>
          {/* Players around the table */}
          {state.seatingOrder.map((name, i) => {
            const player = state.players.find((p) => p.name === name);
            const isEliminated = player?.status === "eliminated";
            const total = state.seatingOrder.length;
            const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
            const radius = 45;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);
            const SEAT_EMOJIS = ["🧑", "👩", "👨", "👩‍🦰", "🧔", "👱", "👩‍🦱", "🧑‍🦳"];
            const seatEmoji = SEAT_EMOJIS[i % SEAT_EMOJIS.length];
            return (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <span className="text-2xl">{isEliminated ? "💀" : seatEmoji}</span>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`px-3 py-1 rounded-full text-xs font-extrabold whitespace-nowrap ${
                    isEliminated
                      ? "text-muted-foreground/40 line-through bg-muted/50"
                      : name === getDealerName()
                      ? "text-primary-foreground"
                      : name === getCutterName()
                      ? "text-primary-foreground"
                      : "text-foreground bg-card"
                  }`}
                  style={{
                    boxShadow: isEliminated
                      ? "none"
                      : "0 2px 8px -2px hsl(var(--foreground) / 0.1)",
                    ...(name === getDealerName() && !isEliminated
                      ? { background: "var(--gradient-sunset)" }
                      : name === getCutterName() && !isEliminated
                      ? { background: "var(--gradient-ocean)" }
                      : {}),
                  }}
                >
                  {name === getDealerName() && !isEliminated && "🎴 "}
                  {name === getCutterName() && !isEliminated && "✂️ "}
                  {name}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Player cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {state.players.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <PlayerCard
                player={p}
                isDealer={p.name === getDealerName()}
                isCutter={p.name === getCutterName()}
                scoreChanged={lastScores[p.id] !== undefined && lastScores[p.id] !== p.score}
              />
            </motion.div>
          ))}
        </div>

        {/* Actions grid */}
        {state.phase === "playing" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <RoundEntry
                roundNumber={state.roundNumber}
                activePlayers={activePlayers}
                onSubmit={handleSubmitRound}
              />
              <PerfectCut
                activePlayers={activePlayers}
                totalPlayers={state.players.length}
                onApply={handlePerfectCut}
              />
            </div>
            <div className="space-y-4">
              <RoundHistory history={state.history} />

              {/* Rules */}
              <div className="fun-card p-4">
                <button
                  onClick={() => setShowRules(!showRules)}
                  className="flex items-center justify-between w-full text-sm font-bold text-foreground"
                >
                  <span className="flex items-center gap-2 font-display">
                    <HelpCircle size={16} className="text-purple-fun" /> Rules & Info 📖
                  </span>
                  <motion.div animate={{ rotate: showRules ? 180 : 0 }}>
                    <ChevronDown size={16} />
                  </motion.div>
                </button>
                {showRules && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="mt-3 text-xs text-muted-foreground space-y-1.5 overflow-hidden font-semibold"
                  >
                    <p>🏆 Winner gets 0 points each round</p>
                    <p>📝 Losers get manually entered penalty points</p>
                    <p>✅ 100 points is safe — 101+ triggers bust!</p>
                    <p>💥 1st bust: ❌ mark, score resets to highest other active player</p>
                    <p>💀 2nd bust: eliminated!</p>
                    <p>✂️ Perfect Cut: -10 points (can go negative!)</p>
                    <p>🃏 Perfect Cut cards: {state.players.length * 10 + 1} ({state.players.length}×10+1)</p>
                    <p>👑 Last active player wins!</p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Game controls */}
        <div className="flex flex-wrap gap-3 justify-center">
          {state.phase === "playing" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEndConfirm(true)}
              className="px-5 py-2.5 rounded-xl bg-card border-2 border-border/60 text-foreground text-sm font-bold hover:bg-muted transition-all flex items-center gap-2"
            >
              <Flag size={14} /> End Game 🏁
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowResetConfirm(true)}
            className="px-5 py-2.5 rounded-xl bg-destructive/10 border-2 border-destructive/30 text-destructive text-sm font-bold hover:bg-destructive/20 transition-all flex items-center gap-2"
          >
            <RotateCcw size={14} /> New Game 🔄
          </motion.button>
        </div>
      </div>

      {/* End game confirmation */}
      {showEndConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "hsl(270 60% 98% / 0.85)", backdropFilter: "blur(6px)" }}
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -3 }}
            animate={{ scale: 1, rotate: 0 }}
            className="fun-card-elevated p-6 max-w-sm w-full space-y-4 text-center"
          >
            <h3 className="text-xl font-extrabold text-foreground font-display">End Game? 🤔</h3>
            <p className="text-sm text-muted-foreground font-semibold">
              This will wrap up the session and show final standings!
            </p>
            <div className="flex gap-3 justify-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEndConfirm(false)}
                className="px-5 py-2.5 rounded-xl bg-muted text-foreground text-sm font-bold border-2 border-border/60"
              >
                Nope! 👋
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleEndGame}
                className="btn-candy text-sm"
              >
                Yes, End! 🏁
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Reset confirmation */}
      {showResetConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "hsl(270 60% 98% / 0.85)", backdropFilter: "blur(6px)" }}
        >
          <motion.div
            initial={{ scale: 0.8, rotate: 3 }}
            animate={{ scale: 1, rotate: 0 }}
            className="fun-card-elevated p-6 max-w-sm w-full space-y-4 text-center"
          >
            <h3 className="text-xl font-extrabold text-foreground font-display">Start Fresh? 🆕</h3>
            <p className="text-sm text-muted-foreground font-semibold">
              This will clear everything. Ready for a new game?
            </p>
            <div className="flex gap-3 justify-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowResetConfirm(false)}
                className="px-5 py-2.5 rounded-xl bg-muted text-foreground text-sm font-bold border-2 border-border/60"
              >
                Keep Playing! 🎮
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-bold"
              >
                Reset! 🔄
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* End game modal */}
      <EndGameModal
        open={state.phase === "ended"}
        winnerName={state.winnerName}
        players={state.players}
        history={state.history}
        onNewGame={resetGame}
      />
    </div>
  );
}
