import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DollarSign, Briefcase, Users, FileText, Plus, ChartBar, ArrowRight } from 'lucide-react';
import { jobService } from '../../services/jobService';
import toast from 'react-hot-toast';

const ClientDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobService.getMyJobs();
      // Handle either array response or nested object
      const jobsList = Array.isArray(data) ? data : data.jobs || [];
      setMyJobs(jobsList);
    } catch (error) {
      toast.error('Failed to load posted jobs');
    } finally {
      setLoading(false);
    }
  };

  const activeJobs = myJobs.filter(j => j.status === 'in_progress' || j.status === 'awarded').length;
  const openJobs = myJobs.filter(j => j.status === 'open').length;
  const totalBids = myJobs.reduce((sum, job) => sum + (job.bidsCount || 0), 0);

  // Group budget by categories for chart
  const categoriesMap = {};
  myJobs.forEach(job => {
    categoriesMap[job.category] = (categoriesMap[job.category] || 0) + job.budget;
  });

  const categoryLabels = Object.keys(categoriesMap).slice(0, 4);
  const categoryBudgets = Object.values(categoriesMap).slice(0, 4);

  // Find max budget for scaling chart
  const maxBudget = Math.max(...categoryBudgets, 100);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <span className="text-primary-600 dark:text-primary-400 font-semibold tracking-wider text-xs uppercase">
              {user?.role === 'startup' ? 'Startup Hub' : 'Recruiter Workspace'}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1">
              {user?.companyName || 'Business Workspace'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
              Manage your project listings, internships, student applications, and budget metrics.
            </p>
          </div>
          <Link to="/jobs/new" className="btn btn-primary gap-1">
            <Plus size={16} /> Post New Listing
          </Link>
        </div>

        {loading ? (
          /* Skeleton Loader */
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-24 bg-slate-200 dark:bg-zinc-900 rounded-xl animate-pulse"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-96 bg-slate-200 dark:bg-zinc-900 rounded-xl animate-pulse"></div>
              <div className="h-96 bg-slate-200 dark:bg-zinc-900 rounded-xl animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              <div className="card flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Total Spent</p>
                  <p className="text-2xl font-black mt-1">${user?.spending || 0}</p>
                </div>
                <div className="p-2.5 bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 rounded-xl">
                  <DollarSign size={24} />
                </div>
              </div>

              <div className="card flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Active Contracts</p>
                  <p className="text-2xl font-black mt-1">{activeJobs}</p>
                </div>
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 text-blue-500 dark:text-blue-400 rounded-xl">
                  <Briefcase size={24} />
                </div>
              </div>

              <div className="card flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Open Postings</p>
                  <p className="text-2xl font-black mt-1">{openJobs}</p>
                </div>
                <div className="p-2.5 bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-xl">
                  <FileText size={24} />
                </div>
              </div>

              <div className="card flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Total Bids Received</p>
                  <p className="text-2xl font-black mt-1">{totalBids}</p>
                </div>
                <div className="p-2.5 bg-accent-50 dark:bg-accent-950/30 text-accent-600 dark:text-accent-400 rounded-xl">
                  <Users size={24} />
                </div>
              </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Postings Column */}
              <div className="lg:col-span-2 space-y-6">
                <div className="card">
                  <h3 className="font-bold text-lg mb-6">Manage Posted Listings</h3>
                  
                  {myJobs.length > 0 ? (
                    <div className="space-y-4">
                      {myJobs.map((job) => (
                        <div key={job._id} className="p-4 border border-slate-100 dark:border-zinc-800 rounded-lg hover:border-slate-300 dark:hover:border-zinc-700 transition duration-200">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Link to={`/jobs/${job._id}`} className="font-extrabold hover:text-primary-600 dark:hover:text-primary-400 transition">
                                  {job.title}
                                </Link>
                                <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                                  job.jobType === 'internship' 
                                    ? 'bg-accent-100 text-accent-800 dark:bg-accent-950/40 dark:text-accent-400' 
                                    : 'bg-primary-100 text-primary-800 dark:bg-primary-950/40 dark:text-primary-400'
                                }`}>
                                  {job.jobType}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                                {job.category} • Budget: ${job.budget} • {job.bidsCount || 0} applications
                              </p>
                              {job.assignedFreelancer && (
                                <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-2">
                                  Assigned to: <span className="font-semibold text-slate-600 dark:text-zinc-300">{job.assignedFreelancer.firstName} {job.assignedFreelancer.lastName}</span>
                                </p>
                              )}
                            </div>
                            <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                              job.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400' :
                              job.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400' :
                              job.status === 'completed' ? 'bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-300' :
                              'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400'
                            }`}>
                              {job.status === 'in_progress' ? 'active' : job.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="mx-auto text-slate-300 dark:text-zinc-700 mb-2" size={44} />
                      <p className="text-sm text-slate-500 dark:text-zinc-400">You haven't posted any jobs or internships yet.</p>
                      <Link to="/jobs/new" className="text-xs text-primary-600 dark:text-primary-400 font-bold hover:underline mt-2 inline-block">
                        Post your first listing
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Budget / Analytics Column */}
              <div className="space-y-6">
                
                {/* Budget Allocations */}
                <div className="card">
                  <h3 className="font-bold text-base mb-6 flex items-center gap-1">
                    <ChartBar size={18} className="text-primary-600" /> Budget Allocation
                  </h3>
                  
                  {categoryLabels.length > 0 ? (
                    <div className="space-y-6">
                      
                      {/* Custom SVG Bar Chart */}
                      <div className="h-40 flex items-end gap-3 justify-around pt-4 border-b border-slate-100 dark:border-zinc-800 pb-2">
                        {categoryBudgets.map((val, idx) => {
                          const heightPct = Math.round((val / maxBudget) * 100);
                          return (
                            <div key={idx} className="flex flex-col items-center group w-full">
                              <div className="text-[10px] font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                ${val}
                              </div>
                              <div 
                                className="bg-primary-800 hover:bg-primary-900 rounded-t w-8 transition-all duration-500" 
                                style={{ height: `${Math.max(heightPct, 10)}px` }}
                              ></div>
                              <span className="text-[9px] text-slate-400 dark:text-zinc-500 mt-2 truncate w-12 text-center">
                                {categoryLabels[idx].split(' ')[0]}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Legends */}
                      <div className="space-y-3 pt-2">
                        {categoryLabels.map((lbl, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 dark:text-zinc-400">{lbl}</span>
                            <span className="font-bold">${categoryBudgets[idx]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 dark:text-zinc-500 text-center py-6">
                      No budget metrics available. Post job listings to populate analytics.
                    </p>
                  )}
                </div>

                {/* Info Card */}
                <div className="card bg-zinc-900 text-white dark:bg-zinc-900 border-none">
                  <h4 className="font-bold text-sm text-primary-400">StuGig Student Match</h4>
                  <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                    Our platform automatically matches student skills extracted from their resumes to your job criteria. Ensure you provide descriptive skills when posting.
                  </p>
                  <Link to="/jobs/new" className="text-xs font-bold text-white flex items-center gap-1 hover:underline mt-4">
                    Create Listing <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
