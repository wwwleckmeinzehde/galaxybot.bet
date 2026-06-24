import React, { useEffect } from 'react';
import { Toaster } from 'sonner';
import { toast } from 'sonner';
import { Home } from './pages/Home';
import { Agb, Datenschutz } from './pages/Legal';
import { useGameStore } from './store/useGameStore';

function routeFor(pathname: string) {
  if (pathname === '/agb') return <Agb />;
  if (pathname === '/datenschutz') return <Datenschutz />;
  return <Home />;
}

export function App() {
  const init = useGameStore((state) => state.init);
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  useEffect(() => {
    init().catch(() => {
      toast.error('Server nicht erreichbar. Läuft galaxybot.bet?', {
        description: 'Ohne Verbindung gibt es kein (Fake-)Geld zu verzocken.'
      });
    });
  }, [init]);
  return (
    <>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#151A23',
            border: '1px solid #1E2532',
            color: '#F8FAFC',
            fontFamily: 'Inter, sans-serif'
          },
          className: 'font-sans'
        }} />

      {routeFor(path)}
    </>);

}