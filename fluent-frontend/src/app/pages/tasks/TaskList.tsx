"use client"

import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button"; 
import { fetchTasks } from "../../services/taskService";
import { Task } from "../../types/Task";
import TaskSidebar from "./TaskSidebar";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTasks();
      const sortedTasks = data.sort((a, b) =>
        a.dueDate && b.dueDate
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          : 0
      );
      setTasks(sortedTasks);
    };

    fetchData();
  }, []);

  return (
    <div className="flex">
      <div
        className={`w-1/2 mx-auto pt-4 transition-transform duration-300 ${
          isSidebarOpen ? "transform translate-x-[-250px]" : ""
        }`}
      >
        <div className="max-h-[500px] overflow-y-auto rounded-lg border shadow-inner">
          <table className="w-full table-fixed divide-y divide-gray-40">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="px-8 py-4 text-left text-lg font-medium tracking-wider text-gray-500"
                >
                  <div className="flex justify-between items-center">
                    <span>Tasks</span>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setIsSidebarOpen(true)}
                    >
                      Add Task
                    </Button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-40">
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td
                    className="px-8 py-9 whitespace-nowrap overflow-hidden overflow-ellipsis text-sm font-medium"
                    style={{ maxWidth: "100%" }}
                  >
                    {task.title}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isSidebarOpen && <TaskSidebar onClose={() => setIsSidebarOpen(false)} />}
    </div>
  );
};

export default TaskList;
