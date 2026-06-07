/**
 * User Data Transfer Objects
 * @module dto/user
 * @description Standardized response formats for user data
 * @version 1.0.0
 */

/**
 * User Response DTO - Sanitized user data for API responses
 * @param {Object} user - Mongoose user document
 * @returns {Object} Sanitized user data
 */
const userResponseDTO = (user) => {
  if (!user) return null;
  
  return {
    id: user._id,
    firstName: user.firstName,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    bio: user.bio,
    skills: user.skills || [],
    university: user.university,
    rating: user.rating || 0,
    reviewCount: user.reviewCount || 0,
    isVerified: user.isVerified || false,
    createdAt: user.createdAt
  };
};

/**
 * User Profile DTO - Detailed user profile data
 * @param {Object} user - Mongoose user document
 * @returns {Object} Detailed user profile
 */
const userProfileDTO = (user) => {
  if (!user) return null;
  
  return {
    ...userResponseDTO(user),
    portfolio: user.portfolio || [],
    hourlyRate: user.hourlyRate,
    location: user.location,
    earnings: user.earnings || 0,
    spending: user.spending || 0,
    balance: user.balance || 0,
    completedJobs: user.completedJobs || 0,
    lastActive: user.lastActive
  };
};

/**
 * User List DTO - Minimal user data for list views
 * @param {Object} user - Mongoose user document
 * @returns {Object} Minimal user data
 */
const userListDTO = (user) => {
  if (!user) return null;
  
  return {
    id: user._id,
    firstName: user.firstName,
    avatar: user.avatar,
    role: user.role,
    rating: user.rating || 0,
    skills: user.skills?.slice(0, 3) || []
  };
};

/**
 * Auth Response DTO - User data with token
 * @param {Object} user - Mongoose user document
 * @param {string} token - JWT token
 * @returns {Object} Auth response with user and token
 */
const authResponseDTO = (user, token) => {
  return {
    user: userResponseDTO(user),
    token
  };
};

module.exports = {
  userResponseDTO,
  userProfileDTO,
  userListDTO,
  authResponseDTO
};
