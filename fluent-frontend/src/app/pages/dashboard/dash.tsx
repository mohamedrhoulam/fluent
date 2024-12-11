"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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

const Dashboard = () => {
  const [chartData, setChartData] = useState<{ day: string; count: number }[]>([]);

  useEffect(() => {
    const getTasks = async () => {
      const tasks = await fetchTasks();
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

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
              return (
                dueDate >= today &&
                dueDate <= nextWeek &&
                dueDate.getDate() === date.getDate()
              );
            }).length,
          };
        });

      setChartData(tasksByDay);
    };

    getTasks();
  }, []);

  const chartConfig = {
    count: {
      label: "Tasks",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
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
              fill="#8884d8" // Change this to your desired fill color
              fillOpacity={0.4}
              stroke="#8884d8" // Change this to your desired stroke color
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this week <TrendingUp className="h-4 w-4" />
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
    </Card>
  );
};

export default Dashboard;
