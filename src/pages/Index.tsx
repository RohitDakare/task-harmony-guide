import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import TaskInput from "@/components/TaskInput";
import TaskItem from "@/components/TaskItem";
import TaskProgress from "@/components/TaskProgress";
import AIAssistant from "@/components/AIAssistant";
import { Task, Priority } from "@/types/task";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  const handleAddTask = (title: string, priority: Priority) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      priority,
      createdAt: new Date(),
    };
    setTasks((prev) => [...prev, newTask]);
    toast({
      title: "Task added",
      description: "Your new task has been added successfully.",
    });
  };

  const handleCompleteTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    toast({
      title: "Task deleted",
      description: "The task has been deleted successfully.",
    });
  };

  const completedTasks = tasks.filter((task) => task.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 animate-fade-in">
              Task Sage
            </h1>
            <p className="text-gray-600 dark:text-gray-400 animate-fade-in">
              Manage your tasks efficiently with AI assistance
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6 animate-scale-in">
            <TaskProgress completed={completedTasks} total={tasks.length} />
            <TaskInput onAdd={handleAddTask} />

            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={handleCompleteTask}
                  onDelete={handleDeleteTask}
                />
              ))}
              {tasks.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No tasks yet. Add some tasks to get started!
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Try using the AI assistant to help you create tasks
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <AIAssistant onAddTask={handleAddTask} />
    </div>
  );
};

export default Index;