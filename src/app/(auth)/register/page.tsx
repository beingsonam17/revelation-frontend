'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormikField } from '@/components/forms/FormikField';
import { useRegisterMutation } from '@/store/api/authApi';
import { OtpModal } from '@/components/auth/OtpModal';
import { Mail, Lock, User, Phone, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

const registerSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Please enter a valid email address').required('Email address is required'),
  phone: Yup.string().required('Phone number is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function RegisterPage() {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string>('');
  const [isOtpOpen, setIsOtpOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12 relative overflow-hidden">
      {/* Background Glowing Spheres */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 text-amber-500 font-extrabold text-xl tracking-tight">
            <ShieldCheck className="w-8 h-8 text-amber-500" />
            <span>Revelation Pest Control</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-white">Create Account</h1>
          <p className="text-sm text-slate-400">
            Sign up to get instant quotes & 24/7 pest management
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 text-sm text-red-400 bg-red-950/40 border border-red-800/60 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <Formik
          initialValues={{
            fullName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={registerSchema}
          onSubmit={async (values) => {
            setErrorMessage(null);
            try {
              await register({
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                password: values.password,
              }).unwrap();
              setRegisteredEmail(values.email);
              setIsOtpOpen(true);
            } catch (err: any) {
              setErrorMessage(err?.data || 'Registration failed. Email may already be in use.');
            }
          }}
        >
          {() => (
            <Form className="space-y-4">
              <FormikField
                name="fullName"
                label="Full Name"
                placeholder="John Doe"
                required
                leftIcon={<User className="w-4 h-4 text-slate-400" />}
              />

              <FormikField
                name="email"
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                required
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              />

              <FormikField
                name="phone"
                label="Phone Number"
                placeholder="+977 9863847696"
                required
                leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
              />

              <FormikField
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                required
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              />

              <FormikField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                required
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  'Creating Account...'
                ) : (
                  <>
                    <span>Register Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </Form>
          )}
        </Formik>

        <div className="text-center text-sm text-slate-400 pt-2 border-t border-slate-700/60">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-amber-400 hover:text-amber-300 underline">
            Sign In
          </Link>
        </div>
      </div>

      <OtpModal
        isOpen={isOtpOpen}
        email={registeredEmail}
        onClose={() => setIsOtpOpen(false)}
        onSuccess={() => {
          setIsOtpOpen(false);
          router.push('/dashboard');
        }}
      />
    </div>
  );
}
