/**
 * Phase 4 Implementation Example
 *
 * This file demonstrates the new components and features from Phase 4:
 * - LoadingSpinner component
 * - ErrorAlert component
 * - Toast notifications
 * - 401 error handling
 *
 * This is for demonstration/testing purposes only.
 */

import React, { useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorAlert } from '@/components/ui/error-alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { microservicesClient } from '@/services/microservices';

export const Phase4Example: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Example 1: LoadingSpinner Demo
  const handleLoadingDemo = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => setLoading(false), 3000);
  };

  // Example 2: ErrorAlert Demo
  const handleErrorDemo = () => {
    setLoading(false);
    setError('This is a sample error message. Click Retry to try again.');
  };

  // Example 3: Toast Notifications Demo
  const handleToastDemo = (type: 'success' | 'error' | 'info' | 'warning' | 'loading') => {
    switch (type) {
      case 'success':
        toast.success('Operation completed successfully!');
        break;
      case 'error':
        toast.error('An error occurred. Please try again.');
        break;
      case 'info':
        toast.info('Here is some helpful information.');
        break;
      case 'warning':
        toast.warning('Warning: This action requires attention.');
        break;
      case 'loading':
        const toastId = toast.loading('Processing your request...');
        setTimeout(() => {
          toast.dismiss(toastId);
          toast.success('Request completed!');
        }, 2000);
        break;
    }
  };

  // Example 4: 401 Error Simulation
  const handle401Demo = async () => {
    try {
      // This will trigger 401 handling if the token is invalid
      await microservicesClient.callService('auth-service', '/auth/api/v1/protected-endpoint');
    } catch (error) {
      console.log('401 error handled:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Phase 4: Token Management & Error Handling</h1>
        <p className="text-muted-foreground">
          Demonstration of new components and features implemented in Phase 4
        </p>
      </div>

      {/* Loading Spinner Examples */}
      <Card>
        <CardHeader>
          <CardTitle>1. LoadingSpinner Component</CardTitle>
          <CardDescription>
            Reusable loading spinner with customizable size and optional message
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-2 p-4 border rounded">
              <p className="text-sm font-medium">Small</p>
              <LoadingSpinner size="sm" />
            </div>
            <div className="flex flex-col items-center gap-2 p-4 border rounded">
              <p className="text-sm font-medium">Medium (Default)</p>
              <LoadingSpinner size="md" />
            </div>
            <div className="flex flex-col items-center gap-2 p-4 border rounded">
              <p className="text-sm font-medium">Large</p>
              <LoadingSpinner size="lg" />
            </div>
          </div>

          <div className="p-4 border rounded">
            <LoadingSpinner size="md" message="Loading data from server..." />
          </div>

          <Button onClick={handleLoadingDemo}>
            Show Loading State (3 seconds)
          </Button>

          {loading && (
            <div className="p-6 border rounded bg-muted">
              <LoadingSpinner size="lg" message="Please wait while we process your request..." />
            </div>
          )}
        </CardContent>
      </Card>

      {/* ErrorAlert Examples */}
      <Card>
        <CardHeader>
          <CardTitle>2. ErrorAlert Component</CardTitle>
          <CardDescription>
            Professional error display with retry and dismiss actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleErrorDemo} variant="destructive">
            Show Error Alert
          </Button>

          {error && (
            <ErrorAlert
              error={error}
              onRetry={() => {
                setError(null);
                toast.info('Retrying operation...');
              }}
              onDismiss={() => setError(null)}
            />
          )}

          {/* Static examples */}
          <div className="space-y-4">
            <ErrorAlert error="Network connection failed. Please check your internet connection." />
            <ErrorAlert
              error={new Error('Failed to fetch user data from API')}
              title="API Error"
            />
          </div>
        </CardContent>
      </Card>

      {/* Toast Notifications Examples */}
      <Card>
        <CardHeader>
          <CardTitle>3. Toast Notifications</CardTitle>
          <CardDescription>
            Toast notifications using sonner (configured in App.tsx)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => handleToastDemo('success')} variant="default">
              Success Toast
            </Button>
            <Button onClick={() => handleToastDemo('error')} variant="destructive">
              Error Toast
            </Button>
            <Button onClick={() => handleToastDemo('info')} variant="secondary">
              Info Toast
            </Button>
            <Button onClick={() => handleToastDemo('warning')} variant="outline">
              Warning Toast
            </Button>
            <Button onClick={() => handleToastDemo('loading')} variant="outline">
              Loading Toast
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 401 Error Handling */}
      <Card>
        <CardHeader>
          <CardTitle>4. 401 Error Handling</CardTitle>
          <CardDescription>
            Automatic token cleanup and redirect on session expiry
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded bg-yellow-50 dark:bg-yellow-900/20">
            <h4 className="font-semibold mb-2">How it works:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>When a 401 Unauthorized response is received from any microservice</li>
              <li>All tokens are cleared from localStorage (accessToken, refreshToken, saubhagya_jwt_token, user, sessionStart)</li>
              <li>A toast notification is shown: "Session expired. Please login again."</li>
              <li>User is redirected to /login with current URL preserved for redirect after re-login</li>
            </ul>
          </div>

          <Button onClick={handle401Demo} variant="outline">
            Simulate 401 Error (if token is invalid)
          </Button>

          <div className="p-4 border rounded bg-blue-50 dark:bg-blue-900/20">
            <h4 className="font-semibold mb-2">Implementation:</h4>
            <pre className="text-xs bg-white dark:bg-gray-800 p-2 rounded overflow-x-auto">
{`// In src/services/microservices/index.ts
async callService(...) {
  const response = await fetch(url, { ...options, headers });

  // Handle 401 Unauthorized errors
  if (response.status === 401) {
    this.handle401Error();
    throw new Error('Unauthorized - Session expired');
  }

  return response;
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Phase4Example;
