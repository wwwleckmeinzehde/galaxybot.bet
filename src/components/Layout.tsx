import React from 'react';
import { Coins, ShieldAlert, Rocket, Info } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
export function TopBar() {
  const balance = useGameStore((state) => state.balance);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-space-700 bg-space-900/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Rocket className="h-6 w-6 text-neon-magenta" />
          <span className="font-display text-xl font-bold tracking-wider text-white sm:text-2xl">
            GALAXYBOT<span className="text-neon-magenta">.BET</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="group relative hidden sm:flex items-center gap-1 text-xs text-slate-400 cursor-help">
            <ShieldAlert className="h-4 w-4" />
            <span>Beweisbar Fake</span>
            <div className="absolute -bottom-10 right-0 hidden w-48 rounded bg-space-700 p-2 text-center text-xs text-white shadow-xl group-hover:block">
              100 % Fake-Quoten. Kein echtes Geld. Reines Zocken.
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-neon-gold/30 bg-space-800 px-3 py-1.5 shadow-[0_0_10px_rgba(255,215,0,0.1)]">
            <Coins className="h-4 w-4 text-neon-gold" />
            <span className="font-display font-bold text-neon-gold">
              {Math.floor(balance).toLocaleString()} GC
            </span>
          </div>
        </div>
      </div>
    </header>);

}
export function Footer() {
  return (
    <footer className="mt-24 border-t border-space-700 bg-space-800 py-12 text-center text-sm text-slate-400">
      <div className="mx-auto max-w-3xl px-4 space-y-6">
        <div className="flex justify-center">
          <Rocket className="h-8 w-8 text-slate-600 opacity-50 grayscale" />
        </div>
        <p className="font-display text-lg font-bold text-slate-300">
          GALAXYBOT.BET
        </p>
        <div className="space-y-2 text-xs sm:text-sm">
          <p>
            ⚠️ <strong>HAFTUNGSAUSSCHLUSS:</strong> Galaxy Coins (GC) haben
            absolut keinen realen Wert – weder monetär, noch emotional, noch
            spirituell.
          </p>
          <p>
            Wir sammeln NULL Daten, weil es uns ehrlich gesagt egal ist, wer du
            bist oder wie viel Fake-Geld du verlierst. Keine Cookies, kein
            Tracking und keine Hoffnung, deine Würde zurückzubekommen.
          </p>
          <p>
            Ab 18, streng durchgesetzt per Ehrenwort. Hier gibt es nichts zu
            gewinnen. Nicht verbunden mit GalaxyBot, der Milchstraße, Discord
            oder irgendeiner funktionierenden Software.
          </p>
          <p className="text-neon-magenta/70 font-medium pt-4">
            Spiel verantwortungsvoll. (War nur Spaß, kannst du gar nicht, ist ja
            alles fake.)
          </p>

          <p className="border-t border-space-700 pt-4 text-xs text-slate-500">
            🇩🇪 <strong>Hinweis (Satire):</strong> Sämtliche Inhalte dieser Seite
            sind rein ironisch und satirisch gemeint. Es besteht keinerlei
            Verbindung zu realen Personen, Unternehmen, Marken oder
            funktionierenden Bots. „GalaxyBot", „galaxybot.bet" sowie alle
            Wetten, Quoten, Namen und Beträge sind frei erfunden. Hier gibt es
            nichts zu gewinnen und nichts zu verlieren – außer Lebenszeit.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4 text-xs text-slate-500">
            <a
              href="https://wwwleckmeinzeh.de/impressum"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 transition-colors hover:text-neon-magenta hover:underline">
              
              Impressum
            </a>
            <span className="text-slate-700">·</span>
            <a
              href="https://wwwleckmeinzeh.de/impressum"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 transition-colors hover:text-neon-magenta hover:underline">
              
              Datenschutz
            </a>
          </div>
        </div>
      </div>
    </footer>);

}