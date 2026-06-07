import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DollarSign, Calendar, Briefcase, MapPin, ArrowLeft, Send } from 'lucide-react';
import { jobService } from '../services/jobService';
import Loading from '../components/common/Loading';
import api from '../services/api';
import toast from 'react-hot-toast';
import AIBiddingAssistant from '../components/job/AIBiddingAssistant';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [job, setJob] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidForm, setBidForm] = useState({
    amount: '',
    deliveryTime: '',
    proposal: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJobDetail();
    fetchBids();
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      const response = await jobService.getJobById(id);
      const jobData = response.data || response;
      setJob(jobData);
      setBidForm({ ...bidForm, amount: jobData.budget || '' });
    } catch (error) {
      toast.error('Failed to load job');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const response = await api.get(`/bids/job/${id}`);
      setBids(response.data || response.bids || response || []);
    } catch (error) {
      console.error('Failed to load bids');
    }
  };

  const handleSuggestionApply = (suggestions) => {
    setBidForm(prev => ({
      ...prev,
      amount: suggestions.amount !== undefined ? suggestions.amount : prev.amount,
      deliveryTime: suggestions.deliveryTime !== undefined ? suggestions.deliveryTime : prev.deliveryTime
    }));
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to submit a bid');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/bids', {
        job: job._id,
        amount: Number(bidForm.amount),
        deliveryTime: Number(bidForm.deliveryTime),
        proposal: bidForm.proposal
      });
      toast.success('Bid submitted successfully!');
      setShowBidForm(false);
      setBidForm({ amount: job.budget, deliveryTime: '', proposal: '' });
      fetchBids();
    } catch (error) {
      toast.error(error?.message || 'Failed to submit bid');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptBid = async (bidId) => {
    try {
      await api.put(`/bids/${bidId}/accept`);
      toast.success('Bid accepted! Contract started.');
      fetchJobDetail();
      fetchBids();
    } catch (error) {
      toast.error(error?.message || 'Failed to accept bid');
    }
  };

  const isJobOwner = user?._id === job?.client?._id;
  const isFreelancer = user?.role === 'freelancer' || user?.role === 'student';
  const hasUserBid = bids.some(bid => bid.freelancer?._id === user?._id);

  if (loading) {
    return <Loading fullScreen text="Loading job details..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft size={20} />
          <span>Back to Jobs</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Job Header */}
            <div className="bg-white rounded-lg p-6 border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-medium uppercase">
                    {job.status}
                  </span>
                  <h1 className="text-3xl font-medium mt-3 mb-2">{job.title}</h1>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Briefcase size={16} />
                  <span>{job.category}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign size={16} />
                  <span className="font-medium">${job.budget}</span>
                </div>
              </div>

              {/* Client Info */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <img
                  src={job.client?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${job.client?._id}`}
                  alt="client"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-medium">{job.client?.firstName} {job.client?.lastName}</p>
                  <p className="text-sm text-gray-500">{job.client?.company || 'Startup'}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-6 border">
              <h2 className="text-xl font-medium mb-3">Job Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            {/* Skills Required */}
            <div className="bg-white rounded-lg p-6 border">
              <h2 className="text-xl font-medium mb-3">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills?.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Bids Section */}
            {isJobOwner && (
              <div className="bg-white rounded-lg p-6 border">
                <h2 className="text-xl font-medium mb-4">Proposals ({bids.length})</h2>
                {bids.length > 0 ? (
                  <div className="space-y-4">
                    {bids.map((bid) => (
                      <div key={bid._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={bid.freelancer?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${bid.freelancer?._id}`}
                              alt="freelancer"
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-medium">{bid.freelancer?.firstName} {bid.freelancer?.lastName}</p>
                              <p className="text-sm text-gray-500">{bid.freelancer?.university}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-medium text-green-600">${bid.amount}</p>
                            <p className="text-xs text-gray-500">{bid.deliveryTime} days</p>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm mb-3">{bid.proposal}</p>
                        <div className="flex gap-2">
                          {bid.status === 'pending' && job.status === 'open' && (
                            <button
                              onClick={() => handleAcceptBid(bid._id)}
                              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                            >
                              Accept Proposal
                            </button>
                          )}
                          {bid.status === 'accepted' && (
                            <span className="px-4 py-2 bg-green-100 text-green-800 rounded text-sm font-medium">
                              ✓ Accepted
                            </span>
                          )}
                          {bid.status === 'rejected' && (
                            <span className="px-4 py-2 bg-red-100 text-red-800 rounded text-sm">
                              Rejected
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No proposals yet</p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              
              {/* Bid Form Card */}
              {isFreelancer && !isJobOwner && job.status === 'open' && (
                <div className="bg-white border rounded-lg p-6">
                  {!showBidForm && !hasUserBid ? (
                    <button
                      onClick={() => setShowBidForm(true)}
                      className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition flex items-center justify-center gap-2"
                    >
                      <Send size={18} />
                      <span>Submit Proposal</span>
                    </button>
                  ) : hasUserBid ? (
                    <div className="text-center py-4">
                      <p className="text-green-600 font-medium">✓ Proposal Submitted</p>
                      <p className="text-sm text-gray-500 mt-1">Waiting for client review</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitBid} className="space-y-4">
                      <h3 className="font-medium text-lg mb-4">Submit Your Proposal</h3>
                      
                      {/* AI BIDDING ASSISTANT */}
                      <AIBiddingAssistant jobId={id} onSuggestionApply={handleSuggestionApply} />
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Bid Amount ($)</label>
                        <input
                          type="number"
                          required
                          value={bidForm.amount}
                          onChange={(e) => setBidForm({ ...bidForm, amount: e.target.value })}
                          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          placeholder="Enter your bid"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Delivery Time (days)</label>
                        <input
                          type="number"
                          required
                          value={bidForm.deliveryTime}
                          onChange={(e) => setBidForm({ ...bidForm, deliveryTime: e.target.value })}
                          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          placeholder="Number of days"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Cover Letter</label>
                        <textarea
                          required
                          rows={6}
                          value={bidForm.proposal}
                          onChange={(e) => setBidForm({ ...bidForm, proposal: e.target.value })}
                          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          placeholder="Explain why you're the best fit for this job..."
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium disabled:bg-gray-300 transition"
                        >
                          {submitting ? 'Submitting...' : 'Submit'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowBidForm(false)}
                          className="px-4 py-2 border rounded hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Job Stats */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-medium mb-4">Job Statistics</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget</span>
                    <span className="font-medium">${job.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Proposals</span>
                    <span className="font-medium">{bids.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job Type</span>
                    <span className="font-medium capitalize">{job.jobType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posted</span>
                    <span className="font-medium">{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
