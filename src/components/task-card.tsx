import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { TTask } from '@/types';
import { Subtask } from './subtask';

const lowPriorityIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 text-blue-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 9l7 7 7-7"
    />
  </svg>
);
const mediumPriorityIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 text-yellow-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 10h14"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 14h14"
    />
  </svg>
);
const highPriorityIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 text-red-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 15l7-7 7 7"
    />
  </svg>
);

export const TaskCard = ({
  task,
  updateTask,
}: {
  task: TTask;
  updateTask: (task: TTask) => void;
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

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
      className="w-56 px-2 m-2 transition duration-500 border rounded-lg cursor-grab bg-gray-50 group hover:drop-shadow-lg"
    >
      <div className="flex justify-between py-2 text-base align-middle font-base">
        {isEditingTitle ? (
          <input
            autoFocus
            className="w-full"
            onBlur={() => setIsEditingTitle(false)}
            value={task.title}
            onChange={(e) => updateTask({ ...task, title: e.target.value })}
          />
        ) : (
          <div className="cursor-text" onClick={() => setIsEditingTitle(true)}>
            {task.title}
          </div>
        )}

        <Sheet>
          <SheetTrigger className="text-sm text-blue-400 transition-opacity duration-500 opacity-0 group-hover:opacity-100">
            {/* <Button className="bg-blue-300 opacity-0 rounded-3xl hover:opacity-100"> */}
            Open
            {/* </Button> */}
          </SheetTrigger>
          <SheetContent>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetContent>
        </Sheet>
      </div>
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
          {task.priority === 'high' && <div>{highPriorityIcon}</div>}
          {task.priority === 'medium' && <div>{mediumPriorityIcon}</div>}
          {task.priority === 'low' && <div>{lowPriorityIcon}</div>}
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
