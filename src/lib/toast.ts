/**
 * Toast Utilities
 *
 * Re-exports toast from sonner for consistent usage across the app
 * The Toaster component is already configured in App.tsx with position="top-right"
 */

export { toast } from 'sonner';

/**
 * Common toast patterns for the application
 */
export const showSuccessToast = (message: string) => {
  const { toast } = require('sonner');
  toast.success(message);
};

export const showErrorToast = (message: string) => {
  const { toast } = require('sonner');
  toast.error(message);
};

export const showInfoToast = (message: string) => {
  const { toast } = require('sonner');
  toast.info(message);
};

export const showWarningToast = (message: string) => {
  const { toast } = require('sonner');
  toast.warning(message);
};

export const showLoadingToast = (message: string) => {
  const { toast } = require('sonner');
  return toast.loading(message);
};
