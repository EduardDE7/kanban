import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export const taskSchema = z.object({
  task: z.string().min(2, {
    message: 'Task name must be at least 2 characters.',
  }),
});

export type TaskFormData = z.infer<typeof taskSchema>;

interface NewTaskFormProps {
  onSubmit: (data: TaskFormData) => void;
}

export const NewTaskForm = ({ onSubmit }: NewTaskFormProps) => {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      task: '',
    },
  });

  function handleSubmit(data: TaskFormData) {
    onSubmit(data);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="task"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task name</FormLabel>
              <FormControl>
                <Input placeholder="task name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="p-1 px-2 border rounded-xlhover:drop-shadow-sm"
          variant="default"
          type="submit"
        >
          add task
        </Button>
      </form>
    </Form>
  );
};
