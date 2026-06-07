import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchFreelancerRecommendations } from '../../redux/slices/aiSlice';
import { Sparkles, Star, Target, Award, TrendingUp, MessageCircle } from 'lucide-react';

const AIFreelancerRecommendations = ({ jobId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { freelancerRecommendations, loading } = useSelector((state) => state.ai);

  useEffect(() => {
    if (jobId) {
      dispatch(fetchFreelancerRecommendations({ jobId, limit: 10 }));
    }
  }, [jobId, dispatch]);

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 55) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
          <h2 className="text-lg font-semibold">AI-Recommended Freelancers</h2>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!freelancerRecommendations?.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold">AI-Recommended Freelancers</h2>
        </div>
        <p className="text-gray-500 text-center py-8">No recommendations available for this job yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold">AI-Recommended Talent</h2>
          </div>
          <span className="text-sm text-gray-500">{freelancerRecommendations.length} perfect matches</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Based on skills, experience, ratings, and success rate
        </p>
      </div>

      <div className="divide-y">
        {freelancerRecommendations.map((rec) => {
          const { freelancer, compatibility } = rec;

          return (
            <div key={freelancer._id} className="p-6 hover:bg-gray-50 transition">
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={freelancer.avatar || `https://ui-avatars.com/api/?name=${freelancer.firstName}+${freelancer.lastName}`}
                    alt={`${freelancer.firstName} ${freelancer.lastName}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className={`absolute -top-1 -right-1 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold ${getScoreColor(compatibility.totalScore)}`}>
                    {compatibility.totalScore}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {freelancer.firstName} {freelancer.lastName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {freelancer.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{freelancer.rating.toFixed(1)}</span>
                          </div>
                        )}
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{freelancer.completedJobs || 0} jobs completed</span>
                      </div>
                    </div>
                    
                    {compatibility.recommendation === 'excellent' && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Top Match
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{freelancer.bio}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {freelancer.skills?.slice(0, 5).map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                    {freelancer.skills?.length > 5 && (
                      <span className="text-xs text-gray-500">+{freelancer.skills.length - 5} more</span>
                    )}
                  </div>

                  {/* Compatibility Breakdown */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="flex items-center gap-1 text-xs">
                      <Target className="w-3 h-3 text-purple-600" />
                      <span className="text-gray-600">Skills:</span>
                      <span className="font-semibold">{Math.round(compatibility.breakdown.skillMatch)}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Award className="w-3 h-3 text-purple-600" />
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-semibold">{Math.round(compatibility.breakdown.experienceMatch)}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <TrendingUp className="w-3 h-3 text-purple-600" />
                      <span className="text-gray-600">Success:</span>
                      <span className="font-semibold">{Math.round(compatibility.breakdown.successRateMatch)}%</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/profile/${freelancer._id}`)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => navigate(`/messages?user=${freelancer._id}`)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition flex items-center gap-1"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </button>
                  </div>
                </div>
              </div>

              {/* Confidence Badge */}
              {compatibility.confidence === 'high' && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-green-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>High confidence match based on comprehensive analysis</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-purple-50 border-t">
        <p className="text-xs text-purple-800 text-center">
          💡 AI analyzes 8+ factors including skills, experience, ratings, success rate, and behavior patterns
        </p>
      </div>
    </div>
  );
};

export default AIFreelancerRecommendations;
