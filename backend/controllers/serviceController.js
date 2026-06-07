const Service = require('../models/Service');

// @route   POST /api/services
const createService = async (req, res) => {
  try {
    const service = await Service.create({
      ...req.body,
      freelancer: req.user._id
    });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/services
const getServices = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, sort } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    let query = { isActive: true, isDeleted: false };
    
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }
    
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    
    const services = await Service.find(query)
      .populate('freelancer', 'firstName lastName avatar rating university')
      .sort(sortOption)
      .limit(limit)
      .skip(skip);
    
    const total = await Service.countDocuments(query);
    
    res.json({
      success: true,
      services,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/services/:id
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('freelancer', 'firstName lastName avatar rating reviewCount bio skills university');
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json({ success: true, data: service });
  } catch (error) {
    console.error('Get service by ID error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/services/:id
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    if (service.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    Object.assign(service, req.body);
    await service.save();
    
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/services/:id
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    if (service.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    service.isDeleted = true;
    await service.save();
    
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/services/freelancer/:id
const getFreelancerServices = async (req, res) => {
  try {
    const services = await Service.find({ 
      freelancer: req.params.id, 
      isDeleted: false 
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  createService, 
  getServices, 
  getServiceById, 
  updateService, 
  deleteService,
  getFreelancerServices 
};
