import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, addMonths, subMonths } from "date-fns";
import { Task } from "@shared/schema";
import TaskCalendar from "@/components/TaskCalendar";
import TaskCard from "@/components/TaskCard";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['/api/tasks'],
    staleTime: 10000,
  });
  
  // Filter tasks for selected date
  const selectedDateTasks = selectedDate 
    ? tasks.filter((task: Task) => {
        const taskDate = new Date(task.dueDate);
        return (
          taskDate.getDate() === selectedDate.getDate() &&
          taskDate.getMonth() === selectedDate.getMonth() &&
          taskDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : [];
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Calendar</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-lg">{format(currentMonth, 'MMMM yyyy')}</h3>
          <div className="flex space-x-2">
            <button 
              onClick={prevMonth}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Previous month"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextMonth}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Next month"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <TaskCalendar 
          tasks={tasks} 
          onSelectDate={setSelectedDate} 
          selectedDate={selectedDate}
          currentMonth={currentMonth}
        />
      </div>
      
      {selectedDate && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Tasks for {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          
          {isLoading ? (
            <div>Loading tasks...</div>
          ) : selectedDateTasks.length === 0 ? (
            <div className="p-4 bg-white rounded-lg text-center border border-gray-100">
              <p className="text-gray-500">No tasks for this date.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateTasks.map((task: Task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
