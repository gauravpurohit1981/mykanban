import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
import Dashboard from "@/pages/Dashboard";
import Calendar from "@/pages/Calendar";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import TaskForm from "@/components/TaskForm";

function Router() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onNewTask={() => setIsTaskModalOpen(true)} />
      
      <div className="flex-grow flex flex-col md:flex-row">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Switch>
            <Route path="/" component={() => (
              <Dashboard onNewTask={() => setIsTaskModalOpen(true)} />
            )} />
            <Route path="/calendar" component={Calendar} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      
      <MobileNavigation onNewTask={() => setIsTaskModalOpen(true)} />
      
      <TaskForm 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
