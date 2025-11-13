import { Link, useLocation } from 'react-router';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const NavLink = ({ to, children, className = '', onClick }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg font-medium transition-colors
        ${
          isActive
            ? 'text-blue-700 font-bold '
            : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
        }
        ${className}
      `}
    >
      {children}
    </Link>
  );
};

export default NavLink;

