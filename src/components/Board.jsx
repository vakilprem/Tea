import React from "react";
import Column from "./Column";
// import { DndContext } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor } from "@dnd-kit/core";
import { useDispatch } from "react-redux";
import { moveTask } from "../store/tasksSlice";

const columns = [
  { id: "todo", title: "To Do" },
  { id: "inProgress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export default function Board() {
  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  });
  const dispatch = useDispatch();

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.data.current.status === over.id) return;
    dispatch(moveTask({ id: active.id, newStatus: over.id }));
  };

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={[sensor]}>
      <div className="flex gap-4 justify-center">
        {columns.map((col) => (
          <Column key={col.id} status={col.id} title={col.title} />
        ))}
      </div>
    </DndContext>
  );
}
