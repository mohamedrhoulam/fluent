"use client";

import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Task } from "../../types/Task";

interface TaskSidebarProps {
  onClose: () => void;
}

const TaskSidebar: React.FC<TaskSidebarProps> = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [location, setLocation] = useState("");
  const [participants, setParticipants] = useState("");

  const handleSubmit = () => {
    const newTask: Omit<Task, "_id" | "createdAt" | "updatedAt"> = {
      title,
      description,
      completed,
      dueDate,
      location,
      participants: participants.split(",").map((p) => p.trim()),
      subtasks: [],
    };

    console.log(newTask);
    onClose();
  };

  function cn(...classes: (string | boolean | undefined)[]): string {
    return classes.filter(Boolean).join(" ");
  }
  return (
    <div className="fixed top-0 right-0 h-full w-1/3 shadow-lg transition-transform duration-300 transform translate-x-0 border ">
      <div className="p-4">
        <Button onClick={onClose} variant="default" size="sm">
          Close
        </Button>
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-white-700">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white-700">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="block text-sm font-medium text-white-700">
              Completed
            </label>
            <Switch
              checked={completed}
              onCheckedChange={(checked: boolean) => setCompleted(checked)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white-700">
              Due Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-40 justify-start text-left font-normal text-white",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="block text-sm font-medium text-white-700">
              Location
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white-700">
              Participants
            </label>
            <Input
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="Separate participants with commas"
            />
          </div>
          <Button type="submit" variant="default" size="sm">
            Save Task
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TaskSidebar;
