import { Checkbox } from '@/components/ui/checkbox';
import { TSubtaskProps } from '@/types';
import { Trash } from 'lucide-react';
import { Button } from './ui';

export function Subtask({ subtask, onChange, onDelete }: TSubtaskProps) {
  return (
    <div className="flex items-center space-x-2 text-sm group/delete ">
      <Checkbox
        className="w-4 h-4 rounded-full"
        id={subtask.id}
        checked={subtask.checked}
        onCheckedChange={() => onChange(subtask.id, !subtask.checked)}
      />
      <label
        htmlFor={subtask.id}
        className={`${subtask.checked ? 'line-through' : ''}`}
      >
        {subtask.label}
      </label>
      <Button
        className="text-gray-300 opacity-0 group-hover/delete:opacity-100 hover:text-red-500"
        variant="transparent"
        size="auto"
        onClick={() => onDelete(subtask.id)}
      >
        <Trash size={14} />
      </Button>
    </div>
  );
}
