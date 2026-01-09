import type { Task } from '../types';
import React, { useState } from 'react';
import { CheckIcon, TrashIcon } from '@heroicons/react/24/solid';

interface TaskFormProps {
  initial?: Partial<Task>;
  onSubmit: (data: Partial<Task>) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
  error?: string | null;
  title: string;
  submitLabel: string;
  disableSubmit?: boolean;
  onDelete?: () => Promise<void>;
  onChange?: (data: Partial<Task>) => void;
}

export const TaskFormUnified: React.FC<TaskFormProps> = ({
  initial = { name: '', description: '', dueDate: '', status: 'OPEN' },
  onSubmit,
  onClose,
  loading = false,
  error = null,
  title,
  submitLabel,
  disableSubmit = false,
  onDelete,
  onChange,
}) => {
  const [form, setForm] = useState<Partial<Task>>(initial);
  const [localError, setLocalError] = useState<string | null>(null);

  // Validation rules
  const validate = (data: Partial<Task>) => {
    if (!data.name || !data.name.trim()) return 'Name is required.';
    if (data.name.length > 100) return 'Name must be at most 100 characters.';
    if (data.description && data.description.length > 500) return 'Description must be at most 500 characters.';
    if (data.notes && data.notes.length > 1000) return 'Notes must be at most 1000 characters.';
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    // Validate on change
    setLocalError(validate(updated));
    if (onChange) onChange(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate(form);
    if (validationError) {
      setLocalError(validationError);
      return;
    }
    setLocalError(null);
    try {
      let dueDate = form.dueDate;
      if (dueDate) {
        dueDate = `${dueDate}T00:00:00`;
      }
      await onSubmit({ ...form, dueDate: dueDate || undefined });
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" aria-hidden="true"></div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative z-10">
        <button type="button" onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {(error || localError) && <div className="text-red-500 mb-2">{error || localError}</div>}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            required
            name="name"
            id="name"
            className="w-full border rounded px-3 py-2"
            value={form.name || ''}
            onChange={handleChange}
            maxLength={100}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            className="w-full border rounded px-3 py-2"
            value={form.description || ''}
            onChange={handleChange}
            maxLength={500}
          />
          <div className="flex justify-end">
            <span className="text-xs text-gray-400 select-none mt-1">{(form.description ? form.description.length : 0)}/500</span>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="dueDate">Due Date</label>
          <input type="date" name="dueDate" id="dueDate" className="w-full border rounded px-3 py-2" value={form.dueDate ? String(form.dueDate).slice(0, 10) : ''} onChange={handleChange} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="notes">Notes</label>
          <textarea
            name="notes"
            id="notes"
            className="w-full border rounded px-3 py-2"
            value={form.notes || ''}
            onChange={handleChange}
            maxLength={1000}
          />
          <div className="flex justify-end">
            <span className="text-xs text-gray-400 select-none mt-1">{(form.notes ? form.notes.length : 0)}/1000</span>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1" htmlFor="status">Status</label>
          <select name="status" id="status" className="w-full border rounded px-3 py-2" value={form.status || 'OPEN'} onChange={handleChange}>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className={`flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition ${disableSubmit ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading || disableSubmit}
          >
            {loading ? 'Saving...' : submitLabel}
            <CheckIcon className="w-5 h-5 ml-1" />
          </button>
          {onDelete && (
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700 transition"
              onClick={onDelete}
              disabled={loading}
            >
              Remove
              <TrashIcon className="w-5 h-5 ml-1" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
