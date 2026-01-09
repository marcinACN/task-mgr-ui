export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED';

export interface Task {
  id: number;
  name: string;
  description?: string;
  createdDate: string;
  dueDate?: string;
  notes?: string;
  status: TaskStatus;
}
