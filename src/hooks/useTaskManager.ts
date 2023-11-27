import { useEffect, useState } from 'react';
import { TaskFormData } from '@/components/task-add-form';
import { TTask } from '@/types';
import { priorities, statuses } from '@/utils/data-tasks';
import { v4 as uuid4 } from 'uuid';

export const useTaskManager = (tasks, setTasks) => {
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

    const updatedTasks = tasks.map((t) => (t.id === task.id ? task : t));
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
  };

  const deleteTask = async (task: TTask) => {
    const taskId = task.id;
    try {
      await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'DELETE',
      });

      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      console.log(updatedTasks);

      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return { tasks, updateTask, addNewTask, deleteTask };
};
