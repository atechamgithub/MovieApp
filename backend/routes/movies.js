const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Movie = require('../models/Movie');
const { protect, requireAdmin } = require('../middleware/auth');
const movieQueue = require('../queues/movieQueue');

// @route   GET /api/movies
// @desc    Get all movies with pagination
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const movies = await Movie.find()
      .sort({ imdbRank: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Movie.countDocuments();

    res.status(200).json({
      success: true,
      count: movies.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      movies
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/movies/sorted
// @desc    Get sorted movies
// @access  Public
router.get('/sorted', async (req, res, next) => {
  try {
    const { sortBy = 'imdbRank', order = 'asc' } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Validate sortBy field
    const validSortFields = ['title', 'rating', 'releaseDate', 'duration', 'imdbRank'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'imdbRank';
    const sortOrder = order === 'desc' ? -1 : 1;

    const movies = await Movie.find()
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await Movie.countDocuments();

    res.status(200).json({
      success: true,
      count: movies.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      sortedBy: sortField,
      order: order,
      movies
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/movies/search
// @desc    Search movies by name or description
// @access  Public
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Search using text index or regex
    const searchQuery = {
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { director: { $regex: q, $options: 'i' } }
      ]
    };

    const movies = await Movie.find(searchQuery)
      .skip(skip)
      .limit(limit);

    const total = await Movie.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      count: movies.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      searchQuery: q,
      movies
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/movies/:id
// @desc    Get single movie by ID
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.status(200).json({
      success: true,
      movie
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/movies
// @desc    Add a new movie (with queue for lazy insertion)
// @access  Private/Admin
router.post('/', [
  protect,
  requireAdmin,
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('rating').isFloat({ min: 0, max: 10 }).withMessage('Rating must be between 0 and 10'),
  body('releaseDate').isISO8601().withMessage('Valid release date is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 minute'),
  body('director').notEmpty().withMessage('Director is required')
], async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Add movie to queue for lazy insertion
    const jobId = await movieQueue.addMovie(req.body);

    res.status(202).json({
      success: true,
      message: 'Movie is being added to the database',
      jobId
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/movies/:id
// @desc    Update movie
// @access  Private/Admin
router.put('/:id', [
  protect,
  requireAdmin
], async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      movie
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/movies/:id
// @desc    Delete movie
// @access  Private/Admin
router.delete('/:id', [
  protect,
  requireAdmin
], async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
