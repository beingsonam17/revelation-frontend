'use client';

import React from 'react';
import { useField } from 'formik';
import { AlertCircle } from 'lucide-react';

interface FormikFieldProps {
  name: string;
  id?: string;
  label: string;
  labelRight?: React.ReactNode;
  type?: 'text' | 'email' | 'number' | 'password' | 'textarea';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const FormikField: React.FC<FormikFieldProps> = ({
  name,
  id,
  label,
  labelRight,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  rows = 3,
  className = '',
  leftIcon,
  rightIcon,
}) => {
  const [field, meta] = useField(name);
  const hasError = !!(meta.touched && meta.error);
  const fieldId = id || name;

  const baseInputClassName = `w-full rounded-lg border px-3 py-2 text-sm transition outline-none focus:ring-2 ${
    hasError
      ? 'border-red-500 bg-red-50/20 text-red-900 focus:border-red-500 focus:ring-red-200'
      : 'border-slate-300 bg-white text-slate-900 focus:border-amber-500 focus:ring-amber-200'
  } ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''} ${className}`;

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
        <label htmlFor={fieldId}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {labelRight}
      </div>
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}
        {type === 'textarea' ? (
          <textarea
            {...field}
            id={fieldId}
            placeholder={placeholder}
            className={`${baseInputClassName} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
            disabled={disabled}
            rows={rows}
          />
        ) : (
          <input
            {...field}
            id={fieldId}
            type={type}
            placeholder={placeholder}
            className={`${baseInputClassName} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
            disabled={disabled}
          />
        )}
        {rightIcon && (
          <div className="absolute right-3 flex items-center text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>
      {hasError && (
        <p className="text-xs font-medium text-red-600 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {meta.error}
        </p>
      )}
    </div>
  );
};
