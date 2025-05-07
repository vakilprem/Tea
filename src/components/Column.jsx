import React from 'react';
import { useSelector } from 'react-redux';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import { useDroppable } from '@dnd-kit/core';

export default function Column({ status, title }) {
  const tasks = useSelector((state) => state.tasks.filter((t) => t.status === status));
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} className="bg-white rounded shadow w-80 p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <TaskModal isEdit={false} defaultStatus={status} />
      </div>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}