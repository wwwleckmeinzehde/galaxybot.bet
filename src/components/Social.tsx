import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Trophy } from 'lucide-react';
const USERNAMES = [
'xX_RugPullRandy_Xx',
'MortgageOnRed',
'BotBelieber69',
'SirCrashesALot',
'YOLO_Baggins',
'DiamondHandsDan',
'WendyDumpsterVIP',
'SatoshiNakamoto',
'ElonMuskBurner',
'GambleGalf',
'DasJoBauen',
'PingPongPaul',
'AllInAlexa',
'RektWaifu2000',
'OmaZocktMit',
'NotFinanzberater',
'DownBadDennis',
'KombiKevin',
'LiquidiertLukas',
'HopiumHans',
'CopiumChristoph',
'RugZugRalf',
'BotBetterBenni',
'ZuVielEspresso',
'0xKaffeesatz',
'GlxyMika'];

const ACTIONS = [
{
  text: 'setzt 500 GC auf „Neustart aus Boshaftigkeit"',
  type: 'bet'
},
{
  text: 'hat die Ersparnisse fürs Leben verzockt (10 GC)',
  type: 'loss'
},
{
  text: 'gewinnt 42.000 GC mit einer Kombiwette',
  type: 'win'
},
{
  text: 'bettelt im Chat um Gratis-Coins',
  type: 'neutral'
},
{
  text: 'setzt 1 GC auf „Latenz > 9000ms"',
  type: 'bet'
},
{
  text: 'setzt das Erbe der Oma auf „Bot bleibt wach"',
  type: 'bet'
},
{
  text: 'verliert ALLES, weil GalaxyBot mal wieder down ist',
  type: 'loss'
},
{
  text: 'gewinnt 1 GC und feiert wie ein Lottokönig',
  type: 'win'
},
{
  text: 'fragt den Support, wann das echte Geld kommt',
  type: 'neutral'
},
{
  text: 'setzt 9.999 GC auf „Bot wird selbstbewusst"',
  type: 'bet'
},
{
  text: 'knackt einen 250.000 GC Jackpot (rein zufällig)',
  type: 'win'
},
{
  text: 'hat schon wieder die Stütze verzockt',
  type: 'loss'
},
{
  text: 'erklärt im Chat, warum „diesmal alles anders ist"',
  type: 'neutral'
},
{
  text: 'setzt auf „pong" und verliert trotzdem',
  type: 'loss'
},
{
  text: 'baut eine 12er-Kombi und betet zum RNG-Gott',
  type: 'bet'
},
{
  text: 'casht 6.969 GC aus und tut so, als wäre es echt',
  type: 'win'
},
{
  text: 'sucht den „Auszahlen"-Button (gibt es nicht)',
  type: 'neutral'
},
{
  text: 'setzt All-In auf einen offline Bot. Mutig.',
  type: 'bet'
},
{
  text: 'fühlt sich von der RNG persönlich angegriffen',
  type: 'loss'
}];

interface FeedItem {
  id: number;
  username: string;
  action: (typeof ACTIONS)[0];
  time: string;
}
export function LiveFeed() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  useEffect(() => {
    // Initial population
    const initial = Array.from({
      length: 4
    }).map((_, i) => createRandomFeedItem(i));
    setFeed(initial);
    const interval = setInterval(
      () => {
        setFeed((prev) => {
          const newFeed = [createRandomFeedItem(Date.now()), ...prev];
          if (newFeed.length > 6) newFeed.pop();
          return newFeed;
        });
      },
      3500 + Math.random() * 4000
    );
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="rounded-xl border border-space-700 bg-space-800/50 p-5 backdrop-blur-sm h-[400px] overflow-hidden flex flex-col">
      <div className="mb-4 flex items-center gap-2 border-b border-space-700 pb-3">
        <Users className="h-5 w-5 text-blue-400" />
        <h3 className="font-display font-bold text-white">LIVE-ZOCKER</h3>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {feed.map((item) =>
            <motion.div
              key={item.id}
              initial={{
                opacity: 0,
                y: -20,
                scale: 0.95
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1
              }}
              exit={{
                opacity: 0,
                scale: 0.95
              }}
              transition={{
                duration: 0.3
              }}
              className="flex items-start gap-3 rounded-lg bg-space-900 p-3 text-sm">
              
                <div
                className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${item.action.type === 'win' ? 'bg-neon-green shadow-[0_0_5px_#39FF14]' : item.action.type === 'loss' ? 'bg-red-500' : item.action.type === 'bet' ? 'bg-neon-magenta' : 'bg-slate-500'}`} />
              
                <div>
                  <span className="font-bold text-slate-200">
                    {item.username}
                  </span>{' '}
                  <span className="text-slate-400">{item.action.text}</span>
                  <div className="mt-1 text-xs text-slate-600">{item.time}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>);

}
function createRandomFeedItem(id: number): FeedItem {
  const username = USERNAMES[Math.floor(Math.random() * USERNAMES.length)];
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  return {
    id,
    username,
    action,
    time: 'Gerade eben'
  };
}
export function Leaderboard() {
  const leaders = [
  {
    rank: 1,
    name: 'DeepFuckingValue',
    profit: '+42.069.000 GC',
    title: 'Galaxy-Hirn'
  },
  {
    rank: 2,
    name: 'BotBelieber69',
    profit: '+1.337.000 GC',
    title: 'Glückspilz'
  },
  {
    rank: 3,
    name: 'MortgageOnRed',
    profit: '-5.000.000 GC',
    title: 'Amtlich am Boden'
  },
  {
    rank: 4,
    name: 'xX_RugPullRandy_Xx',
    profit: '-9.999.999 GC',
    title: 'Liquidiert'
  }];

  return (
    <div className="rounded-xl border border-space-700 bg-space-800/50 p-5 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2 border-b border-space-700 pb-3">
        <Trophy className="h-5 w-5 text-neon-gold" />
        <h3 className="font-display font-bold text-white">HALLE DER SCHANDE</h3>
      </div>

      <div className="space-y-3">
        {leaders.map((leader) =>
        <div
          key={leader.rank}
          className="flex items-center justify-between rounded-lg bg-space-900 p-3">
          
            <div className="flex items-center gap-3">
              <div
              className={`flex h-6 w-6 items-center justify-center rounded-full font-display text-xs font-bold ${leader.rank === 1 ? 'bg-neon-gold text-black' : leader.rank === 2 ? 'bg-slate-300 text-black' : leader.rank === 3 ? 'bg-amber-700 text-white' : 'bg-space-700 text-slate-400'}`}>
              
                {leader.rank}
              </div>
              <div>
                <div className="font-bold text-sm text-white">
                  {leader.name}
                </div>
                <div className="text-xs text-slate-500">{leader.title}</div>
              </div>
            </div>
            <div
            className={`font-display text-sm font-bold ${leader.profit.startsWith('+') ? 'text-neon-green' : 'text-red-500'}`}>
            
              {leader.profit}
            </div>
          </div>
        )}
      </div>
    </div>);

}