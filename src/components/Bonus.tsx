import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useGameStore } from '../store/useGameStore';
export function DailyBonus() {
  const [isSpinning, setIsSpinning] = useState(false);
  const claimBonus = useGameStore((state) => state.claimBonus);
  const bonusReadyAt = useGameStore((state) => state.bonusReadyAt);
  // Cooldown is enforced server-side; this is just to disable the button.
  const canClaim = Date.now() >= bonusReadyAt;
  const handleClaim = async () => {
    if (!canClaim) {
      toast.error('Bisschen gierig, oder?', {
        description: 'Warte eine Minute, bevor du um mehr Fake-Coins bettelst.'
      });
      return;
    }
    setIsSpinning(true);
    await new Promise((r) => setTimeout(r, 1800));
    try {
      const { reward } = await claimBonus();
      toast.success(`${reward} GC abgestaubt!`, {
        description: 'Verzock sie nicht alle in einer einzigen miesen Wette.'
      });
    } catch (err: any) {
      if (err?.data?.error === 'cooldown') {
        toast.error('Bisschen gierig, oder?', {
          description: 'Warte eine Minute, bevor du um mehr Fake-Coins bettelst.'
        });
      } else {
        toast.error('Stütze konnte nicht abgeholt werden. Typisch Amt.');
      }
    } finally {
      setIsSpinning(false);
    }
  };
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl border border-neon-gold/30 bg-gradient-to-br from-space-800 to-space-900 p-8 text-center shadow-[0_0_30px_rgba(255,215,0,0.05)]">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-neon-gold/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-neon-magenta/10 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-4 rounded-full bg-space-800 p-4 shadow-inner">
            <Gift className="h-8 w-8 text-neon-gold" />
          </div>

          <h2 className="mb-2 font-display text-2xl font-bold text-white">
            STÜTZE ABHOLEN
          </h2>
          <p className="mb-6 max-w-md text-sm text-slate-400">
            Am Boden? Hol dir deine zufällige Galaxy-Coins-Verstärkung.
            Verfügbar, wann immer uns danach ist (alle 60 Sekunden).
          </p>

          <motion.button
            whileHover={{
              scale: canClaim && !isSpinning ? 1.05 : 1
            }}
            whileTap={{
              scale: canClaim && !isSpinning ? 0.95 : 1
            }}
            onClick={handleClaim}
            disabled={!canClaim || isSpinning}
            className={`relative overflow-hidden rounded-full px-8 py-4 font-display font-bold tracking-wider text-space-900 transition-all ${canClaim && !isSpinning ? 'bg-neon-gold hover:shadow-[0_0_20px_rgba(255,215,0,0.5)]' : 'bg-space-700 text-slate-500 cursor-not-allowed'}`}>
            
            {isSpinning ?
            <span className="flex items-center gap-2">
                <motion.div
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear'
                }}>
                
                  <Gift className="h-5 w-5" />
                </motion.div>
                DREHT...
              </span> :
            canClaim ?
            'GRATIS-GC ABHOLEN' :

            'ABKLINGZEIT'
            }
          </motion.button>
        </div>
      </div>
    </section>);

}