import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Rating, CardActionArea } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={RouterLink} to={`/movie/${movie._id}`}>
        <CardMedia
          component="img"
          height="400"
          image={movie.poster || 'https://via.placeholder.com/300x450?text=No+Poster'}
          alt={movie.title}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="h2" noWrap>
            {movie.title}
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <Rating value={movie.rating / 2} precision={0.5} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" ml={1}>
              {movie.rating}/10
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {new Date(movie.releaseDate).getFullYear()} • {movie.duration} min
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MovieCard;
