const BaseService = require('./BaseService');
const Job = require('../models/Job');
const AppError = require('../utils/AppError');

class JobService extends BaseService {
  constructor() {
    super(Job);
  }

  async createJob(jobData, clientId) {
    const job = await this.create({
      ...jobData,
      client: clientId
    });
    return job;
  }

  async getJobs(filters, options) {
    const { category, minBudget, maxBudget, search, status, jobType } = filters;
    
    let query = { isDeleted: false };
    if (status) query.status = status;
    else query.status = 'open';
    
    if (category) query.category = category;
    if (jobType) query.jobType = jobType;
    
    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = parseFloat(minBudget);
      if (maxBudget) query.budget.$lte = parseFloat(maxBudget);
    }
    
    if (search) query.$text = { $search: search };

    return await this.findAll(query, {
      ...options,
      populate: 'client',
      sort: '-createdAt'
    });
  }

  async getJobById(jobId) {
    return await this.findById(jobId, [
      { path: 'client', select: 'firstName lastName avatar rating' },
      { path: 'assignedFreelancer', select: 'firstName lastName avatar rating' }
    ]);
  }

  async updateJob(jobId, userId, updateData) {
    const job = await this.findById(jobId);
    
    if (job.client.toString() !== userId.toString()) {
      throw new AppError('Not authorized to update this job', 403);
    }

    Object.assign(job, updateData);
    await job.save();
    return job;
  }

  async deleteJob(jobId, userId) {
    const job = await this.findById(jobId);
    
    if (job.client.toString() !== userId.toString()) {
      throw new AppError('Not authorized to delete this job', 403);
    }

    return await this.softDelete(jobId);
  }

  async getClientJobs(clientId) {
    return await this.findAll(
      { client: clientId, isDeleted: false },
      { populate: 'assignedFreelancer', sort: '-createdAt' }
    );
  }

  async getFreelancerJobs(freelancerId) {
    return await this.findAll(
      { assignedFreelancer: freelancerId, isDeleted: false },
      { populate: 'client', sort: '-updatedAt' }
    );
  }

  async completeJob(jobId, userId) {
    const job = await this.findById(jobId);
    
    if (job.client.toString() !== userId.toString()) {
      throw new AppError('Not authorized to complete this job', 403);
    }

    job.status = 'completed';
    await job.save();
    return job;
  }
}

module.exports = new JobService();
