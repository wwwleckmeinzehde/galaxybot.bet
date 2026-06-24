import React, { useEffect, useState, useRef } from 'react';
import { Activity, ServerCrash, Zap, WifiOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
const DOWN_LABELS = [
'STATUS: OFFLINE',
'STATUS: ABGESTÜRZT',
'STATUS: AM BODEN',
'STATUS: MACHT EIN NICKERCHEN',
'STATUS: NICHT GEFUNDEN (404)'];

export function UptimeTicker() {
  const [seconds, setSeconds] = useState(0);
  const [latency, setLatency] = useState(0);
  const setBotStatus = useGameStore((state) => state.setBotStatus);
  const botStatus = useGameStore((state) => state.botStatus);
  const [downLabel, setDownLabel] = useState(DOWN_LABELS[0]);
  const isOnline = botStatus === 'ONLINE';
  const isOnlineRef = useRef(isOnline);
  isOnlineRef.current = isOnline;
  // Bot is DOWN most of the time. It flickers online only occasionally and briefly.
  useEffect(() => {
    setBotStatus('DOWN');
    const interval = setInterval(() => {
      // While ONLINE: ~30% chance per tick it crashes back down (short uptime windows)
      // While DOWN: ~8% chance per tick it briefly comes online (rare uptime)
      if (isOnlineRef.current) {
        if (Math.random() < 0.3) {
          setBotStatus('DOWN');
          setDownLabel(
            DOWN_LABELS[Math.floor(Math.random() * DOWN_LABELS.length)]
          );
          setSeconds(0);
        } else {
          setSeconds((prev) => prev + 1);
          setLatency(Math.floor(20 + Math.random() * 80));
        }
      } else {
        if (Math.random() < 0.08) {
          setBotStatus('ONLINE');
          setSeconds(0);
          setLatency(Math.floor(20 + Math.random() * 80));
        } else {
          // Count DOWNTIME up so the "uptime" is mockingly a downtime
          setSeconds((prev) => prev + 1);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [setBotStatus]);
  const formatTime = (totalSeconds: number) => {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor(totalSeconds % 86400 / 3600);
    const minutes = Math.floor(totalSeconds % 3600 / 60);
    const secs = totalSeconds % 60;
    return `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };
  return (
    <section className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Background glow shifts color with status */}
      <motion.div
        animate={{
          backgroundColor: isOnline ?
          'rgba(57,255,20,0.06)' :
          'rgba(239,68,68,0.06)'
        }}
        transition={{
          duration: 0.8,
          ease: 'easeInOut'
        }}
        className="absolute left-1/2 top-1/2 -z-10 h-64 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]" />
      

      <div className="flex flex-col items-center text-center">
        <motion.div
          layout
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-space-700 bg-space-800/50 px-4 py-2 backdrop-blur-sm">
          
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              backgroundColor: isOnline ? '#39FF14' : '#ef4444',
              boxShadow: isOnline ? '0 0 8px #39FF14' : '0 0 8px #ef4444'
            }}
            transition={{
              scale: {
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut'
              },
              backgroundColor: {
                duration: 0.4
              }
            }}
            className="h-3 w-3 rounded-full" />
          
          <AnimatePresence mode="wait">
            <motion.span
              key={isOnline ? 'online' : downLabel}
              initial={{
                opacity: 0,
                y: 6
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -6
              }}
              transition={{
                duration: 0.25
              }}
              className="font-display text-sm font-bold tracking-widest text-slate-300">
              
              {isOnline ? 'SYSTEMSTATUS: ONLINE' : downLabel}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <h1 className="mb-4 font-display text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
          GALAXYBOT <br className="hidden sm:block" />
          <motion.span
            animate={{
              color: isOnline ? '#39FF14' : '#ef4444'
            }}
            transition={{
              duration: 0.4
            }}
            className={isOnline ? 'neon-text-green' : ''}>
            
            {isOnline ? 'LÄUFT' : 'DOWNTIME'}
          </motion.span>
        </h1>

        <AnimatePresence mode="wait">
          <motion.div
            key={isOnline ? 'up' : 'down'}
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -10
            }}
            transition={{
              duration: 0.3
            }}
            className="mb-2 font-display text-3xl font-bold text-slate-200 sm:text-5xl tabular-nums tracking-wider">
            
            {formatTime(seconds)}
          </motion.div>
        </AnimatePresence>
        <p className="mb-12 text-sm text-slate-500">
          {'Zeit, seit GalaxyBot zuletzt buchst\xE4blich irgendwas getan hat.'}
        </p>

        <div className="grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
          {[
          {
            icon: <Zap className="h-5 w-5 text-neon-magenta" />,
            label: 'Latenz',
            value: isOnline ? `${latency}ms` : 'TIMEOUT'
          },
          {
            icon: <Activity className="h-5 w-5 text-blue-400" />,
            label: 'Memes serviert',
            value: '8.492.103'
          },
          {
            icon: <ServerCrash className="h-5 w-5 text-red-400" />,
            label: 'Abstürze überlebt',
            value: '404'
          },
          {
            icon: isOnline ?
            <Wifi className="h-5 w-5 text-neon-green" /> :

            <WifiOff className="h-5 w-5 text-red-400" />,

            label: 'Verfügbarkeit',
            value: '12,4 %'
          }].
          map((metric, i) =>
          <motion.div
            key={metric.label}
            initial={{
              opacity: 0,
              y: 16
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.4,
              delay: i * 0.08,
              ease: 'easeOut'
            }}>
            
              <MetricCard {...metric} />
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}
function MetricCard({
  icon,
  label,
  value




}: {icon: React.ReactNode;label: string;value: string | number;}) {
  return (
    <div className="flex h-full flex-col items-center rounded-xl border border-space-700 bg-space-800/50 p-4 backdrop-blur-sm">
      <div className="mb-2 rounded-full bg-space-700 p-2">{icon}</div>
      <div className="font-display text-lg font-bold text-white tabular-nums">
        {value}
      </div>
      <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">
        {label}
      </div>
    </div>);

}