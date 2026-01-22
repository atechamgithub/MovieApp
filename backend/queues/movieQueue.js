const Movie = require('../models/Movie');

/**
 * Simple in-memory queue implementation without Redis
 * This provides lazy insertion of movie data
 */
class MovieQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.jobIdCounter = 0;
  }

  /**
   * Add a movie to the queue for insertion
   * @param {Object} movieData - Movie data to insert
   * @returns {String} Job ID
   */
  async addMovie(movieData) {
    const jobId = `job_${++this.jobIdCounter}_${Date.now()}`;
    
    this.queue.push({
      id: jobId,
      data: movieData,
      timestamp: Date.now(),
      status: 'pending'
    });

    console.log(`[MovieQueue] Added job ${jobId} to queue. Queue size: ${this.queue.length}`);

    // Start processing if not already processing
    if (!this.processing) {
      this.processQueue();
    }

    return jobId;
  }

  /**
   * Process the queue
   */
  async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    console.log('[MovieQueue] Starting queue processing...');

    while (this.queue.length > 0) {
      const job = this.queue.shift();
      
      try {
        console.log(`[MovieQueue] Processing job ${job.id}...`);
        job.status = 'processing';

        // Insert movie into database
        const movie = await Movie.create(job.data);
        
        job.status = 'completed';
        console.log(`[MovieQueue] Job ${job.id} completed. Movie "${movie.title}" added to database.`);
        
      } catch (error) {
        job.status = 'failed';
        console.error(`[MovieQueue] Job ${job.id} failed:`, error.message);
        
        // Optionally: Add retry logic here
        // For now, we just log the error and continue
      }

      // Add a small delay to simulate distributed processing
      // and prevent overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.processing = false;
    console.log('[MovieQueue] Queue processing completed.');
  }

  /**
   * Get queue status
   */
  getStatus() {
    return {
      queueSize: this.queue.length,
      processing: this.processing,
      pendingJobs: this.queue.filter(j => j.status === 'pending').length
    };
  }
}

// Create singleton instance
const movieQueue = new MovieQueue();

module.exports = movieQueue;
