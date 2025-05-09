import React from "react";
import { useSelector } from "react-redux";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";

export default function Column({ status, title }) {
  const tasks = useSelector((state) =>
    state.tasks.filter((t) => t.status === status)
  );
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-50 rounded-lg shadow-sm w-80 p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">
          {title}
          <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </h2>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
