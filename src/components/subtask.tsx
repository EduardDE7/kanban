'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { TSubtaskProps } from '@/types';

export function Subtask({ subtask, onChange }: TSubtaskProps) {
  const handleCheckboxChange = () => {
    onChange(subtask.id, !subtask.checked);
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      <Checkbox
        className="w-4 h-4 rounded-full"
        id={subtask.id}
        checked={subtask.checked}
        onCheckedChange={handleCheckboxChange}
      />
      <label
        htmlFor={subtask.id}
        className={`${subtask.checked ? 'line-through' : ''}`}
      >
        {subtask.label}
      </label>
    </div>
  );
}
