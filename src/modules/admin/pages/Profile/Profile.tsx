/**
 * Profile Page - User Profile Management
 *
 * Features:
 * - Fetch profile from real Auth Service API
 * - Display all user fields
 * - Edit mode for name and locale only
 * - Real API integration (ZERO mock data)
 * - Proper error handling with retry
 * - Loading states and user feedback
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Phone, Mail, Shield, Calendar, Edit2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { profileService, UserProfile } from '@/services/admin/profile.service';
import { ProfileEditForm } from './ProfileEditForm';

/**
 * Profile Page Component
 */
export const Profile: React.FC = () => {
  // State management
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Edit form state
  const [editedName, setEditedName] = useState<string>('');
  const [editedLocale, setEditedLocale] = useState<string>('');

  /**
   * Fetch user profile on component mount
   */
  useEffect(() => {
    fetchProfile();
  }, []);

  /**
   * Fetch profile from Auth Service
   */
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const profileData = await profileService.getProfile();
      setProfile(profileData);
      setEditedName(profileData.name);
      setEditedLocale(profileData.locale);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle edit mode toggle
   */
  const handleEditClick = () => {
    if (profile) {
      setEditedName(profile.name);
      setEditedLocale(profile.locale);
      setIsEditing(true);
    }
  };

  /**
   * Handle cancel edit
   */
  const handleCancelEdit = () => {
    if (profile) {
      setEditedName(profile.name);
      setEditedLocale(profile.locale);
      setIsEditing(false);
    }
  };

  /**
   * Handle save profile
   */
  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      const updatedProfile = await profileService.updateProfile({
        name: editedName,
        locale: editedLocale
      });

      setProfile(updatedProfile);
      setIsEditing(false);

      toast.success('Profile updated successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Format date string
   */
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  /**
   * Get KYC status badge color
   */
  const getKycStatusColor = (status: string): string => {
    switch (status.toUpperCase()) {
      case 'VERIFIED':
      case 'APPROVED':
        return 'bg-green-500';
      case 'PENDING':
        return 'bg-yellow-500';
      case 'REJECTED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  /**
   * Loading state
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  /**
   * Error state with retry
   */
  if (error && !profile) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <div className="ml-2">
            <h3 className="font-semibold">Error Loading Profile</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </Alert>
        <Button onClick={fetchProfile} className="w-full">
          <Loader2 className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  /**
   * Main profile display
   */
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">User Profile</h1>
        <p className="text-muted-foreground">Manage your account information and preferences</p>
      </div>

      {/* Profile Card */}
      <Card className="p-6">
        {/* Card Header with Edit Button */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{profile?.name}</h2>
              <p className="text-sm text-muted-foreground">{profile?.phone}</p>
            </div>
          </div>

          {!isEditing && (
            <Button onClick={handleEditClick} variant="outline">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Profile Fields */}
        <div className="space-y-6">
          {/* Editable Fields Section */}
          <ProfileEditForm
            isEditing={isEditing}
            editedName={editedName}
            editedLocale={editedLocale}
            saving={saving}
            profileName={profile?.name}
            profileLocale={profile?.locale}
            onNameChange={setEditedName}
            onLocaleChange={setEditedLocale}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
          />

          {/* Read-Only Fields Section */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">
              Account Information (Read-Only)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <p className="text-sm font-medium">{profile?.phone}</p>
              </div>

              {/* Email */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <p className="text-sm font-medium">{profile?.email || 'Not provided'}</p>
              </div>

              {/* User ID */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4" />
                  User ID
                </Label>
                <p className="text-sm font-mono text-muted-foreground">{profile?.id}</p>
              </div>

              {/* External ID */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4" />
                  External ID
                </Label>
                <p className="text-sm font-mono text-muted-foreground">{profile?.externalId}</p>
              </div>

              {/* KYC Status */}
              <div>
                <Label className="mb-2 block">KYC Status</Label>
                <Badge className={getKycStatusColor(profile?.kycStatus || '')}>
                  {profile?.kycStatus}
                </Badge>
              </div>

              {/* Account Status */}
              <div>
                <Label className="mb-2 block">Account Status</Label>
                <Badge variant={profile?.isActive ? "default" : "destructive"}>
                  {profile?.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {/* Last Login */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  Last Login
                </Label>
                <p className="text-sm font-medium">{formatDate(profile?.lastLogin)}</p>
              </div>

              {/* Created At */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  Account Created
                </Label>
                <p className="text-sm font-medium">{formatDate(profile?.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Roles Section */}
          <div>
            <Label className="mb-2 block">Roles</Label>
            <div className="flex flex-wrap gap-2">
              {profile?.roles && profile.roles.length > 0 ? (
                profile.roles.map((role, index) => (
                  <Badge key={index} variant="secondary">
                    {role}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No roles assigned</p>
              )}
            </div>
          </div>

          {/* Permissions Section */}
          <div>
            <Label className="mb-2 block">Permissions</Label>
            <div className="flex flex-wrap gap-2">
              {profile?.permissions && profile.permissions.length > 0 ? (
                profile.permissions.map((permission, index) => (
                  <Badge key={index} variant="outline">
                    {permission}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No permissions assigned</p>
              )}
            </div>
          </div>

          {/* Government Access Section */}
          <div>
            <Label className="mb-2 block">Government Access</Label>
            <div className="flex flex-wrap gap-2">
              {profile?.governmentAccess && profile.governmentAccess.length > 0 ? (
                profile.governmentAccess.map((access, index) => (
                  <Badge key={index} variant="outline" className="bg-purple-50">
                    {access}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No government access</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
