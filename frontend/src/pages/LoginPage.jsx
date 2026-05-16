// LoginPage.jsx

import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';

import { useState } from 'react';

import {
  CheckSquare,
  Moon,
  Sun,
  Mail,
  Lock,
  AlertCircle,
  UserX,
  Sparkles
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();
  const { dark, toggle } = useTheme();

  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setError('');
      setErrorType('');

      const res = await api.post('/auth/login', data);

      login(res.data.token, res.data.user);

      navigate('/');
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.error;

      if (status === 401) {
        setErrorType('wrong_password');
        setError('Incorrect email or password.');
      } else if (status === 404 || message === 'User not found') {
        setErrorType('not_found');
        setError('No account found with this email.');
      } else {
        setErrorType('general');
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-[#050816] dark:via-[#07112b] dark:to-[#140014] flex items-center justify-center px-4 py-10 transition-colors">

      {/* Background Glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[280px] h-[280px] bg-pink-500/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[280px] h-[280px] bg-fuchsia-500/30 rounded-full blur-3xl"></div>

      {/* Theme Toggle */}
      <button
        onClick={toggle}
        className="fixed top-5 right-5 z-50 p-2.5 rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur border border-white/10 text-gray-300 hover:scale-105 transition-all"
      >
        {dark ? (
          <Sun size={18} className="text-yellow-400" />
        ) : (
          <Moon size={18} />
        )}
      </button>

      {/* Card */}
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 dark:border-white/10 bg-white/80 dark:bg-[#0b1220]/80 backdrop-blur-xl shadow-[0_0_60px_rgba(236,72,153,0.15)] p-8">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
            <CheckSquare size={24} className="text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
              TaskVio
            </h1>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Smart Team Task Management
            </p>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <Sparkles size={12} />
            Welcome Back
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Sign in
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Continue managing your projects and tasks.
          </p>
        </div>

        {/* Errors */}
        {error && (
          <div
            className={`mb-5 rounded-xl border p-3 flex items-start gap-3 ${
              errorType === 'not_found'
                ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
            }`}
          >
            {errorType === 'not_found' ? (
              <UserX size={18} className="text-yellow-500 mt-0.5" />
            ) : (
              <AlertCircle size={18} className="text-red-500 mt-0.5" />
            )}

            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {errorType === 'not_found'
                  ? 'Account not found'
                  : 'Authentication failed'}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                {...register('email', {
                  required: 'Email is required'
                })}
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-white pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                {...register('password', {
                  required: 'Password is required'
                })}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-white pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 text-sm font-semibold hover:from-pink-600 hover:to-rose-600 active:scale-[0.99] transition-all shadow-lg shadow-pink-500/30 disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 rounded-2xl border border-dashed border-pink-500/40 bg-pink-500/5 p-4">
          <p className="text-xs font-semibold text-pink-400 mb-2">
            Demo Credentials
          </p>

          <div className="space-y-1 text-xs text-gray-400">
            <p>
              <span className="font-semibold">Admin:</span> admin@taskvio.com
            </p>

            <p>
              <span className="font-semibold">Password:</span> 123456
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold text-pink-500 hover:text-pink-400"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}