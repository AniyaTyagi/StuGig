import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Home, Briefcase, Sparkles, MessageSquare, User, Settings, LogOut, Command, Plus } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Command list
  const getCommands = () => {
    const base = [
      { id: 'home', title: 'Go to Home', icon: <Home size={16} />, action: () => navigate('/') },
      { id: 'services', title: 'Browse Services', icon: <Sparkles size={16} />, action: () => navigate('/services') },
      { id: 'jobs', title: 'Search Jobs & Internships', icon: <Briefcase size={16} />, action: () => navigate('/jobs') },
    ];

    if (isAuthenticated) {
      const dashboardLink = user?.role === 'admin' ? '/dashboard/admin' : user?.role === 'client' ? '/dashboard/client' : '/dashboard/freelancer';
      
      base.push(
        { id: 'dashboard', title: 'Go to Dashboard', icon: <Command size={16} />, action: () => navigate(dashboardLink) },
        { id: 'messages', title: 'Open Inbox Messages', icon: <MessageSquare size={16} />, action: () => navigate('/messages') },
        { id: 'profile', title: 'View My Profile', icon: <User size={16} />, action: () => navigate(`/profile/${user._id}`) },
        { id: 'settings', title: 'Account Settings', icon: <Settings size={16} />, action: () => navigate('/settings') },
        { id: 'logout', title: 'Log Out Session', icon: <LogOut size={16} className="text-red-500" />, action: () => {
          dispatch(logout());
          navigate('/login');
        }}
      );
    } else {
      base.push(
        { id: 'login', title: 'Log In to StuGig', icon: <User size={16} />, action: () => navigate('/login') },
        { id: 'signup', title: 'Create Free Account', icon: <Plus size={16} />, action: () => navigate('/signup') }
      );
    }
    return base;
  };

  const commands = getCommands();

  // Filtered commands
  const filtered = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  // Handle keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Set focus on open
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        setIsOpen(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-start justify-center pt-[15vh] px-4 transition-all duration-200">
      <div 
        ref={containerRef}
        className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all transform scale-100"
        onKeyDown={handleKeyDown}
      >
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-zinc-800 gap-3">
          <Search size={18} className="text-slate-400 dark:text-zinc-500" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search page..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent border-none outline-none focus:ring-0 text-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500"
          />
          <div className="flex items-center gap-0.5 px-2 py-1 bg-slate-100 dark:bg-zinc-800 border dark:border-zinc-700 text-[10px] text-slate-500 dark:text-zinc-400 font-bold rounded">
            ESC
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-[300px] overflow-y-auto p-2 space-y-0.5">
          {filtered.length > 0 ? (
            filtered.map((cmd, idx) => (
              <button
                key={cmd.id}
                onClick={() => {
                  cmd.action();
                  setIsOpen(false);
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm transition text-left gap-3 ${
                  idx === selectedIndex
                    ? 'bg-slate-100 dark:bg-zinc-800/80 text-primary-600 dark:text-primary-400'
                    : 'text-slate-700 dark:text-zinc-300'
                }`}
              >
                <span className={`${idx === selectedIndex ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-zinc-500'}`}>
                  {cmd.icon}
                </span>
                <span className="flex-grow font-medium">{cmd.title}</span>
                <span className="text-[10px] text-slate-400 dark:text-zinc-500">Jump</span>
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-slate-400 dark:text-zinc-500 font-medium">
              No commands or shortcuts found for "{query}"
            </div>
          )}
        </div>
        
        {/* Footer shortcuts helper */}
        <div className="flex justify-between items-center px-4 py-2 bg-slate-50 dark:bg-zinc-900/50 border-t border-slate-100 dark:border-zinc-800/80 text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
          <div className="flex gap-2">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <div>StuGig Command Palette</div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
