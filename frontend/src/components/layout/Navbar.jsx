import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { logout } from '../../redux/slices/authSlice';
import { useNotifications } from '../../hooks/useNotifications.jsx';
import { Bell, MessageSquare, User, LogOut, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Initialize notifications hook
  useNotifications();

  // Dark mode theme state
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'recruiter' || user?.role === 'startup' || user?.role === 'client') return '/dashboard/client';
    return '/dashboard/freelancer';
  };

  return (
    <nav className="bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              StuGig
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/services" className="text-gray-700 dark:text-zinc-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 font-medium">
                Services
              </Link>
              <Link to="/jobs" className="text-gray-700 dark:text-zinc-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 font-medium">
                Jobs
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Dark Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-primary-600 dark:text-zinc-400 dark:hover:text-primary-400 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/messages" className="p-2 text-gray-700 dark:text-zinc-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors">
                  <MessageSquare size={20} />
                </Link>
                <Link to="/notifications" className="p-2 text-gray-700 dark:text-zinc-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors relative">
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link to={getDashboardLink()} className="p-2 text-gray-700 dark:text-zinc-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors">
                  <User size={20} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-zinc-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
