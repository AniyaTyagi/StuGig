import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, TrendingUp, CheckCircle2, Globe, Code, Palette, Video, MessageSquare, BarChart } from 'lucide-react';

const Landing = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/dashboard/admin';
    if (user?.role === 'recruiter' || user?.role === 'startup') return '/dashboard/client';
    return '/dashboard/freelancer';
  };

  const categories = [
    { name: 'Development & IT', icon: <Code size={20} />, skills: '1853 skills' },
    { name: 'Design & Creative', icon: <Palette size={20} />, skills: '968 skills' },
    { name: 'Sales & Marketing', icon: <TrendingUp size={20} />, skills: '392 skills' },
    { name: 'Writing & Translation', icon: <MessageSquare size={20} />, skills: '505 skills' },
    { name: 'Admin & Customer Support', icon: <Globe size={20} />, skills: '508 skills' },
    { name: 'Finance & Accounting', icon: <BarChart size={20} />, skills: '214 skills' },
    { name: 'Engineering & Architecture', icon: <CheckCircle2 size={20} />, skills: '650 skills' },
    { name: 'Video & Animation', icon: <Video size={20} />, skills: '392 skills' }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-medium leading-tight mb-6">
              How work<br />should work
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Forget the old rules. Keep the benefits, skip the hassles. StuGig brings together students and startups in a new way.
            </p>
            
            {/* Search Bar */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search for any skill or service" 
                  className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-800 text-base"
                />
              </div>
              <button className="px-8 py-4 bg-primary-800 hover:bg-primary-900 text-white rounded-full font-medium transition">
                Search
              </button>
            </div>

            <div className="flex gap-3 flex-wrap text-sm">
              <span className="text-gray-600">Popular:</span>
              <Link to="/services?q=web" className="text-primary-800 hover:underline">Web Development</Link>
              <Link to="/services?q=logo" className="text-primary-800 hover:underline">Logo Design</Link>
              <Link to="/services?q=mobile" className="text-primary-800 hover:underline">Mobile App</Link>
              <Link to="/services?q=seo" className="text-primary-800 hover:underline">SEO</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 border-b">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-gray-600 mb-6">Trusted by</p>
          <div className="flex justify-center items-center gap-12 flex-wrap opacity-60">
            <span className="text-2xl font-semibold">Microsoft</span>
            <span className="text-2xl font-semibold">Airbnb</span>
            <span className="text-2xl font-semibold">Bissell</span>
            <span className="text-2xl font-semibold">GE</span>
          </div>
        </div>
      </section>

      {/* Browse Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-medium mb-12">Browse talent by category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link 
                key={idx}
                to={`/jobs?category=${encodeURIComponent(cat.name)}`}
                className="bg-white p-6 rounded-lg hover:shadow-lg transition border border-gray-200 group"
              >
                <div className="mb-4 text-gray-700 group-hover:text-accent-500 transition">
                  {cat.icon}
                </div>
                <h3 className="font-medium text-lg mb-2 group-hover:text-accent-500 transition">{cat.name}</h3>
                <p className="text-sm text-gray-600">{cat.skills}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-medium mb-4 text-center">Why businesses turn to StuGig</h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            StuGig makes it affordable to up your work and take advantage of low student rates and fresh perspectives.
          </p>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="text-primary-800" size={24} />
              </div>
              <h3 className="text-xl font-medium mb-3">Proof of quality</h3>
              <p className="text-gray-600 leading-relaxed">
                Check any student's work samples, client reviews, and identity verification.
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="text-accent-500" size={24} />
              </div>
              <h3 className="text-xl font-medium mb-3">No cost until you hire</h3>
              <p className="text-gray-600 leading-relaxed">
                Interview potential fits for your job, negotiate rates, and only pay for work you approve.
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-accent-200 rounded-lg flex items-center justify-center mb-4">
                <Globe className="text-accent-600" size={24} />
              </div>
              <h3 className="text-xl font-medium mb-3">Safe and secure</h3>
              <p className="text-gray-600 leading-relaxed">
                Focus on your work knowing we help protect your data and privacy. We're here with 24/7 support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-medium mb-6">Find talent your way</h2>
          <p className="text-xl mb-10 text-primary-50">
            Work with the largest network of independent students and get things done—from quick turnarounds to big transformations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link to="/signup?role=startup" className="px-8 py-4 bg-white text-primary-800 rounded-full font-medium hover:bg-gray-100 transition">
                  Post a Job
                </Link>
                <Link to="/signup?role=student" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-primary-800 transition">
                  Find Work
                </Link>
              </>
            ) : (
              <Link to={getDashboardLink()} className="px-8 py-4 bg-white text-primary-800 rounded-full font-medium hover:bg-gray-100 transition">
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Landing;
