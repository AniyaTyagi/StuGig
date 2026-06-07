import React, { useState } from 'react';
import axios from 'axios';

const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }[size];

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClass} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}></div>
    </div>
  );
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg'
  };

  return (
    <button
      className={`${variants[variant]} ${sizes[size]} rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoadingSpinner size="sm" /> : null}
      {children}
    </button>
  );
};

const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`} {...props}>
    {children}
  </div>
);

const Input = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    {label && <label className="text-sm font-medium text-gray-900">{label}</label>}
    <input
      className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      {...props}
    />
    {error && <span className="text-sm text-red-600">{error}</span>}
    {helperText && <span className="text-sm text-gray-500">{helperText}</span>}
  </div>
);

const Select = ({
  label,
  options,
  error,
  className = '',
  ...props
}) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    {label && <label className="text-sm font-medium text-gray-900">{label}</label>}
    <select
      className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <span className="text-sm text-red-600">{error}</span>}
  </div>
);

const Textarea = ({
  label,
  error,
  helperText,
  className = '',
  rows = 4,
  ...props
}) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    {label && <label className="text-sm font-medium text-gray-900">{label}</label>}
    <textarea
      rows={rows}
      className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      {...props}
    />
    {error && <span className="text-sm text-red-600">{error}</span>}
    {helperText && <span className="text-sm text-gray-500">{helperText}</span>}
  </div>
);

const Modal = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <Card className="w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          {children}
          {actions && (
            <div className="flex justify-end gap-4 mt-6">
              {actions}
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    default: 'bg-gray-200 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Alert = ({ variant = 'info', title, message, onClose }) => {
  const variants = {
    success: 'bg-green-50 border-l-4 border-green-500 text-green-700',
    error: 'bg-red-50 border-l-4 border-red-500 text-red-700',
    warning: 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700',
    info: 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
  };

  return (
    <div className={`p-4 rounded-lg ${variants[variant]} flex justify-between items-start`}>
      <div>
        {title && <h4 className="font-semibold">{title}</h4>}
        {message && <p className="text-sm">{message}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} className="text-xl font-bold opacity-50 hover:opacity-100">
          ✕
        </button>
      )}
    </div>
  );
};

const Rating = ({ value, onChange, size = 'md', readOnly = false }) => {
  const [hoverValue, setHoverValue] = useState(0);
  const sizeClass = size === 'sm' ? 'text-xl' : 'text-3xl';

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHoverValue(star)}
          onMouseLeave={() => !readOnly && setHoverValue(0)}
          className={`${sizeClass} transition-colors ${
            (hoverValue || value) >= star ? 'text-yellow-400' : 'text-gray-300'
          } ${!readOnly && 'cursor-pointer'}`}
          disabled={readOnly}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export {
  LoadingSpinner,
  Button,
  Card,
  Input,
  Select,
  Textarea,
  Modal,
  Badge,
  Alert,
  Rating
};
