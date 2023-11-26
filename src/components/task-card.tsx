import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { TTask } from '@/types';
import {
  ChevronRight,
  ChevronsUp,
  ChevronUp,
  Minus,
  PlusCircle,
} from 'lucide-react';
import { v4 as uuid4 } from 'uuid';
import { Subtask } from './subtask';
import { Button } from './ui/button';
import { Input } from './ui/input';

export const TaskCard = ({
  task,
  updateTask,
}: {
  task: TTask;
  updateTask: (task: TTask) => void;
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [subtaskName, setSubtaskName] = useState('');

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

  function addSubtask() {
    const newSubtask = {
      id: uuid4(),
      label: subtaskName,
      checked: false,
    };

    updateTask({
      ...task,
      subtasks: [...task.subtasks, newSubtask],
    });

    setIsAddingSubtask(false);
    setSubtaskName('');
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
      className="px-2 m-2 transition duration-500 border rounded-xl cursor-grab bg-gray-50 hover:drop-shadow-lg"
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

        <Sheet>
          {/* <SheetTrigger className="transition-opacity duration-500 opacity-0 text-primary group-hover:opacity-100"> */}
          <SheetTrigger className="text-gray-300">
            {/* <ArrowRightFromLine className="w-5 h-5" /> */}
            <ChevronRight />
          </SheetTrigger>
          <SheetContent>
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </div>
      {isAddingSubtask ? (
        <div className="flex">
          <input
            autoFocus
            onBlur={() => setIsAddingSubtask(false)}
            value={subtaskName}
            onChange={(e) => setSubtaskName(e.target.value)}
          />
          <Button variant="transparent" onClick={() => addSubtask()}>
            <PlusCircle className="w-5 h-5 ml-2 text-gray-500" />
          </Button>
        </div>
      ) : (
        <Button
          className="p-0 text-gray-500"
          variant="transparent"
          onClick={() => setIsAddingSubtask(true)}
        >
          <PlusCircle className="w-4 h-4 mr-2" /> add subtask
        </Button>
      )}
      {task.subtasks &&
        task.subtasks.length > 0 &&
        task.subtasks.map((subtask) => {
          return (
            <Subtask
              key={subtask.id}
              subtask={subtask}
              onChange={handleSubtaskChange}
            />
          );
        })}
      <div className="flex justify-between gap-5 py-2 text-sm text-gray-500">
        <div className="flex gap-2">
          <div>{task.id}</div>
          <div>{task.priority}</div>
          {task.priority === 'high' && <ChevronsUp className="text-red-500" />}
          {task.priority === 'medium' && (
            <ChevronUp className="text-yellow-500" />
          )}
          {task.priority === 'low' && <Minus className="text-blue-400" />}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => updatePoints('down')}>-</button>
          <div className="font-bold">{points}</div>
          <button onClick={() => updatePoints('up')}>+</button>B
        </div>
      </div>
    </div>
  );
};
