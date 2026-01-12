import React from 'react';
import { updateTask } from '../api';
import { TaskFormUnified } from './TaskFormUnified';
import type { Task } from '../types';


interface EditTaskFormProps {
  task: Task;
  onClose: () => void;
  onTaskUpdated: () => void;
  onDelete: () => Promise<void>;
  onBackendError?: (msg: string) => void;
}

export const EditTaskForm: React.FC<EditTaskFormProps> = ({ task, onClose, onTaskUpdated, onDelete, onBackendError }) => {
  const [loading, setLoading] = React.useState(false);
  const [changed, setChanged] = React.useState(false);

  const initial = {
    name: task.name,
    description: task.description || '',
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
    status: task.status,
    notes: task.notes || '',
  };

  const handleSubmit = async (data: Partial<Task>) => {
    setLoading(true);
    try {
      await updateTask(task.id, data);
      onTaskUpdated();
      onClose();
    } catch (err: any) {
      if (onBackendError) onBackendError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaskFormUnified
      title="Edit Task"
      submitLabel="Save"
      initial={initial}
      onSubmit={handleSubmit}
      onClose={onClose}
      loading={loading}
      error={null}
      disableSubmit={!changed}
      onDelete={onDelete}
      onChange={(data: Partial<Task>) => {
        setChanged(
          data.name !== initial.name ||
          data.description !== initial.description ||
          data.dueDate !== initial.dueDate ||
          data.status !== initial.status
        );
      }}
    />
  );
};
