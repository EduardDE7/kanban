export type TStatus = 'done' | 'inprogress' | 'todo';
export type TPriority = 'low' | 'medium' | 'high';

export type TSubtask = {
  id: string;
  label: string;
  checked: boolean;
};

export type TSubtaskProps = {
  subtask: TSubtask;
  onChange: (subtaskId: string, isChecked: boolean) => void;
  onDelete: (subtaskId: string) => void;
};

export type TTask = {
  title: string;
  id: string;
  subtasks: TSubtask[];
  status: TStatus;
  priority: TPriority;
  points?: number;
};
