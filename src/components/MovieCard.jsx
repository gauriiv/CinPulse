import React from 'react';
import styles from '../styles';

const MovieCard = ({ movie, onClick, compact = false }) => (
  <div
    style={{
      ...styles.card,
      ...(compact ? styles.cardCompact : {}),
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
    onClick={onClick}
    tabIndex={0}
    aria-label={`View details for ${movie.title}`}
    onKeyDown={(e) => e.key === 'Enter' && onClick()}
  >
    <img
      src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image'}
      alt={movie.title}
      style={{ ...styles.image, ...(compact ? styles.imageCompact : {}) }}
    />
    <h3 style={{ ...styles.movieTitle, ...(compact ? styles.movieTitleCompact : {}) }}>{movie.title}</h3>
    <p style={{ ...styles.rating, ...(compact ? styles.ratingCompact : {}) }}>⭐ {movie.vote_average}</p>
  </div>
);

export default MovieCard;
