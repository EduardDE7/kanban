import { useState } from 'react';
import { TaskCard } from '@/components';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { TStatus, TTask } from '@/types';
import { statuses } from '@/utils/data-tasks';
import { Plus } from 'lucide-react';
import { NewTaskForm } from './components/task-add-form';
import { Button } from './components/ui/button';
import { useTaskManager } from './hooks/useTaskManager';

function App() {
  const [tasks, setTasks] = useState<TTask[]>([]);

  const { updateTask, addNewTask, deleteTask } = useTaskManager(
    tasks,
    setTasks,
  );
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
    <div className="flex justify-center w-auto h-screen overflow-auto ">
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
              <TaskCard
                key={task.id}
                task={task}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
