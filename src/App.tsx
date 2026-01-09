import React from 'react';
import { useEffect, useState } from 'react';
import { fetchTasks } from './api';
import type { Task } from './types';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadTasks = () => {
    setLoading(true);
    setError(null);
    fetchTasks()
      .then(setTasks)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-0">
      <div className="max-w-4xl mx-auto pt-8 pl-6 pr-6 relative">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-left">Task Manager</h1>
          <button
            className="bg-blue-600 text-white rounded w-32 h-10 flex items-center justify-center text-base font-semibold shadow hover:bg-blue-700 transition"
            title="Add Task"
            onClick={() => setShowForm(true)}
            aria-label="Add Task"
          >
            <span className="mr-2 text-2xl leading-none">+</span> New Task
          </button>
        </div>
        {loading && <div className="text-left">Loading tasks...</div>}
        {error && <div className="text-left text-red-500">{error}</div>}
        {!loading && !error && <TaskList tasks={tasks} onTaskUpdated={loadTasks} />}
        {showForm && (
          <TaskForm
            onTaskAdded={loadTasks}
            onClose={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default App;
