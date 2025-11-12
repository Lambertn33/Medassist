import { useState, useEffect } from 'react';
import { Modal, Input, Button, Select } from '@/components';
import type { IPatientFormData } from '@/interfaces/patients/IPatient';

interface PatientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: IPatientFormData) => void;
  error?: Error | null;
  isLoading?: boolean;
}

export const PatientForm = ({ isOpen, onClose, onSubmit, error, isLoading = false }: PatientFormProps) => {
  const [formData, setFormData] = useState<IPatientFormData>({
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    phone: '',
    national_id: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
  });

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      gender: '',
      date_of_birth: '',
      phone: '',
      national_id: '',
      address: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
    });
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Patient">
      <form className="p-4 md:p-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 mb-4 grid-cols-2">
          <div className="col-span-2 sm:col-span-1">
            <Input
              type="text"
              name="first_name"
              id="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Enter first name"
              required={false}
              autoComplete="given-name"
              disabled={false}
              additionalClasses="w-full"
              label="First Name"
              error={getFieldError('first_name')}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <Input
              type="text"
              name="last_name"
              id="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Enter last name"
              required={false}
              autoComplete="given-name"
              disabled={false}
              additionalClasses="w-full"
              label="Last Name"
              error={getFieldError('last_name')}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <Input
              type="date"
              name="date_of_birth"
              id="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              placeholder=""
              required={false}
              autoComplete="bday"
              disabled={false}
              additionalClasses="w-full"
              label="Date of Birth"
              error={getFieldError('date_of_birth')}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <Input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0712345678"
              required={false}
              autoComplete="tel"
              disabled={false}
              additionalClasses="w-full"
              label="Phone"
              error={getFieldError('phone')}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <Input
              type="text"
              name="national_id"
              id="national_id"
              value={formData.national_id}
              onChange={handleChange}
              placeholder="1234567890123456"
              required={false}
              autoComplete="off"
              disabled={false}
              additionalClasses="w-full"
              maxLength={16}
              label="National ID"
              error={getFieldError('national_id')}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <Select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={false}
              label="Gender"
              additionalClasses="w-full"
              options={[
                { value: '', label: 'Select gender' },
                { value: 'MALE', label: 'Male' },
                { value: 'FEMALE', label: 'Female' },
              ]}
              error={getFieldError('gender')}
            />
          </div>
          <div className="col-span-2">
            <Input
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              required={false}
              autoComplete="street-address"
              disabled={false}
              additionalClasses="w-full"
              label="Address"
              error={getFieldError('address')}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <Input
              type="text"
              name="emergency_contact_name"
              id="emergency_contact_name"
              value={formData.emergency_contact_name}
              onChange={handleChange}
              placeholder="Enter emergency contact name"
              required={false}
              autoComplete="name"
              disabled={false}
              additionalClasses="w-full"
              label="Emergency Contact Name"
              error={getFieldError('emergency_contact_name')}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <Input
              type="tel"
              name="emergency_contact_phone"
              id="emergency_contact_phone"
              value={formData.emergency_contact_phone}
              onChange={handleChange}
              placeholder="0798765432"
              required={false}
              autoComplete="tel"
              disabled={false}
              additionalClasses="w-full"
              label="Emergency Contact Phone"
              error={getFieldError('emergency_contact_phone')}
            />
          </div>
        </div>
        {error && !error.message.includes('{') && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error.message}</p>
          </div>
        )}
        <Button 
          type="submit" 
          disabled={isLoading} 
          loading={isLoading} 
          className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Add Patient
        </Button>
      </form>
    </Modal>
  );
};