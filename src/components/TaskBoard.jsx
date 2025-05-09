import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTask, deleteTask, moveTask, updateTask } from "../store/tasksSlice";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { FiMoreHorizontal, FiClock, FiTrash2, FiEdit2 } from "react-icons/fi";
import { v4 as uuidv4 } from 'uuid';

const TaskBoard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto p-4">
        <Board />
      </main>
    </div>
  );
};

const Header = () => {
  return (
    <header className="flex justify-between items-center bg-blue-500  shadow p-4 rounded mb-6">
      <h1 className="text-2xl font-bold">Task Management Board</h1>
      <TaskModal isEdit={false} defaultStatus="todo" />
      <TaskModal isEdit={false} defaultStatus="todo">
        <button className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors flex items-center">
         
          Add Task
        </button>
      </TaskModal>
    </header>
  );
};

const Board = () => {
  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  });
  const dispatch = useDispatch();

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.data.current.status === over.id) return;
    dispatch(moveTask({ id: active.id, newStatus: over.id }));
  };

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "inProgress", title: "In Progress" },
    { id: "done", title: "Done" },
  ];

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={[sensor]}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <Column key={col.id} status={col.id} title={col.title} />
        ))}
      </div>
    </DndContext>
  );
};

const Column = ({ status, title }) => {
  const tasks = useSelector((state) =>
    state.tasks.filter((t) => t.status === status)
  );
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-50 rounded-lg shadow-sm w-80 p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200 flex-shrink-0"
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
};

const TaskCard = ({ task }) => {
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
      <h3 className="font-medium mb-1">{task.title}</h3>
      {task.description && (
        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
      )}

      <div
        className={`flex items-center text-xs ${
          isOverdue ? "text-red-500" : "text-gray-500"
        }`}
      >
        <FiClock className="mr-1" />
        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
      </div>

      <div className="flex justify-end mt-2 space-x-2">
        <TaskModal isEdit={true} existingTask={task}>
          <button className="text-blue-500 hover:text-blue-200">
            Edit
          </button>
        </TaskModal>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const TaskModal = ({ children, isEdit = false, existingTask = {}, defaultStatus = "todo" }) => {
    const [isOpen, setIsOpen] = useState(false);
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
  
      setIsOpen(false);
      // Reset form if not editing
      if (!isEdit) {
        setTitle('');
        setDescription('');
        setDueDate('');
      }
    };
  
    return (
      <>
        <div onClick={() => setIsOpen(true)}>
          {children}
        </div>
        
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-semibold mb-4">
                {isEdit ? 'Edit Task' : 'Add New Task'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows="3"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                  >
                    {isEdit ? 'Update Task' : 'Create Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  };

export default TaskBoard;
