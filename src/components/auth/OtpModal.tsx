'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormikField } from '../forms/FormikField';
import { useVerifyOtpMutation, useResendOtpMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/store';
import { setCredentials } from '@/store/slices/authSlice';
import { ShieldCheck, RefreshCw, X } from 'lucide-react';

interface OtpModalProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
  onSuccess: () => void;
}

const otpSchema = Yup.object().shape({
  code: Yup.string()
    .required('OTP code is required')
    .length(6, 'OTP must be exactly 6 digits'),
});

export const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  email,
  onClose,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 mins in seconds

  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(600);
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const handleResend = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res: any = await resendOtp({ email }).unwrap();
      setSuccessMessage(res.message || 'A fresh 6-digit OTP code has been sent to your email.');
      setTimeLeft(600);
    } catch (err: any) {
      setErrorMessage(err?.data || 'Failed to resend OTP code.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Verify Email Address</h2>
          <p className="text-sm text-slate-600">
            We sent a 6-digit verification code to <span className="font-semibold text-slate-900">{email}</span>
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
            {successMessage}
          </div>
        )}

        <Formik
          initialValues={{ code: '' }}
          validationSchema={otpSchema}
          onSubmit={async (values) => {
            setErrorMessage(null);
            try {
              const res: any = await verifyOtp({ email, code: values.code }).unwrap();
              dispatch(setCredentials({ user: res.data.user, accessToken: res.data.accessToken }));
              onSuccess();
            } catch (err: any) {
              setErrorMessage(err?.data || 'Invalid or expired OTP code.');
            }
          }}
        >
          {() => (
            <Form className="space-y-4">
              <FormikField
                name="code"
                label="Enter 6-Digit OTP Code"
                placeholder="123456"
                required
                className="text-center text-xl tracking-widest font-mono font-bold"
              />

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Code expires in: <strong className="text-amber-600 font-mono">{formattedTime}</strong></span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-amber-600 font-semibold hover:underline flex items-center gap-1 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                  Resend Code
                </button>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 rounded-xl shadow-lg transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isVerifying ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
