import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { getLeaderboard } from '../lib/api';
import type { LeaderRow } from '../lib/api';

function formatProfit(profit: number): string {
  const sign = profit > 0 ? '+' : profit < 0 ? '-' : '';
  return `${sign}${Math.abs(profit).toLocaleString('de-DE')} GC`;
}

export function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderRow[]>([]);
  const [you, setYou] = useState<string | null>(null);
  const ready = useGameStore((state) => state.ready);
  // balance changes whenever we win/lose — use it to refresh promptly after a bet
  const balance = useGameStore((state) => state.balance);

  useEffect(() => {
    if (!ready) return;
    let active = true;
    const load = () =>
    getLeaderboard().
    then((data) => {
      if (!active) return;
      setLeaders(data.leaders);
      setYou(data.you);
    }).
    catch(() => {});
    load();
    const interval = setInterval(load, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [ready, balance]);

  return (
    <div className="rounded-xl border border-space-700 bg-space-800/50 p-5 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2 border-b border-space-700 pb-3">
        <Trophy className="h-5 w-5 text-neon-gold" />
        <h3 className="font-display font-bold text-white">HALLE DER SCHANDE</h3>
      </div>

      <div className="space-y-3">
        {leaders.length === 0 &&
        <div className="py-6 text-center text-sm text-slate-500">
            Noch keine Zocker. Sei der erste am Boden.
          </div>
        }
        {leaders.map((leader) => {
          const isYou = you !== null && leader.token === you;
          return (
            <div
              key={leader.token}
              className={`flex items-center justify-between rounded-lg p-3 ${
              isYou ?
              'bg-neon-magenta/10 ring-1 ring-neon-magenta/40' :
              'bg-space-900'}`
              }>

              <div className="flex items-center gap-3">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full font-display text-xs font-bold ${
                  leader.rank === 1 ?
                  'bg-neon-gold text-black' :
                  leader.rank === 2 ?
                  'bg-slate-300 text-black' :
                  leader.rank === 3 ?
                  'bg-amber-700 text-white' :
                  'bg-space-700 text-slate-400'}`
                  }>

                  {leader.rank}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    {leader.name}
                    {isYou &&
                    <span className="ml-2 text-xs font-normal text-neon-magenta">
                        (du)
                      </span>
                    }
                  </div>
                  <div className="text-xs text-slate-500">{leader.title}</div>
                </div>
              </div>
              <div
                className={`font-display text-sm font-bold ${
                leader.profit >= 0 ? 'text-neon-green' : 'text-red-500'}`
                }>

                {formatProfit(leader.profit)}
              </div>
            </div>);

        })}
      </div>
    </div>);

}
