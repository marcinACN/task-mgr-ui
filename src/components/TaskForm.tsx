import React from 'react';
import { createTask } from '../api';
import { TaskFormUnified } from './TaskFormUnified';
import type { Task } from '../types';

interface TaskFormProps {
  onTaskAdded: () => void;
  onClose: () => void;
  onBackendError: (msg: string) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onTaskAdded, onClose, onBackendError }) => {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (data: Partial<Task>) => {
    setLoading(true);
    try {
      await createTask(data);
      onTaskAdded();
      onClose();
    } catch (err: any) {
      onBackendError(err.message);
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
      error={null}
      initial={{ status: 'OPEN', notes: '' }}
    />
  );
};
