
import type { Task } from './types';

const API_URL = '/api/tasks';

// GET /api/tasks – Retrieve all tasks
export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

// GET /api/tasks/{id} – Retrieve a task by ID
export async function fetchTaskById(id: number | string): Promise<Task> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch task');
  return res.json();
}

// POST /api/tasks – Create a new task
export async function createTask(task: Partial<Task>): Promise<Task> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

// PUT /api/tasks/{id} – Update a task
export async function updateTask(id: number | string, updates: Partial<Task>): Promise<Task> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

// DELETE /api/tasks/{id} – Delete a task
export async function deleteTask(id: number | string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete task');
}
