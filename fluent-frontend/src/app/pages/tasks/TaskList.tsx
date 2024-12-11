"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button"; // Adjust the import path as needed
import { fetchTasks } from "../../services/taskService";
import { Task } from "../../types/Task";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

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
    <div className="w-1/2 mx-auto pt-4">
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
                  <Button variant="default" size="sm">
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
  );
};

export default TaskList;
