import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Paper, 
  Rating, 
  Chip, 
  Divider,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../services/api';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await api.get(`/movies/${id}`);
        setMovie(res.data.movie);
        setLoading(false);
      } catch (err) {
        setError('Movie not found');
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box mt={2}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon /> Back
          </IconButton>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pb: 8 }}>
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        <ArrowBackIcon sx={{ mr: 1 }} /> Back
      </IconButton>
      
      <Paper elevation={0} sx={{ p: 0, overflow: 'hidden', backgroundColor: 'transparent' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={movie.poster || 'https://via.placeholder.com/300x450?text=No+Poster'}
              alt={movie.title}
              sx={{
                width: '100%',
                borderRadius: 2,
                boxShadow: 10
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Box>
              <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                {movie.title}
              </Typography>
              
              <Box display="flex" alignItems="center" gap={2} mb={3} flexWrap="wrap">
                <Box display="flex" alignItems="center">
                  <Rating value={movie.rating / 2} precision={0.5} readOnly size="large" />
                  <Typography variant="h5" color="text.secondary" ml={1}>
                    {movie.rating}
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Typography variant="h6" color="text.secondary">
                  {new Date(movie.releaseDate).getFullYear()}
                </Typography>
                <Divider orientation="vertical" flexItem />
                <Typography variant="h6" color="text.secondary">
                  {movie.duration} min
                </Typography>
                {movie.imdbRank && (
                  <>
                    <Divider orientation="vertical" flexItem />
                    <Chip label={`Top 250: #${movie.imdbRank}`} color="primary" />
                  </>
                )}
              </Box>

              <Box mb={4}>
                {movie.genres?.map((genre) => (
                  <Chip key={genre} label={genre} sx={{ mr: 1, mb: 1 }} />
                ))}
              </Box>

              <Typography variant="h5" gutterBottom>
                Overview
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                {movie.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="overline" color="text.secondary">
                    Director
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {movie.director}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Typography variant="overline" color="text.secondary">
                    Cast
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {movie.cast?.join(', ')}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default MovieDetails;
