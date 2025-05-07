// src/components/TaskModal.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask, updateTask } from '../store/tasksSlice';
import { v4 as uuidv4 } from 'uuid';

export default function TaskModal({ isEdit, existingTask = {}, defaultStatus }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(existingTask.title || '');
  const [description, setDescription] = useState(existingTask.description || '');
  const [dueDate, setDueDate] = useState(existingTask.dueDate || '');

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const task = {
      id: isEdit ? existingTask.id : uuidv4(),
      title,
      description,
      dueDate,
      status: isEdit ? existingTask.status : defaultStatus,
    };

    if (isEdit) {
      dispatch(updateTask(task));
    } else {
      dispatch(addTask(task));
    }

    setOpen(false);
    setTitle('');
    setDescription('');
    setDueDate('');
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={isEdit ? 'text-blue-500 text-sm' : 'bg-blue-500 text-white px-3 py-1 rounded'}
      >
        {isEdit ? 'Edit' : 'Add'}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">{isEdit ? 'Edit Task' : 'New Task'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} className="text-gray-600">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">
                  {isEdit ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
