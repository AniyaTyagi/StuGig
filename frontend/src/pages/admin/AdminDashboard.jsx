import { useEffect, useState } from 'react';
import { Users, Briefcase, DollarSign, TrendingUp, ShieldAlert, Check } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard');
      // Ensure we set data correctly
      setStats(res.data || res);
    } catch (error) {
      toast.error('Failed to load admin statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Title */}
        <div className="mb-8">
          <span className="text-primary-600 dark:text-primary-400 font-semibold tracking-wider text-xs uppercase">Management</span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1">Admin Control Center</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Monitor user registrations, project contracts, and platform commissions.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          
          <div className="card flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Total Users</p>
              <p className="text-2xl font-black mt-1">{stats?.stats?.users?.total || 0}</p>
            </div>
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <Users size={24} />
            </div>
          </div>

          <div className="card flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Active Jobs</p>
              <p className="text-2xl font-black mt-1">{stats?.stats?.jobs?.active || 0}</p>
            </div>
            <div className="p-2.5 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-xl">
              <Briefcase size={24} />
            </div>
          </div>

          <div className="card flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Platform Revenue</p>
              <p className="text-2xl font-black mt-1">${stats?.stats?.revenue?.platform?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <DollarSign size={24} />
            </div>
          </div>

          <div className="card flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Total Contracts Volume</p>
              <p className="text-2xl font-black mt-1">${stats?.stats?.revenue?.total?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="p-2.5 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 rounded-xl">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Users List */}
          <div className="card">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-1.5">
              <Check size={18} className="text-primary-600" /> Recent Registrations
            </h2>
            <div className="divide-y divide-slate-100 dark:divide-zinc-800">
              {stats?.recentUsers?.map((user) => (
                <div key={user._id} className="flex justify-between items-center py-3.5 first:pt-0">
                  <div>
                    <p className="font-bold text-sm">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">{user.email}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded uppercase ${
                    user.role === 'student' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400' :
                    user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400' :
                    'bg-slate-150 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Jobs List */}
          <div className="card">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-1.5">
              <ShieldAlert size={18} className="text-primary-600" /> Recent Postings
            </h2>
            <div className="divide-y divide-slate-100 dark:divide-zinc-800">
              {stats?.recentJobs?.map((job) => (
                <div key={job._id} className="py-3.5 first:pt-0">
                  <h4 className="font-bold text-sm hover:text-primary-600 dark:hover:text-primary-400 transition cursor-pointer">
                    {job.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    Posted by: <span className="font-semibold text-slate-700 dark:text-zinc-300">{job.client?.firstName} {job.client?.lastName}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
