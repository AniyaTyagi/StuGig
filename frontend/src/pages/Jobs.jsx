import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getJobs } from '../redux/slices/jobSlice';

const Jobs = () => {
  const dispatch = useDispatch();
  const { jobs, isLoading } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);

  if (isLoading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Browse Jobs</h1>
        <Link
          to="/jobs/new"
          className="bg-primary-800 text-white px-6 py-2 rounded-lg hover:bg-primary-900"
        >
          Post a Job
        </Link>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <Link
            key={job._id}
            to={`/jobs/${job._id}`}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
            <p className="text-gray-600 mb-4">{job.description?.substring(0, 150)}...</p>
            <div className="flex justify-between items-center">
              <div className="flex space-x-4 text-sm text-gray-600">
                <span>💰 ${job.budget}</span>
                <span>📅 {job.deadline}</span>
                <span>📊 {job.bidsCount || 0} bids</span>
              </div>
              <span className="text-accent-500 font-semibold">View Details →</span>
            </div>
          </Link>
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No jobs available at the moment
        </div>
      )}
    </div>
  );
};

export default Jobs;
