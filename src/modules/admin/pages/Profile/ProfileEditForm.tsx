/**
 * ProfileEditForm Component
 * Handles editable profile fields (name and locale)
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, X, User, Globe } from 'lucide-react';

interface ProfileEditFormProps {
  isEditing: boolean;
  editedName: string;
  editedLocale: string;
  saving: boolean;
  profileName?: string;
  profileLocale?: string;
  onNameChange: (value: string) => void;
  onLocaleChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  isEditing,
  editedName,
  editedLocale,
  saving,
  profileName,
  profileLocale,
  onNameChange,
  onLocaleChange,
  onSave,
  onCancel
}) => {
  return (
    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
      <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-4">
        Editable Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name Field */}
        <div>
          <Label htmlFor="name" className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4" />
            Full Name
          </Label>
          {isEditing ? (
            <Input
              id="name"
              value={editedName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter your name"
              disabled={saving}
            />
          ) : (
            <p className="text-sm font-medium py-2">{profileName}</p>
          )}
        </div>

        {/* Locale Field */}
        <div>
          <Label htmlFor="locale" className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4" />
            Language/Locale
          </Label>
          {isEditing ? (
            <select
              id="locale"
              value={editedLocale}
              onChange={(e) => onLocaleChange(e.target.value)}
              disabled={saving}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
            >
              <option value="en">English (en)</option>
              <option value="hi">हिंदी (hi)</option>
              <option value="gu">ગુજરાતી (gu)</option>
              <option value="mr">मराठी (mr)</option>
              <option value="pa">ਪੰਜਾਬੀ (pa)</option>
            </select>
          ) : (
            <p className="text-sm font-medium py-2">{profileLocale}</p>
          )}
        </div>
      </div>

      {/* Edit Action Buttons */}
      {isEditing && (
        <div className="flex gap-2 mt-4">
          <Button
            onClick={onSave}
            disabled={saving}
            className="flex-1"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          <Button
            onClick={onCancel}
            disabled={saving}
            variant="outline"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileEditForm;
