import { create } from 'zustand';
import * as api from '../lib/api';

type BotStatus = 'ONLINE' | 'DOWN';

interface GameState {
  // session (server-authoritative)
  ready: boolean;
  token: string | null;
  name: string;
  balance: number | null;
  bonusReadyAt: number;
  markets: api.Market[];

  // cosmetic bot status used by the hero ticker (client-only flavor)
  botStatus: BotStatus;
  setBotStatus: (status: BotStatus) => void;

  // actions
  init: () => Promise<void>;
  placeBet: (marketId: string, stake: number) => Promise<api.BetResult>;
  claimBonus: () => Promise<{reward: number;balance: number;bonusReadyAt: number;}>;
}

export const useGameStore = create<GameState>()((set, get) => ({
  ready: false,
  token: null,
  name: '',
  balance: null,
  bonusReadyAt: 0,
  markets: [],

  botStatus: 'DOWN',
  setBotStatus: (status) => set({ botStatus: status }),

  init: async () => {
    if (get().ready) return;
    const [session, markets] = await Promise.all([
    api.initSession(),
    api.getMarkets()]
    );
    set({
      ready: true,
      token: session.token,
      name: session.name,
      balance: session.balance,
      bonusReadyAt: session.bonusReadyAt,
      markets
    });
  },

  placeBet: async (marketId, stake) => {
    const result = await api.placeBet(marketId, stake);
    set({ balance: result.balance });
    return result;
  },

  claimBonus: async () => {
    const result = await api.claimBonus();
    set({ balance: result.balance, bonusReadyAt: result.bonusReadyAt });
    return result;
  }
}));
