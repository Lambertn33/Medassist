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
}

export const Input = ({ id, name, type, autoComplete, required, value, onChange, disabled, placeholder, label, additionalClasses, ...props }: InputProps) => {
  return (
    <div>
        {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>}
        <input
            className={`px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${additionalClasses}`}
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
    </div>
  );
};