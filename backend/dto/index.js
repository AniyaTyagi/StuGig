/**
 * Data Transfer Objects Index
 * @module dto
 * @description Central export for all DTOs
 * @version 1.0.0
 */

const userDTO = require('./user.dto');
const jobDTO = require('./job.dto');

module.exports = {
  ...userDTO,
  ...jobDTO
};
