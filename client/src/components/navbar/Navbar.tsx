import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import NavLink from '@/components/navbar/NavLink';
import { useAuth, useLogout } from '@/hooks/useAuth';

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const logoutMutation = useLogout();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is outside dropdown
      if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false);
      }
      
      // Check if click is outside mobile menu (but not on the toggle button)
      if (isMobileMenuOpen) {
        const isClickInMenu = mobileMenuRef.current?.contains(target);
        const isClickOnToggle = mobileMenuButtonRef.current?.contains(target);
        
        if (!isClickInMenu && !isClickOnToggle) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    if (isDropdownOpen || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, isMobileMenuOpen]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/');
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      },
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">MedAssist</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/">Home</NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/dashboard/patients">Patients</NavLink>
                <NavLink to="/dashboard/encounters">Encounters</NavLink>
                {user?.role === 'ADMIN' && (
                  <NavLink to="/dashboard/users">Users</NavLink>
                )}
                {user && (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center space-x-2 text-sm text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      <span>{user.name}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <NavLink to="/login">Login</NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              ref={mobileMenuButtonRef}
              type="button"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white" ref={mobileMenuRef}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className="block px-3 py-2 rounded-md text-base font-medium" onClick={closeMobileMenu}>
              Home
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium" onClick={closeMobileMenu}>
                  Dashboard
                </NavLink>
                <NavLink to="/dashboard/patients" className="block px-3 py-2 rounded-md text-base font-medium" onClick={closeMobileMenu}>
                  Patients
                </NavLink>
                <NavLink to="/dashboard/encounters" className="block px-3 py-2 rounded-md text-base font-medium" onClick={closeMobileMenu}>
                  Encounters
                </NavLink>
                {user?.role === 'ADMIN' && (
                  <NavLink to="/dashboard/users" className="block px-3 py-2 rounded-md text-base font-medium" onClick={closeMobileMenu}>
                    Users
                  </NavLink>
                )}
                {user && (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="px-3 py-2 text-sm font-medium text-gray-700">
                      {user.name}
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        closeMobileMenu();
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                )}
              </>
            ) : (
              <NavLink to="/login" className="block px-3 py-2 rounded-md text-base font-medium" onClick={closeMobileMenu}>
                Login
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

