// CreateProjectModal.jsx

import { useForm } from 'react-hook-form';

import {
  X,
  FolderKanban,
  Sparkles,
  Plus,
  FileText
} from 'lucide-react';

import api from '../api/axios';

import {
  useMutation,
  useQueryClient
} from '@tanstack/react-query';

const PROJECT_THEMES = [
  'from-pink-500 to-rose-500',
  'from-fuchsia-500 to-pink-500',
  'from-rose-500 to-orange-500',
  'from-purple-500 to-pink-500'
];

export default function CreateProjectModal({
  onClose,
  onCreated
}) {

  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      theme: PROJECT_THEMES[0]
    }
  });

  const selectedTheme = watch('theme');

  const createProject = useMutation({
    mutationFn: (data) =>
      api.post('/projects', data),

    onSuccess: () => {

      qc.invalidateQueries(['projects']);

      onCreated?.();

      onClose();
    }
  });

  const onSubmit = async (data) => {

    await createProject.mutateAsync(data);
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
              Workspace Setup
            </div>

            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              Create New Project
            </h2>

            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Organize your team and manage project tasks smarter.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative z-10 p-6 space-y-6"
        >

          {/* Project Name */}
          <div>

            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
              <FolderKanban size={15} />
              Project Name
            </label>

            <input
              {...register('name', {
                required: 'Project name is required'
              })}
              type="text"
              placeholder="TaskVio Mobile App"
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white px-4 py-3 text-sm placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            />

            {errors.name && (
              <p className="text-red-400 text-xs mt-2">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>

            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
              <FileText size={15} />
              Description
            </label>

            <textarea
              {...register('description')}
              rows={5}
              placeholder="Describe your project goals, features, and workflow..."
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white px-4 py-3 text-sm placeholder:text-gray-400 dark:placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            />
          </div>

          {/* Theme Selector */}
          <div>

            <label className="block text-sm font-semibold text-slate-300 mb-3">
              Workspace Theme
            </label>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {PROJECT_THEMES.map((theme) => (

                <button
                  key={theme}
                  type="button"
                  onClick={() => setValue('theme', theme)}
                  className={`relative h-20 rounded-2xl bg-gradient-to-r ${theme} transition-all ${
                    selectedTheme === theme
                      ? 'ring-4 ring-pink-500 scale-105'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >

                  {selectedTheme === theme && (
                    <div className="absolute inset-0 rounded-2xl border-2 border-white/50"></div>
                  )}
                </button>
              ))}
            </div>

            <input
              type="hidden"
              {...register('theme')}
            />
          </div>

          {/* Preview */}
          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-5">

            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Live Preview
            </p>

            <div className="flex items-center gap-4">

              <div
                className={`w-16 h-16 rounded-3xl bg-gradient-to-r ${selectedTheme} flex items-center justify-center shadow-lg shadow-pink-500/20`}
              >
                <FolderKanban
                  size={28}
                  className="text-gray-900 dark:text-white"
                />
              </div>

              <div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {watch('name') || 'Project Name'}
                </h3>

                <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-2">
                  {watch('description') ||
                    'Project description preview will appear here.'}
                </p>
              </div>
            </div>
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
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-sm font-semibold text-gray-900 dark:text-white transition-all shadow-lg shadow-pink-500/30 disabled:opacity-50"
            >

              <Plus size={16} />

              {isSubmitting
                ? 'Creating...'
                : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}