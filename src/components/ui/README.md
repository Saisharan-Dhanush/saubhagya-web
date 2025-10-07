# UI Components - Phase 4 Implementation

This directory contains reusable UI components for the SAUBHAGYA Admin Portal.

## New Components (Phase 4)

### LoadingSpinner

A reusable loading spinner component with customizable size and optional message.

**Usage:**
```tsx
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Basic usage
<LoadingSpinner />

// With size and message
<LoadingSpinner size="lg" message="Loading data..." />

// Small spinner
<LoadingSpinner size="sm" />
```

**Props:**
- `size?: 'sm' | 'md' | 'lg'` - Size of the spinner (default: 'md')
- `message?: string` - Optional message to display below the spinner
- `className?: string` - Additional CSS classes

### ErrorAlert

A professional error display component with optional retry and dismiss actions.

**Usage:**
```tsx
import { ErrorAlert } from '@/components/ui/error-alert';

// Basic usage
<ErrorAlert error="Failed to load data" />

// With retry action
<ErrorAlert
  error={error}
  onRetry={() => refetchData()}
/>

// With both retry and dismiss
<ErrorAlert
  error="Network error occurred"
  title="Connection Failed"
  onRetry={() => retryConnection()}
  onDismiss={() => setError(null)}
/>
```

**Props:**
- `error: string | Error` - Error message or Error object
- `onRetry?: () => void` - Optional retry callback
- `onDismiss?: () => void` - Optional dismiss callback
- `title?: string` - Optional title (default: "Error")
- `className?: string` - Additional CSS classes

## Toast System

The toast system is powered by **sonner** and configured in `App.tsx`.

**Usage:**
```tsx
import { toast } from 'sonner';

// Success toast
toast.success('Profile updated successfully');

// Error toast
toast.error('Failed to save changes');

// Info toast
toast.info('New data available');

// Warning toast
toast.warning('Session will expire soon');

// Loading toast
const toastId = toast.loading('Saving changes...');
// Later dismiss it
toast.dismiss(toastId);
```

## 401 Error Handling

The microservices client automatically handles 401 Unauthorized errors:

1. Clears all authentication tokens
2. Shows error toast: "Session expired. Please login again."
3. Redirects to login page with current URL preserved for redirect after re-login

**Implementation Location:**
- `src/services/microservices/index.ts`
- Applied to all HTTP methods (GET, POST, PUT, DELETE)
- Works for both `MicroservicesClient.callService()` and all service-specific clients

**Example:**
```tsx
// When a 401 is received:
// 1. localStorage cleared (accessToken, refreshToken, saubhagya_jwt_token, user, sessionStart)
// 2. User redirected to: /login?redirect=/current/path
// 3. Toast shown: "Session expired. Please login again."
```

## Component Architecture

All components follow these principles:

1. **TypeScript strict mode** - Full type safety
2. **shadcn/ui compatible** - Uses existing design system
3. **Accessibility** - Proper ARIA attributes and semantic HTML
4. **Customizable** - Accept className for custom styling
5. **Documented** - JSDoc comments and examples
