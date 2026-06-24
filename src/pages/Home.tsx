import React from 'react';
import { TopBar, Footer } from '../components/Layout';
import { UptimeTicker } from '../components/Hero';
import { BettingGrid } from '../components/Betting';
import { LiveFeed, Leaderboard } from '../components/Social';
import { DailyBonus } from '../components/Bonus';
import { WelcomeBanner } from '../components/WelcomeBanner';
export function Home() {
  return (
    <div className="min-h-screen bg-space-900 text-slate-200 selection:bg-neon-magenta/30">
      <WelcomeBanner />
      <TopBar />

      <main>
        <UptimeTicker />

        <BettingGrid />

        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <LiveFeed />
            <Leaderboard />
          </div>
        </section>

        <DailyBonus />
      </main>

      <Footer />
    </div>);

}