const Bid = require('../models/Bid');
const Job = require('../models/Job');
const User = require('../models/User');
const { createNotification } = require('../utils/notification');

// @route   POST /api/bids
const createBid = async (req, res) => {
  try {
    const { job, amount, deliveryTime, proposal } = req.body;
    
    const jobExists = await Job.findById(job);
    if (!jobExists) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    if (jobExists.status !== 'open') {
      return res.status(400).json({ message: 'Job is not accepting bids' });
    }
    
    const existingBid = await Bid.findOne({ job, freelancer: req.user._id });
    if (existingBid) {
      return res.status(400).json({ message: 'You have already bid on this job' });
    }
    
    const bid = await Bid.create({
      job,
      freelancer: req.user._id,
      amount,
      deliveryTime,
      proposal
    });
    
    jobExists.bidsCount += 1;
    await jobExists.save();
    
    await createNotification(
      jobExists.client,
      'bid_received',
      'New Bid Received',
      `${req.user.firstName} ${req.user.lastName} placed a bid on your job`,
      `/jobs/${job}`
    );
    
    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/bids/job/:jobId
const getJobBids = async (req, res) => {
  try {
    const bids = await Bid.find({ 
      job: req.params.jobId, 
      isDeleted: false 
    })
    .populate('freelancer', 'firstName lastName avatar rating reviewCount skills')
    .sort({ createdAt: -1 });
    
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/bids/my-bids
const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ 
      freelancer: req.user._id, 
      isDeleted: false 
    })
    .populate('job')
    .sort({ createdAt: -1 });
    
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/bids/:id/accept
const acceptBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id).populate('job');
    
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    if (bid.job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    bid.status = 'accepted';
    await bid.save();
    
    const job = await Job.findById(bid.job._id);
    job.status = 'awarded';
    job.acceptedBid = bid._id;
    job.assignedFreelancer = bid.freelancer;
    await job.save();
    
    await Bid.updateMany(
      { job: bid.job._id, _id: { $ne: bid._id } },
      { status: 'rejected' }
    );
    
    await createNotification(
      bid.freelancer,
      'bid_accepted',
      'Bid Accepted!',
      `Your bid on "${job.title}" has been accepted`,
      `/jobs/${job._id}`
    );
    
    res.json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/bids/:id/reject
const rejectBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id).populate('job');
    
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    if (bid.job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    bid.status = 'rejected';
    await bid.save();
    
    await createNotification(
      bid.freelancer,
      'bid_rejected',
      'Bid Not Selected',
      `Your bid on "${bid.job.title}" was not selected`,
      `/jobs/${bid.job._id}`
    );
    
    res.json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/bids/:id
const deleteBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);
    
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    if (bid.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (bid.status === 'accepted') {
      return res.status(400).json({ message: 'Cannot delete accepted bid' });
    }
    
    bid.status = 'withdrawn';
    bid.isDeleted = true;
    await bid.save();
    
    const job = await Job.findById(bid.job);
    job.bidsCount = Math.max(0, job.bidsCount - 1);
    await job.save();
    
    res.json({ message: 'Bid withdrawn' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  createBid, 
  getJobBids, 
  getMyBids, 
  acceptBid, 
  rejectBid,
  deleteBid 
};
