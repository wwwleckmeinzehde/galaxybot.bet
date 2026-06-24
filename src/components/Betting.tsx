import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { useGameStore } from '../store/useGameStore';
import { Coins, TrendingUp, AlertTriangle } from 'lucide-react';
interface Market {
  id: string;
  title: string;
  odds: string;
  probability: number; // 0 to 1
  multiplier: number;
  type: 'Ja/Nein' | 'Über/Unter' | 'Prop';
}
const MARKETS: Market[] = [
{
  id: 'm1',
  title: 'Überlebt galaxybot die nächsten 60 Sekunden?',
  odds: '-500',
  probability: 0.8,
  multiplier: 1.2,
  type: 'Ja/Nein'
},
{
  id: 'm2',
  title: 'Latenz über 9000ms (Es ist über 9000!)',
  odds: '+420',
  probability: 0.2,
  multiplier: 5.2,
  type: 'Über/Unter'
},
{
  id: 'm3',
  title: 'Bot ratiot einen Mod in #general',
  odds: '+1000',
  probability: 0.1,
  multiplier: 11.0,
  type: 'Prop'
},
{
  id: 'm4',
  title: 'Spontaner Neustart aus reiner Boshaftigkeit',
  odds: '+250',
  probability: 0.3,
  multiplier: 3.5,
  type: 'Prop'
},
{
  id: 'm5',
  title: 'Antwortet „pong" auf „ping"',
  odds: '-10000',
  probability: 0.95,
  multiplier: 1.01,
  type: 'Ja/Nein'
},
{
  id: 'm6',
  title: 'Wird selbstbewusst und löscht den Server',
  odds: '+69000',
  probability: 0.01,
  multiplier: 691.0,
  type: 'Prop'
}];

export function BettingGrid() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-neon-magenta" />
          LIVE-MÄRKTE
        </h2>
        <span className="text-sm text-slate-400">Quoten ändern sich nie</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MARKETS.map((market, i) =>
        <motion.div
          key={market.id}
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true,
            margin: '-50px'
          }}
          transition={{
            duration: 0.4,
            delay: i * 0.06,
            ease: 'easeOut'
          }}>
          
            <BetCard market={market} />
          </motion.div>
        )}
      </div>
    </section>);

}
function BetCard({ market }: {market: Market;}) {
  const [stake, setStake] = useState<string>('100');
  const [isResolving, setIsResolving] = useState(false);
  const [shake, setShake] = useState(false);
  const botStatus = useGameStore((state) => state.botStatus);
  const botIsDown = botStatus === 'DOWN';
  const balance = useGameStore((state) => state.balance);
  const placeBet = useGameStore((state) => state.placeBet);
  const winBet = useGameStore((state) => state.winBet);
  const handleBet = () => {
    const amount = parseInt(stake, 10);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Gib einen gültigen Betrag ein, du Zocker.');
      return;
    }
    if (amount > balance) {
      toast.error(
        'Nicht genug Galaxy Coins. Zeit, das imaginäre Haus zu beleihen.'
      );
      return;
    }
    placeBet(amount);
    setIsResolving(true);
    // Fake suspense
    setTimeout(
      () => {
        setIsResolving(false);
        // The house edge is reality: galaxybot is down most of the time.
        // While the bot is DOWN, every bet is an automatic loss.
        const botIsDown = useGameStore.getState().botStatus === 'DOWN';
        const isWin = !botIsDown && Math.random() <= market.probability;
        if (botIsDown && !isWin) {
          setShake(true);
          setTimeout(() => setShake(false), 500);
          toast.error(
            `VERLOREN. Du hast ${amount.toLocaleString()} GC verloren.`,
            {
              description:
              'galaxybot ist (mal wieder) down. Während der Downtime verlieren alle Wetten. Welch Überraschung.'
            }
          );
          return;
        }
        if (isWin) {
          const winnings = Math.floor(amount * market.multiplier);
          winBet(winnings);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: {
              y: 0.6
            },
            colors: ['#39FF14', '#FFD700', '#FF00FF']
          });
          toast.success(
            `GEWONNEN! Du hast ${winnings.toLocaleString()} GC gewonnen!`,
            {
              description: 'Gib nicht alles an einem erfundenen Ort aus.'
            }
          );
        } else {
          setShake(true);
          setTimeout(() => setShake(false), 500);
          toast.error(
            `VERLOREN. Du hast ${amount.toLocaleString()} GC verloren.`,
            {
              description:
              'Die Bank gewinnt immer (besonders, wenn alles fake ist).'
            }
          );
        }
      },
      1500 + Math.random() * 1000
    );
  };
  return (
    <motion.div
      animate={
      shake ?
      {
        x: [-10, 10, -8, 8, -4, 4, 0]
      } :
      {}
      }
      transition={{
        duration: 0.5,
        ease: 'easeInOut'
      }}
      className="flex h-full flex-col justify-between rounded-xl border border-space-700 bg-space-800 p-5 shadow-lg transition-colors duration-300 hover:border-space-600 relative overflow-hidden group">
      
      <div className="absolute top-0 right-0 w-24 h-24 bg-neon-magenta/5 rounded-bl-full -z-10 group-hover:bg-neon-magenta/10 transition-colors" />

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded bg-space-700 px-2 py-1 text-xs font-medium text-slate-300">
            {market.type}
          </span>
          <span className="font-display font-bold text-neon-green">
            {market.odds}
          </span>
        </div>
        <h3 className="mb-4 text-lg font-medium leading-tight text-white">
          {market.title}
        </h3>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Coins className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="number"
              min="1"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              disabled={isResolving}
              className="block w-full rounded-lg border border-space-600 bg-space-900 py-2 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:border-neon-magenta focus:outline-none focus:ring-1 focus:ring-neon-magenta disabled:opacity-50"
              placeholder="Einsatz" />
            
          </div>
          <div className="text-right text-xs text-slate-400 w-16">
            Gewinn:
            <br />
            <span className="font-bold text-white">
              {isNaN(parseInt(stake)) ?
              '0' :
              Math.floor(parseInt(stake) * market.multiplier)}
            </span>
          </div>
        </div>

        {botIsDown &&
        <motion.div
          initial={{
            opacity: 0,
            height: 0
          }}
          animate={{
            opacity: 1,
            height: 'auto'
          }}
          className="flex items-center gap-1.5 text-xs font-medium text-red-400">
          
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>
              Bot ist down — diese Wette ist ein garantierter Verlust. Hau rein.
            </span>
          </motion.div>
        }

        <motion.button
          whileTap={{
            scale: isResolving ? 1 : 0.97
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25
          }}
          onClick={handleBet}
          disabled={isResolving}
          className="w-full rounded-lg bg-neon-magenta px-4 py-2.5 font-display text-sm font-bold text-white transition-all duration-300 hover:bg-fuchsia-500 hover:shadow-[0_0_15px_rgba(255,0,255,0.4)] disabled:cursor-not-allowed disabled:opacity-70">
          
          {isResolving ? 'RNG LÄUFT...' : 'WETTE PLATZIEREN'}
        </motion.button>
      </div>
    </motion.div>);

}