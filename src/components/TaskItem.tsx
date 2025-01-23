import { Check, Trash2, Circle } from "lucide-react";
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, onComplete, onDelete }: TaskItemProps) => {
  const priorityColors = {
    low: "bg-task-low",
    medium: "bg-task-medium",
    high: "bg-task-high",
  };

  return (
    <div
      className={cn(
        "group flex items-center justify-between p-4 rounded-lg bg-white shadow-sm border border-gray-100 animate-task-added",
        task.completed && "opacity-50"
      )}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => onComplete(task.id)}
          className="rounded-full p-1 hover:bg-gray-100 transition-colors"
        >
          {task.completed ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400" />
          )}
        </button>
        <span
          className={cn(
            "text-gray-700 transition-all",
            task.completed && "line-through text-gray-400"
          )}
        >
          {task.title}
        </span>
        <span
          className={cn(
            "ml-2 w-2 h-2 rounded-full",
            priorityColors[task.priority]
          )}
        />
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TaskItem;