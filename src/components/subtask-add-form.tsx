import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export const subtaskSchema = z.object({
  label: z.string().min(2, {
    message: 'Task name must be at least 2 characters.',
  }),
});

export type SubtaskFormData = z.infer<typeof subtaskSchema>;

interface SubtaskAddFormProps {
  onSubmit: (data: SubtaskFormData) => void;
}

export const SubtaskAddForm = ({ onSubmit }: SubtaskAddFormProps) => {
  const form = useForm<SubtaskFormData>({
    resolver: zodResolver(subtaskSchema),
    defaultValues: {
      label: '',
    },
  });

  function handleSubmit(data: SubtaskFormData) {
    onSubmit(data);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input autoFocus placeholder="task name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" variant="transparent">
          <PlusCircle className="w-5 h-5 ml-2 text-gray-500" />
        </Button>
      </form>
    </Form>
  );
};
