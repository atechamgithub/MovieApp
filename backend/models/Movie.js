const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: [true, 'Movie description is required'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Movie rating is required'],
    min: [0, 'Rating must be at least 0'],
    max: [10, 'Rating cannot exceed 10']
  },
  releaseDate: {
    type: Date,
    required: [true, 'Release date is required']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  director: {
    type: String,
    required: [true, 'Director name is required'],
    trim: true
  },
  cast: [{
    type: String,
    trim: true
  }],
  genres: [{
    type: String,
    trim: true
  }],
  poster: {
    type: String,
    default: 'https://via.placeholder.com/300x450?text=No+Poster'
  },
  imdbRank: {
    type: Number,
    min: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
movieSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create text index for search functionality
movieSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Movie', movieSchema);
