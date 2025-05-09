import React from "react";
import Board from "./components/Board";
import Header from "./components/Header";
import TaskBoard from "./components/TaskBoard";

export default function App() {
  return (
    <div className="min-h-screen bg-blue-100 p-4">
      {/* <Header />
      <Board /> */}
      <TaskBoard />
    </div>
  );
}
