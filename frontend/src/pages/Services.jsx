import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Star, MessageSquare, Briefcase, Clock, Award } from 'lucide-react';
import { serviceService } from '../services/serviceService';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../services/api';

const Services = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '' });

  useEffect(() => {
    fetchServices();
  }, [filters]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await serviceService.getServices(filters);
      const servicesList = response.services || response.data || response || [];
      setServices(servicesList);
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteToJob = async (service) => {
    if (!isAuthenticated) {
      toast.error('Please login to invite freelancers');
      navigate('/login');
      return;
    }

    const freelancerId = service.freelancer?._id || service.freelancer;
    if (!freelancerId) {
      toast.error('Freelancer information not available');
      return;
    }

    try {
      // Create conversation with invitation message
      const response = await api.post('/messages', {
        receiverId: freelancerId,
        content: `Hi ${service.freelancer?.firstName || 'there'}! I'm interested in your service "${service.title}". I'd like to discuss a potential project with you.`
      });
      
      toast.success('Invitation sent!');
      navigate('/messages');
    } catch (error) {
      console.error('Invite error:', error);
      toast.error(error?.message || 'Failed to send invitation');
    }
  };

  const handleMessage = async (service) => {
    if (!isAuthenticated) {
      toast.error('Please login to send messages');
      navigate('/login');
      return;
    }

    const freelancerId = service.freelancer?._id || service.freelancer;
    if (!freelancerId) {
      toast.error('Freelancer information not available');
      return;
    }

    navigate('/messages', { state: { userId: freelancerId } });
  };

  const getCategoryGradient = (cat) => {
    switch (cat) {
      case 'Web Development': return 'from-primary-400 to-accent-500';
      case 'Mobile Development': return 'from-accent-400 to-primary-500';
      case 'Design': return 'from-primary-300 to-accent-400';
      case 'Writing': return 'from-accent-300 to-primary-400';
      case 'Marketing': return 'from-primary-500 to-accent-600';
      default: return 'from-primary-400 to-accent-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Title */}
        <div className="mb-8">
          <span className="text-primary-600 dark:text-primary-400 font-semibold tracking-wider text-xs uppercase">Gig Marketplace</span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1">Browse Student Services</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Hire student freelancers for custom micro-tasks, design assets, and development support.</p>
        </div>

        {/* Filter Card */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400 dark:text-zinc-500" size={18} />
              <input
                type="text"
                placeholder="Search services..."
                className="input pl-10"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            {/* Category select */}
            <select
              className="input"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="Design">Design</option>
              <option value="Writing">Writing</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          /* Skeleton Gigs Loader */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="card h-80 animate-pulse bg-white dark:bg-zinc-900 border dark:border-zinc-800"></div>
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service._id}
                className="card hover:shadow-lg transition-all bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6"
              >
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <Link 
                    to={`/services/${service._id}`}
                    className="relative flex-shrink-0 cursor-pointer"
                  >
                    <img 
                      src={service.freelancer?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${service.freelancer?._id}`} 
                      alt={service.freelancer?.firstName}
                      className="w-16 h-16 rounded-full border-2 border-slate-200 dark:border-zinc-700"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900"></div>
                  </Link>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    {/* Freelancer Name & Title */}
                    <div className="mb-3">
                      <Link to={`/services/${service._id}`}>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50 mb-1 hover:text-primary-600 dark:hover:text-primary-400 transition">
                          {service.freelancer?.firstName} {service.freelancer?.lastName?.charAt(0)}.
                        </h3>
                      </Link>
                      <Link to={`/services/${service._id}`}>
                        <p className="text-base font-semibold text-slate-700 dark:text-zinc-300 line-clamp-1 hover:text-primary-600 dark:hover:text-primary-400 transition">
                          {service.title}
                        </p>
                      </Link>
                      <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                        {service.freelancer?.university || 'Student'}
                      </p>
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-wrap items-center gap-4 mb-3 text-sm">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300">
                        <span className="font-bold">${service.price}/hr</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={16} fill="currentColor" />
                        <span className="font-semibold text-slate-900 dark:text-zinc-100">
                          {service.rating?.toFixed(1) || '5.0'}
                        </span>
                        <span className="text-slate-500 dark:text-zinc-400">({service.reviewCount || 0})</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600 dark:text-zinc-400">
                        <Award size={14} />
                        <span>${service.ordersCompleted * service.price || 0}+ earned</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600 dark:text-zinc-400">
                        <Clock size={14} />
                        <span>{service.deliveryTime} days delivery</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <span className="font-medium">Available now</span>
                      </div>
                    </div>

                    {/* Skills/Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {service.tags?.slice(0, 6).map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="px-3 py-1 text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {service.tags?.length > 6 && (
                        <span className="px-3 py-1 text-xs font-medium text-slate-500 dark:text-zinc-400">
                          +{service.tags.length - 6}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <Link to={`/services/${service._id}`}>
                      <p className="text-sm text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed hover:text-slate-900 dark:hover:text-zinc-200 transition">
                        {service.description}
                      </p>
                    </Link>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleInviteToJob(service)}
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      <Briefcase size={16} />
                      Invite to job
                    </button>
                    <button
                      onClick={() => handleMessage(service)}
                      className="px-6 py-2.5 border-2 border-slate-300 dark:border-zinc-700 hover:border-green-600 dark:hover:border-green-600 text-slate-700 dark:text-zinc-300 hover:text-green-600 dark:hover:text-green-400 font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      <MessageSquare size={16} />
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 card">
            <Award className="mx-auto text-slate-300 dark:text-zinc-700 mb-2" size={44} />
            <p className="text-slate-500 dark:text-zinc-400">No student services matching your criteria currently listed.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
