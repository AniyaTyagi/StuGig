import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBiddingSuggestions } from '../../redux/slices/aiSlice';
import { Brain, DollarSign, Clock, Lightbulb, TrendingUp, Users } from 'lucide-react';

const AIBiddingAssistant = ({ jobId, onSuggestionApply }) => {
  const dispatch = useDispatch();
  const { biddingSuggestions, loading } = useSelector((state) => state.ai);

  useEffect(() => {
    if (jobId) {
      dispatch(fetchBiddingSuggestions(jobId));
    }
  }, [jobId, dispatch]);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-purple-600 animate-pulse" />
          <h3 className="font-semibold">AI Bidding Assistant</h3>
        </div>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!biddingSuggestions) return null;

  const {
    suggestedAmount,
    suggestedDelivery,
    complexity,
    competitionLevel,
    tips,
    winProbability
  } = biddingSuggestions;

  const complexityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const competitionColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4 border border-purple-200">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-900">AI Bidding Assistant</h3>
        <span className="ml-auto text-xs text-purple-600 font-medium">Powered by StuGig AI</span>
      </div>

      {/* Suggestions */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-600">Suggested Bid</span>
          </div>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-bold text-gray-900">${suggestedAmount}</span>
            <button
              onClick={() => onSuggestionApply?.({ amount: suggestedAmount })}
              className="text-xs text-purple-600 hover:text-purple-700 font-medium ml-auto"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-gray-600">Suggested Time</span>
          </div>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-bold text-gray-900">{suggestedDelivery}</span>
            <span className="text-sm text-gray-600 mb-1">days</span>
            <button
              onClick={() => onSuggestionApply?.({ deliveryTime: suggestedDelivery })}
              className="text-xs text-purple-600 hover:text-purple-700 font-medium ml-auto"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white rounded p-2 text-center">
          <div className="text-xs text-gray-600 mb-1">Complexity</div>
          <span className={`text-xs px-2 py-1 rounded font-medium ${complexityColors[complexity]}`}>
            {complexity.toUpperCase()}
          </span>
        </div>
        <div className="bg-white rounded p-2 text-center">
          <div className="text-xs text-gray-600 mb-1">Competition</div>
          <span className={`text-xs px-2 py-1 rounded font-medium ${competitionColors[competitionLevel]}`}>
            {competitionLevel.toUpperCase()}
          </span>
        </div>
        <div className="bg-white rounded p-2 text-center">
          <div className="text-xs text-gray-600 mb-1">Win Chance</div>
          <div className="flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="text-sm font-bold text-green-600">{winProbability}%</span>
          </div>
        </div>
      </div>

      {/* AI Tips */}
      <div className="bg-white rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-semibold text-gray-900">AI Tips to Win</span>
        </div>
        <ul className="space-y-1.5">
          {tips?.map((tip, index) => (
            <li key={index} className="text-xs text-gray-700 flex items-start gap-2">
              <span className="text-purple-600 mt-0.5">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => onSuggestionApply?.({ amount: suggestedAmount, deliveryTime: suggestedDelivery })}
        className="w-full mt-3 bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
      >
        Apply All Suggestions
      </button>
    </div>
  );
};

export default AIBiddingAssistant;
