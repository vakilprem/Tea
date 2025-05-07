import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTask } from '../store/tasksSlice';
import { useDraggable } from '@dnd-kit/core';
import { FiMoreHorizontal, FiClock, FiTrash2, FiEdit2 } from 'react-icons/fi';
import TaskModal from './TaskModal';

export default function TaskCard({ task }) {
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task.id,
    data: { status: task.status },
  });

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
    setShowDeleteConfirm(false);
  };

  const isOverdue = new Date(task.dueDate) < new Date();

  return (
    <>
      {/* Task Card */}
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className="bg-white rounded-lg p-3 mb-3 shadow-sm border border-gray-200
                 hover:shadow-md transition-all cursor-grab active:cursor-grabbing
                 group relative"
      >
        {/* Task Content */}
        <h3 className="font-medium text-gray-800 mb-1">{task.title}</h3>
        {task.description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
        )}
        
        {/* Due Date */}
        <div className={`flex items-center text-xs mt-2 ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
          <FiClock className="mr-1" />
          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
        
        {/* Card Footer */}
        <div className="flex justify-between items-center mt-3">
          {/* Tags/Labels (example) */}
          <div className="flex space-x-1">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">Feature</span>
          </div>
          
          {/* Options Button */}
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiMoreHorizontal />
          </button>
        </div>
        
        {/* Options Dropdown */}
        {showOptions && (
          <div className="absolute right-0 top-8 bg-white shadow-lg rounded-md z-10 border border-gray-200 w-40">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50"
            >
              <FiTrash2 className="mr-2" /> Delete
            </button>
            <TaskModal isEdit={true} existingTask={task}>
              <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <FiEdit2 className="mr-2" /> Edit
              </button>
            </TaskModal>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="font-semibold text-lg mb-2">Delete Task</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to delete "{task.title}"?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}