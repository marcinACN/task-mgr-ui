import React from 'react';
import { createTask } from '../api';
import { TaskFormUnified } from './TaskFormUnified';
import type { Task } from '../types';

interface TaskFormProps {
  onTaskAdded: () => void;
  onClose: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onTaskAdded, onClose }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (data: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      await createTask(data);
      onTaskAdded();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaskFormUnified
      title="Add New Task"
      submitLabel="Add Task"
      onSubmit={handleSubmit}
      onClose={onClose}
      loading={loading}
      error={error}
      initial={{ status: 'OPEN', notes: '' }}
    />
  );
};
