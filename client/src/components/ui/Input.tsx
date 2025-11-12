interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  type: string;
  autoComplete: string;
  required: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  placeholder: string;
  label?: string;
  additionalClasses?: string;
  error?: string;
}

export const Input = ({ id, name, type, autoComplete, required, value, onChange, disabled, placeholder, label, additionalClasses, error, ...props }: InputProps) => {
  return (
    <div>
        {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>}
        <input
            className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
              error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300'
            } ${additionalClasses}`}
            id={id}
            name={name}
            type={type}
            autoComplete={autoComplete}
            required={required}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            {...props}
        />
        {error && (
          <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
        )}
    </div>
  );
};