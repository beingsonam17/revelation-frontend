'use client';

import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAppSelector } from '@/store';
import { useCreateTestimonialMutation } from '@/store/api/testimonialsApi';
import { FormikField } from '@/components/forms/FormikField';
import { Star, X, CheckCircle2, AlertCircle, Loader2, User, Mail, ShieldCheck } from 'lucide-react';

const reviewSchema = Yup.object().shape({
  name: Yup.string().required('Your name is required'),
  email: Yup.string().email('Enter a valid email address').required('Email is required'),
  rating: Yup.number().min(1, 'Please select at least 1 star').max(5).required('Rating is required'),
  serviceTitle: Yup.string(),
  roleOrLocation: Yup.string(),
  title: Yup.string().required('Review title is required'),
  comment: Yup.string().min(10, 'Feedback must be at least 10 characters').required('Feedback is required'),
});

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const [createTestimonial, { isLoading }] = useCreateTestimonialMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Ambient Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">Write a Client Review</h3>
              <p className="text-xs text-slate-400">Share your pest control service experience with us</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-extrabold text-white">Thank You for Your Feedback!</h4>
              <p className="text-sm text-slate-300">
                Your verified review has been submitted successfully and published on our platform.
              </p>
            </div>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition"
            >
              Close Window
            </button>
          </div>
        ) : (
          <>
            {errorMessage && (
              <div className="p-3.5 text-sm text-red-400 bg-red-950/40 border border-red-800/60 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Formik
              enableReinitialize
              initialValues={{
                name: user?.fullName || '',
                email: user?.email || '',
                rating: 5,
                serviceTitle: 'General Pest Control',
                roleOrLocation: user?.role === 'ADMIN' ? 'Verified Client' : 'Homeowner in Kathmandu',
                title: '',
                comment: '',
              }}
              validationSchema={reviewSchema}
              onSubmit={async (values) => {
                setErrorMessage(null);
                try {
                  await createTestimonial(values).unwrap();
                  setIsSuccess(true);
                  if (onSuccess) onSuccess();
                } catch (err: any) {
                  setErrorMessage(err?.data || 'Failed to submit review. Please try again.');
                }
              }}
            >
              {({ values, setFieldValue }) => (
                <Form className="space-y-4">
                  {/* Star Picker */}
                  <div className="space-y-1.5 text-center sm:text-left">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Overall Rating <span className="text-amber-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 justify-center sm:justify-start pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFieldValue('rating', star)}
                          className="p-1 transition hover:scale-110 focus:outline-none"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= values.rating
                                ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                : 'text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-sm font-bold text-amber-400 ml-2">
                        {values.rating}/5 Stars
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormikField
                      name="name"
                      label="Your Full Name"
                      placeholder="e.g. Ramesh Thapa"
                      required
                      leftIcon={<User className="w-4 h-4 text-slate-400" />}
                    />
                    <FormikField
                      name="email"
                      label="Email Address"
                      type="email"
                      placeholder="ramesh@example.com"
                      required
                      leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormikField
                      name="roleOrLocation"
                      label="Role / Location (Optional)"
                      placeholder="e.g. Homeowner, Jhamsikhel"
                    />
                    <FormikField
                      name="serviceTitle"
                      label="Service Used"
                      placeholder="e.g. Bed Bug / Termite Control"
                    />
                  </div>

                  <FormikField
                    name="title"
                    label="Review Headline"
                    placeholder="e.g. Outstanding service & professional team!"
                    required
                  />

                  <FormikField
                    name="comment"
                    label="Detailed Experience / Feedback"
                    type="textarea"
                    placeholder="Describe how Revelation Pest Control solved your pest problem..."
                    rows={3}
                    required
                  />

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-xl border border-slate-700 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-500/20 transition disabled:opacity-50 flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Submit Verified Review</span>
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </>
        )}
      </div>
    </div>
  );
};
