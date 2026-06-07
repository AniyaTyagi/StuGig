import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, DollarSign, Briefcase, Calendar, Clock, MessageSquare } from 'lucide-react';
import { jobService } from '../../services/jobService';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Jobs = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ 
    search: '', 
    category: '', 
    jobType: '', 
    minBudget: '', 
    maxBudget: '' 
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobService.getJobs(filters);
      setJobs(response.data || []);
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyJob = (job) => {
    if (!isAuthenticated) {
      toast.error('Please login to apply for jobs');
      navigate('/login');
      return;
    }
    navigate(`/jobs/${job._id}`);
  };

  const handleMessage = (job) => {
    if (!isAuthenticated) {
      toast.error('Please login to send messages');
      navigate('/login');
      return;
    }

    const clientId = job.client?._id || job.client;
    if (!clientId) {
      toast.error('Client information not available');
      return;
    }

    navigate('/messages', { state: { userId: clientId } });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="mb-8">
          <span className="text-primary-600 dark:text-primary-400 font-semibold tracking-wider text-xs uppercase">Marketplace</span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1">Browse Opportunities</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Find freelance contracts or structured internships posted by verified startups.</p>
        </div>

        {/* Filters Grid */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400 dark:text-zinc-500" size={18} />
              <input
                type="text"
                placeholder="Search keywords..."
                className="input pl-10"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            {/* Category */}
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

            {/* Job Type */}
            <select
              className="input"
              value={filters.jobType}
              onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="project">Project Gigs</option>
              <option value="internship">Internships</option>
            </select>

            {/* Min Budget */}
            <input
              type="number"
              placeholder="Min Budget ($)"
              className="input"
              value={filters.minBudget}
              onChange={(e) => setFilters({ ...filters, minBudget: e.target.value })}
            />

            {/* Max Budget */}
            <input
              type="number"
              placeholder="Max Budget ($)"
              className="input"
              value={filters.maxBudget}
              onChange={(e) => setFilters({ ...filters, maxBudget: e.target.value })}
            />
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          /* Skeleton Loader List */
          <div className="space-y-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="card h-40 w-full animate-pulse bg-white dark:bg-zinc-900 border dark:border-zinc-800"></div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="card hover:shadow-lg transition-all bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6"
              >
                <div className="flex items-start gap-6">
                  {/* Company Avatar */}
                  <Link 
                    to={`/jobs/${job._id}`}
                    className="relative flex-shrink-0 cursor-pointer"
                  >
                    <img 
                      src={job.client?.avatar || job.client?.companyLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${job.client?.companyName || job.client?.firstName}`} 
                      alt={job.client?.companyName || 'Company'}
                      className="w-16 h-16 rounded-lg border-2 border-slate-200 dark:border-zinc-700 object-cover"
                    />
                  </Link>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    {/* Company Name & Job Title */}
                    <div className="mb-3">
                      <p className="text-sm text-slate-500 dark:text-zinc-400 mb-1">
                        {job.client?.companyName || `${job.client?.firstName} ${job.client?.lastName}`}
                      </p>
                      <Link to={`/jobs/${job._id}`}>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50 hover:text-primary-600 dark:hover:text-primary-400 transition">
                          {job.title}
                        </h3>
                      </Link>
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-wrap items-center gap-4 mb-3 text-sm">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300">
                        <DollarSign size={16} className="text-green-600" />
                        <span className="font-bold">${job.budget}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600 dark:text-zinc-400">
                        <Briefcase size={14} />
                        <span className="capitalize">{job.jobType}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600 dark:text-zinc-400">
                        <Clock size={14} />
                        <span>Due: {new Date(job.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600 dark:text-zinc-400">
                        <MessageSquare size={14} />
                        <span>{job.bidsCount || 0} proposals</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <span className="font-medium capitalize">{job.status}</span>
                      </div>
                    </div>

                    {/* Skills/Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.skills?.slice(0, 6).map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="px-3 py-1 text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills?.length > 6 && (
                        <span className="px-3 py-1 text-xs font-medium text-slate-500 dark:text-zinc-400">
                          +{job.skills.length - 6}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <Link to={`/jobs/${job._id}`}>
                      <p className="text-sm text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed hover:text-slate-900 dark:hover:text-zinc-200 transition">
                        {job.description}
                      </p>
                    </Link>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApplyJob(job)}
                      disabled={user?._id === job.client?._id}
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Briefcase size={16} />
                      {user?._id === job.client?._id ? 'Your Job' : 'Apply Now'}
                    </button>
                    <button
                      onClick={() => handleMessage(job)}
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
            <Briefcase className="mx-auto text-slate-300 dark:text-zinc-700 mb-2 animate-bounce" size={44} />
            <p className="text-slate-500 dark:text-zinc-400">No active job listings found matching your search filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
