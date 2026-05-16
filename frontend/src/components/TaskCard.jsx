// TaskCard.jsx

import { useState } from 'react';

import { format } from 'date-fns';

import {
  Calendar,
  Trash2,
  ChevronDown,
  Clock3,
  AlertTriangle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

import api from '../api/axios';

import { useQueryClient } from '@tanstack/react-query';

const PRIORITY_STYLES = {
  LOW: {
    badge:
      'bg-slate-500/10 text-slate-500 dark:text-slate-300 border border-slate-500/20',
    glow: 'bg-slate-500/10'
  },

  MEDIUM: {
    badge:
      'bg-blue-500/10 text-blue-500 dark:text-blue-300 border border-blue-500/20',
    glow: 'bg-blue-500/10'
  },

  HIGH: {
    badge:
      'bg-orange-500/10 text-orange-500 dark:text-orange-300 border border-orange-500/20',
    glow: 'bg-orange-500/10'
  },

  URGENT: {
    badge:
      'bg-red-500/10 text-red-500 dark:text-red-300 border border-red-500/20',
    glow: 'bg-red-500/10'
  }
};

const STATUS_OPTIONS = [
  'TODO',
  'IN_PROGRESS',
  'IN_REVIEW',
  'DONE'
];

export default function TaskCard({
  task,
  onStatusChange,
  isAdmin,
  projectId,
  currentUserId
}) {

  const [expanded, setExpanded] =
    useState(false);

  const qc = useQueryClient();

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'DONE';

  const canDelete =
    isAdmin ||
    task.creator?.id === currentUserId;

  const handleDelete = async (e) => {

    e.stopPropagation();

    const confirmDelete = window.confirm(
      'Delete this task?'
    );

    if (!confirmDelete) return;

    await api.delete(
      `/projects/${projectId}/tasks/${task.id}`
    );

    qc.invalidateQueries([
      'project',
      projectId
    ]);

    qc.invalidateQueries(['my-tasks']);
  };

  const priorityStyle =
    PRIORITY_STYLES[task.priority] ||
    PRIORITY_STYLES.LOW;

  return (
    <div
      onClick={() =>
        setExpanded(!expanded)
      }
      className={`group relative overflow-hidden rounded-3xl border backdrop-blur-xl p-4 cursor-pointer transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_0_40px_rgba(236,72,153,0.08)]
        
        ${
          isOverdue
            ? 'border-red-300 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5'
            : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-pink-300 dark:hover:border-pink-500/20'
        }`}
    >

      {/* Glow */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity ${priorityStyle.glow}`}
      />

      <div className="relative z-10">

        {/* Top */}
        <div className="flex items-start justify-between gap-3 mb-3">

          {/* Left */}
          <div className="flex-1">

            {/* Priority */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold mb-3 ${priorityStyle.badge}`}
            >

              <Sparkles size={10} />

              {task.priority}
            </div>

            {/* Title */}
            <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug group-hover:text-pink-500 dark:group-hover:text-pink-300 transition-colors">
              {task.title}
            </h3>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">

            {/* Delete */}
            {canDelete && (
              <button
                onClick={handleDelete}
                className="w-8 h-8 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
              >

                <Trash2 size={14} />
              </button>
            )}

            {/* Expand */}
            <div className="w-8 h-8 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 flex items-center justify-center">

              <ChevronDown
                size={15}
                className={`text-gray-500 dark:text-slate-400 transition-transform duration-300 ${
                  expanded
                    ? 'rotate-180'
                    : ''
                }`}
              />
            </div>
          </div>
        </div>

        {/* Desc */}
        {task.description && (
          <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-2 mb-4">
            {task.description}
          </p>
        )}

        {/* Expanded */}
        {expanded && (
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            className="mt-5 pt-5 border-t border-gray-200 dark:border-white/10 space-y-4"
          >

            {/* Full Desc */}
            {task.description && (
              <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4">

                <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-2">
                  Description
                </p>

                <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                  {task.description}
                </p>
              </div>
            )}

            {/* Status */}
            <div>

              <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 mb-2">
                Change Status
              </label>

              <select
                value={task.status}
                onChange={(e) =>
                  onStatusChange(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              >

                {STATUS_OPTIONS.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                      className="bg-white dark:bg-[#0b1220]"
                    >
                      {status.replace(
                        /_/g,
                        ' '
                      )}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-white/10">

          {/* Assignee */}
          {task.assignee ? (
            <div className="flex items-center gap-2">

              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-pink-500/20">

                {task.assignee.name[0].toUpperCase()}
              </div>

              <div>

                <p className="text-xs font-semibold text-gray-800 dark:text-slate-300">
                  {task.assignee.name.split(
                    ' '
                  )[0]}
                </p>

                <p className="text-[11px] text-gray-500 dark:text-slate-500">
                  Assigned
                </p>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-500 dark:text-slate-500">
              Unassigned
            </div>
          )}

          {/* Due */}
          {task.dueDate && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border
              
              ${
                isOverdue
                  ? 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-300 border-red-300 dark:border-red-500/20'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-white/10'
              }`}
            >

              {isOverdue ? (
                <AlertTriangle
                  size={12}
                />
              ) : task.status ===
                'DONE' ? (
                <CheckCircle2
                  size={12}
                />
              ) : (
                <Clock3 size={12} />
              )}

              <Calendar size={12} />

              <span>
                {format(
                  new Date(
                    task.dueDate
                  ),
                  'MMM d'
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}