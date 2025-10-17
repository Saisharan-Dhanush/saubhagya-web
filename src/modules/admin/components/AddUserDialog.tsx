import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
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
import { userManagementService, CreateUserRequest } from '@/services/admin/user-management.service';
import { toast } from 'sonner';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: () => void;
}

interface Role {
  id: number;
  roleName: string;
  description: string;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ open, onOpenChange, onUserAdded }) => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [formData, setFormData] = useState<CreateUserRequest>({
    phone: '',
    name: '',
    password: '',
    locale: 'en',
    userType: 'FARMER',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateUserRequest, string>>>({});

  useEffect(() => {
    if (open) {
      fetchRoles();
    }
  }, [open]);

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const rolesData = await userManagementService.getRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      toast.error('Failed to load roles', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setLoadingRoles(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateUserRequest, string>> = {};

    // Phone validation (Indian format)
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+91\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be in format +91XXXXXXXXXX';
    }

    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
    }

    // User type validation
    if (!formData.userType) {
      newErrors.userType = 'User type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await userManagementService.createUser(formData);
      toast.success('User created successfully');
      handleClose();
      onUserAdded();
    } catch (error) {
      console.error('Failed to create user:', error);
      toast.error('Failed to create user', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      phone: '',
      name: '',
      password: '',
      locale: 'en',
      userType: 'FARMER',
    });
    setErrors({});
    onOpenChange(false);
  };

  const handlePhoneChange = (value: string) => {
    // Auto-format phone number
    let formatted = value.replace(/\D/g, '');
    if (formatted.length > 0 && !formatted.startsWith('91')) {
      formatted = '91' + formatted;
    }
    if (formatted.length > 12) {
      formatted = formatted.slice(0, 12);
    }
    setFormData({ ...formData, phone: formatted.length > 0 ? '+' + formatted : '' });
    if (errors.phone) {
      setErrors({ ...errors, phone: undefined });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account with role assignment
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="+919999888777"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Format: +91XXXXXXXXXX (Indian mobile number)
              </p>
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

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter secure password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) {
                    setErrors({ ...errors, password: undefined });
                  }
                }}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Min 8 characters with uppercase, lowercase, number & special character
              </p>
            </div>

            {/* User Type / Role */}
            <div className="space-y-2">
              <Label htmlFor="userType">
                User Type / Role <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.userType}
                onValueChange={(value) => {
                  setFormData({ ...formData, userType: value });
                  if (errors.userType) {
                    setErrors({ ...errors, userType: undefined });
                  }
                }}
              >
                <SelectTrigger className={errors.userType ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent>
                  {loadingRoles ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2 text-sm">Loading roles...</span>
                    </div>
                  ) : roles.length > 0 ? (
                    roles.map((role) => (
                      <SelectItem key={role.id} value={role.roleName}>
                        <div className="flex flex-col">
                          <span className="font-medium">{role.roleName}</span>
                          {role.description && (
                            <span className="text-xs text-muted-foreground">
                              {role.description}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="ADMIN">Admin - Full system access</SelectItem>
                      <SelectItem value="FARMER">Farmer - Basic access</SelectItem>
                      <SelectItem value="GAUSHALA_MANAGER">Gaushala Manager</SelectItem>
                      <SelectItem value="BIOGAS_OPERATOR">Biogas Operator</SelectItem>
                      <SelectItem value="PURIFICATION_OPERATOR">Purification Operator</SelectItem>
                      <SelectItem value="SALES_TEAM">Sales Team</SelectItem>
                      <SelectItem value="GOVERNMENT_OFFICIAL">Government Official</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              {errors.userType && (
                <p className="text-sm text-destructive">{errors.userType}</p>
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
              Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
