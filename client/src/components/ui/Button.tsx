interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled: boolean;
  type: 'button' | 'submit' | 'reset';
  className: string;
  loading: boolean;
}

export const Button = ({ children, onClick, disabled, type, className }: ButtonProps) => {
  return (
    <button onClick={onClick} disabled={disabled} type={type} className={className}>
      {children}
    </button>
  );
};