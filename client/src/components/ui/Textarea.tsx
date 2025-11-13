interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
  placeholder: string;
  label: string;
  error?: string;
}

export const Textarea = ({ id, name, value, onChange, disabled, placeholder, label, error }: TextareaProps) => {
  return (
    <div>
              <label htmlFor="treatment-notes" className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
              <textarea
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                rows={4}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors w-full resize-none"
                placeholder={placeholder}
                disabled={disabled}
              />
      {error && (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
};