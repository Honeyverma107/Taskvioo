// ProjectPage.jsx

import {
  useParams,
  useNavigate
} from 'react-router-dom';

import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';

import api from '../api/axios';

import { useAuth } from '../context/AuthContext';

import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';
import InviteMemberModal from '../components/InviteMemberModal';

import { useState } from 'react';

import {
  Plus,
  UserPlus,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock3,
  AlertCircle,
  ClipboardList
} from 'lucide-react';

const COLUMNS = [
  {
    id: 'TODO',
    label: 'To Do',
    icon: ClipboardList,
    color: 'from-slate-500 to-slate-700',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20',
    text: 'text-slate-400 dark:text-slate-300'
  },
  {
    id: 'IN_PROGRESS',
    label: 'In Progress',
    icon: Clock3,
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400'
  },
  {
    id: 'IN_REVIEW',
    label: 'In Review',
    icon: AlertCircle,
    color: 'from-yellow-500 to-orange-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    text: 'text-yellow-400'
  },
  {
    id: 'DONE',
    label: 'Done',
    icon: CheckCircle2,
    color: 'from-emerald-500 to-green-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400'
  }
];

export default function ProjectPage() {

  const { projectId } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  const qc = useQueryClient();

  const [showTaskModal, setShowTaskModal] =
    useState(false);

  const [showInviteModal, setShowInviteModal] =
    useState(false);

  const { data: project, isLoading } =
    useQuery({
      queryKey: ['project', projectId],
      queryFn: () =>
        api
          .get(`/projects/${projectId}`)
          .then((r) => r.data)
    });

  const updateTask = useMutation({
    mutationFn: ({ taskId, data }) =>
      api.put(
        `/projects/${projectId}/tasks/${taskId}`,
        data
      ),

    onSuccess: () => {
      qc.invalidateQueries([
        'project',
        projectId
      ]);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-[#050816] dark:via-[#07112b] dark:to-[#140014] flex items-center justify-center">

        <div className="w-12 h-12 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const myRole = project?.members.find(
    (m) => m.userId === user?.id
  )?.role;

  const isAdmin = myRole === 'ADMIN';

  const tasksByStatus = (status) =>
    project?.tasks.filter(
      (t) => t.status === status
    ) || [];

  const totalTasks =
    project?.tasks?.length || 0;

  const completedTasks =
    project?.tasks?.filter(
      (t) => t.status === 'DONE'
    ).length || 0;

  const progress =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100
        )
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-[#050816] dark:via-[#07112b] dark:to-[#140014] text-gray-900 dark:text-white transition-colors duration-300">

      {/* Header */}
      <div className="relative overflow-hidden border-b border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl">

        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 px-6 lg:px-10 py-8">

          {/* Top */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">

            {/* Left */}
            <div>

              {/* Back */}
              <button
                onClick={() =>
                  navigate('/projects')
                }
                className="flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors mb-5"
              >

                <ArrowLeft size={16} />

                Back to Projects
              </button>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 text-pink-500 dark:text-pink-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">

                <Sparkles size={12} />

                Active Workspace
              </div>

              {/* Title */}
              <h1 className="text-4xl font-black tracking-tight mb-3">
                {project?.name}
              </h1>

              {/* Desc */}
              <p className="text-gray-500 dark:text-slate-400 max-w-2xl">
                {project?.description ||
                  'No description provided'}
              </p>

              {/* Progress */}
              <div className="mt-6 max-w-md">

                <div className="flex items-center justify-between text-xs mb-2">

                  <span className="text-gray-500 dark:text-slate-400">
                    Project Progress
                  </span>

                  <span className="font-semibold text-pink-500 dark:text-pink-400">
                    {progress}%
                  </span>
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

            {/* Right */}
            <div className="flex flex-wrap items-center gap-3">

              {/* Members */}
              <div className="flex items-center gap-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3">

                <div className="flex -space-x-3">

                  {project?.members.map(
                    (member) => (
                      <div
                        key={member.id}
                        title={
                          member.user.name
                        }
                        className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0b1220] bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-sm font-bold text-white"
                      >
                        {member.user.name[0].toUpperCase()}
                      </div>
                    )
                  )}
                </div>

                <div>

                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {
                      project?.members
                        .length
                    }{' '}
                    Members
                  </p>

                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    Team Collaboration
                  </p>
                </div>
              </div>

              {/* Invite */}
              {isAdmin && (
                <button
                  onClick={() =>
                    setShowInviteModal(
                      true
                    )
                  }
                  className="flex items-center gap-2 border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 px-5 py-3 rounded-2xl text-sm font-semibold transition-all"
                >

                  <UserPlus size={16} />

                  Invite
                </button>
              )}

              {/* Add Task */}
              <button
                onClick={() =>
                  setShowTaskModal(true)
                }
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 px-5 py-3 rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-pink-500/30 text-white"
              >

                <Plus size={16} />

                Add Task
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="p-6 lg:p-8 overflow-x-auto">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-w-[1200px] lg:min-w-0">

          {COLUMNS.map((column) => {

            const Icon = column.icon;

            return (
              <div
                key={column.id}
                className={`relative overflow-hidden rounded-3xl border ${column.border} bg-white dark:bg-white/5 backdrop-blur-xl min-h-[700px]`}
              >

                {/* Glow */}
                <div
                  className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl ${column.bg}`}
                />

                {/* Header */}
                <div className="relative z-10 p-5 border-b border-gray-200 dark:border-white/10">

                  <div className="flex items-center justify-between mb-4">

                    <div className="flex items-center gap-3">

                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${column.color} flex items-center justify-center shadow-lg`}
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
                          Task Workflow
                        </p>
                      </div>
                    </div>

                    <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-700 dark:text-slate-300">

                      {
                        tasksByStatus(
                          column.id
                        ).length
                      }
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                <div className="relative z-10 p-4 space-y-4">

                  {tasksByStatus(column.id)
                    .length === 0 ? (

                    <div className="rounded-2xl border border-dashed border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-8 text-center mt-4">

                      <div
                        className={`w-14 h-14 rounded-2xl ${column.bg} flex items-center justify-center mx-auto mb-4`}
                      >

                        <Icon
                          size={22}
                          className={
                            column.text
                          }
                        />
                      </div>

                      <p className="font-semibold text-gray-700 dark:text-slate-300 mb-1">
                        No Tasks
                      </p>

                      <p className="text-xs text-gray-500 dark:text-slate-500">
                        Tasks will appear here
                      </p>
                    </div>
                  ) : (
                    tasksByStatus(
                      column.id
                    ).map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        isAdmin={isAdmin}
                        currentUserId={
                          user?.id
                        }
                        projectId={
                          projectId
                        }
                        onStatusChange={(
                          status
                        ) =>
                          updateTask.mutate(
                            {
                              taskId:
                                task.id,
                              data: {
                                status
                              }
                            }
                          )
                        }
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {showTaskModal && (
        <CreateTaskModal
          projectId={projectId}
          members={
            project?.members || []
          }
          onClose={() =>
            setShowTaskModal(false)
          }
          onCreated={() =>
            qc.invalidateQueries([
              'project',
              projectId
            ])
          }
        />
      )}

      {showInviteModal && (
        <InviteMemberModal
          projectId={projectId}
          onClose={() =>
            setShowInviteModal(false)
          }
          onInvited={() =>
            qc.invalidateQueries([
              'project',
              projectId
            ])
          }
        />
      )}
    </div>
  );
}