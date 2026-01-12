import React, { useState } from 'react';
import type { Task } from '../types';
import { updateTask, deleteTask } from '../api';
import { EditTaskForm } from './EditTaskForm';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated?: () => void;
  onBackendError?: (msg: string) => void;
}

const statusColors: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-800 ring-2 ring-blue-200',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800 ring-2 ring-yellow-200',
  ON_HOLD: 'bg-gray-100 text-gray-800 ring-2 ring-gray-200',
  COMPLETED: 'bg-green-100 text-green-800 ring-2 ring-green-200',
};

export const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskUpdated, onBackendError }) => {
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const handleStatusChange = async (task: Task, newStatus: Task['status']) => {
    setUpdatingId(task.id);
    try {
      await updateTask(task.id, {
        ...task,
        status: newStatus,
      });
      if (onTaskUpdated) onTaskUpdated();
    } catch (err: any) {
      if (onBackendError) onBackendError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="overflow-x-auto pt-2">
      <div className="bg-white shadow-2xl border border-gray-200 rounded-md overflow-hidden mx-1 sm:mx-0">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-100 to-blue-200">
            <tr>
              <th className="px-6 py-5 text-left text-sm font-extrabold text-gray-700 uppercase tracking-widest">Name</th>
              <th className="px-6 py-5 text-left text-sm font-extrabold text-gray-700 uppercase tracking-widest">Description</th>
              <th className="px-6 py-5 text-left text-sm font-extrabold text-gray-700 uppercase tracking-widest">Status</th>
              <th className="px-6 py-5 text-left text-sm font-extrabold text-gray-700 uppercase tracking-widest">Due Date</th>
              <th className="px-6 py-5 text-left text-sm font-extrabold text-gray-700 uppercase tracking-widest">Notes</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-xl font-semibold bg-gray-50">No tasks found.</td>
              </tr>
            ) : (
              tasks.map((task, idx) => (
                <tr
                  key={task.id}
                  className={`transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 cursor-pointer`}
                  onClick={() => setEditTask(task)}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 text-base">{task.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 max-w-xs truncate text-base">{task.description || <span className='italic text-gray-300'>No description</span>}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className={`pl-3 pr-6 py-1 rounded border font-bold text-sm shadow ring-2 ${statusColors[task.status]} ${updatingId === task.id ? 'opacity-60' : ''}`}
                      value={task.status}
                      disabled={updatingId === task.id}
                      onClick={e => e.stopPropagation()}
                      onChange={e => handleStatusChange(task, e.target.value as Task['status'])}
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="ON_HOLD">On Hold</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-base">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : <span className='italic text-gray-300'>No due date</span>}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 max-w-xs truncate text-base">{task.notes || <span className='italic text-gray-300'>No notes</span>}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {editTask && (
        <EditTaskForm
          task={editTask}
          onClose={() => setEditTask(null)}
          onTaskUpdated={onTaskUpdated || (() => {})}
          onBackendError={onBackendError}
          onDelete={async () => {
            if (!editTask) return;
            try {
              await deleteTask(editTask.id);
              setEditTask(null);
              if (onTaskUpdated) onTaskUpdated();
            } catch (err: any) {
              if (onBackendError) onBackendError(err.message);
            }
          }}
        />
      )}
    </div>
  );
};
