import React from 'react';
import Board from './components/Board';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Task Management Board</h1>
      <Board />
    </div>
  );
}