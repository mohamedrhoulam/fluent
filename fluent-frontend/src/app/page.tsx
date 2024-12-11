"use client";

import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import TaskList from "./pages/tasks/page";
import Dashboard from "./pages/dashboard/dash";

export default function Home() {
  return (
    <Router>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <header className="row-start-1 flex gap-4">
          <div className="border border-gray-500 rounded-lg p-2 flex items-center justify-between w-full max-w-xs">
            <Link to="/dashboard" className="flex-1">
              <button className="btn w-full px-4 py-2 text-lg">
                Dashboard
              </button>
            </Link>
            <div className="border-l border-gray-500 h-full mx-4"></div>
            <Link to="/tasks" className="flex-1">
              <button className="btn w-full px-4 py-2 text-lg">Tasks</button>
            </Link>
          </div>
        </header>
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<TaskList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
