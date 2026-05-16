// InviteMemberModal.jsx

import { useForm } from 'react-hook-form';

import {
  X,
  UserPlus,
  Mail,
  Shield,
  Sparkles,
  Send
} from 'lucide-react';

import api from '../api/axios';

import {
  useMutation,
  useQueryClient
} from '@tanstack/react-query';

const ROLE_OPTIONS = [
  {
    value: 'MEMBER',
    label: 'Member',
    description: 'Can manage assigned tasks',
    color:
      'bg-blue-500/10 text-blue-300 border-blue-500/20'
  },
  {
    value: 'ADMIN',
    label: 'Admin',
    description: 'Can manage project & members',
    color:
      'bg-pink-500/10 text-pink-300 border-pink-500/20'
  }
];

export default function InviteMemberModal({
  projectId,
  onClose,
  onInvited
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
      role: 'MEMBER'
    }
  });

  const selectedRole = watch('role');

  const inviteMember = useMutation({
    mutationFn: (data) =>
      api.post(
        `/projects/${projectId}/members`,
        data
      ),

    onSuccess: () => {

      qc.invalidateQueries([
        'project',
        projectId
      ]);

      onInvited?.();

      onClose();
    }
  });

  const onSubmit = async (data) => {

    await inviteMember.mutateAsync(data);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="relative w-full max-w-xl rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0b1220]/95 backdrop-blur-xl shadow-[0_0_60px_rgba(236,72,153,0.15)] overflow-hidden">

        {/* Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">

          <div>

            <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <Sparkles size={11} />
              Team Collaboration
            </div>

            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              Invite Member
            </h2>

            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Add teammates and collaborate on project tasks.
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

          {/* Email */}
          <div>

            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
              <Mail size={15} />
              Member Email
            </label>

            <input
              {...register('email', {
                required: 'Email is required'
              })}
              type="email"
              placeholder="teammate@example.com"
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white px-4 py-3 text-sm placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            />

            {errors.email && (
              <p className="text-red-400 text-xs mt-2">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Roles */}
          <div>

            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
              <Shield size={15} />
              Assign Role
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {ROLE_OPTIONS.map((role) => (

                <button
                  key={role.value}
                  type="button"
                  onClick={() =>
                    setValue('role', role.value)
                  }
                  className={`rounded-3xl border p-5 text-left transition-all ${
                    selectedRole === role.value
                      ? `${role.color} ring-2 ring-pink-500`
                      : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >

                  <div className="flex items-center justify-between mb-3">

                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                      <Shield size={20} />
                    </div>

                    {selectedRole === role.value && (
                      <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                    )}
                  </div>

                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    {role.label}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    {role.description}
                  </p>
                </button>
              ))}
            </div>

            <input
              type="hidden"
              {...register('role')}
            />
          </div>

          {/* Info Card */}
          <div className="rounded-3xl border border-pink-500/20 bg-pink-500/5 p-5">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
                <UserPlus
                  size={22}
                  className="text-gray-900 dark:text-white"
                />
              </div>

              <div>

                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Collaboration Access
                </h3>

                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                  The invited member will receive access to this workspace and can start collaborating immediately.
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

              <Send size={16} />

              {isSubmitting
                ? 'Inviting...'
                : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}