import { Loader2 } from 'lucide-react';

const Loading = ({ fullScreen = false, size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <Loader2 className={`${sizeClasses.lg} text-green-600 animate-spin mx-auto`} />
          {text && <p className="mt-4 text-gray-600 dark:text-zinc-400 font-medium">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size]} text-green-600 animate-spin mx-auto`} />
        {text && <p className="mt-2 text-gray-600 dark:text-zinc-400 text-sm">{text}</p>}
      </div>
    </div>
  );
};

export default Loading;
