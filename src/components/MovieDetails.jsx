import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles';

const API_KEY = import.meta.env.VITE_API_KEY?.trim();
const MOBILE_BREAKPOINT = 768;
const MISSING_API_KEY_MESSAGE = 'Missing TMDB API key. Add VITE_API_KEY in .env and restart dev server.';

const formatCurrency = (value) => {
  if (typeof value !== 'number' || value <= 0) return 'Not available';
  return `$${value.toLocaleString()}`;
};

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = React.useState(null);
  const [similarMovies, setSimilarMovies] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [isMobile, setIsMobile] = React.useState(
    () => typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT,
  );

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    const fetchMovieAndSimilar = async () => {
      setLoading(true);
      setError(null);

      if (!API_KEY) {
        setMovie(null);
        setSimilarMovies([]);
        setError(MISSING_API_KEY_MESSAGE);
        setLoading(false);
        return;
      }

      try {
        const [movieRes, similarRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}`),
        ]);

        if (!movieRes.ok) {
          const movieError = await movieRes.json().catch(() => ({}));
          throw new Error(movieError.status_message || 'Movie not found');
        }

        const movieData = await movieRes.json();
        setMovie(movieData);

        if (similarRes.ok) {
          const similarData = await similarRes.json();
          setSimilarMovies((similarData.results || []).slice(0, 10));
        } else {
          setSimilarMovies([]);
        }
      } catch (error) {
        setMovie(null);
        setSimilarMovies([]);
        setError(error instanceof Error ? error.message : 'Could not load movie.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndSimilar();
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          color: '#fff',
          padding: 40,
          minHeight: '100vh',
          background: 'linear-gradient(120deg, #232526, #414345)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  if (error) return <div style={{ color: '#fff', padding: 40 }}><p>{error}</p></div>;
  if (!movie) return null;

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const genreNames = movie.genres?.map((genre) => genre.name).filter(Boolean) ?? [];

  const detailFacts = [
    { label: 'Release date', value: movie.release_date || 'Not available' },
    { label: 'Runtime', value: movie.runtime ? `${movie.runtime} min` : 'Not available' },
    { label: 'Status', value: movie.status || 'Not available' },
    { label: 'Budget', value: formatCurrency(movie.budget) },
    { label: 'Revenue', value: formatCurrency(movie.revenue) },
    { label: 'Adult content', value: movie.adult ? 'Yes' : 'No' },
  ];

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflowX: 'hidden',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {backdropUrl && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 0,
            backgroundImage: `url(${backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: isMobile ? 'blur(10px) brightness(0.45)' : 'blur(18px) brightness(0.5)',
            transform: 'scale(1.08)',
          }}
        />
      )}

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: isMobile ? '100dvh' : '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: isMobile ? 'flex-start' : 'center',
          padding: isMobile ? '10px 10px 12px' : '60px 16px 40px',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            ...styles.button,
            marginBottom: isMobile ? 8 : 24,
            alignSelf: isMobile ? 'flex-start' : 'center',
            background: 'rgba(15, 23, 42, 0.78)',
            color: '#fff',
            border: '1px solid #f87171',
            fontWeight: 700,
            fontSize: isMobile ? '0.88rem' : '1.05rem',
            padding: isMobile ? '6px 12px' : '10px 18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            backdropFilter: 'blur(2px)',
          }}
        >
          ← Back
        </button>

        <div
          style={{
            width: '100%',
            maxWidth: 980,
            height: 'auto',
            overflowY: 'visible',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            paddingBottom: isMobile ? 14 : 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 12 : 42,
              background: 'linear-gradient(165deg, rgba(7, 13, 28, 0.95), rgba(15, 23, 42, 0.9))',
              borderRadius: isMobile ? 16 : 24,
              boxShadow: isMobile ? '0 10px 24px rgba(0,0,0,0.38)' : '0 8px 32px rgba(0,0,0,0.35)',
              padding: isMobile ? '11px 10px 12px' : 36,
              width: '100%',
              alignItems: isMobile ? 'stretch' : 'flex-start',
              animation: 'fadeIn 0.7s cubic-bezier(.4,0,.2,1)',
              border: '1px solid rgba(148, 163, 184, 0.26)',
              backdropFilter: 'blur(4px)',
            }}
          >
          <img
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/400x600?text=No+Image'}
            alt={movie.title}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = 'https://via.placeholder.com/400x600?text=No+Image';
            }}
            style={{
              borderRadius: isMobile ? 14 : 18,
              boxShadow: '0 6px 24px rgba(0,0,0,0.32)',
              width: isMobile ? 'min(78vw, 280px)' : 320,
              maxWidth: '100%',
              aspectRatio: '2 / 3',
              objectFit: 'cover',
              alignSelf: 'center',
              border: '1px solid rgba(148, 163, 184, 0.3)',
            }}
          />

          <div style={{ flex: 1, color: '#fff', minWidth: 0, width: '100%' }}>
            <h2
              style={{
                fontSize: isMobile ? '1.4rem' : '2.6rem',
                margin: '0 0 6px',
                fontWeight: 800,
                letterSpacing: 0.5,
                lineHeight: 1.1,
              }}
            >
              {movie.title}
            </h2>

            {movie.tagline && (
              <p style={{ margin: '0 0 10px', color: '#93c5fd', fontStyle: 'italic', fontSize: isMobile ? '0.82rem' : '1rem' }}>
                “{movie.tagline}”
              </p>
            )}

            <div
              style={{
                margin: '0 0 10px',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'stretch' : 'center',
                gap: 8,
              }}
            >
              <p
                style={{
                  color: '#fecaca',
                  fontWeight: 800,
                  fontSize: isMobile ? '0.9rem' : '1.1rem',
                  margin: 0,
                  borderRadius: 999,
                  border: '1px solid rgba(248, 113, 113, 0.55)',
                  background: 'rgba(127, 29, 29, 0.36)',
                  padding: isMobile ? '6px 10px' : '7px 12px',
                  display: 'inline-flex',
                  width: 'fit-content',
                }}
              >
                ⭐ {movie.vote_average} / 10
              </p>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span
                  style={{
                    borderRadius: 999,
                    border: '1px solid rgba(148, 163, 184, 0.38)',
                    background: 'rgba(15, 23, 42, 0.82)',
                    color: '#e2e8f0',
                    fontSize: isMobile ? '0.68rem' : '0.78rem',
                    padding: isMobile ? '4px 8px' : '5px 10px',
                    fontWeight: 700,
                  }}
                >
                  📅 {movie.release_date || 'Unknown'}
                </span>
                <span
                  style={{
                    borderRadius: 999,
                    border: '1px solid rgba(148, 163, 184, 0.38)',
                    background: 'rgba(15, 23, 42, 0.82)',
                    color: '#e2e8f0',
                    fontSize: isMobile ? '0.68rem' : '0.78rem',
                    padding: isMobile ? '4px 8px' : '5px 10px',
                    fontWeight: 700,
                  }}
                >
                  ⏱ {movie.runtime ? `${movie.runtime} min` : 'Runtime n/a'}
                </span>
              </div>
            </div>

            <div
              style={{
                margin: '0 0 10px',
                padding: isMobile ? '8px 9px' : '10px 12px',
                borderRadius: 12,
                border: '1px solid rgba(96, 165, 250, 0.45)',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 64, 175, 0.22))',
              }}
            >
              <p style={{ margin: 0, color: '#93c5fd', fontSize: isMobile ? '0.62rem' : '0.7rem', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                Genres
              </p>
              <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {genreNames.length ? genreNames.map((genre) => (
                  <span
                    key={genre}
                    style={{
                      borderRadius: 999,
                      padding: isMobile ? '4px 8px' : '5px 10px',
                      fontSize: isMobile ? '0.66rem' : '0.75rem',
                      fontWeight: 700,
                      color: '#e0f2fe',
                      border: '1px solid rgba(125, 211, 252, 0.5)',
                      background: 'rgba(8, 47, 73, 0.55)',
                    }}
                  >
                    {genre}
                  </span>
                )) : (
                  <span style={{ color: '#e2e8f0', fontSize: isMobile ? '0.74rem' : '0.84rem' }}>Not available</span>
                )}
              </div>
            </div>

            <section
              style={{
                marginTop: 8,
                padding: isMobile ? '9px 10px' : '12px 14px',
                borderRadius: 12,
                border: '1px solid rgba(148, 163, 184, 0.25)',
                background: 'rgba(15, 23, 42, 0.62)',
              }}
            >
              <p style={{ margin: 0, color: '#93c5fd', fontSize: isMobile ? '0.64rem' : '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 800 }}>
                Overview
              </p>
              <p
                style={{
                  lineHeight: isMobile ? 1.48 : 1.7,
                  fontSize: isMobile ? '0.8rem' : '1.02rem',
                  color: '#f8fafc',
                  margin: '6px 0 0',
                }}
              >
                {movie.overview || 'No overview available.'}
              </p>
            </section>

            <section
              style={{
                marginTop: isMobile ? 12 : 16,
                borderRadius: 14,
                border: '1px solid rgba(56, 189, 248, 0.28)',
                background: 'linear-gradient(155deg, rgba(10, 18, 34, 0.96), rgba(15, 23, 42, 0.86))',
                padding: isMobile ? '10px' : '14px',
                boxShadow: '0 12px 28px rgba(2, 6, 23, 0.32)',
              }}
            >
              <p
                style={{
                  margin: '0 0 10px',
                  color: '#bae6fd',
                  fontSize: isMobile ? '0.68rem' : '0.76rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Movie Facts
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: isMobile ? 7 : 10,
                }}
              >
                {detailFacts.map((fact) => (
                  <article
                    key={fact.label}
                    style={{
                      borderRadius: 12,
                      border: '1px solid rgba(148, 163, 184, 0.24)',
                      background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.72), rgba(15, 23, 42, 0.92))',
                      padding: isMobile ? '9px 10px' : '11px 12px',
                      boxShadow: 'inset 0 1px 0 rgba(148, 163, 184, 0.22), 0 8px 14px rgba(2, 6, 23, 0.26)',
                    }}
                  >
                    <p style={{ margin: 0, color: '#7dd3fc', fontSize: isMobile ? '0.58rem' : '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 800 }}>
                      {fact.label}
                    </p>
                    <p style={{ margin: '5px 0 0', color: '#f8fafc', fontSize: isMobile ? '0.74rem' : '0.9rem', lineHeight: 1.35, fontWeight: 650 }}>
                      {fact.value}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {(movie.homepage || movie.imdb_id) && (
              <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {movie.homepage && (
                  <a
                    href={movie.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#7dd3fc',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: isMobile ? '0.7rem' : '0.9rem',
                      borderRadius: 999,
                      border: '1px solid rgba(125, 211, 252, 0.45)',
                      background: 'rgba(8, 47, 73, 0.45)',
                      padding: isMobile ? '6px 10px' : '7px 12px',
                    }}
                  >
                    Official Website
                  </a>
                )}
                {movie.imdb_id && (
                  <a
                    href={`https://www.imdb.com/title/${movie.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#fcd34d',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: isMobile ? '0.7rem' : '0.9rem',
                      borderRadius: 999,
                      border: '1px solid rgba(250, 204, 21, 0.5)',
                      background: 'rgba(113, 63, 18, 0.4)',
                      padding: isMobile ? '6px 10px' : '7px 12px',
                    }}
                  >
                    IMDb Page
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

          <section
            style={{
              width: '100%',
              marginTop: 0,
              background: 'rgba(8, 12, 24, 0.88)',
              borderRadius: 14,
              border: '1px solid rgba(148, 163, 184, 0.18)',
              padding: isMobile ? '10px 10px 16px' : '16px 18px 20px',
              animation: 'fadeIn 0.8s cubic-bezier(.4,0,.2,1)',
            }}
          >
          <h3 style={{ margin: '0 0 10px', fontSize: isMobile ? '0.95rem' : '1.25rem', color: '#f8fafc' }}>
            Similar movies
          </h3>

          {similarMovies.length ? (
            <div
              style={{
                display: 'grid',
                gap: isMobile ? 8 : 10,
                gridAutoFlow: isMobile ? 'column' : 'row',
                gridTemplateRows: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'none',
                gridAutoColumns: isMobile ? 'minmax(110px, 1fr)' : '132px',
                gridTemplateColumns: isMobile ? 'none' : 'repeat(auto-fit, minmax(132px, 1fr))',
                overflowX: isMobile ? 'auto' : 'visible',
                paddingBottom: isMobile ? 10 : 6,
              }}
            >
              {similarMovies.map((similar) => (
                <button
                  key={similar.id}
                  type="button"
                  onClick={() => {
                    navigate(`/movie/${similar.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    minWidth: 0,
                    width: '100%',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: 10,
                    background: 'rgba(15, 23, 42, 0.95)',
                    padding: 6,
                    textAlign: 'left',
                    color: '#e2e8f0',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={similar.poster_path ? `https://image.tmdb.org/t/p/w200${similar.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image'}
                    alt={similar.title}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = 'https://via.placeholder.com/200x300?text=No+Image';
                    }}
                    style={{ width: '100%', borderRadius: 8, aspectRatio: '2/3', objectFit: 'cover', marginBottom: 6 }}
                  />
                  <p
                    style={{
                      margin: '0 0 3px',
                      fontSize: isMobile ? '0.64rem' : '0.75rem',
                      fontWeight: 700,
                      lineHeight: 1.25,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {similar.title}
                  </p>
                  <p style={{ margin: 0, fontSize: isMobile ? '0.6rem' : '0.72rem', color: '#fca5a5' }}>
                    ⭐ {similar.vote_average}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, color: '#94a3b8', fontSize: isMobile ? '0.78rem' : '0.92rem' }}>
              No similar movies found.
            </p>
          )}
          </section>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MovieDetails;
