import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { Task } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TaskForm from "@/components/TaskForm";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const handleStatusChange = async (newStatus: string) => {
    try {
      await apiRequest("PUT", `/api/tasks/${task.id}`, { status: newStatus });
      toast({
        title: "Task updated",
        description: `Task status updated to ${newStatus}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteTask = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await apiRequest("DELETE", `/api/tasks/${task.id}`);
        toast({
          title: "Task deleted",
          description: "Task has been deleted successfully",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete task",
          variant: "destructive",
        });
      }
    }
  };
  
  const priorityIcons = {
    high: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    medium: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    low: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  };
  
  return (
    <>
      <div className={`task-card bg-white rounded-lg shadow p-4 border-l-4 ${
        task.category === "personal" ? "border-primary" : "border-secondary"
      } hover:cursor-pointer`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant={task.category as any}>{task.category}</Badge>
              <Badge variant={task.status as any}>{task.status}</Badge>
            </div>
            <h4 className={`text-lg font-medium mt-2 ${
              task.status === "completed" ? "line-through text-gray-500" : "text-gray-900"
            }`}>{task.title}</h4>
            <p className={`text-sm mt-1 ${
              task.status === "completed" ? "line-through text-gray-500" : "text-gray-500"
            }`}>{task.description}</p>
            <div className="mt-3 flex items-center text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center px-2 py-1 rounded mr-2">
              {task.priority in priorityIcons && (
                <div className={`flex items-center px-2 py-1 rounded bg-${task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'yellow' : 'green'}-50 mr-2`}>
                  {priorityIcons[task.priority as keyof typeof priorityIcons]}
                  <span className={`ml-1 text-xs font-medium text-${task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'yellow' : 'green'}-700`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </div>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1 rounded-full hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                  Edit
                </DropdownMenuItem>
                {task.status !== "completed" && (
                  <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
                    Mark as Completed
                  </DropdownMenuItem>
                )}
                {task.status === "completed" && (
                  <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
                    Mark as Pending
                  </DropdownMenuItem>
                )}
                {task.status === "pending" && (
                  <DropdownMenuItem onClick={() => handleStatusChange("in-progress")}>
                    Mark as In Progress
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleDeleteTask} className="text-red-600">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {isEditModalOpen && (
        <TaskForm 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)}
          task={task}
        />
      )}
    </>
  );
}
