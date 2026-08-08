'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormikField } from '@/components/forms/FormikField';
import { useForgotPasswordMutation, useResetPasswordMutation } from '@/store/api/authApi';
import { Mail, Lock, KeyRound, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

const forgotSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
});

const resetSchema = Yup.object().shape({
  code: Yup.string()
    .length(6, 'OTP code must be 6 digits')
    .required('OTP code is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [forgotPassword, { isLoading: isSendingOtp }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const [step, setStep] = useState<1 | 2>(1);
  const [userEmail, setUserEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 text-amber-500 font-extrabold text-xl tracking-tight">
            <ShieldCheck className="w-8 h-8 text-amber-500" />
            <span>Revelation Pest Control</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white">
            {step === 1 ? 'Reset Your Password' : 'Verify OTP & Set New Password'}
          </h1>
          <p className="text-xs text-slate-400">
            {step === 1
              ? 'Enter your registered email address to receive a 6-digit verification code.'
              : `We sent a 6-digit OTP code to ${userEmail}`}
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Step 1: Send OTP */}
        {step === 1 && (
          <Formik
            initialValues={{ email: userEmail }}
            validationSchema={forgotSchema}
            onSubmit={async (values) => {
              setErrorMessage(null);
              setSuccessMessage(null);
              try {
                const res: any = await forgotPassword({ email: values.email }).unwrap();
                setUserEmail(values.email);
                setSuccessMessage(res.message || 'OTP sent successfully.');
                setStep(2);
              } catch (err: any) {
                setErrorMessage(err?.data || 'Failed to send OTP. Please check your email.');
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

                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  {isSendingOtp ? 'Sending OTP Code...' : 'Send Verification OTP'}
                </button>
              </Form>
            )}
          </Formik>
        )}

        {/* Step 2: Reset Password with OTP */}
        {step === 2 && (
          <Formik
            initialValues={{ code: '', password: '', confirmPassword: '' }}
            validationSchema={resetSchema}
            onSubmit={async (values) => {
              setErrorMessage(null);
              setSuccessMessage(null);
              try {
                await resetPassword({
                  email: userEmail,
                  code: values.code,
                  password: values.password,
                }).unwrap();

                setSuccessMessage('Password reset successfully! Redirecting to login...');
                setTimeout(() => router.push('/login'), 2000);
              } catch (err: any) {
                setErrorMessage(err?.data || 'Invalid OTP code or expired session.');
              }
            }}
          >
            {() => (
              <Form className="space-y-5">
                <FormikField
                  name="code"
                  label="6-Digit OTP Code"
                  type="text"
                  placeholder="123456"
                  required
                  leftIcon={<KeyRound className="w-4 h-4 text-slate-400" />}
                />

                <FormikField
                  name="password"
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  required
                  leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                />

                <FormikField
                  name="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  required
                  leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                />

                <button
                  type="submit"
                  disabled={isResetting}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  {isResetting ? 'Resetting Password...' : 'Reset Password'}
                </button>

                <div className="flex justify-between items-center text-xs text-slate-400 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="hover:text-amber-400 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Email</span>
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-700/60">
          Remember your password?{' '}
          <Link href="/login" className="font-semibold text-amber-400 hover:text-amber-300 underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
