import { useState, useEffect } from 'react';
import { Modal, Input, Button, Select } from '@/components';

interface PatientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: PatientFormData) => void;
}

export interface PatientFormData {
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  phone: string;
  national_id: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
}

export const PatientForm = ({ isOpen, onClose, onSubmit }: PatientFormProps) => {
  const [formData, setFormData] = useState<PatientFormData>({
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
              required={true}
              autoComplete="given-name"
              disabled={false}
              additionalClasses="w-full"
              label="First Name"
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
              required={true}
              autoComplete="given-name"
              disabled={false}
              additionalClasses="w-full"
              label="Last Name"
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
              required={true}
              autoComplete="bday"
              disabled={false}
              additionalClasses="w-full"
              label="Date of Birth"
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
              required={true}
              autoComplete="tel"
              disabled={false}
              additionalClasses="w-full"
              label="Phone"
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
              required={true}
              autoComplete="off"
              disabled={false}
              additionalClasses="w-full"
              maxLength={16}
              label="National ID"
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
              required={true}
              autoComplete="street-address"
              disabled={false}
              additionalClasses="w-full"
              label="Address"
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
              required={true}
              autoComplete="name"
              disabled={false}
              additionalClasses="w-full"
              label="Emergency Contact Name"
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
              required={true}
              autoComplete="tel"
              disabled={false}
              additionalClasses="w-full"
              label="Emergency Contact Phone"
            />
          </div>
        </div>
        <Button type="submit" disabled={false} loading={false} className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium">
          Add Patient
        </Button>
      </form>
    </Modal>
  );
};