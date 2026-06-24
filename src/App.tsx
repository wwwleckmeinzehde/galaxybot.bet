import React from 'react';
import { Toaster } from 'sonner';
import { Home } from './pages/Home';
export function App() {
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
      
      <Home />
    </>);

}