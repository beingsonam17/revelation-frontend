'use client';

import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { FormikField } from '@/components/forms/FormikField';
import { useCreateInquiryMutation } from '@/store/api/inquiryApi';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';

const contactSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Valid email address required').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  message: Yup.string().required('Message is required'),
});

export default function ContactPage() {
  const [createInquiry, { isLoading }] = useCreateInquiryMutation();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <PublicHeader />

      {/* Header Banner */}
      <section className="py-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-500">Get In Touch</span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">Contact Our Expert Team</h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Have a question or need emergency pest control dispatch in Kathmandu Valley? We are available 24/7.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Details */}
          <div className="space-y-8 bg-slate-900/80 border border-slate-800 p-8 rounded-3xl">
            <h2 className="text-2xl font-extrabold text-white">24/7 Helpline & Location</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-white text-base">Emergency Call (24/7)</h3>
                  <a href="tel:+9779863847696" className="text-amber-400 font-extrabold text-base sm:text-lg hover:underline break-all block">
                    +977 9863847696
                  </a>
                  <p className="text-xs text-slate-400 mt-0.5">Available 24 hours a day, 7 days a week</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-white text-base">Email Support</h3>
                  <a href="mailto:info@revelationpestcontrol.com" className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-amber-400 break-all block">
                    info@revelationpestcontrol.com
                  </a>
                  <p className="text-xs text-slate-400 mt-0.5">Responses within 1 hour</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-white text-base">Service Region</h3>
                  <p className="text-sm font-semibold text-slate-300">Kathmandu Valley, Nepal</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">Kathmandu, Lalitpur, Bhaktapur & Surrounding Districts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Formik Form */}
          <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
            <h2 className="text-2xl font-extrabold text-white">Send Us a Message</h2>

            {isSuccess ? (
              <div className="p-6 bg-emerald-950/40 border border-emerald-800 text-center rounded-2xl space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Message Sent Successfully!</h3>
                <p className="text-xs text-slate-300">Thank you for reaching out. Our team will get back to you shortly.</p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <Formik
                initialValues={{ name: '', email: '', phone: '', serviceRequested: '', message: '' }}
                validationSchema={contactSchema}
                onSubmit={async (values, { resetForm }) => {
                  setErrorMessage(null);
                  try {
                    await createInquiry(values).unwrap();
                    setIsSuccess(true);
                    resetForm();
                  } catch (err: any) {
                    setErrorMessage(err?.data || 'Failed to send inquiry.');
                  }
                }}
              >
                {() => (
                  <Form className="space-y-4">
                    {errorMessage && (
                      <div className="p-3 text-xs text-red-400 bg-red-950/40 border border-red-800 rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <FormikField name="name" label="Your Name" placeholder="John Doe" required />
                    <FormikField name="email" label="Email Address" type="email" placeholder="john@example.com" required />
                    <FormikField name="phone" label="Phone Number" placeholder="+977 9863847696" required />
                    <FormikField
                      name="message"
                      label="Your Message"
                      type="textarea"
                      placeholder="How can we assist you with pest control?"
                      required
                      rows={4}
                    />

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition duration-200 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                    >
                      {isLoading ? 'Sending Message...' : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
