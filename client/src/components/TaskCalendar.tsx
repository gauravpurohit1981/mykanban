import { useState } from "react";
import { Task } from "@shared/schema";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  getDay,
  addDays,
} from "date-fns";

interface TaskCalendarProps {
  tasks: Task[];
  onSelectDate?: (date: Date) => void;
  selectedDate?: Date;
  currentMonth?: Date;
}

export default function TaskCalendar({ 
  tasks, 
  onSelectDate, 
  selectedDate,
  currentMonth = new Date(),
}: TaskCalendarProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const dateRange = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Calculate starting empty cells based on the day of week (0 = Sunday, 1 = Monday, etc.)
  const startDay = getDay(monthStart);
  
  // Create previous month empty placeholders
  const prevMonthDays = Array.from({ length: startDay }).map((_, i) => {
    const day = addDays(monthStart, -startDay + i);
    return { date: day, isCurrentMonth: false };
  });
  
  // Combine with current month days
  const calendarDays = [
    ...prevMonthDays,
    ...dateRange.map(date => ({ date, isCurrentMonth: true })),
  ];
  
  // Function to check if a date has tasks
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date);
    });
  };
  
  // Function to get color dot based on task category
  const getCategoryColor = (category: string) => {
    return category === "personal" ? "bg-blue-500" : "bg-purple-500";
  };
  
  return (
    <div>
      <div className="grid grid-cols-7 gap-2">
        {/* Days of Week */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Calendar Cells */}
        {calendarDays.map(({ date, isCurrentMonth }, index) => {
          const dayTasks = getTasksForDate(date);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          
          return (
            <div 
              key={index} 
              className={`h-20 p-1 border border-gray-200 rounded ${
                isToday(date) ? "bg-blue-50" : 
                isSelected ? "bg-blue-50" : 
                !isCurrentMonth ? "bg-gray-50 text-gray-400" : 
                "hover:bg-gray-50"
              } cursor-pointer`}
              onClick={() => onSelectDate && onSelectDate(date)}
            >
              <div className="text-xs">{format(date, "d")}</div>
              
              {/* Task indicators */}
              <div className="mt-1 space-y-1">
                {dayTasks.slice(0, 3).map((task) => (
                  <div 
                    key={task.id} 
                    className={`h-2 w-2 rounded-full ${getCategoryColor(task.category)}`}
                    title={task.title}
                  />
                ))}
                
                {/* Show count if more than 3 tasks */}
                {dayTasks.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
