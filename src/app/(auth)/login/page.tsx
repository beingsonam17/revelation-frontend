'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormikField } from '@/components/forms/FormikField';
import { useLoginMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/store';
import { setCredentials } from '@/store/slices/authSlice';
import { Mail, Lock, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  password: Yup.string()
    .required('Password is required'),
});

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12 relative overflow-hidden">
      {/* Dynamic Background Glowing Spheres */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 text-amber-500 font-extrabold text-xl tracking-tight">
            <ShieldCheck className="w-8 h-8 text-amber-500" />
            <span>Revelation Pest Control</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-white">Welcome Back</h1>
          <p className="text-sm text-slate-400">
            Sign in to manage your pest control bookings and services
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 text-sm text-red-400 bg-red-950/40 border border-red-800/60 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={async (values) => {
            setErrorMessage(null);
            try {
              const res: any = await login(values).unwrap();
              dispatch(setCredentials({ user: res.data.user, accessToken: res.data.accessToken }));
              if (res.data.user.role === 'SUPER_ADMIN') {
                router.push('/superadmin');
              } else if (res.data.user.role === 'ADMIN') {
                router.push('/admin');
              } else {
                router.push('/dashboard');
              }
            } catch (err: any) {
              setErrorMessage(err?.data || 'Invalid email or password. Please try again.');
            }
          }}
        >
          {() => (
            <Form className="space-y-5">
              <FormikField
                name="email"
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                required
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              />

              <FormikField
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                required
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500" />
                  Remember me
                </label>
                <Link href="/forgot-password" className="text-amber-400 hover:text-amber-300 transition">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  'Signing in...'
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </Form>
          )}
        </Formik>

        <div className="text-center text-sm text-slate-400 pt-2 border-t border-slate-700/60">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-amber-400 hover:text-amber-300 underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
