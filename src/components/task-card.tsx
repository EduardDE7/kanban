import { useState } from 'react';
import { SubtaskAddForm, SubtaskFormData } from '@/components/subtask-add-form';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { TTask } from '@/types';
import {
  ChevronDown,
  ChevronUp,
  FileEdit,
  PlusCircle,
  Trash,
} from 'lucide-react';
import { v4 as uuid4 } from 'uuid';
import { Subtask } from './subtask';
import { Button } from './ui/button';
import { Input } from './ui/input';

export const TaskCard = ({
  task,
  updateTask,
  deleteTask,
}: {
  task: TTask;
  updateTask: (task: TTask) => void;
  deleteTask: (task: TTask) => void;
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const points = task.points || 0;
  const updatePoints = (direction: 'up' | 'down') => {
    const fib = [0, 1, 2, 3, 5, 8, 13];
    const index = fib.indexOf(points);
    const nextIndex = direction === 'up' ? index + 1 : index - 1;
    const newPoints = fib[nextIndex];
    if (newPoints) {
      updateTask({ ...task, points: newPoints });
    }
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.filter(
      (subtask) => subtask.id !== subtaskId,
    );

    updateTask({ ...task, subtasks: updatedSubtasks });
  };

  function addSubtask(data: SubtaskFormData) {
    console.log(data);

    const newSubtask = {
      id: uuid4(),
      label: data.label,
      checked: false,
    };

    updateTask({
      ...task,
      subtasks: [...task.subtasks, newSubtask],
    });

    setIsAddingSubtask(false);
  }

  const handleSubtaskChange = (subtaskId: string, isChecked: boolean) => {
    const updatedSubtasks = task.subtasks.map((subtask) =>
      subtask.id === subtaskId ? { ...subtask, checked: isChecked } : subtask,
    );

    updateTask({ ...task, subtasks: updatedSubtasks });
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('id', task.id);
      }}
      className="px-2 m-2 transition duration-500 border rounded-xl cursor-grab group bg-gray-50 hover:drop-shadow-lg"
    >
      <div className="flex justify-between h-10 py-2 align-middle ">
        {isEditingTitle ? (
          <Input
            autoFocus
            onBlur={() => setIsEditingTitle(false)}
            value={task.title}
            onChange={(e) => updateTask({ ...task, title: e.target.value })}
          />
        ) : (
          <h2 className="cursor-text" onClick={() => setIsEditingTitle(true)}>
            {task.title}
          </h2>
        )}
        <div className="flex gap-1.5 text-gray-300 align-middle opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Sheet>
            <SheetTrigger className="hover:text-yellow-500">
              <FileEdit size={16} />
            </SheetTrigger>
            <SheetContent>
              <SheetDescription></SheetDescription>
            </SheetContent>
          </Sheet>
          <Button
            onClick={() => deleteTask(task)}
            variant="transparent"
            className="hover:text-red-500"
            size="auto"
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>
      {task.subtasks &&
        task.subtasks.length > 0 &&
        task.subtasks.map((subtask) => {
          return (
            <Subtask
              key={subtask.id}
              subtask={subtask}
              onChange={handleSubtaskChange}
              onDelete={handleDeleteSubtask}
            />
          );
        })}
      {isAddingSubtask ? (
        <SubtaskAddForm onSubmit={addSubtask} />
      ) : (
        <Button
          className="p-0 mt-1 text-xs text-gray-400 opacity-0 group-hover:opacity-100 hover:text-green-700"
          variant="transparent"
          size="auto"
          onClick={() => setIsAddingSubtask(true)}
        >
          <PlusCircle className="w-4 h-4 mr-2" /> add subtask
        </Button>
      )}

      <div className="flex justify-between gap-5 py-2 text-sm text-gray-500">
        <div className="flex gap-2">
          {task.priority === 'high' && (
            <Badge className="bg-red-500">{task.priority}</Badge>
          )}
          {task.priority === 'medium' && (
            <Badge className="bg-yellow-500">{task.priority}</Badge>
          )}
          {task.priority === 'low' && (
            <Badge className="bg-green-500">{task.priority}</Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className="flex flex-col">
            <Button
              variant="transparent"
              size="auto"
              onClick={() => updatePoints('up')}
            >
              <ChevronUp size={13} />
            </Button>
            <Button
              variant="transparent"
              size="auto"
              onClick={() => updatePoints('down')}
            >
              <ChevronDown size={13} />
            </Button>
          </div>
          <Badge className="flex justify-center w-6 align-middle">
            {points}
          </Badge>
        </div>
      </div>
    </div>
  );
};
