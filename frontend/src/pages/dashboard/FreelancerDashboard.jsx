import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DollarSign, Briefcase, Star, Clock, AlertCircle, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { jobService } from '../../services/jobService';
import { bidService } from '../../services/bidService';
import api from '../../services/api';
import toast from 'react-hot-toast';
import AIJobRecommendations from '../../components/dashboard/AIJobRecommendations';

const FreelancerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeJobs, setActiveJobs] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [profileDetails, setProfileDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // active, bids, recommended

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [hiredJobsData, bidsData, allJobsData, profileData] = await Promise.all([
        jobService.getHiredJobs(),
        bidService.getMyBids(),
        jobService.getJobs({ limit: 100 }), // Get a larger pool to find matches
        api.get('/users/profile')
      ]);

      const jobsList = Array.isArray(hiredJobsData) ? hiredJobsData : hiredJobsData.jobs || [];
      const bidsList = bidsData.bids || bidsData || [];
      const profile = profileData.data || profileData;
      
      setActiveJobs(jobsList);
      setMyBids(bidsList);
      setProfileDetails(profile);

      // Match skills for recommendations
      const userSkills = profile.skills || [];
      const allJobs = allJobsData.jobs || [];
      const matches = allJobs.filter(job => 
        job.status === 'open' &&
        job.skills.some(skill => userSkills.some(us => us.toLowerCase() === skill.toLowerCase()))
      );
      setRecommendedJobs(matches.slice(0, 5));

    } catch (error) {
      console.error(error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const pendingBids = myBids.filter(b => b.status === 'pending').length;
  const activeContractsCount = activeJobs.filter(j => j.status === 'in_progress' || j.status === 'awarded').length;

  // Mock Earnings History for SVG Chart
  const chartData = [100, 250, 200, 450, user?.earnings || 680];
  const chartLabels = ['Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <span className="text-primary-600 dark:text-primary-400 font-semibold tracking-wider text-xs uppercase">Student Portal</span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1">Welcome back, {user?.firstName}!</h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Here is a snapshot of your freelance activities and skill match recommendations.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/services" className="btn btn-outline">My Gigs</Link>
            <Link to="/jobs" className="btn btn-primary">Find Work</Link>
          </div>
        </div>

        {loading ? (
          /* Skeleton Loader */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="h-64 bg-slate-200 dark:bg-zinc-900 rounded-xl animate-pulse"></div>
              <div className="h-48 bg-slate-200 dark:bg-zinc-900 rounded-xl animate-pulse"></div>
            </div>
            <div className="lg:col-span-3 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="h-24 bg-slate-200 dark:bg-zinc-900 rounded-xl animate-pulse"></div>
                ))}
              </div>
              <div className="h-64 bg-slate-200 dark:bg-zinc-900 rounded-xl animate-pulse"></div>
              <div className="h-80 bg-slate-200 dark:bg-zinc-900 rounded-xl animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Column */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Profile Card */}
              <div className="card text-center flex flex-col items-center">
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName}`}
                  alt="avatar"
                  className="w-20 h-20 rounded-full bg-slate-100 dark:bg-zinc-800 border-2 border-primary-500 p-0.5 mb-4 shadow"
                />
                <h2 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">{user?.university || 'University Student'}</p>
                <div className="flex flex-wrap gap-1 justify-center mt-4">
                  {user?.skills?.slice(0, 4).map((skill, index) => (
                    <span key={index} className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Profile Completion Card */}
              {profileDetails?.completionRate !== undefined && (
                <div className="card">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm">Profile Strength</h3>
                    <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                      {profileDetails.completionRate}%
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2 mb-4">
                    <div
                      className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${profileDetails.completionRate}%` }}
                    ></div>
                  </div>

                  {profileDetails.completionRate < 100 ? (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-500 dark:text-zinc-400 flex items-start gap-1">
                        <AlertCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <span>Complete missing fields to gain 3x more recruiters visibility.</span>
                      </p>
                      <div className="pt-2 border-t dark:border-zinc-800">
                        <Link to="/settings" className="text-xs text-primary-600 dark:text-primary-400 font-bold hover:underline flex items-center gap-1">
                          Complete profile <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle size={14} />
                      <span>All set! Your profile is 100% complete.</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Main Dashboard Column */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                <div className="card flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Earnings</p>
                    <p className="text-2xl font-black mt-1">${user?.balance || 0}</p>
                  </div>
                  <div className="p-2.5 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-xl">
                    <DollarSign size={24} />
                  </div>
                </div>

                <div className="card flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Active Jobs</p>
                    <p className="text-2xl font-black mt-1">{activeContractsCount}</p>
                  </div>
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Briefcase size={24} />
                  </div>
                </div>

                <div className="card flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Avg Rating</p>
                    <p className="text-2xl font-black mt-1">{user?.rating?.toFixed(1) || '5.0'}</p>
                  </div>
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 text-amber-500 dark:text-amber-400 rounded-xl">
                    <Star size={24} />
                  </div>
                </div>

                <div className="card flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Pending Bids</p>
                    <p className="text-2xl font-black mt-1">{pendingBids}</p>
                  </div>
                  <div className="p-2.5 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 rounded-xl">
                    <Clock size={24} />
                  </div>
                </div>
              </div>

              {/* Earnings History Chart */}
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-bold text-lg">Earnings Growth</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Your mock performance trend over the last 5 months</p>
                  </div>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-zinc-800 text-[11px] font-bold text-slate-600 dark:text-zinc-400 rounded-lg">
                    Total: ${user?.earnings || 0}
                  </span>
                </div>
                
                {/* SVG Line Chart */}
                <div className="w-full h-48 relative">
                  <svg className="w-full h-full" viewBox="0 0 500 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Area path */}
                    <path
                      d={`M 10 90 L 120 70 L 230 80 L 345 40 L 490 20 L 490 95 L 10 95 Z`}
                      fill="url(#chartGrad)"
                      className="transition-all duration-300"
                    />
                    {/* Line path */}
                    <path
                      d={`M 10 90 L 120 70 L 230 80 L 345 40 L 490 20`}
                      fill="none"
                      stroke="#0ea5e9"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Dots */}
                    <circle cx="10" cy="90" r="4" fill="#0ea5e9" className="hover:scale-125 transition-transform" />
                    <circle cx="120" cy="70" r="4" fill="#0ea5e9" />
                    <circle cx="230" cy="80" r="4" fill="#0ea5e9" />
                    <circle cx="345" cy="40" r="4" fill="#0ea5e9" />
                    <circle cx="490" cy="20" r="4" fill="#0ea5e9" />
                  </svg>
                  {/* Labels Row */}
                  <div className="flex justify-between text-[10px] text-slate-400 dark:text-zinc-500 font-bold px-2 mt-2">
                    {chartLabels.map((lbl, idx) => (
                      <span key={idx}>{lbl}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Activities Tabs */}
              <div className="space-y-4">
                <div className="flex border-b border-slate-200 dark:border-zinc-800">
                  <button
                    onClick={() => setActiveTab('ai')}
                    className={`pb-3 text-sm font-semibold border-b-2 px-4 transition-all ${
                      activeTab === 'ai'
                        ? 'border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                        : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800'
                    }`}
                  >
                    🤖 AI Matches
                  </button>
                  <button
                    onClick={() => setActiveTab('active')}
                    className={`pb-3 text-sm font-semibold border-b-2 px-4 transition-all ${
                      activeTab === 'active'
                        ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                        : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800'
                    }`}
                  >
                    Active Projects ({activeJobs.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('bids')}
                    className={`pb-3 text-sm font-semibold border-b-2 px-4 transition-all ${
                      activeTab === 'bids'
                        ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                        : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800'
                    }`}
                  >
                    My Bids ({myBids.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('recommended')}
                    className={`pb-3 text-sm font-semibold border-b-2 px-4 transition-all ${
                      activeTab === 'recommended'
                        ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                        : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800'
                    }`}
                  >
                    Recommended ({recommendedJobs.length})
                  </button>
                </div>

                {/* Tab Contents */}
                {activeTab === 'ai' && (
                  <AIJobRecommendations />
                )}

                {activeTab === 'active' && (
                  <div className="card">
                    {activeJobs.length > 0 ? (
                      <div className="divide-y divide-slate-100 dark:divide-zinc-800 space-y-4">
                        {activeJobs.map((job) => (
                          <div key={job._id} className="flex justify-between items-center pt-4 first:pt-0">
                            <div>
                              <Link to={`/jobs/${job._id}`} className="font-bold hover:text-primary-600 text-sm">
                                {job.title}
                              </Link>
                              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                                Client: {job.client?.firstName} {job.client?.lastName} • Budget: ${job.budget}
                              </p>
                            </div>
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400">
                              {job.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Award className="mx-auto text-slate-300 dark:text-zinc-700 mb-2" size={40} />
                        <p className="text-sm text-slate-500 dark:text-zinc-400">No active projects assigned yet.</p>
                        <Link to="/jobs" className="text-xs text-primary-600 dark:text-primary-400 font-bold hover:underline mt-2 inline-block">
                          Find your first job now
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'bids' && (
                  <div className="card">
                    {myBids.length > 0 ? (
                      <div className="divide-y divide-slate-100 dark:divide-zinc-800 space-y-4">
                        {myBids.map((bid) => (
                          <div key={bid._id} className="flex justify-between items-center pt-4 first:pt-0">
                            <div>
                              <h4 className="font-bold text-sm">{bid.job?.title || 'Contract Offering'}</h4>
                              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                                Proposal amount: ${bid.amount} • Delivery: {bid.deliveryTime} days
                              </p>
                            </div>
                            <span className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase rounded-full ${
                              bid.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400' :
                              bid.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400' :
                              'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                            }`}>
                              {bid.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="mx-auto text-slate-300 dark:text-zinc-700 mb-2" size={40} />
                        <p className="text-sm text-slate-500 dark:text-zinc-400">You haven't placed any proposals yet.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'recommended' && (
                  <div className="card">
                    {recommendedJobs.length > 0 ? (
                      <div className="divide-y divide-slate-100 dark:divide-zinc-800 space-y-4">
                        {recommendedJobs.map((job) => (
                          <div key={job._id} className="pt-4 first:pt-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <Link to={`/jobs/${job._id}`} className="font-bold hover:text-primary-600 text-sm">
                                  {job.title}
                                </Link>
                                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                                  {job.category} • Budget: ${job.budget} • Deadline: {new Date(job.deadline).toLocaleDateString()}
                                </p>
                              </div>
                              <Link to={`/jobs/${job._id}`} className="text-xs text-primary-600 dark:text-primary-400 font-bold hover:underline">
                                View
                              </Link>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {job.skills?.map((skill, sIdx) => (
                                <span key={sIdx} className="px-1.5 py-0.5 text-[9px] bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="mx-auto text-slate-300 dark:text-zinc-700 mb-2" size={40} />
                        <p className="text-sm text-slate-500 dark:text-zinc-400">No jobs match your current skills.</p>
                        <Link to="/settings" className="text-xs text-primary-600 dark:text-primary-400 font-bold hover:underline mt-2 inline-block">
                          Add more skills to get matches
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerDashboard;
