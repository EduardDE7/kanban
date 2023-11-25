import { useEffect, useState } from 'react';
import { TaskCard } from '@/components';
import { TStatus, TTask } from '@/types';
import { statuses } from '@/utils/data-tasks';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<TTask[]>([]);
  const [currentlyHoveringOver, setCurrentlyHoveringOver] =
    useState<TStatus | null>(null);

  const columns = statuses.map((status) => {
    const tasksInColumn = tasks.filter((task) => task.status === status);
    return {
      status,
      tasks: tasksInColumn,
    };
  });

  useEffect(() => {
    fetch('http://localhost:3000/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  const updateTask = (task: TTask) => {
    fetch(`http://localhost:3000/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    const updatedTasks = tasks.map((t) => {
      return t.id === task.id ? task : t;
    });
    setTasks(updatedTasks);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: TStatus) => {
    e.preventDefault();
    setCurrentlyHoveringOver(null);
    const id = e.dataTransfer.getData('id');
    const task = tasks.find((t) => t.id === id);
    if (task) {
      updateTask({ ...task, status });
    }
  };

  const handleDragEnter = (status: TStatus) => {
    setCurrentlyHoveringOver(status);
  };

  return (
    <div className="flex w-screen h-screen divide-x">
      {columns.map((column) => (
        <div
          className={`  ${
            currentlyHoveringOver === column.status ? 'bg-gray-100' : ''
          } transition-colors duration-500`}
          onDrop={(e) => handleDrop(e, column.status)}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => handleDragEnter(column.status)}
        >
          <div className="flex justify-between p-2 text-3xl font-bold text-gray-600">
            <h2 className="capitalize">{column.status}</h2>
            {column.tasks.reduce(
              (total, task) => total + (task?.points || 0),
              0,
            )}
          </div>
          <div className={'h-full'}>
            {column.tasks.map((task) => (
              <TaskCard task={task} updateTask={updateTask} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
