const NGO = require('../models/NGO');

// @desc    Get all NGOs
// @route   GET /api/ngos
// @access  Public
const getNGOs = async (req, res, next) => {
  try {
    const { category, verified } = req.query;
    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (verified !== undefined) {
      query.verified = verified === 'true';
    } else {
      query.verified = true; // Default to verified only for public
    }

    const ngos = await NGO.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: ngos.length,
      data: ngos,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get NGO by ID
// @route   GET /api/ngos/:id
// @access  Public
const getNGOById = async (req, res, next) => {
  try {
    const ngo = await NGO.findById(req.params.id);

    if (!ngo || !ngo.isActive) {
      return res.status(404).json({
        success: false,
        error: 'NGO not found',
      });
    }

    res.status(200).json({
      success: true,
      data: ngo,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get NGO impact stories
// @route   GET /api/ngos/:id/impact
// @access  Public
const getNGOImpact = async (req, res, next) => {
  try {
    const ngo = await NGO.findById(req.params.id).select('impactStories name');

    if (!ngo) {
      return res.status(404).json({
        success: false,
        error: 'NGO not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ngoName: ngo.name,
        impactStories: ngo.impactStories,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get NGO categories
// @route   GET /api/ngos/categories
// @access  Public
const getNGOCategories = async (req, res, next) => {
  try {
    const { NGO_CATEGORIES } = require('../config/constants');

    res.status(200).json({
      success: true,
      data: NGO_CATEGORIES,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register NGO
// @route   POST /api/ngos/register
// @access  Public
const registerNGO = async (req, res, next) => {
  try {
    const ngo = await NGO.create(req.body);

    res.status(201).json({
      success: true,
      data: ngo,
      message: 'NGO registered successfully. Awaiting verification.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNGOs,
  getNGOById,
  getNGOImpact,
  getNGOCategories,
  registerNGO,
};

