import React from 'react';
import Board from './components/Board';
import Header from './components/Header';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Header />
      <Board />
    </div>
  );
}
