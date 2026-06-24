import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type BotStatus = 'ONLINE' | 'DOWN';

interface GameState {
  balance: number;
  totalWagered: number;
  totalWon: number;
  placeBet: (amount: number) => void;
  winBet: (amount: number) => void;
  claimBonus: (amount: number) => void;
  lastBonusClaim: number | null;
  botStatus: BotStatus;
  setBotStatus: (status: BotStatus) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      balance: 1000, // Start with 1000 Galaxy Coins
      totalWagered: 0,
      totalWon: 0,
      lastBonusClaim: null,
      botStatus: 'DOWN',
      setBotStatus: (status) => set({ botStatus: status }),
      placeBet: (amount) =>
      set((state) => ({
        balance: state.balance - amount,
        totalWagered: state.totalWagered + amount
      })),
      winBet: (amount) =>
      set((state) => ({
        balance: state.balance + amount,
        totalWon: state.totalWon + amount
      })),
      claimBonus: (amount) =>
      set((state) => ({
        balance: state.balance + amount,
        lastBonusClaim: Date.now()
      }))
    }),
    {
      name: 'galaxybot-storage',
      partialize: (state) => ({
        balance: state.balance,
        totalWagered: state.totalWagered,
        totalWon: state.totalWon,
        lastBonusClaim: state.lastBonusClaim
      })
    }
  )
);