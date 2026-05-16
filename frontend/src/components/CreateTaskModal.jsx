// CreateTaskModal.jsx

import { useForm } from 'react-hook-form';

import {
  X,
  Plus,
  Calendar,
  Flag,
  User,
  Sparkles
} from 'lucide-react';

import api from '../api/axios';

import { useMutation, useQueryClient } from '@tanstack/react-query';

const PRIORITIES = [
  {
    value: 'LOW',
    label: 'Low',
    color: 'bg-slate-500/10 text-slate-300 border-slate-500/20'
  },
  {
    value: 'MEDIUM',
    label: 'Medium',
    color: 'bg-blue-500/10 text-blue-300 border-blue-500/20'
  },
  {
    value: 'HIGH',
    label: 'High',
    color: 'bg-orange-500/10 text-orange-300 border-orange-500/20'
  },
  {
    value: 'URGENT',
    label: 'Urgent',
    color: 'bg-red-500/10 text-red-300 border-red-500/20'
  }
];

export default function CreateTaskModal({
  projectId,
  members,
  onClose,
  onCreated
}) {

  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      priority: 'MEDIUM',
      status: 'TODO'
    }
  });

  const selectedPriority = watch('priority');

  const createTask = useMutation({
    mutationFn: (data) =>
      api.post(`/projects/${projectId}/tasks`, data),

    onSuccess: () => {

      qc.invalidateQueries(['project', projectId]);

      onCreated?.();

      onClose();
    }
  });

  const onSubmit = async (data) => {

    await createTask.mutateAsync(data);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="relative w-full max-w-2xl rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0b1220]/95 backdrop-blur-xl shadow-[0_0_60px_rgba(236,72,153,0.15)] overflow-hidden">

        {/* Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">

          <div>
            <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <Sparkles size={11} />
              Task Management
            </div>

            <h2 className="text-2xl font-black text-white">
              Create New Task
            </h2>

            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Add a new task to your workspace board.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative z-10 p-6 space-y-6"
        >

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Task Title
            </label>

            <input
              {...register('title', {
                required: 'Task title is required'
              })}
              type="text"
              placeholder="Design landing page UI..."
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-white px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            />

            {errors.title && (
              <p className="text-red-400 text-xs mt-2">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Description
            </label>

            <textarea
              {...register('description')}
              rows={4}
              placeholder="Write task details..."
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-white px-4 py-3 text-sm placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Priority */}
            <div>

              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
                <Flag size={15} />
                Priority
              </label>

              <div className="grid grid-cols-2 gap-3">

                {PRIORITIES.map((priority) => (

                  <label
                    key={priority.value}
                    className={`cursor-pointer rounded-2xl border p-3 transition-all ${
                      selectedPriority === priority.value
                        ? `${priority.color} ring-2 ring-pink-500`
                        : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
                  >

                    <input
                      type="radio"
                      value={priority.value}
                      {...register('priority')}
                      className="hidden"
                    />

                    <p className="text-sm font-semibold">
                      {priority.label}
                    </p>
                  </label>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div>

              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
                <Calendar size={15} />
                Due Date
              </label>

              <input
                type="date"
                {...register('dueDate')}
                className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              />
            </div>
          </div>

          {/* Assignee */}
          <div>

            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
              <User size={15} />
              Assign To
            </label>

            <select
              {...register('assigneeId')}
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            >

              <option value="" className="bg-white dark:bg-[#0b1220]">
                Unassigned
              </option>

              {members?.map((member) => (
                <option
                  key={member.user.id}
                  value={member.user.id}
                  className="bg-white dark:bg-[#0b1220]"
                >
                  {member.user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-sm font-semibold text-slate-300 transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-sm font-semibold text-white transition-all shadow-lg shadow-pink-500/30 disabled:opacity-50"
            >

              <Plus size={16} />

              {isSubmitting
                ? 'Creating...'
                : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}