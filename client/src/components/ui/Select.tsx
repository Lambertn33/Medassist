interface SelectProps {
  name: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
  label: string;
  additionalClasses: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select = ({ name, id, value, onChange, disabled, label, additionalClasses, options, error }: SelectProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors w-full ${
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300'
        } ${additionalClasses}`}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {options.map((option: { value: string; label: string }) => (
          <option key={option.value} value={option.value} disabled={option.value === ''}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
};