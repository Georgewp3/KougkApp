import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useGameState } from "@/hooks/useGameState";
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

  // Track score changes for animation
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
          toast.success(`Game started! First dealer: ${firstDealerName}`);
          return { firstDealerName };
        }}
      />
    );
  }

  const handleSubmitRound = (winnerName: string, penalties: Record<string, number>) => {
    submitRound(winnerName, penalties);
    toast.success(`Round complete! ${winnerName} wins the round.`);

    // Check events from the latest history entry after state update
    setTimeout(() => {
      // Events are captured in the round record
    }, 0);
  };

  const handlePerfectCut = (playerName: string) => {
    applyPerfectCut(playerName);
    toast("✂️ Perfect Cut!", {
      description: `${playerName} gets -10 points!`,
    });
  };

  const handleEndGame = () => {
    setShowEndConfirm(false);
    endGame();
    toast("Game ended manually.");
  };

  const handleReset = () => {
    setShowResetConfirm(false);
    resetGame();
    toast("Game reset.");
  };

  const perfectCutTable: Record<number, number> = { 2: 21, 3: 31, 4: 41, 5: 51, 6: 61 };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-lg bg-background/60 border-b border-border/30 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-black text-gold tracking-tight">Κουνκάν</h1>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>🎴 {getDealerName()}</span>
            <span>✂️ {getCutterName()}</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 mt-6 space-y-6">
        {/* Seating order */}
        <div className="flex items-center gap-2 flex-wrap text-sm">
          <span className="text-muted-foreground font-semibold text-xs">Seating:</span>
          {state.seatingOrder.map((name, i) => {
            const player = state.players.find((p) => p.name === name);
            const isEliminated = player?.status === "eliminated";
            return (
              <span
                key={i}
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  isEliminated
                    ? "text-muted-foreground/40 line-through"
                    : name === getDealerName()
                    ? "text-primary-foreground bg-primary/80 font-bold"
                    : "text-foreground bg-muted/60"
                }`}
              >
                {name}
              </span>
            );
          })}
        </div>

        {/* Player cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {state.players.map((p) => (
            <PlayerCard
              key={p.id}
              player={p}
              isDealer={p.name === getDealerName()}
              isCutter={p.name === getCutterName()}
              scoreChanged={lastScores[p.id] !== undefined && lastScores[p.id] !== p.score}
            />
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
              <div className="glass-card p-4">
                <button
                  onClick={() => setShowRules(!showRules)}
                  className="flex items-center justify-between w-full text-sm font-semibold text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle size={16} className="text-gold" /> Rules & Info
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${showRules ? "rotate-180" : ""}`}
                  />
                </button>
                {showRules && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="mt-3 text-xs text-muted-foreground space-y-1.5 overflow-hidden"
                  >
                    <p>• Winner gets 0 points each round</p>
                    <p>• Losers receive manually entered penalty points</p>
                    <p>• 100 points is safe. 101+ triggers bust</p>
                    <p>• 1st bust: ✕ mark, score resets to highest other active player's score</p>
                    <p>• 2nd bust: eliminated</p>
                    <p>• Perfect Cut: -10 points (min 0)</p>
                    <p>• Perfect Cut cards: {perfectCutTable[state.players.length] || "N/A"} ({state.players.length}×10+1)</p>
                    <p>• Last active player wins</p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Game controls */}
        <div className="flex flex-wrap gap-3 justify-center">
          {state.phase === "playing" && (
            <button
              onClick={() => setShowEndConfirm(true)}
              className="px-4 py-2 rounded-lg bg-muted border border-border/50 text-foreground text-sm font-semibold hover:bg-muted/80 transition-all flex items-center gap-2"
            >
              <Flag size={14} /> End Game
            </button>
          )}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 rounded-lg bg-destructive/20 border border-destructive/30 text-destructive text-sm font-semibold hover:bg-destructive/30 transition-all flex items-center gap-2"
          >
            <RotateCcw size={14} /> New Game
          </button>
        </div>
      </div>

      {/* End game confirmation */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-card-elevated p-6 max-w-sm w-full space-y-4 text-center">
            <h3 className="text-lg font-bold text-foreground">End Game?</h3>
            <p className="text-sm text-muted-foreground">
              This will end the current session and show final standings.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-semibold"
              >
                Cancel
              </button>
              <button onClick={handleEndGame} className="btn-gold text-sm">
                End Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset confirmation */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-card-elevated p-6 max-w-sm w-full space-y-4 text-center">
            <h3 className="text-lg font-bold text-foreground">Start New Game?</h3>
            <p className="text-sm text-muted-foreground">
              This will clear all current game data.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-semibold"
              >
                Cancel
              </button>
              <button onClick={handleReset} className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold">
                Reset
              </button>
            </div>
          </div>
        </div>
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
