/**
 * Toast Utilities
 *
 * Re-exports toast from sonner for consistent usage across the app
 * The Toaster component is already configured in App.tsx with position="top-right"
 */

import { toast } from 'sonner';

export { toast };

/**
 * Common toast patterns for the application
 */
export const showSuccessToast = (message: string) => {
  toast.success(message);
};

export const showErrorToast = (message: string) => {
  toast.error(message);
};

export const showInfoToast = (message: string) => {
  toast.info(message);
};

export const showWarningToast = (message: string) => {
  toast.warning(message);
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message);
};
