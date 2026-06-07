import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 text-center bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 transition-colors duration-200">
      <div className="bg-primary-50 dark:bg-primary-950/20 p-6 rounded-full text-primary-600 dark:text-primary-400 mb-6">
        <HelpCircle size={64} className="animate-bounce" />
      </div>
      <h1 className="text-6xl font-extrabold tracking-tight">404</h1>
      <h2 className="text-2xl font-bold mt-4">Page Not Found</h2>
      <p className="text-slate-500 dark:text-zinc-400 mt-2 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <div className="flex gap-4 mt-8">
        <Link to="/" className="btn btn-primary">
          Go to Home
        </Link>
        <Link to="/jobs" className="btn btn-outline">
          Browse Jobs
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
