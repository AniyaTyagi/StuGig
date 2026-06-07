/**
 * Job Routes
 * @module routes/jobs
 * @description Job posting and management endpoints
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const { 
  createJob, 
  getJobs, 
  getJobById, 
  updateJob, 
  deleteJob,
  getMyJobs,
  completeJob,
  getHiredJobs
} = require('../controllers/jobController');
const { protect, authorize } = require('../middlewares/auth');

/**
 * @route   POST /api/v1/jobs
 * @desc    Create a new job posting
 * @access  Private (Recruiter/Startup/Client)
 */
/**
 * @route   GET /api/v1/jobs
 * @desc    Get all jobs with optional filters
 * @access  Public
 */
router.route('/')
  .post(protect, authorize('recruiter', 'startup', 'client'), createJob)
  .get(getJobs);

/**
 * @route   GET /api/v1/jobs/my-jobs
 * @desc    Get all jobs posted by current user
 * @access  Private (Recruiter/Startup/Client)
 */
router.get('/my-jobs', protect, authorize('recruiter', 'startup', 'client'), getMyJobs);

/**
 * @route   GET /api/v1/jobs/hired
 * @desc    Get all jobs where current user is hired
 * @access  Private (Student/Freelancer)
 */
router.get('/hired', protect, authorize('student', 'freelancer'), getHiredJobs);

/**
 * @route   GET /api/v1/jobs/:id
 * @desc    Get job by ID
 * @access  Public
 */
/**
 * @route   PUT /api/v1/jobs/:id
 * @desc    Update a job posting
 * @access  Private (Recruiter/Startup/Client - Owner only)
 */
/**
 * @route   DELETE /api/v1/jobs/:id
 * @desc    Delete a job posting
 * @access  Private (Recruiter/Startup/Client - Owner only)
 */
router.route('/:id')
  .get(getJobById)
  .put(protect, authorize('recruiter', 'startup', 'client'), updateJob)
  .delete(protect, authorize('recruiter', 'startup', 'client'), deleteJob);

/**
 * @route   PUT /api/v1/jobs/:id/complete
 * @desc    Mark job as completed
 * @access  Private (Recruiter/Startup/Client - Owner only)
 */
router.put('/:id/complete', protect, authorize('recruiter', 'startup', 'client'), completeJob);

module.exports = router;
