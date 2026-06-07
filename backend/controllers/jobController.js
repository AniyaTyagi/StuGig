/**
 * Job Controller
 * @module controllers/job
 * @description Handles job posting and management operations
 */

const jobService = require('../services/job.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const { createNotification } = require('../utils/notification');

/**
 * Create a new job posting
 * @route POST /api/v1/jobs
 * @param {Object} req.body - Job details
 * @param {Object} req.user - Authenticated user
 * @returns {Object} Created job
 */
const createJob = catchAsync(async (req, res) => {
  const job = await jobService.createJob(req.body, req.user._id);
  ApiResponse.success(res, job, 'Job created successfully', 201);
});

/**
 * Get all jobs with filters and pagination
 * @route GET /api/v1/jobs
 * @param {Object} req.query - Filter parameters
 * @returns {Object} Paginated job list
 */
const getJobs = catchAsync(async (req, res) => {
  const { category, minBudget, maxBudget, search, status, jobType } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;

  const result = await jobService.getJobs(
    { category, minBudget, maxBudget, search, status, jobType },
    { page, limit }
  );

  ApiResponse.paginated(res, result.data, result.pagination, 'Jobs fetched successfully');
});

/**
 * Get job by ID
 * @route GET /api/v1/jobs/:id
 * @param {string} req.params.id - Job ID
 * @returns {Object} Job details
 */
const getJobById = catchAsync(async (req, res) => {
  const job = await jobService.getJobById(req.params.id);
  ApiResponse.success(res, job, 'Job fetched successfully');
});

/**
 * Update a job posting
 * @route PUT /api/v1/jobs/:id
 * @param {string} req.params.id - Job ID
 * @param {Object} req.body - Updated job details
 * @param {Object} req.user - Authenticated user
 * @returns {Object} Updated job
 */
const updateJob = catchAsync(async (req, res) => {
  const job = await jobService.updateJob(req.params.id, req.user._id, req.body);
  ApiResponse.success(res, job, 'Job updated successfully');
});

/**
 * Delete a job posting
 * @route DELETE /api/v1/jobs/:id
 * @param {string} req.params.id - Job ID
 * @param {Object} req.user - Authenticated user
 * @returns {null} Success message
 */
const deleteJob = catchAsync(async (req, res) => {
  await jobService.deleteJob(req.params.id, req.user._id);
  ApiResponse.success(res, null, 'Job deleted successfully');
});

/**
 * Get all jobs posted by current user
 * @route GET /api/v1/jobs/my-jobs
 * @param {Object} req.user - Authenticated user
 * @returns {Object} User's jobs
 */
const getMyJobs = catchAsync(async (req, res) => {
  const result = await jobService.getClientJobs(req.user._id);
  ApiResponse.success(res, result.data, 'Jobs fetched successfully');
});

/**
 * Mark job as completed
 * @route PUT /api/v1/jobs/:id/complete
 * @param {string} req.params.id - Job ID
 * @param {Object} req.user - Authenticated user
 * @returns {Object} Completed job
 */
const completeJob = catchAsync(async (req, res) => {
  const job = await jobService.completeJob(req.params.id, req.user._id);
  
  if (job.assignedFreelancer) {
    await createNotification(
      job.assignedFreelancer,
      'job_completed',
      'Job Completed',
      `Job "${job.title}" has been marked as completed`,
      `/jobs/${job._id}`
    );
  }
  
  ApiResponse.success(res, job, 'Job completed successfully');
});

/**
 * Get all jobs where user is hired
 * @route GET /api/v1/jobs/hired
 * @param {Object} req.user - Authenticated user
 * @returns {Object} Hired jobs
 */
const getHiredJobs = catchAsync(async (req, res) => {
  const result = await jobService.getFreelancerJobs(req.user._id);
  ApiResponse.success(res, result.data, 'Hired jobs fetched successfully');
});

module.exports = { 
  createJob, 
  getJobs, 
  getJobById, 
  updateJob, 
  deleteJob,
  getMyJobs,
  completeJob,
  getHiredJobs
};
