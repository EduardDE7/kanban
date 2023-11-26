import { useEffect, useState } from 'react';
import { TaskCard } from '@/components';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { TStatus, TTask } from '@/types';
import { priorities, statuses } from '@/utils/data-tasks';
import { Plus } from 'lucide-react';
import { v4 as uuid4 } from 'uuid';
import { NewTaskForm, TaskFormData } from './components/new-task-form';
import { Button } from './components/ui/button';

function App() {
  const [tasks, setTasks] = useState<TTask[]>([]);
  const [currentlyHoveringOver, setCurrentlyHoveringOver] =
    useState<TStatus | null>(null);
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);

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

  const addNewTask = (data: TaskFormData) => {
    const newTask = {
      title: data.task,
      id: uuid4(),
      subtasks: [],
      points: 1,
      status: statuses[0],
      priority: priorities[0],
    };

    fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });
    setTasks([...tasks, newTask]);
    setOpenAddTaskDialog(false);
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
    <div className="flex justify-center w-screen h-full divide-x ">
      {columns.map((column) => (
        <div
          key={column.status}
          className={`  ${
            currentlyHoveringOver === column.status ? 'bg-gray-50/20' : ''
          } transition-colors duration-500 w-64`}
          onDrop={(e) => handleDrop(e, column.status)}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => handleDragEnter(column.status)}
        >
          <div className="flex justify-between p-2 text-xl text-gray-600 align-baseline">
            <div className="flex font-bold text-gray-50">
              <h2 className="mr-1 capitalize">{column.status}</h2>
              {column.tasks.reduce(
                (total, task) => total + (task?.points || 0),
                0,
              )}
            </div>
            <Dialog
              open={openAddTaskDialog}
              onOpenChange={setOpenAddTaskDialog}
            >
              <Button
                className="text-base border rounded-xl bg-gray-50 hover:drop-shadow-sm"
                variant="secondary"
                onClick={() => setOpenAddTaskDialog(true)}
              >
                <Plus size={18} className="" />
              </Button>
              <DialogContent>
                <NewTaskForm onSubmit={addNewTask} />
              </DialogContent>
            </Dialog>
          </div>
          <div className={'h-full'}>
            {column.tasks.map((task) => (
              <TaskCard key={task.id} task={task} updateTask={updateTask} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
