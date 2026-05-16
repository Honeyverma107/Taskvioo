// ProjectsPage.jsx

import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';

import { Link } from 'react-router-dom';

import api from '../api/axios';

import { useAuth } from '../context/AuthContext';

import {
  Plus,
  ArrowUpRight,
  Layers3,
  Trash2,
  CheckCircle2,
  Users,
  Sparkles,
  Activity
} from 'lucide-react';

import { useState } from 'react';

import CreateProjectModal from '../components/CreateProjectModal';

const COLORS = [
  'from-pink-500 to-rose-500',
  'from-fuchsia-500 to-pink-500',
  'from-rose-500 to-orange-500',
  'from-purple-500 to-pink-500'
];

function getGradient(id) {
  return COLORS[
    (id?.charCodeAt(0) || 0) % COLORS.length
  ];
}

function getInitials(name) {
  return (
    name
      ?.split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'
  );
}

export default function ProjectsPage() {

  const { user } = useAuth();

  const qc = useQueryClient();

  const [showModal, setShowModal] =
    useState(false);

  const [confirmDelete, setConfirmDelete] =
    useState(null);

  const { data: projects, isLoading } =
    useQuery({
      queryKey: ['projects'],
      queryFn: () =>
        api.get('/projects').then((r) => r.data)
    });

  const deleteProject = useMutation({
    mutationFn: (id) =>
      api.delete(`/projects/${id}`),

    onSuccess: () => {

      qc.invalidateQueries(['projects']);

      setConfirmDelete(null);
    }
  });

  const totalTasks =
    projects?.reduce(
      (sum, p) => sum + (p._count?.tasks || 0),
      0
    ) || 0;

  const adminProjects =
    projects?.filter(
      (p) =>
        p.members.find(
          (m) => m.userId === user?.id
        )?.role === 'ADMIN'
    ).length || 0;

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

              <Sparkles size={12} />

              Workspace Projects
            </div>

            <h1 className="text-4xl font-black tracking-tight mb-2">
              Team Projects
            </h1>

            <p className="text-gray-500 dark:text-slate-400 max-w-xl">
              Create, organize, and track all your project workspaces in one place.
            </p>
          </div>

          {/* Button */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 px-5 py-3 rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-pink-500/30 text-white"
          >

            <Plus size={18} />

            New Project
          </button>
        </div>
      </div>

      {/* Stats */}
      {!isLoading &&
        projects?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">

            {[
              {
                label: 'Projects',
                value: projects.length,
                icon: Layers3,
                color: 'text-pink-400',
                bg: 'bg-pink-500/10'
              },
              {
                label: 'Tasks',
                value: totalTasks,
                icon: CheckCircle2,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10'
              },
              {
                label: 'Admin Access',
                value: adminProjects,
                icon: Users,
                color: 'text-blue-400',
                bg: 'bg-blue-500/10'
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

                  <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">
                    {item.value}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-24">

          <div className="w-10 h-10 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"></div>
        </div>
      )}

      {/* Empty */}
      {!isLoading &&
        projects?.length === 0 && (
          <div className="rounded-3xl border border-dashed border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl py-24 text-center">

            <div className="w-20 h-20 rounded-3xl bg-pink-500/10 flex items-center justify-center mx-auto mb-5">

              <Layers3
                size={34}
                className="text-pink-500 dark:text-pink-400"
              />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Projects Yet
            </h3>

            <p className="text-gray-500 dark:text-slate-400 mb-6">
              Create your first workspace and start managing tasks.
            </p>

            <button
              onClick={() =>
                setShowModal(true)
              }
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 px-6 py-3 rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-pink-500/30 text-white"
            >
              Create Project
            </button>
          </div>
        )}

      {/* Projects Grid */}
      {!isLoading &&
        projects?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {projects.map((project) => {

              const myRole =
                project.members.find(
                  (m) =>
                    m.userId === user?.id
                )?.role;

              const isAdmin =
                myRole === 'ADMIN';

              const gradient =
                getGradient(project.id);

              const total =
                project._count?.tasks || 0;

              const done =
                project.tasks?.filter(
                  (t) =>
                    t.status === 'DONE'
                ).length || 0;

              const progress =
                total > 0
                  ? Math.round(
                      (done / total) * 100
                    )
                  : 0;

              return (
                <div
                  key={project.id}
                  className="group relative overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl p-6 hover:border-pink-500/30 transition-all duration-300 hover:translate-y-[-5px]"
                >

                  {/* Glow */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  {/* Delete */}
                  {isAdmin && (
                    <button
                      onClick={() =>
                        setConfirmDelete(
                          project
                        )
                      }
                      className="absolute top-5 right-5 z-20 p-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-400 dark:text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                    >

                      <Trash2 size={15} />
                    </button>
                  )}

                  <Link
                    to={`/projects/${project.id}`}
                  >

                    <div className="relative z-10">

                      {/* Header */}
                      <div className="flex items-start gap-4 mb-5">

                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg shadow-pink-500/20`}
                        >

                          <span className="text-white font-bold">
                            {getInitials(
                              project.name
                            )}
                          </span>
                        </div>

                        <div className="flex-1">

                          <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 text-pink-500 dark:text-pink-400 text-[11px] font-semibold px-2.5 py-1 rounded-full mb-2">

                            <Activity size={10} />

                            {myRole}
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-pink-500 dark:group-hover:text-pink-300 transition-colors">
                            {project.name}
                          </h3>
                        </div>

                        <ArrowUpRight
                          size={18}
                          className="text-gray-400 dark:text-slate-500 group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors"
                        />
                      </div>

                      {/* Desc */}
                      <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-2 min-h-[44px] mb-5">
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
                            className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                            style={{
                              width: `${progress}%`
                            }}
                          />
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-sm">

                        <div className="flex items-center gap-4 text-gray-500 dark:text-slate-400">
                          <span>{total} tasks</span>
                          <span>
                            {
                              project.members
                                .length
                            }{' '}
                            members
                          </span>
                        </div>

                        <div className="text-pink-500 dark:text-pink-400 font-semibold">
                          Open →
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

      {/* Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-sm rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0b1220] p-6 shadow-[0_0_60px_rgba(236,72,153,0.15)]">

            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-5">

              <Trash2
                size={24}
                className="text-red-400"
              />
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Delete Project?
            </h3>

            <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
              This action cannot be undone. All tasks inside this project will also be removed.
            </p>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setConfirmDelete(null)
                }
                className="flex-1 border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 py-3 rounded-2xl text-sm font-semibold transition-all text-gray-700 dark:text-white"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  deleteProject.mutate(
                    confirmDelete.id
                  )
                }
                className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 py-3 rounded-2xl text-sm font-semibold transition-all text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CreateProjectModal
          onClose={() =>
            setShowModal(false)
          }
          onCreated={() =>
            qc.invalidateQueries([
              'projects'
            ])
          }
        />
      )}
    </div>
  );
}