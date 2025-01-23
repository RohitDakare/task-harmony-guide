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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Task Sage</h1>
            <p className="text-gray-600">Manage your tasks efficiently</p>
          </div>

          <TaskProgress completed={completedTasks} total={tasks.length} />
          
          <TaskInput onAdd={handleAddTask} />

          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
                onDelete={handleDeleteTask}
              />
            ))}
            {tasks.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No tasks yet. Add some tasks to get started!
              </p>
            )}
          </div>
        </div>
      </div>
      <AIAssistant onAddTask={handleAddTask} />
    </div>
  );
};

export default Index;