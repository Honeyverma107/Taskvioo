// MyTasksPage.jsx

import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';

import api from '../api/axios';

import TaskCard from '../components/TaskCard';

import {
  CheckCircle2,
  Clock3,
  AlertTriangle,
  ClipboardList,
  Sparkles,
  TrendingUp
} from 'lucide-react';

const COLUMNS = [
  {
    id: 'TODO',
    label: 'To Do',
    icon: ClipboardList,
    color: 'from-slate-500 to-slate-700',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20',
    text: 'text-slate-500 dark:text-slate-300'
  },
  {
    id: 'IN_PROGRESS',
    label: 'In Progress',
    icon: Clock3,
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-500 dark:text-blue-300'
  },
  {
    id: 'IN_REVIEW',
    label: 'In Review',
    icon: AlertTriangle,
    color: 'from-yellow-500 to-orange-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    text: 'text-yellow-500 dark:text-yellow-300'
  },
  {
    id: 'DONE',
    label: 'Done',
    icon: CheckCircle2,
    color: 'from-emerald-500 to-green-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-500 dark:text-emerald-300'
  }
];

export default function MyTasksPage() {

  const qc = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['my-tasks'],
    queryFn: () =>
      api.get('/tasks/my-tasks').then((r) => r.data)
  });

  const updateTask = useMutation({
    mutationFn: ({ projectId, taskId, data }) =>
      api.put(
        `/projects/${projectId}/tasks/${taskId}`,
        data
      ),

    onSuccess: () => {
      qc.invalidateQueries(['my-tasks']);
    }
  });

  const tasksByStatus = (status) =>
    tasks?.filter((t) => t.status === status) || [];

  const totalTasks = tasks?.length || 0;

  const completedTasks =
    tasks?.filter((t) => t.status === 'DONE')
      .length || 0;

  const overdueTasks =
    tasks?.filter(
      (t) =>
        t.dueDate &&
        new Date(t.dueDate) < new Date() &&
        t.status !== 'DONE'
    ).length || 0;

  const progress =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100
        )
      : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-[#050816] dark:via-[#07112b] dark:to-[#140014] flex items-center justify-center">

        <div className="w-12 h-12 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-[#050816] dark:via-[#07112b] dark:to-[#140014] text-gray-900 dark:text-white p-6 lg:p-10 transition-colors duration-300">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl p-8 mb-8 shadow-[0_0_60px_rgba(236,72,153,0.08)]">

        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          <div>

            <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 text-pink-500 dark:text-pink-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">

              <Sparkles size={12} />

              Personal Workspace
            </div>

            <h1 className="text-4xl font-black tracking-tight mb-3">
              My Tasks
            </h1>

            <p className="text-gray-500 dark:text-slate-400 max-w-xl">
              Track all assigned tasks, deadlines, and work progress in one place.
            </p>
          </div>

          {/* Progress */}
          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 backdrop-blur-xl p-5 min-w-[240px]">

            <div className="flex items-center justify-between mb-3">

              <div>

                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Productivity
                </p>

                <h3 className="text-3xl font-black">
                  {progress}%
                </h3>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/20">

                <TrendingUp
                  size={24}
                  className="text-white"
                />
              </div>
            </div>

            <div className="h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">

              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-700"
                style={{
                  width: `${progress}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">

        {[
          {
            label: 'Total Tasks',
            value: totalTasks,
            icon: ClipboardList,
            color: 'text-pink-500 dark:text-pink-400',
            bg: 'bg-pink-500/10'
          },
          {
            label: 'Completed',
            value: completedTasks,
            icon: CheckCircle2,
            color: 'text-emerald-500 dark:text-emerald-400',
            bg: 'bg-emerald-500/10'
          },
          {
            label: 'Overdue',
            value: overdueTasks,
            icon: AlertTriangle,
            color: 'text-red-500 dark:text-red-400',
            bg: 'bg-red-500/10'
          }
        ].map((item) => {

          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl p-5"
            >

              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${item.bg}`}
              >

                <Icon
                  size={22}
                  className={item.color}
                />
              </div>

              <h3 className="text-3xl font-black mb-1">
                {item.value}
              </h3>

              <p className="text-sm text-gray-500 dark:text-slate-400">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {COLUMNS.map((column) => {

          const Icon = column.icon;

          return (
            <div
              key={column.id}
              className={`relative overflow-hidden rounded-3xl border ${column.border} bg-white dark:bg-white/5 backdrop-blur-xl min-h-[700px]`}
            >

              <div
                className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl ${column.bg}`}
              />

              <div className="relative z-10 p-5 border-b border-gray-200 dark:border-white/10">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${column.color} flex items-center justify-center`}
                    >

                      <Icon
                        size={20}
                        className="text-white"
                      />
                    </div>

                    <div>

                      <h3
                        className={`font-bold ${column.text}`}
                      >
                        {column.label}
                      </h3>

                      <p className="text-xs text-gray-500 dark:text-slate-500">
                        Workflow
                      </p>
                    </div>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-700 dark:text-slate-300">

                    {
                      tasksByStatus(column.id)
                        .length
                    }
                  </div>
                </div>
              </div>

              <div className="relative z-10 p-4 space-y-4">

                {tasksByStatus(column.id).map(
                  (task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      projectId={
                        task.projectId
                      }
                      currentUserId={
                        task.assigneeId
                      }
                      isAdmin={false}
                      onStatusChange={(
                        status
                      ) =>
                        updateTask.mutate({
                          projectId:
                            task.projectId,
                          taskId: task.id,
                          data: { status }
                        })
                      }
                    />
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}