import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../services/api';

const FreelancerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    activeJobs: 0,
    earnings: 0,
    rating: 0,
    pendingBids: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/users/stats');
        setStats(statsRes.data);
        
        const jobsRes = await api.get('/jobs/my-jobs');
        setRecentJobs(jobsRes.data.slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome back, {user?.name}
      </h1>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Active Jobs</p>
          <p className="text-3xl font-bold text-indigo-600">{stats.activeJobs}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total Earnings</p>
          <p className="text-3xl font-bold text-green-600">${stats.earnings}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Rating</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.rating.toFixed(1)}⭐</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Pending Bids</p>
          <p className="text-3xl font-bold text-blue-600">{stats.pendingBids}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/jobs"
              className="block w-full bg-indigo-600 text-white text-center py-2 rounded-lg hover:bg-indigo-700"
            >
              Browse Jobs
            </Link>
            <Link
              to="/services/new"
              className="block w-full bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700"
            >
              Create Service
            </Link>
            <Link
              to="/messages"
              className="block w-full bg-gray-600 text-white text-center py-2 rounded-lg hover:bg-gray-700"
            >
              Messages
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Jobs</h2>
          <div className="space-y-3">
            {recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <Link
                  key={job._id}
                  to={`/jobs/${job._id}`}
                  className="block p-3 border rounded-lg hover:bg-gray-50"
                >
                  <p className="font-semibold">{job.title}</p>
                  <p className="text-sm text-gray-600">${job.budget}</p>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">No jobs yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
