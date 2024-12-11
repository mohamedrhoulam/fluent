"use client";

import React, { useEffect, useState } from "react";
import { format, isToday, isTomorrow, isThisWeek } from "date-fns";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { fetchTasks, updateTask } from "../../services/taskService";
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

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const handleToggleCompleted = async (task: Task) => {
    const updatedTask = await updateTask(task._id, {
      completed: !task.completed,
    });
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t._id === task._id ? updatedTask : t))
    );
  };

  return (
    <div className="flex">
      <div
        className={`w-1/2 mx-auto pt-4 transition-transform duration-300 ${
          isSidebarOpen ? "transform translate-x-[-250px]" : ""
        }`}
      >
        <div className="max-h-[500px] overflow-y-auto rounded-lg border shadow-inner">
          <table className="w-full table-fixed divide-y divide-gray-40">
            <thead className="sticky top-0 z-10">
              <tr>
                <th
                  scope="col"
                  className="px-8 py-4 text-left text-lg font-medium tracking-wider text-gray-500 bg-[#09090b]"
                >
                  <div className="flex justify-between items-center ">
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
                    className="px-8 py-9 whitespace-nowrap overflow-hidden overflow-ellipsis text-sm font-medium flex justify-between items-center"
                    style={{ maxWidth: "100%" }}
                  >
                    <span
                      className={
                        task.completed ? "line-through text-gray-500" : ""
                      }
                    >
                      {task.title}
                    </span>
                    <div className="flex space-x-2">
                      <Badge
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleToggleCompleted(task)}
                      >
                        {task.completed ? "Completed" : "Undue"}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="py-2 cursor-pointer"
                        onClick={() => handleToggleCompleted(task)}
                      >
                        {task.dueDate
                          ? format(new Date(task.dueDate), "MMM dd, yy")
                          : "No due date"}
                      </Badge>
                      {task.dueDate && isToday(new Date(task.dueDate)) && (
                        <Badge
                          variant="secondary"
                          className="bg-red-200 text-red-800 cursor-pointer"
                        >
                          Due Today
                        </Badge>
                      )}
                      {task.dueDate && isTomorrow(new Date(task.dueDate)) && (
                        <Badge
                          variant="secondary"
                          className="bg-purple-200 text-purple-800"
                        >
                          Due Tomorrow
                        </Badge>
                      )}
                      {task.dueDate &&
                        isThisWeek(new Date(task.dueDate)) &&
                        !isToday(new Date(task.dueDate)) &&
                        !isTomorrow(new Date(task.dueDate)) && (
                          <Badge variant="secondary" className="border ">
                            Due This Week
                          </Badge>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isSidebarOpen && (
        <TaskSidebar
          onClose={() => setIsSidebarOpen(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
};

export default TaskList;
