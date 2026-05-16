// DashboardPage.jsx

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import api from '../api/axios';

import { useAuth } from '../context/AuthContext';

import {
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Layers3,
  ArrowRight,
  ListTodo,
  Activity,
  TrendingUp
} from 'lucide-react';

import { useState } from 'react';

import CreateProjectModal from '../components/CreateProjectModal';

export default function DashboardPage() {

  const { user } = useAuth();

  const qc = useQueryClient();

  const [showModal, setShowModal] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () =>
      api.get('/users/dashboard').then((r) => r.data)
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () =>
      api.get('/projects').then((r) => r.data)
  });

  const statusCount = (status) =>
    stats?.tasksByStatus?.find(
      (s) => s.status === status
    )?._count?.status || 0;

  const statCards = [
    {
      label: 'Projects',
      value: projects?.length || 0,
      icon: Layers3,
      color: 'text-pink-400',
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/20'
    },
    {
      label: 'To Do',
      value: statusCount('TODO'),
      icon: ListTodo,
      color: 'text-slate-400 dark:text-slate-300',
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/20'
    },
    {
      label: 'In Progress',
      value: statusCount('IN_PROGRESS'),
      icon: Clock3,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      label: 'Completed',
      value: statusCount('DONE'),
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      label: 'Overdue',
      value: stats?.overdueTasks || 0,
      icon: AlertCircle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-[#050816] dark:via-[#07112b] dark:to-[#140014] text-gray-900 dark:text-white p-6 lg:p-10 transition-colors duration-300">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl p-8 mb-8 shadow-[0_0_60px_rgba(236,72,153,0.08)]">

        {/* Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          {/* Left */}
          <div>

            <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 text-pink-500 dark:text-pink-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <Activity size={12} />
              Workspace Overview
            </div>

            <h1 className="text-4xl font-black tracking-tight mb-2">
              Welcome back,{' '}

              <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                {user?.name?.split(' ')[0]}
              </span>

              👋
            </h1>

            <p className="text-gray-500 dark:text-slate-400 max-w-xl">
              Track projects, monitor team progress, and manage tasks smarter with TaskVio.
            </p>
          </div>

          {/* Button */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 px-5 py-3 rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-pink-500/30 text-white"
          >

            <Plus size={18} />

            New Project
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-10">

        {statCards.map((card) => {

          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className={`relative overflow-hidden rounded-3xl border ${card.border} bg-white dark:bg-white/5 backdrop-blur-xl p-5 hover:translate-y-[-4px] transition-all duration-300`}
            >

              {/* Glow */}
              <div
                className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-3xl ${card.bg}`}
              />

              <div className="relative z-10">

                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${card.bg}`}
                >

                  <Icon
                    size={22}
                    className={card.color}
                  />
                </div>

                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">
                  {card.value}
                </h3>

                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {card.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">

        <div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Active Projects
          </h2>

          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
            Manage your team workspaces and project tasks
          </p>
        </div>

        <div className="flex items-center gap-2 text-pink-500 dark:text-pink-400 text-sm font-medium">

          <TrendingUp size={16} />

          {projects?.length || 0} Active
        </div>
      </div>

      {/* Empty */}
      {projects?.length === 0 ? (

        <div className="rounded-3xl border border-dashed border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl py-24 text-center">

          <div className="w-20 h-20 rounded-3xl bg-pink-500/10 flex items-center justify-center mx-auto mb-5">

            <Layers3
              size={34}
              className="text-pink-500 dark:text-pink-400"
            />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No projects yet
          </h3>

          <p className="text-gray-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Start by creating your first project workspace and collaborating with your team.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 px-6 py-3 rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-pink-500/30 text-white"
          >
            Create Project
          </button>
        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {projects?.map((project) => {

            const myRole = project.members.find(
              (m) => m.userId === user?.id
            )?.role;

            const doneTasks =
              project.tasks?.filter(
                (t) => t.status === 'DONE'
              ).length || 0;

            const totalTasks =
              project._count.tasks;

            const progress =
              totalTasks > 0
                ? Math.round(
                    (doneTasks / totalTasks) * 100
                  )
                : 0;

            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group relative overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl p-6 hover:border-pink-500/30 hover:translate-y-[-5px] transition-all duration-300 shadow-[0_0_40px_rgba(236,72,153,0.05)]"
              >

                {/* Glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative z-10">

                  {/* Top */}
                  <div className="flex items-start justify-between mb-5">

                    <div>

                      <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 text-pink-500 dark:text-pink-400 text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3">
                        {myRole}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-pink-500 dark:group-hover:text-pink-300 transition-colors">
                        {project.name}
                      </h3>
                    </div>

                    <ArrowRight
                      size={18}
                      className="text-gray-400 dark:text-slate-500 group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors"
                    />
                  </div>

                  {/* Desc */}
                  <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-2 min-h-[42px] mb-5">
                    {project.description ||
                      'No description provided'}
                  </p>

                  {/* Progress */}
                  <div className="mb-5">

                    <div className="flex items-center justify-between text-xs mb-2">

                      <span className="text-gray-500 dark:text-slate-400">
                        Progress
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

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm">

                    <div className="flex items-center gap-4 text-gray-500 dark:text-slate-400">
                      <span>{totalTasks} tasks</span>
                      <span>{project.members.length} members</span>
                    </div>

                    <div className="text-pink-500 dark:text-pink-400 font-semibold">
                      Open →
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onCreated={() =>
            qc.invalidateQueries(['projects'])
          }
        />
      )}
    </div>
  );
}