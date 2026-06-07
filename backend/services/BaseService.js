/**
 * Base Service Class
 * @module services/BaseService
 * @description Generic service class with reusable CRUD operations
 * @version 1.0.0
 */

const AppError = require('../utils/AppError');

/**
 * BaseService - Generic service for database operations
 * @class
 */
class BaseService {
  /**
   * Create BaseService instance
   * @param {Model} model - Mongoose model
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * Create a new document
   * @param {Object} data - Document data
   * @returns {Promise<Object>} Created document
   */
  async create(data) {
    const doc = await this.model.create(data);
    return doc;
  }

  /**
   * Find document by ID
   * @param {string} id - Document ID
   * @param {string|Object} populateOptions - Mongoose populate options
   * @returns {Promise<Object>} Found document
   * @throws {AppError} If document not found
   */
  async findById(id, populateOptions = null) {
    let query = this.model.findById(id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;
    if (!doc) throw new AppError('Document not found', 404);
    return doc;
  }

  /**
   * Find one document by filter
   * @param {Object} filter - Query filter
   * @param {string|Object} populateOptions - Mongoose populate options
   * @returns {Promise<Object|null>} Found document or null
   */
  async findOne(filter, populateOptions = null) {
    let query = this.model.findOne(filter);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;
    return doc;
  }

  /**
   * Find all documents with pagination
   * @param {Object} filter - Query filter
   * @param {Object} options - Query options (page, limit, sort, populate)
   * @returns {Promise<Object>} Paginated results with data and pagination info
   */
  async findAll(filter = {}, options = {}) {
    const { page = 1, limit = 12, sort = '-createdAt', populate = null } = options;
    const skip = (page - 1) * limit;

    let query = this.model.find(filter).sort(sort).limit(limit).skip(skip);
    if (populate) query = query.populate(populate);

    const docs = await query;
    const total = await this.model.countDocuments(filter);

    return {
      data: docs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Update document by ID
   * @param {string} id - Document ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>} Updated document
   * @throws {AppError} If document not found
   */
  async update(id, data) {
    const doc = await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
    if (!doc) throw new AppError('Document not found', 404);
    return doc;
  }

  /**
   * Delete document by ID (hard delete)
   * @param {string} id - Document ID
   * @returns {Promise<Object>} Deleted document
   * @throws {AppError} If document not found
   */
  async delete(id) {
    const doc = await this.model.findByIdAndDelete(id);
    if (!doc) throw new AppError('Document not found', 404);
    return doc;
  }

  /**
   * Soft delete document by ID
   * @param {string} id - Document ID
   * @returns {Promise<Object>} Soft deleted document
   * @throws {AppError} If document not found
   */
  async softDelete(id) {
    const doc = await this.model.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!doc) throw new AppError('Document not found', 404);
    return doc;
  }
}

module.exports = BaseService;
