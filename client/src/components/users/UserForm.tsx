import { useState, useEffect } from 'react';
import { Modal, Input, Button, Select } from '@/components';
import type { ICreateUser } from '@/interfaces/users/IUser';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: ICreateUser) => void;
  error?: Error | null;
  isLoading?: boolean;
}

export const UserForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  error, 
  isLoading = false
}: UserFormProps) => {
  const [formData, setFormData] = useState<ICreateUser>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: '',
    });
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  // Parse error to get field-specific errors
  const getFieldError = (fieldName: string): string | undefined => {
    if (!error) return undefined;
    
    try {
      // Check if error message is a JSON string with validation errors
      if (error.message.includes('{')) {
        const errors = JSON.parse(error.message);
        if (errors[fieldName]) {
          return Array.isArray(errors[fieldName]) 
            ? errors[fieldName].join(', ') 
            : errors[fieldName];
        }
      }
    } catch (e) {
      // If parsing fails, return undefined
    }
    return undefined;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New User">
      <form className="p-4 md:p-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 mb-4">
          <div>
            <Input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required={false}
              autoComplete="name"
              disabled={false}
              additionalClasses="w-full"
              label="Name"
              error={getFieldError('name')}
            />
          </div>
          <div>
            <Input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required={false}
              autoComplete="email"
              disabled={false}
              additionalClasses="w-full"
              label="Email"
              error={getFieldError('email')}
            />
          </div>
          <div>
            <Select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              disabled={false}
              label="Role"
              additionalClasses="w-full"
              required={false}
              options={[
                { value: '', label: 'Select role' },
                { value: 'ADMIN', label: 'Admin' },
                { value: 'DOCTOR', label: 'Doctor' },
                { value: 'NURSE', label: 'Nurse' },
              ]}
              error={getFieldError('role')}
            />
          </div>
          <div>
            <Input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password (min 8 characters)"
              required={false}
              autoComplete="new-password"
              disabled={false}
              additionalClasses="w-full"
              label="Password"
              error={getFieldError('password')}
            />
          </div>
          <div>
            <Input
              type="password"
              name="password_confirmation"
              id="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="Confirm password"
              required={false}
              autoComplete="new-password"
              disabled={false}
              additionalClasses="w-full"
              label="Confirm Password"
              error={getFieldError('password_confirmation')}
            />
          </div>
        </div>
        {error && !error.message.includes('{') && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error.message}</p>
          </div>
        )}
        <div className="flex items-center justify-end gap-3">
          <Button 
            type="button"
            onClick={onClose}
            disabled={isLoading} 
            loading={false} 
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading} 
            loading={isLoading} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Create User
          </Button>
        </div>
      </form>
    </Modal>
  );
};

