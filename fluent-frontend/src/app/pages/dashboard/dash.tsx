"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  RadialBar,
  RadialBarChart,
  PolarGrid,
  PolarRadiusAxis,
  Label,
  Pie,
  PieChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";
import { fetchTasks } from "../../services/taskService";
import { Badge } from "../../components/ui/badge";
import { Pencil } from "lucide-react";
import { format, isToday } from "date-fns";

type Task = {
  _id: string;
  title: string;
  dueDate?: Date;
  completed: boolean;
};

const Dashboard = () => {
  const [chartData, setChartData] = useState<
    { day: string; count: number; fill: string }[]
  >([]);
  const [radialChartData, setRadialChartData] = useState<
    { name: string; value: number; fill: string }[]
  >([]);
  const [todayTasksCount, setTodayTasksCount] = useState(0);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);

  useEffect(() => {
    const getTasks = async () => {
      const tasks = await fetchTasks();
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      const colors = [
        "#4f81bd",
        "#c0504d",
        "#9bbb59",
        "#8064a2",
        "#4bacc6",
        "#f79646",
        "#7f6084",
      ];

      const tasksByDay = Array(7)
        .fill(0)
        .map((_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          return {
            day: date.toLocaleDateString("en-US", { weekday: "short" }),
            count: tasks.filter((task) => {
              if (!task.dueDate) return false;
              const dueDate = new Date(task.dueDate);
              return dueDate.toDateString() === date.toDateString();
            }).length,
            fill: colors[i % colors.length],
          };
        });

      setChartData(tasksByDay);

      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((task) => task.completed).length;
      const incompleteTasks = totalTasks - completedTasks;

      setRadialChartData([
        {
          name: "Completed",
          value: completedTasks,
          fill: "#8884d8",
        },
        {
          name: "Incomplete",
          value: incompleteTasks,
          fill: "#100c0c",
        },
      ]);

      const todayTasks = tasksByDay.find(
        (dayData) =>
          dayData.day ===
          today.toLocaleDateString("en-US", { weekday: "short" })
      );
      setTodayTasksCount(todayTasks ? todayTasks.count : 0);

      const filteredTodayTasks = tasks.filter((task) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return isToday(dueDate);
      });
      setTodayTasks(filteredTodayTasks);
    };

    getTasks();
  }, []);

  const chartConfig = {
    count: {
      label: "Tasks",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const pieChartConfig = {
    tasks: {
      label: "Tasks",
    },
  } satisfies ChartConfig;

  return (
    <div className="dashboard flex-row">
      <div className="greeting font-geist font-bold text-3xl pb-4 pl-2">
        {" "}
        Hello, you have {todayTasksCount} things to do for today{" "}
      </div>
      <Card className=" charts flex justify-center">
        <div className="flex">
          <div className="flex-1 rounded-lg p-4">
            <CardHeader>
              <CardTitle>Tasks for the Next 7 Days</CardTitle>
              <CardDescription>
                Showing the number of tasks due each day for the next week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" hideLabel />}
                  />
                  <Area
                    dataKey="count"
                    type="linear"
                    fill="#8884d8"
                    fillOpacity={0.4}
                    stroke="#8884d8"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-start gap-2 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this week{" "}
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    {new Date().toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </CardFooter>
          </div>
          <div className="flex-1  rounded-lg p-4">
            <CardHeader>
              <CardTitle>All Time Task Completion</CardTitle>
              <CardDescription>
                Showing the proportion of completed and incomplete tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <RadialBarChart
                  data={radialChartData}
                  startAngle={90}
                  endAngle={-270}
                  innerRadius={80}
                  outerRadius={110}
                >
                  <PolarGrid
                    gridType="circle"
                    radialLines={false}
                    stroke="none"
                    className="first:fill-muted last:fill-background"
                    polarRadius={[86, 74]}
                  />
                  <RadialBar
                    dataKey="value"
                    background
                    cornerRadius={10}
                    fill="pink"
                  />
                  <PolarRadiusAxis
                    tick={false}
                    tickLine={false}
                    axisLine={false}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-4xl font-bold"
                              >
                                {radialChartData.reduce(
                                  (acc, data) => acc + data.value,
                                  0
                                )}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                Tasks
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                </RadialBarChart>
              </ChartContainer>
            </CardContent>
          </div>
          <div className="flex-1  rounded-lg p-4">
            <CardHeader>
              <CardTitle>Tasks Distribution</CardTitle>
              <CardDescription>
                Showing the distribution of tasks for the next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={pieChartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="count"
                    nameKey="day"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {chartData.reduce(
                                  (acc, data) => acc + data.count,
                                  0
                                )}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                Tasks
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </div>
        </div>
      </Card>
      <div className=" todays-tasks mt-8 flex justify-center">
        <div className="w-1/2 mx-auto pt-4 transition-transform duration-300">
          <div className="max-h-[500px] overflow-y-auto rounded-lg border shadow-inner">
            <table className="w-full table-fixed divide-y divide-gray-40">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th
                    scope="col"
                    className="px-8 py-4 text-left text-lg font-medium tracking-wider text-gray-500 bg-[#09090b]"
                  >
                    <div className="flex justify-between items-center ">
                      <span>Today's Tasks</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-40">
                {todayTasks.map((task) => (
                  <tr key={task._id} className="relative group">
                    <td
                      className="px-8 py-9 whitespace-nowrap overflow-hidden overflow-ellipsis text-sm font-medium flex justify-between items-center cursor-pointer"
                      style={{ maxWidth: "100%" }}
                    >
                      <span
                        className={`text-lg ${
                          task.completed ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {task.title}
                      </span>
                      <div className="flex space-x-2">
                        <Badge variant="secondary" className="cursor-pointer">
                          {task.completed ? "Completed" : "Undue"}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="py-2 cursor-pointer"
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
                      </div>
                      <Pencil className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-50 group-hover:opacity-100 cursor-pointer h-3 w-3" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
