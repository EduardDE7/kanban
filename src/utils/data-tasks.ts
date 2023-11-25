export type TStatus = 'done' | 'inprogress' | 'todo';
export type TPriority = 'low' | 'medium' | 'high';

export type TTask = {
  title: string;
  id: string;
  status: TStatus;
  priority: TPriority;
  points?: number;
};

export const statuses: TStatus[] = ['todo', 'inprogress', 'done'];
export const priorities: TPriority[] = ['low', 'medium', 'high'];
