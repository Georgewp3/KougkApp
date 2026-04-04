import { useState, useCallback } from "react";

export type PlayerStatus = "active" | "busted-once" | "eliminated";

export interface Player {
  id: number;
  name: string;
  score: number;
  status: PlayerStatus;
  busts: number;
  seatIndex: number;
}

export interface RoundEvent {
  type: "bust" | "elimination" | "perfect-cut" | "winner";
  playerName: string;
  detail?: string;
}

export interface RoundRecord {
  roundNumber: number;
  dealerName: string;
  cutterName: string;
  winnerName: string;
  penalties: Record<string, number>;
  events: RoundEvent[];
  perfectCut?: { playerName: string };
  gameEnded?: boolean;
}

export interface GameState {
  phase: "setup" | "playing" | "ended";
  players: Player[];
  currentDealerIndex: number; // seat index
  roundNumber: number;
  history: RoundRecord[];
  winnerName: string | null;
  seatingOrder: string[];
}

const initialState: GameState = {
  phase: "setup",
  players: [],
  currentDealerIndex: 0,
  roundNumber: 1,
  history: [],
  winnerName: null,
  seatingOrder: [],
};

function getActivePlayers(players: Player[]): Player[] {
  return players.filter((p) => p.status !== "eliminated");
}

function getNextActiveIndex(
  players: Player[],
  currentSeatIndex: number,
  direction: 1 | -1 = 1
): number {
  const n = players.length;
  let idx = currentSeatIndex;
  for (let i = 0; i < n; i++) {
    idx = ((idx + direction) % n + n) % n;
    const player = players.find((p) => p.seatIndex === idx);
    if (player && player.status !== "eliminated") return idx;
  }
  return currentSeatIndex;
}

function getDealerPlayer(players: Player[], dealerSeatIndex: number): Player | undefined {
  return players.find((p) => p.seatIndex === dealerSeatIndex);
}

function getCutterSeatIndex(players: Player[], dealerSeatIndex: number): number {
  return getNextActiveIndex(players, dealerSeatIndex, -1);
}

export function useGameState() {
  const [state, setState] = useState<GameState>(initialState);

  const startGame = useCallback((names: string[]) => {
    const players: Player[] = names.map((name, i) => ({
      id: i,
      name: name.trim(),
      score: 0,
      status: "active" as PlayerStatus,
      busts: 0,
      seatIndex: i,
    }));
    const firstDealer = Math.floor(Math.random() * names.length);
    setState({
      phase: "playing",
      players,
      currentDealerIndex: firstDealer,
      roundNumber: 1,
      history: [],
      winnerName: null,
      seatingOrder: names.map((n) => n.trim()),
    });
    return { firstDealerName: players[firstDealer].name };
  }, []);

  const submitRound = useCallback(
    (winnerName: string, penalties: Record<string, number>) => {
      setState((prev) => {
        const players = prev.players.map((p) => ({ ...p }));
        const events: RoundEvent[] = [];

        // Apply penalties
        for (const p of players) {
          if (p.status === "eliminated") continue;
          if (p.name === winnerName) {
            // winner gets 0
          } else {
            p.score += penalties[p.name] || 0;
          }
        }

        // Bust logic - process all busts
        const bustingPlayers = players.filter(
          (p) => p.status !== "eliminated" && p.name !== winnerName && p.score > 100
        );

        for (const bp of bustingPlayers) {
          if (bp.busts === 0) {
            // First bust
            bp.busts = 1;
            bp.status = "busted-once";
            // Reset to highest score among OTHER active (non-eliminated, non-busting-second-time) players
            const otherActive = players.filter(
              (p) => p.id !== bp.id && p.status !== "eliminated"
            );
            const highestOther = Math.max(...otherActive.map((p) => p.score), 0);
            bp.score = highestOther;
            events.push({
              type: "bust",
              playerName: bp.name,
              detail: `First bust! Score reset to ${highestOther}`,
            });
          } else {
            // Second bust - elimination
            bp.busts = 2;
            bp.status = "eliminated";
            events.push({
              type: "elimination",
              playerName: bp.name,
              detail: `Eliminated! Second bust.`,
            });
          }
        }

        // Check for winner
        const activePlayers = getActivePlayers(players);
        let winnerDetected: string | null = null;
        let gameEnded = false;

        if (activePlayers.length === 1) {
          winnerDetected = activePlayers[0].name;
          gameEnded = true;
          events.push({
            type: "winner",
            playerName: activePlayers[0].name,
            detail: "Last player standing!",
          });
        }

        const dealer = getDealerPlayer(prev.players, prev.currentDealerIndex);
        const cutterSeat = getCutterSeatIndex(prev.players, prev.currentDealerIndex);
        const cutter = prev.players.find((p) => p.seatIndex === cutterSeat);

        const record: RoundRecord = {
          roundNumber: prev.roundNumber,
          dealerName: dealer?.name || "?",
          cutterName: cutter?.name || "?",
          winnerName,
          penalties,
          events,
          gameEnded,
        };

        // Rotate dealer
        const nextDealer = getNextActiveIndex(players, prev.currentDealerIndex, 1);

        return {
          ...prev,
          players,
          roundNumber: prev.roundNumber + 1,
          history: [record, ...prev.history],
          currentDealerIndex: nextDealer,
          winnerName: winnerDetected,
          phase: gameEnded ? "ended" : "playing",
        };
      });
    },
    []
  );

  const applyPerfectCut = useCallback((playerName: string) => {
    setState((prev) => {
      const players = prev.players.map((p) =>
        p.name === playerName
          ? { ...p, score: p.score - 10 }
          : p
      );
      // Add to latest history if exists
      const history = [...prev.history];
      if (history.length > 0) {
        history[0] = {
          ...history[0],
          perfectCut: { playerName },
          events: [
            ...history[0].events,
            { type: "perfect-cut" as const, playerName, detail: "Perfect Cut! -10 points" },
          ],
        };
      }
      return { ...prev, players, history };
    });
  }, []);

  const endGame = useCallback(() => {
    setState((prev) => {
      const active = getActivePlayers(prev.players);
      // Winner is lowest score among active
      const sorted = [...active].sort((a, b) => a.score - b.score);
      return {
        ...prev,
        phase: "ended",
        winnerName: sorted[0]?.name || null,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  const getDealerName = useCallback((): string => {
    const p = state.players.find((p) => p.seatIndex === state.currentDealerIndex);
    return p?.name || "?";
  }, [state.players, state.currentDealerIndex]);

  const getCutterName = useCallback((): string => {
    const cutterSeat = getCutterSeatIndex(state.players, state.currentDealerIndex);
    const p = state.players.find((p) => p.seatIndex === cutterSeat);
    return p?.name || "?";
  }, [state.players, state.currentDealerIndex]);

  const activePlayers = getActivePlayers(state.players);

  return {
    state,
    activePlayers,
    startGame,
    submitRound,
    applyPerfectCut,
    endGame,
    resetGame,
    getDealerName,
    getCutterName,
  };
}
