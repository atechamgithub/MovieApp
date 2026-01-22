import React, { useState, useEffect } from 'react';
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
  CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import api from '../../services/api';

const EditMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await api.get(`/movies/${id}`);
        const movie = res.data.movie;
        
        // Format date for input field (YYYY-MM-DD)
        const date = movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : '';
        
        setFormData({
          title: movie.title || '',
          description: movie.description || '',
          rating: movie.rating || '',
          releaseDate: date,
          duration: movie.duration || '',
          director: movie.director || '',
          poster: movie.poster || '',
          genres: movie.genres ? movie.genres.join(', ') : '',
          cast: movie.cast ? movie.cast.join(', ') : ''
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch movie details');
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const movieData = {
        ...formData,
        rating: parseFloat(formData.rating),
        duration: parseInt(formData.duration),
        genres: formData.genres.split(',').map(s => s.trim()).filter(s => s),
        cast: formData.cast.split(',').map(s => s.trim()).filter(s => s)
      };

      await api.put(`/movies/${id}`, movieData);
      setSuccess(true);
      setTimeout(() => navigate('/admin/manage'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update movie');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ pb: 8 }}>
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        <ArrowBackIcon sx={{ mr: 1 }} /> Back
      </IconButton>

      <Typography variant="h4" component="h1" gutterBottom>
        Edit Movie: {formData.title}
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 4 }}>
          Movie updated successfully! Redirecting...
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
                value={formData.genres}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="cast"
                label="Cast (comma separated)"
                value={formData.cast}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                disabled={saving}
                sx={{ mt: 2 }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditMovie;
