import { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';

const SplashScreen = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-[#00303d] via-[#004957] to-[#006274] flex items-center justify-center z-50 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center animate-fade-in">
        <div className="flex items-center justify-center mb-6 animate-bounce-slow">
          <GraduationCap className="w-20 h-20 text-[#34DDDD]" strokeWidth={1.5} />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-slide-up">
          StuGig
        </h1>
        <p className="text-xl md:text-2xl text-[#34DDDD] animate-slide-up-delay">
          A Smart Freelance Marketplace for Students
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
