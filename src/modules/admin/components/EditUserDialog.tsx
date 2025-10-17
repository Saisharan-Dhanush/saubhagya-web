import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { userManagementService, UserProfile, UpdateUserRequest } from '@/services/admin/user-management.service';
import { toast } from 'sonner';

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
  user: UserProfile | null;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ open, onOpenChange, onUserUpdated, user }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateUserRequest>({
    name: '',
    locale: 'en',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UpdateUserRequest, string>>>({});

  useEffect(() => {
    if (user && open) {
      setFormData({
        name: user.name,
        locale: user.locale || 'en',
      });
      setErrors({});
    }
  }, [user, open]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UpdateUserRequest, string>> = {};

    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('No user selected');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await userManagementService.updateUser(user.id, formData);
      toast.success('User updated successfully');
      handleClose();
      onUserUpdated();
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Failed to update user', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      locale: 'en',
    });
    setErrors({});
    onOpenChange(false);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information (phone and roles cannot be changed here)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Phone Number (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={user.phone}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Phone number cannot be changed
              </p>
            </div>

            {/* External ID (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="externalId">User ID</Label>
              <Input
                id="externalId"
                value={user.externalId}
                disabled
                className="bg-muted"
              />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) {
                    setErrors({ ...errors, name: undefined });
                  }
                }}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Locale */}
            <div className="space-y-2">
              <Label htmlFor="locale">Language / Locale</Label>
              <Select
                value={formData.locale}
                onValueChange={(value) => setFormData({ ...formData, locale: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                  <SelectItem value="mr">Marathi (मराठी)</SelectItem>
                  <SelectItem value="gu">Gujarati (ગુજરાતી)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Current Roles (Read-only) */}
            <div className="space-y-2">
              <Label>Current Roles</Label>
              <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-md">
                {user.roles.length > 0 ? (
                  user.roles.map((role) => (
                    <span
                      key={role}
                      className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">No roles assigned</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                To change roles, use the permissions management feature
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Account Status</Label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    user.isActive
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-400 text-white'
                  }`}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Use the toggle button in the user list to change status
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
