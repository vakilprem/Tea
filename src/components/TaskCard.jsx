  import React, { useState } from 'react';
  import { useDispatch } from 'react-redux';
  import { deleteTask } from '../store/tasksSlice';
  import { useDraggable } from '@dnd-kit/core';
  import { FiMoreHorizontal, FiClock, FiTrash2, FiEdit2 } from 'react-icons/fi';
  import TaskModal from './TaskModal';

  export default function TaskCard({ task }) {
    const dispatch = useDispatch();
    const [showOptions, setShowOptions] = useState(false);
    
    const { attributes, listeners, setNodeRef } = useDraggable({
      id: task.id,
      data: { status: task.status },
    });

    const handleDelete = () => {
      if (window.confirm(`Delete "${task.title}"?`)) {
        dispatch(deleteTask(task.id));
      }
    };

    const isOverdue = new Date(task.dueDate) < new Date();

    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className="bg-white rounded p-3 mb-2 shadow border border-gray-200
                hover:shadow-md cursor-grab active:cursor-grabbing"
      >
        {/* Task Title and Description */}
        <h3 className="font-medium mb-1">{task.title}</h3>
        {task.description && (
          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
        )}
        
        {/* Due Date */}
        <div className={`flex items-center text-xs ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
          <FiClock className="mr-1" />
          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
        
        {/* Simple Action Buttons (always visible) */}
        <div className="flex justify-end mt-2 space-x-2">
          <TaskModal isEdit={true} existingTask={task}>
            <button className="text-gray-500 hover:text-blue-500">
              <FiEdit2 size={16} />
            </button>
          </TaskModal>
          <button 
            onClick={handleDelete}
            className=" text-red-500 hover:text-red-300"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }