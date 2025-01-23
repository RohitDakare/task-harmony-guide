import { Progress } from "@/components/ui/progress";

interface TaskProgressProps {
  completed: number;
  total: number;
}

const TaskProgress = ({ completed, total }: TaskProgressProps) => {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Progress</span>
        <span>{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

export default TaskProgress;