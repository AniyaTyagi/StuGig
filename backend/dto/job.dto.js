/**
 * Job Data Transfer Objects
 * @module dto/job
 * @description Standardized response formats for job data
 * @version 1.0.0
 */

const { userListDTO } = require('./user.dto');

/**
 * Job Response DTO - Standard job data for API responses
 * @param {Object} job - Mongoose job document
 * @returns {Object} Sanitized job data
 */
const jobResponseDTO = (job) => {
  if (!job) return null;
  
  return {
    id: job._id,
    title: job.title,
    description: job.description,
    category: job.category,
    budget: job.budget,
    jobType: job.jobType,
    deadline: job.deadline,
    skills: job.skills || [],
    status: job.status,
    bidsCount: job.bidsCount || 0,
    client: job.client ? userListDTO(job.client) : null,
    assignedFreelancer: job.assignedFreelancer ? userListDTO(job.assignedFreelancer) : null,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt
  };
};

/**
 * Job Detail DTO - Detailed job data with attachments
 * @param {Object} job - Mongoose job document
 * @returns {Object} Detailed job data
 */
const jobDetailDTO = (job) => {
  if (!job) return null;
  
  return {
    ...jobResponseDTO(job),
    attachments: job.attachments || [],
    acceptedBid: job.acceptedBid,
    payment: job.payment
  };
};

/**
 * Job List DTO - Minimal job data for list views
 * @param {Object} job - Mongoose job document
 * @returns {Object} Minimal job data
 */
const jobListDTO = (job) => {
  if (!job) return null;
  
  return {
    id: job._id,
    title: job.title,
    category: job.category,
    budget: job.budget,
    jobType: job.jobType,
    status: job.status,
    bidsCount: job.bidsCount || 0,
    skills: job.skills?.slice(0, 3) || [],
    createdAt: job.createdAt
  };
};

module.exports = {
  jobResponseDTO,
  jobDetailDTO,
  jobListDTO
};
