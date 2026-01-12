import React from 'react';
import { useEffect, useState } from 'react';
import { fetchTasks } from './api';
import type { Task } from './types';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { Snackbar } from './components/Snackbar';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadTasks = () => {
    setLoading(true);
    setError(null);
    fetchTasks()
      .then(setTasks)
      .catch((e) => {
        setError(e.message);
        setSnackbarOpen(true);
      })
      .finally(() => setLoading(false));
  };

  // Handler to show backend errors in Snackbar
  const handleBackendError = (msg: string) => {
    setError(msg);
    setSnackbarOpen(true);
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
        {/* Error message is now shown in Snackbar */}
        <Snackbar message={error || ''} open={snackbarOpen} onClose={() => setSnackbarOpen(false)} type="error" />
        {!loading && !error && (
          <TaskList
            tasks={tasks}
            onTaskUpdated={loadTasks}
            onBackendError={handleBackendError}
          />
        )}
        {showForm && (
          <TaskForm
            onTaskAdded={loadTasks}
            onClose={() => setShowForm(false)}
            onBackendError={handleBackendError}
          />
        )}
      </div>
    </div>
  );
};

export default App;
