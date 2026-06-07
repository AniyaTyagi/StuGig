/**
 * AI Service - Intelligent Job Matching & Recommendations
 * @description Advanced AI matchmaker analyzing skills, performance, behavior, and compatibility
 * @version 2.0.0
 */

const User = require('../models/User');
const Job = require('../models/Job');
const Bid = require('../models/Bid');
const Review = require('../models/Review');
const AIMatch = require('../models/AIMatch');

class AIService {
  /**
   * Calculate comprehensive compatibility score between freelancer and job
   * @param {Object} freelancer - Freelancer user object
   * @param {Object} job - Job object
   * @returns {Object} Detailed compatibility analysis
   */
  async calculateCompatibilityScore(freelancer, job) {
    try {
      const scores = {
        skillMatch: await this.calculateSkillMatch(freelancer.skills || [], job.skills || []),
        experienceMatch: this.calculateExperienceMatch(freelancer, job),
        ratingMatch: this.calculateRatingMatch(freelancer.rating, job),
        budgetMatch: await this.calculateBudgetMatch(freelancer, job.budget || 1000),
        availabilityMatch: this.calculateAvailabilityMatch(freelancer, job.deadline),
        successRateMatch: await this.calculateSuccessRate(freelancer._id),
        categoryMatch: await this.calculateCategoryExperience(freelancer._id, job.category),
        behaviorMatch: await this.calculateBehaviorScore(freelancer._id)
      };

      // Weighted average (customizable weights)
      const weights = {
        skillMatch: 0.30,        // 30% - Most important
        experienceMatch: 0.20,   // 20%
        ratingMatch: 0.15,       // 15%
        budgetMatch: 0.10,       // 10%
        successRateMatch: 0.10,  // 10%
        categoryMatch: 0.08,     // 8%
        availabilityMatch: 0.05, // 5%
        behaviorMatch: 0.02      // 2%
      };

      const totalScore = Object.keys(scores).reduce((sum, key) => {
        return sum + (scores[key] * weights[key]);
      }, 0);

      return {
        totalScore: Math.round(totalScore),
        breakdown: scores,
        confidence: this.calculateConfidence(scores),
        recommendation: this.getRecommendationLevel(totalScore)
      };
    } catch (error) {
      console.error('calculateCompatibilityScore error:', error.message);
      return {
        totalScore: 50,
        breakdown: {},
        confidence: 'low',
        recommendation: 'fair'
      };
    }
  }

  /**
   * Calculate skill match percentage
   */
  async calculateSkillMatch(freelancerSkills, jobSkills) {
    if (!jobSkills || jobSkills.length === 0) return 50;
    if (!freelancerSkills || freelancerSkills.length === 0) return 0;

    const normalizedFreelancerSkills = freelancerSkills.map(s => s.toLowerCase().trim());
    const normalizedJobSkills = jobSkills.map(s => s.toLowerCase().trim());

    // Exact matches
    const exactMatches = normalizedJobSkills.filter(jobSkill => 
      normalizedFreelancerSkills.includes(jobSkill)
    ).length;

    // Partial matches (contains)
    const partialMatches = normalizedJobSkills.filter(jobSkill => 
      normalizedFreelancerSkills.some(fSkill => 
        fSkill.includes(jobSkill) || jobSkill.includes(fSkill)
      )
    ).length - exactMatches;

    const exactScore = (exactMatches / normalizedJobSkills.length) * 100;
    const partialScore = (partialMatches / normalizedJobSkills.length) * 50;

    return Math.min(exactScore + partialScore, 100);
  }

  /**
   * Calculate experience match based on completed jobs
   */
  calculateExperienceMatch(freelancer, job) {
    const completedJobs = freelancer.completedJobs || 0;
    
    if (completedJobs === 0) return 30;
    if (completedJobs >= 50) return 100;
    
    return 30 + (completedJobs / 50 * 70);
  }

  /**
   * Calculate rating compatibility
   */
  calculateRatingMatch(freelancerRating, job) {
    if (!freelancerRating) return 50;
    
    // Higher rating = better match
    return (freelancerRating / 5) * 100;
  }

  /**
   * Calculate budget match - freelancer's typical bid vs job budget
   */
  async calculateBudgetMatch(freelancer, jobBudget) {
    try {
      const recentBids = await Bid.find({ 
        freelancer: freelancer._id,
        status: { $in: ['accepted', 'pending'] }
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('amount');

      if (recentBids.length === 0) return 70; // Neutral if no history

      const avgBid = recentBids.reduce((sum, bid) => sum + bid.amount, 0) / recentBids.length;
      const ratio = avgBid / jobBudget;

      // Ideal range: 0.7 to 1.0 (70% to 100% of budget)
      if (ratio >= 0.7 && ratio <= 1.0) return 100;
      if (ratio < 0.7) return 60 + (ratio / 0.7 * 40);
      if (ratio > 1.0 && ratio <= 1.3) return 100 - ((ratio - 1) / 0.3 * 40);
      
      return 50;
    } catch (error) {
      return 70;
    }
  }

  /**
   * Calculate availability match based on deadline
   */
  calculateAvailabilityMatch(freelancer, deadline) {
    const daysUntilDeadline = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline < 3) return 60;  // Tight deadline
    if (daysUntilDeadline < 7) return 80;
    return 100; // Comfortable timeline
  }

  /**
   * Calculate success rate from bid acceptance and job completion
   */
  async calculateSuccessRate(freelancerId) {
    try {
      const totalBids = await Bid.countDocuments({ freelancer: freelancerId });
      if (totalBids === 0) return 50;

      const acceptedBids = await Bid.countDocuments({ 
        freelancer: freelancerId, 
        status: 'accepted' 
      });

      const completedJobs = await Job.countDocuments({ 
        assignedFreelancer: freelancerId, 
        status: 'completed' 
      });

      const acceptanceRate = (acceptedBids / totalBids) * 50;
      const completionRate = acceptedBids > 0 ? (completedJobs / acceptedBids) * 50 : 0;

      return acceptanceRate + completionRate;
    } catch (error) {
      return 50;
    }
  }

  /**
   * Calculate category experience
   */
  async calculateCategoryExperience(freelancerId, jobCategory) {
    try {
      const categoryJobs = await Job.countDocuments({
        assignedFreelancer: freelancerId,
        category: jobCategory,
        status: 'completed'
      });

      if (categoryJobs === 0) return 40;
      if (categoryJobs >= 10) return 100;
      
      return 40 + (categoryJobs / 10 * 60);
    } catch (error) {
      return 50;
    }
  }

  /**
   * Calculate behavior score (responsiveness, reliability)
   */
  async calculateBehaviorScore(freelancerId) {
    try {
      // Check response time, completion rate, client reviews
      const reviews = await Review.find({ 
        reviewee: freelancerId,
        isDeleted: false 
      }).select('rating');

      if (reviews.length === 0) return 70;

      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      return (avgRating / 5) * 100;
    } catch (error) {
      return 70;
    }
  }

  /**
   * Calculate confidence level of the match
   */
  calculateConfidence(scores) {
    const values = Object.values(scores);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    // Lower standard deviation = higher confidence
    if (stdDev < 10) return 'high';
    if (stdDev < 20) return 'medium';
    return 'low';
  }

  /**
   * Get recommendation level
   */
  getRecommendationLevel(score) {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 55) return 'fair';
    return 'poor';
  }

  /**
   * Get AI-recommended jobs for a freelancer
   */
  async getRecommendedJobsForFreelancer(freelancerId, limit = 10) {
    try {
      const freelancer = await User.findById(freelancerId);
      if (!freelancer) return [];

      const openJobs = await Job.find({ 
        status: 'open'
      })
      .populate('client', 'firstName lastName rating')
      .limit(50)
      .lean(); // Use lean for better performance

      if (!openJobs || openJobs.length === 0) return [];

      const recommendations = [];

      for (const job of openJobs) {
        try {
          const compatibility = await this.calculateCompatibilityScore(freelancer, job);
          
          if (compatibility.totalScore >= 50) {
            recommendations.push({
              job,
              compatibility
            });

            // Store in learning database (non-blocking)
            AIMatch.create({
              matchType: 'job_to_freelancer',
              freelancer: freelancerId,
              job: job._id,
              compatibilityScore: compatibility.totalScore,
              scoreBreakdown: compatibility.breakdown
            }).catch(err => console.error('AIMatch save error:', err.message));
          }
        } catch (err) {
          console.error('Compatibility calc error:', err.message);
          continue;
        }
      }

      // Sort by score and return top matches
      return recommendations
        .sort((a, b) => b.compatibility.totalScore - a.compatibility.totalScore)
        .slice(0, limit);
    } catch (error) {
      console.error('getRecommendedJobsForFreelancer error:', error.message);
      return [];
    }
  }

  /**
   * Get AI-recommended freelancers for a job
   */
  async getRecommendedFreelancersForJob(jobId, limit = 10) {
    const job = await Job.findById(jobId).populate('client');
    if (!job) throw new Error('Job not found');

    const freelancers = await User.find({ 
      role: { $in: ['student', 'freelancer'] },
      isActive: true,
      isDeleted: false
    }).limit(100);

    const recommendations = [];

    for (const freelancer of freelancers) {
      const compatibility = await this.calculateCompatibilityScore(freelancer, job);
      
      if (compatibility.totalScore >= 50) {
        recommendations.push({
          freelancer: {
            _id: freelancer._id,
            firstName: freelancer.firstName,
            lastName: freelancer.lastName,
            avatar: freelancer.avatar,
            rating: freelancer.rating,
            skills: freelancer.skills,
            completedJobs: freelancer.completedJobs,
            bio: freelancer.bio
          },
          compatibility
        });

        // Store in learning database
        await AIMatch.create({
          matchType: 'freelancer_to_job',
          freelancer: freelancer._id,
          job: jobId,
          compatibilityScore: compatibility.totalScore,
          scoreBreakdown: compatibility.breakdown
        });
      }
    }

    return recommendations
      .sort((a, b) => b.compatibility.totalScore - a.compatibility.totalScore)
      .slice(0, limit);
  }

  /**
   * Generate intelligent bidding suggestions
   */
  async generateBiddingSuggestions(jobId, freelancerId) {
    const job = await Job.findById(jobId);
    const freelancer = await User.findById(freelancerId);

    if (!job || !freelancer) throw new Error('Job or freelancer not found');

    // Analyze job complexity
    const complexity = this.analyzeJobComplexity(job);
    
    // Get freelancer's bidding history
    const bidHistory = await Bid.find({ 
      freelancer: freelancerId,
      status: 'accepted' 
    }).select('amount deliveryTime').limit(10);

    // Calculate suggested bid
    const suggestedAmount = this.calculateSuggestedBidAmount(job.budget, complexity, bidHistory);
    const suggestedDelivery = this.calculateSuggestedDeliveryTime(job.deadline, complexity);
    
    // Generate AI tips
    const tips = this.generateBiddingTips(job, freelancer, complexity);

    return {
      suggestedAmount,
      suggestedDelivery,
      complexity,
      competitionLevel: await this.assessCompetition(jobId),
      tips,
      winProbability: await this.calculateWinProbability(freelancer, job, suggestedAmount)
    };
  }

  /**
   * Analyze job complexity
   */
  analyzeJobComplexity(job) {
    const descLength = job.description.length;
    const skillCount = job.skills?.length || 0;
    const budget = job.budget;

    let complexityScore = 0;
    
    if (descLength > 500) complexityScore += 30;
    else if (descLength > 200) complexityScore += 20;
    else complexityScore += 10;

    complexityScore += Math.min(skillCount * 10, 40);
    
    if (budget > 5000) complexityScore += 30;
    else if (budget > 2000) complexityScore += 20;
    else complexityScore += 10;

    if (complexityScore >= 70) return 'high';
    if (complexityScore >= 40) return 'medium';
    return 'low';
  }

  /**
   * Calculate suggested bid amount
   */
  calculateSuggestedBidAmount(jobBudget, complexity, bidHistory) {
    const baseMultiplier = {
      low: 0.75,
      medium: 0.85,
      high: 0.92
    };

    let suggestedAmount = jobBudget * baseMultiplier[complexity];

    // Adjust based on freelancer's history
    if (bidHistory.length > 0) {
      const avgHistoricalBid = bidHistory.reduce((sum, bid) => sum + bid.amount, 0) / bidHistory.length;
      suggestedAmount = (suggestedAmount + avgHistoricalBid) / 2;
    }

    return Math.round(suggestedAmount);
  }

  /**
   * Calculate suggested delivery time
   */
  calculateSuggestedDeliveryTime(deadline, complexity) {
    const daysUntilDeadline = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    
    const complexityDays = {
      low: Math.min(3, daysUntilDeadline * 0.5),
      medium: Math.min(7, daysUntilDeadline * 0.7),
      high: Math.min(14, daysUntilDeadline * 0.85)
    };

    return Math.ceil(complexityDays[complexity]);
  }

  /**
   * Generate personalized bidding tips
   */
  generateBiddingTips(job, freelancer, complexity) {
    const tips = [];

    // Skill-based tips
    const matchedSkills = freelancer.skills?.filter(s => 
      job.skills?.some(js => js.toLowerCase() === s.toLowerCase())
    ) || [];

    if (matchedSkills.length >= job.skills?.length * 0.8) {
      tips.push('✨ Your skills are an excellent match! Highlight your expertise in ' + matchedSkills.slice(0, 2).join(' and '));
    }

    // Rating tips
    if (freelancer.rating >= 4.5) {
      tips.push('⭐ Your high rating is a strong advantage. Mention your track record of quality work');
    }

    // Competition tips
    tips.push('💡 Being among the first 3 bidders increases your chances by 35%');

    // Complexity tips
    if (complexity === 'high') {
      tips.push('🎯 This is a complex project. Show your planning approach in the proposal');
    }

    // Pricing tip
    tips.push('💰 Bidding within 10-15% below budget often wins while maintaining value');

    return tips;
  }

  /**
   * Assess competition level
   */
  async assessCompetition(jobId) {
    const bidCount = await Bid.countDocuments({ job: jobId });
    
    if (bidCount >= 20) return 'high';
    if (bidCount >= 10) return 'medium';
    return 'low';
  }

  /**
   * Calculate win probability
   */
  async calculateWinProbability(freelancer, job, bidAmount) {
    let probability = 50;

    // Rating boost
    if (freelancer.rating >= 4.5) probability += 15;
    else if (freelancer.rating >= 4.0) probability += 10;

    // Bid amount (compared to budget)
    const bidRatio = bidAmount / job.budget;
    if (bidRatio <= 0.85) probability += 10;
    else if (bidRatio <= 0.95) probability += 5;
    else if (bidRatio > 1.0) probability -= 10;

    // Experience
    const completedJobs = freelancer.completedJobs || 0;
    if (completedJobs >= 20) probability += 10;
    else if (completedJobs >= 10) probability += 5;

    return Math.min(Math.max(probability, 10), 95);
  }

  /**
   * Update match outcome for learning
   */
  async updateMatchOutcome(matchId, outcome, feedback = {}) {
    await AIMatch.findByIdAndUpdate(matchId, {
      outcome,
      ...feedback,
      updatedAt: new Date()
    });
  }

  /**
   * Get AI accuracy metrics
   */
  async getAccuracyMetrics() {
    return await AIMatch.getAccuracyMetrics();
  }
}

module.exports = new AIService();
