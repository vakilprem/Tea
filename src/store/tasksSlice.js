import { createSlice } from '@reduxjs/toolkit';

const loadFromLocalStorage = () => {
  const data = localStorage.getItem('tasks');
  return data ? JSON.parse(data) : [];
};

const saveToLocalStorage = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: loadFromLocalStorage(),
  reducers: {
    addTask: (state, action) => {
      state.push(action.payload);
      saveToLocalStorage(state);
    },
    updateTask: (state, action) => {
      const index = state.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
      saveToLocalStorage(state);
    },
    deleteTask: (state, action) => {
      const newState = state.filter((t) => t.id !== action.payload);
      saveToLocalStorage(newState);
      return newState;
    },
    moveTask: (state, action) => {
      const task = state.find((t) => t.id === action.payload.id);
      if (task) task.status = action.payload.newStatus;
      saveToLocalStorage(state);
    },
  },
});

export const { addTask, updateTask, deleteTask, moveTask } = tasksSlice.actions;
export default tasksSlice.reducer;
