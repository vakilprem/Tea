import React from 'react';
import TaskModal from './TaskModal';

export default function Header() {
  return (
    <header className="flex justify-between items-center bg-blue-500 shadow p-4 rounded mb-6">
      <h1 className="text-2xl font-bold">Task Management Board</h1>
      <TaskModal isEdit={false} defaultStatus="todo" />
    </header>
  );
}
