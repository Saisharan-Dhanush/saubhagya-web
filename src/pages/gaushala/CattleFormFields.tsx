/**
 * Reusable form field components for cattle registration
 * BUGFIX: Extracted from AddCattle.tsx to prevent component re-creation causing input unfocus
 */

import { AlertCircle, Upload, X } from 'lucide-react';

export const InputField = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  error,
  className = '',
  ...props
}: any) => (
  <div className={`space-y-2 ${className}`}>
    <label className="block text-sm font-medium text-gray-800">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2 bg-white border rounded-lg transition-all duration-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 ${
        error ? 'border-red-300 bg-red-50' : 'border-gray-300'
      }`}
      {...props}
    />
    {error && (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <AlertCircle className="h-4 w-4" />
        {error}
      </div>
    )}
  </div>
);

export const SelectField = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  error,
  className = ''
}: any) => (
  <div className={`space-y-2 ${className}`}>
    <label className="block text-sm font-medium text-gray-800">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 bg-white border rounded-lg transition-all duration-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 ${
        error ? 'border-red-300 bg-red-50' : 'border-gray-300'
      }`}
    >
      <option value="">{placeholder}</option>
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <AlertCircle className="h-4 w-4" />
        {error}
      </div>
    )}
  </div>
);

export const TextAreaField = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  className = ''
}: any) => (
  <div className={`space-y-2 ${className}`}>
    <label className="block text-sm font-medium text-gray-800">
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg transition-all duration-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 resize-none"
    />
  </div>
);

export const FileUploadField = ({
  label,
  value,
  onChange,
  accept,
  className = ''
}: any) => (
  <div className={`space-y-2 ${className}`}>
    <label className="block text-sm font-medium text-gray-800">
      {label}
    </label>
    <div className="relative">
      <input
        type="file"
        accept={accept}
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        className="hidden"
        id={label.replace(/\s+/g, '-').toLowerCase()}
      />
      <label
        htmlFor={label.replace(/\s+/g, '-').toLowerCase()}
        className="flex items-center justify-center w-full px-3 py-2 bg-white border-2 border-dashed border-gray-300 rounded-lg transition-all duration-200 cursor-pointer hover:border-blue-400 hover:bg-blue-50 group"
      >
        <div className="flex items-center gap-3 text-gray-600 group-hover:text-blue-600">
          <Upload className="h-5 w-5" />
          <span className="text-sm font-medium">
            {value ? value.name : `Choose ${label.toLowerCase()}`}
          </span>
        </div>
      </label>
      {value && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  </div>
);
