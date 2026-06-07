const Review = require('../models/Review');
const User = require('../models/User');
const Service = require('../models/Service');
const Job = require('../models/Job');
const { createNotification } = require('../utils/notification');

// @route   POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { jobId, serviceId, revieweeId, rating, comment } = req.body;
    
    if (jobId) {
      const existingReview = await Review.findOne({ job: jobId, reviewer: req.user._id });
      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this job' });
      }
    }
    
    const review = await Review.create({
      job: jobId,
      service: serviceId,
      reviewer: req.user._id,
      reviewee: revieweeId,
      rating,
      comment
    });
    
    const reviewee = await User.findById(revieweeId);
    const reviews = await Review.find({ reviewee: revieweeId, isDeleted: false });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    reviewee.rating = avgRating;
    reviewee.reviewCount = reviews.length;
    await reviewee.save();
    
    if (serviceId) {
      const service = await Service.findById(serviceId);
      const serviceReviews = await Review.find({ service: serviceId, isDeleted: false });
      const serviceAvgRating = serviceReviews.reduce((acc, r) => acc + r.rating, 0) / serviceReviews.length;
      service.rating = serviceAvgRating;
      service.reviewCount = serviceReviews.length;
      await service.save();
    }
    
    await createNotification(
      revieweeId,
      'review',
      'New Review',
      `${req.user.firstName} left you a ${rating}-star review`,
      `/profile/${req.user._id}`
    );
    
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/reviews/user/:userId
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ 
      reviewee: req.params.userId, 
      isDeleted: false 
    })
    .populate('reviewer', 'firstName lastName avatar')
    .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/reviews/service/:serviceId
const getServiceReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ 
      service: req.params.serviceId, 
      isDeleted: false 
    })
    .populate('reviewer', 'firstName lastName avatar')
    .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    if (review.reviewer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    review.isDeleted = true;
    await review.save();
    
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  createReview, 
  getUserReviews, 
  getServiceReviews, 
  deleteReview 
};
