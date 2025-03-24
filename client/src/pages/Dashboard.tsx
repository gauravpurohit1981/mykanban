import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Task } from "@shared/schema";
import StatCard from "@/components/StatCard";
import TaskCard from "@/components/TaskCard";
import TaskCalendar from "@/components/TaskCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

interface DashboardProps {
  onNewTask: () => void;
}

export default function Dashboard({ onNewTask }: DashboardProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("dueDate");
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['/api/tasks'],
    staleTime: 10000,
  });
  
  // Calculate stats
  const totalTasks = tasks.length;
  const dueToday = tasks.filter((task: Task) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  }).length;
  
  const inProgressTasks = tasks.filter((task: Task) => task.status === "in-progress").length;
  const completedTasks = tasks.filter((task: Task) => task.status === "completed").length;
  
  // Filter tasks based on active tab
  const filteredTasks = tasks.filter((task: Task) => {
    if (activeTab === "all") return true;
    if (activeTab === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    }
    if (activeTab === "upcoming") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() > today.getTime();
    }
    if (activeTab === "completed") return task.status === "completed";
    return true;
  });
  
  // Filter by category
  const categoryFilteredTasks = filteredTasks.filter((task: Task) => {
    if (categoryFilter === "all") return true;
    return task.category === categoryFilter;
  });
  
  // Sort tasks
  const sortedTasks = [...categoryFilteredTasks].sort((a: Task, b: Task) => {
    if (sortOption === "dueDate") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (sortOption === "priority") {
      const priorityValues = { high: 3, medium: 2, low: 1 };
      return priorityValues[b.priority as keyof typeof priorityValues] - priorityValues[a.priority as keyof typeof priorityValues];
    }
    if (sortOption === "status") {
      const statusValues = { pending: 1, "in-progress": 2, completed: 3 };
      return statusValues[a.status as keyof typeof statusValues] - statusValues[b.status as keyof typeof statusValues];
    }
    return 0;
  });
  
  return (
    <div>
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <div className="mt-3 sm:mt-0 flex items-center space-x-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Tasks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="personal">Personal Tasks</SelectItem>
              <SelectItem value="college">College Tasks</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by Due Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Sort by Due Date</SelectItem>
              <SelectItem value="priority">Sort by Priority</SelectItem>
              <SelectItem value="status">Sort by Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          icon="clipboard"
          color="primary"
        />
        <StatCard
          title="Due Today"
          value={dueToday}
          icon="clock"
          color="warning"
        />
        <StatCard
          title="In Progress"
          value={inProgressTasks}
          icon="lightning"
          color="secondary"
        />
        <StatCard
          title="Completed"
          value={completedTasks}
          icon="check"
          color="success"
        />
      </div>

      {/* Task Tabs */}
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="mb-8 border-b border-gray-200 w-full bg-transparent">
          <TabsTrigger value="all" className="data-[state=active]:border-primary data-[state=active]:text-primary border-transparent text-gray-500 border-b-2 rounded-none">
            All Tasks
          </TabsTrigger>
          <TabsTrigger value="today" className="data-[state=active]:border-primary data-[state=active]:text-primary border-transparent text-gray-500 border-b-2 rounded-none">
            Today
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="data-[state=active]:border-primary data-[state=active]:text-primary border-transparent text-gray-500 border-b-2 rounded-none">
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:border-primary data-[state=active]:text-primary border-transparent text-gray-500 border-b-2 rounded-none">
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">All Tasks</h3>
            {isLoading ? (
              <div>Loading tasks...</div>
            ) : sortedTasks.length === 0 ? (
              <div className="p-4 bg-white rounded-lg shadow text-center">
                <p className="text-gray-500">No tasks found. Create a new task to get started.</p>
                <button
                  onClick={onNewTask}
                  className="mt-4 bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center mx-auto transition duration-150"
                >
                  Create Task
                </button>
              </div>
            ) : (
              sortedTasks.map((task: Task) => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="today">
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Tasks Due Today</h3>
            {isLoading ? (
              <div>Loading tasks...</div>
            ) : sortedTasks.length === 0 ? (
              <div className="p-4 bg-white rounded-lg shadow text-center">
                <p className="text-gray-500">No tasks due today.</p>
              </div>
            ) : (
              sortedTasks.map((task: Task) => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Upcoming Tasks</h3>
            {isLoading ? (
              <div>Loading tasks...</div>
            ) : sortedTasks.length === 0 ? (
              <div className="p-4 bg-white rounded-lg shadow text-center">
                <p className="text-gray-500">No upcoming tasks.</p>
              </div>
            ) : (
              sortedTasks.map((task: Task) => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Completed Tasks</h3>
            {isLoading ? (
              <div>Loading tasks...</div>
            ) : sortedTasks.length === 0 ? (
              <div className="p-4 bg-white rounded-lg shadow text-center">
                <p className="text-gray-500">No completed tasks.</p>
              </div>
            ) : (
              sortedTasks.map((task: Task) => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Calendar Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Calendar View</h3>
        <TaskCalendar tasks={tasks} />
      </div>
    </div>
  );
}
