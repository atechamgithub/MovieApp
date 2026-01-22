import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Button,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ManageMovies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Delete dialog state
  const [openDelete, setOpenDelete] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, [page]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/movies?page=${page}&limit=10`);
      setMovies(res.data.movies);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch movies');
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDeleteClick = (movie) => {
    setMovieToDelete(movie);
    setOpenDelete(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await api.delete(`/movies/${movieToDelete._id}`);
      setOpenDelete(false);
      setMovieToDelete(null);
      fetchMovies();
    } catch (err) {
      setError('Failed to delete movie');
    } finally {
      setDeleting(false);
    }
  };

  if (loading && page === 1) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ pb: 8 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Manage Movies
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/admin/add"
        >
          Add Movie
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              <TableCell>Title</TableCell>
              <TableCell align="center">Rating</TableCell>
              <TableCell align="center">Release Date</TableCell>
              <TableCell align="center">Duration</TableCell>
              <TableCell align="center">Director</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies.map((movie) => (
              <TableRow key={movie._id} hover>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                  {movie.title}
                </TableCell>
                <TableCell align="center">{movie.rating}/10</TableCell>
                <TableCell align="center">{new Date(movie.releaseDate).toLocaleDateString()}</TableCell>
                <TableCell align="center">{movie.duration} min</TableCell>
                <TableCell align="center">{movie.director}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    color="primary" 
                    component={RouterLink} 
                    to={`/admin/edit/${movie._id}`}
                    title="Edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDeleteClick(movie)}
                    title="Delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
          />
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDelete}
        onClose={() => !deleting && setOpenDelete(false)}
      >
        <DialogTitle>Delete Movie?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{movieToDelete?.title}</strong>? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageMovies;
