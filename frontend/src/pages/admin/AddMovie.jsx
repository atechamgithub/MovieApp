import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  IconButton,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import api from '../../services/api';

const AddMovie = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rating: '',
    releaseDate: '',
    duration: '',
    director: '',
    poster: '',
    genres: '',
    cast: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Process cast and genres from comma-separated strings to arrays
      const movieData = {
        ...formData,
        rating: parseFloat(formData.rating),
        duration: parseInt(formData.duration),
        genres: formData.genres.split(',').map(s => s.trim()).filter(s => s),
        cast: formData.cast.split(',').map(s => s.trim()).filter(s => s)
      };

      await api.post('/movies', movieData);
      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        rating: '',
        releaseDate: '',
        duration: '',
        director: '',
        poster: '',
        genres: '',
        cast: ''
      });
      setTimeout(() => navigate('/admin/manage'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add movie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ pb: 8 }}>
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        <ArrowBackIcon sx={{ mr: 1 }} /> Back
      </IconButton>

      <Typography variant="h4" component="h1" gutterBottom>
        Add New Movie
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 4 }}>
          Movie added to queue successfully! User redirection...
        </Alert>
      )}

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="title"
                label="Movie Title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                name="rating"
                label="Rating (0-10)"
                inputProps={{ step: 0.1, min: 0, max: 10 }}
                value={formData.rating}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="date"
                name="releaseDate"
                label="Release Date"
                InputLabelProps={{ shrink: true }}
                value={formData.releaseDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                name="duration"
                label="Duration (minutes)"
                value={formData.duration}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="director"
                label="Director"
                value={formData.director}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="poster"
                label="Poster URL"
                value={formData.poster}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="genres"
                label="Genres (comma separated)"
                placeholder="Drama, Action, Sci-Fi"
                value={formData.genres}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="cast"
                label="Cast (comma separated)"
                placeholder="Actor 1, Actor 2, Actor 3"
                value={formData.cast}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? 'Adding...' : 'Add Movie'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddMovie;
