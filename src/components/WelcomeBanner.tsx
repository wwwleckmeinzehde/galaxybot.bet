import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ChefHat, AlertTriangle } from 'lucide-react';
export function WelcomeBanner() {
  const [open, setOpen] = useState(true);
  return (
    <AnimatePresence>
      {open &&
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        exit={{
          opacity: 0
        }}
        transition={{
          duration: 0.3
        }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        onClick={() => setOpen(false)}>
        
          <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
            y: 20
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: 10
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 26
          }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-neon-magenta/30 bg-space-800 p-8 text-center shadow-[0_0_40px_rgba(255,0,255,0.15)]">
          
            <button
            onClick={() => setOpen(false)}
            aria-label="Banner schließen"
            className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-space-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-neon-magenta">
            
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-space-900 p-3">
                <ChefHat className="h-8 w-8 text-neon-gold" />
              </div>
            </div>

            <h2
            id="welcome-title"
            className="mb-4 font-display text-xl font-bold leading-snug text-white sm:text-2xl">
            
              Sie wollten schon immer mal auf die Downtime von GalaxyBot wetten?
            </h2>

            <p className="mb-6 text-base text-slate-300">
              Dann haben wir jetzt neu und frisch aus der Kochküche für Sie:{' '}
              <span className="font-display font-bold text-neon-magenta">
                galaxybot.bet
              </span>
            </p>

            <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-left">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
              <p className="text-xs leading-relaxed text-slate-300">
                <strong className="text-red-400">Achtung!</strong> Sämtliche
                hier genannten Namen, Aktionen, Beträge und Unternehmen sind
                frei erfunden und rein satirisch. Wir stehen in keiner Weise mit
                Discord, GalaxyBot oder irgendwelchen anderen Unternehmen,
                Menschen, Marken, Bots oder sonstigen Entitäten in Verbindung.
                Jede Ähnlichkeit mit der Realität ist reiner Zufall (und
                ziemlich lustig).
              </p>
            </div>

            <button
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-2 rounded-lg bg-neon-magenta px-6 py-3 font-display text-sm font-bold text-white transition-all hover:bg-fuchsia-500 hover:shadow-[0_0_15px_rgba(255,0,255,0.4)] focus:outline-none focus:ring-2 focus:ring-neon-magenta focus:ring-offset-2 focus:ring-offset-space-800">
            
              <Sparkles className="h-4 w-4" />
              Los geht's, ab in den Ruin
            </button>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}