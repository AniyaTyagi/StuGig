import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchJobRecommendations } from '../../redux/slices/aiSlice';
import { Sparkles, Target, TrendingUp, Clock } from 'lucide-react';

const AIJobRecommendations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobRecommendations, loading } = useSelector((state) => state.ai || { jobRecommendations: [], loading: false });

  useEffect(() => {
    dispatch(fetchJobRecommendations(5));
  }, [dispatch]);

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    if (score >= 55) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getRecommendationBadge = (recommendation) => {
    const badges = {
      excellent: { text: 'Excellent Match', color: 'bg-green-100 text-green-800' },
      good: { text: 'Good Match', color: 'bg-blue-100 text-blue-800' },
      fair: { text: 'Fair Match', color: 'bg-yellow-100 text-yellow-800' }
    };
    return badges[recommendation] || badges.fair;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
          <h2 className="text-lg font-semibold">AI-Powered Recommendations</h2>
        </div>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!jobRecommendations?.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold">AI-Powered Recommendations</h2>
        </div>
        <p className="text-gray-500 text-center py-8">No recommendations yet. Complete your profile to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold">AI-Powered Job Matches</h2>
          </div>
          <span className="text-sm text-gray-500">{jobRecommendations.length} personalized matches</span>
        </div>
      </div>

      <div className="divide-y">
        {jobRecommendations.map((rec) => {
          const job = rec?.job || rec;
          const compatibility = rec?.compatibility || {};
          const badge = getRecommendationBadge(compatibility?.recommendation || 'fair');
          const totalScore = compatibility?.totalScore || 0;
          const breakdown = compatibility?.breakdown || {};

          return (
            <div
              key={job?._id}
              onClick={() => navigate(`/jobs/${job?._id}`)}
              className="p-6 hover:bg-gray-50 cursor-pointer transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{job?.title || 'Untitled Job'}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{job?.description || 'No description'}</p>
                </div>
                <div className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${getScoreColor(totalScore)}`}>
                  {totalScore}% Match
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span className="font-semibold text-green-600">${job?.budget || 0}</span>
                <span>•</span>
                <span>{job?.category || 'Uncategorized'}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {job?.deadline ? new Date(job.deadline).toLocaleDateString() : 'No deadline'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs font-medium ${badge.color}`}>
                  {badge.text}
                </span>
                
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    <span>Skills: {Math.round(breakdown?.skillMatch || 0)}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Success: {Math.round(breakdown?.successRateMatch || 0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-purple-50 border-t">
        <p className="text-xs text-purple-800 text-center">
          💡 Recommendations based on your skills, experience, and past performance
        </p>
      </div>
    </div>
  );
};

export default AIJobRecommendations;
