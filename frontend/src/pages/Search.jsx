import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import api from '../services/api';
import MovieCard from '../components/MovieCard';

const Search = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setMovies([]);
      setTotalPages(1);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, page]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/movies/search?q=${query}&page=${page}`);
      setMovies(res.data.movies);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError('Search failed. Please try again.');
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container maxWidth="xl" sx={{ pb: 8 }}>
      <Typography variant="h4" component="h1" mb={4}>
        Search Movies
      </Typography>

      <Box width="100%" maxWidth={600} mx="auto" mb={6}>
        <TextField
          fullWidth
          placeholder="Search by name or description..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {movies.length > 0 ? (
            <>
              <Typography variant="subtitle1" color="text.secondary" mb={3}>
                Found {movies.length} results for "{query}"
              </Typography>
              <Grid container spacing={3}>
                {movies.map((movie) => (
                  <Grid item key={movie._id} xs={12} sm={6} md={4} lg={3} xl={2.4}>
                    <MovieCard movie={movie} />
                  </Grid>
                ))}
              </Grid>
              
              {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={6}>
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handlePageChange} 
                    color="primary" 
                    size="large"
                  />
                </Box>
              )}
            </>
          ) : query.trim() ? (
            <Box textAlign="center" mt={10}>
              <Typography variant="h6" color="text.secondary">
                No movies found matching "{query}"
              </Typography>
            </Box>
          ) : (
            <Box textAlign="center" mt={10}>
              <Typography variant="h6" color="text.secondary">
                Enter a movie title or description to start searching
              </Typography>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Search;
