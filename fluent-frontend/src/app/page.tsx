"use client";

import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate,
} from "react-router-dom";
import TaskList from "./pages/tasks/page";
import Dashboard from "./pages/dashboard/dash";

export default function Home() {
  return (
    <Router>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <header className="row-start-1 flex justify-center w-full max-w-xs">
          <div className="border border-gray-700 rounded-lg flex items-center justify-between w-full">
            <Link to="/dashboard" className="flex-1">
              <button className="btn w-full px-4 py-2 text-lg text-center">
                Dashboard
              </button>
            </Link>
            <div className="border-l border-gray-500 h-full"></div>
            <Link to="/tasks" className="flex-1">
              <button className="btn w-full px-4 py-2 text-lg text-center">
                Tasks
              </button>
            </Link>
          </div>
        </header>
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<TaskList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
